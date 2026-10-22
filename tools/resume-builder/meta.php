<?php
// Resume Builder: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Resume Builder',
  'category' => 'study',
  'order' => 0,
  'icon' => 'file-user',
  'popular' => true,
  'libs' => ['https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js', 'https://cdn.jsdelivr.net/npm/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js'],
  'appCategory' => 'BusinessApplication',
  'keywords' => 'resume builder free cv maker online resume template pdf ats friendly resume no sign up curriculum vitae download free',
  'short' => 'Make a professional, ATS-friendly resume and download it as a PDF. Free, no sign-up.',
  'title' => 'Free Resume Builder: ATS-Friendly CV Templates, PDF Download',
  'description' => 'Build a professional resume in minutes with three ATS-friendly templates and a live preview. Download a real text PDF, free, with no sign-up and no watermark.',
  'related' => ['cover-letter-generator', 'email-signature-generator', 'gpa-calculator'],
  'answer' => <<<'EOT_TF'
Fill in your details, experience and skills, pick a template and colour, and watch the <strong>live preview</strong> update. Download a <strong>text-based PDF</strong> that applicant tracking systems (ATS) can read, with no watermark and no sign-up. Most resume builders let you write for free and then charge to download; this one doesn’t.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to build your resume</h2>
<ol>
<li>Choose a template: <strong>Modern</strong> (sidebar with skills and an optional photo), <strong>Classic</strong> (traditional serif headings, centred) or <strong>Compact</strong> (fits more on one page).</li>
<li>Replace the example text with your own details. Each line of "Achievements" becomes a bullet point.</li>
<li>Check the preview, then press <strong>Download PDF</strong>.</li>
</ol>
<p>Your work is saved in this browser as you type, so you can close the page and come back later. Use <strong>Save as file</strong> to keep a backup or continue on another device.</p>

<h2>What is an ATS-friendly resume?</h2>
<p>Most larger employers use an <strong>applicant tracking system</strong> to collect and search applications. If your resume is an image (as some free builders produce), the ATS can't read it and your application may never be seen. This builder creates a PDF with real, selectable text, standard section headings (Profile, Experience, Education, Skills) and a simple layout that ATS software reads reliably.</p>

<h2>Writing a resume that gets interviews</h2>
<ul>
<li><strong>Lead with results, not duties.</strong> "Grew online revenue from £4.1m to £8.6m" beats "Responsible for online marketing". Use numbers wherever you can.</li>
<li><strong>Start bullets with action verbs:</strong> led, built, grew, reduced, launched, managed, improved.</li>
<li><strong>Tailor it to each job.</strong> Mirror the key skills and words from the job advert in your summary and skills.</li>
<li><strong>Keep it short:</strong> one page for under 10 years' experience, two pages at most for most roles.</li>
<li><strong>Most recent first.</strong> List jobs and education in reverse order.</li>
<li><strong>Use a professional email address</strong> and check every detail for typos.</li>
</ul>

<h2>Should I add a photo?</h2>
<p>It depends on the country. In the US, UK, Canada and Australia, photos are usually left off to avoid bias, and some employers prefer you don't include one. In much of Europe, the Middle East and Asia, a professional photo is common. Use the Classic or Compact template, which have no photo, for applications where photos aren't expected.</p>

<h2>Resume or CV?</h2>
<p>In the US and Canada, a <em>resume</em> is a short summary for job applications, while a <em>CV</em> is a long academic record. In the UK, Ireland, India, Pakistan and much of the world, "CV" simply means what Americans call a resume. This builder works for both.</p>
<p>Everything is created in your browser and nothing is uploaded. Need a matching cover letter? Use the <a href="/cover-letter-generator">cover letter generator</a>.</p>
EOT_TF,
  'faqs' => [
    ['Is this resume builder really free?', 'Yes. Writing, previewing and downloading the PDF are all free, with no watermark and no account.'],
    ['Is the PDF ATS-friendly?', 'Yes. It contains real, selectable text with standard headings and a simple structure that applicant tracking systems can read.'],
    ['Will my resume be saved?', 'It is saved automatically in this browser on this device. Use Save as file to keep a copy or move it to another device.'],
    ['How long should my resume be?', 'One page if you have under 10 years of experience, and no more than two pages for most jobs.'],
    ['Should I include a photo on my resume?', 'In the US, UK, Canada and Australia, usually not. In much of Europe, the Middle East and Asia, a professional photo is common.'],
  ],
];
