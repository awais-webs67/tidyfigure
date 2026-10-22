<?php
// Hash Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Hash Generator',
  'category' => 'dev',
  'order' => 3,
  'icon' => 'hash',
  'files' => true,
  'keywords' => 'hash generator md5 sha1 sha256 sha512 checksum file hash verify download online',
  'short' => 'MD5, SHA-1, SHA-256 and SHA-512 hashes of text or files, and checksum checks.',
  'title' => 'Hash Generator: MD5, SHA-1, SHA-256 & SHA-512 Online',
  'description' => <<<'EOT_TF'
Generate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes of text or any file, and verify a download against its checksum. Files never leave your device.
EOT_TF,
  'related' => ['base64-encoder-decoder', 'uuid-generator', 'password-generator'],
  'answer' => <<<'EOT_TF'
A hash function turns any text or file into a fixed-length fingerprint: change one character and the hash changes completely. The SHA-256 hash of <code>hello world</code> is <code>b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9</code>. To check a download, choose the file and paste the checksum from the website: the tool tells you if it matches.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>What a hash is</h2>
<p>A <strong>cryptographic hash function</strong> takes input of any size and produces a fixed-size output, usually shown in hexadecimal. Good hash functions have three key properties:</p>
<ul>
<li><strong>Deterministic:</strong> the same input always gives the same hash.</li>
<li><strong>Avalanche effect:</strong> a tiny change (one letter, one bit) gives a completely different hash.</li>
<li><strong>One-way:</strong> you can't work backwards from a hash to the original input, and it's infeasible to find two inputs with the same hash.</li>
</ul>

<h2>Which algorithm?</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Algorithm</th><th class="n">Length</th><th>Status</th></tr></thead>
<tbody>
<tr><td>MD5</td><td class="n">128 bits (32 hex)</td><td>Broken for security: collisions are easy to create. Fine for spotting accidental corruption.</td></tr>
<tr><td>SHA-1</td><td class="n">160 bits (40 hex)</td><td>Broken for security since 2017. Still used by Git for object IDs.</td></tr>
<tr><td>SHA-256</td><td class="n">256 bits (64 hex)</td><td>Secure. The standard choice for checksums, certificates and blockchains.</td></tr>
<tr><td>SHA-384</td><td class="n">384 bits (96 hex)</td><td>Secure; a shortened SHA-512.</td></tr>
<tr><td>SHA-512</td><td class="n">512 bits (128 hex)</td><td>Secure, and often faster than SHA-256 on 64-bit computers.</td></tr>
</tbody></table></div>

<h2>Verifying a download</h2>
<ol>
<li>On the download page, find the checksum (often labelled SHA-256, SHA256SUMS or "checksum").</li>
<li>Choose <strong>File</strong> above and select the downloaded file.</li>
<li>Paste the checksum into <strong>Expected hash</strong>. A green "Match" means the file is exactly the one the publisher released, not damaged in transfer or swapped.</li>
</ol>
<p>The same check from a terminal:</p>
<div class="formula">Windows:   certutil -hashfile file.iso SHA256
macOS:     shasum -a 256 file.iso
Linux:     sha256sum file.iso</div>

<h2>Hashing text</h2>
<p>Text is converted to bytes using <strong>UTF-8</strong> before hashing, the same as most programming languages and command-line tools. Hidden differences such as a trailing space or newline change the hash, so if your result doesn't match another tool's, check for those. For example, <code>echo "hello world" | sha256sum</code> includes a newline; <code>printf "hello world"</code> doesn't.</p>

<h2>Don't store passwords with these hashes</h2>
<p>MD5 and SHA hashes are designed to be fast, which makes them unsuitable for passwords: attackers can try billions of guesses per second. Use a dedicated password hashing function such as <strong>Argon2</strong>, <strong>bcrypt</strong> or <strong>scrypt</strong>, which are slow on purpose and add a unique salt to each password.</p>
<p>Everything is computed in your browser with the built-in Web Crypto API (and the CryptoJS library for MD5). Your text and files never leave your device.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I get the SHA-256 hash of a file?',
      <<<'EOT_TF'
Choose File, then select the file. Its SHA-256 hash appears along with MD5, SHA-1, SHA-384 and SHA-512.
EOT_TF,
    ],
    [
      'How do I verify a checksum?',
      <<<'EOT_TF'
Select the file and paste the published checksum into Expected hash. The tool tells you whether it matches.
EOT_TF,
    ],
    [
      'Is MD5 still safe?',
      <<<'EOT_TF'
Not for security, because collisions can be created on purpose. It is still fine for detecting accidental corruption.
EOT_TF,
    ],
    [
      'Can a hash be reversed?',
      <<<'EOT_TF'
No. Hashes are one-way. Short or common inputs can sometimes be guessed by trying many possibilities, which is why passwords need special slow hashes.
EOT_TF,
    ],
    [
      'Are my files uploaded?',
      'No. Hashes are calculated in your browser, so files never leave your device.',
    ],
  ],
];
