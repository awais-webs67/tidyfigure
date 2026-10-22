let img = null, name = 'meme';

// Break text into lines that fit the width.
function wrap(x, text, max) {
  const words = text.split(/\s+/).filter(Boolean), lines = [];
  let line = '';
  for (const w of words) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > max && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line);
  return lines;
}

function render(c, scale = 1) {
  const W = img.width || img.naturalWidth, H = img.height || img.naturalHeight;
  const bar = $('#bar').checked, x = c.getContext('2d');
  const fs = Math.round(Math.min(W, H) * +$('#size').value / 100 * scale);
  const caps = s => ($('#caps').checked ? s.toUpperCase() : s);
  x.font = `${fs}px Anton, Impact, "Arial Narrow Bold", sans-serif`;
  const top = wrap(x, caps($('#top').value), W * scale * 0.92), bottom = wrap(x, caps($('#bottom').value), W * scale * 0.92);
  const lh = fs * 1.12, pad = fs * 0.45;
  const topH = bar && top.length ? top.length * lh + pad * 2 : 0, botH = bar && bottom.length ? bottom.length * lh + pad * 2 : 0;
  c.width = Math.round(W * scale); c.height = Math.round(H * scale + topH + botH);
  x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
  x.drawImage(img, 0, topH, W * scale, H * scale);
  x.font = `${fs}px Anton, Impact, "Arial Narrow Bold", sans-serif`;
  x.textAlign = 'center'; x.textBaseline = 'top'; x.lineJoin = 'round';
  const draw = (lines, y0) => lines.forEach((l, i) => {
    const y = y0 + i * lh;
    if (bar) { x.fillStyle = '#000'; x.fillText(l, c.width / 2, y); return; }
    x.strokeStyle = $('#stroke').value; x.lineWidth = fs / 7; x.strokeText(l, c.width / 2, y);
    x.fillStyle = $('#color').value; x.fillText(l, c.width / 2, y);
  });
  if (bar) { draw(top, pad); draw(bottom, topH + H * scale + pad); }
  else { draw(top, pad); draw(bottom, c.height - pad - bottom.length * lh); }
}
function preview() {
  $('#szv').textContent = $('#size').value;
  if (!img) return;
  const W = img.width || img.naturalWidth;
  render($('#cv'), Math.min(1, 800 / W));
}
function use(i, n) { img = i; name = n; $('#save').disabled = false; preview(); }
pickImage($('#drop'), $('#file'), (i, f) => { $('#loaded').textContent = f.name; use(i, baseName(f.name)); });
$('#blanks').addEventListener('click', async e => {
  const b = e.target.closest('.chip');
  if (!b) return;
  if (b.dataset.c === 'sample') return use(await loadImage(await sampleImage('image/jpeg')), 'meme');
  const c = document.createElement('canvas'); c.width = 1080; c.height = 1080;
  const x = c.getContext('2d'); x.fillStyle = b.dataset.c; x.fillRect(0, 0, 1080, 1080);
  if (b.dataset.c === '#ffffff') $('#color').value = '#000000', $('#stroke').value = '#ffffff';
  use(c, 'meme');
});
onAny('#top, #bottom, #size, #color, #stroke, #caps, #bar', preview);
$('#save').addEventListener('click', async () => { const c = document.createElement('canvas'); render(c, 1); download(await canvasBlob(c, 'image/jpeg', 0.92), `${name}-meme.jpg`); });
if (document.fonts) document.fonts.load('40px Anton').then(preview).catch(() => {});
sampleImage('image/jpeg').then(loadImage).then(i => { if (!img) use(i, 'meme'); });
