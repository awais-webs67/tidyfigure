<?php
// Front controller: serves the prebuilt pages in /pages and applies the admin panel's settings
// (SEO overrides, disabled tools, ads, analytics, announcement bar). Also serves sitemap.xml and robots.txt.
declare(strict_types=1);
require __DIR__ . '/inc/lib.php';

$path = rawurldecode((string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH));
$base = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/');
if ($base !== '' && str_starts_with($path, $base)) $path = substr($path, strlen($base));
$path = trim($path, '/');

if ($path === 'sitemap.xml') { tf_sitemap(); exit; }
if ($path === 'robots.txt') {
    header('Content-Type: text/plain; charset=utf-8');
    echo "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: " . tf_base_url() . "/sitemap.xml\n";
    exit;
}

// /word-counter.html and /index → canonical clean URL
if (preg_match('/^(.+)\.html$/', $path, $m) || $path === 'index') {
    $to = ($m[1] ?? 'index') === 'index' ? '/' : '/' . $m[1];
    header('Location: ' . $base . $to, true, 301);
    exit;
}

$slug = $path === '' ? 'index' : $path;
$file = __DIR__ . '/pages/' . $slug . '.html';
if (!preg_match('/^[a-z0-9-]+$/', $slug) || !is_file($file) || $slug === '404' || tf_tool_off($slug)) {
    http_response_code(404);
    $slug = '404';
    $file = __DIR__ . '/pages/404.html';
}

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: public, max-age=300');
echo tf_render((string) file_get_contents($file), $slug);

function tf_render(string $html, string $slug): string
{
    $s = tf_settings();

    // Pages are built with a placeholder domain; canonical and og:url follow the real one.
    $built = rtrim((string) (tf_tools()['site']['domain'] ?? ''), '/');
    if ($built !== '') $html = str_replace($built, tf_base_url(), $html);

    // SEO overrides from the admin panel
    $o = $slug === 'index' ? $s['home'] : ($s['tools'][$slug] ?? []);
    if (!empty($o['title'])) {
        $t = h($o['title']);
        $html = preg_replace('~<title>.*?</title>~s', "<title>$t</title>", $html, 1);
        $html = preg_replace('~(<meta property="og:title" content=")[^"]*(")~', '${1}' . $t . '$2', $html, 1);
    }
    if (!empty($o['description'])) {
        $d = h($o['description']);
        $html = preg_replace('~(<meta name="description" content=")[^"]*(")~', '${1}' . $d . '$2', $html, 1);
        $html = preg_replace('~(<meta property="og:description" content=")[^"]*(")~', '${1}' . $d . '$2', $html, 1);
    }

    // Head: robots, analytics, AdSense, custom code
    $head = '';
    if (!empty($o['noindex']) || $slug === '404') $head .= '<meta name="robots" content="noindex">' . "\n";
    if (preg_match('/^G-[A-Z0-9]+$/', $s['analytics_id'])) {
        $id = $s['analytics_id'];
        $head .= "<script async src=\"https://www.googletagmanager.com/gtag/js?id=$id\"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','$id');</script>\n";
    }
    if (preg_match('/^ca-pub-\d+$/', $s['adsense_client'])) {
        $head .= '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' . $s['adsense_client'] . '" crossorigin="anonymous"></script>' . "\n";
    }
    $head .= $s['head_code'];
    $html = str_replace('<!--TF:HEAD-->', $head, $html);

    // Announcement bar
    $a = $s['announcement'];
    $bar = '';
    if (trim($a['text']) !== '') {
        $bar = '<div class="announce">' . h($a['text']) . (trim($a['link']) !== '' ? ' <a href="' . h($a['link']) . '">Learn more →</a>' : '') . '</div>';
    }
    $html = str_replace('<!--TF:BODY_TOP-->', $bar, $html);

    // Ad slots
    foreach (['top', 'article', 'side'] as $slot) {
        $code = trim($s['ads'][$slot] ?? '');
        $html = str_replace("<!--TF:AD:$slot-->", $code !== '' ? "<div class=\"ad-slot ad-$slot\">$code</div>" : '', $html);
    }
    $html = str_replace('<!--TF:BODY_END-->', $s['body_code'], $html);

    // Hide links to switched-off tools (homepage cards, sidebars, footer)
    foreach ($s['tools'] as $tslug => $t) {
        if (!empty($t['off'])) {
            $html = preg_replace('~<li data-slug="' . preg_quote((string) $tslug, '~') . '".*?</li>~s', '', $html);
        }
    }
    return $html;
}

function tf_sitemap(): void
{
    header('Content-Type: application/xml; charset=utf-8');
    $url = tf_base_url();
    $mod = date('Y-m-d', max(tf_settings()['updated'], (int) @filemtime(TF_DATA . '/tools.json')));
    $slugs = ['index'];
    foreach (tf_tools()['tools'] as $t) {
        $o = tf_settings()['tools'][$t['slug']] ?? [];
        if (empty($o['off']) && empty($o['noindex'])) $slugs[] = $t['slug'];
    }
    array_push($slugs, 'about', 'privacy');
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($slugs as $sl) {
        echo '  <url><loc>' . h($url . ($sl === 'index' ? '/' : '/' . $sl)) . "</loc><lastmod>$mod</lastmod></url>\n";
    }
    echo "</urlset>\n";
}
