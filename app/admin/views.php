<?php
// Admin panel pages. Each function returns HTML; admin/index.php decides which one to show.
declare(strict_types=1);

function tf_admin_head(string $title): string
{
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">'
        . '<title>' . h($title) . ' · ' . h(tf_site()['site']['name']) . ' admin</title>'
        . '<link rel="icon" href="' . h(tf_asset('favicon.svg')) . '" type="image/svg+xml">'
        . tf_font_head() . '<link rel="stylesheet" href="' . h(tf_asset('style.css')) . '"><link rel="stylesheet" href="' . h(tf_asset('admin.css')) . '">'
        . '<script>try{var t=localStorage.getItem("tf-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}</script></head>';
}

function tf_admin_csrf(): string
{
    return '<input type="hidden" name="csrf" value="' . h($_SESSION['csrf']) . '">';
}

function tf_admin_flash(?array $flash): string
{
    return $flash ? '<div class="a-flash ' . ($flash[0] ? 'ok' : 'bad') . '" role="status">' . tf_icon($flash[0] ? 'circle-check' : 'circle-alert') . h($flash[1]) . '</div>' : '';
}

function tf_admin_login(string $err, string $msg): string
{
    $site = tf_site()['site']['name'];
    return tf_admin_head('Sign in') . '<body class="a-login-body"><main class="a-login">
<a class="brand" href="' . h(tf_url()) . '"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="4" fill="var(--slate)"/><path d="M9 11h14M16 11v12" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="23" cy="22" r="2.6" fill="var(--accent)"/></svg><span>' . h($site) . '</span></a>
<form method="post" class="a-card">
<h1>Admin sign in</h1>' . ($msg ? tf_admin_flash([true, $msg]) : '') . ($err ? tf_admin_flash([false, $err]) : '') . tf_admin_csrf() . '
<label class="f"><span>Username</span><input type="text" name="username" required autocomplete="username" autofocus></label>
<label class="f"><span>Password</span><input type="password" name="password" required autocomplete="current-password"></label>
<button class="btn big-btn" name="action" value="login">Sign in</button>
</form><p class="a-muted"><a href="' . h(tf_url()) . '">← Back to the site</a></p></main></body></html>';
}

function tf_admin_nav(string $page): string
{
    $items = [
        'dashboard' => ['layout-dashboard', 'Dashboard'], 'tools' => ['wrench', 'Tools'], 'seo' => ['search-check', 'SEO'], 'qr' => ['qr-code', 'Hosted QR codes'],
        'shares' => ['gift', 'Share pages'], 'resources' => ['book-open', 'Resources'],
        'ads' => ['megaphone', 'Ads & analytics'], 'settings' => ['settings', 'Settings'], 'account' => ['user-round', 'Account'],
    ];
    $h = '';
    foreach ($items as $k => [$icon, $label]) $h .= '<a href="' . h(admin_url($k === 'dashboard' ? '' : $k)) . '"' . ($page === $k ? ' class="on" aria-current="page"' : '') . '>' . tf_icon($icon) . '<span>' . $label . '</span></a>';
    return $h;
}

function tf_admin_page(string $page, array $admin, ?array $flash): string
{
    $views = ['dashboard' => 'tf_admin_dashboard', 'tools' => 'tf_admin_tools', 'seo' => 'tf_admin_seo', 'qr' => 'tf_admin_qr', 'shares' => 'tf_admin_shares', 'resources' => 'tf_admin_resources', 'ads' => 'tf_admin_ads', 'settings' => 'tf_admin_settings', 'account' => 'tf_admin_account'];
    if (!isset($views[$page])) $page = 'dashboard';
    [$title, $sub, $body] = $views[$page]($admin);
    $site = tf_site()['site']['name'];
    return tf_admin_head($title) . '<body class="a-body">
<aside class="a-side" id="a-side">
<a class="a-brand" href="' . h(admin_url()) . '"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#FF5B35"/><path d="M9 11h14M16 11v12" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="23" cy="22" r="2.6" fill="#191F24"/></svg><span>' . h($site) . '<small>Admin</small></span></a>
<nav aria-label="Admin">' . tf_admin_nav($page) . '</nav>
<div class="a-side-foot"><a href="' . h(tf_url()) . '" target="_blank" rel="noopener">' . tf_icon('external-link') . '<span>View site</span></a>
<form method="post">' . tf_admin_csrf() . '<button name="action" value="logout">' . tf_icon('log-out') . '<span>Sign out</span></button></form></div>
</aside>
<div class="a-shade" onclick="document.body.classList.remove(\'a-nav-open\')"></div>
<div class="a-main">
<header class="a-top"><button type="button" class="a-burger" onclick="document.body.classList.toggle(\'a-nav-open\')" aria-label="Menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
<div><h1>' . h($title) . '</h1>' . ($sub ? '<p>' . $sub . '</p>' : '') . '</div>
<span class="a-user">' . tf_icon('user-round') . h($admin['username']) . '</span></header>
<div class="a-content">' . tf_admin_flash($flash) . $body . '</div>
</div>
<script>
// Character counters + Google preview for SEO fields; table filters; switches that save instantly.
document.querySelectorAll("[data-max]").forEach(function (el) {
  var c = el.parentNode.querySelector(".count");
  function upd() { var n = (el.value || el.placeholder).length, m = +el.dataset.max, min = +(el.dataset.min || 0); c.textContent = n + " / " + m + (el.value ? "" : " (default)"); c.className = "count" + (n > m ? " over" : n < min ? " short" : " good");
    var row = el.closest("[data-serp]"); if (row) { var t = row.querySelector("[data-serp-title]"), d = row.querySelector("[data-serp-desc]"), ti = row.querySelector("[data-max=\'65\']"), de = row.querySelector("[data-max=\'160\']");
      if (t && ti) t.textContent = (ti.value || ti.placeholder).slice(0, 62) + ((ti.value || ti.placeholder).length > 62 ? "…" : ""); if (d && de) d.textContent = (de.value || de.placeholder).slice(0, 158) + ((de.value || de.placeholder).length > 158 ? "…" : ""); } }
  el.addEventListener("input", upd); upd();
});
var f = document.getElementById("filter"), fc = document.getElementById("fcat"), fs = document.getElementById("fstatus");
function filt() { var v = (f && f.value || "").trim().toLowerCase(), c = fc && fc.value, s = fs && fs.value;
  document.querySelectorAll("[data-row]").forEach(function (r) { r.hidden = (v && r.dataset.name.indexOf(v) < 0) || (c && r.dataset.cat !== c) || (s && r.dataset.status !== s); }); }
[f, fc, fs].forEach(function (el) { if (el) el.addEventListener("input", filt); });
document.querySelectorAll("[data-edit]").forEach(function (b) { b.addEventListener("click", function () { var r = document.getElementById(b.dataset.edit); r.hidden = !r.hidden; b.setAttribute("aria-expanded", !r.hidden); }); });
document.querySelectorAll("[data-toggle-tool]").forEach(function (sw) { sw.addEventListener("change", function () {
  var fd = new FormData(); fd.append("csrf", ' . json_encode($_SESSION['csrf']) . '); fd.append("action", "toggle_tool"); fd.append("slug", sw.dataset.toggleTool); if (sw.checked) fd.append("on", "1");
  var row = sw.closest("[data-row]"); if (row) { row.dataset.status = sw.checked ? "on" : "off"; row.classList.toggle("is-off", !sw.checked); }
  var mirror = document.querySelector("[name=\'t[" + sw.dataset.toggleTool + "][on]\']"); if (mirror) mirror.checked = sw.checked;
  fetch(location.href, { method: "POST", body: fd, credentials: "same-origin" }); }); });
document.querySelectorAll("[data-confirm]").forEach(function (b) { b.addEventListener("click", function (e) { if (!confirm(b.dataset.confirm)) e.preventDefault(); }); });
</script>
</body></html>';
}

// ---------- helpers ----------

function tf_admin_stat(string $icon, string $value, string $label, string $tone = ''): string
{
    return '<div class="a-stat ' . $tone . '">' . tf_icon($icon) . '<b>' . $value . '</b><span>' . $label . '</span></div>';
}

function tf_admin_qr_ready(): bool
{
    try { tf_db()->query('SELECT 1 FROM ' . tf_table('qr_codes') . ' LIMIT 1'); return true; } catch (Throwable $e) { return false; }
}

// Words, title/description lengths and problems for every tool page.
function tf_admin_seo_rows(): array
{
    $ts = tf_tool_settings();
    $rows = [];
    foreach (tf_tools_all() as $slug => $t) {
        $m = include TF_ROOT . "/tools/$slug/meta.php";
        $o = $ts[$slug] ?? [];
        $title = trim((string) ($o['title'] ?? '')) ?: $t['title'];
        $desc = trim((string) ($o['description'] ?? '')) ?: $t['description'];
        $words = str_word_count(tf_strip(($m['answer'] ?? '') . ' ' . ($m['article'] ?? '') . ' ' . implode(' ', array_merge(...array_map(fn($f) => [$f[0], $f[1]], $m['faqs'] ?? [[ '', '' ]])))));
        $issues = [];
        if (mb_strlen($title) > 65) $issues[] = 'Title too long (' . mb_strlen($title) . ')';
        if (mb_strlen($title) < 30) $issues[] = 'Title short (' . mb_strlen($title) . ')';
        if (mb_strlen($desc) > 160) $issues[] = 'Description too long (' . mb_strlen($desc) . ')';
        if (mb_strlen($desc) < 110) $issues[] = 'Description short (' . mb_strlen($desc) . ')';
        if ($words < 400) $issues[] = "Thin content ($words words)";
        if (count($m['faqs'] ?? []) < 3) $issues[] = 'Fewer than 3 FAQs';
        if (empty($m['related'])) $issues[] = 'No related tools';
        $rows[$slug] = ['t' => $t, 'title' => $title, 'desc' => $desc, 'words' => $words, 'faqs' => count($m['faqs'] ?? []), 'issues' => $issues, 'on' => !isset($o['enabled']) || (int) $o['enabled'] === 1, 'noindex' => !empty($o['noindex'])];
    }
    return $rows;
}

// ---------- pages ----------

function tf_admin_dashboard(array $admin): array
{
    $db = tf_db();
    $s = tf_settings();
    $all = tf_tools_all();
    $live = count(tf_tools());
    $qrActive = $scans7 = $qrTotal = 0;
    $storage = 0;
    $recent = [];
    if (tf_admin_qr_ready()) {
        $qrActive = (int) $db->query('SELECT COUNT(*) FROM ' . tf_table('qr_codes') . " WHERE status = 'active' AND expires_at > " . time())->fetchColumn();
        $qrTotal = (int) $db->query('SELECT COUNT(*) FROM ' . tf_table('qr_codes'))->fetchColumn();
        $scans7 = (int) $db->query('SELECT COALESCE(SUM(mobile + desktop), 0) FROM ' . tf_table('qr_scans') . ' WHERE day >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)')->fetchColumn();
        $storage = (int) $db->query('SELECT COALESCE(SUM(file_size), 0) FROM ' . tf_table('qr_codes'))->fetchColumn();
        $recent = $db->query('SELECT * FROM ' . tf_table('qr_codes') . ' ORDER BY id DESC LIMIT 5')->fetchAll();
    }
    $seo = tf_admin_seo_rows();
    $seoIssues = count(array_filter($seo, fn($r) => $r['on'] && $r['issues']));
    $https = str_starts_with(tf_base_url(), 'https');
    $checks = [
        ['Website is on HTTPS', $https, 'Turn on AutoSSL in cPanel → SSL/TLS Status.'],
        ['Google Search Console verified', trim($s['verify_google']) !== '', 'Add the verification code in SEO → Search engines, then submit your sitemap in Search Console.'],
        ['Bing Webmaster Tools verified', trim($s['verify_bing']) !== '', 'Add the code in SEO → Search engines. Bing also powers DuckDuckGo, Yahoo and ChatGPT search results.'],
        ['IndexNow key created', $s['indexnow_key'] !== '', 'Create it in SEO → IndexNow so Bing and Yandex find new pages straight away.'],
        ['Google Analytics connected', $s['analytics_id'] !== '', 'Add your GA4 ID in Ads & analytics.'],
        ['AdSense connected', $s['adsense_client'] !== '', 'Add your publisher ID in Ads & analytics once AdSense approves the site.'],
        ['Contact email set', trim($s['contact_email']) !== '', 'Set it in Settings. A real contact address helps trust and ad approval.'],
        ['Social profiles linked', trim($s['social_profiles']) !== '', 'Add your social pages in SEO so Google can connect them to the site.'],
        ['YouTube API key added', $s['youtube_api_key'] !== '', 'Needed only for the YouTube Subscriber Counter (Settings).'],
    ];
    $done = count(array_filter($checks, fn($c) => $c[1]));
    $list = '';
    foreach ($checks as [$label, $ok, $help]) $list .= '<li class="' . ($ok ? 'ok' : 'todo') . '">' . tf_icon($ok ? 'circle-check' : 'circle-alert') . '<div><b>' . h($label) . '</b>' . ($ok ? '' : '<small>' . h($help) . '</small>') . '</div></li>';
    $rec = '';
    foreach ($recent as $q) $rec .= '<tr><td><a href="' . h(tf_url('q/' . $q['code'])) . '" target="_blank" rel="noopener" class="mono">' . h($q['code']) . '</a></td><td>' . h(ucfirst($q['type'])) . '</td><td>' . h(mb_strimwidth($q['title'] ?: (string) $q['target'], 0, 50, '…')) . '</td><td class="n">' . (int) $q['scans'] . '</td><td class="n">' . date('j M', (int) $q['created_at']) . '</td></tr>';
    $body = '<div class="a-stats">'
        . tf_admin_stat('wrench', (string) $live, "of " . count($all) . " tools live")
        . tf_admin_stat('search-check', (string) $seoIssues, 'pages with SEO warnings', $seoIssues ? 'warn' : 'good')
        . tf_admin_stat('qr-code', (string) $qrActive, 'active hosted QR codes')
        . tf_admin_stat('scan-line', number_format($scans7), 'QR scans, last 7 days')
        . '</div>
<div class="a-grid">
<section class="a-card"><h2>Setup checklist <small>' . $done . ' of ' . count($checks) . ' done</small></h2><div class="bar"><i style="width:' . round($done / count($checks) * 100) . '%"></i></div><ul class="a-check">' . $list . '</ul></section>
<section class="a-card"><h2>Quick links</h2><ul class="a-links">
<li><a href="' . h(tf_url('sitemap.xml')) . '" target="_blank" rel="noopener">' . tf_icon('globe') . 'Sitemap (' . (count(tf_all_public_urls()) + 2) . ' URLs)</a></li>
<li><a href="https://search.google.com/search-console" target="_blank" rel="noopener">' . tf_icon('search-check') . 'Google Search Console</a></li>
<li><a href="https://www.bing.com/webmasters" target="_blank" rel="noopener">' . tf_icon('search-check') . 'Bing Webmaster Tools</a></li>
<li><a href="https://pagespeed.web.dev/analysis?url=' . rawurlencode(tf_abs()) . '" target="_blank" rel="noopener">' . tf_icon('rocket') . 'Test page speed</a></li>
<li><a href="https://search.google.com/test/rich-results?url=' . rawurlencode(tf_abs('merge-pdf')) . '" target="_blank" rel="noopener">' . tf_icon('sparkles') . 'Rich results test</a></li>
</ul>
<form method="post" class="a-inline">' . tf_admin_csrf() . '<button class="btn ghost" name="action" value="clear_cache">Clear cache</button></form>
<p class="a-muted">Hosted QR storage: ' . h(tf_admin_bytes($storage)) . ' in ' . $qrTotal . ' code' . ($qrTotal === 1 ? '' : 's') . '. PHP ' . PHP_VERSION . (function_exists('imagettftext') ? ' · GD on' : ' · GD off (share images use the default picture)') . '.</p></section>
</div>
' . ($rec ? '<section class="a-card"><h2>Latest hosted QR codes</h2><div class="scroll"><table class="tbl"><thead><tr><th>Code</th><th>Type</th><th>Title / link</th><th class="n">Scans</th><th class="n">Created</th></tr></thead><tbody>' . $rec . '</tbody></table></div></section>' : '');
    return ['Dashboard', 'Welcome back, ' . h($admin['username']) . '.', $body];
}

function tf_admin_bytes(int $n): string
{
    return $n < 1048576 ? round($n / 1024) . ' KB' : round($n / 1048576, 1) . ' MB';
}

function tf_admin_tools(array $admin): array
{
    $rows = tf_admin_seo_rows();
    $cats = tf_site()['categories'];
    $live = count(array_filter($rows, fn($r) => $r['on']));
    $copts = '<option value="">All categories</option>' . implode('', array_map(fn($c) => '<option value="' . h($c['id']) . '">' . h($c['nav']) . '</option>', $cats));
    $tr = '';
    $host = parse_url(tf_base_url(), PHP_URL_HOST);
    $limits = json_decode(tf_settings()['tool_limits'] ?: '{}', true) ?: [];
    foreach ($rows as $slug => $r) {
        $t = $r['t'];
        $k = h($slug);
        $o = tf_tool_settings()[$slug] ?? [];
        $cat = tf_category($t['category']);
        $badges = ($o['title'] ?? '') !== '' || ($o['description'] ?? '') !== '' ? '<span class="a-pill">Custom SEO</span>' : '';
        $badges .= $r['noindex'] ? '<span class="a-pill warn">Noindex</span>' : '';
        $badges .= tf_tool_limit($slug) > 0 ? '<span class="a-pill">' . tf_tool_limit($slug) . ' a day</span>' : '';
        $badges .= $r['issues'] ? '<span class="a-pill warn" title="' . h(implode(' · ', $r['issues'])) . '">' . count($r['issues']) . ' SEO warning' . (count($r['issues']) > 1 ? 's' : '') . '</span>' : '';
        $tr .= '<tr data-row data-name="' . h(mb_strtolower($t['name'] . ' ' . $slug)) . '" data-cat="' . h($t['category']) . '" data-status="' . ($r['on'] ? 'on' : 'off') . '" class="' . ($r['on'] ? '' : 'is-off') . '">
<td><label class="sw"><input type="checkbox" data-toggle-tool="' . $k . '"' . ($r['on'] ? ' checked' : '') . ' aria-label="Show ' . h($t['name']) . '"><i></i></label></td>
<td><div class="a-tool">' . tf_tile($t) . '<div><a href="' . h(tf_url($slug)) . '" target="_blank" rel="noopener"><b>' . h($t['name']) . '</b></a><small>/' . $k . ' · ' . h($cat['nav'] ?? '') . '</small></div></div></td>
<td>' . $badges . '</td>
<td class="n">' . $r['words'] . '</td>
<td class="n"><button type="button" class="btn ghost sm" data-edit="e-' . $k . '" aria-expanded="false">Edit SEO</button></td></tr>
<tr id="e-' . $k . '" hidden class="a-edit" data-serp><td colspan="5"><div class="a-edit-grid">
<div><input type="hidden" name="t[' . $k . '][on]" value="1"' . ($r['on'] ? '' : ' disabled') . '>
<label class="f"><span>SEO title</span><input type="text" name="t[' . $k . '][title]" value="' . h($o['title'] ?? '') . '" placeholder="' . h($t['title']) . '" data-max="65" data-min="30"><span class="count"></span></label>
<label class="f"><span>Meta description</span><textarea name="t[' . $k . '][description]" placeholder="' . h($t['description']) . '" data-max="160" data-min="110">' . h($o['description'] ?? '') . '</textarea><span class="count"></span></label>
<label class="check"><input type="checkbox" name="t[' . $k . '][noindex]" value="1"' . ($r['noindex'] ? ' checked' : '') . '>Hide from search engines (noindex)</label>
<label class="f"><span>Free downloads per day for each visitor (empty = default, 0 = unlimited)</span><input type="number" min="0" max="999" name="t[' . $k . '][limit]" value="' . h(isset($limits[$slug]) ? (string) $limits[$slug] : '') . '" placeholder="' . h(tf_settings()['limit_default'] ?: 'unlimited') . '" style="max-width:160px"></label></div>
<div class="serp" aria-label="Google preview"><small>' . h($host) . ' › ' . $k . '</small><b data-serp-title></b><p data-serp-desc></p></div>
</div></td></tr>';
    }
    // The on/off switches save instantly; this hidden copy keeps them in sync when the SEO form is saved.
    $body = '<form method="post" class="a-card">' . tf_admin_csrf() . '
<div class="a-toolbar"><input type="search" id="filter" placeholder="Search ' . count($rows) . ' tools…"><select id="fcat">' . $copts . '</select><select id="fstatus"><option value="">On and off</option><option value="on">Switched on</option><option value="off">Switched off</option></select></div>
<p class="a-muted">' . $live . ' of ' . count($rows) . ' tools are live. Switches save straight away. Leave SEO fields empty to use the built-in title and description (shown in grey).</p>
<div class="scroll"><table class="tbl a-table"><thead><tr><th>On</th><th>Tool</th><th>Status</th><th class="n">Words</th><th></th></tr></thead><tbody>' . $tr . '</tbody></table></div>
<div class="a-save"><button class="btn big-btn" name="action" value="save_tools">Save SEO changes</button></div>
</form>';
    // Keep the hidden "on" fields in step with the switches.
    $body .= '<script>document.querySelectorAll("[data-toggle-tool]").forEach(function(sw){sw.addEventListener("change",function(){var h=document.querySelector("[name=\'t["+sw.dataset.toggleTool+"][on]\']");if(h)h.disabled=!sw.checked;});});</script>';
    return ['Tools', 'Switch tools on or off and edit how each page appears in Google.', $body];
}

function tf_admin_seo(array $admin): array
{
    $s = tf_settings();
    $rows = array_filter(tf_admin_seo_rows(), fn($r) => $r['on']);
    $issues = array_filter($rows, fn($r) => $r['issues']);
    $avgWords = $rows ? round(array_sum(array_column($rows, 'words')) / count($rows)) : 0;
    $tr = '';
    foreach ($issues as $slug => $r) $tr .= '<tr><td><a href="' . h(tf_url($slug)) . '" target="_blank" rel="noopener">' . h($r['t']['name']) . '</a></td><td>' . implode('<br>', array_map('h', $r['issues'])) . '</td></tr>';
    $key = $s['indexnow_key'];
    $field = fn($name, $label, $ph = '', $help = '') => '<label class="f"><span>' . $label . '</span><input type="text" name="' . $name . '" value="' . h($s[$name]) . '" placeholder="' . h($ph) . '">' . ($help ? '<small class="a-muted">' . $help . '</small>' : '') . '</label>';
    $body = '<div class="a-stats">'
        . tf_admin_stat('globe', (string) count(tf_all_public_urls()), 'pages in the sitemap')
        . tf_admin_stat('search-check', (string) count($issues), 'pages with warnings', $issues ? 'warn' : 'good')
        . tf_admin_stat('file-text', (string) $avgWords, 'average words per tool page')
        . tf_admin_stat('badge-check', '3', 'schema types on every tool')
        . '</div>
<form method="post" class="a-card">' . tf_admin_csrf() . '<input type="hidden" name="action" value="save_settings">
<h2>Homepage</h2>
<div class="a-edit-grid" data-serp><div>
<label class="f"><span>Homepage title</span><input type="text" name="home_title" value="' . h($s['home_title']) . '" placeholder="' . h(tf_site()['site']['name'] . ': ' . count(tf_tools()) . ' Free Online Tools for PDF, Images, Video & More') . '" data-max="65" data-min="30"><span class="count"></span></label>
<label class="f"><span>Homepage description</span><textarea name="home_description" placeholder="' . h(count(tf_tools()) . ' free online tools that run in your browser: merge PDFs, compress images, convert video to MP3, make QR codes, calculators and more. No sign-up.') . '" data-max="160" data-min="110">' . h($s['home_description']) . '</textarea><span class="count"></span></label>
<label class="check"><input type="checkbox" name="title_suffix" value="1"' . ($s['title_suffix'] === '1' ? ' checked' : '') . '>Add “| ' . h(tf_site()['site']['name']) . '” to tool titles when they are short enough</label>
</div><div class="serp" aria-label="Google preview"><small>' . h(parse_url(tf_base_url(), PHP_URL_HOST)) . '</small><b data-serp-title></b><p data-serp-desc></p></div></div>
<h2>Search engines</h2>
<p class="a-muted">Paste the verification code (or the whole &lt;meta&gt; tag) each service gives you. Then submit <b>' . h(tf_abs('sitemap.xml')) . '</b> in each one.</p>
<div class="fields">' . $field('verify_google', 'Google Search Console', 'google-site-verification code', '<a href="https://search.google.com/search-console" target="_blank" rel="noopener">Open Search Console</a> → Add property → URL prefix → HTML tag') . $field('verify_bing', 'Bing Webmaster Tools', 'msvalidate.01 code', '<a href="https://www.bing.com/webmasters" target="_blank" rel="noopener">Open Bing Webmaster</a> (you can also import from Google)') . $field('verify_yandex', 'Yandex Webmaster', 'yandex-verification code') . $field('verify_pinterest', 'Pinterest', 'p:domain_verify code') . '</div>
<h2>Brand & social profiles</h2>
<label class="f"><span>Your social media pages, one link per line (added to the Organization schema and the footer)</span><textarea name="social_profiles" placeholder="https://www.facebook.com/yourpage&#10;https://www.instagram.com/yourpage&#10;https://www.youtube.com/@yourchannel">' . h($s['social_profiles']) . '</textarea></label>
<h2>robots.txt</h2>
<label class="f"><span>Extra lines (optional). Admin, install, API and QR pages are already blocked.</span><textarea name="robots_extra" class="mono" placeholder="Disallow: /some-page">' . h($s['robots_extra']) . '</textarea></label>
<div class="a-save"><button class="btn big-btn">Save SEO settings</button> <a href="' . h(tf_url('robots.txt')) . '" target="_blank" rel="noopener">View robots.txt</a></div>
</form>
<section class="a-card"><h2>IndexNow: instant indexing</h2>
<p class="a-muted">IndexNow tells Bing, Yandex, Seznam and Naver about your pages straight away, instead of waiting for them to crawl. (Google doesn’t use IndexNow; submit your sitemap in Search Console for Google.)</p>
' . ($key ? '<p>Key file: <a href="' . h(tf_url($key . '.txt')) . '" target="_blank" rel="noopener" class="mono">/' . h($key) . '.txt</a></p>' : '') . '
<form method="post" class="a-inline">' . tf_admin_csrf() . ($key ? '<button class="btn" name="action" value="indexnow_submit">Submit all ' . count(tf_all_public_urls()) . ' pages</button> ' : '') . '<button class="btn ghost" name="action" value="indexnow_key"' . ($key ? ' data-confirm="Create a new key? The old one stops working."' : '') . '>' . ($key ? 'New key' : 'Create IndexNow key') . '</button></form></section>
<section class="a-card"><h2>SEO checker <small>' . count($issues) . ' of ' . count($rows) . ' live pages have warnings</small></h2>
' . ($tr ? '<div class="scroll"><table class="tbl"><thead><tr><th>Page</th><th>Warnings</th></tr></thead><tbody>' . $tr . '</tbody></table></div>' : '<p class="a-good">' . tf_icon('circle-check') . 'Every live tool page has a good title, description, at least 400 words, FAQs and related links.</p>') . '
</section>
<section class="a-card"><h2>Already built into every page</h2><ul class="a-ticks">
<li>Unique title, meta description and canonical URL</li><li>Open Graph and Twitter tags with an automatic 1200×630 share image</li><li>Schema: WebApplication, FAQPage and BreadcrumbList on tools; CollectionPage on categories; WebSite, Organization and FAQPage on the homepage</li>
<li>A 40–60 word direct answer at the top (the format AI Overviews and featured snippets quote)</li><li>400–800 words of original content, worked examples and 5 FAQs per tool</li>
<li>Category hub pages, breadcrumbs, related tools and footer links for internal linking</li><li>XML sitemap with last-modified dates, robots.txt, mobile-first fast pages, HTTPS redirect</li></ul>
<h2>What gets a new site ranking</h2><ol class="a-steps">
<li><b>Verify the site and submit the sitemap</b> in Google Search Console and Bing Webmaster Tools (fields above).</li>
<li><b>Be patient:</b> new domains usually take 3–6 months to rank for competitive words. Long, specific searches (“pdf page number tool free”) come first.</li>
<li><b>Earn links:</b> share tools in relevant Facebook groups, Reddit, Quora answers and forums where people ask how to do these tasks; list the site on tool directories (Product Hunt, AlternativeTo); ask partner sites to link.</li>
<li><b>Watch Search Console:</b> under Performance, find pages getting impressions on page 2, and improve those pages’ titles and content.</li>
<li><b>Keep adding useful tools and updating pages:</b> fresh, helpful content is what Google rewards.</li></ol></section>';
    return ['SEO', 'Search engine settings, instant indexing and a checker for every page.', $body];
}

function tf_admin_qr(array $admin): array
{
    if (!tf_admin_qr_ready()) return ['Hosted QR codes', '', '<section class="a-card"><p>The QR tables are being created. Reload this page.</p></section>'];
    $db = tf_db();
    $f = preg_replace('/[^a-z]/', '', (string) ($_GET['f'] ?? ''));
    $q = trim((string) ($_GET['q'] ?? ''));
    $where = ['1=1'];
    $args = [];
    if ($f === 'active') { $where[] = "status = 'active' AND expires_at > ?"; $args[] = time(); }
    if ($f === 'blocked') $where[] = "status = 'blocked'";
    if ($f === 'reported') $where[] = 'reports > 0';
    if ($f === 'expired') { $where[] = 'expires_at <= ?'; $args[] = time(); }
    if (in_array($f, ['link', 'file', 'verify'], true)) { $where[] = 'type = ?'; $args[] = $f; }
    if ($q !== '') { $where[] = '(code = ? OR title LIKE ? OR target LIKE ?)'; array_push($args, $q, "%$q%", "%$q%"); }
    $st = $db->prepare('SELECT * FROM ' . tf_table('qr_codes') . ' WHERE ' . implode(' AND ', $where) . ' ORDER BY reports DESC, id DESC LIMIT 200');
    $st->execute($args);
    $rows = $st->fetchAll();
    $counts = $db->query('SELECT type, COUNT(*) n, SUM(scans) s FROM ' . tf_table('qr_codes') . ' GROUP BY type')->fetchAll();
    $by = array_column($counts, null, 'type');
    $tr = '';
    foreach ($rows as $r) {
        $expired = (int) $r['expires_at'] <= time();
        $status = $r['status'] === 'blocked' ? '<span class="a-pill bad">Blocked</span>' : ($expired ? '<span class="a-pill">Expired</span>' : '<span class="a-pill good">Active</span>');
        if ($r['reports']) $status .= ' <span class="a-pill warn">' . (int) $r['reports'] . ' report' . ($r['reports'] > 1 ? 's' : '') . '</span>';
        $what = $r['type'] === 'link' ? '<a href="' . h((string) $r['target']) . '" target="_blank" rel="noopener nofollow" class="a-url">' . h(mb_strimwidth((string) $r['target'], 0, 60, '…')) . '</a>' : h($r['title']) . ($r['file_name'] ? '<br><small class="a-muted">' . h($r['file_name']) . ' · ' . tf_admin_bytes((int) $r['file_size']) . '</small>' : '');
        $act = tf_admin_csrf() . '<input type="hidden" name="id" value="' . (int) $r['id'] . '">'
            . ($r['status'] === 'blocked' ? '<button class="btn ghost sm" name="action" value="qr_unblock">Unblock</button>' : '<button class="btn ghost sm" name="action" value="qr_block">' . tf_icon('ban') . 'Block</button>')
            . '<button class="btn ghost sm danger" name="action" value="qr_delete" data-confirm="Delete this QR code and its file? It can’t be undone.">' . tf_icon('trash-2') . '</button>';
        $tr .= '<tr><td><a href="' . h(tf_url('q/' . $r['code'])) . '" target="_blank" rel="noopener" class="mono">' . h($r['code']) . '</a></td><td>' . h(['link' => 'Dynamic link', 'file' => 'File', 'verify' => 'Verification'][$r['type']] ?? $r['type']) . '</td><td>' . $what . '</td><td class="n">' . (int) $r['scans'] . '</td><td class="n">' . date('j M Y', (int) $r['created_at']) . '<br><small class="a-muted">expires ' . date('j M', (int) $r['expires_at']) . '</small></td><td>' . $status . '</td><td class="n"><form method="post" class="a-row-actions">' . $act . '</form></td></tr>';
    }
    $chip = fn($k, $label) => '<a href="' . h(admin_url('qr', $k ? ['f' => $k] : [])) . '" class="chip' . ($f === $k ? ' on' : '') . '">' . $label . '</a>';
    $s = tf_settings();
    $body = '<div class="a-stats">'
        . tf_admin_stat('link-2', (string) ($by['link']['n'] ?? 0), 'dynamic link codes')
        . tf_admin_stat('file-up', (string) ($by['file']['n'] ?? 0), 'file codes')
        . tf_admin_stat('badge-check', (string) ($by['verify']['n'] ?? 0), 'verification codes')
        . tf_admin_stat('scan-line', number_format(array_sum(array_column($counts, 's'))), 'total scans')
        . '</div>
<section class="a-card"><div class="a-toolbar"><form method="get" class="a-search"><input type="hidden" name="p" value="qr"><input type="search" name="q" value="' . h($q) . '" placeholder="Search code, title or link…"></form>
<div class="chips">' . $chip('', 'All') . $chip('active', 'Active') . $chip('reported', 'Reported') . $chip('blocked', 'Blocked') . $chip('expired', 'Expired') . $chip('link', 'Links') . $chip('file', 'Files') . $chip('verify', 'Verification') . '</div></div>
<p class="a-muted">Codes are deleted automatically ' . (int) $s['qr_days'] . ' days after they are made (change it in Settings). Visitors can report a code; reported codes are listed first. Block anything misleading or harmful.</p>
' . ($tr ? '<div class="scroll"><table class="tbl a-table"><thead><tr><th>Code</th><th>Type</th><th>Link or title</th><th class="n">Scans</th><th class="n">Created</th><th>Status</th><th></th></tr></thead><tbody>' . $tr . '</tbody></table></div>' : '<p class="empty">No QR codes here yet.</p>') . '
<form method="post" class="a-inline">' . tf_admin_csrf() . '<button class="btn ghost" name="action" value="qr_cleanup">Delete expired codes now</button></form>
<p class="a-muted">Expired codes are also removed automatically while people use the site. For exact daily cleanup, add a cPanel cron job: <code>php ' . h(TF_ROOT) . '/api/cron.php</code> once a day.</p></section>';
    return ['Hosted QR codes', 'Dynamic, file and verification QR codes people have made on your site.', $body];
}

function tf_admin_ads(array $admin): array
{
    $s = tf_settings();
    $ta = fn($name, $label, $rows = 4) => '<label class="f"><span>' . $label . '</span><textarea name="' . $name . '" class="mono" rows="' . $rows . '" style="min-height:auto">' . h($s[$name]) . '</textarea></label>';
    $body = '<form method="post" class="a-card">' . tf_admin_csrf() . '<input type="hidden" name="action" value="save_settings">
<h2>Analytics & AdSense</h2>
<div class="fields"><label class="f"><span>Google Analytics 4 measurement ID</span><input type="text" name="analytics_id" value="' . h($s['analytics_id']) . '" placeholder="G-XXXXXXXXXX"></label>
<label class="f"><span>AdSense publisher ID (turns on Auto ads)</span><input type="text" name="adsense_client" value="' . h($s['adsense_client']) . '" placeholder="ca-pub-1234567890123456"></label></div>
<p class="a-muted">Auto ads places ads for you. To choose exact spots instead, paste ad unit code into the slots below. The publisher ID also adds AdSense’s site-verification tag and your <a href="' . h(tf_url('ads.txt')) . '" target="_blank" rel="noopener">ads.txt</a> line automatically.</p>
' . $ta('ads_txt_extra', 'Extra ads.txt lines (only for other ad networks)', 3) . '
<h2>Ad slots</h2>
<div class="a-slots"><div class="a-slot-map"><span>Tool</span><span class="hl">Slot 1</span><span>Article</span><span class="hl">Slot 2</span><span>FAQs</span></div><div>'
        . $ta('ad_top', 'Slot 1: below the tool') . $ta('ad_article', 'Slot 2: inside the article, before FAQs') . $ta('ad_side', 'Slot 3: top of the sidebar (desktop)') . '</div></div>
<h2>Usage limits</h2>
<p class="a-muted">Limit how many files each visitor can download from a tool per day (calculators and other tools without downloads aren’t affected). Set a number for all tools here, or for one tool under Tools → Edit SEO. Counts are kept in the visitor’s browser, so this is a soft limit.</p>
<div class="fields"><label class="f"><span>Free downloads per tool per day (empty = unlimited)</span><input type="number" min="0" max="999" name="limit_default" value="' . h($s['limit_default']) . '" placeholder="unlimited"></label>
<label class="f"><span>When the limit is reached</span><select name="limit_mode"><option value="wait"' . ($s['limit_mode'] !== 'reward' ? ' selected' : '') . '>Ask them to come back tomorrow</option><option value="reward"' . ($s['limit_mode'] === 'reward' ? ' selected' : '') . '>Offer a rewarded ad to unlock more</option></select></label>
<label class="f"><span>Google Ad Manager rewarded ad unit</span><input type="text" name="reward_unit" value="' . h($s['reward_unit']) . '" placeholder="/1234567/rewarded_downloads"></label>
<label class="f"><span>Extra downloads per rewarded ad</span><input type="number" min="1" max="50" name="reward_uses" value="' . h($s['reward_uses']) . '"></label></div>
<p class="a-muted"><b>Important:</b> AdSense doesn’t allow rewarding people for viewing ordinary ads. Only use “rewarded ad” with a <b>rewarded ad unit from Google Ad Manager</b> (free to set up, linked to your AdSense account). If no unit is set, visitors are asked to come back tomorrow instead.</p>
<h2>AI tool speed</h2>
<label class="check"><input type="checkbox" name="ai_isolate" value="1"' . ($s['ai_isolate'] === '1' ? ' checked' : '') . '>Make the AI tools 2–4× faster (Background Remover, Passport Photo Maker, Audio to Text)</label>
<p class="a-muted">This lets the AI use every processor core on the visitor’s device. Browsers only allow that on pages that don’t load ads or other sites’ widgets, so <b>ads don’t show on these 3 pages</b> while it’s on (all other pages are unaffected). Untick it to show ads there instead; the tools still work, just more slowly.</p>
<h2>Custom code</h2>' . $ta('head_code', 'Code in &lt;head&gt; (verification tags, pixels)') . $ta('body_code', 'Code before &lt;/body&gt; (chat widgets, cookie banners)') . '
<p class="a-muted">Only paste code from services you trust: it runs on every page.</p>
<div class="a-save"><button class="btn big-btn">Save</button></div></form>';
    return ['Ads & analytics', 'Connect Google Analytics and AdSense, and place ads.', $body];
}

function tf_admin_settings(array $admin): array
{
    $s = tf_settings();
    $body = '<form method="post" class="a-card">' . tf_admin_csrf() . '<input type="hidden" name="action" value="save_settings">
<h2>Announcement bar</h2>
<div class="fields"><label class="f"><span>Text (leave empty to hide)</span><input type="text" name="announcement_text" value="' . h($s['announcement_text']) . '" placeholder="New: Background Remover is here!"></label>
<label class="f"><span>Link (optional)</span><input type="text" name="announcement_link" value="' . h($s['announcement_link']) . '" placeholder="/remove-background"></label></div>
<h2>Contact</h2>
<label class="f"><span>Contact email (shown on the About and Privacy pages)</span><input type="email" name="contact_email" value="' . h($s['contact_email']) . '" placeholder="' . h(tf_contact_email()) . '"></label>
<label class="f"><span>Company the site belongs to (footer, About page and Google)</span><input type="text" name="company_name" value="' . h($s['company_name']) . '" placeholder="' . h(tf_company()['name']) . '"></label>
<label class="f"><span>Company website</span><input type="url" name="company_url" value="' . h($s['company_url']) . '" placeholder="' . h(tf_company()['url'] ?: 'https://') . '"></label>
<h2>Install as an app</h2>
<label class="check"><input type="checkbox" name="app_install" value="1"' . ($s['app_install'] === '1' ? ' checked' : '') . '>Offer phone visitors an “Install app” button, so the site opens from their home screen like an app</label>
<h2>Hosted QR codes</h2>
<label class="check"><input type="checkbox" name="qr_enabled" value="1"' . ($s['qr_enabled'] === '1' ? ' checked' : '') . '>Allow visitors to create dynamic, file and verification QR codes</label>
<div class="fields"><label class="f"><span>Delete codes after (days)</span><input type="number" name="qr_days" min="1" max="365" value="' . h($s['qr_days']) . '"></label>
<label class="f"><span>Max file size (MB)</span><input type="number" name="qr_max_mb" min="1" max="100" value="' . h($s['qr_max_mb']) . '"></label>
<label class="f"><span>Max new codes per visitor per hour</span><input type="number" name="qr_per_hour" min="1" max="1000" value="' . h($s['qr_per_hour']) . '"></label></div>
<label class="f"><span>Blocked domains for dynamic links (one per line). Links to these sites are refused.</span><textarea name="qr_blocked" class="mono" style="min-height:90px" placeholder="bad-site.example">' . h($s['qr_blocked']) . '</textarea></label>
<p class="a-muted">Your hosting’s PHP upload limit (upload_max_filesize) is ' . h((string) ini_get('upload_max_filesize')) . '; files bigger than that can’t be uploaded even if the limit above is higher.</p>
<h2>Share pages (friendship quiz, giveaway, wedding invitation)</h2>
<label class="check"><input type="checkbox" name="share_enabled" value="1"' . ($s['share_enabled'] === '1' ? ' checked' : '') . '>Allow visitors to make new quizzes, giveaways and wedding invitations</label>
<label class="f"><span>Max new pages per visitor per hour</span><input type="number" name="share_per_hour" min="1" max="1000" value="' . h($s['share_per_hour']) . '"></label>
<h2>YouTube Data API key</h2>
<label class="f"><span>Used by the YouTube Subscriber Counter. Kept on the server, never shown to visitors.</span><input type="text" name="youtube_api_key" value="' . h($s['youtube_api_key']) . '" placeholder="AIza…" autocomplete="off"></label>
<p class="a-muted">Get a free key: Google Cloud Console → APIs &amp; Services → enable “YouTube Data API v3” → Credentials → Create API key.</p>
<div class="a-save"><button class="btn big-btn">Save settings</button></div></form>';
    return ['Settings', '', $body];
}

function tf_admin_account(array $admin): array
{
    $body = '<form method="post" class="a-card a-narrow">' . tf_admin_csrf() . '<input type="hidden" name="action" value="account">
<label class="f"><span>Username</span><input type="text" name="username" value="' . h($admin['username']) . '" required autocomplete="username"></label>
<label class="f"><span>New password (leave empty to keep the current one)</span><input type="password" name="new" minlength="10" autocomplete="new-password"></label>
<label class="f"><span>Repeat new password</span><input type="password" name="new2" minlength="10" autocomplete="new-password"></label>
<label class="f"><span>Current password (required to save)</span><input type="password" name="current" required autocomplete="current-password"></label>
<p class="a-muted">Last sign-in: ' . ($admin['last_login'] ? h(date('j M Y, H:i', (int) $admin['last_login'])) : 'now') . '. Changing the password signs out every other session.</p>
<div class="a-save"><button class="btn big-btn">Save account</button></div></form>';
    return ['Account', '', $body];
}

// ---------- share pages (moderation) ----------

function tf_admin_shares(array $admin): array
{
    require_once TF_ROOT . '/app/share.php';
    $db = tf_db();
    $f = preg_replace('/[^a-z]/', '', (string) ($_GET['f'] ?? ''));
    $q = trim((string) ($_GET['q'] ?? ''));
    $where = ['1=1'];
    $args = [];
    if ($f === 'reported') $where[] = 'reports > 0';
    if ($f === 'blocked') $where[] = "status = 'blocked'";
    if (isset(TF_SHARE_TYPES[$f])) { $where[] = 'type = ?'; $args[] = $f; }
    if ($q !== '') { $where[] = '(code = ? OR title LIKE ?)'; array_push($args, $q, "%$q%"); }
    $st = $db->prepare('SELECT * FROM ' . tf_table('shares') . ' WHERE ' . implode(' AND ', $where) . ' ORDER BY reports DESC, id DESC LIMIT 200');
    $st->execute($args);
    $counts = array_column($db->query('SELECT type, COUNT(*) n, SUM(entries) e, SUM(views) v FROM ' . tf_table('shares') . ' GROUP BY type')->fetchAll(), null, 'type');
    $names = ['quiz' => 'Friendship quiz', 'giveaway' => 'Giveaway', 'wedding' => 'Wedding invitation'];
    $tr = '';
    foreach ($st->fetchAll() as $r) {
        $status = $r['status'] === 'blocked' ? '<span class="a-pill bad">Blocked</span>' : '<span class="a-pill good">Active</span>';
        if ($r['reports']) $status .= ' <span class="a-pill warn">' . (int) $r['reports'] . ' report' . ($r['reports'] > 1 ? 's' : '') . '</span>';
        $act = tf_admin_csrf() . '<input type="hidden" name="id" value="' . (int) $r['id'] . '">'
            . ($r['status'] === 'blocked' ? '<button class="btn ghost sm" name="action" value="share_unblock">Unblock</button>' : '<button class="btn ghost sm" name="action" value="share_block">' . tf_icon('ban') . 'Block</button>')
            . '<button class="btn ghost sm danger" name="action" value="share_delete" data-confirm="Delete this page and all its entries? It can’t be undone.">' . tf_icon('trash-2') . '</button>';
        $tr .= '<tr><td><a href="' . h(tf_url('s/' . $r['code'])) . '" target="_blank" rel="noopener" class="mono">' . h($r['code']) . '</a></td><td>' . h($names[$r['type']] ?? $r['type']) . '</td><td>' . h(mb_strimwidth($r['title'], 0, 70, '…')) . '</td><td class="n">' . (int) $r['entries'] . '</td><td class="n">' . (int) $r['views'] . '</td><td class="n">' . date('j M Y', (int) $r['created_at']) . '<br><small class="a-muted">deleted ' . date('j M Y', (int) $r['expires_at']) . '</small></td><td>' . $status . '</td><td class="n"><form method="post" class="a-row-actions">' . $act . '</form></td></tr>';
    }
    $chip = fn($k, $label) => '<a href="' . h(admin_url('shares', $k ? ['f' => $k] : [])) . '" class="chip' . ($f === $k ? ' on' : '') . '">' . $label . '</a>';
    $body = '<div class="a-stats">'
        . tf_admin_stat('heart', (string) ($counts['quiz']['n'] ?? 0), 'quizzes · ' . (int) ($counts['quiz']['e'] ?? 0) . ' plays')
        . tf_admin_stat('gift', (string) ($counts['giveaway']['n'] ?? 0), 'giveaways · ' . (int) ($counts['giveaway']['e'] ?? 0) . ' entries')
        . tf_admin_stat('gem', (string) ($counts['wedding']['n'] ?? 0), 'invitations · ' . (int) ($counts['wedding']['e'] ?? 0) . ' RSVPs')
        . tf_admin_stat('eye', number_format(array_sum(array_column($counts, 'v'))), 'visits to share pages')
        . '</div>
<section class="a-card"><div class="a-toolbar"><form method="get" class="a-search"><input type="hidden" name="p" value="shares"><input type="search" name="q" value="' . h($q) . '" placeholder="Search code or title…"></form>
<div class="chips">' . $chip('', 'All') . $chip('reported', 'Reported') . $chip('blocked', 'Blocked') . $chip('quiz', 'Quizzes') . $chip('giveaway', 'Giveaways') . $chip('wedding', 'Invitations') . '</div></div>
<p class="a-muted">Pages visitors made with the friendship quiz, giveaway and wedding card tools. They are only reachable by their link and are deleted automatically. Reported pages are listed first: block anything misleading or harmful.</p>
' . ($tr ? '<div class="scroll"><table class="tbl a-table"><thead><tr><th>Code</th><th>Type</th><th>Title</th><th class="n">Entries</th><th class="n">Visits</th><th class="n">Made</th><th>Status</th><th></th></tr></thead><tbody>' . $tr . '</tbody></table></div>' : '<p class="empty">No pages here yet.</p>') . '
<form method="post" class="a-inline">' . tf_admin_csrf() . '<button class="btn ghost" name="action" value="share_cleanup">Delete expired pages now</button></form></section>';
    return ['Share pages', 'Quizzes, giveaways and wedding invitations people have made on your site.', $body];
}

// ---------- resources ----------

function tf_admin_resources(array $admin): array
{
    require_once TF_ROOT . '/app/resources.php';
    $edit = isset($_GET['id']) || isset($_GET['new']);
    if ($edit) {
        $r = isset($_GET['id']) ? (tf_db()->query('SELECT * FROM ' . tf_table('resources') . ' WHERE id = ' . (int) $_GET['id'])->fetch() ?: null) : null;
        $links = $r ? (json_decode((string) $r['links'], true) ?: []) : [];
        while (count($links) < 5) $links[] = ['label' => '', 'url' => '', 'note' => ''];
        $img = $r && $r['image'] !== '' ? tf_res_image_url($r) : '';
        $rows = '';
        foreach ($links as $i => $l) {
            $rows .= '<div class="fields" style="grid-template-columns:1fr 1.4fr 1fr"><label class="f"><span>Button text ' . ($i + 1) . '</span><input type="text" name="ll[]" maxlength="120" value="' . h($l['label']) . '" placeholder="Enrol in the course"></label>'
                . '<label class="f"><span>Link</span><input type="url" name="lu[]" maxlength="1000" value="' . h($l['url']) . '" placeholder="https://"></label>'
                . '<label class="f"><span>Small note (optional)</span><input type="text" name="ln[]" maxlength="160" value="' . h($l['note']) . '" placeholder="Free · 6 hours"></label></div>';
        }
        $body = '<form method="post" enctype="multipart/form-data" class="a-card">' . tf_admin_csrf() . '<input type="hidden" name="action" value="res_save"><input type="hidden" name="id" value="' . (int) ($r['id'] ?? 0) . '">
<label class="f"><span>Title</span><input type="text" name="title" maxlength="200" required value="' . h($r['title'] ?? '') . '" placeholder="Best free AI course for beginners (2026)"></label>
<label class="f"><span>Web address: ' . h(tf_abs('r/')) . '<b>…</b> (letters, numbers and dashes; leave empty to make it from the title)</span><input type="text" name="slug" maxlength="80" pattern="[a-z0-9-]*" value="' . h($r['slug'] ?? '') . '" placeholder="free-ai-course"></label>
<label class="f"><span>Summary: shown under the title and in Google (up to 160 characters)</span><input type="text" name="summary" maxlength="320" data-max="160" value="' . h($r['summary'] ?? '') . '" placeholder="A free 6-hour AI course from Google: what you’ll learn, who it’s for and how to enrol."><small class="count"></small></label>
<div class="f"><span>Picture (optional, shown at the top and when the link is shared)</span>' . ($img ? '<img src="' . h($img) . '" alt="" style="max-width:240px;border-radius:10px">' . '<label class="check"><input type="checkbox" name="remove_image" value="1"> Remove this picture</label>' : '') . '<input type="file" name="image" accept="image/jpeg,image/png,image/webp"></div>
<h2>Links (big buttons at the top)</h2>' . $rows . '
<label class="f"><span>Details. Leave an empty line between paragraphs. Use ## for a heading, - for a list, **bold**, [text](https://link).</span><textarea name="body" rows="14" style="min-height:280px" placeholder="## What you’ll learn&#10;- How AI models work&#10;- Writing good prompts&#10;&#10;**Who it’s for:** complete beginners.">' . h($r['body'] ?? '') . '</textarea></label>
<label class="check"><input type="checkbox" name="published" value="1"' . (($r['status'] ?? 'published') === 'published' ? ' checked' : '') . '> Published (visible on the site, in the sitemap and to search engines)</label>
<div class="a-save"><button class="btn big-btn">Save</button> <a class="btn ghost" href="' . h(admin_url('resources')) . '">Cancel</a>' . ($r ? ' <a class="btn ghost" href="' . h(tf_url('r/' . $r['slug'])) . '" target="_blank" rel="noopener">View</a>' : '') . '</div></form>';
        return [$r ? 'Edit resource' : 'New resource', 'A page with the full details for a link you share on social media.', $body];
    }
    $tr = '';
    foreach (tf_res_list(false) as $r) {
        $url = tf_abs('r/' . $r['slug']);
        $tr .= '<tr><td><a href="' . h(admin_url('resources', ['id' => $r['id']])) . '"><b>' . h($r['title']) . '</b></a><br><small class="a-muted mono">' . h($url) . '</small></td><td>' . ($r['status'] === 'published' ? '<span class="a-pill good">Published</span>' : '<span class="a-pill">Draft</span>') . '</td><td class="n">' . (int) $r['views'] . '</td><td class="n">' . date('j M Y', (int) $r['updated_at']) . '</td>'
            . '<td class="n"><form method="post" class="a-row-actions">' . tf_admin_csrf() . '<input type="hidden" name="id" value="' . (int) $r['id'] . '"><button type="button" class="btn ghost sm" onclick="navigator.clipboard.writeText(' . h(json_encode($url)) . ');this.textContent=\'Copied\'">Copy link</button><a class="btn ghost sm" href="' . h($url) . '" target="_blank" rel="noopener">View</a><button class="btn ghost sm danger" name="action" value="res_delete" data-confirm="Delete this resource page?">' . tf_icon('trash-2') . '</button></form></td></tr>';
    }
    $body = '<section class="a-card"><div class="a-toolbar"><a class="btn" href="' . h(admin_url('resources', ['new' => 1])) . '">' . tf_icon('plus') . ' New resource</a></div>
<p class="a-muted">Post “Best free AI course, link below” on your channel, and put the link to a resource page here: visitors land on your site with all the details, the buttons to the course, and your tools. Published pages are in the sitemap and listed at <a href="' . h(tf_url('resources')) . '" target="_blank" rel="noopener">' . h(tf_abs('resources')) . '</a>.</p>
' . ($tr ? '<div class="scroll"><table class="tbl a-table"><thead><tr><th>Resource</th><th>Status</th><th class="n">Visits</th><th class="n">Updated</th><th></th></tr></thead><tbody>' . $tr . '</tbody></table></div>' : '<p class="empty">No resource pages yet. Make your first one.</p>') . '</section>';
    return ['Resources', 'Pages with the full details for links you share on your channels.', $body];
}
