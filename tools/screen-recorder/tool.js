const out = $('#out'), recBtn = $('#rec');
let display, mic, rec, chunks, t0, raf;
if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
  recBtn.disabled = true;
  $('#support').innerHTML = '<strong>Screen recording isn’t available in this browser.</strong> Phones and tablets don’t allow websites to record the screen: use the built-in recorder instead (iPhone: Control Centre → Screen Recording; Android: Quick Settings → Screen record). On a computer, use Chrome, Edge, Firefox or Safari.';
}
recBtn.addEventListener('click', () => (rec && rec.state === 'recording' ? stop() : start()));

async function start() {
  try {
    display = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: $('#sys').checked });
  } catch (e) {
    $('#status').textContent = 'Screen sharing was cancelled';
    return;
  }
  const tracks = [...display.getVideoTracks()];
  const audioIn = display.getAudioTracks();
  if ($('#mic').checked) { try { mic = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { mic = null; } }
  if (audioIn.length || mic) {
    // Mix screen sound and microphone into one track.
    const c = ctx(); if (c.state === 'suspended') await c.resume();
    const dest = c.createMediaStreamDestination();
    if (audioIn.length) c.createMediaStreamSource(new MediaStream(audioIn)).connect(dest);
    if (mic) c.createMediaStreamSource(mic).connect(dest);
    tracks.push(...dest.stream.getAudioTracks());
  }
  for (let n = +$('#cd').value; n > 0; n--) { $('#status').textContent = `Starting in ${n}…`; await new Promise(r => setTimeout(r, 1000)); }
  const stream = new MediaStream(tracks), type = recorderType(tracks.length > 1);
  rec = new MediaRecorder(stream, { mimeType: type || undefined, videoBitsPerSecond: +$('#q').value });
  chunks = [];
  rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  rec.onstop = saved;
  display.getVideoTracks()[0].addEventListener('ended', () => { if (rec.state === 'recording') stop(); });
  rec.start(1000); t0 = performance.now();
  $('#status').innerHTML = '<span class="rec-dot"></span>Recording';
  recBtn.innerHTML = 'Stop recording';
  const tick = () => { $('#time').textContent = clock((performance.now() - t0) / 1000); raf = requestAnimationFrame(tick); };
  tick();
}
function stop() {
  rec.stop();
  [display, mic].forEach(s => s && s.getTracks().forEach(t => t.stop()));
  cancelAnimationFrame(raf);
}
function saved() {
  const type = (rec.mimeType || 'video/webm').split(';')[0], blob = new Blob(chunks, { type }), ext = extFor(type);
  const name = `screen-recording-${new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-')}.${ext}`;
  $('#status').textContent = 'Saved'; recBtn.innerHTML = 'Record again';
  out.innerHTML = `<p class="kicker">Your recording</p><p class="big"><mark>${$('#time').textContent}</mark></p>
    <p class="sub">${bytes(blob.size)} · ${ext.toUpperCase()}</p>
    <video class="player" controls playsinline src="${URL.createObjectURL(blob)}"></video>
    <div class="copyrow"><button type="button" class="btn" id="dl">Download video</button></div>
    <p class="note">Trim the start and end with the <a href="${(window.TF_BASE || '') + '/video-cutter'}">video cutter</a>, or make it smaller with the video compressor.</p>`;
  $('#dl').onclick = () => download(blob, name);
}
