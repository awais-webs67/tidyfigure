const FONTS = ['Homemade Apple', 'Caveat', 'Indie Flower', 'Shadows Into Light', 'Patrick Hand', 'Kalam', 'Dancing Script', 'Gloria Hallelujah', 'Reenie Beanie', 'Nothing You Could Do', 'Cedarville Cursive', 'La Belle Aurore', 'Covered By Your Grace', 'Architects Daughter', 'Just Another Hand', 'Zeyada'];
// Fonts are drawn at different sizes for the same setting; these factors even them out.
const SCALE = { Caveat: 1.25, 'Indie Flower': 1.05, 'Homemade Apple': 0.8, 'Reenie Beanie': 1.3, 'Just Another Hand': 1.25, Zeyada: 1.2, 'Cedarville Cursive': 0.95, 'La Belle Aurore': 0.95, 'Covered By Your Grace': 1.1, 'Nothing You Could Do': 0.92, 'Gloria Hallelujah': 0.88, 'Patrick Hand': 1.08, 'Shadows Into Light': 1.05 };
const INKS = [['#1A3D8F', 'Blue'], ['#0F1E3D', 'Dark blue'], ['#1D1D1F', 'Black'], ['#B3261E', 'Red'], ['#1E6B3A', 'Green'], ['#5B2A86', 'Purple'], ['#55595E', 'Pencil']];
const SIZES = { a4: [1240, 1754], letter: [1275, 1650] };
const KEY = 'tf-handwriting';
const SAMPLE = '<h2>My Summer Holiday</h2><div>This summer I visited my grandparents in the countryside. Every morning we walked to the river, and in the evenings my grandmother told <b>stories about her childhood</b>.</div><div><br></div><div>The best day was when we picked mangoes from the garden and made fresh juice. I learned three things:</div><ul><li>Simple things make the <span style="background-color: rgb(255, 228, 92);">happiest memories</span>.</li><li>Fresh fruit tastes better from the tree.</li><li>Grandparents tell the <u>best stories</u>.</li></ul><div><br></div><div style="text-align: right;"><i>I can’t wait to go back next year!</i></div>';
const ed = $('#ed');
let font = FONTS[0], ink = INKS[0][0], seed = 7, pages = [], drop = {};
const S = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })();
// Only formatting tags survive when restoring saved text.
function clean(html) { const t = document.createElement('template'); t.innerHTML = html; t.content.querySelectorAll('script,style,iframe,object,embed,img,svg,link,meta').forEach(n => n.remove()); t.content.querySelectorAll('*').forEach(n => [...n.attributes].forEach(a => { if (!['style', 'color', 'size'].includes(a.name)) n.removeAttribute(a.name); })); return t.innerHTML; }
ed.innerHTML = clean(S.html || SAMPLE);
if (S.font && FONTS.includes(S.font)) font = S.font;
if (S.ink) ink = S.ink;
for (const k of ['paper', 'size', 'margin', 'fsz', 'lh', 'wob', 'hname', 'hdate']) if (S[k] !== undefined && $('#' + k)) $('#' + k).value = S[k];
for (const k of ['pnum', 'scan']) if (S[k] !== undefined) $('#' + k).checked = S[k];
// Font picker labels: one tiny request with only the letters of the names.
(function previews() { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = `https://fonts.googleapis.com/css2?${FONTS.map(f => 'family=' + f.replace(/ /g, '+')).join('&')}&text=${encodeURIComponent([...new Set(FONTS.join(''))].join(''))}&display=swap`; document.head.appendChild(l); })();
$('#fonts').innerHTML = FONTS.map(f => `<button type="button" data-f="${f}" class="${f === font ? 'on' : ''}" style="font-family:'${f}',cursive" title="${f}">${f}</button>`).join('');
$('#inks').insertAdjacentHTML('beforeend', INKS.map(([c, n]) => `<button type="button" data-c="${c}" class="${c === ink ? 'on' : ''}" style="background:${c}" aria-label="${n} ink" title="${n}"></button>`).join(''));
const loaded = new Set();
async function loadFont(f) {
  if (loaded.has(f)) return;
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = `https://fonts.googleapis.com/css2?family=${f.replace(/ /g, '+')}&display=block`;
  document.head.appendChild(l);
  await new Promise(r => { l.onload = r; l.onerror = r; setTimeout(r, 4000); });
  try { await document.fonts.load(`40px "${f}"`, 'Hello'); } catch (e) { /* fallback font */ }
  loaded.add(f); drop[f] = measureDrop(f);
}
// How far the bottom of plain letters (no descenders) sits from the baseline, as a share of the font size.
// Measured from pixels, because script fonts often draw below or above their official baseline.
function measureDrop(f) {
  const c = document.createElement('canvas'); c.width = 900; c.height = 240;
  const x = c.getContext('2d'); x.font = `100px "${f}", cursive`; x.fillStyle = '#000'; x.fillText('acemnorsuvwxz', 10, 150);
  const d = x.getImageData(0, 0, c.width, c.height).data;
  for (let y = c.height - 1; y > 60; y--) { let n = 0; for (let xx = 0; xx < c.width; xx++) if (d[(y * c.width + xx) * 4 + 3] > 90) n++; if (n > 6) return (y - 150) / 100; }
  return 0;
}
function rng(s) { return () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ---------- Reading the editor ----------
const BLOCK = /^(DIV|P|H[1-6]|LI|BLOCKQUOTE|PRE)$/;
function readBlocks() {
  const base = parseFloat(getComputedStyle(ed).fontSize) || 16, defColor = getComputedStyle(ed).color, out = [];
  let cur = null;
  const start = (el, list) => { cur = { align: getComputedStyle(el).textAlign, list, runs: [], head: /^H[1-6]$/.test(el.tagName) }; out.push(cur); };
  const deco = (el, re) => { for (let e = el; e && e !== ed; e = e.parentElement) { if (re.test(e.tagName) || re.test(getComputedStyle(e).textDecorationLine)) return true; } return false; };
  const hil = el => { for (let e = el; e && e !== ed; e = e.parentElement) { const b = getComputedStyle(e).backgroundColor; if (b && !/rgba\(0, 0, 0, 0\)|transparent/.test(b)) return b; } return null; };
  function walk(node, list, num) {
    for (const n of node.childNodes) {
      if (n.nodeType === 3) {
        if (!n.textContent) continue;
        if (!cur) start(node === ed ? ed : node, list);
        const el = n.parentElement, cs = getComputedStyle(el);
        cur.runs.push({ t: n.textContent.replace(/\s+/g, ' '), b: (+cs.fontWeight || 400) >= 600, i: cs.fontStyle === 'italic', u: deco(el, /^U$|underline/), s: deco(el, /^(S|STRIKE|DEL)$|line-through/), c: cs.color === defColor ? null : cs.color, hl: hil(el), z: parseFloat(cs.fontSize) / base });
      } else if (n.nodeName === 'BR') {
        if (!cur) start(node === ed ? ed : node, list);
        cur.runs.push({ br: true });
      } else if (n.nodeName === 'UL' || n.nodeName === 'OL') {
        cur = null; let i = 0;
        for (const li of n.children) { i++; start(li, n.nodeName === 'UL' ? '•' : `${i}.`); walk(li, n.nodeName, i); cur = null; }
      } else if (n.nodeType === 1 && BLOCK.test(n.nodeName)) {
        cur = null; start(n, list); walk(n, list, num); cur = null;
      } else if (n.nodeType === 1) walk(n, list, num);
    }
  }
  walk(ed, null, 0);
  // A block that holds only a <br> is an empty line.
  return out.map(b => (b.runs.length === 1 && b.runs[0].br ? { ...b, runs: [] } : b));
}

// ---------- Paper ----------
function paper(x, W, H, kind, L, top, left) {
  const bg = { legal: '#FFF7B8', old: '#F1E3C2' }[kind] || '#FFFFFF';
  x.fillStyle = bg; x.fillRect(0, 0, W, H);
  if (kind === 'old') { const g = x.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.85); g.addColorStop(0, 'rgba(255,248,225,0)'); g.addColorStop(1, 'rgba(120,80,30,.32)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
  x.lineWidth = 2;
  if (['notebook', 'ruled', 'ruledborder', 'legal'].includes(kind)) {
    x.strokeStyle = kind === 'legal' ? 'rgba(60,110,190,.45)' : 'rgba(70,130,210,.42)';
    const x0 = kind === 'ruledborder' ? 60 : 0, x1 = kind === 'ruledborder' ? W - 60 : W;
    for (let y = top; y < H - (kind === 'ruledborder' ? 70 : 30); y += L) { x.beginPath(); x.moveTo(x0, y); x.lineTo(x1, y); x.stroke(); }
    if (kind === 'notebook' || kind === 'legal') { x.strokeStyle = 'rgba(220,60,60,.62)'; [left - 26, kind === 'legal' ? left - 18 : null].forEach(v => { if (v) { x.beginPath(); x.moveTo(v, 0); x.lineTo(v, H); x.stroke(); } }); }
  } else if (kind === 'grid') {
    x.strokeStyle = 'rgba(70,130,210,.25)'; x.lineWidth = 1.5; const g = L / 2;
    for (let y = top % g; y < H; y += g) { x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); }
    for (let v = 0; v < W; v += g) { x.beginPath(); x.moveTo(v, 0); x.lineTo(v, H); x.stroke(); }
  } else if (kind === 'dots') {
    x.fillStyle = 'rgba(90,100,120,.42)'; const g = L / 2;
    for (let y = top % g; y < H; y += g) for (let v = g; v < W; v += g) { x.beginPath(); x.arc(v, y, 2.2, 0, 7); x.fill(); }
  }
  if (kind === 'border' || kind === 'ruledborder') { x.strokeStyle = 'rgba(40,50,70,.75)'; x.lineWidth = 4; x.strokeRect(40, 40, W - 80, H - 80); x.lineWidth = 1.5; x.strokeRect(52, 52, W - 104, H - 104); }
}

// ---------- Rendering ----------
function render() {
  const [W, H] = SIZES[$('#size').value], kind = $('#paper').value, L = +$('#lh').value, wob = +$('#wob').value / 100, mg = +$('#margin').value;
  const fs = +$('#fsz').value * (SCALE[font] || 1), r = rng(seed), dr = drop[font] || 0;
  $('#szv').textContent = $('#fsz').value; $('#lsv').textContent = L; $('#wbv').textContent = `${$('#wob').value}%`;
  const framed = kind === 'border' || kind === 'ruledborder';
  const left = Math.round((kind === 'notebook' || kind === 'legal' ? 176 : framed ? 120 : 110) * mg), right = W - Math.round((framed ? 110 : 90) * mg), top = Math.round(150 * mg), bottom = H - Math.round((framed ? 120 : 100) * mg);
  const fam = `"${font}", "Segoe Print", "Comic Sans MS", cursive`;
  const fontOf = (run, size) => `${size}px ${fam}`;
  pages = [];
  let c, x, y;
  const newPage = () => {
    c = document.createElement('canvas'); c.width = W; c.height = H; x = c.getContext('2d');
    paper(x, W, H, kind, L, top + L, left);
    if ('letterSpacing' in x) x.letterSpacing = '0px';
    pages.push(c); y = top + L;
    // Name and date at the top of the first page, in the margin above the first line.
    if (pages.length === 1 && ($('#hname').value.trim() || $('#hdate').value.trim())) {
      x.save(); x.fillStyle = ink; x.font = `${fs * 0.85}px ${fam}`; x.textAlign = 'right';
      const lines = [$('#hname').value.trim(), $('#hdate').value.trim()].filter(Boolean);
      lines.forEach((t, i) => x.fillText(t, right, top - 18 - (lines.length - 1 - i) * fs * 1.05 - dr * fs * 0.85));
      x.restore();
    }
  };
  newPage();
  const blocks = readBlocks();
  for (const b of blocks) {
    const head = b.head, indent = b.list ? fs * 1.4 : 0;
    // Words with their style; a run can contain several words.
    const words = [];
    for (const run of b.runs) {
      if (run.br) { words.push({ br: true }); continue; }
      const z = Math.max(0.6, Math.min(2.6, (run.z || 1) * (head ? 1.25 : 1))), size = fs * z;
      run.t.split(/(\s+)/).forEach(part => { if (!part) return; if (/^\s+$/.test(part)) { if (words.length) words[words.length - 1].space = true; return; } x.font = fontOf(run, size); words.push({ t: part, w: x.measureText(part).width * (run.b || head ? 1.04 : 1), size, run: head ? { ...run, b: true, u: true } : run, space: false }); });
    }
    if (!words.length) { y += L; if (y > bottom) newPage(); continue; }
    // Break into lines.
    const maxW = right - left - indent, lines = [];
    let line = [], wsum = 0;
    for (const w of words) {
      if (w.br) { lines.push({ ws: line, end: true }); line = []; wsum = 0; continue; }
      x.font = fontOf(w.run, w.size); const sp = x.measureText(' ').width * 1.15;
      if (line.length && wsum + w.w > maxW) { lines.push({ ws: line, end: false }); line = []; wsum = 0; }
      line.push(w); wsum += w.w + (w.space ? sp : 0); w.sp = sp;
    }
    if (line.length) lines.push({ ws: line, end: true });
    lines.forEach((ln, li) => {
      if (!ln.ws.length) { y += L; if (y > bottom) newPage(); return; }
      const maxSize = Math.max(...ln.ws.map(w => w.size)), adv = L * Math.max(1, Math.ceil((maxSize * 1.05) / L));
      if (adv > L) y += adv - L;
      if (y > bottom) { newPage(); if (adv > L) y += adv - L; }
      const natural = ln.ws.reduce((a, w, i) => a + w.w + (i < ln.ws.length - 1 ? w.sp : 0), 0), free = maxW - natural;
      const al = b.align === 'center' ? 'c' : b.align === 'right' || b.align === 'end' ? 'r' : b.align === 'justify' ? 'j' : 'l';
      let cx = left + indent + (al === 'c' ? free / 2 : al === 'r' ? free : 0);
      const extra = al === 'j' && !ln.end && ln.ws.length > 1 ? free / (ln.ws.length - 1) : 0;
      if (li === 0 && b.list) { x.font = `${fs}px ${fam}`; x.fillStyle = ink; x.fillText(b.list, left + indent - fs * (b.list === '•' ? 0.9 : 1.25), y - 4 - dr * fs); }
      ln.ws.forEach((w, wi) => {
        const run = w.run, col = run.c || ink, base = y - 4 - dr * w.size;
        const dy = -r() * L * 0.08 * wob, rot = (r() - 0.5) * 0.05 * wob, sc = 1 + (r() - 0.5) * 0.06 * wob;
        if (run.hl) { x.save(); x.globalAlpha = 0.45; x.fillStyle = run.hl.replace(/rgba?\(([^)]+)\)/, (m, v) => `rgb(${v.split(',').slice(0, 3).join(',')})`); x.beginPath(); x.moveTo(cx - 4, base + w.size * 0.12); x.lineTo(cx + w.w + 4, base + w.size * 0.08); x.lineTo(cx + w.w + 2, base - w.size * 0.62); x.lineTo(cx - 2, base - w.size * 0.6); x.fill(); x.restore(); }
        x.save();
        x.translate(cx, base + dy); x.rotate(rot); if (run.i) x.transform(1, 0, -0.22, 1, 0, 0); x.scale(sc, sc);
        x.font = fontOf(run, w.size); x.fillStyle = col; x.strokeStyle = col; x.globalAlpha = 0.86 + r() * 0.14 * (1 - wob * 0.4);
        x.fillText(w.t, 0, 0);
        if (run.b || head) { x.lineWidth = Math.max(1, w.size * 0.035); x.lineJoin = 'round'; x.strokeText(w.t, 0, 0); }
        const handLine = (yy) => { x.lineWidth = Math.max(1.5, w.size * 0.05); x.beginPath(); x.moveTo(0, yy); x.quadraticCurveTo(w.w / 2, yy + (r() - 0.5) * 4, w.w + (wi < ln.ws.length - 1 && w.space ? w.sp * 0.6 : 0), yy + (r() - 0.5) * 3); x.stroke(); };
        if (run.u) handLine(w.size * 0.12);
        if (run.s) handLine(-w.size * 0.28);
        x.restore();
        cx += w.w * sc + (w.space ? w.sp : 0) + extra;
      });
      y += L;
      if (y > bottom && !(li === lines.length - 1)) newPage();
    });
    if (y > bottom) newPage();
  }
  // Drop a trailing empty page.
  if (pages.length > 1 && y === top + L && !blocks.length) pages.pop();
  if ($('#pnum').checked) pages.forEach((p, i) => { const g = p.getContext('2d'); g.fillStyle = ink; g.font = `${fs * 0.75}px ${fam}`; g.textAlign = 'center'; g.fillText(String(i + 1), W / 2, H - 50); });
  if ($('#scan').checked) pages = pages.map(scanned);
  show(); save();
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
    const d = document.createElement('div'); d.className = 'hw-page'; d.appendChild(c);
    d.insertAdjacentHTML('beforeend', `<div class="btns"><span class="sub">Page ${i + 1}</span><button type="button" class="btn ghost" data-png="${i}">PNG</button><button type="button" class="btn ghost" data-jpg="${i}">JPG</button></div>`);
    box.appendChild(d);
  });
}
function save() {
  const s = { html: ed.innerHTML, font, ink }; for (const k of ['paper', 'size', 'margin', 'fsz', 'lh', 'wob', 'hname', 'hdate']) s[k] = $('#' + k).value; for (const k of ['pnum', 'scan']) s[k] = $('#' + k).checked;
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage blocked */ }
}

// ---------- Toolbar ----------
let t = 0;
const later = () => { clearTimeout(t); t = setTimeout(render, 220); };
try { document.execCommand('styleWithCSS', false, true); } catch (e) { /* older browsers */ }
function refreshTb() { $$('#tb [data-cmd]').forEach(b => { const c = b.dataset.cmd; if (['bold', 'italic', 'underline', 'strikeThrough', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList'].includes(c)) { try { b.classList.toggle('on', document.queryCommandState(c)); } catch (e) { /* not supported */ } } }); }
$('#tb').addEventListener('mousedown', e => { if (e.target.closest('button')) e.preventDefault(); }); // keep the text selection
$('#tb').addEventListener('click', e => {
  const b = e.target.closest('[data-cmd]'); if (!b) return;
  const c = b.dataset.cmd; ed.focus();
  if (c === 'hilite') { const on = document.queryCommandValue('hiliteColor'); document.execCommand('hiliteColor', false, /255, 228, 92|ffe45c/i.test(on) ? 'transparent' : '#FFE45C'); }
  else if (c === 'heading') document.execCommand('formatBlock', false, document.queryCommandValue('formatBlock').toLowerCase() === 'h2' ? 'div' : 'h2');
  else document.execCommand(c, false, null);
  refreshTb(); later();
});
$('#fsel').addEventListener('change', e => { ed.focus(); document.execCommand('fontSize', false, e.target.value); later(); });
$('#tcolor').addEventListener('input', e => { $('#cdot').style.background = e.target.value; ed.focus(); document.execCommand('foreColor', false, e.target.value); later(); });
ed.addEventListener('input', later);
ed.addEventListener('keyup', refreshTb); ed.addEventListener('mouseup', refreshTb);
ed.addEventListener('paste', e => { e.preventDefault(); document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text/plain')); });

// ---------- Settings and downloads ----------
$('#fonts').addEventListener('click', async e => { const b = e.target.closest('[data-f]'); if (!b) return; $$('#fonts button').forEach(x => x.classList.toggle('on', x === b)); font = b.dataset.f; await loadFont(font); render(); });
$('#inks').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; $$('#inks button').forEach(x => x.classList.toggle('on', x === b)); ink = b.dataset.c; render(); });
$('#vary').addEventListener('click', () => { seed = Math.floor(Math.random() * 1e9); render(); });
onAny('#paper, #size, #margin, #fsz, #lh, #wob, #hname, #hdate, #pnum, #scan', later);
$('#pages').addEventListener('click', e => {
  const p = e.target.closest('[data-png]'), j = e.target.closest('[data-jpg]');
  if (p) pages[+p.dataset.png].toBlob(bl => download(bl, `handwriting-page-${+p.dataset.png + 1}.png`), 'image/png');
  if (j) pages[+j.dataset.jpg].toBlob(bl => download(bl, `handwriting-page-${+j.dataset.jpg + 1}.jpg`), 'image/jpeg', 0.92);
});
$('#all').addEventListener('click', () => pages.forEach((c, i) => setTimeout(() => c.toBlob(bl => download(bl, `handwriting-page-${i + 1}.jpg`), 'image/jpeg', 0.92), i * 350)));
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
loadFont(font).then(render);
