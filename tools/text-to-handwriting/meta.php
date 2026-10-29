<?php
// Text to Handwriting: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Text to Handwriting',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'text',
  'order' => 8,
  'popular' => true,
  'icon' => 'feather',
  'keywords' => 'text to handwriting converter handwriting generator typed text to handwritten assignment handwriting font notebook paper ruled page pdf',
  'aka' => ['handwriting generator', 'text to handwritten', 'assignment handwriting maker', 'typed text to handwriting'], // other names people search for
  'short' => 'Turn typed text into realistic handwriting on notebook, ruled or plain paper.',
  'title' => 'Text to Handwriting Converter: Notebook Paper, PDF',
  'description' => <<<'EOT_TF'
Turn typed text into realistic handwriting on ruled, notebook, bordered or plain paper. Format it like Word, pick from 16 styles, download PNG or PDF.
EOT_TF,
  'related' => ['signature-generator', 'online-notepad', 'fancy-text-generator', 'jpg-to-pdf'],
  'answer' => <<<'EOT_TF'
Type or paste your text into the editor and format it like in Word: <strong>bold</strong>, <em>italic</em>, underline, size, colour, highlighter, alignment (including justify) and lists. Pick a handwriting style and paper (ruled notebook, plain, bordered, grid and more): the writing sits neatly on the lines and flows onto as many pages as needed. Download PNG, JPG or one PDF.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to convert text to handwriting</h2>
<ol>
<li>Type or paste your text into the editor. Use the toolbar to make words bold, italic or underlined, change their size or ink colour, highlight them, align paragraphs (left, centre, right or justified) and make lists.</li>
<li>Choose a handwriting style. Neat print styles (Patrick Hand, Kalam) read most easily; cursive styles (Homemade Apple, Dancing Script) look more personal.</li>
<li>Choose the paper: ruled notebook with a margin, ruled, plain, bordered, ruled with a border, grid, dotted, yellow legal pad or old paper.</li>
<li>Adjust the text size, line spacing, margins and <strong>Natural wobble</strong>, and add your name and date at the top if you like.</li>
<li>Download each page as PNG or JPG, or all pages as one PDF.</li>
</ol>

<h2>Writing that sits on the lines</h2>
<p>Every handwriting font draws its letters slightly differently. The tool measures each style and places the bottom of the letters right on the ruled line, like real writing in a notebook. Bigger text takes two lines, and long text flows onto new pages automatically.</p>

<h2>Formatting options</h2>
<ul>
<li><strong>Bold</strong> writes with a heavier pen; <em>italic</em> slants the writing more.</li>
<li><strong>Underline</strong> and <strong>strikethrough</strong> are drawn by hand, slightly uneven.</li>
<li><strong>Highlighter</strong> adds a marker stroke behind words.</li>
<li><strong>Colours:</strong> blue, black, red, green, purple, pencil grey, or any colour you pick.</li>
<li><strong>Alignment:</strong> left, centre, right and justified paragraphs, plus bullet and numbered lists.</li>
</ul>

<h2>Making it look real</h2>
<ul>
<li>Keep the wobble between 20% and 50%. Real handwriting isn’t perfectly straight, but too much looks drawn.</li>
<li>Blue or black ink on a ruled notebook page looks the most natural.</li>
<li>Turn on <strong>Scanned look</strong> to add a soft shadow, slight tilt and paper grain, as if the page was photographed.</li>
</ul>

<h2>Good uses</h2>
<p>Personal notes and letters, greeting cards, journaling templates, teaching materials, design mock-ups and social posts. If your school or employer requires work written by hand, follow their rules: this tool creates an image of handwriting, not your own handwriting.</p>

<h2>Languages</h2>
<p>The handwriting styles cover English and most Latin-script languages (French, Spanish, German, Turkish and more). <strong>Kalam</strong> also writes Hindi (Devanagari). Characters a style doesn’t include are drawn in a standard font.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I convert typed text to handwriting?',
      <<<'EOT_TF'
Paste your text into the editor, format it with the toolbar, choose a handwriting style and paper, then download the pages as images or a PDF.
EOT_TF,
    ],
    [
      'Can I make words bold, coloured or underlined?',
      <<<'EOT_TF'
Yes. The toolbar works like Word: bold, italic, underline, strikethrough, text size, ink colour, highlighter, alignment, justify and lists.
EOT_TF,
    ],
    [
      'Does the writing sit on the lines?',
      <<<'EOT_TF'
Yes. Each handwriting style is measured so the letters sit right on the ruled lines, and long text continues on new pages automatically.
EOT_TF,
    ],
    [
      'Can I download it as a PDF?',
      <<<'EOT_TF'
Yes. Download PDF saves every page in one file. You can also download each page as PNG or JPG.
EOT_TF,
    ],
    [
      'Is my text uploaded?',
      <<<'EOT_TF'
No. The pages are drawn in your browser. Only the handwriting font is downloaded, from Google Fonts.
EOT_TF,
    ],
  ],
];
