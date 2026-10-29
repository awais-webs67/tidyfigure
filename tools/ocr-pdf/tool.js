// OCR PDF: each scanned page is drawn by pdf.js and read by Tesseract, which also writes a one-page PDF holding
// only the invisible text; that page is laid over the original page with pdf-lib, so nothing visible changes.
const { PDFDocument, degrees } = PDFLib;
const out = $('#out');
let src = null, name = 'scan';
fileDrop($('#drop'), $('#file'), fs => { const f = fs.find(isPdf); if (f) open(f); });
$('#sample').addEventListener('click', async () => { await open(await sampleScan()); $('#go').click(); });
async function open(f) {
  try {
    const b = new Uint8Array(await f.arrayBuffer());
    const probe = await PDFDocument.load(b, { ignoreEncryption: true, updateMetadata: false });
    if (probe.isEncrypted) { $('#loaded').innerHTML = `This PDF is password-protected. Unlock it first with <a href="${(window.TF_BASE || '') + '/unlock-pdf'}">Unlock PDF</a>.`; return; }
    src = b; name = baseName(f.name);
    $('#loaded').textContent = `${f.name} · ${probe.getPageCount()} page${probe.getPageCount() > 1 ? 's' : ''}`;
    $('#go').disabled = false;
  } catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged.'; }
}
let reader = null, readerLangs = '', onLog = null;
function getReader(langs) {
  if (reader && readerLangs === langs) return reader;
  if (reader) reader.then(w => w.terminate()).catch(() => {});
  readerLangs = langs;
  reader = (async () => {
    const w = await Tesseract.createWorker(langs, 1, { logger: m => onLog && onLog(m) });
    await w.setParameters({ tessedit_pageseg_mode: '3' });
    return w;
  })();
  reader.catch(() => { reader = null; });
  return reader;
}
$('#go').addEventListener('click', async () => {
  if (!src) return;
  const btn = $('#go'); btn.disabled = true;
  const langs = [$('#lang').value, $('#lang2').value].filter((v, i, a) => v && a.indexOf(v) === i).join('+');
  out.innerHTML = '<p class="kicker">Searchable PDF</p><div class="bar"><i style="width:2%"></i></div><p class="sub" data-pct>Getting the text reader ready…</p>';
  try {
    const view = await openPdf(src), pdf = await PDFDocument.load(src, { updateMetadata: false }), pages = pdf.getPages();
    let done = 0, read = 0, skipped = 0, words = 0, cur = 0;
    onLog = m => { if (m.status === 'recognizing text') setProgress(out, (done + m.progress) / view.numPages, `Reading page ${cur} of ${view.numPages}… ${Math.round(m.progress * 100)}%`); else if (/loading|initializ/.test(m.status) && !read) setProgress(out, 0.02, 'Getting the text reader ready…'); };
    const w = await getReader(langs);
    for (let n = 1; n <= view.numPages; n++) {
      cur = n;
      const page = await view.getPage(n);
      const has = (await page.getTextContent()).items.reduce((s, t) => s + t.str.trim().length, 0);
      if (has > 30 && !$('#all').checked) { skipped++; done++; continue; }
      // About 300 dpi, but no more than 3500 pixels on the long side.
      const v1 = page.getViewport({ scale: 1 }), k = Math.min(300 / 72, 3500 / Math.max(v1.width, v1.height));
      const c = await renderPdfPage(view, n, k);
      const { data } = await w.recognize(c, { pdfTitle: name, pdfTextOnly: true }, { pdf: true, text: true });
      words += (data.text || '').split(/\s+/).filter(Boolean).length;
      // The text-only page from Tesseract, stretched over the page as it is shown.
      const [layer] = await pdf.embedPdf(new Uint8Array(data.pdf));
      const pv = pageView(pages[n - 1]), [x, y] = pv.at(0, 0);
      pages[n - 1].drawPage(layer, { x, y, width: pv.w, height: pv.h, rotate: degrees(pv.angle) });
      read++; done++;
    }
    const outBytes = await pdf.save();
    await showPdfResult(out, outBytes, { title: 'Searchable PDF', name: `${name}-searchable.pdf`, label: 'Download searchable PDF',
      headline: read ? `<span class="verdict ok">${read} page${read === 1 ? '' : 's'} made searchable</span><p class="sub">${words.toLocaleString()} words found${skipped ? ` · ${skipped} page${skipped === 1 ? '' : 's'} already had text` : ''}.</p>`
        : '<span class="verdict tight">Already searchable</span><p class="sub">Every page already has text. Tick “Also read pages that already have text” to read them anyway.</p>' });
  } catch (e) { out.innerHTML = `<p class="kicker">Searchable PDF</p><span class="verdict no">Couldn’t read this PDF</span><p class="sub">${esc(e.message || String(e))}</p>`; }
  onLog = null; btn.disabled = false;
});
// A sample "scan": a page of text drawn into a picture, then saved as a PDF holding only that picture.
async function sampleScan() {
  const c = document.createElement('canvas'); c.width = 1240; c.height = 1754;
  const x = c.getContext('2d');
  x.fillStyle = '#f4f1ea'; x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = '#1b1b1b'; x.font = 'bold 52px Georgia, serif'; x.fillText('Tenancy Agreement', 110, 200);
  x.font = '30px Georgia, serif';
  ['This agreement is made on 1 March 2026 between the landlord,', 'Mr Samuel Patel, and the tenant, Ms Jane Example.', '', 'The tenant agrees to pay a monthly rent of 950 pounds,', 'due on the first day of each month, by bank transfer.', '', 'The deposit of 1,100 pounds is held in a protected scheme', 'and will be returned within ten days of the end of the tenancy.'].forEach((l, i) => x.fillText(l, 110, 320 + i * 52));
  x.save(); x.translate(620, 877); x.rotate(-0.006); x.drawImage(c, -620, -877); x.restore();
  const pdf = await PDFDocument.create(), img = await pdf.embedJpg(new Uint8Array(await (await canvasBlob(c, 'image/jpeg', 0.85)).arrayBuffer()));
  const p = pdf.addPage([595.28, 841.89]); p.drawImage(img, { x: 0, y: 0, width: 595.28, height: 841.89 });
  return new File([await pdf.save()], 'scanned-agreement.pdf', { type: 'application/pdf' });
}
