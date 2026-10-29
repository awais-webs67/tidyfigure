// Compare PDF. Text: the words of both files (pdf.js) are compared with Myers' diff algorithm, first by line
// and then word by word inside changed lines. Visual: matching pages are drawn and compared pixel by pixel.
const out = $('#out');
const F = { A: null, B: null };
['A', 'B'].forEach(k => fileDrop($('#drop' + k), $('#file' + k), fs => { const f = fs.find(isPdf); if (f) set(k, f); }));
async function set(k, f) {
  try { F[k] = { name: f.name, doc: await openPdf(new Uint8Array(await f.arrayBuffer())) }; $('#name' + k).textContent = `${f.name} · ${F[k].doc.numPages} page${F[k].doc.numPages > 1 ? 's' : ''}`; }
  catch (e) { F[k] = null; $('#name' + k).textContent = 'That file can’t be opened. It may be damaged or password-protected.'; }
  $('#go').disabled = !(F.A && F.B);
}
$('#sample').addEventListener('click', async () => {
  if (!window.PDFLib) await loadScript(PDFLIB_URL);
  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const make = async (v2) => {
    const pdf = await PDFDocument.create(), f = await pdf.embedFont(StandardFonts.Helvetica), b = await pdf.embedFont(StandardFonts.HelveticaBold);
    const p = pdf.addPage([595.28, 841.89]);
    p.drawText('Service agreement', { x: 60, y: 770, size: 22, font: b });
    const lines = ['1. The supplier will deliver the service from 1 March 2026.', `2. The monthly fee is ${v2 ? 'GBP 1,450' : 'GBP 1,200'}, paid within ${v2 ? '14' : '30'} days of each invoice.`, '3. Either party may end this agreement with 60 days written notice.', v2 ? '4. The supplier may raise the fee once a year by up to 5%.' : '4. Support is available on weekdays from 9am to 5pm.', '5. This agreement is governed by the laws of England and Wales.'];
    lines.forEach((l, i) => p.drawText(l, { x: 60, y: 720 - i * 28, size: 12, font: f, color: rgb(0.15, 0.17, 0.2) }));
    p.drawRectangle({ x: 60, y: 420, width: 200, height: 90, borderColor: rgb(0.6, 0.6, 0.6), borderWidth: 1 });
    p.drawText('Signed:', { x: 70, y: 490, size: 11, font: f });
    if (v2) p.drawText('Sam Patel', { x: 80, y: 450, size: 20, font: b, color: rgb(0.1, 0.2, 0.6) });
    return new File([await pdf.save()], v2 ? 'agreement-v2.pdf' : 'agreement-v1.pdf', { type: 'application/pdf' });
  };
  await set('A', await make(false)); await set('B', await make(true));
  $('#go').click();
});

// ---------- Text ----------
// Each page's text as lines, from pdf.js text items joined by position.
async function pageLines(doc, n) {
  const tc = await (await doc.getPage(n)).getTextContent();
  const items = tc.items.filter(t => t.str && t.str.trim() !== '' || t.hasEOL).map(t => ({ s: t.str, x: t.transform[4], y: t.transform[5], h: Math.hypot(t.transform[2], t.transform[3]) || 10, w: t.width }));
  items.sort((a, b) => b.y - a.y || a.x - b.x);
  const lines = [];
  for (const it of items) {
    const l = lines.find(L => Math.abs(L.y - it.y) < it.h * 0.5);
    if (l) { l.parts.push(it); } else lines.push({ y: it.y, parts: [it] });
  }
  return lines.sort((a, b) => b.y - a.y).map(l => {
    l.parts.sort((a, b) => a.x - b.x);
    let s = '', end = null;
    for (const p of l.parts) { if (end !== null && p.x - end > p.h * 0.2 && !/\s$/.test(s) && !/^\s/.test(p.s)) s += ' '; s += p.s; end = p.x + p.w; }
    return s.replace(/\s+/g, ' ').trim();
  }).filter(Boolean);
}
async function docLines(doc) {
  const all = [];
  for (let n = 1; n <= doc.numPages; n++) for (const l of await pageLines(doc, n)) all.push({ t: l, page: n });
  return all;
}
// Myers' O(ND) diff of two arrays (compared with eq). Returns [{op: '=', '-', '+', a, b}] in order.
function diff(A, B, eq = (x, y) => x === y) {
  const N = A.length, M = B.length, max = N + M, V = new Int32Array(2 * max + 2), trace = [];
  let found = false;
  for (let d = 0; d <= max && !found; d++) {
    trace.push({ off: max - d - 1, v: V.slice(Math.max(0, max - d - 1), max + d + 2) }); // only the diagonals step d can use
    for (let k = -d; k <= d; k += 2) {
      let x = k === -d || (k !== d && V[max + k - 1] < V[max + k + 1]) ? V[max + k + 1] : V[max + k - 1] + 1, y = x - k;
      while (x < N && y < M && eq(A[x], B[y])) { x++; y++; }
      V[max + k] = x;
      if (x >= N && y >= M) { found = true; break; }
    }
    if (d > 2500) return null; // too different to compare
  }
  const ops = [];
  let x = N, y = M;
  for (let d = trace.length - 1; d >= 0; d--) {
    const t = trace[d], v = kk => t.v[max + kk - Math.max(0, t.off)], k = x - y;
    const pk = k === -d || (k !== d && v(k - 1) < v(k + 1)) ? k + 1 : k - 1, px = v(pk), py = px - pk;
    while (x > px && y > py) { ops.push({ op: '=', a: --x, b: --y }); }
    if (d > 0) { if (x === px) ops.push({ op: '+', b: --y }); else ops.push({ op: '-', a: --x }); }
  }
  return ops.reverse();
}
const words = s => s.match(/\s+|[^\s]+/g) || [];

async function compareText() {
  out.innerHTML = '<p class="kicker">Differences</p><p class="sub">Reading both files…</p>';
  const [A, B] = [await docLines(F.A.doc), await docLines(F.B.doc)];
  if (!A.length && !B.length) { out.innerHTML = '<p class="kicker">Differences</p><span class="verdict no">No text found</span><p class="sub">These PDFs look like scans or pictures. Use the Visual comparison instead.</p>'; return; }
  const lines = diff(A, B, (x, y) => x.t === y.t);
  if (!lines) { out.innerHTML = '<p class="kicker">Differences</p><span class="verdict no">These documents are almost completely different</span><p class="sub">Check that you chose two versions of the same document.</p>'; return; }
  // Rows: unchanged lines, or blocks of removed/added lines compared word by word.
  const rows = [];
  let added = 0, removed = 0;
  for (let i = 0; i < lines.length;) {
    if (lines[i].op === '=') { rows.push({ eq: true, html: esc(B[lines[i].b].t), page: B[lines[i].b].page }); i++; continue; }
    const del = [], ins = [];
    while (i < lines.length && lines[i].op !== '=') { (lines[i].op === '-' ? del : ins).push(lines[i]); i++; }
    const a = words(del.map(o => A[o.a].t).join('\n')), b = words(ins.map(o => B[o.b].t).join('\n'));
    const w = diff(a, b) || [...a.map((_, k) => ({ op: '-', a: k })), ...b.map((_, k) => ({ op: '+', b: k }))];
    // Runs of changes become one removed part and one added part, which reads better than alternating words.
    let html = '', dt = '', it = '';
    const flush = () => { if (dt.trim()) html += `<del>${esc(dt.trimEnd())}</del>${/\s$/.test(dt) && !it.trim() ? ' ' : ''}`; if (it.trim()) html += `<ins>${esc(it.trimEnd())}</ins>${/\s$/.test(it) ? ' ' : ''}`; dt = it = ''; };
    w.forEach((o, k) => {
      if (o.op === '=') {
        const t = b[o.b];
        if (!/\S/.test(t) && (dt || it) && w[k + 1] && w[k + 1].op !== '=') { dt += t; it += t; return; } // a space between two changes
        flush(); html += esc(t); return;
      }
      if (o.op === '-') { dt += a[o.a]; if (/\S/.test(a[o.a])) removed++; } else { it += b[o.b]; if (/\S/.test(b[o.b])) added++; }
    });
    flush();
    rows.push({ eq: false, html, page: ins.length ? B[ins[0].b].page : (del.length ? A[del[0].a].page : 1) });
  }
  const only = $('#only').checked, keep = new Set();
  rows.forEach((r, i) => { if (!r.eq) for (let k = i - 1; k <= i + 1; k++) keep.add(k); });
  let html = '', lastPage = 0, skipped = false;
  rows.forEach((r, i) => {
    if (only && !keep.has(i)) { skipped = true; return; }
    if (skipped && html) html += '<span class="gap">⋯</span>';
    skipped = false;
    if (r.page !== lastPage) { html += `<span class="pg">Page ${r.page}</span>`; lastPage = r.page; }
    html += r.html + '\n';
  });
  const changes = rows.filter(r => !r.eq).length;
  out.innerHTML = `<p class="kicker">Text changes</p>
    <span class="verdict ${changes ? 'tight' : 'ok'}">${changes ? `${changes} change${changes === 1 ? '' : 's'}: ${added} word${added === 1 ? '' : 's'} added, ${removed} removed` : 'The text is identical'}</span>
    <p class="cm-key"><span><i style="background:#D7F5DD;outline:1px solid #8ACB98"></i>Added in ${esc(F.B.name)}</span><span><i style="background:#FDE1E1;outline:1px solid #E7A1A1"></i>Removed from ${esc(F.A.name)}</span></p>
    ${changes || !only ? `<div class="cm-diff">${html}</div>` : '<p class="sub">Every word is the same in both files. Try the Visual comparison to check pictures and layout.</p>'}
    ${changes ? '<div class="btns"><button type="button" class="btn ghost" id="copy">Copy a list of changes</button></div>' : ''}`;
  $('#copy')?.addEventListener('click', e => {
    const list = rows.filter(r => !r.eq).map(r => { const d = document.createElement('div'); d.innerHTML = r.html.replace(/<del>/g, '[-').replace(/<\/del>/g, '-]').replace(/<ins>/g, '{+').replace(/<\/ins>/g, '+}'); return `Page ${r.page}: ${d.textContent}`; }).join('\n');
    copyText(list, e.target);
  });
}

// ---------- Visual ----------
async function compareVisual() {
  out.innerHTML = '<p class="kicker">Visual comparison</p><p class="sub">Drawing the pages…</p>';
  const n = Math.max(F.A.doc.numPages, F.B.doc.numPages), box = document.createElement('div');
  box.className = 'cm-pages';
  let changedPages = 0;
  for (let i = 1; i <= Math.min(n, 30); i++) {
    const has = d => i <= d.numPages;
    const W = 900;
    const draw = async d => { if (!has(d)) return null; const p = await d.getPage(i), v = p.getViewport({ scale: 1 }); return renderPdfPage(d, i, W / v.width); };
    const [a, b] = [await draw(F.A.doc), await draw(F.B.doc)];
    const c = document.createElement('canvas'), w = W, h = Math.max(a ? a.height : 0, b ? b.height : 0);
    c.width = w; c.height = h;
    const x = c.getContext('2d');
    const px = cv => { if (!cv) return null; const t = document.createElement('canvas'); t.width = w; t.height = h; const tx = t.getContext('2d'); tx.fillStyle = '#fff'; tx.fillRect(0, 0, w, h); tx.drawImage(cv, 0, 0); return tx.getImageData(0, 0, w, h).data; };
    const da = px(a), db = px(b), o = x.createImageData(w, h);
    let diffPx = 0;
    for (let k = 0; k < w * h * 4; k += 4) {
      const la = da ? (da[k] + da[k + 1] + da[k + 2]) / 3 : 255, lb = db ? (db[k] + db[k + 1] + db[k + 2]) / 3 : 255, base = db || da;
      const faded = 255 - (255 - (base[k] + base[k + 1] + base[k + 2]) / 3) * 0.25;
      if (Math.abs(la - lb) > 40) {
        diffPx++;
        if (la < lb) { o.data[k] = 220; o.data[k + 1] = 38; o.data[k + 2] = 38; } // only in the original: removed
        else { o.data[k] = 22; o.data[k + 1] = 163; o.data[k + 2] = 74; } // only in the new file: added
      } else { o.data[k] = o.data[k + 1] = o.data[k + 2] = faded; }
      o.data[k + 3] = 255;
    }
    x.putImageData(o, 0, 0);
    const share = diffPx / (w * h) * 100, changed = share > 0.002 || !has(F.A.doc) || !has(F.B.doc);
    if (changed) changedPages++;
    const f = document.createElement('figure');
    c.setAttribute('aria-label', `Page ${i} compared`);
    f.appendChild(c);
    f.insertAdjacentHTML('beforeend', `<figcaption>Page ${i}: ${!has(F.A.doc) ? 'only in the changed file' : !has(F.B.doc) ? 'only in the original' : changed ? `changed (${share < 0.1 ? 'small change' : share.toFixed(1) + '% of the page'})` : 'no visible change'}</figcaption>`);
    box.appendChild(f);
  }
  out.innerHTML = `<p class="kicker">Visual comparison</p><span class="verdict ${changedPages ? 'tight' : 'ok'}">${changedPages ? `${changedPages} page${changedPages === 1 ? '' : 's'} changed` : 'No visible differences'}</span>
    <p class="cm-key"><span><i style="background:#dc2626"></i>Only in the original</span><span><i style="background:#16a34a"></i>Only in the changed file</span></p>${n > 30 ? '<p class="note">The first 30 pages are shown.</p>' : ''}`;
  out.appendChild(box);
}
$('#go').addEventListener('click', async () => {
  const btn = $('#go'); btn.disabled = true;
  try { $('input[name="mode"]:checked').value === 'visual' ? await compareVisual() : await compareText(); }
  catch (e) { out.innerHTML = `<p class="kicker">Differences</p><span class="verdict no">Couldn’t compare these files</span><p class="sub">${esc(e.message || String(e))}</p>`; }
  btn.disabled = false;
});
onAny('input[name="mode"], #only', () => { if (F.A && F.B && !$('#go').disabled) $('#go').click(); });
