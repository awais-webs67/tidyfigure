<?php
// JSON API for hosted QR codes: create, update, delete (with the private manage key) and report.
declare(strict_types=1);
define('TF_BASE', rtrim(str_replace('\\', '/', dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/'))), '/'));
require __DIR__ . '/../app/bootstrap.php';
require __DIR__ . '/../app/qr.php';
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
if (!$db) out(['error' => 'Hosted QR codes need the database. The site owner should finish setup at /install/.'], 503);
tf_migrate();
$s = tf_settings();
$action = (string) ($_POST['action'] ?? '');

if ($action === 'report') {
    $r = tf_qr_find((string) ($_POST['code'] ?? ''));
    if ($r) $db->prepare('UPDATE ' . tf_table('qr_codes') . ' SET reports = reports + 1 WHERE id = ?')->execute([$r['id']]);
    out(['ok' => true]);
}

if ($action === 'create') {
    if ($s['qr_enabled'] !== '1') out(['error' => 'Hosted QR codes are switched off on this site.'], 403);
    tf_qr_cleanup();
    $ip = tf_qr_ip_hash();
    $st = $db->prepare('SELECT COUNT(*) FROM ' . tf_table('qr_codes') . ' WHERE ip_hash = ? AND created_at > ?');
    $st->execute([$ip, time() - 3600]);
    if ((int) $st->fetchColumn() >= (int) $s['qr_per_hour']) out(['error' => 'You’ve made a lot of QR codes in the last hour. Please try again later.'], 429);

    $type = (string) ($_POST['type'] ?? '');
    if (!in_array($type, ['link', 'file', 'verify'], true)) out(['error' => 'Unknown QR code type.'], 400);
    $title = mb_substr(trim(strip_tags((string) ($_POST['title'] ?? ''))), 0, 160);
    $target = null;
    $data = null;
    $file = ['', '', '', 0];
    if ($type === 'link') {
        if ($e = tf_qr_check_link((string) ($_POST['target'] ?? ''))) out(['error' => $e], 400);
        $target = trim((string) $_POST['target']);
        if (!preg_match('~^https?://~i', $target)) $target = 'https://' . $target;
    }
    if ($type === 'verify') {
        $d = tf_qr_clean_verify(json_decode((string) ($_POST['data'] ?? '{}'), true) ?: []);
        if ($d['doc'] === '' || ($d['to'] === '' && $d['by'] === '' && !$d['fields'])) out(['error' => 'Add a document title and at least who it was issued to or by.'], 400);
        $data = json_encode($d, JSON_UNESCAPED_UNICODE);
        $title = $title ?: $d['doc'];
    }
    if ($type === 'file' || ($type === 'verify' && !empty($_FILES['file']['name']))) {
        if (empty($_FILES['file'])) out(['error' => 'Choose a file to share.'], 400);
        $f = tf_qr_store_file($_FILES['file']);
        if (is_string($f)) out(['error' => $f], 400);
        $file = $f;
        $title = $title ?: $f[1];
    }
    $key = bin2hex(random_bytes(16));
    $code = tf_qr_new_code();
    $now = time();
    $db->prepare('INSERT INTO ' . tf_table('qr_codes') . ' (code, type, title, target, data, file_path, file_name, file_type, file_size, manage_hash, ip_hash, created_at, expires_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)')
        ->execute([$code, $type, $title, $target, $data, $file[0], $file[1], $file[2], $file[3], hash('sha256', $key), $ip, $now, $now + (int) $s['qr_days'] * 86400]);
    out(tf_qr_public(tf_qr_find($code), $key));
}

// update / delete need the manage key
$r = tf_qr_find((string) ($_POST['code'] ?? ''));
if (!$r || !tf_qr_key_ok($r, (string) ($_POST['k'] ?? ''))) out(['error' => 'This manage link isn’t valid.'], 403);
if ($action === 'delete') {
    tf_qr_delete((int) $r['id']);
    out(['ok' => true]);
}
if ($action === 'update') {
    $title = mb_substr(trim(strip_tags((string) ($_POST['title'] ?? $r['title']))), 0, 160);
    $target = $r['target'];
    $data = $r['data'];
    if ($r['type'] === 'link' && isset($_POST['target'])) {
        if ($e = tf_qr_check_link((string) $_POST['target'])) out(['error' => $e], 400);
        $target = trim((string) $_POST['target']);
        if (!preg_match('~^https?://~i', $target)) $target = 'https://' . $target;
    }
    if ($r['type'] === 'verify' && isset($_POST['status'])) {
        $d = json_decode((string) $r['data'], true) ?: [];
        $d['status'] = in_array($_POST['status'], ['valid', 'expired', 'revoked'], true) ? $_POST['status'] : 'valid';
        $data = json_encode($d, JSON_UNESCAPED_UNICODE);
    }
    $db->prepare('UPDATE ' . tf_table('qr_codes') . ' SET title = ?, target = ?, data = ? WHERE id = ?')->execute([$title, $target, $data, $r['id']]);
    out(tf_qr_public(tf_qr_find($r['code'])));
}
out(['error' => 'Unknown action.'], 400);
