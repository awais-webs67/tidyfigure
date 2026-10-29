<?php
// Moon Phase Today: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Moon Phase Today',
  'updated' => '2026-10-26', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'time',
  'order' => 4,
  'popular' => true,
  'icon' => 'moon',
  'keywords' => 'moon phase today moon tonight full moon next full moon new moon moon calendar lunar phase moon illumination',
  'short' => 'Tonight’s moon phase, the next full and new moon, and a moon calendar.',
  'title' => 'Moon Phase Today: Tonight’s Moon and Calendar',
  'description' => <<<'EOT_TF'
See today’s moon phase, how much of the moon is lit and its age, plus the next full moon, new moon and quarters and a monthly moon calendar.
EOT_TF,
  'related' => ['countdown', 'time-zone-converter', 'what-week-is-it', 'days-between-dates'],
  'answer' => <<<'EOT_TF'
The picture shows how the moon looks tonight, with the <strong>phase name</strong>, the <strong>percentage lit</strong> and its age in days since the last new moon. Below are the exact dates and times of the next <strong>full moon</strong>, <strong>new moon</strong> and quarters in your time zone, and a calendar for the whole month. Pick any date to see its moon.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>The eight phases of the moon</h2>
<div class="scroll"><table class="tbl"><thead><tr><th>Phase</th><th>What you see</th><th>Age (days)</th></tr></thead><tbody>
<tr><td>New moon</td><td>Dark, between Earth and Sun</td><td>0</td></tr>
<tr><td>Waxing crescent</td><td>Thin sliver, growing</td><td>1–6</td></tr>
<tr><td>First quarter</td><td>Half lit (right side in the northern hemisphere)</td><td>7</td></tr>
<tr><td>Waxing gibbous</td><td>More than half, growing</td><td>8–13</td></tr>
<tr><td>Full moon</td><td>Fully lit, rises at sunset</td><td>14–15</td></tr>
<tr><td>Waning gibbous</td><td>More than half, shrinking</td><td>16–21</td></tr>
<tr><td>Last quarter</td><td>Half lit (left side in the northern hemisphere)</td><td>22</td></tr>
<tr><td>Waning crescent</td><td>Thin sliver before dawn</td><td>23–29</td></tr>
</tbody></table></div>
<p>A full cycle, the <strong>synodic month</strong>, takes 29.53 days on average. In the southern hemisphere the moon appears upside down compared with the north, so the lit side is reversed; use the hemisphere switch to match what you see.</p>

<h2>How accurate is it?</h2>
<p>Dates and times of new moons, full moons and quarters are calculated with the standard astronomical method published by Jean Meeus (Astronomical Algorithms), accurate to within a few minutes. They are shown in your own time zone, which is why a full moon can fall on different calendar dates in different countries.</p>

<h2>Full moon names</h2>
<p>Traditional North American names for each month’s full moon: Wolf Moon (January), Snow Moon (February), Worm Moon (March), Pink Moon (April), Flower Moon (May), Strawberry Moon (June), Buck Moon (July), Sturgeon Moon (August), Harvest or Corn Moon (September), Hunter’s Moon (October), Beaver Moon (November) and Cold Moon (December). A second full moon in one calendar month is called a <strong>Blue Moon</strong>.</p>

<h2>Why people follow the moon</h2>
<ul>
<li><strong>Stargazing and astrophotography:</strong> the days around a new moon have the darkest skies.</li>
<li><strong>Fishing and tides:</strong> spring tides, the highest and lowest, come near new and full moons.</li>
<li><strong>Gardening:</strong> some gardeners plant by the moon’s phase.</li>
<li><strong>Religious calendars:</strong> Islamic months begin with the new crescent, and Easter and many festivals follow the full moon.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'What is the moon phase tonight?',
      <<<'EOT_TF'
It’s shown at the top of this page, worked out for today in your time zone, with the percentage of the moon that is lit.
EOT_TF,
    ],
    [
      'When is the next full moon?',
      <<<'EOT_TF'
The next full moon’s date and time, in your time zone, is listed under the moon picture along with the next new moon and quarters.
EOT_TF,
    ],
    [
      'How long is a lunar cycle?',
      <<<'EOT_TF'
About 29.53 days from one new moon to the next. That’s why most months have one full moon and occasionally two.
EOT_TF,
    ],
    [
      'What is a blue moon?',
      <<<'EOT_TF'
Usually, the second full moon in a single calendar month. It happens roughly every two to three years.
EOT_TF,
    ],
    [
      'Why is the moon picture reversed in Australia?',
      <<<'EOT_TF'
From the southern hemisphere you see the moon upside down compared with the north, so the lit side is on the other side. Switch the hemisphere to match your view.
EOT_TF,
    ],
  ],
];
