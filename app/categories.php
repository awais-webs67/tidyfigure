<?php
// Category hub pages (e.g. /pdf-tools): URL, SEO title, description, introduction and FAQs.
// Keys match the category ids in app/site.php.
return [
    'image' => [
        'slug' => 'image-tools',
        'title' => 'Image Tools: Compress, Resize, Convert & Remove BG',
        'description' => 'Compress photos to exact KB limits, resize, crop, convert HEIC or WebP, remove backgrounds and strip EXIF metadata locally in your browser with no uploads.',
        'intro' => '<p>Everything you need to get a photo ready for email, the web, social media or print. Shrink large phone photos so they upload faster, resize them to exact pixel sizes for Instagram or YouTube, convert HEIC, PNG and WebP to JPG, crop and rotate, add a watermark, or remove the hidden location data before you share a picture.</p><p>Unlike most image websites, these tools never upload your photos. Your browser does the work on your own device, so private pictures stay private and even large batches are processed quickly.</p>',
        'faqs' => [
            ['Are these image tools really free?', 'Yes. Every tool is free with no sign-up, no watermark and no daily limit.'],
            ['Are my photos uploaded to a server?', 'No. Images are processed in your browser on your own device and are never uploaded.'],
            ['Which formats are supported?', 'JPG, PNG and WebP everywhere, plus GIF, AVIF and HEIC in the tools and browsers that support them.'],
        ],
    ],
    'pdf' => [
        'slug' => 'pdf-tools',
        'title' => 'PDF Tools Online: Merge, Split, Compress & Sign Free',
        'description' => 'Merge, split, compress to 100 KB, rotate, sign, watermark and convert PDFs right inside your browser. Zero file uploads keep contracts and IDs private.',
        'intro' => '<p>Combine scanned pages into one document, pull a few pages out of a long report, shrink a PDF so it fits an email attachment, sign a form, add page numbers or a watermark, or turn pages into images. Each tool does one job well and shows you a preview before you download.</p><p>Your PDFs are opened and edited inside your browser. They are never uploaded, which makes these tools safe for contracts, bank statements, IDs and other private documents.</p>',
        'faqs' => [
            ['Is it safe to use these PDF tools for private documents?', 'Yes. PDFs are processed on your device and never sent to a server.'],
            ['Is there a file size limit?', 'There is no fixed limit. Very large PDFs depend on your device’s memory; a computer handles bigger files than a phone.'],
            ['Do the PDF tools add a watermark?', 'No. Your files come out exactly as you made them, with no watermark or branding.'],
        ],
    ],
    'device' => [
        'slug' => 'device-tests',
        'title' => 'Online Device Tests: Mic, Webcam, Keyboard & Screen',
        'description' => 'Test your microphone, webcam, keyboard keys, mouse click speed and screen resolution directly in your browser. Private hardware checks with zero recording.',
        'intro' => '<p>Before a video call, an online exam or a gaming session, make sure your hardware works. Test your microphone with a live sound meter, check your webcam picture and resolution, press every key on your keyboard, measure your clicks per second, find your exact screen resolution, or use your camera as a mirror.</p><p>Every test runs in your browser. Sound and video stay on your device: nothing is recorded on a server or sent anywhere.</p>',
        'faqs' => [
            ['Is it safe to allow camera and microphone access?', 'Yes. The tests only show your picture and sound level on your own screen. Nothing is recorded on a server or uploaded, and access stops when you close the page.'],
            ['Why does my browser ask for permission?', 'Browsers never let a website use your camera or microphone without asking. Click Allow when asked; you can change it later in the browser’s site settings (the icon next to the address).'],
            ['Do these tests work on phones?', 'Yes. The mic, camera, mirror, screen and click tests work on phones and tablets. The keyboard test needs a physical keyboard.'],
        ],
    ],
    'text' => [
        'slug' => 'text-tools',
        'title' => 'Online Text Tools: Word Counter, Case & Diff Checker',
        'description' => 'Count words and characters, convert text case, compare two drafts side by side, clean formatting, make URL slugs and check readability without sign-up.',
        'intro' => '<p>Quick tools for anyone who writes: count words and characters for an essay or a social post, fix the capitalisation of a heading, compare two versions of a document, check how easy your writing is to read, remove duplicate lines from a list, or create clean URL slugs and hashtags.</p><p>Text you paste stays in your browser. Nothing is stored or sent anywhere.</p>',
        'faqs' => [
            ['Is my text saved anywhere?', 'No. Text is processed in your browser and disappears when you close the page.'],
            ['Can I use these tools on my phone?', 'Yes. Every tool works on phones, tablets and computers.'],
        ],
    ],
    'media' => [
        'slug' => 'video-audio-tools',
        'title' => 'Video & Audio Tools: MP4 to MP3, Compress & Cut',
        'description' => 'Convert video to MP3, compress large phone clips for WhatsApp, trim audio, create GIFs and record your screen or voice in your browser without uploads.',
        'intro' => '<p>Turn a video’s sound into an MP3, make a big phone video small enough for WhatsApp or email, cut out the part you need, make a looping GIF, trim a song into a ringtone, or record your voice and screen without installing anything.</p><p>All of it happens in your browser, so your videos are never uploaded. Choose the quality you want: from small files for sharing to high quality for keeping.</p>',
        'faqs' => [
            ['Do I need to install any software?', 'No. Everything runs in a modern browser such as Chrome, Safari, Edge or Firefox.'],
            ['Are my videos uploaded?', 'No. Videos and audio are processed on your own device.'],
            ['Why does compressing a video take as long as the video?', 'The browser plays the video once while it records the new, smaller version. Keep the tab open until it finishes.'],
        ],
    ],
    'qr' => [
        'slug' => 'qr-code-tools',
        'title' => 'QR Code Tools: Generator, Scanner & Dynamic QR',
        'description' => 'Create static or dynamic QR codes for links, Wi-Fi, WhatsApp and contacts, scan QR codes and barcodes with your camera, and download crisp PNG or SVG.',
        'intro' => '<p>Create QR codes for websites, Wi-Fi passwords, WhatsApp chats, contact cards and more, add your logo, and download them as PNG or SVG. Need to change where a printed code points, or count how often it’s scanned? Make a dynamic QR code. You can also host a document or a verification page behind a QR code, or scan QR codes and barcodes with your camera.</p><p>Static QR codes work forever and never expire. Hosted codes (dynamic, file and verification) are kept for 30 days.</p>',
        'faqs' => [
            ['Do these QR codes expire?', 'Normal QR codes never expire because the information is stored in the code itself. Dynamic, file and verification QR codes are hosted for 30 days.'],
            ['What is a dynamic QR code?', 'A QR code that points to a short link on this site, so you can change the destination later and see how many times it was scanned.'],
            ['Can I add my logo to a QR code?', 'Yes. The QR code generator lets you add a logo in the middle and choose colours.'],
        ],
    ],
    'random' => [
        'slug' => 'generators',
        'title' => 'Online Random Generators: Password, Wheel & Picker',
        'description' => 'Generate strong passwords, pick random giveaway winners, spin a decision wheel, roll dice or flip a coin using cryptographically secure randomness.',
        'intro' => '<p>Generate strong passwords, pick random numbers or a giveaway winner, spin a decision wheel, roll dice or flip a coin. Every generator uses your browser’s cryptographically secure random number generator, the same kind used for encryption, so results are genuinely fair and unpredictable.</p>',
        'faqs' => [
            ['Are the results really random?', 'Yes. The tools use crypto.getRandomValues, a secure random source built into your browser.'],
            ['Are generated passwords stored?', 'No. Passwords are created on your device and never sent anywhere.'],
        ],
    ],
    'health' => [
        'slug' => 'health-calculators',
        'title' => 'Health & Fitness Calculators: BMI, Calories & TDEE',
        'description' => 'Calculate BMI, daily calories, BMR, macros, body fat, water intake, heart rate zones, sleep cycles and pregnancy due dates with published clinical formulas.',
        'intro' => '<p>Understand your body with calculators based on the formulas doctors and dietitians use: body mass index, calories to maintain or lose weight, macronutrients, body fat percentage, ideal weight, water intake, heart rate training zones, sleep cycles, due dates and fertile days.</p><p>Each page explains the formula with a worked example. Results are estimates for healthy adults, not medical advice, so speak to a doctor about any health decision.</p>',
        'faqs' => [
            ['How accurate are these calculators?', 'They use well-established formulas such as Mifflin-St Jeor for calories and the WHO BMI categories. Results are good estimates, but individual needs vary.'],
            ['Is my health data stored?', 'No. Everything you enter stays in your browser.'],
        ],
    ],
    'money' => [
        'slug' => 'finance-calculators',
        'title' => 'Finance Calculators: Loan, EMI, Compound & Invoice',
        'description' => 'Plan loans, mortgages, compound interest, debt payoff, retirement, budgets and VAT, or build PDF invoices and quotes in your browser with worked formulas.',
        'intro' => '<p>Make better money decisions with clear, honest calculators. Compare loan offers, see what house you can afford, plan a budget with the 50/30/20 rule, build a debt payoff plan, watch savings grow with compound interest, and work out when you can retire.</p><p>For small businesses and freelancers there are invoice, quotation and receipt makers, break-even, profit margin and VAT calculators, and a tool to set your freelance rate. Every calculator shows its formula and a worked example so you can check the result.</p>',
        'faqs' => [
            ['Do these calculators work in any currency?', 'Yes. Enter amounts in your own currency; the calculations are the same.'],
            ['Is this financial advice?', 'No. The calculators give estimates for planning. Check important decisions with a qualified adviser and your lender’s figures.'],
        ],
    ],
    'study' => [
        'slug' => 'student-tools',
        'title' => 'Student Tools: GPA Calculator, Citations & Resume',
        'description' => 'Work out college GPA and needed final exam scores, format APA, MLA, Harvard or Chicago citations, study with flashcards, test typing speed and build a CV.',
        'intro' => '<p>Tools that make studying and assignments easier: work out your GPA and the score you need on the final, cite sources correctly in APA, MLA, Harvard or Chicago style, learn with flashcards that repeat what you miss, and check your typing speed.</p>',
        'faqs' => [
            ['Which citation styles are supported?', 'APA 7th, MLA 9th, Harvard (Cite Them Right) and Chicago 18th, for websites, books and journal articles.'],
            ['Can I use these tools for free?', 'Yes. Every student tool is free with no sign-up.'],
        ],
    ],
    'calc' => [
        'slug' => 'calculators',
        'title' => 'Everyday Calculators: Percentage, Discount & More',
        'description' => 'Quick everyday calculators: percentages, discounts, unit prices and pizza sizes. Clear answers with the formula shown, free and instant on any device.',
        'intro' => '<p>Fast answers to everyday maths: what’s 15% of a price, how much a discount really saves, which pack is better value, or whether two medium pizzas beat one large. Each calculator shows the formula, so you can see how the answer was reached.</p>',
        'faqs' => [
            ['Do I need to press calculate?', 'No. Results update instantly as you type.'],
        ],
    ],
    'time' => [
        'slug' => 'time-date-tools',
        'title' => 'Time & Date Tools: Age Calculator, Timer & Stopwatch',
        'description' => 'Free time and date tools: online timer and stopwatch, exact age calculator, and the number of days, weeks and working days between two dates.',
        'intro' => '<p>Count down with an online timer, time laps with a stopwatch, work out your exact age in years, months and days, or count the days and working days between two dates for deadlines, holidays and notice periods.</p>',
        'faqs' => [
            ['Does the timer keep running in the background?', 'Yes. Timers use the real clock, so they stay accurate even if you switch tabs.'],
        ],
    ],
    'convert' => [
        'slug' => 'converters',
        'title' => 'Unit & Colour Converters: Metric, Imperial, HEX & RGB',
        'description' => 'Convert length, weight, temperature, volume, speed and data units instantly, plus translate colours between HEX, RGB and HSL with exact formulas.',
        'intro' => '<p>Convert between metric and imperial units for length, weight, temperature, volume, area, speed and data, and translate colours between HEX, RGB and HSL for design work.</p>',
        'faqs' => [
            ['How accurate are the conversions?', 'They use exact conversion factors (for example, 1 inch = 2.54 cm exactly) and show results to sensible precision.'],
        ],
    ],
    'dev' => [
        'slug' => 'developer-tools',
        'title' => 'Developer Tools: JSON, Regex, Base64, Hash & JWT',
        'description' => 'Format JSON, test regex patterns, decode JWT tokens, encode Base64 or URLs, generate UUIDs and hashes, and explain cron schedules locally in your tab.',
        'intro' => '<p>Everyday utilities for developers: format and validate JSON, test regular expressions with highlighted matches, encode and decode Base64 and URLs, generate hashes and UUIDs, decode JWTs, explain cron schedules and design CSS gradients.</p><p>Everything runs locally in your browser, so API responses, tokens and config files are never sent to a server.</p>',
        'faqs' => [
            ['Is it safe to paste tokens and data here?', 'The tools run entirely in your browser and send nothing to a server. Still, avoid pasting live production secrets into any website.'],
        ],
    ],
    'home' => [
        'slug' => 'home-diy-calculators',
        'title' => 'Home & DIY Calculators: Paint, Tiles & Concrete',
        'description' => 'Estimate paint tins, floor or wall tiles, concrete bags and appliance running electricity costs in both metric and imperial measurements before buying.',
        'intro' => '<p>Plan home projects without over-buying: work out the paint for a room, the tiles and boxes for a floor or wall, the concrete for a slab or post holes, and what each appliance adds to your electricity bill.</p>',
        'faqs' => [
            ['Do the calculators work in feet and inches?', 'Yes. Each one has metric and imperial units.'],
        ],
    ],
    'share' => [
        'slug' => 'create-and-share',
        'title' => 'Create & Share: Friendship Quiz, Giveaway & Invites',
        'description' => 'Build a friendship quiz, launch a timed online giveaway with a random winner draw, or send digital wedding invitations with RSVP via a single private link.',
        'intro' => '<p>Make something, send one link, and watch the replies come in. Build a <strong>friendship quiz</strong> and see which friend knows you best, run a <strong>giveaway</strong> with a live countdown and a fair random draw, or send an <strong>online wedding invitation</strong> with the card, venues, directions and RSVP. No sign-up: you get a secret code to see the results and make changes.</p>',
        'faqs' => [
            ['Do I need an account?', 'No. When you make something you get a secret code. Keep it: with it you can see the entries, edit and delete, from any device.'],
            ['Who can see my page?', 'Only people you send the link to. The pages aren’t listed on the site or in search engines.'],
            ['How long do the pages stay up?', 'Quizzes stay for six months, giveaways for 30 days after they end, and wedding invitations for 30 days after the last event. Then they’re deleted automatically.'],
        ],
    ],
    'social' => [
        'slug' => 'social-media-tools',
        'title' => 'Social Media Tools: YouTube Counter, Thumbnails & Cards',
        'description' => 'Track live YouTube subscriber counts, download high-res video thumbnails, draw random giveaway winners and create custom birthday cards and wish pages.',
        'intro' => '<p>Tools for creators and celebrations: watch a YouTube channel’s subscriber count update live, save a video’s thumbnail in full resolution, pick fair giveaway winners from comments, and make birthday cards and personalised wish pages to share.</p>',
        'faqs' => [
            ['How does the live subscriber counter work?', 'It uses YouTube’s official API and refreshes every few seconds. YouTube rounds public counts for large channels.'],
        ],
    ],
    'life' => [
        'slug' => 'everyday-tools',
        'title' => 'Everyday Life Tools: Split Rent, Bills, Trips & Recipes',
        'description' => 'Split rent fairly by room size, settle group bills or road trip expenses, scale recipes, convert baking pan sizes, time dinner dishes and compare choices.',
        'intro' => '<p>Practical helpers for daily life: split rent fairly by room size, settle group expenses with the fewest payments, share road trip costs, scale a recipe up or down, convert between baking tin sizes, time every dish of a big dinner, and weigh up decisions with a simple matrix.</p>',
        'faqs' => [
            ['Do I need an account to save my work?', 'No account is needed. Some tools let you share results with a link.'],
        ],
    ],
];
