let { PDFDocument, StandardFonts, rgb, degrees } = {};
onLibs(() => ({ PDFDocument, StandardFonts, rgb, degrees } = PDFLib));
let file = null, srcBytes = null, result = null, t = null;
const out = $('#out');
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);

// The built-in PDF font only has Western letters. Other text (Urdu, Arabic, Hindi, Chinese, emoji…) is drawn
// by the browser, which joins letters correctly, and placed as a picture. Sizes are per 1 pt of font size.
function textPicture(text, color) {
  const px = 160, c = document.createElement('canvas'), x = c.getContext('2d');
  const font = `bold ${px}px Inter, "Noto Sans", Arial, sans-serif`;
  x.font = font;
  const m = x.measureText(text), pad = 6;
  const asc = Math.ceil(m.actualBoundingBoxAscent || px * 0.8), desc = Math.ceil(m.actualBoundingBoxDescent || px * 0.25);
  c.width = Math.ceil(m.width) + pad * 2; c.height = asc + desc + pad * 2;
  x.font = font; x.fillStyle = color; x.fillText(text, pad, asc + pad);
  return { c, w: c.width / px, h: c.height / px, below: (desc + pad) / px };
}

async function make() {
  const pdf = await PDFDocument.load(srcBytes, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const text = $('#text').value.trim() || 'CONFIDENTIAL';
  const [r, g, b] = hex($('#color').value);
  const opacity = +$('#opacity').value / 100, layout = $('#layout').value;
  const size = +$('#size').value;
  let pic = null, img = null;
  try { font.encodeText(text); } catch (e) { pic = textPicture(text, $('#color').value); img = await pdf.embedPng(pic.c.toDataURL('image/png')); }
  const widthAt = s => (pic ? pic.w * s : font.widthOfTextAtSize(text, s));
  // Write the text with its baseline starting at (x, y), turned by deg, on the page as it's shown.
  const put = (p, v, x, y, s, deg) => {
    if (!pic) { const [px, py] = v.at(x, y); p.drawText(text, { font, size: s, x: px, y: py, color: rgb(r, g, b), opacity, rotate: degrees(deg + v.angle) }); return; }
    const a = deg * Math.PI / 180, d = pic.below * s; // the picture's bottom edge sits below the baseline
    const [px, py] = v.at(x + d * Math.sin(a), y - d * Math.cos(a));
    p.drawImage(img, { x: px, y: py, width: pic.w * s, height: pic.h * s, opacity, rotate: degrees(deg + v.angle) });
  };
  for (const p of pdf.getPages()) {
    const v = pageView(p), width = v.w, height = v.h; // the page as shown, even if it's stored rotated
    if (layout === 'footer') {
      const s = Math.min(size, 14), w = widthAt(s);
      put(p, v, (width - w) / 2, 18, s, 0);
      continue;
    }
    const ang = Math.atan2(height, width);
    if (layout === 'center') {
      // Shrink to fit along the page diagonal, then centre it.
      const diag = Math.hypot(width, height) * 0.8;
      const s = Math.min(size, size * diag / widthAt(size));
      const w = widthAt(s);
      const cx = width / 2 - (w / 2) * Math.cos(ang) + (s / 3) * Math.sin(ang);
      const cy = height / 2 - (w / 2) * Math.sin(ang) - (s / 3) * Math.cos(ang);
      put(p, v, cx, cy, s, ang * 180 / Math.PI);
    } else {
      const s = Math.min(size, 48), w = widthAt(s);
      for (let y = -height; y < height * 1.5; y += s * 4) {
        for (let x = -width; x < width * 1.5; x += w + s * 2) put(p, v, x, y, s, 30);
      }
    }
  }
  return pdf.save();
}

async function preview() {
  if (!srcBytes) return;
  $('#ov').textContent = $('#opacity').value; $('#sv').textContent = $('#size').value;
  try { result = await make(); } catch (e) { result = null; out.innerHTML = `<p class="kicker">Preview</p><span class="verdict no">Couldn’t add the watermark</span><p class="sub">${esc(e.message || String(e))}</p>`; return; }
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
$('#go').addEventListener('click', async () => { await preview(); if (result) download(new Blob([result], { type: 'application/pdf' }), `${baseName(file.name)}-watermarked.pdf`); });
