<?php
// Text to Handwriting: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Text to Handwriting',
  'category' => 'text',
  'order' => 8,
  'popular' => true,
  'icon' => 'feather',
  'keywords' => 'text to handwriting converter handwriting generator typed text to handwritten assignment handwriting font notebook paper ruled page pdf',
  'short' => 'Turn typed text into realistic handwriting on notebook, ruled or plain paper.',
  'title' => 'Text to Handwriting Converter: Notebook Paper, PDF',
  'description' => <<<'EOT_TF'
Turn typed text into realistic handwriting on ruled, notebook, grid or plain paper. Choose from 16 handwriting styles and inks; download PNG, JPG or PDF.
EOT_TF,
  'related' => ['signature-generator', 'online-notepad', 'fancy-text-generator', 'jpg-to-pdf'],
  'answer' => <<<'EOT_TF'
Type or paste your text, pick a <strong>handwriting style</strong>, <strong>ink colour</strong> and <strong>paper</strong> (ruled notebook, plain, grid, dotted, legal pad or old paper), and the pages appear as you type. Natural wobble and slant make it look hand-written, and long text flows onto more pages. Download each page as PNG or JPG, or all pages as one PDF.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to convert text to handwriting</h2>
<ol>
<li>Type or paste your text. Start a line with <code>#</code> to make it a heading.</li>
<li>Choose a handwriting style. Neat print styles (Patrick Hand, Kalam) read most easily; cursive styles (Homemade Apple, Dancing Script) look more personal.</li>
<li>Choose the paper and ink. Blue ink on a ruled notebook page with a margin looks like a school notebook.</li>
<li>Adjust size, line spacing and <strong>Natural wobble</strong>. Click <strong>New variation</strong> for a slightly different “take” of the same writing.</li>
<li>Download a page as PNG or JPG, or the whole document as a PDF.</li>
</ol>

<h2>Paper styles</h2>
<ul>
<li><strong>Ruled notebook:</strong> blue lines with a red margin, like a school exercise book.</li>
<li><strong>Ruled:</strong> lines without a margin.</li>
<li><strong>Grid</strong> and <strong>dotted:</strong> maths and bullet-journal pages.</li>
<li><strong>Legal pad:</strong> yellow paper with a double red margin.</li>
<li><strong>Plain:</strong> white paper, good for letters and cards.</li>
<li><strong>Old paper:</strong> warm, aged paper for invitations, crafts and props.</li>
</ul>
<p>Turn on <strong>Scanned look</strong> to add a soft shadow, slight tilt and paper grain, as if the page was photographed or scanned.</p>

<h2>Making it look real</h2>
<ul>
<li>Keep the wobble between 20% and 50%. Real handwriting isn’t perfectly straight, but too much looks drawn.</li>
<li>Use a size that fits the lines: the text sits on the ruled lines automatically.</li>
<li>Blue or black ink looks most natural; pencil grey suits notes and drafts.</li>
</ul>

<h2>Good uses</h2>
<p>Personal notes and letters, greeting cards, journaling templates, teaching materials, school projects that ask for a neat “written” look, design mock-ups and social posts. If your school or employer requires work to be written by hand, follow their rules: this tool creates an image of handwriting, not your own handwriting.</p>

<h2>Languages</h2>
<p>The handwriting styles cover English and most Latin-script languages (French, Spanish, German, Turkish and more). <strong>Kalam</strong> also writes Hindi (Devanagari). Characters a style doesn’t include are drawn in a standard font.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I convert typed text to handwriting?',
      <<<'EOT_TF'
Paste your text, choose a handwriting style, ink colour and paper, then download the pages as images or a PDF.
EOT_TF,
    ],
    [
      'Can I put the handwriting on ruled notebook paper?',
      <<<'EOT_TF'
Yes. Choose Ruled notebook for lines with a red margin, or Ruled, Grid, Dotted, Legal pad, Plain or Old paper.
EOT_TF,
    ],
    [
      'Can I download it as a PDF?',
      <<<'EOT_TF'
Yes. Download PDF saves every page in one PDF file. You can also download each page as PNG or JPG.
EOT_TF,
    ],
    [
      'Does it work for long assignments?',
      <<<'EOT_TF'
Yes. Text flows onto as many pages as needed, each with the same paper and style.
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
