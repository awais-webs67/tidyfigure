const COLORS = ['#0B7F5E', '#2B57D1', '#D0353B', '#B86F00', '#6A47DB', '#C7347A', '#0A7DBB', '#AD4F14', '#3F8F2F', '#5B6474'];
const canvas = $('#wheel'), ctx = canvas.getContext('2d');
const R = canvas.width / 2;
let rot = 0, spinning = false;

const entries = () => $('#entries').value.split('\n').map(s => s.trim()).filter(Boolean);

function draw() {
  const items = entries();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!items.length) return;
  const seg = Math.PI * 2 / items.length;
  items.forEach((label, i) => {
    const a0 = rot + i * seg - Math.PI / 2;
    ctx.beginPath(); ctx.moveTo(R, R); ctx.arc(R, R, R - 8, a0, a0 + seg); ctx.closePath();
    ctx.fillStyle = items.length === 1 ? COLORS[0] : COLORS[i % (items.length % COLORS.length === 1 ? COLORS.length - 1 : COLORS.length)];
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 3; ctx.stroke();
    ctx.save();
    ctx.translate(R, R); ctx.rotate(a0 + seg / 2);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    const size = Math.max(18, Math.min(44, 520 / items.length + 12));
    ctx.font = `600 ${size}px "DM Sans", system-ui, sans-serif`;
    const text = label.length > 22 ? label.slice(0, 21) + '…' : label;
    ctx.fillText(text, R - 40, 0);
    ctx.restore();
  });
  ctx.beginPath(); ctx.arc(R, R, 46, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = '#0D1321'; ctx.stroke();
  $('#count').textContent = `${items.length} entr${items.length === 1 ? 'y' : 'ies'} · each has a ${(100 / items.length).toFixed(1)}% chance`;
}

function spin() {
  const items = entries();
  if (spinning || items.length < 2) { if (items.length < 2) $('#result').textContent = 'Add at least two entries.'; return; }
  spinning = true;
  $('#result').textContent = '';
  const seg = Math.PI * 2 / items.length;
  const winner = randInt(0, items.length - 1);
  // Land the pointer (at the top) somewhere inside the winner's slice, after 6–8 full turns.
  const inside = (0.15 + rand(0.7)) * seg;
  let target = -(winner * seg + inside);
  const turns = 6 + randInt(0, 2);
  while (target < rot + turns * Math.PI * 2) target += Math.PI * 2;
  const start = rot, dist = target - start, dur = 4200 + rand(1200);
  const t0 = performance.now();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frame = now => {
    const t = reduce ? 1 : Math.min(1, (now - t0) / dur);
    rot = start + dist * (1 - Math.pow(1 - t, 4)); // ease out
    draw();
    if (t < 1) return requestAnimationFrame(frame);
    rot %= Math.PI * 2;
    spinning = false;
    $('#result').innerHTML = `<mark>${esc(items[winner])}</mark>`;
    if ($('#remove').checked) {
      const lines = $('#entries').value.split('\n');
      const idx = lines.findIndex(l => l.trim() === items[winner]);
      lines.splice(idx, 1);
      setTimeout(() => { $('#entries').value = lines.join('\n'); draw(); }, 1200);
    }
  };
  requestAnimationFrame(frame);
}

$('#spin').addEventListener('click', spin);
canvas.addEventListener('click', spin);
$('#entries').addEventListener('input', draw);
$('#shuffle').addEventListener('click', () => {
  const items = entries();
  for (let i = items.length - 1; i > 0; i--) { const j = randInt(0, i); [items[i], items[j]] = [items[j], items[i]]; }
  $('#entries').value = items.join('\n'); draw();
});
$('#yesno').addEventListener('click', () => { $('#entries').value = 'Yes\nNo\nYes\nNo'; draw(); });
$('#names').addEventListener('click', () => { $('#entries').value = 'Alex\nSam\nPriya\nLeo\nMia\nNoah\nAisha\nKai'; draw(); });
if (document.fonts) document.fonts.ready.then(draw);
draw();
