<?php
// Shared setup for every entry point (index.php, admin, install, api):
// configuration, the MySQL connection, settings from the database, the list of tools and small helpers.
declare(strict_types=1);

define('TF_ROOT', dirname(__DIR__));
const TF_CONFIG = TF_ROOT . '/config.php';
const TF_CACHE = TF_ROOT . '/storage/cache';
if (!defined('TF_BASE')) define('TF_BASE', ''); // URL path the site lives under, e.g. '' or '/tools'

// ---------- configuration & database ----------

function tf_config(): ?array
{
    static $c = false;
    if ($c === false) {
        $c = is_file(TF_CONFIG) ? (include TF_CONFIG) : null;
        if (!is_array($c)) $c = null;
    }
    return $c;
}

// The database connection, or null when the site isn't installed yet or MySQL is unreachable.
// Public pages keep working without it (with default settings); the admin panel needs it.
function tf_db(): ?PDO
{
    static $pdo = false;
    if ($pdo !== false) return $pdo;
    $pdo = null;
    $c = tf_config();
    if (!$c) return null;
    try {
        $pdo = tf_connect($c['db']);
    } catch (Throwable $e) {
        error_log('TidyFigure: database connection failed: ' . $e->getMessage());
    }
    return $pdo;
}

function tf_connect(array $db): PDO
{
    $dsn = 'mysql:host=' . $db['host'] . ';dbname=' . $db['name'] . ';charset=utf8mb4' . (!empty($db['port']) ? ';port=' . (int) $db['port'] : '');
    return new PDO($dsn, $db['user'], $db['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}

// Creates any tables added in newer versions (safe to run repeatedly). Runs when the schema version changes.
const TF_SCHEMA_VERSION = '2';
function tf_migrate(): void
{
    $db = tf_db();
    if (!$db || (tf_settings()['schema_version'] ?? '') === TF_SCHEMA_VERSION) return;
    $prefix = preg_replace('/[^a-z0-9_]/i', '', (string) (tf_config()['db']['prefix'] ?? 'tf_'));
    $sql = str_replace('{prefix}', $prefix, (string) file_get_contents(TF_ROOT . '/app/schema.sql'));
    foreach (array_filter(array_map('trim', explode(';', preg_replace('/^--.*$/m', '', $sql)))) as $q) $db->exec($q);
    tf_save_settings(['schema_version' => TF_SCHEMA_VERSION]);
}

function tf_table(string $name): string
{
    $p = preg_replace('/[^a-z0-9_]/i', '', (string) (tf_config()['db']['prefix'] ?? 'tf_'));
    return '`' . $p . $name . '`';
}

// ---------- settings ----------

function tf_setting_defaults(): array
{
    return [
        'home_title' => '', 'home_description' => '',
        'announcement_text' => '', 'announcement_link' => '',
        'analytics_id' => '',     // GA4 measurement ID, e.g. G-XXXXXXX
        'adsense_client' => '',   // e.g. ca-pub-1234567890
        'ad_top' => '', 'ad_article' => '', 'ad_side' => '',
        'ads_txt_extra' => '',    // extra ads.txt lines for other ad networks (Google's line is added automatically)
        // Usage limits: free downloads per tool per day ('' or 0 = unlimited)
        'tool_limits' => '{}',    // JSON {slug: number}
        'limit_default' => '',    // applies to tools without their own number
        'limit_mode' => 'wait',   // 'wait' = until tomorrow, 'reward' = a Google Ad Manager rewarded ad unlocks more
        'reward_unit' => '',      // Ad Manager rewarded ad unit path, e.g. /1234567/rewarded_downloads
        'reward_uses' => '3',     // extra downloads per rewarded ad
        'head_code' => '', 'body_code' => '',
        'youtube_api_key' => '',
        'contact_email' => '',
        'schema_version' => '',
        // SEO
        'verify_google' => '', 'verify_bing' => '', 'verify_yandex' => '', 'verify_pinterest' => '',
        'social_profiles' => '',   // one URL per line (used in Organization schema and the footer)
        'indexnow_key' => '',
        'robots_extra' => '',
        'title_suffix' => '0',     // '1' adds " | Site name" to tool titles that are short enough
        // Hosted QR codes
        'qr_enabled' => '1', 'qr_days' => '30', 'qr_max_mb' => '10', 'qr_per_hour' => '20', 'qr_blocked' => '',
        // '1' lets AI tools (meta 'isolate') use every CPU core; ads can't show on those pages while it's on
        'ai_isolate' => '1',
    ];
}

function tf_settings(bool $fresh = false): array
{
    static $s = null;
    if ($s !== null && !$fresh) return $s;
    $s = tf_setting_defaults();
    if ($db = tf_db()) {
        try {
            foreach ($db->query('SELECT name, value FROM ' . tf_table('settings')) as $r) $s[$r['name']] = $r['value'];
        } catch (Throwable $e) {
            error_log('TidyFigure: could not read settings: ' . $e->getMessage());
        }
    }
    return $s;
}

function tf_save_settings(array $values): void
{
    $st = tf_db()->prepare('INSERT INTO ' . tf_table('settings') . ' (name, value, updated_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = VALUES(updated_at)');
    foreach ($values as $k => $v) $st->execute([$k, (string) $v, time()]);
    tf_settings(true);
}

// Per-tool switches and SEO overrides from the admin panel: slug => [enabled, title, description, noindex]
function tf_tool_settings(bool $fresh = false): array
{
    static $t = null;
    if ($t !== null && !$fresh) return $t;
    $t = [];
    if ($db = tf_db()) {
        try {
            foreach ($db->query('SELECT slug, enabled, title, description, noindex FROM ' . tf_table('tools')) as $r) $t[$r['slug']] = $r;
        } catch (Throwable $e) {
            error_log('TidyFigure: could not read tool settings: ' . $e->getMessage());
        }
    }
    return $t;
}

// AI tools marked 'isolate' in meta.php are sent with cross-origin isolation, which lets the AI use every CPU core
// (2–4× faster). Ad iframes can't load on such pages, so it's a switch in Ads & analytics.
function tf_tool_isolated(array $tool): bool
{
    return !empty($tool['isolate']) && tf_settings()['ai_isolate'] === '1';
}

function tf_tool_on(string $slug): bool
{
    $o = tf_tool_settings()[$slug] ?? null;
    return $o === null || (int) $o['enabled'] === 1;
}

// ---------- site, categories and tools ----------

function tf_site(): array
{
    static $s = null;
    if ($s === null) {
        $s = require TF_ROOT . '/app/site.php';
        $extra = require TF_ROOT . '/app/categories.php';
        foreach ($s['categories'] as &$c) $c += $extra[$c['id']] ?? ['slug' => $c['id'] . '-tools', 'title' => $c['name'], 'description' => $c['blurb'], 'intro' => '<p>' . $c['blurb'] . '</p>', 'faqs' => []];
        unset($c);
    }
    return $s;
}

function tf_category(string $idOrSlug): ?array
{
    foreach (tf_site()['categories'] as $c) if ($c['id'] === $idOrSlug || $c['slug'] === $idOrSlug) return $c;
    return null;
}

// Light details of every tool (no article text), sorted by category then order.
// Cached in storage/cache and rebuilt automatically whenever a meta.php file changes.
function tf_tools_all(): array
{
    static $all = null;
    if ($all !== null) return $all;
    $metas = glob(TF_ROOT . '/tools/*/meta.php') ?: [];
    $sig = count($metas) . '-' . ($metas ? max(array_map('filemtime', $metas)) : 0);
    $file = TF_CACHE . '/tools-index.php';
    $cached = is_file($file) ? (include $file) : null;
    if (is_array($cached) && ($cached['sig'] ?? '') === $sig) return $all = $cached['tools'];

    $order = array_flip(array_column(tf_site()['categories'], 'id'));
    $all = [];
    foreach ($metas as $f) {
        $m = include $f;
        $slug = basename(dirname($f));
        $all[$slug] = ['slug' => $slug] + array_intersect_key($m, array_flip(['name', 'category', 'order', 'icon', 'popular', 'keywords', 'aka', 'short', 'title', 'description', 'related']));
    }
    uasort($all, fn($a, $b) => [$order[$a['category']] ?? 99, $a['order'] ?? 99, $a['slug']] <=> [$order[$b['category']] ?? 99, $b['order'] ?? 99, $b['slug']]);
    if (is_dir(TF_CACHE) && is_writable(TF_CACHE)) {
        $tmp = $file . '.' . bin2hex(random_bytes(4));
        if (@file_put_contents($tmp, "<?php\nreturn " . var_export(['sig' => $sig, 'tools' => $all], true) . ";\n") !== false) {
            @rename($tmp, $file);
            if (function_exists('opcache_invalidate')) @opcache_invalidate($file, true);
        }
    }
    return $all;
}

// Tools that are switched on in the admin panel.
function tf_tools(): array
{
    return array_filter(tf_tools_all(), fn($t) => tf_tool_on($t['slug']));
}

// Everything needed to show one tool page, or null if it doesn't exist.
function tf_tool(string $slug): ?array
{
    if (!preg_match('/^[a-z0-9-]+$/', $slug) || !is_file(TF_ROOT . "/tools/$slug/meta.php")) return null;
    $m = include TF_ROOT . "/tools/$slug/meta.php";
    // A landing page can reuse another tool's markup and script with a preset ('use' + 'preset').
    $code = TF_ROOT . '/tools/' . (!empty($m['use']) ? $m['use'] : $slug);
    $m['slug'] = $slug;
    $m['html'] = preg_replace_callback('/\{\{icon:([a-z0-9-]+)\}\}/', fn($x) => tf_icon($x[1]), (string) @file_get_contents("$code/tool.html"));
    // {{setting:qr_days}} and {{setting:qr_max_mb}} show the admin's current limits in a tool's markup.
    $m['html'] = preg_replace_callback('/\{\{setting:(qr_days|qr_max_mb)\}\}/', fn($x) => h(tf_settings()[$x[1]]), $m['html']);
    $m['js'] = (string) @file_get_contents("$code/tool.js");
    if (!empty($m['use'])) {
        $m['js'] = 'const PRESET = ' . json_encode($m['preset'] ?? null, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . ";\n" . $m['js'];
        if (empty($m['libs'])) $m['libs'] = (include "$code/meta.php")['libs'] ?? [];
    }
    return $m;
}

// ---------- helpers ----------

function h(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// Inline SVG icon from app/icons. Falls back to a plain circle.
function tf_icon(string $name, string $cls = 'i'): string
{
    static $cache = [];
    $file = TF_ROOT . '/app/icons/' . preg_replace('/[^a-z0-9-]/', '', $name) . '.svg';
    $cache[$name] ??= is_file($file) ? trim((string) file_get_contents($file)) : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>';
    return preg_replace('/<svg/', '<svg class="' . h($cls) . '" aria-hidden="true" focusable="false"', $cache[$name], 1);
}

function tf_base_url(): string
{
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    $host = preg_replace('/[^a-z0-9.\-:]/i', '', $_SERVER['HTTP_HOST'] ?? 'localhost');
    return ($https ? 'https' : 'http') . '://' . $host . TF_BASE;
}

// Site-relative link: tf_url('word-counter') → /word-counter, tf_url('index') → /
// Free downloads per day for a tool (0 = unlimited): its own number, else the default.
function tf_tool_limit(string $slug): int
{
    $s = tf_settings();
    $own = json_decode($s['tool_limits'] ?: '{}', true);
    if (is_array($own) && isset($own[$slug]) && $own[$slug] !== '') return max(0, (int) $own[$slug]);
    return max(0, (int) $s['limit_default']);
}

// Contact email: the admin setting, then site.php, then hello@ + the domain the site runs on.
function tf_contact_email(): string
{
    $set = trim(tf_settings()['contact_email']) ?: trim(tf_site()['site']['email']);
    if ($set !== '') return $set;
    $host = strtolower(preg_replace('/:\d+$/', '', preg_replace('/[^a-z0-9.\-:]/i', '', $_SERVER['HTTP_HOST'] ?? 'localhost')));
    return 'hello@' . preg_replace('/^www\./', '', $host);
}

function tf_url(string $slug = 'index'): string
{
    return TF_BASE . ($slug === 'index' ? '/' : '/' . $slug);
}

function tf_asset(string $file): string
{
    $v = @filemtime(TF_ROOT . '/assets/' . $file);
    return TF_BASE . '/assets/' . $file . ($v ? '?v=' . $v : '');
}
