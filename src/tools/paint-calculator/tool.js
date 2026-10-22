const DOOR = { m: 1.9, ft: 21 }, WIN = { m: 1.5, ft: 15 }; // typical sizes: 0.8 × 2.0 m door (≈ 21 sq ft), 1.2 × 1.2 m window
let unit = 'm';
onAny('#len, #wid, #hgt, #doors, #wins, #coats, #cov, #ceil, #extra', calc);
onAny('input[name="u"]', () => {
  const nu = $('input[name="u"]:checked').value; if (nu === unit) return;
  const k = nu === 'ft' ? 3.28084 : 1 / 3.28084;
  ['len', 'wid', 'hgt'].forEach(id => { const v = val($('#' + id)); if (ok(v)) $('#' + id).value = +(v * k).toFixed(2); });
  $('#cov').value = nu === 'ft' ? 375 : 10;
  unit = nu; calc();
});
function calc() {
  $$('.ul').forEach(e => { e.textContent = unit === 'm' ? '(m)' : '(ft)'; });
  $$('.cl').forEach(e => { e.textContent = unit === 'm' ? '(m² per litre)' : '(sq ft per gallon)'; });
  const L = val($('#len')), W = val($('#wid')), H = val($('#hgt')), coats = +$('#coats').value, cov = val($('#cov')), out = $('#out');
  if (!(L > 0 && W > 0 && H > 0 && cov > 0)) { out.innerHTML = '<p class="empty">Enter the room size and paint coverage.</p>'; return; }
  const sq = unit === 'm' ? 'm²' : 'sq ft', vol = unit === 'm' ? 'litres' : 'gallons';
  const walls = 2 * (L + W) * H, gaps = (val($('#doors')) || 0) * DOOR[unit] + (val($('#wins')) || 0) * WIN[unit];
  const wallArea = Math.max(0, walls - gaps), ceilArea = $('#ceil').checked ? L * W : 0, k = $('#extra').checked ? 1.1 : 1;
  const wallPaint = wallArea * coats / cov * k, ceilPaint = ceilArea * coats / cov * k;
  const tins = q => {
    if (unit === 'ft') { const g = Math.floor(q), qt = Math.ceil((q - g) * 4 - 1e-9); return qt === 4 ? `${g + 1} gallon${g ? 's' : ''}` : `${g ? `${g} gallon${g > 1 ? 's' : ''}` : ''}${g && qt ? ' + ' : ''}${qt ? `${qt} quart${qt > 1 ? 's' : ''}` : ''}` || '1 quart'; }
    // Cheapest-looking mix of 5 L, 2.5 L and 1 L tins that covers the amount.
    let best = null;
    for (let a = 0; a <= Math.ceil(q / 5); a++) for (let b = 0; b <= 2; b++) for (let c = 0; c <= 2; c++) { const t = a * 5 + b * 2.5 + c; if (t >= q - 1e-9 && (!best || t < best.t || (t === best.t && a + b + c < best.n))) best = { t, n: a + b + c, a, b, c }; }
    return [best.a && `${best.a} × 5 L`, best.b && `${best.b} × 2.5 L`, best.c && `${best.c} × 1 L`].filter(Boolean).join(' + ') || '1 × 1 L';
  };
  out.innerHTML = `<p class="kicker">Paint for the walls</p><p class="huge" style="text-align:left"><mark>${fmt(wallPaint, 1)} ${vol}</mark></p>
    <p class="sub">Buy: ${tins(wallPaint)}</p>
    ${ceilArea ? `<div class="statgrid"><div class="stat"><b>${fmt(ceilPaint, 1)} ${unit === 'm' ? 'L' : 'gal'}</b><span>Ceiling paint (${tins(ceilPaint)})</span></div></div>` : ''}
    <div class="scroll"><table class="tbl"><tbody>
      <tr><td>Wall area: 2 × (${fmtMax(L, 2)} + ${fmtMax(W, 2)}) × ${fmtMax(H, 2)}</td><td class="n">${fmt(walls, 1)} ${sq}</td></tr>
      <tr><td>Minus doors and windows</td><td class="n">−${fmt(Math.min(walls, gaps), 1)} ${sq}</td></tr>
      <tr><td>Area to paint</td><td class="n">${fmt(wallArea, 1)} ${sq}</td></tr>
      <tr><td>× ${coats} coat${coats > 1 ? 's' : ''} ÷ ${fmtMax(cov, 1)} ${sq} per ${unit === 'm' ? 'litre' : 'gallon'}${k > 1 ? ' + 10%' : ''}</td><td class="n">${fmt(wallPaint, 2)} ${vol}</td></tr>
    </tbody></table></div>`;
}
calc();
