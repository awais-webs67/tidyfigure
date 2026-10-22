<?php
// Admin panel: sign in, switch tools on/off, edit SEO per page, ads, analytics, announcement, API keys, account.
// Everything is stored in MySQL (see app/schema.sql). Run /install/ first.
declare(strict_types=1);
define('TF_BASE', rtrim(str_replace('\\', '/', dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/'))), '/'));
require __DIR__ . '/../app/bootstrap.php';

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
if (!tf_config()) { header('Location: ' . TF_BASE . '/install/'); exit; }
$db = tf_db();
if (!$db) { http_response_code(503); exit('Can’t connect to the database. Check the details in config.php, or that MySQL is running.'); }

session_name('tf_admin');
session_set_cookie_params(['httponly' => true, 'samesite' => 'Strict', 'secure' => str_starts_with(tf_base_url(), 'https'), 'path' => TF_BASE . '/admin/']);
session_start();

$admin = null;
if (!empty($_SESSION['tf_admin'])) {
    $st = $db->prepare('SELECT * FROM ' . tf_table('admins') . ' WHERE id = ?');
    $st->execute([$_SESSION['tf_admin']]);
    $admin = $st->fetch() ?: null;
    // Signing out everywhere: a password change invalidates older sessions.
    if ($admin && ($_SESSION['tf_hash'] ?? '') !== substr($admin['password_hash'], -16)) $admin = null;
}
$authed = (bool) $admin;
$_SESSION['csrf'] ??= bin2hex(random_bytes(16));
$msg = isset($_GET['installed']) ? 'Installed. Sign in with the admin account you just created.' : '';
$err = '';

function csrf_ok(): bool { return hash_equals($_SESSION['csrf'] ?? '', (string) ($_POST['csrf'] ?? '')); }
function self_url(string $q = ''): string { return strtok($_SERVER['REQUEST_URI'], '?') . $q; }

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

$action = $_POST['action'] ?? '';
if ($action && !csrf_ok()) {
    $err = 'Your session expired. Please try again.';
    $action = '';
}

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
            header('Location: ' . self_url());
            exit;
        }
        attempts($db, true);
        $err = 'Wrong username or password.';
    }
}

if ($action === 'logout') {
    $_SESSION = [];
    session_destroy();
    header('Location: ' . self_url());
    exit;
}

$tab = preg_replace('/[^a-z]/', '', $_GET['tab'] ?? 'tools') ?: 'tools';
$s = tf_settings();
$ts = tf_tool_settings();

if ($authed && $action === 'save') {
    $p = $_POST;
    $clean = fn($v, $max = 500) => mb_substr(trim((string) $v), 0, $max);
    if ($tab === 'tools') {
        $st = $db->prepare('INSERT INTO ' . tf_table('tools') . ' (slug, enabled, title, description, noindex, updated_at) VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE enabled = VALUES(enabled), title = VALUES(title), description = VALUES(description), noindex = VALUES(noindex), updated_at = VALUES(updated_at)');
        $db->beginTransaction();
        foreach (tf_tools_all() as $t) {
            $row = $p['t'][$t['slug']] ?? [];
            $st->execute([$t['slug'], empty($row['on']) ? 0 : 1, $clean($row['title'] ?? '', 160), $clean($row['description'] ?? '', 320), empty($row['noindex']) ? 0 : 1, time()]);
        }
        $db->commit();
        tf_save_settings(['home_title' => $clean($p['home_title'] ?? '', 160), 'home_description' => $clean($p['home_description'] ?? '', 320)]);
    } elseif ($tab === 'ads') {
        tf_save_settings([
            'analytics_id' => strtoupper($clean($p['analytics_id'] ?? '', 30)),
            'adsense_client' => $clean($p['adsense_client'] ?? '', 40),
            'ad_top' => $clean($p['ad_top'] ?? '', 10000), 'ad_article' => $clean($p['ad_article'] ?? '', 10000), 'ad_side' => $clean($p['ad_side'] ?? '', 10000),
            'head_code' => $clean($p['head_code'] ?? '', 20000), 'body_code' => $clean($p['body_code'] ?? '', 20000),
        ]);
    } elseif ($tab === 'site') {
        tf_save_settings([
            'announcement_text' => $clean($p['ann_text'] ?? '', 200), 'announcement_link' => $clean($p['ann_link'] ?? '', 300),
            'youtube_api_key' => $clean($p['youtube_api_key'] ?? '', 100), 'contact_email' => $clean($p['contact_email'] ?? '', 120),
        ]);
    } elseif ($tab === 'security') {
        $newUser = trim((string) ($p['username'] ?? ''));
        if (!password_verify((string) ($p['current'] ?? ''), $admin['password_hash'])) $err = 'Current password is wrong.';
        elseif (!preg_match('/^[\w.@-]{3,60}$/', $newUser)) $err = 'Choose a username of 3–60 letters or numbers.';
        elseif (($p['new'] ?? '') !== '' && strlen((string) $p['new']) < 10) $err = 'Use at least 10 characters for the new password.';
        elseif (($p['new'] ?? '') !== ($p['new2'] ?? '')) $err = 'The new passwords don’t match.';
        else {
            $hash = ($p['new'] ?? '') !== '' ? password_hash((string) $p['new'], PASSWORD_DEFAULT) : $admin['password_hash'];
            try {
                $db->prepare('UPDATE ' . tf_table('admins') . ' SET username = ?, password_hash = ? WHERE id = ?')->execute([$newUser, $hash, $admin['id']]);
                $admin['username'] = $newUser;
                $admin['password_hash'] = $hash;
                $_SESSION['tf_hash'] = substr($hash, -16);
            } catch (PDOException $e) {
                $err = 'That username is already taken.';
            }
        }
    }
    if (!$err) $msg = 'Saved. Changes are live now.';
    $s = tf_settings(true);
    $ts = tf_tool_settings(true);
}

$siteName = tf_site()['site']['name'];
$tools = tf_tools_all();
$cats = tf_site()['categories'];
$updated = (int) $db->query('SELECT GREATEST(COALESCE((SELECT MAX(updated_at) FROM ' . tf_table('settings') . '), 0), COALESCE((SELECT MAX(updated_at) FROM ' . tf_table('tools') . '), 0))')->fetchColumn();
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Admin · <?= h($siteName) ?></title>
<link rel="icon" href="<?= h(tf_asset('favicon.svg')) ?>" type="image/svg+xml">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap">
<link rel="stylesheet" href="<?= h(tf_asset('style.css')) ?>">
<style>
  .adm { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 28px; padding-block: 28px 60px; }
  .adm nav a { display: block; white-space: nowrap; padding: 11px 14px; border-radius: var(--r); color: var(--ink); text-decoration: none; font-weight: 500; }
  .adm nav a.on { background: var(--accent-soft); color: var(--accent-text); border-left: 3px solid var(--accent); }
  .adm h1 { font: 400 44px/1 var(--f-display); color: var(--slate); margin: 0 0 6px; }
  .panel { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 20px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 16px; }
  .msg { padding: 12px 14px; border-radius: var(--r); font-weight: 500; }
  .msg.ok { background: rgba(30, 122, 76, .1); color: var(--good); } .msg.bad { background: rgba(179, 38, 30, .1); color: var(--bad); }
  .tt td { vertical-align: top; } .tt input[type=text], .tt textarea { font-size: 14px; padding: 7px 9px; }
  .tt textarea { min-height: 54px; resize: vertical; }
  .count { font: 500 12px var(--f-num); color: var(--muted); }
  .count.over { color: var(--bad); }
  .tt tr.off td { opacity: .55; }
  .catrow td { background: var(--surface-2); font-weight: 700; color: var(--ink); }
  .login { max-width: 420px; margin: 8vh auto; }
  .stick { position: sticky; bottom: 0; background: var(--surface); padding: 12px 0; border-top: 1px solid var(--line); display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  @media (max-width: 860px) { .adm { grid-template-columns: 1fr; } .adm nav { display: flex; overflow-x: auto; gap: 4px; } .adm nav a.on { border-left: 0; border-bottom: 3px solid var(--accent); } }
</style>
</head>
<body>
<header class="site"><div class="wrap"><a class="brand" href="<?= h(tf_url()) ?>"><span><?= h($siteName) ?></span></a>
<?php if ($authed): ?><form method="post" style="margin:0"><input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>"><button class="btn ghost" name="action" value="logout">Sign out</button></form><?php endif; ?>
</div></header>
<main class="wrap">
<?php if (!$authed): ?>
  <form method="post" class="panel login">
    <h1 style="font:400 44px/1 var(--f-display);color:var(--slate);margin:0">Admin sign in</h1>
    <?php if ($msg): ?><p class="msg ok"><?= h($msg) ?></p><?php endif; ?>
    <?php if ($err): ?><p class="msg bad"><?= h($err) ?></p><?php endif; ?>
    <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>">
    <label class="f"><span>Username</span><input type="text" name="username" required autocomplete="username" style="font-size:16px;padding:10px 12px;border:1px solid var(--line);border-radius:var(--r)"></label>
    <label class="f"><span>Password</span><input type="password" name="password" required autocomplete="current-password" style="font-size:16px;padding:10px 12px;border:1px solid var(--line);border-radius:var(--r)"></label>
    <button class="btn big-btn" name="action" value="login">Sign in</button>
  </form>
<?php else: ?>
<div class="adm">
  <nav aria-label="Admin sections">
    <?php foreach (['tools' => 'Tools & SEO', 'ads' => 'Ads & analytics', 'site' => 'Site & API keys', 'security' => 'Account'] as $k => $label): ?>
      <a href="?tab=<?= $k ?>" class="<?= $tab === $k ? 'on' : '' ?>"><?= $label ?></a>
    <?php endforeach; ?>
    <a href="<?= h(tf_url()) ?>" target="_blank" rel="noopener">View site ↗</a>
    <a href="<?= h(tf_url('sitemap.xml')) ?>" target="_blank" rel="noopener">Sitemap ↗</a>
  </nav>
  <form method="post" class="panel">
    <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>">
    <?php if ($msg): ?><p class="msg ok"><?= h($msg) ?></p><?php endif; ?>
    <?php if ($err): ?><p class="msg bad"><?= h($err) ?></p><?php endif; ?>

    <?php if ($tab === 'tools'): $off = count(array_filter($ts, fn($t) => !(int) $t['enabled'])); ?>
      <h1>Tools &amp; SEO</h1>
      <p><?= count($tools) ?> tools · <?= count($tools) - $off ?> live. Leave a title or description empty to use the built-in one (shown in grey). Aim for titles under 60 characters and descriptions of 120–155.</p>
      <div class="fields">
        <label class="f"><span>Homepage title</span><input type="text" name="home_title" value="<?= h($s['home_title']) ?>" placeholder="Default homepage title" data-max="60"><span class="count"></span></label>
        <label class="f"><span>Homepage description</span><input type="text" name="home_description" value="<?= h($s['home_description']) ?>" placeholder="Default homepage description" data-max="155"><span class="count"></span></label>
      </div>
      <input type="search" id="filter" placeholder="Filter tools…" style="padding:10px 12px;border:1px solid var(--line);border-radius:var(--r);font-size:15px">
      <div class="scroll"><table class="tbl tt">
        <thead><tr><th>On</th><th>Tool</th><th>SEO title</th><th>Meta description</th><th>Noindex</th></tr></thead>
        <tbody>
        <?php foreach ($cats as $c): ?>
          <tr class="catrow"><td colspan="5"><?= h($c['name']) ?></td></tr>
          <?php foreach ($tools as $t): if ($t['category'] !== $c['id']) continue; $o = $ts[$t['slug']] ?? ['enabled' => 1]; $k = h($t['slug']); ?>
          <tr class="<?= !(int) $o['enabled'] ? 'off' : '' ?>" data-name="<?= h(strtolower($t['name'] . ' ' . $t['slug'])) ?>">
            <td><input type="checkbox" name="t[<?= $k ?>][on]" value="1" <?= (int) $o['enabled'] ? 'checked' : '' ?> aria-label="Show <?= h($t['name']) ?>"></td>
            <td style="min-width:150px"><a href="<?= h(tf_url($t['slug'])) ?>" target="_blank" rel="noopener"><?= h($t['name']) ?></a></td>
            <td style="min-width:240px"><input type="text" name="t[<?= $k ?>][title]" value="<?= h($o['title'] ?? '') ?>" placeholder="<?= h($t['title']) ?>" data-max="60"><span class="count"></span></td>
            <td style="min-width:300px"><textarea name="t[<?= $k ?>][description]" placeholder="<?= h($t['description']) ?>" data-max="155"><?= h($o['description'] ?? '') ?></textarea><span class="count"></span></td>
            <td><input type="checkbox" name="t[<?= $k ?>][noindex]" value="1" <?= !empty($o['noindex']) ? 'checked' : '' ?> aria-label="Hide <?= h($t['name']) ?> from Google"></td>
          </tr>
          <?php endforeach; ?>
        <?php endforeach; ?>
        </tbody>
      </table></div>

    <?php elseif ($tab === 'ads'): ?>
      <h1>Ads &amp; analytics</h1>
      <div class="fields">
        <label class="f"><span>Google Analytics 4 ID</span><input type="text" name="analytics_id" value="<?= h($s['analytics_id']) ?>" placeholder="G-XXXXXXXXXX"></label>
        <label class="f"><span>AdSense publisher ID (auto ads)</span><input type="text" name="adsense_client" value="<?= h($s['adsense_client']) ?>" placeholder="ca-pub-1234567890123456"></label>
      </div>
      <p class="note">With an AdSense publisher ID, Google’s Auto ads script is added to every page. To place ads in fixed spots instead, paste ad unit code below.</p>
      <label class="f"><span>Ad below the tool</span><textarea name="ad_top" class="mono" style="min-height:110px"><?= h($s['ad_top']) ?></textarea></label>
      <label class="f"><span>Ad inside the article (before FAQs)</span><textarea name="ad_article" class="mono" style="min-height:110px"><?= h($s['ad_article']) ?></textarea></label>
      <label class="f"><span>Ad at the top of the sidebar</span><textarea name="ad_side" class="mono" style="min-height:110px"><?= h($s['ad_side']) ?></textarea></label>
      <label class="f"><span>Extra code in &lt;head&gt; (Search Console verification, pixels)</span><textarea name="head_code" class="mono" style="min-height:110px"><?= h($s['head_code']) ?></textarea></label>
      <label class="f"><span>Extra code before &lt;/body&gt; (chat widgets, cookie banners)</span><textarea name="body_code" class="mono" style="min-height:110px"><?= h($s['body_code']) ?></textarea></label>
      <p class="note">Only paste code from services you trust: it runs on every page.</p>

    <?php elseif ($tab === 'site'): ?>
      <h1>Site &amp; API keys</h1>
      <p class="group-title">Announcement bar (shown above every page)</p>
      <div class="fields">
        <label class="f"><span>Text (leave empty to hide)</span><input type="text" name="ann_text" value="<?= h($s['announcement_text']) ?>" placeholder="New: 20 PDF tools added!"></label>
        <label class="f"><span>Link (optional)</span><input type="text" name="ann_link" value="<?= h($s['announcement_link']) ?>" placeholder="/merge-pdf"></label>
      </div>
      <p class="group-title">YouTube Data API key</p>
      <label class="f"><span>Used by the YouTube Subscriber Counter. The key stays on the server and is never shown to visitors.</span><input type="text" name="youtube_api_key" value="<?= h($s['youtube_api_key']) ?>" placeholder="AIza…" autocomplete="off"></label>
      <p class="note">Get a free key in Google Cloud Console → APIs &amp; Services → enable “YouTube Data API v3” → Credentials → Create API key. The free quota (10,000 units a day) allows about 10,000 lookups a day; results are cached for 60 seconds per channel.</p>
      <p class="group-title">Contact email</p>
      <label class="f"><span>Shown on the About and Privacy pages</span><input type="email" name="contact_email" value="<?= h($s['contact_email']) ?>" placeholder="<?= h(tf_site()['site']['email']) ?>"></label>

    <?php else: ?>
      <h1>Account</h1>
      <label class="f"><span>Username</span><input type="text" name="username" value="<?= h($admin['username']) ?>" required autocomplete="username"></label>
      <label class="f"><span>New password (leave empty to keep the current one)</span><input type="password" name="new" minlength="10" autocomplete="new-password"></label>
      <label class="f"><span>Repeat new password</span><input type="password" name="new2" minlength="10" autocomplete="new-password"></label>
      <label class="f"><span>Current password (required to save)</span><input type="password" name="current" required autocomplete="current-password"></label>
      <p class="note">Last sign-in: <?= $admin['last_login'] ? h(date('j M Y, H:i', (int) $admin['last_login'])) : 'now' ?>.</p>
    <?php endif; ?>
    <div class="stick"><button class="btn big-btn" name="action" value="save">Save changes</button><?php if ($updated): ?><span class="note">Last saved <?= h(date('j M Y, H:i', $updated)) ?></span><?php endif; ?></div>
  </form>
</div>
<script>
  // Character counters for SEO fields, and the tool filter.
  document.querySelectorAll('[data-max]').forEach(function (el) {
    var c = el.parentNode.querySelector('.count');
    function upd() { var n = (el.value || el.placeholder).length, m = +el.dataset.max; c.textContent = n + ' / ' + m + (el.value ? '' : ' (default)'); c.classList.toggle('over', n > m); }
    el.addEventListener('input', upd); upd();
  });
  var f = document.getElementById('filter');
  if (f) f.addEventListener('input', function () {
    var v = f.value.trim().toLowerCase();
    document.querySelectorAll('tr[data-name]').forEach(function (r) { r.hidden = v && r.dataset.name.indexOf(v) < 0; });
  });
</script>
<?php endif; ?>
</main>
</body>
</html>
