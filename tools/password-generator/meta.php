<?php
return [
    'name' => 'Password Generator',
    'updated' => '2026-11-15',
    'category' => 'random',
    'order' => 2,
    'icon' => 'key-round',
    'popular' => true,
    'keywords' => 'password generator, strong password generator, random password maker, secure password online, password entropy',
    'aka' => ['Strong Password Generator', 'Random Password Maker', 'Secure Passphrase Tool'],
    'short' => 'Create strong, random passwords with a strength meter. Never sent anywhere.',
    'title' => 'Password Generator – Strong Random & Local',
    'description' => 'Generate 6–64 character cryptographic passwords locally with uppercase, numbers and symbols plus live entropy strength check. Zero transmission.',
    'related' => ['qr-code-generator', 'random-number-generator', 'base64-encoder-decoder'],
    'answer' => 'A strong password is <strong>long and random</strong>. Use at least <strong>16 characters</strong> mixing upper and lower case letters, numbers and symbols, and a different one for every account. The passwords here are made by your browser\'s cryptographically secure random generator and never leave your device.',
    'article' => <<<'EOT_TF'
<h2>What makes a password strong</h2>
<p>Attackers don't guess passwords one at a time by hand. They use software that tries billions of combinations per second, starting with common passwords, dictionary words and patterns like "Summer2026!". A password resists this only if it's long and truly random.</p>
<p>Strength is measured in <strong>bits of entropy</strong>: the number of guesses needed, written as a power of two.</p>
<div class="formula">Entropy (bits) = length × log₂(number of possible characters)
16 characters from 87 symbols ≈ 16 × 6.44 ≈ 103 bits</div>
<p>Every extra bit doubles the work for an attacker. Each extra character adds about 6 bits when you use all four character types, which is why length matters more than anything else.</p>

<h2>How strong is strong enough?</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Entropy</th><th>Rating</th><th>Example length (all character types)</th></tr></thead>
<tbody>
<tr><td class="n">under 40 bits</td><td>Weak</td><td>6 characters</td></tr>
<tr><td class="n">40–59 bits</td><td>Fair</td><td>8–9 characters</td></tr>
<tr><td class="n">60–79 bits</td><td>Strong</td><td>10–12 characters</td></tr>
<tr><td class="n">80+ bits</td><td>Very strong</td><td>13+ characters</td></tr>
</tbody></table></div>
<p>For email, banking and your password manager's master password, aim for 80 bits or more.</p>

<h2>How these passwords are made</h2>
<p>The generator uses <code>crypto.getRandomValues</code>, the same secure random source browsers use for encryption, not the predictable <code>Math.random</code>. It always includes at least one character from each type you tick, so the password meets website rules, then shuffles the result so those characters aren't in predictable places. Nothing is sent over the internet or saved.</p>

<h2>Good password habits</h2>
<ul>
<li><strong>Use a password manager</strong> (such as Bitwarden, 1Password, or the one built into your browser or phone). It remembers long random passwords so you don't have to.</li>
<li><strong>Never reuse passwords.</strong> When one site is breached, attackers try the same email and password everywhere else.</li>
<li><strong>Turn on two-factor authentication</strong> or passkeys wherever you can.</li>
<li><strong>Tick "avoid look-alikes"</strong> if you'll ever type the password by hand or read it aloud, so 0 and O or l and 1 can't be confused.</li>
</ul>

<h2>Entropy Bits vs Character Complexity Tricks</h2>
<p>A 16-character random password drawn from 94 printable ASCII characters yields over <code>104 bits</code> of entropy—making brute-force guessing computationally infeasible compared with an 8-character password full of predictable substitutions like <code>P@ssw0rd!</code>. Length beats clever spellings every time.</p>
EOT_TF,
    'faqs' => [
        ['How long should a password be?', 'At least 12 characters, and 16 or more for important accounts. Length adds more security than any other rule.'],
        ['Is it safe to use an online password generator?', 'This one is: passwords are created in your browser with a secure random generator and are never sent or stored. Close the page after copying if you are on a shared computer.'],
        ['What is a strong password example?', 'Something like k7#Qm2!vRz9@pL4x: 16 random characters from all four types. Don’t use any example you see published, including this one.'],
        ['Should I use symbols in my password?', 'They help, because they increase the number of possible characters. Making the password longer helps even more.'],
        ['How do I remember random passwords?', 'Use a password manager. It stores and fills them for you, so you only need to remember one strong master password.'],
    ],
];
