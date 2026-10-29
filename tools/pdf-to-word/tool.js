// PDF to Word: pdf-read.js gives each page's lines (fonts, sizes, positions) and pictures; they are turned into
// Word paragraphs, headings, lists and inline pictures, and written as a .docx (Office Open XML) with JSZip.
const out = $('#out');
let doc = null, name = 'document';
fileDrop($('#drop'), $('#file'), fs => { const f = fs.find(isPdf); if (f) open(f); });
$('#sample').addEventListener('click', async () => open(await samplePdf(3, 'Annual report')));
onAny('input[name="mode"]', () => { $('#pbwrap').hidden = $('input[name="mode"]:checked').value === 'look'; });
async function open(f) {
  try { doc = await openPdf(new Uint8Array(await f.arrayBuffer())); } catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged or password-protected.'; return; }
  name = baseName(f.name);
  $('#loaded').textContent = `${f.name} · ${doc.numPages} page${doc.numPages > 1 ? 's' : ''}`;
  $('#go').disabled = false;
  $('#go').click();
}

// ---------- Office Open XML ----------
const xml = s => String(s).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F￾￿]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const TW = 20, EMU = 12700; // twips and EMUs per point
function runXml(r, opts = {}) {
  const p = [];
  if (r.family) p.push(`<w:rFonts w:ascii="${xml(r.family)}" w:hAnsi="${xml(r.family)}" w:cs="${xml(r.family)}"/>`);
  if (r.bold && !opts.noBold) p.push('<w:b/>');
  if (r.italic) p.push('<w:i/>');
  if (r.size && !opts.noSize) p.push(`<w:sz w:val="${Math.round(r.size * 2)}"/><w:szCs w:val="${Math.round(r.size * 2)}"/>`);
  return `<w:r>${p.length ? `<w:rPr>${p.join('')}</w:rPr>` : ''}<w:t xml:space="preserve">${xml(r.text)}</w:t></w:r>`;
}
function picXml(rid, id, wPt, hPt) {
  const cx = Math.round(wPt * EMU), cy = Math.round(hPt * EMU);
  return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${id}" name="Picture ${id}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${id}" name="image${id}.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
}
async function docx({ body, page, font, size }) {
  const zip = new JSZip();
  zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>');
  zip.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>');
  zip.file('docProps/core.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xml(name)}</dc:title><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString().slice(0, 19)}Z</dcterms:created></cp:coreProperties>`);
  const sz = Math.round(size * 2), ff = font ? `<w:rFonts w:ascii="${xml(font)}" w:hAnsi="${xml(font)}" w:cs="${xml(font)}"/>` : '';
  const head = (lvl, k) => `<w:style w:type="paragraph" w:styleId="Heading${lvl}"><w:name w:val="heading ${lvl}"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="9"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="${lvl === 1 ? 240 : 160}" w:after="80"/><w:outlineLvl w:val="${lvl - 1}"/></w:pPr><w:rPr><w:b/><w:sz w:val="${Math.round(sz * k)}"/><w:szCs w:val="${Math.round(sz * k)}"/></w:rPr></w:style>`;
  zip.file('word/styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr>${ff}<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/><w:lang w:val="en-GB"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>${head(1, 2)}${head(2, 1.5)}${head(3, 1.2)}<w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/><w:uiPriority w:val="34"/><w:qFormat/><w:pPr><w:spacing w:after="40"/><w:ind w:left="720"/><w:contextualSpacing/></w:pPr></w:style></w:styles>`);
  zip.file('word/numbering.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>');
  const rels = ['<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>', '<Relationship Id="rIdNum" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>'];
  let k = 0;
  const parts = [];
  for (const b of body) {
    if (b.table) {
      const border = ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(e => `<w:${e} w:val="single" w:sz="4" w:space="0" w:color="A6A6A6"/>`).join('');
      const rows = b.table.map((r, ri) => `<w:tr>${r.map((c, ci) => `<w:tc><w:tcPr><w:tcW w:w="${b.widths[ci]}" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:spacing w:before="20" w:after="20"/></w:pPr>${c.text ? runXml({ text: c.text, bold: c.bold, size: b.size, family: b.family }) : ''}</w:p></w:tc>`).join('')}</w:tr>`).join('');
      parts.push(`<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders>${border}</w:tblBorders><w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${b.widths.map(w => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>${rows}</w:tbl><w:p><w:pPr><w:spacing w:after="0"/></w:pPr></w:p>`);
      continue;
    }
    if (b.pic) {
      k++;
      zip.file(`word/media/image${k}.${b.pic.ext}`, b.pic.data);
      rels.push(`<Relationship Id="rIdImg${k}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image${k}.${b.pic.ext}"/>`);
      parts.push(`<w:p><w:pPr>${b.pageBreak ? '<w:pageBreakBefore/>' : ''}<w:spacing w:before="${b.before || 0}" w:after="${b.after ?? 120}" w:line="240" w:lineRule="auto"/>${b.align ? `<w:jc w:val="${b.align}"/>` : ''}${b.indent ? `<w:ind w:left="${b.indent}"/>` : ''}</w:pPr>${picXml(`rIdImg${k}`, k, b.pic.w, b.pic.h)}</w:p>`);
    } else {
      const pPr = [];
      if (b.style) pPr.push(`<w:pStyle w:val="${b.style}"/>`);
      if (b.pageBreak) pPr.push('<w:pageBreakBefore/>');
      if (b.list) pPr.push('<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>');
      if (b.before !== undefined) pPr.push(`<w:spacing w:before="${b.before}"${b.list ? ' w:after="40"' : ''}/>`);
      if (b.indent && !b.list) pPr.push(`<w:ind w:left="${b.indent}"${b.hanging ? ` w:hanging="${b.hanging}"` : ''}/>`);
      if (b.align) pPr.push(`<w:jc w:val="${b.align}"/>`);
      const heading = /^Heading/.test(b.style || '');
      parts.push(`<w:p>${pPr.length ? `<w:pPr>${pPr.join('')}</w:pPr>` : ''}${b.runs.map(r => runXml(r, { noBold: heading, noSize: heading && b.uniform })).join('')}</w:p>`);
    }
  }
  const m = page.margins.map(v => Math.round(v * TW));
  parts.push(`<w:sectPr><w:pgSz w:w="${Math.round(page.w * TW)}" w:h="${Math.round(page.h * TW)}"${page.w > page.h ? ' w:orient="landscape"' : ''}/><w:pgMar w:top="${m[0]}" w:right="${m[1]}" w:bottom="${m[2]}" w:left="${m[3]}" w:header="400" w:footer="400" w:gutter="0"/></w:sectPr>`);
  zip.file('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels.join('')}</Relationships>`);
  zip.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${parts.join('')}</w:body></w:document>`);
  return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', compression: 'DEFLATE' });
}
const pngOf = async c => new Uint8Array(await (await canvasBlob(c, 'image/png')).arrayBuffer());
const jpgOf = async (c, q = 0.85) => new Uint8Array(await (await canvasBlob(c, 'image/jpeg', q)).arrayBuffer());
// Photos are stored as JPEG, drawings and logos (few colours, or transparency) as PNG.
async function picData(c) {
  const s = document.createElement('canvas'), k = Math.min(1, 1600 / Math.max(c.width, c.height));
  s.width = Math.max(1, Math.round(c.width * k)); s.height = Math.max(1, Math.round(c.height * k));
  s.getContext('2d').drawImage(c, 0, 0, s.width, s.height);
  const d = s.getContext('2d').getImageData(0, 0, s.width, s.height).data, colours = new Set();
  let alpha = false;
  for (let i = 0; i < d.length && colours.size < 300; i += 4 * 7) { colours.add((d[i] >> 3) << 10 | (d[i + 1] >> 3) << 5 | d[i + 2] >> 3); if (d[i + 3] < 250) alpha = true; }
  return alpha || colours.size < 300 ? { ext: 'png', data: await pngOf(s) } : { ext: 'jpeg', data: await jpgOf(s) };
}

// ---------- PDF -> paragraphs ----------
function build(pages, pageBreaks) {
  const body = [], size = PdfRead.bodySize(pages);
  const heads = [...new Set(pages.flatMap(p => p.lines.filter(l => l.size >= size * 1.2 && l.text.length < 160).map(l => l.size)))].sort((a, b) => b - a);
  const level = s => Math.min(3, heads.indexOf(s) + 1);
  const fams = {};
  pages.forEach(p => p.lines.forEach(l => l.runs.forEach(r => { if (r.family) fams[r.family] = (fams[r.family] || 0) + r.text.length; })));
  const font = Object.entries(fams).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  // Page size and margins from the first page with text.
  const first = pages.find(p => p.lines.length) || pages[0];
  const xs0 = first.lines.map(l => l.x0), xs1 = first.lines.map(l => l.x1), ys = first.lines.map(l => l.base);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const margins = first.lines.length ? [clamp(Math.min(...ys) - size * 1.2, 28, 110), clamp(first.w - Math.max(...xs1), 28, 110), clamp(first.h - Math.max(...ys) - 6, 28, 110), clamp(Math.min(...xs0), 28, 110)] : [72, 72, 72, 72];
  const contentW = first.w - margins[1] - margins[3];
  pages.forEach((p, pi) => {
    let para = null, prev = null, startOfPage = pi > 0 && pageBreaks;
    const cols = [0, 1].map(c => { const ls = p.lines.filter(l => l.col === c); return ls.length ? { l: Math.min(...ls.map(l => l.x0)), r: Math.max(...ls.map(l => l.x1)) } : null; });
    const flows = [...PdfRead.blocks(p.lines).map(b => (b.table ? { t: b } : { l: b.line })), ...p.pics.map(pc => ({ pc, col: p.split && pc.x >= p.split ? 1 : 0 }))];
    const colOf = f => (f.l ? f.l.col : f.t ? f.t.col : f.col), yOf = f => (f.l ? f.l.base : f.t ? f.t.base : f.pc.y + 4);
    flows.sort((a, b) => colOf(a) - colOf(b) || yOf(a) - yOf(b));
    const push = b => { if (startOfPage) { b.pageBreak = true; startOfPage = false; } body.push(b); return b; };
    const end = () => { para = null; };
    for (const f of flows) {
      if (f.t) {
        // A table: column widths from where the columns start.
        end();
        const widths = f.t.cols.slice(0, -1).map((x, k) => Math.max(20, f.t.cols[k + 1] - x));
        // The last column: as wide as the others on average if the page has room, never narrower than its text.
        const lastText = Math.max(...f.t.lines.map(l => { const c = l.cells.filter(c => c.x0 >= f.t.cols[f.t.cols.length - 1] - 10); return c.length ? Math.max(...c.map(x => x.x1)) - f.t.cols[f.t.cols.length - 1] : 0; })) + 14;
        const avg = widths.reduce((a, b) => a + b, 0) / widths.length, room = margins[3] + contentW - f.t.cols[f.t.cols.length - 1];
        widths.push(Math.max(lastText, Math.min(avg, room)));
        const k = Math.min(1, contentW / widths.reduce((s, w) => s + w, 0));
        push({ table: f.t.rows, widths: widths.map(w => Math.round(w * k * TW)), size: f.t.lines[0].size, family: f.t.lines[0].runs[0]?.family || '' });
        prev = null; continue;
      }
      if (f.pc) {
        const c = cols[f.col] || { l: margins[3], r: p.w - margins[1] }, mid = Math.abs(f.pc.x + f.pc.w / 2 - (c.l + c.r) / 2) < (c.r - c.l) * 0.05;
        end(); push({ picSrc: f.pc, w: Math.min(contentW, f.pc.w), h: f.pc.h * Math.min(1, contentW / f.pc.w), align: mid && f.pc.w < (c.r - c.l) * 0.9 ? 'center' : '' }); prev = null; continue;
      }
      const l = f.l, col = cols[l.col] || { l: l.x0, r: l.x1 }, cw = col.r - col.l;
      const gap = prev ? l.base - prev.base : Infinity;
      const bullet = l.bullet || l.text.match(/^([•●▪◦‣∙·–\-*])\s+/), num = /^\(?\d{1,3}[.)]\s+/.test(l.text);
      const before = Math.round(clamp(prev ? (gap - l.size * 1.25) * TW : 0, 0, 600));
      const centred = Math.abs((l.x0 + l.x1) / 2 - (col.l + col.r) / 2) < cw * 0.04 && l.x1 - l.x0 < cw * 0.8 && l.x0 - col.l > cw * 0.08;
      const right = Math.abs(l.x1 - col.r) < 3 && l.x0 - col.l > cw * 0.35;
      if (l.size >= size * 1.2 && l.text.length < 160) {
        // Heading; a heading on two lines stays one paragraph.
        if (para && para.style && para.size === l.size && gap < l.size * 1.6) { para.runs.push({ text: ' ' }, ...l.runs); prev = l; continue; }
        end();
        para = push({ style: `Heading${level(l.size)}`, size: l.size, runs: l.runs.map(r => ({ ...r })), uniform: l.runs.every(r => r.size === l.size), before: Math.max(before, 120), align: centred ? 'center' : '' });
        prev = l; end(); para = null; continue;
      }
      // Does this line carry on the paragraph above (the line above ran to the edge of the column)?
      const carries = para && !para.style && !bullet && !num && gap < l.size * 1.6 && Math.abs(prev.size - l.size) < 0.6 && prev.x1 > col.r - Math.max(l.size * 3, cw * 0.12) && (!para.list || l.x0 > para.x0 + 2) && !centred;
      if (carries) {
        const last = para.runs[para.runs.length - 1];
        if (/[a-z]-$/.test(last.text) && /^[a-z]/.test(l.runs[0].text)) last.text = last.text.slice(0, -1);
        else last.text += ' ';
        para.runs.push(...l.runs.map(r => ({ ...r })));
      } else {
        end();
        const runs = l.runs.map(r => ({ ...r }));
        if (bullet) runs[0].text = runs[0].text.replace(/^\s*[•●▪◦‣∙·–\-*]\s*/, '');
        const indent = Math.round(Math.max(0, l.x0 - col.l) * TW);
        para = push({ runs, list: !!bullet, x0: l.x0, before, align: centred ? 'center' : right ? 'right' : '', indent: indent > 120 ? indent : 0, hanging: num && indent > 120 ? 0 : 0 });
      }
      prev = l;
    }
  });
  return { body, size, font, margins, contentW };
}

$('#go').addEventListener('click', async () => {
  if (!doc) return;
  const btn = $('#go'), look = $('input[name="mode"]:checked').value === 'look';
  btn.disabled = true;
  out.innerHTML = '<p class="kicker">Word document</p><div class="bar"><i style="width:2%"></i></div><p class="sub" data-pct>Reading the PDF…</p>';
  try {
    let blob, html = '', stats = '';
    const first = (await doc.getPage(1)).getViewport({ scale: 1 });
    if (look) {
      const body = [];
      for (let n = 1; n <= doc.numPages; n++) {
        setProgress(out, n / doc.numPages * 0.9, `Page ${n} of ${doc.numPages}…`);
        const pg = await doc.getPage(n), v = pg.getViewport({ scale: 1 }), c = await renderPdfPage(doc, n, 2);
        body.push({ pic: { ext: 'jpeg', data: await jpgOf(c, 0.88), w: v.width, h: v.height * 0.995 }, pageBreak: n > 1, after: 0 });
      }
      blob = await docx({ body, page: { w: first.width, h: first.height, margins: [0, 0, 0, 0] }, font: '', size: 11 });
      stats = `${doc.numPages} page${doc.numPages > 1 ? 's' : ''} as pictures`;
      html = '<p class="sub">Each page is a picture in the Word file, so it looks exactly like the PDF.</p>';
    } else {
      const pages = [];
      for (let n = 1; n <= doc.numPages; n++) {
        setProgress(out, n / doc.numPages * 0.8, `Reading page ${n} of ${doc.numPages}…`);
        pages.push(await PdfRead.readPage(doc, n));
      }
      const r = build(pages, $('#pb').checked);
      setProgress(out, 0.9, 'Writing the Word file…');
      for (const b of r.body) if (b.picSrc) { const d = await picData(b.picSrc.canvas); b.pic = { ...d, w: b.w, h: b.h }; b.picUrl = URL.createObjectURL(new Blob([d.data], { type: d.ext === 'png' ? 'image/png' : 'image/jpeg' })); }
      blob = await docx({ body: r.body, page: { w: first.width, h: first.height, margins: r.margins }, font: r.font, size: r.size });
      const tables = r.body.filter(b => b.table).length;
      const words = r.body.filter(b => b.runs).reduce((s, b) => s + b.runs.map(x => x.text).join('').split(/\s+/).filter(Boolean).length, 0);
      const pics = r.body.filter(b => b.pic).length, headsN = r.body.filter(b => b.style).length;
      stats = `${words.toLocaleString()} words · ${headsN} heading${headsN === 1 ? '' : 's'} · ${tables ? `${tables} table${tables === 1 ? '' : 's'} · ` : ''}${pics} picture${pics === 1 ? '' : 's'}`;
      if (!words) stats += ' · no text found (a scan?)';
      // A quick look at the text, roughly as Word will show it.
      html = '<div class="pw-doc">' + r.body.slice(0, 120).map(b => {
        if (b.table) return `<table style="border-collapse:collapse;margin:6px 0 10px;font-size:13px">${b.table.map(r => `<tr>${r.map(c => `<td style="border:1px solid #bbb;padding:3px 7px">${c.bold ? `<b>${esc(c.text)}</b>` : esc(c.text)}</td>`).join('')}</tr>`).join('')}</table>`;
        if (b.pic) return `${b.pageBreak ? '<div class="pb"></div>' : ''}<img src="${b.picUrl}" alt="" style="width:${Math.min(100, b.w / r.contentW * 100)}%">`;
        const inner = b.runs.map(x => { let t = esc(x.text); if (x.bold && !b.style) t = `<b>${t}</b>`; if (x.italic) t = `<i>${t}</i>`; return t; }).join('');
        const tag = b.style ? 'h' + b.style.slice(-1) : 'p';
        return `${b.pageBreak ? '<div class="pb"></div>' : ''}<${tag}${b.align ? ` style="text-align:${b.align}"` : ''}>${b.list ? '• ' : ''}${inner}</${tag}>`;
      }).join('') + (r.body.length > 120 ? '<p style="color:#8b9198">…</p>' : '') + '</div>';
    }
    out.innerHTML = `<p class="kicker">Word document</p><span class="verdict ok">Ready</span><p class="sub">${esc(name)}.docx · ${stats} · ${bytes(blob.size)}</p>
      <div class="btns"><button type="button" class="btn big-btn" id="dl">Download Word file</button></div>${html}`;
    $('#dl').onclick = () => download(blob, `${name}.docx`);
  } catch (e) { out.innerHTML = `<p class="kicker">Word document</p><span class="verdict no">Couldn’t convert this PDF</span><p class="sub">${esc(e.message || String(e))}</p>`; }
  btn.disabled = false;
});
