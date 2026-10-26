'use strict';
// In-browser AI models (Transformers.js). Models download once from Hugging Face and are then cached by the browser.
// Used by the background remover, passport photo maker and audio transcription tools.
const AI = (() => {
  const LIB = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.5';
  const SAMPLES = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/';
  let lib = null;
  const cache = {};

  async function load() {
    if (!lib) {
      lib = await import(LIB);
      lib.env.allowLocalModels = false;
      // Pages sent with cross-origin isolation (see the AI speed setting in the admin panel) may use every CPU core.
      if (self.crossOriginIsolated) lib.env.backends.onnx.wasm.numThreads = Math.min(8, navigator.hardwareConcurrency || 4);
      // On the CPU, run the AI in a background worker so the page stays responsive (progress bar, scrolling)
      // while it works. With WebGPU the graphics chip does the work, and the worker mode doesn't support it.
      gpu ??= (await device()) === 'webgpu';
      lib.env.backends.onnx.wasm.proxy = !gpu;
    }
    return lib;
  }
  // WebGPU is much faster where available (recent Chrome/Edge). The GPU model uses 16-bit numbers, which some
  // graphics chips can't do (no 'shader-f16'); those, and everything else, use WebAssembly on the CPU.
  async function device() {
    try { const a = navigator.gpu && await navigator.gpu.requestAdapter(); if (a && a.features.has('shader-f16')) return 'webgpu'; } catch (e) { /* no WebGPU */ }
    return 'wasm';
  }
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

  // hq on WebGPU: BiRefNet lite (MIT), the sharpest. hq without WebGPU: ISNet general (MIT), 8-bit so it runs well on CPU.
  // fast: MODNet (Apache 2.0), made for portraits.
  const MODELS = {
    birefnet: { id: 'onnx-community/BiRefNet_lite-ONNX', dtype: 'fp16', size: 115 },
    isnet: { id: 'xrds/isnet-general-onnx-int8', dtype: 'q8', size: 44 },
    modnet: { id: 'Xenova/modnet', dtype: 'q8', size: 7 },
  };
  let gpu = null;
  async function pick(quality) {
    if (quality === 'fast') return 'modnet';
    gpu ??= (await device()) === 'webgpu';
    return gpu ? 'birefnet' : 'isnet';
  }
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
          t.AutoModel.from_pretrained(m.id, { dtype: m.dtype, device: key === 'birefnet' ? 'webgpu' : 'wasm', progress_callback: track }),
          t.AutoProcessor.from_pretrained(m.id),
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
  // Starts loading the model before the visitor needs it, so a dropped photo is processed straight away:
  // at once when the browser already has it saved, or on a fast, unmetered connection; otherwise (mobile data,
  // data saver) only when they show interest by touching the drop zone or the sample button.
  function warmUp(quality, els = []) {
    let started = false;
    const go = () => { if (started) return; started = true; preload(typeof quality === 'function' ? quality() : quality).catch(() => { started = false; }); };
    const c = navigator.connection, mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const unmetered = c ? !c.saveData && c.type !== 'cellular' && (!c.effectiveType || c.effectiveType === '4g') && !(mobile && !c.type) : !mobile;
    const idle = window.requestIdleCallback ? f => requestIdleCallback(f, { timeout: 3000 }) : f => setTimeout(f, 1500);
    isCached(typeof quality === 'function' ? quality() : quality).then(hit => { if (hit || unmetered) idle(go); });
    els.forEach(el => el && ['pointerenter', 'pointerdown', 'focusin', 'dragenter', 'touchstart'].forEach(ev => el.addEventListener(ev, go, { passive: true })));
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
    const t = await load(), st = loadModel(await pick(quality));
    if (onProgress && !st.ready) { st.subs.add(onProgress); if (st.total) onProgress(st.got / st.total, st.total); }
    let model, processor;
    try { [model, processor] = await st.promise; } finally { st.subs.delete(onProgress); }
    const img = source instanceof HTMLCanvasElement ? source : await toCanvas(source);
    const { pixel_values } = await processor(t.RawImage.fromCanvas(img));
    const inputName = (model.sessions.model && model.sessions.model.inputNames[0]) || 'input';
    const outputs = await model({ [inputName]: pixel_values });
    let mt = Object.values(outputs)[0];
    mt = mt.dims.length === 4 ? mt[0] : mt;
    // Some models give probabilities (0–1), others raw scores that need a sigmoid.
    const d0 = mt.data;
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < d0.length; i += 97) { const v = d0[i]; if (v < lo) lo = v; if (v > hi) hi = v; }
    if (lo < -0.01 || hi > 1.01) mt = mt.sigmoid();
    const mask = await t.RawImage.fromTensor(mt.mul(255).to('uint8')).resize(img.width, img.height);
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height);
    for (let i = 0; i < mask.data.length; i++) d.data[i * 4 + 3] = mask.data[i];
    x.putImageData(d, 0, 0);
    return c;
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
  async function transcribe(audio16k, { model = 'base', language = null, task = 'transcribe', onProgress } = {}) {
    const t = await load(), id = `onnx-community/whisper-${model}`;
    if (!cache[id]) {
      cache[id] = t.pipeline('automatic-speech-recognition', id, { dtype: 'q8', device: 'wasm', progress_callback: progressTracker(onProgress) })
        .catch(e => { delete cache[id]; throw e; });
    }
    const asr = await cache[id];
    const opts = { task, chunk_length_s: 30, stride_length_s: 5, return_timestamps: true };
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
  async function face(canvas) {
    if (!cache.face) {
      cache.face = (async () => {
        const v = await import(MP + '/vision_bundle.mjs');
        const files = await v.FilesetResolver.forVisionTasks(MP + '/wasm');
        return v.FaceLandmarker.createFromOptions(files, { baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task', delegate: 'CPU' }, runningMode: 'IMAGE', numFaces: 1 });
      })().catch(e => { delete cache.face; throw e; });
    }
    const lm = await cache.face, res = lm.detect(canvas), pts = res.faceLandmarks && res.faceLandmarks[0];
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

  return { load, device, removeBackground, modelSize, preload, warmUp, isReady, isCached, transcribe, audio16k, face, toCanvas, sampleBlob };
})();
