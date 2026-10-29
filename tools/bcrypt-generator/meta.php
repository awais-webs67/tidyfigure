<?php
// Bcrypt Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Bcrypt Generator',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'dev',
  'order' => 8,
  'popular' => true,
  'libs' => ['vendor/bcryptjs-2.4.3.min.js'],
  'icon' => 'lock-keyhole',
  'keywords' => 'bcrypt generator bcrypt hash generator bcrypt online bcrypt checker verify bcrypt hash password hash generator 2y 2b cost rounds',
  'aka' => ['bcrypt hash generator', 'bcrypt online', 'bcrypt checker', 'password hasher'], // other names people search for
  'short' => 'Hash a password with bcrypt, or check a password against a hash.',
  'title' => 'Bcrypt Generator and Checker: Hash Passwords Online',
  'description' => <<<'EOT_TF'
Generate bcrypt password hashes with your choice of cost (rounds) and check a password against any bcrypt hash. Works with PHP, Node.js, Laravel and Django.
EOT_TF,
  'related' => ['hash-generator', 'password-generator', 'jwt-decoder', 'uuid-generator'],
  'answer' => <<<'EOT_TF'
Type a password, choose the <strong>cost</strong> (10–12 is typical) and click <strong>Generate hash</strong> to get a bcrypt hash such as <code>$2y$12$…</code>. To check a password, paste it with a hash in the <strong>Verify</strong> box: it tells you if they match. Hashing runs in your browser, so the password is never sent anywhere.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>What is bcrypt?</h2>
<p>Bcrypt is a password-hashing function designed to be slow on purpose. Instead of storing passwords, websites store a bcrypt hash; at login they hash the password typed and compare. Because each guess takes real time, stolen hashes are very hard to crack by brute force, unlike fast hashes such as MD5 or SHA-256.</p>

<h2>Reading a bcrypt hash</h2>
<p><code>$2y$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW</code></p>
<ul>
<li><code>$2y$</code>: the version. $2a$, $2b$ and $2y$ are interchangeable in modern libraries.</li>
<li><code>12</code>: the cost. Each step doubles the work: cost 12 takes 4× as long as cost 10.</li>
<li>Next 22 characters: the random <strong>salt</strong>, so the same password gives a different hash every time.</li>
<li>Last 31 characters: the hash itself.</li>
</ul>

<h2>Which cost should I use?</h2>
<p>Choose the highest cost that keeps a login under about a quarter of a second on your server. In 2024–2026, 10 to 12 is typical; Laravel and PHP default to 10–12, Django uses its own defaults. The timer here shows how long hashing took in your browser, a rough guide to server speed.</p>

<h2>Using the hash in your code</h2>
<div class="scroll"><table class="tbl"><thead><tr><th>Language</th><th>Verify a password</th></tr></thead><tbody>
<tr><td>PHP</td><td><code>password_verify($pw, $hash)</code></td></tr>
<tr><td>Laravel</td><td><code>Hash::check($pw, $hash)</code></td></tr>
<tr><td>Node.js</td><td><code>await bcrypt.compare(pw, hash)</code></td></tr>
<tr><td>Python</td><td><code>bcrypt.checkpw(pw.encode(), hash.encode())</code></td></tr>
<tr><td>Java (Spring)</td><td><code>new BCryptPasswordEncoder().matches(pw, hash)</code></td></tr>
</tbody></table></div>

<h2>Good to know</h2>
<ul>
<li>Bcrypt only uses the first <strong>72 bytes</strong> of a password. The tool warns you if yours is longer.</li>
<li>Hashes can’t be “decrypted”. The only way back is guessing, which bcrypt makes slow.</li>
<li>Everything happens in your browser. Even so, avoid pasting live production passwords into any website.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'Can a bcrypt hash be decrypted?',
      <<<'EOT_TF'
No. Bcrypt is a one-way hash. The only way to find the password is to guess and compare, which bcrypt deliberately makes slow.
EOT_TF,
    ],
    [
      'Why do I get a different hash each time?',
      <<<'EOT_TF'
Each hash uses a new random salt, so the same password produces a different hash every time. All of them verify correctly.
EOT_TF,
    ],
    [
      'What is the difference between $2a$, $2b$ and $2y$?',
      <<<'EOT_TF'
They are versions of the same algorithm. $2y$ is PHP’s label and $2b$ is used by OpenBSD and Node.js; modern libraries accept all three.
EOT_TF,
    ],
    [
      'What cost should I use?',
      <<<'EOT_TF'
Usually 10 to 12. Pick the highest cost that keeps hashing under about 250 milliseconds on your server.
EOT_TF,
    ],
    [
      'Is my password sent to a server?',
      <<<'EOT_TF'
No. Hashing and checking run in your browser with the bcrypt.js library. Nothing is uploaded.
EOT_TF,
    ],
  ],
];
