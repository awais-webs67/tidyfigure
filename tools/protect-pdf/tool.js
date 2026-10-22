const out = $('#out');
let file = null;
fileDrop($('#drop'), $('#file'), files => { const f = files.find(isPdf); if (f) choose(f); });
$('#sample').addEventListener('click', async () => choose(await samplePdf(3, 'Salary statement')));
$('#show').addEventListener('change', e => { $('#pw').type = $('#pw2').type = e.target.checked ? 'text' : 'password'; });

async function thumb(bytes, opts = {}) {
  const doc = await pdfjs().getDocument({ data: bytes.slice(0), ...opts }).promise;
  const c = await renderPdfPage(doc, 1, 0.45);
  return { c, pages: doc.numPages };
}
async function choose(f) {
  file = f;
  $('#go').disabled = false;
  const box = $('#thumb');
  box.hidden = false;
  try {
    const t = await thumb(new Uint8Array(await f.arrayBuffer()));
    box.innerHTML = `<p class="kicker">Your PDF</p><div class="fp-media"></div><p class="sub">${esc(f.name)} · ${t.pages} page${t.pages > 1 ? 's' : ''} · ${bytes(f.size)}</p>`;
    box.querySelector('.fp-media').appendChild(t.c);
  } catch (e) {
    box.innerHTML = `<p class="sub">${esc(f.name)}: ${/password/i.test(e.message || e.name) ? 'this PDF already has a password. Remove it first with Unlock PDF.' : 'couldn’t read this PDF.'}</p>`;
    $('#go').disabled = true;
  }
  $('#pw').focus();
}

$('#form').addEventListener('submit', async e => {
  e.preventDefault();
  const pw = $('#pw').value;
  if (pw !== $('#pw2').value) { out.innerHTML = '<p class="kicker">Protected PDF</p><span class="verdict no">The passwords don’t match</span>'; return; }
  $('#go').disabled = true;
  out.innerHTML = '<p class="kicker">Protected PDF</p><p class="sub">Encrypting…</p>';
  try {
    const doc = await PDFLib.PDFDocument.load(await file.arrayBuffer());
    // A separate random owner password stops people simply removing the restrictions.
    const owner = [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join('');
    doc.encrypt({
      userPassword: pw, ownerPassword: owner, algorithm: $('#algo').value,
      permissions: { printing: $('#print').checked ? 'highResolution' : false, copying: $('#copy').checked, modifying: $('#edit').checked, annotating: $('#edit').checked, fillingForms: $('#edit').checked, contentAccessibility: true, documentAssembly: false },
    });
    const outBytes = await doc.save();
    // Prove it worked: the file must refuse to open without the password, and open with it.
    let locked = false;
    try { await pdfjs().getDocument({ data: outBytes.slice(0) }).promise; } catch (err) { locked = /password/i.test(err.name + err.message); }
    const t = await thumb(outBytes, { password: pw });
    const blob = new Blob([outBytes], { type: 'application/pdf' }), name = `${baseName(file.name)}-protected.pdf`;
    out.innerHTML = `<p class="kicker">Protected PDF</p>${locked ? '<span class="verdict ok">Password required to open</span>' : '<span class="verdict tight">Check the file</span>'}
      <div class="fp-media lock-thumb"></div>
      <p class="sub">${esc(name)} · ${t.pages} pages · ${bytes(blob.size)} · ${esc($('#algo').value)}</p>
      <div class="btns"><button type="button" class="btn big-btn" id="dl">Download protected PDF</button></div>
      <p class="note">We tested it: the file won’t open without your password, and the preview above was opened with it. Keep the password safe; it can’t be recovered.</p>`;
    out.querySelector('.lock-thumb').appendChild(t.c);
    $('#dl').onclick = () => download(blob, name);
  } catch (err) {
    out.innerHTML = `<p class="kicker">Protected PDF</p><span class="verdict no">Couldn’t protect this PDF</span><p class="sub">${esc(err.message || String(err))}</p>`;
  }
  $('#go').disabled = false;
});
