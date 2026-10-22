let items = [];
let timer = null;
const out = $('#out');

fileDrop($('#drop'), $('#file'), add);
$('#sample').addEventListener('click', async () => add([await sampleImage('image/jpeg')]));
onAny('#quality, #format, #maxw', () => {
  $('#qv').textContent = $('#quality').value;
  clearTimeout(timer);
  timer = setTimeout(runAll, 250);
});

function add(files) {
  files.filter(f => f.type.startsWith('image/')).forEach(file => items.push({ file, name: file.name, before: file.size }));
  runAll();
}

async function compress(it) {
  const img = await loadImage(it.file);
  let w = img.naturalWidth, h = img.naturalHeight;
  const maxw = val($('#maxw'));
  if (maxw > 0 && w > maxw) { h = Math.round(h * maxw / w); w = Math.round(maxw); }
  let type = $('#format').value;
  // Auto: photos stay JPG; PNG and WebP become WebP, which keeps transparency and is far smaller than PNG.
  if (type === 'auto') type = it.file.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp';
  if (type === 'same') type = ['image/png', 'image/webp'].includes(it.file.type) ? it.file.type : 'image/jpeg';
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  if (type === 'image/jpeg') { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); } // JPG has no transparency
  x.drawImage(img, 0, 0, w, h);
  let blob = await canvasBlob(c, type, +$('#quality').value / 100);
  if (!blob || blob.type !== type) { type = 'image/jpeg'; blob = await canvasBlob(c, type, +$('#quality').value / 100); } // browser can't write WebP
  const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[type];
  it.thumb = it.thumb || img.src;
  it.w = w; it.h = h;
  it.note = '';
  // Never hand back a bigger file in the same format: keep the original instead.
  if (blob.size >= it.before && type === it.file.type && w === img.naturalWidth) {
    it.blob = it.file; it.after = it.before; it.outName = it.name;
    it.note = type === 'image/png' ? 'already optimised; save as WebP or JPG to shrink PNGs' : 'already optimised';
  } else {
    it.blob = blob; it.after = blob.size; it.outName = `${baseName(it.name)}-compressed.${ext}`;
  }
}

let run = 0;
async function runAll() {
  if (!items.length) return;
  const mine = ++run; // a newer run (settings changed) cancels this one
  items.forEach(it => { it.blob = null; it.error = null; });
  renderImageResults(out, items, 'Compressed images');
  for (const it of items) {
    try { await compress(it); } catch (e) { it.error = e.message; }
    if (mine !== run) return;
    renderImageResults(out, items, 'Compressed images');
  }
}
