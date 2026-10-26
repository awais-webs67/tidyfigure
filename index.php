<?php
// Front controller: every page request comes here (see .htaccess) and is rendered from the tools folder.
declare(strict_types=1);
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
    header('Content-Type: application/xml; charset=utf-8');
    echo tf_sitemap();
    exit;
}
if ($path === 'robots.txt') {
    header('Content-Type: text/plain; charset=utf-8');
    echo tf_robots();
    exit;
}
if ($path === 'manifest.webmanifest') {
    header('Content-Type: application/manifest+json; charset=utf-8');
    header('Cache-Control: public, max-age=86400');
    echo tf_manifest();
    exit;
}
if (preg_match('~^icon-(180|192|512)\.png$~', $path, $m)) {
    require __DIR__ . '/app/og.php';
    tf_icon_serve((int) $m[1]);
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
header('Cache-Control: public, max-age=300');

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
