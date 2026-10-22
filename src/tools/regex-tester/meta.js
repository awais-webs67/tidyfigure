module.exports = {
  order: 1,
  category: 'dev',
  icon: 'regex',
  popular: true,
  name: 'Regex Tester',
  keywords: 'regex tester regular expression tester javascript regex online match highlight capture groups replace',
  short: 'Test regular expressions live, with highlighted matches, capture groups and replace.',
  title: 'Regex Tester: Test JavaScript Regular Expressions Online',
  description: 'Test regular expressions with live match highlighting, capture groups and find-and-replace. JavaScript syntax, flags g, i, m, s, u, plus common patterns.',
  related: ['json-formatter', 'url-encoder-decoder', 'remove-duplicate-lines'],
  answer: `Type a pattern and some test text: every match is highlighted as you type, with a table of capture groups and positions. Patterns use <strong>JavaScript</strong> regex syntax, and flags go in the separate box: <strong>g</strong> for all matches, <strong>i</strong> to ignore case, <strong>m</strong> so ^ and $ match each line, <strong>s</strong> so . matches newlines.`,
  article: `
<h2>Regex cheat sheet</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Pattern</th><th>Matches</th></tr></thead>
<tbody>
<tr><td class="mono">.</td><td>Any character except a newline</td></tr>
<tr><td class="mono">\\d \\w \\s</td><td>A digit, a word character (letter, digit, _), a whitespace character</td></tr>
<tr><td class="mono">\\D \\W \\S</td><td>Anything that is not a digit, word character or whitespace</td></tr>
<tr><td class="mono">[abc] [^abc] [a-z]</td><td>One of a, b or c; anything except them; a range</td></tr>
<tr><td class="mono">^ $</td><td>Start and end of the text (or of each line with the m flag)</td></tr>
<tr><td class="mono">\\b</td><td>A word boundary</td></tr>
<tr><td class="mono">* + ?</td><td>0 or more, 1 or more, 0 or 1 of the previous item</td></tr>
<tr><td class="mono">{3} {2,5} {2,}</td><td>Exactly 3, between 2 and 5, at least 2</td></tr>
<tr><td class="mono">*? +?</td><td>Lazy versions: match as little as possible</td></tr>
<tr><td class="mono">(abc)</td><td>Capture group, used as $1, $2 in replacements</td></tr>
<tr><td class="mono">(?:abc)</td><td>Group without capturing</td></tr>
<tr><td class="mono">(?&lt;name&gt;abc)</td><td>Named group</td></tr>
<tr><td class="mono">a|b</td><td>a or b</td></tr>
<tr><td class="mono">(?=x) (?!x)</td><td>Lookahead: followed by x, not followed by x</td></tr>
<tr><td class="mono">(?&lt;=x) (?&lt;!x)</td><td>Lookbehind: preceded by x, not preceded by x</td></tr>
</tbody></table></div>
<p>To match a special character literally, escape it with a backslash: <code>\\.</code> matches a dot and <code>\\(</code> a bracket.</p>

<h2>Flags</h2>
<ul>
<li><strong>g (global):</strong> find every match, not just the first.</li>
<li><strong>i (ignore case):</strong> <code>cat</code> also matches Cat and CAT.</li>
<li><strong>m (multiline):</strong> <code>^</code> and <code>$</code> match at the start and end of every line.</li>
<li><strong>s (dotAll):</strong> <code>.</code> also matches newlines.</li>
<li><strong>u (unicode):</strong> handles emoji and other characters outside the basic range correctly, and enables <code>\\p{L}</code> style classes.</li>
<li><strong>y (sticky):</strong> matches only at the exact current position.</li>
</ul>

<h2>Find and replace with groups</h2>
<p>In the replacement, <code>$1</code>, <code>$2</code> insert capture groups, <code>$&amp;</code> inserts the whole match, and <code>$&lt;name&gt;</code> inserts a named group. For example, to turn dates from <code>2026-10-22</code> into <code>22/10/2026</code>:</p>
<div class="formula">Pattern:  (\\d{4})-(\\d{2})-(\\d{2})
Replace:  $3/$2/$1</div>

<h2>Common mistakes</h2>
<ul>
<li><strong>Greedy matching:</strong> <code>&lt;.*&gt;</code> on <code>&lt;b&gt;hi&lt;/b&gt;</code> matches the whole string. Use the lazy <code>&lt;.*?&gt;</code> to stop at the first <code>&gt;</code>.</li>
<li><strong>Forgetting anchors:</strong> to check a whole value (like a postcode), wrap the pattern in <code>^…$</code>, or it will match part of a longer string.</li>
<li><strong>Unescaped dots:</strong> <code>example.com</code> also matches "exampleXcom". Write <code>example\\.com</code>.</li>
<li><strong>Catastrophic backtracking:</strong> nested quantifiers like <code>(a+)+</code> can freeze on long text. Keep patterns simple.</li>
</ul>

<h2>Other languages</h2>
<p>Most syntax here works the same in Python, PHP (PCRE), Java and .NET, but details differ: lookbehind support, named group syntax (<code>(?P&lt;name&gt;…)</code> in Python) and flags are written differently. In code, remember to double backslashes inside normal string literals. Your text is tested in your browser and never sent anywhere.</p>`,
  faqs: [
    ['How do I test a regex online?', 'Type the pattern in the first box and your text below. Matches are highlighted instantly, with capture groups listed in a table.'],
    ['Which regex flavour does this use?', 'JavaScript (ECMAScript), the same engine as Chrome and Node.js. Most patterns also work in Python, PHP and Java.'],
    ['Why does my regex only find one match?', 'Add the g (global) flag to find every match instead of only the first.'],
    ['How do I use capture groups in a replacement?', 'Put parts of the pattern in brackets, then use $1, $2 and so on in the Replace box.'],
    ['How do I match a dot or a bracket?', 'Escape it with a backslash: \\. for a dot, \\( for a bracket, \\? for a question mark.'],
  ],
};
