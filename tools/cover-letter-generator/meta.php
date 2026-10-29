<?php
// Cover Letter Generator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Cover Letter Generator',
  'updated' => '2026-10-26', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'study',
  'order' => 0,
  'icon' => 'mail',
  'appCategory' => 'BusinessApplication',
  'keywords' => 'cover letter generator free cover letter template job application letter example cover letter maker pdf',
  'short' => 'Write a tailored cover letter in minutes, in three tones. Edit and download as PDF.',
  'title' => 'Free Cover Letter Generator: Tailored Letter in Minutes, PDF',
  'description' => 'Create a tailored cover letter from your achievements, skills and the job you want. Pick a professional, enthusiastic or short tone, edit it, download a PDF.',
  'related' => ['resume-builder', 'readability-checker', 'word-counter'],
  'answer' => <<<'EOT_TF'
Enter the job, the company, your strongest achievements and the skills they ask for, then choose a tone. A complete cover letter appears instantly: opening, achievements, skills, why this company and a closing. <strong>Click the letter to edit it</strong>, press “Try different wording” for another version, and copy it or download a PDF.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>The structure of a strong cover letter</h2>
<ol>
<li><strong>Opening:</strong> the job you're applying for, where you saw it, and one line on why you're a good fit.</li>
<li><strong>Proof:</strong> two or three achievements with numbers. This is the part recruiters remember.</li>
<li><strong>Match:</strong> the skills from the job advert that you already have.</li>
<li><strong>Why them:</strong> one honest sentence about why you want to work for this company in particular.</li>
<li><strong>Close:</strong> thank them and say you'd welcome an interview.</li>
</ol>
<p>The generator follows this structure and fills it with your details. Keep the finished letter to 250–400 words, about three-quarters of a page.</p>

<h2>Choosing a tone</h2>
<ul>
<li><strong>Professional</strong> suits most jobs, large companies, banks, government and law.</li>
<li><strong>Enthusiastic</strong> works well for start-ups, creative roles, charities and customer-facing jobs.</li>
<li><strong>Short & direct</strong> is ideal for applications by email or LinkedIn message, or when the advert asks for a brief note.</li>
</ul>

<h2>Make it yours</h2>
<p>A generated letter is a strong first draft, not the final version. Recruiters read hundreds of letters and notice generic ones. Before sending:</p>
<ul>
<li>Add one specific detail about the company: a recent project, product or value that genuinely interests you.</li>
<li>Use the exact job title and the company's name for the role, as written in the advert.</li>
<li>Replace any phrase that doesn't sound like you.</li>
<li>Check the readability with the <a href="/readability-checker">readability checker</a> and the length with the <a href="/word-counter">word counter</a>.</li>
</ul>

<h2>Writing achievements that stand out</h2>
<div class="formula">Weak:   Responsible for social media.
Strong: Grew Instagram followers from 3,000 to 41,000 in a year,
        bringing in 12% of online sales.</div>
<p>Use the pattern <em>action + result + number</em>. If you don't have exact figures, estimates with "about" or "over" are fine, as long as they're honest.</p>

<h2>Dear Hiring Manager or a name?</h2>
<p>A name is better: check the advert, the company website or LinkedIn for the recruiter or team leader. If you use a name, British English closes with "Yours sincerely"; if you write "Dear Hiring Manager", the traditional British close is "Yours faithfully". The generator picks the right one. In American English, "Sincerely" works for both.</p>
<p>Pair your letter with a matching CV from the <a href="/resume-builder">resume builder</a>. Everything stays in your browser.</p>
EOT_TF,
  'faqs' => [
    ['How do I write a cover letter quickly?', 'Fill in the job, company, your top achievements and matching skills, choose a tone, and the generator writes a complete letter you can edit and download.'],
    ['How long should a cover letter be?', 'Between 250 and 400 words, about three-quarters of a page.'],
    ['Is it okay to use a cover letter generator?', 'Yes, as a starting point. Always personalise it with a detail about the company and your own voice before sending.'],
    ['Can I download the cover letter as a PDF?', 'Yes. Press Download PDF after making your edits. You can also copy it or save it as a text file.'],
    ['Should I write Yours sincerely or Yours faithfully?', 'In British English, use Yours sincerely when you know the person’s name and Yours faithfully with Dear Hiring Manager. The generator chooses for you.'],
  ],
];
