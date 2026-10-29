let { PDFDocument } = {};
onLibs(() => ({ PDFDocument } = PDFLib));
const SIZES = { a4: [595.28, 841.89], letter: [612, 792] }; // in PDF points (1/72 inch)
let imgs = []; // { file, url }
const out = $('#out');

const addFiles = files => {
  files.filter(f => f.type.startsWith('image/')).forEach(file => imgs.push({ file, url: URL.createObjectURL(file) }));
  render();
};
fileDrop($('#drop'), $('#file'), addFiles);
$('#sample').addEventListener('click', async () => addFiles([await sampleImage()]));

$('#list').addEventListener('click', e => {
  const b = e.target.closest('button[data-act]');
  if (!b) return;
  const i = +b.dataset.i;
  if (b.dataset.act === 'up' && i > 0) [imgs[i - 1], imgs[i]] = [imgs[i], imgs[i - 1]];
  if (b.dataset.act === 'down' && i < imgs.length - 1) [imgs[i + 1], imgs[i]] = [imgs[i], imgs[i + 1]];
  if (b.dataset.act === 'rm') imgs.splice(i, 1);
  render();
});

function render() {
  $('#list').innerHTML = imgs.map((m, i) => `<li><img src="${m.url}" alt=""><span class="meta"><b>${esc(m.file.name)}</b><small>Page ${i + 1} · ${bytes(m.file.size)}</small></span>
    <span class="move"><button type="button" data-act="up" data-i="${i}" aria-label="Move up">↑</button><button type="button" data-act="down" data-i="${i}" aria-label="Move down">↓</button><button type="button" data-act="rm" data-i="${i}" aria-label="Remove">×</button></span></li>`).join('');
  $('#make').disabled = !imgs.length;
  out.innerHTML = `<p class="kicker">Your PDF</p>${imgs.length
    ? `<p class="big"><mark>${imgs.length} page${imgs.length > 1 ? 's' : ''}</mark></p><p class="sub">Press “Create PDF” to build and download it.</p>`
    : '<p class="empty">Add images, put them in order, then press “Create PDF”.</p>'}`;
}

// pdf-lib embeds JPG and PNG directly; anything else is redrawn as a JPG first.
async function embed(pdf, file) {
  const buf = new Uint8Array(await file.arrayBuffer());
  if (file.type === 'image/jpeg') return pdf.embedJpg(buf);
  if (file.type === 'image/png') return pdf.embedPng(buf);
  const img = await loadImage(file);
  const c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0);
  return pdf.embedJpg(new Uint8Array(await (await canvasBlob(c, 'image/jpeg', 0.92)).arrayBuffer()));
}

$('#make').addEventListener('click', async () => {
  const btn = $('#make');
  btn.disabled = true;
  try {
    const pdf = await PDFDocument.create();
    const margin = +$('#margin').value, size = $('#size').value, orient = $('#orient').value;
    for (const m of imgs) {
      const im = await embed(pdf, m.file);
      let pw, ph;
      if (size === 'fit') { pw = im.width * 0.75 + margin * 2; ph = im.height * 0.75 + margin * 2; } // 96 dpi pixels → points
      else {
        [pw, ph] = SIZES[size];
        const land = orient === 'landscape' || (orient === 'auto' && im.width > im.height);
        if (land) [pw, ph] = [ph, pw];
      }
      const page = pdf.addPage([pw, ph]);
      const k = Math.min((pw - margin * 2) / im.width, (ph - margin * 2) / im.height);
      const w = im.width * k, h = im.height * k;
      page.drawImage(im, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
    }
    const blob = new Blob([await pdf.save()], { type: 'application/pdf' });
    const name = imgs.length === 1 ? `${baseName(imgs[0].file.name)}.pdf` : 'images.pdf';
    download(blob, name);
    out.innerHTML = `<p class="kicker">Your PDF</p><p class="big"><mark>Done</mark></p><p class="sub">${imgs.length} page${imgs.length > 1 ? 's' : ''} · ${bytes(blob.size)}. Your download should start automatically.</p><button type="button" class="btn" id="again">Download again</button>`;
    $('#again').onclick = () => download(blob, name);
  } catch (e) {
    out.innerHTML = `<p class="kicker">Your PDF</p><p class="empty">Something went wrong: ${esc(e.message)}</p>`;
  }
  btn.disabled = false;
});
