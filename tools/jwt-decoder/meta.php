<?php
// JWT Decoder: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'JWT Decoder',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'dev',
  'order' => 6,
  'icon' => 'key-round',
  'keywords' => 'jwt decoder decode jwt token json web token parser verify hs256 signature exp claim online',
  'short' => 'Decode a JSON Web Token’s header and payload, check expiry and verify HS256 signatures.',
  'title' => 'JWT Decoder: Decode & Verify JSON Web Tokens Online',
  'description' => <<<'EOT_TF'
Paste a JWT to decode its header and payload, see when it was issued and expires, and verify HS256, HS384 or HS512 signatures with your secret. Runs locally.
EOT_TF,
  'related' => ['base64-encoder-decoder', 'json-formatter', 'hash-generator'],
  'answer' => <<<'EOT_TF'
A <strong>JWT</strong> (JSON Web Token) is three Base64URL-encoded parts separated by dots: <strong>header.payload.signature</strong>. Paste one below to read its header and claims as JSON, see whether it has expired, and (for HS256/384/512 tokens) verify the signature with your secret. Decoding happens entirely in your browser.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>The three parts of a JWT</h2>
<div class="formula">eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiIxMjMifQ . SflKxwRJSMeKKF2QT4fw…
       header               payload              signature

Header:    {"alg":"HS256","typ":"JWT"}        which algorithm signed it
Payload:   {"sub":"123","exp":1761139600}     the claims (data)
Signature: HMAC-SHA256(header + "." + payload, secret)</div>
<p>The header and payload are only <strong>encoded</strong>, not encrypted. Anyone who has the token can read them, which is exactly what this tool does. The signature is what stops people <em>changing</em> them: without the secret or private key, any change makes the signature invalid.</p>

<h2>Standard claims</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Claim</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td class="mono">iss</td><td>Issuer: who created the token</td></tr>
<tr><td class="mono">sub</td><td>Subject: usually the user ID</td></tr>
<tr><td class="mono">aud</td><td>Audience: which service the token is for</td></tr>
<tr><td class="mono">exp</td><td>Expiry time, as seconds since 1 January 1970 (Unix time)</td></tr>
<tr><td class="mono">nbf</td><td>Not valid before this time</td></tr>
<tr><td class="mono">iat</td><td>Issued at</td></tr>
<tr><td class="mono">jti</td><td>Unique token ID, used to block reuse</td></tr>
</tbody></table></div>
<p>The decoder converts <code>exp</code>, <code>iat</code> and <code>nbf</code> into readable dates in your time zone and tells you how long ago or how soon they are.</p>

<h2>Signing algorithms</h2>
<ul>
<li><strong>HS256, HS384, HS512:</strong> HMAC with a shared secret. The same secret signs and verifies, so every service that checks tokens must keep it private. Paste the secret above to verify.</li>
<li><strong>RS256, PS256:</strong> RSA. The issuer signs with a private key; anyone can verify with the public key, often published at a JWKS URL.</li>
<li><strong>ES256:</strong> elliptic-curve signatures: like RSA but with shorter keys and signatures.</li>
<li><strong>none:</strong> no signature at all. Servers must never accept these.</li>
</ul>

<h2>Security checklist</h2>
<ul>
<li><strong>Never put secrets in the payload.</strong> Passwords, card numbers and private data are readable by anyone with the token.</li>
<li><strong>Always verify the signature on the server</strong> and fix the expected algorithm, rather than trusting the token's own <code>alg</code> header.</li>
<li><strong>Keep expiry short</strong> (minutes to an hour for access tokens) and use refresh tokens for longer sessions.</li>
<li><strong>Use a long random secret</strong> for HS256: at least 32 random bytes. The <a href="/password-generator">password generator</a> can make one.</li>
<li><strong>Be careful where you paste tokens.</strong> A valid token works like a password until it expires. This page decodes locally, but you should still avoid pasting live production tokens into any third-party site.</li>
</ul>
<p>The sample token above is generated in your browser and signed with the secret <code>my-secret-key</code>, so you can try verification.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I decode a JWT?',
      <<<'EOT_TF'
Paste it in the box. The header and payload are Base64URL-decoded and shown as formatted JSON, with dates converted to readable times.
EOT_TF,
    ],
    [
      'Is a JWT encrypted?',
      <<<'EOT_TF'
No. A standard JWT is only signed. Anyone can read its contents, so never store secrets in it. Encrypted tokens (JWE) have five parts instead of three.
EOT_TF,
    ],
    [
      'How do I check if a JWT has expired?',
      'Look at the exp claim. The decoder converts it to a date and shows whether the token has expired.',
    ],
    [
      'Can this verify the signature?',
      <<<'EOT_TF'
Yes, for HS256, HS384 and HS512 tokens: enter the shared secret. RSA and ECDSA tokens need the issuer’s public key.
EOT_TF,
    ],
    [
      'Is my token sent to a server?',
      'No. Decoding and verification happen in your browser with the Web Crypto API.',
    ],
  ],
];
