<?php
// URL Encoder & Decoder: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'URL Encoder & Decoder',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'dev',
  'order' => 4,
  'icon' => 'link',
  'keywords' => 'url encode decode percent encoding urlencode urldecode query string parser encodeuricomponent',
  'short' => 'Percent-encode or decode text for URLs, and break a URL into its parts.',
  'title' => 'URL Encoder & Decoder: Percent-Encode Online, Free',
  'description' => <<<'EOT_TF'
Encode text for use in URLs (percent-encoding), decode %20-style URLs back to text, and break any URL into host, path and query parameters. Free.
EOT_TF,
  'related' => ['base64-encoder-decoder', 'json-formatter', 'regex-tester'],
  'answer' => <<<'EOT_TF'
URL encoding (percent-encoding) replaces characters that aren't allowed in URLs with <strong>%</strong> and their byte value in hex: a space becomes <code>%20</code>, <code>&amp;</code> becomes <code>%26</code>, and <code>é</code> becomes <code>%C3%A9</code>. Paste text to encode it, switch to Decode to reverse it, or break a URL down to read its query parameters.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Why URLs need encoding</h2>
<p>URLs may only contain a limited set of characters: letters, digits and a few symbols. Some symbols have a job: <code>?</code> starts the query string, <code>&amp;</code> separates parameters, <code>=</code> joins a name to its value and <code>#</code> starts the fragment. If your data contains those characters (or spaces, or non-English letters), they must be encoded, or the URL will be read wrongly.</p>
<div class="formula">Search term:  red & white shoes
Unencoded:    /search?q=red & white shoes        ← & splits the parameter
Encoded:      /search?q=red%20%26%20white%20shoes  ✓</div>

<h2>How percent-encoding works</h2>
<p>Each character is converted to its UTF-8 bytes, and each byte is written as <code>%</code> plus two hex digits. Characters outside English take more than one byte:</p>
<div class="scroll"><table class="tbl">
<thead><tr><th>Character</th><th>Encoded</th></tr></thead>
<tbody>
<tr><td>space</td><td class="mono">%20 (or + in form data)</td></tr>
<tr><td>&amp;</td><td class="mono">%26</td></tr>
<tr><td>/</td><td class="mono">%2F</td></tr>
<tr><td>?</td><td class="mono">%3F</td></tr>
<tr><td>#</td><td class="mono">%23</td></tr>
<tr><td>%</td><td class="mono">%25</td></tr>
<tr><td>é</td><td class="mono">%C3%A9</td></tr>
<tr><td>€</td><td class="mono">%E2%82%AC</td></tr>
</tbody></table></div>

<h2>encodeURIComponent or encodeURI?</h2>
<ul>
<li><strong>encodeURIComponent</strong> encodes everything except letters, digits and <code>- _ . ! ~ * ' ( )</code>. Use it for a <em>piece</em> of a URL: a query value, a path segment, a filename. This is almost always the one you want.</li>
<li><strong>encodeURI</strong> leaves URL structure characters (<code>: / ? &amp; = #</code>) alone. Use it only to clean up a complete URL that contains spaces or accents.</li>
<li><strong>Form encoding</strong> (application/x-www-form-urlencoded) is like encodeURIComponent but writes spaces as <code>+</code>. HTML forms send data this way, and PHP's <code>urlencode</code> does the same.</li>
</ul>
<div class="formula">JavaScript:  encodeURIComponent(s)  ·  decodeURIComponent(s)
Python:      urllib.parse.quote(s, safe='')  ·  unquote(s)
PHP:         rawurlencode($s)  ·  rawurldecode($s)</div>

<h2>Common problems</h2>
<ul>
<li><strong>Double encoding:</strong> encoding text that's already encoded turns <code>%20</code> into <code>%2520</code>. If you see <code>%25</code> followed by two hex digits, decode twice.</li>
<li><strong>Plus signs:</strong> in query strings from forms, <code>+</code> means a space. A real plus sign must be sent as <code>%2B</code>.</li>
<li><strong>"URI malformed" errors:</strong> a lone <code>%</code> that isn't followed by two hex digits can't be decoded. Encode literal percent signs as <code>%25</code>.</li>
</ul>

<h2>Breaking down a URL</h2>
<p>The <strong>Break down a URL</strong> mode splits a link into protocol, host, port, path, query and fragment, and lists every query parameter decoded. It's handy for reading tracking links, debugging API calls or checking redirects. If the link has <code>utm_</code>, <code>fbclid</code> or <code>gclid</code> tracking parameters, you also get a clean version without them.</p>
<p>Everything runs in your browser and nothing is sent anywhere.</p>
EOT_TF,
  'faqs' => [
    [
      'What is URL encoding?',
      <<<'EOT_TF'
Replacing characters that aren’t safe in URLs with a % sign and their UTF-8 byte values in hex. A space becomes %20.
EOT_TF,
    ],
    [
      'What does %20 mean in a URL?',
      'It is an encoded space. %20 is the hex code of the space character.',
    ],
    [
      'Should spaces be %20 or +?',
      'In paths, always %20. In query strings sent by HTML forms, + also means space. %20 works everywhere.',
    ],
    [
      'What is the difference between encodeURI and encodeURIComponent?',
      <<<'EOT_TF'
encodeURIComponent encodes URL structure characters like / ? & =, so it is right for values. encodeURI leaves them, so it is only for full URLs.
EOT_TF,
    ],
    [
      'How do I decode a URL?',
      'Choose Decode and paste the encoded text. Each %XX code is turned back into its character.',
    ],
  ],
];
