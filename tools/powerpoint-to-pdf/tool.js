// PowerPoint to PDF: pptx-preview draws every slide as HTML at the slide's own size (in points, so 1 px = 1 pt),
// then dom-pdf.js turns each slide into a PDF page with real text.
const out = $('#out');
let file = null;
fileDrop($('#drop'), $('#file'), fs => { const f = fs[0]; if (f) pick(f); });
$('#sample').addEventListener('click', async () => { pick(await sampleDeck()); $('#go').click(); });
function pick(f) {
  if (/\.ppt$/i.test(f.name)) { $('#loaded').textContent = 'Old .ppt files aren’t supported. Open it in PowerPoint, Keynote, Google Slides or LibreOffice and save it as .pptx first.'; file = null; $('#go').disabled = true; return; }
  file = f; $('#loaded').textContent = `${f.name} · ${bytes(f.size)}`; $('#go').disabled = false;
}
$('#go').addEventListener('click', async () => {
  if (!file) return;
  const btn = $('#go'); btn.disabled = true;
  const stage = $('#stage');
  out.innerHTML = '<p class="kicker">PDF</p><div class="bar"><i style="width:3%"></i></div><p class="sub" data-pct>Opening the presentation…</p>';
  try {
    const buf = await file.arrayBuffer();
    // The slide size, from the presentation itself (EMUs; 12700 per point).
    const zip = await JSZip.loadAsync(buf), pres = await zip.file('ppt/presentation.xml')?.async('string');
    if (!pres) throw new Error('This isn’t a PowerPoint (.pptx) file.');
    const sz = pres.match(/<p:sldSz[^>]*cx="(\d+)"[^>]*cy="(\d+)"/) || pres.match(/<p:sldSz[^>]*cy="(\d+)"[^>]*cx="(\d+)"/);
    const W = sz ? Math.round(+sz[1] / 12700) : 720, H = sz ? Math.round(+sz[2] / 12700) : 405;
    stage.innerHTML = '';
    const pv = pptxPreview.init(stage, { width: W, height: H, mode: 'list' });
    await pv.preview(buf);
    setProgress(out, 0.3, 'Loading the fonts…');
    await DomPdf.prepare(stage);
    await Promise.all([...stage.querySelectorAll('img')].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; setTimeout(r, 8000); })));
    const slides = [...stage.querySelectorAll('.pptx-preview-slide-wrapper')];
    if (!slides.length) throw new Error('No slides were found in this presentation.');
    setProgress(out, 0.4, 'Drawing the slides…');
    const name = baseName(file.name);
    const pdfBytes = await DomPdf.render(slides.map(el => ({ el, w: W, h: H, pad: [0, 0, 0, 0], ptPerPx: 1 })), { title: name, onProgress: n => setProgress(out, Math.min(0.95, 0.4 + n / slides.length * 0.55), `Drawing slide ${n} of ${slides.length}…`) });
    stage.innerHTML = '';
    await showPdfResult(out, pdfBytes, { title: 'PDF', name: `${name}.pdf`, label: 'Download PDF', headline: `<span class="verdict ok">${slides.length} slide${slides.length > 1 ? 's' : ''} converted</span>` });
  } catch (e) {
    stage.innerHTML = '';
    out.innerHTML = `<p class="kicker">PDF</p><span class="verdict no">Couldn’t convert this presentation</span><p class="sub">${esc(e.message || String(e))}</p>`;
  }
  btn.disabled = false;
});
// A small sample deck (assets/samples/sample-slides.pptx).
async function sampleDeck() {
  const r = await fetch(`${window.TF_BASE || ''}/assets/samples/sample-slides.pptx`);
  return new File([await r.blob()], 'launch-plan.pptx', { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
}
