<?php
// Morse Code Translator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Morse Code Translator',
  'updated' => '2026-10-26', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'convert',
  'order' => 20,
  'popular' => true,
  'icon' => 'radio',
  'keywords' => 'morse code translator text to morse morse to text morse code decoder morse alphabet sos in morse code morse code sound',
  'short' => 'Translate text to Morse code and back, and hear it played.',
  'title' => 'Morse Code Translator: Text to Morse and Back',
  'description' => <<<'EOT_TF'
Translate text to Morse code and Morse back to text instantly. Play it as sound or light, change the speed, download the audio and see the Morse alphabet.
EOT_TF,
  'related' => ['binary-translator', 'case-converter', 'fancy-text-generator', 'tone-generator'],
  'answer' => <<<'EOT_TF'
Type text to get Morse code, or type dots and dashes (<code>.</code> and <code>-</code>, letters separated by spaces and words by <code>/</code>) to get text: the direction is detected automatically. Click <strong>Play</strong> to hear it, <strong>Flash</strong> to see it as light, adjust the speed in words per minute, or download the sound as a WAV file.
EOT_TF,
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
EOT_TF,
  'faqs' => [
    [
      'How do I translate Morse code to text?',
      <<<'EOT_TF'
Type or paste the Morse code using . and - with a space between letters and / between words. The translator detects Morse and shows the text.
EOT_TF,
    ],
    [
      'What is SOS in Morse code?',
      <<<'EOT_TF'
SOS is ... --- ... (three dots, three dashes, three dots), sent without gaps between the letters as an emergency signal.
EOT_TF,
    ],
    [
      'Can I hear the Morse code?',
      <<<'EOT_TF'
Yes. Click Play to hear it, change the speed and pitch, or download it as a WAV sound file.
EOT_TF,
    ],
    [
      'How fast is Morse code?',
      <<<'EOT_TF'
Speed is measured in words per minute. Beginners start around 5–10 WPM; skilled operators send at 20–40 WPM.
EOT_TF,
    ],
    [
      'Which characters are supported?',
      <<<'EOT_TF'
Letters A–Z, numbers 0–9 and common punctuation such as . , ? ! / ( ) & : ; = + - _ " $ @ and the apostrophe.
EOT_TF,
    ],
  ],
];
