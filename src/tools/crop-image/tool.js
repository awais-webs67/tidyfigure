const cv = $('#cv'), x = cv.getContext('2d');
let img = null, file = null, k = 1, ratio = 0, crop = null, drag = null;

function fit() {
  const maxW = Math.min(cv.parentElement.clientWidth || 800, 1100), maxH = Math.min(window.innerHeight * 0.7, 720);
  k = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
  cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k);
}
function draw() {
  if (!img) return;
  x.drawImage(img, 0, 0, cv.width, cv.height);
  const r = { x: crop.x * k, y: crop.y * k, w: crop.w * k, h: crop.h * k };
  x.fillStyle = 'rgba(0,0,0,.55)';
  x.fillRect(0, 0, cv.width, r.y); x.fillRect(0, r.y + r.h, cv.width, cv.height - r.y - r.h);
  x.fillRect(0, r.y, r.x, r.h); x.fillRect(r.x + r.w, r.y, cv.width - r.x - r.w, r.h);
  x.strokeStyle = '#fff'; x.lineWidth = 2; x.strokeRect(r.x, r.y, r.w, r.h);
  x.strokeStyle = 'rgba(255,255,255,.45)'; x.lineWidth = 1;
  for (let i = 1; i < 3; i++) { x.beginPath(); x.moveTo(r.x + r.w * i / 3, r.y); x.lineTo(r.x + r.w * i / 3, r.y + r.h); x.moveTo(r.x, r.y + r.h * i / 3); x.lineTo(r.x + r.w, r.y + r.h * i / 3); x.stroke(); }
  x.fillStyle = '#FF5B35';
  [[r.x, r.y], [r.x + r.w, r.y], [r.x, r.y + r.h], [r.x + r.w, r.y + r.h]].forEach(([a, b]) => x.fillRect(a - 7, b - 7, 14, 14));
  $('#dims').textContent = `${Math.round(crop.w)} × ${Math.round(crop.h)} px (from ${img.naturalWidth} × ${img.naturalHeight})`;
}
function reset() {
  const W = img.naturalWidth, H = img.naturalHeight;
  let w = W * 0.8, h = H * 0.8;
  if (ratio) { if (w / h > ratio) w = h * ratio; else h = w / ratio; }
  crop = { x: (W - w) / 2, y: (H - h) / 2, w, h };
  draw();
}
const pt = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * img.naturalWidth, (e.clientY - r.top) / r.height * img.naturalHeight]; };

cv.addEventListener('pointerdown', e => {
  if (!img) return;
  const [px, py] = pt(e), tol = 16 / k;
  const corners = { nw: [crop.x, crop.y], ne: [crop.x + crop.w, crop.y], sw: [crop.x, crop.y + crop.h], se: [crop.x + crop.w, crop.y + crop.h] };
  const hit = Object.entries(corners).find(([, [a, b]]) => Math.abs(px - a) < tol && Math.abs(py - b) < tol);
  if (hit) {
    const c = hit[0];
    drag = { mode: 'resize', fx: c.includes('w') ? crop.x + crop.w : crop.x, fy: c.includes('n') ? crop.y + crop.h : crop.y };
  } else if (px > crop.x && px < crop.x + crop.w && py > crop.y && py < crop.y + crop.h) drag = { mode: 'move', dx: px - crop.x, dy: py - crop.y };
  else drag = { mode: 'resize', fx: px, fy: py };
  cv.setPointerCapture(e.pointerId);
});
cv.addEventListener('pointermove', e => {
  if (!drag) return;
  const W = img.naturalWidth, H = img.naturalHeight;
  let [px, py] = pt(e);
  px = Math.min(W, Math.max(0, px)); py = Math.min(H, Math.max(0, py));
  if (drag.mode === 'move') {
    crop.x = Math.min(W - crop.w, Math.max(0, px - drag.dx));
    crop.y = Math.min(H - crop.h, Math.max(0, py - drag.dy));
  } else {
    let w = Math.abs(px - drag.fx), h = Math.abs(py - drag.fy);
    if (ratio) { if (w / Math.max(h, 1) > ratio) h = w / ratio; else w = h * ratio; }
    const sx = px < drag.fx ? -1 : 1, sy = py < drag.fy ? -1 : 1;
    // Keep the box inside the image when a fixed ratio pushes it past an edge.
    const maxW = sx < 0 ? drag.fx : W - drag.fx, maxH = sy < 0 ? drag.fy : H - drag.fy;
    const s = Math.min(1, maxW / Math.max(w, 1), maxH / Math.max(h, 1));
    w *= s; h *= s;
    crop = { x: sx < 0 ? drag.fx - w : drag.fx, y: sy < 0 ? drag.fy - h : drag.fy, w: Math.max(w, 4), h: Math.max(h, 4) };
  }
  draw();
});
cv.addEventListener('pointerup', () => { drag = null; });

$('#ratios').addEventListener('click', e => {
  const b = e.target.closest('.chip');
  if (!b) return;
  ratio = +b.dataset.r;
  $$('#ratios .chip').forEach(c => c.classList.toggle('on', c === b));
  if (img) reset();
});
function use(i, f) { img = i; file = f; fit(); reset(); $('#save').disabled = false; $('#loaded').textContent = `${f.name} · ${i.naturalWidth} × ${i.naturalHeight}`; }
pickImage($('#drop'), $('#file'), use);
$('#sample').addEventListener('click', async () => { const f = await sampleImage('image/jpeg'); use(await loadImage(f), f); });
window.addEventListener('resize', () => { if (img) { fit(); draw(); } });
$('#save').addEventListener('click', async () => {
  const c = document.createElement('canvas');
  c.width = Math.round(crop.w); c.height = Math.round(crop.h);
  const type = outType(file);
  const cx = c.getContext('2d');
  if (type === 'image/jpeg') { cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height); }
  cx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, c.width, c.height);
  download(await canvasBlob(c, type, 0.92), `${baseName(file.name)}-cropped.${extOf(type)}`);
});
