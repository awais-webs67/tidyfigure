// Excel to PDF: SheetJS reads the workbook; each sheet becomes an HTML table sized to the page (off screen),
// and dom-pdf.js draws it as PDF pages with real text, cutting long sheets between rows.
const out = $('#out');
let wb = null, name = 'spreadsheet';
const PAPER = { a4: [794, 1123], letter: [816, 1056], a3: [1123, 1587] }; // CSS px at 96 dpi
fileDrop($('#drop'), $('#file'), fs => { if (fs[0]) open(fs[0]); });
$('#sample').addEventListener('click', async () => { const ws = XLSX.utils.aoa_to_sheet(sampleRows()); ws['!cols'] = [{ wch: 14 }, ...Array(13).fill({ wch: 10 })]; const b = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(b, ws, 'Budget 2026'); XLSX.utils.book_append_sheet(b, XLSX.utils.aoa_to_sheet([['Name', 'Team', 'Start date'], ['Amira Khan', 'Design', '2024-03-01'], ['Ben Ito', 'Sales', '2025-01-15'], ['Chloe Martin', 'Support', '2023-11-20']]), 'Staff'); await open(new File([XLSX.write(b, { type: 'array', bookType: 'xlsx' })], 'budget-2026.xlsx')); $('#go').click(); });
function sampleRows() {
  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], rows = [['Item', ...m, 'Total']];
  ['Rent', 'Salaries', 'Software', 'Marketing', 'Travel', 'Equipment', 'Training', 'Insurance', 'Utilities', 'Consultants', 'Events', 'Office supplies'].forEach((it, i) => { const v = m.map((_, k) => Math.round(800 + ((i * 37 + k * 53) % 400) * (i + 1))); rows.push([it, ...v, v.reduce((a, b) => a + b, 0)]); });
  return rows;
}
async function open(f) {
  try { wb = XLSX.read(new Uint8Array(await f.arrayBuffer()), { type: 'array', cellDates: true, cellNF: true }); }
  catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged or password-protected.'; wb = null; $('#go').disabled = true; return; }
  name = baseName(f.name);
  $('#loaded').textContent = `${f.name} · ${wb.SheetNames.length} sheet${wb.SheetNames.length > 1 ? 's' : ''}`;
  $('#sheets').innerHTML = wb.SheetNames.length > 1 ? wb.SheetNames.map((n, i) => `<label class="check"><input type="checkbox" data-s="${i}" checked> ${esc(n)}</label>`).join('') : '';
  $('#go').disabled = false;
}
// One sheet as an HTML table: formatted values, merged cells and column widths from the file.
function tableOf(ws) {
  const ref = ws['!ref'];
  if (!ref) return null;
  const R = XLSX.utils.decode_range(ref), merges = ws['!merges'] || [], skip = new Set(), span = {};
  // Trim empty rows and columns at the end.
  let lastR = R.s.r, lastC = R.s.c;
  for (let r = R.s.r; r <= R.e.r; r++) for (let c = R.s.c; c <= R.e.c; c++) { const cell = ws[XLSX.utils.encode_cell({ r, c })]; if (cell && (cell.w ?? cell.v) !== undefined && String(cell.w ?? cell.v) !== '') { lastR = Math.max(lastR, r); lastC = Math.max(lastC, c); } }
  merges.forEach(m => { span[`${m.s.r},${m.s.c}`] = [m.e.r - m.s.r + 1, m.e.c - m.s.c + 1]; for (let r = m.s.r; r <= m.e.r; r++) for (let c = m.s.c; c <= m.e.c; c++) if (r !== m.s.r || c !== m.s.c) skip.add(`${r},${c}`); });
  const cols = ws['!cols'] || [], widths = [];
  for (let c = R.s.c; c <= lastC; c++) { const cw = cols[c]; widths.push(cw ? (cw.wpx || (cw.wch ? cw.wch * 7 + 5 : 0) || 64) : 64); }
  let html = `<table><colgroup>${widths.map(w => `<col style="width:${w}px">`).join('')}</colgroup>`;
  for (let r = R.s.r; r <= lastR; r++) {
    html += '<tr>';
    for (let c = R.s.c; c <= lastC; c++) {
      if (skip.has(`${r},${c}`)) continue;
      const cell = ws[XLSX.utils.encode_cell({ r, c })], sp = span[`${r},${c}`];
      let t = cell ? (cell.w ?? (cell.v instanceof Date ? cell.v.toLocaleDateString() : cell.v)) : '';
      t = t === undefined || t === null ? '' : String(t);
      html += `<td${sp ? ` rowspan="${sp[0]}" colspan="${sp[1]}"` : ''}${cell && cell.t === 'n' ? ' class="n"' : ''}>${esc(t) || '&nbsp;'}</td>`;
    }
    html += '</tr>';
  }
  return { html: html + '</table>', width: widths.reduce((a, b) => a + b, 0) };
}
$('#go').addEventListener('click', async () => {
  if (!wb) return;
  const btn = $('#go'); btn.disabled = true;
  const stage = $('#stage');
  out.innerHTML = '<p class="kicker">PDF</p><div class="bar"><i style="width:3%"></i></div><p class="sub" data-pct>Laying out the sheets…</p>';
  try {
    stage.innerHTML = ''; stage.classList.toggle('nogrid', !$('#grid').checked);
    const pick = $$('#sheets [data-s]'), chosen = wb.SheetNames.filter((n, i) => !pick.length || pick[i].checked);
    const pages = [], M = 38; // margins: 10 mm
    for (const sn of chosen) {
      const t = tableOf(wb.Sheets[sn]);
      if (!t) continue;
      let [pw, ph] = PAPER[$('#paper').value], o = $('#orient').value;
      if (o === 'landscape' || (o === 'auto' && t.width > pw - 2 * M)) [pw, ph] = [ph, pw];
      const el = document.createElement('div');
      el.className = 'xp-page';
      Object.assign(el.style, { width: `${pw}px`, minHeight: `${ph}px`, padding: `${M}px` });
      el.innerHTML = `<p class="xp-name">${esc(sn)}</p>${t.html}`;
      stage.appendChild(el);
      const table = el.querySelector('table');
      table.style.fontSize = '13.33px';
      // Fit to the page width: scale the column widths and the text together.
      if ($('#fit').checked) {
        const k = Math.min(1, (pw - 2 * M) / table.getBoundingClientRect().width);
        if (k < 1) { table.querySelectorAll('col').forEach(c => { c.style.width = `${parseFloat(c.style.width) * k}px`; }); table.style.fontSize = `${Math.max(5, 13.33 * k)}px`; table.querySelectorAll('td').forEach(td => { td.style.padding = `${2 * k}px ${4 * k}px`; }); }
      }
      pages.push({ el, w: pw, h: ph, pad: [M, M, M, M] });
    }
    if (!pages.length) throw new Error('The chosen sheets are empty.');
    await DomPdf.prepare(stage);
    setProgress(out, 0.4, 'Drawing the pages…');
    const pdfBytes = await DomPdf.render(pages, { title: name, onProgress: n => setProgress(out, Math.min(0.95, 0.4 + n * 0.05), `Drawing page ${n}…`) });
    stage.innerHTML = '';
    await showPdfResult(out, pdfBytes, { title: 'PDF', name: `${name}.pdf`, label: 'Download PDF', headline: `<span class="verdict ok">${pages.length} sheet${pages.length > 1 ? 's' : ''} converted</span>` });
  } catch (e) {
    stage.innerHTML = '';
    out.innerHTML = `<p class="kicker">PDF</p><span class="verdict no">Couldn’t convert this spreadsheet</span><p class="sub">${esc(e.message || String(e))}</p>`;
  }
  btn.disabled = false;
});
