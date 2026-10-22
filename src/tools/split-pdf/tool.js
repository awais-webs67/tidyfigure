const { PDFDocument, StandardFonts, rgb } = PDFLib;
let src = null, srcName = '', srcBytes = null;
const out = $('#out');

fileDrop($('#drop'), $('#file'), async files => {
  const f = files.find(f => f.type === 'application/pdf' || /\.pdf$/i.test(f.name));
  if (!f) return;
  await open(new Uint8Array(await f.arrayBuffer()), f.name);
});
onAny('#range, #chunk, input[name="mode"]', render);

async function open(bytesIn, name) {
  try {
    src = await PDFDocument.load(bytesIn, { ignoreEncryption: true });
    srcBytes = bytesIn; srcName = name;
    $('#loaded').textContent = `${name} · ${src.getPageCount()} pages`;
  } catch (e) {
    src = null;
    $('#loaded').textContent = 'That file can’t be read. It may be damaged or password-protected.';
  }
  render();
}

// "1-3, 5, 8-" → [0,1,2,4,7,…] (zero-based, in the order typed, no duplicates)
function parseRange(text, n) {
  const pages = [];
  for (const part of text.split(',').map(s => s.trim()).filter(Boolean)) {
    const m = part.match(/^(\d*)\s*[-–]\s*(\d*)$/);
    let a, b;
    if (m) { a = m[1] ? +m[1] : 1; b = m[2] ? +m[2] : n; } else if (/^\d+$/.test(part)) { a = b = +part; } else return { error: `“${part}” isn’t a page number or range.` };
    if (a < 1 || b > n || a > b) return { error: `“${part}” is outside pages 1–${n}.` };
    for (let p = a; p <= b; p++) if (!pages.includes(p - 1)) pages.push(p - 1);
  }
  return pages.length ? { pages } : { error: 'Enter at least one page.' };
}

function groups() {
  const n = src.getPageCount();
  const mode = $('input[name="mode"]:checked').value;
  if (mode === 'range') { const r = parseRange($('#range').value, n); return r.error ? r : { files: [r.pages] }; }
  const size = mode === 'every' ? 1 : Math.max(1, Math.round(val($('#chunk')) || 1));
  const files = [];
  for (let i = 0; i < n; i += size) files.push([...Array(Math.min(size, n - i)).keys()].map(k => i + k));
  return { files };
}

function render() {
  const mode = $('input[name="mode"]:checked').value;
  $('#range-wrap').hidden = mode !== 'range';
  $('#chunk-wrap').hidden = mode !== 'chunk';
  if (!src) { $('#go').disabled = true; out.innerHTML = '<p class="kicker">Result</p><p class="empty">Choose a PDF to see its pages.</p>'; return; }
  const g = groups();
  $('#go').disabled = !!g.error;
  if (g.error) { out.innerHTML = `<p class="kicker">Result</p><p class="empty">${esc(g.error)}</p>`; return; }
  const label = pages => {
    const ns = pages.map(p => p + 1), parts = [];
    for (let i = 0; i < ns.length;) {
      let j = i;
      while (j + 1 < ns.length && ns[j + 1] === ns[j] + 1) j++;
      parts.push(i === j ? `${ns[i]}` : `${ns[i]}–${ns[j]}`);
      i = j + 1;
    }
    return `${ns.length === 1 ? 'page' : 'pages'} ${parts.join(', ')}`;
  };
  out.innerHTML = `<p class="kicker">Result</p><p class="big"><mark>${g.files.length} file${g.files.length > 1 ? 's' : ''}</mark></p>
    <p class="sub">${g.files.length > 1 ? 'Downloaded together as a .zip file.' : 'Downloaded as one PDF.'}</p>
    <ul class="files">${g.files.slice(0, 8).map((pg, i) => `<li><span class="tile" data-cat="pdf">${i + 1}</span><span class="meta"><b>${esc(baseName(srcName))}-${g.files.length > 1 ? i + 1 : 'extract'}.pdf</b><small>${label(pg)}</small></span></li>`).join('')}</ul>
    ${g.files.length > 8 ? `<p class="note">…and ${g.files.length - 8} more.</p>` : ''}`;
}

$('#go').addEventListener('click', async () => {
  const g = groups();
  if (g.error) return;
  $('#go').disabled = true;
  const base = baseName(srcName);
  const make = async pages => { const d = await PDFDocument.create(); (await d.copyPages(src, pages)).forEach(p => d.addPage(p)); return d.save(); };
  if (g.files.length === 1) {
    download(new Blob([await make(g.files[0])], { type: 'application/pdf' }), `${base}-extract.pdf`);
  } else {
    const zip = new JSZip();
    for (let i = 0; i < g.files.length; i++) zip.file(`${base}-${i + 1}.pdf`, await make(g.files[i]));
    download(await zip.generateAsync({ type: 'blob' }), `${base}-split.zip`);
  }
  $('#go').disabled = false;
});

$('#sample').addEventListener('click', async () => {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  for (let i = 1; i <= 6; i++) pdf.addPage([595, 842]).drawText(`Sample document · page ${i}`, { x: 60, y: 760, size: 26, font, color: rgb(0.82, 0.21, 0.23) });
  await open(await pdf.save(), 'sample-document.pdf');
});
