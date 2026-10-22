const SIZES = [16, 32, 48, 180, 192, 512];
let logo = null;

function icon(size) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const x = c.getContext('2d'), shape = $('#shape').value, r = shape === 'circle' ? size / 2 : shape === 'rounded' ? size * 0.2 : 0;
  x.beginPath(); x.roundRect ? x.roundRect(0, 0, size, size, r) : x.rect(0, 0, size, size); x.clip();
  if ($('input[name="mode"]:checked').value === 'img') {
    if (logo) { const s = Math.min(size / logo.naturalWidth, size / logo.naturalHeight); const w = logo.naturalWidth * s, h = logo.naturalHeight * s; x.drawImage(logo, (size - w) / 2, (size - h) / 2, w, h); }
  } else {
    x.fillStyle = $('#bg').value; x.fillRect(0, 0, size, size);
    const t = $('#txt').value.trim() || 'T', len = [...t].length;
    x.fillStyle = $('#fg').value; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `700 ${size * (len > 1 ? 0.5 : 0.66)}px "${$('#font').value}", system-ui, sans-serif`;
    x.fillText(t, size / 2, size / 2 + size * 0.04);
  }
  return c;
}

// .ico files can contain PNG images directly; build one with 16, 32 and 48 px.
async function ico() {
  const pngs = await Promise.all([16, 32, 48].map(async s => new Uint8Array(await (await canvasBlob(icon(s), 'image/png')).arrayBuffer())));
  const head = 6 + 16 * pngs.length, total = head + pngs.reduce((a, p) => a + p.length, 0);
  const buf = new Uint8Array(total), dv = new DataView(buf.buffer);
  dv.setUint16(2, 1, true); dv.setUint16(4, pngs.length, true);
  let off = head;
  pngs.forEach((p, i) => {
    const s = [16, 32, 48][i], e = 6 + i * 16;
    buf[e] = s; buf[e + 1] = s; dv.setUint16(e + 4, 1, true); dv.setUint16(e + 6, 32, true);
    dv.setUint32(e + 8, p.length, true); dv.setUint32(e + 12, off, true);
    buf.set(p, off); off += p.length;
  });
  return new Blob([buf], { type: 'image/x-icon' });
}

const SNIPPET = `<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

function render() {
  const m = $('input[name="mode"]:checked').value;
  $('#text-box').hidden = m !== 'text'; $('#img-box').hidden = m !== 'img';
  $('#previews').innerHTML = '';
  [16, 32, 48, 180].forEach(s => {
    const c = icon(s); c.style.width = c.style.height = `${Math.max(s, 16) * (s <= 48 ? 2 : 0.5)}px`; c.style.imageRendering = s <= 48 ? 'pixelated' : 'auto';
    const fig = document.createElement('figure'); fig.style.margin = 0; fig.style.textAlign = 'center';
    fig.append(c); fig.insertAdjacentHTML('beforeend', `<figcaption class="note">${s}px</figcaption>`);
    $('#previews').append(fig);
  });
  $('#snippet').textContent = SNIPPET;
}
onAny('#txt, #font, #fg, #bg, #shape, input[name="mode"]', render);
pickImage($('#drop'), $('#file'), im => { logo = im; $('#loaded').textContent = 'Image loaded'; render(); });
$('#zip').addEventListener('click', async () => {
  const zip = new JSZip();
  zip.file('favicon.ico', await ico());
  const names = { 16: 'favicon-16x16.png', 32: 'favicon-32x32.png', 48: 'favicon-48x48.png', 180: 'apple-touch-icon.png', 192: 'android-chrome-192x192.png', 512: 'android-chrome-512x512.png' };
  for (const s of SIZES) zip.file(names[s], await canvasBlob(icon(s), 'image/png'));
  const bg = $('input[name="mode"]:checked').value === 'text' ? $('#bg').value : '#ffffff';
  zip.file('site.webmanifest', JSON.stringify({ name: $('#site').value, short_name: $('#site').value, icons: [{ src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }, { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }], theme_color: bg, background_color: bg, display: 'standalone' }, null, 2));
  zip.file('how-to-install.html', SNIPPET + '\n');
  download(await zip.generateAsync({ type: 'blob' }), 'favicons.zip');
});
if (document.fonts) document.fonts.ready.then(render);
render();
