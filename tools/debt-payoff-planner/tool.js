const list = $('#debts');
makeList(list, $('#add-debt'), v => `
  <label class="f f-name"><span>Debt</span><input data-f="name" type="text" value="${esc(v.name ?? '')}" placeholder="e.g. Credit card"></label>
  <label class="f"><span>Balance</span><input data-f="bal" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.bal ?? '')}"></label>
  <label class="f"><span>Rate %</span><input data-f="rate" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.rate ?? '')}"></label>
  <label class="f"><span>Min. payment</span><input data-f="min" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.min ?? '')}"></label>
  <button type="button" class="rm" aria-label="Remove this debt">×</button>`,
  [{ name: 'Credit card', bal: 4000, rate: 24, min: 100 }, { name: 'Personal loan', bal: 2500, rate: 9, min: 80 }, { name: 'Car loan', bal: 8000, rate: 6, min: 220 }], calc);
onAny('#extra, input[name="m"]', calc);

// Month by month: add interest, pay every minimum, then put everything left (extra + freed-up minimums) on the target debt.
function simulate(debts, extra, method, roll = true) {
  const ds = debts.map(d => ({ ...d, paidAt: 0, interest: 0 }));
  const budget = ds.reduce((s, d) => s + d.min, 0) + extra;
  let m = 0, interest = 0;
  while (ds.some(d => d.bal > 0.005) && m < 600) {
    m++;
    ds.forEach(d => { if (d.bal > 0) { const i = d.bal * d.rate / 1200; d.bal += i; d.interest += i; interest += i; } });
    let avail = budget;
    const live = ds.filter(d => d.bal > 0);
    live.forEach(d => { const p = Math.min(d.min, d.bal); d.bal -= p; avail -= p; });
    if (roll) {
      const order = live.filter(d => d.bal > 0).sort(method === 'snowball' ? (a, b) => a.bal - b.bal : (a, b) => b.rate - a.rate || a.bal - b.bal);
      for (const d of order) { if (avail <= 0) break; const p = Math.min(avail, d.bal); d.bal -= p; avail -= p; }
    }
    ds.forEach(d => { if (d.bal <= 0.005 && !d.paidAt) { d.paidAt = m; d.bal = 0; } });
  }
  return { months: m, interest, debts: ds, done: !ds.some(d => d.bal > 0.005) };
}
const span = m => { const y = Math.floor(m / 12), mo = m % 12; return [y && `${y} yr`, mo && `${mo} mo`].filter(Boolean).join(' ') || '0 mo'; };
const when = m => { const d = new Date(); d.setMonth(d.getMonth() + m); return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }); };

function calc() {
  const debts = $$('.row', list).map((r, i) => ({ name: field(r, 'name').value.trim() || `Debt ${i + 1}`, bal: val(field(r, 'bal')), rate: val(field(r, 'rate')) || 0, min: val(field(r, 'min')) || 0 })).filter(d => d.bal > 0);
  const extra = Math.max(0, val($('#extra')) || 0), method = $('input[name="m"]:checked').value, out = $('#out');
  if (!debts.length) { out.innerHTML = '<p class="empty">Add at least one debt with a balance.</p>'; return; }
  const stuck = debts.find(d => d.min <= d.bal * d.rate / 1200);
  const plan = simulate(debts, extra, method), other = simulate(debts, extra, method === 'snowball' ? 'avalanche' : 'snowball'), mins = simulate(debts, 0, method, false);
  if (!plan.done) { out.innerHTML = `<p class="kicker">Debt-free date</p><span class="verdict no">Not paid off in 50 years</span><p class="sub">${stuck ? `The minimum payment on ${esc(stuck.name)} doesn’t cover its interest. ` : ''}Increase the extra monthly payment.</p>`; return; }
  const total = debts.reduce((s, d) => s + d.bal, 0);
  const diff = other.interest - plan.interest;
  out.innerHTML = `<p class="kicker">Debt-free in</p><p class="huge" style="text-align:left"><mark>${span(plan.months)}</mark></p>
    <p class="sub">by ${when(plan.months)}, paying ${fmt(debts.reduce((s, d) => s + d.min, 0) + extra)} a month. Total interest ${fmt(plan.interest)} on ${fmt(total)} of debt.</p>
    <div class="scroll"><table class="tbl"><thead><tr><th>Pay-off order</th><th class="n">Paid off</th><th class="n">Interest</th></tr></thead><tbody>
      ${[...plan.debts].sort((a, b) => a.paidAt - b.paidAt).map((d, i) => `<tr><td>${i + 1}. ${esc(d.name)} <small class="sub">${fmtMax(d.rate, 2)}%</small></td><td class="n">${span(d.paidAt)}</td><td class="n">${fmt(d.interest)}</td></tr>`).join('')}
    </tbody></table></div>
    <div class="statgrid">
      <div class="stat"><b>${fmt(mins.done ? mins.interest - plan.interest : NaN)}</b><span>Interest saved vs minimums only${mins.done ? ` (${span(mins.months)})` : ''}</span></div>
      <div class="stat"><b>${span(other.months)}</b><span>${method === 'snowball' ? 'Avalanche' : 'Snowball'} would take, with ${fmt(other.interest)} interest</span></div>
    </div>
    <p class="note">${Math.abs(diff) < 0.5 ? 'Both methods cost the same here.' : diff > 0 ? `This method saves ${fmt(diff)} in interest compared with ${method === 'snowball' ? 'avalanche' : 'snowball'}.` : `Avalanche would save ${fmt(-diff)} more in interest, but snowball clears your first debt sooner, which keeps many people motivated.`}${stuck ? ` Warning: the minimum on ${esc(stuck.name)} doesn’t cover its monthly interest.` : ''}</p>`;
}
calc();
