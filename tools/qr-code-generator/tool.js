// Start with this site's own address as the example link.
if (!$('#url').value) $('#url').value = location.origin + (window.TF_BASE || '');
if (qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs['UTF-8']) qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8']; // emoji and accents
const kind = () => $('input[name="kind"]:checked').value;
const wifiEsc = s => s.replace(/([\\;,:"])/g, '\\$1');
let qr = null;

function payload() {
  switch (kind()) {
    case 'url': { const u = $('#url').value.trim(); return u && !/^[a-z]+:/i.test(u) ? 'https://' + u : u; }
    case 'text': return $('#txt').value;
    case 'wifi': {
      const sec = $('#sec').value;
      return `WIFI:T:${sec};S:${wifiEsc($('#ssid').value)};${sec === 'nopass' ? '' : `P:${wifiEsc($('#pass').value)};`}${$('#hidden-net').checked ? 'H:true;' : ''};`;
    }
    case 'email': { const s = $('#subj').value.trim(); return `mailto:${$('#em').value.trim()}${s ? '?subject=' + encodeURIComponent(s) : ''}`; }
    case 'tel': return `tel:${$('#tel').value.replace(/[^\d+]/g, '')}`;
    case 'wa': { const m = $('#wa-msg').value.trim(); return `https://wa.me/${$('#wa-num').value.replace(/\D/g, '')}${m ? '?text=' + encodeURIComponent(m) : ''}`; }
    case 'sms': return `SMSTO:${$('#sms-num').value.replace(/[^\d+]/g, '')}:${$('#sms-msg').value}`;
    case 'vcard': {
      const v = id => $('#vc-' + id).value.trim().replace(/([,;\\])/g, '\\$1');
      return ['BEGIN:VCARD', 'VERSION:3.0', `N:${v('last')};${v('first')};;;`, `FN:${[v('first'), v('last')].filter(Boolean).join(' ')}`,
        v('org') && `ORG:${v('org')}`, v('title') && `TITLE:${v('title')}`, v('tel') && `TEL;TYPE=CELL:${v('tel')}`, v('email') && `EMAIL:${v('email')}`,
        v('url') && `URL:${v('url')}`, v('adr') && `ADR:;;${v('adr')};;;;`, 'END:VCARD'].filter(Boolean).join('\n');
    }
  }
  return '';
}

let logo = null;
// Finder patterns (the three big squares) stay square in every style so phones can lock on.
const inFinder = (r, c, n) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
function draw(canvas, size) {
  const n = qr.getModuleCount(), quiet = 4, total = n + quiet * 2;
  const cell = size / total, round = $('#dots').value === 'round';
  canvas.width = size; canvas.height = size;
  const x = canvas.getContext('2d');
  x.fillStyle = $('#bg').value; x.fillRect(0, 0, size, size);
  x.fillStyle = $('#fg').value;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (!qr.isDark(r, c)) continue;
    const px = (c + quiet) * cell, py = (r + quiet) * cell;
    if (round && !inFinder(r, c, n)) { x.beginPath(); x.arc(px + cell / 2, py + cell / 2, cell * 0.46, 0, Math.PI * 2); x.fill(); }
    else x.fillRect(Math.floor(px), Math.floor(py), Math.ceil(cell), Math.ceil(cell));
  }
  if (logo) {
    const s = size * 0.22, p = s * 0.12;
    x.fillStyle = $('#bg').value; x.fillRect((size - s) / 2 - p, (size - s) / 2 - p, s + p * 2, s + p * 2);
    const k = Math.min(s / logo.naturalWidth, s / logo.naturalHeight), w = logo.naturalWidth * k, h = logo.naturalHeight * k;
    x.drawImage(logo, (size - w) / 2, (size - h) / 2, w, h);
  }
}

function svg() {
  const n = qr.getModuleCount(), q = 4, t = n + q * 2, round = $('#dots').value === 'round';
  let d = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (!qr.isDark(r, c)) continue;
    d += round && !inFinder(r, c, n) ? `M${c + q + 0.04} ${r + q + 0.5}a.46 .46 0 1 0 .92 0a.46 .46 0 1 0 -.92 0z` : `M${c + q} ${r + q}h1v1h-1z`;
  }
  let logoTag = '';
  if (logo) { const c = document.createElement('canvas'); c.width = logo.naturalWidth; c.height = logo.naturalHeight; c.getContext('2d').drawImage(logo, 0, 0); const s = t * 0.22, p = s * 0.12; logoTag = `<rect x="${(t - s) / 2 - p}" y="${(t - s) / 2 - p}" width="${s + 2 * p}" height="${s + 2 * p}" fill="${$('#bg').value}"/><image href="${c.toDataURL('image/png')}" x="${(t - s) / 2}" y="${(t - s) / 2}" width="${s}" height="${s}" preserveAspectRatio="xMidYMid meet"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${t} ${t}"${round ? '' : ' shape-rendering="crispEdges"'}><rect width="${t}" height="${t}" fill="${$('#bg').value}"/><path d="${d}" fill="${$('#fg').value}"/>${logoTag}</svg>`;
}

// Contrast check: scanners need a dark code on a light background.
const lum = hex => { const v = parseInt(hex.slice(1), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255].map(c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }).reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0); };

function render() {
  $$('[data-kind]').forEach(el => { el.hidden = el.dataset.kind !== kind(); });
  const data = payload();
  const info = $('#info');
  if (!data || data === 'https://') { info.textContent = 'Enter something to encode.'; return; }
  try {
    qr = qrcode(0, logo ? 'H' : $('#ecc').value); // a logo covers part of the code, so use the strongest error correction
    qr.addData(data, 'Byte');
    qr.make();
  } catch (e) { info.textContent = 'That’s too much text for one QR code. Shorten it, or lower the error correction.'; return; }
  draw($('#qr'), 640);
  const lf = lum($('#fg').value), lb = lum($('#bg').value);
  const ratio = (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05);
  info.innerHTML = lf > lb ? '<strong>Light code on a dark background:</strong> many phone cameras can’t read this. Swap the colours.'
    : ratio < 4 ? '<strong>Low contrast:</strong> use a darker code colour so every phone can scan it.'
    : `${qr.getModuleCount()} × ${qr.getModuleCount()} modules · works offline and never expires.${logo ? ' Test-scan it: logos can make codes harder to read.' : ''}`;
}

onAny('input:not(#logo), select, textarea', render);
$('#logo').addEventListener('change', async () => { const f = $('#logo').files[0]; logo = f ? await loadImage(f) : null; if (logo) $('#ecc').value = 'H'; render(); });
if (typeof PRESET !== 'undefined' && PRESET) { const r = $('#k-' + PRESET); if (r) r.checked = true; }
$('#dl-png').addEventListener('click', async () => { const c = document.createElement('canvas'); draw(c, +$('#px').value); download(await canvasBlob(c, 'image/png'), 'qr-code.png'); });
$('#dl-svg').addEventListener('click', () => download(new Blob([svg()], { type: 'image/svg+xml' }), 'qr-code.svg'));
render();
