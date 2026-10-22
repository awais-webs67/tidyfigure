const list = $('#rows');
const opt = (v, cur) => `<option value="${v}"${v === cur ? ' selected' : ''}>${{ need: 'Need', want: 'Want', save: 'Saving / debt' }[v]}</option>`;
makeList(list, $('#add-row'), v => `
  <label class="f f-name"><span>Expense</span><input data-f="name" type="text" value="${esc(v.name ?? '')}" placeholder="e.g. Groceries"></label>
  <label class="f"><span>Amount</span><input data-f="amt" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.amt ?? '')}"></label>
  <label class="f"><span>Type</span><select data-f="type">${['need', 'want', 'save'].map(t => opt(t, v.type || 'need')).join('')}</select></label>
  <button type="button" class="rm" aria-label="Remove">×</button>`,
  [
    { name: 'Rent / mortgage', amt: 1100, type: 'need' }, { name: 'Groceries', amt: 380, type: 'need' }, { name: 'Utilities & phone', amt: 180, type: 'need' },
    { name: 'Transport', amt: 150, type: 'need' }, { name: 'Eating out', amt: 260, type: 'want' }, { name: 'Subscriptions', amt: 45, type: 'want' },
    { name: 'Shopping & hobbies', amt: 300, type: 'want' }, { name: 'Savings', amt: 350, type: 'save' }, { name: 'Extra debt payments', amt: 150, type: 'save' },
  ], calc);
onAny('#inc, #rule', calc);

function calc() {
  const inc = val($('#inc')), pct = $('#rule').value.split('-').map(Number), out = $('#out');
  if (!(inc > 0)) { out.innerHTML = '<p class="empty">Enter your monthly take-home pay.</p>'; return; }
  const rows = $$('.row', list).map(r => ({ name: field(r, 'name').value.trim(), amt: val(field(r, 'amt')) || 0, type: field(r, 'type').value }));
  const sum = t => rows.filter(r => r.type === t).reduce((s, r) => s + r.amt, 0);
  const spent = { need: sum('need'), want: sum('want'), save: sum('save') }, total = spent.need + spent.want + spent.save, left = inc - total;
  const groups = [['need', 'Needs', pct[0]], ['want', 'Wants', pct[1]], ['save', 'Savings & debt', pct[2]]];
  const bar = (p, over) => `<div class="bar"><i style="width:${Math.min(100, p)}%;${over ? 'background:var(--bad)' : ''}"></i></div>`;
  out.innerHTML = `<p class="kicker">${left >= 0 ? 'Left over each month' : 'Overspending each month'}</p><p class="huge" style="text-align:left"><mark>${fmt(Math.abs(left))}</mark></p>
    <p class="sub">You’ve planned ${fmt(total)} of ${fmt(inc)} (${fmtMax(total / inc * 100, 0)}%).${left > 0 ? ' Give every unassigned amount a job, such as savings.' : ''}</p>
    ${groups.map(([k, label, p]) => {
      const target = inc * p / 100, actual = spent[k], share = actual / inc * 100;
      const over = k === 'save' ? actual < target : actual > target;
      return `<div class="stat" style="gap:6px"><span>${label}: target ${p}% = ${fmt(target)}</span><b>${fmt(actual)} <small style="font-size:14px">(${fmtMax(share, 1)}%)</small></b>${bar(actual / target * 100, over && k !== 'save')}
        <span style="color:${over ? (k === 'save' ? 'var(--warn)' : 'var(--bad)') : 'var(--good)'}">${k === 'save' ? (actual >= target ? `On track: ${fmt(actual - target)} above target` : `${fmt(target - actual)} below target`) : actual <= target ? `${fmt(target - actual)} under budget` : `${fmt(actual - target)} over budget`}</span></div>`;
    }).join('')}
    <p class="note">Yearly: ${fmt(spent.save * 12)} saved or put towards debt, ${fmt(spent.want * 12)} on wants.</p>`;
}
calc();
