const FONTS = ['Dancing Script', 'Great Vibes', 'Sacramento', 'Allura', 'Alex Brush', 'Mr Dafoe', 'Homemade Apple', 'Caveat'];
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?' + FONTS.map(f => 'family=' + f.replace(/ /g, '+')).join('&') + '&display=swap';
document.head.appendChild(link);
let mode = 'draw', color = '#111111', font = FONTS[0], strokes = [], photo = null;
const pad = $('#pad'), px = pad.getContext('2d');

// ----- drawing pad: smooth strokes whose width follows the pen speed -----
function sizePad() {
  const r = pad.getBoundingClientRect(), dpr = devicePixelRatio || 1;
  pad.width = r.width * dpr; pad.height = r.height * dpr;
  redrawPad();
}
function drawStroke(x, s, scale = 1, dx = 0, dy = 0) {
  x.strokeStyle = color; x.fillStyle = color; x.lineCap = 'round'; x.lineJoin = 'round';
  const w = +$('#width').value * scale;
  if (s.length === 1) { x.beginPath(); x.arc(s[0].x * scale + dx, s[0].y * scale + dy, w / 2, 0, 7); x.fill(); return; }
  for (let i = 1; i < s.length; i++) {
    const a = s[i - 1], b = s[i], mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    x.lineWidth = w * Math.max(0.45, Math.min(1.25, 1.3 - b.v * 0.35));
    x.beginPath();
    x.moveTo((i === 1 ? a.x : (s[i - 2].x + a.x) / 2) * scale + dx, (i === 1 ? a.y : (s[i - 2].y + a.y) / 2) * scale + dy);
    x.quadraticCurveTo(a.x * scale + dx, a.y * scale + dy, mid.x * scale + dx, mid.y * scale + dy);
    x.stroke();
  }
}
function redrawPad() {
  const dpr = devicePixelRatio || 1;
  px.setTransform(dpr, 0, 0, dpr, 0, 0);
  px.clearRect(0, 0, pad.width, pad.height);
  strokes.forEach(s => drawStroke(px, s));
}
let cur = null, last = 0;
pad.addEventListener('pointerdown', e => { pad.setPointerCapture(e.pointerId); const r = pad.getBoundingClientRect(); cur = [{ x: e.clientX - r.left, y: e.clientY - r.top, v: 0 }]; strokes.push(cur); last = performance.now(); redrawPad(); });
pad.addEventListener('pointermove', e => {
  if (!cur) return;
  const r = pad.getBoundingClientRect(), p = { x: e.clientX - r.left, y: e.clientY - r.top }, prev = cur[cur.length - 1], now = performance.now();
  p.v = Math.hypot(p.x - prev.x, p.y - prev.y) / Math.max(1, now - last); last = now;
  if (Math.hypot(p.x - prev.x, p.y - prev.y) > 1.2) { cur.push(p); redrawPad(); }
});
['pointerup', 'pointercancel'].forEach(ev => pad.addEventListener(ev, () => { if (cur) { cur = null; update(); } }));
$('#undo').onclick = () => { strokes.pop(); redrawPad(); update(); };
$('#clear').onclick = () => { strokes = []; redrawPad(); update(); };
addEventListener('resize', sizePad);

// ----- typed signatures -----
function fontButtons() {
  const n = $('#name').value.trim() || 'Your Name';
  $('#fonts').innerHTML = FONTS.map(f => `<button type="button" class="sig-font${f === font ? ' on' : ''}" data-f="${f}" style="font-family:'${f}',cursive">${esc(n)}</button>`).join('');
}
$('#fonts').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (b) { font = b.dataset.f; fontButtons(); update(); } });
$('#name').addEventListener('input', () => { fontButtons(); update(); });

// ----- from a photo: keep dark ink, make the paper transparent -----
fileDrop($('#drop'), $('#file'), async files => { photo = await loadImage(files[0]); update(); });
onAny('#thr', () => { $('#tv').textContent = $('#thr').value; update(); });

// ----- shared -----
onAny('input[name="mode"]', () => { mode = $('input[name="mode"]:checked').value; $$('[data-mode]').forEach(el => { el.hidden = el.dataset.mode !== mode; }); $('#w-wrap').hidden = mode !== 'draw'; if (mode === 'draw') sizePad(); update(); });
$('#colors').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) { color = b.dataset.c; $('#color').value = color; $$('#colors .chip').forEach(c => c.classList.toggle('on', c === b)); redrawPad(); update(); } });
$('#color').addEventListener('input', e => { color = e.target.value; $$('#colors .chip').forEach(c => c.classList.remove('on')); redrawPad(); update(); });
onAny('#width', () => { $('#wv').textContent = $('#width').value; redrawPad(); update(); });

// Renders the signature at high resolution and trims the empty space around it.
function render() {
  const S = 3, c = document.createElement('canvas'), x = c.getContext('2d');
  if (mode === 'draw') {
    if (!strokes.length) return null;
    const r = pad.getBoundingClientRect();
    c.width = r.width * S; c.height = r.height * S;
    strokes.forEach(s => drawStroke(x, s, S));
  } else if (mode === 'type') {
    const n = $('#name').value.trim(); if (!n) return null;
    x.font = `120px '${font}', cursive`;
    c.width = Math.ceil(x.measureText(n).width + 160); c.height = 300;
    x.font = `120px '${font}', cursive`; x.fillStyle = color; x.textBaseline = 'middle'; x.fillText(n, 80, 160);
  } else {
    if (!photo) return null;
    const k = Math.min(1, 2400 / photo.width);
    c.width = photo.width * k; c.height = photo.height * k;
    x.drawImage(photo, 0, 0, c.width, c.height);
    const d = x.getImageData(0, 0, c.width, c.height), t = +$('#thr').value / 100 * 255, [R, G, B] = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16));
    for (let i = 0; i < d.data.length; i += 4) {
      const lum = 0.299 * d.data[i] + 0.587 * d.data[i + 1] + 0.114 * d.data[i + 2];
      // Soft edge between ink and paper keeps the strokes smooth.
      const a = Math.max(0, Math.min(1, (t + 25 - lum) / 50));
      d.data[i] = R; d.data[i + 1] = G; d.data[i + 2] = B; d.data[i + 3] = a * 255;
    }
    x.putImageData(d, 0, 0);
  }
  return trim(c);
}
function trim(c) {
  const x = c.getContext('2d'), d = x.getImageData(0, 0, c.width, c.height).data;
  let t = c.height, l = c.width, r = 0, b = 0;
  for (let y = 0; y < c.height; y++) for (let i = 0; i < c.width; i++) if (d[(y * c.width + i) * 4 + 3] > 10) { if (y < t) t = y; if (y > b) b = y; if (i < l) l = i; if (i > r) r = i; }
  if (r < l) return null;
  const pad2 = 16, o = document.createElement('canvas');
  o.width = r - l + 1 + pad2 * 2; o.height = b - t + 1 + pad2 * 2;
  o.getContext('2d').drawImage(c, l - pad2, t - pad2, o.width, o.height, 0, 0, o.width, o.height);
  return o;
}
let sig = null;
async function update() {
  if (mode === 'type') await document.fonts.load(`40px '${font}'`).catch(() => {});
  sig = render();
  $('#prev').src = sig ? sig.toDataURL('image/png') : '';
  $('#prev').hidden = !sig;
  $('#meta').textContent = sig ? `${sig.width}×${sig.height} px, transparent background: place it on any document or in Word, Google Docs and PDF signers.` : (mode === 'draw' ? 'Sign in the box with your mouse, finger or stylus.' : mode === 'photo' ? 'Choose a photo of your signature.' : 'Type your name.');
  $$('#out .btn').forEach(b => { b.disabled = !sig; });
}
const fname = () => 'signature';
$('#png').onclick = async () => sig && download(await canvasBlob(sig, 'image/png'), `${fname()}.png`);
$('#jpg').onclick = async () => { if (!sig) return; const c = document.createElement('canvas'); c.width = sig.width; c.height = sig.height; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(sig, 0, 0); download(await canvasBlob(c, 'image/jpeg', 0.95), `${fname()}.jpg`); };
$('#svg').onclick = () => {
  if (!sig) return;
  let body;
  if (mode === 'draw') {
    const r = pad.getBoundingClientRect();
    body = strokes.map(s => `<path d="M${s.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L')}" fill="none" stroke="${color}" stroke-width="${$('#width').value}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
    download(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r.width} ${r.height}">${body}</svg>`], { type: 'image/svg+xml' }), `${fname()}.svg`);
  } else {
    // Typed and photo signatures are saved as an image inside the SVG.
    download(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sig.width} ${sig.height}"><image width="${sig.width}" height="${sig.height}" href="${sig.toDataURL('image/png')}"/></svg>`], { type: 'image/svg+xml' }), `${fname()}.svg`);
  }
};
fontButtons();
requestAnimationFrame(() => { sizePad(); update(); });
