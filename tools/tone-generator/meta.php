<?php
// Tone Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Tone Generator',
  'updated' => '2026-10-26', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'media',
  'order' => 30,
  'icon' => 'audio-waveform',
  'keywords' => 'tone generator frequency generator online hz test sound sine wave generator 440 hz hearing test speaker test test tone',
  'short' => 'Play a pure tone at any frequency, from 1 Hz to 22,000 Hz.',
  'title' => 'Tone Generator: Play Any Frequency Online, Free',
  'description' => <<<'EOT_TF'
Play a pure tone at any frequency from 1 to 22,000 Hz in sine, square, triangle or sawtooth. Sweep the range to test your speakers or your hearing.
EOT_TF,
  'related' => ['mic-test', 'audio-cutter', 'morse-code-translator', 'voice-recorder'],
  'answer' => <<<'EOT_TF'
Press <strong>Play</strong> and drag the slider, or type an exact frequency in hertz. Choose the wave shape, volume and left/right balance, use the presets (such as 440 Hz for tuning) and step up or down by semitones. <strong>Sweep</strong> glides from low to high so you can test speakers or find your hearing range.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>Uses for a tone generator</h2>
<ul>
<li><strong>Tuning:</strong> 440 Hz is the A above middle C (A4), the standard tuning pitch.</li>
<li><strong>Speaker and headphone tests:</strong> check each channel with the balance control, find rattles with a slow sweep, and see how low your subwoofer goes.</li>
<li><strong>Hearing range:</strong> young people hear roughly 20 Hz to 20,000 Hz; the top limit falls with age (often 12,000–15,000 Hz by middle age).</li>
<li><strong>Science and teaching:</strong> demonstrate pitch, beats and wave shapes.</li>
<li><strong>Room acoustics:</strong> find frequencies that boom or vanish in a room.</li>
</ul>

<h2>Wave shapes</h2>
<ul>
<li><strong>Sine:</strong> a pure tone with a single frequency. Use this for testing.</li>
<li><strong>Square:</strong> hollow and buzzy, rich in odd harmonics (like old video games).</li>
<li><strong>Triangle:</strong> softer than square, between a sine and a square.</li>
<li><strong>Sawtooth:</strong> bright and brassy, with every harmonic.</li>
</ul>

<h2>Frequency guide</h2>
<div class="scroll"><table class="tbl"><thead><tr><th>Range</th><th>What it sounds like</th></tr></thead><tbody>
<tr><td>20–60 Hz</td><td>Sub-bass: felt more than heard</td></tr>
<tr><td>60–250 Hz</td><td>Bass: kick drums, mains hum (50 or 60 Hz)</td></tr>
<tr><td>250–2,000 Hz</td><td>Mids: most of the human voice</td></tr>
<tr><td>2,000–6,000 Hz</td><td>Presence: where hearing is most sensitive</td></tr>
<tr><td>6,000–20,000 Hz</td><td>Treble and “air”: cymbals, sibilance</td></tr>
</tbody></table></div>

<h2>Protect your hearing and speakers</h2>
<p>Start with the volume low, especially with headphones: pure tones can sound much louder than music at the same setting. Very low and very high frequencies at high volume can also damage small speakers. Your device and speakers limit the range you’ll hear; many laptop speakers produce little below 150 Hz.</p>
EOT_TF,
  'faqs' => [
    [
      'What frequency can humans hear?',
      <<<'EOT_TF'
Roughly 20 Hz to 20,000 Hz for young people. The upper limit falls with age, often to 12,000–15,000 Hz by middle age.
EOT_TF,
    ],
    [
      'What is 440 Hz?',
      <<<'EOT_TF'
It’s the note A above middle C (A4), the standard pitch orchestras and instruments tune to.
EOT_TF,
    ],
    [
      'Why can’t I hear very low or high tones?',
      <<<'EOT_TF'
Small speakers and laptop speakers can’t reproduce very low bass, and high tones may be beyond your hearing or your headphones’ range.
EOT_TF,
    ],
    [
      'Can I test left and right speakers?',
      <<<'EOT_TF'
Yes. Move the balance slider fully left or right to play the tone through one channel only.
EOT_TF,
    ],
    [
      'Is it safe to listen to test tones?',
      <<<'EOT_TF'
Yes at a sensible volume. Start low and turn it up slowly, especially with headphones, as pure tones can be surprisingly loud.
EOT_TF,
    ],
  ],
];
