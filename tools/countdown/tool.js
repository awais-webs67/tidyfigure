const DAY = 86400000, pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  return new Date(y, Math.floor((h + l - 7 * m + 114) / 31) - 1, ((h + l - 7 * m + 114) % 31) + 1);
}
const nthDow = (y, mo, dow, n) => { const d = new Date(y, mo, 1); d.setDate(1 + ((dow - d.getDay() + 7) % 7) + (n - 1) * 7); return d; };
// Next date (from today) on which the Islamic (Umm al-Qura) calendar shows month/day.
function hijri(month, day) {
  let fmt;
  try { fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { month: 'numeric', day: 'numeric' }); } catch (e) { return null; }
  const t = new Date(); t.setHours(0, 0, 0, 0);
  for (let i = 0; i < 400; i++) {
    const d = new Date(t.getTime() + i * DAY), p = Object.fromEntries(fmt.formatToParts(d).map(x => [x.type, x.value]));
    if (+p.month === month && +p.day === day) return d;
  }
  return null;
}
const HOL = [
  ['New Year', y => new Date(y + 1, 0, 1), true],
  ['Christmas', y => new Date(y, 11, 25)],
  ['Halloween', y => new Date(y, 9, 31)],
  ['Valentine’s Day', y => new Date(y, 1, 14)],
  ['Easter', easter],
  ['Mother’s Day (US)', y => nthDow(y, 4, 0, 2)],
  ['Father’s Day', y => nthDow(y, 5, 0, 3)],
  ['Summer', y => new Date(y, 5, 21)],
  ['Thanksgiving (US)', y => nthDow(y, 10, 4, 4)],
  ['Black Friday', y => { const d = nthDow(y, 10, 4, 4); d.setDate(d.getDate() + 1); return d; }],
  ['Ramadan', () => hijri(9, 1), false, true],
  ['Eid al-Fitr', () => hijri(10, 1), false, true],
  ['Eid al-Adha', () => hijri(12, 10), false, true],
];
function next(i) {
  const [, f, isNY, isHijri] = HOL[i], today = new Date(); today.setHours(0, 0, 0, 0);
  if (isHijri) return f();
  if (isNY) return f(today.getFullYear());
  let d = f(today.getFullYear());
  if (d < today) d = f(today.getFullYear() + 1);
  return d;
}
$('#hol').innerHTML = HOL.map((h, i) => `<button type="button" class="chip" data-i="${i}">${h[0]}</button>`).join('');
$('#hol').addEventListener('click', e => {
  const b = e.target.closest('[data-i]'); if (!b) return;
  const d = next(+b.dataset.i); if (!d) { toast('Your browser can’t work out this date.', 'err'); return; }
  $('#name').value = HOL[b.dataset.i][0]; $('#date').value = ymd(d); $('#time').value = '';
  tick(true);
});
// Start: a shared link (?event=…&date=…), a landing page preset, or the next New Year.
const q = new URLSearchParams(location.search), pre = typeof PRESET !== 'undefined' && PRESET ? PRESET : null;
if (q.get('date')) { const [d, t] = q.get('date').split('T'); $('#date').value = d; $('#time').value = t || ''; $('#name').value = (q.get('event') || '').slice(0, 80); }
else { const i = Math.max(0, HOL.findIndex(h => h[0] === (pre && pre.holiday))); const d = next(i) || new Date(new Date().getFullYear() + 1, 0, 1); $('#name').value = HOL[i][0]; $('#date').value = ymd(d); }
function target() {
  const m = $('#date').value.match(/^(\d+)-(\d+)-(\d+)$/); if (!m) return null;
  const [h, mi] = ($('#time').value || '00:00').split(':').map(Number);
  return new Date(+m[1], m[2] - 1, +m[3], h || 0, mi || 0);
}
let shape = '';
function tick(force) {
  const t = target(), out = $('#out');
  if (!t) { out.innerHTML = '<p class="empty">Pick a date to start the countdown.</p>'; shape = ''; return; }
  const name = $('#name').value.trim() || 'your event', diff = t - Date.now(), past = diff < 0, a = Math.abs(diff);
  const d = Math.floor(a / DAY), h = Math.floor(a % DAY / 3600000), mi = Math.floor(a % 3600000 / 60000), s = Math.floor(a % 60000 / 1000);
  const key = `${name}|${t.getTime()}|${past}`;
  if (force === true || key !== shape) {
    shape = key;
    let work = 0; for (let x = new Date(Math.min(t, Date.now())); x < Math.max(t, Date.now()) && work < 20000; x = new Date(x.getTime() + DAY)) { const w = x.getDay(); if (w && w < 6) work++; }
    out.innerHTML = `<p class="kicker">${past ? 'Time since' : 'Countdown to'} ${esc(name)}</p>
      <div class="cd-box"><div><b id="cd-d"></b><span>days</span></div><div><b id="cd-h"></b><span>hours</span></div><div><b id="cd-m"></b><span>minutes</span></div><div><b id="cd-s"></b><span>seconds</span></div></div>
      <p class="sub">${t.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}${$('#time').value ? ' at ' + t.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : ''}${past ? ' · this date has passed' : ''}</p>
      <div class="scroll"><table class="tbl"><tbody>
        <tr><td>In weeks</td><td class="n" id="cd-w"></td></tr><tr><td>In hours</td><td class="n" id="cd-th"></td></tr><tr><td>In minutes</td><td class="n" id="cd-tm"></td></tr><tr><td>Working days (Mon–Fri)</td><td class="n">${work.toLocaleString()}</td></tr>
      </tbody></table></div>`;
  }
  $('#cd-d').textContent = d.toLocaleString(); $('#cd-h').textContent = pad(h); $('#cd-m').textContent = pad(mi); $('#cd-s').textContent = pad(s);
  $('#cd-w').textContent = `${Math.floor(a / DAY / 7)} weeks ${d % 7} days`; $('#cd-th').textContent = Math.floor(a / 3600000).toLocaleString(); $('#cd-tm').textContent = Math.floor(a / 60000).toLocaleString();
  document.title = `${d}d ${pad(h)}:${pad(mi)}:${pad(s)} · ${name}`;
}
onAny('#name, #date, #time', () => tick(true));
$('#share').addEventListener('click', e => {
  const t = target(); if (!t) return;
  const u = new URL(location.href.split('?')[0]);
  u.searchParams.set('event', $('#name').value.trim()); u.searchParams.set('date', `${$('#date').value}${$('#time').value ? 'T' + $('#time').value : ''}`);
  copyText(u.toString(), e.currentTarget);
});
$('#full').addEventListener('click', () => { const o = $('#out'); if (document.fullscreenElement) document.exitFullscreen(); else o.requestFullscreen?.(); });
tick(true); setInterval(tick, 1000);
