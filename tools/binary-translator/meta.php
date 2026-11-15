<?php
return [
    'name' => 'Binary Translator',
    'updated' => '2026-11-15',
    'category' => 'convert',
    'order' => 21,
    'icon' => 'binary',
    'keywords' => 'binary translator, text to binary, binary to text, binary code converter, ascii to binary, utf8 binary decoder',
    'short' => 'Convert text to binary code and binary back to text.',
    'title' => 'Binary Translator – Text to Binary & UTF-8 Code',
    'description' => 'Translate English text, emoji and UTF-8 characters into 8-bit binary, hex, decimal or octal, and decode binary strings back to readable words.',
    'related' => ['morse-code-translator', 'base64-encoder-decoder', 'hash-generator', 'url-encoder-decoder'],
    'answer' => 'Type text to see it in binary (8 bits per byte), or paste binary such as <code>01001000 01101001</code> to read it as text: the direction is detected automatically. The same text is also shown in <strong>hexadecimal</strong>, <strong>decimal</strong> and <strong>octal</strong>. Letters from any language and emoji are encoded as UTF-8.',
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

<h2>ASCII vs UTF-8 Multi-Byte Binary</h2>
<p>Standard English letters, digits and punctuation fit inside single 7-bit or 8-bit ASCII bytes (for instance, capital <code>A</code> is decimal 65, binary <code>01000001</code>; lowercase <code>a</code> is decimal 97, binary <code>01100001</code> — notice only bit 5 flips between uppercase and lowercase).</p>
<p>Accented letters, Arabic, Urdu, Devanagari, CJK characters and emoji require multi-byte UTF-8 encoding (two to four 8-bit bytes per character). For example, the Euro sign <code>€</code> uses three bytes (<code>11100010 10000010 10101100</code>), while a smiling emoji uses four bytes. Splitting into 8-bit chunks lets computers and learners decode every script reliably.</p>

<h2>Checking Binary Conversion by Hand With Powers of Two</h2>
<p>Every position in an 8-bit byte carries double the place value of the bit to its right: <code>128, 64, 32, 16, 8, 4, 2, 1</code>. Adding only the columns marked <code>1</code> gives the exact ASCII character code—helpful when debugging serial protocols, subnet masks or bitwise flags.</p>
EOT_TF,
    'faqs' => [
        ['How do I convert text to binary?', 'Type or paste your text. Each character is turned into 8-bit bytes, shown as groups of 0s and 1s.'],
        ['How do I convert binary to text?', 'Paste the binary (groups of 8 digits, with or without spaces). The translator detects binary and shows the text.'],
        ['How do you write hello in binary?', 'Hello is 01001000 01100101 01101100 01101100 01101111.'],
        ['Does it work with emoji and other languages?', 'Yes. Text is encoded as UTF-8, so any language and emoji work. Non-English characters take 2 to 4 bytes each.'],
        ['How many bits are in a letter?', 'A basic English letter takes 8 bits (one byte). Letters with accents and other scripts take 16 to 32 bits in UTF-8.'],
        ['Do binary bytes always need spaces between them?', 'Our decoder accepts spaces, line breaks or continuous 8-bit strings, though spacing every 8 bits makes manual checking far easier.'],
        ['Why do computer files group binary into 8 bits?', 'Eight bits form one byte (256 possible states), which is enough to address a whole ASCII character and cleanly pack two 4-bit hexadecimal digits.'],
    ],
    'aka' => ['Binary Code Converter', 'Text to Binary Converter', 'Binary Decoder'],
];
