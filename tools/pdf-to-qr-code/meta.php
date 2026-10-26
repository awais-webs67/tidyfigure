<?php
// File to QR Code (PDF, image, audio): page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'PDF to QR Code',
  'category' => 'qr',
  'order' => 3,
  'icon' => 'file-up',
  'popular' => true,
  'files' => true,
  'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'],
  'scripts' => ['hosted-qr.js'],
  'appCategory' => 'BusinessApplication',
  'keywords' => 'pdf to qr code file to qr code menu qr code upload pdf qr image to qr code mp3 qr code document qr',
  'short' => 'Upload a PDF, image or audio file and get a QR code that opens it.',
  'title' => 'PDF to QR Code: Turn a PDF, Image or MP3 into a QR Code',
  'description' => 'Upload a PDF, image, MP3 or MP4 and get a QR code that opens it on any phone: menus, brochures, manuals and flyers. Preview first, no sign-up, free.',
  'related' => ['dynamic-qr-code-generator', 'qr-code-generator', 'compress-pdf'],
  'answer' => <<<'EOT_TF'
To turn a PDF into a QR code, choose the file below, check the preview, and press <strong>Upload and create QR code</strong>. The file is stored on this site and the QR code opens it on any phone, with no app needed. It works for <strong>PDFs, images, MP3s and MP4 videos</strong>, and each code shows scan counts on its private manage page.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>What people use file QR codes for</h2>
<ul>
<li><strong>Restaurant and café menus:</strong> a code on each table opens the PDF menu.</li>
<li><strong>Brochures and price lists</strong> at trade shows, without printing hundreds of copies.</li>
<li><strong>Product manuals and assembly instructions</strong> printed on the box.</li>
<li><strong>Event programmes, maps and schedules</strong> on posters and tickets.</li>
<li><strong>Portfolios and CVs</strong> on a business card.</li>
<li><strong>Audio guides</strong> (MP3) for museums, tours or property viewings, and short videos (MP4) for product demos.</li>
</ul>

<h2>How it works</h2>
<ol>
<li>Choose your file. You see a preview before anything is uploaded: the first page of a PDF, the image, or a player for audio and video.</li>
<li>Add a title. People see it at the top of the page when they scan.</li>
<li>Press <strong>Upload and create QR code</strong>. The file is stored on this site and you get a QR code plus a short link.</li>
<li>Download the code as PNG or SVG and save your private manage link to see scans or delete the file.</li>
</ol>
<p>When someone scans the code, they see a clean page with your title, a preview of the file and a download button. PDFs open in the phone's built-in viewer.</p>

<h2>Make the file phone-friendly first</h2>
<ul>
<li><strong>Shrink big PDFs</strong> with <a href="/compress-pdf">Compress PDF</a> so they open quickly on mobile data. Under 5 MB is ideal.</li>
<li><strong>Use a portrait layout</strong> with large text: people will read it on a small screen.</li>
<li><strong>Images:</strong> resize photos to about 1600 px wide with the <a href="/image-resizer">image resizer</a>; anything bigger just loads slower.</li>
</ul>

<h2>Privacy and how long files are kept</h2>
<p>Anyone who has the QR code or the link can open the file, so only share documents meant for the public. Never upload IDs, bank details or private records. Files are kept for 30 days by default and then deleted automatically, together with their scan statistics. You can delete a file sooner from the manage page. The page that shows the file is hidden from search engines.</p>

<h2>Need a code that never expires?</h2>
<p>If your file is already online (for example on your website or a cloud drive with a public link), make a <a href="/qr-code-generator">static QR code</a> of that link instead. It contains the link itself and works forever.</p>
EOT_TF,
  'faqs' => [
    ['How do I create a QR code for a PDF?', 'Choose the PDF, check the preview, and press Upload and create QR code. Download the QR code and print or share it.'],
    ['Which file types can I use?', 'PDF, JPG, PNG, WebP, GIF, MP3 and MP4, up to the size shown on the upload box (10 MB by default).'],
    ['Do people need an app to open it?', 'No. Any phone camera can scan the code, and the file opens in the browser.'],
    ['How long is the file available?', 'For 30 days by default. After that the file and the code are deleted automatically.'],
    ['Can I replace the file later?', 'Not for file codes. Delete the code from the manage page and make a new one, or use a dynamic QR code pointing to a link you control.'],
  ],
];
