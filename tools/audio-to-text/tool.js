const out = $('#out');
let file = null, url = null, result = null;
fileDrop($('#drop'), $('#file'), files => files[0] && choose(files[0]));
$('#sample').addEventListener('click', async () => { out.innerHTML = '<p class="kicker">Transcript</p><p class="sub">Downloading the sample…</p>'; const f = await AI.sampleBlob('jfk.wav'); choose(new File([f], 'jfk-speech.wav', { type: 'audio/wav' })); $('#lang').value = 'english'; run(); });

function choose(f) {
  file = f;
  if (url) URL.revokeObjectURL(url);
  url = URL.createObjectURL(f);
  const video = f.type.startsWith('video/') || /\.(mp4|mov|webm|mkv)$/i.test(f.name);
  $('#player').hidden = false;
  $('#player').innerHTML = `${video ? `<video class="player" id="media" controls playsinline src="${url}"></video>` : `<audio class="player" id="media" controls src="${url}"></audio>`}<p class="sub">${esc(f.name)} · ${bytes(f.size)}</p>`;
  $('#go').disabled = false;
  out.innerHTML = '<p class="kicker">Transcript</p><p class="empty">Press Transcribe when you’re ready.</p>';
}
$('#go').addEventListener('click', run);

const ts = (s, sep = ',') => { s = Math.max(0, s || 0); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = Math.floor(s % 60), ms = Math.round((s % 1) * 1000); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}${sep}${String(ms).padStart(3, '0')}`; };
const short = s => { s = Math.max(0, s || 0); return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`; };

async function run() {
  if (!file) return;
  $('#go').disabled = true;
  out.innerHTML = progressHtml('Preparing the audio…');
  const t0 = performance.now();
  let tick;
  try {
    const { samples, duration } = await AI.audio16k(file);
    if (duration > 3 * 3600) throw new Error('Recordings up to 3 hours are supported. Cut it into parts with the audio cutter.');
    out.querySelector('.kicker').textContent = `Loading the speech AI (${$('#model').value === 'tiny' ? 41 : 77} MB, one-time download)`;
    const res = AI.transcribe(samples, { model: $('#model').value, language: $('#lang').value || null, task: $('#task').value, onProgress: p => setProgress(out, p) });
    // Transcription has no progress events, so show elapsed time and an estimate.
    const est = Math.max(5, duration * ($('#model').value === 'tiny' ? 0.25 : 0.6));
    const t1 = performance.now();
    tick = setInterval(() => { const k = out.querySelector('.kicker'); if (k && /Loading/.test(k.textContent) && out.querySelector('[data-pct]').textContent.startsWith('100')) { k.textContent = `Transcribing ${short(duration)} of audio…`; } const el = (performance.now() - t1) / 1000; if (k && /Transcribing/.test(k.textContent)) setProgress(out, Math.min(0.97, el / est), `${Math.round(el)} s · usually done in about ${Math.round(est)} s`); }, 500);
    result = await res;
    clearInterval(tick);
    show(duration, (performance.now() - t0) / 1000);
  } catch (e) {
    clearInterval(tick);
    out.innerHTML = `<p class="kicker">Transcript</p><span class="verdict no">Couldn’t transcribe</span><p class="sub">${esc(e.message || String(e))}</p>`;
  }
  $('#go').disabled = false;
}

function show(duration, secs) {
  const chunks = (result.chunks || []).filter(c => c.text.trim());
  const text = (result.text || '').trim();
  out.innerHTML = `<p class="kicker">Transcript · ${short(duration)} of audio · done in ${Math.round(secs)} s</p>
    <textarea id="txt" class="ocr-text" dir="auto">${esc(text)}</textarea>
    <div class="btns"><button type="button" class="btn" id="copy">Copy text</button><button type="button" class="btn ghost" data-dl="txt">.txt</button><button type="button" class="btn ghost" data-dl="srt">Subtitles .srt</button><button type="button" class="btn ghost" data-dl="vtt">.vtt</button></div>
    ${chunks.length ? `<p class="kicker">Timestamps · click to play from there</p><ol class="segs">${chunks.map(c => `<li><button type="button" data-t="${c.timestamp[0] || 0}">${short(c.timestamp[0])}</button><span dir="auto">${esc(c.text.trim())}</span></li>`).join('')}</ol>` : ''}
    <p class="note">AI transcripts can mishear names and technical words. Check the text before you publish it.</p>`;
  $('#copy').onclick = e => copyText($('#txt').value, e.currentTarget);
  out.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { const m = $('#media'); if (m) { m.currentTime = +b.dataset.t; m.play(); } });
  out.querySelectorAll('[data-dl]').forEach(b => b.onclick = () => {
    const kind = b.dataset.dl, base = baseName(file.name);
    if (kind === 'txt') return download(new Blob([$('#txt').value], { type: 'text/plain;charset=utf-8' }), `${base}.txt`);
    const lines = chunks.map((c, i) => { const s = c.timestamp[0] || 0, e = c.timestamp[1] ?? Math.min(duration, s + 4); return kind === 'srt' ? `${i + 1}\n${ts(s)} --> ${ts(e)}\n${c.text.trim()}\n` : `${ts(s, '.')} --> ${ts(e, '.')}\n${c.text.trim()}\n`; });
    download(new Blob([(kind === 'vtt' ? 'WEBVTT\n\n' : '') + lines.join('\n')], { type: 'text/plain;charset=utf-8' }), `${base}.${kind}`);
  });
}
