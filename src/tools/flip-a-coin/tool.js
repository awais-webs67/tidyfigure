let angle = 0, busy = false;
let flips = []; // 'H' | 'T'
const coin = $('#coin');

const toss = () => (randInt(0, 1) ? 'H' : 'T');

function flip() {
  if (busy) return;
  busy = true;
  const side = toss();
  // Spin 5–7 whole turns, then land on the right face (0° = heads, 180° = tails).
  const turns = 5 + randInt(0, 2);
  angle = Math.ceil(angle / 360) * 360 + turns * 360 + (side === 'T' ? 180 : 0);
  coin.style.transform = `rotateY(${angle}deg)`;
  $('#result').textContent = '…';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(() => {
    flips.push(side);
    $('#result').innerHTML = `<mark>${side === 'H' ? 'Heads' : 'Tails'}</mark>`;
    busy = false;
    stats();
  }, reduce ? 50 : 1600);
}

function many(n) {
  const batch = Array.from({ length: n }, toss);
  flips.push(...batch);
  const last = batch[batch.length - 1];
  angle = Math.ceil(angle / 360) * 360 + (last === 'T' ? 180 : 0);
  coin.style.transform = `rotateY(${angle}deg)`;
  const h = batch.filter(x => x === 'H').length;
  $('#result').innerHTML = `<mark>${h} heads, ${n - h} tails</mark>`;
  stats();
}

function stats() {
  const n = flips.length, h = flips.filter(x => x === 'H').length;
  let best = 0, run = 0;
  flips.forEach((x, i) => { run = i && x === flips[i - 1] ? run + 1 : 1; best = Math.max(best, run); });
  $('#stats').innerHTML = `<div class="stat"><b>${h}</b><span>Heads${n ? ` · ${(h / n * 100).toFixed(0)}%` : ''}</span></div>
    <div class="stat"><b>${n - h}</b><span>Tails${n ? ` · ${((n - h) / n * 100).toFixed(0)}%` : ''}</span></div>
    <div class="stat"><b>${n}</b><span>Total flips</span></div>
    <div class="stat"><b>${best}</b><span>Longest streak</span></div>`;
  $('#history').textContent = n ? flips.slice(-200).join(' ') : 'H = heads, T = tails. Your flips appear here.';
}

$('#flip').addEventListener('click', flip);
coin.addEventListener('click', flip);
$('#flip10').addEventListener('click', () => many(10));
$('#flip100').addEventListener('click', () => many(100));
$('#reset').addEventListener('click', () => { flips = []; $('#result').textContent = 'Tap to flip'; stats(); });
stats();
