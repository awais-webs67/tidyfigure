'use strict';
// Shared helpers for every tool page. Each tool's own script runs after this file.

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ok = n => Number.isFinite(n);
const val = el => (el ? parseFloat(String(el.value).replace(',', '.')) : NaN);
const fmt = (n, d = 2) => ok(n) ? n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }) : '–';
const fmtMax = (n, d = 2) => ok(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : '–';
const field = (row, name) => row.querySelector(`[data-f="${name}"]`);

// Repeating input rows (pizzas, people, dishes…). rowHtml(values) returns the inner HTML of one row.
function makeList(list, addBtn, rowHtml, initial, onChange) {
  const add = (v = {}) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = rowHtml(v);
    list.appendChild(row);
    return row;
  };
  initial.forEach(add);
  addBtn.addEventListener('click', () => {
    const row = add();
    const first = row.querySelector('input, select');
    if (first) first.focus();
    onChange();
  });
  list.addEventListener('click', e => {
    const b = e.target.closest('.rm');
    if (!b || list.children.length <= 1) return;
    b.closest('.row').remove();
    onChange();
  });
  list.addEventListener('input', onChange);
  list.addEventListener('change', onChange);
}

function onAny(selector, fn) {
  $$(selector).forEach(el => {
    el.addEventListener('input', fn);
    el.addEventListener('change', fn);
  });
}

function selectText(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

const bytes = n => n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`;
const rand = n => crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * n; // fair random float in [0, n)
const randInt = (min, max) => min + Math.floor(rand(max - min + 1));

// Drag-and-drop or click-to-choose files. accept is an <input accept> string.
function fileDrop(zone, input, onFiles) {
  zone.addEventListener('click', e => { if (e.target !== input) input.click(); });
  zone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
  input.addEventListener('change', () => { if (input.files.length) onFiles([...input.files]); input.value = ''; });
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('over'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('over'); if (e.dataTransfer.files.length) onFiles([...e.dataTransfer.files]); });
}

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`${file.name} isn't an image this browser can open.`));
    img.src = URL.createObjectURL(file);
  });
}
const canvasBlob = (canvas, type, quality) => new Promise(r => canvas.toBlob(r, type, quality));
const baseName = name => name.replace(/\.[^.]+$/, '');

// A generated photo-like test image, so visitors can try image tools without their own file.
async function sampleImage(type = 'image/png') {
  const c = document.createElement('canvas');
  c.width = 2400; c.height = 1600;
  const x = c.getContext('2d');
  const sky = x.createLinearGradient(0, 0, 0, 1600);
  sky.addColorStop(0, '#1d3b6e'); sky.addColorStop(.55, '#f08a4b'); sky.addColorStop(1, '#2b1a2f');
  x.fillStyle = sky; x.fillRect(0, 0, 2400, 1600);
  x.fillStyle = '#ffd38a'; x.beginPath(); x.arc(1600, 900, 170, 0, Math.PI * 2); x.fill();
  [['#3a2a4a', 1000, .0025], ['#24182f', 1150, .004], ['#140d1c', 1300, .006]].forEach(([col, base, f]) => {
    x.fillStyle = col; x.beginPath(); x.moveTo(0, 1600);
    for (let i = 0; i <= 2400; i += 8) x.lineTo(i, base - 180 * Math.sin(i * f) - 90 * Math.sin(i * f * 2.7));
    x.lineTo(2400, 1600); x.fill();
  });
  for (let i = 0; i < 60000; i++) { x.fillStyle = `rgba(255,255,255,${Math.random() * .05})`; x.fillRect(Math.random() * 2400, Math.random() * 1600, 2, 2); }
  const blob = await new Promise(r => c.toBlob(r, type, 0.97));
  return new File([blob], type === 'image/jpeg' ? 'sample-photo.jpg' : 'sample-sunset.png', { type });
}

// List of processed images with before/after sizes and download buttons.
// items: [{ name, before, after, blob, w, h, thumb, error }]
function renderImageResults(out, items, label) {
  const done = items.filter(i => i.blob);
  const before = done.reduce((s, i) => s + i.before, 0), after = done.reduce((s, i) => s + i.after, 0);
  let html = `<p class="kicker">${esc(label)}</p>`;
  if (done.length) {
    const pct = before ? (1 - after / before) * 100 : 0;
    html += `<p class="big"><mark>${bytes(after)}</mark></p><p class="sub">${done.length} image${done.length > 1 ? 's' : ''}, from ${bytes(before)} ${pct > 0.5 ? `(<span class="saving">${pct.toFixed(0)}% smaller</span>)` : pct < -0.5 ? `(${(-pct).toFixed(0)}% larger)` : ''}</p>`;
  }
  html += '<ul class="files">';
  items.forEach((it, i) => {
    const change = it.blob ? (1 - it.after / it.before) * 100 : 0;
    html += `<li>${it.thumb ? `<img src="${it.thumb}" alt="">` : ''}<span class="meta"><b>${esc(it.name)}</b><small>${it.error ? esc(it.error) : it.blob
      ? `${bytes(it.before)} → ${bytes(it.after)}${Math.abs(change) >= 0.5 ? ` · <span class="${change > 0 ? 'saving' : ''}">${change > 0 ? '−' : '+'}${Math.abs(change).toFixed(0)}%</span>` : ''}${it.w ? ` · ${it.w}×${it.h}` : ''}${it.note ? ` · ${esc(it.note)}` : ''}`
      : 'Working…'}</small></span>${it.blob ? `<button type="button" class="btn ghost" data-dl="${i}">Download</button>` : ''}</li>`;
  });
  html += '</ul>';
  if (done.length > 1) html += '<div class="copyrow"><button type="button" class="btn" data-dl="all">Download all</button></div>';
  out.innerHTML = html;
  out.onclick = e => {
    const b = e.target.closest('[data-dl]');
    if (!b) return;
    const list = b.dataset.dl === 'all' ? done : [items[+b.dataset.dl]];
    list.forEach((it, k) => setTimeout(() => download(it.blob, it.outName || it.name), k * 350));
  };
}

function copyText(text, btn) {
  const done = () => { if (btn) { const t = btn.textContent; btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = t; }, 1400); } };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => {});
}

// <button data-copy="elementId">Copy</button>
document.addEventListener('click', e => {
  const b = e.target.closest('[data-copy]');
  if (!b) return;
  const target = document.getElementById(b.dataset.copy);
  if (!target) return;
  const done = () => { b.textContent = 'Copied'; setTimeout(() => { b.textContent = 'Copy'; }, 1500); };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(target.innerText).then(done, () => selectText(target));
  } else {
    selectText(target);
  }
});

// ---------- PDF helpers (pages that load pdf.js and/or pdf-lib) ----------
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
function pdfjs() {
  const lib = window.pdfjsLib;
  // pdf.js wraps a cross-origin worker itself, and falls back to the main thread if workers are blocked.
  if (lib && !lib.GlobalWorkerOptions.workerSrc) lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  return lib;
}
const openPdf = bytesIn => pdfjs().getDocument({ data: bytesIn.slice(0) }).promise;

async function renderPdfPage(doc, n, scale = 1, background = '#fff') {
  const page = await doc.getPage(n);
  const vp = page.getViewport({ scale });
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(vp.width)); c.height = Math.max(1, Math.round(vp.height));
  const x = c.getContext('2d');
  x.fillStyle = background; x.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: x, viewport: vp }).promise;
  return c;
}

// A small, realistic multi-page PDF so visitors can try PDF tools without their own file.
const PDFLIB_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
const loadScript = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });

async function samplePdf(pages = 4, title = 'Quarterly report', photo = false) {
  if (!window.PDFLib) await loadScript(PDFLIB_URL);
  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const pdf = await PDFDocument.create();
  pdf.setTitle(title); pdf.setAuthor('Jane Example'); pdf.setCreator('Sample generator'); pdf.setSubject('Sample PDF'); pdf.setKeywords(['sample', 'demo']);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold), reg = await pdf.embedFont(StandardFonts.Helvetica);
  const lines = ['Revenue grew steadily across all regions this quarter.', 'Customer satisfaction scores reached a new high of 92%.', 'The team shipped four major features and fixed 130 bugs.', 'Operating costs fell by 6% thanks to better planning.', 'Next quarter we will focus on mobile and new markets.'];
  for (let i = 1; i <= pages; i++) {
    const p = pdf.addPage([595.28, 841.89]);
    p.drawRectangle({ x: 0, y: 781, width: 595.28, height: 61, color: rgb(1, 0.357, 0.208) });
    p.drawText(`${title}`, { x: 50, y: 803, size: 22, font: bold, color: rgb(1, 1, 1) });
    p.drawText(`Page ${i} of ${pages}`, { x: 50, y: 730, size: 28, font: bold, color: rgb(0.1, 0.12, 0.14) });
    lines.forEach((l, k) => p.drawText(l, { x: 50, y: 680 - k * 26, size: 13, font: reg, color: rgb(0.2, 0.25, 0.28) }));
    if (photo) {
      // A big lossless photo, like a scan, so compression has something to work on.
      const img = await pdf.embedPng(new Uint8Array(await (await sampleImage('image/png')).arrayBuffer()));
      p.drawImage(img, { x: 50, y: 60, width: 495, height: 330 });
    } else {
      [0.6, 0.85, 0.45, 0.95].forEach((h, k) => p.drawRectangle({ x: 70 + k * 120, y: 300, width: 70, height: 220 * h, color: rgb(0.2, 0.25, 0.28 + k * 0.1) }));
    }
  }
  const b = await pdf.save();
  return new File([b], 'sample-report.pdf', { type: 'application/pdf' });
}
const isPdf = f => f && (f.type === 'application/pdf' || /\.pdf$/i.test(f.name));

// ---------- Single-image tools ----------
// Calls onImage(img, file) with a loaded <img> for the first image dropped or chosen.
function pickImage(zone, input, onImage) {
  fileDrop(zone, input, async files => {
    const f = files.find(x => x.type.startsWith('image/') || /\.(heic|avif|svg)$/i.test(x.name));
    if (!f) return;
    try { onImage(await loadImage(f), f); } catch (e) { const s = zone.querySelector('span'); if (s) s.textContent = e.message; }
  });
}
const extOf = type => ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[type] || 'png');
const outType = file => (['image/png', 'image/webp'].includes(file.type) ? file.type : 'image/jpeg');

// ---------- Body measurements (health tools) ----------
// Markup: a .seg with name="units" (metric|imperial) and inputs #cm, #kg, #ft, #in, #lb inside [data-units] groups.
function bodyUnits(onChange) {
  const metric = () => $('input[name="units"]:checked').value === 'metric';
  const sync = () => { $$('[data-units]').forEach(el => { el.hidden = el.dataset.units !== (metric() ? 'metric' : 'imperial'); }); onChange(); };
  onAny('input[name="units"]', sync);
  return {
    metric,
    cm: () => (metric() ? val($('#cm')) : ((val($('#ft')) || 0) * 12 + (val($('#in')) || 0)) * 2.54),
    kg: () => (metric() ? val($('#kg')) : val($('#lb')) * 0.45359237),
    w: kg => (metric() ? `${fmt(kg, 1)} kg` : `${fmt(kg / 0.45359237, 1)} lb`),
    sync,
  };
}

// Progress bar markup and updater.
const progressHtml = label => `<p class="kicker">${esc(label)}</p><div class="bar"><i style="width:0%"></i></div><p class="sub" data-pct>0%</p>`;
function setProgress(out, p, text) {
  const i = out.querySelector('.bar i'), s = out.querySelector('[data-pct]');
  if (i) i.style.width = `${Math.round(p * 100)}%`;
  if (s) s.textContent = text || `${Math.round(p * 100)}%`;
}
