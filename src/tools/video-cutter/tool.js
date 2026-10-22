const out = $('#out'), go = $('#go'), vid = $('#vid'), r1 = $('#r1'), r2 = $('#r2');
let file = null, dur = 0, work = null;
fileDrop($('#drop'), $('#file'), files => { const f = files.find(isMedia) || files[0]; if (f) load(f); });
$('#sample').addEventListener('click', async () => { out.innerHTML = '<p class="kicker">Your clip</p><p class="sub">Recording a 5-second sample clip…</p>'; load(await sampleVideo(5)); });

async function load(f) {
  file = f;
  try {
    work = await loadVideo(f);
    dur = work.duration;
    vid.src = work.src;
    [r1, r2].forEach(r => { r.max = dur; r.step = dur > 600 ? 1 : 0.1; });
    r1.value = 0; r2.value = dur;
    $('#editor').hidden = false; go.disabled = false;
    sync();
  } catch (e) {
    out.innerHTML = `<p class="kicker">Your clip</p><span class="verdict no">Can’t open</span><p class="sub">${esc(e.message)}</p>`;
  }
}
const range = () => [Math.min(+r1.value, +r2.value), Math.max(+r1.value, +r2.value)];
function sync(from) {
  const [s, e] = range();
  if (from !== 'text') { $('#start').value = clock(s); $('#end').value = clock(e); }
  out.innerHTML = `<p class="kicker">Your clip</p><p class="big"><mark>${clock(e - s)}</mark></p><p class="sub">from ${clock(s)} to ${clock(e)} of ${clock(dur)} · ${esc(file.name)}</p>`;
}
[r1, r2].forEach(r => r.addEventListener('input', () => { vid.currentTime = +r.value; sync(); }));
onAny('#start, #end', () => {
  const s = parseClock($('#start').value), e = parseClock($('#end').value);
  if (ok(s)) r1.value = Math.min(dur, s); if (ok(e)) r2.value = Math.min(dur, e);
  sync('text');
});
$('#set-start').onclick = () => { r1.value = vid.currentTime; sync(); };
$('#set-end').onclick = () => { r2.value = vid.currentTime; sync(); };
$('#preview').onclick = () => {
  const [s, e] = range();
  vid.currentTime = s; vid.play();
  const stop = () => { if (vid.currentTime >= e) { vid.pause(); vid.removeEventListener('timeupdate', stop); } };
  vid.addEventListener('timeupdate', stop);
};

go.addEventListener('click', async () => {
  const [s, e] = range();
  if (e - s < 0.2) { out.innerHTML = '<p class="kicker">Your clip</p><p class="empty">Choose a part at least 0.2 seconds long.</p>'; return; }
  vid.pause(); go.disabled = true;
  const vbps = Math.min(12e6, Math.round(work.videoWidth * work.videoHeight * 30 * +$('#q').value));
  out.innerHTML = progressHtml('Cutting') + '<p class="note">The selected part plays once in the background while it is saved. Keep this tab open.</p>';
  try {
    const r = await reencode({ video: work, start: s, end: e, vbps, mute: $('#mute').checked, onProgress: p => setProgress(out, p, `${Math.round(p * 100)}% · ${clock(p * (e - s))} of ${clock(e - s)}`) });
    const ext = extFor(r.blob.type), name = `${baseName(file.name)}-clip.${ext}`;
    out.innerHTML = `<p class="kicker">Your clip</p><p class="big"><mark>${clock(e - s)}</mark></p>
      <p class="sub">${bytes(r.blob.size)} · ${r.w}×${r.h} · ${ext.toUpperCase()}</p>
      <video class="player" controls playsinline src="${URL.createObjectURL(r.blob)}"></video>
      <div class="copyrow"><button type="button" class="btn" id="dl">Download clip</button></div>
      ${ext === 'webm' ? '<p class="note">Saved as WebM, which plays in Chrome, Firefox, Android, VLC and on most websites. Safari and recent Chrome save MP4.</p>' : ''}`;
    $('#dl').onclick = () => download(r.blob, name);
  } catch (err) {
    out.innerHTML = `<p class="kicker">Your clip</p><span class="verdict no">Something went wrong</span><p class="sub">${esc(err.message)}</p>`;
  }
  go.disabled = false;
});
