const SYN = 29.530588861, rad = d => d * Math.PI / 180;
// Julian Ephemeris Day of a true moon phase (Meeus, Astronomical Algorithms ch. 49). k: integer + 0, .25, .5, .75.
function phaseJDE(k) {
  const T = k / 1236.85, E = 1 - 0.002516 * T - 0.0000074 * T * T;
  const M = rad(2.5534 + 29.1053567 * k - 0.0000014 * T * T), Mp = rad(201.5643 + 385.81693528 * k + 0.0107582 * T * T), F = rad(160.7108 + 390.67050284 * k - 0.0016118 * T * T), O = rad(124.7746 - 1.56375588 * k + 0.0020672 * T * T);
  let jde = 2451550.09766 + SYN * k + 0.00015437 * T * T, c;
  const q = Math.round((k % 1 + 1) % 1 * 4) % 4;
  if (q === 0 || q === 2) {
    const a = q === 0 ? [-0.40720, 0.17241, 0.01608, 0.01039, 0.00739, -0.00514, 0.00208] : [-0.40614, 0.17302, 0.01614, 0.01043, 0.00734, -0.00515, 0.00209];
    c = a[0] * Math.sin(Mp) + a[1] * E * Math.sin(M) + a[2] * Math.sin(2 * Mp) + a[3] * Math.sin(2 * F) + a[4] * E * Math.sin(Mp - M) + a[5] * E * Math.sin(Mp + M) + a[6] * E * E * Math.sin(2 * M)
      - 0.00111 * Math.sin(Mp - 2 * F) - 0.00057 * Math.sin(Mp + 2 * F) + 0.00056 * E * Math.sin(2 * Mp + M) - 0.00042 * Math.sin(3 * Mp) + 0.00042 * E * Math.sin(M + 2 * F) + 0.00038 * E * Math.sin(M - 2 * F) - 0.00024 * E * Math.sin(2 * Mp - M) - 0.00017 * Math.sin(O);
  } else {
    c = -0.62801 * Math.sin(Mp) + 0.17172 * E * Math.sin(M) - 0.01183 * E * Math.sin(Mp + M) + 0.00862 * Math.sin(2 * Mp) + 0.00804 * Math.sin(2 * F) + 0.00454 * E * Math.sin(Mp - M) + 0.00204 * E * E * Math.sin(2 * M) - 0.0018 * Math.sin(Mp - 2 * F) - 0.0007 * Math.sin(Mp + 2 * F) - 0.0004 * Math.sin(3 * Mp) - 0.00034 * E * Math.sin(2 * Mp - M) + 0.00032 * E * Math.sin(M + 2 * F) + 0.00032 * E * Math.sin(M - 2 * F) - 0.00028 * E * E * Math.sin(Mp + 2 * M) - 0.00017 * Math.sin(O);
    const W = 0.00306 - 0.00038 * E * Math.cos(M) + 0.00026 * Math.cos(Mp) - 0.00002 * Math.cos(Mp - M) + 0.00002 * Math.cos(Mp + M) + 0.00002 * Math.cos(2 * F);
    c += q === 1 ? W : -W;
  }
  return jde + c;
}
const jdToDate = jd => new Date((jd - 2440587.5) * 86400000 - 69000); // minus ΔT (TT → UT), about 69 s
const dateToK = d => ((d.getTime() / 86400000 + 2440587.5) - 2451550.09766) / SYN;
// The new moon on or before date d, and the moon's age and lit fraction at d.
function moonAt(d) {
  let k = Math.floor(dateToK(d)) + 1;
  while (jdToDate(phaseJDE(k)) > d) k--;
  const nm = jdToDate(phaseJDE(k)), nx = jdToDate(phaseJDE(k + 1));
  const frac = (d - nm) / (nx - nm), age = frac * SYN, lit = (1 - Math.cos(2 * Math.PI * frac)) / 2;
  return { frac, age, lit, k };
}
const NAMES = ['New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'];
const phaseName = f => NAMES[Math.floor(((f * 8) + 0.5) % 8)];
// SVG of the moon at fraction f of its cycle. South flips left/right.
function moonSvg(f, south, size = 100) {
  const r = size / 2 - 2, cx = size / 2, waxing = f < 0.5, x = Math.cos(2 * Math.PI * f) * r;
  let litRight = waxing; if (south) litRight = !litRight;
  // The terminator bulges towards the lit side for a crescent and away from it for a gibbous moon.
  const crescent = f < 0.25 || f > 0.75, bulgeRight = crescent ? litRight : !litRight;
  const s = litRight ? 1 : 0, sweep = bulgeRight ? 0 : 1;
  const d = `M${cx} ${cx - r} A${r} ${r} 0 0 ${s} ${cx} ${cx + r} A${Math.abs(x)} ${r} 0 0 ${sweep} ${cx} ${cx - r}Z`;
  return `<svg viewBox="0 0 ${size} ${size}" aria-hidden="true"><defs><radialGradient id="mg${size}" cx="40%" cy="35%"><stop offset="0" stop-color="#FFF8DC"/><stop offset="1" stop-color="#D9D2B6"/></radialGradient></defs><circle cx="${cx}" cy="${cx}" r="${r}" fill="#2B2F36"/><path d="${d}" fill="url(#mg${size})"/></svg>`;
}
const fmtDT = d => d.toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
const pad = n => String(n).padStart(2, '0');
const t0 = new Date();
$('#date').value = `${t0.getFullYear()}-${pad(t0.getMonth() + 1)}-${pad(t0.getDate())}`;
if (/^(Australia|Pacific\/(Auckland|Fiji)|America\/(Sao_Paulo|Argentina|Santiago|Montevideo|Asuncion)|Africa\/(Johannesburg|Maputo|Harare|Windhoek))/.test(Intl.DateTimeFormat().resolvedOptions().timeZone || '')) $('#hemi').value = 's';
function day() { const [y, m, d] = $('#date').value.split('-').map(Number); const now = new Date(); const same = y === now.getFullYear() && m === now.getMonth() + 1 && d === now.getDate(); return same ? now : new Date(y, m - 1, d, 21, 0); }
function show() {
  const d = day(), south = $('#hemi').value === 's', m = moonAt(d);
  $('#pic').innerHTML = moonSvg(m.frac, south, 150);
  $('#pname').textContent = phaseName(m.frac);
  $('#pinfo').innerHTML = `${Math.round(m.lit * 100)}% lit · ${m.age.toFixed(1)} days old<br>${d.toDateString() === new Date().toDateString() ? 'Right now' : d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) + ', 9 pm'}`;
  // Upcoming phases from the chosen date.
  const ev = [];
  for (let k = m.k; ev.length < 8; k += 0.25) { const t = jdToDate(phaseJDE(k)); if (t > d) ev.push([k, t]); }
  const nm = ['New moon', 'First quarter', 'Full moon', 'Last quarter'];
  const MON = ['Wolf', 'Snow', 'Worm', 'Pink', 'Flower', 'Strawberry', 'Buck', 'Sturgeon', 'Harvest', 'Hunter’s', 'Beaver', 'Cold'];
  const full = ev.find(([k]) => Math.round(((k % 1) + 1) % 1 * 4) === 2), newm = ev.find(([k]) => Math.round(((k % 1) + 1) % 1 * 4) % 4 === 0);
  const days = t => Math.ceil((t - d) / 86400000);
  $('#out').innerHTML = `<p class="kicker">Coming up</p>
    <div class="statgrid"><div class="stat"><b>${days(full[1])} days</b><span>to the full moon (${MON[full[1].getMonth()]} Moon)</span></div><div class="stat"><b>${days(newm[1])} days</b><span>to the new moon</span></div></div>
    <div class="scroll"><table class="tbl"><tbody>${ev.map(([k, t]) => `<tr><td>${nm[Math.round(((k % 1) + 1) % 1 * 4) % 4]}</td><td class="n">${fmtDT(t)}</td></tr>`).join('')}</tbody></table></div>
    <p class="note">Times are in your time zone (${esc(Intl.DateTimeFormat().resolvedOptions().timeZone || 'local time')}).</p>`;
  // Month calendar
  const y = d.getFullYear(), mo = d.getMonth(), first = new Date(y, mo, 1), n = new Date(y, mo + 1, 0).getDate();
  $('#calh').textContent = `Moon calendar · ${first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`;
  let html = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(w => `<b>${w}</b>`).join('') + '<span></span>'.repeat(first.getDay());
  for (let i = 1; i <= n; i++) { const md = moonAt(new Date(y, mo, i, 21)), isT = new Date().toDateString() === new Date(y, mo, i).toDateString(); html += `<div class="${isT ? 'today' : ''}${i === d.getDate() ? ' sel' : ''}" data-d="${y}-${pad(mo + 1)}-${pad(i)}" title="${phaseName(md.frac)}, ${Math.round(md.lit * 100)}% lit">${i}${moonSvg(md.frac, south, 26)}</div>`; }
  $('#cal').innerHTML = html;
}
$('#cal').addEventListener('click', e => { const c = e.target.closest('[data-d]'); if (c) { $('#date').value = c.dataset.d; show(); } });
onAny('#date, #hemi', show);
show();
