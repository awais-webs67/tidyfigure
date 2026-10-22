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
$('#go').addEventListener('click', async () => {
  const [dpi, q] = LEVELS[$('input[name="lvl"]:checked').value];
  const gray = $('#gray').checked;
  const { PDFDocument } = PDFLib;
  $('#go').disabled = true;
  const pdf = await PDFDocument.create();
  for (let n = 1; n <= doc.numPages; n++) {
    out.innerHTML = `<p class="kicker">Compressed PDF</p><p class="big"><mark>Page ${n} of ${doc.numPages}</mark></p>`;
    const page = await doc.getPage(n);
    const base = page.getViewport({ scale: 1 }); // size in points
    const c = await renderPdfPage(doc, n, dpi / 72);
    if (gray) { const x = c.getContext('2d'); x.globalCompositeOperation = 'saturation'; x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height); }
    const jpg = await pdf.embedJpg(new Uint8Array(await (await canvasBlob(c, 'image/jpeg', q)).arrayBuffer()));
    pdf.addPage([base.width, base.height]).drawImage(jpg, { x: 0, y: 0, width: base.width, height: base.height });
  }
  const outBytes = await pdf.save();
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
    note: 'Check the pages are still sharp enough. If text looks blurry, choose a lighter level and compress again.' });
});
