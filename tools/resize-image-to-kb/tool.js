// Resize Image to KB: crop or fit to exact pixels, then search the JPG quality for the largest file that fits
// under the maximum; below the minimum, add a JPEG comment block (padding) so the file meets it unchanged.
const out = $('#out');
const PRESETS = {
  photo: { w: 200, h: 230, min: 20, max: 50, clean: false },
  sign: { w: 140, h: 60, min: 10, max: 20, clean: true },
  passport: { w: 413, h: 531, min: '', max: 100, clean: false },
  k20: { w: '', h: '', min: '', max: 20 }, k50: { w: '', h: '', min: '', max: 50 }, k100: { w: '', h: '', min: '', max: 100 }, k200: { w: '', h: '', min: '', max: 200 },
};
let img = null, name = 'photo', timer = 0;
function setPreset(p) {
  ['w', 'h', 'min', 'max'].forEach(k => { if (p[k] !== undefined) $('#' + k).value = p[k]; });
  if (p.clean !== undefined) $('#clean').checked = p.clean;
  run();
}
$$('#presets [data-p]').forEach(b => b.addEventListener('click', () => { $$('#presets .chip').forEach(c => c.classList.toggle('on', c === b)); setPreset(PRESETS[b.dataset.p]); }));
if (typeof PRESET !== 'undefined' && PRESET) setPreset(PRESET);
fileDrop($('#drop'), $('#file'), async fs => {
  const f = fs.find(x => x.type.startsWith('image/') || /\.heic$/i.test(x.name));
  if (!f) return;
  try { img = await loadImage(f); } catch (e) { toast(e.message, 'err'); return; }
  name = baseName(f.name);
  $('#loaded').textContent = `${f.name} · ${img.naturalWidth}×${img.naturalHeight} px · ${bytes(f.size)}`;
  run();
});
$('#sample').addEventListener('click', async () => { img = await loadImage(await sampleImage('image/jpeg')); name = 'sample'; run(); });
onAny('#w, #h, #min, #max, input[name="fit"], #clean, #gray', () => { clearTimeout(timer); timer = setTimeout(run, 250); });

// The picture at the asked pixels.
function draw(scale = 1) {
  const sw = img.naturalWidth, sh = img.naturalHeight;
  let W = +$('#w').value || 0, H = +$('#h').value || 0;
  if (!W && !H) { W = sw; H = sh; } else if (!W) W = Math.round(sw * H / sh); else if (!H) H = Math.round(sh * W / sw);
  W = Math.max(1, Math.round(W * scale)); H = Math.max(1, Math.round(H * scale));
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.imageSmoothingQuality = 'high';
  const k = $('input[name="fit"]:checked').value === 'pad' ? Math.min(W / sw, H / sh) : Math.max(W / sw, H / sh);
  // Large reductions in steps, so small pictures stay sharp.
  let src = img, cw = sw, ch = sh;
  const tw = sw * k;
  while (cw > tw * 2.5) { const t = document.createElement('canvas'); t.width = Math.ceil(cw / 2); t.height = Math.ceil(ch / 2); const tx = t.getContext('2d'); tx.imageSmoothingQuality = 'high'; tx.drawImage(src, 0, 0, t.width, t.height); src = t; cw = t.width; ch = t.height; }
  const kk = k * sw / cw;
  x.drawImage(src, (W - cw * kk) / 2, (H - ch * kk) / 2, cw * kk, ch * kk);
  if ($('#clean').checked || $('#gray').checked) {
    const d = x.getImageData(0, 0, W, H), p = d.data;
    let lo = 255, hi = 0;
    if ($('#clean').checked) { const lum = []; for (let i = 0; i < p.length; i += 4) lum.push(p[i] * 0.299 + p[i + 1] * 0.587 + p[i + 2] * 0.114); lum.sort((a, b) => a - b); lo = lum[Math.floor(lum.length * 0.01)]; hi = lum[Math.floor(lum.length * 0.6)]; }
    for (let i = 0; i < p.length; i += 4) {
      let v = p[i] * 0.299 + p[i + 1] * 0.587 + p[i + 2] * 0.114;
      if ($('#clean').checked) { v = (v - lo) / Math.max(1, hi * 0.92 - lo) * 255; v = v > 200 ? 255 : Math.max(0, v); }
      p[i] = p[i + 1] = p[i + 2] = v;
    }
    x.putImageData(d, 0, 0);
  }
  return c;
}
// Pads a JPEG to at least `size` bytes with comment blocks (ignored by every viewer).
function pad(bytesIn, size) {
  const need = size - bytesIn.length;
  if (need <= 0) return bytesIn;
  const parts = [bytesIn.subarray(0, 2)];
  let left = need;
  while (left > 0) { const n = Math.min(65533, Math.max(1, left - 4)); const seg = new Uint8Array(n + 4); seg[0] = 0xFF; seg[1] = 0xFE; seg[2] = (n + 2) >> 8; seg[3] = (n + 2) & 255; seg.fill(0x20, 4); parts.push(seg); left -= n + 4; }
  parts.push(bytesIn.subarray(2));
  const o = new Uint8Array(parts.reduce((s, p) => s + p.length, 0)); let k = 0; for (const p of parts) { o.set(p, k); k += p.length; }
  return o;
}
const jpg = async (c, q) => new Uint8Array(await (await canvasBlob(c, 'image/jpeg', q)).arrayBuffer());
let seq = 0;
async function run() {
  if (!img) return;
  const id = ++seq, maxB = (+$('#max').value || 0) * 1024, minB = (+$('#min').value || 0) * 1024;
  if (minB && maxB && minB > maxB) { out.innerHTML = '<p class="kicker">Result</p><span class="verdict no">The minimum is bigger than the maximum</span>'; return; }
  // No pixels given: start at a size where the limit still allows good quality (about 7 pixels per byte),
  // instead of squeezing a 12-megapixel photo into a few KB.
  const fixed = +$('#w').value || +$('#h').value;
  let scale0 = 1;
  if (!fixed && maxB) scale0 = Math.min(1, Math.sqrt(maxB * 7 / (img.naturalWidth * img.naturalHeight)));
  let c = draw(scale0), best = null, note = scale0 < 1 ? 'The picture was made smaller in pixels so it stays sharp at this size limit. Enter a width and height to choose the pixels yourself.' : '';
  // Highest quality that fits under the maximum (binary search), shrinking the pixels only if even the
  // lowest quality is too big and the form didn't fix the pixels.
  for (let scale = scale0, tries = 0; tries < 8; tries++) {
    let lo = 0.05, hi = 0.97, b = null;
    const top = await jpg(c, hi);
    if (!maxB || top.length <= maxB) b = { data: top, q: hi };
    else {
      for (let i = 0; i < 9; i++) { const m = (lo + hi) / 2, d = await jpg(c, m); if (d.length <= maxB) { b = { data: d, q: m }; lo = m; } else hi = m; }
      if (!b) { const d = await jpg(c, 0.05); if (d.length <= maxB) b = { data: d, q: 0.05 }; }
    }
    if (id !== seq) return;
    if (b) { best = b; break; }
    if (+$('#w').value && +$('#h').value) break;
    scale *= 0.8; c = draw(scale); note = 'The picture was made smaller in pixels to fit the size limit.';
  }
  if (!best) { out.innerHTML = '<p class="kicker">Result</p><span class="verdict no">Can’t get under that size</span><p class="sub">At these pixels, even the strongest compression is too big. Lower the width and height, or raise the maximum KB.</p>'; return; }
  let data = best.data;
  if (minB && data.length < minB) { data = pad(data, minB + 64); note = 'The picture was below the minimum size, so harmless padding was added inside the file (the picture is unchanged).'; }
  const blob = new Blob([data], { type: 'image/jpeg' }), url = URL.createObjectURL(blob);
  const ok = (!maxB || data.length <= maxB) && (!minB || data.length >= minB);
  out.innerHTML = `<p class="kicker">Result</p><img src="${url}" alt="Resized picture" style="max-width:100%;max-height:360px;display:block;margin:0 auto 10px;border:1px solid var(--line);background:#fff">
    <span class="verdict ${ok ? 'ok' : 'no'}">${(data.length / 1024).toFixed(1)} KB · ${c.width}×${c.height} px</span>
    <p class="sub">JPG at ${Math.round(best.q * 100)}% quality${maxB ? ` · limit ${minB ? `${minB / 1024}–` : 'under '}${maxB / 1024} KB` : ''}</p>${note ? `<p class="note">${note}</p>` : ''}
    <div class="btns"><button type="button" class="btn big-btn" id="dl">Download JPG</button></div>`;
  $('#dl').onclick = () => download(blob, `${name}-${c.width}x${c.height}-${Math.round(data.length / 1024)}kb.jpg`);
}
