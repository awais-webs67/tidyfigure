const out = $('#out');
// A faded placeholder code, so visitors see where their QR code will appear.
$('.qr-ghost').appendChild(HostedQR.canvas('https://example.com/preview', { fg: '#C9CED2' }));
$('#form').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = $('#go');
  btn.disabled = true; btn.lastChild.textContent = 'Creating…';
  try {
    const pub = await HostedQR.post({ action: 'create', type: 'link', target: $('#target').value, title: $('#title').value });
    HostedQR.showResult(out, pub, 'dynamic');
  } catch (err) {
    out.innerHTML = `<p class="kicker">Couldn’t create the code</p><span class="verdict no">Error</span><p class="sub">${esc(err.message)}</p>`;
  }
  btn.disabled = false; btn.lastChild.textContent = 'Create dynamic QR code';
});
