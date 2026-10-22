let base = 0, startedAt = 0, raf = null, laps = [];
const now = () => performance.now();
const elapsed = () => base + (raf !== null ? now() - startedAt : 0);

function fmtSW(ms, html) {
  const cs = Math.floor(ms / 10) % 100, s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const main = (h ? `${h}:${String(m).padStart(2, '0')}` : String(m).padStart(2, '0')) + ':' + String(sec).padStart(2, '0');
  const frac = '.' + String(cs).padStart(2, '0');
  return html ? `${main}<span style="font-size:.5em;color:var(--muted)">${frac}</span>` : main + frac;
}

function frame() {
  $('#display').innerHTML = fmtSW(elapsed(), true);
  raf = requestAnimationFrame(frame);
}

function toggle() {
  if (raf !== null) { base = elapsed(); cancelAnimationFrame(raf); raf = null; $('#start span').textContent = 'Resume'; $('#lap').disabled = true; }
  else { startedAt = now(); raf = requestAnimationFrame(frame); $('#start span').textContent = 'Stop'; $('#lap').disabled = false; $('#reset').disabled = false; }
  $('#display').innerHTML = fmtSW(elapsed(), true);
}

function lap() {
  if (raf === null) return;
  const t = elapsed();
  laps.push(t);
  const splits = laps.map((x, i) => x - (laps[i - 1] || 0));
  const fast = Math.min(...splits), slow = Math.max(...splits);
  $('#laps-wrap').hidden = false;
  $('#laps').innerHTML = splits.map((d, i) => ({ d, i })).reverse().map(({ d, i }) =>
    `<tr${laps.length > 2 && d === fast ? ' class="win"' : ''}><td>Lap ${i + 1}${laps.length > 2 && d === fast ? ' · fastest' : laps.length > 2 && d === slow ? ' · slowest' : ''}</td><td class="n">${fmtSW(d)}</td><td class="n">${fmtSW(laps[i])}</td></tr>`).join('');
}

function reset() {
  if (raf !== null) cancelAnimationFrame(raf);
  raf = null; base = 0; laps = [];
  $('#display').innerHTML = fmtSW(0, true);
  $('#start span').textContent = 'Start';
  $('#lap').disabled = true; $('#reset').disabled = true;
  $('#laps').innerHTML = ''; $('#laps-wrap').hidden = true;
}

$('#start').addEventListener('click', toggle);
$('#lap').addEventListener('click', lap);
$('#reset').addEventListener('click', reset);
document.addEventListener('keydown', e => {
  if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.code === 'Space' && e.target.tagName !== 'BUTTON') { e.preventDefault(); toggle(); }
  if (e.key === 'l' || e.key === 'L') lap();
  if (e.key === 'r' || e.key === 'R') reset();
});
