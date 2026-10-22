const SL = [
  ['brightness', 'Brightness', 0, 200, 100, '%'], ['contrast', 'Contrast', 0, 200, 100, '%'], ['saturate', 'Saturation', 0, 200, 100, '%'],
  ['warmth', 'Warmth', -50, 50, 0, ''], ['hue', 'Hue', -180, 180, 0, '°'], ['sepia', 'Sepia', 0, 100, 0, '%'],
  ['grayscale', 'Black & white', 0, 100, 0, '%'], ['blur', 'Blur', 0, 10, 0, 'px'], ['vignette', 'Vignette', 0, 100, 0, '%'],
];
const PRESETS = {
  none: {}, vivid: { contrast: 115, saturate: 145, brightness: 104 }, bw: { grayscale: 100, contrast: 120 },
  vintage: { sepia: 45, contrast: 90, saturate: 80, vignette: 45, brightness: 105 }, warm: { warmth: 30, saturate: 110 },
  cool: { warmth: -30, saturate: 105 }, fade: { contrast: 80, brightness: 110, saturate: 75 }, drama: { contrast: 140, saturate: 85, vignette: 60, brightness: 95 },
};
let img = null, file = null, showOriginal = false;
$('#sliders').innerHTML = SL.map(([k, l, a, b, d, u]) => `<label class="f"><span>${l}: <b id="v-${k}">${d}${u}</b></span><input type="range" id="s-${k}" min="${a}" max="${b}" value="${d}"></label>`).join('');
const v = k => +$('#s-' + k).value;

function paint(c, scale) {
  const x = c.getContext('2d');
  x.filter = showOriginal ? 'none' : `brightness(${v('brightness')}%) contrast(${v('contrast')}%) saturate(${v('saturate')}%) hue-rotate(${v('hue')}deg) sepia(${v('sepia')}%) grayscale(${v('grayscale')}%) blur(${v('blur') * scale}px)`;
  x.drawImage(img, 0, 0, c.width, c.height);
  x.filter = 'none';
  if (showOriginal) return;
  const w = v('warmth');
  if (w) { x.globalCompositeOperation = 'soft-light'; x.fillStyle = w > 0 ? `rgba(255,140,0,${w / 100})` : `rgba(0,120,255,${-w / 100})`; x.fillRect(0, 0, c.width, c.height); x.globalCompositeOperation = 'source-over'; }
  const vg = v('vignette') / 100;
  if (vg) {
    const g = x.createRadialGradient(c.width / 2, c.height / 2, Math.min(c.width, c.height) * 0.3, c.width / 2, c.height / 2, Math.hypot(c.width, c.height) / 2);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${vg * 0.85})`);
    x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
  }
}
function preview() {
  if (!img) return;
  SL.forEach(([k, , , , , u]) => { $('#v-' + k).textContent = v(k) + u; });
  const s = Math.min(1, 900 / Math.max(img.naturalWidth, img.naturalHeight)), cv = $('#cv');
  cv.width = Math.round(img.naturalWidth * s); cv.height = Math.round(img.naturalHeight * s);
  paint(cv, s);
}
onAny('#sliders input', preview);
$('#presets').addEventListener('click', e => {
  const b = e.target.closest('.chip');
  if (!b) return;
  SL.forEach(([k, , , , d]) => { $('#s-' + k).value = PRESETS[b.dataset.p][k] ?? d; });
  $$('#presets .chip').forEach(c => c.classList.toggle('on', c === b));
  preview();
});
const cmp = on => { showOriginal = on; preview(); };
$('#compare').addEventListener('pointerdown', () => cmp(true));
['pointerup', 'pointerleave'].forEach(ev => $('#compare').addEventListener(ev, () => showOriginal && cmp(false)));
function use(i, f) { img = i; file = f; $('#save').disabled = false; $('#loaded').textContent = f.name; preview(); }
pickImage($('#drop'), $('#file'), use);
$('#sample').addEventListener('click', async () => { const f = await sampleImage('image/jpeg'); use(await loadImage(f), f); });
$('#save').addEventListener('click', async () => {
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  paint(c, 1);
  const t = outType(file);
  download(await canvasBlob(c, t, 0.92), `${baseName(file.name)}-edited.${extOf(t)}`);
});
