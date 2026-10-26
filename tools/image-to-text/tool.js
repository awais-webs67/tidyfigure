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

// ---------- Cleaning the picture before reading it ----------
// The text reader works best on large, sharp, black-on-white text. Phone photos have shadows, grain and
// coloured backgrounds, so each page is enlarged, turned grey, flipped to dark-on-light where the text is
// light, and then made pure black and white with a local threshold (Sauvola), which ignores shadows.
function prepare(src) {
  const long = Math.max(src.width, src.height);
  let k = long < 2400 ? Math.min(4, 2400 / long) : 1;
  // About 6 megapixels is plenty for reading text and keeps memory low on phones.
  k = Math.min(k, Math.sqrt(6e6 / (src.width * src.height)));
  const W = Math.max(1, Math.round(src.width * k)), H = Math.max(1, Math.round(src.height * k));
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
  x.imageSmoothingQuality = 'high';
  x.filter = `blur(${0.6 * Math.max(1, k / 2)}px)`; // softens grain without losing letters
  x.drawImage(src, 0, 0, W, H);
  x.filter = 'none';
  const img = x.getImageData(0, 0, W, H), d = img.data, n = W * H, g = new Uint8ClampedArray(n);
  for (let i = 0; i < n; i++) g[i] = (d[i * 4] * 299 + d[i * 4 + 1] * 587 + d[i * 4 + 2] * 114) / 1000;

  // Which way round is the text? In each block the background is the most common shade: if most pixels sit
  // near the dark end, the text is light (white on a blue banner, dark mode) and the block is inverted.
  const bs = Math.max(24, Math.min(96, Math.round(Math.max(W, H) / 40)));
  // Each block is judged together with its neighbours (3 × 3 blocks), so large letters, where one small
  // block can be mostly ink, aren't mistaken for light text on a dark background.
  const bw = Math.ceil(W / bs), bh = Math.ceil(H / bs), pol = new Int8Array(bw * bh), hists = new Uint32Array(bw * bh * 256), hist = new Uint32Array(256);
  for (let y = 0; y < H; y++) { const row = ((y / bs) | 0) * bw; for (let xx = 0; xx < W; xx++) hists[(row + ((xx / bs) | 0)) * 256 + g[y * W + xx]]++; }
  for (let by = 0; by < bh; by++) for (let bx = 0; bx < bw; bx++) {
    hist.fill(0);
    for (let yy = Math.max(0, by - 1); yy <= Math.min(bh - 1, by + 1); yy++) for (let xx = Math.max(0, bx - 1); xx <= Math.min(bw - 1, bx + 1); xx++) {
      const o = (yy * bw + xx) * 256;
      for (let v = 0; v < 256; v++) hist[v] += hists[o + v];
    }
    let cnt = 0;
    for (let v = 0; v < 256; v++) cnt += hist[v];
    const pct = q => { let s = 0; for (let v = 0; v < 256; v++) { s += hist[v]; if (s >= cnt * q) return v; } return 255; };
    const p10 = pct(0.1), p50 = pct(0.5), p90 = pct(0.9);
    pol[by * bw + bx] = p90 - p10 < 40 ? 0 : (p90 - p50 > p50 - p10 ? -1 : 1);
  }
  // Blocks with no text take the most common direction of their neighbours.
  const pol2 = pol.slice();
  for (let by = 0; by < bh; by++) for (let bx = 0; bx < bw; bx++) {
    let s = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const yy = by + dy, xx = bx + dx; if (yy >= 0 && yy < bh && xx >= 0 && xx < bw) s += pol[yy * bw + xx]; }
    pol2[by * bw + bx] = pol[by * bw + bx] || (s < 0 ? -1 : 1);
  }
  for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) if (pol2[((y / bs) | 0) * bw + ((xx / bs) | 0)] < 0) g[y * W + xx] = 255 - g[y * W + xx];

  // Sauvola threshold: a pixel is ink if it's clearly darker than its neighbourhood. The neighbourhood sums
  // slide down the page one row at a time, so memory stays small even for big photos.
  const r = Math.max(8, Math.round(bs * 1.2)), kS = 0.3;
  const colS = new Float64Array(W), colQ = new Float64Array(W), preS = new Float64Array(W + 1), preQ = new Float64Array(W + 1);
  let top = 0, bot = 0;
  for (let y = 0; y < H; y++) {
    const y0 = Math.max(0, y - r), y1 = Math.min(H, y + r + 1);
    for (; bot < y1; bot++) for (let xx = 0; xx < W; xx++) { const v = g[bot * W + xx]; colS[xx] += v; colQ[xx] += v * v; }
    for (; top < y0; top++) for (let xx = 0; xx < W; xx++) { const v = g[top * W + xx]; colS[xx] -= v; colQ[xx] -= v * v; }
    for (let xx = 0; xx < W; xx++) { preS[xx + 1] = preS[xx] + colS[xx]; preQ[xx + 1] = preQ[xx] + colQ[xx]; }
    for (let xx = 0; xx < W; xx++) {
      const x0 = Math.max(0, xx - r), x1 = Math.min(W, xx + r + 1), cnt = (y1 - y0) * (x1 - x0);
      const sum = preS[x1] - preS[x0], sq = preQ[x1] - preQ[x0];
      const m = sum / cnt, sd = Math.sqrt(Math.max(0, sq / cnt - m * m));
      const v = g[y * W + xx] < m * (1 + kS * (sd / 128 - 1)) ? 0 : 255, o = (y * W + xx) * 4;
      d[o] = d[o + 1] = d[o + 2] = v; d[o + 3] = 255;
    }
  }
  x.putImageData(img, 0, 0);
  return { c, k };
}

const chosenLangs = () => [$('#lang').value, $('#lang2').value].filter((v, i, a) => v && a.indexOf(v) === i).join('+');
// Start loading the reader (about 4 MB the first time) as soon as the visitor heads for the drop zone.
['pointerenter', 'focusin', 'dragenter', 'touchstart'].forEach(ev => $('#drop').addEventListener(ev, () => { if (window.Tesseract) getReader(chosenLangs()).catch(() => {}); }, { passive: true }));

// One reader per language choice, kept between files so it doesn't load again each time.
// The promise is stored straight away, so two quick runs share one reader instead of starting two.
let reader = null, readerLangs = '';
function getReader(langs) {
  if (reader && readerLangs === langs) return reader;
  if (reader) reader.then(w => w.terminate()).catch(() => {});
  readerLangs = langs;
  reader = (async () => {
    const w = await Tesseract.createWorker(langs, 1, { logger: m => { if (m.status === 'recognizing text') setProgress(out, m.progress, `Reading text… ${Math.round(m.progress * 100)}%`); else if (/loading|initializ/.test(m.status)) setProgress(out, m.progress || 0, 'Getting the text reader ready…'); } });
    // Find blocks of text anywhere on the page (the default assumes one single block).
    await w.setParameters({ tessedit_pageseg_mode: '3' });
    return w;
  })();
  reader.catch(() => { reader = null; });
  return reader;
}
// Read the cleaned page; if that looks unsure, also read the original and keep whichever is more confident.
async function readPage(w, page) {
  const p = prepare(page);
  let best = { data: (await w.recognize(p.c)).data, k: p.k };
  if (best.data.confidence < 75) {
    const plain = (await w.recognize(page)).data;
    if (plain.confidence > best.data.confidence + 3) best = { data: plain, k: 1 };
  }
  return best;
}

async function run() {
  const id = ++job, langs = chosenLangs();
  out.innerHTML = progressHtml('Getting the text reader ready');
  try {
    const worker = await getReader(langs);
    if (id !== job) return;
    const texts = [];
    let conf = 0, words = [], scale = 1;
    for (let i = 0; i < pages.length; i++) {
      if (pages.length > 1) out.querySelector('.kicker').textContent = `Reading page ${i + 1} of ${pages.length}`;
      const { data, k } = await readPage(worker, pages[i]);
      if (id !== job) return;
      texts.push(data.text.trim());
      conf += data.confidence;
      if (i === 0) { words = data.words; scale = k; }
    }
    const text = texts.join('\n\n— — —\n\n');
    conf /= pages.length;
    // Outline the words found on the first page.
    const c = $('#ocr-c'), x = c.getContext('2d');
    x.drawImage(pages[0], 0, 0);
    x.lineWidth = Math.max(2, c.width / 500);
    words.forEach(w => { x.strokeStyle = w.confidence > 80 ? 'rgba(30,122,76,.8)' : w.confidence > 50 ? 'rgba(163,95,0,.8)' : 'rgba(179,38,30,.8)'; x.strokeRect(w.bbox.x0 / scale, w.bbox.y0 / scale, (w.bbox.x1 - w.bbox.x0) / scale, (w.bbox.y1 - w.bbox.y0) / scale); });
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
    if (reader) { reader.then(w => w.terminate()).catch(() => {}); reader = null; }
  }
}
