const out = $('#out'), prev = $('#preview');
let file = null;
$('.qr-ghost').appendChild(HostedQR.canvas('https://example.com/file', { fg: '#C9CED2' }));
fileDrop($('#drop'), $('#file'), files => choose(files[0]));
$('#sample').addEventListener('click', async () => choose(await samplePdf(2, 'Lunch menu')));

async function choose(f) {
  if (!f) return;
  file = f;
  $('#go').disabled = false;
  if (!$('#title').value) $('#title').value = baseName(f.name).replace(/[-_]+/g, ' ');
  prev.hidden = false;
  prev.innerHTML = `<p class="kicker">Your file</p><div class="fp-media"></div><p class="sub">${esc(f.name)} · ${bytes(f.size)}</p>`;
  const media = prev.querySelector('.fp-media'), url = URL.createObjectURL(f);
  if (f.type.startsWith('image/')) media.innerHTML = `<img src="${url}" alt="">`;
  else if (f.type === 'audio/mpeg') media.innerHTML = `<audio class="player" controls src="${url}"></audio>`;
  else if (f.type === 'video/mp4') media.innerHTML = `<video class="player" controls playsinline src="${url}"></video>`;
  else if (isPdf(f)) {
    try {
      const doc = await openPdf(new Uint8Array(await f.arrayBuffer()));
      const c = await renderPdfPage(doc, 1, 0.6);
      media.appendChild(c);
      prev.querySelector('.sub').textContent += ` · ${doc.numPages} page${doc.numPages > 1 ? 's' : ''}`;
    } catch (e) { media.innerHTML = '<p class="note">Preview not available for this PDF.</p>'; }
  }
}

$('#form').addEventListener('submit', async e => {
  e.preventDefault();
  if (!file) return;
  const btn = $('#go');
  btn.disabled = true; btn.lastChild.textContent = 'Uploading…';
  try {
    const pub = await HostedQR.post({ action: 'create', type: 'file', title: $('#title').value }, file);
    HostedQR.showResult(out, pub, 'file');
  } catch (err) {
    out.innerHTML = `<p class="kicker">Couldn’t create the code</p><span class="verdict no">Error</span><p class="sub">${esc(err.message)}</p>`;
  }
  btn.disabled = false; btn.lastChild.textContent = 'Upload and create QR code';
});
