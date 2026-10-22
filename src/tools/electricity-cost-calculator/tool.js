const list = $('#apps');
const PRESETS = { 'Space heater': 2000, 'Electric kettle': 2200, 'Fridge-freezer (average)': 40, 'LED TV 50"': 100, 'Laptop': 50, 'Gaming PC': 350, 'Washing machine': 500, 'Tumble dryer': 2500, 'Air conditioner': 1000, 'Ceiling fan': 60, 'LED bulb': 9, 'Wi-Fi router': 10, 'Oven': 2000, 'Microwave': 1000, 'Electric shower': 9000, 'EV charger (7 kW)': 7000 };
makeList(list, $('#add-app'), v => `
  <label class="f f-name"><span>Appliance</span><input data-f="name" type="text" list="app-list" value="${esc(v.name ?? '')}" placeholder="e.g. Heater"></label>
  <label class="f"><span>Watts</span><input data-f="w" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.w ?? '')}"></label>
  <label class="f"><span>Hours / day</span><input data-f="h" type="number" inputmode="decimal" min="0" max="24" step="any" value="${esc(v.h ?? 1)}"></label>
  <label class="f"><span>Days / week</span><input data-f="d" type="number" inputmode="decimal" min="0" max="7" step="1" value="${esc(v.d ?? 7)}"></label>
  <label class="f"><span>How many</span><input data-f="n" type="number" inputmode="numeric" min="1" step="1" value="${esc(v.n ?? 1)}"></label>
  <button type="button" class="rm" aria-label="Remove appliance">×</button>`,
  [{ name: 'Space heater', w: 2000, h: 3 }, { name: 'LED TV 50"', w: 100, h: 5 }, { name: 'Fridge-freezer (average)', w: 40, h: 24 }, { name: 'Gaming PC', w: 350, h: 3, d: 5 }, { name: 'LED bulb', w: 9, h: 6, n: 8 }], calc);
document.body.insertAdjacentHTML('beforeend', `<datalist id="app-list">${Object.keys(PRESETS).map(k => `<option value="${esc(k)}">`).join('')}</datalist>`);
list.addEventListener('change', e => { const f = e.target; if (f.dataset.f === 'name' && PRESETS[f.value]) { field(f.closest('.row'), 'w').value = PRESETS[f.value]; calc(); } });
onAny('#price', calc);
function calc() {
  const price = val($('#price')), out = $('#out');
  const apps = $$('.row', list).map(r => ({ name: field(r, 'name').value.trim() || 'Appliance', w: val(field(r, 'w')) || 0, h: Math.min(24, val(field(r, 'h')) || 0), d: Math.min(7, ok(val(field(r, 'd'))) ? val(field(r, 'd')) : 7), n: Math.max(1, Math.round(val(field(r, 'n')) || 1)) }))
    .filter(a => a.w > 0 && a.h > 0);
  if (!apps.length || !(price >= 0)) { out.innerHTML = '<p class="empty">Add an appliance with its watts and hours of use.</p>'; return; }
  apps.forEach(a => { a.kwhDay = a.w * a.n * a.h / 1000 * a.d / 7; a.year = a.kwhDay * 365 * price; });
  const day = apps.reduce((s, a) => s + a.kwhDay, 0), top = [...apps].sort((x, y) => y.year - x.year);
  out.innerHTML = `<p class="kicker">Cost per month</p><p class="huge" style="text-align:left"><mark>${fmt(day * 365 / 12 * price)}</mark></p>
    <p class="sub">${fmt(day * 365 / 12, 1)} kWh a month at ${fmtMax(price, 4)} per kWh</p>
    <div class="statgrid"><div class="stat"><b>${fmt(day * price)}</b><span>Per day (${fmt(day, 2)} kWh)</span></div><div class="stat"><b>${fmt(day * 365 * price, 0)}</b><span>Per year (${fmt(day * 365, 0)} kWh)</span></div></div>
    <div class="scroll"><table class="tbl"><thead><tr><th>Appliance</th><th class="n">kWh / month</th><th class="n">Month</th><th class="n">Year</th><th class="n">Share</th></tr></thead><tbody>
      ${top.map(a => `<tr><td>${esc(a.name)}${a.n > 1 ? ` × ${a.n}` : ''}<br><small class="sub">${fmtMax(a.w, 0)} W · ${fmtMax(a.h, 2)} h/day${a.d < 7 ? ` · ${a.d} days/wk` : ''}</small></td><td class="n">${fmt(a.kwhDay * 365 / 12, 1)}</td><td class="n">${fmt(a.year / 12)}</td><td class="n">${fmt(a.year, 0)}</td><td class="n">${fmtMax(a.kwhDay / day * 100, 0)}%</td></tr>`).join('')}
    </tbody></table></div>
    <p class="note">${esc(top[0].name)} uses the most: ${fmtMax(top[0].kwhDay / day * 100, 0)}% of the total. Cutting its use by one hour a day would save about ${fmt(top[0].w * top[0].n / 1000 * 365 * price * top[0].d / 7, 0)} a year.</p>`;
}
calc();
