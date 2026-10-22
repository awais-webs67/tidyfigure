const DAY = 86400000;
const t = new Date(), today = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()));
const parse = s => { const [y, m, d] = (s || '').split('-').map(Number); return y ? new Date(Date.UTC(y, m - 1, d)) : null; };
const iso = d => d.toISOString().slice(0, 10);
const long = d => d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const short = d => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const add = (d, n) => new Date(d.getTime() + n * DAY);
$('#date').value = iso(add(today, -70));
onAny('#method, #date, #cycle', calc);

function calc() {
  const method = $('#method').value, d = parse($('#date').value), out = $('#out');
  $('#cycle-wrap').hidden = method !== 'lmp';
  $('#date-label').textContent = { lmp: 'First day of last period', conception: 'Conception date', ivf3: 'Transfer date', ivf5: 'Transfer date' }[method];
  if (!d) { out.innerHTML = '<p class="empty">Choose a date.</p>'; return; }
  // Everything is measured from an equivalent "LMP" date (2 weeks before conception).
  const cycle = Math.min(45, Math.max(20, Math.round(val($('#cycle')) || 28)));
  const lmp = method === 'lmp' ? add(d, cycle - 28) : method === 'conception' ? add(d, -14) : method === 'ivf3' ? add(d, -17) : add(d, -19);
  const due = add(lmp, 280);
  const days = Math.round((today - lmp) / DAY), wk = Math.floor(days / 7), dd = days % 7;
  const tri = wk < 14 ? 'First trimester' : wk < 28 ? 'Second trimester' : 'Third trimester';
  const left = Math.round((due - today) / DAY);
  const MS = [[6, 'Heartbeat may be seen on an early scan'], [12, 'End of the first trimester; dating scan usually 10–14 weeks'], [20, 'Anatomy scan (18–21 weeks)'], [24, 'Considered viable in most hospitals'], [28, 'Third trimester begins'], [37, 'Full term begins'], [40, 'Due date'], [42, 'Late term; induction usually offered by now']];
  const pregnant = days >= 0 && days <= 300;
  out.innerHTML = `<p class="kicker">Estimated due date</p><p class="big"><mark>${long(due)}</mark></p>
    ${pregnant ? `<div class="statgrid"><div class="stat"><b>${wk}w ${dd}d</b><span>Pregnant today</span></div><div class="stat"><b>${tri.split(' ')[0]}</b><span>Trimester</span></div><div class="stat"><b>${left > 0 ? left : 0}</b><span>Days to go</span></div></div>
      <div style="height:10px;border-radius:5px;background:var(--line)"><div style="height:10px;border-radius:5px;width:${Math.min(100, days / 280 * 100)}%;background:var(--c-health)"></div></div>` : ''}
    <p class="kicker" style="margin-top:6px">Milestones</p>
    <div class="scroll"><table class="tbl"><tbody>${MS.map(([w, l]) => `<tr${wk >= w && wk < (MS.find(m => m[0] > w) || [99])[0] && pregnant ? ' class="win"' : ''}><td>Week ${w}</td><td>${l}</td><td class="n">${short(add(lmp, w * 7))}</td></tr>`).join('')}</tbody></table></div>
    <p class="note">Only about 4% of babies arrive on their due date; most are born between 38 and 42 weeks. Your midwife or doctor may adjust the date after your dating scan.</p>`;
}
calc();
