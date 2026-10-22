const DAY = 86400000;
const parse = s => { const [y, m, d] = (s || '').split('-').map(Number); return y ? new Date(Date.UTC(y, m - 1, d)) : null; };
const iso = d => d.toISOString().slice(0, 10);
const long = d => d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const t = new Date(), today = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()));
const isWeekday = d => d.getUTCDay() % 6 !== 0;

$('#a').value = iso(today);
$('#b').value = iso(new Date(Date.UTC(today.getUTCFullYear(), 11, 31)));
$('#c').value = iso(today);
onAny('#a, #b, #c, #n, #incl, #biz, input[name="mode"]', calc);

// Whole weekdays from a (inclusive) to b (exclusive), without looping over every day.
function weekdaysBetween(a, b) {
  const days = Math.round((b - a) / DAY);
  const full = Math.floor(days / 7);
  let count = full * 5;
  for (let i = 0; i < days % 7; i++) if (isWeekday(new Date(a.getTime() + (full * 7 + i) * DAY))) count++;
  return count;
}

function calc() {
  const mode = $('input[name="mode"]:checked').value;
  $('#between-fields').hidden = mode !== 'between';
  $('#add-fields').hidden = mode !== 'add';
  const out = $('#out');

  if (mode === 'between') {
    let a = parse($('#a').value), b = parse($('#b').value);
    if (!a || !b) { out.innerHTML = '<p class="empty">Choose two dates.</p>'; return; }
    const back = b < a;
    if (back) [a, b] = [b, a];
    const incl = $('#incl').checked ? 1 : 0;
    const days = Math.round((b - a) / DAY) + incl;
    const end = new Date(b.getTime() + incl * DAY);
    const wd = weekdaysBetween(a, end);
    // Calendar months and leftover days, counted from the start date.
    // From 31 January, one month later is the last day of February.
    const addMonths = k => {
      const y = a.getUTCFullYear() + Math.floor((a.getUTCMonth() + k) / 12), m = (a.getUTCMonth() + k) % 12;
      return new Date(Date.UTC(y, m, Math.min(a.getUTCDate(), new Date(Date.UTC(y, m + 1, 0)).getUTCDate())));
    };
    let months = 0;
    while (addMonths(months + 1) <= b) months++;
    const mDate = addMonths(months);
    const rest = Math.round((b - mDate) / DAY) + incl;
    out.innerHTML = `<p class="kicker">${back ? 'The end date is before the start date. Between them:' : 'Days between'}</p>
      <p class="huge" style="text-align:left"><mark>${days.toLocaleString()}</mark></p><p class="sub">day${days === 1 ? '' : 's'}${incl ? ', counting both dates' : ''}</p>
      <div class="statgrid">
        <div class="stat"><b>${Math.floor(days / 7)}w ${days % 7}d</b><span>Weeks and days</span></div>
        <div class="stat"><b>${months}m ${rest}d</b><span>Months and days</span></div>
        <div class="stat"><b>${wd.toLocaleString()}</b><span>Weekdays (Mon–Fri)</span></div>
        <div class="stat"><b>${(days - wd).toLocaleString()}</b><span>Weekend days</span></div>
      </div>
      <p class="note">${long(a)} → ${long(b)}. Weekday counts don’t exclude public holidays, which vary by country.</p>`;
  } else {
    const c = parse($('#c').value), n = Math.round(val($('#n')));
    if (!c || !ok(n)) { out.innerHTML = '<p class="empty">Choose a date and a number of days.</p>'; return; }
    let d;
    if ($('#biz').checked) {
      d = new Date(c);
      let left = Math.abs(n);
      const step = n < 0 ? -DAY : DAY;
      while (left > 0) { d = new Date(d.getTime() + step); if (isWeekday(d)) left--; }
    } else d = new Date(c.getTime() + n * DAY);
    out.innerHTML = `<p class="kicker">${Math.abs(n)} ${$('#biz').checked ? 'business ' : ''}day${Math.abs(n) === 1 ? '' : 's'} ${n < 0 ? 'before' : 'after'} ${long(c)}</p>
      <p class="big"><mark>${long(d)}</mark></p>
      <p class="sub">${iso(d)} · ${Math.abs(Math.round((d - today) / DAY))} days ${d < today ? 'ago' : 'from today'}</p>`;
  }
}
calc();
