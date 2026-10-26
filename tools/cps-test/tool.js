const pad = $('#pad'), KEY = 'tf-cps-best';
let clicks = 0, t0 = 0, timer = 0, state = 'ready', len = 5, best = {};
try { best = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { /* storage blocked */ }
const secs = () => +$('input[name="t"]:checked').value;
const rating = c => (c < 5 ? 'Relaxed' : c < 8 ? 'Average' : c < 11 ? 'Fast' : c < 15 ? 'Very fast' : 'Exceptional');
function reset() {
  clearInterval(timer); state = 'ready'; clicks = 0; len = secs();
  pad.classList.remove('done');
  $('#big').textContent = 'Click here'; $('#hint').textContent = 'The timer starts with your first click';
  $('#s-time').textContent = len.toFixed(1); $('#s-clicks').textContent = '0'; $('#s-cps').textContent = '0.0';
  showBest();
}
function showBest() {
  const b = best[len];
  $('#out').innerHTML = `<p class="kicker">Your score</p><p class="empty">Click the box to start the ${len}-second test.</p>${b ? `<p class="sub">Your best for ${len} s: <b>${fmtMax(b, 2)} CPS</b></p>` : ''}`;
}
function hit(e) {
  if (e.button > 0) return;
  e.preventDefault();
  if (state === 'done') return;
  if (state === 'ready') { state = 'run'; t0 = performance.now(); timer = setInterval(tick, 50); $('#hint').textContent = 'Keep clicking!'; }
  clicks++; $('#big').textContent = clicks; $('#s-clicks').textContent = clicks;
}
function tick() {
  const el = (performance.now() - t0) / 1000, left = Math.max(0, len - el);
  $('#s-time').textContent = left.toFixed(1);
  $('#s-cps').textContent = (clicks / Math.max(el, 0.05)).toFixed(1);
  if (left <= 0) finish();
}
function finish() {
  clearInterval(timer); state = 'done'; pad.classList.add('done');
  const cps = clicks / len, prev = best[len] || 0, record = cps > prev;
  if (record) { best[len] = cps; try { localStorage.setItem(KEY, JSON.stringify(best)); } catch (e) { /* storage blocked */ } }
  $('#s-cps').textContent = cps.toFixed(1); $('#big').textContent = `${cps.toFixed(1)} CPS`; $('#hint').textContent = 'Wait a moment, then click Try again';
  const share = `I clicked ${cps.toFixed(1)} times per second in the ${len}-second CPS test on TidyFigure!`;
  $('#out').innerHTML = `<p class="kicker">Your score</p><p class="huge" style="text-align:left"><mark>${cps.toFixed(1)}</mark></p><p class="sub">clicks per second · ${clicks} clicks in ${len} s</p>
    <span class="verdict ${cps >= 8 ? 'ok' : 'tight'}">${rating(cps)}</span>
    ${record && prev ? `<p class="sub">New personal best! (was ${prev.toFixed(1)})</p>` : prev ? `<p class="sub">Your best: ${prev.toFixed(1)} CPS</p>` : ''}
    <div class="btns"><button type="button" class="btn" id="again">Try again</button><button type="button" class="btn ghost" id="share">Copy score</button></div>`;
  $('#again').onclick = reset;
  $('#share').onclick = ev => copyText(share, ev.currentTarget);
  if (record && prev) toast('New personal best!');
}
pad.addEventListener('pointerdown', hit);
pad.addEventListener('contextmenu', e => e.preventDefault());
pad.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') e.preventDefault(); });
onAny('input[name="t"]', reset);
reset();
