const ZONES = [
  [1, 'Recovery', 0.5, 0.6, 'Very easy; warm-ups, cool-downs, recovery days'],
  [2, 'Endurance', 0.6, 0.7, 'Easy, conversational pace; builds aerobic base and burns fat'],
  [3, 'Tempo', 0.7, 0.8, 'Moderate; can speak in short sentences'],
  [4, 'Threshold', 0.8, 0.9, 'Hard; raises the pace you can sustain'],
  [5, 'Maximum', 0.9, 1.0, 'Very hard; short intervals, sprints'],
];
const COLORS = ['var(--c-image)', 'var(--c-health)', 'var(--c-random)', 'var(--accent)', 'var(--c-pdf)'];
onAny('#age, #rest, #max', calc);
function calc() {
  const age = val($('#age')), rest = val($('#rest')), known = val($('#max')), out = $('#out');
  if (!(age > 0)) { out.innerHTML = '<p class="empty">Enter your age.</p>'; return; }
  const max = known > 0 ? known : 208 - 0.7 * age; // Tanaka formula
  const karv = rest > 0 && rest < max;
  const bpm = p => Math.round(karv ? rest + (max - rest) * p : max * p);
  out.innerHTML = `<p class="kicker">Maximum heart rate</p><p class="huge" style="text-align:left"><mark>${Math.round(max)}</mark></p>
    <p class="sub">beats per minute · ${known > 0 ? 'your measured maximum' : `Tanaka formula (the classic 220 − age gives ${220 - Math.round(age)})`}${karv ? ' · zones use your resting rate (Karvonen method)' : ''}</p>
    <div class="scroll"><table class="tbl"><thead><tr><th>Zone</th><th class="n">BPM</th><th>Feels like</th></tr></thead><tbody>${ZONES.map(([n, l, a, b, d], i) => `<tr><td><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${COLORS[i]};margin-right:6px"></span><strong>${n}</strong> ${l}<br><span class="note">${Math.round(a * 100)}–${Math.round(b * 100)}%</span></td><td class="n">${bpm(a)}–${bpm(b)}</td><td>${d}</td></tr>`).join('')}</tbody></table></div>
    <p class="note">Formulas are averages and can be 10–15 beats off for individuals. If you have a heart condition or take medicine that affects heart rate (such as beta blockers), ask your doctor which zones are safe for you.</p>`;
}
calc();
