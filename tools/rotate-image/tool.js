let img = null, file = null, rot = 0, fh = false, fv = false;

// Render the transformed image at a given scale onto a fresh canvas.
function render(scale = 1) {
  const fine = +$('#angle').value * Math.PI / 180, total = rot * Math.PI / 180 + fine;
  const W = img.naturalWidth, H = img.naturalHeight;
  const cos = Math.abs(Math.cos(total)), sin = Math.abs(Math.sin(total));
  let cw = W * cos + H * sin, ch = W * sin + H * cos;
  if ($('#autocrop').checked && fine) {
    // Largest axis-aligned rectangle inside the rotated image (keeps the original shape).
    const w0 = rot % 180 ? H : W, h0 = rot % 180 ? W : H, a = Math.abs(fine);
    const k = Math.min(w0 / (w0 * Math.cos(a) + h0 * Math.sin(a)), h0 / (w0 * Math.sin(a) + h0 * Math.cos(a)));
    cw = w0 * k; ch = h0 * k;
  }
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(cw * scale)); c.height = Math.max(1, Math.round(ch * scale));
  const x = c.getContext('2d');
  if (outType(file) === 'image/jpeg') { x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); }
  x.translate(c.width / 2, c.height / 2);
  x.rotate(total);
  x.scale((fh ? -1 : 1) * scale, (fv ? -1 : 1) * scale);
  x.imageSmoothingQuality = 'high';
  x.drawImage(img, -W / 2, -H / 2);
  return c;
}
function preview() {
  if (!img) return;
  $('#av').textContent = $('#angle').value;
  const maxW = 720, s = Math.min(1, maxW / Math.max(img.naturalWidth, img.naturalHeight));
  const c = render(s), cv = $('#cv');
  cv.width = c.width; cv.height = c.height; cv.getContext('2d').drawImage(c, 0, 0);
  const full = render(1);
  $('#info').textContent = `${full.width} × ${full.height} px · rotated ${(rot + +$('#angle').value + 360) % 360}°${fh ? ' · flipped horizontally' : ''}${fv ? ' · flipped vertically' : ''}`;
}
document.querySelector('.inputs').addEventListener('click', e => {
  const b = e.target.closest('button[data-a]');
  if (!b || !img) return;
  ({ cw: () => { rot = (rot + 90) % 360; }, ccw: () => { rot = (rot + 270) % 360; }, fh: () => { fh = !fh; }, fv: () => { fv = !fv; } })[b.dataset.a]();
  preview();
});
onAny('#angle, #autocrop', preview);
$('#reset').addEventListener('click', () => { rot = 0; fh = fv = false; $('#angle').value = 0; preview(); });
function use(i, f) { img = i; file = f; rot = 0; fh = fv = false; $('#angle').value = 0; $('#save').disabled = false; $('#loaded').textContent = f.name; preview(); }
pickImage($('#drop'), $('#file'), use);
$('#sample').addEventListener('click', async () => { const f = await sampleImage('image/jpeg'); use(await loadImage(f), f); });
$('#save').addEventListener('click', async () => { const t = outType(file); download(await canvasBlob(render(1), t, 0.92), `${baseName(file.name)}-rotated.${extOf(t)}`); });
