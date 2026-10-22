// Every unit converts to a base unit: grams, millilitres or single items.
const UNITS = {
  g: ['mass', 1, 'g'], kg: ['mass', 1000, 'kg'], oz: ['mass', 28.349523125, 'oz'], lb: ['mass', 453.59237, 'lb'],
  ml: ['vol', 1, 'ml'], l: ['vol', 1000, 'L'], floz: ['vol', 29.5735295625, 'fl oz (US)'], gal: ['vol', 3785.411784, 'gal (US)'],
  pc: ['count', 1, 'items'], sheet: ['count', 1, 'sheets'], m: ['length', 1, 'metres'], ft: ['length', 0.3048, 'feet'],
};
// What the price is shown "per" for each kind of unit: [label, base units]
const SHOW = {
  mass: [['100 g', 100], ['kg', 1000], ['oz', 28.349523125], ['lb', 453.59237]],
  vol: [['100 ml', 100], ['litre', 1000], ['fl oz', 29.5735295625]],
  count: [['item', 1], ['10 items', 10]],
  length: [['metre', 1], ['foot', 0.3048]],
};
const KIND_NAME = { mass: 'weight', vol: 'volume', count: 'count', length: 'length' };
const unitOptions = sel => Object.entries(UNITS).map(([k, u]) => `<option value="${k}"${k === sel ? ' selected' : ''}>${u[2]}</option>`).join('');

const list = $('#items');
makeList(list, $('#add-item'), v => `
  <label class="f f-name"><span>Product</span><input data-f="name" type="text" value="${esc(v.name ?? '')}" placeholder="e.g. Brand A, family size"></label>
  <label class="f"><span>Price</span><input data-f="price" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.price ?? '')}"></label>
  <label class="f"><span>Packs</span><input data-f="packs" type="number" inputmode="numeric" min="1" step="1" value="${esc(v.packs ?? 1)}"></label>
  <label class="f"><span>Size of each</span><input data-f="size" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.size ?? '')}"></label>
  <label class="f"><span>Unit</span><select data-f="unit">${unitOptions(v.unit ?? 'g')}</select></label>
  <button type="button" class="rm" aria-label="Remove this product">×</button>`,
  [
    { name: 'Regular box', price: 2.99, packs: 1, size: 400, unit: 'g' },
    { name: 'Family box', price: 7.99, packs: 1, size: 1, unit: 'kg' },
    { name: 'Multipack', price: 8.49, packs: 3, size: 400, unit: 'g' },
  ], calc);

function calc() {
  const items = $$('.row', list).map((r, i) => {
    const u = UNITS[field(r, 'unit').value];
    const price = val(field(r, 'price'));
    const packs = Math.max(1, val(field(r, 'packs')) || 1);
    const size = val(field(r, 'size'));
    const base = size * packs * u[1];
    return { name: field(r, 'name').value.trim() || `Product ${i + 1}`, kind: u[0], price, base, perBase: price / base };
  }).filter(x => ok(x.perBase) && x.base > 0 && x.price >= 0);

  const out = $('#out');
  if (!items.length) { out.innerHTML = '<p class="empty">Enter a price and size for at least one product.</p>'; return; }

  // Compare within the most common kind of unit; anything else can't be compared directly.
  const counts = {};
  items.forEach(x => { counts[x.kind] = (counts[x.kind] || 0) + 1; });
  const kind = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  const same = items.filter(x => x.kind === kind);
  const other = items.filter(x => x.kind !== kind);
  const show = SHOW[kind];
  const best = same.reduce((a, b) => (a.perBase <= b.perBase ? a : b));
  const worst = same.reduce((a, b) => (a.perBase >= b.perBase ? a : b));

  let html = `<p class="kicker">Cheapest per unit</p><p class="big"><mark>${esc(best.name)}</mark></p>
    <p class="sub"><span class="num">${fmt(best.perBase * show[0][1])}</span> per ${show[0][0]}</p>`;
  html += `<div class="scroll"><table class="tbl"><thead><tr><th>Product</th>${show.slice(0, 2).map(s => `<th class="n">Per ${s[0]}</th>`).join('')}<th class="n">vs cheapest</th></tr></thead><tbody>`;
  [...same].sort((a, b) => a.perBase - b.perBase).forEach(x => {
    const diff = (x.perBase / best.perBase - 1) * 100;
    html += `<tr${x === best ? ' class="win"' : ''}><td>${esc(x.name)}</td>${show.slice(0, 2).map(s => `<td class="n">${fmt(x.perBase * s[1])}</td>`).join('')}<td class="n">${x === best ? 'Cheapest' : '+' + fmt(diff, 0) + '%'}</td></tr>`;
  });
  html += '</tbody></table></div>';
  if (same.length > 1 && worst !== best) {
    const saving = (1 - best.perBase / worst.perBase) * 100;
    html += `<p class="note">Choosing ${esc(best.name)} over ${esc(worst.name)} saves <strong>${fmt(saving, 0)}%</strong> on the same amount.</p>`;
    const biggest = same.reduce((a, b) => (a.base >= b.base ? a : b));
    if (biggest !== best) html += `<p class="note">The largest pack (${esc(biggest.name)}) is <strong>not</strong> the cheapest per unit here.</p>`;
  }
  if (other.length) {
    html += `<p class="note">${other.map(x => esc(x.name)).join(', ')} ${other.length > 1 ? 'are' : 'is'} sold by ${KIND_NAME[other[0].kind]}, so ${other.length > 1 ? 'they' : 'it'} can't be compared with products sold by ${KIND_NAME[kind]}.</p>`;
  }
  out.innerHTML = html;
}
calc();
