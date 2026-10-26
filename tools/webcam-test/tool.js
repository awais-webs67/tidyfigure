const out = $('#out'), v = $('#v');
let stream = null, fpsTimer = 0, frames = 0, fps = 0, best = '';
$('#go').addEventListener('click', () => start());
$('#stop').addEventListener('click', stop);
$('#dev').addEventListener('change', () => start());
$('#mir').addEventListener('change', () => $('#stage').classList.toggle('mirror', $('#mir').value === '1'));
$('#snap').addEventListener('click', snapshot);
$('#best').addEventListener('click', findBest);

async function start(constraints) {
  stopStream(stream);
  const id = $('#dev').value;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: constraints || (id ? { deviceId: { exact: id } } : { width: { ideal: 1280 }, height: { ideal: 720 } }), audio: false });
  } catch (e) { out.innerHTML = '<p class="kicker">Result</p>' + mediaError(e, 'camera'); return false; }
  v.srcObject = stream; v.hidden = false; $('#ph').hidden = true;
  await v.play().catch(() => {});
  const tr = stream.getVideoTracks()[0];
  await fillDevices($('#dev'), 'videoinput', tr.getSettings().deviceId);
  ['stop', 'snap', 'best'].forEach(b => { $('#' + b).hidden = false; });
  $('#go span').textContent = 'Restart';
  countFps();
  show();
  return true;
}
function countFps() {
  clearInterval(fpsTimer); frames = 0; fps = 0;
  const tick = () => { frames++; if (stream) v.requestVideoFrameCallback(tick); };
  if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(tick);
  fpsTimer = setInterval(() => { if (v.requestVideoFrameCallback) { fps = frames; frames = 0; } else fps = Math.round(stream?.getVideoTracks()[0]?.getSettings().frameRate || 0); show(); }, 1000);
}
const label = (w, h) => { const p = Math.min(w, h); return p >= 2160 ? '4K' : p >= 1440 ? '1440p (2K)' : p >= 1080 ? 'Full HD 1080p' : p >= 720 ? 'HD 720p' : p >= 480 ? 'SD 480p' : 'Low'; };
function show() {
  if (!stream) return;
  const tr = stream.getVideoTracks()[0], s = tr.getSettings(), w = v.videoWidth || s.width, h = v.videoHeight || s.height;
  const g = (a, b) => (b ? g(b, a % b) : a), d = g(w, h) || 1;
  out.innerHTML = `<p class="kicker">Result</p><span class="verdict ok">Your webcam works</span>
    <div class="statgrid"><div class="stat"><b>${w}×${h}</b><span>${label(w, h)}</span></div><div class="stat"><b>${fps || '…'}</b><span>frames per second</span></div></div>
    ${fps && fps < 20 ? '<p class="note">The frame rate is low. More light in front of you usually makes it smoother.</p>' : ''}
    <div class="scroll"><table class="tbl"><tbody>
      <tr><td>Camera</td><td>${esc(tr.label || 'Default camera')}</td></tr>
      <tr><td>Aspect ratio</td><td class="n">${w / d}:${h / d}</td></tr>
      ${s.facingMode ? `<tr><td>Facing</td><td class="n">${s.facingMode === 'user' ? 'front' : s.facingMode === 'environment' ? 'back' : esc(s.facingMode)}</td></tr>` : ''}
      ${best ? `<tr><td>Best quality supported</td><td class="n">${best}</td></tr>` : ''}
    </tbody></table></div>`;
}
async function findBest() {
  const btn = $('#best'); btn.disabled = true;
  const id = stream?.getVideoTracks()[0]?.getSettings().deviceId;
  const tries = [[3840, 2160], [2560, 1440], [1920, 1080], [1280, 720], [640, 480]];
  for (const [w, h] of tries) {
    btn.textContent = `Trying ${label(w, h)}…`;
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { deviceId: id ? { exact: id } : undefined, width: { min: w }, height: { min: h } } });
      const got = s.getVideoTracks()[0].getSettings(); stopStream(s);
      best = `${got.width}×${got.height} (${label(got.width, got.height)})`;
      break;
    } catch (e) { /* not supported, try the next size down */ }
  }
  btn.disabled = false; btn.textContent = 'Find the best quality';
  if (best) { const [w, h] = best.split(' ')[0].split('×').map(Number); await start({ deviceId: id ? { exact: id } : undefined, width: { ideal: w }, height: { ideal: h } }); toast(`Best quality: ${best}`); }
}
function snapshot() {
  const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight;
  const x = c.getContext('2d');
  if ($('#mir').value === '1') { x.translate(c.width, 0); x.scale(-1, 1); }
  x.drawImage(v, 0, 0);
  c.toBlob(b => download(b, `webcam-${c.width}x${c.height}.png`), 'image/png');
}
function stop() {
  clearInterval(fpsTimer); stopStream(stream); stream = null;
  v.hidden = true; $('#ph').hidden = false;
  ['stop', 'snap', 'best'].forEach(b => { $('#' + b).hidden = true; });
  $('#go span').textContent = 'Start webcam test';
}
window.addEventListener('pagehide', stop);
