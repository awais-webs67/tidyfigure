const out = $('#out');
let src = null, cut = null, bg = 'none', bgImg = null, name = 'photo';
fileDrop($('#drop'), $('#file'), files => { const f = files.find(x => x.type.startsWith('image/')); if (f) start(f); });
$('#sample').addEventListener('click', async () => { out.innerHTML = '<p class="kicker">Result</p><p class="sub">Downloading the sample photo…</p>'; try { start(await AI.sampleBlob('portrait-of-woman_small.jpg')); } catch (e) { fail(e); } });
onAny('input[name="q"]', () => { if (src) process(); });
$('#bg').addEventListener('click', e => {
  const b = e.target.closest('[data-bg]'); if (!b) return;
  if (b.dataset.bg === 'image') { $('#bgfile').click(); return; }
  setBg(b.dataset.bg, b);
});
$('#bgcolor').addEventListener('input', e => setBg(e.target.value, e.target.closest('.chip')));
$('#bgfile').addEventListener('change', async e => { const f = e.target.files[0]; if (!f) return; bgImg = await loadImage(f); setBg('image', $('[data-bg="image"]')); });
function setBg(v, chip) { bg = v; $$('#bg .chip').forEach(c => c.classList.toggle('on', c === chip)); if (cut) show(); }

async function start(f) {
  name = baseName(f.name);
  src = await AI.toCanvas(f);
  process();
}
async function process() {
  const q = $('input[name="q"]:checked').value;
  out.innerHTML = progressHtml(`Loading the AI model (${await AI.modelSize(q)} MB, one-time download)`) + '<p class="note">After the first time, the model loads instantly from your browser.</p>';
  const t0 = performance.now();
  try {
    cut = await AI.removeBackground(src, q, (p, total) => setProgress(out, p, `${Math.round(p * 100)}% of ${(total / 1048576).toFixed(0)} MB`));
    out.dataset.secs = ((performance.now() - t0) / 1000).toFixed(1);
    show();
  } catch (e) { fail(e); }
}
function fail(e) { out.innerHTML = `<p class="kicker">Result</p><span class="verdict no">Couldn’t remove the background</span><p class="sub">${esc(e.message || String(e))}</p><p class="note">Check your connection (the AI model downloads the first time) or try the Fast option.</p>`; }

// Final image with the chosen background.
function compose() {
  const c = document.createElement('canvas');
  c.width = cut.width; c.height = cut.height;
  const x = c.getContext('2d');
  if (bg === 'blur') { x.filter = `blur(${Math.round(c.width / 60)}px)`; x.drawImage(src, 0, 0); x.filter = 'none'; }
  else if (bg === 'image' && bgImg) { const k = Math.max(c.width / bgImg.width, c.height / bgImg.height); x.drawImage(bgImg, (c.width - bgImg.width * k) / 2, (c.height - bgImg.height * k) / 2, bgImg.width * k, bgImg.height * k); }
  else if (bg !== 'none') { x.fillStyle = bg; x.fillRect(0, 0, c.width, c.height); }
  x.drawImage(cut, 0, 0);
  return c;
}
async function show() {
  const c = compose(), png = bg === 'none';
  const blob = await canvasBlob(c, png ? 'image/png' : 'image/jpeg', 0.92);
  out.innerHTML = `<p class="kicker">Result · drag to compare</p>
    <div class="compare checker" id="cmp" style="aspect-ratio:${c.width}/${c.height}"><img src="${src.toDataURL('image/jpeg', 0.85)}" alt="Original"><div class="after checker"><img src="${URL.createObjectURL(blob)}" alt="Background removed"></div><input type="range" min="0" max="100" value="50" aria-label="Compare before and after"><span class="handle"></span></div>
    <p class="sub">${c.width}×${c.height} · ${bytes(blob.size)} · ${png ? 'PNG with transparency' : 'JPG'} · done in ${out.dataset.secs} s</p>
    <div class="btns"><button type="button" class="btn big-btn" id="dl">Download ${png ? 'PNG' : 'JPG'}</button>${png ? '<button type="button" class="btn ghost" id="dl-white">JPG on white</button>' : ''}</div>`;
  const cmp = $('#cmp'), r = cmp.querySelector('input');
  const upd = () => cmp.style.setProperty('--pos', r.value + '%');
  r.addEventListener('input', upd); upd();
  $('#dl').onclick = () => download(blob, `${name}-no-bg.${png ? 'png' : 'jpg'}`);
  if (png) $('#dl-white').onclick = async () => { const keep = bg; bg = '#ffffff'; const w = compose(); bg = keep; download(await canvasBlob(w, 'image/jpeg', 0.92), `${name}-white-bg.jpg`); };
}
