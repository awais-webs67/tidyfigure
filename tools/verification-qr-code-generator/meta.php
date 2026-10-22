<?php
// Verification QR Code Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Verification QR Code Generator',
  'category' => 'qr',
  'order' => 4,
  'icon' => 'badge-check',
  'popular' => true,
  'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'],
  'scripts' => ['hosted-qr.js'],
  'appCategory' => 'BusinessApplication',
  'keywords' => 'verification qr code certificate verification qr code document verification qr authenticity qr employee id qr verify certificate online',
  'short' => 'Put a QR code on certificates, ID cards and products that opens a verification page.',
  'title' => 'Verification QR Code Generator for Certificates & Documents',
  'description' => 'Create a QR code that opens a verification page for a certificate, ID card, letter or product: details, status and attached document. Free, no sign-up.',
  'related' => ['dynamic-qr-code-generator', 'pdf-to-qr-code', 'invoice-generator'],
  'answer' => <<<'EOT_TF'
A verification QR code lets anyone check a document is genuine by scanning it. Fill in the details (who it was issued to, by whom, dates and reference number), check the <strong>live preview</strong>, and press Create. Print the code on the certificate, ID card or product. Scanning it opens a page on this site showing the record and its status: <strong>Valid, Expired or Revoked</strong>.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How verification QR codes work</h2>
<p>Instead of putting all the details inside the QR code (where anyone could copy them onto a fake), the code holds a short link to a record stored on this site. When someone scans it, they see the record as you published it, with a clear status banner. If the printed certificate says "Distinction" but the page says "Merit", the reader knows something is wrong.</p>
<p>From your private manage link you can change the status at any time. Mark a document <strong>Revoked</strong> if it's withdrawn, for example when an employee leaves or a certificate is cancelled, and everyone who scans it sees that immediately.</p>

<h2>Uses</h2>
<ul>
<li><strong>Training and course certificates:</strong> employers can confirm a qualification in seconds.</li>
<li><strong>Staff and student ID cards:</strong> security staff scan to see the name, role and expiry.</li>
<li><strong>Experience and reference letters</strong> from HR departments.</li>
<li><strong>Product authenticity cards</strong> for handmade goods, jewellery or limited editions.</li>
<li><strong>Event passes and membership cards</strong> with a validity date.</li>
<li><strong>Lab, inspection or warranty certificates</strong> with a reference number.</li>
</ul>

<h2>What to include</h2>
<ul>
<li><strong>Document title</strong> such as "Certificate of Completion".</li>
<li><strong>Issued to</strong> and <strong>issued by</strong>: the person or product, and your organisation's full name.</li>
<li><strong>Dates:</strong> the issue date and, if it applies, the date it stops being valid. After that date the page automatically shows "Expired".</li>
<li><strong>Reference number</strong> that matches the printed document.</li>
<li><strong>Details</strong> such as course name, grade, job title or batch number (up to 12).</li>
<li><strong>Attachment (optional):</strong> a scan or photo of the document, so the reader can compare it with the paper copy.</li>
</ul>

<h2>Important limits</h2>
<p>This tool publishes the information you enter; it doesn't check it. The page clearly states that the record was published by the issuer. It's designed for organisations to verify their <em>own</em> documents. Creating records for documents you didn't issue, or to make a fake document look genuine, is fraud and the code will be removed. Codes are hosted for 30 days by default, which suits events, temporary passes and checking new certificates; for permanent records, publish the verification page on your own website and link to it with a <a href="/qr-code-generator">static QR code</a>.</p>
<p>Don't include sensitive personal data such as ID numbers, dates of birth or home addresses: anyone with the code can read the page.</p>
EOT_TF,
  'faqs' => [
    ['What is a verification QR code?', 'A QR code printed on a document or product that opens a page showing the official record, so people can check the document is genuine and still valid.'],
    ['Can I revoke a certificate later?', 'Yes. Open your private manage link and change the status to Revoked. Anyone who scans the code sees it straight away.'],
    ['Can I attach the certificate itself?', 'Yes. Attach a PDF or image and it appears on the verification page with a download button.'],
    ['How long does the verification page stay online?', 'For 30 days by default, then it is deleted automatically.'],
    ['Does the site check that my information is true?', 'No. The page shows what the issuer entered and says so clearly. Only create records for documents you issued.'],
  ],
];
