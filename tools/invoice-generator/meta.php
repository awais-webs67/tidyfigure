<?php
// Invoice Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Invoice Generator',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'money',
  'order' => 11,
  'icon' => 'file-spreadsheet',
  'popular' => true,
  'appCategory' => 'BusinessApplication',
  'keywords' => 'free invoice generator invoice template pdf freelancer invoice maker vat invoice',
  'aka' => ['invoice maker', 'free invoice template', 'bill generator'], // other names people search for
  'short' => 'Create a professional invoice with tax, discount and your logo, as a PDF.',
  'title' => 'Free Invoice Generator: Create & Download PDF Invoices',
  'description' => <<<'EOT_TF'
Make professional invoices online: your logo, line items, VAT or sales tax, discounts and payment details. Download as PDF. No sign-up, no watermark, free.
EOT_TF,
  'related' => ['vat-calculator', 'profit-margin-calculator', 'salary-converter'],
  'answer' => <<<'EOT_TF'
Fill in your business and client details, add line items with quantity, price and tax rate, and download a clean <strong>PDF invoice</strong>. Totals, discounts and tax are calculated for you, and your business details can be remembered on this device for next time. There's <strong>no sign-up and no watermark</strong>.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>What every invoice should include</h2>
<ul>
<li><strong>The word "Invoice"</strong> and a <strong>unique invoice number</strong>, in sequence (INV-001, INV-002…).</li>
<li><strong>Invoice date</strong> and <strong>due date</strong> (or payment terms like "14 days").</li>
<li><strong>Your business name, address and contact details</strong>, plus your tax registration number if you're registered for VAT, GST or sales tax.</li>
<li><strong>Your client's name and address.</strong></li>
<li><strong>A clear description of each item or service</strong>, with quantity, unit price and line total.</li>
<li><strong>Subtotal, tax (rate and amount) and total due.</strong></li>
<li><strong>How to pay:</strong> bank details, payment link or accepted methods.</li>
</ul>
<p>Requirements vary by country. Tax-registered businesses often must show extra details, such as each line's tax rate, so check your tax authority's rules.</p>

<h2>Tips to get paid faster</h2>
<ul>
<li><strong>Send it promptly,</strong> ideally the day the work is delivered.</li>
<li><strong>Use short, clear terms:</strong> "Due within 14 days" works better than "Net 30".</li>
<li><strong>Make paying easy:</strong> include full bank details or a payment link.</li>
<li><strong>Itemise the work,</strong> so the client's accounts team can approve it without questions.</li>
<li><strong>Follow up politely</strong> on the due date, and again a week later.</li>
</ul>

<h2>Tax on invoices</h2>
<p>Enter the tax rate on each line (for example 20% VAT, 18% GST, or 0 for exempt items). The invoice groups tax by rate and applies any discount before tax, which is how most tax systems expect it. Not registered for tax? Leave the rate at 0.</p>

<h2>Your data stays with you</h2>
<p>The invoice is built and turned into a PDF in your browser; nothing is uploaded. If you tick "Remember my business details", your name, address, notes and currency are saved only in this browser on this device, so you don't retype them next time. Client details aren't saved.</p>

<p>The PDF is an image of the invoice, so it looks identical everywhere and supports every language and currency symbol. Keep your own record of each invoice number you issue.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I make an invoice for free?',
      <<<'EOT_TF'
Enter your details, your client’s details and the items, then press Download PDF. There is no sign-up or watermark.
EOT_TF,
    ],
    [
      'What should be on an invoice?',
      'A unique number, dates, both parties’ details, itemised charges, tax, the total due and how to pay.',
    ],
    [
      'Can I add VAT or GST to my invoice?',
      'Yes. Enter the tax rate on each line; tax is calculated and shown by rate.',
    ],
    [
      'Can I add my logo?',
      'Yes. Upload your logo and it appears at the top of the invoice.',
    ],
    [
      'Is my invoice data stored online?',
      <<<'EOT_TF'
No. Invoices are created in your browser. Business details are only remembered on your device if you choose.
EOT_TF,
    ],
  ],
];
