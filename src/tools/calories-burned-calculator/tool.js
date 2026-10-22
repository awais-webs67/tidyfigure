const ACTS = [
  ['Walking, 5 km/h (3 mph)', 3.5], ['Walking briskly, 6.4 km/h (4 mph)', 5.0], ['Hiking', 6.0], ['Running, 8 km/h (5 mph)', 8.3], ['Running, 10 km/h (6 mph)', 9.8],
  ['Running, 12 km/h (7.5 mph)', 11.8], ['Cycling, leisurely', 4.0], ['Cycling, moderate (19–22 km/h)', 8.0], ['Cycling, fast (22–25 km/h)', 10.0], ['Stationary bike, moderate', 6.8],
  ['Swimming, leisurely', 6.0], ['Swimming laps, vigorous', 9.8], ['Jump rope', 11.8], ['HIIT / circuit training', 8.0], ['Weight training, moderate', 3.5],
  ['Weight training, vigorous', 6.0], ['Yoga', 2.5], ['Pilates', 3.0], ['Dancing, aerobic', 7.3], ['Football (soccer)', 7.0], ['Basketball', 6.5], ['Tennis, singles', 8.0],
  ['Badminton', 5.5], ['Cricket', 4.8], ['Climbing stairs', 8.8], ['Rowing machine, moderate', 7.0], ['Elliptical trainer', 5.0], ['Housework, general', 3.3],
  ['Gardening', 3.8], ['Sitting quietly', 1.3],
];
$('#act').innerHTML = ACTS.map((a, i) => `<option value="${i}"${i === 4 ? ' selected' : ''}>${a[0]}</option>`).join('');
const u = bodyUnits(calc);
onAny('#kg, #lb, #act, #min', calc);
function calc() {
  const kg = u.kg(), mins = val($('#min')), [name, met] = ACTS[+$('#act').value], out = $('#out');
  if (!(kg > 0 && mins > 0)) { out.innerHTML = '<p class="empty">Enter your weight and the duration.</p>'; return; }
  const kcal = met * 3.5 * kg / 200 * mins;
  const others = [...ACTS].map(a => [a[0], a[1] * 3.5 * kg / 200 * mins]).sort((a, b) => b[1] - a[1]).slice(0, 8);
  out.innerHTML = `<p class="kicker">${esc(name)} for ${mins} min</p><p class="huge" style="text-align:left"><mark>${Math.round(kcal)}</mark></p>
    <p class="sub">kcal burned (MET ${met}) · about ${Math.round(kcal / mins * 60)} kcal per hour</p>
    <p class="kicker" style="margin-top:6px">Same time, other activities</p>
    <div class="scroll"><table class="tbl"><tbody>${others.map(([n, k]) => `<tr${n === name ? ' class="win"' : ''}><td>${n}</td><td class="n">${Math.round(k)} kcal</td></tr>`).join('')}</tbody></table></div>
    <p class="note">Estimates for an average person. Your real burn depends on fitness, effort, terrain and body composition, and fitness trackers often overestimate.</p>`;
}
u.sync();
