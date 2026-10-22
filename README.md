# TidyFigure

131 free online tools (PDF, image, video & audio, QR/barcode, text, health, finance & business, student, developer, home & DIY, social and more) in the AivraSol theme, with a PHP admin panel. Every tool runs in the visitor's browser: files are never uploaded, there are no API costs, and nothing needs regular data updates.

## Folders

| Folder | What it is |
|---|---|
| `src/tools/<slug>/` | One folder per tool: `tool.html` (inputs), `tool.js` (logic), `meta.js` (SEO title, description, article, FAQs) |
| `src/assets/` | Shared CSS (theme), `app.js` helpers, `pdf-pages.js` (PDF page grid), `scan.js` (QR/barcode scanner), `media.js` (video/audio helpers) |
| `src/php/` | Front controller, admin panel and YouTube API proxy |
| `build.js` | Builds everything below |
| `dist-php/` | **Upload this to cPanel / PHP hosting** (includes the admin panel) |
| `dist/` | Plain static version for hosts without PHP (no admin panel, no YouTube counter) |
| `preview/` | Open `preview/index.html` on your computer to browse locally |

## Build

```bash
npm install            # once: installs the icon set used at build time
node build.js          # add --words to see each page's word count
```

The build warns about SEO problems: titles over 65 characters, descriptions outside 110–160, missing icons or related tools, and pages under 400 words.

## Install on cPanel (PHP hosting)

1. Point your domain at the hosting account and turn on SSL (AutoSSL / Let's Encrypt in cPanel).
2. Upload the **contents** of `dist-php/` into `public_html` (or the domain's folder), including the hidden `.htaccess` files. File Manager → Upload a zip → Extract is easiest.
3. Make sure the `data/` folder is writable by PHP (permissions 755; use 775 if saving fails).
4. Visit `https://yourdomain.com/admin/` **straight away** and create the admin password. The first visitor to an un-configured admin panel sets the password, so do this immediately after uploading.
5. Submit `https://yourdomain.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

Requirements: PHP 8.0+, Apache or LiteSpeed with `mod_rewrite` (standard on cPanel). On nginx, send every request that isn't a real file to `index.php` and deny `/data`, `/inc` and `/pages`.

When you update the site later, upload the new files but **don't delete `data/settings.php`**, which holds your admin settings.

## Admin panel (`/admin/`)

- **Tools & SEO:** switch any tool on or off (it disappears from menus, sidebars and the sitemap, and returns 404), override the SEO title and meta description of any page with live character counters, and mark pages noindex.
- **Ads & analytics:** Google Analytics 4 ID, AdSense publisher ID (Auto ads), three fixed ad slots (below the tool, inside the article, top of sidebar), plus custom code for `<head>` and before `</body>`.
- **Site & API keys:** announcement bar, and the YouTube Data API key used by the subscriber counter (kept on the server, never shown to visitors).
- **Password:** change the admin password.

Security: hashed password, CSRF protection, session cookies limited to the admin, lockout for 15 minutes after 5 wrong passwords, and `data/` blocked from the web.

## Adding a tool

1. Copy a folder in `src/tools/` and rename it to the new URL slug.
2. Edit `tool.html`, `tool.js` and `meta.js`. In `tool.html`, `{{icon:name}}` inserts any [Lucide](https://lucide.dev/icons) icon. In `meta.js`, `libs: [...]` loads CDN libraries, `scripts: [...]` loads shared files from `src/assets`, and `use: 'other-tool'` with `preset` reuses another tool's code for a keyword landing page (see `wifi-qr-code-generator`).
3. Run `node build.js` and upload `dist-php/` again. The tool appears in the homepage, menus, sitemap, schema and admin panel automatically.

## SEO built into every page

- Unique title, meta description, canonical URL (follows your real domain automatically), Open Graph tags
- JSON-LD: `WebApplication`, `FAQPage` and `BreadcrumbList` on tools; `WebSite`, `Organization` and `ItemList` on the homepage
- A 40–60 word direct answer at the top (the format Google AI Overviews and featured snippets quote)
- 400–800 words of original content per tool: how it works, formulas, worked examples, tips and 5 FAQs
- Internal links: breadcrumbs, same-category sidebar, related tools, footer
- Fast static pages, mobile-first layout with hamburger menu, light and dark themes, accessible labels
- Dynamic `sitemap.xml` and `robots.txt` (admin and API paths disallowed)

## Notes

- PDF tools use pdf-lib and PDF.js, scanners use ZXing, barcodes use JsBarcode, QR codes use qrcode-generator, zips use JSZip, EXIF reading uses exifr and the invoice PDF uses html2canvas. All load from cdnjs or jsDelivr at pinned versions.
- Compress PDF re-renders pages as images (text becomes non-selectable); the page explains this to users.
- The YouTube Subscriber Counter needs the PHP version and a YouTube Data API key.
- Video tools (compressor, cutter) use the browser's built-in recorder, so they take as long as the clip to process. They save MP4 in Safari and recent Chrome, WebM elsewhere. MP3 encoding uses lamejs; GIFs use gifenc.
- Quotation Maker and Receipt Maker reuse the Invoice Generator code with a preset (`use` + `preset` in `meta.js`).
