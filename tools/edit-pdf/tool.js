// PDF editor: pages are drawn by pdf.js; everything added sits in an HTML layer above each page,
// measured in PDF points (1 unit = 1 pt at 100% zoom), and is written into the PDF with pdf-lib on save.
const { PDFDocument, rgb, degrees, LineCapStyle, BlendMode, PDFHexString, PDFName, PDFString } = PDFLib;
const LH = 1.25; // line height of text boxes, in ems
const FONTS = {
  sans: { css: 'PeSans', file: 'inter', fallback: 'sans-serif' },
  serif: { css: 'PeSerif', file: 'merriweather', fallback: 'serif' },
  mono: { css: 'PeMono', file: 'roboto-mono', fallback: 'monospace' },
  hand: { css: 'PeHand', file: 'caveat', fallback: 'cursive', noItalic: true },
};
const fontFiles = {}; // 'sans-700-i' -> Promise<ArrayBuffer>
function fontFile(fam, bold, italic) {
  italic = !!italic && !FONTS[fam].noItalic;
  const k = `${fam}-${bold ? 700 : 400}-${italic ? 'i' : 'n'}`, style = italic ? 'italic' : 'normal';
  fontFiles[k] ??= fontBytes(FONTS[fam].file, bold ? 700 : 400, style)
    .then(buf => { const f = new FontFace(FONTS[fam].css, buf.slice(0), { weight: bold ? '700' : '400', style }); document.fonts.add(f); return f.load().then(() => buf); })
    .catch(e => { delete fontFiles[k]; throw e; });
  return fontFiles[k];
}
const cssFont = fam => `${FONTS[fam].css}, ${FONTS[fam].fallback}`;
// Fonts with the same letter widths as Arial, Times and Courier, to show text being edited close to the PDF's own font.
const LOOK = { sans: ['arimo', 'PeArimo', 'Arial, sans-serif'], serif: ['tinos', 'PeTinos', '"Times New Roman", serif'], mono: ['cousine', 'PeCousine', '"Courier New", monospace'] };
const lookFiles = {};
function lookFont(fam, bold, italic) {
  const [n, css] = LOOK[fam], k = `${fam}-${bold}-${italic}`;
  lookFiles[k] ??= new FontFace(css, `url(https://cdn.jsdelivr.net/fontsource/fonts/${n}@5.1.0/latin-${bold ? 700 : 400}-${italic ? 'italic' : 'normal'}.ttf)`, { weight: bold ? '700' : '400', style: italic ? 'italic' : 'normal' })
    .load().then(f => { document.fonts.add(f); }).catch(() => { delete lookFiles[k]; });
  return lookFiles[k];
}
function baseOfCss(css, weight, style) {
  const x = document.createElement('canvas').getContext('2d');
  x.font = `${style} ${weight} 100px ${css}`;
  const m = x.measureText('Hg');
  return { asc: (m.fontBoundingBoxAscent ?? 90) / 100, desc: (m.fontBoundingBoxDescent ?? 22) / 100 };
}
// Distance from the top of a text line to its baseline, in ems, as the browser lays it out.
function baseOf(fam, bold, italic) {
  const x = document.createElement('canvas').getContext('2d');
  x.font = `${italic && !FONTS[fam].noItalic ? 'italic ' : ''}${bold ? 700 : 400} 100px ${cssFont(fam)}`;
  const m = x.measureText('Hg');
  const asc = (m.fontBoundingBoxAscent ?? 90) / 100, desc = (m.fontBoundingBoxDescent ?? 22) / 100;
  return (LH - asc - desc) / 2 + asc;
}

const app = $('#app'), pagesEl = $('#pages'), scroller = $('#scroll'), out = $('#out');
let srcBytes = null, srcName = '', doc = null, P = [], srcPages = [], baseRots = [], objs = [], imgs = {}, sel = null, editing = null, eng = null, ie = null;
let zoom = 1, tool = 'select', seq = 1, hist = [], future = [];
const dflt = {
  text: { font: 'sans', size: 16, bold: false, italic: false, underline: false, align: 'left', bg: '', color: '#111827', opacity: 1 },
  markup: { color: '#dc2626', opacity: 1 },
  note: { color: '#facc15', opacity: 1 },
  shape: { color: '#dc2626', width: 3, fill: false, opacity: 1 },
  pen: { color: '#1d4ed8', width: 3, opacity: 1 },
  mark: { color: '#16a34a', width: 3, opacity: 1 },
  highlight: { color: '#facc15', opacity: 0.4 },
  whiteout: { color: '#ffffff', opacity: 1 },
  image: { opacity: 1 },
};
const KIND = { text: 'text', rect: 'shape', ellipse: 'shape', line: 'shape', arrow: 'shape', pen: 'pen', check: 'mark', cross: 'mark', highlight: 'highlight', whiteout: 'whiteout', image: 'image', underline: 'markup', strike: 'markup', note: 'note' };
const kindOf = t => KIND[t === 'date' || t === 'edit' ? 'text' : t];

// ---------- Opening ----------
fileDrop($('#drop'), $('#file'), files => { const f = files.find(isPdf); if (f) openFile(f); });
$('#sample').addEventListener('click', async () => openFile(await samplePdf(3, 'Rental agreement')));
$('#newfile').addEventListener('click', () => {
  if (unsaved() && !confirm('Close this PDF? Your edits will be lost.')) return;
  app.hidden = true; out.hidden = true; $('#start').hidden = false; $('#file').value = '';
});

async function openFile(f) {
  const buf = new Uint8Array(await f.arrayBuffer());
  const box = $('#drop span');
  try {
    const probe = await PDFDocument.load(buf, { ignoreEncryption: true, updateMetadata: false });
    if (probe.isEncrypted) { box.innerHTML = `This PDF is password-protected. Remove the password first with <a href="${(window.TF_BASE || '') + '/unlock-pdf'}">Unlock PDF</a>, then edit it here.`; return; }
    doc = await openPdf(buf);
  } catch (e) { box.textContent = 'That file can’t be opened. It may be damaged.'; return; }
  srcBytes = buf; srcName = f.name;
  objs = []; imgs = {}; hist = []; future = []; sel = null; editing = null; ie = null;
  // The content engine lets text be edited in its own font and things be truly deleted.
  try { eng = await PdfEngine.load(await PDFDocument.load(buf, { updateMetadata: false })); } catch (e) { eng = null; }
  // Stop watching the previous PDF's pages before showing the editor again.
  io?.disconnect(); io = null; pagesEl.innerHTML = '';
  P = []; srcPages = []; baseRots = [];
  $('#start').hidden = true; app.hidden = false; out.hidden = true;
  $('#fname').textContent = `${f.name} · ${doc.numPages} page${doc.numPages > 1 ? 's' : ''}`;
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    P.push(pageEntry(page, i - 1, 0, page.rotate || 0)); srcPages[i - 1] = page; baseRots[i - 1] = page.rotate || 0;
  }
  const widest = Math.max(...P.map(p => p.vp.width));
  zoom = Math.min(1.5, Math.max(0.3, (scroller.clientWidth - 32) / widest));
  build(); buildThumbs(); setTool('select'); lastState = state(); updateUndo();
  scroller.scrollTop = 0; scroller.dispatchEvent(new Event('scroll'));
  Object.keys(FONTS).forEach(k => fontFile(k, false).catch(() => {}));
  fontFile('sans', true).catch(() => {});
}

// ---------- Pages ----------
// Each page on screen: the pdf.js page, its number in the original PDF (src, or null for an added blank page),
// the turn added in the editor (rot) and the page's own turn (baseRot). vp maps screen points to PDF points.
function pageEntry(page, src, rot, baseRot, blank) {
  const p = { page, src, rot, baseRot, blank, drawn: 0 };
  p.vp = viewAt(p, 1);
  return p;
}
const viewAt = (p, scale) => p.page.getViewport({ scale, rotation: (p.baseRot + p.rot) % 360 });
const EMPTY = { lines: [], objects: [], glyphs: [] };
// The content engine counts pages of the original PDF; added blank pages have nothing to edit.
const model = i => (P[i].src == null ? EMPTY : eng.model(P[i].src));
let io = null;
function build() {
  pagesEl.innerHTML = '';
  io?.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) paint(+e.target.dataset.i); }), { root: scroller, rootMargin: '600px 0px' });
  P.forEach((p, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'pe-page'; wrap.dataset.i = i;
    wrap.innerHTML = '<canvas aria-hidden="true"></canvas><div class="pe-guides" aria-hidden="true"></div><div class="pe-layer"></div>';
    p.wrap = wrap; p.canvas = wrap.firstChild; p.guides = wrap.children[1]; p.layer = wrap.lastChild; p.drawn = 0;
    p.layer.dataset.i = i;
    pagesEl.appendChild(wrap);
    io.observe(wrap);
  });
  layout();
}
function layout() {
  P.forEach(p => { p.wrap.style.width = `${p.vp.width * zoom}px`; p.wrap.style.height = `${p.vp.height * zoom}px`; });
  $('#zlabel').textContent = `${Math.round(zoom * 100)}%`;
  redrawAll();
  P.forEach((p, i) => guides(i));
}
async function paint(i) {
  const p = P[i], want = zoom * Math.min(2, window.devicePixelRatio || 1);
  if (!p || p.drawn === want) return;
  p.drawn = want;
  p.task?.cancel();
  const vp = viewAt(p, want), c = document.createElement('canvas');
  c.width = Math.round(vp.width); c.height = Math.round(vp.height);
  p.task = p.page.render({ canvasContext: c.getContext('2d'), viewport: vp });
  try { await p.task.promise; } catch (e) { return; }
  if (p.drawn !== want) return;
  c.setAttribute('aria-hidden', 'true');
  p.canvas.replaceWith(c); p.canvas = c;
}
function setZoom(z) {
  if (ie) finishLine(true);
  const mid = (scroller.scrollTop + scroller.clientHeight / 2) / scroller.scrollHeight;
  zoom = Math.min(4, Math.max(0.25, z));
  layout();
  P.forEach((p, i) => { p.drawn = 0; const r = p.wrap.getBoundingClientRect(), s = scroller.getBoundingClientRect(); if (r.bottom > s.top - 600 && r.top < s.bottom + 600) paint(i); });
  scroller.scrollTop = mid * scroller.scrollHeight - scroller.clientHeight / 2;
}
$('#zin').addEventListener('click', () => setZoom(zoom * 1.25));
$('#zout').addEventListener('click', () => setZoom(zoom / 1.25));
scroller.addEventListener('wheel', e => { if (e.ctrlKey) { e.preventDefault(); setZoom(zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1)); } }, { passive: false });

async function buildThumbs() {
  const nav = $('#thumbs');
  nav.innerHTML = P.map((p, i) => `<button type="button" data-i="${i}" aria-label="Page ${i + 1}"><span class="pe-tc"></span><small>${i + 1}</small></button>`).join('');
  nav.onclick = e => { const b = e.target.closest('button'); if (b) showPage(+b.dataset.i, true); };
  for (let i = 0; i < P.length; i++) await thumb(i);
}
async function thumb(i) {
  const vp = viewAt(P[i], 96 / P[i].vp.width), c = document.createElement('canvas');
  c.width = Math.round(vp.width); c.height = Math.round(vp.height);
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
  await P[i].page.render({ canvasContext: x, viewport: vp }).promise;
  const slot = $(`#thumbs [data-i="${i}"] .pe-tc`);
  if (slot) { slot.innerHTML = ''; slot.appendChild(c); }
}
// After the engine changes a page, show the new version of it.
async function refreshPages(set) {
  for (const n of set) {
    const page = await (await openPdf(await eng.pagePdf(n))).getPage(1);
    srcPages[n] = page;
    P.forEach((p, i) => {
      if (p.src !== n) return;
      p.page = page; p.drawn = 0; p.lines = null;
      paint(i); guides(i); thumb(i);
    });
  }
}
function currentPage() {
  const mid = scroller.getBoundingClientRect().top + scroller.clientHeight / 2;
  let best = 0, d = Infinity;
  P.forEach((p, i) => { const r = p.wrap.getBoundingClientRect(), dd = Math.abs((r.top + r.bottom) / 2 - mid); if (dd < d) { d = dd; best = i; } });
  return best;
}
scroller.addEventListener('scroll', () => {
  const i = currentPage();
  $('#pageinfo').textContent = `Page ${i + 1} of ${P.length}`;
  $$('#thumbs button').forEach(b => b.classList.toggle('on', +b.dataset.i === i));
}, { passive: true });

// ---------- Page tools: turn, add a blank page, delete ----------
// Scroll the editor's page area (not the whole website) to a page.
function showPage(i, smooth) { const top = scroller.scrollTop + P[i].wrap.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 12; scroller.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' }); }
const blanks = {};
async function blankPage(w, h) {
  const k = `${w}x${h}`;
  if (!blanks[k]) { const d = await PDFDocument.create(); d.addPage([w, h]); blanks[k] = (await openPdf(await d.save())).getPage(1); }
  return blanks[k];
}
async function pageOp(op) {
  if (ie) await finishLine(true);
  stopEdit(); select(null);
  const i = currentPage(), p = P[i];
  if (op === 'cw' || op === 'ccw') {
    // Turn the page; what was added stays where it was on the page (and upright, for text and pictures).
    const old = p.vp;
    p.rot = (p.rot + (op === 'cw' ? 90 : 270)) % 360; p.vp = viewAt(p, 1); p.drawn = 0; p.lines = null;
    const map = (x, y) => p.vp.convertToViewportPoint(...old.convertToPdfPoint(x, y));
    for (const o of objs.filter(o => o.page === i)) {
      if (o.pts && ['pen', 'line', 'arrow'].includes(o.type)) { o.raw = o.pts.map(([fx, fy]) => map(o.x + fx * o.w, o.y + fy * o.h)); fromRaw(o); delete o.raw; }
      else if (['rect', 'ellipse', 'highlight', 'whiteout', 'underline', 'strike'].includes(o.type)) { const a = map(o.x, o.y), b = map(o.x + o.w, o.y + o.h); o.x = Math.min(a[0], b[0]); o.y = Math.min(a[1], b[1]); o.w = Math.abs(a[0] - b[0]); o.h = Math.abs(a[1] - b[1]); }
      else { const c = map(o.x + o.w / 2, o.y + o.h / 2); o.x = c[0] - o.w / 2; o.y = c[1] - o.h / 2; }
    }
    layout(); paint(i); thumb(i); guides(i);
  } else if (op === 'blank') {
    const [x0, y0, x1, y1] = p.page.view, sideways = (p.baseRot + p.rot) % 180 !== 0;
    const w = Math.round(sideways ? y1 - y0 : x1 - x0), h = Math.round(sideways ? x1 - x0 : y1 - y0);
    P.splice(i + 1, 0, pageEntry(await blankPage(w, h), null, 0, 0, [w, h]));
    objs.forEach(o => { if (o.page > i) o.page++; });
    build(); buildThumbs();
    showPage(i + 1);
  } else if (op === 'delete') {
    if (P.length === 1) { flash('A PDF needs at least one page.'); return; }
    objs = objs.filter(o => o.page !== i);
    objs.forEach(o => { if (o.page > i) o.page--; });
    P.splice(i, 1);
    build(); buildThumbs();
    showPage(Math.min(i, P.length - 1));
  } else if (op === 'clear') {
    if (!objs.length) { flash('Nothing added yet.'); return; }
    if (!confirm('Remove everything you added (text, images, shapes and comments)? You can undo this.')) return;
    objs = []; redrawAll();
  }
  commit();
  scroller.dispatchEvent(new Event('scroll'));
  flash({ cw: 'Page turned. Undo with Ctrl+Z.', ccw: 'Page turned. Undo with Ctrl+Z.', blank: 'Blank page added after this one.', delete: 'Page deleted. Undo with Ctrl+Z.', clear: 'Removed everything you added. Undo with Ctrl+Z.' }[op]);
}
const pmenu = $('#pmenu');
$('#pagebtn').addEventListener('click', e => { e.stopPropagation(); pmenu.hidden = !pmenu.hidden; $('#pagebtn').setAttribute('aria-expanded', !pmenu.hidden); });
pmenu.addEventListener('click', e => { const b = e.target.closest('[data-op]'); if (!b) return; pmenu.hidden = true; pageOp(b.dataset.op); });
document.addEventListener('click', e => { if (!pmenu.hidden && !e.target.closest('#pmenu')) pmenu.hidden = true; });

// ---------- Shapes as SVG paths (local coordinates, 0..w × 0..h) ----------
function pathOf(o) {
  const { w, h } = o, i = (o.width || 0) / 2;
  const pt = ([fx, fy]) => `${(fx * w).toFixed(2)} ${(fy * h).toFixed(2)}`;
  switch (o.type) {
    case 'rect': return `M${i} ${i}H${w - i}V${h - i}H${i}Z`;
    case 'whiteout': case 'highlight': return `M0 0H${w}V${h}H0Z`;
    case 'ellipse': {
      const rx = Math.max(0.5, w / 2 - i), ry = Math.max(0.5, h / 2 - i), cx = w / 2, cy = h / 2, k = 0.5523;
      return `M${cx - rx} ${cy}C${cx - rx} ${cy - ry * k} ${cx - rx * k} ${cy - ry} ${cx} ${cy - ry}C${cx + rx * k} ${cy - ry} ${cx + rx} ${cy - ry * k} ${cx + rx} ${cy}C${cx + rx} ${cy + ry * k} ${cx + rx * k} ${cy + ry} ${cx} ${cy + ry}C${cx - rx * k} ${cy + ry} ${cx - rx} ${cy + ry * k} ${cx - rx} ${cy}Z`;
    }
    case 'line': return `M${pt(o.pts[0])}L${pt(o.pts[1])}`;
    case 'arrow': {
      const [a, b] = o.pts.map(([fx, fy]) => [fx * w, fy * h]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]), L = Math.max(10, o.width * 4);
      const hd = s => `${(b[0] - L * Math.cos(ang + s)).toFixed(2)} ${(b[1] - L * Math.sin(ang + s)).toFixed(2)}`;
      return `M${a[0]} ${a[1]}L${b[0]} ${b[1]}M${hd(0.5)}L${b[0]} ${b[1]}L${hd(-0.5)}`;
    }
    case 'pen': {
      const p = o.pts.map(([fx, fy]) => [fx * w, fy * h]);
      if (p.length < 3) return `M${p[0][0]} ${p[0][1]}L${(p[1] || p[0])[0] + 0.01} ${(p[1] || p[0])[1]}`;
      let d = `M${p[0][0].toFixed(2)} ${p[0][1].toFixed(2)}`;
      for (let k = 1; k < p.length - 1; k++) d += `Q${p[k][0].toFixed(2)} ${p[k][1].toFixed(2)} ${((p[k][0] + p[k + 1][0]) / 2).toFixed(2)} ${((p[k][1] + p[k + 1][1]) / 2).toFixed(2)}`;
      const z = p[p.length - 1];
      return d + `L${z[0].toFixed(2)} ${z[1].toFixed(2)}`;
    }
    case 'underline': case 'strike': return `M0 ${(h / 2).toFixed(2)}H${w.toFixed(2)}`;
    case 'check': return `M${0.08 * w} ${0.55 * h}L${0.38 * w} ${0.85 * h}L${0.92 * w} ${0.15 * h}`;
    case 'cross': return `M${0.15 * w} ${0.15 * h}L${0.85 * w} ${0.85 * h}M${0.85 * w} ${0.15 * h}L${0.15 * w} ${0.85 * h}`;
  }
  return '';
}
const filled = o => o.type === 'whiteout' || o.type === 'highlight' || ((o.type === 'rect' || o.type === 'ellipse') && o.fill);
const stroked = o => !['whiteout', 'highlight'].includes(o.type);

// ---------- Drawing objects ----------
function el(o) { return P[o.page].layer.querySelector(`[data-id="${o.id}"]`); }
function draw(o) {
  let e = el(o);
  if (!e) { e = document.createElement('div'); e.dataset.id = o.id; P[o.page].layer.appendChild(e); }
  e.className = `pe-o pe-${o.type}${sel === o.id ? ' sel' : ''}${editing === o.id ? ' editing' : ''}`;
  e.style.left = `${o.x * zoom}px`; e.style.top = `${o.y * zoom}px`;
  e.style.opacity = o.opacity ?? 1;
  if (o.type === 'text') {
    e.style.width = e.style.height = '';
    let t = e.querySelector('.pe-t');
    if (!t) { t = document.createElement('div'); t.className = 'pe-t'; t.spellcheck = false; t.textContent = o.text; e.appendChild(t); }
    if (editing !== o.id && t.textContent !== o.text) t.textContent = o.text;
    Object.assign(t.style, { fontFamily: cssFont(o.font), fontSize: `${o.size * zoom}px`, fontWeight: o.bold ? 700 : 400, fontStyle: o.italic && !FONTS[o.font].noItalic ? 'italic' : 'normal', textDecoration: o.underline ? 'underline' : 'none', textAlign: o.align || 'left', background: o.bg || 'transparent', color: o.color, lineHeight: LH });
  } else {
    e.style.width = `${o.w * zoom}px`; e.style.height = `${o.h * zoom}px`;
    if (o.type === 'note') {
      // A comment: a note icon; when selected, a box to write in.
      if (!e.querySelector('.pe-note')) e.innerHTML = `<span class="pe-note" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4" fill="none"/><path d="M7 10h7M7 14h9" fill="none"/></svg></span>`;
      e.querySelector('.pe-note').style.setProperty('--c', o.color);
      e.title = o.text || 'Comment';
      let pop = e.querySelector('.pe-notepop');
      if (sel === o.id && !pop) {
        pop = document.createElement('div'); pop.className = 'pe-notepop';
        pop.innerHTML = '<textarea rows="4" placeholder="Write a comment…" aria-label="Comment"></textarea>';
        const ta = pop.firstChild; ta.value = o.text || '';
        ta.oninput = () => { o.text = ta.value; e.title = o.text || 'Comment'; };
        ta.onchange = () => { if (changed()) commit(); };
        e.appendChild(pop);
      } else if (sel !== o.id && pop) pop.remove();
    } else if (o.type === 'image') {
      let im = e.querySelector('img');
      if (!im) { im = document.createElement('img'); im.alt = ''; im.draggable = false; e.appendChild(im); }
      if (im.src !== imgs[o.img].url) im.src = imgs[o.img].url;
    } else {
      // Extra room around the shape so thin lines are easy to grab.
      const pad = Math.max(8 / zoom, o.width || 0);
      e.innerHTML = `<svg viewBox="${-pad} ${-pad} ${o.w + pad * 2} ${o.h + pad * 2}" style="left:${-pad * zoom}px;top:${-pad * zoom}px;width:${(o.w + pad * 2) * zoom}px;height:${(o.h + pad * 2) * zoom}px" aria-hidden="true"><path d="${pathOf(o)}" fill="${filled(o) ? o.color : 'none'}" stroke="${stroked(o) ? o.color : 'none'}" stroke-width="${o.width || 0}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
  }
  if (sel === o.id && !e.querySelector('.pe-h')) e.insertAdjacentHTML('beforeend', ['nw', 'ne', 'sw', 'se'].map(h => `<span class="pe-h" data-h="${h}"></span>`).join(''));
  if (sel !== o.id) e.querySelectorAll('.pe-h').forEach(h => h.remove());
  return e;
}
// Text boxes size themselves; read their size back in points.
function measure(o) {
  if (o.type !== 'text') return;
  const t = el(o)?.querySelector('.pe-t');
  if (t && t.offsetWidth) { o.w = t.offsetWidth / zoom; o.h = t.offsetHeight / zoom; }
}
function redrawAll() {
  P.forEach(p => { if (p.layer) p.layer.innerHTML = ''; });
  objs.forEach(o => { draw(o); measure(o); });
}
const byId = id => objs.find(o => o.id === id);

// ---------- History ----------
// Anything changed: items added on top, or the PDF's own text and images edited or deleted (those are in the undo history).
const unsaved = () => objs.length > 0 || hist.length > 0 || !!ie;
// A state is the added items plus the PDF's own content, so undo covers both.
const plan = () => JSON.stringify(P.map(p => [p.src, p.rot, p.blank || null]));
const state = () => ({ o: JSON.stringify(objs), p: plan(), e: eng ? eng.snapshot() : null, v: eng ? eng.version : 0 });
const changed = () => !lastState || JSON.stringify(objs) !== lastState.o || plan() !== lastState.p || (eng && eng.version !== lastState.v);
function commit() { hist.push(lastState); lastState = state(); if (hist.length > 200) hist.shift(); future = []; updateUndo(); }
let lastState = null;
async function restore(s) {
  if (s.p && s.p !== plan()) {
    // Pages were added, deleted or turned: rebuild the list of pages.
    const next = [];
    for (const [src, rot, blank] of JSON.parse(s.p)) next.push(pageEntry(src == null ? await blankPage(...blank) : srcPages[src], src, rot, src == null ? 0 : baseRots[src], blank || undefined));
    P = next;
    build(); buildThumbs();
  }
  objs = JSON.parse(s.o); sel = null; editing = null; redrawAll(); showProps();
  if (eng && s.e) await refreshPages(eng.restore(s.e));
  lastState = { ...s, v: eng ? eng.version : 0 };
  updateUndo();
}
function updateUndo() { $('#undo').disabled = !hist.length; $('#redo').disabled = !future.length; }
$('#undo').addEventListener('click', async () => { if (ie) await finishLine(true); if (!hist.length) return; stopEdit(); future.push(state()); await restore(hist.pop()); });
$('#redo').addEventListener('click', async () => { if (ie) await finishLine(true); if (!future.length) return; stopEdit(); hist.push(state()); await restore(future.pop()); });

// ---------- Selection, properties ----------
function select(id) {
  const prev = sel; sel = id;
  if (prev && byId(prev)) draw(byId(prev));
  if (id && byId(id)) draw(byId(id));
  showProps();
}
function showProps() {
  if (ie) {
    $$('#props .pe-p').forEach(p => { p.hidden = !['text', 'color'].includes(p.dataset.for) || !!p.querySelector('#p-font, #p-bold, #p-italic, #p-underline, #p-align, #p-hasbg, #p-bg'); });
    $('#hint').hidden = true;
    $('#p-size').value = Math.round(ie.size * 10) / 10; $('#p-color').value = ie.color;
    $$('.pe-colors [data-c]').forEach(b => b.classList.toggle('on', b.dataset.c === ie.color));
    return;
  }
  const o = byId(sel), k = o ? KIND[o.type] : kindOf(tool), d = o || dflt[k] || {};
  const show = {
    text: k === 'text',
    stroke: ['shape', 'pen', 'mark', 'markup'].includes(k),
    color: k !== 'image' && !!(o || dflt[k]),
    fill: o ? ['rect', 'ellipse'].includes(o.type) : ['rect', 'ellipse'].includes(tool),
    opacity: !!(o || dflt[k]),
    any: !!o,
  };
  $$('#props .pe-p').forEach(p => { p.hidden = !show[p.dataset.for]; });
  $('#hint').hidden = Object.values(show).some(Boolean);
  if (d.font) $('#p-font').value = d.font;
  if (d.size) $('#p-size').value = Math.round(d.size * 10) / 10;
  $('#p-bold').checked = !!d.bold;
  $('#p-italic').checked = !!d.italic; $('#p-underline').checked = !!d.underline; $('#p-align').value = d.align || 'left';
  $('#p-hasbg').checked = !!d.bg; if (d.bg) $('#p-bg').value = d.bg;
  if (d.width) $('#p-width').value = d.width;
  $('#p-fill').checked = !!d.fill;
  $('#p-opacity').value = Math.round((d.opacity ?? 1) * 100);
  if (d.color) { $('#p-color').value = d.color; $$('.pe-colors [data-c]').forEach(b => b.classList.toggle('on', b.dataset.c === d.color)); }
}
let propTimer = null;
function setProp(key, v) {
  if (ie) {
    if (key === 'size') { ie.size = v; ie.sizeChanged = true; }
    if (key === 'color') { ie.color = v; ie.colorChanged = true; }
    placeIe(); showProps(); ie.t.focus(); return;
  }
  const o = byId(sel);
  if (o) {
    o[key] = v;
    draw(o); measure(o);
    clearTimeout(propTimer); propTimer = setTimeout(commit, 400);
  }
  const k = o ? KIND[o.type] : kindOf(tool);
  if (dflt[k] && (key in dflt[k] || key === 'color')) dflt[k][key] = v;
  showProps();
}
$('#p-font').addEventListener('change', e => { fontFile(e.target.value, $('#p-bold').checked, $('#p-italic').checked).then(() => { const o = byId(sel); if (o) { measure(o); draw(o); } }).catch(() => {}); setProp('font', e.target.value); });
$('#p-size').addEventListener('input', e => { const v = +e.target.value; if (v >= 4 && v <= 200) setProp('size', v); });
$('#p-bold').addEventListener('change', e => { fontFile($('#p-font').value, e.target.checked, $('#p-italic').checked).then(() => { const o = byId(sel); if (o) { measure(o); draw(o); } }).catch(() => {}); setProp('bold', e.target.checked); });
$('#p-italic').addEventListener('change', e => { fontFile($('#p-font').value, $('#p-bold').checked, e.target.checked).then(() => { const o = byId(sel); if (o) { measure(o); draw(o); } }).catch(() => {}); setProp('italic', e.target.checked); });
$('#p-underline').addEventListener('change', e => setProp('underline', e.target.checked));
$('#p-align').addEventListener('change', e => setProp('align', e.target.value));
$('#p-hasbg').addEventListener('change', e => setProp('bg', e.target.checked ? $('#p-bg').value : ''));
$('#p-bg').addEventListener('input', e => { $('#p-hasbg').checked = true; setProp('bg', e.target.value); });
$('#front').addEventListener('click', () => layer(1));
$('#back').addEventListener('click', () => layer(-1));
// Bring the selected item in front of everything else on its page, or send it behind.
function layer(dir) {
  const o = byId(sel);
  if (!o) return;
  stopEdit();
  objs = objs.filter(x => x !== o);
  if (dir > 0) objs.push(o); else objs.unshift(o);
  redrawAll(); commit();
}
$('#p-width').addEventListener('input', e => { const v = +e.target.value; if (v >= 1 && v <= 40) setProp('width', v); });
$('#p-fill').addEventListener('change', e => setProp('fill', e.target.checked));
$('#p-opacity').addEventListener('input', e => setProp('opacity', +e.target.value / 100));
$('#p-color').addEventListener('input', e => setProp('color', e.target.value));
$$('.pe-colors [data-c]').forEach(b => b.addEventListener('click', () => setProp('color', b.dataset.c)));
$('#del').addEventListener('click', () => removeSel());
$('#dup').addEventListener('click', () => duplicate());
function removeSel() {
  const o = byId(sel);
  if (!o) return;
  editing = null; el(o)?.remove(); objs = objs.filter(x => x !== o); sel = null; showProps(); commit();
}
function duplicate() {
  const o = byId(sel);
  if (!o) return;
  stopEdit();
  const c = { ...JSON.parse(JSON.stringify(o)), id: seq++, x: o.x + 12, y: o.y + 12 };
  objs.push(c); draw(c); measure(c); select(c.id); commit();
}

// ---------- Tools ----------
function setTool(t) {
  if (ie) finishLine(true);
  if (t === 'image') { $('#imgfile').click(); return; }
  if (t === 'sign') { openSign(); return; }
  stopEdit();
  tool = t;
  $$('.pe-tools [data-tool]').forEach(b => { b.classList.toggle('on', b.dataset.tool === t); b.setAttribute('aria-pressed', b.dataset.tool === t); });
  app.dataset.tool = t;
  hover(null);
  P.forEach((p, i) => guides(i));
  if (t !== 'select') select(null); else showProps();
  const tips = { select: 'Click an item to select it. Drag to move, use a corner to resize. Double-click text to change it.', text: 'Click where you want to type.', edit: 'Click any line of text to change it. It keeps the PDF’s own font where possible.', delete: 'Click text, an image or a shape to delete it, or drag a box to delete everything inside.', pen: 'Draw with your mouse or finger.', highlight: 'Drag over text to highlight it, or click a line.', underline: 'Drag over text to underline it, or click a line.', strike: 'Drag over text to strike it through, or click a line.', note: 'Click where you want a comment. It shows as a note in PDF readers.', whiteout: 'Drag over anything to cover it in white.', rect: 'Drag to draw a box.', ellipse: 'Drag to draw a circle.', line: 'Drag to draw a line.', arrow: 'Drag to draw an arrow.', check: 'Click to add a tick.', cross: 'Click to add a cross.', date: 'Click to add today’s date.' };
  $('#hint').textContent = tips[t] || '';
  showProps();
}
$$('.pe-tools [data-tool]').forEach(b => b.addEventListener('click', () => setTool(b.dataset.tool)));

function pagePoint(e, i) {
  const r = P[i].wrap.getBoundingClientRect();
  return [(e.clientX - r.left) / zoom, (e.clientY - r.top) / zoom];
}
function addObj(o, keepTool) {
  o.id ??= seq++;
  objs.push(o); draw(o); measure(o);
  if (!keepTool && tool !== 'pen' && tool !== 'highlight') setTool('select');
  select(o.id);
  return o;
}
function addText(i, x, y, text, extra = {}) {
  const d = dflt.text;
  const o = addObj({ type: 'text', page: i, x, y, text, font: d.font, size: d.size, bold: d.bold, italic: d.italic, underline: d.underline, align: d.align, bg: d.bg, color: d.color, opacity: d.opacity, ...extra });
  fontFile(o.font, o.bold, o.italic).then(() => { measure(o); draw(o); }).catch(() => {});
  return o;
}

// Editing text boxes.
function startEdit(o, selectAll) {
  if (editing === o.id) return;
  stopEdit();
  editing = o.id; select(o.id);
  const e = el(o), t = e.querySelector('.pe-t');
  e.classList.add('editing');
  try { t.contentEditable = 'plaintext-only'; } catch (err) { t.contentEditable = 'true'; }
  if (t.contentEditable !== 'plaintext-only') t.contentEditable = 'true';
  t.focus();
  const r = document.createRange(); r.selectNodeContents(t);
  if (!selectAll) r.collapse(false);
  const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  t.oninput = () => { o.text = t.innerText.replace(/\n$/, ''); measure(o); };
  t.onkeydown = ev => { if (ev.key === 'Escape') { ev.preventDefault(); stopEdit(); } };
}
function stopEdit() {
  const o = byId(editing);
  editing = null;
  if (!o) return;
  const e = el(o), t = e && e.querySelector('.pe-t');
  if (t) { t.contentEditable = 'false'; t.oninput = t.onkeydown = null; o.text = t.innerText.replace(/\n$/, ''); }
  if (!o.text.trim()) { e?.remove(); objs = objs.filter(x => x !== o); if (sel === o.id) sel = null; }
  else { draw(o); measure(o); }
  showProps();
  if (changed()) commit();
}

// ---------- Pointer handling ----------
let drag = null;
pagesEl.addEventListener('pointerdown', async e => {
  if (e.target.closest('.pe-ie, .pe-notepop')) return;
  const layer = e.target.closest('.pe-layer');
  if (!layer || e.button > 0) return;
  const i = +layer.dataset.i, [x, y] = pagePoint(e, i);
  if (ie) { e.preventDefault(); await finishLine(true); if (tool !== 'edit') return; }
  if (tool === 'delete' && !e.target.closest('.pe-o')) {
    e.preventDefault();
    const band = document.createElement('div'); band.className = 'pe-band'; P[i].wrap.appendChild(band);
    drag = { mode: 'erase', i, x0: x, y0: y, band, moved: false };
    layer.setPointerCapture(e.pointerId);
    return;
  }
  const oe = e.target.closest('.pe-o'), o = oe && byId(+oe.dataset.id);
  if (o && editing === o.id) return; // let the caret move inside the text
  if (o && (tool === 'select' || ['text', 'edit', 'date'].includes(tool) && o.type === 'text')) {
    e.preventDefault();
    stopEdit();
    if (tool !== 'select') setTool('select');
    select(o.id);
    const h = e.target.closest('.pe-h');
    drag = { mode: h ? 'resize' : 'move', h: h && h.dataset.h, o, x0: x, y0: y, start: { ...o }, moved: false, i };
    layer.setPointerCapture(e.pointerId);
    return;
  }
  stopEdit();
  if (tool === 'select') { select(null); return; }
  e.preventDefault();
  if (tool === 'text') { const t = addText(i, x, y - dflt.text.size * 0.6, 'Type here'); startEdit(t, true); return; }
  if (tool === 'date') { addText(i, x, y - dflt.text.size * 0.6, new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })); commit(); return; }
  if (tool === 'edit') { editLine(i, x, y); return; }
  if (tool === 'note') {
    const n = addObj({ type: 'note', page: i, x: x - 11, y: y - 11, w: 22, h: 22, text: '', color: dflt.note.color, opacity: 1 });
    commit(); setTimeout(() => el(n)?.querySelector('textarea')?.focus(), 30); return;
  }
  if (tool === 'check' || tool === 'cross') { const s = 22, d = dflt.mark; addObj({ type: tool, page: i, x: x - s / 2, y: y - s / 2, w: s, h: s, color: d.color, width: d.width, opacity: d.opacity }, true); commit(); return; }
  const k = kindOf(tool), d = dflt[k];
  const o2 = { id: seq++, type: tool, page: i, x, y, w: 0, h: 0, color: d.color, opacity: d.opacity, width: d.width, fill: d.fill };
  if (tool === 'pen') o2.raw = [[x, y]];
  if (tool === 'line' || tool === 'arrow') o2.raw = [[x, y], [x, y]];
  objs.push(o2);
  drag = { mode: 'create', o: o2, x0: x, y0: y, i };
  layer.setPointerCapture(e.pointerId);
});
pagesEl.addEventListener('pointermove', e => {
  if (!drag) {
    if ((tool === 'edit' || tool === 'delete') && eng && !ie) {
      const layer = e.target.closest('.pe-layer');
      if (!layer || e.target.closest('.pe-o')) { hover(null); return; }
      const i = +layer.dataset.i, [x, y] = pagePoint(e, i), [ux, uy] = P[i].vp.convertToPdfPoint(x, y);
      hover(i, tool === 'edit' ? hitLine(i, ux, uy) : hitLine(i, ux, uy) || hitObject(i, ux, uy));
    }
    return;
  }
  const [x, y] = pagePoint(e, drag.i), o = drag.o, s = drag.start;
  let dx = x - drag.x0, dy = y - drag.y0;
  if (Math.abs(dx) + Math.abs(dy) > 1) drag.moved = true;
  if (drag.mode === 'erase') {
    Object.assign(drag.band.style, { left: `${Math.min(x, drag.x0) * zoom}px`, top: `${Math.min(y, drag.y0) * zoom}px`, width: `${Math.abs(dx) * zoom}px`, height: `${Math.abs(dy) * zoom}px` });
    drag.x1 = x; drag.y1 = y;
    return;
  }
  if (drag.mode === 'move') {
    o.x = s.x + dx; o.y = s.y + dy;
  } else if (drag.mode === 'resize') {
    const west = drag.h.includes('w'), north = drag.h.includes('n');
    let w = Math.max(6, s.w + (west ? -dx : dx)), h = Math.max(6, s.h + (north ? -dy : dy));
    if (['text', 'image', 'check', 'cross'].includes(o.type)) { const k = Math.max(w / s.w, h / s.h); w = s.w * k; h = s.h * k; }
    if (o.type === 'text') o.size = Math.max(4, Math.min(200, s.size * h / s.h));
    o.w = w; o.h = h;
    o.x = west ? s.x + s.w - w : s.x; o.y = north ? s.y + s.h - h : s.y;
  } else {
    if (o.type === 'pen') o.raw.push([x, y]);
    else if (o.raw) o.raw[1] = [x, y];
    else { o.x = Math.min(x, drag.x0); o.y = Math.min(y, drag.y0); o.w = Math.abs(dx); o.h = Math.abs(dy); }
    if (o.raw) fromRaw(o);
  }
  draw(o); if (o.type === 'text') measure(o);
});
pagesEl.addEventListener('pointerup', endDrag);
pagesEl.addEventListener('pointercancel', endDrag);
function fromRaw(o) {
  const xs = o.raw.map(p => p[0]), ys = o.raw.map(p => p[1]);
  o.x = Math.min(...xs); o.y = Math.min(...ys);
  o.w = Math.max(0.01, Math.max(...xs) - o.x); o.h = Math.max(0.01, Math.max(...ys) - o.y);
  o.pts = o.raw.map(([px, py]) => [(px - o.x) / o.w, (py - o.y) / o.h]);
}
function endDrag() {
  if (!drag) return;
  const { o, mode, moved } = drag;
  const d0 = drag;
  drag = null;
  if (mode === 'erase') { d0.band.remove(); erase(d0); return; }
  if (mode === 'create') {
    if (['highlight', 'underline', 'strike'].includes(o.type)) {
      objs = objs.filter(x => x !== o); el(o)?.remove();
      markText(o, d0, moved && (o.w >= 4 || o.h >= 4));
      return;
    }
    if (o.raw) {
      if (o.type === 'pen' && o.raw.length < 2) { o.raw.push([o.raw[0][0] + 0.5, o.raw[0][1] + 0.5]); }
      if (o.type !== 'pen' && !moved) { o.raw[1] = [o.raw[0][0] + 120, o.raw[0][1]]; }
      fromRaw(o); delete o.raw;
    } else if (!moved || (o.w < 4 && o.h < 4)) {
      // A click instead of a drag: use a sensible default size.
      const sz = { highlight: [140, 18], whiteout: [120, 24], rect: [140, 80], ellipse: [100, 100] }[o.type] || [100, 60];
      o.x -= sz[0] / 2; o.y -= sz[1] / 2; o.w = sz[0]; o.h = sz[1];
    }
    objs = objs.filter(x => x !== o);
    addObj(o, true);
    if (!['pen', 'highlight', 'whiteout'].includes(o.type)) setTool('select'), select(o.id);
    commit();
    return;
  }
  if (moved) commit();
}
// Highlight, underline and strike-through snap to the lines of text dragged over (or the line clicked),
// like selecting text: the first line from where the drag started, the last up to where it ended.
async function markText(o, d, moved) {
  const i = o.page, lines = (await textLines(i)).slice().sort((a, b) => a.base - b.base || a.x - b.x);
  let sx = d.x0, sy = d.y0, ex = o.x === d.x0 ? o.x + o.w : o.x, ey = o.y === d.y0 ? o.y + o.h : o.y;
  if (sy > ey) [sx, sy, ex, ey] = [ex, ey, sx, sy];
  const top = l => l.base - l.size * 0.95, bot = l => l.base + l.size * 0.25;
  let hits = moved ? lines.filter(l => bot(l) > Math.min(sy, ey) && top(l) < Math.max(sy, ey) && l.x < Math.max(sx, ex) && l.x + l.w > Math.min(sx, ex))
    : lines.filter(l => sy >= top(l) && sy <= bot(l) && sx >= l.x - 2 && sx <= l.x + l.w + 2);
  const parts = hits.map((l, n) => {
    let a = l.x, b = l.x + l.w;
    if (moved && hits.length === 1) { a = Math.max(a, Math.min(sx, ex)); b = Math.min(b, Math.max(sx, ex)); }
    else if (moved) { if (n === 0) a = Math.max(a, sx); if (n === hits.length - 1) b = Math.min(b, ex); }
    if (b - a < 2) return null;
    if (o.type === 'highlight') return { ...o, id: seq++, x: a - 1, y: l.base - l.size * 0.92, w: b - a + 2, h: l.size * 1.18 };
    const th = Math.max(0.8, l.size * 0.075), cy = o.type === 'underline' ? l.base + l.size * 0.13 : l.base - l.size * 0.3;
    return { ...o, id: seq++, x: a, y: cy - th / 2, w: b - a, h: th, width: th };
  }).filter(Boolean);
  if (!parts.length) {
    // No text there (a scan or an empty spot): mark the dragged area itself.
    if (o.type === 'highlight') { if (!moved || (o.w < 4 && o.h < 4)) { o.x -= 70; o.y -= 9; o.w = 140; o.h = 18; } parts.push(o); }
    else { const th = 1.5, w = Math.max(o.w, moved ? 4 : 120); parts.push({ ...o, x: moved ? o.x : o.x - w / 2, y: (o.type === 'underline' ? o.y + o.h : o.y + o.h / 2) - th / 2, w, h: th, width: th }); }
  }
  parts.forEach(p => addObj(p, true));
  commit();
}
pagesEl.addEventListener('dblclick', e => {
  const oe = e.target.closest('.pe-o'), o = oe && byId(+oe.dataset.id);
  if (o && o.type === 'text') startEdit(o, false);
});

document.addEventListener('keydown', e => {
  if (app.hidden || editing) return;
  if (e.target.closest('input, select, textarea, [contenteditable="true"], [contenteditable="plaintext-only"], dialog')) return;
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); $(e.shiftKey ? '#redo' : '#undo').click(); return; }
  if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); $('#redo').click(); return; }
  if (mod && e.key.toLowerCase() === 'd') { e.preventDefault(); duplicate(); return; }
  const o = byId(sel);
  if (o && (e.key === 'Delete' || e.key === 'Backspace')) { e.preventDefault(); removeSel(); return; }
  if (o && e.key === 'Enter' && o.type === 'text') { e.preventDefault(); startEdit(o, false); return; }
  if (o && e.key.startsWith('Arrow')) {
    e.preventDefault();
    const s = e.shiftKey ? 10 : 1;
    o.x += { ArrowLeft: -s, ArrowRight: s }[e.key] || 0; o.y += { ArrowUp: -s, ArrowDown: s }[e.key] || 0;
    draw(o); clearTimeout(propTimer); propTimer = setTimeout(commit, 400); return;
  }
  if (e.key === 'Escape') { setTool('select'); select(null); return; }
  if (mod || e.altKey) return;
  const keys = { x: 'delete', v: 'select', t: 'text', e: 'edit', d: 'pen', h: 'highlight', u: 'underline', s: 'strike', c: 'note', w: 'whiteout', r: 'rect', o: 'ellipse', l: 'line', a: 'arrow' };
  if (keys[e.key.toLowerCase()]) setTool(keys[e.key.toLowerCase()]);
});

// ---------- Real editing of the PDF's own content ----------
const area = b => Math.max(0, b[2] - b[0]) * Math.max(0, b[3] - b[1]);
function inPoly([x, y], poly) {
  let inside = false;
  for (let a = 0, b = poly.length - 1; a < poly.length; b = a++) {
    const [xa, ya] = poly[a], [xb, yb] = poly[b];
    if ((ya > y) !== (yb > y) && x < (xb - xa) * (y - ya) / (yb - ya) + xa) inside = !inside;
  }
  return inside;
}
function hitLine(i, ux, uy) {
  const m = model(i);
  const hits = m.lines.filter(l => inPoly([ux, uy], l.poly));
  return hits.sort((a, b) => area(a.bbox) - area(b.bbox))[0] || null;
}
function hitObject(i, ux, uy) {
  const m = model(i), vb = P[i].vp.viewBox, page = area(vb);
  const hits = m.objects.filter(o => ux >= o.bbox[0] && ux <= o.bbox[2] && uy >= o.bbox[1] && uy <= o.bbox[3] && area(o.bbox) < page * 0.85);
  const rank = o => (o.type === 'image' ? 0 : o.type === 'path' ? 1 : 2);
  return hits.sort((a, b) => rank(a) - rank(b) || area(a.bbox) - area(b.bbox))[0] || null;
}
// Page-space box -> on-screen box (in points at 100%).
function viewBox(i, b) {
  const vp = P[i].vp, pts = [[b[0], b[1]], [b[2], b[1]], [b[2], b[3]], [b[0], b[3]]].map(([x, y]) => vp.convertToViewportPoint(x, y));
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}
let hoverEl = null;
function hover(i, item) {
  if (!item) { hoverEl?.remove(); hoverEl = null; return; }
  const [x0, y0, x1, y1] = viewBox(i, item.bbox);
  if (!hoverEl || hoverEl.parentNode !== P[i].wrap) { hoverEl?.remove(); hoverEl = document.createElement('div'); P[i].wrap.appendChild(hoverEl); }
  hoverEl.className = `pe-hover ${tool === 'delete' ? 'del' : ''}`;
  Object.assign(hoverEl.style, { left: `${(x0 - 2) * zoom}px`, top: `${(y0 - 2) * zoom}px`, width: `${(x1 - x0 + 4) * zoom}px`, height: `${(y1 - y0 + 4) * zoom}px` });
}
// Faint boxes around every line of text while the Edit text tool is on.
function guides(i) {
  const g = P[i] && P[i].guides;
  if (!g) return;
  g.innerHTML = '';
  if (tool !== 'edit' || !eng) return;
  let m;
  try { m = model(i); } catch (e) { return; }
  g.innerHTML = m.lines.map(l => { const [x0, y0, x1, y1] = viewBox(i, l.bbox); return `<div class="pe-g" style="left:${x0 * zoom}px;top:${y0 * zoom}px;width:${(x1 - x0) * zoom}px;height:${(y1 - y0) * zoom}px"></div>`; }).join('');
}
const hex2 = v => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0');
const rgbHex = c => '#' + c.map(hex2).join('');
const hexRgb01 = h => [1, 3, 5].map(k => parseInt(h.slice(k, k + 2), 16) / 255);

async function editLine(i, x, y) {
  if (!eng) { editExisting(i, x, y); return; }
  const [ux, uy] = P[i].vp.convertToPdfPoint(x, y);
  const m = model(i), line = hitLine(i, ux, uy);
  if (!line) {
    // Scanned pages and unusual PDFs: fall back to covering the text.
    if (m.error || !m.lines.length) editExisting(i, x, y);
    else flash('No text there. Click right on a line of text, or use Text to add new text.');
    return;
  }
  if (line.style.Tr === 3 || line.style.Tr === 7) { editExisting(i, x, y); return; }
  hover(null);
  const before = state();
  await refreshPages(eng.removeGlyphs(line.glyphs));
  const f = line.style.font, box = document.createElement('div'), t = document.createElement('div');
  box.className = 'pe-ie'; t.className = 'pe-iet'; t.spellcheck = false; t.textContent = line.text;
  box.appendChild(t); P[i].wrap.appendChild(box);
  ie = { i, line, before, box, t, size: line.size, color: rgbHex(line.style.rgb), fam: f.family, bold: f.bold, italic: f.italic };
  lookFont(f.family, f.bold, f.italic).then(placeIe);
  placeIe();
  try { t.contentEditable = 'plaintext-only'; } catch (err) { t.contentEditable = 'true'; }
  if (t.contentEditable !== 'plaintext-only') t.contentEditable = 'true';
  t.focus();
  const r = document.createRange(); r.selectNodeContents(t); r.collapse(false);
  const sl = getSelection(); sl.removeAllRanges(); sl.addRange(r);
  t.onkeydown = ev => {
    if (ev.key === 'Enter') { ev.preventDefault(); finishLine(true); }
    if (ev.key === 'Escape') { ev.preventDefault(); finishLine(false); }
  };
  showProps();
  const h = $('#hint'); h.hidden = false;
}
function placeIe() {
  if (!ie) return;
  const { i, line, box, t } = ie, vp = P[i].vp;
  const o = [line.first.Trm[4], line.first.Trm[5]];
  const [x0, y0] = vp.convertToViewportPoint(o[0], o[1]), [x1, y1] = vp.convertToViewportPoint(o[0] + line.dir[0], o[1] + line.dir[1]);
  const ang = Math.atan2(y1 - y0, x1 - x0), [, css, fb] = LOOK[ie.fam];
  const weight = ie.bold ? 700 : 400, style = ie.italic ? 'italic' : 'normal', LHi = 1.2;
  const { asc, desc } = baseOfCss(`${css}, ${fb}`, weight, style), base = (LHi - asc - desc) / 2 + asc;
  Object.assign(box.style, { left: `${x0 * zoom}px`, top: `${(y0 - base * ie.size) * zoom}px`, transform: `rotate(${ang}rad)`, transformOrigin: `0 ${base * ie.size * zoom}px` });
  Object.assign(t.style, { font: `${style} ${weight} ${ie.size * zoom}px/${LHi} ${css}, ${fb}`, color: ie.color });
}
async function finishLine(save) {
  const s = ie;
  if (!s) return;
  ie = null;
  const text = s.t.innerText.replace(/\s*\n\s*/g, ' ').trim();
  s.box.remove();
  const opts = {};
  if (s.sizeChanged) opts.size = s.size;
  if (s.colorChanged) opts.color = hexRgb01(s.color);
  if (!save || (text === s.line.text && !opts.size && !opts.color)) {
    // Nothing changed: put the original text back exactly.
    await refreshPages(eng.restore(s.before.e));
    lastState = { ...s.before, v: eng.version };
    showProps(); setTool(tool);
    return;
  }
  if (text) {
    try {
      const r = await eng.addText(s.line, text, opts);
      await refreshPages(r.pages);
      if (r.missing.length) flash(`This PDF’s font doesn’t include ${r.missing.map(c => `“${c}”`).join(' ')}, so a very similar font was used for ${r.missing.length > 1 ? 'those letters' : 'that letter'}.`);
    } catch (err) { flash('Couldn’t write that text: ' + err.message); }
  }
  hist.push(s.before); lastState = state(); future = []; updateUndo();
  showProps();
}
// Deletes what was clicked, or everything inside a dragged box, from the PDF itself.
async function erase(d) {
  if (!eng) { flash('This PDF can’t be changed directly. Use Whiteout to cover things instead.'); return; }
  const i = d.i, vp = P[i].vp;
  let glyphs = [], objects = [];
  if (!d.moved || d.x1 === undefined || Math.abs(d.x1 - d.x0) + Math.abs(d.y1 - d.y0) < 4) {
    const [ux, uy] = vp.convertToPdfPoint(d.x0, d.y0);
    const l = hitLine(i, ux, uy), o = l ? null : hitObject(i, ux, uy);
    if (l) glyphs = l.glyphs; else if (o) objects = [o];
    else { flash('Nothing to delete there. Drag a box to delete everything inside it.'); return; }
  } else {
    const a = vp.convertToPdfPoint(d.x0, d.y0), b = vp.convertToPdfPoint(d.x1, d.y1);
    const r = [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])];
    const m = model(i), page = area(vp.viewBox);
    glyphs = m.glyphs.filter(g => { const cx = g.poly.reduce((s, p) => s + p[0], 0) / 4, cy = g.poly.reduce((s, p) => s + p[1], 0) / 4; return cx >= r[0] && cx <= r[2] && cy >= r[1] && cy <= r[3]; });
    objects = m.objects.filter(o => {
      const ov = area([Math.max(r[0], o.bbox[0]), Math.max(r[1], o.bbox[1]), Math.min(r[2], o.bbox[2]), Math.min(r[3], o.bbox[3])]), a0 = area(o.bbox) || 1;
      return ov / a0 >= (o.type === 'form' || a0 > page * 0.85 ? 0.95 : 0.6);
    });
    if (!glyphs.length && !objects.length) { flash('Nothing found inside that box.'); return; }
  }
  const before = state();
  await refreshPages(eng.remove(glyphs, objects));
  hover(null);
  hist.push(before); lastState = state(); future = []; updateUndo();
  const parts = [];
  if (glyphs.length) parts.push(`${glyphs.filter(g => !g.space).length} letters`);
  if (objects.length) parts.push(`${objects.length} image${objects.length > 1 ? 's' : ''} or shape${objects.length > 1 ? 's' : ''}`);
  flash(`Deleted ${parts.join(' and ')} from the PDF. Undo with Ctrl+Z.`);
}

// ---------- Edit existing text (fallback: covers the old text) ----------
async function textLines(i) {
  const p = P[i];
  if (p.lines) return p.lines;
  const tc = await p.page.getTextContent();
  const items = [];
  for (const it of tc.items) {
    if (!it.str) continue;
    const m = pdfjsLib.Util.transform(p.vp.transform, it.transform);
    if (Math.abs(m[1]) > 0.01 || Math.abs(m[2]) > 0.01) continue; // only upright text
    const size = Math.abs(m[3]) || Math.abs(m[0]);
    if (size < 2) continue;
    let bold = false;
    try { const f = p.page.commonObjs.get(it.fontName); bold = /bold|black|heavy|semibold|demi/i.test(f.name || '') || (f.bold === true); } catch (e) { /* font not loaded */ }
    const fam = (tc.styles[it.fontName] || {}).fontFamily || '';
    items.push({ str: it.str, x: m[4], base: m[5], w: it.width * (p.vp.scale || 1), size, bold, font: /mono/i.test(fam) ? 'mono' : /serif/i.test(fam) && !/sans/i.test(fam) ? 'serif' : 'sans' });
  }
  // Join pieces on the same baseline that sit next to each other into one line of text.
  items.sort((a, b) => a.base - b.base || a.x - b.x);
  const lines = [];
  for (const it of items) {
    const ln = lines.find(l => Math.abs(l.base - it.base) < it.size * 0.2 && Math.abs(l.size - it.size) < it.size * 0.25 && it.x - (l.x + l.w) < it.size * 1.2 && it.x > l.x - 1);
    if (ln) {
      const gap = it.x - (ln.x + ln.w);
      if (gap > it.size * 0.15 && !/\s$/.test(ln.str) && !/^\s/.test(it.str)) ln.str += ' ';
      ln.str += it.str; ln.w = Math.max(ln.w, it.x + it.w - ln.x);
    } else lines.push({ ...it });
  }
  lines.forEach(l => { l.str = l.str.replace(/\s+$/, ''); });
  p.lines = lines;
  return lines;
}
function sampleColors(i, l) {
  // Read pixels from the page canvas: the most common colour is the background, the most different one the ink.
  const p = P[i], c = p.canvas, k = c.width / p.vp.width;
  const x0 = Math.max(0, Math.floor((l.x - 2) * k)), y0 = Math.max(0, Math.floor((l.base - l.size) * k));
  const w = Math.min(c.width - x0, Math.ceil((l.w + 4) * k)), h = Math.min(c.height - y0, Math.ceil(l.size * 1.3 * k));
  const fallback = { bg: '#ffffff', ink: '#111827' };
  if (w < 1 || h < 1) return fallback;
  let d;
  try { d = c.getContext('2d').getImageData(x0, y0, w, h).data; } catch (e) { return fallback; }
  const counts = {};
  for (let j = 0; j < d.length; j += 4) { const key = (d[j] >> 3) << 10 | (d[j + 1] >> 3) << 5 | d[j + 2] >> 3; counts[key] = (counts[key] || 0) + 1; }
  const top = +Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  const bg = [(top >> 10 & 31) * 8 + 4, (top >> 5 & 31) * 8 + 4, (top & 31) * 8 + 4];
  let best = 0, ink = [17, 24, 39];
  for (let j = 0; j < d.length; j += 4) { const dist = Math.abs(d[j] - bg[0]) + Math.abs(d[j + 1] - bg[1]) + Math.abs(d[j + 2] - bg[2]); if (dist > best) { best = dist; ink = [d[j], d[j + 1], d[j + 2]]; } }
  const hex = a => '#' + a.map(v => Math.min(255, v).toString(16).padStart(2, '0')).join('');
  return { bg: bg.every(v => v > 235) ? '#ffffff' : hex(bg), ink: best > 60 ? hex(ink) : '#111827' };
}
async function editExisting(i, x, y) {
  const lines = await textLines(i);
  const l = lines.find(t => x >= t.x - 2 && x <= t.x + t.w + 2 && y >= t.base - t.size * 0.95 && y <= t.base + t.size * 0.3);
  if (!l) { flash('No text found there. Click right on a line of text, or use Text to add new text.'); return; }
  const { bg, ink } = sampleColors(i, l);
  await fontFile(l.font, l.bold).catch(() => {});
  const cover = { type: 'whiteout', page: i, x: l.x - 1.5, y: l.base - l.size * 0.98, w: l.w + 3, h: l.size * 1.3, color: bg, opacity: 1, id: seq++ };
  objs.push(cover); draw(cover);
  const size = Math.round(l.size * 10) / 10;
  const t = addText(i, l.x, l.base - baseOf(l.font, l.bold) * size, l.str, { font: l.font, bold: l.bold, italic: false, underline: false, align: 'left', bg: '', size, color: ink, opacity: 1 });
  startEdit(t, false);
}
let flashT = null;
function flash(msg) { const h = $('#hint'); h.hidden = false; h.textContent = msg; h.classList.add('warn'); clearTimeout(flashT); flashT = setTimeout(() => { h.classList.remove('warn'); if (ie) showProps(); else setTool(tool); }, 5000); }

// ---------- Images ----------
async function imageFromBlob(blob) {
  const url = URL.createObjectURL(blob), im = new Image();
  await new Promise((res, rej) => { im.onload = res; im.onerror = () => rej(new Error('This image can’t be opened.')); im.src = url; });
  let bytesArr, kind;
  if (blob.type === 'image/jpeg' || blob.type === 'image/png') { bytesArr = new Uint8Array(await blob.arrayBuffer()); kind = blob.type === 'image/png' ? 'png' : 'jpg'; }
  else {
    const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
    c.getContext('2d').drawImage(im, 0, 0);
    bytesArr = new Uint8Array(await (await canvasBlob(c, 'image/png')).arrayBuffer()); kind = 'png';
  }
  const key = 'i' + seq++;
  imgs[key] = { url, bytes: bytesArr, kind, w: im.naturalWidth, h: im.naturalHeight };
  return key;
}
function placeImage(key, maxW) {
  const i = currentPage(), p = P[i], im = imgs[key];
  const w = Math.min(maxW, im.w), h = w * im.h / im.w;
  const r = p.wrap.getBoundingClientRect(), s = scroller.getBoundingClientRect();
  const cy = Math.min(p.vp.height - h / 2, Math.max(h / 2, ((s.top + s.bottom) / 2 - r.top) / zoom));
  setTool('select');
  addObj({ type: 'image', page: i, img: key, x: (p.vp.width - w) / 2, y: cy - h / 2, w, h, opacity: 1 });
  commit();
}
$('#imgfile').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  try { const key = await imageFromBlob(f); placeImage(key, P[currentPage()].vp.width * 0.4); } catch (err) { flash(err.message); }
});
// Paste an image from the clipboard.
document.addEventListener('paste', async e => {
  if (app.hidden || editing) return;
  const f = [...(e.clipboardData?.files || [])].find(x => x.type.startsWith('image/'));
  if (!f) return;
  e.preventDefault();
  placeImage(await imageFromBlob(f), P[currentPage()].vp.width * 0.4);
});

// ---------- Signature ----------
const dlg = $('#signdlg'), pad = $('#pad'), px = pad.getContext('2d');
let ink = '#111827', inked = false;
function openSign() {
  px.clearRect(0, 0, pad.width, pad.height); inked = false;
  fontFile('hand', true).catch(() => {});
  dlg.showModal();
}
$$('input[name="smode"]').forEach(r => r.addEventListener('change', () => $$('[data-smode]').forEach(d => { d.hidden = d.dataset.smode !== r.value || !r.checked; })));
$$('[data-ink]').forEach(b => b.addEventListener('click', () => { ink = b.dataset.ink; $$('[data-ink]').forEach(x => x.classList.toggle('on', x === b)); $('#signprev').style.color = ink; }));
$('#signname').addEventListener('input', e => { $('#signprev').textContent = e.target.value || 'Your name'; });
$('#padclear').addEventListener('click', () => { px.clearRect(0, 0, pad.width, pad.height); inked = false; });
let last = null;
pad.addEventListener('pointerdown', e => { pad.setPointerCapture(e.pointerId); last = padPt(e); });
pad.addEventListener('pointermove', e => {
  if (!last) return;
  const p = padPt(e);
  px.strokeStyle = '#000'; px.lineWidth = 5; px.lineCap = px.lineJoin = 'round';
  px.beginPath(); px.moveTo(last[0], last[1]); px.lineTo(p[0], p[1]); px.stroke();
  last = p; inked = true;
});
pad.addEventListener('pointerup', () => { last = null; });
function padPt(e) { const r = pad.getBoundingClientRect(); return [(e.clientX - r.left) * pad.width / r.width, (e.clientY - r.top) * pad.height / r.height]; }
// Crops to the ink and recolours it, removing a white paper background.
function inkOnly(src) {
  const c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
  const x = c.getContext('2d'); x.drawImage(src, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height), a = d.data;
  const [r, g, b] = [1, 3, 5].map(k => parseInt(ink.slice(k, k + 2), 16));
  let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
  for (let j = 0; j < a.length; j += 4) {
    const lum = 0.299 * a[j] + 0.587 * a[j + 1] + 0.114 * a[j + 2];
    const al = Math.round(a[j + 3] * Math.max(0, Math.min(1, (215 - lum) / 120)));
    a[j] = r; a[j + 1] = g; a[j + 2] = b; a[j + 3] = al;
    if (al > 20) { const px2 = (j / 4) % c.width, py = Math.floor(j / 4 / c.width); if (px2 < x0) x0 = px2; if (px2 > x1) x1 = px2; if (py < y0) y0 = py; if (py > y1) y1 = py; }
  }
  if (x1 < x0) return null;
  x.putImageData(d, 0, 0);
  const o = document.createElement('canvas'), m = 6;
  o.width = x1 - x0 + m * 2; o.height = y1 - y0 + m * 2;
  o.getContext('2d').drawImage(c, x0 - m, y0 - m, o.width, o.height, 0, 0, o.width, o.height);
  return o;
}
dlg.addEventListener('close', async () => {
  if (dlg.returnValue !== 'ok') return;
  const mode = $('input[name="smode"]:checked').value;
  let src = null;
  if (mode === 'draw') { if (!inked) return; src = pad; }
  if (mode === 'type') {
    const name = $('#signname').value.trim();
    if (!name) return;
    await fontFile('hand', true).catch(() => {});
    src = document.createElement('canvas'); src.width = 1200; src.height = 300;
    const x = src.getContext('2d'); x.fillStyle = '#000'; x.font = `700 170px ${cssFont('hand')}`; x.textBaseline = 'middle';
    x.fillText(name, 20, 150, 1160);
  }
  if (mode === 'upload') {
    const f = $('#signfile').files[0];
    if (!f) return;
    src = await loadImage(f);
  }
  const c = inkOnly(src);
  if (!c) return;
  const key = await imageFromBlob(await canvasBlob(c, 'image/png'));
  placeImage(key, 150);
});

// ---------- Save ----------
// A comment as a real PDF note (a "Text" annotation): readers show a note icon that opens the comment.
// It carries its own drawing of the icon, so it looks the same in every reader.
function addNote(pdf, page, o, at) {
  const ctx = pdf.context, a = at(o.x, o.y + o.h), b = at(o.x + o.w, o.y);
  const rect = [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])];
  const w = rect[2] - rect[0], h = rect[3] - rect[1], [r, g, bl] = hexRgb01(o.color).map(v => v.toFixed(3));
  const icon = `q ${r} ${g} ${bl} rg 0.25 0.25 0.25 RG 0.8 w 0.5 0.5 ${(w - 1).toFixed(2)} ${(h - 1).toFixed(2)} re B ` +
    `0.6 w ${(w * 0.2).toFixed(2)} ${(h * 0.62).toFixed(2)} m ${(w * 0.8).toFixed(2)} ${(h * 0.62).toFixed(2)} l S ${(w * 0.2).toFixed(2)} ${(h * 0.42).toFixed(2)} m ${(w * 0.65).toFixed(2)} ${(h * 0.42).toFixed(2)} l S Q`;
  const ap = ctx.flateStream(icon, { Type: 'XObject', Subtype: 'Form', BBox: [0, 0, w, h] });
  const annot = ctx.obj({
    Type: 'Annot', Subtype: 'Text', Rect: rect, Contents: PDFHexString.fromText(o.text || ''), Name: 'Comment',
    C: hexRgb01(o.color), Open: false, F: 4 | 8 | 16, M: PDFString.fromDate(new Date()), T: PDFHexString.fromText('Comment'),
    AP: { N: ctx.register(ap) },
  });
  page.node.addAnnot(ctx.register(annot));
}
const hexRgb = h => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
$('#save').addEventListener('click', async () => {
  if (ie) await finishLine(true);
  stopEdit(); select(null);
  const btn = $('#save');
  btn.disabled = true;
  out.hidden = false;
  out.innerHTML = '<p class="kicker">Edited PDF</p><p class="sub">Saving your changes…</p>';
  out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  try {
    let base = srcBytes;
    if (eng && eng.version) {
      const putBack = eng.cleanup(); // removed images are restored afterwards, so undo still works
      try { base = await eng.pdf.save(); } finally { putBack(); }
    }
    const pdf = await PDFDocument.load(base, { updateMetadata: false });
    pdf.registerFontkit(fontkit);
    // Deleted and added pages, then turned ones. Pages keep their order, so this is done in place
    // (bookmarks, forms and links of the pages that stay are kept).
    const count = pdf.getPageCount(), kept = new Set(P.map(p => p.src));
    if (P.length !== count || P.some((p, i) => p.src !== i)) {
      for (let k = count - 1; k >= 0; k--) if (!kept.has(k)) pdf.removePage(k);
      P.forEach((p, i) => { if (p.src == null) pdf.insertPage(i, p.blank); });
    }
    const pages = pdf.getPages(), fonts = {}, images = {};
    P.forEach((p, i) => { if (p.rot) pages[i].setRotation(degrees((p.baseRot + p.rot) % 360)); });
    for (const o of objs) {
      const page = pages[o.page], vp = P[o.page].vp;
      const at = (vx, vy) => vp.convertToPdfPoint(vx, vy);
      const [ox, oy] = at(o.x, o.y), [ux, uy] = at(o.x + 1, o.y);
      const rot = degrees(Math.atan2(uy - oy, ux - ox) * 180 / Math.PI);
      const opacity = o.opacity ?? 1;
      if (o.type === 'text') {
        const it = o.italic && !FONTS[o.font].noItalic, k = `${o.font}-${o.bold ? 7 : 4}-${it ? 'i' : 'n'}`;
        fonts[k] ??= await pdf.embedFont(await fontFile(o.font, o.bold, it), { subset: true });
        const base = baseOf(o.font, o.bold, it), color = hexRgb(o.color);
        if (o.bg) page.drawSvgPath(`M0 0H${o.w}V${o.h}H0Z`, { x: ox, y: oy, rotate: rot, color: hexRgb(o.bg), opacity });
        o.text.split('\n').forEach((line, n) => {
          if (!line) return;
          const lw = fonts[k].widthOfTextAtSize(line, o.size), dx = o.align === 'center' ? (o.w - lw) / 2 : o.align === 'right' ? o.w - lw : 0;
          const ly = o.y + (n * LH + base) * o.size, [bx, by] = at(o.x + dx, ly);
          page.drawText(line, { x: bx, y: by, size: o.size, font: fonts[k], color, opacity, rotate: rot });
          if (o.underline) { const [ux0, uy0] = at(o.x + dx, ly + o.size * 0.12); page.drawSvgPath(`M0 0H${lw.toFixed(2)}`, { x: ux0, y: uy0, rotate: rot, borderColor: color, borderWidth: Math.max(0.5, o.size * 0.06), borderOpacity: opacity }); }
        });
      } else if (o.type === 'note') {
        addNote(pdf, page, o, at);
      } else if (o.type === 'image') {
        const im = imgs[o.img];
        images[o.img] ??= im.kind === 'png' ? await pdf.embedPng(im.bytes) : await pdf.embedJpg(im.bytes);
        const [bx, by] = at(o.x, o.y + o.h);
        page.drawImage(images[o.img], { x: bx, y: by, width: o.w, height: o.h, rotate: rot, opacity });
      } else {
        const opts = { x: ox, y: oy, rotate: rot };
        if (filled(o)) { opts.color = hexRgb(o.color); opts.opacity = opacity; }
        if (stroked(o)) { opts.borderColor = hexRgb(o.color); opts.borderWidth = o.width; opts.borderOpacity = opacity; opts.borderLineCap = o.type === 'underline' || o.type === 'strike' ? LineCapStyle.Butt : LineCapStyle.Round; }
        if (o.type === 'highlight') opts.blendMode = BlendMode.Multiply;
        page.drawSvgPath(pathOf(o), opts);
      }
    }
    const bytesOut = await pdf.save();
    await showPdfResult(out, bytesOut, { title: 'Edited PDF', name: `${baseName(srcName)}-edited.pdf`, label: 'Download edited PDF', max: 12,
      note: 'This preview is the saved file. To change something, keep editing above and press Preview &amp; download again.' });
  } catch (err) {
    out.innerHTML = `<p class="kicker">Edited PDF</p><span class="verdict no">Couldn’t save the PDF</span><p class="sub">${esc(err.message || String(err))}</p>`;
  }
  btn.disabled = false;
});

window.addEventListener('beforeunload', e => { if (unsaved() && !app.hidden) e.preventDefault(); });
