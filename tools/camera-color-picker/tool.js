const v = $('#v'), c = document.createElement('canvas'), x = c.getContext('2d', { willReadFrequently: true });
let stream = null, timer = 0, frozen = false, pt = [0.5, 0.5], cur = null, last = '';
const saved = [];
async function start() {
  stopStream(stream);
  const id = $('#dev').value;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: id ? { deviceId: { exact: id } } : { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } }, audio: false });
  } catch (e) { $('#out').innerHTML = '<p class="kicker">Colour</p>' + mediaError(e, 'camera'); return; }
  v.srcObject = stream; v.hidden = false; $('#ph').hidden = true; $('#aim').hidden = false;
  await v.play().catch(() => {});
  await fillDevices($('#dev'), 'videoinput', stream.getVideoTracks()[0].getSettings().deviceId);
  $('#freeze').disabled = $('#save').disabled = false; $('#go span').textContent = 'Restart camera';
  frozen = false; $('#freeze').textContent = 'Freeze';
  clearInterval(timer); timer = setInterval(sample, 120);
}
// The video is shown with object-fit: cover, so map the tapped point back to the video's own pixels.
function videoPoint() {
  const st = $('#stage'), W = st.clientWidth, H = st.clientHeight, vw = v.videoWidth, vh = v.videoHeight, k = Math.max(W / vw, H / vh);
  return [(pt[0] * W - (W - vw * k) / 2) / k, (pt[1] * H - (H - vh * k) / 2) / k];
}
function sample() {
  if (frozen || !v.videoWidth) return;
  const [px, py] = videoPoint(), r = Math.max(3, Math.round(v.videoWidth / 160));
  c.width = c.height = r * 2 + 1;
  x.drawImage(v, Math.round(px) - r, Math.round(py) - r, c.width, c.height, 0, 0, c.width, c.height);
  const d = x.getImageData(0, 0, c.width, c.height).data;
  let R = 0, G = 0, B = 0, n = 0;
  for (let i = 0; i < d.length; i += 4) { R += d[i]; G += d[i + 1]; B += d[i + 2]; n++; }
  cur = [R / n, G / n, B / n].map(Math.round);
  show();
}
function show() {
  const hex = Color.rgbToHex(cur);
  if (hex === last) return;
  last = hex;
  const nm = Color.name(cur), text = Color.lum(cur) > 0.4 ? '#000' : '#fff';
  $('#out').innerHTML = `<p class="kicker">Colour${frozen ? ' (frozen)' : ''}</p>
    <div class="cp-sw" style="background:${hex};color:${text};display:grid;place-items:center;font:700 22px var(--f-num)">${hex}</div>
    <p class="big">${nm.exact ? '' : 'Close to '}${esc(nm.name)}</p>
    <div class="scroll"><table class="tbl"><tbody>
      <tr><td>HEX</td><td class="n">${hex}</td><td><button type="button" class="linkbtn" data-c="${hex}">Copy</button></td></tr>
      <tr><td>RGB</td><td class="n">rgb(${cur.join(', ')})</td><td><button type="button" class="linkbtn" data-c="rgb(${cur.join(', ')})">Copy</button></td></tr>
      <tr><td>HSL</td><td class="n">${Color.fmtHsl(cur)}</td><td><button type="button" class="linkbtn" data-c="${Color.fmtHsl(cur)}">Copy</button></td></tr>
    </tbody></table></div>`;
}
$('#out').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) copyText(b.dataset.c); });
$('#stage').addEventListener('pointerdown', e => {
  if (!stream) return;
  const r = e.currentTarget.getBoundingClientRect();
  pt = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
  $('#aim').style.left = `${pt[0] * 100}%`; $('#aim').style.top = `${pt[1] * 100}%`;
  frozen = false; $('#freeze').textContent = 'Freeze'; last = ''; sample();
});
$('#freeze').addEventListener('click', e => { frozen = !frozen; e.currentTarget.textContent = frozen ? 'Unfreeze' : 'Freeze'; if (frozen) v.pause(); else v.play(); last = ''; if (cur) show(); });
$('#save').addEventListener('click', () => {
  if (!cur) return;
  const hex = Color.rgbToHex(cur);
  if (!saved.includes(hex)) saved.unshift(hex);
  $('#palwrap').hidden = false;
  $('#pal').innerHTML = saved.map(h => `<button type="button" style="background:${h}" title="${h}" aria-label="Copy ${h}" data-c="${h}"></button>`).join('');
  toast(`Saved ${hex}`);
});
$('#pal').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) copyText(b.dataset.c); });
$('#go').addEventListener('click', start);
$('#dev').addEventListener('change', start);
window.addEventListener('pagehide', () => { clearInterval(timer); stopStream(stream); });
