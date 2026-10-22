const out = $('#out');
let file = null, audio = null;
fileDrop($('#drop'), $('#file'), files => { const f = files.find(isMedia) || files[0]; if (f) load(f); });
$('#sample').addEventListener('click', async () => { out.innerHTML = '<p class="kicker">Your audio</p><p class="sub">Recording a 5-second sample clip…</p>'; load(await sampleVideo(5)); });
onAny('#fmt, #kbps, #mono, #start, #end', () => { $('#q-wrap').hidden = $('#fmt').value !== 'mp3'; if (audio) convert(); });

async function load(f) {
  file = f; audio = null;
  out.innerHTML = `<p class="kicker">Your audio</p><p class="sub">Reading the sound track of ${esc(f.name)}…</p>`;
  try {
    audio = await decodeAudio(f);
    convert();
  } catch (e) {
    out.innerHTML = `<p class="kicker">Your audio</p><span class="verdict no">Can’t convert</span><p class="sub">${esc(e.message)}</p>`;
  }
}

let job = 0;
async function convert() {
  const id = ++job, mp3 = $('#fmt').value === 'mp3', kbps = +$('#kbps').value, mono = $('#mono').value === '1';
  let s = $('#start').value.trim() ? parseClock($('#start').value) : 0, e = $('#end').value.trim() ? parseClock($('#end').value) : audio.duration;
  if (!ok(s)) s = 0; if (!ok(e) || e > audio.duration) e = audio.duration;
  if (e <= s) { out.innerHTML = '<p class="kicker">Your audio</p><p class="empty">The end time must be after the start time.</p>'; return; }
  out.innerHTML = progressHtml(mp3 ? `Encoding MP3 at ${kbps} kbps` : 'Building WAV');
  const pcm = sliceChannels(audio, s, e, 0, 0, mono);
  const blob = mp3 ? await encodeMp3(pcm, kbps, p => setProgress(out, p)) : encodeWav(pcm);
  if (id !== job) return;
  const name = `${baseName(file.name)}.${mp3 ? 'mp3' : 'wav'}`, url = URL.createObjectURL(blob);
  out.innerHTML = `<p class="kicker">Your audio</p><p class="big"><mark>${bytes(blob.size)}</mark></p>
    <p class="sub">${esc(name)} · ${clock(e - s)} · ${pcm.chans.length === 1 ? 'mono' : 'stereo'} · ${(pcm.sampleRate / 1000).toFixed(1)} kHz${mp3 ? ` · ${kbps} kbps` : ''}</p>
    <audio class="player" controls src="${url}"></audio>
    <div class="copyrow"><button type="button" class="btn" id="dl">Download ${mp3 ? 'MP3' : 'WAV'}</button></div>
    <p class="note">Original file: ${bytes(file.size)}, ${clock(audio.duration)} long.</p>`;
  $('#dl').onclick = () => download(blob, name);
}
