#!/usr/bin/env node
'use strict';
// Builds the static site.
//   node build.js   -> dist/     (deploy this folder; clean URLs like /word-counter)
//                   -> preview/  (same pages with relative .html links, for opening locally)
// Add a tool: create src/tools/<slug>/ with meta.js, tool.html and tool.js, then rebuild.

const fs = require('fs');
const path = require('path');

const SITE = {
  name: 'TidyFigure',
  by: 'AivraSol', // shown in the footer
  byUrl: 'https://aivrasol.com',
  domain: 'https://tidyfigure.com', // change after you buy your domain
  email: 'hello@tidyfigure.com',
};

// Order here is the order on the homepage. icon = a lucide icon name.
const CATEGORIES = [
  { id: 'image', name: 'Image tools', nav: 'Image', icon: 'image', blurb: 'Compress, resize and convert photos without uploading them anywhere.' },
  { id: 'pdf', name: 'PDF tools', nav: 'PDF', icon: 'file-text', blurb: 'Merge, split and create PDFs right in your browser.' },
  { id: 'text', name: 'Text tools', nav: 'Text', icon: 'type', blurb: 'Count, clean up, convert and style text.' },
  { id: 'media', name: 'Video & audio tools', nav: 'Video & Audio', icon: 'clapperboard', blurb: 'Turn videos into MP3, compress and cut clips, make GIFs and record your voice or screen.' },
  { id: 'qr', name: 'QR code & barcode tools', nav: 'QR & Barcode', icon: 'qr-code', blurb: 'Create and scan QR codes and barcodes for links, Wi-Fi, contacts and products.' },
  { id: 'random', name: 'Generators & random', nav: 'Generators', icon: 'sparkles', blurb: 'Passwords, giveaways, coin flips, dice and decision wheels.' },
  { id: 'health', name: 'Health & fitness calculators', nav: 'Health', icon: 'heart-pulse', blurb: 'Calories, BMI, body fat, water, sleep and pregnancy dates.' },
  { id: 'money', name: 'Finance & business', nav: 'Finance', icon: 'wallet', blurb: 'Loans, savings, budgets, debt, retirement, tax, invoices and quotes.' },
  { id: 'study', name: 'Student tools', nav: 'Students', icon: 'graduation-cap', blurb: 'GPA and grades, citations, flashcards and typing speed.' },
  { id: 'calc', name: 'Calculators', nav: 'Calculators', icon: 'calculator', blurb: 'Quick answers for percentages, loans, health and shopping.' },
  { id: 'time', name: 'Time & dates', nav: 'Time', icon: 'clock', blurb: 'Timers, stopwatches, ages and the days between dates.' },
  { id: 'convert', name: 'Converters', nav: 'Converters', icon: 'repeat', blurb: 'Units and colours.' },
  { id: 'dev', name: 'Developer tools', nav: 'Developer', icon: 'code', blurb: 'JSON, regex, hashes, UUIDs, JWTs, URLs, cron and CSS gradients.' },
  { id: 'home', name: 'Home & DIY', nav: 'Home & DIY', icon: 'paint-roller', blurb: 'Paint, tiles, concrete and what your appliances cost to run.' },
  { id: 'social', name: 'Social media & greetings', nav: 'Social', icon: 'party-popper', blurb: 'YouTube tools, birthday cards and personalised wishes.' },
  { id: 'life', name: 'Everyday life', nav: 'Life', icon: 'house', blurb: 'Split rent and trips fairly, plan dinners and check furniture fits.' },
];

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const TOOLS_DIR = path.join(SRC, 'tools');
const ICONS = path.join(ROOT, 'node_modules', 'lucide-static', 'icons');
const FONTS = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const strip = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const ld = obj => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

// Inline SVG icon from lucide-static (npm i). Falls back to a plain circle if missing.
const iconCache = {};
function icon(name, cls = 'i') {
  if (!iconCache[name]) {
    const file = path.join(ICONS, `${name}.svg`);
    let svg = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>';
    svg = svg.replace(/<!--.*?-->/s, '').replace(/\s*class="[^"]*"/, '').replace(/\s*width="24"/, '').replace(/\s*height="24"/, '').replace(/\n\s*/g, ' ').trim();
    iconCache[name] = svg;
  }
  return iconCache[name].replace('<svg', `<svg class="${cls}" aria-hidden="true" focusable="false"`);
}

// ---------- load tools ----------
const tools = fs.readdirSync(TOOLS_DIR)
  .filter(d => fs.existsSync(path.join(TOOLS_DIR, d, 'meta.js')))
  .map(slug => {
    const dir = path.join(TOOLS_DIR, slug);
    const meta = require(path.join(dir, 'meta.js'));
    // A landing page can reuse another tool's markup and script with a preset (meta.use + meta.preset).
    const codeDir = meta.use ? path.join(TOOLS_DIR, meta.use) : dir;
    const html = fs.readFileSync(path.join(codeDir, 'tool.html'), 'utf8').replace(/\{\{icon:([a-z0-9-]+)\}\}/g, (m, n) => icon(n));
    let js = fs.readFileSync(path.join(codeDir, 'tool.js'), 'utf8');
    if (meta.use) js = `const PRESET = ${JSON.stringify(meta.preset ?? null)};\n` + js;
    if (meta.use && !meta.libs) meta.libs = require(path.join(codeDir, 'meta.js')).libs;
    return { ...meta, slug, html, js };
  })
  .sort((a, b) => CATEGORIES.findIndex(c => c.id === a.category) - CATEGORIES.findIndex(c => c.id === b.category) || (a.order ?? 99) - (b.order ?? 99));
const bySlug = Object.fromEntries(tools.map(t => [t.slug, t]));

// ---------- SEO sanity checks ----------
const warnings = [];
for (const t of tools) {
  for (const k of ['name', 'title', 'description', 'category', 'answer', 'article', 'faqs', 'short', 'icon']) if (!t[k]) warnings.push(`${t.slug}: missing "${k}"`);
  if (t.title && t.title.length > 65) warnings.push(`${t.slug}: title is ${t.title.length} chars (aim for ≤ 65)`);
  if (t.description && (t.description.length < 110 || t.description.length > 160)) warnings.push(`${t.slug}: description is ${t.description.length} chars (aim for 110–160)`);
  if (!CATEGORIES.find(c => c.id === t.category)) warnings.push(`${t.slug}: unknown category "${t.category}"`);
  if (t.icon && !fs.existsSync(path.join(ICONS, `${t.icon}.svg`))) warnings.push(`${t.slug}: icon "${t.icon}" not found`);
  for (const r of t.related || []) if (!bySlug[r]) warnings.push(`${t.slug}: related tool "${r}" does not exist`);
  for (const [, r] of (t.article || '').matchAll(/href="\/([a-z0-9-]+)"/g)) if (!bySlug[r]) warnings.push(`${t.slug}: article links to missing tool "${r}"`);
  t.wordCount = strip(t.answer + ' ' + t.article + ' ' + (t.faqs || []).flat().join(' ')).split(' ').length;
  if (t.wordCount < 400) warnings.push(`${t.slug}: only ${t.wordCount} words of content (aim for 400+)`);
}

// ---------- templates ----------
function build(mode) {
  // prod: static site · php: pages for the PHP front controller + admin panel · preview: relative links
  const php = mode === 'php';
  const prod = mode === 'prod' || php;
  const out = path.join(ROOT, { prod: 'dist', php: 'dist-php', preview: 'preview' }[mode]);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const pagesDir = php ? path.join(out, 'pages') : out;
  fs.mkdirSync(pagesDir, { recursive: true });

  const link = slug => prod ? (slug === 'index' ? '/' : `/${slug}`) : `${slug}.html`;
  const asset = f => prod ? `/${f}` : f;
  const abs = slug => SITE.domain + (slug === 'index' ? '/' : `/${slug}`);
  const tile = (t, cls = '') => `<span class="tile ${cls}" data-cat="${t.category}">${icon(t.icon)}</span>`;

  const head = ({ title, description, slug, schema }) => `<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${abs(slug)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(slug)}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#FF5B35">
<link rel="icon" href="${asset('favicon.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${asset('style.css')}">
${schema.map(ld).join('\n')}
<!--TF:HEAD-->`;

  const logo = `<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="4" fill="var(--slate)"/><path d="M9 11h14M16 11v12" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="23" cy="22" r="2.6" fill="var(--accent)"/></svg>`;
  const header = `<header class="site"><div class="wrap">
<a class="brand" href="${link('index')}">${logo}<span>${SITE.name.replace(/^(\w+?)(Figure)$/, '$1<b>$2</b>')}</span></a>
<button type="button" class="nav-toggle" aria-expanded="false" aria-controls="main-nav"><svg class="bars" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><svg class="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>Menu</button>
<nav class="main-nav" id="main-nav" aria-label="Main">${CATEGORIES.map(c => `<a href="${link('index')}#${c.id}" data-cat="${c.id}"${['image', 'pdf', 'media', 'qr', 'money'].includes(c.id) ? '' : ' class="more"'}>${icon(c.icon)}${esc(c.nav)}</a>`).join('')}<a class="cta" href="${link('index')}#tools">All tools</a></nav>
</div></header><div class="nav-shade"></div>
<!--TF:BODY_TOP-->`;
  const footer = `<footer class="foot"><div class="wrap">
${CATEGORIES.map(c => `<div><h2>${esc(c.name)}</h2><ul>${tools.filter(t => t.category === c.id).slice(0, 5).map(t => `<li data-slug="${t.slug}"><a href="${link(t.slug)}">${esc(t.name)}</a></li>`).join('')}</ul></div>`).join('\n')}
<div class="legal"><span>© ${new Date().getFullYear()} ${SITE.name}. Free online tools, built by <a href="${SITE.byUrl}" rel="noopener">${SITE.by}</a>. Your files never leave your device.</span>
<span><a href="${link('about')}">About</a> · <a href="${link('privacy')}">Privacy</a> · <a href="${link('index')}#tools">All tools</a></span></div>
</div></footer>`;
  // Hamburger menu: open/close, close on link tap, Escape, or tapping outside.
  const navJs = `<script>(function(){var b=document.querySelector('.nav-toggle'),r=document.documentElement;if(!b)return;function set(o){r.classList.toggle('nav-open',o);b.setAttribute('aria-expanded',o)}b.addEventListener('click',function(){set(!r.classList.contains('nav-open'))});document.querySelector('.nav-shade').addEventListener('click',function(){set(false)});document.querySelectorAll('.main-nav a').forEach(function(a){a.addEventListener('click',function(){set(false)})});document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)})})();</script>`;

  const doc = (opts, body, scripts = '') => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head(opts)}
</head>
<body>
${header}
${body}
${footer}
${navJs}
${scripts}
<!--TF:BODY_END-->
</body>
</html>
`;

  const card = t => `<li data-slug="${t.slug}" data-name="${esc((t.name + ' ' + t.short + ' ' + (t.keywords || '')).toLowerCase())}"><a class="card" data-cat="${t.category}" href="${link(t.slug)}">${tile(t)}<div><strong>${esc(t.name)}</strong><span>${esc(t.short)}</span>${t.popular ? '<em class="badge">Popular</em>' : ''}</div></a></li>`;
  const sideLink = t => `<li data-slug="${t.slug}"><a href="${link(t.slug)}">${tile(t)}${esc(t.name)}</a></li>`;
  const write = (file, html) => fs.writeFileSync(path.join(/\.html$/.test(file) ? pagesDir : out, file), html);

  // ----- tool pages -----
  for (const t of tools) {
    const cat = CATEGORIES.find(c => c.id === t.category);
    const same = tools.filter(x => x.category === t.category && x !== t).slice(0, 7);
    const related = (t.related || []).map(r => bySlug[r]).filter(x => x && !same.includes(x));
    const popular = tools.filter(x => x.popular && x !== t && !same.includes(x) && !related.includes(x)).slice(0, 6 - Math.min(related.length, 6));
    const schema = [
      {
        '@context': 'https://schema.org', '@type': 'WebApplication', name: t.name, url: abs(t.slug),
        description: t.description, applicationCategory: t.appCategory || 'UtilitiesApplication', operatingSystem: 'Any (runs in a web browser)',
        browserRequirements: 'Requires JavaScript', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@type': 'Organization', name: SITE.name, url: SITE.domain },
      },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: t.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: strip(a) } })) },
      {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: abs('index') },
          { '@type': 'ListItem', position: 2, name: cat.name, item: abs('index') + '#' + cat.id },
          { '@type': 'ListItem', position: 3, name: t.name, item: abs(t.slug) },
        ],
      },
    ];
    const body = `<main class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="${link('index')}">Home</a><span aria-hidden="true">/</span><a href="${link('index')}#${cat.id}">${esc(cat.name)}</a><span aria-hidden="true">/</span><span>${esc(t.name)}</span></nav>
<div class="tool-head">${tile(t, 'lg')}<h1>${esc(t.name)}</h1></div>
<p class="answer">${t.answer}</p>
<section class="tool" aria-label="${esc(t.name)}">
${t.html}
</section>
<!--TF:AD:top-->
<p class="private">${icon('shield-check')}${t.files ? 'Your files are processed on your device and never uploaded.' : 'Everything runs in your browser. Nothing you type is sent anywhere.'}</p>
<div class="layout">
<article class="prose">
${t.article.replace(/href="\/([a-z0-9-]+)"/g, (m, s) => `href="${link(s)}"`)}
<!--TF:AD:article-->
<h2>Frequently asked questions</h2>
${t.faqs.map(([q, a]) => `<details class="faq"><summary>${esc(q)}</summary><p>${a}</p></details>`).join('\n')}
</article>
<aside class="side">
<!--TF:AD:side-->
${same.length ? `<section aria-labelledby="side-a"><h2 id="side-a">More ${esc(cat.name.toLowerCase())}</h2><ul>${same.map(sideLink).join('')}</ul></section>` : ''}
${related.length + popular.length ? `<section aria-labelledby="side-b"><h2 id="side-b">You might also need</h2><ul>${[...related, ...popular].slice(0, 6).map(sideLink).join('')}</ul></section>` : ''}
</aside>
</div>
</main>`;
    const libs = (t.libs || []).map(src => `<script src="${src}"></script>`).join('\n');
    const scripts = `${libs}\n<script src="${asset('app.js')}"></script>\n${(t.scripts || []).map(f => `<script src="${asset(f)}"></script>`).join('\n')}\n<script>\n(function () {\n${t.js}\n})();\n</script>`;
    write(`${t.slug}.html`, doc({ title: t.title, description: t.description, slug: t.slug, schema }, body, scripts));
  }

  // ----- homepage -----
  const homeTitle = `${SITE.name}: Free Online Tools for Images, PDFs, Text & More`;
  const homeDesc = `${tools.length} free online tools that run in your browser: compress images, merge PDFs, count words, make QR codes, calculate percentages and more. No sign-up.`;
  const homeSchema = [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.domain, description: homeDesc },
    { '@context': 'https://schema.org', '@type': 'Organization', name: SITE.name, url: SITE.domain, logo: SITE.domain + '/favicon.svg' },
    { '@context': 'https://schema.org', '@type': 'ItemList', name: `${SITE.name} tools`, itemListElement: tools.map((t, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(t.slug), name: t.name })) },
  ];
  const homeBody = `<main class="wrap">
<section class="hero">
<p class="eyebrow">${tools.length} free tools · no sign-up</p>
<h1>Free online tools that <em>just work</em>.</h1>
<p>${tools.length} fast, private tools for images, PDFs, text, numbers and everyday life. No sign-up, no watermarks, and your files never leave your device.</p>
<div class="search" role="search">${icon('search')}<label class="sr-only" for="q">Search tools</label><input id="q" type="search" placeholder="Search ${tools.length} tools, e.g. compress image, word count, QR code" autocomplete="off"></div>
<ul class="stats"><li>${icon('shield-check')}Files stay on your device</li><li>${icon('zap')}Instant results</li><li>${icon('smartphone')}Works on any phone</li><li>${icon('badge-check')}100% free</li></ul>
<nav class="catnav" aria-label="Categories">${CATEGORIES.map(c => `<a href="#${c.id}" data-cat="${c.id}">${icon(c.icon)}${esc(c.nav)}</a>`).join('')}</nav>
</section>
<div id="tools">
${CATEGORIES.map(c => {
    const list = tools.filter(t => t.category === c.id);
    return list.length ? `<section class="cat" id="${c.id}" aria-labelledby="h-${c.id}"><div class="cat-head"><h2 id="h-${c.id}">${esc(c.name)}</h2><p>${esc(c.blurb)}</p></div><ul class="cards">${list.map(card).join('')}</ul></section>` : '';
  }).join('\n')}
<p class="no-results" id="none" hidden>No tool matches that search yet.</p>
</div>
</main>`;
  const homeJs = `<script>
(function () {
  var q = document.getElementById('q');
  q.addEventListener('input', function () {
    var v = q.value.trim().toLowerCase(), any = false;
    document.querySelectorAll('#tools .cat').forEach(function (sec) {
      var shown = 0;
      sec.querySelectorAll('li[data-name]').forEach(function (li) {
        var hit = !v || v.split(/\\s+/).every(function (w) { return li.dataset.name.indexOf(w) > -1; });
        li.hidden = !hit; if (hit) shown++;
      });
      sec.hidden = !shown; if (shown) any = true;
    });
    document.getElementById('none').hidden = any;
  });
})();
</script>`;
  write('index.html', doc({ title: homeTitle, description: homeDesc, slug: 'index', schema: homeSchema }, homeBody, homeJs));

  // ----- about & privacy (needed for trust and for ad-network approval) -----
  const simple = (slug, title, description, inner) => write(`${slug}.html`, doc(
    { title, description, slug, schema: [{ '@context': 'https://schema.org', '@type': 'WebPage', name: title, url: abs(slug) }] },
    `<main class="wrap"><article class="prose page">${inner}</article></main>`));

  simple('about', `About ${SITE.name}`, `${SITE.name} makes fast, free online tools for images, PDFs, text and everyday maths. Everything runs in your browser, so your files stay private.`, `
<h1>About ${SITE.name}</h1>
<p>${SITE.name} is a collection of free online tools for the small jobs that come up every day: shrinking a photo for an email, merging two PDFs, counting the words in an essay, making a QR code, or working out a percentage.</p>
<p>Every tool runs entirely in your web browser. When you compress an image or merge a PDF, the file is processed on your own device and is never uploaded to a server. That makes the tools faster and keeps your files private.</p>
<h2>Accuracy</h2>
<p>Calculator pages explain the formula they use and show a worked example, so you can check the result yourself. For legal, medical or financial decisions, please check with a qualified professional.</p>
<h2>Contact</h2>
<p>Found a bug or want a new tool? Email <strong>${esc(SITE.email)}</strong>.</p>`);

  simple('privacy', `Privacy Policy | ${SITE.name}`, `How ${SITE.name} handles your data: files and text are processed in your browser and are never uploaded or stored on our servers.`, `
<h1>Privacy policy</h1>
<p>Last updated: ${new Date().toISOString().slice(0, 10)}</p>
<h2>Your files and text</h2>
<p>All tools run in your browser. Files you open (images, PDFs) and text you type are processed on your device. They are not uploaded to us or stored on our servers.</p>
<h2>Analytics and advertising</h2>
<p>We may use privacy-respecting analytics to count page visits, and we may show advertising to keep the tools free. Advertising partners such as Google may use cookies to show ads based on your visits to this and other websites. You can opt out of personalised advertising at <a href="https://adssettings.google.com" rel="nofollow">Google Ad Settings</a>.</p>
<h2>Contact</h2>
<p>Questions about privacy: <strong>${esc(SITE.email)}</strong>.</p>`);

  for (const f of fs.readdirSync(path.join(SRC, 'assets'))) fs.copyFileSync(path.join(SRC, 'assets', f), path.join(out, f));

  if (php) {
    fs.cpSync(path.join(SRC, 'php'), out, { recursive: true });
    fs.writeFileSync(path.join(out, 'data', 'tools.json'), JSON.stringify({ site: SITE, categories: CATEGORIES.map(({ id, name }) => ({ id, name })), tools: tools.map(t => ({ slug: t.slug, name: t.name, category: t.category, title: t.title, description: t.description })) }, null, 1));
  }
  if (prod && !php) {
    const today = new Date().toISOString().slice(0, 10);
    const urls = ['index', ...tools.map(t => t.slug), 'about', 'privacy'];
    write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${abs(u)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
    write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE.domain}/sitemap.xml\n`);
    write('vercel.json', JSON.stringify({ cleanUrls: true, trailingSlash: false }, null, 2) + '\n');
  }
  if (prod) {
    write('404.html', doc({ title: `Page not found | ${SITE.name}`, description: 'This page does not exist.', slug: 'index', schema: [] },
      `<main class="wrap"><article class="prose page"><h1>Page not found</h1><p>That page doesn't exist. <a href="/">See all ${tools.length} tools</a>.</p></article></main>`));
  }
  return out;
}

const dist = build('prod');
const distPhp = fs.existsSync(path.join(SRC, 'php')) ? build('php') : null;
const preview = build('preview');
console.log(`Built ${tools.length} tools -> ${path.relative(ROOT, dist)}/ and ${path.relative(ROOT, preview)}/`);
if (process.argv.includes('--words')) for (const t of tools) console.log(`  ${t.slug.padEnd(30)} ${String(t.wordCount).padStart(5)} words`);
if (warnings.length) { console.log('\nSEO warnings:'); warnings.forEach(w => console.log('  - ' + w)); }
