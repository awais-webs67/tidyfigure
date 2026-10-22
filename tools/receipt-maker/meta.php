<?php
// Receipt Maker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Receipt Maker',
  'category' => 'money',
  'order' => 22,
  'icon' => 'receipt',
  'use' => 'invoice-generator',
  'preset' => [
    'toText' => <<<'EOT_TF'
Maria Lopez
22 Park Road, Leeds LS6 2AB
EOT_TF,
    'doc' => 'Receipt',
    'num' => 'RCPT-000123',
    'to' => 'Received from',
    'due' => 'Paid on',
    'dueLabel' => 'Payment date',
    'days' => 0,
    'grand' => 'Amount paid',
    'notes' => <<<'EOT_TF'
Paid in full by card. Thank you!
Keep this receipt for your records. Returns accepted within 30 days with this receipt.
EOT_TF,
    'items' => [
      [
        'desc' => 'Yoga class pass (10 sessions)',
        'qty' => 1,
        'price' => 90,
        'tax' => 0,
      ],
      [
        'desc' => 'Yoga mat',
        'qty' => 1,
        'price' => 25,
        'tax' => 0,
      ],
    ],
  ],
  'appCategory' => 'BusinessApplication',
  'keywords' => 'receipt maker payment receipt template cash receipt generator rent receipt pdf small business',
  'short' => 'Make a payment receipt for a customer, with items, tax and payment details, as a PDF.',
  'title' => 'Free Receipt Maker: Create Payment Receipts as PDF or PNG',
  'description' => <<<'EOT_TF'
Create a clean payment receipt for your customers: your logo, items, tax, payment date and method. Download as PDF or PNG. Free, no sign-up, no watermark.
EOT_TF,
  'related' => ['invoice-generator', 'quotation-maker', 'vat-calculator'],
  'answer' => <<<'EOT_TF'
A receipt is proof that a customer has paid. Enter your business details, who paid, what they paid for and the payment date and method, then download the receipt as a <strong>PDF or PNG</strong> to email, print or send in a chat. Your business details can be remembered on this device for next time.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>What a receipt should include</h2>
<ul>
<li><strong>Your business name and contact details</strong>, and your tax number if you charge VAT, GST or sales tax.</li>
<li><strong>A receipt number</strong>. Number receipts in order so you can match them to payments in your records.</li>
<li><strong>The date of payment</strong>.</li>
<li><strong>Who paid</strong>: the customer's name (and address for business customers).</li>
<li><strong>What was paid for</strong>: each item or service with quantity and price.</li>
<li><strong>Tax</strong> shown separately if you charged it.</li>
<li><strong>The amount paid and how</strong>: cash, card, bank transfer or mobile payment. Write the method in the notes box.</li>
</ul>

<h2>When small businesses need receipts</h2>
<ul>
<li><strong>Cash payments</strong>, where there's no bank record. A receipt protects both you and the customer.</li>
<li><strong>Tutors, trainers and freelancers</strong> paid in advance for a block of sessions.</li>
<li><strong>Landlords</strong> recording rent paid (add the month in the description, such as "Rent for March").</li>
<li><strong>Market stalls, home bakers and craft sellers</strong> whose customers ask for proof of purchase.</li>
<li><strong>Customers claiming expenses</strong> from an employer, who usually need an itemised receipt.</li>
</ul>

<h2>Receipt or invoice?</h2>
<p>An <strong>invoice</strong> asks for payment and says when it's due. A <strong>receipt</strong> confirms the payment has been made. Many businesses send an invoice first and a receipt after payment; for instant sales, a receipt alone is enough. To bill a customer before they pay, use the <a href="/invoice-generator">invoice generator</a>. Your business details carry over between the two on this device.</p>

<h2>How the totals work</h2>
<div class="formula">Amount = quantity × unit price, for each line
Subtotal − discount + tax + other charges = Amount paid

Example: 1 × 90 + 1 × 25 = 115.00 paid</div>
<p>If your prices already include tax, you can leave the tax column at 0 and add a note such as "Prices include VAT at 20%". To show the tax inside a price, the <a href="/vat-calculator">VAT calculator</a> works it out: the tax in 120 at 20% is 120 × 20 ÷ 120 = 20.</p>

<h2>Keeping records</h2>
<p>Save a copy of every receipt you issue (the PDF is fine) and keep them in order of receipt number. Tax authorities in most countries expect businesses to keep sales records for several years, often between 5 and 7. Check the rules where you're registered.</p>

<h2>Use receipts honestly</h2>
<p>Only make receipts for payments you actually received. Making a receipt for a payment that didn't happen, for example to claim expenses or a refund, is fraud.</p>
<p>Your details are processed on your device and never uploaded.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I make a receipt?',
      <<<'EOT_TF'
Enter your business details and who paid, add the items with prices, set the payment date, write the payment method in the notes and download the receipt as a PDF or PNG.
EOT_TF,
    ],
    [
      'What must a receipt include?',
      <<<'EOT_TF'
Your business name, a receipt number, the payment date, what was paid for, the amount, any tax, and how it was paid.
EOT_TF,
    ],
    [
      'Can I make a cash receipt or rent receipt?',
      'Yes. Write "Paid in cash" in the notes, or describe the item as rent for a given month.',
    ],
    [
      'Is there a watermark?',
      'No. The receipt is free, has no watermark and needs no sign-up.',
    ],
    [
      'Are my details stored online?',
      <<<'EOT_TF'
No. Your business details can be remembered in this browser on this device only, and you can turn that off.
EOT_TF,
    ],
  ],
];
