<?php
// Protect PDF: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Protect PDF with Password',
  'updated' => '2026-10-26', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'pdf',
  'order' => 14,
  'icon' => 'file-lock',
  'popular' => true,
  'files' => true,
  'libs' => ['vendor/cantoo-pdf-lib-2.9.2.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'],
  'appCategory' => 'UtilitiesApplication',
  'keywords' => 'protect pdf with password add password to pdf encrypt pdf lock pdf secure pdf aes 256 restrict printing copying',
  'short' => 'Add a password to a PDF with AES-256 encryption, and limit printing or copying.',
  'title' => 'Protect PDF with Password: Encrypt PDF Free, AES-256',
  'description' => 'Add a password to any PDF with AES-256 encryption and choose whether people can print, copy or edit it. Works in your browser: the PDF is never uploaded.',
  'related' => ['unlock-pdf', 'compress-pdf', 'pdf-metadata-remover'],
  'answer' => <<<'EOT_TF'
To password-protect a PDF, choose the file, type a password twice and press <strong>Protect PDF</strong>. The PDF is encrypted with <strong>AES-256</strong>, the standard used by Adobe Acrobat, so it won’t open without the password in any PDF reader. You can also stop people printing, copying text or editing it. Encryption happens on your device; the PDF is never uploaded.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to add a password to a PDF</h2>
<ol>
<li>Drop your PDF in the box. A preview of the first page appears.</li>
<li>Type a password and repeat it.</li>
<li>Choose what people can do once it's open: print, copy text, or edit.</li>
<li>Press <strong>Protect PDF</strong>. The tool checks that the new file refuses to open without the password, shows a preview opened with it, and lets you download it.</li>
</ol>

<h2>How secure is it?</h2>
<p>The file is encrypted with <strong>AES-256</strong> (Advanced Encryption Standard with a 256-bit key), the strongest encryption in the PDF standard and the same used by Adobe Acrobat. Without the password, the contents are unreadable. The weak point is the password itself:</p>
<ul>
<li>Use at least 10 characters, mixing words, numbers and symbols, or a passphrase of four random words.</li>
<li>Don't reuse a password from email or banking.</li>
<li>Send the password by a different route from the file, for example the PDF by email and the password by text message.</li>
</ul>
<p>The <a href="/password-generator">password generator</a> can create a strong one. If you forget it, the file can't be recovered, so keep the password somewhere safe.</p>

<h2>Print, copy and edit restrictions</h2>
<p>Restrictions are saved in the file and respected by Adobe Acrobat, Chrome, Edge, Preview and most other readers. They're useful for sending a statement that shouldn't be edited, or a document that shouldn't be printed. They're not foolproof: some programs ignore them, and anyone can take a screenshot. For truly confidential documents, rely on the password and only share it with people you trust.</p>

<h2>AES-256 or AES-128?</h2>
<p>AES-256 works in every PDF reader released in the last 15 years, including Acrobat Reader 9 and newer, browsers, phones and Microsoft Edge. Choose AES-128 only if the recipient uses very old software that can't open the file.</p>

<h2>Common uses</h2>
<ul>
<li>Payslips, bank statements and tax documents sent by email.</li>
<li>Contracts, quotations and invoices with confidential prices.</li>
<li>Medical records, ID scans and legal documents.</li>
<li>Exam papers and paid e-books.</li>
</ul>
<p>To remove a password later from a PDF you can open, use <a href="/unlock-pdf">Unlock PDF</a>.</p>
EOT_TF,
  'faqs' => [
    ['How do I put a password on a PDF?', 'Choose the PDF, type a password twice and press Protect PDF. Download the encrypted file.'],
    ['Is it secure?', 'Yes. The PDF is encrypted with AES-256, the strongest PDF encryption. Security then depends on choosing a strong password.'],
    ['Is my PDF uploaded?', 'No. Encryption happens in your browser, on your device.'],
    ['Can I stop people printing or copying my PDF?', 'Yes. Untick Print or Copy text. Most PDF readers respect these settings, but they are not a guarantee.'],
    ['What if I forget the password?', 'The file cannot be opened or recovered without it, so store the password safely.'],
  ],
];
