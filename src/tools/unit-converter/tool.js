// Each unit's size in the category's base unit (metre, kilogram, litre, m², m/s, second, byte).
const CATS = {
  length: { name: 'Length', units: { mm: ['Millimetres', 0.001], cm: ['Centimetres', 0.01], m: ['Metres', 1], km: ['Kilometres', 1000], in: ['Inches', 0.0254], ft: ['Feet', 0.3048], yd: ['Yards', 0.9144], mi: ['Miles', 1609.344], nmi: ['Nautical miles', 1852] }, def: ['km', 'mi'] },
  weight: { name: 'Weight', units: { mg: ['Milligrams', 1e-6], g: ['Grams', 0.001], kg: ['Kilograms', 1], t: ['Tonnes', 1000], oz: ['Ounces', 0.028349523125], lb: ['Pounds', 0.45359237], st: ['Stone', 6.35029318], ton: ['US tons', 907.18474] }, def: ['kg', 'lb'] },
  temp: { name: 'Temperature', units: { c: ['Celsius °C'], f: ['Fahrenheit °F'], k: ['Kelvin K'] }, def: ['c', 'f'] },
  volume: { name: 'Volume', units: { ml: ['Millilitres', 0.001], l: ['Litres', 1], m3: ['Cubic metres', 1000], tsp: ['Teaspoons (US)', 0.00492892159375], tbsp: ['Tablespoons (US)', 0.01478676478125], floz: ['Fluid ounces (US)', 0.0295735295625], cup: ['Cups (US)', 0.2365882365], pt: ['Pints (US)', 0.473176473], ptuk: ['Pints (UK)', 0.56826125], gal: ['Gallons (US)', 3.785411784], galuk: ['Gallons (UK)', 4.54609] }, def: ['l', 'gal'] },
  area: { name: 'Area', units: { cm2: ['Square centimetres', 1e-4], m2: ['Square metres', 1], km2: ['Square kilometres', 1e6], ha: ['Hectares', 1e4], in2: ['Square inches', 0.00064516], ft2: ['Square feet', 0.09290304], yd2: ['Square yards', 0.83612736], ac: ['Acres', 4046.8564224], mi2: ['Square miles', 2589988.110336] }, def: ['m2', 'ft2'] },
  speed: { name: 'Speed', units: { ms: ['Metres per second', 1], kmh: ['Kilometres per hour', 1 / 3.6], mph: ['Miles per hour', 0.44704], kn: ['Knots', 1852 / 3600], fts: ['Feet per second', 0.3048] }, def: ['kmh', 'mph'] },
  time: { name: 'Time', units: { ms: ['Milliseconds', 0.001], s: ['Seconds', 1], min: ['Minutes', 60], h: ['Hours', 3600], d: ['Days', 86400], wk: ['Weeks', 604800], yr: ['Years (365.25 days)', 31557600] }, def: ['h', 'min'] },
  data: { name: 'Data', units: { bit: ['Bits', 0.125], B: ['Bytes', 1], KB: ['Kilobytes (1000)', 1e3], MB: ['Megabytes (1000²)', 1e6], GB: ['Gigabytes (1000³)', 1e9], TB: ['Terabytes (1000⁴)', 1e12], KiB: ['Kibibytes (1024)', 1024], MiB: ['Mebibytes (1024²)', 1048576], GiB: ['Gibibytes (1024³)', 1073741824] }, def: ['GB', 'GiB'] },
};
let cat = 'length';

const toC = (v, u) => (u === 'c' ? v : u === 'f' ? (v - 32) * 5 / 9 : v - 273.15);
const fromC = (c, u) => (u === 'c' ? c : u === 'f' ? c * 9 / 5 + 32 : c + 273.15);
const convert = (v, a, b) => cat === 'temp' ? fromC(toC(v, a), b) : v * CATS[cat].units[a][1] / CATS[cat].units[b][1];
const nice = x => {
  if (!ok(x)) return '–';
  if (x !== 0 && (Math.abs(x) >= 1e12 || Math.abs(x) < 1e-6)) return x.toExponential(6).replace(/\.?0+e/, 'e');
  return x.toLocaleString(undefined, { maximumSignificantDigits: 10 });
};

$('#cats').innerHTML = Object.entries(CATS).map(([k, c]) => `<button type="button" class="chip${k === cat ? ' on' : ''}" data-k="${k}">${c.name}</button>`).join('');
$('#cats').addEventListener('click', e => {
  const b = e.target.closest('.chip');
  if (!b) return;
  cat = b.dataset.k;
  $$('#cats .chip').forEach(c => c.classList.toggle('on', c === b));
  fill();
});
$('#swap').addEventListener('click', () => { const f = $('#from').value; $('#from').value = $('#to').value; $('#to').value = f; calc(); });
onAny('#v, #from, #to', calc);

function fill() {
  const opts = Object.entries(CATS[cat].units).map(([k, u]) => `<option value="${k}">${u[0]}</option>`).join('');
  $('#from').innerHTML = opts; $('#to').innerHTML = opts;
  [$('#from').value, $('#to').value] = CATS[cat].def;
  if (cat === 'temp') $('#v').value = 25;
  calc();
}

function calc() {
  const v = val($('#v')), a = $('#from').value, b = $('#to').value;
  const U = CATS[cat].units;
  const r = convert(v, a, b);
  $('#label').textContent = `${nice(v)} ${U[a][0].toLowerCase()} =`;
  $('#result').textContent = `${nice(r)} ${U[b][0].toLowerCase()}`;
  $('#formula').textContent = cat === 'temp'
    ? ({ cf: '°F = °C × 9/5 + 32', fc: '°C = (°F − 32) × 5/9', ck: 'K = °C + 273.15', kc: '°C = K − 273.15', fk: 'K = (°F − 32) × 5/9 + 273.15', kf: '°F = (K − 273.15) × 9/5 + 32' }[a + b] || '')
    : `1 ${U[a][0].toLowerCase().replace(/s(\s|$)/, '$1').replace('inche', 'inch').replace(/^feet/, 'foot')} = ${nice(convert(1, a, b))} ${U[b][0].toLowerCase()}`;
  $('#all').innerHTML = `<tbody>${Object.entries(U).filter(([k]) => k !== a).map(([k, u]) => `<tr${k === b ? ' class="win"' : ''}><td>${u[0]}</td><td class="n">${nice(convert(v, a, k))}</td></tr>`).join('')}</tbody>`;
}
fill();
