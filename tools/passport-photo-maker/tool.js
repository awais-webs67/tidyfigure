// w, h in mm; head = [min, max] head height (top of hair to chin) as a share of photo height; top = gap above head as a share of height.
const PRESETS = [
  ['us', 'United States passport / visa', 50.8, 50.8, [0.50, 0.69], 0.12, 'White or off-white background. 2×2 in, head 1–1⅜ in (25–35 mm) from chin to top of hair.'],
  ['uk', 'United Kingdom passport', 35, 45, [0.64, 0.76], 0.08, 'Plain cream or light grey background. 35×45 mm, head 29–34 mm.'],
  ['schengen', 'Schengen / EU visa', 35, 45, [0.71, 0.80], 0.07, 'Light, plain background. 35×45 mm, head 32–36 mm (70–80% of the photo).'],
  ['ca', 'Canada passport', 50, 70, [0.44, 0.51], 0.12, 'White or light background. 50×70 mm, head 31–36 mm.'],
  ['au', 'Australia passport', 35, 45, [0.71, 0.80], 0.07, 'Plain white or light grey background. 35×45 mm, head 32–36 mm.'],
  ['in', 'India visa / OCI', 50.8, 50.8, [0.50, 0.69], 0.12, 'White background. 2×2 in (51×51 mm), head 25–35 mm.'],
  ['pk', 'Pakistan passport / NADRA', 35, 45, [0.68, 0.78], 0.08, 'White background. 35×45 mm. Check NADRA’s current requirements.'],
  ['cn', 'China visa', 33, 48, [0.58, 0.69], 0.08, 'White background. 33×48 mm, head 28–33 mm.'],
  ['sa', 'Saudi Arabia visa', 40, 60, [0.55, 0.70], 0.12, 'White background. 4×6 cm.'],
  ['ae', 'UAE visa', 43, 55, [0.60, 0.70], 0.10, 'White background. 43×55 mm.'],
  ['id35', 'General ID 35×45 mm', 35, 45, [0.65, 0.78], 0.08, 'The most common photo size worldwide.'],
  ['id2', 'General 2×2 in', 50.8, 50.8, [0.50, 0.69], 0.12, 'Common in North America and for many visas.'],
];
$('#preset').innerHTML = PRESETS.map(p => `<option value="${p[0]}">${p[1]} (${p[2] === p[3] && p[2] === 50.8 ? '2×2 in' : `${p[2]}×${p[3]} mm`})</option>`).join('');
const DPI = 300, mmpx = mm => Math.round(mm / 25.4 * DPI);
const out = $('#out');
let src = null, cut = null, view = { zoom: 1, ox: 0, oy: 0, rot: 0 }, headBox = null, name = 'passport-photo';
const P = () => PRESETS.find(p => p[0] === $('#preset').value);

fileDrop($('#drop'), $('#file'), files => { const f = files.find(x => x.type.startsWith('image/')); if (f) start(f); });
$('#sample').addEventListener('click', async () => { out.innerHTML = '<p class="kicker">Passport photo</p><p class="sub">Downloading the sample photo…</p>'; start(await AI.sampleBlob('portrait-of-woman.jpg')); });
onAny('#preset', () => { spec(); if (cut) autoFit(); });
onAny('#bg, #sheet, #bright', () => cut && draw());
onAny('#zoom, #ox, #oy, #rot', () => { view = { zoom: +$('#zoom').value, ox: +$('#ox').value, oy: +$('#oy').value, rot: +$('#rot').value * Math.PI / 180 }; if (cut) draw(); });
$('#auto').onclick = () => autoFit();
function spec() { const p = P(); $('#spec').textContent = `${p[6]} Saved at 300 dpi: ${mmpx(p[2])}×${mmpx(p[3])} pixels.`; }
spec();

// Start loading the AI while the visitor is still choosing a photo (see AI.warmUp for when).
AI.warmUp('hq', [$('#drop'), $('#sample')], AI.faceModel);

let job = 0, sharp = '', faceNote = '';
async function start(f) {
  const id = ++job;
  name = 'passport-photo'; sharp = ''; faceNote = '';
  src = await AI.toCanvas(f);
  // First visit: the small Quick AI cuts the person out within seconds; Best quality then sharpens it (see sharpen).
  const q = await AI.quickOrBest('hq'), first = !(await AI.isReady(q));
  out.innerHTML = progressHtml(first ? 'Getting ready' : 'Finding you in the photo');
  try {
    if (first) await AI.preload(q, p => { if (id === job) setProgress(out, p * 0.5, `Getting ready… ${Math.round(p * 100)}%`); });
    if (id !== job) return;
    out.querySelector('.kicker').textContent = 'Finding you in the photo';
    setProgress(out, 0.55, 'Replacing the background…');
    const c = await AI.removeBackground(src, q);
    if (id !== job) return;
    cut = c;
    setProgress(out, 0.7, 'Finding your face…');
    const head = await findHead(src, cut);
    if (id !== job) return;
    headBox = head;
    if (!headBox) faceNote = 'No face found: position the photo by hand.';
    $('#adjust').hidden = false;
    autoFit();
    if (q !== 'hq') sharpen(id);
  } catch (e) {
    if (id === job) out.innerHTML = `<p class="kicker">Passport photo</p><span class="verdict no">Couldn’t process the photo</span><p class="sub">${esc(e.message || String(e))}</p>`;
  }
}
// After a Quick cut-out: load Best quality (by itself on an unmetered connection, otherwise when asked) and swap in its sharper edges.
function setSharp(html) { sharp = html; const el = $('#pp-sharp'); if (el) el.innerHTML = html; }
async function sharpen(id, asked = false) {
  if (!asked && !AI.unmetered() && !(await AI.isCached('hq'))) {
    if (id === job) setSharp(`<button type="button" class="linkbtn" id="sharpen">Sharpen the hair edges</button> (one-time ${await AI.modelSize('hq')} MB download).`);
    return;
  }
  try {
    setSharp('Sharpening the hair edges…');
    await AI.preload('hq', p => { if (id === job) setSharp(`Sharpening the hair edges… ${Math.round(p * 100)}%`); });
    if (id !== job) return;
    const c = await AI.removeBackground(src, 'hq');
    if (id !== job) return;
    cut = c;
    setSharp('Hair edges sharpened.');
    toast('Hair edges sharpened');
    draw();
  } catch (e) { if (id === job) setSharp(''); }
}
out.addEventListener('click', e => { if (e.target.id === 'sharpen') sharpen(job, true); });

// Head position from face landmarks: chin from the face mesh, top of the head from the AI mask (hair included),
// capped so big hairstyles or a cropped head don't throw the size off. Also the head's tilt, to straighten it.
async function findHead(c, mask) {
  const f = await AI.face(c);
  if (!f) return null;
  const eyeY = (f.eyeL.y + f.eyeR.y) / 2, chin = f.chin.y, half = chin - eyeY;
  const w = mask.width, d = mask.getContext('2d').getImageData(0, 0, w, mask.height).data;
  let hairTop = null;
  for (let y = 0; y < eyeY && hairTop === null; y++) for (let x = Math.round(f.left); x < f.right; x += 3) if (d[(y * w + x) * 4 + 3] > 128) { hairTop = y; break; }
  const lo = eyeY - half * 1.45, est = eyeY - half * 1.12; // typical crown sits about 1.1× the eye–chin distance above the eyes
  const top = hairTop === null || hairTop <= 2 ? est : Math.max(hairTop, lo);
  return { top, chin, cx: (f.eyeL.x + f.eyeR.x) / 2, angle: Math.atan2(f.eyeR.y - f.eyeL.y, f.eyeR.x - f.eyeL.x) };
}
function autoFit() {
  const p = P(), W = mmpx(p[2]), H = mmpx(p[3]);
  if (headBox) {
    const target = (p[4][0] + p[4][1]) / 2 * H, k = target / (headBox.chin - headBox.top);
    const base = Math.max(W / src.width, H / src.height);
    view.zoom = k / base;
    view.ox = (W / 2 - headBox.cx * k) / W - (W - src.width * k) / 2 / W;
    view.oy = (p[5] * H - headBox.top * k) / H - (H - src.height * k) / 2 / H;
    view.rot = -headBox.angle;
  } else view = { zoom: 1, ox: 0, oy: 0, rot: 0 };
  $('#zoom').value = view.zoom; $('#ox').value = view.ox; $('#oy').value = view.oy; $('#rot').value = (view.rot * 180 / Math.PI).toFixed(1);
  draw();
}
// The finished photo at 300 dpi.
function photo() {
  const p = P(), W = mmpx(p[2]), H = mmpx(p[3]), c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d'), bg = $('#bg').value;
  const k = Math.max(W / src.width, H / src.height) * view.zoom;
  const dx = (W - src.width * k) / 2 + view.ox * W, dy = (H - src.height * k) / 2 + view.oy * H;
  x.fillStyle = bg === 'keep' ? '#ffffff' : bg; x.fillRect(0, 0, W, H);
  x.filter = `brightness(${$('#bright').value})`;
  // Straighten: rotate around the head centre (or the middle of the photo).
  const rx = headBox ? dx + headBox.cx * k : W / 2, ry = headBox ? dy + (headBox.top + headBox.chin) / 2 * k : H / 2;
  x.translate(rx, ry); x.rotate(view.rot || 0); x.translate(-rx, -ry);
  x.drawImage(bg === 'keep' ? src : cut, dx, dy, src.width * k, src.height * k);
  x.setTransform(1, 0, 0, 1, 0, 0);
  x.filter = 'none';
  return c;
}
function sheet(ph) {
  const s = { '4x6': [6, 4], '5x7': [7, 5], a4: [11.69, 8.27], letter: [11, 8.5] }[$('#sheet').value];
  const SW = Math.round(s[0] * DPI), SH = Math.round(s[1] * DPI), gap = mmpx(3), m = mmpx(4);
  const cols = Math.max(1, Math.floor((SW - 2 * m + gap) / (ph.width + gap))), rws = Math.max(1, Math.floor((SH - 2 * m + gap) / (ph.height + gap)));
  const c = document.createElement('canvas'); c.width = SW; c.height = SH;
  const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, SW, SH);
  const ox = (SW - cols * ph.width - (cols - 1) * gap) / 2, oy = (SH - rws * ph.height - (rws - 1) * gap) / 2;
  x.strokeStyle = '#bbb'; x.lineWidth = 1; x.setLineDash([12, 10]);
  for (let r = 0; r < rws; r++) for (let k = 0; k < cols; k++) { const px = ox + k * (ph.width + gap), py = oy + r * (ph.height + gap); x.drawImage(ph, px, py); x.strokeRect(px - 0.5, py - 0.5, ph.width + 1, ph.height + 1); }
  return { c, n: cols * rws };
}
let drag = null;
async function draw() {
  const p = P(), ph = photo(), { c: sh, n } = sheet(ph);
  if (!$('#pp-stage')) {
    out.innerHTML = `<p class="kicker">Passport photo · drag to position</p>
      <div class="pp-wrap"><div class="pp-stage" id="pp-stage"><canvas id="pp-c"></canvas><div class="pp-guide" id="pp-guide"><i class="g-top"></i><i class="g-chin"></i><i class="g-oval"></i></div></div></div>
      <p class="sub" id="pp-info"></p>
      <div class="btns"><button type="button" class="btn big-btn" id="dl1">Download photo</button><button type="button" class="btn ghost" id="dl2">Download print sheet</button></div>
      <p class="note" id="pp-face">${faceNote}</p><p class="note" id="pp-sharp">${sharp}</p>
      <details><summary>Print sheet preview</summary><img id="pp-sheet" alt="Print sheet" style="width:100%;border:1px solid var(--line);border-radius:6px;margin-top:8px"></details>
      <p class="note">Keep the top of the head inside the upper band and the chin inside the lower band. Rules change and offices can be strict: check your government’s current photo requirements before printing.</p>`;
    const st = $('#pp-stage');
    st.addEventListener('pointerdown', e => { st.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY, ox: view.ox, oy: view.oy }; });
    st.addEventListener('pointermove', e => { if (!drag) return; const r = st.getBoundingClientRect(); view.ox = drag.ox + (e.clientX - drag.x) / r.width; view.oy = drag.oy + (e.clientY - drag.y) / r.height; $('#ox').value = view.ox; $('#oy').value = view.oy; draw(); });
    ['pointerup', 'pointercancel'].forEach(ev => st.addEventListener(ev, () => { drag = null; }));
    st.addEventListener('wheel', e => { e.preventDefault(); view.zoom = Math.min(3, Math.max(0.3, view.zoom * (e.deltaY < 0 ? 1.03 : 0.97))); $('#zoom').value = view.zoom; draw(); }, { passive: false });
  }
  const c = $('#pp-c'); c.width = ph.width; c.height = ph.height; c.getContext('2d').drawImage(ph, 0, 0);
  $('#pp-stage').style.aspectRatio = `${p[2]} / ${p[3]}`;
  const g = $('#pp-guide');
  g.style.setProperty('--top', `${p[5] * 100}%`);
  g.style.setProperty('--chin-a', `${(p[5] + p[4][0]) * 100}%`);
  g.style.setProperty('--chin-b', `${(p[5] + p[4][1]) * 100}%`);
  $('#pp-info').textContent = `${p[1]}: ${p[2]}×${p[3]} mm · ${ph.width}×${ph.height} px at 300 dpi · ${n} copies on the print sheet`;
  $('#dl1').onclick = async () => download(await canvasBlob(ph, 'image/jpeg', 0.95), `${name}-${p[0]}-${p[2]}x${p[3]}mm.jpg`);
  $('#dl2').onclick = async () => download(await canvasBlob(sh, 'image/jpeg', 0.95), `${name}-${p[0]}-sheet-${$('#sheet').value}.jpg`);
  $('#pp-sheet').src = sh.toDataURL('image/jpeg', 0.7);
}
