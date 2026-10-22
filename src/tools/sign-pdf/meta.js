module.exports = {
  order: 13,
  category: 'pdf',
  icon: 'signature',
  popular: true,
  files: true,
  libs: ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'],
  name: 'Sign PDF',
  keywords: 'sign pdf online e-signature add signature to pdf draw signature',
  short: 'Draw or type your signature and place it anywhere on a PDF.',
  title: 'Sign PDF Online: Draw or Type a Signature, Free',
  description: 'Sign a PDF in your browser: draw or type your signature, tap where it goes, add the date and download. No account, no upload, no watermark. Works on phones.',
  related: ['watermark-pdf', 'merge-pdf', 'pdf-metadata-remover'],
  answer: `To sign a PDF, <strong>draw your signature</strong> with your mouse or finger (or type your name in a handwriting style), open the PDF, and <strong>tap where the signature should go</strong>. You can add today's date, place signatures or initials on several pages, and download the signed copy. Nothing is uploaded.`,
  article: `
<h2>How to sign a PDF</h2>
<ol>
<li><strong>Create your signature.</strong> Draw it in the box (a phone or tablet with a finger or stylus gives the most natural result) or type your name and pick a handwriting style.</li>
<li><strong>Open the PDF.</strong> The first page appears on the right.</li>
<li><strong>Tap to place.</strong> Tap the signature line. Use the arrows to move between pages and the slider to change the size.</li>
<li><strong>Download.</strong> The signature is added as an image on the page, exactly where you placed it.</li>
</ol>

<h2>Is an electronic signature legally valid?</h2>
<p>In most countries, yes, for most everyday documents. Laws such as the US ESIGN Act and UETA, the EU's eIDAS regulation, and the UK's Electronic Communications Act recognise electronic signatures. A drawn or typed signature on a PDF is a "simple electronic signature": it shows intent to sign, which is enough for things like rental forms, permission slips, quotes, invoices and many contracts.</p>
<p>Some documents need more: wills, property deeds, certain court and government forms, and documents that must be witnessed or notarised. Others require an "advanced" or "qualified" digital signature linked to a verified identity. If in doubt, check with the person or organisation asking for your signature.</p>

<h2>Tips for a good-looking signature</h2>
<ul>
<li>Draw it larger than you need; the tool crops it tightly and you can shrink it with the slider.</li>
<li>Blue ink makes it obvious the document was signed, rather than printed with a signature already on it.</li>
<li>Use the date option to add the signing date underneath.</li>
<li>For initials on every page, type your initials, then tap each page in turn.</li>
</ul>

<h2>Privacy</h2>
<p>Your signature and document never leave your browser. Nothing is stored after you close the page, so nobody can reuse your signature later. That's safer than services that keep a copy of your signature on their servers.</p>`,
  faqs: [
    ['How do I sign a PDF for free?', 'Draw or type your signature, open the PDF, tap where it goes and download. There is no account, watermark or limit.'],
    ['Can I sign a PDF on my phone?', 'Yes. Draw your signature with your finger, open the PDF from your phone’s files and tap where to place it.'],
    ['Is a signature added this way legally binding?', 'Simple electronic signatures are accepted for most everyday documents in most countries. Some documents, like wills and deeds, need witnessed or certified signatures.'],
    ['Can I add initials to every page?', 'Yes. Type your initials, then go through the pages and tap where each one goes.'],
    ['Is my signature stored anywhere?', 'No. Your signature and PDF stay in your browser and are gone when you close the page.'],
  ],
};
