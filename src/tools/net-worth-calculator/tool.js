const row = label => v => `
  <label class="f f-name"><span>${label}</span><input data-f="name" type="text" value="${esc(v.name ?? '')}"></label>
  <label class="f"><span>Value</span><input data-f="amt" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.amt ?? '')}"></label>
  <button type="button" class="rm" aria-label="Remove">×</button>`;
makeList($('#assets'), $('#add-asset'), row('Asset'), [
  { name: 'Cash & current accounts', amt: 4500 }, { name: 'Savings', amt: 12000 }, { name: 'Pension / retirement', amt: 38000 },
  { name: 'Investments', amt: 9500 }, { name: 'Home (market value)', amt: 280000 }, { name: 'Car', amt: 11000 }], calc);
makeList($('#debts'), $('#add-debt'), row('Debt'), [
  { name: 'Mortgage', amt: 205000 }, { name: 'Car loan', amt: 6500 }, { name: 'Credit cards', amt: 2300 }, { name: 'Student loan', amt: 14000 }], calc);
const read = id => $$(`#${id} .row`).map(r => ({ name: field(r, 'name').value.trim() || '–', amt: val(field(r, 'amt')) || 0 })).filter(x => x.amt > 0);
function calc() {
  const a = read('assets'), d = read('debts'), A = a.reduce((s, x) => s + x.amt, 0), D = d.reduce((s, x) => s + x.amt, 0), nw = A - D, out = $('#out');
  if (!A && !D) { out.innerHTML = '<p class="empty">Add what you own and what you owe.</p>'; return; }
  const liquid = a.filter(x => /cash|current|saving|checking|bank/i.test(x.name)).reduce((s, x) => s + x.amt, 0);
  const pie = (items, total) => items.sort((x, y) => y.amt - x.amt).map(x => `<tr><td>${esc(x.name)}</td><td class="n">${fmt(x.amt, 0)}</td><td class="n">${fmtMax(x.amt / total * 100, 1)}%</td></tr>`).join('');
  out.innerHTML = `<p class="kicker">Your net worth</p><p class="huge" style="text-align:left"><mark>${nw < 0 ? '−' : ''}${fmt(Math.abs(nw), 0)}</mark></p>
    <p class="sub">${fmt(A, 0)} in assets − ${fmt(D, 0)} in debts.</p>
    <div class="statgrid">
      <div class="stat"><b>${A ? fmtMax(D / A * 100, 1) + '%' : '–'}</b><span>Debt-to-asset ratio</span></div>
      <div class="stat"><b>${fmt(liquid, 0)}</b><span>Cash &amp; savings (easy to reach)</span></div>
    </div>
    ${a.length ? `<div class="scroll"><table class="tbl"><thead><tr><th>Assets</th><th class="n">Value</th><th class="n">Share</th></tr></thead><tbody>${pie(a, A)}</tbody></table></div>` : ''}
    ${d.length ? `<div class="scroll"><table class="tbl"><thead><tr><th>Debts</th><th class="n">Owed</th><th class="n">Share</th></tr></thead><tbody>${pie(d, D)}</tbody></table></div>` : ''}
    <p class="note">${nw < 0 ? 'A negative net worth is common early on, especially with student loans. What matters most is that it rises over time.' : 'Work it out again every 3–6 months with the same method to see your progress.'}</p>`;
}
calc();
