<?php
// Shared helpers for the front controller, the admin panel and the API.
declare(strict_types=1);

const TF_ROOT = __DIR__ . '/..';
const TF_DATA = TF_ROOT . '/data';
const TF_SETTINGS = TF_DATA . '/settings.php';

function tf_defaults(): array
{
    return [
        'password_hash' => '',
        'announcement' => ['text' => '', 'link' => ''],
        'analytics_id' => '',        // GA4 measurement ID, e.g. G-XXXXXXX
        'adsense_client' => '',      // e.g. ca-pub-1234567890
        'head_code' => '',           // any extra code for <head> (verification tags, pixels)
        'body_code' => '',           // code before </body>
        'ads' => ['top' => '', 'article' => '', 'side' => ''],
        'youtube_api_key' => '',
        'tools' => [],               // slug => ['off' => bool, 'title' => '', 'description' => '', 'noindex' => bool]
        'home' => ['title' => '', 'description' => ''],
        'updated' => 0,
    ];
}

function tf_settings(): array
{
    static $cache = null;
    if ($cache !== null) return $cache;
    $s = is_file(TF_SETTINGS) ? (include TF_SETTINGS) : [];
    $cache = array_replace_recursive(tf_defaults(), is_array($s) ? $s : []);
    return $cache;
}

function tf_save_settings(array $s): bool
{
    $s['updated'] = time();
    $code = "<?php\n// Written by the admin panel. Do not edit while the site is live.\nreturn " . var_export($s, true) . ";\n";
    $tmp = TF_SETTINGS . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (file_put_contents($tmp, $code, LOCK_EX) === false) return false;
    $ok = rename($tmp, TF_SETTINGS);
    if (function_exists('opcache_invalidate')) opcache_invalidate(TF_SETTINGS, true);
    return $ok;
}

function tf_tools(): array
{
    static $t = null;
    if ($t === null) {
        $raw = @file_get_contents(TF_DATA . '/tools.json');
        $t = $raw ? json_decode($raw, true) : ['site' => [], 'categories' => [], 'tools' => []];
    }
    return $t;
}

function tf_tool_off(string $slug): bool
{
    return !empty(tf_settings()['tools'][$slug]['off']);
}

function h(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function tf_base_url(): string
{
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    $host = preg_replace('/[^a-z0-9.\-:]/i', '', $_SERVER['HTTP_HOST'] ?? 'localhost');
    return ($https ? 'https' : 'http') . '://' . $host;
}
