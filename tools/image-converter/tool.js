let items = [];
let timer = null, run = 0;
const out = $('#out');
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

fileDrop($('#drop'), $('#file'), files => {
  files.filter(f => f.type.startsWith('image/') || /\.(svg|avif|bmp|gif)$/i.test(f.name)).forEach(file => items.push({ file, name: file.name, before: file.size }));
  runAll();
});
$('#sample').addEventListener('click', async () => { const f = await sampleImage(); items.push({ file: f, name: f.name, before: f.size }); runAll(); });
onAny('input[name="to"], #quality, #bg', () => {
  const to = $('input[name="to"]:checked').value;
  $('#q-wrap').hidden = to === 'image/png';
  $('#bg-wrap').hidden = to !== 'image/jpeg';
  $('#qv').textContent = $('#quality').value;
  clearTimeout(timer);
  timer = setTimeout(runAll, 200);
});

async function convert(it) {
  const img = await loadImage(it.file);
  const to = $('input[name="to"]:checked').value;
  // SVGs without a size report 0×0; give them a sensible default.
  const w = img.naturalWidth || 1024, h = img.naturalHeight || 1024;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  if (to === 'image/jpeg') { x.fillStyle = $('#bg').value; x.fillRect(0, 0, w, h); }
  x.drawImage(img, 0, 0, w, h);
  const blob = await canvasBlob(c, to, +$('#quality').value / 100);
  if (!blob || blob.type !== to) throw new Error('This browser can\'t save that format. Try JPG or PNG.');
  Object.assign(it, { thumb: it.thumb || img.src, blob, after: blob.size, w, h, outName: `${baseName(it.name)}.${EXT[to]}`, note: `${(it.file.type.split('/')[1] || 'image').toUpperCase()} → ${EXT[to].toUpperCase()}` });
}

async function runAll() {
  if (!items.length) return;
  const mine = ++run;
  items.forEach(it => { it.blob = null; it.error = null; });
  renderImageResults(out, items, 'Converted images');
  for (const it of items) {
    try { await convert(it); } catch (e) { it.error = e.message; }
    if (mine !== run) return;
    renderImageResults(out, items, 'Converted images');
  }
}
