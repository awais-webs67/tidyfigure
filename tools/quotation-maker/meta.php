<?php
// Quotation Maker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Quotation Maker',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'money',
  'order' => 21,
  'icon' => 'file-pen-line',
  'use' => 'invoice-generator',
  'preset' => [
    'toText' => <<<'EOT_TF'
Mr & Mrs Patel
8 Oak Avenue, Manchester M20 6RT
EOT_TF,
    'doc' => 'Quotation',
    'num' => 'QUO-2026-007',
    'to' => 'Quote for',
    'due' => 'Valid until',
    'dueLabel' => 'Valid until',
    'days' => 30,
    'grand' => 'Quoted total',
    'notes' => <<<'EOT_TF'
This quotation is valid for 30 days from the date above.
Prices include all materials and labour listed. Any extra work will be quoted separately.
To accept, reply to this email or sign and return a copy.
EOT_TF,
    'items' => [
      [
        'desc' => 'Kitchen wall tiling (m²)',
        'qty' => 14,
        'price' => 38,
        'tax' => 20,
      ],
      [
        'desc' => 'Tiles and adhesive',
        'qty' => 1,
        'price' => 420,
        'tax' => 20,
      ],
      [
        'desc' => 'Removal of old tiles',
        'qty' => 1,
        'price' => 180,
        'tax' => 20,
      ],
    ],
  ],
  'appCategory' => 'BusinessApplication',
  'keywords' => 'quotation maker quote template estimate generator price quote pdf free quotation format',
  'short' => 'Create a professional price quote or estimate with tax and validity date, as a PDF.',
  'title' => 'Free Quotation Maker: Create Price Quotes & Estimates (PDF)',
  'description' => <<<'EOT_TF'
Make a professional quotation or estimate online: your logo, line items, tax, discount and a valid-until date. Download as a PDF. Free, no sign-up.
EOT_TF,
  'related' => ['invoice-generator', 'receipt-maker', 'profit-margin-calculator'],
  'answer' => <<<'EOT_TF'
A quotation tells a customer what a job will cost <strong>before</strong> they agree to it. Enter your business and customer details, add each item with quantity, price and tax, set how long the price is valid, and download a clean <strong>PDF quote</strong>. When the customer accepts, use the same details to make the invoice.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>What to put on a quotation</h2>
<ul>
<li><strong>Your business name and contact details</strong>, plus your tax number if you're registered for VAT or GST.</li>
<li><strong>The customer's name and address</strong>, so it's clear who the price is for.</li>
<li><strong>A quote number and date</strong>. Numbering quotes (QUO-001, QUO-002…) makes them easy to find when the customer replies weeks later.</li>
<li><strong>A valid-until date</strong>. Material prices change, so most quotes are valid for 14 to 30 days.</li>
<li><strong>Itemised costs</strong>: each task or product on its own line with quantity and unit price. Customers trust a breakdown more than a single number.</li>
<li><strong>Tax</strong> shown separately, and the total including tax.</li>
<li><strong>Terms</strong>: what's included, what isn't, deposit and payment terms, and how to accept.</li>
</ul>

<h2>Quote, estimate or invoice?</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Document</th><th>When</th><th>Is the price fixed?</th></tr></thead>
<tbody>
<tr><td>Estimate</td><td>Before the job, when the work is uncertain</td><td>No, it's a best guess</td></tr>
<tr><td>Quotation</td><td>Before the job, for clearly defined work</td><td>Yes, if accepted within the validity period</td></tr>
<tr><td>Invoice</td><td>After the work or delivery</td><td>Yes, it's a request for payment</td></tr>
<tr><td>Receipt</td><td>After payment</td><td>Proof that it was paid</td></tr>
</tbody></table></div>
<p>To make an estimate rather than a fixed quote, change the notes to say the price is an estimate and may change. When the customer accepts, create the invoice with the <a href="/invoice-generator">invoice generator</a>, and after they pay, give them a receipt with the <a href="/receipt-maker">receipt maker</a>. Your business details are remembered on this device, so you won't need to type them again.</p>

<h2>How totals are worked out</h2>
<div class="formula">Line amount = quantity × unit price
Subtotal    = sum of line amounts
Discount    = subtotal × discount %
Tax         = (line amount − its share of the discount) × tax rate
Total       = subtotal − discount + tax + shipping/other

Example: 14 m² × 38 = 532; + 420 + 180 = 1,132 subtotal
Tax at 20% = 226.40 → quoted total 1,358.40</div>

<h2>Pricing a quote so you make money</h2>
<p>Add up your costs first: materials, hours (at a rate that covers your overheads, not just your wage), travel and equipment. Then add your margin. Many trades add 10–20% for contingency on jobs where surprises are common, such as old buildings. Use the <a href="/profit-margin-calculator">profit margin calculator</a> to check you're not confusing markup with margin: a 25% markup is only a 20% margin.</p>

<h2>Tips that win more jobs</h2>
<ul>
<li>Send the quote quickly, ideally within a day or two of the visit.</li>
<li>Describe each item in the customer's words ("replace kitchen tap") rather than trade jargon.</li>
<li>Offer options where it helps, such as a basic and a premium finish, as separate quotes.</li>
<li>Add your logo and a matching colour for a professional look.</li>
<li>Follow up a few days before the quote expires.</li>
</ul>
<p>Everything you type stays on your device. Nothing is uploaded, and the PDF has no watermark.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I make a quotation?',
      <<<'EOT_TF'
Enter your details and your customer’s, add each item with quantity, price and tax, set the valid-until date, and download the quotation as a PDF.
EOT_TF,
    ],
    [
      'How long should a quote be valid?',
      'Usually 14 to 30 days. Use a shorter period when material prices change quickly.',
    ],
    [
      'What is the difference between a quote and an estimate?',
      <<<'EOT_TF'
A quote is a fixed price for defined work if accepted in time. An estimate is an approximate price that may change.
EOT_TF,
    ],
    [
      'Can I turn the quote into an invoice?',
      <<<'EOT_TF'
Yes. Open the invoice generator: your business details are remembered on this device, so you only need to add the items again.
EOT_TF,
    ],
    [
      'Is the quotation maker free?',
      'Yes. It is free with no sign-up and no watermark, and your details never leave your device.',
    ],
  ],
];
