const { PDFDocument, degrees } = PDFLib;
const pad = $('#pad'), px = pad.getContext('2d'), view = $('#view');
let drawing = false, drawn = false, last = null;
let file = null, srcBytes = null, doc = null, pageNo = 1, scale = 1, placed = [];

// ---- signature pad ----
const pos = e => { const r = pad.getBoundingClientRect(); return [(e.clientX - r.left) * pad.width / r.width, (e.clientY - r.top) * pad.height / r.height]; };
pad.addEventListener('pointerdown', e => { drawing = true; last = pos(e); pad.setPointerCapture(e.pointerId); });
pad.addEventListener('pointermove', e => {
  if (!drawing) return;
  const p = pos(e);
  px.strokeStyle = $('#ink').value; px.lineWidth = 5; px.lineCap = 'round'; px.lineJoin = 'round';
  px.beginPath(); px.moveTo(...last); px.lineTo(...p); px.stroke();
  last = p; drawn = true;
});
pad.addEventListener('pointerup', () => { drawing = false; redraw(); });
$('#clear').addEventListener('click', () => { px.clearRect(0, 0, pad.width, pad.height); drawn = false; redraw(); });

// The signature as a tightly cropped transparent PNG canvas.
function signature() {
  const typed = $('input[name="mode"]:checked').value === 'type';
  const c = document.createElement('canvas');
  c.width = 900; c.height = 300;
  const x = c.getContext('2d');
  if (typed) {
    const name = $('#name').value.trim();
    if (!name) return null;
    x.fillStyle = $('#ink').value; x.font = `600 140px "${$('#font').value}", cursive`; x.textBaseline = 'middle';
    x.fillText(name, 20, 150, 860);
  } else {
    if (!drawn) return null;
    x.drawImage(pad, 0, 0);
  }
  const d = x.getImageData(0, 0, c.width, c.height).data;
  let minX = c.width, minY = c.height, maxX = 0, maxY = 0;
  for (let y = 0; y < c.height; y++) for (let k = 0; k < c.width; k++) if (d[(y * c.width + k) * 4 + 3] > 10) { minX = Math.min(minX, k); maxX = Math.max(maxX, k); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  if (maxX <= minX) return null;
  const withDate = $('#date').checked, dh = withDate ? 54 : 0;
  const out = document.createElement('canvas');
  out.width = maxX - minX + 20; out.height = maxY - minY + 20 + dh;
  const o = out.getContext('2d');
  o.drawImage(c, minX - 10, minY - 10, out.width, out.height - dh, 0, 0, out.width, out.height - dh);
  if (withDate) { o.fillStyle = $('#ink').value; o.font = '600 40px Inter, Arial, sans-serif'; o.fillText(new Date().toLocaleDateString(), 10, out.height - 12); }
  return out;
}

// ---- page view ----
async function showPage() {
  if (!doc) return;
  const page = await doc.getPage(pageNo);
  const vp1 = page.getViewport({ scale: 1 });
  scale = Math.min(2, 900 / vp1.width);
  const c = await renderPdfPage(doc, pageNo, scale);
  view.width = c.width; view.height = c.height;
  const x = view.getContext('2d');
  x.drawImage(c, 0, 0);
  placed.filter(p => p.page === pageNo).forEach(p => x.drawImage(p.img, p.x * scale, p.y * scale, p.w * scale, p.w * scale * p.img.height / p.img.width));
  $('#pg').textContent = `Page ${pageNo} of ${doc.numPages}`;
}
const redraw = () => { if (doc) showPage(); };

view.addEventListener('click', async e => {
  if (!doc) return;
  if (document.fonts) await document.fonts.load(`600 140px "${$('#font').value}"`).catch(() => {});
  const sig = signature();
  if (!sig) { $('#hint').textContent = 'Draw or type your signature first.'; return; }
  const r = view.getBoundingClientRect();
  const cx = (e.clientX - r.left) * view.width / r.width, cy = (e.clientY - r.top) * view.height / r.height;
  const pageW = view.width / scale;
  const w = pageW * +$('#sz').value / 100;
  const h = w * sig.height / sig.width;
  placed.push({ page: pageNo, x: cx / scale - w / 2, y: cy / scale - h / 2, w, img: sig });
  $('#undo').disabled = false; $('#save').disabled = false;
  $('#hint').textContent = `${placed.length} signature${placed.length > 1 ? 's' : ''} placed. Tap again to add more.`;
  showPage();
});
$('#undo').addEventListener('click', () => { placed.pop(); $('#undo').disabled = $('#save').disabled = !placed.length; showPage(); });
$('#prev').addEventListener('click', () => { if (pageNo > 1) { pageNo--; showPage(); } });
$('#next').addEventListener('click', () => { if (doc && pageNo < doc.numPages) { pageNo++; showPage(); } });
$('#sz').addEventListener('input', () => { $('#szv').textContent = $('#sz').value; });
onAny('input[name="mode"]', () => { const t = $('input[name="mode"]:checked').value === 'type'; $('#type-box').hidden = !t; $('#draw-box').hidden = t; });

async function open(f) {
  if (!isPdf(f)) return;
  try {
    srcBytes = new Uint8Array(await f.arrayBuffer());
    doc = await openPdf(srcBytes);
    file = f; pageNo = 1; placed = [];
    $('#loaded').textContent = `${f.name} · ${doc.numPages} pages`;
    $('#pager').hidden = false;
    showPage();
  } catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged or password-protected.'; }
}
fileDrop($('#drop'), $('#file'), fs => open(fs[0]));
$('#sample').addEventListener('click', async () => { $('#mode-type').checked = true; $('#type-box').hidden = false; $('#draw-box').hidden = true; open(await samplePdf(2, 'Service agreement')); });

$('#save').addEventListener('click', async () => {
  const pdf = await PDFDocument.load(srcBytes, { ignoreEncryption: true });
  const pages = pdf.getPages();
  for (const p of placed) {
    const png = await pdf.embedPng(p.img.toDataURL('image/png'));
    const page = pages[p.page - 1], v = pageView(page); // the page as shown, even if it's stored rotated
    const h = p.w * p.img.height / p.img.width, [x, y] = v.at(p.x, v.h - p.y - h);
    page.drawImage(png, { x, y, width: p.w, height: h, rotate: degrees(v.angle) });
  }
  download(new Blob([await pdf.save()], { type: 'application/pdf' }), `${baseName(file.name)}-signed.pdf`);
});
if (document.fonts) document.fonts.ready.then(redraw);
