<?php
// Front controller: every page request comes here (see .htaccess) and is rendered from the tools folder.
declare(strict_types=1);
define('TF_BASE', rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/'));
require __DIR__ . '/app/bootstrap.php';
require __DIR__ . '/app/render.php';

$path = rawurldecode((string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH));
if (TF_BASE !== '' && str_starts_with($path, TF_BASE)) $path = substr($path, strlen(TF_BASE));
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
$tool = tf_tool_on($path) ? tf_tool($path) : null;
if ($tool) {
    echo tf_page_tool($tool);
    exit;
}
http_response_code(404);
header('Cache-Control: no-store');
echo tf_page_404();
