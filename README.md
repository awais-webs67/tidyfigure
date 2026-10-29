# TidyFigure

178 free online tools (PDF, image, video & audio, QR/barcode, text, device tests, health, finance & business, student, developer, home & DIY, social and more) in the AivraSol theme, with an admin panel.

**Plain PHP + MySQL.** No Node, npm or build step: clone the repo into your web folder and it runs. Every tool runs in the visitor's browser, so files are never uploaded and there are no API costs.

## Folders

| Path | What it is |
|---|---|
| `index.php` | Front controller: renders every page (homepage, tools, sitemap.xml, robots.txt) |
| `tools/<slug>/` | One folder per tool: `meta.php` (name, SEO title, description, article, FAQs), `tool.html` (inputs), `tool.js` (logic) |
| `app/site.php` | Site name and the list of categories |
| `app/bootstrap.php`, `app/render.php` | Database connection, settings, page templates |
| `app/schema.sql` | MySQL tables (the installer creates them) |
| `app/icons/` | SVG icons ([Lucide](https://lucide.dev/icons)) |
| `assets/` | CSS theme and shared JavaScript |
| `admin/` | Admin panel |
| `install/` | One-time installer |
| `api/youtube.php` | Server side of the YouTube Subscriber Counter |
| `storage/cache/` | Cache of the tool list (must be writable) |

`app/`, `tools/`, `storage/`, `config.php` and hidden files such as `.git` are blocked from the web by `.htaccess`.

## Install on Hostinger with Git

1. **Empty the site folder:** hPanel → Websites → Manage → Files → File Manager → open `public_html` and delete the default files (such as `default.php`). Git can only deploy into an empty folder.
2. **PHP:** hPanel → Advanced → PHP Configuration → choose PHP 8.2 or newer. Check that `pdo_mysql`, `mbstring` and `gd` are ticked under PHP extensions (they are by default).
3. **Connect the repository:** hPanel → Advanced → **GIT**.
   - Public repository: Repository `https://github.com/awais-webs67/tidyfigure.git`, Branch `main`, Directory empty (= `public_html`). Click **Create**.
   - Private repository: first copy the **SSH key** shown on the same page, add it in GitHub → repository → Settings → **Deploy keys** → Add deploy key (read access is enough), then use the address `git@github.com:awais-webs67/tidyfigure.git`.
   - Click **Deploy** next to the repository.
4. **Automatic updates (optional):** on the GIT page, turn on **Auto Deployment** and copy the webhook URL. In GitHub → Settings → **Webhooks** → Add webhook, paste it as the Payload URL, keep “Just the push event”, and save. Every push to `main` then updates the site.
5. **Database:** hPanel → Databases → Management → create a database, user and password. Note them down (Hostinger adds a prefix such as `u123456789_`). The host is `localhost`.
6. **SSL:** hPanel → Security → SSL: make sure the free SSL is active for the domain (it can take a few minutes after the domain is connected).
7. **Install:** open `https://YOUR-DOMAIN/install/` straight away and enter the database details and your admin username and password.
8. Sign in at `/admin/`, then submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

To update by hand: hPanel → Advanced → GIT → **Deploy**. `config.php` isn’t in Git, so updates never overwrite it.

## Install on cPanel with Git

1. **Subdomain:** cPanel → Domains → create `tidyfigure.yourdomain.com`. Note its **document root** (for example `/home/USER/tidyfigure.yourdomain.com`).
2. **Clone:** cPanel → Git Version Control → Create → Clone URL `https://github.com/awais-webs67/tidyfigure.git`, Repository Path = the subdomain's document root (the folder must be empty or not exist yet).
   If you already cloned it somewhere else, go to Domains → Manage the subdomain and set its document root to the clone folder (the folder that contains `index.php`).
3. **Database:** cPanel → MySQL Databases → create a database and a user, then "Add user to database" with **ALL PRIVILEGES**.
4. **SSL:** cPanel → SSL/TLS Status → run AutoSSL for the subdomain. (Until it has SSL, remove the two "Force HTTPS" lines from `.htaccess`.)
5. **Install:** open `https://tidyfigure.yourdomain.com/install/` and enter the database details and your admin username and password. **Do this straight after cloning:** until it's done, anyone who finds `/install/` could set it up.
6. Sign in at `/admin/`.
7. Submit `https://tidyfigure.yourdomain.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

Requirements: PHP 8.0+ with PDO MySQL and mbstring, MySQL 5.7+ or MariaDB 10.3+, Apache or LiteSpeed with `mod_rewrite` (standard on cPanel). If the installer can't write `config.php`, it shows the text to paste into a new `config.php` file (see `config.sample.php`).

## Updating

cPanel → Git Version Control → Manage → **Pull or Deploy** → **Update from Remote**. Your `config.php` and database are never touched by updates, because `config.php` isn't in Git.

## Admin panel (`/admin/`)

- **Tools & SEO:** switch any tool on or off (it disappears from menus, sidebars and the sitemap, and returns 404), override the SEO title and meta description of any page with live character counters, mark pages noindex, set the homepage title and description.
- **Ads & analytics:** Google Analytics 4 ID, AdSense publisher ID (Auto ads, site-verification tag and `/ads.txt` are added automatically), three fixed ad slots (below the tool, inside the article, top of the sidebar), plus custom code for `<head>` and before `</body>`.
- **Usage limits:** free downloads per tool per day (a default for all tools, or per tool under Tools → Edit SEO). When the limit is reached, visitors are asked to come back tomorrow, or offered a Google Ad Manager **rewarded ad** to unlock more. AdSense doesn’t allow rewarding people for viewing ordinary ads, so only use an Ad Manager rewarded ad unit.
- **Site & API keys:** announcement bar, YouTube Data API key (kept on the server), contact email.
- **Account:** change your username and password.

Everything is stored in MySQL: tables `tf_settings`, `tf_tools`, `tf_admins`, `tf_login_attempts` and `tf_yt_cache` (prefix chosen at install).

Security: hashed passwords, CSRF protection, session cookies limited to `/admin/`, lockout for 15 minutes after 5 wrong passwords, and changing the password signs out other sessions.

## Adding or editing a tool

1. Copy a folder in `tools/` (for example `tools/tip-calculator`) and rename it to the new URL slug, like `tools/my-new-tool`.
2. Edit the three files:
   - `meta.php`: `name`, `category` (an id from `app/site.php`), `order`, `icon` (a file name in `app/icons`), `title` (≤ 65 characters), `description` (110–160), `short`, `keywords`, `related` (other slugs), `answer` (the 40–60 word answer at the top), `article` (HTML), `faqs`. Optional: `aka` (other names people search for, shown under the intro and used in search), `popular`, `files` (true for file tools), `libs` (CDN script URLs, or `vendor/…` for copies hosted in `assets/vendor`), `scripts` (files in `assets/`, like `media.js` or `color.js`).
   - `tool.html`: the inputs. `{{icon:name}}` inserts an icon.
   - `tool.js`: the logic. Helpers from `assets/app.js` (`$`, `val`, `fmt`, `onAny`, `fileDrop`, `download`…) are available.
3. Upload or push it. The tool appears on the homepage, in menus, sidebars, the sitemap and the admin panel automatically.

A landing page can reuse another tool's code: set `'use' => 'other-tool'` and a `'preset'` in `meta.php` (see `wifi-qr-code-generator` and `quotation-maker`). To add an icon, download its SVG from lucide.dev into `app/icons/`.

## SEO built into every page

- Unique title, meta description, canonical URL (follows your real domain automatically), Open Graph tags
- JSON-LD: `WebApplication`, `FAQPage` and `BreadcrumbList` on tools; `WebSite`, `Organization` and `ItemList` on the homepage
- A 40–60 word direct answer at the top (the format Google AI Overviews and featured snippets quote)
- 400–800 words of original content per tool: how it works, formulas, worked examples, tips and 5 FAQs
- Internal links: breadcrumbs, same-category sidebar, related tools, footer
- Mobile-first layout with hamburger menu, light and dark themes, accessible labels
- Dynamic `sitemap.xml` (with each tool's last-modified date) and `robots.txt`

## Notes

- PDF tools use pdf-lib and PDF.js, scanners use ZXing, barcodes JsBarcode, QR codes qrcode-generator, zips JSZip, EXIF exifr, invoice PDFs html2canvas, MP3 encoding lamejs, GIFs gifenc and bcrypt hashes bcrypt.js. Libraries load from cdnjs at pinned versions, except those hosted in `assets/vendor` (and PDF fonts in `assets/fonts`) so tools keep working where jsDelivr is blocked.
- Video tools (compressor, cutter) use the browser's built-in recorder, so they take as long as the clip to process. They save MP4 in Safari and recent Chrome, WebM elsewhere.
- The YouTube Subscriber Counter needs a YouTube Data API key (Admin → Site & API keys).
- Public pages work even before installation or if MySQL is down; they use the default settings until the database is reachable.
- On nginx instead of Apache: send every request that isn't a real file to `index.php`, and deny `/app`, `/tools`, `/storage`, `/config.php` and hidden files.
