<?php
// UUID Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'UUID Generator',
  'category' => 'dev',
  'order' => 2,
  'icon' => 'fingerprint',
  'keywords' => 'uuid generator guid generator random uuid v4 uuid v7 bulk uuid online unique id',
  'short' => 'Generate random UUID v4 or time-ordered v7 IDs, one or a thousand at a time.',
  'title' => 'UUID Generator: Random UUID v4 & v7 (GUID) Online',
  'description' => <<<'EOT_TF'
Generate UUID v4 (random) or UUID v7 (time-ordered) identifiers in bulk, in lowercase, uppercase or without dashes. Uses secure randomness. Free.
EOT_TF,
  'related' => ['password-generator', 'hash-generator', 'random-number-generator'],
  'answer' => <<<'EOT_TF'
A <strong>UUID</strong> (universally unique identifier, called a GUID by Microsoft) is a 128-bit ID written as 32 hex digits, like <code>3f2b8c1e-9a4d-4e7b-b1c2-5d6e7f8a9b0c</code>. <strong>Version 4</strong> is random. <strong>Version 7</strong> starts with a timestamp, so new IDs sort in order, which makes them faster as database keys.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>Anatomy of a UUID</h2>
<div class="formula">xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
          8    4    4    4    12   hex digits

M = version (4 for random, 7 for time-ordered)
N = variant (8, 9, a or b for standard UUIDs)</div>
<p>Each UUID is 128 bits. Six of them are fixed (version and variant), so a v4 UUID has <strong>122 random bits</strong>: about 5.3 × 10<sup>36</sup> possible values.</p>

<h2>Version 4 or version 7?</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th></th><th>UUID v4</th><th>UUID v7</th></tr></thead>
<tbody>
<tr><td>Made from</td><td>122 random bits</td><td>48-bit Unix time in milliseconds + 74 random bits</td></tr>
<tr><td>Sort order</td><td>Random</td><td>Roughly by creation time</td></tr>
<tr><td>Database index performance</td><td>Can be slow on large tables (random inserts)</td><td>Fast, because new rows go at the end of the index</td></tr>
<tr><td>Reveals creation time</td><td>No</td><td>Yes, to the millisecond</td></tr>
<tr><td>Best for</td><td>Tokens, public IDs, anything that shouldn't reveal timing</td><td>Primary keys, event logs, message IDs</td></tr>
</tbody></table></div>
<p>Version 7 was standardised in 2024 in <strong>RFC 9562</strong>, which replaced the original RFC 4122. Paste any UUID into the checker to see its version, and the creation time for v7.</p>

<h2>Can two UUIDs ever be the same?</h2>
<p>In theory yes; in practice, no. With 122 random bits, you would need to generate about <strong>2.7 × 10<sup>18</sup></strong> (2.7 billion billion) v4 UUIDs before there's even a 50% chance of a single duplicate. That's a billion UUIDs every second for about 85 years. The real risk is a poor random number generator, which is why this tool uses your browser's cryptographically secure generator (<code>crypto.getRandomValues</code>), the same one used for encryption keys.</p>

<h2>Generating UUIDs in code</h2>
<div class="formula">JavaScript:  crypto.randomUUID()
Python:      import uuid; uuid.uuid4()
PHP:         Ramsey\Uuid\Uuid::uuid4()  (library)
PostgreSQL:  gen_random_uuid()   ·  uuidv7() in version 18+
C#:          Guid.NewGuid()   ·  Guid.CreateVersion7() in .NET 9+</div>

<h2>Formats</h2>
<ul>
<li><strong>Lowercase with dashes</strong> is the standard text form, recommended by RFC 9562.</li>
<li><strong>Uppercase</strong> is common in Microsoft tools. UUIDs aren't case-sensitive, but compare them in one case.</li>
<li><strong>No dashes</strong> gives 32 characters, handy for file names and URLs.</li>
<li><strong>Braces</strong> such as <code>{…}</code> are used in the Windows registry and some .NET code.</li>
</ul>
<p>UUIDs are generated in your browser. They aren't sent anywhere or stored, so each one is yours alone.</p>
EOT_TF,
  'faqs' => [
    [
      'What is a UUID?',
      <<<'EOT_TF'
A 128-bit universally unique identifier, written as 32 hexadecimal digits in five groups (8-4-4-4-12). Microsoft calls it a GUID.
EOT_TF,
    ],
    [
      'What is the difference between UUID v4 and v7?',
      <<<'EOT_TF'
v4 is fully random. v7 starts with a timestamp, so IDs sort by creation time, which is better for database primary keys.
EOT_TF,
    ],
    [
      'Are UUIDs really unique?',
      <<<'EOT_TF'
For practical purposes, yes. The chance of two random v4 UUIDs colliding is astronomically small when a secure random generator is used.
EOT_TF,
    ],
    [
      'Is a GUID the same as a UUID?',
      'Yes. GUID is Microsoft’s name for the same 128-bit identifier format.',
    ],
    [
      'Can I generate UUIDs in bulk?',
      'Yes. Generate up to 1,000 at once, copy them or download them as a text file.',
    ],
  ],
];
