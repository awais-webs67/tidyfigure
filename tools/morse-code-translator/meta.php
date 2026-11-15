<?php
return [
    'name' => 'Morse Code Translator',
    'updated' => '2026-11-15',
    'category' => 'convert',
    'order' => 20,
    'popular' => true,
    'icon' => 'radio',
    'keywords' => 'morse code translator, text to morse code, morse to text decoder, morse code audio player, international morse alphabet',
    'short' => 'Translate text to Morse code and back, and hear it played.',
    'title' => 'Morse Code Translator – Text to Audio & Flash',
    'description' => 'Convert text to International Morse code dots and dashes, play adjustable WPM audio tones, flash a visual beacon or download a WAV file locally.',
    'related' => ['binary-translator', 'case-converter', 'fancy-text-generator', 'tone-generator'],
    'answer' => 'Type text to get Morse code, or type dots and dashes (<code>.</code> and <code>-</code>, letters separated by spaces and words by <code>/</code>) to get text: the direction is detected automatically. Click <strong>Play</strong> to hear it, <strong>Flash</strong> to see it as light, adjust the speed in words per minute, or download the sound as a WAV file.',
    'article' => <<<'EOT_TF'
<h2>How Morse code works</h2>
<p>Morse code writes each letter and number as a pattern of short signals (dots, “dit”) and long signals (dashes, “dah”). The timing is what makes it readable:</p>
<ul>
<li>A dash is three times as long as a dot.</li>
<li>The gap between dots and dashes in one letter is one dot long.</li>
<li>The gap between letters is three dots; between words, seven.</li>
</ul>
<p>Speed is measured in words per minute (WPM), based on the word “PARIS”. Beginners copy at 5–10 WPM; experienced radio operators at 20–30 WPM or more.</p>

<h2>Morse code alphabet</h2>
<div class="scroll"><table class="tbl"><tbody>
<tr><td>A ·−</td><td>B −···</td><td>C −·−·</td><td>D −··</td><td>E ·</td><td>F ··−·</td></tr>
<tr><td>G −−·</td><td>H ····</td><td>I ··</td><td>J ·−−−</td><td>K −·−</td><td>L ·−··</td></tr>
<tr><td>M −−</td><td>N −·</td><td>O −−−</td><td>P ·−−·</td><td>Q −−·−</td><td>R ·−·</td></tr>
<tr><td>S ···</td><td>T −</td><td>U ··−</td><td>V ···−</td><td>W ·−−</td><td>X −··−</td></tr>
<tr><td>Y −·−−</td><td>Z −−··</td><td>1 ·−−−−</td><td>2 ··−−−</td><td>3 ···−−</td><td>4 ····−</td></tr>
<tr><td>5 ·····</td><td>6 −····</td><td>7 −−···</td><td>8 −−−··</td><td>9 −−−−·</td><td>0 −−−−−</td></tr>
</tbody></table></div>

<h2>SOS and famous Morse messages</h2>
<ul>
<li><strong>SOS:</strong> <code>... --- ...</code> sent as one continuous signal. It was chosen because it’s easy to send and recognise, not because it stands for “save our souls”.</li>
<li><strong>I love you:</strong> <code>.. / .-.. --- ...- . / -.-- --- ..-</code></li>
<li><strong>Hello:</strong> <code>.... . .-.. .-.. ---</code></li>
</ul>

<h2>Tips for learning Morse</h2>
<p>Learn letters by their sound rather than by counting dots and dashes. Start with E (·), T (−), A, N, I and M, play them at a fast character speed with longer gaps, and slowly add letters. Saying “di-dah” for A helps more than picturing “·−”.</p>

<h2>International Morse Timing Rules (ITU Standard)</h2>
<p>Clean Morse transmission depends on strict relative unit timing rather than fixed speed: a <strong>dot</strong> lasts 1 unit, a <strong>dash</strong> lasts 3 units, the pause between parts of the same letter is 1 unit, the gap between letters is 3 units, and the space between words is 7 units.</p>
<p>Beginners often practice with Farnsworth timing — sending each character briskly (around 15–18 WPM) while widening pauses between characters so the ear recognises whole rhythm shapes (like <em>dit-dah</em> for A) instead of counting individual dots and dashes.</p>

<h2>Why Morse Remains Useful Offline &amp; in Aviation</h2>
<p>Radio beacons (VOR and NDB navigation aids), amateur CW contacts and visual emergency signalling still rely on short-and-long pulses because even a faint, narrow signal cuts through noise far better than spoken voice.</p>
EOT_TF,
    'faqs' => [
        ['How do I translate Morse code to text?', 'Type or paste the Morse code using . and - with a space between letters and / between words. The translator detects Morse and shows the text.'],
        ['What is SOS in Morse code?', 'SOS is ... --- ... (three dots, three dashes, three dots), sent without gaps between the letters as an emergency signal.'],
        ['Can I hear the Morse code?', 'Yes. Click Play to hear it, change the speed and pitch, or download it as a WAV sound file.'],
        ['How fast is Morse code?', 'Speed is measured in words per minute. Beginners start around 5–10 WPM; skilled operators send at 20–40 WPM.'],
        ['Which characters are supported?', 'Letters A–Z, numbers 0–9 and common punctuation such as . , ? ! / ( ) & : ; = + - _ " $ @ and the apostrophe.'],
        ['Can you download translated Morse code as audio?', 'Yes. Generate any phrase, pick your speed in words per minute and tone pitch, and save a WAV audio track directly from your browser.'],
    ],
    'aka' => ['Morse Code Decoder', 'Text to Morse Audio'],
];
