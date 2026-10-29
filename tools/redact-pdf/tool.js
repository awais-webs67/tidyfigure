// Redact PDF. Boxes are kept per page in PDF coordinates [x0, y0, x1, y1]. Saving deletes the letters under
// them with the content engine (pdf-engine.js), draws black boxes, and turns pages into images where a box
// covers part of a picture. The result is searched again to show nothing marked is left.
let { PDFDocument, rgb } = {};
onLibs(() => ({ PDFDocument, rgb } = PDFLib));
const out = $('#out');
let srcBytes = null, name = 'document', doc = null, eng = null, cur = 1, vp = null, boxes = {}, marked = new Set();

fileDrop($('#drop'), $('#file'), fs => { const f = fs.find(isPdf); if (f) open(f); });
$('#sample').addEventListener('click', async () => open(await sampleLetter()));
// A sample letter full of private details, to try the quick finds on.
async function sampleLetter() {
  const pdf = await PDFDocument.create(), f = await pdf.embedFont(PDFLib.StandardFonts.Helvetica), fb = await pdf.embedFont(PDFLib.StandardFonts.HelveticaBold);
  const lines = [['Offer of employment', fb, 20], ['', f, 11], ['Dear Jane Example,', f, 11], ['', f, 11],
    ['We are pleased to offer you the role of Senior Analyst, starting on 1 March 2026,', f, 11], ['with a yearly salary of GBP 48,500, paid monthly into account 12345678 (sort code 20-45-67).', f, 11], ['', f, 11],
    ['Please confirm by email to hr@example.com or call Sam Patel on +44 20 7946 0958.', f, 11], ['Your employee number will be 99001234 and your desk is on floor 4.', f, 11], ['', f, 11],
    ['Address on file: 14 Sample Street, London, W1A 1AA', f, 11], ['Personal email: jane.example@mail.com, mobile 07700 900123', f, 11], ['', f, 11], ['Kind regards,', f, 11], ['Example Ltd, People Team', fb, 11]];
  const p = pdf.addPage([595.28, 841.89]);
  let y = 770;
  for (const [t, font, size] of lines) { if (t) p.drawText(t, { x: 60, y, size, font, color: PDFLib.rgb(0.12, 0.14, 0.17) }); y -= size * 1.9; }
  pdf.setAuthor('Sam Patel'); pdf.setTitle('Offer letter - Jane Example');
  return new File([await pdf.save()], 'offer-letter.pdf', { type: 'application/pdf' });
}

async function open(f) {
  try {
    const b = new Uint8Array(await f.arrayBuffer());
    const lib = await PDFDocument.load(b, { ignoreEncryption: true, updateMetadata: false });
    if (lib.isEncrypted) { $('#loaded').innerHTML = `This PDF is password-protected. Unlock it first with <a href="${(window.TF_BASE || '') + '/unlock-pdf'}">Unlock PDF</a>.`; return; }
    doc = await openPdf(b); srcBytes = b; name = baseName(f.name);
    try { eng = await PdfEngine.load(lib); } catch (e) { eng = null; }
  } catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged.'; return; }
  $('#loaded').textContent = `${f.name} · ${doc.numPages} page${doc.numPages > 1 ? 's' : ''}`;
  $$('#find, #clear, #go, .rd-quick button').forEach(b => { b.disabled = false; });
  boxes = {}; marked = new Set(); cur = 1; $('#found').textContent = '';
  show();
}
const count = () => Object.values(boxes).reduce((s, a) => s + a.length, 0);

async function show() {
  const page = await doc.getPage(cur);
  vp = page.getViewport({ scale: 1 });
  const c = await renderPdfPage(doc, cur, Math.min(2, 900 / vp.width));
  out.innerHTML = `<p class="kicker">Page ${cur} of ${doc.numPages} · drag to add a box</p>
    <div class="rd-wrap"><div class="rd-stage" id="stage"></div></div>
    <div class="rd-nav"><button type="button" id="prev" aria-label="Previous page">‹</button><span id="info"></span><button type="button" id="next" aria-label="Next page">›</button></div>`;
  c.setAttribute('aria-label', `Page ${cur}`);
  $('#stage').appendChild(c);
  $('#prev').disabled = cur <= 1; $('#next').disabled = cur >= doc.numPages;
  $('#prev').onclick = () => { cur--; show(); };
  $('#next').onclick = () => { cur++; show(); };
  wire(); draw();
}
// PDF box <-> fraction of the page on screen.
function toView(b) {
  const a = vp.convertToViewportPoint(b[0], b[1]), z = vp.convertToViewportPoint(b[2], b[3]);
  return [Math.min(a[0], z[0]) / vp.width, Math.min(a[1], z[1]) / vp.height, Math.abs(a[0] - z[0]) / vp.width, Math.abs(a[1] - z[1]) / vp.height];
}
function toPdf(fx0, fy0, fx1, fy1) {
  const a = vp.convertToPdfPoint(fx0 * vp.width, fy0 * vp.height), z = vp.convertToPdfPoint(fx1 * vp.width, fy1 * vp.height);
  return [Math.min(a[0], z[0]), Math.min(a[1], z[1]), Math.max(a[0], z[0]), Math.max(a[1], z[1])];
}
function draw() {
  const st = $('#stage');
  if (!st) return;
  st.querySelectorAll('.rd-box').forEach(e => e.remove());
  (boxes[cur] || []).forEach((b, k) => {
    const [x, y, w, h] = toView(b), e = document.createElement('div');
    e.className = 'rd-box';
    Object.assign(e.style, { left: `${x * 100}%`, top: `${y * 100}%`, width: `${w * 100}%`, height: `${h * 100}%` });
    e.innerHTML = `<button type="button" data-k="${k}" aria-label="Remove this box">×</button>`;
    st.appendChild(e);
  });
  const n = count();
  $('#info').textContent = `${(boxes[cur] || []).length} box${(boxes[cur] || []).length === 1 ? '' : 'es'} here · ${n} in total`;
}
function wire() {
  const st = $('#stage');
  let d = null;
  st.addEventListener('pointerdown', e => {
    const x = e.target.closest('button[data-k]');
    if (x) { boxes[cur].splice(+x.dataset.k, 1); draw(); return; }
    e.preventDefault(); st.setPointerCapture(e.pointerId);
    const r = st.getBoundingClientRect(), el = document.createElement('div');
    el.className = 'rd-box new'; st.appendChild(el);
    d = { r, x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, el };
  });
  st.addEventListener('pointermove', e => {
    if (!d) return;
    d.x1 = Math.min(1, Math.max(0, (e.clientX - d.r.left) / d.r.width)); d.y1 = Math.min(1, Math.max(0, (e.clientY - d.r.top) / d.r.height));
    Object.assign(d.el.style, { left: `${Math.min(d.x, d.x1) * 100}%`, top: `${Math.min(d.y, d.y1) * 100}%`, width: `${Math.abs(d.x1 - d.x) * 100}%`, height: `${Math.abs(d.y1 - d.y) * 100}%` });
  });
  const end = () => {
    if (!d) return;
    const { x, y, x1, y1, el } = d; d = null; el.remove();
    if (x1 === undefined || Math.abs(x1 - x) * vp.width < 3 || Math.abs(y1 - y) * vp.height < 3) return;
    (boxes[cur] ||= []).push(toPdf(Math.min(x, x1), Math.min(y, y1), Math.max(x, x1), Math.max(y, y1)));
    draw();
  };
  st.addEventListener('pointerup', end); st.addEventListener('pointercancel', end);
}

// Find & mark: searches the letters the content engine read from each page, so boxes fit the words exactly.
const QUICK = {
  email: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
  phone: /(?:\+|\b)\d(?:[\s().-]?\d){7,14}\b/g,
  number: /\b\d(?:[ -]?\d){5,}\b/g,
};
function find(re, label) {
  if (!eng) { $('#found').textContent = 'This PDF’s text can’t be searched. Draw boxes by hand instead.'; return; }
  let n = 0, pagesHit = new Set();
  for (let i = 0; i < eng.pages; i++) {
    let m; try { m = eng.model(i); } catch (e) { continue; }
    if (m.error) continue;
    for (const line of m.lines) {
      const chars = line.chars, text = chars.map(c => c.ch).join('');
      re.lastIndex = 0;
      let hit;
      while ((hit = re.exec(text))) {
        if (!hit[0]) { re.lastIndex++; continue; }
        const polys = chars.slice(hit.index, hit.index + hit[0].length).filter(c => c.g).map(c => c.g.poly).flat();
        if (!polys.length) continue;
        const xs = polys.map(p => p[0]), ys = polys.map(p => p[1]), pad = 1;
        (boxes[i + 1] ||= []).push([Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) + pad, Math.max(...ys) + pad]);
        marked.add(hit[0].trim());
        n++; pagesHit.add(i + 1);
      }
    }
  }
  $('#found').textContent = n ? `Marked ${n} match${n === 1 ? '' : 'es'} of ${label} on ${pagesHit.size} page${pagesHit.size === 1 ? '' : 's'}.` : `No ${label} found.`;
  if (n && !(boxes[cur] || []).length) cur = Math.min(...pagesHit);
  show();
}
$('#find').addEventListener('click', () => {
  const q = $('#q').value.trim();
  if (!q) { $('#q').focus(); return; }
  find(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*'), 'gi'), `“${q}”`);
});
$('#q').addEventListener('keydown', e => { if (e.key === 'Enter') $('#find').click(); });
$$('.rd-quick button').forEach(b => b.addEventListener('click', () => find(QUICK[b.dataset.q], b.textContent.replace(/ \(.*/, '').toLowerCase())));
$('#clear').addEventListener('click', () => { boxes = {}; marked = new Set(); $('#found').textContent = ''; draw(); });

const inside = (pt, b) => pt[0] >= b[0] && pt[0] <= b[2] && pt[1] >= b[1] && pt[1] <= b[3];
const overlap = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
const area = b => Math.max(0, b[2] - b[0]) * Math.max(0, b[3] - b[1]);

$('#go').addEventListener('click', async () => {
  if (!count()) { toast('Draw a box or use Find & mark first.', 'err'); return; }
  const btn = $('#go'); btn.disabled = true;
  const back = out.innerHTML;
  out.innerHTML = '<p class="kicker">Redacting</p><p class="sub">Removing the marked content…</p>';
  try {
    const lib = await PDFDocument.load(srcBytes, { updateMetadata: false });
    let e2 = null; try { e2 = await PdfEngine.load(lib); } catch (err) { e2 = null; }
    const flatten = new Set(), pagesWith = Object.keys(boxes).map(Number).filter(p => boxes[p].length);
    // 1. Delete the letters (and whole pictures or shapes) under the boxes.
    for (const p of pagesWith) {
      const bs = boxes[p];
      let m = null; try { m = e2 && e2.model(p - 1); } catch (err) { m = null; }
      if (!m || m.error || m.deep) { flatten.add(p); continue; }
      const glyphs = m.glyphs.filter(g => { const c = [g.poly.reduce((s, q) => s + q[0], 0) / 4, g.poly.reduce((s, q) => s + q[1], 0) / 4]; return bs.some(b => inside(c, b)); });
      const objects = [];
      for (const o of m.objects) {
        const ov = Math.max(...bs.map(b => overlap(o.bbox, b)));
        if (!ov) continue;
        if (ov >= area(o.bbox) * 0.98) objects.push(o); // fully covered: delete it
        else if (o.type !== 'path') flatten.add(p); // a picture partly covered: burn the box into the page
      }
      if (glyphs.length || objects.length) e2.remove(glyphs, objects);
    }
    const put = e2 ? e2.cleanup() : () => {};
    let pdf = await PDFDocument.load(await (e2 ? e2.pdf : lib).save(), { updateMetadata: false });
    put();
    // 2. Black boxes on top, and no links or comments left under them.
    const pages = pdf.getPages();
    for (const p of pagesWith) {
      const page = pages[p - 1];
      boxes[p].forEach(b => page.drawRectangle({ x: b[0], y: b[1], width: b[2] - b[0], height: b[3] - b[1], color: rgb(0, 0, 0) }));
      const annots = page.node.Annots();
      if (annots) for (let k = annots.size() - 1; k >= 0; k--) {
        const a = annots.lookup(k), r = a && a.lookup(PDFLib.PDFName.of('Rect'));
        if (r && r.asArray) { const v = r.asArray().map(x => x.asNumber()); if (boxes[p].some(b => overlap([Math.min(v[0], v[2]), Math.min(v[1], v[3]), Math.max(v[0], v[2]), Math.max(v[1], v[3])], b) > 0)) annots.remove(k); }
      }
    }
    // 3. Pages where a box covers part of a picture become a picture themselves.
    if (flatten.size) {
      const view = await openPdf(await pdf.save());
      for (const p of [...flatten].sort((a, b) => a - b)) {
        const pg = await view.getPage(p), v1 = pg.getViewport({ scale: 1 }), c = await renderPdfPage(view, p, 200 / 72);
        const jpg = await pdf.embedJpg(new Uint8Array(await (await canvasBlob(c, 'image/jpeg', 0.9)).arrayBuffer()));
        const np = pdf.insertPage(p - 1, [v1.width, v1.height]);
        np.drawImage(jpg, { x: 0, y: 0, width: v1.width, height: v1.height });
        pdf.removePage(p);
      }
    }
    // 4. Hidden properties go too.
    ['Title', 'Author', 'Subject', 'Keywords', 'Creator', 'Producer'].forEach(k => pdf.getInfoDict().delete(PDFLib.PDFName.of(k)));
    pdf.catalog.delete(PDFLib.PDFName.of('Metadata'));
    const result = await pdf.save();
    // 5. Check: search the new file's text for everything that was marked by Find & mark.
    const chk = await openPdf(result);
    let text = '';
    for (let i = 1; i <= chk.numPages; i++) text += ' ' + (await (await chk.getPage(i)).getTextContent()).items.map(t => t.str).join(' ');
    const squash = s => s.replace(/\s+/g, '').toLowerCase(), all = squash(text);
    const left = [...marked].filter(w => all.includes(squash(w)));
    const head = marked.size ? (left.length ? `<span class="verdict no">Still found: ${left.map(esc).join(', ')}</span>` : `<span class="verdict ok">Checked: none of the ${marked.size} marked item${marked.size === 1 ? '' : 's'} can be found in the new file</span>`)
      : `<span class="verdict ok">${count()} area${count() === 1 ? '' : 's'} redacted</span>`;
    await showPdfResult(out, result, { title: 'Redacted PDF', name: `${name}-redacted.pdf`, label: 'Download redacted PDF', headline: head,
      note: `${flatten.size ? `${flatten.size} page${flatten.size === 1 ? ' was' : 's were'} turned into an image because a box covered part of a picture. ` : ''}<button type="button" class="linkbtn" id="again">Back to the boxes</button>` });
    $('#again').onclick = () => { out.innerHTML = back; show(); };
  } catch (e) {
    out.innerHTML = back; show();
    toast('Couldn’t redact this PDF: ' + e.message, 'err');
  }
  btn.disabled = false;
});
