<?php
// Experience Letter Maker: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Experience Letter Maker',
  'updated' => '2026-10-29', // date the tool or its text last really changed (shown on the page and in the sitemap)
  'category' => 'money',
  'order' => 41,
  'popular' => true,
  'files' => true,
  'icon' => 'file-badge',
  'keywords' => 'experience letter format experience certificate maker experience letter template work experience letter relieving letter generator employment certificate',
  'aka' => ['experience certificate generator', 'experience letter format', 'relieving letter maker'], // other names people search for
  'short' => 'Write a professional experience letter and download it as a PDF.',
  'title' => 'Experience Letter Maker: Free Template and PDF',
  'description' => <<<'EOT_TF'
Create a professional experience letter or certificate: fill in the employee’s details, duties and conduct, add your logo, edit the text and download a PDF.
EOT_TF,
  'related' => ['employee-id-card-maker', 'cover-letter-generator', 'resume-builder', 'invoice-generator'],
  'answer' => <<<'EOT_TF'
Fill in the company and employee details, the dates, the main duties and a conduct rating. The tool writes a complete <strong>experience letter</strong> on your letterhead, works out the length of service, and lets you choose a standard, detailed or short version, or a <strong>relieving letter</strong>. Click the letter to edit any word, then download a PDF.
EOT_TF,
  'article' => <<<'EOT_TF'
 <h2>What is an experience letter?</h2>
 <p>An experience letter (also called an experience certificate or work experience letter) is written by an employer to confirm that someone worked for them: their job title, dates of employment and responsibilities, often with a few words on their performance. New employers, visa offices and universities commonly ask for one.</p>

 <h2>What to include</h2>
 <ul>
 <li>Company letterhead: name, logo, address and contact details.</li>
 <li>Date of issue and a heading such as “Experience Certificate” or “To whom it may concern”.</li>
 <li>The employee’s full name, job title, department and employee ID.</li>
 <li>Start and end dates of employment (and the total period).</li>
 <li>Main duties and responsibilities.</li>
 <li>A brief comment on conduct and performance.</li>
 <li>The reason for leaving, if appropriate (resignation, end of contract).</li>
 <li>Signature, name and job title of an authorised person (HR or the manager), and the company stamp if you use one.</li>
 </ul>

 <h2>Experience letter vs relieving letter</h2>
 <p>An <strong>experience letter</strong> describes the work the person did. A <strong>relieving letter</strong> confirms that they have been formally released from their duties on their last working day, after their resignation was accepted and handover completed. Many employers issue both, or one combined letter. Choose <strong>Relieving letter</strong> in the letter type to add the relieving statement.</p>

 <h2>Sample experience letter</h2>
 <pre class="copybox">This is to certify that Ms. Sara Ahmed worked with Bluewave Technologies as Senior Accountant in the Finance department from 1 March 2021 to 31 August 2025, a period of 4 years and 6 months.

During her time with us, she was responsible for monthly closing, tax filing and supplier payments.

Sara proved to be a dedicated, reliable and skilled professional, and worked well with colleagues and clients alike.

We wish her every success in her future career.</pre>

 <h2>Tips for employers</h2>
 <ul>
 <li>Keep it factual. Describe duties and dates accurately and avoid exaggerated praise you can’t stand behind.</li>
 <li>Print it on company letterhead, sign it, and stamp it if your country expects a seal.</li>
 <li>Keep a copy in the employee’s file.</li>
 </ul>
EOT_TF,
  'faqs' => [
    [
      'What is the format of an experience letter?',
      <<<'EOT_TF'
Company letterhead, date, a heading, a paragraph confirming the job title and dates, a list of duties, a comment on conduct, a closing wish, and the signature of an authorised person.
EOT_TF,
    ],
    [
      'Who signs an experience letter?',
      <<<'EOT_TF'
Usually someone from HR, the employee’s manager or a company director, with their name and job title, and the company stamp if used.
EOT_TF,
    ],
    [
      'What is the difference between an experience letter and a relieving letter?',
      <<<'EOT_TF'
An experience letter describes the work done; a relieving letter confirms the employee was formally released from duty on their last day. You can create either here.
EOT_TF,
    ],
    [
      'Can I edit the letter text?',
      <<<'EOT_TF'
Yes. Click anywhere in the letter to change the wording before downloading the PDF.
EOT_TF,
    ],
    [
      'Is the information uploaded?',
      <<<'EOT_TF'
No. The letter is written and the PDF is made in your browser. Nothing is sent to a server.
EOT_TF,
    ],
  ],
];
