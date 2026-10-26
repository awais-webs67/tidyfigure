const out = $('#out');
let stream = null, ac = null, raf = 0, heard = 0, t0 = 0, peak = 0, verdict = '';
$('#go').addEventListener('click', start);
$('#stop').addEventListener('click', stop);
$('#dev').addEventListener('change', start);
$('#rec').addEventListener('click', record);

async function start() {
  stop(true);
  const id = $('#dev').value;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: id ? { deviceId: { exact: id } } : true });
  } catch (e) { out.innerHTML = '<p class="kicker">Result</p>' + mediaError(e, 'microphone'); return; }
  ac = new (window.AudioContext || window.webkitAudioContext)();
  await ac.resume();
  const an = ac.createAnalyser();
  an.fftSize = 2048;
  ac.createMediaStreamSource(stream).connect(an);
  const buf = new Float32Array(an.fftSize), track = stream.getAudioTracks()[0], st = track.getSettings ? track.getSettings() : {};
  await fillDevices($('#dev'), 'audioinput', st.deviceId);
  heard = 0; peak = 0; verdict = ''; t0 = performance.now();
  $('#live').hidden = false; $('#stop').hidden = false; $('#go span').textContent = 'Restart test';
  const yes = v => (v === undefined ? 'not reported' : v ? 'on' : 'off');
  out.innerHTML = `<p class="kicker">Result</p><div id="vd"></div>
    <div class="scroll"><table class="tbl"><tbody>
      <tr><td>Microphone</td><td>${esc(track.label || 'Default microphone')}</td></tr>
      <tr><td>Sample rate</td><td class="n">${fmtMax((st.sampleRate || ac.sampleRate) / 1000, 1)} kHz</td></tr>
      <tr><td>Channels</td><td class="n">${st.channelCount || 1}</td></tr>
      <tr><td>Echo cancellation</td><td class="n">${yes(st.echoCancellation)}</td></tr>
      <tr><td>Noise suppression</td><td class="n">${yes(st.noiseSuppression)}</td></tr>
      <tr><td>Automatic gain</td><td class="n">${yes(st.autoGainControl)}</td></tr>
    </tbody></table></div>`;
  const cv = $('#wave'), x = cv.getContext('2d'), ink = getComputedStyle(document.body).getPropertyValue('--accent') || '#FF5B35';
  const loop = () => {
    an.getFloatTimeDomainData(buf);
    let sum = 0;
    for (const v of buf) sum += v * v;
    const rms = Math.sqrt(sum / buf.length), db = 20 * Math.log10(rms || 1e-8), level = Math.min(1, Math.max(0, (db + 60) / 60));
    peak = Math.max(level, peak - 0.006);
    if (level > 0.3) heard++;
    $('#lvl').style.width = `${level * 100}%`; $('#lvl').style.setProperty('--w', `${100 / Math.max(level, 0.01)}%`);
    $('#pk').style.left = `calc(${peak * 100}% - 2px)`;
    $('#db').textContent = `${Math.round(level * 100)}% · ${db < -90 ? '−∞' : Math.round(db)} dBFS`;
    x.clearRect(0, 0, cv.width, cv.height);
    x.lineWidth = 3; x.strokeStyle = ink.trim(); x.beginPath();
    for (let i = 0; i < buf.length; i += 4) { const px = i / buf.length * cv.width, py = cv.height / 2 - buf[i] * cv.height * 1.6; i ? x.lineTo(px, py) : x.moveTo(px, py); }
    x.stroke();
    const secs = (performance.now() - t0) / 1000;
    const v = heard > 8 ? (peak > 0.97 ? 'loud' : 'ok') : secs > 6 ? 'quiet' : 'wait';
    if (v !== verdict && $('#vd')) {
      verdict = v;
      $('#vd').innerHTML = {
        wait: '<span class="verdict tight">Listening…</span><p class="sub">Say something, or tap the microphone.</p>',
        ok: '<span class="verdict ok">Your microphone works</span><p class="sub">We can hear you clearly. Record a clip below to hear how you sound.</p>',
        loud: '<span class="verdict tight">Works, but very loud</span><p class="sub">The level reaches the top, so your voice may sound distorted. Lower the input volume or move back a little.</p>',
        quiet: '<span class="verdict no">We can’t hear much</span><p class="sub">The level stays low. Speak closer to the mic, raise the input volume in your sound settings, check any mute switch, or choose another microphone.</p>',
      }[v];
      if (v === 'ok') toast('Your microphone works');
    }
    raf = requestAnimationFrame(loop);
  };
  loop();
}

function stop(keepUi) {
  cancelAnimationFrame(raf);
  stopStream(stream); stream = null;
  if (ac) { ac.close().catch(() => {}); ac = null; }
  if (keepUi !== true) { $('#stop').hidden = true; $('#go span').textContent = 'Start mic test'; $('#lvl').style.width = '0'; }
}

async function record() {
  if (!stream || !window.MediaRecorder) { $('#clip').innerHTML = '<p class="note">Recording isn’t supported in this browser, but the meter above still shows whether the mic works.</p>'; return; }
  const btn = $('#rec'), chunks = [], r = new MediaRecorder(stream);
  r.ondataavailable = e => e.data.size && chunks.push(e.data);
  r.onstop = () => {
    const blob = new Blob(chunks, { type: r.mimeType || 'audio/webm' }), url = URL.createObjectURL(blob);
    $('#clip').innerHTML = `<p class="group-title" style="margin-top:12px">Your test recording</p><audio controls src="${url}" style="width:100%"></audio>`;
    btn.disabled = false; btn.lastChild.textContent = 'Record again';
    $('#clip audio').play().catch(() => {});
  };
  r.start(); btn.disabled = true;
  for (let s = 5; s > 0; s--) { btn.lastChild.textContent = `Recording… ${s}`; await new Promise(res => setTimeout(res, 1000)); if (r.state !== 'recording') return; }
  r.stop();
}
window.addEventListener('pagehide', () => stop());
