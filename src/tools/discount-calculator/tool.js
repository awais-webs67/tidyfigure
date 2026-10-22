onAny('#price, #d1, #d2, #tax', calc);
$('#presets').addEventListener('click', e => {
  const b = e.target.closest('.chip');
  if (!b) return;
  $('#d1').value = b.dataset.d; $('#d2').value = 0;
  calc();
});

function calc() {
  const price = val($('#price'));
  const d1 = Math.min(100, Math.max(0, val($('#d1')) || 0)), d2 = Math.min(100, Math.max(0, val($('#d2')) || 0));
  const tax = Math.max(0, val($('#tax')) || 0);
  const out = $('#out');
  if (!(price > 0)) { out.innerHTML = '<p class="empty">Enter the original price.</p>'; return; }
  const after1 = price * (1 - d1 / 100);
  const after2 = after1 * (1 - d2 / 100);
  const final = after2 * (1 + tax / 100);
  const saved = price - after2;
  const totalPct = saved / price * 100;
  out.innerHTML = `<p class="kicker">You pay</p><p class="huge" style="text-align:left"><mark>${fmt(final)}</mark></p>
    <p class="sub">You save <strong>${fmt(saved)}</strong> (${fmtMax(totalPct, 2)}% off)${tax ? `, including ${fmt(after2 * tax / 100)} tax` : ''}</p>
    <div class="scroll"><table class="tbl"><tbody>
      <tr><td>Original price</td><td class="n">${fmt(price)}</td></tr>
      <tr><td>− ${fmtMax(d1, 2)}% discount</td><td class="n">−${fmt(price - after1)}</td></tr>
      ${d2 ? `<tr><td>− extra ${fmtMax(d2, 2)}% on ${fmt(after1)}</td><td class="n">−${fmt(after1 - after2)}</td></tr>` : ''}
      ${tax ? `<tr><td>+ ${fmtMax(tax, 2)}% tax</td><td class="n">+${fmt(final - after2)}</td></tr>` : ''}
    </tbody><tfoot><tr><td>Final price</td><td class="n">${fmt(final)}</td></tr></tfoot></table></div>
    ${d1 && d2 ? `<p class="note">${fmtMax(d1, 2)}% + ${fmtMax(d2, 2)}% off is <strong>${fmtMax(totalPct, 2)}%</strong> in total, not ${fmtMax(d1 + d2, 2)}%, because the extra discount applies to the already reduced price.</p>` : ''}`;
}
calc();
