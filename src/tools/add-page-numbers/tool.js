const { PDFDocument, StandardFonts, rgb } = PDFLib;
let file = null, srcBytes = null, result = null;
const out = $('#out');

function label(i, total) {
  const n = i + (+$('#start').value || 0), last = total - 1 + (+$('#start').value || 0);
  return { n: `${n}`, page: `Page ${n}`, of: `Page ${n} of ${last}`, slash: `${n} / ${last}`, dash: `- ${n} -` }[$('#fmt').value];
}

async function make() {
  const pdf = await PDFDocument.load(srcBytes, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const size = Math.min(40, Math.max(6, +$('#size').value || 11)), pos = $('#pos').value, skip = $('#skip').checked;
  const pages = pdf.getPages();
  const numbered = skip ? pages.slice(1) : pages;
  numbered.forEach((p, i) => {
    const { width, height } = p.getSize();
    const text = label(i, numbered.length + 0);
    const w = font.widthOfTextAtSize(text, size), m = 28;
    const x = pos[1] === 'c' ? (width - w) / 2 : pos[1] === 'r' ? width - m - w : m;
    const y = pos[0] === 'b' ? m - size / 3 + 4 : height - m - size + 4;
    p.drawText(text, { x, y, size, font, color: rgb(0.2, 0.2, 0.2) });
  });
  return pdf.save();
}

async function preview() {
  if (!srcBytes) return;
  result = await make();
  const d = await openPdf(result);
  const c = await renderPdfPage(d, Math.min(2, d.numPages), 0.6);
  out.innerHTML = `<p class="kicker">Preview of page ${Math.min(2, d.numPages)}</p><div class="stage"></div>
    <button type="button" class="btn" id="dl">Download numbered PDF</button>`;
  $('.stage', out).appendChild(c);
  $('#dl').onclick = () => download(new Blob([result], { type: 'application/pdf' }), `${baseName(file.name)}-numbered.pdf`);
}

async function open(f) {
  if (!isPdf(f)) return;
  try {
    srcBytes = new Uint8Array(await f.arrayBuffer());
    await PDFDocument.load(srcBytes, { ignoreEncryption: true });
    file = f;
    $('#loaded').textContent = f.name;
    $('#go').disabled = false;
    preview();
  } catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged or password-protected.'; }
}
fileDrop($('#drop'), $('#file'), fs => open(fs[0]));
$('#sample').addEventListener('click', async () => open(await samplePdf(4)));
let t = null;
onAny('#pos, #fmt, #start, #size, #skip', () => { clearTimeout(t); t = setTimeout(preview, 250); });
$('#go').addEventListener('click', async () => { await preview(); download(new Blob([result], { type: 'application/pdf' }), `${baseName(file.name)}-numbered.pdf`); });
