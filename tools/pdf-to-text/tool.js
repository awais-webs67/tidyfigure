let file = null, pagesText = [];
const out = $('#out');

async function pageText(page) {
  const tc = await page.getTextContent();
  let s = '', lastY = null;
  for (const it of tc.items) {
    const y = it.transform ? it.transform[5] : null;
    if (lastY !== null && y !== null && Math.abs(y - lastY) > 2 && !s.endsWith('\n')) s += '\n';
    s += it.str;
    if (it.hasEOL) s += '\n';
    lastY = y;
  }
  return s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function render() {
  const marks = $('#markers').checked;
  const text = pagesText.map((t, i) => (marks ? `--- Page ${i + 1} ---\n` : '') + t).join('\n\n');
  const words = (text.match(/[\p{L}\p{N}]+/gu) || []).length;
  const empty = pagesText.filter(t => !t.trim()).length;
  out.innerHTML = `<p class="kicker">Text from ${pagesText.length} page${pagesText.length > 1 ? 's' : ''}</p>
    <p class="sub">${words.toLocaleString()} words${empty ? ` · ${empty} page${empty > 1 ? 's' : ''} had no text (probably scanned images)` : ''}</p>
    <div class="copybox" id="result" style="font-family:var(--f-body);font-size:15px">${esc(text) || '<span class="empty">No text found. This PDF is probably a scan; text in images can’t be extracted without OCR.</span>'}</div>
    <div class="copyrow"><button type="button" class="btn ghost" id="dl">Download .txt</button><button type="button" class="btn" data-copy="result">Copy</button></div>`;
  $('#dl').onclick = () => download(new Blob([text], { type: 'text/plain;charset=utf-8' }), `${baseName(file.name)}.txt`);
}

async function open(f) {
  if (!isPdf(f)) return;
  try {
    const doc = await openPdf(new Uint8Array(await f.arrayBuffer()));
    file = f; pagesText = [];
    $('#loaded').textContent = `${f.name} · ${doc.numPages} pages`;
    for (let n = 1; n <= doc.numPages; n++) {
      out.innerHTML = `<p class="kicker">Text</p><p class="big"><mark>Reading page ${n} of ${doc.numPages}</mark></p>`;
      pagesText.push(await pageText(await doc.getPage(n)));
    }
    render();
  } catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged or password-protected.'; }
}
fileDrop($('#drop'), $('#file'), fs => open(fs[0]));
$('#sample').addEventListener('click', async () => open(await samplePdf(2)));
$('#markers').addEventListener('change', () => { if (pagesText.length) render(); });
