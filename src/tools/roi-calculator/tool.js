onAny('input', calc);
function calc() {
  const inv = val($('#inv')), ret = val($('#ret')), yrs = val($('#yrs')), out = $('#out');
  if (!(inv > 0) || !ok(ret)) { out.innerHTML = '<p class="empty">Enter the amount invested and returned.</p>'; return; }
  const gain = ret - inv, roi = gain / inv * 100;
  const ann = yrs > 0 && ret > 0 ? (Math.pow(ret / inv, 1 / yrs) - 1) * 100 : NaN;
  out.innerHTML = `<p class="kicker">Return on investment</p><p class="huge" style="text-align:left"><mark>${roi >= 0 ? '+' : ''}${fmt(roi, 1)}%</mark></p>
    <div class="statgrid">
      <div class="stat"><b>${gain >= 0 ? '+' : ''}${fmt(gain)}</b><span>${gain >= 0 ? 'Profit' : 'Loss'}</span></div>
      <div class="stat"><b>${ok(ann) ? fmt(ann, 2) + '%' : '–'}</b><span>Per year (annualised)</span></div>
      <div class="stat"><b>${fmt(ret / inv, 2)}×</b><span>Money multiple</span></div>
    </div>
    ${ok(ann) ? `<p class="note">${fmt(roi, 1)}% over ${fmtMax(yrs, 2)} years is the same as ${fmt(ann, 2)}% a year compounded, which is the fair way to compare it with other investments.</p>` : ''}`;
}
calc();
