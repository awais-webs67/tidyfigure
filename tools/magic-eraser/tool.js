// Magic Eraser: MI-GAN (assets/models, MIT) in onnxruntime-web's background worker. The model takes the whole
// photo and a mask (255 keep, 0 fill) as bytes and returns the whole photo with the holes filled; it works on
// a 512 px crop around the holes itself. Brush strokes are drawn on a mask canvas at the photo's full size.
const out = $('#out');
let photo = null, name = 'photo', history = [], strokes = null, brush = 40, session = null, loading = null;
fileDrop($('#drop'), $('#file'), async fs => { const f = fs.find(x => x.type.startsWith('image/')); if (!f) return; try { start(await loadImage(f), baseName(f.name)); } catch (e) { toast(e.message, 'err'); } });
$('#sample').addEventListener('click', async () => start(await sampleImg(), 'sample'));
['pointerenter', 'focusin', 'touchstart'].forEach(ev => $('#drop').addEventListener(ev, () => { if (AIok()) model().catch(() => {}); }, { passive: true }));
const AIok = () => typeof ort !== 'undefined';
function model(onProgress) {
  loading ??= (async () => {
    ort.env.wasm.proxy = true;
    if (self.crossOriginIsolated) ort.env.wasm.numThreads = Math.min(4, navigator.hardwareConcurrency || 2);
    const r = await fetch(`${window.TF_BASE || ''}/assets/models/migan-pipeline-v2.onnx`);
    if (!r.ok) throw new Error('The AI couldn’t be downloaded.');
    const total = +r.headers.get('content-length') || 28e6, rd = r.body.getReader(), parts = [];
    let got = 0;
    for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); got += value.length; if (onProgress) onProgress(Math.min(1, got / total)); }
    const buf = new Uint8Array(got); let o = 0; for (const p of parts) { buf.set(p, o); o += p.length; }
    session = await ort.InferenceSession.create(buf, { executionProviders: ['wasm'] });
    return session;
  })().catch(e => { loading = null; throw e; });
  return loading;
}
function start(img, n) {
  name = n;
  const k = Math.min(1, 4096 / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
  photo = document.createElement('canvas'); photo.width = Math.round((img.naturalWidth || img.width) * k); photo.height = Math.round((img.naturalHeight || img.height) * k);
  photo.getContext('2d').drawImage(img, 0, 0, photo.width, photo.height);
  history = [photo];
  brush = Math.max(12, Math.round(Math.max(photo.width, photo.height) / 30));
  $('#loaded').textContent = `${photo.width}×${photo.height} px · paint over what you want to remove`;
  editor();
  if (AIok()) model().catch(() => {});
}
function editor() {
  const cur = history[history.length - 1];
  out.innerHTML = `<p class="kicker">Paint over what you want to remove</p>
    <div class="me-bar"><label>Brush <input type="range" id="bs" min="4" max="${Math.round(Math.max(cur.width, cur.height) / 6)}" value="${brush}"></label>
      <button type="button" class="btn ghost" id="undo-s" disabled>Undo stroke</button><button type="button" class="btn ghost" id="clear" disabled>Clear</button></div>
    <div class="me-stage" id="stage"><div class="me-ring" id="ring"></div></div>
    <div class="btns"><button type="button" class="btn big-btn" id="erase" disabled>Erase</button><button type="button" class="btn ghost" id="cmp" ${history.length > 1 ? '' : 'disabled'}>Hold to compare</button><button type="button" class="btn ghost" id="undo" ${history.length > 1 ? '' : 'disabled'}>Undo erase</button><button type="button" class="btn ghost" id="dl">Download</button></div>
    <p class="sub" id="msg">${cur.width}×${cur.height} px${history.length > 1 ? ` · ${history.length - 1} erase${history.length > 2 ? 's' : ''}` : ''}</p>`;
  const st = $('#stage'), view = document.createElement('canvas'), paint = document.createElement('canvas');
  view.width = paint.width = cur.width; view.height = paint.height = cur.height;
  view.getContext('2d').drawImage(cur, 0, 0);
  paint.className = 'me-paint'; view.setAttribute('aria-label', 'Photo'); paint.setAttribute('aria-label', 'Paint over what to remove');
  st.prepend(view); st.appendChild(paint);
  const px = paint.getContext('2d');
  strokes = [];
  const redraw = () => {
    px.clearRect(0, 0, paint.width, paint.height); px.strokeStyle = '#ff2d55'; px.fillStyle = '#ff2d55'; px.lineCap = px.lineJoin = 'round';
    for (const s of strokes) { px.lineWidth = s.w; px.beginPath(); s.pts.forEach(([x, y], i) => (i ? px.lineTo(x, y) : px.moveTo(x, y))); if (s.pts.length === 1) { px.arc(s.pts[0][0], s.pts[0][1], s.w / 2, 0, 7); px.fill(); } else px.stroke(); }
    $('#erase').disabled = $('#clear').disabled = $('#undo-s').disabled = !strokes.length;
  };
  const at = e => { const r = paint.getBoundingClientRect(); return [(e.clientX - r.left) * paint.width / r.width, (e.clientY - r.top) * paint.height / r.height]; };
  let s = null;
  const ring = $('#ring');
  const showRing = e => { const r = paint.getBoundingClientRect(), d = brush * r.width / paint.width; Object.assign(ring.style, { display: 'block', left: `${e.clientX - r.left}px`, top: `${e.clientY - r.top}px`, width: `${d}px`, height: `${d}px` }); };
  paint.addEventListener('pointerdown', e => { e.preventDefault(); paint.setPointerCapture(e.pointerId); s = { w: brush, pts: [at(e)] }; strokes.push(s); redraw(); });
  paint.addEventListener('pointermove', e => { showRing(e); if (!s) return; s.pts.push(at(e)); redraw(); });
  paint.addEventListener('pointerleave', () => { ring.style.display = 'none'; });
  ['pointerup', 'pointercancel'].forEach(ev => paint.addEventListener(ev, () => { s = null; }));
  $('#bs').oninput = e => { brush = +e.target.value; };
  $('#undo-s').onclick = () => { strokes.pop(); redraw(); };
  $('#clear').onclick = () => { strokes = []; redraw(); };
  $('#undo').onclick = () => { if (history.length > 1) { history.pop(); editor(); } };
  const cmp = $('#cmp');
  const showOrig = on => { view.getContext('2d').drawImage(on ? history[0] : history[history.length - 1], 0, 0); };
  ['pointerdown'].forEach(ev => cmp.addEventListener(ev, () => showOrig(true)));
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => cmp.addEventListener(ev, () => showOrig(false)));
  $('#dl').onclick = async () => { const c = history[history.length - 1]; download(await canvasBlob(c, 'image/jpeg', 0.95), `${name}-cleaned.jpg`); };
  $('#erase').onclick = () => erase(cur);
}
async function erase(cur) {
  const btn = $('#erase'), msg = $('#msg');
  btn.disabled = true;
  try {
    if (!session) { msg.textContent = 'Downloading the AI…'; await model(p => { msg.textContent = `Downloading the AI… ${Math.round(p * 100)}%`; }); }
    msg.textContent = 'Erasing…';
    const W = cur.width, H = cur.height, m = document.createElement('canvas'); m.width = W; m.height = H;
    const mx = m.getContext('2d'); mx.fillStyle = '#fff'; mx.fillRect(0, 0, W, H); mx.strokeStyle = mx.fillStyle = '#000'; mx.lineCap = mx.lineJoin = 'round';
    // A little wider than painted, so the edges of the object go too.
    for (const s of strokes) { mx.lineWidth = s.w * 1.15 + 4; mx.beginPath(); s.pts.forEach(([x, y], i) => (i ? mx.lineTo(x, y) : mx.moveTo(x, y))); if (s.pts.length === 1) { mx.arc(s.pts[0][0], s.pts[0][1], s.w * 0.6 + 2, 0, 7); mx.fill(); } else mx.stroke(); }
    const id = cur.getContext('2d').getImageData(0, 0, W, H).data, md = mx.getImageData(0, 0, W, H).data, n = W * H;
    const img = new Uint8Array(3 * n), mask = new Uint8Array(n);
    for (let i = 0; i < n; i++) { img[i] = id[i * 4]; img[n + i] = id[i * 4 + 1]; img[2 * n + i] = id[i * 4 + 2]; mask[i] = md[i * 4] > 127 ? 255 : 0; }
    const t0 = performance.now();
    const res = await session.run({ image: new ort.Tensor('uint8', img, [1, 3, H, W]), mask: new ort.Tensor('uint8', mask, [1, 1, H, W]) });
    const o = res[session.outputNames[0]].data, c = document.createElement('canvas'); c.width = W; c.height = H;
    const im = c.getContext('2d').createImageData(W, H);
    for (let i = 0; i < n; i++) { im.data[i * 4] = o[i]; im.data[i * 4 + 1] = o[n + i]; im.data[i * 4 + 2] = o[2 * n + i]; im.data[i * 4 + 3] = 255; }
    c.getContext('2d').putImageData(im, 0, 0);
    history.push(c);
    editor();
    toast(`Erased in ${((performance.now() - t0) / 1000).toFixed(1)} s`);
  } catch (e) { msg.textContent = 'Couldn’t erase: ' + (e.message || e); btn.disabled = false; }
}
// A sample: a landscape with a date stamp and a red sticker to remove.
async function sampleImg() {
  const img = await loadImage(await sampleImage('image/jpeg')), c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  const s = c.width / 1000;
  x.font = `bold ${44 * s}px monospace`; x.fillStyle = '#ffb000'; x.fillText('2026 06 14  17:42', c.width - 470 * s, c.height - 40 * s);
  x.fillStyle = '#e11d48'; x.beginPath(); x.arc(c.width * 0.28, c.height * 0.3, 55 * s, 0, 7); x.fill();
  x.fillStyle = '#fff'; x.font = `bold ${30 * s}px Arial`; x.textAlign = 'center'; x.fillText('SALE', c.width * 0.28, c.height * 0.3 + 10 * s);
  const im = new Image(); im.src = c.toDataURL('image/jpeg', 0.92); await im.decode(); return im;
}
