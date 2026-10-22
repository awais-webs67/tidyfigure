onAny('input', calc);
function calc() {
  const mode = $('input[name="mode"]:checked').value;
  $('#price-wrap').hidden = mode !== 'both'; $('#margin-wrap').hidden = mode !== 'margin'; $('#markup-wrap').hidden = mode !== 'markup';
  const cost = val($('#cost')), out = $('#out');
  let price = val($('#price'));
  if (mode === 'margin') price = cost / (1 - (val($('#margin')) || 0) / 100);
  if (mode === 'markup') price = cost * (1 + (val($('#markup')) || 0) / 100);
  if (!(cost >= 0 && price > 0) || !ok(price)) { out.innerHTML = '<p class="empty">Enter the cost and selling price.</p>'; return; }
  const profit = price - cost, margin = profit / price * 100, markup = cost ? profit / cost * 100 : NaN;
  out.innerHTML = `<p class="kicker">${mode === 'both' ? 'Gross margin' : 'Selling price'}</p><p class="huge" style="text-align:left"><mark>${mode === 'both' ? fmt(margin, 1) + '%' : fmt(price)}</mark></p>
    ${profit < 0 ? '<span class="verdict no">Selling at a loss</span>' : ''}
    <div class="statgrid">
      <div class="stat"><b>${fmt(price)}</b><span>Price</span></div>
      <div class="stat"><b>${fmt(profit)}</b><span>Profit per sale</span></div>
      <div class="stat"><b>${fmt(margin, 1)}%</b><span>Margin</span></div>
      <div class="stat"><b>${ok(markup) ? fmt(markup, 1) + '%' : '–'}</b><span>Markup</span></div>
    </div>
    <p class="note">Margin is profit as a share of the <strong>price</strong>; markup is profit as a share of the <strong>cost</strong>. A ${fmt(markup, 0)}% markup gives a ${fmt(margin, 0)}% margin.</p>`;
}
calc();
