const { PDFDocument, StandardFonts, rgb } = PDFLib;
let docs = []; // { name, size, bytes, pages, error }
const out = $('#out');

fileDrop($('#drop'), $('#file'), async files => {
  for (const f of files.filter(f => f.type === 'application/pdf' || /\.pdf$/i.test(f.name))) {
    const entry = { name: f.name, size: f.size, bytes: new Uint8Array(await f.arrayBuffer()) };
    try { entry.pages = (await PDFDocument.load(entry.bytes, { ignoreEncryption: true })).getPageCount(); }
    catch (e) { entry.error = 'Can’t read this PDF (it may be damaged or password-protected).'; }
    docs.push(entry);
  }
  render();
});

$('#list').addEventListener('click', e => {
  const b = e.target.closest('button[data-act]');
  if (!b) return;
  const i = +b.dataset.i;
  if (b.dataset.act === 'up' && i > 0) [docs[i - 1], docs[i]] = [docs[i], docs[i - 1]];
  if (b.dataset.act === 'down' && i < docs.length - 1) [docs[i + 1], docs[i]] = [docs[i], docs[i + 1]];
  if (b.dataset.act === 'rm') docs.splice(i, 1);
  render();
});

function render() {
  $('#list').innerHTML = docs.map((d, i) => `<li><span class="tile" data-cat="pdf">${i + 1}</span><span class="meta"><b>${esc(d.name)}</b><small>${d.error ? esc(d.error) : `${d.pages} page${d.pages === 1 ? '' : 's'} · ${bytes(d.size)}`}</small></span>
    <span class="move"><button type="button" data-act="up" data-i="${i}" aria-label="Move up">↑</button><button type="button" data-act="down" data-i="${i}" aria-label="Move down">↓</button><button type="button" data-act="rm" data-i="${i}" aria-label="Remove">×</button></span></li>`).join('');
  const good = docs.filter(d => !d.error);
  $('#merge').disabled = good.length < 2;
  const pages = good.reduce((s, d) => s + d.pages, 0);
  out.innerHTML = `<p class="kicker">Merged PDF</p>${good.length >= 2
    ? `<p class="big"><mark>${pages} pages</mark></p><p class="sub">${good.length} files, in the order shown. Press “Merge PDFs” to create and download it.</p>`
    : '<p class="empty">Add at least two PDF files. Use the arrows to change their order.</p>'}`;
}

$('#merge').addEventListener('click', async () => {
  const btn = $('#merge');
  btn.disabled = true;
  try {
    const merged = await PDFDocument.create();
    for (const d of docs.filter(d => !d.error)) {
      const src = await PDFDocument.load(d.bytes, { ignoreEncryption: true });
      (await merged.copyPages(src, src.getPageIndices())).forEach(p => merged.addPage(p));
    }
    const bytesOut = await merged.save();
    const blob = new Blob([bytesOut], { type: 'application/pdf' });
    download(blob, 'merged.pdf');
    out.innerHTML = `<p class="kicker">Merged PDF</p><p class="big"><mark>Done</mark></p><p class="sub">${merged.getPageCount()} pages · ${bytes(blob.size)}. Your download should start automatically.</p><button type="button" class="btn" id="again">Download again</button>`;
    $('#again').onclick = () => download(blob, 'merged.pdf');
  } catch (e) {
    out.innerHTML = `<p class="kicker">Merged PDF</p><p class="empty">Something went wrong: ${esc(e.message)}</p>`;
  }
  btn.disabled = false;
});

// Two small generated PDFs so visitors can try merging straight away.
$('#sample').addEventListener('click', async () => {
  for (const [name, n] of [['sample-report.pdf', 2], ['sample-appendix.pdf', 1]]) {
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.HelveticaBold);
    for (let i = 1; i <= n; i++) {
      const page = pdf.addPage([595, 842]);
      page.drawText(`${baseName(name)} · page ${i}`, { x: 60, y: 760, size: 26, font, color: rgb(0.04, 0.5, 0.37) });
    }
    const b = await pdf.save();
    docs.push({ name, size: b.length, bytes: b, pages: n });
  }
  render();
});
