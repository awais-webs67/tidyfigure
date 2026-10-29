<?php
// Page templates: the shared layout, tool pages, category pages, the homepage, simple pages,
// the sitemap, robots.txt and the tool list used by the quick search.
declare(strict_types=1);

// Web fonts are hosted with the site (assets/fonts/web, SIL Open Font License): no trip to Google before the page can
// show, and the two fonts every page needs are preloaded. "Inter Fallback" is a local font stretched to Inter's size,
// so text doesn't jump when Inter arrives.
function tf_font_head(): string
{
    $u = fn($f) => TF_BASE . '/assets/fonts/web/' . $f . '.woff2';
    $latin = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
    $ext = 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF';
    $css = '';
    foreach ([['Inter', 'inter', '400 700'], ['Bebas Neue', 'bebas-neue', '400'], ['JetBrains Mono', 'jetbrains-mono', '500 700']] as [$fam, $file, $w]) {
        foreach (['latin' => $latin, 'latin-ext' => $ext] as $sub => $range) {
            $css .= "@font-face{font-family:\"$fam\";font-style:normal;font-weight:$w;font-display:swap;src:url(" . $u("$file-$sub") . ") format(\"woff2\");unicode-range:$range}";
        }
    }
    $css .= '@font-face{font-family:"Inter Fallback";src:local("Arial"),local("Helvetica"),local("Liberation Sans"),local("Roboto");size-adjust:107.12%;ascent-override:90.44%;descent-override:22.52%;line-gap-override:0%}';
    return '<link rel="preload" href="' . h($u('inter-latin')) . '" as="font" type="font/woff2" crossorigin>' . "\n"
        . '<link rel="preload" href="' . h($u('bebas-neue-latin')) . '" as="font" type="font/woff2" crossorigin>' . "\n"
        . "<style>$css</style>";
}

function tf_strip(string $html): string
{
    return trim(preg_replace('/\s+/u', ' ', strip_tags($html)));
}

function tf_ld(array $obj): string
{
    return '<script type="application/ld+json">' . json_encode($obj, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . '</script>';
}

function tf_abs(string $slug = 'index'): string
{
    return tf_base_url() . ($slug === 'index' ? '/' : '/' . $slug);
}

function tf_tile(array $t, string $cls = ''): string
{
    return '<span class="tile ' . $cls . '" data-cat="' . h($t['category'] ?? $t['id'] ?? '') . '">' . tf_icon($t['icon'] ?? 'circle') . '</span>';
}

// Turns <a href="/some-tool"> inside article text into a link that works wherever the site is installed.
function tf_links(string $html): string
{
    return preg_replace_callback('~href="/([a-z0-9-]+)"~', fn($m) => 'href="' . h(tf_url($m[1])) . '"', $html);
}

function tf_social_profiles(): array
{
    return array_values(array_filter(array_map('trim', preg_split('/\R/', tf_settings()['social_profiles'])), fn($u) => preg_match('~^https?://~', $u)));
}

function tf_faq_html(array $faqs): string
{
    return implode("\n", array_map(fn($f) => '<details class="faq"><summary>' . h($f[0]) . '</summary><p>' . $f[1] . '</p></details>', $faqs));
}

function tf_faq_schema(array $faqs): array
{
    return ['@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => array_map(fn($f) => ['@type' => 'Question', 'name' => tf_strip($f[0]), 'acceptedAnswer' => ['@type' => 'Answer', 'text' => tf_strip($f[1])]], $faqs)];
}

function tf_breadcrumbs(array $items): array
{
    $i = 0;
    return ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => array_map(function ($it) use (&$i) { return ['@type' => 'ListItem', 'position' => ++$i, 'name' => $it[0], 'item' => $it[1]]; }, $items)];
}

// The full HTML document around a page body.
// $o: title, description, slug (for canonical/og), schema (JSON-LD objects), noindex, scripts (HTML before </body>), og (image URL)
function tf_layout(array $o, string $body): string
{
    $site = tf_site();
    $s = tf_settings();
    // A null slug (the 404 page) gets no canonical or og:url.
    $canonical = $o['slug'] === null ? '' : h(tf_abs($o['slug']));
    $og = h($o['og'] ?? tf_base_url() . '/og/' . (($o['slug'] ?? 'index') === 'index' ? 'home' : $o['slug']) . '.png');

    $head = '';
    // Indexable pages allow large image previews and full snippets (Google Discover, rich results).
    $head .= '<meta name="robots" content="' . (!empty($o['noindex']) ? 'noindex' : 'max-image-preview:large, max-snippet:-1, max-video-preview:-1') . '">' . "\n";
    if ($canonical !== '') $head .= "<link rel=\"canonical\" href=\"$canonical\">\n<meta property=\"og:url\" content=\"$canonical\">\n";
    foreach (['verify_google' => 'google-site-verification', 'verify_bing' => 'msvalidate.01', 'verify_yandex' => 'yandex-verification', 'verify_pinterest' => 'p:domain_verify'] as $k => $meta) {
        // Accept either the code or the whole <meta> tag pasted from the search engine.
        $v = trim($s[$k]);
        if (preg_match('/content="([^"]+)"/', $v, $m)) $v = $m[1];
        if ($v !== '' && preg_match('/^[\w.\-=]+$/', $v)) $head .= '<meta name="' . $meta . '" content="' . h($v) . '">' . "\n";
    }
    if (preg_match('/^G-[A-Z0-9]+$/', $s['analytics_id'])) {
        $id = $s['analytics_id'];
        $head .= "<script async src=\"https://www.googletagmanager.com/gtag/js?id=$id\"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','$id');</script>\n";
    }
    if (preg_match('/^ca-pub-\d+$/', $s['adsense_client'])) $head .= '<meta name="google-adsense-account" content="' . $s['adsense_client'] . '">' . "\n";
    if (empty($o['noads']) && preg_match('/^ca-pub-\d+$/', $s['adsense_client'])) {
        $head .= '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' . $s['adsense_client'] . '" crossorigin="anonymous"></script>' . "\n";
    }
    // Hosts the page will fetch from later (the tool's libraries): connect early, download nothing yet.
    foreach (array_unique($o['preconnect'] ?? []) as $host) $head .= '<link rel="preconnect" href="' . h($host) . '">' . "\n";
    $head .= $s['head_code'];

    $announce = '';
    if (trim($s['announcement_text']) !== '') {
        $link = trim($s['announcement_link']);
        $announce = '<div class="announce">' . h($s['announcement_text']) . ($link !== '' ? ' <a href="' . h($link) . '">Learn more →</a>' : '') . '</div>';
    }

    $logo = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="4" fill="var(--slate)"/><path d="M9 11h14M16 11v12" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="23" cy="22" r="2.6" fill="var(--accent)"/></svg>';
    $name = h($site['site']['name']);
    $brand = preg_match('/^(\w+?)(Figure)$/', $site['site']['name'], $m) ? h($m[1]) . '<b>' . h($m[2]) . '</b>' : $name;
    $tools = tf_tools();
    $nav = '';
    foreach ($site['categories'] as $c) {
        $n = count(array_filter($tools, fn($t) => $t['category'] === $c['id']));
        if (!$n) continue;
        $nav .= '<a href="' . h(tf_url($c['slug'])) . '" data-cat="' . $c['id'] . '"' . (empty($c['primary']) ? ' class="more"' : '') . '>' . tf_icon($c['icon']) . '<span>' . h($c['nav']) . '</span><small>' . $n . '</small></a>';
    }
    $footer = '';
    foreach ($site['categories'] as $c) {
        $links = '';
        foreach (array_slice(array_filter($tools, fn($t) => $t['category'] === $c['id']), 0, 5) as $t) $links .= '<li><a href="' . h(tf_url($t['slug'])) . '">' . h($t['name']) . '</a></li>';
        if ($links) $footer .= '<div><p class="foot-h"><a href="' . h(tf_url($c['slug'])) . '">' . h($c['name']) . '</a></p><ul>' . $links . "</ul></div>\n";
    }
    $social = implode('', array_map(fn($u) => '<a href="' . h($u) . '" rel="noopener me">' . h(preg_replace('~^https?://(www\.)?([^/]+).*$~', '$2', $u)) . '</a>', tf_social_profiles()));
    $co = tf_company();
    $by = $co['url'] !== '' ? '<a href="' . h($co['url']) . '" rel="noopener">' . h($co['name']) . '</a>' : h($co['name']);
    $project = $co['name'] !== '' ? "<p class=\"foot-by\">$name is a project by <strong>$by</strong>.</p>" : '';
    $legalBy = $co['name'] !== '' ? " A project by $by." : '';
    $schema = implode("\n", array_map('tf_ld', $o['schema'] ?? []));
    $t = h($o['title']);
    $d = h($o['description']);
    $year = date('Y');
    $base = json_encode(TF_BASE);
    $install = ($s['app_install'] ?? '1') === '1' ? '1' : '0';
    $g = $GLOBALS;
    $iconSearch = tf_icon('search');

    return <<<HTML
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>$t</title>
<meta name="description" content="$d">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_US">
<meta property="og:site_name" content="$name">
<meta property="og:title" content="$t">
<meta property="og:description" content="$d">
<meta property="og:image" content="$og">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="$t">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="$t">
<meta name="twitter:description" content="$d">
<meta name="twitter:image" content="$og">
<meta name="theme-color" content="#FF5B35">
<link rel="icon" href="{$g['tf_favicon']}" type="image/svg+xml">
<link rel="icon" href="{$g['tf_icon48']}" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="{$g['tf_touch']}">
<link rel="manifest" href="{$g['tf_manifest']}">
{$g['tf_fonts']}
<link rel="stylesheet" href="{$g['tf_css']}">
<script>window.TF_BASE=$base;window.TF_INSTALL=$install;try{var t=localStorage.getItem('tf-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
$schema
$head
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site" data-nosnippet><div class="wrap">
<a class="brand" href="{$g['tf_home']}" aria-label="$name home">$logo<span>$brand</span></a>
<nav class="main-nav" id="main-nav" aria-label="Tool categories">{$nav}<a class="cta" href="{$g['tf_home']}#categories">All tools</a><button type="button" class="nav-install" data-install hidden>Install app</button></nav>
<button type="button" class="hbtn search-btn" data-open-search aria-label="Search tools">$iconSearch<span>Search tools</span><kbd>Ctrl K</kbd></button>
<button type="button" class="hbtn theme-toggle" aria-label="Switch light or dark mode"><svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
<button type="button" class="nav-toggle" aria-expanded="false" aria-controls="main-nav"><svg class="bars" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><svg class="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>Menu</button>
</div></header><div class="nav-shade"></div>
<div class="qs" id="qs" hidden role="dialog" aria-modal="true" aria-label="Search tools"><div class="qs-box"><label class="qs-input">$iconSearch<input type="search" placeholder="Search {$g['tf_count']} tools…" aria-label="Search tools" autocomplete="off"><kbd>Esc</kbd></label><ul class="qs-list"></ul></div></div>
$announce
<div id="main">
$body
</div>
<footer class="foot" data-nosnippet><div class="wrap">
<div class="foot-brand"><a class="brand" href="{$g['tf_home']}">$logo<span>$brand</span></a><p>{$g['tf_count']} free online tools that run in your browser. Fast, private and free, with no sign-up.</p>$project<p class="foot-social">$social</p></div>
$footer<div class="legal"><span>© $year $name.$legalBy Files are processed on your device; only hosted QR codes are stored.</span>
<span><a href="{$g['tf_about']}">About</a> · <a href="{$g['tf_contact']}">Contact</a> · <a href="{$g['tf_privacy']}">Privacy</a> · <a href="{$g['tf_terms']}">Terms</a> · <a href="{$g['tf_home']}#categories">All tools</a></span></div>
</div></footer>
<script src="{$g['tf_sitejs']}" defer></script>
{$o['scripts']}
{$s['body_code']}
</body>
</html>

HTML;
}

function tf_layout_globals(): void
{
    $GLOBALS['tf_favicon'] = h(tf_asset('favicon.svg'));
    $GLOBALS['tf_touch'] = h(tf_url('icon-180.png'));
    $GLOBALS['tf_icon48'] = h(tf_url('icon-48.png'));
    $GLOBALS['tf_manifest'] = h(tf_url('manifest.webmanifest'));
    $GLOBALS['tf_css'] = h(tf_asset('style.css'));
    $GLOBALS['tf_sitejs'] = h(tf_asset('site.js'));
    $GLOBALS['tf_fonts'] = tf_font_head();
    $GLOBALS['tf_home'] = h(tf_url());
    $GLOBALS['tf_about'] = h(tf_url('about'));
    $GLOBALS['tf_privacy'] = h(tf_url('privacy'));
    $GLOBALS['tf_contact'] = h(tf_url('contact'));
    $GLOBALS['tf_terms'] = h(tf_url('terms'));
    $GLOBALS['tf_count'] = count(tf_tools());
}

function tf_ad(string $slot, bool $off = false): string
{
    $code = $off ? '' : trim(tf_settings()['ad_' . $slot] ?? '');
    return $code !== '' ? "<div class=\"ad-slot ad-$slot\">$code</div>" : '';
}

// Title and description, with the admin panel's overrides applied.
function tf_seo(string $slug, string $title, string $description): array
{
    $s = tf_settings();
    if ($slug === 'index') return [trim($s['home_title']) ?: $title, trim($s['home_description']) ?: $description, false];
    $o = tf_tool_settings()[$slug] ?? [];
    $t = trim((string) ($o['title'] ?? '')) ?: $title;
    $suffix = ' | ' . tf_site()['site']['name'];
    if ($s['title_suffix'] === '1' && mb_strlen($t . $suffix) <= 65) $t .= $suffix;
    return [$t, trim((string) ($o['description'] ?? '')) ?: $description, !empty($o['noindex'])];
}

function tf_card(array $t): string
{
    return '<li data-name="' . h(mb_strtolower($t['name'] . ' ' . $t['short'] . ' ' . ($t['keywords'] ?? ''))) . '"><a class="card" data-cat="' . h($t['category']) . '" href="' . h(tf_url($t['slug'])) . '">' . tf_tile($t) . '<div><strong>' . h($t['name']) . '</strong><span>' . h($t['short']) . '</span>' . (!empty($t['popular']) ? '<em class="badge">Popular</em>' : '') . '</div></a></li>';
}

function tf_share_html(): string
{
    $i = fn($d) => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' . $d . '"/></svg>';
    return '<div class="share"><span>Share this tool</span>'
        . '<a data-share="whatsapp" target="_blank" rel="noopener" aria-label="Share on WhatsApp">' . $i('M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.6 2 1.1 1 2 1.3 2.3 1.4.3.2.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z') . '</a>'
        . '<a data-share="x" target="_blank" rel="noopener" aria-label="Share on X">' . $i('M17.8 3h3.1l-6.8 7.7 8 10.3h-6.3l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.5 5.9L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z') . '</a>'
        . '<a data-share="facebook" target="_blank" rel="noopener" aria-label="Share on Facebook">' . $i('M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2H7.6v3.3h2.7V22H14v-10.2h2.7l.4-3.3H14z') . '</a>'
        . '<a data-share="linkedin" target="_blank" rel="noopener" aria-label="Share on LinkedIn">' . $i('M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z') . '</a>'
        . '<button type="button" data-share="copy" aria-label="Copy link"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg><b>Copied</b></button>'
        . '<button type="button" data-share="native" hidden aria-label="More sharing options"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13"/></svg></button></div>';
}

// Gives each file picker in a tool's markup an accessible name, so it has one before any script runs (assistive tech,
// AI agents, crawlers). The name is the visible text of the drop zone around it, the same rule app.js uses.
// Pickers that already have a label, aria-label or are hidden are left alone.
function tf_name_file_inputs(string $html): string
{
    return preg_replace_callback('~<input type="file"[^>]*>~', function ($m) use ($html) {
        $tag = $m[0][0];
        $pos = $m[0][1];
        if (preg_match('~\s(aria-label|aria-labelledby|hidden)[\s=>]~', $tag)) return $tag;
        if (preg_match('~\sid="([^"]+)"~', $tag, $id) && str_contains($html, 'for="' . $id[1] . '"')) return $tag;
        $before = substr($html, 0, $pos);
        if (strrpos($before, '<label') > (int) strrpos($before, '</label>')) return $tag; // wrapped in a <label>
        $zone = strrpos($before, 'class="drop');
        $name = '';
        $seg = $zone !== false ? substr($before, $zone) : '';
        // Only a drop zone that is still open around the picker counts (its <div> not yet closed).
        if ($seg !== '' && substr_count($seg, '</div>') <= substr_count($seg, '<div')) {
            if (preg_match('~<strong>(.*?)</strong>~s', $seg, $s)) $name = tf_strip($s[1]);
            elseif (preg_match('~aria-label="([^"]+)"~', $seg, $a)) $name = html_entity_decode($a[1], ENT_QUOTES);
        }
        if ($name === '') {
            $accept = preg_match('~accept="([^"]*)"~', $tag, $ac) ? $ac[1] : '';
            $name = str_contains($accept, 'pdf') ? 'Choose a PDF' : (str_starts_with($accept, 'image/') ? 'Choose an image' : (str_starts_with($accept, 'audio/') || str_starts_with($accept, 'video/') ? 'Choose an audio or video file' : 'Choose a file'));
        }
        return substr($tag, 0, -1) . ' aria-label="' . h(mb_substr($name, 0, 100)) . '">';
    }, $html, -1, $n, PREG_OFFSET_CAPTURE);
}

function tf_page_tool(array $t): string
{
    $site = tf_site();
    $cat = tf_category($t['category']) ?? ['id' => $t['category'], 'name' => 'Tools', 'slug' => '', 'icon' => 'circle'];
    $all = tf_tools();
    $same = array_slice(array_filter($all, fn($x) => $x['category'] === $t['category'] && $x['slug'] !== $t['slug']), 0, 7, true);
    $related = array_filter(array_map(fn($r) => $all[$r] ?? null, $t['related'] ?? []), fn($x) => $x && !isset($same[$x['slug']]));
    $relSlugs = array_column($related, 'slug');
    $popular = array_slice(array_filter($all, fn($x) => !empty($x['popular']) && $x['slug'] !== $t['slug'] && !isset($same[$x['slug']]) && !in_array($x['slug'], $relSlugs, true)), 0, 6 - min(count($related), 6));
    [$title, $desc, $noindex] = tf_seo($t['slug'], $t['title'], $t['description']);
    $noads = tf_tool_isolated($t);
    $updated = tf_tool_date($t);

    $schema = [
        [
            '@context' => 'https://schema.org', '@type' => 'WebApplication', '@id' => tf_abs($t['slug']) . '#app', 'name' => $t['name'], 'url' => tf_abs($t['slug']), 'inLanguage' => 'en', 'isPartOf' => ['@id' => tf_abs() . '#website'],
        ] + (!empty($t['aka']) ? ['alternateName' => array_values($t['aka'])] : []) + [
            'description' => $desc, 'applicationCategory' => $t['appCategory'] ?? 'UtilitiesApplication', 'operatingSystem' => 'Any (runs in a web browser)',
            'browserRequirements' => 'Requires JavaScript', 'isAccessibleForFree' => true, 'offers' => ['@type' => 'Offer', 'price' => '0', 'priceCurrency' => 'USD'],
            'dateModified' => date('Y-m-d', $updated), 'image' => tf_base_url() . '/og/' . $t['slug'] . '.png',
            // The same organisation as the homepage's (#org), named here too because the homepage's entry isn't on this page.
            'publisher' => ['@type' => 'Organization', '@id' => tf_abs() . '#org', 'name' => $site['site']['name'], 'url' => tf_abs()],
        ],
        tf_faq_schema($t['faqs']),
        tf_breadcrumbs([['Home', tf_abs()], [$cat['name'], tf_abs($cat['slug'])], [$t['name'], tf_abs($t['slug'])]]),
    ];
    $side = fn($x) => '<li><a href="' . h(tf_url($x['slug'])) . '">' . tf_tile($x) . h($x['name']) . '</a></li>';
    $more = array_merge(array_values($related), array_values($popular));
    $files = !empty($t['files']);
    $uploads = !empty($t['uploads']); // hosted QR codes: the server keeps what the visitor sends
    $days = (int) (tf_settings()['qr_days'] ?? 30);
    $chk = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
    $body = '<main class="wrap tool-page" data-cat="' . h($t['category']) . '"' . ($files && !$uploads ? ' data-local' : '') . '>
<nav class="crumbs" aria-label="Breadcrumb"><a href="' . h(tf_url()) . '">Home</a><span aria-hidden="true">/</span><a href="' . h(tf_url($cat['slug'])) . '">' . h($cat['name']) . '</a><span aria-hidden="true">/</span><span>' . h($t['name']) . '</span></nav>
<div class="tool-head">' . tf_tile($t, 'lg') . '<div><h1>' . h($t['name']) . '</h1><ul class="trust"><li>' . $chk . '100% free</li><li>' . $chk . 'No sign-up</li><li>' . $chk . ($uploads ? 'Deleted after ' . $days . ' days' : ($files ? 'Files stay on your device' : (!empty($t['server_note']) ? 'Nothing to install' : 'Runs in your browser'))) . '</li></ul></div></div>
<p class="answer">' . $t['answer'] . '</p>' . (!empty($t['aka']) ? '
<p class="aka">Also known as: ' . implode(' · ', array_map('h', $t['aka'])) . '</p>' : '') . '
<section class="tool" aria-label="' . h($t['name']) . '">
' . tf_name_file_inputs($t['html']) . '
</section>
<div class="under-tool"><p class="private">' . tf_icon('shield-check') . ($uploads ? 'What you add here is stored on our server so the QR code keeps working, and deleted automatically after ' . $days . ' days. You can delete it sooner from its manage page.' : ($files ? 'Your files are processed on your device and never uploaded.' : (!empty($t['server_note']) ? h($t['server_note']) : 'Everything runs in your browser. Nothing you type is sent anywhere.'))) . '</p>' . tf_share_html() . '</div>
' . ($t['category'] === 'health' ? '<p class="disclaimer">Results are estimates for general information, not medical advice. Talk to a doctor or other qualified professional about your health.</p>' : '')
  . ($t['category'] === 'money' ? '<p class="disclaimer">Results are estimates for general information, not financial advice. Check the figures with your lender, bank or a qualified adviser before deciding.</p>' : '') . '
' . tf_ad('top', $noads) . '
<div class="layout">
<article class="prose">
' . tf_links($t['article']) . '
' . tf_ad('article', $noads) . '
<h2>Frequently asked questions</h2>
' . tf_faq_html($t['faqs']) . '
<p class="updated">Last updated ' . date('F Y', $updated) . ' · <a href="' . h(tf_url($cat['slug'])) . '">More ' . h(mb_strtolower($cat['name'])) . '</a></p>
</article>
<aside class="side">
' . tf_ad('side', $noads) . '
' . ($same ? '<section aria-labelledby="side-a"><h2 id="side-a">More ' . h(mb_strtolower($cat['name'])) . '</h2><ul>' . implode('', array_map($side, $same)) . '</ul><a class="side-all" href="' . h(tf_url($cat['slug'])) . '">See all →</a></section>' : '') . '
' . ($more ? '<section aria-labelledby="side-b"><h2 id="side-b">You might also need</h2><ul>' . implode('', array_map($side, array_slice($more, 0, 6))) . '</ul></section>' : '') . '
</aside>
</div>
</main>';
    $scripts = '';
    // Libraries: full URLs load from a CDN; 'vendor/…' paths are copies hosted in assets/vendor.
    // Big ones (everything but the small QR and bcrypt libraries) load on the visitor's first touch (see libsReady in app.js),
    // so the page opens fast; small ones load with the page because those tools draw straight away.
    $lazy = [];
    foreach ($t['libs'] ?? [] as $src) {
        $url = preg_match('~^https?://~', $src) ? $src : tf_asset($src);
        if (preg_match('~qrcode|bcrypt~', $src)) $scripts .= '<script src="' . h($url) . '"></script>' . "\n";
        else $lazy[] = $url;
    }
    if ($lazy) $scripts .= '<script>window.TF_LIBS=' . json_encode($lazy, JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . ';</script>' . "\n";
    $limit = tf_tool_limit($t['slug']);
    if ($limit > 0) {
        $st = tf_settings();
        $cfg = ['tool' => $t['slug'], 'n' => $limit, 'reward' => $st['limit_mode'] === 'reward' && preg_match('~^/\d+(/[\w.\-]+)+$~', $st['reward_unit']) ? $st['reward_unit'] : '', 'extra' => max(1, (int) $st['reward_uses'])];
        $scripts .= '<script>window.TF_LIMIT=' . json_encode($cfg, JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . ';</script>' . "\n";
    }
    $scripts .= '<script src="' . h(tf_asset('app.js')) . '"></script>' . "\n";
    // ai.js starts its edge clean-up worker from matte.js: give it that file's own versioned address.
    if (in_array('ai.js', $t['scripts'] ?? [], true)) $scripts .= '<script>window.TF_MATTE=' . json_encode(tf_asset('matte.js'), JSON_UNESCAPED_SLASHES) . ';</script>' . "\n";
    foreach ($t['scripts'] ?? [] as $f) $scripts .= '<script src="' . h(tf_asset($f)) . '"></script>' . "\n";
    $scripts .= "<script>\n(function () {\n" . $t['js'] . "\n})();\n</script>";
    $pre = array_values(array_filter(array_map(fn($u) => preg_match('~^(https://[^/]+)/~', $u, $m) ? $m[1] : '', $lazy)));
    return tf_layout(['title' => $title, 'description' => $desc, 'slug' => $t['slug'], 'schema' => $schema, 'noindex' => $noindex, 'scripts' => $scripts, 'noads' => $noads, 'preconnect' => $pre], $body);
}

function tf_page_category(array $c): string
{
    $tools = array_filter(tf_tools(), fn($t) => $t['category'] === $c['id']);
    $i = 0;
    $schema = [
        ['@context' => 'https://schema.org', '@type' => 'CollectionPage', 'name' => $c['name'], 'url' => tf_abs($c['slug']), 'description' => $c['description'],
            'mainEntity' => ['@type' => 'ItemList', 'numberOfItems' => count($tools), 'itemListElement' => array_values(array_map(function ($t) use (&$i) { return ['@type' => 'ListItem', 'position' => ++$i, 'url' => tf_abs($t['slug']), 'name' => $t['name']]; }, $tools))]],
        tf_breadcrumbs([['Home', tf_abs()], [$c['name'], tf_abs($c['slug'])]]),
    ];
    if ($c['faqs']) $schema[] = tf_faq_schema($c['faqs']);
    $others = '';
    foreach (tf_site()['categories'] as $o) {
        if ($o['id'] === $c['id'] || !array_filter(tf_tools(), fn($t) => $t['category'] === $o['id'])) continue;
        $others .= '<a href="' . h(tf_url($o['slug'])) . '" data-cat="' . $o['id'] . '">' . tf_icon($o['icon']) . h($o['nav']) . '</a>';
    }
    $body = '<main class="wrap cat-page" data-cat="' . h($c['id']) . '">
<nav class="crumbs" aria-label="Breadcrumb"><a href="' . h(tf_url()) . '">Home</a><span aria-hidden="true">/</span><span>' . h($c['name']) . '</span></nav>
<header class="cat-hero"><span class="tile xl" data-cat="' . h($c['id']) . '">' . tf_icon($c['icon']) . '</span><div><p class="eyebrow">' . count($tools) . ' free tools</p><h1>' . h($c['name']) . '</h1></div></header>
<div class="cat-intro">' . $c['intro'] . '</div>
<ul class="cards">' . implode('', array_map('tf_card', $tools)) . '</ul>
' . tf_ad('top') . '
' . ($c['faqs'] ? '<section class="prose home-faq"><h2>Frequently asked questions</h2>' . tf_faq_html($c['faqs']) . '</section>' : '') . '
<section class="other-cats"><h2>More categories</h2><nav class="catnav">' . $others . '</nav></section>
</main>';
    return tf_layout(['title' => $c['title'], 'description' => $c['description'], 'slug' => $c['slug'], 'schema' => $schema, 'scripts' => ''], $body);
}

function tf_page_home(): string
{
    $site = tf_site();
    $tools = tf_tools();
    $n = count($tools);
    $name = $site['site']['name'];
    // No tool count in the title or description: the number changes, and search results would show an old one.
    [$title, $desc] = tf_seo('index', "$name – Free Online PDF, Image & Video Tools", "Free online tools that run in your browser: merge and compress PDFs, remove image backgrounds, convert video to MP3, make QR codes and more. No sign-up.");
    $faqs = [
        ["Are $name tools really free?", "Yes. All $n tools are free to use with no sign-up, no watermark and no daily limit. The site is supported by advertising."],
        ['Are my files uploaded to a server?', 'No. Images, PDFs, videos and text are processed in your browser on your own device. The only exceptions are hosted QR codes, which you choose to save on the site.'],
        ['Do the tools work on my phone?', 'Yes. Every tool is designed for phones first and also works on tablets and computers, in any modern browser.'],
        ['Do I need to install anything?', 'No. There is nothing to install and no account to create. Open a tool and use it straight away.'],
        ["How do I find the right tool?", 'Use the search box (or press Ctrl K on a computer), or browse the categories below.'],
    ];
    $i = 0;
    $schema = [
        // Site name for Google: the brand, plus the spaced spelling people may type.
        ['@context' => 'https://schema.org', '@type' => 'WebSite', '@id' => tf_abs() . '#website', 'name' => $name, 'alternateName' => [preg_replace('/(?<=[a-z])(?=[A-Z])/', ' ', $name), "$name Tools"], 'url' => tf_abs(), 'description' => $desc, 'inLanguage' => 'en', 'publisher' => ['@id' => tf_abs() . '#org']],
        ['@context' => 'https://schema.org', '@type' => 'Organization', '@id' => tf_abs() . '#org', 'name' => $name, 'url' => tf_abs(), 'description' => 'Free online tools for PDFs, images, video, text and everyday calculations that run in the web browser.', 'logo' => ['@type' => 'ImageObject', 'url' => tf_base_url() . '/icon-512.png', 'width' => 512, 'height' => 512], 'email' => tf_contact_email()] + (tf_social_profiles() ? ['sameAs' => tf_social_profiles()] : []) + (tf_company()['name'] !== '' ? ['parentOrganization' => ['@type' => 'Organization', 'name' => tf_company()['name']] + (tf_company()['url'] !== '' ? ['url' => tf_company()['url']] : [])] : []),
        ['@context' => 'https://schema.org', '@type' => 'ItemList', 'name' => "$name tools", 'itemListElement' => array_values(array_map(function ($t) use (&$i) { return ['@type' => 'ListItem', 'position' => ++$i, 'url' => tf_abs($t['slug']), 'name' => $t['name']]; }, $tools))],
        tf_faq_schema($faqs),
    ];
    // Popular tools, taking one from each category in turn so the panel shows variety.
    $byCat = [];
    foreach ($tools as $t) if (!empty($t['popular'])) $byCat[$t['category']][] = $t;
    $popular = [];
    while (count($popular) < 8 && $byCat) foreach ($byCat as $k => &$list) { if ($list) $popular[] = array_shift($list); if (!$list) unset($byCat[$k]); if (count($popular) >= 8) break; }
    unset($list);
    $pop = implode('', array_map(fn($t) => '<li><a href="' . h(tf_url($t['slug'])) . '">' . tf_tile($t) . '<span><b>' . h($t['name']) . '</b><small>' . h($t['short']) . '</small></span></a></li>', $popular));
    $tiles = '';
    $cats = '';
    foreach ($site['categories'] as $c) {
        $list = array_filter($tools, fn($t) => $t['category'] === $c['id']);
        if (!$list) continue;
        $tiles .= '<li><a class="cat-tile" href="' . h(tf_url($c['slug'])) . '" data-cat="' . $c['id'] . '"><span class="tile" data-cat="' . $c['id'] . '">' . tf_icon($c['icon']) . '</span><b>' . h($c['nav']) . '</b><small>' . count($list) . ' tools</small></a></li>';
        $cats .= '<section class="cat" id="' . $c['id'] . '" aria-labelledby="h-' . $c['id'] . '"><div class="cat-head"><h2 id="h-' . $c['id'] . '"><a href="' . h(tf_url($c['slug'])) . '">' . h($c['name']) . '</a></h2><p>' . h($c['blurb']) . '</p><a class="cat-all" href="' . h(tf_url($c['slug'])) . '">View all ' . count($list) . ' →</a></div><ul class="cards">' . implode('', array_map('tf_card', $list)) . "</ul></section>\n";
    }
    $feat = fn($icon, $h, $p) => '<li>' . tf_icon($icon) . '<b>' . $h . '</b><span>' . $p . '</span></li>';
    $body = '<main class="home">
<section class="hero"><div class="wrap hero-grid">
<div class="hero-main">
<p class="eyebrow">' . $n . ' free tools · no sign-up</p>
<h1>Free online tools that <em>just work</em>.</h1>
<p class="lead">Fast, private tools for PDFs, images, video, QR codes, money, health and everyday life. No sign-up, no watermarks, and your files are processed on your own device.</p>
<div class="search" role="search">' . tf_icon('search') . '<label class="sr-only" for="q">Search tools</label><input id="q" type="search" placeholder="Search ' . $n . ' tools, e.g. merge pdf, video to mp3" autocomplete="off"></div>
<ul class="stats"><li>' . tf_icon('shield-check') . 'Files stay on your device</li><li>' . tf_icon('zap') . 'Instant results</li><li>' . tf_icon('smartphone') . 'Works on any phone</li><li>' . tf_icon('badge-check') . '100% free</li></ul>
</div>
<aside class="hero-pop" aria-label="Popular tools"><p class="kicker">Popular right now</p><ul>' . $pop . '</ul></aside>
</div></section>
<div class="wrap">
<section id="categories" class="cat-tiles-wrap" aria-labelledby="h-browse"><h2 id="h-browse" class="section-title">Browse by category</h2><ul class="cat-tiles">' . $tiles . '</ul></section>
<div id="tools">
' . $cats . '<p class="no-results" id="none" hidden>No tool matches that search yet.</p>
</div>
<section class="why" aria-labelledby="h-why"><h2 id="h-why" class="section-title">Why people use ' . h($name) . '</h2><ul>'
        . $feat('shield-check', 'Private by design', 'Files are processed on your device and never uploaded, so even confidential documents stay private. The only exception is a hosted QR code, which you choose to save.')
        . $feat('zap', 'Instant', 'No uploads and no waiting in queues. Results appear as you type or as soon as your file opens.')
        . $feat('badge-check', 'Free, no catches', 'No sign-up, no watermarks, no daily limits and no "premium" paywall halfway through.')
        . $feat('smartphone', 'Made for phones', 'Every tool is designed for small screens first and works on any device and browser.')
        . '</ul></section>
<section class="prose home-faq"><h2>Frequently asked questions</h2>' . tf_faq_html($faqs) . '</section>
</div>
</main>';
    $js = <<<'JS'
<script>
(function () {
  var q = document.getElementById('q');
  q.addEventListener('input', function () {
    var v = q.value.trim().toLowerCase(), any = false;
    document.getElementById('categories').hidden = !!v;
    document.querySelectorAll('#tools .cat').forEach(function (sec) {
      var shown = 0;
      sec.querySelectorAll('li[data-name]').forEach(function (li) {
        var hit = !v || v.split(/\s+/).every(function (w) { return li.dataset.name.indexOf(w) > -1; });
        li.hidden = !hit; if (hit) shown++;
      });
      sec.hidden = !shown; if (shown) any = true;
    });
    document.getElementById('none').hidden = any;
    if (v) document.getElementById('tools').scrollIntoView({ block: 'start', behavior: 'smooth' });
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
    $email = h(tf_contact_email());
    $n = count(tf_tools());
    $updated = date('j F Y', strtotime(TF_PAGE_DATES[$slug] ?? TF_SITE_UPDATED));
    $priv = h(tf_url('privacy'));
    $co = tf_company();
    $coName = $co['url'] !== '' ? '<a href="' . h($co['url']) . '" rel="noopener">' . h($co['name']) . '</a>' : h($co['name']);
    $who = $co['name'] !== '' ? "<p>$name is a project by <strong>$coName</strong>, which designs, builds and looks after every tool on the site.</p>\n" : '';
    $pages = [
        'about' => ["About {$site['site']['name']}", "{$site['site']['name']} makes fast, free online tools for PDFs, images, video, text and everyday maths. Everything runs in your browser, so your files stay private.", "
<h1>About $name</h1>
<p>$name is a collection of $n free online tools for the small jobs that come up every day: shrinking a photo for an email, merging two PDFs, turning a video into an MP3, counting the words in an essay, making a QR code, or working out a loan payment.</p>
$who<p>Every tool runs in your web browser. When you compress an image or merge a PDF, the file is processed on your own device and is never uploaded to a server. That makes the tools faster and keeps your files private.</p>
<p>A few tools need our server because of what they do: hosted QR codes (dynamic, file and verification QR codes) store the link, file or details you enter so the code keeps working, and the YouTube Subscriber Counter sends the channel name to our server to fetch the public count. Those tools say so on the page, and our <a href=\"$priv\">privacy policy</a> explains what is kept and for how long.</p>
<h2>How we build the tools</h2>
<p>Each calculator explains the formula it uses and includes a worked example, so you can check the result yourself. Health, finance and legal topics use established, published methods (such as the WHO BMI categories or the standard loan amortisation formula). We update pages when methods or standards change.</p>
<p>For medical, financial or legal decisions, please check with a qualified professional: our tools give estimates, not advice.</p>
<h2>Contact</h2>
<p>Found a bug or want a new tool? Email <strong>$email</strong>.</p>"],
        'privacy' => ["Privacy Policy | {$site['site']['name']}", "How {$site['site']['name']} handles your data: files and text are processed in your browser, except hosted QR codes you choose to save. Cookies, advertising, analytics and your rights.", '
<h1>Privacy policy</h1>
<p class="updated">Last updated ' . $updated . '</p>
<p>This policy explains what information ' . $name . ' (“we”) handles when you use this website, and your choices. Contact us at <strong>' . $email . '</strong>.</p>
<h2>Your files and text stay on your device</h2>
<p>Our tools run in your web browser. Files you open (images, PDFs, videos, audio) and text you type are processed on your own device. They are not uploaded to us, and we cannot see them.</p>
<h2>Information stored in your browser</h2>
<p>Some tools remember your settings or work in your browser’s local storage so they are there next time, for example notes in the Online Notepad, your Pomodoro tasks or the details on an ID card. This stays on your device; you can delete it by clearing your browser’s site data.</p>
<h2>Things you choose to save on our server</h2>
<ul>
<li><strong>Hosted QR codes</strong> (dynamic, file and verification QR codes): the link, file or details you enter are stored so the QR code works. They are deleted automatically after the period shown when you create them (30 days by default), or earlier if you delete them with your private manage link. We count scans (date and device type only).</li>
<li><strong>YouTube Subscriber Counter:</strong> the channel name you enter is sent to our server, which asks YouTube for the public count.</li>
</ul>
<h2>Cookies and advertising</h2>
<p>We show ads from Google AdSense to keep the tools free. Google and its partners use cookies and similar technologies to show ads, measure them and, with your permission where required, personalise them based on your visits to this and other websites. Learn how Google uses information from sites that use its services at <a href="https://policies.google.com/technologies/partner-sites" rel="nofollow noopener">policies.google.com/technologies/partner-sites</a>.</p>
<p>Visitors in the UK, the European Economic Area and Switzerland are asked for consent before personalised ads or non-essential cookies are used, through a consent message from Google. You can change your choice at any time using the privacy link shown by that message, and you can opt out of personalised advertising at <a href="https://adssettings.google.com" rel="nofollow noopener">Google Ad Settings</a> or <a href="https://optout.aboutads.info" rel="nofollow noopener">aboutads.info</a>.</p>
<h2>Analytics</h2>
<p>We may use Google Analytics to understand how many people visit and which tools are popular. It collects information such as pages viewed, approximate location (country or city), device and browser type. We do not use it to identify you.</p>
<h2>Services that load parts of the site</h2>
<p>To keep the site fast, some code, fonts and AI models are loaded from other services: Google Fonts, cdnjs (Cloudflare), jsDelivr, Hugging Face (AI models for the background remover and transcription tools) and Google (face detection model). Like any website, these services receive your IP address and browser details when your browser requests a file from them. Your own files are never sent to them.</p>
<h2>Your rights</h2>
<p>Depending on where you live (for example under the UK GDPR, the EU GDPR or US state privacy laws), you may have the right to access, correct or delete personal information we hold about you, to object to or restrict its use, and to complain to a data protection authority (in the UK, the Information Commissioner’s Office). As we hold very little personal information, most requests concern hosted QR codes; email us and we will respond within 30 days.</p>
<h2>Children</h2>
<p>This website is for a general audience and is not directed at children under 13. We do not knowingly collect personal information from children.</p>
<h2>Changes</h2>
<p>We may update this policy. The date at the top shows when it last changed.</p>
<h2>Contact</h2>
<p>Questions about privacy: <strong>' . $email . '</strong>.</p>'],
        'contact' => ["Contact Us | {$site['site']['name']}", "Contact {$site['site']['name']}: report a bug, suggest a new tool, ask about privacy or advertising. We read every message and usually reply within two working days.", '
<h1>Contact us</h1>
<p>We’d love to hear from you. Email us at:</p>
<p class="big"><a href="mailto:' . $email . '">' . $email . '</a></p>
<h2>What to write about</h2>
<ul>
<li><strong>Something isn’t working:</strong> tell us which tool, what you did, what you expected, and your browser and device (for example Chrome on Android). A screenshot helps.</li>
<li><strong>A tool idea:</strong> describe the job you want to get done. Many of our tools started as suggestions.</li>
<li><strong>Privacy questions or data requests:</strong> see our <a href="' . h(tf_url('privacy')) . '">privacy policy</a>.</li>
<li><strong>Advertising and partnerships:</strong> include your company name and website.</li>
</ul>
<p>We usually reply within two working days. Please don’t send files you need to keep private: our tools process files on your own device, so we never need them.</p>'],
        'terms' => ["Terms of Use | {$site['site']['name']}", "The terms for using {$site['site']['name']}: free tools provided as they are, results to check before relying on them, acceptable use of hosted QR codes, and our liability.", '
<h1>Terms of use</h1>
<p class="updated">Last updated ' . $updated . '</p>
<p>By using ' . $name . ' you agree to these terms. If you don’t agree, please don’t use the site.</p>
<h2>Free tools, provided as they are</h2>
<p>Our tools are free to use for personal and commercial purposes. We work hard to make them accurate and reliable, but they are provided “as is”, without warranties of any kind. Keep copies of important files before you process them.</p>
<h2>Check results before relying on them</h2>
<p>Calculators and generators give estimates and drafts. Health, finance, tax, legal and other results are for information only and are not professional advice. Check important results with a qualified professional or the official source before you act on them.</p>
<h2>Your content</h2>
<p>Files and text you process stay on your device and remain yours. You are responsible for having the right to use the content you process and for how you use the results, for example letters, ID cards, signatures and certificates. Do not use the tools to create fake or misleading documents.</p>
<h2>Hosted QR codes</h2>
<p>When you save a hosted QR code, you must not link to or upload anything illegal, harmful, misleading, or that infringes other people’s rights. We may remove any hosted QR code and block abuse without notice.</p>
<h2>Acceptable use</h2>
<p>Don’t attempt to disrupt the site, overload it with automated requests, get around its limits, or access parts of it that aren’t meant to be public.</p>
<h2>Our content</h2>
<p>The site’s design, text and code belong to ' . $name . ' or its licensors. Open-source libraries we use remain under their own licences.</p>
<h2>Links to other websites</h2>
<p>We may link to other websites. We are not responsible for their content or practices.</p>
<h2>Limitation of liability</h2>
<p>To the fullest extent the law allows, we are not liable for any indirect or consequential loss, or for loss of data, profits or business, arising from your use of the site. Nothing in these terms limits liability that cannot be limited by law.</p>
<h2>Changes</h2>
<p>We may update these terms. The date at the top shows when they last changed. Questions: <strong>' . $email . '</strong>.</p>'],
    ];
    if (!isset($pages[$slug])) return null;
    [$title, $desc, $inner] = $pages[$slug];
    return tf_layout(['title' => $title, 'description' => $desc, 'slug' => $slug, 'schema' => [['@context' => 'https://schema.org', '@type' => ['about' => 'AboutPage', 'contact' => 'ContactPage'][$slug] ?? 'WebPage', 'name' => $title, 'url' => tf_abs($slug)]], 'scripts' => ''], '<main class="wrap"><article class="prose page">' . $inner . '</article></main>');
}

function tf_page_404(): string
{
    $n = count(tf_tools());
    $pop = implode('', array_map('tf_card', array_slice(array_filter(tf_tools(), fn($t) => !empty($t['popular'])), 0, 6)));
    return tf_layout(['title' => 'Page not found | ' . tf_site()['site']['name'], 'description' => 'This page does not exist.', 'slug' => null, 'schema' => [], 'noindex' => true, 'scripts' => ''],
        '<main class="wrap"><article class="prose page"><h1>Page not found</h1><p>That page doesn’t exist or the tool has moved. Try the search, or <a href="' . h(tf_url()) . '">see all ' . $n . ' tools</a>.</p><p><button type="button" class="btn" data-open-search>Search tools</button></p></article><h2 class="section-title">Popular tools</h2><ul class="cards">' . $pop . '</ul></main>');
}

// Small list for the quick search (fetched once by assets/site.js).
function tf_tools_json(): string
{
    $out = [];
    foreach (tf_tools() as $t) {
        $cat = tf_category($t['category']);
        $out[] = ['u' => $t['slug'], 'n' => $t['name'], 's' => $t['short'], 'k' => trim(($t['keywords'] ?? '') . ' ' . implode(' ', $t['aka'] ?? [])), 'c' => $t['category'], 'p' => !empty($t['popular']) ? 1 : 0, 'i' => tf_icon($t['icon'] ?? 'circle'), 'g' => $cat['nav'] ?? ''];
    }
    return json_encode($out, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function tf_sitemap(): string
{
    $url = tf_base_url();
    $ts = tf_tool_settings();
    $tools = tf_tools();
    $newest = 0;
    $rows = [];
    foreach ($tools as $t) {
        if (!empty($ts[$t['slug']]['noindex'])) continue;
        $m = tf_tool_date($t);
        $newest = max($newest, $m);
        $rows[] = ['/' . $t['slug'], $m];
    }
    // A category page changes when one of its tools does; the homepage when any tool does.
    $cats = [];
    foreach (tf_site()['categories'] as $c) {
        $in = array_filter($tools, fn($t) => $t['category'] === $c['id'] && empty($ts[$t['slug']]['noindex']));
        if ($in) $cats[] = ['/' . $c['slug'], max(array_map('tf_tool_date', $in))];
    }
    $rows = array_merge([['/', $newest]], $cats, $rows, array_map(fn($p) => ['/' . $p, strtotime(TF_PAGE_DATES[$p])], array_keys(TF_PAGE_DATES)));
    $x = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($rows as [$p, $m]) $x .= '  <url><loc>' . h($url . $p) . '</loc><lastmod>' . date('Y-m-d', $m) . "</lastmod></url>\n";
    return $x . "</urlset>\n";
}

// ads.txt: authorises Google AdSense (from the publisher ID in the admin panel) plus any extra lines.
function tf_ads_txt(): string
{
    $s = tf_settings();
    $lines = [];
    if (preg_match('/^ca-(pub-\d+)$/', $s['adsense_client'], $m)) $lines[] = "google.com, {$m[1]}, DIRECT, f08c47fec0942fa0";
    $extra = trim(str_replace("\r", '', $s['ads_txt_extra']));
    if ($extra !== '') $lines[] = $extra;
    return $lines ? implode("\n", $lines) . "\n" : "# No ad networks are set up yet. Add your AdSense publisher ID in Admin → Ads & analytics.\n";
}

// Lets visitors add the site to their home screen like an app (and gives browsers the app icons).
function tf_manifest(): string
{
    $name = tf_site()['site']['name'];
    $icon = fn($n) => ['src' => tf_url("icon-$n.png"), 'sizes' => "{$n}x{$n}", 'type' => 'image/png', 'purpose' => 'any maskable'];
    return json_encode([
        'name' => "$name: free online tools", 'short_name' => $name, 'description' => count(tf_tools()) . ' free online tools that run in your browser.',
        'start_url' => tf_url() . '?source=app', 'scope' => tf_url(), 'display' => 'standalone', 'background_color' => '#ffffff', 'theme_color' => '#FF5B35',
        'icons' => [['src' => tf_asset('favicon.svg'), 'sizes' => 'any', 'type' => 'image/svg+xml'], $icon(192), $icon(512)],
        'id' => tf_url(), 'categories' => ['productivity', 'utilities'],
        // Long-press the app icon: the most used tools
        'shortcuts' => array_map(fn($t) => ['name' => $t['name'], 'short_name' => $t['name'], 'url' => tf_url($t['slug']) . '?source=app', 'icons' => [['src' => tf_url('icon-192.png'), 'sizes' => '192x192', 'type' => 'image/png']]],
            array_slice(array_values(array_filter(tf_tools(), fn($t) => !empty($t['popular']) && empty($t['use']))), 0, 4)),
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

// The service worker (served at /sw.js). Pages always come from the network, so updates show at once and the
// AI pages keep their cross-origin isolation headers; only when there is no connection a small offline page is shown.
function tf_service_worker(): string
{
    $name = tf_site()['site']['name'];
    $offline = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Offline · ' . h($name) . '</title>'
        . '<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font:16px/1.5 system-ui,sans-serif;background:#fff;color:#191F24;text-align:center;padding:24px;box-sizing:border-box}'
        . '@media(prefers-color-scheme:dark){body{background:#12161A;color:#F1F3F4}}h1{font-size:22px;margin:0 0 8px}p{margin:0 0 20px;color:#5F666B}'
        . 'button{font:700 15px system-ui,sans-serif;border:0;border-radius:10px;padding:12px 22px;background:#FF5B35;color:#fff;cursor:pointer}</style></head>'
        . '<body><main><h1>You’re offline</h1><p>' . h($name) . ' needs an internet connection to open this page.<br>Check your connection and try again.</p>'
        . '<button onclick="location.reload()">Try again</button></main></body></html>';
    $skip = json_encode([TF_BASE . '/admin', TF_BASE . '/api', TF_BASE . '/install', TF_BASE . '/q/']);
    $html = json_encode($offline, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    return <<<JS
'use strict';
const OFFLINE = $html, SKIP = $skip;
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil((async () => {
  if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
  await self.clients.claim();
})()));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.mode !== 'navigate' || r.method !== 'GET') return;
  const path = new URL(r.url).pathname;
  if (SKIP.some(p => path.startsWith(p))) return;
  e.respondWith((async () => {
    try { return (await e.preloadResponse) || await fetch(r); }
    catch (err) { return new Response(OFFLINE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }); }
  })());
});

JS;
}

function tf_llms_txt(): string
{
    $site = tf_site();
    $tools = tf_tools();
    $ts = tf_tool_settings();
    $out = '# ' . $site['site']['name'] . "\n\n> " . count($tools) . " free online tools that run in the browser: PDF, image, video and audio, QR codes, text, calculators and more. No sign-up. Files are processed on the visitor's device and never uploaded, except by the hosted QR code tools (dynamic, file and verification QR codes), which store what the visitor saves for a set time.\n\n";
    foreach ($site['categories'] as $c) {
        $in = array_filter($tools, fn($t) => $t['category'] === $c['id'] && empty($ts[$t['slug']]['noindex']));
        if (!$in) continue;
        // Each section starts with its category page, which lists and compares the tools in it.
        $out .= '## ' . $c['name'] . "\n\n- [All " . mb_strtolower($c['name']) . '](' . tf_abs($c['slug']) . '): ' . $c['blurb'] . "\n";
        foreach ($in as $t) $out .= '- [' . $t['name'] . '](' . tf_abs($t['slug']) . '): ' . ($t['short'] ?? '') . "\n";
        $out .= "\n";
    }
    $out .= "## About\n\n";
    foreach (['about' => 'About', 'contact' => 'Contact', 'privacy' => 'Privacy', 'terms' => 'Terms'] as $p => $label) $out .= "- [$label](" . tf_abs($p) . ")\n";
    return $out;
}

function tf_robots(): string
{
    $b = TF_BASE;
    $extra = trim(str_replace("\r", '', tf_settings()['robots_extra']));
    return "User-agent: *\nAllow: /\nDisallow: $b/admin/\nDisallow: $b/install/\nDisallow: $b/api/\nDisallow: $b/q/\n" . ($extra !== '' ? $extra . "\n" : '') . "\nSitemap: " . tf_base_url() . "/sitemap.xml\n";
}
