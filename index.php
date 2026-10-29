<?php
// Front controller: every page request comes here (see .htaccess) and is rendered from the tools folder.
declare(strict_types=1);
header_remove('X-Powered-By'); // don't announce the PHP version
// Browsers that have seen the site over HTTPS use only HTTPS for it for a year (HSTS). Sent only on HTTPS pages,
// so a site still without SSL is never locked out.
if (($_SERVER['HTTPS'] ?? '') === 'on' || ($_SERVER['HTTPS'] ?? '') === '1' || strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https') {
    header('Strict-Transport-Security: max-age=31536000');
}
// Browser features: camera, microphone, screen capture and fullscreen only for this site's own pages (webcam, mic,
// scanner and recorder tools); features no tool uses are switched off, also for anything embedded such as ads.
header('Permissions-Policy: camera=(self), microphone=(self), display-capture=(self), fullscreen=(self), geolocation=(), payment=(), usb=(), serial=(), hid=()');
define('TF_BASE', rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/'));
require __DIR__ . '/app/bootstrap.php';
require __DIR__ . '/app/render.php';

$path = rawurldecode((string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH));
if (TF_BASE !== '' && str_starts_with($path, TF_BASE)) $path = substr($path, strlen(TF_BASE));
// One address per page: /merge-pdf/ and /Merge-PDF go to /merge-pdf (hosted QR codes keep their case).
$clean = strtolower(trim($path, '/'));
if ($clean !== '' && !str_starts_with($clean, 'q/') && ($path !== '/' . $clean || preg_match('/[A-Z]/', $path)) && !str_contains($clean, '.')) {
    $qs = (string) parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_QUERY);
    header('Location: ' . tf_url($clean) . ($qs !== '' ? "?$qs" : ''), true, 301);
    exit;
}
$path = trim($path, '/');

if ($path === 'sitemap.xml') {
    // Last-Modified = the newest date in the sitemap, so search engines can ask "changed since?" and get a quick 304.
    $newest = max(array_merge(array_map('tf_tool_date', tf_tools()), array_map('strtotime', TF_PAGE_DATES)));
    $since = strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE'] ?? '') ?: 0;
    header('Content-Type: application/xml; charset=utf-8');
    header('Cache-Control: public, max-age=3600');
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $newest) . ' GMT');
    if ($since >= $newest) {
        http_response_code(304);
        exit;
    }
    echo tf_sitemap();
    exit;
}
if ($path === 'robots.txt') {
    header('Content-Type: text/plain; charset=utf-8');
    echo tf_robots();
    exit;
}
if ($path === 'llms.txt') {
    // A plain list of the site's tools for AI assistants and AI search (llmstxt.org format).
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: public, max-age=3600');
    echo tf_llms_txt();
    exit;
}
if ($path === '.well-known/security.txt') {
    // Where to report a security problem (RFC 9116). Only when a real contact email is set in the admin panel.
    $mail = trim(tf_settings()['contact_email']) ?: trim(tf_site()['site']['email'] ?? '');
    if ($mail !== '') {
        header('Content-Type: text/plain; charset=utf-8');
        echo "Contact: mailto:$mail\nExpires: " . gmdate('Y-m-d\TH:i:s\Z', strtotime('+1 year')) . "\nPreferred-Languages: en\nCanonical: " . tf_base_url() . "/.well-known/security.txt\n";
        exit;
    }
}
if ($path === 'ads.txt') {
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: public, max-age=3600');
    echo tf_ads_txt();
    exit;
}
if ($path === 'manifest.webmanifest') {
    header('Content-Type: application/manifest+json; charset=utf-8');
    header('Cache-Control: public, max-age=86400');
    echo tf_manifest();
    exit;
}
if ($path === 'sw.js') {
    // Service worker: lets phones install the site as an app and shows a friendly page when offline.
    header('Content-Type: application/javascript; charset=utf-8');
    header('Cache-Control: no-cache');
    echo tf_service_worker();
    exit;
}
if (preg_match('~^icon-(48|180|192|512)\.png$~', $path, $m) || $path === 'favicon.ico') {
    require __DIR__ . '/app/og.php';
    tf_icon_serve((int) ($m[1] ?? 48));
}
if ($path === 'tools.json') {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: public, max-age=600');
    echo tf_tools_json();
    exit;
}
if (preg_match('~^og/([a-z0-9-]+)\.png$~', $path, $m)) {
    require __DIR__ . '/app/og.php';
    tf_og_serve($m[1]);
}
// IndexNow key file
$key = tf_settings()['indexnow_key'];
if ($key !== '' && $path === $key . '.txt') {
    header('Content-Type: text/plain; charset=utf-8');
    echo $key;
    exit;
}
// Hosted QR codes: /q/<code>
if (preg_match('~^q/([A-Za-z0-9]{4,12})(?:/(file|manage))?$~', $path, $m)) {
    require __DIR__ . '/app/qr.php';
    tf_qr_route($m[1], $m[2] ?? '');
    exit;
}
// Old or alternative addresses → the clean URL
if (preg_match('/^(.+)\.html$/', $path, $m) || $path === 'index' || $path === 'index.php') {
    $to = ($m[1] ?? 'index') === 'index' ? 'index' : $m[1];
    header('Location: ' . tf_url($to), true, 301);
    exit;
}

tf_layout_globals();
header('Content-Type: text/html; charset=utf-8');
// Browsers recheck pages after 5 minutes; the CDN may keep a copy for an hour and serve it while it refreshes in the
// background, so most visitors get a page without waiting for PHP. After a big change, purge the CDN in hPanel.
header('Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');

if ($path === '') {
    echo tf_page_home();
    exit;
}
if ($html = tf_page_simple($path)) {
    echo $html;
    exit;
}
if (($c = tf_category($path)) && $c['slug'] === $path && array_filter(tf_tools(), fn($t) => $t['category'] === $c['id'])) {
    echo tf_page_category($c);
    exit;
}
$tool = tf_tool_on($path) ? tf_tool($path) : null;
if ($tool) {
    if (tf_tool_isolated($tool)) {
        header('Cross-Origin-Opener-Policy: same-origin');
        header('Cross-Origin-Embedder-Policy: credentialless');
    }
    echo tf_page_tool($tool);
    exit;
}
http_response_code(404);
header('Cache-Control: no-store');
echo tf_page_404();
