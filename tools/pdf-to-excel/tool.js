// PDF to Excel: pdf-read.js finds the tables on each page (text lined up in columns); their cells become
// spreadsheet cells, numbers become real numbers, and SheetJS writes the .xlsx or .csv file.
const out = $('#out');
let pages = null, name = 'document', sheets = [], shown = 0;
fileDrop($('#drop'), $('#file'), fs => { const f = fs.find(isPdf); if (f) open(f); });
$('#sample').addEventListener('click', async () => open(await sampleStatement()));
onAny('input[name="what"], input[name="sheets"]', () => { if (pages) build(); });

async function open(f) {
  let doc;
  try { doc = await openPdf(new Uint8Array(await f.arrayBuffer())); } catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged or password-protected.'; return; }
  name = baseName(f.name);
  $('#loaded').textContent = `${f.name} · ${doc.numPages} page${doc.numPages > 1 ? 's' : ''}`;
  out.innerHTML = '<p class="kicker">Spreadsheet</p><div class="bar"><i style="width:2%"></i></div><p class="sub" data-pct>Reading…</p>';
  pages = [];
  for (let n = 1; n <= doc.numPages; n++) { pages.push(await PdfRead.readPage(doc, n, { images: false })); setProgress(out, n / doc.numPages, `Reading page ${n} of ${doc.numPages}…`); }
  build();
}
// "1,250.50", "£1,250", "-3.2", "(45.00)", "12%" -> numbers. Anything else stays text.
function value(t) {
  const s = t.trim().replace(/−/g, '-');
  const m = s.match(/^(\()?([-+])?\s*([$£€¥₹]|USD|GBP|EUR|PKR|Rs\.?)?\s*(\d{1,3}(?:[,  ]\d{3})+|\d+)(\.\d+)?\s*(%|CR|DR)?(\))?$/i);
  if (!m || (m[1] && !m[7])) return { v: t };
  let v = parseFloat(m[4].replace(/[,  ]/g, '') + (m[5] || ''));
  if (m[2] === '-' || m[1] || /^DR$/i.test(m[6] || '')) v = -v;
  if (m[6] === '%') return { v: v / 100, z: '0.##%' };
  return { v, z: m[3] ? `"${m[3]}"#,##0.00` : m[5] ? '#,##0.00' : (m[4].includes(',') ? '#,##0' : undefined) };
}
function build() {
  const all = $('input[name="what"]:checked').value === 'all', one = $('input[name="sheets"]:checked').value === 'one';
  sheets = [];
  let cur = null, tablesN = 0;
  pages.forEach((p, i) => {
    if (!one || !cur) { cur = { name: one ? 'PDF' : `Page ${i + 1}`, rows: [] }; sheets.push(cur); }
    else if (cur.rows.length) cur.rows.push([]);
    for (const b of PdfRead.blocks(p.lines)) {
      if (b.table) { tablesN++; if (cur.rows.length && cur.rows[cur.rows.length - 1].length) cur.rows.push([]); b.rows.forEach(r => cur.rows.push(r.map(c => c.text))); cur.rows.push([]); }
      else if (all) cur.rows.push([b.line.text]);
    }
    while (cur.rows.length && !cur.rows[cur.rows.length - 1].length) cur.rows.pop();
  });
  sheets = sheets.filter(s => s.rows.length || !one);
  shown = Math.min(shown, Math.max(0, sheets.length - 1));
  const cells = sheets.reduce((s, sh) => s + sh.rows.reduce((a, r) => a + r.filter(Boolean).length, 0), 0);
  if (!cells) {
    out.innerHTML = `<p class="kicker">Spreadsheet</p><span class="verdict no">${pages.some(p => p.lines.length) ? 'No tables found' : 'No text found'}</span><p class="sub">${pages.some(p => p.lines.length) ? 'Choose <b>All text</b> to bring every line across instead.' : 'This PDF looks like a scan. Read it first with Image to Text.'}</p>`;
    return;
  }
  out.innerHTML = `<p class="kicker">Spreadsheet</p><span class="verdict ok">${tablesN} table${tablesN === 1 ? '' : 's'} found</span><p class="sub">${sheets.length} sheet${sheets.length === 1 ? '' : 's'} · ${cells.toLocaleString()} cells</p>
    <div class="btns"><button type="button" class="btn big-btn" id="xlsx">Download Excel (.xlsx)</button><button type="button" class="btn ghost" id="csv">Download CSV</button></div>
    ${sheets.length > 1 ? `<div class="px-tabs" role="tablist">${sheets.map((s, i) => `<button type="button" role="tab" data-i="${i}">${esc(s.name)}</button>`).join('')}</div>` : ''}<div class="px-sheet" id="grid"></div>`;
  $$('.px-tabs button').forEach(b => b.addEventListener('click', () => { shown = +b.dataset.i; grid(); }));
  $('#xlsx').onclick = () => save('xlsx');
  $('#csv').onclick = () => save('csv');
  grid();
}
function grid() {
  $$('.px-tabs button').forEach(b => b.classList.toggle('on', +b.dataset.i === shown));
  const s = sheets[shown], w = Math.max(1, ...s.rows.map(r => r.length)), rows = s.rows.slice(0, 200);
  const col = i => { let n = '', k = i + 1; while (k) { n = String.fromCharCode(65 + (k - 1) % 26) + n; k = Math.floor((k - 1) / 26); } return n; };
  $('#grid').innerHTML = `<table><tr><th></th>${Array.from({ length: w }, (_, i) => `<th>${col(i)}</th>`).join('')}</tr>${rows.map((r, ri) => `<tr><th>${ri + 1}</th>${Array.from({ length: w }, (_, i) => { const t = r[i] || '', n = t && typeof value(t).v === 'number'; return `<td${n ? ' class="n"' : ''}>${esc(t)}</td>`; }).join('')}</tr>`).join('')}</table>${s.rows.length > 200 ? `<p class="note" style="padding:6px 10px">Showing the first 200 of ${s.rows.length} rows.</p>` : ''}`;
}
function sheetOf(s) {
  const ws = {}, w = Math.max(1, ...s.rows.map(r => r.length)), widths = Array(w).fill(6);
  s.rows.forEach((r, ri) => r.forEach((t, ci) => {
    if (!t) return;
    const c = value(t), ref = XLSX.utils.encode_cell({ r: ri, c: ci });
    ws[ref] = typeof c.v === 'number' ? { t: 'n', v: c.v, ...(c.z ? { z: c.z } : {}) } : { t: 's', v: t };
    widths[ci] = Math.min(60, Math.max(widths[ci], t.length + 2));
  }));
  ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: Math.max(0, s.rows.length - 1), c: w - 1 } });
  ws['!cols'] = widths.map(wch => ({ wch }));
  return ws;
}
function save(kind) {
  if (kind === 'csv') {
    const csv = XLSX.utils.sheet_to_csv(sheetOf(sheets[shown]));
    download(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }), `${name}${sheets.length > 1 ? '-' + sheets[shown].name.toLowerCase().replace(/\s+/g, '-') : ''}.csv`);
    return;
  }
  const wb = XLSX.utils.book_new();
  sheets.forEach(s => XLSX.utils.book_append_sheet(wb, sheetOf(s), s.name.slice(0, 31)));
  const data = XLSX.write(wb, { bookType: 'xlsx', type: 'array', compression: true });
  download(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${name}.xlsx`);
}
// A sample bank statement, the most common thing people convert.
async function sampleStatement() {
  if (!window.PDFLib) await loadScript(PDFLIB_URL);
  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const pdf = await PDFDocument.create(), f = await pdf.embedFont(StandardFonts.Helvetica), b = await pdf.embedFont(StandardFonts.HelveticaBold);
  const p = pdf.addPage([595.28, 841.89]);
  p.drawText('Example Bank · Current account statement', { x: 50, y: 780, size: 16, font: b });
  p.drawText('Account 12345678 · 1 to 31 March 2026', { x: 50, y: 758, size: 10, font: f, color: rgb(0.35, 0.35, 0.35) });
  const cols = [50, 120, 330, 420, 500], head = ['Date', 'Description', 'Money out', 'Money in', 'Balance'];
  head.forEach((h, i) => p.drawText(h, { x: cols[i], y: 715, size: 10, font: b }));
  const rows = [['01 Mar', 'Opening balance', '', '', '1,250.00'], ['02 Mar', 'Grocery store', '64.20', '', '1,185.80'], ['05 Mar', 'Salary', '', '2,400.00', '3,585.80'], ['07 Mar', 'Rent', '950.00', '', '2,635.80'], ['12 Mar', 'Electricity', '82.15', '', '2,553.65'], ['18 Mar', 'Coffee shop', '4.60', '', '2,549.05'], ['22 Mar', 'Refund: online order', '', '29.99', '2,579.04'], ['28 Mar', 'Phone bill', '18.00', '', '2,561.04']];
  rows.forEach((r, k) => r.forEach((t, i) => { if (t) p.drawText(t, { x: i >= 2 ? cols[i] + 50 - f.widthOfTextAtSize(t, 10) : cols[i], y: 693 - k * 20, size: 10, font: f }); }));
  p.drawText('Interest rate: 1.5% a year', { x: 50, y: 500, size: 10, font: f });
  return new File([await pdf.save()], 'bank-statement.pdf', { type: 'application/pdf' });
}
