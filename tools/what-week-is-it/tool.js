const DAY = 86400000, pad = n => String(n).padStart(2, '0');
const utc = (y, m, d) => new Date(Date.UTC(y, m, d));
function iso(d) {
  const t = utc(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()), dow = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dow);
  const y = t.getUTCFullYear(), w = Math.ceil(((t - utc(y, 0, 1)) / DAY + 1) / 7);
  return { y, w };
}
function us(d) {
  const y = d.getUTCFullYear(), jan1 = utc(y, 0, 1), start = new Date(jan1.getTime() - jan1.getUTCDay() * DAY);
  const nextJan1 = utc(y + 1, 0, 1), nextStart = new Date(nextJan1.getTime() - nextJan1.getUTCDay() * DAY);
  if (d >= nextStart) return { y: y + 1, w: 1 };
  return { y, w: Math.floor((d - start) / DAY / 7) + 1 };
}
const isoWeeks = y => iso(utc(y, 11, 28)).w;
const mondayOf = (y, w) => { const j4 = utc(y, 0, 4), mon = new Date(j4.getTime() - ((j4.getUTCDay() || 7) - 1) * DAY); return new Date(mon.getTime() + (w - 1) * 7 * DAY); };
const fd = (d, o) => d.toLocaleDateString(undefined, Object.assign({ timeZone: 'UTC' }, o));
const today = new Date(), T = utc(today.getFullYear(), today.getMonth(), today.getDate());
$('#date').value = `${T.getUTCFullYear()}-${pad(T.getUTCMonth() + 1)}-${pad(T.getUTCDate())}`;
$('#year').value = iso(T).y;
function show() {
  const m = $('#date').value.match(/^(\d+)-(\d+)-(\d+)$/); if (!m) return;
  const d = utc(+m[1], m[2] - 1, +m[3]), i = iso(d), u = us(d), mon = mondayOf(i.y, i.w), sun = new Date(mon.getTime() + 6 * DAY);
  const isToday = d.getTime() === T.getTime(), doy = Math.round((d - utc(d.getUTCFullYear(), 0, 1)) / DAY) + 1, ylen = (d.getUTCFullYear() % 4 === 0 && d.getUTCFullYear() % 100) || d.getUTCFullYear() % 400 === 0 ? 366 : 365;
  $('#wk-k').textContent = isToday ? 'This week is ISO week' : `${fd(d, { day: 'numeric', month: 'long', year: 'numeric' })} is in ISO week`;
  $('#wk').textContent = i.w;
  $('#wk-range').textContent = `Monday ${fd(mon, { day: 'numeric', month: 'short' })} to Sunday ${fd(sun, { day: 'numeric', month: 'short', year: 'numeric' })}`;
  $('#out').innerHTML = `<p class="kicker">Details</p><div class="scroll"><table class="tbl"><tbody>
    <tr><td>ISO week (Monday start)</td><td class="n">${i.w} of ${isoWeeks(i.y)}${i.y !== d.getUTCFullYear() ? ` (of ${i.y})` : ''}</td></tr>
    <tr><td>US week (Sunday start)</td><td class="n">${u.w}${u.y !== d.getUTCFullYear() ? ` (of ${u.y})` : ''}</td></tr>
    <tr><td>Day of the year</td><td class="n">${doy} of ${ylen}</td></tr>
    <tr><td>Days left this year</td><td class="n">${ylen - doy}</td></tr>
    <tr><td>Weekday</td><td class="n">${fd(d, { weekday: 'long' })}</td></tr>
    <tr><td>Quarter</td><td class="n">Q${Math.floor(d.getUTCMonth() / 3) + 1}</td></tr>
  </tbody></table></div>
  <p class="note">${isoWeeks(i.y) === 53 ? `${i.y} has 53 ISO weeks.` : `${i.y} has 52 ISO weeks.`}</p>`;
  list(i);
}
function list(cur) {
  const y = Math.round(val($('#year'))) || cur.y, n = isoWeeks(y), ti = iso(T);
  let rows = '';
  for (let w = 1; w <= n; w++) { const mon = mondayOf(y, w), sun = new Date(mon.getTime() + 6 * DAY), here = y === ti.y && w === ti.w; rows += `<tr${here ? ' class="win"' : ''}><td>Week ${w}${here ? ' · this week' : ''}</td><td class="n">${fd(mon, { weekday: 'short', day: 'numeric', month: 'short' })}</td><td class="n">${fd(sun, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</td></tr>`; }
  $('#list').innerHTML = `<p class="group-title">ISO week numbers ${y}</p><table class="tbl"><thead><tr><th>Week</th><th class="n">From (Monday)</th><th class="n">To (Sunday)</th></tr></thead><tbody>${rows}</tbody></table>`;
}
$('#date').addEventListener('input', show);
$('#year').addEventListener('input', () => list(iso(T)));
show();
