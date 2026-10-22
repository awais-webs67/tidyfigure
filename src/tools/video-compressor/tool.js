const out = $('#out'), go = $('#go');
const BPP = { high: 0.1, medium: 0.06, low: 0.035 }; // video bits per pixel per frame at 30 fps
let file = null, video = null;
fileDrop($('#drop'), $('#file'), files => { const f = files.find(isMedia) || files[0]; if (f) load(f); });
$('#sample').addEventListener('click', async () => { out.innerHTML = '<p class="kicker">Compressed video</p><p class="sub">Recording a 5-second sample clip…</p>'; load(await sampleVideo(5)); });
onAny('#res, #q, #target, #mute', plan);
go.addEventListener('click', run);

async function load(f) {
  file = f;
  try {
    video = await loadVideo(f);
    out.innerHTML = `<p class="kicker">Your video</p><video class="player" controls playsinline src="${video.src}"></video>
      <p class="sub">${esc(f.name)} · ${bytes(f.size)} · ${video.videoWidth}×${video.videoHeight} · ${clock(video.duration)}</p>`;
    go.disabled = false;
    plan();
  } catch (e) {
    out.innerHTML = `<p class="kicker">Compressed video</p><span class="verdict no">Can’t open</span><p class="sub">${esc(e.message)}</p>`;
  }
}

function settings() {
  const res = +$('#res').value, h = res && res < video.videoHeight ? res : video.videoHeight;
  const w = video.videoWidth * h / video.videoHeight, mute = $('#mute').checked, abps = mute ? 0 : 128000;
  let vbps = Math.round(w * h * 30 * BPP[$('#q').value]);
  const target = val($('#target'));
  if (target > 0) vbps = Math.max(150000, (target * 8 * 1048576 * 0.95) / video.duration - abps);
  return { h, w: Math.round(w), vbps: Math.min(vbps, 12e6), abps, mute };
}

function plan() {
  if (!video) return;
  const s = settings(), est = (s.vbps + s.abps) * video.duration / 8;
  $('#est').innerHTML = `Output: <strong>${s.w}×${Math.round(s.h)}</strong> at about ${(s.vbps / 1e6).toFixed(2)} Mbps, roughly <strong>${bytes(est)}</strong>${est < file.size ? ` (${Math.round((1 - est / file.size) * 100)}% smaller)` : ''}. It takes about ${clock(video.duration)}, because the video is played once. Keep this tab open.`;
}

async function run() {
  const s = settings();
  go.disabled = true;
  out.innerHTML = progressHtml('Compressing') + '<p class="note">The video plays silently in the background while it is re-recorded.</p>';
  try {
    const r = await reencode({ video, height: s.h, vbps: s.vbps, abps: s.abps || 128000, mute: s.mute, onProgress: p => setProgress(out, p, `${Math.round(p * 100)}% · ${clock(p * video.duration)} of ${clock(video.duration)}`) });
    const ext = extFor(r.blob.type), name = `${baseName(file.name)}-compressed.${ext}`, smaller = r.blob.size < file.size;
    out.innerHTML = `<p class="kicker">Compressed video</p><p class="big"><mark>${bytes(r.blob.size)}</mark></p>
      <p class="sub">from ${bytes(file.size)} ${smaller ? `(<span class="saving">${Math.round((1 - r.blob.size / file.size) * 100)}% smaller</span>)` : '(not smaller: try a lower resolution or quality)'} · ${r.w}×${r.h} · ${ext.toUpperCase()}</p>
      <video class="player" controls playsinline src="${URL.createObjectURL(r.blob)}"></video>
      <div class="copyrow"><button type="button" class="btn" id="dl">Download video</button></div>
      ${ext === 'webm' ? '<p class="note">Your browser saves WebM. It plays in Chrome, Firefox, Android, VLC and on YouTube, WhatsApp Web and most sites. For an MP4, use Safari or a recent version of Chrome.</p>' : ''}`;
    $('#dl').onclick = () => download(r.blob, name);
  } catch (e) {
    out.innerHTML = `<p class="kicker">Compressed video</p><span class="verdict no">Something went wrong</span><p class="sub">${esc(e.message)}</p>`;
  }
  go.disabled = false;
}
