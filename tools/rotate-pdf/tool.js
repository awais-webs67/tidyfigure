const out = $('#out');
const pages = PdfPages($('#grid'), { ...{ rotate: true }, onChange: summary });

async function open(file) {
  if (!isPdf(file)) return;
  out.innerHTML = '<p class="empty">Reading pages…</p>';
  try {
    await pages.load(file);
    $('#loaded').textContent = `${file.name} · ${pages.pages.length} pages`;
    $('#bar').hidden = false;
  } catch (e) {
    out.innerHTML = '<p class="empty">That file can’t be opened. It may be damaged or password-protected.</p>';
  }
}

function summary() {
  const ps = pages.pages;
  const removed = ps.filter(p => p.del).length, rotated = ps.filter(p => p.rot && !p.del).length;
  const moved = ps.some((p, i) => p.n !== i + 1);
  const parts = [];
  if (rotated) parts.push(`${rotated} rotated`);
  if (removed) parts.push(`${removed} removed`);
  if (moved) parts.push('new order');
  out.innerHTML = `<p class="kicker">Result</p><p class="big"><mark>${ps.length - removed} page${ps.length - removed === 1 ? '' : 's'}</mark></p>
    <p class="sub">${parts.length ? parts.join(' · ') : 'No changes yet.'}</p>`;
  $('#save').disabled = removed === ps.length;
}

fileDrop($('#drop'), $('#file'), files => open(files[0]));
$('#sample').addEventListener('click', async () => open(await samplePdf(6)));
$('#reset').addEventListener('click', () => pages.reset());
if ($('#all-cw')) $('#all-cw').addEventListener('click', () => pages.rotateAll(90));
if ($('#all-ccw')) $('#all-ccw').addEventListener('click', () => pages.rotateAll(-90));
$('#save').addEventListener('click', async () => {
  $('#save').disabled = true;
  const pdfBytes = await pages.save();
  await showPdfResult(out, pdfBytes, { title: 'New PDF', name: `${baseName(pages.name)}-rotated.pdf`, label: 'Download rotated PDF', note: 'This is the new file. To change it, edit the pages above and press the button again.' });
  $('#save').disabled = false;
});
