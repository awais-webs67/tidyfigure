const out = $('#out'), go = $('#go'), wave = $('#wave');
let file = null, ab = null, sel = [0, 0], player = null;
fileDrop($('#drop'), $('#file'), files => { const f = files.find(isMedia) || files[0]; if (f) load(f); });
$('#sample').addEventListener('click', () => load(sampleAudio()));

async function load(f) {
  file = f;
  out.innerHTML = `<p class="kicker">Your audio</p><p class="sub">Reading ${esc(f.name)}…</p>`;
  try {
    ab = await decodeAudio(f);
    sel = [0, ab.duration];
    $('#editor').hidden = false; go.disabled = false;
    update();
  } catch (e) {
    out.innerHTML = `<p class="kicker">Your audio</p><span class="verdict no">Can’t open</span><p class="sub">${esc(e.message)}</p>`;
  }
}
function update(fromText) {
  sel = [Math.max(0, Math.min(sel[0], sel[1])), Math.min(ab.duration, Math.max(sel[0], sel[1]))];
  if (!fromText) { $('#start').value = clock(sel[0]); $('#end').value = clock(sel[1]); }
  drawWave(wave, ab, sel);
  out.innerHTML = `<p class="kicker">Selection</p><p class="big"><mark>${clock(sel[1] - sel[0])}</mark></p><p class="sub">${clock(sel[0])} to ${clock(sel[1])} of ${clock(ab.duration)} · ${esc(file.name)}</p>`;
}
const timeAt = e => { const r = wave.getBoundingClientRect(); return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * ab.duration; };
let dragging = false;
wave.addEventListener('pointerdown', e => { if (!ab) return; dragging = true; wave.setPointerCapture(e.pointerId); sel = [timeAt(e), timeAt(e)]; });
wave.addEventListener('pointermove', e => { if (dragging) { sel[1] = timeAt(e); drawWave(wave, ab, [Math.min(...sel), Math.max(...sel)]); } });
wave.addEventListener('pointerup', () => { if (!dragging) return; dragging = false; if (Math.abs(sel[1] - sel[0]) < 0.1) sel = [0, ab.duration]; update(); });
onAny('#start, #end', () => { const s = parseClock($('#start').value), e = parseClock($('#end').value); if (ok(s)) sel[0] = s; if (ok(e)) sel[1] = e; update(true); });
$('#ring').onclick = () => { sel = [sel[0], Math.min(ab.duration, sel[0] + 30)]; $('#fo').value = 2; update(); };
addEventListener('resize', () => { if (ab) drawWave(wave, ab, sel); });
$('#play').onclick = async () => {
  if (player) { player.stop(); player = null; return; }
  const c = ctx(); if (c.state === 'suspended') await c.resume();
  player = c.createBufferSource(); player.buffer = ab; player.connect(c.destination);
  player.onended = () => { player = null; };
  player.start(0, sel[0], sel[1] - sel[0]);
};

go.addEventListener('click', async () => {
  if (sel[1] - sel[0] < 0.1) return;
  go.disabled = true;
  const fmtv = $('#fmt').value, pcm = sliceChannels(ab, sel[0], sel[1], val($('#fi')) || 0, val($('#fo')) || 0);
  out.innerHTML = progressHtml('Saving your audio');
  const blob = fmtv === 'wav' ? encodeWav(pcm) : await encodeMp3(pcm, +fmtv, p => setProgress(out, p));
  const ext = fmtv === 'wav' ? 'wav' : 'mp3', name = `${baseName(file.name)}-cut.${ext}`;
  out.innerHTML = `<p class="kicker">Your audio</p><p class="big"><mark>${clock(sel[1] - sel[0])}</mark></p>
    <p class="sub">${bytes(blob.size)} · ${ext.toUpperCase()}${ext === 'mp3' ? ` · ${fmtv} kbps` : ''}</p>
    <audio class="player" controls src="${URL.createObjectURL(blob)}"></audio>
    <div class="copyrow"><button type="button" class="btn" id="dl">Download ${ext.toUpperCase()}</button></div>`;
  $('#dl').onclick = () => download(blob, name);
  go.disabled = false;
});
