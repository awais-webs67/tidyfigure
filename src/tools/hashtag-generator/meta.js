module.exports = {
  order: 23,
  category: 'text',
  icon: 'hash',
  name: 'Hashtag Generator & Counter',
  keywords: 'hashtag generator hashtag counter instagram hashtags tiktok hashtags camelcase hashtag maker count hashtags caption',
  short: 'Turn keywords into clean hashtags, or count and tidy the hashtags in a caption.',
  title: 'Hashtag Generator & Counter for Instagram, TikTok & X',
  description: 'Turn your keywords into clean, readable #CamelCase hashtags, or paste a caption to count its hashtags, find duplicates and broken tags. Free, no sign-up.',
  related: ['character-counter', 'fancy-text-generator', 'case-converter'],
  answer: `Type the keywords that describe your post, one per line, and copy them as hashtags: "home workout" becomes <strong>#HomeWorkout</strong>. Or switch to <strong>Check a caption</strong> to count its hashtags, spot duplicates and find tags broken by punctuation. A few specific, relevant hashtags (often 3–5) generally work better than a long list.`,
  article: `
<h2>How to make good hashtags</h2>
<ul>
<li><strong>Be specific.</strong> #HomeWorkout reaches people looking for exactly that; #fitness is so broad your post is lost among millions.</li>
<li><strong>Mix sizes.</strong> One or two broad tags, plus a few niche ones that describe your post precisely, and perhaps a branded tag of your own.</li>
<li><strong>Use CamelCase for multi-word tags.</strong> #HealthyHabits is easier to read than #healthyhabits, and screen readers pronounce the words separately, which makes your post more accessible.</li>
<li><strong>Keep them relevant.</strong> Platforms increasingly read your caption, image and audio to understand your post; misleading hashtags can lower trust and reach.</li>
</ul>

<h2>Hashtag rules that trip people up</h2>
<ul>
<li><strong>No spaces or punctuation:</strong> a hashtag stops at the first space, hyphen, apostrophe or full stop. #don't becomes #don. The generator removes these for you.</li>
<li><strong>Letters, numbers and underscores only.</strong> Emoji and symbols break most hashtags.</li>
<li><strong>Not only numbers:</strong> #2026 won't link on most platforms; #Goals2026 will.</li>
<li><strong>Accents:</strong> accented letters work, but people often search without them, so the generator removes accents (#CremeBrulee) for wider reach.</li>
<li><strong>Case doesn't matter for search:</strong> #HomeWorkout and #homeworkout are the same tag. Repeating it in a different case doesn't help.</li>
</ul>

<h2>How many hashtags should I use?</h2>
<p>Each platform sets its own maximum and its own advice, and these change from time to time, so check the app's help pages. As a general guide:</p>
<div class="scroll"><table class="tbl">
<thead><tr><th>Platform</th><th>Common advice</th></tr></thead>
<tbody>
<tr><td>Instagram</td><td>A small number of relevant hashtags (3–5); the app limits how many you can add</td></tr>
<tr><td>TikTok</td><td>3–5 relevant hashtags in the caption</td></tr>
<tr><td>X (Twitter)</td><td>1–2 hashtags; more can look like spam</td></tr>
<tr><td>LinkedIn</td><td>3–5 professional hashtags</td></tr>
<tr><td>YouTube</td><td>A few in the description; the first three can appear above the title</td></tr>
<tr><td>Facebook</td><td>1–3, or none</td></tr>
</tbody></table></div>

<h2>Checking a caption</h2>
<p>Paste a finished caption into <strong>Check a caption</strong> before you post. You'll see how many hashtags it has, any that appear twice (in any capitalisation), and any that punctuation has cut short. <strong>Copy caption without duplicates</strong> gives you a cleaned-up version. For the overall character count, use the <a href="/character-counter">character counter</a>, and for eye-catching bio text, the <a href="/fancy-text-generator">fancy text generator</a> (but keep hashtags in plain letters, or they won't link).</p>

<h2>Finding the right keywords</h2>
<p>This tool formats and checks hashtags; it doesn't track which ones are trending. To find good keywords, search the platform itself: type a word into its search bar and look at the suggested tags and how many posts each has. Look at the hashtags used by accounts in your niche whose posts do well, and keep a note of the ones that bring you real engagement.</p>`,
  faqs: [
    ['How do I make a hashtag?', 'Remove spaces and punctuation and put # in front: "home workout" becomes #HomeWorkout. The generator does this for each keyword you type.'],
    ['Should hashtags be CamelCase?', 'For multi-word hashtags, yes. #HomeWorkout is easier to read and screen readers pronounce each word.'],
    ['How many hashtags should I use on Instagram?', 'A few highly relevant ones, typically 3–5. Instagram limits how many you can add, and the limit can change, so check the app.'],
    ['Why isn’t my hashtag working?', 'It may contain a space, apostrophe, hyphen or emoji, or be made only of numbers. Paste your caption into Check a caption to find broken tags.'],
    ['Does this show trending hashtags?', 'No. It formats and checks hashtags. To find popular ones, use the search in each app and see what accounts in your niche use.'],
  ],
};
