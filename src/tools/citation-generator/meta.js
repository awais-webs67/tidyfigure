module.exports = {
  order: 3,
  category: 'study',
  icon: 'quote',
  popular: true,
  appCategory: 'EducationalApplication',
  name: 'Citation Generator',
  keywords: 'citation generator apa 7 mla 9 harvard chicago reference generator cite website book journal article bibliography in-text',
  short: 'Cite websites, books and journal articles in APA, MLA, Harvard or Chicago style.',
  title: 'Citation Generator: APA 7, MLA 9, Harvard & Chicago, Free',
  description: 'Create references and in-text citations for websites, books and journal articles in APA 7, MLA 9, Harvard and Chicago style. Copy with italics. Free, no ads.',
  related: ['word-counter', 'grade-calculator', 'case-converter'],
  answer: `Choose your style (APA, MLA, Harvard or Chicago) and the type of source, fill in the author, title, date and other details, and copy the formatted <strong>reference</strong> and <strong>in-text citation</strong>. Italics are kept when you paste into Word or Google Docs. For example, in APA 7 a website looks like: Doe, J. A., &amp; Chen, M. (2024, March 15). <i>Title of the page</i>. Site Name. URL`,
  article: `
<h2>Citation formats at a glance</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Style</th><th>Used mostly in</th><th>In-text</th></tr></thead>
<tbody>
<tr><td>APA 7</td><td>Psychology, education, social sciences, nursing</td><td>(Doe &amp; Chen, 2024)</td></tr>
<tr><td>MLA 9</td><td>English, languages, humanities</td><td>(Doe and Chen 12)</td></tr>
<tr><td>Harvard</td><td>Many UK and Australian universities, business</td><td>(Doe and Chen, 2024)</td></tr>
<tr><td>Chicago 18</td><td>History, arts, some sciences (author-date)</td><td>(Doe and Chen 2024)</td></tr>
</tbody></table></div>
<p>Always follow the style your teacher or journal asks for. "Harvard" in particular has many local versions; this tool follows the widely used <em>Cite Them Right</em> version.</p>

<h2>Examples of each style</h2>
<h3>Website</h3>
<div class="formula">APA:     Doe, J. A., & Chen, M. (2024, March 15). How sleep affects memory and learning. Sleep Research Society. https://www.example.org/sleep
MLA:     Doe, Jane A., and Michael Chen. "How Sleep Affects Memory and Learning." Sleep Research Society, 15 Mar. 2024, www.example.org/sleep.
Harvard: Doe, J.A. and Chen, M. (2024) How sleep affects memory and learning. Available at: https://www.example.org/sleep (Accessed: 22 October 2026).</div>
<h3>Journal article</h3>
<div class="formula">APA:     Doe, J. A., & Chen, M. (2024). Title of the article. Journal of Sleep Research, 33(2), 145–162. https://doi.org/10.xxxx/xxxxx
Chicago: Doe, Jane A., and Michael Chen. "Title of the Article." Journal of Sleep Research 33, no. 2 (2024): 145–162.</div>
<p>In the real output, titles of websites, books and journals are in italics, as each style requires.</p>

<h2>Where to find the details</h2>
<ul>
<li><strong>Author:</strong> at the top or bottom of an article, on the title page of a book, or under the title of a journal article. If a website names no person, the organisation is often the author.</li>
<li><strong>Date:</strong> the publication or "last updated" date. For a book, the year on the copyright page. If there's none, APA uses "n.d." (no date).</li>
<li><strong>DOI:</strong> a permanent link for journal articles, usually printed on the first page, like <code>10.1111/jsr.14012</code>. Paste it in the URL box: the tool adds <code>https://doi.org/</code> for you.</li>
<li><strong>Volume, issue and pages:</strong> in the article's header or the journal's table of contents.</li>
</ul>

<h2>Number of authors</h2>
<ul>
<li><strong>APA:</strong> list up to 20 authors; the in-text citation uses "et al." from three authors.</li>
<li><strong>MLA:</strong> one or two authors are written out; three or more become the first author plus "et al."</li>
<li><strong>Harvard:</strong> up to three authors are listed; four or more become "et al."</li>
<li><strong>Chicago:</strong> up to six authors in the bibliography; seven or more list the first three plus "et al."</li>
</ul>

<h2>Capitalising titles</h2>
<p>APA uses <strong>sentence case</strong> for article, web page and book titles: only the first word, the first word after a colon, and proper nouns get capitals. MLA and Chicago use <strong>title case</strong>, capitalising the main words. The tool keeps your typing exactly as it is, so type titles in the case your style needs, or fix them with the <a href="/case-converter">case converter</a>.</p>

<h2>Avoiding plagiarism</h2>
<p>Every quotation, statistic, image or idea you take from someone else needs an in-text citation <em>and</em> a full reference in your reference list or bibliography. Put direct quotes in quotation marks and add the page number. Paraphrasing still needs a citation. Building your references as you research saves a lot of time at the end. Check your <a href="/word-counter">word count</a>: in most courses, the reference list doesn't count towards it.</p>`,
  faqs: [
    ['How do I cite a website in APA 7?', 'Author, A. A. (Year, Month Day). Title of page (in italics). Site Name. URL. If there is no author, start with the title.'],
    ['How do I cite a book in MLA 9?', 'Last name, First name. Title of Book (in italics). Publisher, Year.'],
    ['What is the difference between a reference and an in-text citation?', 'The in-text citation is the short note in your sentence, like (Doe, 2024). The reference is the full entry in the list at the end.'],
    ['What if a source has no date?', 'APA uses (n.d.). Harvard uses (no date). MLA leaves the date out and adds the date you accessed it.'],
    ['Will the italics be kept when I paste?', 'Yes. Copy reference puts formatted text on the clipboard, so italics stay when you paste into Word, Google Docs or Pages.'],
  ],
};
