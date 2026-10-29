// Auto Subtitle Generator: Whisper (timestamped) gives a time for every word; words are grouped into captions
// at pauses and sentence ends. Captions show over the video, can be edited, saved as SRT/VTT/TXT, or burned
// into a new video (canvas + MediaRecorder, with the sound taken through Web Audio).
const out = $('#out');
let file = null, url = '', caps = [], words = [], duration = 0;
const STYLES = [['outline', 'White, outlined'], ['box', 'White on black'], ['yellow', 'Yellow'], ['bold', 'BOLD CAPS']];
let style = 'outline', size = 'm', pos = 'bottom';
if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) $('#model').value = 'tiny';
fileDrop($('#drop'), $('#file'), fs => { const f = fs.find(x => /^(video|audio)\//.test(x.type) || /\.(mp4|mov|webm|mkv|m4a|mp3|wav)$/i.test(x.name)); if (f) pick(f); });
$('#sample').addEventListener('click', async () => {
  out.innerHTML = '<p class="kicker">Subtitles</p><p class="sub">Making a sample video…</p>';
  pick(await sampleVideo()); $('#lang').value = 'en'; $('#go').click();
});
function pick(f) {
  file = f; if (url) URL.revokeObjectURL(url); url = URL.createObjectURL(f);
  $('#loaded').textContent = `${f.name} · ${bytes(f.size)}`; $('#go').disabled = false;
  out.innerHTML = `<p class="kicker">Subtitles</p><div class="sg-stage"><video src="${url}" controls playsinline></video></div><p class="sub">Press Make subtitles.</p>`;
}
['pointerenter', 'focusin', 'touchstart'].forEach(ev => $('#drop').addEventListener(ev, () => { /* nothing to warm: the model loads on demand */ }, { passive: true }));

// ---------- Words -> captions ----------
function group(ws, maxLen) {
  const out = [];
  let cur = null;
  for (const w of ws) {
    const t = w.text.trim();
    if (!t) continue;
    const gap = cur ? w.start - cur.end : 0, endSentence = cur && /[.!?…]$/.test(cur.text);
    if (cur && (cur.text.length + 1 + t.length > maxLen || gap > 0.7 || w.end - cur.start > 6 || (endSentence && cur.text.length > maxLen * 0.3) || (/[,;:]$/.test(cur.text) && cur.text.length > maxLen * 0.55))) { out.push(cur); cur = null; }
    if (!cur) cur = { start: w.start, end: w.end, text: t }; else { cur.text += ' ' + t; cur.end = w.end; }
  }
  if (cur) out.push(cur);
  // At least 0.8 s on screen, never overlapping the next caption.
  out.forEach((c, i) => { const next = out[i + 1]; c.end = Math.max(c.end, Math.min(c.start + 0.8, next ? next.start : c.start + 0.8)); if (next && c.end > next.start) c.end = next.start; });
  return out;
}
$('#go').addEventListener('click', async () => {
  if (!file) return;
  const btn = $('#go'); btn.disabled = true;
  out.innerHTML = '<p class="kicker">Subtitles</p><div class="bar"><i style="width:2%"></i></div><p class="sub" data-pct>Reading the sound…</p>';
  try {
    const a = await AI.audio16k(file); duration = a.duration;
    setProgress(out, 0.05, 'Getting the AI ready…');
    const t0 = performance.now(), est = a.duration * ($('#model').value === 'tiny' ? 0.25 : 0.6);
    let tick = null;
    const res = await AI.transcribe(a.samples, {
      model: $('#model').value, words: true, language: $('#lang').value || null, task: $('#task').value,
      onProgress: p => { setProgress(out, 0.05 + p * 0.35, `Downloading the AI… ${Math.round(p * 100)}%`); if (p >= 1 && !tick) { const t1 = performance.now(); tick = setInterval(() => { const k = 1 - Math.exp(-(performance.now() - t1) / 1000 / Math.max(3, est) * 2); setProgress(out, 0.4 + 0.58 * k, 'Listening and writing captions…'); }, 300); } },
    }).finally(() => clearInterval(tick));
    words = (res.chunks || []).map(c => ({ text: c.text, start: c.timestamp[0] ?? 0, end: c.timestamp[1] ?? (c.timestamp[0] ?? 0) + 0.3 }));
    caps = group(words, +$('#len').value);
    if (!caps.length) throw new Error('No speech was found in this video.');
    editor();
    toast(`${caps.length} subtitles made in ${((performance.now() - t0) / 1000).toFixed(0)} s`);
  } catch (e) { out.innerHTML = `<p class="kicker">Subtitles</p><span class="verdict no">Couldn’t make subtitles</span><p class="sub">${esc(e.message || String(e))}</p>`; }
  btn.disabled = false;
});
onAny('#len', () => { if (words.length) { caps = group(words, +$('#len').value); editor(); } });

// ---------- Editor ----------
const ts = (s, sep = ',') => { s = Math.max(0, s); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(Math.floor(x)).padStart(2, '0')}${sep}${String(Math.round(x % 1 * 1000)).padStart(3, '0')}`; };
const short = s => { const m = Math.floor(s / 60), x = s - m * 60; return `${m}:${x.toFixed(1).padStart(4, '0')}`; };
const parseShort = v => { const p = String(v).split(':').map(Number); return p.length === 2 ? p[0] * 60 + p[1] : p[0]; };
function capStyle(el, h) {
  const px = h * { s: 0.045, m: 0.06, l: 0.08 }[size];
  el.style.setProperty('--cs', `${px}px`);
  el.style.top = pos === 'top' ? '6%' : pos === 'middle' ? '45%' : ''; el.style.bottom = pos === 'bottom' ? '7%' : '';
  const sp = el.querySelector('span'); if (!sp) return;
  const o = Math.max(1, px * 0.09);
  Object.assign(sp.style, { color: style === 'yellow' ? '#FFE135' : '#fff', background: style === 'box' ? 'rgba(0,0,0,.75)' : 'transparent', textTransform: style === 'bold' ? 'uppercase' : 'none',
    textShadow: style === 'box' ? 'none' : `${o}px ${o}px 0 #000, -${o}px ${o}px 0 #000, ${o}px -${o}px 0 #000, -${o}px -${o}px 0 #000, 0 ${o * 1.5}px ${o * 2}px rgba(0,0,0,.6)` });
}
function editor() {
  out.innerHTML = `<p class="kicker">Subtitles · ${caps.length} lines</p>
    <div class="sg-stage" id="stage"><video id="v" src="${url}" controls playsinline></video><div class="sg-cap" id="cap"></div></div>
    <div class="seg" role="radiogroup" aria-label="Caption style" style="margin-top:10px">${STYLES.map(([v, l]) => `<label><input type="radio" name="sty" value="${v}"${v === style ? ' checked' : ''}><span>${l}</span></label>`).join('')}</div>
    <div class="fields" style="margin-top:8px"><label class="f"><span>Size</span><select id="sz"><option value="s">Small</option><option value="m">Medium</option><option value="l">Large</option></select></label><label class="f"><span>Position</span><select id="ps"><option value="bottom">Bottom</option><option value="middle">Middle</option><option value="top">Top</option></select></label></div>
    <div class="btns"><button type="button" class="btn big-btn" id="burn">Make video with subtitles</button><button type="button" class="btn ghost" data-dl="srt">.srt</button><button type="button" class="btn ghost" data-dl="vtt">.vtt</button><button type="button" class="btn ghost" data-dl="txt">.txt</button></div>
    <div id="burnout"></div>
    <p class="kicker" style="margin-top:12px">Edit · click a time to play from there</p><div class="sg-list" id="list"></div>`;
  $('#sz').value = size; $('#ps').value = pos;
  const v = $('#v'), cap = $('#cap');
  const list = $('#list');
  list.innerHTML = caps.map((c, i) => `<div class="sg-row" data-i="${i}"><div class="t"><input value="${short(c.start)}" data-k="start" aria-label="Start"><input value="${short(c.end)}" data-k="end" aria-label="End"></div><textarea data-k="text" rows="1" aria-label="Subtitle text">${esc(c.text)}</textarea></div>`).join('');
  list.addEventListener('input', e => { const r = e.target.closest('.sg-row'); if (!r) return; const c = caps[+r.dataset.i], k = e.target.dataset.k; if (k === 'text') c.text = e.target.value; else { const t = parseShort(e.target.value); if (ok(t)) c[k] = t; } });
  list.addEventListener('focusin', e => { const r = e.target.closest('.sg-row'); if (r && e.target.dataset.k === 'start') { v.currentTime = caps[+r.dataset.i].start + 0.01; } });
  list.addEventListener('click', e => { const r = e.target.closest('.sg-row'); if (r && e.target.tagName === 'INPUT') { v.currentTime = caps[+r.dataset.i].start + 0.01; v.play().catch(() => {}); } });
  let last = -1;
  const show = () => {
    const t = v.currentTime, i = caps.findIndex(c => t >= c.start && t < c.end);
    if (i !== last) { last = i; cap.innerHTML = i >= 0 ? `<span>${esc(caps[i].text)}</span>` : ''; $$('#list .sg-row').forEach(r => r.classList.toggle('on', +r.dataset.i === i)); }
    capStyle(cap, v.clientHeight || 360);
  };
  v.addEventListener('timeupdate', show); v.addEventListener('seeked', show); v.addEventListener('loadedmetadata', show);
  const tickF = () => { if (!v.paused) show(); requestAnimationFrame(tickF); }; requestAnimationFrame(tickF);
  onAny('input[name="sty"]', () => { style = $('input[name="sty"]:checked').value; last = -2; show(); });
  $('#sz').onchange = () => { size = $('#sz').value; last = -2; show(); };
  $('#ps').onchange = () => { pos = $('#ps').value; last = -2; show(); };
  $$('[data-dl]').forEach(b => b.addEventListener('click', () => save(b.dataset.dl)));
  $('#burn').addEventListener('click', burn);
}
function save(kind) {
  const base = baseName(file.name);
  const body = kind === 'txt' ? caps.map(c => c.text).join('\n') : (kind === 'vtt' ? 'WEBVTT\n\n' : '') + caps.map((c, i) => `${kind === 'srt' ? `${i + 1}\n` : ''}${ts(c.start, kind === 'vtt' ? '.' : ',')} --> ${ts(c.end, kind === 'vtt' ? '.' : ',')}\n${c.text}\n`).join('\n');
  download(new Blob([body], { type: kind === 'vtt' ? 'text/vtt' : 'text/plain;charset=utf-8' }), `${base}.${kind}`);
}

// ---------- Burning the subtitles into the video ----------
function wrap(x, text, maxW) {
  const ws = text.split(/\s+/), lines = [];
  let line = '';
  for (const w of ws) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line);
  return lines;
}
function drawCap(x, W, H, text) {
  if (!text) return;
  if (style === 'bold') text = text.toUpperCase();
  const px = Math.round(H * { s: 0.045, m: 0.06, l: 0.08 }[size]);
  x.font = `800 ${px}px Arial, Helvetica, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.lineJoin = 'round';
  const lines = wrap(x, text, W * 0.9), lh = px * 1.25, total = lines.length * lh;
  let y = pos === 'top' ? H * 0.06 + px : pos === 'middle' ? H / 2 - total / 2 + px : H * 0.93 - total + px;
  for (const l of lines) {
    if (style === 'box') { const w = x.measureText(l).width; x.fillStyle = 'rgba(0,0,0,.75)'; x.fillRect(W / 2 - w / 2 - px * 0.35, y - px * 0.95, w + px * 0.7, px * 1.25); }
    else { x.strokeStyle = '#000'; x.lineWidth = Math.max(2, px * 0.18); x.strokeText(l, W / 2, y); }
    x.fillStyle = style === 'yellow' ? '#FFE135' : '#fff'; x.fillText(l, W / 2, y);
    y += lh;
  }
}
async function burn() {
  const box = $('#burnout'), btn = $('#burn');
  if (typeof MediaRecorder === 'undefined' || !HTMLCanvasElement.prototype.captureStream) { box.innerHTML = '<p class="note">This browser can’t make videos. Try Chrome, Edge or Firefox, or download the .srt file instead.</p>'; return; }
  btn.disabled = true;
  box.innerHTML = '<div class="bar"><i style="width:1%"></i></div><p class="sub" data-pct>Making the video… keep this tab open</p>';
  const v = document.createElement('video'); v.src = url; v.playsInline = true; v.preload = 'auto';
  await new Promise((res, rej) => { v.onloadedmetadata = res; v.onerror = () => rej(new Error('This video can’t be played in the browser.')); });
  const k = Math.min(1, 1920 / Math.max(v.videoWidth || 1280, v.videoHeight || 720)), W = Math.max(2, Math.round((v.videoWidth || 1280) * k / 2) * 2), H = Math.max(2, Math.round((v.videoHeight || 720) * k / 2) * 2);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  const stream = c.captureStream(30);
  // The sound goes into the recording but not to the speakers.
  const ac = new AudioContext(), dest = ac.createMediaStreamDestination();
  try { ac.createMediaElementSource(v).connect(dest); dest.stream.getAudioTracks().forEach(t => stream.addTrack(t)); } catch (e) { /* no sound track */ }
  const type = ['video/mp4;codecs=avc1.42E01F,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t));
  const rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: Math.round(W * H * 30 * 0.12) }), parts = [];
  rec.ondataavailable = e => { if (e.data.size) parts.push(e.data); };
  const frame = () => {
    if (v.videoWidth) x.drawImage(v, 0, 0, W, H); else { x.fillStyle = '#111'; x.fillRect(0, 0, W, H); }
    const t = v.currentTime, cp = caps.find(cc => t >= cc.start && t < cc.end);
    drawCap(x, W, H, cp && cp.text);
    setProgress(box, Math.min(0.99, t / (v.duration || duration || 1)), `Making the video… ${Math.round(t / (v.duration || duration || 1) * 100)}% · keep this tab open`);
    if (!v.ended) (v.requestVideoFrameCallback ? v.requestVideoFrameCallback(frame) : requestAnimationFrame(frame));
  };
  const done = new Promise(r => { rec.onstop = r; });
  rec.start(1000);
  await ac.resume();
  await v.play();
  frame();
  if (!v.videoWidth) { const iv = setInterval(() => { if (v.ended) clearInterval(iv); else frame(); }, 100); }
  await new Promise(r => { v.onended = r; });
  frame();
  rec.stop(); await done; ac.close();
  const blob = new Blob(parts, { type: type.split(';')[0] }), ext = type.startsWith('video/mp4') ? 'mp4' : 'webm';
  box.innerHTML = `<span class="verdict ok">Video ready</span><p class="sub">${W}×${H} · ${ext.toUpperCase()} · ${bytes(blob.size)}</p><div class="btns"><button type="button" class="btn" id="vdl">Download video</button></div>${ext === 'webm' ? '<p class="note">This browser makes WebM videos. They play on YouTube, Chrome and Android; for iPhone or Instagram, convert it with an MP4 converter.</p>' : ''}`;
  $('#vdl').onclick = () => download(blob, `${baseName(file.name)}-subtitled.${ext}`);
  btn.disabled = false;
}
// A short sample video: John F. Kennedy's 1961 inaugural address, a famous public-domain quote.
async function sampleVideo() {
  const r = await fetch(`${window.TF_BASE || ''}/assets/samples/speech-sample.mp4`);
  return new File([await r.blob()], 'speech-sample.mp4', { type: 'video/mp4' });
}
