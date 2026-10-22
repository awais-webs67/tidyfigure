const { PDFDocument, StandardFonts, rgb, degrees } = PDFLib;
let file = null, srcBytes = null, result = null, t = null;
const out = $('#out');
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);

async function make() {
  const pdf = await PDFDocument.load(srcBytes, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const text = $('#text').value.trim() || 'CONFIDENTIAL';
  const [r, g, b] = hex($('#color').value);
  const opacity = +$('#opacity').value / 100, layout = $('#layout').value;
  let size = +$('#size').value;
  for (const p of pdf.getPages()) {
    const { width, height } = p.getSize();
    const opts = { font, color: rgb(r, g, b), opacity };
    if (layout === 'footer') {
      const s = Math.min(size, 14), w = font.widthOfTextAtSize(text, s);
      p.drawText(text, { ...opts, size: s, x: (width - w) / 2, y: 18 });
      continue;
    }
    const ang = Math.atan2(height, width);
    if (layout === 'center') {
      // Shrink to fit along the page diagonal, then centre it.
      const diag = Math.hypot(width, height) * 0.8;
      const s = Math.min(size, size * diag / font.widthOfTextAtSize(text, size));
      const w = font.widthOfTextAtSize(text, s);
      const cx = width / 2 - (w / 2) * Math.cos(ang) + (s / 3) * Math.sin(ang);
      const cy = height / 2 - (w / 2) * Math.sin(ang) - (s / 3) * Math.cos(ang);
      p.drawText(text, { ...opts, size: s, x: cx, y: cy, rotate: degrees(ang * 180 / Math.PI) });
    } else {
      const s = Math.min(size, 48), w = font.widthOfTextAtSize(text, s);
      for (let y = -height; y < height * 1.5; y += s * 4) {
        for (let x = -width; x < width * 1.5; x += w + s * 2) p.drawText(text, { ...opts, size: s, x, y, rotate: degrees(30) });
      }
    }
  }
  return pdf.save();
}

async function preview() {
  if (!srcBytes) return;
  $('#ov').textContent = $('#opacity').value; $('#sv').textContent = $('#size').value;
  result = await make();
  const c = await renderPdfPage(await openPdf(result), 1, 0.6);
  out.innerHTML = `<p class="kicker">Preview of page 1</p><div class="stage"></div><button type="button" class="btn" id="dl">Download watermarked PDF</button>`;
  $('.stage', out).appendChild(c);
  $('#dl').onclick = () => download(new Blob([result], { type: 'application/pdf' }), `${baseName(file.name)}-watermarked.pdf`);
}

async function open(f) {
  if (!isPdf(f)) return;
  try {
    srcBytes = new Uint8Array(await f.arrayBuffer());
    await PDFDocument.load(srcBytes, { ignoreEncryption: true });
    file = f; $('#loaded').textContent = f.name; $('#go').disabled = false;
    preview();
  } catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged or password-protected.'; }
}
fileDrop($('#drop'), $('#file'), fs => open(fs[0]));
$('#sample').addEventListener('click', async () => open(await samplePdf(3)));
$('#presets').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) { $('#text').value = b.textContent; preview(); } });
onAny('#text, #layout, #color, #opacity, #size', () => { $('#ov').textContent = $('#opacity').value; $('#sv').textContent = $('#size').value; clearTimeout(t); t = setTimeout(preview, 250); });
$('#go').addEventListener('click', async () => { await preview(); download(new Blob([result], { type: 'application/pdf' }), `${baseName(file.name)}-watermarked.pdf`); });
