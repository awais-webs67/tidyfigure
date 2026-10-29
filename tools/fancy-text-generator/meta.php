<?php
// Fancy Text Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Fancy Text Generator',
  'updated' => '2026-10-22', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'text',
  'order' => 4,
  'icon' => 'sparkles',
  'popular' => true,
  'keywords' => 'stylish font generator cool text instagram bio fonts copy paste bold italic gothic',
  'short' => 'Turn text into 𝐛𝐨𝐥𝐝, 𝓈𝒸𝓇𝒾𝓅𝓉, 𝔤𝔬𝔱𝔥𝔦𝔠 and 25+ copy-and-paste styles.',
  'title' => 'Fancy Text Generator: Stylish Fonts to Copy and Paste',
  'description' => <<<'EOT_TF'
Make fancy text in 25+ styles: bold, italic, cursive script, gothic, bubble, small caps, upside down and more. Copy and paste into Instagram, TikTok or games.
EOT_TF,
  'related' => ['case-converter', 'character-counter', 'word-counter'],
  'answer' => <<<'EOT_TF'
Type your text and it appears in 25+ styles such as <strong>𝐁𝐨𝐥𝐝</strong>, <strong>𝓒𝓾𝓻𝓼𝓲𝓿𝓮</strong>, <strong>𝔊𝔬𝔱𝔥𝔦𝔠</strong>, Ⓑⓤⓑⓑⓛⓔ and ꜱᴍᴀʟʟ ᴄᴀᴘꜱ. Tap one to copy it. These aren't fonts: they're special Unicode characters, so they keep their style when you paste them into an Instagram bio, a TikTok caption, WhatsApp, Discord or a game name.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How fancy text works</h2>
<p>Social apps don't let you choose a font. Unicode, the standard every phone and computer uses for text, includes complete alphabets of mathematical and decorative letters: bold, italic, script, gothic (also called Fraktur), double-struck, circled, squared and more. They were added for maths and symbols, but because they're ordinary characters, they can be pasted anywhere text is allowed.</p>
<p>This generator swaps each normal letter for its look-alike in those alphabets. Nothing is installed and nothing special is needed on the other person's phone.</p>

<h2>Where you can use it</h2>
<ul>
<li><strong>Instagram and TikTok:</strong> bios, display names, captions and comments.</li>
<li><strong>WhatsApp, Telegram and Discord:</strong> status, nicknames and messages.</li>
<li><strong>X and Facebook:</strong> posts and profile names (some fields block special characters).</li>
<li><strong>Games:</strong> many games accept them in player and clan names. Check the game's rules first.</li>
</ul>

<h2>Things to know before you use it</h2>
<ul>
<li><strong>Screen readers struggle.</strong> Apps that read text aloud for blind and low-vision users often read "𝐇𝐞𝐥𝐥𝐨" as "mathematical bold capital H, mathematical bold small e…" or skip it. Use fancy text for a name or a few words, not for important information.</li>
<li><strong>Search doesn't find it.</strong> People searching for "hello" won't find "𝓱𝓮𝓵𝓵𝓸", so keep your main name or keywords in normal text.</li>
<li><strong>Some characters don't exist.</strong> Unicode has no small-caps "q" or superscript "q", so those letters stay normal in a few styles. Numbers only exist in some alphabets.</li>
<li><strong>Older devices</strong> may show a box (□) for characters their fonts don't include, especially the circled and squared styles.</li>
</ul>

<h2>The most popular styles</h2>
<p><strong>Bold</strong> and <strong>bold script</strong> are the safest choices: they display on almost every device. <strong>Small caps</strong> looks elegant in bios. <strong>Upside down</strong> and <strong>strikethrough</strong> are fun for comments. <strong>Wide</strong> text (full-width characters) gives the "vaporwave" look.</p>
EOT_TF,
  'faqs' => [
    [
      'How do I get fancy fonts on Instagram?',
      <<<'EOT_TF'
Type your text here, tap the style you like to copy it, then paste it into your Instagram bio, name or caption. It keeps the style because it uses special Unicode characters.
EOT_TF,
    ],
    [
      'Are these fonts free to use?',
      'Yes. They are standard Unicode characters, not fonts, so there is no licence and nothing to install.',
    ],
    [
      'Why do some letters look normal?',
      <<<'EOT_TF'
A few letters don’t exist in some Unicode alphabets, such as small-caps q, so they stay as normal letters.
EOT_TF,
    ],
    [
      'Why do I see boxes instead of letters?',
      <<<'EOT_TF'
The device you are viewing on doesn’t have a font with those characters. Bold and script styles work on almost all devices.
EOT_TF,
    ],
    [
      'Can I use fancy text in my game name?',
      <<<'EOT_TF'
Many games allow it, but some block special characters. Try it in the name field and see if the game accepts it.
EOT_TF,
    ],
  ],
];
