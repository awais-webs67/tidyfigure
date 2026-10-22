module.exports = {
  order: 1,
  category: 'pdf',
  icon: 'files',
  popular: true,
  files: true,
  libs: ['https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'],
  name: 'Merge PDF',
  keywords: 'combine pdf join pdf files merge documents',
  short: 'Combine several PDF files into one, in the order you choose.',
  title: 'Merge PDF: Combine PDF Files Into One, Free & Private',
  description: 'Merge PDF files into one document in seconds. Reorder files before combining. Works in your browser: no upload, no watermark, no sign-up, no limits.',
  related: ['split-pdf', 'jpg-to-pdf', 'image-compressor'],
  answer: `To merge PDFs, add the files, put them in the order you want, and combine them into a single document. Every page keeps its original quality, links and text. This tool merges the files <strong>on your device</strong>, so contracts, bank statements and other private documents are never uploaded.`,
  article: `
<h2>How to merge PDF files</h2>
<ol>
<li><strong>Add your PDFs.</strong> Drop them on the box or click to choose them. You can add files in several batches.</li>
<li><strong>Put them in order.</strong> Use the up and down arrows. The first file's pages come first in the merged document.</li>
<li><strong>Merge.</strong> Press "Merge PDFs" and the combined file downloads as <em>merged.pdf</em>.</li>
</ol>

<h2>What's kept when you merge</h2>
<p>Merging copies whole pages from each document into a new PDF. Text stays selectable and searchable, images keep their original resolution, and page sizes are preserved, so you can combine an A4 letter with a US Letter invoice and a landscape spreadsheet. Nothing is re-compressed or re-printed.</p>
<p>Form fields, bookmarks and the document outline from the original files may not carry across, because each document's outline only makes sense on its own. If you need those, merge the files and then add bookmarks in a PDF editor.</p>

<h2>Why merge in the browser?</h2>
<p>Most online PDF tools upload your files to their servers. That's a problem for documents with personal or financial details: tax returns, payslips, ID scans, medical letters, contracts. This tool uses an open-source PDF library that runs inside your browser, so the files stay on your computer or phone. It also means there are no upload waits and no daily limits.</p>

<h2>Common uses</h2>
<ul>
<li>Combining scanned pages into one application or claim</li>
<li>Putting a CV and cover letter into a single attachment</li>
<li>Joining monthly statements or invoices for your accountant</li>
<li>Adding an appendix or signed page to a report</li>
<li>Collecting tickets and booking confirmations for a trip</li>
</ul>

<h2>Tips</h2>
<ul>
<li>Want to include photos? Turn them into a PDF first with the JPG to PDF tool, then merge.</li>
<li>Need just a few pages from a long file? Use Split PDF to extract them, then merge.</li>
<li>Password-protected PDFs may not open. Remove the password in your PDF reader first (you'll need to know it).</li>
</ul>`,
  faqs: [
    ['How do I combine PDF files into one?', 'Add the PDF files to the tool, use the arrows to set their order, and press Merge PDFs. The combined document downloads straight away.'],
    ['Is it safe to merge PDFs online here?', 'Yes. The files are merged inside your browser and never uploaded to a server, so they stay private.'],
    ['Is there a limit on the number of files or pages?', 'There is no set limit. Very large files (hundreds of megabytes) depend on your device’s memory, but typical documents merge in seconds.'],
    ['Will merging reduce the quality of my PDF?', 'No. Pages are copied exactly, so text, images and page sizes stay the same as in the original files.'],
    ['Can I merge PDFs on my phone?', 'Yes. The tool works in mobile browsers on iPhone and Android. Choose files from your Files or Downloads folder.'],
  ],
};
