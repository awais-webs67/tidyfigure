<?php
return [
    'name' => 'Email Signature Generator',
    'updated' => '2026-11-15',
    'category' => 'money',
    'order' => 24,
    'icon' => 'mail',
    'appCategory' => 'BusinessApplication',
    'keywords' => 'email signature generator, free html gmail signature maker, outlook professional signature builder',
    'short' => 'Make a professional email signature for Gmail, Outlook or Apple Mail and copy it in one click.',
    'title' => 'Email Signature Generator – Gmail & Outlook',
    'description' => 'Build a crisp clickable HTML email signature with headshot, company role, phone and social icons to paste straight into Gmail, Outlook or Mail.',
    'related' => ['qr-code-generator', 'vcard-qr-code-generator', 'invoice-generator'],
    'answer' => 'Fill in your details, pick a style and colour, then press <strong>Copy signature</strong> and paste it into your email app\'s signature settings. In Gmail that\'s <strong>Settings → See all settings → General → Signature</strong>; in Outlook, <strong>Settings → Mail → Compose and reply</strong>. The signature uses simple table layouts and inline styles, which email apps display reliably.',
    'sources' => [
        ['Google Workspace Learning Center – Create a Gmail Signature', 'https://support.google.com/mail/answer/8395'],
        ['Microsoft Support – Create & Add an Email Signature in Outlook', 'https://support.microsoft.com/en-us/office/create-and-add-an-email-signature-in-outlook-8ee5d4f4-68fd-464a-a1c1-0e1c80bb27f2'],
    ],
    'article' => <<<'EOT_TF'
<h2>How to add your signature</h2>
<h3>Gmail (web)</h3>
<ol>
<li>Press <strong>Copy signature</strong> above.</li>
<li>In Gmail, click the gear icon → <strong>See all settings</strong> → <strong>General</strong> tab.</li>
<li>Under <strong>Signature</strong>, click <strong>Create new</strong>, name it, and paste with Ctrl+V (Cmd+V on a Mac).</li>
<li>Choose it as the default for new emails and replies, then click <strong>Save changes</strong> at the bottom of the page.</li>
</ol>
<h3>Outlook (web and new Outlook for Windows)</h3>
<ol>
<li>Go to <strong>Settings → Mail → Compose and reply</strong> (in some versions, <strong>Accounts → Signatures</strong>).</li>
<li>Create a new signature, paste it in the box, choose when to use it and save.</li>
</ol>
<h3>Apple Mail</h3>
<ol>
<li>Open <strong>Mail → Settings → Signatures</strong>, select your account and click <strong>+</strong>.</li>
<li>Untick <strong>Always match my default message font</strong>, then paste the signature.</li>
</ol>
<p>On phones, the Gmail and Outlook apps only support plain-text signatures. Your rich signature still appears on emails you send from a computer or the web.</p>

<h2>What makes a good email signature</h2>
<ul>
<li><strong>Keep it short:</strong> name, job title, company and one or two ways to reach you. Four to six lines is plenty.</li>
<li><strong>Make it clickable:</strong> phone numbers, email and website are links, so people can tap to call or visit.</li>
<li><strong>Use one accent colour</strong>, ideally your brand colour, and a standard font every computer has.</li>
<li><strong>Only add social links you use for work.</strong></li>
<li><strong>Skip quotes and long disclaimers</strong> unless your employer requires them.</li>
</ul>

<h2>Adding a photo or logo</h2>
<p>Email apps don't keep images that are stored only on your computer. The image needs to be online at a public <code>https://</code> address, for example on your website or a public image link. Paste that address into the photo field. Use a small, square image (around 160×160 pixels for an 80-pixel display, so it's sharp on high-resolution screens). Some recipients' email apps block images until they click "show images", so make sure your signature still works without it.</p>

<h2>Why it's built with tables</h2>
<p>Email apps are much stricter than web browsers. Outlook for Windows, for example, ignores many modern layout styles. That's why this signature uses an old-fashioned table layout with every style written directly on each element. It looks the same in Gmail, Outlook, Apple Mail, Yahoo and most other apps. If you edit the HTML code yourself, keep styles inline and avoid external stylesheets and scripts, which email apps remove.</p>

<h2>Ideas to go with your signature</h2>
<ul>
<li>Make a <a href="/vcard-qr-code-generator">vCard QR code</a> so people can save your contact details by scanning a code on your business card.</li>
<li>Send professional invoices with your logo using the <a href="/invoice-generator">invoice generator</a>.</li>
</ul>
<p>Everything is generated in your browser. Your details aren't stored or sent anywhere.</p>
EOT_TF,
    'faqs' => [
        ['How do I make an email signature?', 'Fill in your details above, choose a style and colour, press Copy signature, then paste it into your email app’s signature settings.'],
        ['How do I add a signature in Gmail?', 'Gear icon → See all settings → General → Signature → Create new. Paste the signature, set it as default and click Save changes.'],
        ['Why doesn’t my photo show in the signature?', 'The image must be online at a public https:// link. Images on your computer aren’t kept, and some recipients block images until they choose to show them.'],
        ['Does it work in Outlook?', 'Yes. The signature uses tables and inline styles, which Outlook displays correctly. Paste it in Settings → Mail → Compose and reply.'],
        ['Is the email signature generator free?', 'Yes. It is free with no sign-up and no branding added to your signature.'],
    ],
    'aka' => ['HTML Email Signature Maker', 'Gmail & Outlook Signature Builder'],
];
