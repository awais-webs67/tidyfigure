<?php
// IndexNow: tells Bing, Yandex, Seznam, Naver and others straight away that pages were added or changed.
// The key is created in the admin panel and served at /<key>.txt so search engines can confirm the site is yours.
declare(strict_types=1);

function tf_indexnow_submit(array $urls): array
{
    $key = tf_settings()['indexnow_key'];
    if (!preg_match('/^[a-f0-9]{32}$/', $key)) return [false, 'Create an IndexNow key first.'];
    $host = parse_url(tf_base_url(), PHP_URL_HOST);
    $body = json_encode(['host' => $host, 'key' => $key, 'keyLocation' => tf_base_url() . "/$key.txt", 'urlList' => array_values(array_slice($urls, 0, 10000))], JSON_UNESCAPED_SLASHES);
    $ctx = stream_context_create(['http' => ['method' => 'POST', 'header' => "Content-Type: application/json; charset=utf-8\r\n", 'content' => $body, 'timeout' => 10, 'ignore_errors' => true]]);
    $res = @file_get_contents('https://api.indexnow.org/indexnow', false, $ctx);
    $code = isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m) ? (int) $m[1] : 0;
    $msg = [200 => 'Submitted.', 202 => 'Accepted: the search engines will check your key file shortly.', 400 => 'Rejected: invalid request.', 403 => 'Rejected: the key file couldn’t be verified. Make sure the site is reachable on its real domain.', 422 => 'Rejected: the URLs don’t match this domain.', 429 => 'Too many requests. Try again later.'][$code] ?? ($code ? "Response code $code." : 'Couldn’t reach IndexNow from this server.');
    return [$code === 200 || $code === 202, $msg . ' (' . count($urls) . ' URLs)'];
}

function tf_all_public_urls(): array
{
    $urls = [tf_abs()];
    $tools = tf_tools();
    foreach (tf_site()['categories'] as $c) if (array_filter($tools, fn($t) => $t['category'] === $c['id'])) $urls[] = tf_abs($c['slug']);
    foreach ($tools as $t) if (empty(tf_tool_settings()[$t['slug']]['noindex'])) $urls[] = tf_abs($t['slug']);
    return $urls;
}
