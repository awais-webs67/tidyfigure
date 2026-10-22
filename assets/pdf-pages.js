'use strict';
// Page thumbnail grid for PDF tools: rotate, delete and reorder pages, then save with pdf-lib.
// Usage: const pages = PdfPages($('#grid'), { rotate: true, remove: true, reorder: true, onChange });
//        await pages.load(file); const bytes = await pages.save();

function PdfPages(grid, opts = {}) {
  let src = null, pages = [], name = '', dragFrom = null;
  const btn = (act, label, text) => `<button type="button" data-act="${act}" aria-label="${label}" title="${label}">${text}</button>`;

  function render() {
    grid.innerHTML = pages.map((p, i) => `<li class="pg${p.del ? ' del' : ''}" data-i="${i}"${opts.reorder ? ' draggable="true"' : ''}>
      <div class="pg-img">${p.thumb ? `<img src="${p.thumb}" alt="Page ${p.n}" style="transform:rotate(${p.rot}deg)">` : '<span class="note">…</span>'}</div>
      <span class="pg-label">${p.del ? 'Removed' : `Page ${p.n}${p.rot ? ` · ${p.rot}°` : ''}`}</span>
      <div class="pg-act">
        ${opts.reorder ? btn('left', 'Move earlier', '←') : ''}
        ${opts.rotate ? btn('ccw', 'Rotate left', '⟲') + btn('cw', 'Rotate right', '⟳') : ''}
        ${opts.remove ? btn('del', p.del ? 'Keep this page' : 'Remove this page', p.del ? '↺' : '✕') : ''}
        ${opts.reorder ? btn('right', 'Move later', '→') : ''}
      </div></li>`).join('');
    if (opts.onChange) opts.onChange(api);
  }

  grid.addEventListener('click', e => {
    const b = e.target.closest('button[data-act]');
    const li = e.target.closest('li[data-i]');
    if (!li) return;
    const i = +li.dataset.i, p = pages[i];
    const act = b ? b.dataset.act : (opts.clickAction || '');
    if (act === 'cw') p.rot = (p.rot + 90) % 360;
    else if (act === 'ccw') p.rot = (p.rot + 270) % 360;
    else if (act === 'del') p.del = !p.del;
    else if (act === 'left' && i > 0) [pages[i - 1], pages[i]] = [pages[i], pages[i - 1]];
    else if (act === 'right' && i < pages.length - 1) [pages[i + 1], pages[i]] = [pages[i], pages[i + 1]];
    else return;
    render();
  });
  grid.addEventListener('dragstart', e => { const li = e.target.closest('li[data-i]'); if (li) dragFrom = +li.dataset.i; });
  grid.addEventListener('dragover', e => { if (dragFrom !== null) e.preventDefault(); });
  grid.addEventListener('drop', e => {
    const li = e.target.closest('li[data-i]');
    if (!li || dragFrom === null) return;
    e.preventDefault();
    const [moved] = pages.splice(dragFrom, 1);
    pages.splice(+li.dataset.i, 0, moved);
    dragFrom = null;
    render();
  });

  const api = {
    get pages() { return pages; },
    get name() { return name; },
    get bytes() { return src; },
    async load(file) {
      src = new Uint8Array(await file.arrayBuffer());
      name = file.name;
      const doc = await openPdf(src);
      pages = Array.from({ length: doc.numPages }, (_, k) => ({ n: k + 1, rot: 0, del: false, thumb: null }));
      render();
      for (const p of pages) {
        const c = await renderPdfPage(doc, p.n, 0.35);
        p.thumb = c.toDataURL('image/jpeg', 0.8);
        render();
      }
      return doc;
    },
    reset() { pages.forEach(p => { p.rot = 0; p.del = false; }); pages.sort((a, b) => a.n - b.n); render(); },
    rotateAll(deg) { pages.forEach(p => { p.rot = (p.rot + deg + 360) % 360; }); render(); },
    async save() {
      const { PDFDocument, degrees } = PDFLib;
      const doc = await PDFDocument.load(src, { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const keep = pages.filter(p => !p.del);
      const copied = await out.copyPages(doc, keep.map(p => p.n - 1));
      copied.forEach((pg, k) => {
        pg.setRotation(degrees((pg.getRotation().angle + keep[k].rot) % 360));
        out.addPage(pg);
      });
      return out.save();
    },
  };
  return api;
}
