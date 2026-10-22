const DAY = 86400000;
const t = new Date(), today = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()));
const parse = s => { const [y, m, d] = (s || '').split('-').map(Number); return y ? new Date(Date.UTC(y, m - 1, d)) : null; };
const add = (d, n) => new Date(d.getTime() + n * DAY);
const short = d => d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
$('#lmp').value = add(today, -10).toISOString().slice(0, 10);
onAny('#lmp, #cycle, #plen', calc);
function calc() {
  const lmp = parse($('#lmp').value), cycle = Math.min(40, Math.max(21, Math.round(val($('#cycle')) || 28))), plen = Math.round(val($('#plen')) || 5);
  const out = $('#out');
  if (!lmp) { out.innerHTML = '<p class="empty">Choose the first day of your last period.</p>'; return; }
  // Ovulation usually happens about 14 days before the next period starts.
  const rows = [0, 1, 2, 3].map(k => {
    const start = add(lmp, k * cycle), ov = add(start, cycle - 14);
    return { start, ov, fertile: [add(ov, -5), add(ov, 1)], next: add(start, cycle) };
  });
  const cur = rows.find(r => r.next > today) || rows[0];
  out.innerHTML = `<p class="kicker">Most fertile days this cycle</p><p class="big"><mark>${short(cur.fertile[0])} – ${short(cur.fertile[1])}</mark></p>
    <p class="sub">Estimated ovulation: <strong>${short(cur.ov)}</strong> · next period around ${short(cur.next)}</p>
    <div class="scroll"><table class="tbl"><thead><tr><th>Period starts</th><th>Fertile window</th><th>Ovulation</th></tr></thead><tbody>
      ${rows.map(r => `<tr${r === cur ? ' class="win"' : ''}><td>${short(r.start)}</td><td>${short(r.fertile[0])} – ${short(r.fertile[1])}</td><td>${short(r.ov)}</td></tr>`).join('')}
    </tbody></table></div>
    <p class="note">Estimates assume regular cycles. Ovulation can vary by several days from month to month, so this calculator is <strong>not reliable as contraception</strong>. Ovulation tests or tracking basal temperature give a more precise picture.</p>`;
}
calc();
