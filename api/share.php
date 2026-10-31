<?php
// JSON API for share pages (friendship quiz, giveaway, wedding invitation): create, get/update/delete with the
// secret code, and the visitor actions (quiz answers, giveaway entries, RSVPs). See app/share.php.
declare(strict_types=1);
define('TF_BASE', rtrim(str_replace('\\', '/', dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/'))), '/'));
require __DIR__ . '/../app/bootstrap.php';
require __DIR__ . '/../app/share.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

function out(array $data, int $code = 200): never
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') out(['error' => 'Use POST.'], 405);
// Only accept requests from this site's own pages.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && strcasecmp(rtrim($origin, '/'), preg_replace('~^(https?://[^/]+).*$~', '$1', tf_base_url())) !== 0) out(['error' => 'Not allowed.'], 403);
$db = tf_db();
if (!$db) out(['error' => 'This needs the site’s database. The site owner should finish setup at /install/.'], 503);
tf_migrate();
$s = tf_settings();
$action = (string) ($_POST['action'] ?? '');
$json = fn(string $k) => json_decode((string) ($_POST[$k] ?? ''), true);

// ---------- making a new page ----------
if ($action === 'create') {
    if ($s['share_enabled'] !== '1') out(['error' => 'Making new pages is switched off on this site right now.'], 403);
    tf_share_cleanup();
    $type = (string) ($_POST['type'] ?? '');
    if (!isset(TF_SHARE_TYPES[$type])) out(['error' => 'Unknown type.'], 400);
    $ip = tf_share_ip();
    $st = $db->prepare('SELECT COUNT(*) FROM ' . tf_table('shares') . ' WHERE ip_hash = ? AND created_at > ?');
    $st->execute([$ip, time() - 3600]);
    if ((int) $st->fetchColumn() >= max(1, (int) $s['share_per_hour'])) out(['error' => 'You’ve made a lot of pages in the last hour. Please try again later.'], 429);
    $c = tf_share_clean($type, (array) ($json('data') ?: []));
    if (is_string($c)) out(['error' => $c], 400);
    [$data, $title, $expires] = $c;
    $image = '';
    if (in_array($type, ['giveaway', 'wedding'], true) && !empty($_FILES['image']['name'])) {
        $image = tf_share_store_image($_FILES['image']);
        if (!str_contains($image, '/')) out(['error' => $image], 400);
    }
    $key = tf_share_new_key();
    $code = tf_share_new_code();
    $now = time();
    $db->prepare('INSERT INTO ' . tf_table('shares') . ' (code, type, title, data, image, manage_hash, ip_hash, created_at, updated_at, expires_at) VALUES (?,?,?,?,?,?,?,?,?,?)')
        ->execute([$code, $type, mb_substr($title, 0, 200), json_encode($data, JSON_UNESCAPED_UNICODE), $image, tf_share_key_hash($key), $ip, $now, $now, $expires]);
    $r = tf_share_find($code);
    out(['code' => $code, 'url' => tf_share_url($r), 'key' => $key, 'manage' => tf_share_url($r) . '/manage?k=' . $key, 'title' => $r['title'], 'expires' => $expires]);
}

$r = tf_share_find((string) ($_POST['code'] ?? ''));
if (!$r) out(['error' => 'This page doesn’t exist any more. It may have expired.'], 404);

if ($action === 'report') {
    $db->prepare('UPDATE ' . tf_table('shares') . ' SET reports = reports + 1 WHERE id = ?')->execute([$r['id']]);
    out(['ok' => true]);
}

// ---------- visitors ----------
if (in_array($action, ['check', 'play', 'enter', 'rsvp'], true)) {
    if ($r['status'] === 'blocked') out(['error' => 'This page has been disabled.'], 451);
    if ((int) $r['expires_at'] <= time()) out(['error' => 'This page has expired.'], 410);
}

// Quiz: is this answer right? (for the instant green/red after each question)
if ($action === 'check' && $r['type'] === 'quiz') {
    $i = (int) ($_POST['i'] ?? -1);
    $q = $r['d']['qs'][$i] ?? null;
    if (!$q) out(['error' => 'No such question.'], 400);
    out(['a' => $q['a']]);
}

// Quiz: a friend finished. The score is worked out here, not trusted from the browser.
if ($action === 'play' && $r['type'] === 'quiz') {
    $name = tf_share_txt($_POST['name'] ?? '', 30);
    if ($name === '') out(['error' => 'Write your name.'], 400);
    if (tf_share_recent_from_ip() >= 120) out(['error' => 'Too many plays from your connection. Try again in a while.'], 429);
    $ans = array_map('intval', array_slice((array) ($json('ans') ?: []), 0, count($r['d']['qs'])));
    $score = 0;
    foreach ($r['d']['qs'] as $i => $q) if (($ans[$i] ?? -1) === $q['a']) $score++;
    $id = tf_share_add_entry($r, $name, 'name:' . mb_strtolower($name), ['ans' => $ans], $score);
    out(['id' => $id, 'score' => $score, 'total' => count($r['d']['qs']), 'answers' => array_column($r['d']['qs'], 'a'), 'board' => tf_share_board($r)]);
}

// Giveaway: enter.
if ($action === 'enter' && $r['type'] === 'giveaway') {
    if ((int) $r['d']['ends'] <= time()) out(['error' => 'This giveaway has ended.'], 400);
    if (tf_share_recent_from_ip((int) $r['id']) >= 40) out(['error' => 'Too many entries from your connection. Try again later.'], 429);
    $e = tf_share_clean_entry($r, (array) ($json('fields') ?: []));
    if (is_string($e)) out(['error' => $e], 400);
    [$name, $uniq, $data] = $e;
    $st = $db->prepare('SELECT id FROM ' . tf_table('share_entries') . ' WHERE share_id = ? AND uniq = ?');
    $st->execute([$r['id'], $uniq]);
    if ($st->fetchColumn()) out(['error' => 'You’re already in this giveaway. One entry each, good luck!'], 409);
    $id = tf_share_add_entry($r, $name, $uniq, $data);
    out(['ok' => true, 'id' => $id, 'entries' => (int) $r['entries'] + 1]);
}

// Wedding: RSVP. The same name and phone again updates the earlier answer.
if ($action === 'rsvp' && $r['type'] === 'wedding') {
    if (empty($r['d']['rsvp'])) out(['error' => 'RSVP is closed.'], 400);
    if ($r['d']['rsvp_by'] !== '' && strtotime($r['d']['rsvp_by'] . ' 23:59:59') < time()) out(['error' => 'The RSVP date has passed. Please contact the family directly.'], 400);
    if (tf_share_recent_from_ip((int) $r['id']) >= 30) out(['error' => 'Too many replies from your connection. Try again later.'], 429);
    $in = (array) ($json('fields') ?: []);
    $name = tf_share_txt($in['name'] ?? '', 60);
    if ($name === '') out(['error' => 'Write your name.'], 400);
    $coming = in_array($in['coming'] ?? '', ['yes', 'no', 'maybe'], true) ? $in['coming'] : 'yes';
    $phone = mb_substr((string) preg_replace('/[^\d+ -]/', '', (string) ($in['phone'] ?? '')), 0, 24);
    $data = ['coming' => $coming, 'guests' => $coming === 'no' ? 0 : max(1, min(30, (int) ($in['guests'] ?? 1))), 'phone' => trim($phone), 'msg' => tf_share_para($in['msg'] ?? '', 400),
        'events' => array_values(array_filter(array_map(fn($x) => tf_share_txt($x, 40), array_slice((array) ($in['events'] ?? []), 0, 6)), 'strlen'))];
    $uniq = mb_substr(mb_strtolower($name) . '|' . substr(preg_replace('/\D/', '', $phone), -10), 0, 100);
    $st = $db->prepare('SELECT id FROM ' . tf_table('share_entries') . ' WHERE share_id = ? AND uniq = ?');
    $st->execute([$r['id'], $uniq]);
    if ($old = $st->fetchColumn()) {
        $db->prepare('UPDATE ' . tf_table('share_entries') . ' SET name = ?, data = ?, created_at = ? WHERE id = ?')->execute([$name, json_encode($data, JSON_UNESCAPED_UNICODE), time(), $old]);
        out(['ok' => true, 'updated' => true]);
    }
    tf_share_add_entry($r, $name, $uniq, $data);
    out(['ok' => true]);
}

// ---------- the maker (needs the secret code) ----------
if (!tf_share_key_ok($r, (string) ($_POST['k'] ?? ''))) out(['error' => 'That secret code isn’t right for this page.'], 403);

if ($action === 'get') {
    out(['code' => $r['code'], 'type' => $r['type'], 'd' => $r['d'], 'url' => tf_share_url($r), 'image' => $r['image'] !== '' ? tf_url('s/' . $r['code'] . '/image') : '']);
}
if ($action === 'update') {
    $c = tf_share_clean($r['type'], (array) ($json('data') ?: []), $r);
    if (is_string($c)) out(['error' => $c], 400);
    [$data, $title, $expires] = $c;
    $image = $r['image'];
    if (in_array($r['type'], ['giveaway', 'wedding'], true) && !empty($_FILES['image']['name'])) {
        $new = tf_share_store_image($_FILES['image']);
        if (!str_contains($new, '/')) out(['error' => $new], 400);
        if ($image !== '' && is_file(TF_SHARE_UPLOADS . '/' . $image)) @unlink(TF_SHARE_UPLOADS . '/' . $image);
        $image = $new;
    }
    if (in_array($r['type'], ['giveaway', 'wedding'], true) && !empty($_POST['remove_image']) && $image !== '') {
        if (is_file(TF_SHARE_UPLOADS . '/' . $image)) @unlink(TF_SHARE_UPLOADS . '/' . $image);
        $image = '';
    }
    $db->prepare('UPDATE ' . tf_table('shares') . ' SET title = ?, data = ?, image = ?, updated_at = ?, expires_at = ? WHERE id = ?')
        ->execute([mb_substr($title, 0, 200), json_encode($data, JSON_UNESCAPED_UNICODE), $image, time(), $expires, $r['id']]);
    // A giveaway moved to a later end time can be drawn again.
    if ($r['type'] === 'giveaway' && (int) $data['ends'] > time() && !empty($r['s']['picked_at'])) tf_share_save_state($r, []);
    out(['ok' => true, 'url' => tf_share_url($r)]);
}
if ($action === 'delete') {
    tf_share_delete((int) $r['id']);
    out(['ok' => true]);
}
if ($action === 'remove_entry') {
    $id = (int) ($_POST['id'] ?? 0);
    $st = $db->prepare('DELETE FROM ' . tf_table('share_entries') . ' WHERE id = ? AND share_id = ?');
    $st->execute([$id, $r['id']]);
    if ($st->rowCount()) $db->prepare('UPDATE ' . tf_table('shares') . ' SET entries = GREATEST(entries, 1) - 1 WHERE id = ?')->execute([$r['id']]);
    if ($r['type'] === 'giveaway' && in_array($id, $r['s']['winners'] ?? [], true)) {
        $st2 = $r['s'];
        $st2['winners'] = array_values(array_diff($st2['winners'], [$id]));
        tf_share_save_state($r, $st2);
    }
    out(['ok' => true]);
}
if ($action === 'draw' && $r['type'] === 'giveaway') {
    if ((int) $r['entries'] < 1) out(['error' => 'Nobody has entered yet.'], 400);
    // Drawing early ends the giveaway now.
    if ((int) $r['d']['ends'] > time()) {
        $r['d']['ends'] = time();
        $db->prepare('UPDATE ' . tf_table('shares') . ' SET data = ?, updated_at = ? WHERE id = ?')->execute([json_encode($r['d'], JSON_UNESCAPED_UNICODE), time(), $r['id']]);
    }
    $state = tf_share_draw($r, !empty($_POST['redraw']));
    $r['s'] = $state;
    out(['ok' => true, 'state' => ['picked_at' => $state['picked_at'], 'from' => $state['from'], 'winners' => $state['winners'], 'draws' => $state['draws']], 'public' => tf_share_winners_public($r)]);
}
out(['error' => 'Unknown action.'], 400);
