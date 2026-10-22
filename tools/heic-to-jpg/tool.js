const out = $('#out');
let last = [];
onAny('#q', () => { $('#qv').textContent = $('#q').value; });
onAny('#to', () => { $('#q-wrap').hidden = $('#to').value === 'image/png'; if (last.length) convert(last); });
$('#q').addEventListener('change', () => { if (last.length) convert(last); });
fileDrop($('#drop'), $('#file'), files => convert(files));
$('#sample').addEventListener('click', async () => {
  out.innerHTML = '<p class="kicker">Converted photos</p><p class="sub">Downloading the sample…</p>';
  const r = await fetch('https://cdn.jsdelivr.net/gh/alexcorvi/heic2any@0.0.4/demo/1.heic');
  convert([new File([await r.blob()], 'IMG_0001.HEIC', { type: 'image/heic' })]);
});

async function convert(files) {
  last = files;
  const to = $('#to').value, ext = to === 'image/png' ? 'png' : 'jpg', quality = +$('#q').value / 100;
  const items = files.map(f => ({ name: f.name, before: f.size, file: f }));
  renderImageResults(out, items, `Converting ${files.length} photo${files.length > 1 ? 's' : ''}…`);
  for (const it of items) {
    try {
      let res = await heic2any({ blob: it.file, toType: to, quality });
      if (Array.isArray(res)) res = res[0]; // multi-image HEIC (bursts, live photos): first image
      const img = await loadImage(new File([res], 'x', { type: to }));
      Object.assign(it, { blob: res, after: res.size, w: img.naturalWidth, h: img.naturalHeight, thumb: img.src, outName: `${baseName(it.name)}.${ext}` });
    } catch (e) {
      it.error = /format not supported|ERR_LIBHEIF/i.test(String(e && (e.message || e.code || e))) ? 'Not a HEIC photo, or a HEIC variant this converter can’t read.' : 'Couldn’t convert this photo.';
    }
    renderImageResults(out, items, `Converted to ${ext.toUpperCase()}`);
  }
  if (items.some(i => i.blob)) out.insertAdjacentHTML('afterbegin', `<div class="heic-big"><img src="${items.find(i => i.blob).thumb}" alt="Preview of the converted photo"></div>`);
}
