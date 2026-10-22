let items = [];
let timer = null, run = 0;
const out = $('#out');

fileDrop($('#drop'), $('#file'), files => {
  files.filter(f => f.type.startsWith('image/')).forEach(file => items.push({ file, name: file.name, before: file.size }));
  runAll();
});
$('#sample').addEventListener('click', async () => { const f = await sampleImage(); items.push({ file: f, name: f.name, before: f.size }); runAll(); });
$('#presets').addEventListener('click', e => {
  const b = e.target.closest('.chip');
  if (!b) return;
  $('#mode-px').checked = true;
  $('#w').value = b.dataset.w; $('#h').value = b.dataset.h;
  $('#lock').checked = false; // a preset with both sides set crops to fill instead of stretching
  changed();
});
onAny('#w, #h, #pct, #lock, input[name="mode"]', changed);

function changed() {
  const pct = $('input[name="mode"]:checked').value === 'pct';
  $('#px-fields').hidden = pct; $('#pct-fields').hidden = !pct;
  $('#pv').textContent = $('#pct').value;
  clearTimeout(timer);
  timer = setTimeout(runAll, 250);
}

// Work out output size and which part of the source to draw (centre crop when both sides are fixed).
function plan(iw, ih) {
  if ($('input[name="mode"]:checked').value === 'pct') {
    const k = +$('#pct').value / 100;
    return { w: Math.max(1, Math.round(iw * k)), h: Math.max(1, Math.round(ih * k)), sx: 0, sy: 0, sw: iw, sh: ih };
  }
  let w = Math.round(val($('#w'))), h = Math.round(val($('#h')));
  const lock = $('#lock').checked;
  if (!(w > 0) && !(h > 0)) return { w: iw, h: ih, sx: 0, sy: 0, sw: iw, sh: ih };
  if (lock || !(w > 0) || !(h > 0)) {
    if (w > 0 && (lock || !(h > 0))) h = Math.round(ih * w / iw);
    else w = Math.round(iw * h / ih);
    return { w, h, sx: 0, sy: 0, sw: iw, sh: ih };
  }
  const k = Math.max(w / iw, h / ih); // cover: fill the frame, trim the overflow equally
  const sw = w / k, sh = h / k;
  return { w, h, sx: (iw - sw) / 2, sy: (ih - sh) / 2, sw, sh, cropped: true };
}

async function resize(it) {
  const img = await loadImage(it.file);
  const p = plan(img.naturalWidth, img.naturalHeight);
  const type = ['image/png', 'image/webp'].includes(it.file.type) ? it.file.type : 'image/jpeg';
  const c = document.createElement('canvas');
  c.width = p.w; c.height = p.h;
  const x = c.getContext('2d');
  x.imageSmoothingQuality = 'high';
  if (type === 'image/jpeg') { x.fillStyle = '#fff'; x.fillRect(0, 0, p.w, p.h); }
  x.drawImage(img, p.sx, p.sy, p.sw, p.sh, 0, 0, p.w, p.h);
  const blob = await canvasBlob(c, type, 0.92);
  const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[blob.type] || 'jpg';
  Object.assign(it, { thumb: it.thumb || img.src, blob, after: blob.size, w: p.w, h: p.h, outName: `${baseName(it.name)}-${p.w}x${p.h}.${ext}`,
    note: `was ${img.naturalWidth}×${img.naturalHeight}${p.cropped ? ', centre-cropped' : ''}` });
}

async function runAll() {
  if (!items.length) return;
  const mine = ++run;
  items.forEach(it => { it.blob = null; it.error = null; });
  renderImageResults(out, items, 'Resized images');
  for (const it of items) {
    try { await resize(it); } catch (e) { it.error = e.message; }
    if (mine !== run) return;
    renderImageResults(out, items, 'Resized images');
  }
}
