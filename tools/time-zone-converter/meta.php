<?php
return [
    'name' => 'Time Zone Converter',
    'updated' => '2026-11-15',
    'category' => 'time',
    'order' => 1,
    'popular' => true,
    'icon' => 'earth',
    'keywords' => 'time zone converter, world clock meeting planner, est to gmt ist pkt converter, dst time difference',
    'aka' => ['World Clock & Meeting Planner', 'Global Time Difference Tool'],
    'short' => 'Convert a time between cities and find a meeting time for everyone.',
    'title' => 'Time Zone Converter – Cities, UTC & Meetings',
    'description' => 'Compare current times and schedule meetings across world cities with automatic Daylight Saving Time (DST) adjustments and time-offset math.',
    'related' => ['days-between-dates', 'online-timer', 'countdown', 'what-week-is-it'],
    'answer' => 'Pick the date and time, choose the time zone it’s in, then add the cities you want to compare. Each city shows its local time, date and difference, with <strong>daylight saving time handled automatically</strong>. The meeting planner below colours each hour green (working hours), yellow (early or late) or grey (night) for every city.',
    'article' => <<<'EOT_TF'
<h2>How to convert time between zones</h2>
<ol>
<li>Set the <strong>date and time</strong> you want to convert. It starts at the current time.</li>
<li>Choose the <strong>time zone</strong> that time is in. Type a city, a country’s capital or an abbreviation such as EST, PST, GMT or IST.</li>
<li>Add the cities to compare with <strong>Add a city</strong>. Remove one with ×.</li>
<li>Use the <strong>meeting planner</strong> to find an hour that falls in working hours for everyone.</li>
</ol>

<h2>Common time zone abbreviations</h2>
<div class="scroll"><table class="tbl"><thead><tr><th>Abbreviation</th><th>Name</th><th>UTC offset</th></tr></thead><tbody>
<tr><td>UTC / GMT</td><td>Coordinated Universal Time / Greenwich Mean Time</td><td>+0</td></tr>
<tr><td>EST / EDT</td><td>Eastern Time (New York, Toronto)</td><td>−5 / −4 in summer</td></tr>
<tr><td>CST / CDT</td><td>Central Time (Chicago, Mexico City)</td><td>−6 / −5 in summer</td></tr>
<tr><td>MST / MDT</td><td>Mountain Time (Denver)</td><td>−7 / −6 in summer</td></tr>
<tr><td>PST / PDT</td><td>Pacific Time (Los Angeles, Vancouver)</td><td>−8 / −7 in summer</td></tr>
<tr><td>BST</td><td>British Summer Time (London)</td><td>+1</td></tr>
<tr><td>CET / CEST</td><td>Central European Time (Paris, Berlin)</td><td>+1 / +2 in summer</td></tr>
<tr><td>GST</td><td>Gulf Standard Time (Dubai)</td><td>+4</td></tr>
<tr><td>PKT</td><td>Pakistan Standard Time</td><td>+5</td></tr>
<tr><td>IST</td><td>India Standard Time</td><td>+5:30</td></tr>
<tr><td>SGT</td><td>Singapore Time</td><td>+8</td></tr>
<tr><td>JST</td><td>Japan Standard Time</td><td>+9</td></tr>
<tr><td>AEST / AEDT</td><td>Australian Eastern Time (Sydney)</td><td>+10 / +11 in summer</td></tr>
</tbody></table></div>

<h2>Daylight saving time</h2>
<p>Many countries move their clocks forward one hour in spring and back in autumn, but not on the same dates. The US changes on the second Sunday of March and the first Sunday of November; Europe on the last Sundays of March and October; Australia’s south-east the other way round. For a few weeks each year the gap between New York and London is 4 hours instead of 5. The converter uses your browser’s up-to-date time zone database, so it always uses the rules in force on the date you choose.</p>

<h2>Scheduling across time zones</h2>
<ul>
<li>Put the time zone in every invitation (“3 pm EST / 8 pm GMT”).</li>
<li>US and Europe overlap best in the European afternoon (US morning).</li>
<li>Asia and the US barely overlap in office hours: one side usually takes an early or late call. Rotate who gets the awkward slot.</li>
</ul>
EOT_TF,
    'faqs' => [
        ['Does the converter handle daylight saving time?', 'Yes. It uses your browser’s time zone database, which knows each country’s daylight saving rules for any date, past or future.'],
        ['What is the time difference between EST and IST?', 'India (IST) is 10 hours 30 minutes ahead of US Eastern Standard Time, and 9 hours 30 minutes ahead when the US is on daylight time (EDT).'],
        ['Is GMT the same as UTC?', 'For everyday use, yes: both are UTC+0. UTC is the scientific time standard; GMT is also the name of the UK’s winter time zone. In summer the UK uses BST (UTC+1).'],
        ['How do I find a good meeting time?', 'Add everyone’s city and look at the meeting planner. Hours that are green for every city fall within 9 am–6 pm for all of them.'],
        ['Why are some time zones 30 or 45 minutes off?', 'Some countries chose offsets that fit their geography, such as India (UTC+5:30), Nepal (UTC+5:45) and parts of Australia (UTC+9:30).'],
    ],
];
