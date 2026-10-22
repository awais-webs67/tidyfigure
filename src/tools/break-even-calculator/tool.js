onAny('#fixed, #price, #var, #target, #units', calc);
function calc() {
  const F = val($('#fixed')) || 0, P = val($('#price')), V = val($('#var')) || 0, T = val($('#target')) || 0, U = val($('#units')), out = $('#out');
  if (!(P > 0)) { out.innerHTML = '<p class="empty">Enter the selling price per unit.</p>'; return; }
  const cm = P - V;
  if (cm <= 0) { out.innerHTML = `<p class="kicker">Break-even point</p><span class="verdict no">Never breaks even</span><p class="sub">Each sale costs ${fmt(V)} to make but only brings in ${fmt(P)}, so every sale loses ${fmt(-cm)}. Raise the price or cut the variable cost.</p>`; return; }
  const be = F / cm, beUp = Math.ceil(be - 1e-9), tu = Math.ceil((F + T) / cm - 1e-9);
  const profitAt = u => u * cm - F;
  out.innerHTML = `<p class="kicker">Break-even point</p><p class="huge" style="text-align:left"><mark>${beUp.toLocaleString()} units</mark></p>
    <p class="sub">${fmt(F)} fixed costs ÷ ${fmt(cm)} contribution per unit = ${fmtMax(be, 2)} units, or ${fmt(be * P)} in sales.</p>
    <div class="statgrid">
      <div class="stat"><b>${fmt(cm)}</b><span>Contribution per unit</span></div>
      <div class="stat"><b>${fmtMax(cm / P * 100, 1)}%</b><span>Contribution margin</span></div>
      ${T > 0 ? `<div class="stat"><b>${tu.toLocaleString()}</b><span>Units for ${fmt(T, 0)} profit (${fmt(tu * P, 0)} sales)</span></div>` : ''}
      ${U >= 0 && ok(U) ? `<div class="stat"><b>${profitAt(U) < 0 ? '−' : ''}${fmt(Math.abs(profitAt(U)), 0)}</b><span>${profitAt(U) >= 0 ? 'Profit' : 'Loss'} at ${Math.round(U).toLocaleString()} units</span></div>` : ''}
    </div>
    ${U > 0 && U >= be ? `<p class="note">Margin of safety: sales could fall by ${fmtMax(U - be, 0)} units (${fmtMax((U - be) / U * 100, 1)}%) before you make a loss.</p>` : ''}
    <div class="scroll"><table class="tbl"><thead><tr><th class="n">Units</th><th class="n">Revenue</th><th class="n">Total costs</th><th class="n">Profit</th></tr></thead><tbody>
      ${[0.5, 0.75, 1, 1.25, 1.5, 2].map(k => Math.round(beUp * k)).filter((u, i, arr) => arr.indexOf(u) === i).map(u => `<tr${u === beUp ? ' style="font-weight:700"' : ''}><td class="n">${u.toLocaleString()}</td><td class="n">${fmt(u * P, 0)}</td><td class="n">${fmt(F + u * V, 0)}</td><td class="n">${fmt(profitAt(u), 0)}</td></tr>`).join('')}
    </tbody></table></div>`;
}
calc();
