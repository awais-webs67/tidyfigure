// Text to Speech: Kokoro-82M (Apache 2.0) through kokoro-js, in a module worker so the page never freezes.
// Long text is spoken sentence by sentence and joined with short pauses; WAV is written here, MP3 with lamejs.
// "Other languages" uses the browser's own speechSynthesis voices (play only).
const out = $('#out');
const VOICES = [
  ['af_heart', 'Heart', 'US female'], ['af_bella', 'Bella', 'US female'], ['af_nicole', 'Nicole', 'US female, soft'], ['af_sarah', 'Sarah', 'US female'], ['af_aoede', 'Aoede', 'US female'], ['af_kore', 'Kore', 'US female'],
  ['am_michael', 'Michael', 'US male'], ['am_fenrir', 'Fenrir', 'US male'], ['am_puck', 'Puck', 'US male'], ['am_echo', 'Echo', 'US male'], ['am_adam', 'Adam', 'US male'], ['am_liam', 'Liam', 'US male'], ['af_nova', 'Nova', 'US female'], ['af_sky', 'Sky', 'US female'],
  ['bf_emma', 'Emma', 'UK female'], ['bf_isabella', 'Isabella', 'UK female'], ['bf_alice', 'Alice', 'UK female'], ['bm_george', 'George', 'UK male'], ['bm_fable', 'Fable', 'UK male'], ['bm_lewis', 'Lewis', 'UK male'],
];
$('#voices').innerHTML = VOICES.map(([id, n, d], i) => `<label><input type="radio" name="voice" value="${id}"${i ? '' : ' checked'}><span>${n}<br><small>${d}</small></span></label>`).join('');
const count = () => { $('#count').textContent = `${$('#text').value.length.toLocaleString()} / 5,000 characters`; };
$('#text').addEventListener('input', count); count();
$('#speed').addEventListener('input', e => { $('#sv').textContent = (+e.target.value).toFixed(2).replace(/0$/, ''); });
onAny('input[name="lang"]', () => { const o = $('input[name="lang"]:checked').value === 'other'; $('#ai-voices').hidden = o; $('#dev-voices').hidden = !o; if (o) devVoices(); });

// ---------- AI voices (worker) ----------
const WORKER = `
import { KokoroTTS } from 'https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/dist/kokoro.web.js';
let tts = null;
const files = {};
self.onmessage = async e => {
  const { id, parts, voice, speed } = e.data;
  try {
    if (!tts) tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', { dtype: 'q8', device: 'wasm', progress_callback: p => {
      if (p.status === 'progress' && p.total) files[p.file] = [p.loaded, p.total];
      const v = Object.values(files), t = v.reduce((s, x) => s + x[1], 0), g = v.reduce((s, x) => s + x[0], 0);
      if (t) self.postMessage({ id, load: g / t });
    } });
    const chunks = [];
    let rate = 24000;
    for (let i = 0; i < parts.length; i++) {
      const a = await tts.generate(parts[i], { voice, speed });
      rate = a.sampling_rate; chunks.push(a.audio);
      const piece = a.audio.slice();
      self.postMessage({ id, step: i + 1, of: parts.length, piece, rate }, [piece.buffer]);
    }
    const gap = Math.round(rate * 0.18), n = chunks.reduce((s, c) => s + c.length + gap, 0), all = new Float32Array(n);
    let o = 0; for (const c of chunks) { all.set(c, o); o += c.length + gap; }
    self.postMessage({ id, audio: all, rate }, [all.buffer]);
  } catch (err) { self.postMessage({ id, error: String(err && err.message || err) }); }
};`;
let worker = null, seq = 0, live = null;
function stopLive() { if (!live) return; live.srcs.forEach(x => { try { x.stop(); } catch (e) {} }); if (live.ctx) live.ctx.close().catch(() => {}); live = null; $('#stop').hidden = true; }
const jobs = new Map();
function getWorker() {
  if (!worker) {
    worker = new Worker(URL.createObjectURL(new Blob([WORKER], { type: 'text/javascript' })), { type: 'module' });
    worker.onmessage = e => { const j = jobs.get(e.data.id); if (j) j(e.data); };
    worker.onerror = () => { jobs.forEach(j => j({ error: 'The voice engine couldn’t start in this browser.' })); worker = null; };
  }
  return worker;
}
// Sentences, joined into parts of up to ~300 characters (the model reads a limited length at once).
function split(text) {
  const sents = text.replace(/\s+\n/g, '\n').split(/(?<=[.!?…])\s+|\n+/).map(s => s.trim()).filter(Boolean), parts = [];
  for (const s of sents) {
    if (s.length > 300) { let rest = s; while (rest.length > 300) { let k = rest.lastIndexOf(',', 300); if (k < 100) k = rest.lastIndexOf(' ', 300); parts.push(rest.slice(0, k + 1).trim()); rest = rest.slice(k + 1).trim(); } if (rest) parts.push(rest); continue; }
    const last = parts[parts.length - 1];
    // The first part stays short so speaking starts sooner; later parts are joined up to ~220 characters.
    if (last && last.length + s.length < (parts.length === 1 ? 90 : 220)) parts[parts.length - 1] = last + ' ' + s; else parts.push(s);
  }
  return parts;
}
function wav(samples, rate) {
  const b = new ArrayBuffer(44 + samples.length * 2), v = new DataView(b), w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, samples[i])) * 32767, true);
  return new Blob([b], { type: 'audio/wav' });
}
async function mp3(samples, rate) {
  if (!window.lamejs) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js');
  const enc = new lamejs.Mp3Encoder(1, rate, 96), pcm = new Int16Array(samples.length), parts = [];
  for (let i = 0; i < samples.length; i++) pcm[i] = Math.max(-1, Math.min(1, samples[i])) * 32767;
  for (let i = 0; i < pcm.length; i += 1152) { const b = enc.encodeBuffer(pcm.subarray(i, i + 1152)); if (b.length) parts.push(new Uint8Array(b)); }
  const end = enc.flush(); if (end.length) parts.push(new Uint8Array(end));
  return new Blob(parts, { type: 'audio/mpeg' });
}
$('#go').addEventListener('click', () => {
  const text = $('#text').value.trim();
  if (!text) { $('#text').focus(); return; }
  if ($('input[name="lang"]:checked').value === 'other') { speakDevice(text); return; }
  const btn = $('#go'); btn.disabled = true;
  const id = ++seq, parts = split(text), voice = $('input[name="voice"]:checked').value, speed = +$('#speed').value, t0 = performance.now();
  out.innerHTML = '<p class="kicker">Speech</p><div class="bar"><i style="width:2%"></i></div><p class="sub" data-pct>Getting the voice ready…</p>';
  // Each finished part plays straight away, so long text starts speaking before it is all made.
  stopLive();
  live = { ctx: null, at: 0, srcs: [], played: false };
  // Made inside the click, so phones allow it to play.
  if (parts.length > 1) try { live.ctx = new AudioContext({ sampleRate: 24000 }); } catch (e) { /* no live playback */ }
  const lv = live;
  jobs.set(id, async d => {
    if (d.load !== undefined) setProgress(out, d.load * 0.5, `Downloading the voice model… ${Math.round(d.load * 100)}%`);
    else if (d.step) {
      if (lv.ctx && live === lv) {
        try {
          if (!lv.played) { lv.played = true; lv.at = lv.ctx.currentTime + 0.05; $('#stop').hidden = false; }
          const buf = lv.ctx.createBuffer(1, d.piece.length, d.rate); buf.copyToChannel(d.piece, 0);
          const src = lv.ctx.createBufferSource(); src.buffer = buf; src.connect(lv.ctx.destination);
          lv.at = Math.max(lv.at, lv.ctx.currentTime); src.start(lv.at); lv.at += buf.duration + 0.18; lv.srcs.push(src);
        } catch (e) { /* live playback is a bonus; the full file still comes */ }
      }
      setProgress(out, 0.5 + 0.5 * d.step / d.of, d.of > 1 ? `Speaking… part ${d.step} of ${d.of} ready (playing as it goes)` : 'Speaking…');
    } else {
      jobs.delete(id); btn.disabled = false;
      const wasLive = lv.played && live === lv;
      if (wasLive) setTimeout(() => { if (live === lv) stopLive(); }, Math.max(0, lv.at - lv.ctx.currentTime) * 1000 + 300);
      if (d.error) { out.innerHTML = `<p class="kicker">Speech</p><span class="verdict no">Couldn’t make the speech</span><p class="sub">${esc(d.error)}</p>`; return; }
      const blob = wav(d.audio, d.rate), url = URL.createObjectURL(blob), secs = d.audio.length / d.rate;
      out.innerHTML = `<p class="kicker">Speech</p><audio class="player" controls src="${url}"></audio>
        <p class="sub">${VOICES.find(v => v[0] === voice)[1]} · ${secs.toFixed(1)} s of audio · made in ${((performance.now() - t0) / 1000).toFixed(1)} s</p>
        <div class="btns"><button type="button" class="btn big-btn" id="dmp3">Download MP3</button><button type="button" class="btn ghost" id="dwav">Download WAV</button></div>`;
      // If it already played live, the player waits at the start; otherwise it plays now.
      if (!wasLive) $('audio', out).play().catch(() => {});
      $('audio', out).addEventListener('play', stopLive);
      $('#dwav').onclick = () => download(blob, 'speech.wav');
      $('#dmp3').onclick = async () => download(await mp3(d.audio, d.rate), 'speech.mp3');
    }
  });
  getWorker().postMessage({ id, parts, voice, speed });
});

// ---------- Device voices ----------
function devVoices() {
  const fill = () => {
    const vs = speechSynthesis.getVoices().slice().sort((a, b) => a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name));
    if (!vs.length) { $('#devvoice').innerHTML = '<option value="">No voices on this device</option>'; return; }
    const pref = navigator.language.slice(0, 2);
    $('#devvoice').innerHTML = vs.map((v, i) => `<option value="${i}"${v.lang.startsWith(pref) && !$('#devvoice').dataset.set ? ' selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('');
    $('#devvoice').dataset.set = '1';
  };
  if (!('speechSynthesis' in window)) { $('#devvoice').innerHTML = '<option>Not supported in this browser</option>'; return; }
  fill(); speechSynthesis.onvoiceschanged = fill;
}
function speakDevice(text) {
  const vs = speechSynthesis.getVoices(), u = new SpeechSynthesisUtterance(text), v = vs[+$('#devvoice').value];
  if (v) { u.voice = v; u.lang = v.lang; }
  u.rate = +$('#speed').value;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
  $('#stop').hidden = false; u.onend = () => { $('#stop').hidden = true; };
  out.innerHTML = `<p class="kicker">Speech</p><p class="sub">Reading with ${esc(v ? v.name : 'your device’s voice')}…</p><p class="note">Device voices can’t be downloaded. For a downloadable file, use the English AI voices.</p>`;
}
$('#stop').addEventListener('click', () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); stopLive(); $('#stop').hidden = true; });
