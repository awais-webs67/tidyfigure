let unit = 'm';
onAny('#len, #wid, #minus, #tl, #tw, #box, #price, #waste', calc);
onAny('input[name="u"]', () => {
  const nu = $('input[name="u"]:checked').value; if (nu === unit) return;
  const big = nu === 'ft' ? 3.28084 : 1 / 3.28084, small = nu === 'ft' ? 1 / 2.54 : 2.54, area = big * big;
  [['len', big], ['wid', big], ['minus', area], ['tl', small], ['tw', small]].forEach(([id, k]) => { const v = val($('#' + id)); if (ok(v)) $('#' + id).value = +(v * k).toFixed(2); });
  unit = nu; calc();
});
function calc() {
  $$('.ua').forEach(e => { e.textContent = unit === 'm' ? '(m)' : '(ft)'; }); $$('.ub').forEach(e => { e.textContent = unit === 'm' ? '(cm)' : '(in)'; }); $$('.usq').forEach(e => { e.textContent = unit === 'm' ? '(m²)' : '(sq ft)'; });
  const L = val($('#len')), W = val($('#wid')), minus = val($('#minus')) || 0, tl = val($('#tl')), tw = val($('#tw')), box = Math.round(val($('#box')) || 0), price = val($('#price')), waste = +$('#waste').value / 100, out = $('#out');
  if (!(L > 0 && W > 0 && tl > 0 && tw > 0)) { out.innerHTML = '<p class="empty">Enter the area and tile size.</p>'; return; }
  const sq = unit === 'm' ? 'm²' : 'sq ft';
  const area = Math.max(0, L * W - minus), tileArea = unit === 'm' ? tl * tw / 10000 : tl * tw / 144;
  const exact = area / tileArea, need = Math.ceil(exact * (1 + waste) - 1e-9), boxes = box > 0 ? Math.ceil(need / box - 1e-9) : 0;
  out.innerHTML = `<p class="kicker">Tiles to buy</p><p class="huge" style="text-align:left"><mark>${need.toLocaleString()} tiles</mark></p>
    <p class="sub">${box > 0 ? `= <strong>${boxes} box${boxes === 1 ? '' : 'es'}</strong> of ${box} (${(boxes * box).toLocaleString()} tiles, ${boxes * box - need} spare)` : ''}</p>
    <div class="statgrid">
      <div class="stat"><b>${fmt(area, 2)} ${sq}</b><span>Area to tile</span></div>
      <div class="stat"><b>${Math.ceil(exact - 1e-9).toLocaleString()}</b><span>Tiles with no extra</span></div>
      ${box > 0 ? `<div class="stat"><b>${fmt(box * tileArea, 2)} ${sq}</b><span>Covered by one box</span></div>` : ''}
      ${price > 0 && boxes ? `<div class="stat"><b>${fmt(boxes * price)}</b><span>Tile cost</span></div>` : ''}
    </div>
    <p class="note">Each tile covers ${fmtMax(tileArea, 4)} ${sq}. ${fmt(area, 2)} ÷ ${fmtMax(tileArea, 4)} = ${fmtMax(exact, 1)} tiles, + ${waste * 100}% = ${need}. Buy all tiles from the same batch (check the shade or lot number on the boxes).</p>`;
}
calc();
