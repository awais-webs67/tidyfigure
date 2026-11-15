<?php
return [
    'name' => 'Base64 Encoder & Decoder',
    'updated' => '2026-11-15',
    'category' => 'dev',
    'order' => 3,
    'icon' => 'binary',
    'keywords' => 'base64 decode, base64 encode, utf8 base64 converter, url safe base64, image to base64 data uri',
    'short' => 'Encode and decode Base64 text (UTF-8 safe), or turn files into data URIs.',
    'title' => 'Base64 Encode & Decode Online (UTF-8 & Files)',
    'description' => 'Encode text or files into standard or URL-safe Base64 and decode Base64 strings back cleanly with full UTF-8 and emoji fidelity in your browser.',
    'related' => ['json-formatter', 'qr-code-generator', 'password-generator'],
    'answer' => 'Base64 turns any data into plain text using 64 safe characters (A–Z, a–z, 0–9, + and /), so it can travel through email, JSON, URLs and HTML. Type text to encode it, switch to Decode to turn Base64 back into text, or drop a file to get a <strong>data URI</strong> you can paste into HTML or CSS.',
    'article' => <<<'EOT_TF'
<h2>How Base64 works</h2>
<p>Computers store everything as bytes, but many systems (email, URLs, JSON, HTML attributes) only handle plain text safely. Base64 bridges the gap. It takes the data three bytes (24 bits) at a time and splits it into four 6-bit groups. Each 6-bit group is a number from 0 to 63, written as one character from the Base64 alphabet.</p>
<div class="formula">Text:     M        a        n
Bytes:    77       97       110
Bits:     010011 010110 000101 101110
Base64:   T      W      F      u        → "TWFu"</div>
<p>When the input isn't a multiple of three bytes, one or two "=" signs pad the end. Because every 3 bytes become 4 characters, Base64 output is about <strong>33% larger</strong> than the original.</p>

<h2>Base64 is not encryption</h2>
<p>Anyone can decode Base64 instantly; it only changes the format. Never use it to hide passwords or secrets. It's often seen in places like HTTP Basic authentication headers, where it's only safe because the connection itself is encrypted with HTTPS.</p>

<h2>Text and UTF-8</h2>
<p>Plain browser functions like <code>btoa()</code> fail on emoji and many non-English characters. This tool first converts text to UTF-8 bytes, so "Ça va? 👋" encodes and decodes correctly, matching what Python, Java, PHP and command-line tools produce.</p>

<h2>URL-safe Base64</h2>
<p>Standard Base64 uses "+" and "/", which have special meanings in URLs. The URL-safe variant (also called base64url) replaces them with "-" and "_" and usually drops the "=" padding. It's used in JSON Web Tokens (JWTs), URL parameters and file names. The decoder accepts both forms automatically.</p>

<h2>Data URIs for images and files</h2>
<p>A data URI embeds a file directly in HTML or CSS:</p>
<div class="formula">&lt;img src="data:image/png;base64,iVBORw0KGgo…"&gt;
background-image: url("data:image/svg+xml;base64,PHN2Zy…");</div>
<p>This saves a network request for tiny images like icons, but makes the HTML or CSS bigger and stops the browser caching the image separately. As a rule, only inline files under a few kilobytes.</p>

<h2>Base64 Padding Characters &amp; Data URI Overhead</h2>
<p>Every 3 raw bytes turn into 4 Base64 characters, so inputs whose byte length is not divisible by 3 end with one or two <code>=</code> padding signs (which URL-safe JWTs normally strip). Expect encoded binary assets like PNG icons inside CSS data URIs to grow roughly 33% larger than the raw binary file.</p>
EOT_TF,
    'faqs' => [
        ['How do I decode Base64 to text?', 'Switch to Decode and paste the Base64. The decoded text appears instantly. Data URIs and URL-safe Base64 are handled automatically.'],
        ['Is Base64 encryption?', 'No. Base64 is an encoding that anyone can reverse. It doesn’t protect data.'],
        ['Why is Base64 bigger than the original?', 'Every 3 bytes become 4 characters, so Base64 is about 33% larger than the original data.'],
        ['How do I convert an image to Base64?', 'Drop the image on the file box. You get a complete data URI you can paste into an HTML img tag or CSS.'],
        ['What is URL-safe Base64?', 'A variant that uses - and _ instead of + and /, and usually no = padding, so it can be used in URLs and file names.'],
    ],
    'aka' => ['Base64 Decoder', 'Base64 String & File Encoder'],
];
