<?php
return [
    'name' => 'Bcrypt Generator',
    'updated' => '2026-11-15',
    'category' => 'dev',
    'order' => 8,
    'popular' => true,
    'libs' => ['vendor/bcryptjs-2.4.3.min.js'],
    'icon' => 'lock-keyhole',
    'keywords' => 'bcrypt generator, bcrypt hash checker, bcrypt verify online, password cost rounds, php node bcrypt',
    'aka' => ['Bcrypt Password Hasher', 'Bcrypt Hash Verifier'],
    'short' => 'Hash a password with bcrypt, or check a password against a hash.',
    'title' => 'Bcrypt Hash Generator & Password Checker',
    'description' => 'Generate salted bcrypt hashes with configurable cost factors (4–14 rounds) and verify plaintext passwords locally for PHP, Node, Python and Go.',
    'related' => ['hash-generator', 'password-generator', 'jwt-decoder', 'uuid-generator'],
    'answer' => 'Type a password, choose the <strong>cost</strong> (10–12 is typical) and click <strong>Generate hash</strong> to get a bcrypt hash such as <code>$2y$12$…</code>. To check a password, paste it with a hash in the <strong>Verify</strong> box: it tells you if they match. Hashing runs in your browser, so the password is never sent anywhere.',
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

<h2>Upgrading Legacy Hashes When Increasing Cost Rounds</h2>
<p>Notice every bcrypt hash embeds its two-digit cost factor (such as <code>$2y$12$</code>) right in the prefix. Whenever server hardware gets faster, increment your application’s target cost factor and re-hash each user’s password transparently on their next successful sign-in without breaking older stored hashes.</p>
EOT_TF,
    'faqs' => [
        ['Can a bcrypt hash be decrypted?', 'No. Bcrypt is a one-way hash. The only way to find the password is to guess and compare, which bcrypt deliberately makes slow.'],
        ['Why do I get a different hash each time?', 'Each hash uses a new random salt, so the same password produces a different hash every time. All of them verify correctly.'],
        ['What is the difference between $2a$, $2b$ and $2y$?', 'They are versions of the same algorithm. $2y$ is PHP’s label and $2b$ is used by OpenBSD and Node.js; modern libraries accept all three.'],
        ['What cost should I use?', 'Usually 10 to 12. Pick the highest cost that keeps hashing under about 250 milliseconds on your server.'],
        ['Is my password sent to a server?', 'No. Hashing and checking run in your browser with the bcrypt.js library. Nothing is uploaded.'],
        ['Why do two hashes of the exact same password look completely different?', 'Bcrypt automatically embeds a unique random 128-bit salt into every hash so identical passwords produce unrelated cipher strings.'],
    ],
];
