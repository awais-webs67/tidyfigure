<?php
// Social share images (1200×630 PNG) drawn with PHP's GD library and cached in storage/cache/og.
// Without GD, the static assets/og-default.png is used instead.
declare(strict_types=1);

function tf_og_wrap(string $text, string $font, float $size, int $maxWidth, int $maxLines): array
{
    $lines = [];
    $line = '';
    foreach (preg_split('/\s+/u', trim($text)) as $word) {
        $try = $line === '' ? $word : "$line $word";
        $box = imagettfbbox($size, 0, $font, $try);
        if ($line !== '' && $box[2] - $box[0] > $maxWidth) {
            $lines[] = $line;
            $line = $word;
            if (count($lines) === $maxLines) break;
        } else {
            $line = $try;
        }
    }
    if (count($lines) < $maxLines && $line !== '') $lines[] = $line;
    elseif (count($lines) === $maxLines && $line !== '' && end($lines) !== $line) $lines[$maxLines - 1] = rtrim($lines[$maxLines - 1], '.,:;') . '…';
    return $lines;
}

function tf_og_color($img, string $hex): int
{
    $n = hexdec(ltrim($hex, '#'));
    return imagecolorallocate($img, ($n >> 16) & 255, ($n >> 8) & 255, $n & 255);
}

// Writes the PNG for a page and returns its path, or null if GD isn't available.
function tf_og_file(string $title, string $kicker, string $text, string $catColor): ?string
{
    if (!function_exists('imagettftext')) return null;
    $dir = TF_CACHE . '/og';
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $file = $dir . '/' . md5("v1|$title|$kicker|$text|$catColor|" . tf_site()['site']['name']) . '.png';
    if (is_file($file)) return $file;

    $W = 1200; $H = 630;
    $f = TF_ROOT . '/app/fonts/';
    $img = imagecreatetruecolor($W, $H);
    imageantialias($img, true);
    $white = tf_og_color($img, '#FFFFFF');
    $ink = tf_og_color($img, '#333F48');
    $muted = tf_og_color($img, '#5F666B');
    $accent = tf_og_color($img, '#FF5B35');
    $cat = tf_og_color($img, $catColor);
    imagefilledrectangle($img, 0, 0, $W, $H, $white);
    // Soft decoration: tinted circles on the right, a category colour bar on the left.
    $tint = imagecolorallocatealpha($img, 255, 91, 53, 112);
    imagefilledellipse($img, 1090, 120, 520, 520, $tint);
    imagefilledellipse($img, 1180, 560, 300, 300, $tint);
    imagefilledrectangle($img, 0, 0, 14, $H, $cat);

    $x = 80;
    imagettftext($img, 24, 0, $x, 110, $accent, $f . 'Inter-SemiBold.ttf', mb_strtoupper($kicker));
    $y = 135;
    foreach (tf_og_wrap($title, $f . 'BebasNeue-Regular.ttf', 92, 900, 3) as $line) {
        $y += 100;
        imagettftext($img, 92, 0, $x, $y, $ink, $f . 'BebasNeue-Regular.ttf', $line);
    }
    $y += 26;
    foreach (tf_og_wrap($text, $f . 'Inter-Regular.ttf', 27, 900, 2) as $line) {
        $y += 44;
        imagettftext($img, 27, 0, $x, $y, $muted, $f . 'Inter-Regular.ttf', $line);
    }
    // Brand: logo square + name, and the promise on the right.
    $by = $H - 70;
    $slate = tf_og_color($img, '#333F48');
    imagefilledrectangle($img, $x, $by - 40, $x + 48, $by + 8, $slate);
    imagesetthickness($img, 5);
    imageline($img, $x + 13, $by - 24, $x + 35, $by - 24, $white);
    imageline($img, $x + 24, $by - 24, $x + 24, $by - 2, $white);
    imagefilledellipse($img, $x + 36, $by - 5, 9, 9, $accent);
    $name = tf_site()['site']['name'];
    [$a, $b] = preg_match('/^(\w+?)(Figure)$/', $name, $m) ? [$m[1], $m[2]] : [$name, ''];
    imagettftext($img, 44, 0, $x + 64, $by + 6, $ink, $f . 'BebasNeue-Regular.ttf', mb_strtoupper($a));
    $bb = imagettfbbox(44, 0, $f . 'BebasNeue-Regular.ttf', mb_strtoupper($a));
    if ($b !== '') imagettftext($img, 44, 0, $x + 64 + $bb[2] - $bb[0], $by + 6, $accent, $f . 'BebasNeue-Regular.ttf', mb_strtoupper($b));
    $promise = 'Free  ·  No sign-up  ·  Private';
    $pb = imagettfbbox(22, 0, $f . 'Inter-SemiBold.ttf', $promise);
    imagettftext($img, 22, 0, $W - 80 - ($pb[2] - $pb[0]), $by - 4, $muted, $f . 'Inter-SemiBold.ttf', $promise);

    $tmp = $file . '.' . bin2hex(random_bytes(4));
    imagepng($img, $tmp, 6);
    imagedestroy($img);
    @rename($tmp, $file);
    return is_file($file) ? $file : null;
}

// Serves /og/<page>.png
function tf_og_serve(string $slug): void
{
    $colors = ['image' => '#0A66C2', 'pdf' => '#E00000', 'text' => '#6A47DB', 'random' => '#B86F00', 'time' => '#D62976', 'calc' => '#1E7A4C', 'convert' => '#1769FF', 'life' => '#FF5B35',
        'health' => '#1FAF55', 'money' => '#0E7C86', 'social' => '#E2457F', 'qr' => '#333F48', 'media' => '#C2185B', 'study' => '#3F51B5', 'dev' => '#2E7D32', 'home' => '#8D5A2B', 'device' => '#00838F'];
    $site = tf_site()['site']['name'];
    $n = count(tf_tools());
    $file = null;
    if ($slug === 'home') {
        $file = tf_og_file('Free online tools that just work', "$n free tools", 'PDF, image, video, QR code, finance, health and everyday tools that run in your browser.', '#FF5B35');
    } elseif ($c = tf_category($slug)) {
        $file = tf_og_file($c['name'], 'Free · ' . $site, $c['description'], $colors[$c['id']] ?? '#FF5B35');
    } elseif (tf_tool_on($slug) && ($t = tf_tools_all()[$slug] ?? null)) {
        $c = tf_category($t['category']);
        $file = tf_og_file($t['name'], $c['nav'] ?? 'Free tool', $t['short'], $colors[$t['category']] ?? '#FF5B35');
    } elseif (in_array($slug, ['about', 'privacy'], true)) {
        $file = tf_og_file($slug === 'about' ? "About $site" : 'Privacy policy', $site, 'Free online tools that keep your files on your device.', '#FF5B35');
    } else {
        http_response_code(404);
        exit;
    }
    if (!$file) {
        header('Location: ' . tf_asset('og-default.png'), true, 302);
        exit;
    }
    header('Content-Type: image/png');
    header('Cache-Control: public, max-age=604800');
    header('Content-Length: ' . filesize($file));
    readfile($file);
    exit;
}

// App icons (home screen, Apple touch icon) drawn from the favicon's shapes. Falls back to the SVG without GD.
function tf_icon_serve(int $size): void
{
    if (!function_exists('imagecreatetruecolor')) {
        header('Location: ' . tf_asset('favicon.svg'), true, 302);
        exit;
    }
    $dir = TF_CACHE . '/og';
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $file = "$dir/icon-v1-$size.png";
    if (!is_file($file)) {
        // Drawn 4× larger and scaled down, for smooth edges. The mark sits in the middle 80%, the safe area for round icons.
        $S = $size * 4;
        $big = imagecreatetruecolor($S, $S);
        imagefill($big, 0, 0, tf_og_color($big, '#0B7F5E'));
        $white = tf_og_color($big, '#ffffff');
        $u = $S * 0.8 / 32;
        $o = $S * 0.1;
        $p = fn($v) => (int) round($o + $v * $u);
        $r = 1.5 * $u;
        imagefilledrectangle($big, $p(9), $p(9.5), $p(23), $p(12.5), $white);
        imagefilledrectangle($big, $p(14.5), $p(11), $p(17.5), $p(23), $white);
        foreach ([[9, 11], [23, 11], [16, 23]] as [$x, $y]) imagefilledellipse($big, $p($x), $p($y), (int) ($r * 2), (int) ($r * 2), $white);
        imagefilledellipse($big, $p(23), $p(22), (int) (4.8 * $u), (int) (4.8 * $u), $white);
        $img = imagecreatetruecolor($size, $size);
        imagecopyresampled($img, $big, 0, 0, 0, 0, $size, $size, $S, $S);
        imagepng($img, $file);
        if (!is_file($file)) {
            header('Content-Type: image/png');
            imagepng($img);
            exit;
        }
    }
    header('Content-Type: image/png');
    header('Cache-Control: public, max-age=2592000');
    header('Content-Length: ' . filesize($file));
    readfile($file);
    exit;
}
