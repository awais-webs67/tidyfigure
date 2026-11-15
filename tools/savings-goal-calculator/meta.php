<?php
return [
    'name' => 'Savings Goal Calculator',
    'updated' => '2026-11-15',
    'category' => 'money',
    'order' => 3,
    'icon' => 'target',
    'appCategory' => 'FinanceApplication',
    'keywords' => 'savings goal calculator, monthly savings needed for target, emergency fund planner, deposit timeline',
    'short' => 'How much to save each month to reach a goal, or how long it will take.',
    'title' => 'Savings Goal Calculator – Monthly Plan & Time',
    'description' => 'Find how much to set aside monthly to hit a house deposit, car or emergency fund target by your deadline—or months needed at your current saving pace.',
    'related' => ['compound-interest-calculator', 'sip-calculator', 'inflation-calculator'],
    'answer' => 'Divide what you still need by the number of months, then let interest do some of the work. To save <strong>20,000 in 3 years</strong> starting from 2,000, at 4% interest, you need to put away about <strong>465 a month</strong>. Or enter what you can afford monthly to see when you\'ll hit your goal.',
    'sources' => [
        ['CFPB – Building an Emergency Savings Fund', 'https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/'],
        ['MoneyHelper – Savings Calculator & Goal Setting', 'https://www.moneyhelper.org.uk/en/savings'],
    ],
    'article' => <<<'EOT_TF'
<h2>Two ways to plan</h2>
<ul>
<li><strong>"I want to reach it by…"</strong> tells you the monthly amount needed to hit your goal by a deadline: a wedding, a house deposit, a car.</li>
<li><strong>"I can save each month…"</strong> tells you how long it will take at the amount you can afford.</li>
</ul>

<h2>The maths</h2>
<div class="formula">Monthly saving = (goal − current × (1 + i)^n) × i ÷ ((1 + i)^n − 1)

i = yearly rate ÷ 12, n = number of months</div>
<p>Without interest it's simply (goal − saved) ÷ months. Interest reduces the amount you need, a little for short goals and a lot for long ones.</p>

<h2>Common savings goals</h2>
<ul>
<li><strong>Emergency fund:</strong> 3–6 months of essential spending, kept in an easy-access account. Build this first.</li>
<li><strong>House deposit:</strong> often 5–20% of the price plus fees, usually a 3–5 year goal.</li>
<li><strong>Car, holiday or wedding:</strong> 1–3 year goals where saving beats borrowing.</li>
<li><strong>Education:</strong> longer goals where investing may suit better than cash.</li>
</ul>

<h2>Tips that make goals happen</h2>
<ul>
<li><strong>Automate it.</strong> Set a standing order on payday, so saving happens before spending.</li>
<li><strong>Give each goal its own account or "pot"</strong>, so you can see progress and aren't tempted to dip in.</li>
<li><strong>Round up:</strong> if the plan says 470, save 500; the buffer covers surprises.</li>
<li><strong>Use windfalls:</strong> tax refunds, bonuses and gifts can shorten the timeline dramatically.</li>
<li><strong>For goals over 5 years,</strong> consider investing rather than cash, and allow for inflation raising the target.</li>
</ul>

<h2>Ways to reach the goal sooner</h2>
<ul>
<li><strong>Automate it:</strong> set up a standing order on payday so the money moves before you can spend it.</li>
<li><strong>Use a separate account,</strong> ideally one that pays interest, so savings aren't mixed with everyday spending.</li>
<li><strong>Add windfalls:</strong> tax refunds, bonuses and gifts can cut months off the target.</li>
<li><strong>Round up:</strong> rounding the monthly amount up to the next 10 or 50 makes a noticeable difference over a year.</li>
</ul>

<h2>Short-Term Goals: Liquidity Matters More Than Chasing Yield</h2>
<p>For deposits needed inside 12–36 months, holding savings in FDIC/FSCS-insured high-yield savings or Treasury bills protects principal from stock market swings even if yields run slightly lower than equities.</p>
EOT_TF,
    'faqs' => [
        ['How much should I save each month to reach my goal?', 'Subtract what you have from your goal and divide by the months left, then reduce slightly for interest. The calculator does this exactly.'],
        ['How long will it take to save 10,000?', 'Saving 300 a month from zero at 4% interest takes about 2 years 8 months. Enter your own amount to check.'],
        ['Does interest make a big difference?', 'For short goals, not much. Over five or more years it can cover a meaningful part of the goal.'],
        ['Should I save or pay off debt first?', 'Build a small emergency fund first, then usually pay off high-interest debt before saving for other goals.'],
        ['Where should I keep my savings?', 'Short-term goals belong in safe, easy-access savings; long-term goals may suit investing.'],
        ['Does earning interest matter much on a one-year goal?', 'On a 12-month emergency fund target, consistent monthly deposits drive over 95% of your total—high-yield interest helps noticeably over three to ten years.'],
    ],
    'aka' => ['Target Savings Planner', 'Deposit & Emergency Fund Tool'],
];
