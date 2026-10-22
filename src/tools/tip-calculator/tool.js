onAny('#bill, #pct, #ppl, #tax, #round', calc);
$('#chips').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) { $('#pct').value = b.dataset.p; calc(); } });
function calc() {
  const bill = val($('#bill')), pct = (val($('#pct')) || 0) / 100, ppl = Math.max(1, Math.round(val($('#ppl')) || 1)), tax = val($('#tax')) || 0, r = +$('#round').value, out = $('#out');
  if (!(bill > 0)) { out.innerHTML = '<p class="empty">Enter the bill amount.</p>'; return; }
  const tip = (bill - tax) * pct, total = bill + tip, each = total / ppl;
  const rounded = r ? Math.ceil(each / r - 1e-9) * r : each, rTotal = rounded * ppl, rTip = rTotal - bill;
  out.innerHTML = `<p class="kicker">${ppl > 1 ? 'Each person pays' : 'Total to pay'}</p><p class="huge" style="text-align:left"><mark>${fmt(r ? rounded : each)}</mark></p>
    <p class="sub">${r && Math.abs(rounded - each) > 0.004 ? `Rounded up from ${fmt(each)}. ` : ''}${ppl > 1 ? `${ppl} people` : ''}</p>
    <div class="scroll"><table class="tbl"><tbody>
      <tr><td>Bill</td><td class="n">${fmt(bill)}</td></tr>
      <tr><td>Tip at ${fmtMax(pct * 100, 2)}%${tax ? ' (before tax)' : ''}</td><td class="n">${fmt(tip)}</td></tr>
      ${ppl > 1 ? `<tr><td>Tip per person</td><td class="n">${fmt(tip / ppl)}</td></tr>` : ''}
    </tbody><tfoot><tr><td>Total</td><td class="n">${fmt(total)}</td></tr></tfoot></table></div>
    ${r && Math.abs(rTotal - total) > 0.004 ? `<p class="note">With rounding, the group pays ${fmt(rTotal)}: a tip of ${fmt(rTip)}, which is ${fmtMax(rTip / (bill - tax) * 100, 1)}%.</p>` : ''}
    <div class="scroll"><table class="tbl"><thead><tr><th>Tip</th><th class="n">Tip amount</th><th class="n">Total</th>${ppl > 1 ? '<th class="n">Each</th>' : ''}</tr></thead><tbody>
      ${[10, 15, 18, 20, 25].map(p => { const t = (bill - tax) * p / 100; return `<tr><td>${p}%</td><td class="n">${fmt(t)}</td><td class="n">${fmt(bill + t)}</td>${ppl > 1 ? `<td class="n">${fmt((bill + t) / ppl)}</td>` : ''}</tr>`; }).join('')}
    </tbody></table></div>`;
}
calc();
