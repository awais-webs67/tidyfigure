const list = $('#people');
makeList(list, $('#add-person'), v => `
  <label class="f f-name"><span>Name</span><input data-f="name" type="text" value="${esc(v.name ?? '')}" placeholder="e.g. Ana"></label>
  <label class="f"><span>Paid in total</span><input data-f="paid" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.paid ?? '')}" placeholder="0"></label>
  <label class="f"><span>Shares</span><input data-f="share" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.share ?? 1)}"></label>
  <button type="button" class="rm" aria-label="Remove this person">×</button>`,
  [
    { name: 'Ana', paid: 120 },
    { name: 'Ben', paid: 45 },
    { name: 'Chloe', paid: 0 },
    { name: 'Dev', paid: 35 },
  ], calc);

function calc() {
  // Work in whole cents so the transfers always add up exactly.
  const people = $$('.row', list).map((r, i) => ({
    name: field(r, 'name').value.trim() || `Person ${i + 1}`,
    paid: Math.round((val(field(r, 'paid')) || 0) * 100),
    share: Math.max(0, ok(val(field(r, 'share'))) ? val(field(r, 'share')) : 1),
  }));
  const out = $('#out');
  const total = people.reduce((s, p) => s + p.paid, 0);
  const shares = people.reduce((s, p) => s + p.share, 0);
  if (!total || !shares) { out.innerHTML = '<p class="empty">Enter what each person paid. At least one person needs a share above 0.</p>'; return; }

  // Fair amounts in cents, handing leftover cents to the largest remainders.
  const raw = people.map(p => total * p.share / shares);
  people.forEach((p, i) => { p.fair = Math.floor(raw[i]); });
  let left = total - people.reduce((s, p) => s + p.fair, 0);
  people.map((p, i) => [i, raw[i] - p.fair]).sort((a, b) => b[1] - a[1]).forEach(([i]) => { if (left > 0) { people[i].fair++; left--; } });
  people.forEach(p => { p.bal = p.paid - p.fair; });

  // Greedy settle-up: the biggest debtor pays the biggest creditor until everyone is square.
  const debtors = people.filter(p => p.bal < 0).map(p => ({ name: p.name, amt: -p.bal })).sort((a, b) => b.amt - a.amt);
  const creditors = people.filter(p => p.bal > 0).map(p => ({ name: p.name, amt: p.bal })).sort((a, b) => b.amt - a.amt);
  const transfers = [];
  let d = 0, c = 0;
  while (d < debtors.length && c < creditors.length) {
    const amt = Math.min(debtors[d].amt, creditors[c].amt);
    if (amt > 0) transfers.push({ from: debtors[d].name, to: creditors[c].name, amt });
    debtors[d].amt -= amt;
    creditors[c].amt -= amt;
    if (debtors[d].amt === 0) d++;
    if (creditors[c].amt === 0) c++;
  }

  const money = cents => fmt(cents / 100);
  let html = `<p class="kicker">To settle up</p>`;
  if (!transfers.length) {
    html += `<p class="big"><mark>Everyone is square</mark></p>`;
  } else {
    html += `<p class="big"><mark>${transfers.length} payment${transfers.length > 1 ? 's' : ''}</mark></p><div>`;
    transfers.forEach(t => {
      html += `<div class="transfer"><strong>${esc(t.from)}</strong><span>pays</span><strong>${esc(t.to)}</strong><span class="amt">${money(t.amt)}</span></div>`;
    });
    html += `</div><div id="copy-text" aria-hidden="true" class="sr-only" style="white-space:pre">${transfers.map(t => `${esc(t.from)} pays ${esc(t.to)} ${money(t.amt)}`).join('\n')}</div>
      <div class="copyrow"><button type="button" class="btn ghost" data-copy="copy-text">Copy</button></div>`;
  }
  html += `<div class="scroll"><table class="tbl"><thead><tr><th>Person</th><th class="n">Paid</th><th class="n">Fair share</th><th class="n">Balance</th></tr></thead><tbody>`;
  people.forEach(p => {
    html += `<tr><td>${esc(p.name)}</td><td class="n">${money(p.paid)}</td><td class="n">${money(p.fair)}</td><td class="n">${p.bal > 0 ? '+' : p.bal < 0 ? '−' : ''}${money(Math.abs(p.bal))}</td></tr>`;
  });
  html += `</tbody><tfoot><tr><td>Total</td><td class="n">${money(total)}</td><td class="n">${money(total)}</td><td></td></tr></tfoot></table></div>`;
  out.innerHTML = html;
}
calc();
