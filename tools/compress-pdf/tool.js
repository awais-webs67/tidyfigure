const LEVELS = { strong: [96, 0.55], rec: [130, 0.7], light: [170, 0.82] }; // [DPI, JPG quality]
let file = null, srcBytes = null, doc = null;
const out = $('#out');

async function open(f) {
  if (!isPdf(f)) return;
  try {
    srcBytes = new Uint8Array(await f.arrayBuffer());
    doc = await openPdf(srcBytes);
    file = f;
    $('#loaded').textContent = `${f.name} · ${doc.numPages} pages · ${bytes(f.size)}`;
    $('#go').disabled = false;
    out.innerHTML = `<p class="kicker">Compressed PDF</p><p class="empty">Ready. Press Compress.</p>`;
  } catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged or password-protected.'; }
}

fileDrop($('#drop'), $('#file'), fs => open(fs[0]));
$('#sample').addEventListener('click', async () => open(await samplePdf(2, 'Scanned report', true)));
onAny('input[name="lvl"]', () => { $('#sizewrap').hidden = $('input[name="lvl"]:checked').value !== 'size'; });
// Landing pages ("compress PDF to 100 KB") start in Exact size mode with their limit.
if (typeof PRESET !== 'undefined' && PRESET && PRESET.kb) { $('#lvl-size').checked = true; $('#kb').value = PRESET.kb; $('#sizewrap').hidden = false; }
// Steps from sharpest to smallest: [DPI, JPG quality].
const LADDER = [[170, 0.82], [150, 0.76], [130, 0.7], [115, 0.64], [100, 0.58], [90, 0.52], [80, 0.46], [72, 0.4], [62, 0.35], [52, 0.3], [44, 0.26]];
let pages = null; // each page drawn once at the highest DPI, then shrunk for lower steps
async function build(dpi, q, gray) {
  const { PDFDocument } = PDFLib, pdf = await PDFDocument.create();
  for (const p of pages) {
    const k = Math.min(1, dpi / p.dpi), c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(p.c.width * k)); c.height = Math.max(1, Math.round(p.c.height * k));
    const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(p.c, 0, 0, c.width, c.height);
    if (gray) { x.globalCompositeOperation = 'saturation'; x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height); }
    const jpg = await pdf.embedJpg(new Uint8Array(await (await canvasBlob(c, 'image/jpeg', q)).arrayBuffer()));
    pdf.addPage([p.w, p.h]).drawImage(jpg, { x: 0, y: 0, width: p.w, height: p.h });
  }
  return pdf;
}
$('#go').addEventListener('click', async () => {
  const lvl = $('input[name="lvl"]:checked').value, gray = $('#gray').checked;
  if (lvl === 'size' && file.size <= (+$('#kb').value || 500) * 1024) {
    out.innerHTML = `<p class="kicker">Compressed PDF</p><span class="verdict ok">Already small enough</span><p class="sub">This PDF is ${bytes(file.size)}, already under ${$('#kb').value} KB. You can upload it as it is.</p>`;
    return;
  }
  $('#go').disabled = true;
  pages = [];
  for (let n = 1; n <= doc.numPages; n++) {
    out.innerHTML = `<p class="kicker">Compressed PDF</p><p class="big"><mark>Reading page ${n} of ${doc.numPages}</mark></p>`;
    const page = await doc.getPage(n), base = page.getViewport({ scale: 1 });
    const dpi = lvl === 'size' ? 170 : LEVELS[lvl][0];
    pages.push({ c: await renderPdfPage(doc, n, dpi / 72), dpi, w: base.width, h: base.height });
  }
  let pdf, missed = false;
  if (lvl === 'size') {
    // The sharpest step that fits under the limit (binary search on the ladder).
    const limit = (+$('#kb').value || 500) * 1024;
    let lo = 0, hi = LADDER.length - 1, best = null;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      out.innerHTML = `<p class="kicker">Compressed PDF</p><p class="big"><mark>Trying ${LADDER[mid][0]} dpi…</mark></p>`;
      const t = await build(LADDER[mid][0], LADDER[mid][1], gray), b = await t.save();
      if (b.length <= limit) { best = { pdf: t, bytes: b }; hi = mid - 1; } else lo = mid + 1;
    }
    if (!best) { const last = LADDER[LADDER.length - 1]; const t = await build(last[0], last[1], true); best = { pdf: t, bytes: await t.save() }; missed = best.bytes.length > limit; }
    pdf = best.pdf;
  } else pdf = await build(LEVELS[lvl][0], LEVELS[lvl][1], gray);
  const outBytes = await pdf.save();
  pages = null;
  const blob = new Blob([outBytes], { type: 'application/pdf' });
  const saved = (1 - blob.size / file.size) * 100;
  $('#go').disabled = false;
  if (blob.size >= file.size) {
    out.innerHTML = `<p class="kicker">Compressed PDF</p><span class="verdict tight">Already compact</span>
      <p class="sub">The compressed version (${bytes(blob.size)}) would be larger than your original (${bytes(file.size)}). This PDF is mostly text and vector graphics, which are already efficient. Try “Strong”, or remove pages you don’t need.</p>`;
    return;
  }
  await showPdfResult(out, outBytes, { title: 'Compressed PDF', name: `${baseName(file.name)}-compressed.pdf`, blob, label: 'Download compressed PDF',
    headline: `<p class="big"><mark>${bytes(blob.size)}</mark></p><p class="sub">from ${bytes(file.size)} · <span class="saving">${saved.toFixed(0)}% smaller</span></p>`,
    note: missed ? `Even the strongest compression in black and white is ${bytes(blob.size)}, still above your limit. Remove pages you don’t need with <a href="${(window.TF_BASE || '') + '/delete-pdf-pages'}">Delete PDF Pages</a>, or split the PDF.` : 'Check the pages are still sharp enough. If text looks blurry, choose a lighter level and compress again.' });
});
