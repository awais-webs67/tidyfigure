<?php
// Looks up a YouTube channel's public statistics with the server's API key (set in the admin panel).
// GET /api/youtube.php?channel=@handle | UC… channel ID | channel URL
declare(strict_types=1);
define('TF_BASE', rtrim(str_replace('\\', '/', dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/'))), '/'));
require __DIR__ . '/../app/bootstrap.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function out(array $data, int $code = 200): never
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$key = tf_settings()['youtube_api_key'];
if ($key === '') out(['error' => 'The site owner hasn’t added a YouTube API key yet.'], 503);

$q = trim((string) ($_GET['channel'] ?? ''));
// Accept full URLs: youtube.com/@name, youtube.com/channel/UC…
if (preg_match('~youtube\.com/(?:channel/(UC[\w-]{22})|(@[\w.\-]+))~i', $q, $m)) $q = $m[1] ?: $m[2];
if (preg_match('/^UC[\w-]{22}$/', $q)) $param = 'id=' . $q;
elseif (preg_match('/^@?[\w.\-]{3,100}$/', $q)) $param = 'forHandle=' . rawurlencode(ltrim($q, '@'));
else out(['error' => 'Enter a channel handle like @MrBeast, a channel ID starting with UC, or a channel link.'], 400);

// Answers are cached in MySQL for 60 seconds per channel to save API quota.
$db = tf_db();
$ck = md5(strtolower($param));
if ($db) {
    $st = $db->prepare('SELECT body FROM ' . tf_table('yt_cache') . ' WHERE cache_key = ? AND fetched_at > ?');
    $st->execute([$ck, time() - 60]);
    if ($body = $st->fetchColumn()) { echo $body; exit; }
}

$url = 'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&' . $param . '&key=' . rawurlencode($key);
$ctx = stream_context_create(['http' => ['timeout' => 8, 'ignore_errors' => true]]);
$raw = @file_get_contents($url, false, $ctx);
if ($raw === false) out(['error' => 'Couldn’t reach YouTube. Try again in a moment.'], 502);
$res = json_decode($raw, true);
if (!empty($res['error'])) out(['error' => 'YouTube rejected the request (' . ($res['error']['message'] ?? 'unknown error') . ').'], 502);
$ch = $res['items'][0] ?? null;
if (!$ch) out(['error' => 'No channel found with that name.'], 404);

$json = json_encode([
    'id' => $ch['id'],
    'title' => $ch['snippet']['title'] ?? '',
    'handle' => $ch['snippet']['customUrl'] ?? '',
    'thumb' => $ch['snippet']['thumbnails']['medium']['url'] ?? ($ch['snippet']['thumbnails']['default']['url'] ?? ''),
    'subs' => isset($ch['statistics']['subscriberCount']) ? (int) $ch['statistics']['subscriberCount'] : null,
    'hidden' => !empty($ch['statistics']['hiddenSubscriberCount']),
    'views' => (int) ($ch['statistics']['viewCount'] ?? 0),
    'videos' => (int) ($ch['statistics']['videoCount'] ?? 0),
    'time' => time(),
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($db) {
    $db->prepare('REPLACE INTO ' . tf_table('yt_cache') . ' (cache_key, body, fetched_at) VALUES (?, ?, ?)')->execute([$ck, $json, time()]);
    if (random_int(1, 50) === 1) $db->prepare('DELETE FROM ' . tf_table('yt_cache') . ' WHERE fetched_at < ?')->execute([time() - 86400]);
}
echo $json;
