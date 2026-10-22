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
    }
    return lib;
  }
  // WebGPU is much faster where available (recent Chrome/Edge); everything else uses WebAssembly.
  async function device() {
    try { if (navigator.gpu && await navigator.gpu.requestAdapter()) return 'webgpu'; } catch (e) { /* no WebGPU */ }
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

  // Returns a canvas the size of the image, with the background made transparent.
  async function removeBackground(source, quality = 'hq', onProgress) {
    const t = await load(), key = await pick(quality), m = MODELS[key];
    if (!cache[key]) {
      cache[key] = Promise.all([
        t.AutoModel.from_pretrained(m.id, { dtype: m.dtype, device: key === 'birefnet' ? 'webgpu' : 'wasm', progress_callback: progressTracker(onProgress) }),
        t.AutoProcessor.from_pretrained(m.id),
      ]).catch(e => { delete cache[key]; throw e; });
    }
    const [model, processor] = await cache[key];
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

  // Speech recognition with Whisper. Returns { text, chunks: [{ timestamp: [start, end], text }] }.
  async function transcribe(audio16k, { model = 'base', language = null, task = 'transcribe', onProgress } = {}) {
    const t = await load(), id = `onnx-community/whisper-${model}`;
    if (!cache[id]) {
      const dev = await device();
      cache[id] = t.pipeline('automatic-speech-recognition', id, { dtype: dev === 'webgpu' ? { encoder_model: 'fp32', decoder_model_merged: 'q4' } : 'q8', device: dev, progress_callback: progressTracker(onProgress) })
        .catch(e => { delete cache[id]; throw e; });
    }
    const asr = await cache[id];
    return asr(audio16k, { language: language || null, task, chunk_length_s: 30, stride_length_s: 5, return_timestamps: true });
  }

  async function sampleBlob(name) {
    const r = await fetch(SAMPLES + name);
    if (!r.ok) throw new Error('The sample couldn’t be downloaded.');
    const b = await r.blob();
    return new File([b], name, { type: b.type || 'application/octet-stream' });
  }

  return { load, device, removeBackground, modelSize, transcribe, toCanvas, sampleBlob };
})();
