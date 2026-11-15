<?php
return [
    'name' => 'Compare PDF',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 19,
    'files' => true,
    'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'],
    'icon' => 'git-compare-arrows',
    'keywords' => 'compare pdf online free, pdf diff checker, highlight changes between two pdfs, contract revision compare',
    'aka' => ['PDF Diff Checker', 'Contract Version Comparer'],
    'short' => 'Find every difference between two versions of a PDF: changed words, and a visual overlay of each page.',
    'title' => 'Compare PDF Online – Side-by-Side Diff Check',
    'description' => 'Compare two PDF drafts side by side to highlight added or deleted text word-for-word, or toggle visual overlay diff privately without uploads.',
    'related' => ['pdf-to-text', 'edit-pdf', 'merge-pdf'],
    'answer' => 'To compare two PDFs, drop the <strong>original</strong> and the <strong>changed</strong> version. <strong>Text changes</strong> lists every word that was added (green) or removed (red), page by page, with a count of changes. <strong>Visual</strong> lays each page over its match so you can see moved images, new signatures or layout changes too.',
    'article' => <<<'EOT_TF'
<h2>How to compare two PDF files</h2>
<ol>
<li>Drop the original PDF in the first box and the new version in the second, or try the sample pair.</li>
<li>Press <strong>Compare</strong>. The summary shows how many words were added and removed.</li>
<li>Read the changes in <strong>Text changes</strong>: added words are green, removed words red and crossed out, with a little unchanged text around each change. Untick <strong>Only show changes</strong> to read the whole document.</li>
<li>Switch to <strong>Visual</strong> to see each page of the two files laid over each other.</li>
</ol>

<h2>Text comparison and visual comparison</h2>
<p><strong>Text changes</strong> compares the words of the two documents, so it finds every changed figure, date or clause even when the rest of the text has moved to another page. It's the best way to check a contract, a policy or a report for edits nobody mentioned.</p>
<p><strong>Visual</strong> compares how the pages look: removed parts show in red and added parts in green, on a faded copy of the page. It catches changes the text can't show, such as a different logo, a moved signature, a changed chart or a new stamp, and works for scanned PDFs too.</p>

<h2>When to compare PDFs</h2>
<ul>
<li>Check a contract or lease the other side sent back for quiet edits.</li>
<li>See what changed between two versions of a report, CV or thesis.</li>
<li>Proofread a print-ready file against the approved version.</li>
<li>Compare an invoice or quote against the previous one.</li>
</ul>

<h2>Private comparison</h2>
<p>Documents you need to compare are often confidential. Both files are read in your browser and never uploaded, so nobody else can see them.</p>

<h2>Catching Silent Contract Clause &amp; Number Tweaks</h2>
<p>Unannounced edits to payment terms, liability caps or warranty dates hide easily inside 40-page supplier agreements. Running text diff alongside visual pixel overlay reveals swapped figures, altered punctuation and shifted tables immediately on your screen.</p>

<h2>Reviewing Redlined Specs Without Expensive Desktop Suites</h2>
<p>Legal paralegals, procurement leads and graduate students can run instant word-and-visual diffs right on encrypted laptop SSDs without uploading unpublished patents or tenders anywhere.</p>
EOT_TF,
    'faqs' => [
        ['How do I compare two PDFs for free?', 'Drop the original and the new version here and press Compare. Added words are shown in green and removed words in red, and the Visual tab overlays the pages.'],
        ['Can I compare scanned PDFs?', 'Use the Visual comparison: it compares how the pages look, so it works for scans. Text changes needs real text in the PDF.'],
        ['Does it find changes when text moves to another page?', 'Yes. The text comparison compares the whole document, so text that only moved to another page isn’t reported as changed.'],
        ['Are my files uploaded?', 'No. Both PDFs are compared in your browser and never leave your device.'],
        ['Does visual comparison catch layout changes inside scanned PDFs?', 'Yes. Overlay alignment highlights moved signatures, stamp shifts or erased checkboxes even where selectable text is missing.'],
    ],
];
