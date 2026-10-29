// Fill PDF Form: lists the form's fields (pdf-lib), writes the answers into the PDF and shows the pages.
const { PDFDocument, PDFTextField, PDFCheckBox, PDFRadioGroup, PDFDropdown, PDFOptionList, PDFName } = PDFLib;
const out = $('#out');
let srcBytes = null, name = 'form', fields = [], font = null, timer = 0;

fileDrop($('#drop'), $('#file'), fs => { const f = fs.find(isPdf); if (f) open(f); });
$('#sample').addEventListener('click', async () => open(await sampleForm()));

async function open(f) {
  let pdf;
  try {
    srcBytes = new Uint8Array(await f.arrayBuffer());
    pdf = await PDFDocument.load(srcBytes, { ignoreEncryption: true, updateMetadata: false });
    if (pdf.isEncrypted) { $('#loaded').innerHTML = `This PDF is password-protected. Unlock it first with <a href="${(window.TF_BASE || '') + '/unlock-pdf'}">Unlock PDF</a>.`; return; }
  } catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged.'; return; }
  name = baseName(f.name);
  const form = pdf.getForm(), pages = pdf.getPages().map(p => p.ref.toString());
  const xfa = !!pdf.catalog.lookup(PDFName.of('AcroForm'))?.lookup?.(PDFName.of('XFA'));
  // Fields in reading order: page, then top to bottom, then left to right.
  fields = form.getFields().map(fl => {
    const w = fl.acroField.getWidgets()[0], r = w && w.getRectangle(), pref = w && w.P();
    let page = pref ? pages.indexOf(pref.toString()) : -1;
    if (page < 0) page = 0;
    return { fl, name: fl.getName(), page, y: r ? -r.y : 0, x: r ? r.x : 0 };
  }).filter(f => [PDFTextField, PDFCheckBox, PDFRadioGroup, PDFDropdown, PDFOptionList].some(T => f.fl instanceof T))
    .sort((a, b) => a.page - b.page || a.y - b.y || a.x - b.x);
  $('#loaded').textContent = `${f.name} · ${pdf.getPageCount()} page${pdf.getPageCount() > 1 ? 's' : ''} · ${fields.length} field${fields.length === 1 ? '' : 's'}`;
  if (!fields.length) {
    $('#fields').innerHTML = `<p class="note">${xfa ? 'This is a dynamic XFA form, which only Adobe Reader can fill.' : 'This PDF has no fillable fields.'} You can still type anywhere on it with <a href="${(window.TF_BASE || '') + '/edit-pdf'}">Edit PDF</a>.</p>`;
    $('#go').disabled = true; $('#flatwrap').hidden = true; preview(); return;
  }
  const label = n => esc(n.replace(/^.*\./, '').replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\[\d+\]$/, '').trim() || n);
  let lastPage = -1;
  $('#fields').innerHTML = fields.map((f, k) => {
    const fl = f.fl, head = f.page !== lastPage ? `<h3>Page ${f.page + 1}</h3>` : '';
    lastPage = f.page;
    const ro = fl.isReadOnly() ? ' disabled' : '';
    if (fl instanceof PDFTextField) {
      const v = esc(fl.getText() || ''), max = fl.getMaxLength();
      return head + (fl.isMultiline() ? `<label class="f"><span>${label(f.name)}</span><textarea data-k="${k}" rows="3"${max ? ` maxlength="${max}"` : ''}${ro}>${v}</textarea></label>`
        : `<label class="f"><span>${label(f.name)}</span><input type="text" data-k="${k}" value="${v}"${max ? ` maxlength="${max}"` : ''}${ro} autocomplete="off"></label>`);
    }
    if (fl instanceof PDFCheckBox) return head + `<label class="ff-check"><input type="checkbox" data-k="${k}"${fl.isChecked() ? ' checked' : ''}${ro}> ${label(f.name)}</label>`;
    if (fl instanceof PDFRadioGroup) { const sel = fl.getSelected(); return head + `<div class="f"><span>${label(f.name)}</span><div class="ff-radios">${fl.getOptions().map(o => `<label class="ff-check"><input type="radio" name="r${k}" data-k="${k}" value="${esc(o)}"${o === sel ? ' checked' : ''}${ro}> ${esc(o)}</label>`).join('')}</div></div>`; }
    const opts = fl.getOptions(), sel = fl.getSelected();
    return head + `<label class="f"><span>${label(f.name)}</span><select data-k="${k}"${fl instanceof PDFOptionList && fl.isMultiselect && fl.isMultiselect() ? ' multiple' : ''}${ro}>${fl instanceof PDFDropdown ? '<option value=""></option>' : ''}${opts.map(o => `<option${sel.includes(o) ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select></label>`;
  }).join('');
  $('#go').disabled = false; $('#flatwrap').hidden = false;
  preview();
}
$('#fields').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(preview, 500); });
$('#fields').addEventListener('change', () => { clearTimeout(timer); timer = setTimeout(preview, 150); });
$('#flat').addEventListener('change', preview);

// The form with the answers written in.
async function build(flatten) {
  const pdf = await PDFDocument.load(srcBytes, { ignoreEncryption: true, updateMetadata: false });
  const form = pdf.getForm(), byName = n => form.getFields().find(x => x.getName() === n);
  let wide = false; // an answer with letters Helvetica doesn't have (Polish, Greek, Cyrillic…)
  for (const [k, f] of fields.entries()) {
    const fl = byName(f.name), els = $$(`#fields [data-k="${k}"]`);
    if (!fl || !els.length || fl.isReadOnly()) continue;
    if (fl instanceof PDFTextField) {
      const v = els[0].value;
      fl.setText(v);
      // Multi-line boxes set to "auto" text size get a normal size, or the text is drawn huge.
      if (fl.isMultiline()) {
        const da = fl.acroField.getDefaultAppearance() || form.acroForm.dict.lookup(PDFName.of('DA'))?.decodeText?.() || '';
        if (!/\d\s+Tf/.test(da) || /(^|\s)0(\.0+)?\s+Tf/.test(da)) fl.setFontSize(11);
      }
      if (/[^\x00-\xFF€‘’“”•–—™]/.test(v)) wide = true;
    } else if (fl instanceof PDFCheckBox) { els[0].checked ? fl.check() : fl.uncheck(); }
    else if (fl instanceof PDFRadioGroup) { const r = els.find(e => e.checked); if (r) fl.select(r.value); }
    else if (fl instanceof PDFDropdown) { if (els[0].value) fl.select(els[0].value); else fl.clear(); }
    else if (fl instanceof PDFOptionList) { const v = [...els[0].selectedOptions].map(o => o.value); if (v.length) fl.select(v); else fl.clear(); }
  }
  // Redraw every field: in Noto Sans (Latin, Greek and Cyrillic) when needed, otherwise the form's usual Helvetica.
  if (wide) { pdf.registerFontkit(fontkit); form.updateFieldAppearances(await pdf.embedFont(font ??= await fontBytes('noto-sans', 400))); } // the whole font: pdf-lib's subsets lose letters in form fields
  else form.updateFieldAppearances();
  if (flatten) form.flatten({ updateFieldAppearances: false });
  return pdf.save({ updateFieldAppearances: false });
}
let pseq = 0;
async function preview() {
  if (!srcBytes) return;
  const id = ++pseq;
  let bytesOut;
  try { bytesOut = fields.length ? await build($('#flat').checked) : srcBytes; } catch (e) { out.innerHTML = `<p class="kicker">Preview</p><span class="verdict no">Couldn’t fill the form</span><p class="sub">${esc(e.message)}</p>`; return; }
  const d = await openPdf(bytesOut);
  if (id !== pseq) return;
  const box = document.createElement('div'); box.className = 'ff-pages';
  for (let i = 1; i <= Math.min(d.numPages, 6); i++) {
    const page = await d.getPage(i), v = page.getViewport({ scale: Math.min(1.5, 700 / page.getViewport({ scale: 1 }).width) }), c = document.createElement('canvas');
    c.width = v.width; c.height = v.height;
    await page.render({ canvasContext: c.getContext('2d'), viewport: v }).promise; // draws the fields with their answers
    if (id !== pseq) return;
    c.setAttribute('aria-label', `Page ${i}`); box.appendChild(c);
  }
  out.innerHTML = `<p class="kicker">Preview${d.numPages > 6 ? ` · first 6 of ${d.numPages} pages` : ''}</p>`;
  out.appendChild(box);
}
$('#go').addEventListener('click', async () => {
  const flat = $('#flat').checked;
  try {
    const b = await build(flat);
    download(new Blob([b], { type: 'application/pdf' }), `${name}-filled${flat ? '-flat' : ''}.pdf`);
  } catch (e) { toast('Couldn’t save the form: ' + e.message, 'err'); }
});

// A small fillable form to try the tool with.
async function sampleForm() {
  const { StandardFonts, rgb } = PDFLib;
  const pdf = await PDFDocument.create(), page = pdf.addPage([595.28, 841.89]), form = pdf.getForm();
  const b = await pdf.embedFont(StandardFonts.HelveticaBold), r = await pdf.embedFont(StandardFonts.Helvetica);
  page.drawText('Membership application', { x: 50, y: 780, size: 22, font: b, color: rgb(0.1, 0.12, 0.14) });
  const lab = (t, y) => page.drawText(t, { x: 50, y, size: 11, font: r, color: rgb(0.25, 0.28, 0.3) });
  const text = (n, t, y, w = 300, h = 22) => { lab(t, y + 26); const f = form.createTextField(n); f.addToPage(page, { x: 50, y, width: w, height: h }); f.setFontSize(11); return f; };
  text('Full name', 'Full name', 700); text('Email', 'Email address', 640); text('Date of birth', 'Date of birth (DD/MM/YYYY)', 580, 160);
  lab('Membership type', 540);
  const type = form.createRadioGroup('Membership type');
  [['Standard', 50], ['Student', 170], ['Family', 290]].forEach(([o, x]) => { type.addOptionToPage(o, page, { x, y: 510, width: 16, height: 16 }); page.drawText(o, { x: x + 22, y: 513, size: 11, font: r }); });
  lab('Country', 470);
  const c = form.createDropdown('Country'); c.addOptions(['United Kingdom', 'United States', 'Pakistan', 'India', 'Canada', 'Australia', 'Other']); c.addToPage(page, { x: 50, y: 440, width: 200, height: 22 });
  const msg = text('Comments', 'Anything we should know?', 330, 495, 80); msg.enableMultiline();
  const t = form.createCheckBox('Agree to terms'); t.addToPage(page, { x: 50, y: 290, width: 16, height: 16 }); page.drawText('I agree to the club rules', { x: 74, y: 293, size: 11, font: r });
  const n = form.createCheckBox('Newsletter'); n.addToPage(page, { x: 50, y: 262, width: 16, height: 16 }); page.drawText('Send me the monthly newsletter', { x: 74, y: 265, size: 11, font: r });
  return new File([await pdf.save()], 'membership-form.pdf', { type: 'application/pdf' });
}
