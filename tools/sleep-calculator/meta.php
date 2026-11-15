<?php
return [
    'name' => 'Sleep Calculator',
    'updated' => '2026-11-15',
    'category' => 'health',
    'order' => 9,
    'icon' => 'moon',
    'popular' => true,
    'appCategory' => 'HealthApplication',
    'keywords' => 'sleep calculator, bedtime calculator, sleep cycle calculator, when should i wake up, 90 minute sleep cycles',
    'short' => 'Best times to go to bed or wake up, based on 90-minute sleep cycles.',
    'title' => 'Sleep Calculator – Best Bedtime & Wake Times',
    'description' => 'Find ideal bedtimes and wake-up times aligned with 90-minute REM and deep-sleep cycles plus fall-asleep latency so you wake refreshed.',
    'related' => ['online-timer', 'water-intake-calculator', 'calorie-calculator'],
    'answer' => 'Sleep happens in cycles of about <strong>90 minutes</strong>. Waking at the end of a cycle, rather than in the middle of deep sleep, helps you feel more refreshed. To wake at 7:00, aim to be asleep by <strong>10:00 pm</strong> (six cycles, 9 hours) or <strong>11:30 pm</strong> (five cycles, 7.5 hours), and allow about 15 minutes to fall asleep.',
    'sources' => [
        ['Sleep Foundation: How much sleep do adults need?', 'https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need'],
    ],
    'article' => <<<'EOT_TF'
<h2>How sleep cycles work</h2>
<p>Each night you move through four or six cycles. Each cycle passes through light sleep, deep (slow-wave) sleep and REM sleep, where most dreaming happens. Early cycles contain more deep sleep, which restores the body; later cycles contain more REM, which matters for memory and mood.</p>
<p>Waking during deep sleep causes "sleep inertia": that heavy, confused feeling that can last half an hour. Waking near the end of a cycle, during light sleep, usually feels easier.</p>

<h2>How the times are calculated</h2>
<div class="formula">Bedtime  = wake-up time − (cycles × 90 min) − time to fall asleep
Wake-up  = bedtime + time to fall asleep + (cycles × 90 min)</div>
<p>The average adult takes 10–20 minutes to fall asleep. Change the setting if you know you're faster or slower.</p>

<h2>How much sleep do you need?</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Age</th><th class="n">Recommended per night</th></tr></thead>
<tbody>
<tr><td>Teenagers (14–17)</td><td class="n">8–10 hours</td></tr>
<tr><td>Adults (18–64)</td><td class="n">7–9 hours</td></tr>
<tr><td>Older adults (65+)</td><td class="n">7–8 hours</td></tr>
</tbody></table></div>
<p>Source: US National Sleep Foundation. Five cycles (7.5 hours) or six (9 hours) fit these ranges best.</p>

<h2>Cycles aren't exactly 90 minutes</h2>
<p>Real cycles vary between about 70 and 120 minutes, from person to person and through the night. Treat the times as a good starting point: if you still wake groggy, try shifting your bedtime 15 minutes earlier or later for a week.</p>

<h2>Tips for better sleep</h2>
<ul>
<li>Keep the same wake-up time every day, including weekends.</li>
<li>Get daylight in the morning; dim the lights and screens in the evening.</li>
<li>Avoid caffeine after early afternoon and big meals or alcohol close to bedtime.</li>
<li>Keep the bedroom cool, dark and quiet.</li>
</ul>

<h2>Why Waking Mid-Deep Sleep Causes Morning Grogginess</h2>
<p>Sleep inertia—the heavy, disoriented feeling after an alarm—spikes when your alarm interrupts Stage N3 slow-wave deep sleep. Timing sleep in five or six complete ~90-minute cycles (7.5 to 9 hours of actual sleep) aims for lighter sleep transitions, though individual cycle durations range between 80 and 110 minutes across the night.</p>

<h2>Wind-Down Latency &amp; Consistent Wake Anchors</h2>
<p>Locking a steady wake time within 30 minutes all week—including weekends—anchors your circadian rhythm far better than sleeping in late after one short night.</p>
EOT_TF,
    'faqs' => [
        ['What time should I go to bed to wake up at 6 am?', 'Aim to be asleep by 9:00 pm (6 cycles) or 10:30 pm (5 cycles). Add about 15 minutes to fall asleep: go to bed around 8:45 pm or 10:15 pm.'],
        ['How long is a sleep cycle?', 'About 90 minutes on average, although it varies from about 70 to 120 minutes.'],
        ['Is 6 hours of sleep enough?', 'For most adults, no. Six hours is four cycles; adults generally need 7–9 hours.'],
        ['Why do I feel tired after 8 hours of sleep?', 'You may be waking in the middle of a deep-sleep cycle. Try going to bed 15–30 minutes earlier or later.'],
        ['Does this work for naps?', 'Short naps of 20 minutes avoid deep sleep. A 90-minute nap covers one full cycle.'],
        ['How long does it normally take to fall asleep?', 'Healthy adults typically fall asleep in 10 to 20 minutes; our calculator includes a default 15-minute wind-down buffer you can match to your routine.'],
    ],
    'aka' => ['Bedtime Cycle Calculator', 'Wake Up Time Planner'],
];
