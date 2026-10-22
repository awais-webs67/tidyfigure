if (qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs['UTF-8']) qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
const lines = () => $('#list').value.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 500);
const slug = s => s.replace(/^https?:\/\//, '').replace(/[^\w-]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'qr';

function make(text, size) {
  const q = qrcode(0, 'M'); q.addData(text, 'Byte'); q.make();
  const n = q.getModuleCount(), label = $('#label').checked, lh = label ? size * 0.12 : 0;
  const cell = size / (n + 8), c = document.createElement('canvas');
  c.width = size; c.height = Math.round(size + lh);
  const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.fillStyle = $('#fg').value;
  for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) x.fillRect(Math.floor((k + 4) * cell), Math.floor((r + 4) * cell), Math.ceil(cell), Math.ceil(cell));
  if (label) {
    x.font = `500 ${Math.round(size * 0.045)}px Inter, Arial, sans-serif`; x.textAlign = 'center';
    let t = text; while (x.measureText(t).width > size * 0.9 && t.length > 4) t = t.slice(0, -2);
    x.fillText(t === text ? t : t + '…', size / 2, size + lh * 0.25);
  }
  return c;
}
function preview() {
  const ls = lines();
  $('#count').textContent = `${ls.length} QR code${ls.length === 1 ? '' : 's'}`;
  $('#grid').innerHTML = '';
  ls.slice(0, 60).forEach(t => {
    let c; try { c = make(t, 220); } catch (e) { return; }
    c.style.width = '100%'; c.style.height = 'auto'; c.style.border = '1px solid var(--line)'; c.style.borderRadius = '4px';
    $('#grid').append(c);
  });
  if (ls.length > 60) $('#grid').insertAdjacentHTML('beforeend', `<p class="note">…and ${ls.length - 60} more in the download.</p>`);
}
let t = null;
onAny('#list, #fg, #label', () => { clearTimeout(t); t = setTimeout(preview, 300); });
$('#zip').addEventListener('click', async () => {
  const zip = new JSZip(), size = +$('#px').value, used = {};
  for (const [i, text] of lines().entries()) {
    let name = $('#naming').value === 'num' ? `qr-${String(i + 1).padStart(3, '0')}` : slug(text);
    if (used[name]) name += `-${++used[name]}`; else used[name] = 1;
    zip.file(`${name}.png`, await canvasBlob(make(text, size), 'image/png'));
  }
  zip.file('list.csv', 'file,content\n' + lines().map((x, i) => `qr-${String(i + 1).padStart(3, '0')}.png,"${x.replace(/"/g, '""')}"`).join('\n'));
  download(await zip.generateAsync({ type: 'blob' }), 'qr-codes.zip');
});
preview();
