const FONTS = ['Homemade Apple', 'Caveat', 'Indie Flower', 'Shadows Into Light', 'Patrick Hand', 'Kalam', 'Dancing Script', 'Gloria Hallelujah', 'Reenie Beanie', 'Nothing You Could Do', 'Cedarville Cursive', 'La Belle Aurore', 'Covered By Your Grace', 'Architects Daughter', 'Just Another Hand', 'Zeyada'];
// Some fonts draw small; scale them so the same size setting looks similar.
const SCALE = { Caveat: 1.25, 'Indie Flower': 1.05, 'Homemade Apple': 0.82, 'Reenie Beanie': 1.25, 'Just Another Hand': 1.2, 'Zeyada': 1.2, 'Cedarville Cursive': 0.92, 'La Belle Aurore': 0.92, 'Covered By Your Grace': 1.08, 'Nothing You Could Do': 0.92, 'Gloria Hallelujah': 0.88 };
const INKS = [['#1A3D8F', 'Blue'], ['#0F1E3D', 'Dark blue'], ['#1D1D1F', 'Black'], ['#B3261E', 'Red'], ['#1E6B3A', 'Green'], ['#5B2A86', 'Purple'], ['#55595E', 'Pencil']];
const SIZES = { a4: [1240, 1754], letter: [1275, 1650] };
const SAMPLE = '# My Summer Holiday\nThis summer I visited my grandparents in the countryside. Every morning we walked to the river, and in the evenings my grandmother told stories about her childhood.\n\nThe best day was when we picked mangoes from the garden and made fresh juice. I learned that the simple things often make the happiest memories.\n\nI can’t wait to go back next year!';
let font = FONTS[0], ink = INKS[0][0], seed = 7, pages = [];
const loaded = new Set();
// Labels: one tiny Google Fonts request with only the letters of the names.
(function previews() {
  const l = document.createElement('link'); l.rel = 'stylesheet';
  l.href = `https://fonts.googleapis.com/css2?${FONTS.map(f => 'family=' + f.replace(/ /g, '+')).join('&')}&text=${encodeURIComponent([...new Set(FONTS.join(''))].join(''))}&display=swap`;
  document.head.appendChild(l);
})();
$('#fonts').innerHTML = FONTS.map((f, i) => `<button type="button" data-f="${f}" class="${i ? '' : 'on'}" style="font-family:'${f}',cursive" title="${f}">${f}</button>`).join('');
$('#inks').insertAdjacentHTML('beforeend', INKS.map(([c, n], i) => `<button type="button" data-c="${c}" class="${i ? '' : 'on'}" style="background:${c}" aria-label="${n} ink" title="${n}"></button>`).join(''));
$('#txt').value = SAMPLE;
async function loadFont(f) {
  if (loaded.has(f)) return;
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = `https://fonts.googleapis.com/css2?family=${f.replace(/ /g, '+')}&display=block`;
  document.head.appendChild(l);
  await new Promise(r => { l.onload = r; l.onerror = r; setTimeout(r, 4000); });
  try { await document.fonts.load(`40px "${f}"`, 'Hello'); } catch (e) { /* use fallback */ }
  loaded.add(f);
}
function rng(s) { return () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function paper(x, W, H, kind, L, top) {
  const bg = { legal: '#FFF7B8', old: '#F1E3C2' }[kind] || '#FFFFFF';
  x.fillStyle = bg; x.fillRect(0, 0, W, H);
  if (kind === 'old') { const g = x.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.85); g.addColorStop(0, 'rgba(255,248,225,0)'); g.addColorStop(1, 'rgba(120,80,30,.32)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
  x.lineWidth = 2;
  if (kind === 'notebook' || kind === 'ruled' || kind === 'legal') {
    x.strokeStyle = kind === 'legal' ? 'rgba(60,110,190,.45)' : 'rgba(70,130,210,.42)';
    for (let y = top; y < H - 40; y += L) { x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); }
    if (kind !== 'ruled') { x.strokeStyle = 'rgba(220,60,60,.6)'; const mx = kind === 'legal' ? 150 : 140; [mx, kind === 'legal' ? mx + 8 : null].forEach(v => { if (v) { x.beginPath(); x.moveTo(v, 0); x.lineTo(v, H); x.stroke(); } }); }
  } else if (kind === 'grid') {
    x.strokeStyle = 'rgba(70,130,210,.25)'; x.lineWidth = 1.5; const g = L / 2;
    for (let y = top % g; y < H; y += g) { x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); }
    for (let v = 0; v < W; v += g) { x.beginPath(); x.moveTo(v, 0); x.lineTo(v, H); x.stroke(); }
  } else if (kind === 'dots') {
    x.fillStyle = 'rgba(90,100,120,.4)'; const g = L / 2;
    for (let y = top % g; y < H; y += g) for (let v = g; v < W; v += g) { x.beginPath(); x.arc(v, y, 2.2, 0, 7); x.fill(); }
  }
}
function render() {
  const [W, H] = SIZES[$('#size').value], kind = $('#paper').value, L = +$('#lh').value, wob = +$('#wob').value / 100, lsp = +$('#lsp').value;
  const fs = +$('#fsz').value * (SCALE[font] || 1), r = rng(seed);
  $('#szv').textContent = $('#fsz').value; $('#lsv').textContent = L; $('#wbv').textContent = `${$('#wob').value}%`; $('#lspv').textContent = lsp;
  const left = kind === 'notebook' || kind === 'legal' ? 172 : 110, right = W - 90, top = 150, bottom = H - 90;
  const fam = `"${font}", "Segoe Print", "Comic Sans MS", cursive`;
  pages = [];
  let c, x, y;
  const newPage = () => { c = document.createElement('canvas'); c.width = W; c.height = H; x = c.getContext('2d'); paper(x, W, H, kind, L, top + L); x.fillStyle = ink; x.textBaseline = 'alphabetic'; if ('letterSpacing' in x) x.letterSpacing = `${lsp}px`; pages.push(c); y = top + L - 5; };
  newPage();
  const lines = $('#txt').value.replace(/\r/g, '').split('\n');
  for (const raw of lines) {
    const head = /^#\s+/.test(raw), text = raw.replace(/^#\s+/, ''), size = head ? fs * 1.3 : fs;
    x.font = `${size}px ${fam}`;
    if (!text.trim()) { y += L; if (y > bottom) newPage(); continue; }
    // Script fonts often draw letters below their official baseline; lift them so they sit on the ruled line.
    const drop = Math.max(0, x.measureText('acemnorsuvwxz').actualBoundingBoxDescent || 0);
    const words = text.split(/(\s+)/).filter(w => w && !/^\s+$/.test(w)), space = x.measureText(' ').width * 1.1;
    let cx = left + (head ? (right - left - x.measureText(text).width) / 2 : 0), lineStart = true;
    if (cx < left) cx = left;
    for (const w of words) {
      const ww = x.measureText(w).width;
      if (!lineStart && cx + ww > right) { y += L; cx = left; if (y > bottom) { newPage(); x.font = `${size}px ${fam}`; } }
      x.save();
      const dy = (r() - 0.5) * L * 0.12 * wob, rot = (r() - 0.5) * 0.06 * wob, sc = 1 + (r() - 0.5) * 0.1 * wob;
      x.translate(cx, y + dy - drop); x.rotate(rot); x.scale(sc, sc);
      x.globalAlpha = 0.86 + r() * 0.14 * (1 - wob * 0.4);
      x.fillText(w, 0, 0);
      if (head) { x.globalAlpha = 0.7; x.fillRect(0, 6, ww, 2.5); }
      x.restore();
      cx += ww * sc + space * (1 + (r() - 0.5) * 0.3 * wob); lineStart = false;
    }
    y += head ? L * 1.25 : L;
    if (y > bottom) newPage();
  }
  if ($('#scan').checked) pages = pages.map(scanned);
  show();
}
function scanned(src) {
  const W = src.width, H = src.height, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'), r = rng(seed + 3);
  x.fillStyle = '#d9d6cf'; x.fillRect(0, 0, W, H);
  x.save(); x.translate(W / 2, H / 2); x.rotate((r() - 0.5) * 0.012); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 24; x.shadowOffsetX = 6; x.shadowOffsetY = 8; x.drawImage(src, -W / 2 + 14, -H / 2 + 14, W - 28, H - 28); x.restore();
  const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(0,0,0,.10)'); g.addColorStop(0.12, 'rgba(0,0,0,0)'); g.addColorStop(0.9, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.08)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  const d = x.getImageData(0, 0, W, H), p = d.data;
  for (let i = 0; i < p.length; i += 4) { const n = (r() - 0.5) * 14; p[i] += n; p[i + 1] += n; p[i + 2] += n; }
  x.putImageData(d, 0, 0);
  return c;
}
function show() {
  $('#count').textContent = `Preview · ${pages.length} page${pages.length > 1 ? 's' : ''}`;
  const box = $('#pages'); box.innerHTML = '';
  pages.forEach((c, i) => {
    const d = document.createElement('div'); d.className = 'hw-page';
    d.appendChild(c);
    d.insertAdjacentHTML('beforeend', `<div class="btns"><button type="button" class="btn ghost" data-png="${i}">PNG</button><button type="button" class="btn ghost" data-jpg="${i}">JPG</button><span class="sub">Page ${i + 1}</span></div>`);
    box.appendChild(d);
  });
}
$('#pages').addEventListener('click', e => {
  const p = e.target.closest('[data-png]'), j = e.target.closest('[data-jpg]');
  if (p) pages[+p.dataset.png].toBlob(b => download(b, `handwriting-page-${+p.dataset.png + 1}.png`), 'image/png');
  if (j) pages[+j.dataset.jpg].toBlob(b => download(b, `handwriting-page-${+j.dataset.jpg + 1}.jpg`), 'image/jpeg', 0.92);
});
$('#all').addEventListener('click', () => pages.forEach((c, i) => setTimeout(() => c.toBlob(b => download(b, `handwriting-page-${i + 1}.jpg`), 'image/jpeg', 0.92), i * 350)));
$('#pdf').addEventListener('click', async e => {
  const btn = e.currentTarget; btn.disabled = true;
  try {
    if (!window.PDFLib) await loadScript(PDFLIB_URL);
    const pdf = await PDFLib.PDFDocument.create(), [pw, ph] = $('#size').value === 'a4' ? [595.28, 841.89] : [612, 792];
    for (const c of pages) { const img = await pdf.embedJpg(await (await canvasBlob(c, 'image/jpeg', 0.9)).arrayBuffer()); pdf.addPage([pw, ph]).drawImage(img, { x: 0, y: 0, width: pw, height: ph }); }
    download(new Blob([await pdf.save()], { type: 'application/pdf' }), 'handwriting.pdf');
  } catch (err) { toast('The PDF couldn’t be made. Try the JPG download instead.', 'err'); }
  btn.disabled = false;
});
let t = 0;
const later = () => { clearTimeout(t); t = setTimeout(render, 180); };
$('#fonts').addEventListener('click', async e => { const b = e.target.closest('[data-f]'); if (!b) return; $$('#fonts button').forEach(x => x.classList.toggle('on', x === b)); font = b.dataset.f; await loadFont(font); render(); });
$('#inks').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; $$('#inks button').forEach(x => x.classList.toggle('on', x === b)); ink = b.dataset.c; render(); });
$('#vary').addEventListener('click', () => { seed = Math.floor(Math.random() * 1e9); render(); });
onAny('#txt, #paper, #size, #fsz, #lh, #wob, #lsp, #scan', later);
loadFont(font).then(render);
