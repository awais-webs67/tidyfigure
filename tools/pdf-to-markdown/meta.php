<?php
return [
    'name' => 'PDF to Markdown',
    'updated' => '2026-11-15',
    'category' => 'pdf',
    'order' => 20,
    'files' => true,
    'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'],
    'icon' => 'file-code',
    'keywords' => 'pdf to markdown converter, pdf to md free, prepare pdf for obsidian notion llm rag, clean pdf markdown',
    'aka' => ['PDF to .MD Extractor', 'Markdown Document Converter'],
    'short' => 'Turn a PDF into clean Markdown with headings, lists, bold text and links, ready for notes, docs or AI chats.',
    'title' => 'PDF to Markdown Converter – Clean .md Files',
    'description' => 'Convert reports, ebooks and specs into structured Markdown keeping headings, lists, links and emphasis while stripping repeating headers locally.',
    'related' => ['pdf-to-text', 'pdf-to-word', 'image-to-text'],
    'answer' => 'Drop a PDF and it\'s converted to <strong>Markdown</strong> straight away: big text becomes <code>#</code> headings, bullet and numbered lists become Markdown lists, bold words become <code>**bold**</code> and links keep their address. Repeated page headers, footers and page numbers are left out. Copy it or download a <strong>.md</strong> file.',
    'article' => <<<'EOT_TF'
<h2>How to convert a PDF to Markdown</h2>
<ol>
<li>Drop a PDF in the box, or try the sample.</li>
<li>The Markdown appears on the right. Choose whether to mark page breaks and keep page headers and footers.</li>
<li>Press <strong>Copy</strong> to paste it into Notion, Obsidian, GitHub, a wiki or an AI chat, or download it as a <strong>.md</strong> file.</li>
</ol>

<h2>What's kept</h2>
<ul>
<li><strong>Headings:</strong> text larger than the body text becomes a heading. The largest size is <code>#</code>, the next <code>##</code> and so on.</li>
<li><strong>Paragraphs:</strong> lines of a paragraph are joined, and words split by a hyphen at the end of a line are put back together.</li>
<li><strong>Lists:</strong> bullets (•, –, ▪) and numbered items become Markdown lists.</li>
<li><strong>Bold text</strong> becomes <code>**bold**</code>, and <strong>links</strong> become <code>[text](address)</code>.</li>
</ul>
<p>Headers, footers and page numbers that repeat on most pages are left out, because they break up the text. Tick <strong>Keep headers and footers</strong> if you want them.</p>

<h2>Why Markdown?</h2>
<p>Markdown is plain text with a few symbols for structure, so it's easy to edit and works almost everywhere: note apps such as Obsidian and Notion, GitHub and GitLab, static site generators and documentation tools. It's also the best way to give a long PDF to ChatGPT, Claude or another AI assistant: the headings and lists help it understand the document, and plain text uses far fewer tokens than a file upload.</p>

<h2>Limits</h2>
<p>A PDF stores where each letter goes, not which text is a heading or a table, so the structure is worked out from sizes and positions. Most reports, articles, manuals and e-books convert well. Tables become lines of text, and scanned PDFs have no text to read: run them through <a href="/image-to-text">Image to Text</a> first.</p>

<h2>Prepping Long PDFs for Obsidian, Notion &amp; AI Context Windows</h2>
<p>Pasting raw PDF selections directly injects broken page numbers, mid-line carriage breaks and scrambled tables. Clean hierarchy Markdown strips repetitive running footers cleanly, cutting token noise dramatically when feeding documentation into notes or LLM workflows.</p>

<h2>Keeping Nested Bullet Lists &amp; Heading Levels Structured</h2>
<p>Preserving bold inline emphasis and hierarchical <code>##</code> headings turns static academic papers and vendor handbooks into searchable plain-text knowledge bases ready for instant note-taking or git commits.</p>
EOT_TF,
    'faqs' => [
        ['How do I convert a PDF to Markdown?', 'Drop the PDF here. The Markdown appears straight away; copy it or download the .md file. It is free with no sign-up.'],
        ['Does it keep headings and lists?', 'Yes. Larger text becomes # headings, bullets and numbered items become Markdown lists, bold text becomes **bold** and links are kept.'],
        ['Can I convert a scanned PDF to Markdown?', 'Scans contain pictures of text, not text. Use Image to Text to read the words first.'],
        ['Is my PDF uploaded?', 'No. The PDF is converted in your browser and never leaves your device.'],
    ],
];
