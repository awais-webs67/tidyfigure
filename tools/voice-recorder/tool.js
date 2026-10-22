const out = $('#out'), recBtn = $('#rec'), pauseBtn = $('#pause'), lv = $('#level');
const list = [];
let stream, rec, chunks, t0, paused = 0, pauseAt = 0, raf, analyser;

recBtn.addEventListener('click', () => (rec && rec.state !== 'inactive' ? stop() : start()));
pauseBtn.addEventListener('click', () => {
  if (rec.state === 'recording') { rec.pause(); pauseAt = performance.now(); pauseBtn.textContent = 'Resume'; $('#status').textContent = 'Paused'; }
  else { rec.resume(); paused += performance.now() - pauseAt; pauseBtn.textContent = 'Pause'; $('#status').innerHTML = '<span class="rec-dot"></span>Recording'; }
});

async function start() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { noiseSuppression: $('#ns').checked, echoCancellation: $('#ec').checked } });
  } catch (e) {
    $('#status').textContent = e.name === 'NotAllowedError' ? 'Microphone permission was blocked' : 'No microphone found';
    out.innerHTML = `<p class="kicker">Recordings</p><span class="verdict no">Can’t record</span><p class="sub">${e.name === 'NotAllowedError' ? 'Allow microphone access in your browser’s address bar or settings, then try again.' : 'Connect a microphone or try another browser.'}</p>`;
    return;
  }
  const type = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/webm'].find(t => MediaRecorder.isTypeSupported(t)) || '';
  rec = new MediaRecorder(stream, type ? { mimeType: type, audioBitsPerSecond: 128000 } : undefined);
  chunks = [];
  rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  rec.onstop = saved;
  const c = ctx(); if (c.state === 'suspended') await c.resume();
  analyser = c.createAnalyser(); analyser.fftSize = 1024;
  c.createMediaStreamSource(stream).connect(analyser);
  rec.start(500); t0 = performance.now(); paused = 0;
  recBtn.innerHTML = 'Stop & save'; pauseBtn.disabled = false; pauseBtn.textContent = 'Pause';
  $('#status').innerHTML = '<span class="rec-dot"></span>Recording';
  tick();
}
function tick() {
  const el = rec.state === 'paused' ? pauseAt - t0 - paused : performance.now() - t0 - paused;
  $('#time').textContent = clock(el / 1000);
  const d = new Uint8Array(analyser.fftSize); analyser.getByteTimeDomainData(d);
  const x = lv.getContext('2d'), w = lv.width, h = lv.height;
  x.clearRect(0, 0, w, h); x.strokeStyle = '#FF5B35'; x.lineWidth = 3; x.beginPath();
  for (let i = 0; i < d.length; i++) { const px = i / d.length * w, py = d[i] / 255 * h; i ? x.lineTo(px, py) : x.moveTo(px, py); }
  x.stroke();
  raf = requestAnimationFrame(tick);
}
function stop() { rec.stop(); stream.getTracks().forEach(t => t.stop()); cancelAnimationFrame(raf); }
function saved() {
  const type = (rec.mimeType || 'audio/webm').split(';')[0];
  const blob = new Blob(chunks, { type }), n = list.length + 1;
  list.unshift({ blob, name: `recording-${n}`, ext: /mp4/.test(type) ? 'm4a' : /ogg/.test(type) ? 'ogg' : 'webm', len: $('#time').textContent });
  recBtn.innerHTML = 'Record again'; pauseBtn.disabled = true; $('#status').textContent = 'Saved';
  lv.getContext('2d').clearRect(0, 0, lv.width, lv.height);
  render();
}
function render() {
  out.innerHTML = `<p class="kicker">Recordings</p>${list.map((r, i) => `<div class="stat" style="gap:8px"><b style="font-size:16px">${esc(r.name)} · ${r.len}</b>
    <audio class="player" controls src="${r.url ||= URL.createObjectURL(r.blob)}"></audio>
    <div class="btns"><button type="button" class="btn" data-mp3="${i}">Download MP3</button><button type="button" class="btn ghost" data-raw="${i}">${r.ext.toUpperCase()} (${bytes(r.blob.size)})</button></div></div>`).join('')}`;
}
out.addEventListener('click', async e => {
  const b = e.target.closest('[data-mp3],[data-raw]'); if (!b) return;
  const r = list[+(b.dataset.mp3 ?? b.dataset.raw)];
  if (b.dataset.raw) return download(r.blob, `${r.name}.${r.ext}`);
  b.disabled = true; b.textContent = 'Converting…';
  try {
    const ab = await ctx().decodeAudioData(await r.blob.arrayBuffer());
    download(await encodeMp3(sliceChannels(ab), 128), `${r.name}.mp3`);
  } catch (err) { b.textContent = 'MP3 not available'; return; }
  b.disabled = false; b.textContent = 'Download MP3';
});
