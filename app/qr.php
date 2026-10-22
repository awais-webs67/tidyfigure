<?php
// Hosted QR codes: dynamic links, hosted files and verification pages at /q/<code>.
// Each code has a private manage link (?k=...) for stats, editing and deleting, and is deleted
// automatically after the number of days set in the admin panel (30 by default).
declare(strict_types=1);

const TF_UPLOADS = TF_ROOT . '/storage/uploads';
const TF_QR_TYPES = ['application/pdf' => 'pdf', 'image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif', 'audio/mpeg' => 'mp3', 'video/mp4' => 'mp4'];

function tf_qr_ip_hash(): string
{
    return hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '?') . '|' . (tf_config()['db']['name'] ?? 'tf'));
}

function tf_qr_find(string $code): ?array
{
    $st = tf_db()->prepare('SELECT * FROM ' . tf_table('qr_codes') . ' WHERE code = ?');
    $st->execute([$code]);
    $r = $st->fetch();
    return $r ?: null;
}

function tf_qr_key_ok(array $row, string $key): bool
{
    return $key !== '' && hash_equals($row['manage_hash'], hash('sha256', $key));
}

function tf_qr_is_bot(): bool
{
    return (bool) preg_match('/bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|skype|curl|wget|python|headless/i', $_SERVER['HTTP_USER_AGENT'] ?? '');
}

function tf_qr_count_scan(array $row): void
{
    if (tf_qr_is_bot()) return;
    $db = tf_db();
    $db->prepare('UPDATE ' . tf_table('qr_codes') . ' SET scans = scans + 1, last_scan_at = ? WHERE id = ?')->execute([time(), $row['id']]);
    $mobile = (bool) preg_match('/Mobi|Android|iPhone|iPad/i', $_SERVER['HTTP_USER_AGENT'] ?? '');
    $col = $mobile ? 'mobile' : 'desktop';
    $db->prepare('INSERT INTO ' . tf_table('qr_scans') . " (qr_id, day, $col) VALUES (?, CURDATE(), 1) ON DUPLICATE KEY UPDATE $col = $col + 1")->execute([$row['id']]);
}

function tf_qr_delete(int $id): void
{
    $db = tf_db();
    $st = $db->prepare('SELECT file_path FROM ' . tf_table('qr_codes') . ' WHERE id = ?');
    $st->execute([$id]);
    $path = (string) $st->fetchColumn();
    if ($path !== '' && is_file(TF_UPLOADS . '/' . $path)) @unlink(TF_UPLOADS . '/' . $path);
    $db->prepare('DELETE FROM ' . tf_table('qr_scans') . ' WHERE qr_id = ?')->execute([$id]);
    $db->prepare('DELETE FROM ' . tf_table('qr_codes') . ' WHERE id = ?')->execute([$id]);
}

// Deletes expired codes and their files. Runs now and then on normal requests, from the admin panel, and from api/cron.php.
function tf_qr_cleanup(bool $force = false): int
{
    if (!$force && random_int(1, 40) !== 1) return 0;
    $db = tf_db();
    if (!$db) return 0;
    $st = $db->prepare('SELECT id FROM ' . tf_table('qr_codes') . ' WHERE expires_at <= ? LIMIT 500');
    $st->execute([time()]);
    $ids = $st->fetchAll(PDO::FETCH_COLUMN);
    foreach ($ids as $id) tf_qr_delete((int) $id);
    return count($ids);
}

// ---------- creating and editing (used by api/qr.php) ----------

function tf_qr_check_link(string $url): ?string
{
    $url = trim($url);
    if (!preg_match('~^https?://~i', $url)) $url = 'https://' . $url;
    if (strlen($url) > 2000 || !filter_var($url, FILTER_VALIDATE_URL)) return 'Enter a valid web address, like https://example.com/menu.';
    $host = strtolower((string) parse_url($url, PHP_URL_HOST));
    $own = strtolower((string) parse_url(tf_base_url(), PHP_URL_HOST));
    if ($host === $own && str_starts_with((string) parse_url($url, PHP_URL_PATH), TF_BASE . '/q/')) return 'A QR code can’t point to another hosted QR code.';
    foreach (array_filter(array_map('trim', preg_split('/\R/', strtolower(tf_settings()['qr_blocked'])))) as $b) {
        if ($host === $b || str_ends_with($host, '.' . $b)) return 'Links to that website aren’t allowed.';
    }
    return null;
}

function tf_qr_clean_verify(array $in): array
{
    $c = fn($v, $n = 200) => mb_substr(trim(strip_tags((string) $v)), 0, $n);
    $fields = [];
    foreach (array_slice((array) ($in['fields'] ?? []), 0, 12) as $f) {
        $l = $c($f[0] ?? '', 60);
        $v = $c($f[1] ?? '', 300);
        if ($l !== '' && $v !== '') $fields[] = [$l, $v];
    }
    $status = in_array($in['status'] ?? '', ['valid', 'expired', 'revoked'], true) ? $in['status'] : 'valid';
    return ['doc' => $c($in['doc'] ?? '', 120), 'to' => $c($in['to'] ?? '', 160), 'by' => $c($in['by'] ?? '', 160), 'issued' => $c($in['issued'] ?? '', 20), 'until' => $c($in['until'] ?? '', 20), 'ref' => $c($in['ref'] ?? '', 80), 'status' => $status, 'fields' => $fields, 'note' => $c($in['note'] ?? '', 600)];
}

// Validates and stores an uploaded file. Returns [path, name, type, size] or an error string.
function tf_qr_store_file(array $f)
{
    if (($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        return in_array($f['error'] ?? 0, [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true) ? 'That file is too big for this server.' : 'The file didn’t upload. Please try again.';
    }
    $max = (int) tf_settings()['qr_max_mb'] * 1048576;
    if ($f['size'] > $max) return 'Files can be up to ' . tf_settings()['qr_max_mb'] . ' MB.';
    $type = function_exists('finfo_open') ? (string) finfo_file(finfo_open(FILEINFO_MIME_TYPE), $f['tmp_name']) : (string) ($f['type'] ?? '');
    if (!isset(TF_QR_TYPES[$type])) return 'Upload a PDF, JPG, PNG, WebP, GIF, MP3 or MP4 file.';
    $dir = date('Y/m');
    if (!is_dir(TF_UPLOADS . "/$dir") && !@mkdir(TF_UPLOADS . "/$dir", 0755, true)) return 'The server can’t save files right now (storage folder not writable).';
    $path = $dir . '/' . bin2hex(random_bytes(12)) . '.' . TF_QR_TYPES[$type];
    if (!move_uploaded_file($f['tmp_name'], TF_UPLOADS . '/' . $path)) return 'The server couldn’t save the file.';
    $name = mb_substr(preg_replace('/[^\p{L}\p{N} ._()-]+/u', '_', basename((string) $f['name'])), 0, 180) ?: 'file.' . TF_QR_TYPES[$type];
    return [$path, $name, $type, (int) $f['size']];
}

function tf_qr_new_code(): string
{
    $chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    do {
        $code = '';
        for ($i = 0; $i < 7; $i++) $code .= $chars[random_int(0, strlen($chars) - 1)];
    } while (tf_qr_find($code));
    return $code;
}

function tf_qr_public(array $r, ?string $key = null): array
{
    $out = ['code' => $r['code'], 'type' => $r['type'], 'url' => tf_base_url() . '/q/' . $r['code'], 'title' => $r['title'], 'target' => $r['target'], 'scans' => (int) $r['scans'],
        'created' => (int) $r['created_at'], 'expires' => (int) $r['expires_at'], 'file' => $r['file_name'] ? ['name' => $r['file_name'], 'type' => $r['file_type'], 'size' => (int) $r['file_size']] : null,
        'data' => $r['data'] ? json_decode((string) $r['data'], true) : null];
    if ($key) $out['manage'] = tf_base_url() . '/q/' . $r['code'] . '/manage?k=' . $key;
    return $out;
}

// ---------- pages ----------

function tf_qr_page(string $title, string $inner, bool $wide = false): void
{
    require_once TF_ROOT . '/app/render.php';
    tf_layout_globals();
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex');
    echo tf_layout(['title' => $title . ' | ' . tf_site()['site']['name'], 'description' => $title, 'slug' => 'index', 'schema' => [], 'noindex' => true, 'scripts' => '<script>window.TF_QR=true</script>'],
        '<main class="wrap qr-host' . ($wide ? ' wide' : '') . '">' . $inner . '</main>');
}

function tf_qr_gone(string $heading, string $text, int $status = 404): void
{
    http_response_code($status);
    tf_qr_page($heading, '<section class="qr-card qr-gone">' . tf_icon('circle-alert') . '<h1>' . h($heading) . '</h1><p>' . $text . '</p><p><a class="btn" href="' . h(tf_url('qr-code-tools')) . '">Make your own QR code</a></p></section>');
}

function tf_qr_route(string $code, string $sub): void
{
    $db = tf_db();
    if (!$db) { tf_qr_gone('QR code unavailable', 'This site’s database isn’t reachable right now. Please try again later.', 503); return; }
    tf_migrate();
    tf_qr_cleanup();
    $r = tf_qr_find($code);
    $days = (int) tf_settings()['qr_days'];
    if (!$r) { tf_qr_gone('QR code not found', 'This QR code doesn’t exist, or it has expired. Hosted QR codes are deleted ' . $days . ' days after they are made.'); return; }
    $key = (string) ($_GET['k'] ?? $_POST['k'] ?? '');
    if ($sub === 'manage') { tf_qr_manage($r, $key); return; }
    if ((int) $r['expires_at'] <= time()) { tf_qr_gone('This QR code has expired', 'The person who made it can create a new one.', 410); return; }
    if ($r['status'] === 'blocked') { tf_qr_gone('QR code not available', 'This QR code has been disabled.', 451); return; }

    if ($sub === 'file') {
        $path = TF_UPLOADS . '/' . $r['file_path'];
        if (!$r['file_path'] || !is_file($path)) { http_response_code(404); return; }
        header('Content-Type: ' . $r['file_type']);
        header('Content-Length: ' . filesize($path));
        header('Content-Disposition: ' . (isset($_GET['dl']) ? 'attachment' : 'inline') . '; filename="' . str_replace('"', '', $r['file_name']) . '"; filename*=UTF-8\'\'' . rawurlencode($r['file_name']));
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: private, max-age=3600');
        header('X-Robots-Tag: noindex');
        readfile($path);
        return;
    }
    if ($r['type'] === 'link') {
        tf_qr_count_scan($r);
        header('Cache-Control: no-store');
        header('X-Robots-Tag: noindex');
        header('Location: ' . $r['target'], true, 302);
        return;
    }
    tf_qr_count_scan($r);
    $r['type'] === 'file' ? tf_qr_show_file($r) : tf_qr_show_verify($r);
}

function tf_qr_file_preview(array $r): string
{
    $src = h(tf_url('q/' . $r['code'] . '/file'));
    if (str_starts_with($r['file_type'], 'image/')) return '<img class="qr-media" src="' . $src . '" alt="' . h($r['file_name']) . '">';
    if ($r['file_type'] === 'application/pdf') return '<object class="qr-pdf" data="' . $src . '" type="application/pdf"><p class="note">Your browser can’t show the PDF here. Use the download button.</p></object>';
    if ($r['file_type'] === 'audio/mpeg') return '<audio class="player" controls src="' . $src . '"></audio>';
    if ($r['file_type'] === 'video/mp4') return '<video class="player" controls playsinline src="' . $src . '"></video>';
    return '';
}

function tf_qr_footer(array $r): string
{
    $site = tf_site()['site']['name'];
    return '<p class="qr-small">Hosted by <a href="' . h(tf_url()) . '">' . h($site) . '</a> until ' . date('j F Y', (int) $r['expires_at']) . '. ' . h($site) . ' doesn’t check content made by its users.
<button type="button" class="linkbtn" data-report="' . h($r['code']) . '">Report this QR code</button></p>
<script>document.querySelectorAll("[data-report]").forEach(function(b){b.addEventListener("click",function(){if(!confirm("Report this QR code as misleading, harmful or illegal?"))return;var f=new FormData();f.append("action","report");f.append("code",b.dataset.report);fetch((window.TF_BASE||"")+"/api/qr.php",{method:"POST",body:f}).then(function(){b.outerHTML="<b>Thanks, we’ll review it.</b>"});});});</script>';
}

function tf_qr_show_file(array $r): void
{
    $dl = h(tf_url('q/' . $r['code'] . '/file') . '?dl=1');
    tf_qr_page($r['title'] ?: $r['file_name'], '<section class="qr-card">
<p class="kicker">Shared file</p><h1>' . h($r['title'] ?: $r['file_name']) . '</h1>
<p class="sub">' . h($r['file_name']) . ' · ' . h(strtoupper(TF_QR_TYPES[$r['file_type']] ?? '')) . ' · ' . h(tf_qr_bytes((int) $r['file_size'])) . '</p>
' . tf_qr_file_preview($r) . '
<div class="btns"><a class="btn big-btn" href="' . $dl . '">' . tf_icon('download') . 'Download</a></div>
' . tf_qr_footer($r) . '</section>', true);
}

function tf_qr_bytes(int $n): string
{
    return $n < 1048576 ? max(1, round($n / 1024)) . ' KB' : round($n / 1048576, 1) . ' MB';
}

function tf_qr_verify_card(array $d, ?array $r = null): string
{
    $state = $d['status'] ?? 'valid';
    if ($state === 'valid' && !empty($d['until']) && strtotime($d['until'] . ' 23:59:59') < time()) $state = 'expired';
    [$cls, $label] = ['valid' => ['ok', 'Valid'], 'expired' => ['tight', 'Expired'], 'revoked' => ['no', 'Revoked']][$state];
    $date = fn($s) => $s && strtotime($s) ? date('j F Y', strtotime($s)) : h($s);
    $rows = '';
    foreach ([['Issued to', $d['to'] ?? ''], ['Issued by', $d['by'] ?? ''], ['Issue date', !empty($d['issued']) ? $date($d['issued']) : ''], ['Valid until', !empty($d['until']) ? $date($d['until']) : ''], ['Reference', $d['ref'] ?? '']] as [$l, $v]) {
        if ($v !== '') $rows .= '<tr><th>' . h($l) . '</th><td>' . ($l === 'Issue date' || $l === 'Valid until' ? $v : h($v)) . '</td></tr>';
    }
    foreach ($d['fields'] ?? [] as [$l, $v]) $rows .= '<tr><th>' . h($l) . '</th><td>' . h($v) . '</td></tr>';
    return '<div class="vcard"><div class="vcard-head ' . $cls . '">' . tf_icon($state === 'valid' ? 'badge-check' : 'circle-alert') . '<div><b>' . $label . '</b><small>Record found' . ($r ? ' · ID ' . h($r['code']) : '') . '</small></div></div>
<h1>' . h(($d['doc'] ?? '') ?: 'Verification record') . '</h1>
<table class="vtable"><tbody>' . $rows . '</tbody></table>' . (!empty($d['note']) ? '<p class="vnote">' . nl2br(h($d['note'])) . '</p>' : '') . '</div>';
}

function tf_qr_show_verify(array $r): void
{
    $d = json_decode((string) $r['data'], true) ?: [];
    $file = $r['file_path'] ? '<div class="vfile"><p class="kicker">Attached document</p>' . tf_qr_file_preview($r) . '<a class="btn ghost" href="' . h(tf_url('q/' . $r['code'] . '/file') . '?dl=1') . '">' . tf_icon('download') . 'Download ' . h($r['file_name']) . '</a></div>' : '';
    tf_qr_page(($d['doc'] ?? '') ?: 'Verification', '<section class="qr-card">' . tf_qr_verify_card($d, $r) . $file . '
<p class="qr-small"><b>This record was published by the issuer named above</b> using ' . h(tf_site()['site']['name']) . ', on ' . date('j F Y', (int) $r['created_at']) . '. If anything looks wrong, contact the issuer directly.</p>' . tf_qr_footer($r) . '</section>');
}

function tf_qr_manage(array $r, string $key): void
{
    if (!tf_qr_key_ok($r, $key)) { tf_qr_gone('Wrong or missing manage link', 'Open the private manage link you saved when you made this QR code.', 403); return; }
    $db = tf_db();
    $st = $db->prepare('SELECT day, mobile, desktop FROM ' . tf_table('qr_scans') . ' WHERE qr_id = ? AND day >= DATE_SUB(CURDATE(), INTERVAL 29 DAY) ORDER BY day');
    $st->execute([$r['id']]);
    $days = array_column($st->fetchAll(), null, 'day');
    $bars = '';
    $max = 1;
    $series = [];
    for ($i = 29; $i >= 0; $i--) { $d = date('Y-m-d', strtotime("-$i days")); $n = isset($days[$d]) ? $days[$d]['mobile'] + $days[$d]['desktop'] : 0; $series[$d] = $n; $max = max($max, $n); }
    foreach ($series as $d => $n) $bars .= '<i style="height:' . max(2, round($n / $max * 100)) . '%" title="' . h(date('j M', strtotime($d)) . ": $n scans") . '"></i>';
    $mob = array_sum(array_column($days, 'mobile'));
    $desk = array_sum(array_column($days, 'desktop'));
    $pub = tf_qr_public($r, $key);
    $expired = (int) $r['expires_at'] <= time();
    $editor = '';
    if ($r['type'] === 'link') $editor = '<label class="f"><span>Destination link</span><input type="text" inputmode="url" autocapitalize="off" name="target" value="' . h((string) $r['target']) . '" required></label>';
    $editor .= '<label class="f"><span>Title (for your reference)</span><input type="text" name="title" value="' . h($r['title']) . '" maxlength="160"></label>';
    if ($r['type'] === 'verify') {
        $d = json_decode((string) $r['data'], true) ?: [];
        $editor .= '<label class="f"><span>Status</span><select name="status">' . implode('', array_map(fn($k, $v) => '<option value="' . $k . '"' . (($d['status'] ?? 'valid') === $k ? ' selected' : '') . '>' . $v . '</option>', ['valid', 'expired', 'revoked'], ['Valid', 'Expired', 'Revoked'])) . '</select></label><p class="note">Change the status to Revoked if the document is withdrawn. Anyone who scans the code will see it immediately.</p>';
    }
    tf_qr_page('Manage QR code', '<section class="qr-card wide-card" id="manage" data-code="' . h($r['code']) . '" data-key="' . h($key) . '">
<p class="kicker">Manage your ' . h(['link' => 'dynamic', 'file' => 'file', 'verify' => 'verification'][$r['type']] ?? '') . ' QR code</p><h1>' . h($r['title'] ?: ($r['type'] === 'link' ? (string) $r['target'] : 'QR code ' . $r['code'])) . '</h1>
<p class="sub">' . ($expired ? '<b>Expired.</b> ' : '') . 'Made ' . date('j M Y', (int) $r['created_at']) . ' · deleted automatically on <b>' . date('j M Y', (int) $r['expires_at']) . '</b>. Keep this page’s address private: anyone with it can edit or delete the code.</p>
<div class="manage-grid">
<div><div class="qr-box" id="qrbox"></div><div class="btns" style="justify-content:center"><button type="button" class="btn" data-dl="png">PNG</button><button type="button" class="btn ghost" data-dl="svg">SVG</button></div>
<p class="note" style="text-align:center"><a href="' . h($pub['url']) . '" target="_blank" rel="noopener" class="mono">' . h($pub['url']) . '</a></p></div>
<div><div class="statgrid"><div class="stat"><b>' . (int) $r['scans'] . '</b><span>Total scans</span></div><div class="stat"><b>' . $mob . ' / ' . $desk . '</b><span>Phone / computer (30 days)</span></div></div>
<p class="kicker" style="margin-top:14px">Scans, last 30 days</p><div class="spark">' . $bars . '</div>
<form id="edit" class="inputs" style="margin-top:16px">' . $editor . '<div class="btns"><button class="btn">Save changes</button><button type="button" class="btn ghost danger" id="del">Delete now</button></div><p class="note" id="msg" aria-live="polite"></p></form></div>
</div></section>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>
<script src="' . h(tf_asset('app.js')) . '"></script><script src="' . h(tf_asset('hosted-qr.js')) . '"></script>
<script>HostedQR.manage(' . json_encode($pub, JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . ');</script>', true);
}
