const list = $('#stops');
const stopRow = v => `<label class="f"><span>Colour</span><input data-f="c" type="color" value="${esc(v.c ?? '#ffffff')}"></label>
  <label class="f"><span>Position %</span><input data-f="p" type="number" inputmode="numeric" min="0" max="100" step="1" value="${esc(v.p ?? 50)}"></label>
  <label class="f"><span>Opacity %</span><input data-f="a" type="number" inputmode="numeric" min="0" max="100" step="5" value="${esc(v.a ?? 100)}"></label>
  <button type="button" class="rm" aria-label="Remove colour">×</button>`;
makeList(list, $('#add-stop'), stopRow, [{ c: '#ff5b35', p: 0 }, { c: '#ffb347', p: 100 }], render);
onAny('input[name="type"], #angle, #shape', render);
const col = (hex, a) => { if (a >= 100) return hex; const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${+(a / 100).toFixed(2)})`; };
let css = '';
function render() {
  const type = $('input[name="type"]:checked').value, ang = $('#angle').value;
  $('#av').textContent = ang;
  $('#angle-wrap').hidden = type === 'radial'; $('#shape-wrap').hidden = type !== 'radial';
  const stops = $$('.row', list).map(r => ({ c: field(r, 'c').value, p: Math.min(100, Math.max(0, val(field(r, 'p')) || 0)), a: Math.min(100, Math.max(0, ok(val(field(r, 'a'))) ? val(field(r, 'a')) : 100)) })).sort((x, y) => x.p - y.p);
  const s = stops.map(x => `${col(x.c, x.a)} ${x.p}%`).join(', ');
  const g = type === 'linear' ? `linear-gradient(${ang}deg, ${s})` : type === 'radial' ? `radial-gradient(${$('#shape').value}, ${s})` : `conic-gradient(from ${ang}deg, ${s})`;
  css = `background: ${stops[0] ? col(stops[0].c, stops[0].a) : '#fff'};\nbackground: ${g};`;
  $('#sw').style.background = g;
  $('#code').textContent = css;
}
$('#presets').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  list.innerHTML = '';
  b.dataset.p.split('|').forEach(s => { const [c, p] = s.split(','); const row = document.createElement('div'); row.className = 'row'; row.innerHTML = stopRow({ c, p }); list.appendChild(row); });
  render();
});
$('#rnd').onclick = () => {
  const h = randInt(0, 359), hsl = (hh, l) => { const c = document.createElement('canvas').getContext('2d'); c.fillStyle = `hsl(${hh % 360},75%,${l}%)`; return c.fillStyle; };
  $$('.row', list).forEach((r, i, arr) => { field(r, 'c').value = hsl(h + i * randInt(30, 90), randInt(45, 65)); field(r, 'p').value = Math.round(i / Math.max(1, arr.length - 1) * 100); });
  $('#angle').value = randInt(0, 359); render();
};
$('#png').onclick = async () => {
  const c = document.createElement('canvas'); c.width = 1920; c.height = 1080;
  const x = c.getContext('2d'), type = $('input[name="type"]:checked').value, a = $('#angle').value * Math.PI / 180;
  const stops = $$('.row', list).map(r => ({ c: col(field(r, 'c').value, ok(val(field(r, 'a'))) ? val(field(r, 'a')) : 100), p: Math.min(100, Math.max(0, val(field(r, 'p')) || 0)) / 100 })).sort((p, q) => p.p - q.p);
  let g;
  if (type === 'linear') {
    // Same geometry as CSS: the gradient line passes through the centre at the given angle and reaches the corners.
    const len = Math.abs(1920 * Math.sin(a)) + Math.abs(1080 * Math.cos(a)), dx = Math.sin(a) * len / 2, dy = -Math.cos(a) * len / 2;
    g = x.createLinearGradient(960 - dx, 540 - dy, 960 + dx, 540 + dy);
  } else if (type === 'radial') g = x.createRadialGradient(960, 540, 0, 960, 540, Math.hypot(960, 540));
  else g = x.createConicGradient(a - Math.PI / 2, 960, 540);
  stops.forEach(s => g.addColorStop(s.p, s.c));
  if (type === 'radial' && $('#shape').value === 'ellipse') { x.setTransform(1, 0, 0, 1080 / 1920, 0, 540 - 540 * 1080 / 1920); g = x.createRadialGradient(960, 540, 0, 960, 540, 960 * Math.SQRT2); stops.forEach(s => g.addColorStop(s.p, s.c)); }
  x.fillStyle = g; x.fillRect(-2000, -2000, 6000, 6000);
  download(await canvasBlob(c, 'image/png'), 'gradient-1920x1080.png');
};
render();
