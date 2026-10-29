// Word to PDF: docx-preview lays the document out as HTML (off screen); dom-pdf.js reads that layout and
// draws it as PDF pages with real text, cutting long sections into pages between lines.
const out = $('#out');
let file = null;
fileDrop($('#drop'), $('#file'), fs => { const f = fs[0]; if (f) pick(f); });
$('#sample').addEventListener('click', async () => { pick(await sampleDocx()); $('#go').click(); });
function pick(f) {
  if (/\.doc$/i.test(f.name)) { $('#loaded').textContent = 'Old .doc files aren’t supported. Open it in Word, Google Docs or LibreOffice and save it as .docx first.'; file = null; $('#go').disabled = true; return; }
  if (!/\.docx$/i.test(f.name) && !/wordprocessingml/.test(f.type)) { $('#loaded').textContent = 'Choose a Word document (.docx).'; return; }
  file = f; $('#loaded').textContent = `${f.name} · ${bytes(f.size)}`; $('#go').disabled = false;
}
$('#go').addEventListener('click', async () => {
  if (!file) return;
  const btn = $('#go'); btn.disabled = true;
  const stage = $('#stage');
  out.innerHTML = '<p class="kicker">PDF</p><div class="bar"><i style="width:3%"></i></div><p class="sub" data-pct>Opening the document…</p>';
  try {
    stage.innerHTML = '';
    await docx.renderAsync(file, stage, null, { className: 'docx', inWrapper: false, breakPages: true, ignoreLastRenderedPageBreak: true, experimental: true, renderHeaders: true, renderFooters: true, renderFootnotes: true, useBase64URL: true });
    setProgress(out, 0.25, 'Loading the fonts…');
    await DomPdf.prepare(stage);
    await Promise.all([...stage.querySelectorAll('img')].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; })));
    const secs = [...stage.querySelectorAll('section.docx')];
    if (!secs.length) throw new Error('This document has no pages.');
    const pages = secs.map(el => {
      const cs = getComputedStyle(el), w = el.getBoundingClientRect().width, h = parseFloat(cs.minHeight) || w * 1.414;
      return { el, w, h, pad: ['Top', 'Right', 'Bottom', 'Left'].map(s => parseFloat(cs['padding' + s]) || 0), header: el.querySelector(':scope > header'), footer: el.querySelector(':scope > footer') };
    });
    setProgress(out, 0.4, 'Drawing the pages…');
    const name = baseName(file.name);
    const pdfBytes = await DomPdf.render(pages, { title: name, onProgress: n => setProgress(out, Math.min(0.95, 0.4 + n * 0.05), `Drawing page ${n}…`) });
    stage.innerHTML = '';
    await showPdfResult(out, pdfBytes, { title: 'PDF', name: `${name}.pdf`, label: 'Download PDF', headline: '<span class="verdict ok">Converted</span>' });
  } catch (e) {
    stage.innerHTML = '';
    out.innerHTML = `<p class="kicker">PDF</p><span class="verdict no">Couldn’t convert this document</span><p class="sub">${esc(e.message || String(e))}</p><p class="note">Check that it’s a .docx file that opens in Word. Password-protected documents can’t be converted.</p>`;
  }
  btn.disabled = false;
});

// A sample .docx: a letter with a heading, coloured text, a bulleted list and a table.
async function sampleDocx() {
  const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
  const p = (t, o = '') => `<w:p>${o ? `<w:pPr>${o}</w:pPr>` : ''}${t}</w:p>`;
  const r = (t, o = '') => `<w:r>${o ? `<w:rPr>${o}</w:rPr>` : ''}<w:t xml:space="preserve">${t}</w:t></w:r>`;
  const cell = (t, shade) => `<w:tc><w:tcPr><w:tcW w:w="3000" w:type="dxa"/>${shade ? `<w:shd w:val="clear" w:color="auto" w:fill="${shade}"/>` : ''}</w:tcPr>${p(r(t, shade ? '<w:b/>' : ''))}</w:tc>`;
  const border = ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(e => `<w:${e} w:val="single" w:sz="4" w:color="999999"/>`).join('');
  const body = [
    p(r('Welcome pack', '<w:b/><w:color w:val="1F3864"/><w:sz w:val="44"/>')),
    p(r('Sunrise Community Garden · Spring 2026', '<w:i/><w:color w:val="C55A11"/>')),
    p(r('Dear new member,')),
    p(r('Thank you for joining the garden. This pack explains how plots are shared, when the gates are open and how to book the tool shed. Please read it before your first visit and keep it somewhere handy.'), '<w:jc w:val="both"/>'),
    p(r('Before you start', '<w:b/><w:sz w:val="28"/><w:color w:val="1F3864"/>'), '<w:spacing w:before="240"/>'),
    ...['Collect your gate key from the office.', 'Choose a plot on the map in the shed.', 'Bring gloves: tools are provided.'].map(t => p(r(t), '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>')),
    p(r('Opening times', '<w:b/><w:sz w:val="28"/><w:color w:val="1F3864"/>'), '<w:spacing w:before="240"/>'),
    `<w:tbl><w:tblPr><w:tblW w:w="9000" w:type="dxa"/><w:tblBorders>${border}</w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="3000"/><w:gridCol w:w="3000"/><w:gridCol w:w="3000"/></w:tblGrid>` +
      [['Day', 'Opens', 'Closes'], ['Monday to Friday', '8:00', '19:00'], ['Saturday', '9:00', '17:00'], ['Sunday', '10:00', '16:00']].map((row, i) => `<w:tr>${row.map(t => cell(t, i ? '' : 'DEEAF6')).join('')}</w:tr>`).join('') + '</w:tbl>',
    p(r('')),
    p(r('We look forward to seeing you!', '<w:u w:val="single"/>'), '<w:jc w:val="center"/>'),
  ].join('');
  const zip = new JSZip();
  zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>');
  zip.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
  zip.file('word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');
  zip.file('word/styles.xml', `<?xml version="1.0" encoding="UTF-8"?><w:styles ${W}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="160" w:line="259" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults></w:styles>`);
  zip.file('word/numbering.xml', `<?xml version="1.0" encoding="UTF-8"?><w:numbering ${W}><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`);
  zip.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8"?><w:document ${W}><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708"/></w:sectPr></w:body></w:document>`);
  return new File([await zip.generateAsync({ type: 'blob' })], 'welcome-pack.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}
