// Crop PDF: the crop box is kept as fractions of the page as shown (0–1 from the top-left), so it can be
// applied to pages of any size. Saving sets each page's crop box (and media box, for printers).
const { PDFDocument } = PDFLib;
const out = $('#out'), MM = 72 / 25.4;
let srcBytes = null, name = 'document', doc = null, cur = 1, box = { x0: 0, y0: 0, x1: 1, y1: 1 }, vp = null;

fileDrop($('#drop'), $('#file'), fs => { const f = fs.find(isPdf); if (f) open(f); });
$('#sample').addEventListener('click', async () => open(await samplePdf(3, 'Crop me')));

async function open(f) {
  try {
    const b = new Uint8Array(await f.arrayBuffer());
    const probe = await PDFDocument.load(b, { ignoreEncryption: true, updateMetadata: false });
    if (probe.isEncrypted) { $('#loaded').innerHTML = `This PDF is password-protected. Unlock it first with <a href="${(window.TF_BASE || '') + '/unlock-pdf'}">Unlock PDF</a>.`; return; }
    doc = await openPdf(b); srcBytes = b; name = baseName(f.name);
  } catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged.'; return; }
  $('#loaded').textContent = `${f.name} · ${doc.numPages} page${doc.numPages > 1 ? 's' : ''}`;
  ['auto', 'reset', 'go'].forEach(id => { $('#' + id).disabled = false; });
  box = { x0: 0.06, y0: 0.06, x1: 0.94, y1: 0.94 };
  cur = 1; show();
}

async function show() {
  const page = await doc.getPage(cur);
  vp = page.getViewport({ scale: 1 });
  const c = await renderPdfPage(doc, cur, Math.min(2, 900 / vp.width));
  out.innerHTML = `<p class="kicker">Page ${cur} of ${doc.numPages} · drag the box</p>
    <div class="cp-wrap"><div class="cp-stage" id="stage"><div class="cp-box" id="box">${['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(h => `<i data-h="${h}"></i>`).join('')}</div></div></div>
    <div class="cp-nav"><button type="button" id="prev" aria-label="Previous page">‹</button><span id="size"></span><button type="button" id="next" aria-label="Next page">›</button></div>`;
  c.setAttribute('aria-label', `Page ${cur}`);
  $('#stage').prepend(c);
  $('#prev').disabled = cur <= 1; $('#next').disabled = cur >= doc.numPages;
  $('#prev').onclick = () => { cur--; show(); };
  $('#next').onclick = () => { cur++; show(); };
  wire(); place();
}
// Box on screen and in the margin fields.
function place() {
  const b = $('#box');
  if (!b) return;
  Object.assign(b.style, { left: `${box.x0 * 100}%`, top: `${box.y0 * 100}%`, width: `${(box.x1 - box.x0) * 100}%`, height: `${(box.y1 - box.y0) * 100}%` });
  const W = vp.width / MM, H = vp.height / MM, r = v => Math.round(v * 10) / 10;
  $('#m-t').value = r(box.y0 * H); $('#m-b').value = r((1 - box.y1) * H); $('#m-l').value = r(box.x0 * W); $('#m-r').value = r((1 - box.x1) * W);
  $('#size').textContent = `Kept: ${Math.round((box.x1 - box.x0) * W)} × ${Math.round((box.y1 - box.y0) * H)} mm`;
}
['t', 'r', 'b', 'l'].forEach(k => $('#m-' + k).addEventListener('input', () => {
  if (!vp) return;
  const W = vp.width / MM, H = vp.height / MM, v = id => Math.max(0, +$('#m-' + id).value || 0);
  const nb = { x0: v('l') / W, y0: v('t') / H, x1: 1 - v('r') / W, y1: 1 - v('b') / H };
  if (nb.x1 - nb.x0 > 0.02 && nb.y1 - nb.y0 > 0.02) { box = nb; const b = $('#box'); if (b) Object.assign(b.style, { left: `${box.x0 * 100}%`, top: `${box.y0 * 100}%`, width: `${(box.x1 - box.x0) * 100}%`, height: `${(box.y1 - box.y0) * 100}%` }); $('#size').textContent = `Kept: ${Math.round((box.x1 - box.x0) * W)} × ${Math.round((box.y1 - box.y0) * H)} mm`; }
}));
function wire() {
  const st = $('#stage');
  let d = null;
  st.addEventListener('pointerdown', e => {
    const r = st.getBoundingClientRect(), h = e.target.dataset.h || (e.target.id === 'box' ? 'move' : null);
    if (!h) return;
    e.preventDefault(); st.setPointerCapture(e.pointerId);
    d = { h, r, x: e.clientX, y: e.clientY, b: { ...box } };
  });
  st.addEventListener('pointermove', e => {
    if (!d) return;
    const dx = (e.clientX - d.x) / d.r.width, dy = (e.clientY - d.y) / d.r.height, b = { ...d.b }, min = 0.03, cl = v => Math.min(1, Math.max(0, v));
    if (d.h === 'move') { const w = b.x1 - b.x0, h = b.y1 - b.y0; b.x0 = cl(Math.min(1 - w, b.x0 + dx)); b.y0 = cl(Math.min(1 - h, b.y0 + dy)); b.x1 = b.x0 + w; b.y1 = b.y0 + h; }
    else {
      if (d.h.includes('w')) b.x0 = cl(Math.min(b.x1 - min, b.x0 + dx));
      if (d.h.includes('e')) b.x1 = cl(Math.max(b.x0 + min, b.x1 + dx));
      if (d.h.includes('n')) b.y0 = cl(Math.min(b.y1 - min, b.y0 + dy));
      if (d.h.includes('s')) b.y1 = cl(Math.max(b.y0 + min, b.y1 + dy));
    }
    box = b; place();
  });
  ['pointerup', 'pointercancel'].forEach(ev => st.addEventListener(ev, () => { d = null; }));
}
$('#reset').addEventListener('click', () => { box = { x0: 0, y0: 0, x1: 1, y1: 1 }; place(); });

// Where the content of a page is: render it small and find the first and last non-white rows and columns.
async function contentBox(n) {
  const c = await renderPdfPage(doc, n, 0.6), w = c.width, h = c.height, d = c.getContext('2d').getImageData(0, 0, w, h).data;
  const ink = (x, y) => { const i = (y * w + x) * 4; return d[i] + d[i + 1] + d[i + 2] < 705; };
  const rowHas = y => { let k = 0; for (let x = 0; x < w; x++) if (ink(x, y) && ++k > 1) return true; return false; };
  const colHas = x => { let k = 0; for (let y = 0; y < h; y++) if (ink(x, y) && ++k > 1) return true; return false; };
  let y0 = 0, y1 = h - 1, x0 = 0, x1 = w - 1;
  while (y0 < h && !rowHas(y0)) y0++;
  if (y0 >= h) return null; // blank page
  while (y1 > y0 && !rowHas(y1)) y1--;
  while (x0 < w && !colHas(x0)) x0++;
  while (x1 > x0 && !colHas(x1)) x1--;
  const pad = 0.012 * Math.max(w, h);
  return { x0: Math.max(0, (x0 - pad) / w), y0: Math.max(0, (y0 - pad) / h), x1: Math.min(1, (x1 + 1 + pad) / w), y1: Math.min(1, (y1 + 1 + pad) / h) };
}
$('#auto').addEventListener('click', async () => {
  const b = await contentBox(cur);
  if (!b) { toast('This page is blank.', 'err'); return; }
  box = b; place();
});

$('#go').addEventListener('click', async () => {
  const scope = $('input[name="scope"]:checked').value, btn = $('#go');
  btn.disabled = true;
  try {
    const pdf = await PDFDocument.load(srcBytes, { ignoreEncryption: true, updateMetadata: false }), pages = pdf.getPages();
    let n = 0;
    for (let i = 0; i < pages.length; i++) {
      if (scope === 'one' && i !== cur - 1) continue;
      const b = scope === 'each' ? await contentBox(i + 1) : box;
      if (!b) continue;
      const v = pageView(pages[i]), pts = [[b.x0, b.y0], [b.x1, b.y1]].map(([fx, fy]) => v.at(fx * v.w, (1 - fy) * v.h));
      const x = Math.min(pts[0][0], pts[1][0]), y = Math.min(pts[0][1], pts[1][1]), w = Math.abs(pts[0][0] - pts[1][0]), h = Math.abs(pts[0][1] - pts[1][1]);
      pages[i].setMediaBox(x, y, w, h); pages[i].setCropBox(x, y, w, h);
      n++;
    }
    const outBytes = await pdf.save();
    const prev = out.innerHTML;
    await showPdfResult(out, outBytes, { title: 'Cropped PDF', name: `${name}-cropped.pdf`, label: 'Download cropped PDF', headline: `<span class="verdict ok">${n} page${n === 1 ? '' : 's'} cropped</span>`, note: '<button type="button" class="linkbtn" id="again">Change the crop</button>' });
    $('#again').onclick = () => { out.innerHTML = prev; show(); };
  } catch (e) { toast('Couldn’t crop this PDF: ' + e.message, 'err'); }
  btn.disabled = false;
});
