// Scan to PDF. For each photo: find the paper (Otsu threshold, largest bright area, its four extreme corners),
// flatten it with a perspective transform (homography, solved by Gaussian elimination), clean it up with the
// chosen look, then put the pages into a PDF with pdf-lib.
const out = $('#out');
let pages = [], sel = -1;
const LOOKS = [['enhanced', 'Enhanced'], ['original', 'Original'], ['grey', 'Grey'], ['bw', 'Black & white']];

$('#cam').addEventListener('change', e => { add([...e.target.files]); e.target.value = ''; });
$('#pics').addEventListener('change', e => { add([...e.target.files]); e.target.value = ''; });
// Photos can also be dropped on the result panel (no click: the panel is used to drag corners).
out.addEventListener('dragover', e => { e.preventDefault(); });
out.addEventListener('drop', e => { e.preventDefault(); add([...e.dataTransfer.files].filter(f => f.type.startsWith('image/'))); });
$('#sample').addEventListener('click', async () => add([await samplePhoto()]));

async function add(files) {
  for (const f of files) {
    let img;
    try { img = await loadImage(f); } catch (e) { toast(e.message, 'err'); continue; }
    const photo = document.createElement('canvas'), k = Math.min(1, 3000 / Math.max(img.naturalWidth, img.naturalHeight));
    photo.width = Math.round(img.naturalWidth * k); photo.height = Math.round(img.naturalHeight * k);
    photo.getContext('2d').drawImage(img, 0, 0, photo.width, photo.height);
    const p = { photo, corners: findPaper(photo), look: 'enhanced', rot: 0 };
    render(p);
    pages.push(p);
  }
  sel = pages.length - 1;
  list(); edit();
}

// ---------- Finding the paper ----------
function findPaper(c) {
  const S = 360, k = S / Math.max(c.width, c.height), w = Math.max(8, Math.round(c.width * k)), h = Math.max(8, Math.round(c.height * k));
  const t = document.createElement('canvas'); t.width = w; t.height = h;
  const x = t.getContext('2d'); x.filter = 'blur(2px)'; x.drawImage(c, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h).data, g = new Uint8Array(w * h), hist = new Array(256).fill(0);
  for (let i = 0; i < w * h; i++) { g[i] = (d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114) | 0; hist[g[i]]++; }
  // Otsu: the threshold that best separates bright paper from the background.
  let sum = 0; for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sB = 0, wB = 0, best = 0, th = 128;
  for (let i = 0; i < 256; i++) { wB += hist[i]; if (!wB) continue; const wF = w * h - wB; if (!wF) break; sB += i * hist[i]; const mB = sB / wB, mF = (sum - sB) / wF, v = wB * wF * (mB - mF) ** 2; if (v > best) { best = v; th = i; } }
  // The largest bright area.
  const seen = new Uint8Array(w * h), stack = [];
  let bestArea = 0, bestPix = null;
  for (let s = 0; s < w * h; s++) {
    if (seen[s] || g[s] <= th) continue;
    const pix = []; stack.push(s); seen[s] = 1;
    while (stack.length) { const p = stack.pop(); pix.push(p); const px = p % w, py = (p / w) | 0; for (const q of [px > 0 ? p - 1 : -1, px < w - 1 ? p + 1 : -1, py > 0 ? p - w : -1, py < h - 1 ? p + w : -1]) if (q >= 0 && !seen[q] && g[q] > th) { seen[q] = 1; stack.push(q); } }
    if (pix.length > bestArea) { bestArea = pix.length; bestPix = pix; }
  }
  const inset = [[0.04, 0.04], [0.96, 0.04], [0.96, 0.96], [0.04, 0.96]].map(([u, v]) => [u * c.width, v * c.height]);
  if (!bestPix || bestArea < w * h * 0.12 || bestArea > w * h * 0.97) return inset;
  // Its four corners: the points furthest towards each corner of the photo.
  let tl, tr, br, bl, a = Infinity, b = -Infinity, cc = -Infinity, dd = Infinity;
  for (const p of bestPix) { const px = p % w, py = (p / w) | 0; if (px + py < a) { a = px + py; tl = [px, py]; } if (px + py > b) { b = px + py; br = [px, py]; } if (px - py > cc) { cc = px - py; tr = [px, py]; } if (px - py < dd) { dd = px - py; bl = [px, py]; } }
  return [tl, tr, br, bl].map(([px, py]) => [(px + 0.5) / k, (py + 0.5) / k]);
}

// ---------- Flattening ----------
// Homography that maps the output rectangle onto the four corners in the photo.
function homography(src, W, H) {
  const dst = [[0, 0], [W, 0], [W, H], [0, H]], A = [], B = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = dst[i], [u, v] = src[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); B.push(v);
  }
  for (let c = 0; c < 8; c++) {
    let p = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [B[c], B[p]] = [B[p], B[c]];
    for (let r = 0; r < 8; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k]; B[r] -= f * B[c]; }
  }
  return B.map((b, i) => b / A[i][i]);
}
function flatten(p) {
  const [tl, tr, br, bl] = p.corners, d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  let W = Math.max(d(tl, tr), d(bl, br)), H = Math.max(d(tl, bl), d(tr, br));
  const k = Math.min(1, 2480 / Math.max(W, H)); W = Math.max(10, Math.round(W * k)); H = Math.max(10, Math.round(H * k));
  const m = homography(p.corners, W, H), sw = p.photo.width, sh = p.photo.height;
  const s = p.photo.getContext('2d').getImageData(0, 0, sw, sh).data, c = document.createElement('canvas');
  c.width = W; c.height = H;
  const o = c.getContext('2d').createImageData(W, H), od = o.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const z = m[6] * x + m[7] * y + 1, u = (m[0] * x + m[1] * y + m[2]) / z, v = (m[3] * x + m[4] * y + m[5]) / z;
    const x0 = Math.max(0, Math.min(sw - 2, Math.floor(u))), y0 = Math.max(0, Math.min(sh - 2, Math.floor(v))), fx = Math.min(1, Math.max(0, u - x0)), fy = Math.min(1, Math.max(0, v - y0));
    const i00 = (y0 * sw + x0) * 4, i10 = i00 + 4, i01 = i00 + sw * 4, i11 = i01 + 4, j = (y * W + x) * 4;
    for (let ch = 0; ch < 3; ch++) od[j + ch] = (s[i00 + ch] * (1 - fx) + s[i10 + ch] * fx) * (1 - fy) + (s[i01 + ch] * (1 - fx) + s[i11 + ch] * fx) * fy;
    od[j + 3] = 255;
  }
  c.getContext('2d').putImageData(o, 0, 0);
  return c;
}
// ---------- Looks ----------
function look(c, kind) {
  if (kind === 'original') return c;
  const x = c.getContext('2d'), im = x.getImageData(0, 0, c.width, c.height), d = im.data, n = c.width * c.height;
  if (kind === 'bw') {
    // Black and white: each pixel against the brightness around it (adaptive threshold with an integral image).
    const W = c.width, H = c.height, g = new Float64Array(n), I = new Float64Array((W + 1) * (H + 1)), r = Math.max(8, Math.round(Math.max(W, H) / 40));
    for (let i = 0; i < n; i++) g[i] = d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114;
    for (let y = 0; y < H; y++) { let row = 0; for (let xx = 0; xx < W; xx++) { row += g[y * W + xx]; I[(y + 1) * (W + 1) + xx + 1] = I[y * (W + 1) + xx + 1] + row; } }
    for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) {
      const x0 = Math.max(0, xx - r), x1 = Math.min(W, xx + r + 1), y0 = Math.max(0, y - r), y1 = Math.min(H, y + r + 1);
      const mean = (I[y1 * (W + 1) + x1] - I[y0 * (W + 1) + x1] - I[y1 * (W + 1) + x0] + I[y0 * (W + 1) + x0]) / ((x1 - x0) * (y1 - y0));
      const v = g[y * W + xx] < mean * 0.86 ? 0 : 255, j = (y * W + xx) * 4;
      d[j] = d[j + 1] = d[j + 2] = v;
    }
  } else {
    // Enhanced and grey: the paper colour (bright end of each channel) becomes white, the ink end dark.
    const pct = (ch, q) => { const h = new Uint32Array(256); for (let i = 0; i < n; i += 3) h[d[i * 4 + ch]]++; let acc = 0, lim = n / 3 * q; for (let v = 0; v < 256; v++) { acc += h[v]; if (acc >= lim) return v; } return 255; };
    const hi = [0, 1, 2].map(ch => Math.max(60, pct(ch, 0.9))), lo = [0, 1, 2].map(ch => Math.min(hi[ch] - 40, pct(ch, 0.02)));
    for (let i = 0; i < n; i++) {
      const j = i * 4;
      for (let ch = 0; ch < 3; ch++) d[j + ch] = Math.max(0, Math.min(255, (d[j + ch] - lo[ch]) / (hi[ch] - lo[ch]) * 255));
      if (kind === 'grey') { const v = d[j] * 0.299 + d[j + 1] * 0.587 + d[j + 2] * 0.114; d[j] = d[j + 1] = d[j + 2] = v; }
    }
  }
  const o = document.createElement('canvas'); o.width = c.width; o.height = c.height; o.getContext('2d').putImageData(im, 0, 0);
  return o;
}
function render(p) {
  let c = look(flatten(p), p.look);
  if (p.rot) { const r = document.createElement('canvas'), side = p.rot % 180 !== 0; r.width = side ? c.height : c.width; r.height = side ? c.width : c.height; const x = r.getContext('2d'); x.translate(r.width / 2, r.height / 2); x.rotate(p.rot * Math.PI / 180); x.drawImage(c, -c.width / 2, -c.height / 2); c = r; }
  p.result = c;
}

// ---------- Screens ----------
function list() {
  $('#pages').innerHTML = '';
  pages.forEach((p, i) => {
    const f = document.createElement('figure'), t = document.createElement('canvas'), k = 140 / p.result.width;
    t.width = 140; t.height = Math.round(p.result.height * k); t.getContext('2d').drawImage(p.result, 0, 0, t.width, t.height);
    f.className = i === sel ? 'on' : ''; f.appendChild(t); f.insertAdjacentHTML('beforeend', `<figcaption>Page ${i + 1}</figcaption>`);
    f.onclick = () => { sel = i; list(); edit(); };
    $('#pages').appendChild(f);
  });
  $('#go').disabled = !pages.length;
}
function edit() {
  const p = pages[sel];
  if (!p) { out.innerHTML = '<p class="kicker">Scanner</p><p class="empty">Take a photo of a document, or choose photos, to start.</p>'; return; }
  const disp = document.createElement('canvas'), k = Math.min(1, 900 / Math.max(p.photo.width, p.photo.height));
  disp.width = Math.round(p.photo.width * k); disp.height = Math.round(p.photo.height * k);
  disp.getContext('2d').drawImage(p.photo, 0, 0, disp.width, disp.height);
  out.innerHTML = `<p class="kicker">Page ${sel + 1} of ${pages.length} · drag the corners to the edges of the paper</p>
    <div class="sc-edit" id="ed"><svg viewBox="0 0 ${disp.width} ${disp.height}" preserveAspectRatio="none"><polygon id="poly" fill="rgba(255,91,53,.12)" stroke="#FF5B35" stroke-width="3"/></svg></div>
    <div class="seg" role="radiogroup" aria-label="Look" style="margin-top:10px">${LOOKS.map(([v, l]) => `<label><input type="radio" name="look" value="${v}"${p.look === v ? ' checked' : ''}><span>${l}</span></label>`).join('')}</div>
    <div class="sc-row"><button type="button" class="btn ghost" id="rot">↻ Turn</button><button type="button" class="btn ghost" id="left">← Earlier</button><button type="button" class="btn ghost" id="right">Later →</button><button type="button" class="btn ghost" id="del">Remove</button><button type="button" class="btn ghost" id="whole">Whole photo</button></div>
    <p class="kicker" style="margin-top:14px">Result</p><div id="res"></div>`;
  const ed = $('#ed');
  ed.prepend(disp);
  const handles = p.corners.map((pt, i) => { const h = document.createElement('i'); h.dataset.i = i; ed.appendChild(h); return h; });
  const place = () => {
    handles.forEach((h, i) => { h.style.left = `${p.corners[i][0] / p.photo.width * 100}%`; h.style.top = `${p.corners[i][1] / p.photo.height * 100}%`; });
    $('#poly').setAttribute('points', p.corners.map(([x, y]) => `${x * k},${y * k}`).join(' '));
  };
  const showRes = () => { const r = $('#res'); r.innerHTML = ''; const c = document.createElement('canvas'), s = Math.min(1, 700 / p.result.width); c.width = Math.round(p.result.width * s); c.height = Math.round(p.result.height * s); c.getContext('2d').drawImage(p.result, 0, 0, c.width, c.height); c.style.cssText = 'width:100%;height:auto;display:block;box-shadow:0 2px 10px rgba(0,0,0,.18)'; r.appendChild(c); };
  place(); showRes();
  let drag = null;
  ed.addEventListener('pointerdown', e => { const h = e.target.closest('i'); if (!h) return; e.preventDefault(); ed.setPointerCapture(e.pointerId); drag = +h.dataset.i; });
  ed.addEventListener('pointermove', e => { if (drag === null) return; const r = disp.getBoundingClientRect(); p.corners[drag] = [Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * p.photo.width, Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) * p.photo.height]; place(); });
  const end = () => { if (drag === null) return; drag = null; render(p); showRes(); list(); };
  ed.addEventListener('pointerup', end); ed.addEventListener('pointercancel', end);
  onAny('input[name="look"]', () => { p.look = $('input[name="look"]:checked').value; render(p); showRes(); list(); });
  $('#rot').onclick = () => { p.rot = (p.rot + 90) % 360; render(p); showRes(); list(); };
  $('#whole').onclick = () => { p.corners = [[0, 0], [p.photo.width, 0], [p.photo.width, p.photo.height], [0, p.photo.height]]; place(); render(p); showRes(); list(); };
  $('#del').onclick = () => { pages.splice(sel, 1); sel = Math.min(sel, pages.length - 1); list(); edit(); };
  $('#left').onclick = () => { if (sel > 0) { [pages[sel - 1], pages[sel]] = [pages[sel], pages[sel - 1]]; sel--; list(); edit(); } };
  $('#right').onclick = () => { if (sel < pages.length - 1) { [pages[sel + 1], pages[sel]] = [pages[sel], pages[sel + 1]]; sel++; list(); edit(); } };
}

$('#go').addEventListener('click', async () => {
  const { PDFDocument } = PDFLib, pdf = await PDFDocument.create(), q = +$('#q').value, paper = $('#paper').value;
  for (const p of pages) {
    const c = p.result, bw = p.look === 'bw' || p.look === 'grey';
    const bytes = new Uint8Array(await (await canvasBlob(c, 'image/jpeg', bw ? Math.min(0.9, q + 0.05) : q)).arrayBuffer()), img = await pdf.embedJpg(bytes);
    let [W, H] = paper === 'a4' ? [595.28, 841.89] : paper === 'letter' ? [612, 792] : [c.width, c.height].map(v => v * 841.89 / Math.max(c.width, c.height)); // the paper's own shape, A4-sized
    if (paper !== 'fit' && c.width > c.height) [W, H] = [H, W];
    const page = pdf.addPage([W, H]), k = Math.min(W / c.width, H / c.height);
    page.drawImage(img, { x: (W - c.width * k) / 2, y: (H - c.height * k) / 2, width: c.width * k, height: c.height * k });
  }
  pdf.setTitle('Scanned document'); pdf.setCreator('TidyFigure');
  const bytesOut = await pdf.save(), d = new Date();
  await showPdfResult(out, bytesOut, { title: 'Scanned PDF', name: `scan-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.pdf`, label: 'Download PDF', headline: `<span class="verdict ok">${pages.length} page${pages.length > 1 ? 's' : ''}</span>`, note: '<button type="button" class="linkbtn" id="back">Back to the pages</button> · To make the text searchable, use <a href="' + (window.TF_BASE || '') + '/ocr-pdf">OCR PDF</a>.' });
  $('#back').onclick = () => edit();
});

// ---------- Webcam ----------
let stream = null;
$('#webcam').addEventListener('click', async () => {
  try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } }); }
  catch (e) { out.innerHTML = '<p class="kicker">Scanner</p>' + mediaError(e, 'camera'); return; }
  $('#video').srcObject = stream; await $('#video').play(); $('#camwrap').hidden = false;
});
$('#snap').addEventListener('click', () => {
  const v = $('#video'), c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0);
  c.toBlob(b => add([new File([b], 'camera.jpg', { type: 'image/jpeg' })]), 'image/jpeg', 0.92);
});
$('#camclose').addEventListener('click', () => { stopStream(stream); stream = null; $('#camwrap').hidden = true; });

// A sample photo: a page of text lying at an angle on a wooden desk.
async function samplePhoto() {
  const page = document.createElement('canvas'); page.width = 850; page.height = 1100;
  const x = page.getContext('2d'); x.fillStyle = '#f7f4ec'; x.fillRect(0, 0, 850, 1100); x.fillStyle = '#222';
  x.font = 'bold 44px Georgia, serif'; x.fillText('Receipt', 70, 120); x.font = '26px Georgia, serif';
  ['Coffee beans 1 kg ........ 18.50', 'Milk 2 l ........................ 1.90', 'Oat biscuits ................ 3.25', 'Bread ......................... 2.80', '', 'Total ........................ 26.45', '', 'Thank you for shopping with us!'].forEach((l, i) => x.fillText(l, 70, 220 + i * 50));
  const c = document.createElement('canvas'); c.width = 1600; c.height = 1200;
  const y = c.getContext('2d'), gr = y.createLinearGradient(0, 0, 1600, 1200); gr.addColorStop(0, '#6b4a2f'); gr.addColorStop(1, '#3e2a1a'); y.fillStyle = gr; y.fillRect(0, 0, 1600, 1200);
  y.save(); y.translate(800, 610); y.rotate(-0.14); y.transform(1, 0.03, -0.05, 0.92, 0, 0); y.shadowColor = 'rgba(0,0,0,.45)'; y.shadowBlur = 30; y.drawImage(page, -425 * 0.95, -550 * 0.95, 850 * 0.95, 1100 * 0.95); y.restore();
  const blob = await canvasBlob(c, 'image/jpeg', 0.9);
  return new File([blob], 'desk-photo.jpg', { type: 'image/jpeg' });
}
