// PDF to PowerPoint. Editable: each page is drawn twice by pdf.js, once normally and once with text drawing
// switched off; the text-free picture is the slide, and each line of text (pdf-read.js) becomes a text box,
// with its colour read from where the two pictures differ. PptxGenJS writes the .pptx.
const out = $('#out');
let doc = null, name = 'presentation';
fileDrop($('#drop'), $('#file'), fs => { const f = fs.find(isPdf); if (f) open(f); });
$('#sample').addEventListener('click', async () => open(await sampleDeck()));
async function open(f) {
  try { doc = await openPdf(new Uint8Array(await f.arrayBuffer())); } catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged or password-protected.'; return; }
  name = baseName(f.name);
  $('#loaded').textContent = `${f.name} · ${doc.numPages} page${doc.numPages > 1 ? 's' : ''}`;
  $('#go').disabled = false;
  $('#go').click();
}
// The page drawn at scale k, with or without its text.
async function draw(n, k, text) {
  const page = await doc.getPage(n), vp = page.getViewport({ scale: k }), c = document.createElement('canvas');
  c.width = Math.round(vp.width); c.height = Math.round(vp.height);
  const x = c.getContext('2d', { willReadFrequently: true });
  x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
  if (!text) { x.fillText = () => {}; x.strokeText = () => {}; }
  await page.render({ canvasContext: x, viewport: vp }).promise;
  return c;
}
// Text colour: the pixels that change when the text is drawn, strongest first.
function colour(a, b, k, l) {
  const x0 = Math.max(0, Math.floor(l.x0 * k)), y0 = Math.max(0, Math.floor((l.base - l.size) * k)), w = Math.min(a.width - x0, Math.ceil((l.x1 - l.x0) * k)), h = Math.min(a.height - y0, Math.ceil(l.size * 1.25 * k));
  if (w < 1 || h < 1) return '000000';
  const da = a.getContext('2d').getImageData(x0, y0, w, h).data, db = b.getContext('2d').getImageData(x0, y0, w, h).data, px = [];
  for (let i = 0; i < da.length; i += 4) { const d = Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]); if (d > 90) px.push([d, da[i], da[i + 1], da[i + 2]]); }
  if (!px.length) return '000000';
  px.sort((p, q) => q[0] - p[0]);
  const top = px.slice(0, Math.max(1, Math.ceil(px.length * 0.25))), avg = c => Math.round(top.reduce((s, p) => s + p[c], 0) / top.length);
  return [avg(1), avg(2), avg(3)].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}
$('#go').addEventListener('click', async () => {
  if (!doc) return;
  const btn = $('#go'), look = $('input[name="mode"]:checked').value === 'look';
  btn.disabled = true;
  out.innerHTML = '<p class="kicker">Presentation</p><div class="bar"><i style="width:2%"></i></div><p class="sub" data-pct>Starting…</p>';
  try {
    const first = (await doc.getPage(1)).getViewport({ scale: 1 }), W = first.width / 72, H = first.height / 72;
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: 'PDF', width: W, height: H });
    pptx.layout = 'PDF';
    pptx.title = name;
    const previews = [];
    let boxes = 0;
    for (let n = 1; n <= doc.numPages; n++) {
      setProgress(out, (n - 1) / doc.numPages * 0.95 + 0.02, `Slide ${n} of ${doc.numPages}…`);
      const v = (await doc.getPage(n)).getViewport({ scale: 1 }), fit = Math.min(W * 72 / v.width, H * 72 / v.height);
      const ox = (W - v.width * fit / 72) / 2, oy = (H - v.height * fit / 72) / 2, k = 2;
      const slide = pptx.addSlide();
      const full = await draw(n, k, true);
      const bg = look ? full : await draw(n, k, false);
      slide.addImage({ data: bg.toDataURL('image/jpeg', 0.9).replace(/^data:/, ''), x: ox, y: oy, w: v.width * fit / 72, h: v.height * fit / 72 });
      if (!look) {
        const p = await PdfRead.readPage(doc, n, { images: false });
        for (const l of p.lines) {
          const col = colour(full, bg, k, l), runs = l.runs.map((r, i) => ({ text: i === 0 ? r.text.replace(/^\s+/, '') : r.text, options: { bold: r.bold, italic: r.italic, fontSize: Math.max(1, Math.round(r.size * fit * 2) / 2), fontFace: r.family || 'Arial', color: col } })).filter(r => r.text);
          if (!runs.length) continue;
          slide.addText(runs, { x: ox + l.x0 * fit / 72, y: oy + (l.base - l.size * 0.98) * fit / 72, w: (l.x1 - l.x0) * fit / 72 * 1.06 + 0.05, h: l.size * 1.3 * fit / 72, margin: 0, valign: 'top', fit: 'none', wrap: false, paraSpaceBefore: 0, paraSpaceAfter: 0 });
          boxes++;
        }
      }
      if (previews.length < 12) { const t = document.createElement('canvas'), s = 220 / full.width; t.width = 220; t.height = Math.round(full.height * s); t.getContext('2d').drawImage(full, 0, 0, t.width, t.height); previews.push(t); }
    }
    setProgress(out, 0.98, 'Writing the PowerPoint file…');
    const blob = await pptx.write({ outputType: 'blob' });
    out.innerHTML = `<p class="kicker">Presentation</p><span class="verdict ok">Ready</span><p class="sub">${esc(name)}.pptx · ${doc.numPages} slide${doc.numPages > 1 ? 's' : ''}${look ? ' as pictures' : ` · ${boxes} editable text box${boxes === 1 ? '' : 'es'}`} · ${bytes(blob.size)}</p>
      <div class="btns"><button type="button" class="btn big-btn" id="dl">Download PowerPoint file</button></div><div class="pp-slides" id="slides"></div>`;
    previews.forEach((c, i) => { const f = document.createElement('figure'); c.setAttribute('aria-label', `Slide ${i + 1}`); f.appendChild(c); f.insertAdjacentHTML('beforeend', `<figcaption>Slide ${i + 1}</figcaption>`); $('#slides').appendChild(f); });
    $('#dl').onclick = () => download(blob, `${name}.pptx`);
  } catch (e) { out.innerHTML = `<p class="kicker">Presentation</p><span class="verdict no">Couldn’t convert this PDF</span><p class="sub">${esc(e.message || String(e))}</p>`; }
  btn.disabled = false;
});
// A two-slide sample deck with a coloured background, a white title and a chart.
async function sampleDeck() {
  if (!window.PDFLib) await loadScript(PDFLIB_URL);
  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const pdf = await PDFDocument.create(), f = await pdf.embedFont(StandardFonts.Helvetica), b = await pdf.embedFont(StandardFonts.HelveticaBold);
  const s1 = pdf.addPage([960, 540]);
  s1.drawRectangle({ x: 0, y: 0, width: 960, height: 540, color: rgb(0.11, 0.16, 0.3) });
  s1.drawText('Product launch plan', { x: 70, y: 300, size: 54, font: b, color: rgb(1, 1, 1) });
  s1.drawText('Marketing team · Spring 2026', { x: 72, y: 250, size: 24, font: f, color: rgb(1, 0.6, 0.35) });
  const s2 = pdf.addPage([960, 540]);
  s2.drawText('Sales by quarter', { x: 70, y: 450, size: 36, font: b, color: rgb(0.11, 0.16, 0.3) });
  ['Q1: 1.2m', 'Q2: 1.6m', 'Q3: 1.9m', 'Q4: 2.4m'].forEach((t, i) => { s2.drawText(t, { x: 80, y: 360 - i * 40, size: 22, font: f, color: rgb(0.2, 0.22, 0.25) }); s2.drawRectangle({ x: 560 + i * 80, y: 90, width: 50, height: [120, 160, 190, 240][i], color: rgb(1, 0.36, 0.21) }); });
  return new File([await pdf.save()], 'launch-plan.pdf', { type: 'application/pdf' });
}
