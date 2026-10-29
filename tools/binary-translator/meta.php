<?php
// Binary Translator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Binary Translator',
  'updated' => '2026-10-26', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'convert',
  'order' => 21,
  'icon' => 'binary',
  'keywords' => 'binary translator text to binary binary to text binary code translator binary converter ascii to binary hello in binary',
  'short' => 'Convert text to binary code and binary back to text.',
  'title' => 'Binary Translator: Text to Binary and Back',
  'description' => <<<'EOT_TF'
Convert text to binary code and binary back to readable text, with hex, decimal and octal too. Supports emoji and every language (UTF-8). Instant and free.
EOT_TF,
  'related' => ['morse-code-translator', 'base64-encoder-decoder', 'hash-generator', 'url-encoder-decoder'],
  'answer' => <<<'EOT_TF'
Type text to see it in binary (8 bits per byte), or paste binary such as <code>01001000 01101001</code> to read it as text: the direction is detected automatically. The same text is also shown in <strong>hexadecimal</strong>, <strong>decimal</strong> and <strong>octal</strong>. Letters from any language and emoji are encoded as UTF-8.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How text becomes binary</h2>
<p>Computers store every character as a number. In ASCII, capital A is 65, which is <code>01000001</code> in binary. Each binary digit (bit) is a power of two, read right to left: 1, 2, 4, 8, 16, 32, 64, 128. For 65: 64 + 1, so the bits for 64 and 1 are on.</p>
<p>Characters outside basic English, such as é, ش, 中 or 😀, use more than one byte in UTF-8, the encoding used by almost every website. The translator shows each byte as 8 bits, so “é” becomes <code>11000011 10101001</code>.</p>

<h2>Examples</h2>
<div class="scroll"><table class="tbl"><thead><tr><th>Text</th><th>Binary</th></tr></thead><tbody>
<tr><td>Hi</td><td><code>01001000 01101001</code></td></tr>
<tr><td>Hello</td><td><code>01001000 01100101 01101100 01101100 01101111</code></td></tr>
<tr><td>I love you</td><td><code>01001001 00100000 01101100 01101111 01110110 01100101 00100000 01111001 01101111 01110101</code></td></tr>
<tr><td>A / a</td><td><code>01000001</code> / <code>01100001</code></td></tr>
</tbody></table></div>

<h2>Binary, hex, decimal and octal</h2>
<ul>
<li><strong>Binary</strong> (base 2) uses 0 and 1: <code>01001000</code>.</li>
<li><strong>Hexadecimal</strong> (base 16) uses 0–9 and A–F, two digits per byte: <code>48</code>. Programmers use it because it’s compact.</li>
<li><strong>Decimal</strong> (base 10) is the everyday number: <code>72</code>.</li>
<li><strong>Octal</strong> (base 8): <code>110</code>.</li>
</ul>

<h2>Reading binary by hand</h2>
<p>Split the binary into groups of 8. For each group, add the values of the positions with a 1 (128, 64, 32, 16, 8, 4, 2, 1). Look the number up in an ASCII table: 72 is H, 105 is i.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I convert text to binary?',
      <<<'EOT_TF'
Type or paste your text. Each character is turned into 8-bit bytes, shown as groups of 0s and 1s.
EOT_TF,
    ],
    [
      'How do I convert binary to text?',
      <<<'EOT_TF'
Paste the binary (groups of 8 digits, with or without spaces). The translator detects binary and shows the text.
EOT_TF,
    ],
    [
      'How do you write hello in binary?',
      <<<'EOT_TF'
Hello is 01001000 01100101 01101100 01101100 01101111.
EOT_TF,
    ],
    [
      'Does it work with emoji and other languages?',
      <<<'EOT_TF'
Yes. Text is encoded as UTF-8, so any language and emoji work. Non-English characters take 2 to 4 bytes each.
EOT_TF,
    ],
    [
      'How many bits are in a letter?',
      <<<'EOT_TF'
A basic English letter takes 8 bits (one byte). Letters with accents and other scripts take 16 to 32 bits in UTF-8.
EOT_TF,
    ],
  ],
];
