<?php
// One-time installer: connects to MySQL, creates the tables, the first admin account and config.php.
// It refuses to run once config.php exists.
declare(strict_types=1);
define('TF_BASE', rtrim(str_replace('\\', '/', dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/'))), '/'));
require __DIR__ . '/../app/bootstrap.php';
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');

$done = is_file(TF_CONFIG);
$err = '';
$configText = '';
$v = array_merge(['host' => 'localhost', 'name' => '', 'user' => '', 'pass' => '', 'prefix' => 'tf_', 'admin' => 'admin', 'email' => ''], array_map(fn($x) => is_string($x) ? trim($x) : '', $_POST));
$checks = [
    'PHP 8.0 or newer' => PHP_VERSION_ID >= 80000,
    'PDO MySQL extension' => extension_loaded('pdo_mysql'),
    'mbstring extension' => extension_loaded('mbstring'),
    'storage/cache is writable' => is_writable(TF_ROOT . '/storage/cache'),
];

if (!$done && ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    $pass = (string) ($_POST['password'] ?? '');
    if (!preg_match('/^[a-z0-9_]{1,20}$/i', $v['prefix'])) $err = 'The table prefix may only contain letters, numbers and underscores.';
    elseif (!preg_match('/^[\w.@-]{3,60}$/', $v['admin'])) $err = 'Choose an admin username of 3–60 letters or numbers.';
    elseif (strlen($pass) < 10) $err = 'Use an admin password of at least 10 characters.';
    elseif ($pass !== ($_POST['password2'] ?? '')) $err = 'The two admin passwords don’t match.';
    else {
        $db = ['host' => $v['host'], 'name' => $v['name'], 'user' => $v['user'], 'pass' => (string) ($_POST['pass'] ?? ''), 'prefix' => $v['prefix']];
        try {
            $pdo = tf_connect($db);
            $sql = str_replace('{prefix}', $db['prefix'], (string) file_get_contents(TF_ROOT . '/app/schema.sql'));
            foreach (array_filter(array_map('trim', explode(';', preg_replace('/^--.*$/m', '', $sql)))) as $q) $pdo->exec($q);
            $t = fn($n) => '`' . $db['prefix'] . $n . '`';
            if ((int) $pdo->query('SELECT COUNT(*) FROM ' . $t('admins'))->fetchColumn() > 0) {
                $err = 'These tables already have an admin account. Use a different table prefix, or restore your old config.php.';
            } else {
                $pdo->prepare('INSERT INTO ' . $t('admins') . ' (username, password_hash, created_at) VALUES (?, ?, ?)')->execute([$v['admin'], password_hash($pass, PASSWORD_DEFAULT), time()]);
                if ($v['email'] !== '') $pdo->prepare('REPLACE INTO ' . $t('settings') . ' (name, value, updated_at) VALUES (?, ?, ?)')->execute(['contact_email', $v['email'], time()]);
                $configText = "<?php\n// Database settings, written by the installer. Keep this file private and out of Git.\nreturn " . var_export(['db' => $db], true) . ";\n";
                if (@file_put_contents(TF_CONFIG, $configText, LOCK_EX) !== false) {
                    @chmod(TF_CONFIG, 0640);
                    header('Location: ' . TF_BASE . '/admin/?installed=1');
                    exit;
                }
                $err = 'The tables and admin account were created, but config.php couldn’t be written. Create a file named config.php in the site’s main folder with the text below, then open the admin panel.';
            }
        } catch (PDOException $e) {
            $err = 'Couldn’t connect to the database: ' . $e->getMessage() . '. Check the host, database name, user and password in cPanel → MySQL Databases, and that the user is added to the database with ALL PRIVILEGES.';
        }
    }
}
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Install · <?= h(tf_site()['site']['name']) ?></title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap">
<link rel="stylesheet" href="<?= h(tf_asset('style.css')) ?>">
<style>
  .box { max-width: 640px; margin: 5vh auto 60px; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 24px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 16px; }
  .box h1 { font: 400 44px/1 var(--f-display); color: var(--slate); margin: 0; }
  .msg { padding: 12px 14px; border-radius: var(--r); font-weight: 500; background: rgba(179, 38, 30, .1); color: var(--bad); }
  .chk { list-style: none; padding: 0; margin: 0; display: grid; gap: 4px; font-size: 14.5px; }
</style>
</head>
<body>
<main class="wrap">
<?php if ($done): ?>
  <div class="box"><h1>Already installed</h1><p>This site is already set up. Sign in at the <a href="<?= h(TF_BASE) ?>/admin/">admin panel</a>.</p><p class="note">To install again, delete config.php from the site’s main folder first.</p></div>
<?php else: ?>
  <form method="post" class="box" autocomplete="off">
    <h1>Install <?= h(tf_site()['site']['name']) ?></h1>
    <p>First create a MySQL database and user in cPanel → <strong>MySQL Databases</strong> (add the user to the database with <strong>ALL PRIVILEGES</strong>), then fill in the details below.</p>
    <ul class="chk"><?php foreach ($checks as $label => $ok): ?><li><?= $ok ? '✅' : '❌' ?> <?= h($label) ?></li><?php endforeach; ?></ul>
    <?php if ($err): ?><p class="msg"><?= h($err) ?></p><?php endif; ?>
    <?php if ($configText): ?><div class="copybox"><?= h($configText) ?></div><?php endif; ?>
    <p class="group-title">Database</p>
    <div class="fields">
      <label class="f"><span>Database host</span><input type="text" name="host" value="<?= h($v['host']) ?>" required></label>
      <label class="f"><span>Database name</span><input type="text" name="name" value="<?= h($v['name']) ?>" placeholder="cpaneluser_tidyfigure" required></label>
      <label class="f"><span>Database user</span><input type="text" name="user" value="<?= h($v['user']) ?>" placeholder="cpaneluser_tfuser" required></label>
      <label class="f"><span>Database password</span><input type="password" name="pass" autocomplete="new-password"></label>
      <label class="f"><span>Table prefix</span><input type="text" name="prefix" value="<?= h($v['prefix']) ?>" required></label>
    </div>
    <p class="group-title">Admin account</p>
    <div class="fields">
      <label class="f"><span>Username</span><input type="text" name="admin" value="<?= h($v['admin']) ?>" required></label>
      <label class="f"><span>Password (10+ characters)</span><input type="password" name="password" required minlength="10" autocomplete="new-password"></label>
      <label class="f"><span>Repeat password</span><input type="password" name="password2" required minlength="10" autocomplete="new-password"></label>
      <label class="f"><span>Contact email for the site (optional)</span><input type="email" name="email" value="<?= h($v['email']) ?>" placeholder="hello@yourdomain.com"></label>
    </div>
    <button class="btn big-btn">Install</button>
  </form>
<?php endif; ?>
</main>
</body>
</html>
