let file = null, doc = null, results = [];
const out = $('#out');
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

async function open(f) {
  if (!isPdf(f)) return;
  try {
    doc = await openPdf(new Uint8Array(await f.arrayBuffer()));
    file = f;
    $('#loaded').textContent = `${f.name} · ${doc.numPages} page${doc.numPages > 1 ? 's' : ''}`;
    $('#go').disabled = false;
    out.innerHTML = `<p class="kicker">Images</p><p class="empty">${doc.numPages} page${doc.numPages > 1 ? 's' : ''} ready. Press Convert.</p>`;
  } catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged or password-protected.'; }
}

function pagesWanted(n) {
  const t = $('#range').value.trim();
  if (!t) return [...Array(n).keys()].map(i => i + 1);
  const set = [];
  for (const part of t.split(',')) {
    const m = part.trim().match(/^(\d*)\s*[-–]?\s*(\d*)$/);
    if (!m) continue;
    const a = +m[1] || 1, b = part.includes('-') || part.includes('–') ? (+m[2] || n) : a;
    for (let p = Math.max(1, a); p <= Math.min(n, b); p++) if (!set.includes(p)) set.push(p);
  }
  return set;
}

fileDrop($('#drop'), $('#file'), fs => open(fs[0]));
$('#sample').addEventListener('click', async () => open(await samplePdf(3)));
$('#go').addEventListener('click', async () => {
  const type = $('#fmt').value, scale = +$('#dpi').value / 72;
  const list = pagesWanted(doc.numPages);
  if (!list.length) { out.innerHTML = '<p class="empty">No pages match that range.</p>'; return; }
  $('#go').disabled = true;
  results = list.map(n => ({ name: `${baseName(file.name)}-page-${n}.${EXT[type]}`, n, before: 0 }));
  const render = () => {
    out.innerHTML = `<p class="kicker">Images</p><p class="big"><mark>${results.filter(r => r.blob).length} of ${results.length}</mark></p>
      <ul class="files">${results.map((r, i) => `<li>${r.thumb ? `<img src="${r.thumb}" alt="">` : ''}<span class="meta"><b>${esc(r.name)}</b><small>${r.blob ? `${r.w}×${r.h} · ${bytes(r.blob.size)}` : 'Working…'}</small></span>${r.blob ? `<button type="button" class="btn ghost" data-i="${i}">Download</button>` : ''}</li>`).join('')}</ul>
      ${results.length > 1 && results.every(r => r.blob) ? '<div class="copyrow"><button type="button" class="btn" id="zip">Download all (.zip)</button></div>' : ''}`;
  };
  render();
  for (const r of results) {
    const c = await renderPdfPage(doc, r.n, scale);
    r.blob = await canvasBlob(c, type, 0.9);
    r.w = c.width; r.h = c.height;
    const t = document.createElement('canvas'); t.width = 104; t.height = Math.round(104 * c.height / c.width);
    t.getContext('2d').drawImage(c, 0, 0, t.width, t.height);
    r.thumb = t.toDataURL('image/jpeg', 0.7);
    render();
  }
  $('#go').disabled = false;
});
out.addEventListener('click', async e => {
  const b = e.target.closest('button[data-i]');
  if (b) { const r = results[+b.dataset.i]; download(r.blob, r.name); return; }
  if (e.target.id === 'zip') {
    const zip = new JSZip();
    results.forEach(r => zip.file(r.name, r.blob));
    download(await zip.generateAsync({ type: 'blob' }), `${baseName(file.name)}-images.zip`);
  }
});
