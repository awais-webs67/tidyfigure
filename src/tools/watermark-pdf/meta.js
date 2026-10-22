module.exports = {
  order: 10,
  category: 'pdf',
  icon: 'stamp',
  files: true,
  libs: ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'],
  name: 'Watermark PDF',
  keywords: 'add watermark to pdf confidential draft stamp text pdf',
  short: 'Stamp “Confidential”, “Draft” or any text across every PDF page.',
  title: 'Watermark PDF: Add Text Watermark to PDF Online, Free',
  description: 'Add a text watermark like CONFIDENTIAL, DRAFT or your name to every page of a PDF. Diagonal, tiled or footer layouts, any colour and opacity. Private and free.',
  related: ['add-page-numbers', 'sign-pdf', 'pdf-metadata-remover'],
  answer: `A watermark is text printed faintly across a page to show its status ("DRAFT"), who it belongs to, or that it mustn't be shared ("CONFIDENTIAL"). Type your text, choose a diagonal, tiled or footer layout, adjust colour and transparency, and download. A preview updates as you change the settings.`,
  article: `
<h2>When to watermark a PDF</h2>
<ul>
<li><strong>Drafts:</strong> stop an early version being mistaken for the final one.</li>
<li><strong>Confidential documents:</strong> remind readers not to forward contracts, plans or reports.</li>
<li><strong>Copies of IDs:</strong> stamping "For bank account opening only" on a passport copy makes it much harder to misuse.</li>
<li><strong>Samples and portfolios:</strong> share work without giving away a clean, usable copy.</li>
<li><strong>Paid invoices:</strong> mark them "PAID" for your records.</li>
</ul>

<h2>Layouts</h2>
<ul>
<li><strong>One, diagonal:</strong> large text from corner to corner, automatically sized to fit each page. The classic watermark.</li>
<li><strong>Repeated (tiled):</strong> the text is repeated across the whole page at an angle. Much harder to crop or edit out.</li>
<li><strong>Small, at the bottom:</strong> a discreet line in the footer, for ownership notes like "Prepared for Acme Ltd".</li>
</ul>

<h2>Choosing opacity</h2>
<p>15–25% opacity keeps text underneath easy to read while the watermark stays obvious. Go higher for sample documents where readability matters less than protection. Grey or your brand colour both work; red and orange draw attention to "DRAFT" and "CONFIDENTIAL".</p>

<h2>How secure is a watermark?</h2>
<p>A text watermark is a deterrent, not encryption. Someone with PDF editing software can remove it. For stronger protection, use the tiled layout (which is tedious to remove), include the recipient's name so leaks can be traced, or convert the watermarked PDF to images with PDF to JPG so the watermark becomes part of the picture.</p>

<h2>Private by design</h2>
<p>The watermark is added in your browser. Your document is never uploaded, which matters most for exactly the kind of files people watermark.</p>`,
  faqs: [
    ['How do I add a watermark to a PDF?', 'Open the PDF, type your watermark text, choose a layout, colour and opacity, and download. Every page gets the watermark.'],
    ['Can I make the watermark transparent?', 'Yes. Use the opacity slider; 15–25% keeps the page readable.'],
    ['Can a watermark be removed?', 'Someone with PDF editing software can remove a text watermark. A tiled watermark is much harder to remove.'],
    ['Can I watermark a copy of my ID?', 'Yes. Add a line like “Copy for XYZ bank only, 2026” so the copy can’t easily be reused elsewhere.'],
    ['Is my PDF uploaded?', 'No. The watermark is added on your device.'],
  ],
};
