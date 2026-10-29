// AI Image Upscaler: Real-ESRGAN General x4v3 (assets/models, BSD-3) in onnxruntime-web's background worker.
// The model takes 128×128 tiles and returns 512×512 ones; tiles overlap a little and only their middles are
// kept, so no seams show. 2× is the 4× result reduced by half (sharper than enlarging 2× directly).
const out = $('#out'), T = 128, PAD = 10; // tile size and the overlap kept away from each tile's edges
let img = null, name = 'photo', session = null;
fileDrop($('#drop'), $('#file'), async fs => {
  const f = fs.find(x => x.type.startsWith('image/'));
  if (!f) return;
  try { img = await loadImage(f); } catch (e) { toast(e.message, 'err'); return; }
  name = baseName(f.name);
  $('#loaded').textContent = `${f.name} · ${img.naturalWidth}×${img.naturalHeight} px · ${bytes(f.size)}`;
  $('#go').disabled = false;
  warm();
});
$('#sample').addEventListener('click', async () => {
  // A small, soft sample: a photo shrunk to 240 px, the kind of picture people want to enlarge.
  const big = await loadImage(await sampleImage('image/jpeg')), c = document.createElement('canvas'), k = 240 / Math.max(big.naturalWidth, big.naturalHeight);
  c.width = Math.round(big.naturalWidth * k); c.height = Math.round(big.naturalHeight * k); c.getContext('2d').drawImage(big, 0, 0, c.width, c.height);
  img = await loadImage(await canvasBlob(c, 'image/jpeg', 0.7)); name = 'sample';
  $('#loaded').textContent = `Sample photo · ${c.width}×${c.height} px`; $('#go').disabled = false; $('#go').click();
});
function warm() { if (!session) loadModel().catch(() => {}); }
let loading = null;
function loadModel(onProgress) {
  loading ??= (async () => {
    ort.env.wasm.proxy = true; // the AI works in a background worker, so the page stays smooth
    if (self.crossOriginIsolated) ort.env.wasm.numThreads = Math.min(4, navigator.hardwareConcurrency || 2);
    const r = await fetch(`${window.TF_BASE || ''}/assets/models/realesr-general-x4v3.onnx`);
    if (!r.ok) throw new Error('The AI model couldn’t be downloaded.');
    const total = +r.headers.get('content-length') || 5e6, reader = r.body.getReader(), parts = [];
    let got = 0;
    for (;;) { const { done, value } = await reader.read(); if (done) break; parts.push(value); got += value.length; if (onProgress) onProgress(Math.min(1, got / total)); }
    const buf = new Uint8Array(got); let o = 0; for (const p of parts) { buf.set(p, o); o += p.length; }
    session = await ort.InferenceSession.create(buf, { executionProviders: ['wasm'] });
    return session;
  })().catch(e => { loading = null; throw e; });
  return loading;
}
// One 128×128 tile (edges beyond the picture repeat its last pixels) -> 512×512 pixels.
async function runTile(src, x0, y0) {
  const c = document.createElement('canvas'); c.width = c.height = T;
  const x = c.getContext('2d'), w = Math.min(T, src.width - x0), h = Math.min(T, src.height - y0);
  x.drawImage(src, x0, y0, w, h, 0, 0, w, h);
  if (w < T) x.drawImage(c, w - 1, 0, 1, h, w, 0, T - w, h);
  if (h < T) x.drawImage(c, 0, h - 1, T, 1, 0, h, T, T - h);
  const d = x.getImageData(0, 0, T, T).data, n = T * T, a = new Float32Array(3 * n);
  for (let i = 0; i < n; i++) { a[i] = d[i * 4] / 255; a[n + i] = d[i * 4 + 1] / 255; a[2 * n + i] = d[i * 4 + 2] / 255; }
  const res = await session.run({ [session.inputNames[0]]: new ort.Tensor('float32', a, [1, 3, T, T]) });
  const y = res[session.outputNames[0]].data, N = 4 * T * 4 * T, im = new ImageData(4 * T, 4 * T), p = im.data;
  for (let i = 0; i < N; i++) { p[i * 4] = y[i] * 255; p[i * 4 + 1] = y[N + i] * 255; p[i * 4 + 2] = y[2 * N + i] * 255; p[i * 4 + 3] = 255; }
  return im;
}
$('#go').addEventListener('click', async () => {
  if (!img) return;
  const btn = $('#go'); btn.disabled = true;
  const scale = +$('input[name="scale"]:checked').value;
  out.innerHTML = '<p class="kicker">Upscaling</p><div class="bar"><i style="width:2%"></i></div><p class="sub" data-pct>Getting the AI ready…</p>';
  try {
    await loadModel(p => setProgress(out, p * 0.1, `Downloading the AI… ${Math.round(p * 100)}%`));
    // Very big pictures are reduced first: little to gain, and a lot of work and memory.
    const limit = scale === 4 ? 1000 : 1600, k = Math.min(1, limit / Math.max(img.naturalWidth, img.naturalHeight));
    const src = document.createElement('canvas'); src.width = Math.round(img.naturalWidth * k); src.height = Math.round(img.naturalHeight * k);
    const sx = src.getContext('2d'); sx.imageSmoothingQuality = 'high'; sx.drawImage(img, 0, 0, src.width, src.height);
    const W = src.width, H = src.height, big = document.createElement('canvas'); big.width = W * 4; big.height = H * 4;
    const bx = big.getContext('2d'), step = T - 2 * PAD, cols = Math.max(1, Math.ceil((W - 2 * PAD) / step)), rows = Math.max(1, Math.ceil((H - 2 * PAD) / step)), total = cols * rows;
    const t0 = performance.now();
    let done = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x0 = Math.max(0, Math.min(c * step, W - T)), y0 = Math.max(0, Math.min(r * step, H - T));
      const tile = await runTile(src, x0, y0);
      // Keep the middle of the tile; at the picture's edges keep up to the edge.
      const l = c === 0 ? 0 : PAD, t = r === 0 ? 0 : PAD, rr = Math.min(T, W - x0) - (c === cols - 1 ? 0 : PAD), bb = Math.min(T, H - y0) - (r === rows - 1 ? 0 : PAD);
      bx.putImageData(tile, x0 * 4, y0 * 4, l * 4, t * 4, (rr - l) * 4, (bb - t) * 4);
      done++;
      const left = (performance.now() - t0) / done * (total - done) / 1000;
      setProgress(out, 0.1 + 0.88 * done / total, `Upscaling… ${Math.round(done / total * 100)}%${done > 2 && left > 3 ? ` · about ${Math.ceil(left)} s left` : ''}`);
    }
    // Transparency is enlarged smoothly and put back; 2× is the 4× result reduced by half.
    const res = document.createElement('canvas'); res.width = Math.round(img.naturalWidth * k * scale); res.height = Math.round(img.naturalHeight * k * scale);
    const rx = res.getContext('2d'); rx.imageSmoothingQuality = 'high'; rx.drawImage(big, 0, 0, res.width, res.height);
    const alpha = (() => { const d = sx.getImageData(0, 0, W, H).data; for (let i = 3; i < d.length; i += 4) if (d[i] < 250) return true; return false; })();
    if (alpha) { rx.globalCompositeOperation = 'destination-in'; rx.drawImage(src, 0, 0, res.width, res.height); rx.globalCompositeOperation = 'source-over'; }
    const fmt = $('#fmt').value === 'auto' ? (alpha ? 'image/png' : 'image/jpeg') : $('#fmt').value;
    const blob = await canvasBlob(res, fmt, 0.93), url = URL.createObjectURL(blob);
    const plain = document.createElement('canvas'); plain.width = res.width; plain.height = res.height; plain.getContext('2d').drawImage(img, 0, 0, res.width, res.height);
    const plainUrl = URL.createObjectURL(await canvasBlob(plain, 'image/jpeg', 0.9));
    const secs = ((performance.now() - t0) / 1000).toFixed(1);
    out.innerHTML = `<p class="kicker">Result · drag to compare</p>
      <div class="compare" id="cmp" style="aspect-ratio:${res.width}/${res.height}"><img src="${plainUrl}" alt="Ordinary enlargement"><div class="after"><img src="${url}" alt="AI upscaled"></div><input type="range" min="0" max="100" value="50" aria-label="Compare ordinary and AI enlargement"><span class="handle"></span></div>
      <p class="sub">Left: ordinary enlargement · Right: AI</p>
      <span class="verdict ok">${res.width}×${res.height} px</span><p class="sub">${scale}× · ${bytes(blob.size)} · ${fmt === 'image/png' ? 'PNG' : 'JPG'} · done in ${secs} s${k < 1 ? ' · the original was reduced first to keep this quick' : ''}</p>
      <div class="btns"><button type="button" class="btn big-btn" id="dl">Download ${fmt === 'image/png' ? 'PNG' : 'JPG'}</button></div>`;
    const cmp = $('#cmp'), rng = cmp.querySelector('input'), upd = () => cmp.style.setProperty('--pos', rng.value + '%');
    rng.addEventListener('input', upd); upd();
    $('#dl').onclick = () => download(blob, `${name}-${scale}x.${fmt === 'image/png' ? 'png' : 'jpg'}`);
  } catch (e) { out.innerHTML = `<p class="kicker">Result</p><span class="verdict no">Couldn’t upscale this photo</span><p class="sub">${esc(e.message || String(e))}</p>`; }
  btn.disabled = false;
});
