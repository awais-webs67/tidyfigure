let unit = 'm';
onAny('#len, #wid, #thk, #dia, #dep, #qty, #waste', calc);
onAny('input[name="shape"]', () => { const c = $('input[name="shape"]:checked').value === 'col'; $('#col').hidden = !c; $('#slab').hidden = c; calc(); });
onAny('input[name="u"]', () => {
  const nu = $('input[name="u"]:checked').value; if (nu === unit) return;
  const big = nu === 'ft' ? 3.28084 : 1 / 3.28084, small = nu === 'ft' ? 1 / 2.54 : 2.54;
  [['len', big], ['wid', big], ['dep', big], ['thk', small], ['dia', small]].forEach(([id, k]) => { const v = val($('#' + id)); if (ok(v)) $('#' + id).value = +(v * k).toFixed(2); });
  unit = nu; calc();
});
// Typical yield of pre-mixed concrete bags: 80 lb ≈ 0.60 cu ft (0.017 m³), i.e. about 0.00047 m³ per kg.
const M3_PER_KG = 0.017 / 36.29;
function calc() {
  $$('.ua').forEach(e => { e.textContent = unit === 'm' ? '(m)' : '(ft)'; }); $$('.ub').forEach(e => { e.textContent = unit === 'm' ? '(cm)' : '(in)'; });
  const col = $('input[name="shape"]:checked').value === 'col', qty = Math.max(1, Math.round(val($('#qty')) || 1)), k = 1 + +$('#waste').value / 100, out = $('#out');
  const toM = unit === 'm' ? 1 : 0.3048, smallToM = unit === 'm' ? 0.01 : 0.0254;
  let m3;
  if (col) { const d = val($('#dia')) * smallToM, h = val($('#dep')) * toM; m3 = Math.PI * (d / 2) ** 2 * h; }
  else m3 = val($('#len')) * toM * val($('#wid')) * toM * val($('#thk')) * smallToM;
  if (!(m3 > 0)) { out.innerHTML = '<p class="empty">Enter the dimensions.</p>'; return; }
  const total = m3 * qty * k, yd3 = total / 0.764555, ft3 = total * 35.3147;
  const bags = unit === 'm' ? [[20, 'kg'], [25, 'kg'], [40, 'kg']] : [[40, 'lb'], [60, 'lb'], [80, 'lb']];
  const kgOf = ([w, u]) => (u === 'lb' ? w * 0.45359237 : w);
  out.innerHTML = `<p class="kicker">Concrete needed</p><p class="huge" style="text-align:left"><mark>${unit === 'm' ? `${fmt(total, 2)} m³` : `${fmt(yd3, 2)} yd³`}</mark></p>
    <p class="sub">${unit === 'm' ? `${fmt(yd3, 2)} cubic yards · ${fmt(total * 1000, 0)} litres` : `${fmt(ft3, 1)} cubic feet · ${fmt(total, 2)} m³`}${k > 1 ? `, including ${$('#waste').value}% extra` : ''}</p>
    <div class="scroll"><table class="tbl"><thead><tr><th>Pre-mixed bags</th><th class="n">Bags needed</th></tr></thead><tbody>
      ${bags.map(b => `<tr><td>${b[0]} ${b[1]} bag</td><td class="n">${Math.ceil(total / (kgOf(b) * M3_PER_KG) - 1e-9).toLocaleString()}</td></tr>`).join('')}
    </tbody></table></div>
    <p class="note">${total > 1 ? '<strong>Over 1 m³ (about 1.3 yd³)</strong>, ready-mix delivered by truck is usually cheaper and easier than bags. ' : ''}Bag yields vary by brand; check the yield printed on the bag. Mixing it yourself: roughly 1 part cement, 2 parts sand and 3 parts gravel for general-purpose concrete.</p>`;
}
calc();
