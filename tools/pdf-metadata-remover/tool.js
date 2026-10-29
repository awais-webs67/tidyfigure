let { PDFDocument, PDFName } = {};
onLibs(() => ({ PDFDocument, PDFName } = PDFLib));
const KEYS = ['title', 'author', 'subject', 'keywords', 'creator', 'producer'];
let file = null, srcBytes = null;
const out = $('#out');
const fmtDate = d => (d ? d.toLocaleString() : '');

async function open(f) {
  if (!isPdf(f)) return;
  try {
    srcBytes = new Uint8Array(await f.arrayBuffer());
    const pdf = await PDFDocument.load(srcBytes, { ignoreEncryption: true, updateMetadata: false });
    file = f;
    const info = {
      title: pdf.getTitle(), author: pdf.getAuthor(), subject: pdf.getSubject(), keywords: pdf.getKeywords(),
      creator: pdf.getCreator(), producer: pdf.getProducer(), created: pdf.getCreationDate(), modified: pdf.getModificationDate(),
    };
    const xmp = !!pdf.catalog.get(PDFName.of('Metadata'));
    KEYS.forEach(k => { $('#m-' + k).value = info[k] || ''; });
    $('#fields').hidden = false; $('#wipe').disabled = false; $('#savefields').disabled = false;
    $('#loaded').textContent = `${f.name} · ${pdf.getPageCount()} pages`;
    const rows = [...KEYS.map(k => [k[0].toUpperCase() + k.slice(1), info[k]]), ['Created', fmtDate(info.created)], ['Modified', fmtDate(info.modified)], ['XMP metadata block', xmp ? 'Present' : '']];
    const found = rows.filter(r => r[1]).length;
    out.innerHTML = `<p class="kicker">Hidden properties</p><span class="verdict ${found ? 'tight' : 'ok'}">${found ? `${found} item${found > 1 ? 's' : ''} found` : 'No metadata'}</span>
      <div class="scroll"><table class="tbl"><tbody>${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v ? esc(String(v)) : '<span class="note">empty</span>'}</td></tr>`).join('')}</tbody></table></div>`;
  } catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged or password-protected.'; }
}

async function save(clear) {
  const pdf = await PDFDocument.load(srcBytes, { ignoreEncryption: true, updateMetadata: false });
  const v = k => (clear ? '' : $('#m-' + k).value.trim());
  pdf.setTitle(v('title')); pdf.setAuthor(v('author')); pdf.setSubject(v('subject'));
  pdf.setKeywords(v('keywords') ? v('keywords').split(/\s*,\s*|\s+/) : []);
  pdf.setCreator(v('creator')); pdf.setProducer(v('producer'));
  if (clear) {
    // Remove the Info dictionary dates and the separate XMP metadata stream too.
    const info = pdf.getInfoDict();
    ['CreationDate', 'ModDate', 'Title', 'Author', 'Subject', 'Keywords', 'Creator', 'Producer', 'Trapped'].forEach(k => info.delete(PDFName.of(k)));
    pdf.catalog.delete(PDFName.of('Metadata'));
  }
  const saved = await pdf.save({ updateFieldAppearances: false });
  // Re-open the new file and list what's left, so people can check before downloading.
  const back = await PDFDocument.load(saved, { ignoreEncryption: true, updateMetadata: false });
  const left = [['Title', back.getTitle()], ['Author', back.getAuthor()], ['Subject', back.getSubject()], ['Keywords', back.getKeywords()], ['Creator', back.getCreator()], ['Producer', back.getProducer()], ['Created', back.getCreationDate()], ['Modified', back.getModificationDate()]].filter(r => r[1]);
  const blob = new Blob([saved], { type: 'application/pdf' }), name = `${baseName(file.name)}-${clear ? 'clean' : 'edited'}.pdf`;
  out.innerHTML = `<p class="kicker">New file</p><span class="verdict ${left.length ? 'tight' : 'ok'}">${left.length ? `${left.length} propert${left.length > 1 ? 'ies' : 'y'} kept` : 'No metadata left'}</span>
    ${left.length ? `<div class="scroll"><table class="tbl"><tbody>${left.map(([k, v]) => `<tr><td>${k}</td><td>${esc(v instanceof Date ? v.toLocaleString() : String(v))}</td></tr>`).join('')}</tbody></table></div>` : '<p class="sub">We re-opened the new file: title, author, software and dates are all gone.</p>'}
    <p class="sub">${esc(name)} · ${bytes(blob.size)}</p><div class="btns"><button type="button" class="btn big-btn" id="dl">Download ${clear ? 'clean' : 'edited'} PDF</button></div>`;
  $('#dl').onclick = () => download(blob, name);
}

fileDrop($('#drop'), $('#file'), fs => open(fs[0]));
$('#sample').addEventListener('click', async () => open(await samplePdf(2)));
$('#wipe').addEventListener('click', () => save(true));
$('#savefields').addEventListener('click', () => save(false));
