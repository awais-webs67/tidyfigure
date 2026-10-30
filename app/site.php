<?php
// Site name and categories. Category order here is the order on the homepage and in the menu.
// icon = a file name in app/icons (Lucide icons). primary = shown in the desktop header.
return [
    'site' => [
        'name' => 'TidyFigure',
        'by' => 'AivraSol',              // shown in the footer
        'by_url' => 'https://aivrasol.com',
        'email' => '',                   // empty = hello@ + the domain the site runs on (or set it in Admin → Site)
    ],
    'categories' => [
        ['id' => 'image', 'name' => 'Image tools', 'nav' => 'Image', 'icon' => 'image', 'primary' => true, 'blurb' => 'Compress, resize and convert photos without uploading them anywhere.'],
        ['id' => 'pdf', 'name' => 'PDF tools', 'nav' => 'PDF', 'icon' => 'file-text', 'primary' => true, 'blurb' => 'Merge, split and create PDFs right in your browser.'],
        ['id' => 'text', 'name' => 'Text tools', 'nav' => 'Text', 'icon' => 'type', 'blurb' => 'Count, clean up, convert and style text.'],
        ['id' => 'media', 'name' => 'Video & audio tools', 'nav' => 'Video & Audio', 'icon' => 'clapperboard', 'primary' => true, 'blurb' => 'Turn videos into MP3, compress and cut clips, make GIFs and record your voice or screen.'],
        ['id' => 'qr', 'name' => 'QR code & barcode tools', 'nav' => 'QR & Barcode', 'icon' => 'qr-code', 'primary' => true, 'blurb' => 'Create and scan QR codes and barcodes for links, Wi-Fi, contacts and products.'],
        ['id' => 'share', 'name' => 'Create & share', 'nav' => 'Create & Share', 'icon' => 'gift', 'primary' => true, 'blurb' => 'Make a friendship quiz, host a giveaway or send an online wedding invitation, and share it with one link.'],
        ['id' => 'device', 'name' => 'Device tests', 'nav' => 'Device tests', 'icon' => 'monitor-smartphone', 'blurb' => 'Check your microphone, webcam, keyboard, mouse and screen in seconds, right in the browser.'],
        ['id' => 'random', 'name' => 'Generators & random', 'nav' => 'Generators', 'icon' => 'sparkles', 'blurb' => 'Passwords, giveaways, coin flips, dice and decision wheels.'],
        ['id' => 'health', 'name' => 'Health & fitness calculators', 'nav' => 'Health', 'icon' => 'heart-pulse', 'blurb' => 'Calories, BMI, body fat, water, sleep and pregnancy dates.'],
        ['id' => 'money', 'name' => 'Finance & business', 'nav' => 'Finance', 'icon' => 'wallet', 'blurb' => 'Loans, savings, budgets, debt, retirement, tax, invoices and quotes.'],
        ['id' => 'study', 'name' => 'Student tools', 'nav' => 'Students', 'icon' => 'graduation-cap', 'blurb' => 'GPA and grades, citations, flashcards and typing speed.'],
        ['id' => 'calc', 'name' => 'Calculators', 'nav' => 'Calculators', 'icon' => 'calculator', 'blurb' => 'Quick answers for percentages, loans, health and shopping.'],
        ['id' => 'time', 'name' => 'Time & dates', 'nav' => 'Time', 'icon' => 'clock', 'blurb' => 'Timers, stopwatches, ages and the days between dates.'],
        ['id' => 'convert', 'name' => 'Converters', 'nav' => 'Converters', 'icon' => 'repeat', 'blurb' => 'Units and colours.'],
        ['id' => 'dev', 'name' => 'Developer tools', 'nav' => 'Developer', 'icon' => 'code', 'blurb' => 'JSON, regex, hashes, UUIDs, JWTs, URLs, cron and CSS gradients.'],
        ['id' => 'home', 'name' => 'Home & DIY', 'nav' => 'Home & DIY', 'icon' => 'paint-roller', 'blurb' => 'Paint, tiles, concrete and what your appliances cost to run.'],
        ['id' => 'social', 'name' => 'Social media & greetings', 'nav' => 'Social', 'icon' => 'party-popper', 'blurb' => 'YouTube tools, birthday cards and personalised wishes.'],
        ['id' => 'life', 'name' => 'Everyday life', 'nav' => 'Life', 'icon' => 'house', 'blurb' => 'Split rent and trips fairly, plan dinners and check furniture fits.'],
    ],
];
