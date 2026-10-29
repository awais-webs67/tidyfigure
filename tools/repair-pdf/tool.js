// Repair PDF: 1) pdf-lib reads every object it can find and writes a new file with a correct index;
// 2) if that fails, pdf.js (very forgiving) draws each page it can read, and the pages are rebuilt as images
// with their text invisible on top, so it stays searchable.
let { PDFDocument, StandardFonts } = {};
onLibs(() => ({ PDFDocument, StandardFonts } = PDFLib));
const out = $('#out');
fileDrop($('#drop'), $('#file'), fs => { if (fs[0]) repair(fs[0]); });
$('#sample').addEventListener('click', async () => {
  // A good PDF with its index and its last few bytes damaged, like an interrupted download.
  const b = new Uint8Array(await (await samplePdf(3, 'Damaged file')).arrayBuffer()), s = new TextDecoder('latin1').decode(b);
  const cut = b.slice(0, s.lastIndexOf('xref') > 0 ? s.lastIndexOf('xref') + 40 : b.length - 200);
  repair(new File([cut], 'damaged-report.pdf', { type: 'application/pdf' }));
});

async function repair(f) {
  const name = baseName(f.name), src = new Uint8Array(await f.arrayBuffer());
  $('#loaded').textContent = `${f.name} · ${bytes(src.length)}`;
  out.innerHTML = '<p class="kicker">Repair</p><div class="bar"><i style="width:3%"></i></div><p class="sub" data-pct>Checking the file…</p>';
  const head = new TextDecoder('latin1').decode(src.slice(0, 1024));
  if (!head.includes('%PDF')) { fail('This isn’t a PDF file', 'It doesn’t start like a PDF. It may be a web page or another kind of file saved with a .pdf name. Try downloading it again.'); return; }
  // How many pages pdf.js can find (it reconstructs broken files itself).
  let view = null;
  try { view = await pdfjs().getDocument({ data: src.slice(0), stopAtErrors: false }).promise; } catch (e) {
    if (e && e.name === 'PasswordException') { fail('This PDF is password-protected', `It isn’t damaged. Open it with <a href="${(window.TF_BASE || '') + '/unlock-pdf'}">Unlock PDF</a>.`); return; }
  }
  // 1. Rebuild.
  try {
    setProgress(out, 0.2, 'Rebuilding the file…');
    const pdf = await PDFDocument.load(src, { ignoreEncryption: true, throwOnInvalidObject: false, updateMetadata: false });
    const n = pdf.getPageCount();
    if (n && (!view || n >= view.numPages)) {
      const outBytes = await pdf.save();
      const check = await openPdf(outBytes);
      for (let i = 1; i <= check.numPages; i++) await (await check.getPage(i)).getOperatorList();
      await showPdfResult(out, outBytes, { title: 'Repaired PDF', name: `${name}-repaired.pdf`, label: 'Download repaired PDF',
        headline: `<span class="verdict ok">Repaired: ${n} page${n === 1 ? '' : 's'}</span><p class="sub">The file’s structure was rebuilt. Text, images and quality are exactly as they were.</p>` });
      return;
    }
  } catch (e) { /* too damaged to rebuild: recover the pages instead */ }
  // 2. Recover pages.
  if (!view || !view.numPages) { fail('This PDF can’t be repaired', 'No readable pages were found in it. If it was downloaded or sent by email, try getting it again.'); return; }
  const pdf = await PDFDocument.create(), font = await pdf.embedFont(StandardFonts.Helvetica);
  const safe = t => t.replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
  let ok = 0;
  for (let i = 1; i <= view.numPages; i++) {
    setProgress(out, 0.3 + 0.7 * i / view.numPages, `Recovering page ${i} of ${view.numPages}…`);
    try {
      const page = await view.getPage(i), v1 = page.getViewport({ scale: 1 }), c = await renderPdfPage(view, i, 200 / 72);
      const img = await pdf.embedJpg(new Uint8Array(await (await canvasBlob(c, 'image/jpeg', 0.88)).arrayBuffer()));
      const p = pdf.addPage([v1.width, v1.height]);
      p.drawImage(img, { x: 0, y: 0, width: v1.width, height: v1.height });
      // The page's text, invisible but searchable, in the same places.
      const tc = await page.getTextContent();
      for (const t of tc.items) {
        const s = safe(t.str || '');
        if (!s.trim()) continue;
        const [x, y] = v1.convertToViewportPoint(t.transform[4], t.transform[5]), size = Math.max(1, Math.hypot(t.transform[2], t.transform[3]));
        try { p.drawText(s, { x, y: v1.height - y, size, font, opacity: 0 }); } catch (e) { /* letters Helvetica can't write */ }
      }
      ok++;
    } catch (e) { /* this page can't be read */ }
  }
  if (!ok) { fail('This PDF can’t be repaired', 'None of its pages could be read.'); return; }
  const outBytes = await pdf.save();
  await showPdfResult(out, outBytes, { title: 'Recovered PDF', name: `${name}-recovered.pdf`, label: 'Download recovered PDF',
    headline: `<span class="verdict ${ok === view.numPages ? 'ok' : 'tight'}">Recovered ${ok} of ${view.numPages} page${view.numPages === 1 ? '' : 's'}</span><p class="sub">The file was too damaged to rebuild, so each readable page was saved again as a sharp image with its text kept searchable.</p>` });
}
function fail(title, text) { out.innerHTML = `<p class="kicker">Repair</p><span class="verdict no">${title}</span><p class="sub">${text}</p>`; }
