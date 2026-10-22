// Dates are handled as plain calendar days in UTC, so time zones and daylight saving can't shift them.
const parse = s => { const [y, m, d] = s.split('-').map(Number); return y ? new Date(Date.UTC(y, m - 1, d)) : null; };
const iso = d => d.toISOString().slice(0, 10);
const todayISO = () => { const t = new Date(); return iso(new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()))); };
const daysIn = (y, m) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
const DAY = 86400000;
const weekday = d => d.toLocaleDateString(undefined, { weekday: 'long', timeZone: 'UTC' });
const long = d => d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// Birthday in a given year; 29 February falls on 28 February in non-leap years.
const birthdayIn = (dob, y) => new Date(Date.UTC(y, dob.getUTCMonth(), Math.min(dob.getUTCDate(), daysIn(y, dob.getUTCMonth()))));

$('#on').value = todayISO();
$('#today').addEventListener('click', () => { $('#on').value = todayISO(); calc(); });
onAny('#dob, #on', calc);

function calc() {
  const dob = parse($('#dob').value), on = parse($('#on').value);
  const out = $('#out');
  if (!dob || !on) { out.innerHTML = '<p class="empty">Enter a date of birth.</p>'; return; }
  if (on < dob) { out.innerHTML = '<p class="empty">The second date is before the date of birth.</p>'; return; }

  let years = on.getUTCFullYear() - dob.getUTCFullYear();
  if (birthdayIn(dob, on.getUTCFullYear()) > on) years--;
  const last = birthdayIn(dob, dob.getUTCFullYear() + years);
  let months = 0, cursor = last;
  while (true) {
    const y = cursor.getUTCFullYear(), m = cursor.getUTCMonth() + 1;
    const next = new Date(Date.UTC(y + Math.floor(m / 12), m % 12, Math.min(dob.getUTCDate(), daysIn(y + Math.floor(m / 12), m % 12))));
    if (next > on) break;
    cursor = next; months++;
  }
  const days = Math.round((on - cursor) / DAY);
  const totalDays = Math.round((on - dob) / DAY);
  let next = birthdayIn(dob, on.getUTCFullYear());
  if (next <= on) next = birthdayIn(dob, on.getUTCFullYear() + 1);
  const until = Math.round((next - on) / DAY);
  const isBirthday = birthdayIn(dob, on.getUTCFullYear()).getTime() === on.getTime();
  const totalMonths = years * 12 + months;

  out.innerHTML = `<p class="kicker">Age</p><p class="big"><mark>${years} year${years === 1 ? '' : 's'}</mark></p>
    <p class="sub">${years} years, ${months} month${months === 1 ? '' : 's'} and ${days} day${days === 1 ? '' : 's'}</p>
    <div class="statgrid">
      <div class="stat"><b>${totalMonths.toLocaleString()}</b><span>Months</span></div>
      <div class="stat"><b>${Math.floor(totalDays / 7).toLocaleString()}</b><span>Weeks</span></div>
      <div class="stat"><b>${totalDays.toLocaleString()}</b><span>Days</span></div>
      <div class="stat"><b>${(totalDays * 24).toLocaleString()}</b><span>Hours</span></div>
    </div>
    <p class="note">${isBirthday ? '<strong>🎉 Happy birthday!</strong> ' : ''}Next birthday: <strong>${weekday(next)}, ${long(next)}</strong>, in ${until} day${until === 1 ? '' : 's'} (turning ${years + 1}).</p>
    <p class="note">Born on a <strong>${weekday(dob)}</strong>.</p>`;
}
calc();
