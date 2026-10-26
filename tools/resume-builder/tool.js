// Resume builder. One layout engine measures text with the real font metrics (pdf-lib) and produces drawing
// instructions; the same instructions draw the on-screen preview and the PDF, so they always match.
const KEY = 'tf-resume';
const FONT_FILES = { sans: ['inter', 400], sansBold: ['inter', 700], serif: ['merriweather', 400], serifBold: ['merriweather', 700] };
const SAMPLE = {
  name: 'Ayesha Rahman', title: 'Digital Marketing Manager', email: 'ayesha.rahman@email.com', phone: '+44 7700 900123', location: 'Manchester, UK', link: 'linkedin.com/in/ayesharahman',
  summary: 'Marketing manager with 7 years of experience growing brands through search, social and email. Led campaigns that doubled online sales for a national retailer. Comfortable with data, budgets and leading small teams.',
  exp: [
    { role: 'Digital Marketing Manager', org: 'Northwind Retail', place: 'Manchester', from: 'Mar 2022', to: 'Present', text: 'Grew online revenue from £4.1m to £8.6m in two years\nManage a £600k yearly ad budget across Google, Meta and TikTok\nLead a team of four specialists and two agencies' },
    { role: 'Senior SEO Specialist', org: 'BrightPath Agency', place: 'Leeds', from: 'Jun 2019', to: 'Feb 2022', text: 'Raised organic traffic by 180% for 12 e-commerce clients\nBuilt reporting dashboards used across the agency' },
    { role: 'Marketing Assistant', org: 'Greenleaf Foods', place: 'Leeds', from: 'Sep 2017', to: 'May 2019', text: 'Ran weekly email campaigns to 40,000 subscribers\nCoordinated product launches with retail partners' },
  ],
  edu: [{ degree: 'BA (Hons) Marketing', school: 'University of Leeds', from: '2014', to: '2017', text: 'First-class honours' }],
  skills: 'SEO, Google Ads, Meta Ads, Google Analytics 4, Email marketing, Content strategy, A/B testing, Budget management, Team leadership',
  langs: 'English (native), Urdu (fluent), French (basic)', certs: 'Google Ads Search Certification, 2025\nHubSpot Content Marketing, 2024', photo: '',
};
const BLANK = { name: '', title: '', email: '', phone: '', location: '', link: '', summary: '', exp: [{}], edu: [{}], skills: '', langs: '', certs: '', photo: '' };

let R;
try { R = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { R = null; }
R = Object.assign({}, SAMPLE, R || {});

// ---------- form ----------
const expRow = v => `<label class="f f-name"><span>Job title</span><input data-f="role" type="text" value="${esc(v.role ?? '')}"></label>
  <label class="f f-name"><span>Company</span><input data-f="org" type="text" value="${esc(v.org ?? '')}"></label>
  <label class="f"><span>City</span><input data-f="place" type="text" value="${esc(v.place ?? '')}"></label>
  <label class="f"><span>From</span><input data-f="from" type="text" value="${esc(v.from ?? '')}" placeholder="Mar 2022"></label>
  <label class="f"><span>To</span><input data-f="to" type="text" value="${esc(v.to ?? '')}" placeholder="Present"></label>
  <label class="f" style="flex-basis:100%"><span>Achievements (one per line, becomes bullet points)</span><textarea data-f="text" style="min-height:80px">${esc(v.text ?? '')}</textarea></label>
  <button type="button" class="rm" aria-label="Remove this job">×</button>`;
const eduRow = v => `<label class="f f-name"><span>Degree or course</span><input data-f="degree" type="text" value="${esc(v.degree ?? '')}"></label>
  <label class="f f-name"><span>School / university</span><input data-f="school" type="text" value="${esc(v.school ?? '')}"></label>
  <label class="f"><span>From</span><input data-f="from" type="text" value="${esc(v.from ?? '')}"></label>
  <label class="f"><span>To</span><input data-f="to" type="text" value="${esc(v.to ?? '')}"></label>
  <label class="f" style="flex-basis:100%"><span>Details (optional)</span><input data-f="text" type="text" value="${esc(v.text ?? '')}"></label>
  <button type="button" class="rm" aria-label="Remove">×</button>`;
function fill() {
  $$('[data-k]').forEach(el => { el.value = R[el.dataset.k] || ''; });
  $('#exp').innerHTML = ''; $('#edu').innerHTML = '';
  makeListOnce();
  (R.exp.length ? R.exp : [{}]).forEach(v => addRow('#exp', expRow, v));
  (R.edu.length ? R.edu : [{}]).forEach(v => addRow('#edu', eduRow, v));
}
function addRow(sel, html, v) { const r = document.createElement('div'); r.className = 'row'; r.innerHTML = html(v); $(sel).appendChild(r); return r; }
let listsReady = false;
function makeListOnce() {
  if (listsReady) return;
  listsReady = true;
  [['#exp', '#add-exp', expRow], ['#edu', '#add-edu', eduRow]].forEach(([l, b, h]) => {
    $(b).addEventListener('click', () => { addRow(l, h, {}).querySelector('input').focus(); changed(); });
    $(l).addEventListener('click', e => { const x = e.target.closest('.rm'); if (x && $(l).children.length > 1) { x.closest('.row').remove(); changed(); } });
  });
}
function read() {
  $$('[data-k]').forEach(el => { R[el.dataset.k] = el.value; });
  R.exp = $$('#exp .row').map(r => Object.fromEntries($$('[data-f]', r).map(i => [i.dataset.f, i.value])));
  R.edu = $$('#edu .row').map(r => Object.fromEntries($$('[data-f]', r).map(i => [i.dataset.f, i.value])));
}
let timer;
function changed() { clearTimeout(timer); timer = setTimeout(() => { read(); try { localStorage.setItem(KEY, JSON.stringify(R)); } catch (e) { /* storage full or blocked */ } render(); }, 250); }
$('#form').addEventListener('input', changed);
onAny('input[name="tpl"], #accent', changed);
$('#photo').addEventListener('change', async () => {
  const f = $('#photo').files[0]; if (!f) return;
  const img = await loadImage(f), c = document.createElement('canvas'), s = Math.min(img.width, img.height);
  c.width = c.height = 360;
  c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 360, 360);
  R.photo = c.toDataURL('image/jpeg', 0.88); changed();
});
$('#blank').onclick = () => { if (!confirm('Clear the form and start a blank resume?')) return; R = JSON.parse(JSON.stringify(BLANK)); fill(); changed(); };
$('#export').onclick = () => { read(); download(new Blob([JSON.stringify(R, null, 1)], { type: 'application/json' }), `${(R.name || 'resume').replace(/\s+/g, '-').toLowerCase()}-resume.json`); };
$('#import').onchange = async e => { try { R = Object.assign({}, BLANK, JSON.parse(await e.target.files[0].text())); fill(); changed(); } catch (err) { alert('That file isn’t a saved resume.'); } };

// ---------- fonts ----------
let FONTS = null;
async function fonts() {
  if (!FONTS) FONTS = (async () => {
    if (!window.PDFLib) await loadScript(PDFLIB_URL);
    const entries = await Promise.all(Object.entries(FONT_FILES).map(async ([k, [n, w]]) => [k, await fontBytes(n, w)]));
    const bytes = Object.fromEntries(entries);
    for (const [k, b] of entries) { const ff = new FontFace('rb-' + k, b.slice(0)); await ff.load(); document.fonts.add(ff); }
    return bytes;
  })();
  FONTS.catch(() => { FONTS = null; }); // try again next time instead of keeping the failure
  return FONTS;
}

// ---------- layout ----------
const W = 595.28, H = 841.89;
async function build(forPdf) {
  const bytes = await fonts(), { PDFDocument, rgb } = PDFLib;
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const F = {};
  for (const k of Object.keys(bytes)) F[k] = await pdf.embedFont(bytes[k], { subset: true });
  // Characters the font can't draw are replaced (é stays é; unusual symbols become their closest letter).
  const clean = (s, f) => [...String(s || '')].map(ch => { const cp = ch.codePointAt(0); if (cp < 32) return ' '; if (f.embedder.font.hasGlyphForCodePoint(cp)) return ch; const b = ch.normalize('NFKD').replace(/[̀-ͯ]/g, ''); return b && f.embedder.font.hasGlyphForCodePoint(b.codePointAt(0)) ? b : ''; }).join('');
  const tpl = $('input[name="tpl"]:checked').value, accent = $('#accent').value;
  const pages = [[]];
  let page = pages[0];
  const width = (s, f, size) => F[f].widthOfTextAtSize(clean(s, F[f]), size);
  const text = (str, x, y, f, size, color = '#1f2328') => { str = clean(str, F[f]); if (str) page.push({ t: 'text', str, x, y, f, size, color }); };
  const rect = (x, y, w, h, color) => page.push({ t: 'rect', x, y, w, h, color });
  const line = (x1, y1, x2, y2, color, th = 0.8) => page.push({ t: 'line', x1, y1, x2, y2, color, th });
  const wrap = (str, f, size, maxW) => {
    const out = [];
    for (const para of String(str || '').split('\n')) {
      let cur = '';
      for (const w of para.split(/\s+/).filter(Boolean)) { const t = cur ? cur + ' ' + w : w; if (cur && width(t, f, size) > maxW) { out.push(cur); cur = w; } else cur = t; }
      if (cur) out.push(cur);
    }
    return out;
  };
  const M = 44, modern = tpl === 'modern', SB = modern ? 186 : 0;
  const X = modern ? SB + 26 : M, CW = W - X - M;
  const serif = tpl === 'classic';
  const HF = serif ? 'serifBold' : 'sansBold';
  let y = M;
  const ensure = h => { if (y + h > H - M) { page = []; pages.push(page); y = M; if (modern) sidebarBand(); } };
  const sidebarBand = () => rect(0, 0, SB, H, accent + '14');

  // ----- header -----
  if (modern) {
    sidebarBand();
    let sy = 40;
    if (R.photo) { page.push({ t: 'img', src: R.photo, x: (SB - 104) / 2, y: sy, w: 104, h: 104 }); sy += 122; }
    const side = (title, items) => {
      items = items.filter(Boolean); if (!items.length) return;
      text(title.toUpperCase(), 22, sy + 9, 'sansBold', 8.5, accent); sy += 16;
      line(22, sy, SB - 22, sy, accent + '66'); sy += 8;
      items.forEach(it => wrap(it, 'sans', 8.8, SB - 44).forEach(l => { text(l, 22, sy + 9, 'sans', 8.8, '#33393f'); sy += 12.5; }));
      sy += 12;
    };
    side('Contact', [R.email, R.phone, R.location, R.link]);
    side('Skills', String(R.skills || '').split(',').map(s => s.trim()));
    side('Languages', String(R.langs || '').split(',').map(s => s.trim()));
    side('Certificates', String(R.certs || '').split('\n').map(s => s.trim()));
    text(R.name || 'Your Name', X, y + 26, 'sansBold', 26, '#16191c'); y += 36;
    if (R.title) { text(R.title, X, y + 13, 'sans', 13, accent); y += 22; }
    y += 6;
  } else {
    if (tpl === 'compact') { rect(0, 0, W, 6, accent); }
    const center = tpl === 'classic';
    const nm = R.name || 'Your Name', ns = serif ? 24 : 25;
    text(nm, center ? (W - width(nm, HF, ns)) / 2 : X, y + ns, HF, ns, '#16191c'); y += ns + 10;
    if (R.title) { text(R.title, center ? (W - width(R.title, 'sans', 12)) / 2 : X, y + 12, 'sans', 12, accent); y += 19; }
    const contact = [R.email, R.phone, R.location, R.link].filter(Boolean).join('   ·   ');
    wrap(contact, 'sans', 9, CW).forEach(l => { text(l, center ? (W - width(l, 'sans', 9)) / 2 : X, y + 9, 'sans', 9, '#5b636a'); y += 13; });
    y += 4;
  }
  const section = t => {
    ensure(40);
    y += 12;
    text(t.toUpperCase(), X, y + 10, HF, serif ? 10.5 : 10, accent);
    y += 15; line(X, y, X + CW, y, serif ? '#c9ced2' : accent + '55', serif ? 0.8 : 1); y += 9;
  };
  const para = (s, f = 'sans', size = 9.6, lh = 14, x = X, w = CW, color = '#2b3136') => wrap(s, f, size, w).forEach(l => { ensure(lh); text(l, x, y + size, f, size, color); y += lh; });

  if (R.summary) { section('Profile'); para(R.summary); }
  const jobs = (R.exp || []).filter(e => e.role || e.org);
  if (jobs.length) {
    section('Experience');
    jobs.forEach((e, i) => {
      ensure(48);
      if (i) y += 7;
      const dates = [e.from, e.to].filter(Boolean).join(' – ');
      const dw = width(dates, 'sans', 9);
      wrap(e.role || '', 'sansBold', 10.6, CW - dw - 12).forEach((l, k) => { text(l, X, y + 10.6, 'sansBold', 10.6, '#16191c'); if (!k && dates) text(dates, X + CW - dw, y + 10.6, 'sans', 9, '#5b636a'); y += 14.5; });
      const sub = [e.org, e.place].filter(Boolean).join(', ');
      if (sub) { text(sub, X, y + 9.6, 'sans', 9.6, accent); y += 14; }
      String(e.text || '').split('\n').map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean).forEach(b => {
        const ls = wrap(b, 'sans', 9.4, CW - 12);
        ls.forEach((l, k) => { ensure(13.4); if (!k) text('•', X + 1, y + 9.4, 'sans', 9.4, accent); text(l, X + 12, y + 9.4, 'sans', 9.4, '#2b3136'); y += 13.4; });
      });
    });
  }
  const edu = (R.edu || []).filter(e => e.degree || e.school);
  if (edu.length) {
    section('Education');
    edu.forEach((e, i) => {
      ensure(36);
      if (i) y += 6;
      const dates = [e.from, e.to].filter(Boolean).join(' – '), dw = width(dates, 'sans', 9);
      text(e.degree || '', X, y + 10.4, 'sansBold', 10.4, '#16191c'); if (dates) text(dates, X + CW - dw, y + 10.4, 'sans', 9, '#5b636a'); y += 14.5;
      if (e.school) { text(e.school, X, y + 9.6, 'sans', 9.6, accent); y += 14; }
      if (e.text) para(e.text, 'sans', 9.4, 13.4);
    });
  }
  if (!modern) {
    const skills = String(R.skills || '').split(',').map(s => s.trim()).filter(Boolean);
    if (skills.length) { section('Skills'); para(skills.join('   ·   ')); }
    if (R.langs) { section('Languages'); para(String(R.langs).split(',').map(s => s.trim()).filter(Boolean).join('   ·   ')); }
    const certs = String(R.certs || '').split('\n').map(s => s.trim()).filter(Boolean);
    if (certs.length) { section('Certificates'); certs.forEach(c => para('•  ' + c)); }
  }

  if (!forPdf) return { pages };
  // ----- draw into the PDF -----
  const hex = c => { const n = parseInt(c.slice(1, 7), 16), a = c.length > 7 ? parseInt(c.slice(7), 16) / 255 : 1; return [rgb((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255), a]; };
  pdf.setTitle(`${R.name || 'Resume'}${R.title ? ' – ' + R.title : ''}`); pdf.setAuthor(R.name || ''); pdf.setCreator('TidyFigure Resume Builder');
  for (const ops of pages) {
    const pg = pdf.addPage([W, H]);
    for (const o of ops) {
      if (o.t === 'text') { const [c, a] = hex(o.color); pg.drawText(o.str, { x: o.x, y: H - o.y, size: o.size, font: F[o.f], color: c, opacity: a }); }
      else if (o.t === 'rect') { const [c, a] = hex(o.color); pg.drawRectangle({ x: o.x, y: H - o.y - o.h, width: o.w, height: o.h, color: c, opacity: a }); }
      else if (o.t === 'line') { const [c, a] = hex(o.color); pg.drawLine({ start: { x: o.x1, y: H - o.y1 }, end: { x: o.x2, y: H - o.y2 }, thickness: o.th, color: c, opacity: a }); }
      else if (o.t === 'img') { const im = await pdf.embedJpg(Uint8Array.from(atob(o.src.split(',')[1]), ch => ch.charCodeAt(0))); pg.drawImage(im, { x: o.x, y: H - o.y - o.h, width: o.w, height: o.h }); }
    }
  }
  return { pages, bytes: await pdf.save() };
}

// ---------- preview ----------
const imgCache = {};
async function render() {
  let res;
  try { res = await build(false); } catch (e) {
    $('#preview').innerHTML = `<span class="verdict no">Couldn’t prepare the preview</span><p class="sub">${esc(e.message)}</p><button type="button" class="btn ghost" id="rb-retry">Try again</button>`;
    $('#rb-retry').onclick = () => { $('#preview').innerHTML = '<p class="empty">Loading…</p>'; render(); };
    return;
  }
  const S = 2, box = $('#preview');
  box.innerHTML = '';
  for (const ops of res.pages) {
    const c = document.createElement('canvas');
    c.width = W * S; c.height = H * S; c.className = 'rb-page';
    const x = c.getContext('2d');
    x.scale(S, S); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
    for (const o of ops) {
      if (o.t === 'text') { x.font = `${o.size}px rb-${o.f}`; x.fillStyle = o.color; x.fillText(o.str, o.x, o.y); }
      else if (o.t === 'rect') { x.fillStyle = o.color; x.fillRect(o.x, o.y, o.w, o.h); }
      else if (o.t === 'line') { x.strokeStyle = o.color; x.lineWidth = o.th; x.beginPath(); x.moveTo(o.x1, o.y1); x.lineTo(o.x2, o.y2); x.stroke(); }
      else if (o.t === 'img') { const im = imgCache[o.src] || (imgCache[o.src] = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = o.src; })); x.drawImage(im, o.x, o.y, o.w, o.h); }
    }
    box.appendChild(c);
  }
  $('#pages').textContent = `${res.pages.length} page${res.pages.length > 1 ? 's' : ''} · A4${res.pages.length > 2 ? ' · tip: most recruiters prefer 1–2 pages' : ''}`;
}
$('#pdf').onclick = async () => {
  const b = $('#pdf'); b.disabled = true;
  try { read(); const { bytes } = await build(true); download(new Blob([bytes], { type: 'application/pdf' }), `${(R.name || 'resume').trim().replace(/\s+/g, '-')}-Resume.pdf`); }
  finally { b.disabled = false; }
};
fill();
render();
