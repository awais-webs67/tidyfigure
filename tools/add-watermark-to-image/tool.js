let files = [], first = null, logo = null, t = null;

function stamp(c, im) {
  const x = c.getContext('2d');
  x.drawImage(im, 0, 0, c.width, c.height);
  const pos = $('#pos').value, size = +$('#size').value / 100, base = Math.min(c.width, c.height);
  x.globalAlpha = +$('#op').value / 100;
  if ($('#shadow').checked) { x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = base * 0.01; x.shadowOffsetX = x.shadowOffsetY = base * 0.003; }
  const useLogo = $('input[name="kind"]:checked').value === 'logo' && logo;
  let w, h, draw;
  if (useLogo) {
    w = c.width * size * 3; h = w * logo.naturalHeight / logo.naturalWidth;
    draw = (px, py) => x.drawImage(logo, px, py, w, h);
  } else {
    const fs = Math.max(10, base * size);
    x.font = `600 ${fs}px Inter, Arial, sans-serif`; x.fillStyle = $('#color').value; x.textBaseline = 'top';
    const text = $('#text').value || '©';
    w = x.measureText(text).width; h = fs;
    draw = (px, py) => x.fillText(text, px, py);
  }
  const m = base * 0.03;
  if (pos === 'tile') {
    x.save(); x.translate(c.width / 2, c.height / 2); x.rotate(-Math.PI / 6); x.translate(-c.width, -c.height);
    for (let yy = 0; yy < c.height * 2; yy += h * 3.5) for (let xx = 0; xx < c.width * 2; xx += w * 1.6) draw(xx, yy);
    x.restore();
  } else {
    const px = pos === 'c' ? (c.width - w) / 2 : pos.includes('r') ? c.width - w - m : m;
    const py = pos === 'c' ? (c.height - h) / 2 : pos.includes('b') ? c.height - h - m : m;
    draw(px, py);
  }
  x.globalAlpha = 1; x.shadowColor = 'transparent';
}
function preview() {
  $('#szv').textContent = $('#size').value; $('#opv').textContent = $('#op').value;
  const k = $('input[name="kind"]:checked').value;
  $('#text-wrap').hidden = k !== 'text'; $('#logo-wrap').hidden = k !== 'logo';
  if (!first) return;
  const s = Math.min(1, 900 / Math.max(first.naturalWidth, first.naturalHeight)), cv = $('#cv');
  cv.width = Math.round(first.naturalWidth * s); cv.height = Math.round(first.naturalHeight * s);
  stamp(cv, first);
}
async function add(list) {
  const imgs = list.filter(f => f.type.startsWith('image/'));
  if (!imgs.length) return;
  files = imgs;
  first = await loadImage(files[0]);
  $('#loaded').textContent = `${files.length} photo${files.length > 1 ? 's' : ''}`;
  $('#save').disabled = false;
  $('#save').textContent = files.length > 1 ? `Download all ${files.length}` : 'Download';
  $('#count').textContent = files.length > 1 ? 'Preview shows the first photo. The same watermark is added to every photo.' : '';
  preview();
}
fileDrop($('#drop'), $('#file'), add);
$('#logo').addEventListener('change', async () => { if ($('#logo').files[0]) { logo = await loadImage($('#logo').files[0]); preview(); } });
onAny('#text, #pos, #color, #size, #op, #shadow, input[name="kind"]', () => { clearTimeout(t); t = setTimeout(preview, 60); });
$('#sample').addEventListener('click', async () => add([await sampleImage('image/jpeg')]));
$('#save').addEventListener('click', async () => {
  for (const [i, f] of files.entries()) {
    const im = i === 0 ? first : await loadImage(f);
    const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
    stamp(c, im);
    const ty = outType(f);
    download(await canvasBlob(c, ty, 0.92), `${baseName(f.name)}-watermarked.${extOf(ty)}`);
    await new Promise(r => setTimeout(r, 300));
  }
});
