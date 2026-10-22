const u = bodyUnits(calc);
onAny('#sex, #kg, #lb, #ex, #hot, #extra', calc);
function calc() {
  const kg = u.kg(), out = $('#out');
  if (!(kg > 0)) { out.innerHTML = '<p class="empty">Enter your weight.</p>'; return; }
  // About 35 ml per kg from drinks, plus ~12 ml per minute of exercise, plus extras for heat, pregnancy and breastfeeding.
  const ml = kg * 35 + val($('#ex')) * 12 + +$('#hot').value + +$('#extra').value;
  const L = ml / 1000, glasses = ml / 250, oz = ml / 29.5735;
  const ref = $('#sex').value === 'm' ? 2.0 : 1.6; // EFSA reference intake from drinks (about 80% of 2.5 L / 2.0 L total water)
  out.innerHTML = `<p class="kicker">Drink about</p><p class="huge" style="text-align:left"><mark>${fmt(L, 1)} L</mark></p>
    <p class="sub">a day from drinks · ${Math.round(oz)} US fl oz · about ${Math.round(glasses)} glasses of 250 ml</p>
    <div style="display:flex;flex-wrap:wrap;gap:4px" aria-hidden="true">${'<span style="font-size:22px">🥛</span>'.repeat(Math.min(20, Math.round(glasses)))}</div>
    <p class="note">General guidance (European Food Safety Authority) is about <strong>${fmt(ref, 1)} L a day from drinks</strong> for ${$('#sex').value === 'm' ? 'men' : 'women'} in a mild climate; food provides the rest of your water.</p>
    <p class="note">The simplest check: pale straw-coloured urine means you’re drinking enough. Thirst is a reliable guide for most healthy adults. People with heart or kidney conditions may need to limit fluids; follow your doctor’s advice.</p>`;
}
u.sync();
