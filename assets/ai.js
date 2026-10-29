'use strict';
// In-browser AI models (Transformers.js). Models download once from Hugging Face and are then cached by the browser.
// Used by the background remover, passport photo maker and audio transcription tools.
const AI = (() => {
  const LIB = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.5';
  const HERE = (document.currentScript && document.currentScript.src) || '';
  const SAMPLES = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/';
  let lib = null;
  const cache = {};

  async function load() {
    if (!lib) {
      lib = await import(LIB);
      lib.env.allowLocalModels = false;
      // Pages sent with cross-origin isolation (see the AI speed setting in the admin panel) may use every CPU core.
      if (self.crossOriginIsolated) lib.env.backends.onnx.wasm.numThreads = Math.min(8, navigator.hardwareConcurrency || 4);
      // Run the AI in a background worker so the page never freezes (buttons, scrolling, the progress bar)
      // while it works. (WebGPU would be faster on some PCs, but it can't run in the worker and its big model
      // made the whole screen stutter on first use, so every device uses the CPU engine in the worker.)
      lib.env.backends.onnx.wasm.proxy = true;
    }
    return lib;
  }
  // Kept for older callers: the AI always runs on the CPU engine (see load).
  async function device() { return 'wasm'; }
  // Turns Transformers.js download events into one overall percentage.
  function progressTracker(onProgress) {
    const files = {};
    return p => {
      if (!onProgress) return;
      if (p.status === 'progress' && p.total) files[p.file] = [p.loaded, p.total];
      if (p.status === 'done' && files[p.file]) files[p.file][0] = files[p.file][1];
      const v = Object.values(files), total = v.reduce((s, x) => s + x[1], 0), got = v.reduce((s, x) => s + x[0], 0);
      if (total) onProgress(got / total, total);
    };
  }

  // hq: ISNet general (MIT), 8-bit so it runs well on the CPU.
  // fast: U-2-Netp (Apache 2.0), only 4.6 MB, so a first visit gets a result within seconds while hq loads.
  const MODELS = {
    isnet: { id: 'xrds/isnet-general-onnx-int8', dtype: 'q8', size: 44 },
    u2netp: { id: 'BritishWerewolf/U-2-Netp', dtype: 'fp32', size: 5, square: 320 },
  };
  async function pick(quality) { return quality === 'fast' ? 'u2netp' : 'isnet'; }
  async function modelSize(quality) { return MODELS[await pick(quality)].size; }

  // A model loads once per page. The download can start early (preload, while the visitor is still choosing
  // a photo); whoever asks for the model later joins the same download and still sees its progress.
  function loadModel(key) {
    if (!cache[key]) {
      const st = cache[key] = { ready: false, got: 0, total: 0, subs: new Set() };
      const track = progressTracker((frac, total) => { st.got = frac * total; st.total = total; st.subs.forEach(f => f(frac, total)); });
      st.promise = (async () => {
        const t = await load(), m = MODELS[key];
        return Promise.all([
          t.AutoModel.from_pretrained(m.id, { dtype: m.dtype, device: 'wasm', progress_callback: track }),
          m.square ? null : t.AutoProcessor.from_pretrained(m.id),
        ]);
      })().then(r => { st.ready = true; return r; }, e => { delete cache[key]; throw e; });
    }
    return cache[key];
  }
  async function preload(quality = 'hq', onProgress) {
    const st = loadModel(await pick(quality));
    if (onProgress && !st.ready) { st.subs.add(onProgress); if (st.total) onProgress(st.got / st.total, st.total); }
    try { return await st.promise; } finally { st.subs.delete(onProgress); }
  }
  // True on a connection where a big download costs the visitor nothing extra: not mobile data or data saver.
  function unmetered() {
    const c = navigator.connection, mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    return c ? !c.saveData && c.type !== 'cellular' && (!c.effectiveType || c.effectiveType === '4g') && !(mobile && !c.type) : !mobile;
  }
  // Starts loading the AI before the visitor needs it, so a dropped photo is processed straight away.
  // If the best model isn't saved in the browser yet, the small quick one comes first (a few MB), so the first
  // photo gets a result within seconds; the best one follows in the background on an unmetered connection.
  // It starts at once when the model is saved or the connection is unmetered; otherwise (mobile data, data saver)
  // only when the visitor shows interest by touching the drop zone or the sample button.
  // also: an optional loader for anything else the tool needs first (e.g. the face finder), run before the big model.
  function warmUp(quality, els = [], also = null) {
    const want = () => (typeof quality === 'function' ? quality() : quality);
    let started = false;
    const go = async () => {
      if (started) return;
      started = true;
      try {
        const q = want();
        if (q === 'hq' && !(await isCached('hq'))) {
          await preload('fast');
          if (also) await also();
          if (unmetered()) preload('hq').catch(() => {});
        } else await Promise.all([preload(q), also && also()]);
      } catch (e) { started = false; }
    };
    const idle = window.requestIdleCallback ? f => requestIdleCallback(f, { timeout: 3000 }) : f => setTimeout(f, 1500);
    isCached(want()).then(hit => { if (hit || unmetered()) idle(go); });
    els.forEach(el => el && ['pointerenter', 'pointerdown', 'focusin', 'dragenter', 'touchstart'].forEach(ev => el.addEventListener(ev, go, { passive: true })));
  }
  // What to run right now for the best result: 'hq' if it's loaded or saved in the browser, otherwise 'fast'
  // (the caller can then load the sharper one with preload('hq') and run it again).
  async function quickOrBest(quality = 'hq') {
    if (quality !== 'hq') return quality;
    return (await isReady('hq')) || (await isCached('hq')) ? 'hq' : 'fast';
  }
  async function isReady(quality = 'hq') { const st = cache[await pick(quality)]; return !!(st && st.ready); }
  // True when the browser already has the model file from an earlier visit, so loading it costs no data.
  async function isCached(quality = 'hq') {
    try {
      const m = MODELS[await pick(quality)], file = { q8: 'model_quantized', fp16: 'model_fp16' }[m.dtype] || 'model';
      const c = await caches.open('transformers-cache');
      return !!(await c.match(`https://huggingface.co/${m.id}/resolve/main/onnx/${file}.onnx`));
    } catch (e) { return false; }
  }

  // Returns a canvas the size of the image, with the background made transparent.
  async function removeBackground(source, quality = 'hq', onProgress) {
    const t = await load(), key = await pick(quality), st = loadModel(key);
    if (onProgress && !st.ready) { st.subs.add(onProgress); if (st.total) onProgress(st.got / st.total, st.total); }
    let model, processor;
    try { [model, processor] = await st.promise; } finally { st.subs.delete(onProgress); }
    const img = source instanceof HTMLCanvasElement ? source : await toCanvas(source);
    const S = MODELS[key].square;
    // The models look at about 1024 px, so a big photo is shrunk first (much less work for the page).
    const pixel_values = S ? squareInput(t, img, S) : (await processor(t.RawImage.fromCanvas(shrink(img, 1280)))).pixel_values;
    const inputName = (model.sessions.model && model.sessions.model.inputNames[0]) || 'input';
    const outputs = await model({ [inputName]: pixel_values });
    let mt = Object.values(outputs)[0];
    if (S) mt = stretch(t, mt);
    // Some models give probabilities (0–1), others raw scores that need a sigmoid.
    const d0 = mt.data;
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < d0.length; i += 97) { const v = d0[i]; if (v < lo) lo = v; if (v > hi) hi = v; }
    if (lo < -0.01 || hi > 1.01) mt = mt.sigmoid();
    const [mh, mw] = mt.dims.slice(-2), md = mt.data, m8 = new Uint8ClampedArray(mw * mh);
    for (let i = 0; i < m8.length; i++) m8[i] = md[i] * 255;
    try { return await refine(img, { w: mw, h: mh, data: m8 }); } catch (e) { console.warn('Edge clean-up skipped:', e); return plainCut(img, m8, mw, mh); }
  }
  // Clean edges, worked out in a background worker (assets/matte.js): the mask is re-fitted to the photo's
  // edges and the old background's colour is taken out of see-through edge pixels such as hair.
  let matte = null, mseq = 0;
  const waiting = new Map();
  // The worker starts from a copy of its code in memory (a blob), so it is allowed on cross-origin isolated pages.
  let matteCode = null;
  async function matteWorker() {
    if (!matte) {
      let u = new URL('matte.js', HERE || location.href); if (HERE) u.search = new URL(HERE).search; // same version as ai.js
      if (window.TF_MATTE) u = new URL(window.TF_MATTE, location.href); // matte.js's own version, from the page
      matteCode ??= fetch(u).then(r => { if (!r.ok) throw new Error('Edge clean-up code missing'); return r.blob(); }).catch(e => { matteCode = null; throw e; });
      matte = new Worker(URL.createObjectURL(new Blob([await matteCode], { type: 'text/javascript' })));
      matte.onmessage = e => { const p = waiting.get(e.data.id); if (!p) return; waiting.delete(e.data.id); e.data.error ? p.reject(new Error(e.data.error)) : p.resolve(e.data); };
      matte.onerror = e => { waiting.forEach(p => p.reject(new Error('Edge clean-up failed: ' + (e.message || 'worker error')))); waiting.clear(); matte = null; };
    }
    return matte;
  }
  async function refine(img, mask) {
    const w = await matteWorker(), id = ++mseq, msg = { id, mask }, move = []; // the mask is copied, so the fallback can still use it
    if (typeof OffscreenCanvas !== 'undefined' && self.createImageBitmap) { msg.bitmap = await createImageBitmap(img); move.push(msg.bitmap); }
    else {
      const small = shrink(img, 1280), read = c => ({ w: c.width, h: c.height, data: c.getContext('2d').getImageData(0, 0, c.width, c.height).data });
      msg.small = read(small); msg.full = small === img ? null : read(img);
      move.push(msg.small.data.buffer); if (msg.full) move.push(msg.full.data.buffer);
    }
    const r = await new Promise((resolve, reject) => { waiting.set(id, { resolve, reject }); w.postMessage(msg, move); });
    const c = document.createElement('canvas');
    if (r.bitmap) { c.width = r.bitmap.width; c.height = r.bitmap.height; c.getContext('2d').drawImage(r.bitmap, 0, 0); r.bitmap.close(); }
    else { c.width = r.w; c.height = r.h; c.getContext('2d').putImageData(new ImageData(r.data, r.w, r.h), 0, 0); }
    return c;
  }
  // Fallback without the worker: the mask stretched over the photo by the browser's drawing engine.
  function plainCut(img, m8, mw, mh) {
    const m = document.createElement('canvas');
    m.width = mw; m.height = mh;
    const mx = m.getContext('2d'), id = mx.createImageData(mw, mh);
    for (let i = 0; i < mw * mh; i++) id.data[i * 4 + 3] = m8[i];
    mx.putImageData(id, 0, 0);
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0);
    x.globalCompositeOperation = 'destination-in';
    x.imageSmoothingQuality = 'high';
    x.drawImage(m, 0, 0, c.width, c.height);
    x.globalCompositeOperation = 'source-over';
    return c;
  }
  function shrink(img, max) {
    const k = max / Math.max(img.width, img.height);
    if (k >= 1) return img;
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, c.width, c.height);
    return c;
  }

  // The photo squeezed to S×S, scaled the way U-2-Net was trained (ImageNet mean and spread).
  function squareInput(t, img, S) {
    const c = document.createElement('canvas'); c.width = c.height = S;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0, S, S);
    const d = x.getImageData(0, 0, S, S).data, a = new Float32Array(3 * S * S), n = S * S;
    const mean = [0.485, 0.456, 0.406], sd = [0.229, 0.224, 0.225];
    for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) a[k * n + i] = (d[i * 4 + k] / 255 - mean[k]) / sd[k];
    return new t.Tensor('float32', a, [1, 3, S, S]);
  }
  // U-2-Net's mask stretched to the full 0–1 range, as its authors do.
  function stretch(t, mt) {
    const d = mt.data; let lo = Infinity, hi = -Infinity;
    for (const v of d) { if (v < lo) lo = v; if (v > hi) hi = v; }
    const r = hi - lo || 1, o = new Float32Array(d.length);
    for (let i = 0; i < d.length; i++) o[i] = (d[i] - lo) / r;
    return new t.Tensor('float32', o, mt.dims.slice(-3));
  }

  async function toCanvas(src) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('This image couldn’t be opened.')); img.src = typeof src === 'string' ? src : URL.createObjectURL(src); });
    const c = document.createElement('canvas');
    // Very large photos are scaled to 4096 px to keep memory use reasonable on phones.
    const k = Math.min(1, 4096 / Math.max(img.naturalWidth, img.naturalHeight));
    c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c;
  }

  // Speech recognition with Whisper (MIT licence), 8-bit on the CPU engine: tiny ≈ 41 MB, base ≈ 77 MB.
  // audio16k: Float32Array of mono samples at 16 kHz. Returns { text, chunks: [{ timestamp: [start, end], text }] }.
  // words: true gives a time for every word (for subtitles), using the "timestamped" version of the model.
  async function transcribe(audio16k, { model = 'base', language = null, task = 'transcribe', onProgress, words = false } = {}) {
    const t = await load(), id = `onnx-community/whisper-${model}${words ? '_timestamped' : ''}`;
    if (!cache[id]) {
      cache[id] = t.pipeline('automatic-speech-recognition', id, { dtype: 'q8', device: 'wasm', progress_callback: progressTracker(onProgress) })
        .catch(e => { delete cache[id]; throw e; });
    }
    const asr = await cache[id];
    const opts = { task, chunk_length_s: 30, stride_length_s: 5, return_timestamps: words ? 'word' : true };
    if (language) opts.language = language;
    return asr(audio16k, opts);
  }

  // Decodes any audio or video file to 16 kHz mono, the format Whisper needs.
  async function audio16k(file) {
    const buf = await file.arrayBuffer();
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    let decoded;
    try { decoded = await ac.decodeAudioData(buf); } catch (e) { throw new Error('This file has no sound track your browser can read.'); } finally { ac.close(); }
    const off = new OfflineAudioContext(1, Math.ceil(decoded.duration * 16000), 16000);
    const srcNode = off.createBufferSource();
    srcNode.buffer = decoded; srcNode.connect(off.destination); srcNode.start();
    const r = await off.startRendering();
    return { samples: r.getChannelData(0), duration: decoded.duration };
  }

  // Face landmarks with MediaPipe Face Landmarker (Apache 2.0, 3.7 MB). Returns pixel positions of the eyes, chin and forehead.
  const MP = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
  function faceModel() {
    if (!cache.face) {
      cache.face = (async () => {
        const v = await import(MP + '/vision_bundle.mjs');
        const files = await v.FilesetResolver.forVisionTasks(MP + '/wasm');
        return v.FaceLandmarker.createFromOptions(files, { baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task', delegate: 'CPU' }, runningMode: 'IMAGE', numFaces: 1 });
      })().catch(e => { delete cache.face; throw e; });
    }
    return cache.face;
  }
  async function face(canvas) {
    const lm = await faceModel(), res = lm.detect(canvas), pts = res.faceLandmarks && res.faceLandmarks[0];
    if (!pts) return null;
    const P = i => ({ x: pts[i].x * canvas.width, y: pts[i].y * canvas.height });
    const xs = pts.map(p => p.x * canvas.width);
    // 468/473: iris centres; 152: chin; 10: top of the forehead.
    return { eyeL: P(468), eyeR: P(473), chin: P(152), forehead: P(10), left: Math.min(...xs), right: Math.max(...xs) };
  }

  async function sampleBlob(name) {
    const r = await fetch(SAMPLES + name);
    if (!r.ok) throw new Error('The sample couldn’t be downloaded.');
    const b = await r.blob();
    return new File([b], name, { type: b.type || 'application/octet-stream' });
  }

  return { load, device, removeBackground, modelSize, preload, warmUp, unmetered, quickOrBest, isReady, isCached, transcribe, audio16k, face, faceModel, toCanvas, sampleBlob };
})();
