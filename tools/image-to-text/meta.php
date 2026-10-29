<?php
// Image to Text (OCR): page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Image to Text (OCR)',
  'category' => 'image',
  'order' => 0,
  'icon' => 'scan-line',
  'popular' => true,
  'files' => true,
  'libs' => ['https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'],
  'scripts' => ['ai.js'],
  'appCategory' => 'UtilitiesApplication',
  'keywords' => 'image to text converter ocr online free extract text from image photo to text screenshot to text scanned pdf to text urdu ocr arabic ocr',
  'aka' => ['OCR online', 'picture to text', 'extract text from image', 'photo to text converter'], // other names people search for
  'short' => 'Copy the text out of photos, screenshots and scanned PDFs, in 20 languages.',
  'title' => 'Image to Text Converter: Free OCR for Photos & PDFs',
  'description' => 'Extract text from images, screenshots and scanned PDFs with free OCR. 20 languages including Urdu, Arabic and Hindi. Edit, copy or save as .txt. No upload.',
  'related' => ['pdf-to-text', 'word-counter', 'case-converter'],
  'answer' => <<<'EOT_TF'
To convert an image to text, drop a photo, screenshot or scanned PDF below (or paste a screenshot with <strong>Ctrl+V</strong>), choose the language, and the text appears in an editable box ready to copy. It uses <strong>OCR</strong> (optical character recognition) that runs on your device, so documents stay private. It reads 20 languages, including Urdu, Arabic, Hindi and Chinese.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to extract text from an image</h2>
<ol>
<li>Drop an image or a scanned PDF into the box, tap to take or choose a photo on your phone, or copy a screenshot and press <strong>Ctrl+V</strong> (Cmd+V on a Mac).</li>
<li>Choose the language the text is written in. For mixed text, such as English and Urdu, pick a second language too.</li>
<li>Wait a few seconds. The text appears in an editable box, and the preview outlines every word it found.</li>
<li>Fix any mistakes, then copy the text or download it as a .txt file.</li>
</ol>
<p>The first time you use a language, its recognition data (2–15 MB) downloads and is then cached by your browser.</p>

<h2>Getting the best accuracy</h2>
<ul>
<li><strong>Sharp and straight:</strong> hold the phone parallel to the page and tap to focus. Tilted or blurry text is the main cause of errors.</li>
<li><strong>Even light:</strong> avoid shadows across the page and glare on glossy paper.</li>
<li><strong>Big enough text:</strong> letters should be at least 20 pixels tall. Zoom in or crop to the part you need.</li>
<li><strong>Right language:</strong> the language setting matters a lot, especially for accents and non-Latin scripts.</li>
<li><strong>Printed text works best.</strong> Neat handwriting is sometimes readable, but expect mistakes.</li>
</ul>
<p>The coloured boxes on the preview show how confident the reader was: green words are almost certainly right, orange and red ones are worth checking.</p>

<h2>Is it a PDF with selectable text?</h2>
<p>If you can already select text in your PDF, it isn't a scan, and <a href="/pdf-to-text">PDF to Text</a> extracts it instantly and perfectly. Use this OCR tool for scanned documents, photos of pages and PDFs where the text can't be selected. Up to 30 pages are read at a time.</p>

<h2>Uses</h2>
<ul>
<li>Copy a quote or paragraph from a book or printed article.</li>
<li>Turn a screenshot of an error message, chat or table into text you can search and paste.</li>
<li>Digitise receipts, letters and old documents.</li>
<li>Get the text from a poster, sign or slide to translate it.</li>
<li>Make scanned notes searchable and editable.</li>
</ul>

<h2>Private by design</h2>
<p>Most online OCR services upload your document to their servers. Here, recognition runs inside your browser using Tesseract, an open-source OCR engine originally developed at HP and later by Google. Your images and PDFs never leave your device.</p>
EOT_TF,
  'faqs' => [
    ['How do I copy text from an image?', 'Drop the image into the tool, choose its language, and copy the extracted text from the box. You can also download it as a .txt file.'],
    ['Does it work with Urdu and Arabic?', 'Yes. Choose Urdu, Arabic or Persian as the language. Right-to-left text is supported.'],
    ['Can it read scanned PDFs?', 'Yes. Drop a scanned PDF and up to 30 pages are read, one after another.'],
    ['Is my document uploaded?', 'No. The OCR runs in your browser. Only the language data is downloaded, once.'],
    ['Can it read handwriting?', 'Neat handwriting sometimes works, but the tool is designed for printed text, so expect some errors.'],
  ],
];
