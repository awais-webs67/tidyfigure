<?php
// Group Expense Splitter: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Group Expense Splitter',
  'updated' => '2026-10-26', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'life',
  'order' => 4,
  'icon' => 'users',
  'short' => 'Who owes whom after a trip or dinner? Settle up in the fewest payments.',
  'title' => 'Group Expense Splitter: Who Owes Whom, Fewest Payments',
  'description' => <<<'EOT_TF'
Split shared trip, holiday or dinner costs and see exactly who owes whom. Settles a group in the fewest payments, with uneven shares. No app or sign-up.
EOT_TF,
  'related' => ['road-trip-cost-splitter', 'rent-split-calculator', 'unit-price-calculator'],
  'answer' => <<<'EOT_TF'
Add up everything the group spent, work out each person's fair share, and subtract it from what they actually paid. People with a positive balance get money back; people with a negative balance pay. This calculator then pairs them up so the group settles in <strong>at most one payment fewer than the number of people</strong>.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How splitting group expenses works</h2>
<p>After a trip, a shared holiday house or a big dinner, payments are usually messy. One person booked the accommodation, another paid for groceries, someone covered the taxi, and a couple of people paid for nothing. Rather than tracking who owes whom for each purchase, it's simpler to look at the totals.</p>
<ol>
<li><strong>Total spent:</strong> add up everything every person paid.</li>
<li><strong>Fair share:</strong> divide the total by the number of shares. A person with 2 shares (for example a couple entered as one name) owes twice as much.</li>
<li><strong>Balance:</strong> what each person paid minus their fair share.</li>
<li><strong>Settle up:</strong> people with negative balances pay people with positive balances.</li>
</ol>
<div class="formula">Fair share = total spent × person's shares ÷ all shares
Balance    = amount paid − fair share
Positive balance → gets money back
Negative balance → pays money</div>

<h2>Fewer payments</h2>
<p>If four friends each paid for different things, settling every purchase separately could mean a dozen small bank transfers. Netting everything first means the group never needs more than three payments (one fewer than the number of people), and often fewer. The calculator matches the person who owes the most with the person who is owed the most, then repeats until everyone is square.</p>
<p>The amounts are calculated in whole cents and any leftover cent from rounding is handed out fairly, so the payments always add up exactly to the total.</p>

<h2>Worked example</h2>
<p>Four friends spend 200 on a weekend away. Ana paid 120 for the cabin, Ben paid 45 for food, Dev paid 35 for fuel, and Chloe paid nothing. Each fair share is 200 ÷ 4 = 50.</p>
<ul>
<li>Ana: 120 − 50 = <strong>+70</strong> (is owed 70)</li>
<li>Ben: 45 − 50 = <strong>−5</strong></li>
<li>Chloe: 0 − 50 = <strong>−50</strong></li>
<li>Dev: 35 − 50 = <strong>−15</strong></li>
</ul>
<p>Settling up takes three payments: Chloe pays Ana 50, Dev pays Ana 15 and Ben pays Ana 5.</p>

<h2>Using shares for uneven splits</h2>
<ul>
<li><strong>A couple paying together:</strong> enter them as one person with 2 shares.</li>
<li><strong>Someone who joined for half the trip:</strong> give them 0.5 shares.</li>
<li><strong>Someone who paid but didn't take part</strong> (for example, they bought tickets for others): give them 0 shares, and they'll get everything back.</li>
<li><strong>Kids:</strong> many families count a child as 0.5 shares for food costs.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'How do I calculate who owes whom in a group?',
      <<<'EOT_TF'
Add up everything everyone paid, divide by the number of people to get each fair share, and subtract that from what each person paid. Negative balances pay positive balances until everyone reaches zero.
EOT_TF,
    ],
    [
      'What is the minimum number of payments to settle a group?',
      <<<'EOT_TF'
Netting totals first means a group of n people never needs more than n − 1 payments. Sometimes it needs fewer, for example when two people owe exactly what two others are owed.
EOT_TF,
    ],
    [
      'How do I split costs when some people should pay more?',
      <<<'EOT_TF'
Use shares. Give a couple 2 shares, someone who came for half the trip 0.5 shares, and someone who didn’t take part 0 shares. The fair share is the total multiplied by that person’s share of all shares.
EOT_TF,
    ],
    [
      'Do I need to enter every receipt?',
      <<<'EOT_TF'
No. You only need each person’s total spending. Add up each person’s receipts first and enter one number per person.
EOT_TF,
    ],
    [
      'Can I use this for different currencies?',
      <<<'EOT_TF'
Convert everything to one currency first, then enter the totals. The calculator works with any currency because it only uses the numbers.
EOT_TF,
    ],
  ],
];
