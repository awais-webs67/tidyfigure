<?php
// Share pages: things people make on the site and share as a link, without an account.
//   quiz     "How well do you know me?" — friends answer, get a score and appear on a scoreboard
//   giveaway a prize, a countdown and an entry form; winners are drawn at random (automatically or by the maker)
//   wedding  an online wedding invitation with the card, events, countdown, directions and RSVP
// Public page: /s/<code>. The maker gets a secret code; /s/<code>/manage?k=<secret> shows entries and lets them
// edit or delete. Only a hash of the secret is stored. Pages are noindex and are deleted after expires_at.
declare(strict_types=1);

const TF_SHARE_TYPES = ['quiz' => 'how-well-do-you-know-me', 'giveaway' => 'giveaway-maker', 'wedding' => 'wedding-card-maker'];
const TF_SHARE_THEMES = ['coral', 'violet', 'ocean', 'emerald', 'rose', 'midnight', 'sunset'];
const TF_WEDDING_TPLS = ['royal', 'emerald', 'blush', 'ivory', 'navy', 'mehndi', 'sage'];
const TF_SHARE_UPLOADS = TF_ROOT . '/storage/uploads/share';

// ---------- small helpers ----------

function tf_share_txt($v, int $n): string
{
    return mb_substr(trim((string) preg_replace('/\s+/u', ' ', strip_tags((string) $v))), 0, $n);
}

// Like tf_share_txt but keeps line breaks (at most two in a row).
function tf_share_para($v, int $n): string
{
    $s = str_replace("\r", '', strip_tags((string) $v));
    $s = preg_replace(["/[ \t]+/u", "/\n{3,}/"], [' ', "\n\n"], $s);
    return mb_substr(trim((string) $s), 0, $n);
}

function tf_share_url_ok(string $url): ?string
{
    $url = trim($url);
    if ($url === '') return '';
    if (!preg_match('~^https?://~i', $url)) $url = 'https://' . $url;
    if (strlen($url) > 1000 || !filter_var($url, FILTER_VALIDATE_URL)) return null;
    $host = strtolower((string) parse_url($url, PHP_URL_HOST));
    foreach (array_filter(array_map('trim', preg_split('/\R/', strtolower(tf_settings()['qr_blocked'])))) as $b) {
        if ($host === $b || str_ends_with($host, '.' . $b)) return null;
    }
    return $url;
}

function tf_share_ip(): string
{
    return hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '?') . '|share|' . (tf_config()['db']['name'] ?? 'tf'));
}

function tf_share_is_bot(): bool
{
    return (bool) preg_match('/bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|skype|curl|wget|python|headless/i', $_SERVER['HTTP_USER_AGENT'] ?? '');
}

// The secret code: 12 letters and digits shown as ABCD-EFGH-JKMN. Case and dashes don't matter when typed back.
function tf_share_new_key(): string
{
    $chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    $k = '';
    for ($i = 0; $i < 12; $i++) $k .= $chars[random_int(0, strlen($chars) - 1)];
    return implode('-', str_split($k, 4));
}

function tf_share_key_hash(string $key): string
{
    return hash('sha256', strtoupper((string) preg_replace('/[^a-z0-9]/i', '', $key)));
}

function tf_share_key_ok(array $r, string $key): bool
{
    return trim($key) !== '' && hash_equals($r['manage_hash'], tf_share_key_hash($key));
}

function tf_share_new_code(): string
{
    $chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    do {
        $code = '';
        for ($i = 0; $i < 7; $i++) $code .= $chars[random_int(0, strlen($chars) - 1)];
    } while (tf_share_find($code));
    return $code;
}

function tf_share_find(string $code): ?array
{
    if (!preg_match('/^[A-Za-z0-9]{4,12}$/', $code)) return null;
    $st = tf_db()->prepare('SELECT * FROM ' . tf_table('shares') . ' WHERE code = ?');
    $st->execute([$code]);
    $r = $st->fetch();
    if (!$r) return null;
    $r['d'] = json_decode((string) $r['data'], true) ?: [];
    $r['s'] = json_decode((string) $r['state'], true) ?: [];
    return $r;
}

function tf_share_save_state(array $r, array $state): void
{
    tf_db()->prepare('UPDATE ' . tf_table('shares') . ' SET state = ? WHERE id = ?')->execute([json_encode($state, JSON_UNESCAPED_UNICODE), $r['id']]);
}

function tf_share_url(array $r): string
{
    return tf_base_url() . '/s/' . $r['code'];
}

function tf_share_delete(int $id): void
{
    $db = tf_db();
    $st = $db->prepare('SELECT image FROM ' . tf_table('shares') . ' WHERE id = ?');
    $st->execute([$id]);
    $img = (string) $st->fetchColumn();
    if ($img !== '' && is_file(TF_SHARE_UPLOADS . '/' . $img)) @unlink(TF_SHARE_UPLOADS . '/' . $img);
    $db->prepare('DELETE FROM ' . tf_table('share_entries') . ' WHERE share_id = ?')->execute([$id]);
    $db->prepare('DELETE FROM ' . tf_table('shares') . ' WHERE id = ?')->execute([$id]);
}

// Deletes expired share pages. Runs now and then on normal requests, from the admin panel and from api/cron.php.
function tf_share_cleanup(bool $force = false): int
{
    if (!$force && random_int(1, 40) !== 1) return 0;
    $db = tf_db();
    if (!$db) return 0;
    $st = $db->prepare('SELECT id FROM ' . tf_table('shares') . ' WHERE expires_at <= ? LIMIT 500');
    $st->execute([time()]);
    $ids = $st->fetchAll(PDO::FETCH_COLUMN);
    foreach ($ids as $id) tf_share_delete((int) $id);
    return count($ids);
}

// ---------- cleaning what the maker sends ----------

// Returns [clean data, title, expires_at] or an error message.
function tf_share_clean(string $type, array $in, ?array $old = null)
{
    $theme = in_array($in['theme'] ?? '', TF_SHARE_THEMES, true) ? $in['theme'] : 'coral';
    if ($type === 'quiz') {
        $name = tf_share_txt($in['name'] ?? '', 40);
        if ($name === '') return 'Write your name first.';
        $qs = [];
        foreach (array_slice((array) ($in['qs'] ?? []), 0, 25) as $q) {
            if (!is_array($q)) continue;
            $t = tf_share_txt($q['q'] ?? '', 160);
            $o = array_values(array_filter(array_map(fn($x) => tf_share_txt($x, 70), array_slice((array) ($q['o'] ?? []), 0, 6)), 'strlen'));
            $a = (int) ($q['a'] ?? -1);
            if ($t === '' || count($o) < 2 || $a < 0 || $a >= count($o)) continue;
            $qs[] = ['q' => $t, 'o' => $o, 'a' => $a];
        }
        if (count($qs) < 3) return 'Answer at least 3 questions.';
        $created = $old ? (int) $old['created_at'] : time();
        return [['name' => $name, 'qs' => $qs, 'theme' => $theme], "How well do you know $name?", $created + 180 * 86400];
    }
    if ($type === 'giveaway') {
        $title = tf_share_txt($in['title'] ?? '', 120);
        if ($title === '') return 'Give your giveaway a title, like “Win a new phone”.';
        $ends = (int) ($in['ends'] ?? 0);
        if ($ends < time() + 60 && !($old && $ends === (int) ($old['d']['ends'] ?? 0))) return 'Choose an end time in the future.';
        if ($ends > time() + 366 * 86400) return 'A giveaway can run for up to a year.';
        $allowed = ['email' => 'Email', 'phone' => 'Phone / WhatsApp', 'instagram' => 'Instagram username', 'tiktok' => 'TikTok username', 'youtube' => 'YouTube channel name', 'facebook' => 'Facebook name', 'city' => 'City', 'q1' => '', 'q2' => '', 'q3' => ''];
        $fields = [];
        foreach ((array) ($in['fields'] ?? []) as $f) {
            if (!is_array($f) || !array_key_exists($f['k'] ?? '', $allowed) || isset($fields[$f['k']])) continue;
            $label = tf_share_txt($f['label'] ?? '', 80) ?: $allowed[$f['k']];
            if ($label === '') continue;
            $fields[$f['k']] = ['k' => $f['k'], 'label' => $label, 'req' => !empty($f['req'])];
        }
        $steps = [];
        foreach (array_slice((array) ($in['steps'] ?? []), 0, 8) as $st) {
            if (!is_array($st)) continue;
            $t = tf_share_txt($st['t'] ?? '', 140);
            if ($t === '') continue;
            $u = tf_share_url_ok((string) ($st['url'] ?? ''));
            if ($u === null) return 'One of the step links isn’t a valid web address (or that site isn’t allowed).';
            $steps[] = ['t' => $t, 'url' => $u];
        }
        $d = ['title' => $title, 'prize' => tf_share_para($in['prize'] ?? '', 400), 'host' => tf_share_txt($in['host'] ?? '', 60), 'desc' => tf_share_para($in['desc'] ?? '', 2000),
            'ends' => $ends, 'winners' => max(1, min(20, (int) ($in['winners'] ?? 1))), 'fields' => array_values($fields), 'steps' => $steps,
            'mode' => ($in['mode'] ?? '') === 'manual' ? 'manual' : 'auto', 'theme' => $theme, 'count' => !empty($in['count'])];
        return [$d, $title, $ends + 30 * 86400];
    }
    if ($type === 'wedding') {
        $groom = tf_share_txt($in['groom'] ?? '', 60);
        $bride = tf_share_txt($in['bride'] ?? '', 60);
        if ($groom === '' || $bride === '') return 'Write the names of the couple.';
        $events = [];
        $last = 0;
        foreach (array_slice((array) ($in['events'] ?? []), 0, 6) as $e) {
            if (!is_array($e)) continue;
            $name = tf_share_txt($e['name'] ?? '', 40);
            $date = preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) ($e['date'] ?? '')) ? (string) $e['date'] : '';
            if ($name === '' || $date === '' || !strtotime($date)) continue;
            $map = tf_share_url_ok((string) ($e['map'] ?? ''));
            if ($map === null) return 'One of the map links isn’t a valid web address.';
            $events[] = ['name' => $name, 'date' => $date, 'time' => preg_match('/^\d{2}:\d{2}$/', (string) ($e['time'] ?? '')) ? (string) $e['time'] : '',
                'venue' => tf_share_txt($e['venue'] ?? '', 120), 'address' => tf_share_txt($e['address'] ?? '', 220), 'map' => $map];
            $last = max($last, (int) strtotime($date));
        }
        if (!$events) return 'Add at least one event with a date.';
        $contacts = [];
        foreach (array_slice((array) ($in['contacts'] ?? []), 0, 3) as $c) {
            if (!is_array($c)) continue;
            $n = tf_share_txt($c['name'] ?? '', 40);
            $p = mb_substr((string) preg_replace('/[^\d+ ]/', '', (string) ($c['phone'] ?? '')), 0, 20);
            if ($n !== '' || $p !== '') $contacts[] = ['name' => $n, 'phone' => trim($p)];
        }
        $d = ['tpl' => in_array($in['tpl'] ?? '', TF_WEDDING_TPLS, true) ? $in['tpl'] : 'royal', 'lang' => ($in['lang'] ?? '') === 'ur' ? 'ur' : 'en',
            'bismillah' => !empty($in['bismillah']), 'groom' => $groom, 'bride' => $bride, 'gp' => tf_share_txt($in['gp'] ?? '', 120), 'bp' => tf_share_txt($in['bp'] ?? '', 120),
            'msg' => tf_share_para($in['msg'] ?? '', 400), 'events' => $events, 'rsvp' => !empty($in['rsvp']),
            'rsvp_by' => preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) ($in['rsvp_by'] ?? '')) ? (string) $in['rsvp_by'] : '', 'contacts' => $contacts,
            'hosts' => tf_share_txt($in['hosts'] ?? '', 120)];
        $title = ($d['lang'] === 'ur' ? 'شادی کی تقریب' : 'Wedding invitation') . ": $groom & $bride";
        return [$d, $title, min($last + 30 * 86400, time() + 2 * 366 * 86400)];
    }
    return 'Unknown type.';
}

// What visitors' browsers may see: quiz answers and giveaway entrants' details stay on the server.
function tf_share_public(array $r): array
{
    $d = $r['d'];
    if ($r['type'] === 'quiz') $d['qs'] = array_map(fn($q) => ['q' => $q['q'], 'o' => $q['o']], $d['qs']);
    $out = ['code' => $r['code'], 'type' => $r['type'], 'url' => tf_share_url($r), 'title' => $r['title'], 'd' => $d, 'entries' => (int) $r['entries'],
        'image' => $r['image'] !== '' ? tf_url('s/' . $r['code'] . '/image') . '?v=' . (int) $r['updated_at'] : '', 'expires' => (int) $r['expires_at'], 'now' => time(),
        'tool' => tf_url(TF_SHARE_TYPES[$r['type']]), 'site' => tf_site()['site']['name']];
    if ($r['type'] === 'giveaway') $out['winners'] = tf_share_winners_public($r);
    if ($r['type'] === 'quiz') $out['board'] = tf_share_board($r);
    return $out;
}

// ---------- entries ----------

function tf_share_entries(array $r, int $limit = 5000): array
{
    $st = tf_db()->prepare('SELECT id, name, uniq, data, score, created_at FROM ' . tf_table('share_entries') . ' WHERE share_id = ? ORDER BY id LIMIT ' . $limit);
    $st->execute([$r['id']]);
    return array_map(fn($e) => ['id' => (int) $e['id'], 'name' => $e['name'], 'd' => json_decode((string) $e['data'], true) ?: [], 'score' => (int) $e['score'], 'at' => (int) $e['created_at']], $st->fetchAll());
}

function tf_share_board(array $r): array
{
    $st = tf_db()->prepare('SELECT id, name, score, created_at FROM ' . tf_table('share_entries') . ' WHERE share_id = ? ORDER BY score DESC, id ASC LIMIT 100');
    $st->execute([$r['id']]);
    return array_map(fn($e) => ['id' => (int) $e['id'], 'name' => $e['name'], 'score' => (int) $e['score']], $st->fetchAll());
}

// Entries from one visitor in the last hour (all share pages, or one).
function tf_share_recent_from_ip(?int $shareId = null): int
{
    $sql = 'SELECT COUNT(*) FROM ' . tf_table('share_entries') . ' WHERE ip_hash = ? AND created_at > ?' . ($shareId ? ' AND share_id = ?' : '');
    $st = tf_db()->prepare($sql);
    $st->execute(array_merge([tf_share_ip(), time() - 3600], $shareId ? [$shareId] : []));
    return (int) $st->fetchColumn();
}

function tf_share_add_entry(array $r, string $name, string $uniq, array $data, int $score = 0): int
{
    $db = tf_db();
    $db->prepare('INSERT INTO ' . tf_table('share_entries') . ' (share_id, name, uniq, data, score, ip_hash, created_at) VALUES (?,?,?,?,?,?,?)')
        ->execute([$r['id'], $name, $uniq, json_encode($data, JSON_UNESCAPED_UNICODE), $score, tf_share_ip(), time()]);
    $id = (int) $db->lastInsertId();
    $db->prepare('UPDATE ' . tf_table('shares') . ' SET entries = entries + 1 WHERE id = ?')->execute([$r['id']]);
    return $id;
}

// Giveaway entry: checks each field. Returns [name, uniq, data] or an error message.
function tf_share_clean_entry(array $r, array $in)
{
    $name = tf_share_txt($in['name'] ?? '', 60);
    if ($name === '') return 'Write your name.';
    $data = [];
    $uniq = '';
    foreach ($r['d']['fields'] as $f) {
        $k = $f['k'];
        $v = trim((string) ($in[$k] ?? ''));
        if ($v === '') {
            if ($f['req']) return 'Please fill in “' . $f['label'] . '”.';
            continue;
        }
        if ($k === 'email') {
            $v = mb_substr(strtolower($v), 0, 120);
            if (!filter_var($v, FILTER_VALIDATE_EMAIL)) return 'That email address doesn’t look right.';
        } elseif ($k === 'phone') {
            $digits = preg_replace('/\D/', '', $v);
            if (strlen($digits) < 7 || strlen($digits) > 15) return 'That phone number doesn’t look right.';
            $v = mb_substr(preg_replace('/[^\d+ -]/', '', $v), 0, 24);
        } elseif (in_array($k, ['instagram', 'tiktok'], true)) {
            $v = ltrim(preg_replace('~^https?://(www\.)?[^/]+/@?~i', '', $v), '@');
            $v = trim($v, '/ ');
            if (!preg_match('/^[A-Za-z0-9._]{1,30}$/', $v)) return 'Write just your ' . ($k === 'tiktok' ? 'TikTok' : 'Instagram') . ' username, like @yourname.';
            $v = '@' . $v;
        } else {
            $v = tf_share_txt($v, 200);
        }
        $data[$k] = $v;
        if ($uniq === '' && in_array($k, ['email', 'phone', 'instagram', 'tiktok', 'youtube', 'facebook'], true)) {
            $uniq = $k . ':' . ($k === 'phone' ? substr(preg_replace('/\D/', '', $v), -10) : mb_strtolower($v));
        }
    }
    if ($uniq === '') $uniq = 'name:' . mb_strtolower($name);
    return [$name, mb_substr($uniq, 0, 100), $data];
}

// ---------- giveaway winners ----------

// Draws winners at random (random_int is cryptographically secure). A redraw leaves out earlier winners.
function tf_share_draw(array $r, bool $redraw = false): array
{
    $ids = array_map('intval', tf_db()->query('SELECT id FROM ' . tf_table('share_entries') . ' WHERE share_id = ' . (int) $r['id'])->fetchAll(PDO::FETCH_COLUMN));
    $state = $r['s'];
    $skip = $redraw ? array_merge($state['winners'] ?? [], $state['past'] ?? []) : [];
    $pool = array_values(array_diff($ids, $skip));
    for ($i = count($pool) - 1; $i > 0; $i--) {
        $j = random_int(0, $i);
        [$pool[$i], $pool[$j]] = [$pool[$j], $pool[$i]];
    }
    $state = ['winners' => array_slice($pool, 0, (int) $r['d']['winners']), 'picked_at' => time(), 'from' => count($ids), 'draws' => (int) ($state['draws'] ?? 0) + 1,
        'past' => $redraw ? array_values(array_unique(array_merge($state['past'] ?? [], $state['winners'] ?? []))) : []];
    tf_share_save_state($r, $state);
    return $state;
}

// When an automatic giveaway has ended, draw once (on the first visit after the end).
function tf_share_auto_draw(array &$r): void
{
    if ($r['type'] !== 'giveaway' || $r['d']['mode'] !== 'auto' || !empty($r['s']['picked_at']) || (int) $r['d']['ends'] > time() || (int) $r['entries'] < 1) return;
    $r['s'] = tf_share_draw($r);
}

function tf_share_mask(string $v): string
{
    $v = trim($v);
    if (str_contains($v, '@') && !str_starts_with($v, '@')) { [$a, $b] = explode('@', $v, 2); return mb_substr($a, 0, 2) . '•••@' . $b; }
    $n = mb_strlen($v);
    if ($n <= 4) return mb_substr($v, 0, 1) . '•••';
    return mb_substr($v, 0, $n > 8 ? 4 : 2) . str_repeat('•', max(3, $n - 6)) . mb_substr($v, -2);
}

function tf_share_winners_public(array $r): array
{
    $ids = $r['s']['winners'] ?? [];
    if (!$ids) return [];
    $in = implode(',', array_map('intval', $ids));
    $rows = tf_db()->query('SELECT id, name, data FROM ' . tf_table('share_entries') . " WHERE id IN ($in)")->fetchAll();
    $by = array_column($rows, null, 'id');
    $out = [];
    foreach ($ids as $id) {
        if (!isset($by[$id])) continue;
        $d = json_decode((string) $by[$id]['data'], true) ?: [];
        $handle = '';
        foreach (['instagram', 'tiktok', 'youtube', 'email', 'phone'] as $k) if (!empty($d[$k])) { $handle = tf_share_mask((string) $d[$k]); break; }
        $out[] = ['name' => $by[$id]['name'], 'handle' => $handle];
    }
    return $out;
}

// ---------- pages ----------

function tf_share_page(array $r, string $title, string $desc, string $inner, array $js, bool $manage = false): void
{
    require_once TF_ROOT . '/app/render.php';
    tf_layout_globals();
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex');
    $tool = TF_SHARE_TYPES[$r['type']];
    $scripts = '<script>window.SHARE=' . json_encode($js, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) . ';</script>' . "\n"
        . '<script src="' . h(tf_asset('app.js')) . '"></script>' . "\n";
    if ($r['type'] === 'wedding') $scripts .= '<script src="' . h(tf_asset('wedding-card.js')) . '"></script>' . "\n";
    $scripts .= '<script src="' . h(tf_asset('share.js')) . '"></script>';
    echo tf_layout(['title' => $title, 'description' => $desc, 'slug' => 's/' . $r['code'] . ($manage ? '/manage' : ''), 'schema' => [], 'noindex' => true, 'scripts' => $scripts,
        'og' => tf_base_url() . '/og/' . $tool . '.png', 'css' => ['share.css'], 'noads' => $manage],
        '<main class="sh-page sh-' . h($r['type']) . ' sh-t-' . h($r['d']['theme'] ?? ($r['d']['tpl'] ?? 'coral')) . '" id="sh">' . $inner . '</main>');
}

function tf_share_gone(string $heading, string $text, int $status = 404, string $type = 'quiz'): void
{
    require_once TF_ROOT . '/app/render.php';
    tf_layout_globals();
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex');
    echo tf_layout(['title' => $heading . ' | ' . tf_site()['site']['name'], 'description' => $text, 'slug' => null, 'schema' => [], 'noindex' => true, 'scripts' => '', 'css' => ['share.css']],
        '<main class="sh-page"><section class="sh-card sh-center">' . tf_icon('circle-alert') . '<h1>' . h($heading) . '</h1><p class="sub">' . $text . '</p><p><a class="btn" href="' . h(tf_url(TF_SHARE_TYPES[$type] ?? TF_SHARE_TYPES['quiz'])) . '">Make your own</a></p></section></main>');
}

function tf_share_route(string $code, string $sub): void
{
    $db = tf_db();
    if (!$db) { tf_share_gone('Page unavailable', 'This site’s database isn’t reachable right now. Please try again later.', 503); return; }
    tf_migrate();
    tf_share_cleanup();
    $r = tf_share_find($code);
    if (!$r) { tf_share_gone('Not found', 'This link doesn’t exist, or it has expired and been deleted.'); return; }
    if ($sub === 'image') {
        $path = TF_SHARE_UPLOADS . '/' . $r['image'];
        if ($r['image'] === '' || !is_file($path)) { http_response_code(404); return; }
        header('Content-Type: ' . (str_ends_with($path, '.png') ? 'image/png' : (str_ends_with($path, '.webp') ? 'image/webp' : 'image/jpeg')));
        header('Content-Length: ' . filesize($path));
        header('Cache-Control: public, max-age=86400');
        header('X-Content-Type-Options: nosniff');
        readfile($path);
        return;
    }
    $key = (string) ($_GET['k'] ?? '');
    if ($sub === 'manage') {
        if (!tf_share_key_ok($r, $key)) { tf_share_gone('Wrong or missing secret code', 'Open the manage link you saved, or type your secret code on the tool page.', 403, $r['type']); return; }
        tf_share_auto_draw($r);
        tf_share_manage($r, $key);
        return;
    }
    if ($r['status'] === 'blocked') { tf_share_gone('Not available', 'This page has been disabled.', 451, $r['type']); return; }
    if (!tf_share_is_bot()) $db->prepare('UPDATE ' . tf_table('shares') . ' SET views = views + 1 WHERE id = ?')->execute([$r['id']]);
    tf_share_auto_draw($r);
    $pub = tf_share_public($r);
    $d = $r['d'];
    $site = h(tf_site()['site']['name']);
    $foot = '<footer class="sh-foot"><a class="sh-make" href="' . h($pub['tool']) . '">' . tf_icon('sparkles') . '<span>Make your own, free</span></a>'
        . '<p>Made with <a href="' . h(tf_url()) . '">' . $site . '</a>. ' . $site . ' doesn’t check what its users make. <button type="button" class="linkbtn" id="sh-report">Report this page</button></p></footer>';
    if ($r['type'] === 'quiz') {
        $n = h($d['name']);
        tf_share_page($r, "How well do you know {$d['name']}? Take the quiz", "{$d['name']} made a quiz about themselves. Answer " . count($d['qs']) . ' questions and see how well you really know them.',
            '<div class="sh-wrap" id="sh-app"><section class="sh-card sh-hero"><div class="sh-avatar">' . h(mb_strtoupper(mb_substr($d['name'], 0, 1))) . '</div><p class="sh-kicker">Friendship quiz</p><h1>How well do you know <em>' . $n . '</em>?</h1><p class="sub">' . count($d['qs']) . ' questions · ' . (int) $r['entries'] . ' friend' . ((int) $r['entries'] === 1 ? '' : 's') . ' played</p><noscript><p>Turn on JavaScript to play.</p></noscript></section></div>' . $foot,
            $pub);
        return;
    }
    if ($r['type'] === 'giveaway') {
        tf_share_page($r, $d['title'] . ($d['host'] ? ' · Giveaway by ' . $d['host'] : ' · Giveaway'), mb_substr(($d['prize'] ?: $d['title']) . '. Enter before the countdown ends.', 0, 160),
            '<div class="sh-wrap" id="sh-app"><section class="sh-card sh-hero"><p class="sh-kicker">Giveaway</p><h1>' . h($d['title']) . '</h1><noscript><p>Turn on JavaScript to enter.</p></noscript></section></div>' . $foot, $pub);
        return;
    }
    tf_share_page($r, $d['groom'] . ' & ' . $d['bride'] . ' · Wedding invitation', 'You’re invited to the wedding of ' . $d['groom'] . ' and ' . $d['bride'] . '. See the dates, venues and directions, and let them know if you can come.',
        '<div class="sh-wrap" id="sh-app"><section class="sh-card sh-hero"><p class="sh-kicker">Wedding invitation</p><h1>' . h($d['groom']) . ' &amp; ' . h($d['bride']) . '</h1><noscript><p>Turn on JavaScript to see the invitation.</p></noscript></section></div>' . $foot, $pub);
}

function tf_share_manage(array $r, string $key): void
{
    $pub = tf_share_public($r);
    $pub['manage'] = true;
    $pub['key'] = $key;
    $pub['views'] = (int) $r['views'];
    $pub['created'] = (int) $r['created_at'];
    $pub['list'] = tf_share_entries($r);
    if ($r['type'] === 'giveaway') $pub['state'] = ['picked_at' => (int) ($r['s']['picked_at'] ?? 0), 'from' => (int) ($r['s']['from'] ?? 0), 'winners' => $r['s']['winners'] ?? [], 'draws' => (int) ($r['s']['draws'] ?? 0)];
    if ($r['type'] === 'quiz') $pub['d'] = $r['d']; // the maker sees their own answers
    $pub['edit'] = tf_url(TF_SHARE_TYPES[$r['type']]) . '?edit=' . rawurlencode($r['code']);
    tf_share_page($r, 'Manage: ' . $r['title'], 'Your private manage page.', '<div class="sh-wrap sh-wide" id="sh-app"><section class="sh-card"><p class="sh-kicker">Loading your page…</p></section></div>', $pub, true);
}

// ---------- images (giveaway) ----------

// Stores an uploaded picture. Returns the stored path or an error message.
function tf_share_store_image(array $f)
{
    if (($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) return 'The picture didn’t upload. Please try another one.';
    if ($f['size'] > 3 * 1048576) return 'Pictures can be up to 3 MB.';
    $type = function_exists('finfo_open') ? (string) finfo_file(finfo_open(FILEINFO_MIME_TYPE), $f['tmp_name']) : (string) ($f['type'] ?? '');
    $ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'][$type] ?? null;
    if (!$ext || !@getimagesize($f['tmp_name'])) return 'Use a JPG, PNG or WebP picture.';
    $dir = date('Y/m');
    if (!is_dir(TF_SHARE_UPLOADS . "/$dir") && !@mkdir(TF_SHARE_UPLOADS . "/$dir", 0755, true)) return 'The server can’t save pictures right now.';
    $path = $dir . '/' . bin2hex(random_bytes(12)) . '.' . $ext;
    if (!move_uploaded_file($f['tmp_name'], TF_SHARE_UPLOADS . '/' . $path)) return 'The server couldn’t save the picture.';
    return $path;
}
