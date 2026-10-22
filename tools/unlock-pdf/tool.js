const out = $('#out');
let file = null, needsPw = false;
fileDrop($('#drop'), $('#file'), files => { const f = files.find(isPdf); if (f) choose(f); });
$('#show').addEventListener('change', e => { $('#pw').type = e.target.checked ? 'text' : 'password'; });
$('#sample').addEventListener('click', async () => {
  const s = await PDFLib.PDFDocument.load(await (await samplePdf(3, 'Bank statement')).arrayBuffer());
  s.encrypt({ userPassword: 'sample123', ownerPassword: 'owner-' + Date.now(), permissions: { printing: false, copying: false, modifying: false } });
  choose(new File([await s.save()], 'locked-statement.pdf', { type: 'application/pdf' }));
});

const reset = () => { out.innerHTML = '<p class="kicker">Unlocked PDF</p><p class="empty">Enter the password and press Unlock PDF.</p>'; };
async function choose(f) {
  file = f;
  const info = $('#info');
  info.hidden = false;
  let enc = false;
  try { enc = (await PDFLib.PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true, updateMetadata: false })).isEncrypted; }
  catch (e) { info.innerHTML = `<p class="sub">${esc(f.name)}: couldn’t read this file as a PDF.</p>`; $('#go').disabled = true; return; }
  // A PDF can open without a password but still block printing or copying (owner password only).
  let opens = false;
  try { await pdfjs().getDocument({ data: new Uint8Array(await f.arrayBuffer()) }).promise; opens = true; } catch (e) { /* needs a password */ }
  needsPw = enc && !opens;
  $('#pwrow').hidden = !needsPw;
  info.innerHTML = `<p class="kicker">Your PDF</p><p><strong>${esc(f.name)}</strong> · ${bytes(f.size)}</p>
    <span class="verdict ${enc ? 'tight' : 'ok'}">${!enc ? 'No password or restrictions' : needsPw ? 'Password needed to open' : 'Opens freely, but has print or copy restrictions'}</span>`;
  $('#go').disabled = !enc;
  reset();
  if (needsPw) $('#pw').focus();
  else if (enc) out.querySelector('.empty').textContent = 'No password is needed. Press Unlock PDF to remove the restrictions.';
  else out.querySelector('.empty').textContent = 'This PDF isn’t protected, so there’s nothing to remove.';
}

$('#form').addEventListener('submit', async e => {
  e.preventDefault();
  $('#go').disabled = true;
  out.innerHTML = '<p class="kicker">Unlocked PDF</p><p class="sub">Unlocking…</p>';
  try {
    let doc;
    try { doc = await PDFLib.PDFDocument.load(await file.arrayBuffer(), { password: needsPw ? $('#pw').value : '' }); }
    catch (err) {
      if (/password/i.test(err.message)) { out.innerHTML = '<p class="kicker">Unlocked PDF</p><span class="verdict no">Wrong password</span><p class="sub">Check capital letters and try again.</p>'; $('#pw').select(); $('#go').disabled = false; return; }
      throw err;
    }
    const outBytes = await doc.save();
    const pv = await pdfjs().getDocument({ data: outBytes.slice(0) }).promise;
    const blob = new Blob([outBytes], { type: 'application/pdf' }), name = `${baseName(file.name)}-unlocked.pdf`;
    out.innerHTML = `<p class="kicker">Unlocked PDF</p><span class="verdict ok">Password and restrictions removed</span>
      <div class="pdf-thumbs" id="pages"></div>
      <p class="sub">${esc(name)} · ${pv.numPages} page${pv.numPages > 1 ? 's' : ''} · ${bytes(blob.size)}</p>
      <div class="btns"><button type="button" class="btn big-btn" id="dl">Download unlocked PDF</button></div>
      <p class="note">The preview above is the new file. It opens without a password and can be printed, copied and edited.</p>`;
    $('#dl').onclick = () => download(blob, name);
    for (let i = 1; i <= Math.min(pv.numPages, 6); i++) $('#pages').appendChild(await renderPdfPage(pv, i, 0.3));
  } catch (err) {
    out.innerHTML = `<p class="kicker">Unlocked PDF</p><span class="verdict no">Couldn’t unlock this PDF</span><p class="sub">${esc(err.message || String(err))}</p>`;
  }
  $('#go').disabled = false;
});
