const out = $('#out');
let src = null, cut = null, bg = 'none', bgImg = null, name = 'photo';
fileDrop($('#drop'), $('#file'), files => { const f = files.find(x => x.type.startsWith('image/')); if (f) start(f); });
$('#sample').addEventListener('click', async () => { out.innerHTML = '<p class="kicker">Result</p><p class="sub">Downloading the sample photo…</p>'; try { start(await AI.sampleBlob('portrait-of-woman_small.jpg')); } catch (e) { fail(e); } });
onAny('input[name="q"]', () => { if (src) process(); });
// Background choices: plain colours (passport, product and social media favourites) and gradients.
const SWATCHES = [['#FFFFFF', 'White'], ['#F5F3EE', 'Off-white'], ['#E5E7EB', 'Light grey'], ['#9CA3AF', 'Grey'], ['#374151', 'Charcoal'], ['#111111', 'Black'], ['#DCEBFA', 'Light blue'], ['#4A86E8', 'Passport blue'], ['#1E3A8A', 'Navy'], ['#87CEEB', 'Sky blue'], ['#D7263D', 'Red'], ['#B91C1C', 'Dark red'], ['#F8BBD0', 'Pink'], ['#FFD8B5', 'Peach'], ['#FFE45C', 'Yellow'], ['#F59E0B', 'Orange'], ['#B9F2D0', 'Mint'], ['#2E7D32', 'Green'], ['#14808A', 'Teal'], ['#E1D5F5', 'Lavender'], ['#7E57C2', 'Purple'], ['#D9C9A8', 'Beige'], ['#8B5E3C', 'Brown']];
const GRADS = [['Sunset', ['#FF9A8B', '#FF6A88', '#FF99AC']], ['Ocean', ['#2E3192', '#1BFFFF']], ['Peach', ['#FFECD2', '#FCB69F']], ['Mint', ['#D4FC79', '#96E6A1']], ['Lilac', ['#A18CD1', '#FBC2EB']], ['Sky', ['#89F7FE', '#66A6FF']], ['Gold', ['#F6D365', '#FDA085']], ['Night', ['#0F2027', '#203A43', '#2C5364']], ['Studio', 'radial']];
$('#bgsw').innerHTML = SWATCHES.map(([c, n]) => `<button type="button" data-bg="${c}" style="background:${c}" title="${n}" aria-label="${n} background"></button>`).join('');
const gradCss = g => (g[1] === 'radial' ? 'radial-gradient(circle at 50% 40%, #FFFFFF, #BDBDBD)' : `linear-gradient(135deg, ${g[1].join(', ')})`);
$('#bggr').innerHTML = GRADS.map((g, i) => `<button type="button" data-bg="grad:${i}" style="background:${gradCss(g)}" title="${g[0]} gradient" aria-label="${g[0]} gradient background"></button>`).join('');
const pickers = () => $$('#bg [data-bg], #bg [data-bg-custom], #bgsw [data-bg], #bggr [data-bg]');
function onPick(e) {
  const b = e.target.closest('[data-bg]'); if (!b) return;
  if (b.dataset.bg === 'image') { $('#bgfile').click(); return; }
  setBg(b.dataset.bg, b);
}
['#bg', '#bgsw', '#bggr'].forEach(s => $(s).addEventListener('click', onPick));
$('#bgcolor').addEventListener('input', e => setBg(e.target.value, e.target.closest('[data-bg-custom]')));
$('#bgfile').addEventListener('change', async e => { const f = e.target.files[0]; if (!f) return; bgImg = await loadImage(f); setBg('image', $('[data-bg="image"]')); });
$('#blur').addEventListener('input', () => { $('#blv').textContent = $('#blur').value; if (cut) show(); });
function setBg(v, chip) { bg = v; pickers().forEach(c => c.classList.toggle('on', c === chip)); $('#blurf').hidden = v !== 'blur'; if (cut) show(); }
// Landing pages (white background, blur background…) start with their background chosen.
if (typeof PRESET !== 'undefined' && PRESET && PRESET.bg) { const el = $(`[data-bg="${PRESET.bg}"]`); setBg(PRESET.bg, el); }

// Start loading the AI while the visitor is still choosing a photo (see AI.warmUp for when).
const quality = () => $('input[name="q"]:checked').value;
AI.warmUp(quality, [$('#drop'), $('#sample')]);

async function start(f) {
  name = baseName(f.name);
  src = await AI.toCanvas(f);
  process();
}

// While it works: the visitor's own photo with a scanning shimmer and one progress bar for the whole job.
let job = 0;
const SECS_KEY = 'tf-bg-secs';
function working() {
  const w = Math.min(800, src.width), h = Math.round(src.height * w / src.width), t = document.createElement('canvas');
  t.width = w; t.height = h; t.getContext('2d').drawImage(src, 0, 0, w, h);
  out.innerHTML = `<p class="kicker">Removing the background</p>
    <div class="ai-work"><span><img src="${t.toDataURL('image/jpeg', 0.8)}" alt="Your photo" width="${w}" height="${h}"><i></i></span></div>
    <div class="bar"><i style="width:2%"></i></div><p class="sub" data-pct>Starting…</p>`;
}
async function process() {
  const want = quality(), id = ++job;
  setSharp('');
  working();
  try {
    // First visit: the small Quick AI gives a result within seconds; Best quality then sharpens it (see sharpen).
    const q = await AI.quickOrBest(want);
    const result = await cutOut(q, id);
    if (id !== job) return;
    cut = result;
    show();
    if (q !== want) sharpen(id);
  } catch (e) { if (id === job) fail(e); }
}
async function cutOut(q, id) {
  if (!(await AI.isReady(q))) {
    // The AI is still arriving (first visit only). It counts as the first 60% of the bar.
    setProgress(out, 0.02, 'Getting ready…');
    await AI.preload(q, p => { if (id === job) setProgress(out, 0.02 + p * 0.58, `Getting ready… ${Math.round(p * 100)}%`); });
    if (id !== job) return null;
  }
  // The AI gives no progress while it works, so the bar moves with the time this took last time on this device.
  let est = q === 'fast' ? 2 : 8;
  try { est = +localStorage.getItem(`${SECS_KEY}-${q}`) || est; } catch (e) { /* storage blocked */ }
  const bar = $('.bar i', out), from = bar ? parseFloat(bar.style.width) / 100 || 0 : 0, t0 = performance.now();
  const tick = setInterval(() => { if (id !== job) return clearInterval(tick); const k = 1 - Math.exp(-(performance.now() - t0) / 1000 / est * 2.2); setProgress(out, from + (0.97 - from) * k, 'Removing the background…'); }, 150);
  const result = await AI.removeBackground(src, q).finally(() => clearInterval(tick));
  const secs = (performance.now() - t0) / 1000;
  try { localStorage.setItem(`${SECS_KEY}-${q}`, secs.toFixed(1)); } catch (e) { /* storage blocked */ }
  if (id === job) out.dataset.secs = secs.toFixed(1);
  return result;
}

// After a Quick result: load Best quality (by itself on an unmetered connection, otherwise when asked) and swap in its sharper cut-out.
let sharp = '';
function setSharp(html) { sharp = html; const el = $('#sharp'); if (el) el.innerHTML = html; }
async function sharpen(id, asked = false) {
  if (!asked && !AI.unmetered() && !(await AI.isCached('hq'))) {
    if (id === job) setSharp(`Quick result. <button type="button" class="linkbtn" id="sharpen">Sharpen the edges</button> (one-time ${await AI.modelSize('hq')} MB download).`);
    return;
  }
  try {
    setSharp('Quick result · sharpening the edges…');
    await AI.preload('hq', p => { if (id === job) setSharp(`Quick result · sharpening the edges… ${Math.round(p * 100)}%`); });
    if (id !== job) return;
    const t0 = performance.now(), result = await AI.removeBackground(src, 'hq');
    if (id !== job) return;
    try { localStorage.setItem(`${SECS_KEY}-hq`, ((performance.now() - t0) / 1000).toFixed(1)); } catch (e) { /* storage blocked */ }
    cut = result;
    setSharp('Edges sharpened with Best quality.');
    toast('Edges sharpened');
    show();
  } catch (e) { if (id === job) setSharp('Quick result. The Best quality AI couldn’t load, but this one is ready to download.'); }
}
out.addEventListener('click', e => { if (e.target.id === 'sharpen') sharpen(job, true); });
function fail(e) { out.innerHTML = `<p class="kicker">Result</p><span class="verdict no">Couldn’t remove the background</span><p class="sub">${esc(e.message || String(e))}</p><p class="note">Check your connection (the AI downloads the first time) or try the Quick option.</p>`; }

// Final image with the chosen background.
function compose() {
  const c = document.createElement('canvas');
  c.width = cut.width; c.height = cut.height;
  const x = c.getContext('2d');
  if (bg === 'blur') { x.filter = `blur(${Math.round(c.width / 600 * +$('#blur').value)}px)`; x.drawImage(src, 0, 0); x.filter = 'none'; }
  else if (bg.startsWith('grad:')) {
    const g = GRADS[+bg.slice(5)];
    const gr = g[1] === 'radial' ? x.createRadialGradient(c.width / 2, c.height * 0.4, 0, c.width / 2, c.height * 0.4, Math.max(c.width, c.height) * 0.75) : x.createLinearGradient(0, 0, c.width, c.height);
    (g[1] === 'radial' ? ['#FFFFFF', '#BDBDBD'] : g[1]).forEach((col, i, a) => gr.addColorStop(i / (a.length - 1), col));
    x.fillStyle = gr; x.fillRect(0, 0, c.width, c.height);
  }
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
    <p class="note" id="sharp">${sharp}</p>
    <div class="btns"><button type="button" class="btn big-btn" id="dl">Download ${png ? 'PNG' : 'JPG'}</button>${png ? '<button type="button" class="btn ghost" id="dl-white">JPG on white</button>' : ''}</div>`;
  const cmp = $('#cmp'), r = cmp.querySelector('input');
  const upd = () => cmp.style.setProperty('--pos', r.value + '%');
  r.addEventListener('input', upd); upd();
  $('#dl').onclick = () => download(blob, `${name}-no-bg.${png ? 'png' : 'jpg'}`);
  if (png) $('#dl-white').onclick = async () => { const keep = bg; bg = '#ffffff'; const w = compose(); bg = keep; download(await canvasBlob(w, 'image/jpeg', 0.92), `${name}-white-bg.jpg`); };
}
