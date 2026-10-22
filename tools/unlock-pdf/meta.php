<?php
// Unlock PDF: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Unlock PDF (Remove Password)',
  'category' => 'pdf',
  'order' => 15,
  'icon' => 'lock-open',
  'files' => true,
  'libs' => ['https://cdn.jsdelivr.net/npm/@cantoo/pdf-lib@2.9.2/dist/pdf-lib.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'],
  'appCategory' => 'UtilitiesApplication',
  'keywords' => 'unlock pdf remove pdf password decrypt pdf remove restrictions pdf print copy permission password protected pdf',
  'short' => 'Remove the password and print or copy restrictions from a PDF you can open.',
  'title' => 'Unlock PDF: Remove PDF Password and Restrictions Free',
  'description' => 'Remove the password from a PDF you know the password for, and lift print, copy and edit restrictions. Runs in your browser: your PDF is never uploaded.',
  'related' => ['protect-pdf', 'merge-pdf', 'pdf-to-text'],
  'answer' => <<<'EOT_TF'
To remove a password from a PDF, choose the file, type the password once and press <strong>Unlock PDF</strong>. You get a copy that opens without a password and has no print, copy or edit restrictions. Files that only block printing or copying are unlocked without a password. Everything happens in your browser, so the PDF is never uploaded.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to remove a password from a PDF</h2>
<ol>
<li>Drop the PDF in the box. The tool tells you whether it needs a password to open, or only has restrictions.</li>
<li>If asked, type the password.</li>
<li>Press <strong>Unlock PDF</strong>. Previews of the unlocked pages appear, so you can check the file before downloading it.</li>
</ol>

<h2>Two kinds of PDF protection</h2>
<p><strong>An open password</strong> (user password) stops anyone reading the file. Banks, phone companies and payroll systems often send statements locked with your date of birth, account number or national ID. You need this password once to unlock the PDF; the tool doesn't guess or crack passwords.</p>
<p><strong>Restrictions</strong> (owner password) let anyone open the file but block printing, copying text or editing. Your PDF reader shows these as “secured” or “locked”. The tool removes these restrictions without a password, because the file can already be read.</p>

<h2>Why remove a PDF password?</h2>
<ul>
<li>Stop typing the password every time you open a statement or payslip.</li>
<li>Upload a document to a website that refuses password-protected PDFs, such as visa, loan or university portals.</li>
<li>Merge, compress, sign or print a locked PDF with our other <a href="/pdf-tools">PDF tools</a>.</li>
<li>Copy text or tables out of a report that blocks copying.</li>
</ul>

<h2>Is it legal and safe?</h2>
<p>Only unlock PDFs that you own or have permission to use, such as your own bank statements. The tool needs the correct password for locked files and can't open a PDF you don't have access to. Your file never leaves your device, which makes this safer than upload sites for private documents. Once unlocked, anyone with the copy can open it, so store it carefully, or add a new password with <a href="/protect-pdf">Protect PDF</a>.</p>
EOT_TF,
  'faqs' => [
    ['How do I remove a password from a PDF?', 'Choose the PDF, enter its password and press Unlock PDF. Check the preview, then download the unlocked copy.'],
    ['Can it unlock a PDF without the password?', 'If the PDF only restricts printing or copying, yes. If it needs a password to open, you must know the password; the tool does not crack passwords.'],
    ['Is my PDF uploaded?', 'No. Unlocking happens in your browser, so private documents stay on your device.'],
    ['Does it work with bank statement PDFs?', 'Yes. Enter the password the bank gave you, often your date of birth or part of your account number.'],
    ['Will it change the content?', 'No. Pages, text, images and links stay the same; only the encryption is removed.'],
  ],
];
