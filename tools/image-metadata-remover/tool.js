let items = [];
const out = $('#out');
const cat = parts => { const n = parts.reduce((s, p) => s + p.length, 0), o = new Uint8Array(n); let k = 0; parts.forEach(p => { o.set(p, k); k += p.length; }); return o; };

// JPEG: drop APP1 (EXIF/XMP), APP13 (IPTC/Photoshop), comments and other APPn; keep JFIF, ICC colour and Adobe segments.
function stripJpeg(b) {
  if (b[0] !== 0xFF || b[1] !== 0xD8) return null;
  const parts = [b.subarray(0, 2)];
  let i = 2;
  while (i < b.length - 3) {
    if (b[i] !== 0xFF) return null;
    const m = b[i + 1];
    if (m === 0xDA) { parts.push(b.subarray(i)); return cat(parts); }
    if ((m >= 0xD0 && m <= 0xD7) || m === 0x01 || m === 0xFF) { parts.push(b.subarray(i, i + 2)); i += 2; continue; }
    const len = (b[i + 2] << 8) | b[i + 3];
    const keep = !(m === 0xE1 || m === 0xED || m === 0xFE || (m >= 0xE3 && m <= 0xEF && m !== 0xEE));
    if (keep) parts.push(b.subarray(i, i + 2 + len));
    i += 2 + len;
  }
  return null;
}
// PNG: drop text chunks, EXIF and timestamps; keep everything needed to draw the image.
function stripPng(b) {
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  if (!sig.every((v, k) => b[k] === v)) return null;
  const parts = [b.subarray(0, 8)], dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  let i = 8;
  while (i < b.length) {
    const len = dv.getUint32(i), type = String.fromCharCode(...b.subarray(i + 4, i + 8));
    if (!['tEXt', 'zTXt', 'iTXt', 'eXIf', 'tIME'].includes(type)) parts.push(b.subarray(i, i + 12 + len));
    i += 12 + len;
    if (type === 'IEND') break;
  }
  return cat(parts);
}

async function inspect(file) {
  let meta = {};
  try { meta = (await exifr.parse(file, { tiff: true, exif: true, gps: true, xmp: true, iptc: true, icc: false, mergeOutput: true, translateValues: true })) || {}; } catch (e) { meta = {}; }
  const found = [];
  const add = (label, v) => { if (v !== undefined && v !== null && v !== '') found.push([label, v]); };
  add('Camera', [meta.Make, meta.Model].filter(Boolean).join(' '));
  add('Lens', meta.LensModel);
  add('Date taken', meta.DateTimeOriginal instanceof Date ? meta.DateTimeOriginal.toLocaleString() : meta.DateTimeOriginal);
  if (typeof meta.latitude === 'number') add('GPS location', `<a href="https://www.google.com/maps?q=${meta.latitude},${meta.longitude}" target="_blank" rel="noopener">${meta.latitude.toFixed(5)}, ${meta.longitude.toFixed(5)}</a> ⚠️`);
  add('Software', meta.Software);
  add('Author / artist', meta.Artist || meta.creator || meta.Creator);
  add('Copyright', meta.Copyright);
  add('Settings', [meta.FNumber && `f/${meta.FNumber}`, meta.ExposureTime && `1/${Math.round(1 / meta.ExposureTime)}s`, meta.ISO && `ISO ${meta.ISO}`].filter(Boolean).join(' · '));
  const total = Object.keys(meta).length;
  return { found, total, orientation: meta.Orientation, gps: typeof meta.latitude === 'number' };
}

async function clean(it) {
  const f = it.file, b = new Uint8Array(await f.arrayBuffer());
  const upright = !it.info.orientation || it.info.orientation === 1 || it.info.orientation === 'Horizontal (normal)';
  let outBytes = null;
  if (f.type === 'image/jpeg' && upright) outBytes = stripJpeg(b);
  if (f.type === 'image/png') outBytes = stripPng(b);
  if (outBytes) { it.blob = new Blob([outBytes], { type: f.type }); it.how = 'lossless'; return; }
  const img = await loadImage(f); // the browser applies the orientation tag when drawing
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const type = f.type === 'image/png' || f.type === 'image/webp' ? f.type : 'image/jpeg';
  const x = c.getContext('2d'); if (type === 'image/jpeg') { x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); }
  x.drawImage(img, 0, 0);
  it.blob = await canvasBlob(c, type, 0.95); it.how = 're-saved upright';
  it.ext = extOf(type);
}

function render() {
  const gps = items.filter(i => i.info && i.info.gps).length;
  out.innerHTML = `<p class="kicker">Hidden data</p>${gps ? `<span class="verdict no">${gps} photo${gps > 1 ? 's' : ''} reveal${gps > 1 ? '' : 's'} a GPS location</span>` : ''}
    ${items.map((it, i) => `<div class="stat" style="gap:8px">
      <div style="display:flex;gap:12px;align-items:center"><img src="${it.thumb}" alt="" style="width:56px;height:56px;object-fit:cover;border-radius:4px"><span class="meta" style="min-width:0;flex:1"><b style="font:600 15px var(--f-body);overflow-wrap:anywhere">${esc(it.file.name)}</b><span>${!it.info ? 'Reading…' : it.info.total ? `${it.info.total} metadata fields found` : 'No metadata found'}</span></span></div>
      ${it.info && it.info.found.length ? `<table class="tbl"><tbody>${it.info.found.map(([k, v]) => `<tr><td>${k}</td><td>${k === 'GPS location' ? v : esc(String(v))}</td></tr>`).join('')}</tbody></table>` : ''}
      ${it.blob ? `<div class="copyrow"><span class="note" style="margin-right:auto">Clean copy: ${bytes(it.blob.size)} · ${it.how}</span><button type="button" class="btn" data-i="${i}">Download clean photo</button></div>` : ''}
    </div>`).join('')}
    ${items.length > 1 && items.every(i => i.blob) ? '<div class="copyrow"><button type="button" class="btn" id="all">Download all clean photos</button></div>' : ''}`;
}
const name = it => `${baseName(it.file.name)}-clean.${it.ext || (it.file.name.split('.').pop() || 'jpg')}`;
out.addEventListener('click', e => {
  const b = e.target.closest('button[data-i]');
  if (b) { const it = items[+b.dataset.i]; download(it.blob, name(it)); }
  if (e.target.id === 'all') items.forEach((it, k) => setTimeout(() => download(it.blob, name(it)), k * 350));
});

async function add(files) {
  const list = files.filter(f => f.type.startsWith('image/'));
  for (const file of list) items.push({ file, thumb: URL.createObjectURL(file) });
  render();
  for (const it of items.filter(i => !i.blob)) { it.info = await inspect(it.file); render(); await clean(it); render(); }
}
fileDrop($('#drop'), $('#file'), add);

// Sample: a JPEG with a real EXIF block (camera, date, GPS) spliced in, to show what gets found and removed.
$('#sample').addEventListener('click', async () => {
  const jpg = new Uint8Array(await (await sampleImage('image/jpeg')).arrayBuffer());
  const enc = s => [...s].map(c => c.charCodeAt(0));
  const tags = [[0x010F, 2, enc('Canon\0')], [0x0110, 2, enc('Canon EOS R6\0')], [0x0131, 2, enc('Photos 9.0\0')], [0x8825, 4, null]];
  // Minimal TIFF: IFD0 (Make, Model, Software, GPS pointer) + GPS IFD (lat/long of Big Ben)
  const t = [];
  const u16 = v => [v >> 8 & 255, v & 255], u32 = v => [v >>> 24 & 255, v >> 16 & 255, v >> 8 & 255, v & 255];
  const ifd0Off = 8, ifd0Size = 2 + tags.length * 12 + 4;
  let dataOff = ifd0Off + ifd0Size, data = [];
  const gpsOff = dataOff + tags.filter(x => x[2] && x[2].length > 4).reduce((s, x) => s + x[2].length, 0);
  t.push(...[0x4D, 0x4D, 0, 42], ...u32(ifd0Off), ...u16(tags.length));
  for (const [id, type, val] of tags) {
    if (type === 4) { t.push(...u16(id), ...u16(4), ...u32(1), ...u32(gpsOff)); continue; }
    t.push(...u16(id), ...u16(2), ...u32(val.length), ...u32(dataOff)); data.push(...val); dataOff += val.length;
  }
  t.push(...u32(0), ...data);
  const rat = (n, d) => [...u32(n), ...u32(d)];
  const gpsCount = 4, gpsDataOff = gpsOff + 2 + gpsCount * 12 + 4;
  t.push(...u16(gpsCount), ...u16(1), ...u16(2), ...u32(2), 78, 0, 0, 0, ...u16(2), ...u16(5), ...u32(3), ...u32(gpsDataOff),
    ...u16(3), ...u16(2), ...u32(2), 87, 0, 0, 0, ...u16(4), ...u16(5), ...u32(3), ...u32(gpsDataOff + 24), ...u32(0),
    ...rat(51, 1), ...rat(30, 1), ...rat(2940, 100), ...rat(0, 1), ...rat(7, 1), ...rat(4536, 100));
  const exif = [0x45, 0x78, 0x69, 0x66, 0, 0, ...t];
  const seg = [0xFF, 0xE1, ...u16(exif.length + 2), ...exif];
  const outB = cat([jpg.subarray(0, 2), new Uint8Array(seg), jpg.subarray(2)]);
  add([new File([outB], 'holiday-photo.jpg', { type: 'image/jpeg' })]);
});
