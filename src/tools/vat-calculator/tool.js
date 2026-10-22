onAny('#amt, #rate, input[name="dir"]', calc);
$('#rates').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) { $('#rate').value = b.dataset.r; calc(); } });
function calc() {
  const add = $('input[name="dir"]:checked').value === 'add';
  $('#amt-label').textContent = add ? 'Price before tax (net)' : 'Price including tax (gross)';
  const a = val($('#amt')), r = (val($('#rate')) || 0) / 100, out = $('#out');
  if (!(a >= 0) || !ok(a)) { out.innerHTML = '<p class="empty">Enter an amount.</p>'; return; }
  const net = add ? a : a / (1 + r), tax = net * r, gross = net + tax;
  out.innerHTML = `<p class="kicker">${add ? 'Price including tax' : 'Price before tax'}</p><p class="huge" style="text-align:left"><mark>${fmt(add ? gross : net)}</mark></p>
    <div class="scroll"><table class="tbl"><tbody>
      <tr><td>Net (before tax)</td><td class="n">${fmt(net)}</td></tr>
      <tr><td>Tax at ${fmtMax(r * 100, 3)}%</td><td class="n">${fmt(tax)}</td></tr>
    </tbody><tfoot><tr><td>Gross (including tax)</td><td class="n">${fmt(gross)}</td></tr></tfoot></table></div>
    ${!add ? `<p class="note">The tax inside a gross price is gross × rate ÷ (100 + rate), here ${fmt(a)} × ${fmtMax(r * 100, 3)} ÷ ${fmtMax(100 + r * 100, 3)}. It is <strong>not</strong> ${fmtMax(r * 100, 3)}% of the gross price (${fmt(a * r)}).</p>` : ''}`;
}
calc();
