const KEY = 'tf-hours', DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
$('#rows').innerHTML = DAYS.map((d, i) => `<tr><td>${d.slice(0, 3)}</td><td><input type="time" data-i="${i}" data-f="s" aria-label="${d} start"></td><td><input type="time" data-i="${i}" data-f="e" aria-label="${d} finish"></td><td><input type="number" inputmode="numeric" min="0" step="5" data-i="${i}" data-f="b" placeholder="0" aria-label="${d} break minutes"></td><td class="n" id="h${i}">–</td></tr>`).join('');
const inp = (i, f) => $(`[data-i="${i}"][data-f="${f}"]`);
try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) { s.rows.forEach((r, i) => { inp(i, 's').value = r[0]; inp(i, 'e').value = r[1]; inp(i, 'b').value = r[2]; }); $('#rate').value = s.rate || ''; $('#otl').value = s.otl ?? 40; $('#otr').value = s.otr || '1.5'; } else fill(); } catch (e) { fill(); }
function fill() { for (let i = 0; i < 7; i++) { inp(i, 's').value = i < 5 ? '09:00' : ''; inp(i, 'e').value = i < 5 ? '17:00' : ''; inp(i, 'b').value = i < 5 ? '30' : ''; } }
const mins = t => { const m = /^(\d+):(\d+)/.exec(t || ''); return m ? +m[1] * 60 + +m[2] : null; };
const hm = m => `${Math.floor(m / 60)} h ${String(Math.round(m % 60)).padStart(2, '0')} min`;
function calc() {
  let total = 0, worked = 0;
  for (let i = 0; i < 7; i++) {
    const s = mins(inp(i, 's').value), e = mins(inp(i, 'e').value), b = Math.max(0, val(inp(i, 'b')) || 0);
    if (s === null || e === null) { $('#h' + i).textContent = '–'; continue; }
    let d = e - s; if (d <= 0) d += 1440;
    d = Math.max(0, d - b); total += d; worked++;
    $('#h' + i).textContent = `${Math.floor(d / 60)}:${String(d % 60).padStart(2, '0')}`;
  }
  const rate = val($('#rate')), otl = Math.max(0, val($('#otl')) || 0) * 60, otr = +$('#otr').value;
  const reg = otr > 1 ? Math.min(total, otl) : total, ot = total - reg;
  try { localStorage.setItem(KEY, JSON.stringify({ rows: DAYS.map((_, i) => [inp(i, 's').value, inp(i, 'e').value, inp(i, 'b').value]), rate: $('#rate').value, otl: $('#otl').value, otr: $('#otr').value })); } catch (e) { /* storage blocked */ }
  const pay = rate > 0 ? (reg / 60) * rate + (ot / 60) * rate * otr : null;
  $('#out').innerHTML = `<p class="kicker">Total this week</p><p class="huge" style="text-align:left"><mark>${(total / 60).toFixed(2)}</mark></p><p class="sub">hours (${hm(total)}) over ${worked} day${worked === 1 ? '' : 's'}</p>
    <div class="scroll"><table class="tbl"><tbody>
      <tr><td>Regular hours</td><td class="n">${(reg / 60).toFixed(2)}</td></tr>
      ${ot > 0 ? `<tr><td>Overtime hours (×${otr})</td><td class="n">${(ot / 60).toFixed(2)}</td></tr>` : ''}
      ${worked ? `<tr><td>Average per day worked</td><td class="n">${(total / worked / 60).toFixed(2)}</td></tr>` : ''}
      ${pay !== null ? `<tr><td>Regular pay</td><td class="n">${fmt((reg / 60) * rate)}</td></tr>${ot > 0 ? `<tr><td>Overtime pay</td><td class="n">${fmt((ot / 60) * rate * otr)}</td></tr>` : ''}` : ''}
    </tbody>${pay !== null ? `<tfoot><tr><td>Total pay</td><td class="n">${fmt(pay)}</td></tr></tfoot>` : ''}</table></div>
    ${pay === null ? '<p class="note">Add an hourly rate to see your pay.</p>' : ''}`;
}
$('#rows').addEventListener('input', calc);
onAny('#rate, #otl, #otr', calc);
$('#fill').addEventListener('click', () => { fill(); calc(); });
$('#clear').addEventListener('click', () => { $$('#rows input').forEach(x => { x.value = ''; }); calc(); });
calc();
