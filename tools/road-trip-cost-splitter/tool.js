const SYS = {
  metric: { d: 'km', eco: 'Fuel use (L/100 km)', price: 'Fuel price (per litre)', fuel: (dist, eco) => dist * eco / 100, fuelUnit: 'litres' },
  us: { d: 'miles', eco: 'Fuel economy (US mpg)', price: 'Fuel price (per US gallon)', fuel: (dist, eco) => dist / eco, fuelUnit: 'US gallons' },
  uk: { d: 'miles', eco: 'Fuel economy (UK mpg)', price: 'Fuel price (per litre)', fuel: (dist, eco) => dist / eco * 4.54609, fuelUnit: 'litres' },
};
const sys = () => SYS[$('input[name="sys"]:checked').value];

const list = $('#riders');
makeList(list, $('#add-rider'), v => `
  <label class="f f-name"><span>Name</span><input data-f="name" type="text" value="${esc(v.name ?? '')}" placeholder="e.g. Sam"></label>
  <label class="f"><span>Distance in the car</span><input data-f="dist" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.dist ?? '')}" placeholder="whole trip"></label>
  <button type="button" class="rm" aria-label="Remove this person">×</button>`,
  [
    { name: 'Sam (driver)', dist: 420 },
    { name: 'Priya', dist: 420 },
    { name: 'Leo', dist: 250 },
    { name: 'Mia', dist: 120 },
  ], calc);
onAny('#dist, #eco, #price, #extra, #driver-free, input[name="sys"]', calc);

function calc() {
  const s = sys();
  $('#dist-label').textContent = `Trip distance (${s.d})`;
  $('#eco-label').textContent = s.eco;
  $('#price-label').textContent = s.price;
  const dist = val($('#dist')), eco = val($('#eco')), price = val($('#price'));
  const extra = Math.max(0, val($('#extra')) || 0);
  const out = $('#out');
  const people = $$('.row', list).map((r, i) => {
    const d = val(field(r, 'dist'));
    return { name: field(r, 'name').value.trim() || `Person ${i + 1}`, d: Math.min(dist, ok(d) && d >= 0 ? d : dist), fuel: 0 };
  });
  if (!(dist > 0 && eco > 0 && price >= 0) || !people.length) { out.innerHTML = '<p class="empty">Enter the distance, fuel economy and fuel price.</p>'; return; }

  const fuelAmount = s.fuel(dist, eco);
  const fuelCost = fuelAmount * price;
  const perUnit = fuelCost / dist;

  // Walk the trip in stretches between drop-off points; each stretch is shared by whoever is still in the car.
  const stops = [...new Set([0, ...people.map(p => p.d), dist])].sort((a, b) => a - b);
  for (let i = 1; i < stops.length; i++) {
    const from = stops[i - 1], to = stops[i];
    let riders = people.filter(p => p.d >= to);
    if (!riders.length) { const far = Math.max(...people.map(p => p.d)); riders = people.filter(p => p.d === far); }
    riders.forEach(p => { p.fuel += (to - from) * perUnit / riders.length; });
  }
  if ($('#driver-free').checked && people.length > 1) {
    const driverShare = people[0].fuel;
    const others = people.slice(1);
    const othersTotal = others.reduce((t, p) => t + p.fuel, 0);
    others.forEach(p => { p.fuel += othersTotal ? driverShare * p.fuel / othersTotal : driverShare / others.length; });
    people[0].fuel = 0;
  }
  people.forEach(p => { p.extra = extra / people.length; p.total = p.fuel + p.extra; });
  const total = fuelCost + extra;

  let html = `<p class="kicker">Trip cost</p><p class="big"><mark>${fmt(total)}</mark></p>
    <p class="sub">${fmtMax(fuelAmount, 1)} ${s.fuelUnit} of fuel = ${fmt(fuelCost)}${extra ? `, plus ${fmt(extra)} tolls &amp; parking` : ''}</p>
    <div class="scroll"><table class="tbl"><thead><tr><th>Person</th><th class="n">Rode</th><th class="n">Fuel</th><th class="n">Pays</th></tr></thead><tbody>`;
  people.forEach(p => {
    html += `<tr><td>${esc(p.name)}</td><td class="n">${fmtMax(p.d, 1)} ${s.d}</td><td class="n">${fmt(p.fuel)}</td><td class="n"><strong>${fmt(p.total)}</strong></td></tr>`;
  });
  html += `</tbody><tfoot><tr><td>Total</td><td></td><td class="n">${fmt(fuelCost)}</td><td class="n">${fmt(total)}</td></tr></tfoot></table></div>
    <p class="note">Fuel costs ${fmt(perUnit, 3)} per ${s.d === 'km' ? 'km' : 'mile'}. Each stretch of road is split between the people in the car for that stretch.</p>`;
  out.innerHTML = html;
}
calc();
