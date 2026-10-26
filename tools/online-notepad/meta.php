<?php
// Online Notepad: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Online Notepad',
  'category' => 'text',
  'order' => 2,
  'popular' => true,
  'icon' => 'notebook-pen',
  'keywords' => 'online notepad notepad online notes online text editor online no login autosave notes in browser',
  'short' => 'Write notes that save automatically in your browser. No login.',
  'title' => 'Online Notepad: Free, Saves Automatically, No Login',
  'description' => <<<'EOT_TF'
A clean online notepad that saves as you type, right in your browser. Keep several notes, see word count, open and download text files. No account needed.
EOT_TF,
  'related' => ['word-counter', 'remove-line-breaks', 'case-converter', 'pomodoro-timer'],
  'answer' => <<<'EOT_TF'
Just start typing: every note <strong>saves automatically</strong> in your browser as you write, so it’s still there when you come back, even after closing the tab. Create as many notes as you like, see the word and character count, open a .txt file, or download a note to keep it. No sign-up and nothing is uploaded.
EOT_TF,
  'article' => <<<'EOT_TF'
<h2>A notepad that remembers</h2>
<p>Use it for quick notes, to-do lists, drafts, meeting notes, or as a place to paste text and clean it up. Bookmark the page and your notes are waiting every time you open it.</p>
<ul>
<li><strong>Autosave:</strong> each change is saved a moment after you stop typing. The status line shows when it was last saved.</li>
<li><strong>Several notes:</strong> click <strong>New note</strong>; switch between notes in the list. A note’s first line becomes its title.</li>
<li><strong>Counts:</strong> words, characters and lines are shown live.</li>
<li><strong>Open and download:</strong> open a .txt, .md or .csv file to edit it, and download any note as a text file.</li>
<li><strong>Comfortable writing:</strong> change the text size and choose a plain or typewriter-style font.</li>
</ul>

<h2>Where are my notes stored?</h2>
<p>In your browser’s own storage on this device (localStorage). They are never sent to a server, which makes the notepad private, but it also means:</p>
<ul>
<li>Notes are only on this browser and device. They won’t appear on your phone if you wrote them on your laptop.</li>
<li>Clearing your browsing data, or using a private/incognito window, removes them.</li>
<li>For anything important, click <strong>Download</strong> to keep a copy as a file.</li>
</ul>

<h2>Keyboard shortcuts</h2>
<ul>
<li><strong>Ctrl/⌘ + S:</strong> save and download the current note as a .txt file.</li>
<li><strong>Tab:</strong> inserts a tab instead of leaving the editor.</li>
</ul>
EOT_TF,
  'faqs' => [
    [
      'Are my notes saved if I close the browser?',
      <<<'EOT_TF'
Yes. Notes are saved in your browser’s storage on this device and are still there when you return, unless you clear your browsing data.
EOT_TF,
    ],
    [
      'Do I need an account?',
      <<<'EOT_TF'
No. There’s no sign-up. Your notes stay on your device and are never uploaded.
EOT_TF,
    ],
    [
      'Can I access my notes on another device?',
      <<<'EOT_TF'
No, because they’re stored only in this browser. Download a note as a text file to move it to another device.
EOT_TF,
    ],
    [
      'Is there a size limit?',
      <<<'EOT_TF'
Browsers allow about 5 MB of storage per site, which is roughly a million words of plain text.
EOT_TF,
    ],
    [
      'Does it work offline?',
      <<<'EOT_TF'
Once the page has loaded, yes. Typing and saving happen entirely in your browser.
EOT_TF,
    ],
  ],
];
