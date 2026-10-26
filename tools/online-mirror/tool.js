const v = $('#v');
let stream = null;
function look() {
  const z = +$('#zoom').value, b = +$('#bright').value;
  $('#zv').textContent = `${z.toFixed(1)}×`; $('#bv').textContent = `${b}%`;
  v.style.transform = `scale(${$('#mirror').checked ? -z : z}, ${z})`;
  v.style.filter = b === 100 ? '' : `brightness(${b / 100})`;
  $('#wrap').classList.toggle('ring', $('#ring').checked);
}
async function start() {
  stopStream(stream);
  const id = $('#dev').value;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: id ? { deviceId: { exact: id } } : { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false });
  } catch (e) { $('#msg').innerHTML = `<div class="out">${mediaError(e, 'camera')}</div>`; return; }
  $('#msg').innerHTML = '';
  v.srcObject = stream; v.hidden = false; $('#ph').hidden = true;
  await v.play().catch(() => {});
  await fillDevices($('#dev'), 'videoinput', stream.getVideoTracks()[0].getSettings().deviceId);
  $('#snap').disabled = $('#full').disabled = false; $('#stop').hidden = false; $('#go').hidden = true;
  look();
}
function stop() {
  stopStream(stream); stream = null; v.hidden = true; $('#ph').hidden = false;
  $('#snap').disabled = $('#full').disabled = true; $('#stop').hidden = true; $('#go').hidden = false;
}
function snap() {
  const z = +$('#zoom').value, vw = v.videoWidth, vh = v.videoHeight, st = $('#stage'), ar = st.clientWidth / st.clientHeight;
  // Same crop as on screen: cover the stage, then zoom from the centre.
  let sw = vw, sh = vw / ar; if (sh > vh) { sh = vh; sw = vh * ar; }
  sw /= z; sh /= z;
  const c = document.createElement('canvas'); c.width = Math.round(sw); c.height = Math.round(sh);
  const x = c.getContext('2d');
  x.filter = `brightness(${+$('#bright').value / 100})`;
  if ($('#mirror').checked) { x.translate(c.width, 0); x.scale(-1, 1); }
  x.drawImage(v, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, c.width, c.height);
  c.toBlob(b => download(b, 'mirror-photo.jpg'), 'image/jpeg', 0.92);
}
$('#go').addEventListener('click', start);
$('#stop').addEventListener('click', stop);
$('#dev').addEventListener('change', start);
$('#snap').addEventListener('click', snap);
$('#full').addEventListener('click', () => { const w = $('#wrap'); if (document.fullscreenElement) document.exitFullscreen(); else (w.requestFullscreen || w.webkitRequestFullscreen)?.call(w); });
onAny('#zoom, #bright, #ring, #mirror', look);
window.addEventListener('pagehide', stop);
look();
