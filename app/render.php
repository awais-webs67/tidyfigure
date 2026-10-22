<?php
// Page templates: the shared layout, tool pages, the homepage, simple pages, the sitemap and robots.txt.
declare(strict_types=1);

const TF_FONTS = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap';

function tf_strip(string $html): string
{
    return trim(preg_replace('/\s+/u', ' ', strip_tags($html)));
}

function tf_ld(array $obj): string
{
    return '<script type="application/ld+json">' . json_encode($obj, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . '</script>';
}

function tf_tile(array $t, string $cls = ''): string
{
    return '<span class="tile ' . $cls . '" data-cat="' . h($t['category']) . '">' . tf_icon($t['icon'] ?? 'circle') . '</span>';
}

// Turns <a href="/some-tool"> inside article text into a link that works wherever the site is installed.
function tf_links(string $html): string
{
    return preg_replace_callback('~href="/([a-z0-9-]+)"~', fn($m) => 'href="' . h(tf_url($m[1])) . '"', $html);
}

// The full HTML document around a page body.
// $o: title, description, slug, schema (array of JSON-LD objects), noindex, scripts (HTML before </body>)
function tf_layout(array $o, string $body): string
{
    $site = tf_site();
    $s = tf_settings();
    $canonical = h(tf_base_url() . ($o['slug'] === 'index' ? '/' : '/' . $o['slug']));

    $head = '';
    if (!empty($o['noindex'])) $head .= '<meta name="robots" content="noindex">' . "\n";
    if (preg_match('/^G-[A-Z0-9]+$/', $s['analytics_id'])) {
        $id = $s['analytics_id'];
        $head .= "<script async src=\"https://www.googletagmanager.com/gtag/js?id=$id\"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','$id');</script>\n";
    }
    if (preg_match('/^ca-pub-\d+$/', $s['adsense_client'])) {
        $head .= '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' . $s['adsense_client'] . '" crossorigin="anonymous"></script>' . "\n";
    }
    $head .= $s['head_code'];

    $announce = '';
    if (trim($s['announcement_text']) !== '') {
        $link = trim($s['announcement_link']);
        $announce = '<div class="announce">' . h($s['announcement_text']) . ($link !== '' ? ' <a href="' . h($link) . '">Learn more →</a>' : '') . '</div>';
    }

    $logo = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="4" fill="var(--slate)"/><path d="M9 11h14M16 11v12" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="23" cy="22" r="2.6" fill="var(--accent)"/></svg>';
    $name = h($site['site']['name']);
    $brand = preg_match('/^(\w+?)(Figure)$/', $site['site']['name'], $m) ? h($m[1]) . '<b>' . h($m[2]) . '</b>' : $name;
    $nav = '';
    foreach ($site['categories'] as $c) {
        $nav .= '<a href="' . h(tf_url()) . '#' . $c['id'] . '" data-cat="' . $c['id'] . '"' . (empty($c['primary']) ? ' class="more"' : '') . '>' . tf_icon($c['icon']) . h($c['nav']) . '</a>';
    }
    $tools = tf_tools();
    $footer = '';
    foreach ($site['categories'] as $c) {
        $links = '';
        foreach (array_slice(array_filter($tools, fn($t) => $t['category'] === $c['id']), 0, 5) as $t) $links .= '<li><a href="' . h(tf_url($t['slug'])) . '">' . h($t['name']) . '</a></li>';
        if ($links) $footer .= '<div><h2>' . h($c['name']) . '</h2><ul>' . $links . "</ul></div>\n";
    }
    $by = '<a href="' . h($site['site']['by_url']) . '" rel="noopener">' . h($site['site']['by']) . '</a>';
    $schema = implode("\n", array_map('tf_ld', $o['schema'] ?? []));
    $t = h($o['title']);
    $d = h($o['description']);
    $year = date('Y');
    $base = json_encode(TF_BASE);

    return <<<HTML
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>$t</title>
<meta name="description" content="$d">
<link rel="canonical" href="{$canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="$name">
<meta property="og:title" content="$t">
<meta property="og:description" content="$d">
<meta property="og:url" content="{$canonical}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#FF5B35">
<link rel="icon" href="{$GLOBALS['tf_favicon']}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{$GLOBALS['tf_fonts']}">
<link rel="stylesheet" href="{$GLOBALS['tf_css']}">
$schema
<script>window.TF_BASE = $base;</script>
$head
</head>
<body>
<header class="site"><div class="wrap">
<a class="brand" href="{$GLOBALS['tf_home']}">$logo<span>$brand</span></a>
<button type="button" class="nav-toggle" aria-expanded="false" aria-controls="main-nav"><svg class="bars" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><svg class="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>Menu</button>
<nav class="main-nav" id="main-nav" aria-label="Main">{$nav}<a class="cta" href="{$GLOBALS['tf_home']}#tools">All tools</a></nav>
</div></header><div class="nav-shade"></div>
$announce
$body
<footer class="foot"><div class="wrap">
$footer<div class="legal"><span>© $year $name. Free online tools, built by $by. Your files never leave your device.</span>
<span><a href="{$GLOBALS['tf_about']}">About</a> · <a href="{$GLOBALS['tf_privacy']}">Privacy</a> · <a href="{$GLOBALS['tf_home']}#tools">All tools</a></span></div>
</div></footer>
<script>(function(){var b=document.querySelector('.nav-toggle'),r=document.documentElement;if(!b)return;function set(o){r.classList.toggle('nav-open',o);b.setAttribute('aria-expanded',o)}b.addEventListener('click',function(){set(!r.classList.contains('nav-open'))});document.querySelector('.nav-shade').addEventListener('click',function(){set(false)});document.querySelectorAll('.main-nav a').forEach(function(a){a.addEventListener('click',function(){set(false)})});document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)})})();</script>
{$o['scripts']}
{$s['body_code']}
</body>
</html>

HTML;
}

function tf_layout_globals(): void
{
    $GLOBALS['tf_favicon'] = h(tf_asset('favicon.svg'));
    $GLOBALS['tf_css'] = h(tf_asset('style.css'));
    $GLOBALS['tf_fonts'] = h(TF_FONTS);
    $GLOBALS['tf_home'] = h(tf_url());
    $GLOBALS['tf_about'] = h(tf_url('about'));
    $GLOBALS['tf_privacy'] = h(tf_url('privacy'));
}

function tf_ad(string $slot): string
{
    $code = trim(tf_settings()['ad_' . $slot] ?? '');
    return $code !== '' ? "<div class=\"ad-slot ad-$slot\">$code</div>" : '';
}

// Title and description, with the admin panel's overrides applied.
function tf_seo(string $slug, string $title, string $description): array
{
    if ($slug === 'index') {
        $s = tf_settings();
        return [trim($s['home_title']) ?: $title, trim($s['home_description']) ?: $description, false];
    }
    $o = tf_tool_settings()[$slug] ?? [];
    return [trim((string) ($o['title'] ?? '')) ?: $title, trim((string) ($o['description'] ?? '')) ?: $description, !empty($o['noindex'])];
}

function tf_page_tool(array $t): string
{
    $site = tf_site();
    $cat = null;
    foreach ($site['categories'] as $c) if ($c['id'] === $t['category']) $cat = $c;
    $cat ??= ['id' => $t['category'], 'name' => 'Tools'];
    $all = tf_tools();
    $same = array_slice(array_filter($all, fn($x) => $x['category'] === $t['category'] && $x['slug'] !== $t['slug']), 0, 7, true);
    $related = array_filter(array_map(fn($r) => $all[$r] ?? null, $t['related'] ?? []), fn($x) => $x && !isset($same[$x['slug']]));
    $relSlugs = array_column($related, 'slug');
    $popular = array_slice(array_filter($all, fn($x) => !empty($x['popular']) && $x['slug'] !== $t['slug'] && !isset($same[$x['slug']]) && !in_array($x['slug'], $relSlugs, true)), 0, 6 - min(count($related), 6));
    [$title, $desc, $noindex] = tf_seo($t['slug'], $t['title'], $t['description']);
    $abs = fn($slug) => tf_base_url() . ($slug === 'index' ? '/' : '/' . $slug);

    $schema = [
        [
            '@context' => 'https://schema.org', '@type' => 'WebApplication', 'name' => $t['name'], 'url' => $abs($t['slug']),
            'description' => $desc, 'applicationCategory' => $t['appCategory'] ?? 'UtilitiesApplication', 'operatingSystem' => 'Any (runs in a web browser)',
            'browserRequirements' => 'Requires JavaScript', 'isAccessibleForFree' => true, 'offers' => ['@type' => 'Offer', 'price' => '0', 'priceCurrency' => 'USD'],
            'publisher' => ['@type' => 'Organization', 'name' => $site['site']['name'], 'url' => $abs('index')],
        ],
        ['@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => array_map(fn($f) => ['@type' => 'Question', 'name' => $f[0], 'acceptedAnswer' => ['@type' => 'Answer', 'text' => tf_strip($f[1])]], $t['faqs'])],
        [
            '@context' => 'https://schema.org', '@type' => 'BreadcrumbList',
            'itemListElement' => [
                ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $abs('index')],
                ['@type' => 'ListItem', 'position' => 2, 'name' => $cat['name'], 'item' => $abs('index') . '#' . $cat['id']],
                ['@type' => 'ListItem', 'position' => 3, 'name' => $t['name'], 'item' => $abs($t['slug'])],
            ],
        ],
    ];
    $side = fn($x) => '<li><a href="' . h(tf_url($x['slug'])) . '">' . tf_tile($x) . h($x['name']) . '</a></li>';
    $faqs = implode("\n", array_map(fn($f) => '<details class="faq"><summary>' . h($f[0]) . '</summary><p>' . $f[1] . '</p></details>', $t['faqs']));
    $more = array_merge(array_values($related), array_values($popular));
    $body = '<main class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="' . h(tf_url()) . '">Home</a><span aria-hidden="true">/</span><a href="' . h(tf_url()) . '#' . h($cat['id']) . '">' . h($cat['name']) . '</a><span aria-hidden="true">/</span><span>' . h($t['name']) . '</span></nav>
<div class="tool-head">' . tf_tile($t, 'lg') . '<h1>' . h($t['name']) . '</h1></div>
<p class="answer">' . $t['answer'] . '</p>
<section class="tool" aria-label="' . h($t['name']) . '">
' . $t['html'] . '
</section>
' . tf_ad('top') . '
<p class="private">' . tf_icon('shield-check') . (!empty($t['files']) ? 'Your files are processed on your device and never uploaded.' : 'Everything runs in your browser. Nothing you type is sent anywhere.') . '</p>
<div class="layout">
<article class="prose">
' . tf_links($t['article']) . '
' . tf_ad('article') . '
<h2>Frequently asked questions</h2>
' . $faqs . '
</article>
<aside class="side">
' . tf_ad('side') . '
' . ($same ? '<section aria-labelledby="side-a"><h2 id="side-a">More ' . h(strtolower($cat['name'])) . '</h2><ul>' . implode('', array_map($side, $same)) . '</ul></section>' : '') . '
' . ($more ? '<section aria-labelledby="side-b"><h2 id="side-b">You might also need</h2><ul>' . implode('', array_map($side, array_slice($more, 0, 6))) . '</ul></section>' : '') . '
</aside>
</div>
</main>';
    $scripts = '';
    foreach ($t['libs'] ?? [] as $src) $scripts .= '<script src="' . h($src) . '"></script>' . "\n";
    $scripts .= '<script src="' . h(tf_asset('app.js')) . '"></script>' . "\n";
    foreach ($t['scripts'] ?? [] as $f) $scripts .= '<script src="' . h(tf_asset($f)) . '"></script>' . "\n";
    $scripts .= "<script>\n(function () {\n" . $t['js'] . "\n})();\n</script>";
    return tf_layout(['title' => $title, 'description' => $desc, 'slug' => $t['slug'], 'schema' => $schema, 'noindex' => $noindex, 'scripts' => $scripts], $body);
}

function tf_page_home(): string
{
    $site = tf_site();
    $tools = tf_tools();
    $n = count($tools);
    $name = $site['site']['name'];
    [$title, $desc] = tf_seo('index', "$name: Free Online Tools for Images, PDFs, Text & More", "$n free online tools that run in your browser: compress images, merge PDFs, count words, make QR codes, calculate percentages and more. No sign-up.");
    $abs = fn($slug) => tf_base_url() . ($slug === 'index' ? '/' : '/' . $slug);
    $i = 0;
    $schema = [
        ['@context' => 'https://schema.org', '@type' => 'WebSite', 'name' => $name, 'url' => $abs('index'), 'description' => $desc],
        ['@context' => 'https://schema.org', '@type' => 'Organization', 'name' => $name, 'url' => $abs('index'), 'logo' => tf_base_url() . '/assets/favicon.svg'],
        ['@context' => 'https://schema.org', '@type' => 'ItemList', 'name' => "$name tools", 'itemListElement' => array_values(array_map(function ($t) use (&$i, $abs) { return ['@type' => 'ListItem', 'position' => ++$i, 'url' => $abs($t['slug']), 'name' => $t['name']]; }, $tools))],
    ];
    $card = fn($t) => '<li data-name="' . h(mb_strtolower($t['name'] . ' ' . $t['short'] . ' ' . ($t['keywords'] ?? ''))) . '"><a class="card" data-cat="' . h($t['category']) . '" href="' . h(tf_url($t['slug'])) . '">' . tf_tile($t) . '<div><strong>' . h($t['name']) . '</strong><span>' . h($t['short']) . '</span>' . (!empty($t['popular']) ? '<em class="badge">Popular</em>' : '') . '</div></a></li>';
    $cats = '';
    $chips = '';
    foreach ($site['categories'] as $c) {
        $list = array_filter($tools, fn($t) => $t['category'] === $c['id']);
        if (!$list) continue;
        $chips .= '<a href="#' . $c['id'] . '" data-cat="' . $c['id'] . '">' . tf_icon($c['icon']) . h($c['nav']) . '</a>';
        $cats .= '<section class="cat" id="' . $c['id'] . '" aria-labelledby="h-' . $c['id'] . '"><div class="cat-head"><h2 id="h-' . $c['id'] . '">' . h($c['name']) . '</h2><p>' . h($c['blurb']) . '</p></div><ul class="cards">' . implode('', array_map($card, $list)) . "</ul></section>\n";
    }
    $body = '<main class="wrap">
<section class="hero">
<p class="eyebrow">' . $n . ' free tools · no sign-up</p>
<h1>Free online tools that <em>just work</em>.</h1>
<p>' . $n . ' fast, private tools for images, PDFs, video, text, numbers and everyday life. No sign-up, no watermarks, and your files never leave your device.</p>
<div class="search" role="search">' . tf_icon('search') . '<label class="sr-only" for="q">Search tools</label><input id="q" type="search" placeholder="Search ' . $n . ' tools, e.g. compress image, word count, QR code" autocomplete="off"></div>
<ul class="stats"><li>' . tf_icon('shield-check') . 'Files stay on your device</li><li>' . tf_icon('zap') . 'Instant results</li><li>' . tf_icon('smartphone') . 'Works on any phone</li><li>' . tf_icon('badge-check') . '100% free</li></ul>
<nav class="catnav" aria-label="Categories">' . $chips . '</nav>
</section>
<div id="tools">
' . $cats . '<p class="no-results" id="none" hidden>No tool matches that search yet.</p>
</div>
</main>';
    $js = <<<'JS'
<script>
(function () {
  var q = document.getElementById('q');
  q.addEventListener('input', function () {
    var v = q.value.trim().toLowerCase(), any = false;
    document.querySelectorAll('#tools .cat').forEach(function (sec) {
      var shown = 0;
      sec.querySelectorAll('li[data-name]').forEach(function (li) {
        var hit = !v || v.split(/\s+/).every(function (w) { return li.dataset.name.indexOf(w) > -1; });
        li.hidden = !hit; if (hit) shown++;
      });
      sec.hidden = !shown; if (shown) any = true;
    });
    document.getElementById('none').hidden = any;
  });
})();
</script>
JS;
    return tf_layout(['title' => $title, 'description' => $desc, 'slug' => 'index', 'schema' => $schema, 'scripts' => $js], $body);
}

function tf_page_simple(string $slug): ?string
{
    $site = tf_site();
    $name = h($site['site']['name']);
    $email = h(trim(tf_settings()['contact_email']) ?: $site['site']['email']);
    $n = count(tf_tools());
    $pages = [
        'about' => ["About {$site['site']['name']}", "{$site['site']['name']} makes fast, free online tools for images, PDFs, text and everyday maths. Everything runs in your browser, so your files stay private.", "
<h1>About $name</h1>
<p>$name is a collection of $n free online tools for the small jobs that come up every day: shrinking a photo for an email, merging two PDFs, counting the words in an essay, making a QR code, or working out a percentage.</p>
<p>Every tool runs entirely in your web browser. When you compress an image or merge a PDF, the file is processed on your own device and is never uploaded to a server. That makes the tools faster and keeps your files private.</p>
<h2>Accuracy</h2>
<p>Calculator pages explain the formula they use and show a worked example, so you can check the result yourself. For legal, medical or financial decisions, please check with a qualified professional.</p>
<h2>Contact</h2>
<p>Found a bug or want a new tool? Email <strong>$email</strong>.</p>"],
        'privacy' => ["Privacy Policy | {$site['site']['name']}", "How {$site['site']['name']} handles your data: files and text are processed in your browser and are never uploaded or stored on our servers.", '
<h1>Privacy policy</h1>
<h2>Your files and text</h2>
<p>All tools run in your browser. Files you open (images, PDFs, videos) and text you type are processed on your device. They are not uploaded to us or stored on our servers. The only exception is the YouTube Subscriber Counter, which sends the channel name you enter to our server so it can ask YouTube for the public subscriber count.</p>
<h2>Analytics and advertising</h2>
<p>We may use analytics to count page visits, and we may show advertising to keep the tools free. Advertising partners such as Google may use cookies to show ads based on your visits to this and other websites. You can opt out of personalised advertising at <a href="https://adssettings.google.com" rel="nofollow">Google Ad Settings</a>.</p>
<h2>Contact</h2>
<p>Questions about privacy: <strong>' . $email . '</strong>.</p>'],
    ];
    if (!isset($pages[$slug])) return null;
    [$title, $desc, $inner] = $pages[$slug];
    return tf_layout(['title' => $title, 'description' => $desc, 'slug' => $slug, 'schema' => [['@context' => 'https://schema.org', '@type' => 'WebPage', 'name' => $title, 'url' => tf_base_url() . '/' . $slug]], 'scripts' => ''], '<main class="wrap"><article class="prose page">' . $inner . '</article></main>');
}

function tf_page_404(): string
{
    $n = count(tf_tools());
    return tf_layout(['title' => 'Page not found | ' . tf_site()['site']['name'], 'description' => 'This page does not exist.', 'slug' => 'index', 'schema' => [], 'noindex' => true, 'scripts' => ''],
        '<main class="wrap"><article class="prose page"><h1>Page not found</h1><p>That page doesn’t exist. <a href="' . h(tf_url()) . '">See all ' . $n . ' tools</a>.</p></article></main>');
}

function tf_sitemap(): string
{
    $url = tf_base_url();
    $ts = tf_tool_settings();
    $rows = [['/', time()]];
    foreach (tf_tools() as $t) {
        if (!empty($ts[$t['slug']]['noindex'])) continue;
        $rows[] = ['/' . $t['slug'], (int) @filemtime(TF_ROOT . '/tools/' . $t['slug'] . '/meta.php')];
    }
    $rows[] = ['/about', (int) @filemtime(TF_ROOT . '/app/render.php')];
    $rows[] = ['/privacy', (int) @filemtime(TF_ROOT . '/app/render.php')];
    $x = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($rows as [$p, $m]) $x .= '  <url><loc>' . h($url . $p) . '</loc><lastmod>' . date('Y-m-d', $m ?: time()) . "</lastmod></url>\n";
    return $x . "</urlset>\n";
}

function tf_robots(): string
{
    $b = TF_BASE;
    return "User-agent: *\nAllow: /\nDisallow: $b/admin/\nDisallow: $b/install/\nDisallow: $b/api/\n\nSitemap: " . tf_base_url() . "/sitemap.xml\n";
}
