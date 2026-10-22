const cv = $('#cv'), x = cv.getContext('2d');
let tpl = 'confetti', photo = null, seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const THEMES = {
  confetti: { bg: ['#fff4e8', '#ffe3ef'], ink: '#2b2140', accent: '#ff5b35', colors: ['#ff5b35', '#ffb703', '#2ec4b6', '#8338ec', '#ff006e'] },
  balloons: { bg: ['#e0f2ff', '#fde2ff'], ink: '#23314d', accent: '#e2457f', colors: ['#ff6b8b', '#ffd166', '#06d6a0', '#4cc9f0', '#b388ff'] },
  gold: { bg: ['#0f1b33', '#1c2c52'], ink: '#f6e7b8', accent: '#d4af37', colors: ['#d4af37', '#f6e7b8', '#c9a227'] },
  minimal: { bg: ['#ffffff', '#ffffff'], ink: '#191f24', accent: '#ff5b35', colors: ['#ff5b35'] },
  kids: { bg: ['#fff9db', '#d3f9d8'], ink: '#1d3557', accent: '#ef476f', colors: ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#f78c6b'] },
};
function wrap(text, max) {
  const out = []; let line = '';
  for (const w of text.split(/\s+/)) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > max && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line); return out;
}
function draw() {
  const [W, H] = $('#size').value.split('x').map(Number);
  cv.width = W; cv.height = H;
  const th = THEMES[tpl], s0 = seed, u = W / 1080;
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, th.bg[0]); g.addColorStop(1, th.bg[1]);
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  if (tpl === 'confetti' || tpl === 'kids') {
    for (let i = 0; i < 140; i++) {
      x.save(); x.translate(rnd() * W, rnd() * H); x.rotate(rnd() * Math.PI);
      x.fillStyle = th.colors[Math.floor(rnd() * th.colors.length)]; x.globalAlpha = 0.85;
      if (tpl === 'kids' && i % 3 === 0) { star(0, 0, 14 * u + rnd() * 18 * u); } else x.fillRect(-8 * u, -3 * u, (12 + rnd() * 12) * u, 6 * u);
      x.restore();
    }
  } else if (tpl === 'balloons') {
    for (let i = 0; i < 9; i++) {
      // Keep balloons to the left and right edges so they never cover the text.
      const bx = (i % 2 ? 0.04 + 0.14 * rnd() : 0.82 + 0.14 * rnd()) * W, by = (0.08 + 0.75 * (i / 9) + 0.06 * rnd()) * H, r = (48 + rnd() * 30) * u;
      x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = 2 * u; x.beginPath(); x.moveTo(bx, by + r * 1.15); x.quadraticCurveTo(bx + 20 * u, by + r * 2, bx - 10 * u, by + r * 3); x.stroke();
      x.fillStyle = th.colors[i % th.colors.length]; x.beginPath(); x.ellipse(bx, by, r * 0.85, r, 0, 0, Math.PI * 2); x.fill();
      x.fillStyle = 'rgba(255,255,255,.45)'; x.beginPath(); x.ellipse(bx - r * 0.3, by - r * 0.35, r * 0.15, r * 0.25, -0.5, 0, Math.PI * 2); x.fill();
    }
  } else if (tpl === 'gold') {
    for (let i = 0; i < 60; i++) { x.fillStyle = th.colors[i % 3]; x.globalAlpha = 0.3 + rnd() * 0.7; x.save(); x.translate(rnd() * W, rnd() * H); star(0, 0, (4 + rnd() * 10) * u); x.restore(); }
    x.globalAlpha = 1; x.strokeStyle = th.accent; x.lineWidth = 4 * u; x.strokeRect(40 * u, 40 * u, W - 80 * u, H - 80 * u);
  } else {
    x.fillStyle = th.accent; x.fillRect(0, 0, W, 18 * u); x.fillRect(0, H - 18 * u, W, 18 * u);
  }
  seed = s0; x.globalAlpha = 1;
  // Text block, vertically centred.
  const name = $('#name').value.trim(), age = val($('#age')), msg = $('#msg').value.trim(), from = $('#from').value.trim();
  let y = H * (photo ? 0.36 : 0.3);
  if (photo) {
    const r = 150 * u, cx = W / 2, cy = H * 0.2;
    x.save(); x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.clip();
    const k = Math.max(2 * r / photo.naturalWidth, 2 * r / photo.naturalHeight);
    x.drawImage(photo, cx - photo.naturalWidth * k / 2, cy - photo.naturalHeight * k / 2, photo.naturalWidth * k, photo.naturalHeight * k);
    x.restore(); x.strokeStyle = th.accent; x.lineWidth = 10 * u; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke();
    y = cy + r + 110 * u;
  }
  x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  x.fillStyle = th.accent; x.font = `400 ${130 * u}px Pacifico, cursive`; x.fillText('Happy Birthday', W / 2, y); y += 150 * u;
  if (name) { x.fillStyle = th.ink; x.font = `400 ${150 * u}px "Bebas Neue", Impact, sans-serif`; x.fillText(name.toUpperCase(), W / 2, y); y += 70 * u; }
  if (age > 0) { const r = 62 * u; x.fillStyle = th.accent; x.beginPath(); x.arc(W / 2, y + r, r, 0, Math.PI * 2); x.fill(); x.fillStyle = '#fff'; x.font = `400 ${76 * u}px "Bebas Neue", Impact, sans-serif`; x.fillText(String(Math.round(age)), W / 2, y + r + 27 * u); y += r * 2 + 80 * u; } else y += 30 * u;
  if (msg) { x.fillStyle = th.ink; x.font = `500 ${40 * u}px Inter, Arial, sans-serif`; wrap(msg, W * 0.78).forEach(l => { x.fillText(l, W / 2, y); y += 56 * u; }); y += 30 * u; }
  if (from) { x.fillStyle = th.accent; x.font = `400 ${56 * u}px Pacifico, cursive`; x.fillText(from, W / 2, y); }
}
function star(cx, cy, r) { x.beginPath(); for (let i = 0; i < 10; i++) { const a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); x.fill(); }
$('#tpl').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; tpl = b.dataset.t; $$('#tpl .chip').forEach(c => c.classList.toggle('on', c === b)); draw(); });
$('#shuffle').addEventListener('click', () => { seed = Math.floor(Math.random() * 1e6) + 1; draw(); });
$('#photo').addEventListener('change', async () => { const f = $('#photo').files[0]; photo = f ? await loadImage(f) : null; draw(); });
onAny('#name, #age, #from, #size, #msg', draw);
$('#save').addEventListener('click', async () => download(await canvasBlob(cv, 'image/png'), `birthday-card-${($('#name').value || 'card').replace(/[^\w-]+/g, '-').toLowerCase()}.png`));
Promise.all([document.fonts.load('130px Pacifico'), document.fonts.load('130px "Bebas Neue"')]).catch(() => {}).then(draw);
draw();
