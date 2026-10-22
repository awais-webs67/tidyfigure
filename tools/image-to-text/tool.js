const out = $('#out'), prev = $('#preview');
let pages = [], name = 'text', job = 0;
fileDrop($('#drop'), $('#file'), files => files[0] && start(files[0]));
document.addEventListener('paste', e => { const f = [...(e.clipboardData || {}).files || []].find(x => x.type.startsWith('image/')); if (f) start(new File([f], 'pasted-image.png', { type: f.type })); });
// A photo-like sample page with a heading and a paragraph.
$('#sample').addEventListener('click', async () => {
  const c = document.createElement('canvas'); c.width = 1400; c.height = 820;
  const x = c.getContext('2d');
  x.fillStyle = '#fbfaf6'; x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = '#1d1d1f'; x.font = 'bold 54px Georgia, serif'; x.fillText('The Art of Clear Writing', 90, 130);
  x.font = '34px Georgia, serif'; x.fillStyle = '#333';
  const words = 'Good writing is clear thinking made visible. Before you write a single word, decide what you want the reader to know and why it matters to them. Use short sentences and everyday words. Cut anything that does not help the reader understand your point. Finally, read your draft out loud: if you stumble over a sentence, your reader will too.'.split(' ');
  let line = '', y = 220;
  for (const w of words) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > 1220) { x.fillText(line, 90, y); y += 56; line = w; } else line = t; }
  x.fillText(line, 90, y);
  x.font = 'italic 28px Georgia, serif'; x.fillStyle = '#666'; x.fillText('Page 14', 90, 760);
  start(new File([await canvasBlob(c, 'image/png')], 'sample-page.png', { type: 'image/png' }));
});
onAny('#lang, #lang2', () => { if (pages.length) run(); });

async function start(f) {
  name = baseName(f.name);
  pages = [];
  out.innerHTML = '<p class="kicker">Extracted text</p><p class="sub">Opening the file…</p>';
  if (isPdf(f)) {
    const doc = await openPdf(new Uint8Array(await f.arrayBuffer()));
    for (let i = 1; i <= Math.min(doc.numPages, 30); i++) pages.push(await renderPdfPage(doc, i, 2));
    if (doc.numPages > 30) out.insertAdjacentHTML('beforeend', '<p class="note">Only the first 30 pages are read.</p>');
  } else {
    pages.push(await AI.toCanvas(f));
  }
  prev.hidden = false;
  prev.innerHTML = `<p class="kicker">Preview${pages.length > 1 ? ` · ${pages.length} pages` : ''}</p><div class="ocr-stage"><canvas id="ocr-c"></canvas></div>`;
  const c = $('#ocr-c'); c.width = pages[0].width; c.height = pages[0].height; c.getContext('2d').drawImage(pages[0], 0, 0);
  run();
}

async function run() {
  const id = ++job, langs = [$('#lang').value, $('#lang2').value].filter((v, i, a) => v && a.indexOf(v) === i).join('+');
  out.innerHTML = progressHtml('Loading the text reader');
  let worker;
  try {
    worker = await Tesseract.createWorker(langs, 1, { logger: m => { if (id !== job) return; if (m.status === 'recognizing text') setProgress(out, m.progress, `Reading text… ${Math.round(m.progress * 100)}%`); else if (/loading|initializ/.test(m.status)) setProgress(out, m.progress || 0, m.status.replace(/^\w/, c => c.toUpperCase()) + '…'); } });
    const texts = [];
    let conf = 0, words = [];
    for (let i = 0; i < pages.length; i++) {
      if (pages.length > 1) out.querySelector('.kicker').textContent = `Reading page ${i + 1} of ${pages.length}`;
      const { data } = await worker.recognize(pages[i]);
      if (id !== job) return;
      texts.push(data.text.trim());
      conf += data.confidence;
      if (i === 0) words = data.words;
    }
    const text = texts.join('\n\n— — —\n\n');
    conf /= pages.length;
    // Outline the words found on the first page.
    const c = $('#ocr-c'), x = c.getContext('2d');
    x.drawImage(pages[0], 0, 0);
    x.lineWidth = Math.max(2, c.width / 500);
    words.forEach(w => { x.strokeStyle = w.confidence > 80 ? 'rgba(30,122,76,.8)' : w.confidence > 50 ? 'rgba(163,95,0,.8)' : 'rgba(179,38,30,.8)'; x.strokeRect(w.bbox.x0, w.bbox.y0, w.bbox.x1 - w.bbox.x0, w.bbox.y1 - w.bbox.y0); });
    const n = (text.match(/\S+/g) || []).length;
    out.innerHTML = `<p class="kicker">Extracted text</p>
      <textarea id="txt" class="ocr-text" spellcheck="true" ${/urd|ara|fas/.test(langs) ? 'dir="auto"' : ''}>${esc(text)}</textarea>
      <p class="sub">${n.toLocaleString()} word${n === 1 ? '' : 's'} · ${text.length.toLocaleString()} characters · accuracy about ${Math.round(conf)}%</p>
      <div class="btns"><button type="button" class="btn" id="copy">Copy text</button><button type="button" class="btn ghost" id="dl">Download .txt</button></div>
      ${conf < 70 ? '<p class="note">Low accuracy: try a sharper, straighter photo with even light, or check the language setting.</p>' : '<p class="note">Green boxes on the preview are words read with high confidence; orange and red ones are worth checking.</p>'}`;
    $('#copy').onclick = e => copyText($('#txt').value, e.currentTarget);
    $('#dl').onclick = () => download(new Blob([$('#txt').value], { type: 'text/plain;charset=utf-8' }), `${name}.txt`);
  } catch (e) {
    out.innerHTML = `<p class="kicker">Extracted text</p><span class="verdict no">Couldn’t read the text</span><p class="sub">${esc(e.message || String(e))}</p>`;
  } finally {
    if (worker) worker.terminate();
  }
}
