<?php
// Keyboard Test: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Keyboard Test',
  'category' => 'device',
  'order' => 3,
  'popular' => true,
  'icon' => 'keyboard',
  'keywords' => 'keyboard test keyboard tester online key test check keys dead key stuck key rollover ghosting key code',
  'short' => 'Press keys to check each one works, with key codes and rollover.',
  'title' => 'Keyboard Test: Check Every Key Online, Free',
  'description' => <<<'EOT_TF'
Test your keyboard online: every key lights up when pressed, so dead or stuck keys stand out. Shows key codes and how many keys work at once (rollover).
EOT_TF,
  'related' => ['cps-test', 'typing-speed-test', 'what-is-my-screen-resolution', 'mic-test'],
  'answer' => <<<'EOT_TF'
Press each key on your keyboard. Keys turn <strong>orange</strong> while held and <strong>green</strong> once they’ve worked, so a key that stays grey is dead or not recognised. The panel shows each key’s name and code, and how many keys you can hold down at once (rollover), which matters for gaming.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>How to test your keyboard</h2>
<ol>
<li>Press every key, one at a time. Each key turns green after it works.</li>
<li>Look for keys that stay grey: those didn’t register. Keys that stay orange after you let go are stuck.</li>
<li>To test rollover, hold several keys at the same time (for example W, A, S, D and Space) and watch the <strong>Held now</strong> count.</li>
<li>Click <strong>Reset</strong> to start again.</li>
</ol>
<p>While you test, most keys don’t trigger their usual browser actions (so Space won’t scroll and F5 won’t reload). Shortcuts with Ctrl or ⌘ still work.</p>

<h2>Dead key, stuck key or ghosting?</h2>
<ul>
<li><strong>Dead key:</strong> nothing happens when you press it. Often dirt or a crumb under the keycap; on a mechanical keyboard the switch may be faulty.</li>
<li><strong>Stuck or chattering key:</strong> it stays pressed or types twice. Cleaning under the keycap often fixes it.</li>
<li><strong>Ghosting:</strong> pressing several keys together makes one of them not register. Cheaper keyboards can only report 2–3 keys at once in some combinations.</li>
<li><strong>Rollover (KRO):</strong> the number of keys a keyboard can report at the same time. “6KRO” means six; “NKRO” means all of them, common on gaming keyboards.</li>
</ul>

<h2>Key codes for developers</h2>
<p>For each key the panel shows <code>event.key</code> (the character or name, which depends on your layout), <code>event.code</code> (the physical key position, the same on any layout) and the older <code>keyCode</code> number. The keyboard on screen uses a US layout, but every key is matched by its position, so it works for UK, German, French and other layouts too.</p>

<h2>Some keys never show up</h2>
<p>A few keys are handled by the computer before the browser sees them: the <strong>Fn</strong> key, media and brightness keys, and some laptop shortcut keys. Print Screen and the Windows key may also be caught by the system. That doesn’t mean they’re broken.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I test if all my keyboard keys work?',
      <<<'EOT_TF'
Press each key on this page. Keys turn green once they work; any key that stays grey isn’t registering.
EOT_TF,
    ],
    [
      'Why doesn’t the Fn key light up?',
      <<<'EOT_TF'
The Fn key is handled inside the keyboard itself and is never sent to the computer, so no website can detect it. Media and brightness keys are often the same.
EOT_TF,
    ],
    [
      'What is keyboard rollover?',
      <<<'EOT_TF'
Rollover is how many keys a keyboard can register at the same time. Hold several keys down and the Held now number shows how many your keyboard reports.
EOT_TF,
    ],
    [
      'Does it work with laptop and non-US keyboards?',
      <<<'EOT_TF'
Yes. Keys are matched by their physical position, so laptop keyboards and UK, German, French or other layouts all work.
EOT_TF,
    ],
    [
      'Can I test a keyboard on a phone?',
      <<<'EOT_TF'
You need a physical keyboard. On a tablet or phone, connect a Bluetooth or USB keyboard and the test works the same way.
EOT_TF,
    ],
  ],
];
