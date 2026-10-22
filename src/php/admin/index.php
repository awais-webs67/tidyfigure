<?php
// Admin panel: sign in, switch tools on/off, edit SEO per page, ads, analytics, announcement, API keys, password.
declare(strict_types=1);
require __DIR__ . '/../inc/lib.php';

session_name('tf_admin');
session_set_cookie_params(['httponly' => true, 'samesite' => 'Strict', 'secure' => str_starts_with(tf_base_url(), 'https'), 'path' => '/']);
session_start();
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');

$s = tf_settings();
$setup = $s['password_hash'] === '';
$authed = !empty($_SESSION['tf_ok']) && ($_SESSION['tf_hash'] ?? '') === substr($s['password_hash'], -16);
$_SESSION['csrf'] ??= bin2hex(random_bytes(16));
$msg = '';
$err = '';

function csrf_ok(): bool { return hash_equals($_SESSION['csrf'] ?? '', (string) ($_POST['csrf'] ?? '')); }
function self_url(string $q = ''): string { return strtok($_SERVER['REQUEST_URI'], '?') . $q; }

// Simple brute-force protection: 5 wrong passwords from one IP → locked for 15 minutes.
function attempts(?int $add = null): array
{
    $f = TF_DATA . '/logins.json';
    $all = is_file($f) ? (json_decode((string) file_get_contents($f), true) ?: []) : [];
    $ip = $_SERVER['REMOTE_ADDR'] ?? '?';
    $now = time();
    $all = array_filter($all, fn($a) => $a['t'] > $now - 900);
    if ($add !== null) {
        if ($add) $all[$ip] = ['n' => ($all[$ip]['n'] ?? 0) + 1, 't' => $now]; else unset($all[$ip]);
        file_put_contents($f, json_encode($all), LOCK_EX);
    }
    return $all[$ip] ?? ['n' => 0, 't' => 0];
}

$action = $_POST['action'] ?? '';
if ($action && !csrf_ok()) {
    $err = 'Your session expired. Please try again.';
    $action = '';
}

if ($action === 'setup' && $setup) {
    $p = (string) ($_POST['password'] ?? '');
    if (strlen($p) < 10) $err = 'Use at least 10 characters.';
    elseif ($p !== ($_POST['password2'] ?? '')) $err = 'The two passwords don’t match.';
    else {
        $s['password_hash'] = password_hash($p, PASSWORD_DEFAULT);
        if (tf_save_settings($s)) {
            session_regenerate_id(true);
            $_SESSION['tf_ok'] = true;
            $_SESSION['tf_hash'] = substr($s['password_hash'], -16);
            header('Location: ' . self_url());
            exit;
        }
        $err = 'Couldn’t save settings. Make sure the data folder is writable (permissions 755 or 775).';
    }
}

if ($action === 'login' && !$setup) {
    $a = attempts();
    if ($a['n'] >= 5) $err = 'Too many wrong passwords. Try again in 15 minutes.';
    elseif (password_verify((string) ($_POST['password'] ?? ''), $s['password_hash'])) {
        attempts(0);
        session_regenerate_id(true);
        $_SESSION['tf_ok'] = true;
        $_SESSION['tf_hash'] = substr($s['password_hash'], -16);
        header('Location: ' . self_url());
        exit;
    } else {
        attempts(1);
        $err = 'Wrong password.';
    }
}

if ($action === 'logout') {
    $_SESSION = [];
    session_destroy();
    header('Location: ' . self_url());
    exit;
}

$tab = preg_replace('/[^a-z]/', '', $_GET['tab'] ?? 'tools') ?: 'tools';

if ($authed && $action === 'save') {
    $p = $_POST;
    $clean = fn($v, $max = 500) => mb_substr(trim((string) $v), 0, $max);
    if ($tab === 'tools') {
        foreach (tf_tools()['tools'] as $t) {
            $k = $t['slug'];
            $row = $p['t'][$k] ?? [];
            $s['tools'][$k] = [
                'off' => empty($row['on']),
                'title' => $clean($row['title'] ?? '', 120),
                'description' => $clean($row['description'] ?? '', 300),
                'noindex' => !empty($row['noindex']),
            ];
        }
        $s['home'] = ['title' => $clean($p['home_title'] ?? '', 120), 'description' => $clean($p['home_description'] ?? '', 300)];
    } elseif ($tab === 'ads') {
        $s['analytics_id'] = strtoupper($clean($p['analytics_id'] ?? '', 30));
        $s['adsense_client'] = $clean($p['adsense_client'] ?? '', 40);
        foreach (['top', 'article', 'side'] as $slot) $s['ads'][$slot] = $clean($p['ad_' . $slot] ?? '', 10000);
        $s['head_code'] = $clean($p['head_code'] ?? '', 20000);
        $s['body_code'] = $clean($p['body_code'] ?? '', 20000);
    } elseif ($tab === 'site') {
        $s['announcement'] = ['text' => $clean($p['ann_text'] ?? '', 200), 'link' => $clean($p['ann_link'] ?? '', 300)];
        $s['youtube_api_key'] = $clean($p['youtube_api_key'] ?? '', 100);
    } elseif ($tab === 'security') {
        if (!password_verify((string) ($p['current'] ?? ''), $s['password_hash'])) $err = 'Current password is wrong.';
        elseif (strlen((string) ($p['new'] ?? '')) < 10) $err = 'Use at least 10 characters.';
        elseif ($p['new'] !== ($p['new2'] ?? '')) $err = 'The new passwords don’t match.';
        else {
            $s['password_hash'] = password_hash((string) $p['new'], PASSWORD_DEFAULT);
            $_SESSION['tf_hash'] = substr($s['password_hash'], -16);
        }
    }
    if (!$err) $msg = tf_save_settings($s) ? 'Saved. Changes are live now.' : 'Couldn’t save. Check that the data folder is writable.';
}

$data = tf_tools();
$siteName = $data['site']['name'] ?? 'TidyFigure';
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Admin · <?= h($siteName) ?></title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap">
<link rel="stylesheet" href="/style.css">
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
<header class="site"><div class="wrap"><a class="brand" href="/"><span><?= h($siteName) ?></span></a>
<?php if ($authed): ?><form method="post" style="margin:0"><input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>"><button class="btn ghost" name="action" value="logout">Sign out</button></form><?php endif; ?>
</div></header>
<main class="wrap">
<?php if ($setup || !$authed): ?>
  <form method="post" class="panel login">
    <h1 style="font:400 44px/1 var(--f-display);color:var(--slate);margin:0"><?= $setup ? 'Create admin password' : 'Admin sign in' ?></h1>
    <?php if ($setup): ?><p>This is the first visit to the admin panel. Choose a password of at least 10 characters. Only you will be able to sign in after this.</p><?php endif; ?>
    <?php if ($err): ?><p class="msg bad"><?= h($err) ?></p><?php endif; ?>
    <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>">
    <label class="f"><span>Password</span><input type="password" name="password" required minlength="<?= $setup ? 10 : 1 ?>" autocomplete="<?= $setup ? 'new-password' : 'current-password' ?>" style="font-size:16px;padding:10px 12px;border:1px solid var(--line);border-radius:var(--r)"></label>
    <?php if ($setup): ?><label class="f"><span>Repeat password</span><input type="password" name="password2" required minlength="10" autocomplete="new-password" style="font-size:16px;padding:10px 12px;border:1px solid var(--line);border-radius:var(--r)"></label><?php endif; ?>
    <button class="btn big-btn" name="action" value="<?= $setup ? 'setup' : 'login' ?>"><?= $setup ? 'Create password' : 'Sign in' ?></button>
  </form>
<?php else: ?>
<div class="adm">
  <nav aria-label="Admin sections">
    <?php foreach (['tools' => 'Tools & SEO', 'ads' => 'Ads & analytics', 'site' => 'Site & API keys', 'security' => 'Password'] as $k => $label): ?>
      <a href="?tab=<?= $k ?>" class="<?= $tab === $k ? 'on' : '' ?>"><?= $label ?></a>
    <?php endforeach; ?>
    <a href="/" target="_blank" rel="noopener">View site ↗</a>
    <a href="/sitemap.xml" target="_blank" rel="noopener">Sitemap ↗</a>
  </nav>
  <form method="post" class="panel">
    <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>">
    <?php if ($msg): ?><p class="msg ok"><?= h($msg) ?></p><?php endif; ?>
    <?php if ($err): ?><p class="msg bad"><?= h($err) ?></p><?php endif; ?>

    <?php if ($tab === 'tools'): $off = count(array_filter($s['tools'], fn($t) => !empty($t['off']))); ?>
      <h1>Tools &amp; SEO</h1>
      <p><?= count($data['tools']) ?> tools · <?= count($data['tools']) - $off ?> live. Leave a title or description empty to use the built-in one (shown in grey). Aim for titles under 60 characters and descriptions of 120–155.</p>
      <div class="fields">
        <label class="f"><span>Homepage title</span><input type="text" name="home_title" value="<?= h($s['home']['title']) ?>" placeholder="Default homepage title" data-max="60"><span class="count"></span></label>
        <label class="f"><span>Homepage description</span><input type="text" name="home_description" value="<?= h($s['home']['description']) ?>" placeholder="Default homepage description" data-max="155"><span class="count"></span></label>
      </div>
      <input type="search" id="filter" placeholder="Filter tools…" style="padding:10px 12px;border:1px solid var(--line);border-radius:var(--r);font-size:15px">
      <div class="scroll"><table class="tbl tt">
        <thead><tr><th>On</th><th>Tool</th><th>SEO title</th><th>Meta description</th><th>Noindex</th></tr></thead>
        <tbody>
        <?php foreach ($data['categories'] as $c): ?>
          <tr class="catrow"><td colspan="5"><?= h($c['name']) ?></td></tr>
          <?php foreach ($data['tools'] as $t): if ($t['category'] !== $c['id']) continue; $o = $s['tools'][$t['slug']] ?? []; $k = h($t['slug']); ?>
          <tr class="<?= !empty($o['off']) ? 'off' : '' ?>" data-name="<?= h(strtolower($t['name'] . ' ' . $t['slug'])) ?>">
            <td><input type="checkbox" name="t[<?= $k ?>][on]" value="1" <?= empty($o['off']) ? 'checked' : '' ?> aria-label="Show <?= h($t['name']) ?>"></td>
            <td style="min-width:150px"><a href="/<?= $k ?>" target="_blank" rel="noopener"><?= h($t['name']) ?></a></td>
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
      <label class="f"><span>Ad below the tool</span><textarea name="ad_top" class="mono" style="min-height:110px"><?= h($s['ads']['top']) ?></textarea></label>
      <label class="f"><span>Ad inside the article (before FAQs)</span><textarea name="ad_article" class="mono" style="min-height:110px"><?= h($s['ads']['article']) ?></textarea></label>
      <label class="f"><span>Ad at the top of the sidebar</span><textarea name="ad_side" class="mono" style="min-height:110px"><?= h($s['ads']['side']) ?></textarea></label>
      <label class="f"><span>Extra code in &lt;head&gt; (Search Console verification, pixels)</span><textarea name="head_code" class="mono" style="min-height:110px"><?= h($s['head_code']) ?></textarea></label>
      <label class="f"><span>Extra code before &lt;/body&gt; (chat widgets, cookie banners)</span><textarea name="body_code" class="mono" style="min-height:110px"><?= h($s['body_code']) ?></textarea></label>
      <p class="note">Only paste code from services you trust: it runs on every page.</p>

    <?php elseif ($tab === 'site'): ?>
      <h1>Site &amp; API keys</h1>
      <p class="group-title">Announcement bar (shown above every page)</p>
      <div class="fields">
        <label class="f"><span>Text (leave empty to hide)</span><input type="text" name="ann_text" value="<?= h($s['announcement']['text']) ?>" placeholder="New: 20 PDF tools added!"></label>
        <label class="f"><span>Link (optional)</span><input type="text" name="ann_link" value="<?= h($s['announcement']['link']) ?>" placeholder="/merge-pdf"></label>
      </div>
      <p class="group-title">YouTube Data API key</p>
      <label class="f"><span>Used by the YouTube Subscriber Counter. The key stays on the server and is never shown to visitors.</span><input type="text" name="youtube_api_key" value="<?= h($s['youtube_api_key']) ?>" placeholder="AIza…" autocomplete="off"></label>
      <p class="note">Get a free key in Google Cloud Console → APIs &amp; Services → enable “YouTube Data API v3” → Credentials → Create API key. The free quota (10,000 units a day) allows about 10,000 lookups a day; results are cached for 60 seconds per channel.</p>

    <?php else: ?>
      <h1>Change password</h1>
      <label class="f"><span>Current password</span><input type="password" name="current" required autocomplete="current-password"></label>
      <label class="f"><span>New password (10+ characters)</span><input type="password" name="new" required minlength="10" autocomplete="new-password"></label>
      <label class="f"><span>Repeat new password</span><input type="password" name="new2" required minlength="10" autocomplete="new-password"></label>
    <?php endif; ?>
    <div class="stick"><button class="btn big-btn" name="action" value="save">Save changes</button><?php if ($s['updated']): ?><span class="note">Last saved <?= h(date('j M Y, H:i', (int) $s['updated'])) ?></span><?php endif; ?></div>
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
