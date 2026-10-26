const out = $('#out'), go = $('#go'), vid = $('#vid');
let file = null, work = null, gifenc = null;
fileDrop($('#drop'), $('#file'), files => { const f = files.find(isMedia) || files[0]; if (f) load(f); });
$('#sample').addEventListener('click', async () => { out.innerHTML = '<p class="kicker">Your GIF</p><p class="sub">Recording a 5-second sample clip…</p>'; load(await sampleVideo(5)); });
$('#vid').addEventListener('pause', () => { if (work) $('#start').value = clock(vid.currentTime); });

async function load(f) {
  file = f;
  try {
    work = await loadVideo(f);
    vid.src = work.src; vid.hidden = false; go.disabled = false;
    $('#len').value = Math.min(3, Math.floor(work.duration * 2) / 2);
    out.innerHTML = `<p class="kicker">Your GIF</p><p class="sub">${esc(f.name)} · ${work.videoWidth}×${work.videoHeight} · ${clock(work.duration)}</p><p class="empty">Pause the video where the GIF should start (or type the time), then press Make GIF.</p>`;
  } catch (e) {
    out.innerHTML = `<p class="kicker">Your GIF</p><span class="verdict no">Can’t open</span><p class="sub">${esc(e.message)}</p>`;
  }
}

go.addEventListener('click', async () => {
  go.disabled = true;
  try {
    gifenc ||= await import(`${window.TF_BASE || ''}/assets/vendor/gifenc-1.0.3.esm.js`).catch(() => import('https://cdn.jsdelivr.net/npm/gifenc@1.0.3/+esm'));
    const { GIFEncoder, quantize, applyPalette } = gifenc;
    const start = Math.max(0, parseClock($('#start').value) || 0), len = Math.min(30, Math.max(0.5, val($('#len')) || 3));
    const end = Math.min(work.duration, start + len), fps = +$('#fps').value, speed = +$('#speed').value;
    const w = Math.min(+$('#w').value, work.videoWidth), h = Math.round(work.videoHeight * w / work.videoWidth / 2) * 2;
    const cap = $('#cap').value.trim();
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d', { willReadFrequently: true });
    const times = [];
    for (let t = start; t < end; t += 1 / fps) times.push(t);
    const frames = [];
    out.innerHTML = progressHtml('Reading frames');
    for (let i = 0; i < times.length; i++) {
      await seek(work, times[i]);
      x.drawImage(work, 0, 0, w, h);
      if (cap) {
        const fs = Math.max(14, Math.round(w / 14));
        x.font = `800 ${fs}px Impact, 'Arial Black', sans-serif`; x.textAlign = 'center'; x.lineWidth = fs / 7; x.strokeStyle = '#000'; x.fillStyle = '#fff';
        x.strokeText(cap, w / 2, h - fs * 0.6, w - 16); x.fillText(cap, w / 2, h - fs * 0.6, w - 16);
      }
      frames.push(x.getImageData(0, 0, w, h).data);
      setProgress(out, (i + 1) / times.length * 0.5, `Frame ${i + 1} of ${times.length}`);
    }
    const seq = $('#rev').checked ? [...frames, ...frames.slice(1, -1).reverse()] : frames;
    const gif = GIFEncoder(), delay = Math.round(1000 / fps / speed);
    for (let i = 0; i < seq.length; i++) {
      const palette = quantize(seq[i], 256);
      gif.writeFrame(applyPalette(seq[i], palette), w, h, { palette, delay });
      if (i % 4 === 0) { setProgress(out, 0.5 + (i + 1) / seq.length * 0.5, `Encoding frame ${i + 1} of ${seq.length}`); await new Promise(r => setTimeout(r)); }
    }
    gif.finish();
    const blob = new Blob([gif.bytes()], { type: 'image/gif' }), name = `${baseName(file.name)}.gif`;
    out.innerHTML = `<p class="kicker">Your GIF</p><p class="big"><mark>${bytes(blob.size)}</mark></p>
      <p class="sub">${w}×${h} · ${seq.length} frames · ${fps} fps · ${((seq.length * delay) / 1000).toFixed(1)} s loop</p>
      <img src="${URL.createObjectURL(blob)}" alt="Your animated GIF" style="max-width:100%;border-radius:6px">
      <div class="copyrow"><button type="button" class="btn" id="dl">Download GIF</button></div>
      ${blob.size > 8 * 1048576 ? '<p class="note">That’s a big GIF. Lower the width, the frames per second or the length to make it smaller.</p>' : ''}`;
    $('#dl').onclick = () => download(blob, name);
  } catch (e) {
    out.innerHTML = `<p class="kicker">Your GIF</p><span class="verdict no">Something went wrong</span><p class="sub">${esc(e.message)}</p>`;
  }
  go.disabled = false;
});
