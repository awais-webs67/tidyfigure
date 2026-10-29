<?php
// Admin panel controller: sign-in, then pages for the dashboard, tools, SEO, hosted QR codes, ads, settings and account.
// Pages are drawn by app/admin/views.php. Everything is stored in MySQL (see app/schema.sql).
declare(strict_types=1);
define('TF_BASE', rtrim(str_replace('\\', '/', dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/'))), '/'));
require __DIR__ . '/../app/bootstrap.php';
require __DIR__ . '/../app/render.php';
require __DIR__ . '/../app/indexnow.php';
require __DIR__ . '/../app/admin/views.php';

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('X-Frame-Options: DENY');
if (!tf_config()) { header('Location: ' . TF_BASE . '/install/'); exit; }
$db = tf_db();
if (!$db) { http_response_code(503); exit('Can’t connect to the database. Check the details in config.php, or that MySQL is running.'); }
tf_migrate();

session_name('tf_admin');
session_set_cookie_params(['httponly' => true, 'samesite' => 'Strict', 'secure' => str_starts_with(tf_base_url(), 'https'), 'path' => TF_BASE . '/admin/']);
session_start();

$admin = null;
if (!empty($_SESSION['tf_admin'])) {
    $st = $db->prepare('SELECT * FROM ' . tf_table('admins') . ' WHERE id = ?');
    $st->execute([$_SESSION['tf_admin']]);
    $admin = $st->fetch() ?: null;
    // A password change signs out older sessions.
    if ($admin && ($_SESSION['tf_hash'] ?? '') !== substr($admin['password_hash'], -16)) $admin = null;
}
$_SESSION['csrf'] ??= bin2hex(random_bytes(16));
$flash = $_SESSION['flash'] ?? null;
unset($_SESSION['flash']);
$err = '';

function csrf_ok(): bool { return hash_equals($_SESSION['csrf'] ?? '', (string) ($_POST['csrf'] ?? '')); }
function admin_url(string $page = '', array $q = []): string { return TF_BASE . '/admin/' . ($page || $q ? '?' . http_build_query(($page ? ['p' => $page] : []) + $q) : ''); }
function go(string $page, string $msg = '', bool $ok = true, array $q = []): never
{
    if ($msg !== '') $_SESSION['flash'] = [$ok, $msg];
    header('Location: ' . admin_url($page, $q));
    exit;
}

// Brute-force protection: 5 wrong passwords from one IP → locked for 15 minutes.
function attempts(PDO $db, ?bool $failed = null): int
{
    $ip = substr($_SERVER['REMOTE_ADDR'] ?? '?', 0, 45);
    $t = tf_table('login_attempts');
    $db->prepare("DELETE FROM $t WHERE last_at < ?")->execute([time() - 900]);
    if ($failed === true) $db->prepare("INSERT INTO $t (ip, attempts, last_at) VALUES (?, 1, ?) ON DUPLICATE KEY UPDATE attempts = attempts + 1, last_at = VALUES(last_at)")->execute([$ip, time()]);
    if ($failed === false) $db->prepare("DELETE FROM $t WHERE ip = ?")->execute([$ip]);
    $st = $db->prepare("SELECT attempts FROM $t WHERE ip = ?");
    $st->execute([$ip]);
    return (int) $st->fetchColumn();
}

$action = (string) ($_POST['action'] ?? '');
if ($action !== '' && !csrf_ok()) {
    $err = 'Your session expired. Please try again.';
    $action = '';
}

// ---------- sign in / out ----------
if ($action === 'login') {
    if (attempts($db) >= 5) $err = 'Too many wrong passwords. Try again in 15 minutes.';
    else {
        $st = $db->prepare('SELECT * FROM ' . tf_table('admins') . ' WHERE username = ?');
        $st->execute([trim((string) ($_POST['username'] ?? ''))]);
        $row = $st->fetch();
        if ($row && password_verify((string) ($_POST['password'] ?? ''), $row['password_hash'])) {
            attempts($db, false);
            if (password_needs_rehash($row['password_hash'], PASSWORD_DEFAULT)) {
                $row['password_hash'] = password_hash((string) $_POST['password'], PASSWORD_DEFAULT);
                $db->prepare('UPDATE ' . tf_table('admins') . ' SET password_hash = ? WHERE id = ?')->execute([$row['password_hash'], $row['id']]);
            }
            $db->prepare('UPDATE ' . tf_table('admins') . ' SET last_login = ? WHERE id = ?')->execute([time(), $row['id']]);
            session_regenerate_id(true);
            $_SESSION['tf_admin'] = (int) $row['id'];
            $_SESSION['tf_hash'] = substr($row['password_hash'], -16);
            go('');
        }
        attempts($db, true);
        $err = 'Wrong username or password.';
    }
}
if ($action === 'logout') {
    $_SESSION = [];
    session_destroy();
    header('Location: ' . admin_url());
    exit;
}
if (!$admin) {
    echo tf_admin_login($err, isset($_GET['installed']) ? 'Installed. Sign in with the admin account you just created.' : '');
    exit;
}

// ---------- signed-in actions ----------
$page = preg_replace('/[^a-z]/', '', (string) ($_GET['p'] ?? 'dashboard')) ?: 'dashboard';
$clean = fn($v, $max = 500) => mb_substr(trim((string) $v), 0, $max);

if ($action === 'save_tools') {
    $limits = json_decode(tf_settings()['tool_limits'] ?: '{}', true) ?: [];
    $st = $db->prepare('INSERT INTO ' . tf_table('tools') . ' (slug, enabled, title, description, noindex, updated_at) VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE enabled = VALUES(enabled), title = VALUES(title), description = VALUES(description), noindex = VALUES(noindex), updated_at = VALUES(updated_at)');
    $db->beginTransaction();
    foreach (tf_tools_all() as $t) {
        $row = $_POST['t'][$t['slug']] ?? null;
        if ($row === null) continue; // not on the form (filtered out)
        $st->execute([$t['slug'], empty($row['on']) ? 0 : 1, $clean($row['title'] ?? '', 160), $clean($row['description'] ?? '', 320), empty($row['noindex']) ? 0 : 1, time()]);
        $lim = trim((string) ($row['limit'] ?? ''));
        if ($lim === '') unset($limits[$t['slug']]); else $limits[$t['slug']] = max(0, min(999, (int) $lim));
    }
    $db->commit();
    tf_save_settings(['tool_limits' => json_encode((object) $limits)]);
    go('tools', 'Saved. Changes are live now.');
}
if ($action === 'toggle_tool') {
    $slug = (string) ($_POST['slug'] ?? '');
    if (isset(tf_tools_all()[$slug])) {
        $db->prepare('INSERT INTO ' . tf_table('tools') . ' (slug, enabled, updated_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE enabled = VALUES(enabled), updated_at = VALUES(updated_at)')->execute([$slug, (int) !empty($_POST['on']), time()]);
    }
    header('Content-Type: application/json');
    exit(json_encode(['ok' => true]));
}
if ($action === 'save_settings') {
    $allowed = [
        'seo' => ['home_title' => 160, 'home_description' => 320, 'title_suffix' => 1, 'verify_google' => 300, 'verify_bing' => 300, 'verify_yandex' => 300, 'verify_pinterest' => 300, 'social_profiles' => 2000, 'robots_extra' => 2000],
        'ads' => ['analytics_id' => 30, 'adsense_client' => 40, 'ads_txt_extra' => 4000, 'limit_default' => 3, 'limit_mode' => 10, 'reward_unit' => 120, 'reward_uses' => 2, 'ad_top' => 10000, 'ad_article' => 10000, 'ad_side' => 10000, 'head_code' => 20000, 'body_code' => 20000, 'ai_isolate' => 1],
        'settings' => ['announcement_text' => 200, 'announcement_link' => 300, 'contact_email' => 120, 'youtube_api_key' => 100, 'qr_enabled' => 1, 'qr_days' => 3, 'qr_max_mb' => 3, 'qr_per_hour' => 4, 'qr_blocked' => 5000],
    ][$page] ?? [];
    $vals = [];
    foreach ($allowed as $k => $max) $vals[$k] = $clean($_POST[$k] ?? '', $max);
    if (isset($vals['analytics_id'])) $vals['analytics_id'] = strtoupper($vals['analytics_id']);
    foreach (['title_suffix', 'qr_enabled', 'ai_isolate'] as $b) if (isset($vals[$b])) $vals[$b] = empty($_POST[$b]) ? '0' : '1';
    if (isset($vals['limit_default'])) $vals['limit_default'] = $vals['limit_default'] === '' ? '' : (string) max(0, min(999, (int) $vals['limit_default']));
    if (isset($vals['limit_mode'])) $vals['limit_mode'] = $vals['limit_mode'] === 'reward' ? 'reward' : 'wait';
    if (isset($vals['reward_unit']) && !preg_match('~^/\d+(/[\w.\-]+)+$~', $vals['reward_unit'])) $vals['reward_unit'] = '';
    if (isset($vals['reward_uses'])) $vals['reward_uses'] = (string) max(1, min(50, (int) $vals['reward_uses'] ?: 3));
    if (isset($vals['qr_days'])) $vals['qr_days'] = (string) max(1, min(365, (int) $vals['qr_days']));
    if (isset($vals['qr_max_mb'])) $vals['qr_max_mb'] = (string) max(1, min(100, (int) $vals['qr_max_mb']));
    if (isset($vals['qr_per_hour'])) $vals['qr_per_hour'] = (string) max(1, min(1000, (int) $vals['qr_per_hour']));
    if ($vals) tf_save_settings($vals);
    go($page, 'Saved. Changes are live now.');
}
if ($action === 'indexnow_key') {
    tf_save_settings(['indexnow_key' => bin2hex(random_bytes(16))]);
    go('seo', 'IndexNow key created. Now press “Submit all pages”.');
}
if ($action === 'indexnow_submit') {
    [$ok, $msg] = tf_indexnow_submit(tf_all_public_urls());
    go('seo', 'IndexNow: ' . $msg, $ok);
}
if ($action === 'clear_cache') {
    foreach (array_merge(glob(TF_CACHE . '/*.php') ?: [], glob(TF_CACHE . '/og/*.png') ?: []) as $f) if (basename($f) !== 'index.php') @unlink($f);
    go('dashboard', 'Cache cleared. Pages and share images will be rebuilt as they are visited.');
}
if (in_array($action, ['qr_block', 'qr_unblock', 'qr_delete'], true)) {
    require __DIR__ . '/../app/qr.php';
    $id = (int) ($_POST['id'] ?? 0);
    if ($action === 'qr_delete') tf_qr_delete($id);
    else $db->prepare('UPDATE ' . tf_table('qr_codes') . ' SET status = ? WHERE id = ?')->execute([$action === 'qr_block' ? 'blocked' : 'active', $id]);
    go('qr', ['qr_block' => 'QR code blocked: it now shows a “not available” page.', 'qr_unblock' => 'QR code unblocked.', 'qr_delete' => 'QR code and its file deleted.'][$action], true, array_intersect_key($_GET, ['f' => 1, 'q' => 1]));
}
if ($action === 'qr_cleanup') {
    require __DIR__ . '/../app/qr.php';
    $n = tf_qr_cleanup(true);
    go('qr', "Removed $n expired QR code" . ($n === 1 ? '' : 's') . '.');
}
if ($action === 'account') {
    $p = $_POST;
    $newUser = trim((string) ($p['username'] ?? ''));
    if (!password_verify((string) ($p['current'] ?? ''), $admin['password_hash'])) $err = 'Current password is wrong.';
    elseif (!preg_match('/^[\w.@-]{3,60}$/', $newUser)) $err = 'Choose a username of 3–60 letters or numbers.';
    elseif (($p['new'] ?? '') !== '' && strlen((string) $p['new']) < 10) $err = 'Use at least 10 characters for the new password.';
    elseif (($p['new'] ?? '') !== ($p['new2'] ?? '')) $err = 'The new passwords don’t match.';
    else {
        $hash = ($p['new'] ?? '') !== '' ? password_hash((string) $p['new'], PASSWORD_DEFAULT) : $admin['password_hash'];
        try {
            $db->prepare('UPDATE ' . tf_table('admins') . ' SET username = ?, password_hash = ? WHERE id = ?')->execute([$newUser, $hash, $admin['id']]);
            $_SESSION['tf_hash'] = substr($hash, -16);
            go('account', 'Account saved.');
        } catch (PDOException $e) {
            $err = 'That username is already taken.';
        }
    }
    $page = 'account';
}

if ($err) $flash = [false, $err];
echo tf_admin_page($page, $admin, $flash);
