// Pip positions on a 3×3 grid (cells 1–9, left to right, top to bottom).
const PIPS = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] };
let history = [];

const face = (v, sides) => sides === 6
  ? `<div class="die roll" role="img" aria-label="${v}">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(c => (PIPS[v].includes(c) ? '<i></i>' : '<span></span>')).join('')}</div>`
  : `<div class="die num roll" role="img" aria-label="${v}"><span>${v}<br><small>d${sides}</small></span></div>`;

function roll() {
  const n = +$('#n').value, sides = +$('#sides').value;
  const vals = Array.from({ length: n }, () => randInt(1, sides));
  const total = vals.reduce((a, b) => a + b, 0);
  $('#dice').innerHTML = vals.map(v => face(v, sides)).join('');
  $('#total').innerHTML = n > 1 ? `Total <mark>${total}</mark>` : `<mark>${vals[0]}</mark>`;
  history.unshift(`${n}d${sides}: ${vals.join(' + ')}${n > 1 ? ` = ${total}` : ''}`);
  history = history.slice(0, 20);
  $('#history').textContent = history.join('\n');
}

$('#roll').addEventListener('click', roll);
$('#dice').addEventListener('click', roll);
onAny('#n, #sides', roll);
document.addEventListener('keydown', e => { if (e.code === 'Space' && !/INPUT|SELECT|TEXTAREA|BUTTON/.test(e.target.tagName)) { e.preventDefault(); roll(); } });
roll();
