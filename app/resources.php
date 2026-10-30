<?php
// Resource pages the site owner writes in the admin panel (Admin → Resources), at /r/<slug>, with a list at
// /resources. Made for links shared on social media: "Best free AI course, link below" → the full details here.
// They are normal, indexable pages (in the sitemap), so they also bring visitors from search engines.
declare(strict_types=1);

const TF_RES_UPLOADS = TF_ROOT . '/storage/uploads/resources';

function tf_res_ready(): bool
{
    if (!tf_db()) return false;
    try { tf_migrate(); tf_db()->query('SELECT 1 FROM ' . tf_table('resources') . ' LIMIT 1'); return true; } catch (Throwable $e) { return false; }
}

function tf_res_find(string $slug, bool $any = false): ?array
{
    if (!tf_res_ready()) return null;
    $st = tf_db()->prepare('SELECT * FROM ' . tf_table('resources') . ' WHERE slug = ?' . ($any ? '' : " AND status = 'published'"));
    $st->execute([$slug]);
    $r = $st->fetch();
    if (!$r) return null;
    $r['links'] = json_decode((string) $r['links'], true) ?: [];
    return $r;
}

function tf_res_list(bool $published = true, int $limit = 200): array
{
    if (!tf_res_ready()) return [];
    $rows = tf_db()->query('SELECT id, slug, title, summary, image, status, views, created_at, updated_at FROM ' . tf_table('resources') . ($published ? " WHERE status = 'published'" : '') . ' ORDER BY created_at DESC LIMIT ' . $limit)->fetchAll();
    return $rows ?: [];
}

function tf_res_slug(string $title): string
{
    $s = strtolower(trim((string) preg_replace('/[^a-z0-9]+/i', '-', iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $title) ?: $title), '-'));
    return substr($s, 0, 80) ?: 'resource-' . date('Ymd-His');
}

function tf_res_image_url(array $r): string
{
    if ($r['image'] === '') return '';
    return preg_match('~^https?://~', $r['image']) ? $r['image'] : tf_url('r/' . $r['slug'] . '/image') . '?v=' . (int) $r['updated_at'];
}

// Simple formatting for the body: blank line = new paragraph, "## " heading, "- " or "1. " list,
// **bold**, *italic*, [text](https://link) and bare https:// links. Everything else is plain text.
function tf_res_body(string $text): string
{
    $inline = function (string $t): string {
        $t = h($t);
        $t = preg_replace('/\*\*(.+?)\*\*/', '<strong>$1</strong>', $t);
        $t = preg_replace('/(?<![*\w])\*(?!\s)(.+?)(?<!\s)\*(?![*\w])/', '<em>$1</em>', $t);
        $t = preg_replace_callback('/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/', fn($m) => '<a href="' . $m[2] . '" target="_blank" rel="noopener">' . $m[1] . '</a>', $t);
        return preg_replace_callback('~(?<!href=")(?<!">)\b(https?://[^\s<]+[^\s<.,;:!?)])~', fn($m) => '<a href="' . $m[1] . '" target="_blank" rel="noopener">' . $m[1] . '</a>', $t);
    };
    // Line by line: headings stand alone, list lines group into a list, other lines join into a paragraph.
    $out = '';
    $para = [];
    $list = null; // ['ul'|'ol', [items]]
    $flush = function () use (&$out, &$para, &$list, $inline) {
        if ($para) { $out .= '<p>' . implode('<br>', array_map($inline, $para)) . "</p>\n"; $para = []; }
        if ($list) { $out .= "<{$list[0]}>" . implode('', array_map(fn($i) => '<li>' . $inline($i) . '</li>', $list[1])) . "</{$list[0]}>\n"; $list = null; }
    };
    foreach (explode("\n", str_replace("\r", '', trim($text))) as $line) {
        $line = rtrim($line);
        if (trim($line) === '') { $flush(); continue; }
        if (preg_match('/^(#{2,3})\s+(.+)$/', $line, $m)) { $flush(); $n = strlen($m[1]); $out .= "<h$n>" . $inline($m[2]) . "</h$n>\n"; continue; }
        if (preg_match('/^\s*(?:([-*•])|(\d+)[.)])\s+(.+)$/u', $line, $m)) {
            $kind = $m[1] !== '' ? 'ul' : 'ol';
            if ($para || ($list && $list[0] !== $kind)) $flush();
            $list ??= [$kind, []];
            $list[1][] = $m[3];
            continue;
        }
        if ($list) $flush();
        $para[] = $line;
    }
    $flush();
    return $out;
}

function tf_res_store_image(array $f)
{
    if (($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) return 'The picture didn’t upload.';
    if ($f['size'] > 5 * 1048576) return 'Pictures can be up to 5 MB.';
    $type = function_exists('finfo_open') ? (string) finfo_file(finfo_open(FILEINFO_MIME_TYPE), $f['tmp_name']) : (string) ($f['type'] ?? '');
    $ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'][$type] ?? null;
    if (!$ext || !@getimagesize($f['tmp_name'])) return 'Use a JPG, PNG or WebP picture.';
    if (!is_dir(TF_RES_UPLOADS) && !@mkdir(TF_RES_UPLOADS, 0755, true)) return 'The storage folder isn’t writable.';
    $path = bin2hex(random_bytes(10)) . '.' . $ext;
    if (!move_uploaded_file($f['tmp_name'], TF_RES_UPLOADS . '/' . $path)) return 'The server couldn’t save the picture.';
    return $path;
}

function tf_res_delete_image(string $path): void
{
    if ($path !== '' && !preg_match('~^https?://~', $path) && is_file(TF_RES_UPLOADS . '/' . basename($path))) @unlink(TF_RES_UPLOADS . '/' . basename($path));
}

// ---------- pages ----------

function tf_res_route(string $slug, string $sub): bool
{
    $r = tf_res_find($slug);
    if (!$r) return false;
    if ($sub === 'image') {
        $path = TF_RES_UPLOADS . '/' . basename($r['image']);
        if ($r['image'] === '' || !is_file($path)) { http_response_code(404); return true; }
        header('Content-Type: ' . (str_ends_with($path, '.png') ? 'image/png' : (str_ends_with($path, '.webp') ? 'image/webp' : 'image/jpeg')));
        header('Content-Length: ' . filesize($path));
        header('Cache-Control: public, max-age=604800');
        readfile($path);
        return true;
    }
    if (!preg_match('/bot|crawl|spider|preview|facebookexternalhit|whatsapp/i', $_SERVER['HTTP_USER_AGENT'] ?? '')) {
        tf_db()->prepare('UPDATE ' . tf_table('resources') . ' SET views = views + 1 WHERE id = ?')->execute([$r['id']]);
    }
    echo tf_res_page($r);
    return true;
}

function tf_res_page(array $r): string
{
    $site = tf_site()['site']['name'];
    $img = tf_res_image_url($r);
    $url = tf_abs('r/' . $r['slug']);
    $links = '';
    foreach ($r['links'] as $l) {
        $links .= '<a class="res-link" href="' . h($l['url']) . '" target="_blank" rel="noopener"><span class="res-link-t">' . h($l['label']) . '</span>' . ($l['note'] !== '' ? '<small>' . h($l['note']) . '</small>' : '')
            . '<span class="res-go">' . tf_icon('external-link') . '</span></a>';
    }
    $more = array_values(array_filter(tf_res_list(), fn($x) => $x['slug'] !== $r['slug']));
    $moreHtml = $more ? '<section class="res-more"><h2>More free resources</h2><div class="res-grid">' . implode('', array_map('tf_res_card', array_slice($more, 0, 6))) . '</div><p><a href="' . h(tf_url('resources')) . '">See all resources →</a></p></section>' : '';
    $tools = array_slice(array_values(array_filter(tf_tools(), fn($t) => !empty($t['popular']))), 0, 6);
    $toolsHtml = '<section class="res-more"><h2>Free tools you might like</h2><ul class="res-tools">' . implode('', array_map(fn($t) => '<li><a href="' . h(tf_url($t['slug'])) . '">' . tf_tile($t) . '<span><b>' . h($t['name']) . '</b><small>' . h($t['short'] ?? '') . '</small></span></a></li>', $tools)) . '</ul></section>';
    $schema = [
        ['@context' => 'https://schema.org', '@type' => 'Article', 'headline' => $r['title'], 'description' => $r['summary'], 'mainEntityOfPage' => $url, 'url' => $url,
            'datePublished' => date('c', (int) $r['created_at']), 'dateModified' => date('c', (int) $r['updated_at']), 'inLanguage' => 'en']
            + ($img ? ['image' => preg_match('~^https?://~', $img) ? $img : tf_base_url() . preg_replace('~^' . preg_quote(TF_BASE, '~') . '~', '', $img)] : [])
            + ['author' => ['@type' => 'Organization', 'name' => $site, 'url' => tf_abs()], 'publisher' => ['@type' => 'Organization', '@id' => tf_abs() . '#org', 'name' => $site, 'url' => tf_abs()]],
        tf_breadcrumbs([['Home', tf_abs()], ['Resources', tf_abs('resources')], [$r['title'], $url]]),
    ];
    $body = '<main class="wrap res-page">
<nav class="crumbs" aria-label="Breadcrumb"><a href="' . h(tf_url()) . '">Home</a><span aria-hidden="true">/</span><a href="' . h(tf_url('resources')) . '">Resources</a><span aria-hidden="true">/</span><span>' . h($r['title']) . '</span></nav>
<article class="res-article">
<header class="res-head">' . ($img ? '<img class="res-img" src="' . h($img) . '" alt="" fetchpriority="high">' : '') . '<p class="kicker">Free resource · ' . date('j F Y', (int) $r['updated_at']) . '</p><h1>' . h($r['title']) . '</h1>' . ($r['summary'] !== '' ? '<p class="res-sum">' . h($r['summary']) . '</p>' : '') . '</header>
' . ($links ? '<section class="res-links" aria-label="Links">' . $links . '</section>' : '') . '
' . tf_ad('top') . '
<div class="prose res-body">' . tf_res_body((string) $r['body']) . '</div>
' . tf_ad('article') . '
<div class="under-tool">' . tf_share_html('Share this page') . '</div>
</article>
' . $moreHtml . $toolsHtml . '
</main>';
    return tf_layout(['title' => $r['title'] . ' | ' . $site, 'description' => $r['summary'] ?: $r['title'], 'slug' => 'r/' . $r['slug'], 'schema' => $schema, 'scripts' => '', 'css' => ['share.css'],
        'og' => $img ? (preg_match('~^https?://~', $img) ? $img : tf_base_url() . preg_replace('~^' . preg_quote(TF_BASE, '~') . '~', '', $img)) : null], $body);
}

function tf_res_card(array $r): string
{
    $img = tf_res_image_url($r);
    return '<a class="res-card" href="' . h(tf_url('r/' . $r['slug'])) . '">' . ($img ? '<img src="' . h($img) . '" alt="" loading="lazy">' : '<span class="res-noimg">' . tf_icon('book-open') . '</span>') . '<b>' . h($r['title']) . '</b><small>' . h(mb_strimwidth($r['summary'], 0, 120, '…')) . '</small></a>';
}

function tf_res_index(): string
{
    $site = tf_site()['site']['name'];
    $list = tf_res_list();
    $body = '<main class="wrap res-page"><nav class="crumbs" aria-label="Breadcrumb"><a href="' . h(tf_url()) . '">Home</a><span aria-hidden="true">/</span><span>Resources</span></nav>
<header class="res-head"><p class="kicker">Hand-picked</p><h1>Free resources</h1><p class="res-sum">Free courses, guides and useful links we recommend, with everything you need in one place.</p></header>
' . ($list ? '<div class="res-grid">' . implode('', array_map('tf_res_card', $list)) . '</div>' : '<p class="sub">Nothing here yet. Check back soon.</p>') . '</main>';
    $schema = [tf_breadcrumbs([['Home', tf_abs()], ['Resources', tf_abs('resources')]])];
    return tf_layout(['title' => 'Free Resources: Courses, Guides & Links | ' . $site, 'description' => 'Hand-picked free resources: free courses, guides and useful links, with all the details in one place.', 'slug' => 'resources', 'schema' => $schema, 'scripts' => '', 'css' => ['share.css'], 'noindex' => !$list], $body);
}
