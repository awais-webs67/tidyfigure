<?php
// Slug Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Slug Generator',
  'category' => 'text',
  'order' => 22,
  'icon' => 'link-2',
  'keywords' => 'slug generator url slug seo friendly url permalink title to slug convert text to url bulk',
  'short' => 'Turn titles into clean, SEO-friendly URL slugs, one at a time or in bulk.',
  'title' => 'Slug Generator: Turn Titles into SEO-Friendly URLs',
  'description' => <<<'EOT_TF'
Convert page titles into clean URL slugs: lowercase, hyphens, accents removed, optional filler-word removal and a length limit. Works in bulk, one per line.
EOT_TF,
  'related' => ['case-converter', 'url-encoder-decoder', 'character-counter'],
  'answer' => <<<'EOT_TF'
A <strong>slug</strong> is the readable part of a web address that identifies a page, like <code>/save-money-tips</code>. To make one, lowercase the title, replace spaces and punctuation with hyphens, and remove accents: "Crème Brûlée: The Perfect French Dessert" becomes <code>creme-brulee-the-perfect-french-dessert</code>.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>What makes a good slug</h2>
<ul>
<li><strong>Short and descriptive:</strong> 3–6 meaningful words that say what the page is about. <code>/best-student-laptops</code> beats <code>/whats-the-best-laptop-for-students-in-2026-our-complete-guide</code>.</li>
<li><strong>Lowercase:</strong> some servers treat <code>/Page</code> and <code>/page</code> as different addresses, which can split links and cause duplicates.</li>
<li><strong>Hyphens between words:</strong> Google recommends hyphens rather than underscores, because hyphens are read as word separators.</li>
<li><strong>Only letters, numbers and hyphens:</strong> spaces become <code>%20</code>, and symbols like <code>?</code>, <code>&amp;</code> or <code>#</code> have special meanings in URLs.</li>
<li><strong>Include the main keyword</strong> naturally, but don't repeat it.</li>
</ul>

<h2>What the generator does</h2>
<div class="formula">"10 Easy Ways to Save Money in 2026 (Without a Budget!)"
1. Lowercase              10 easy ways to save money in 2026 (without a budget!)
2. Replace & → and, accents removed (é → e, ß → ss)
3. Remove apostrophes     what's → whats
4. Everything else → separator, no doubles at the ends
→ 10-easy-ways-to-save-money-in-2026-without-a-budget
With filler words removed and numbers removed:
→ easy-ways-save-money-budget</div>

<h2>Should I remove words like "a", "the" and "of"?</h2>
<p>It's optional. Removing them makes slugs shorter and more focused, and many SEO plugins do it. But sometimes the small words matter for meaning: <code>/to-do-list</code> or <code>/the-who-tickets</code>. Check the result reads sensibly. The generator keeps the words if removing them would leave fewer than two words.</p>

<h2>Should I put the year in the slug?</h2>
<p>Usually not. If you update "Best laptops 2026" next year, a slug containing 2026 either looks out of date or has to change, and changing a URL means setting up a redirect. Tick <strong>Remove numbers</strong> to drop years and list counts, then keep the year in the title instead, where it's easy to update.</p>

<h2>Changing an existing slug</h2>
<p>If a page is already published and has links or search traffic, changing its slug breaks those links. If you must change it, add a <strong>301 redirect</strong> from the old address to the new one so visitors and search engines follow it, and update your own internal links.</p>

<h2>Bulk slugs</h2>
<p>Paste a list of titles, one per line, to get a slug for each, ready to copy into a spreadsheet or CMS import. The length limit trims at a word boundary so slugs never end with half a word.</p>
<p>Non-Latin scripts (Cyrillic, Arabic, Devanagari, Chinese) are kept as they are, since modern browsers display them in the address bar; they're percent-encoded behind the scenes. If you need a Latin-only slug for those, transliterate the title first. Need to change the case of your titles? Use the <a href="/case-converter">case converter</a>.</p>
EOT_TF,
  'faqs' => [
    [
      'What is a URL slug?',
      <<<'EOT_TF'
The part of a web address after the domain that identifies a specific page, such as save-money-tips in example.com/blog/save-money-tips.
EOT_TF,
    ],
    [
      'Should slugs use hyphens or underscores?',
      'Hyphens. Google treats hyphens as word separators, while underscores join words together.',
    ],
    [
      'How long should a URL slug be?',
      'Keep it short: 3–6 meaningful words, usually under 60 characters.',
    ],
    [
      'Do slugs affect SEO?',
      <<<'EOT_TF'
A little. A short, descriptive slug with your main keyword helps users and search engines understand the page and makes links more clickable.
EOT_TF,
    ],
    [
      'Can I change a slug after publishing?',
      'Yes, but add a 301 redirect from the old URL so existing links and rankings carry over.',
    ],
  ],
];
