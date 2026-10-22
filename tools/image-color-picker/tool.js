const cv = $('#cv'), x = cv.getContext('2d', { willReadFrequently: true });
let img = null, locked = false;
const hex = (r, g, b) => '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
function hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  let h = 0, s = 0;
  if (d) { s = d / (1 - Math.abs(2 * l - 1)); h = (mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60; if (h < 0) h += 360; }
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}
function show(px, py) {
  const [r, g, b] = x.getImageData(px, py, 1, 1).data;
  const H = hex(r, g, b);
  $('#sw').style.background = H;
  $('#vals').innerHTML = [['HEX', H], ['RGB', `rgb(${r}, ${g}, ${b})`], ['HSL', hsl(r, g, b)]].map(([k, v]) => `<li><span class="meta"><small>${k}</small><b style="font-family:var(--f-num);font-weight:500">${v}</b></span><button type="button" class="btn ghost" data-v="${v}">Copy</button></li>`).join('');
  const z = $('#zoom').getContext('2d');
  z.imageSmoothingEnabled = false;
  z.clearRect(0, 0, 110, 110);
  z.drawImage(cv, px - 5, py - 5, 11, 11, 0, 0, 110, 110);
  z.strokeStyle = '#fff'; z.lineWidth = 2; z.strokeRect(50, 50, 10, 10);
}
const at = e => { const r = cv.getBoundingClientRect(); return [Math.floor((e.clientX - r.left) * cv.width / r.width), Math.floor((e.clientY - r.top) * cv.height / r.height)]; };
cv.addEventListener('pointermove', e => { if (img && !locked) show(...at(e)); });
cv.addEventListener('pointerdown', e => { if (!img) return; locked = true; show(...at(e)); });
cv.addEventListener('pointerleave', () => {});
$('#out').addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (b) copyText(b.dataset.v, b.tagName === 'BUTTON' ? b : null); });

// Main colours: bucket pixels into a coarse colour grid and keep the biggest distinct buckets.
function palette() {
  const s = 120 / Math.max(cv.width, cv.height), w = Math.max(1, Math.round(cv.width * s)), h = Math.max(1, Math.round(cv.height * s));
  const t = document.createElement('canvas'); t.width = w; t.height = h;
  const tx = t.getContext('2d'); tx.drawImage(cv, 0, 0, w, h);
  const d = tx.getImageData(0, 0, w, h).data, buckets = new Map();
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 128) continue;
    const key = (d[i] >> 4) << 8 | (d[i + 1] >> 4) << 4 | (d[i + 2] >> 4);
    const bk = buckets.get(key) || [0, 0, 0, 0];
    bk[0] += d[i]; bk[1] += d[i + 1]; bk[2] += d[i + 2]; bk[3]++;
    buckets.set(key, bk);
  }
  const cols = [...buckets.values()].sort((a, b) => b[3] - a[3]).map(([r, g, b, n]) => [r / n, g / n, b / n].map(Math.round));
  const picked = [];
  for (const c of cols) { if (picked.every(p => Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2]) > 48)) picked.push(c); if (picked.length === 8) break; }
  $('#palette').innerHTML = picked.map(([r, g, b]) => { const H = hex(r, g, b); return `<button type="button" data-v="${H}" title="Copy ${H}" style="aspect-ratio:1.4;border-radius:6px;border:1px solid var(--line);background:${H};cursor:pointer;color:${(r * 299 + g * 587 + b * 114) / 1000 > 140 ? '#000' : '#fff'};font:500 11px var(--f-num)">${H}</button>`; }).join('');
}
function use(i) {
  img = i; locked = false;
  const s = Math.min(1, 1000 / Math.max(i.naturalWidth, i.naturalHeight));
  cv.width = Math.round(i.naturalWidth * s); cv.height = Math.round(i.naturalHeight * s);
  x.drawImage(i, 0, 0, cv.width, cv.height);
  show(Math.floor(cv.width / 2), Math.floor(cv.height / 2));
  palette();
}
pickImage($('#drop'), $('#file'), use);
$('#sample').addEventListener('click', async () => use(await loadImage(await sampleImage('image/jpeg'))));
