'use strict';
// Shared helpers for the video and audio tools. Loaded after app.js on media pages.

const LAME_URL = 'https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js';
const isMedia = f => f && (/^(video|audio)\//.test(f.type) || /\.(mp4|m4v|mov|webm|mkv|ogv|avi|3gp|mp3|m4a|aac|wav|ogg|oga|opus|flac|weba)$/i.test(f.name));
const clock = s => {
  if (!ok(s)) return '–';
  const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
  return (h ? `${h}:${String(m).padStart(2, '0')}` : m) + ':' + sec.toFixed(1).padStart(4, '0');
};
// "1:05.5", "65.5", "1:02:03" -> seconds
const parseClock = str => {
  const parts = String(str).trim().split(':').map(Number);
  if (!parts.length || parts.some(n => !ok(n) || n < 0)) return NaN;
  return parts.reduce((t, n) => t * 60 + n, 0);
};

let audioCtx;
const ctx = () => (audioCtx ||= new (window.AudioContext || window.webkitAudioContext)());

// Decode the sound of an audio or video file into PCM. Works for MP4, MOV, WebM, MP3, M4A, WAV, OGG.
async function decodeAudio(file) {
  const buf = await file.arrayBuffer();
  try {
    return await ctx().decodeAudioData(buf);
  } catch (e) {
    throw new Error('This file has no sound track your browser can read. If it is a video, it may be silent.');
  }
}

// A slice [start, end) of an AudioBuffer as plain Float32 channel arrays, with optional fade in/out (seconds).
function sliceChannels(ab, start = 0, end = ab.duration, fadeIn = 0, fadeOut = 0, mono = false) {
  const sr = ab.sampleRate, a = Math.max(0, Math.floor(start * sr)), b = Math.min(ab.length, Math.ceil(end * sr));
  let chans = [];
  for (let c = 0; c < Math.min(ab.numberOfChannels, 2); c++) chans.push(ab.getChannelData(c).slice(a, b));
  if (mono && chans.length === 2) chans = [chans[0].map((v, i) => (v + chans[1][i]) / 2)];
  const n = b - a, fi = Math.floor(fadeIn * sr), fo = Math.floor(fadeOut * sr);
  for (const ch of chans) {
    for (let i = 0; i < fi && i < n; i++) ch[i] *= i / fi;
    for (let i = 0; i < fo && i < n; i++) ch[n - 1 - i] *= i / fo;
  }
  return { chans, sampleRate: sr };
}

function encodeWav({ chans, sampleRate }) {
  const n = chans[0].length, nc = chans.length, data = n * nc * 2;
  const v = new DataView(new ArrayBuffer(44 + data));
  const str = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF'); v.setUint32(4, 36 + data, true); str(8, 'WAVE'); str(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, nc, true); v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * nc * 2, true); v.setUint16(32, nc * 2, true); v.setUint16(34, 16, true);
  str(36, 'data'); v.setUint32(40, data, true);
  let o = 44;
  for (let i = 0; i < n; i++) for (let c = 0; c < nc; c++) { const s = Math.max(-1, Math.min(1, chans[c][i])); v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true); o += 2; }
  return new Blob([v], { type: 'audio/wav' });
}

// MP3 needs a sample rate MP3 supports; browsers usually decode at 44.1 or 48 kHz, which are fine.
async function encodeMp3({ chans, sampleRate }, kbps = 192, onProgress) {
  if (!window.lamejs) await loadScript(LAME_URL);
  const nc = chans.length, enc = new lamejs.Mp3Encoder(nc, sampleRate, kbps);
  const toInt = f => { const o = new Int16Array(f.length); for (let i = 0; i < f.length; i++) { const s = Math.max(-1, Math.min(1, f[i])); o[i] = s < 0 ? s * 0x8000 : s * 0x7fff; } return o; };
  const ints = chans.map(toInt), parts = [], block = 1152 * 40, n = ints[0].length;
  for (let i = 0; i < n; i += block) {
    const l = ints[0].subarray(i, i + block), r = nc > 1 ? ints[1].subarray(i, i + block) : undefined;
    const out = nc > 1 ? enc.encodeBuffer(l, r) : enc.encodeBuffer(l);
    if (out.length) parts.push(new Uint8Array(out));
    if (onProgress && (i / block) % 20 === 0) { onProgress(i / n); await new Promise(r2 => setTimeout(r2)); }
  }
  const end = enc.flush();
  if (end.length) parts.push(new Uint8Array(end));
  return new Blob(parts, { type: 'audio/mpeg' });
}

// Waveform drawing for audio editors. sel = [start, end] in seconds.
function drawWave(canvas, ab, sel) {
  const dpr = devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const x = canvas.getContext('2d'), data = ab.getChannelData(0), step = Math.max(1, Math.floor(data.length / w));
  const css = getComputedStyle(document.documentElement);
  x.scale(dpr, dpr);
  x.fillStyle = css.getPropertyValue('--surface-2'); x.fillRect(0, 0, w, h);
  if (sel) { x.fillStyle = 'rgba(255,91,53,.16)'; x.fillRect(sel[0] / ab.duration * w, 0, (sel[1] - sel[0]) / ab.duration * w, h); }
  for (let i = 0; i < w; i++) {
    let mn = 1, mx = -1;
    for (let j = i * step, e = Math.min(data.length, j + step); j < e; j += Math.ceil(step / 64)) { const v = data[j]; if (v < mn) mn = v; if (v > mx) mx = v; }
    const t = i / w * ab.duration, inSel = !sel || (t >= sel[0] && t <= sel[1]);
    x.fillStyle = inSel ? '#FF5B35' : css.getPropertyValue('--muted');
    x.fillRect(i, (1 - mx) * h / 2, 1, Math.max(1, (mx - mn) * h / 2));
  }
}

// Best recording format this browser supports. MP4 first (plays everywhere), then WebM.
function recorderType(audio = true) {
  const list = audio
    ? ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
    : ['video/mp4;codecs=avc1.42E01E', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  return list.find(t => window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || '';
}
const extFor = type => (/mp4/.test(type) ? 'mp4' : /ogg/.test(type) ? 'ogg' : 'webm');

// Load a file into a <video> element and wait until its size and length are known.
function loadVideo(file, video = document.createElement('video')) {
  return new Promise((res, rej) => {
    video.preload = 'auto'; video.playsInline = true; video.muted = true;
    video.onloadedmetadata = () => {
      // Some WebM files report Infinity until you seek to the end.
      if (video.duration === Infinity) { video.currentTime = 1e9; video.ontimeupdate = () => { video.ontimeupdate = null; video.currentTime = 0; res(video); }; } else res(video);
    };
    video.onerror = () => rej(new Error(`Your browser can't play ${file.name}. Try an MP4 or WebM file.`));
    video.src = URL.createObjectURL(file);
  });
}
const seek = (v, t) => new Promise(r => { if (Math.abs(v.currentTime - t) < 0.001) return r(); v.onseeked = () => { v.onseeked = null; r(); }; v.currentTime = t; });

// Re-record part of a video at a new size and bitrate. This plays the clip once, so it takes as long as the clip.
// opts: { video, start, end, height, vbps, abps, mute, onProgress }
async function reencode({ video, start = 0, end = video.duration, height, vbps = 2.5e6, abps = 128000, mute = false, onProgress, signal }) {
  const scale = height && height < video.videoHeight ? height / video.videoHeight : 1;
  const w = Math.round(video.videoWidth * scale / 2) * 2, h = Math.round(video.videoHeight * scale / 2) * 2;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const x = canvas.getContext('2d');
  const stream = canvas.captureStream(30);
  let src;
  if (!mute) {
    const ac = ctx();
    if (ac.state === 'suspended') await ac.resume();
    if (!video._src) video._src = ac.createMediaElementSource(video);
    src = video._src;
    const dest = ac.createMediaStreamDestination();
    src.connect(dest);
    dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
    video._dest = dest;
  }
  const type = recorderType(!mute);
  const rec = new MediaRecorder(stream, { mimeType: type || undefined, videoBitsPerSecond: vbps, audioBitsPerSecond: abps });
  const chunks = [];
  rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  await seek(video, start);
  video.muted = mute; video.volume = 1;
  const done = new Promise(r => { rec.onstop = r; });
  let raf;
  const draw = () => {
    x.drawImage(video, 0, 0, w, h);
    if (onProgress) onProgress(Math.min(1, (video.currentTime - start) / (end - start)));
    if (video.currentTime >= end || video.ended || (signal && signal.aborted)) { video.pause(); if (rec.state !== 'inactive') rec.stop(); return; }
    raf = requestAnimationFrame(draw);
  };
  x.drawImage(video, 0, 0, w, h);
  rec.start(1000);
  await video.play();
  draw();
  await done;
  cancelAnimationFrame(raf);
  if (video._dest && src) { try { src.disconnect(video._dest); } catch (e) { /* already gone */ } }
  stream.getTracks().forEach(t => t.stop());
  video.muted = true;
  return { blob: new Blob(chunks, { type: (type || 'video/webm').split(';')[0] }), w, h };
}

// A short generated video with sound, so visitors can try the tools without a file of their own.
async function sampleVideo(seconds = 5) {
  const c = document.createElement('canvas');
  c.width = 1280; c.height = 720;
  const x = c.getContext('2d');
  const stream = c.captureStream(30);
  const ac = ctx();
  if (ac.state === 'suspended') await ac.resume();
  const dest = ac.createMediaStreamDestination(), gain = ac.createGain();
  gain.gain.value = 0.15; gain.connect(dest);
  const notes = [261.63, 329.63, 392, 523.25, 392, 329.63];
  const osc = ac.createOscillator(); osc.type = 'triangle'; osc.connect(gain);
  notes.forEach((f, i) => osc.frequency.setValueAtTime(f, ac.currentTime + i * seconds / notes.length));
  dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
  const type = recorderType(true);
  const rec = new MediaRecorder(stream, { mimeType: type || undefined, videoBitsPerSecond: 6e6 });
  const chunks = [];
  rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  const t0 = performance.now();
  let raf;
  const frame = () => {
    const t = (performance.now() - t0) / 1000;
    const g = x.createLinearGradient(0, 0, 1280, 720);
    g.addColorStop(0, `hsl(${(t * 40) % 360},70%,45%)`); g.addColorStop(1, `hsl(${(t * 40 + 120) % 360},70%,30%)`);
    x.fillStyle = g; x.fillRect(0, 0, 1280, 720);
    for (let i = 0; i < 8; i++) { x.fillStyle = `rgba(255,255,255,${0.12 + i * 0.03})`; x.beginPath(); x.arc(640 + Math.cos(t * 1.5 + i) * (120 + i * 40), 360 + Math.sin(t * 2 + i) * (60 + i * 25), 30 + i * 6, 0, 7); x.fill(); }
    x.fillStyle = '#fff'; x.font = 'bold 84px Inter, sans-serif'; x.textAlign = 'center'; x.fillText('Sample clip', 640, 330);
    x.font = 'bold 60px monospace'; x.fillText(`${t.toFixed(1)} s`, 640, 430);
    raf = requestAnimationFrame(frame);
  };
  frame();
  rec.start(500); osc.start();
  await new Promise(r => setTimeout(r, seconds * 1000));
  const done = new Promise(r => { rec.onstop = r; });
  rec.stop(); osc.stop(); await done;
  cancelAnimationFrame(raf);
  stream.getTracks().forEach(t => t.stop());
  const mime = (type || 'video/webm').split(';')[0];
  return new File(chunks, `sample-clip.${extFor(mime)}`, { type: mime });
}


// A generated 12-second tune (WAV) for trying the audio tools instantly.
function sampleAudio() {
  const sr = 44100, secs = 12, n = sr * secs, L = new Float32Array(n), R = new Float32Array(n);
  const melody = [392, 440, 494, 523, 587, 523, 494, 440, 392, 330, 349, 392, 440, 392, 349, 330, 294, 330, 349, 392, 440, 494, 523, 523];
  const beat = secs / melody.length;
  for (let i = 0; i < n; i++) {
    const t = i / sr, k = Math.min(melody.length - 1, Math.floor(t / beat)), local = t - k * beat;
    const env = Math.min(1, local * 40) * Math.exp(-local * 3);
    const f = melody[k], bass = melody[k - (k % 4)] / 2;
    const s = 0.35 * env * (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t)) + 0.18 * Math.sin(2 * Math.PI * bass * t);
    L[i] = s * 0.9; R[i] = s;
  }
  return new File([encodeWav({ chans: [L, R], sampleRate: sr })], 'sample-tune.wav', { type: 'audio/wav' });
}
