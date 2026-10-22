onAny('#amt, #r, #y', calc);
$('#rates').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) { $('#r').value = b.dataset.r; calc(); } });
function calc() {
  const A = val($('#amt')) || 0, r = (val($('#r')) || 0) / 100, Y = Math.round(val($('#y')) || 0), out = $('#out');
  if (!(A > 0 && Y > 0)) { out.innerHTML = '<p class="empty">Enter an amount and number of years.</p>'; return; }
  const f = Math.pow(1 + r, Y);
  const future = A * f, power = A / f, lost = (1 - 1 / f) * 100, dbl = r > 0 ? Math.log(2) / Math.log(1 + r) : Infinity;
  out.innerHTML = `<p class="kicker">In ${Y} years, the same things will cost</p><p class="huge" style="text-align:left"><mark>${fmt(future, 0)}</mark></p>
    <div class="statgrid">
      <div class="stat"><b>${fmt(power, 0)}</b><span>What ${fmt(A, 0)} will buy, in today’s money</span></div>
      <div class="stat"><b>${fmt(lost, 0)}%</b><span>Buying power lost</span></div>
      <div class="stat"><b>${ok(dbl) ? fmt(dbl, 1) : '–'}</b><span>Years for prices to double</span></div>
    </div>
    <div class="scroll"><table class="tbl"><thead><tr><th>Year</th><th class="n">Prices</th><th class="n">Buying power of ${fmt(A, 0)}</th></tr></thead><tbody>${[1, 2, 5, 10, 15, 20, 25, 30].filter(y => y <= Y || y === 1).concat(Y).filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b).map(y => `<tr${y === Y ? ' class="win"' : ''}><td>${y}</td><td class="n">${fmt(A * Math.pow(1 + r, y), 0)}</td><td class="n">${fmt(A / Math.pow(1 + r, y), 0)}</td></tr>`).join('')}</tbody></table></div>`;
}
calc();
