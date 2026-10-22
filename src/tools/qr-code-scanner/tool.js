const FORMATS = (typeof PRESET !== 'undefined' && PRESET) || 'qr'; // the barcode reader page sets PRESET = 'all'
const out = $('#out');
const sc = Scanner({
  video: $('#video'), formats: FORMATS,
  onResult: (t, f) => { out.innerHTML = describeScan(t, f); },
  onError: m => { out.innerHTML = `<p class="kicker">Result</p><p class="empty">${esc(m)}</p>`; },
});
$('#cam').addEventListener('click', async () => {
  if (sc.running) { sc.stop(); $('#video').hidden = true; $('#cam-msg').hidden = false; $('#cam span').textContent = 'Scan with camera'; return; }
  try {
    $('#video').hidden = false; $('#cam-msg').hidden = true; $('#cam span').textContent = 'Stop camera';
    await sc.start();
  } catch (e) {
    $('#video').hidden = true; $('#cam-msg').hidden = false; $('#cam span').textContent = 'Scan with camera';
    $('#cam-msg').textContent = e.name === 'NotAllowedError' ? 'Camera permission was refused. Allow it in your browser settings, or upload a photo of the code.' : (e.message || 'The camera couldn’t start. Upload a photo instead.');
  }
});
$('#file').addEventListener('change', () => { const f = $('#file').files[0]; if (f) sc.file(f); $('#file').value = ''; });
$('#sample').addEventListener('click', async () => {
  const c = document.createElement('canvas');
  if (FORMATS === 'all') {
    JsBarcode(c, '5012345678900', { format: 'EAN13', width: 3, height: 120, background: '#ffffff' });
  } else {
    const q = qrcode(0, 'M'); q.addData('https://tidyfigure.com/qr-code-scanner', 'Byte'); q.make();
    const n = q.getModuleCount(), s = 10; c.width = c.height = (n + 8) * s;
    const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.fillStyle = '#000';
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) x.fillRect((k + 4) * s, (r + 4) * s, s, s);
  }
  sc.file(new File([await canvasBlob(c, 'image/png')], 'sample.png', { type: 'image/png' }));
});
