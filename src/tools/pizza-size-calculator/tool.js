const list = $('#pizzas');

makeList(list, $('#add-pizza'), v => `
  <label class="f f-name"><span>Option</span><input data-f="name" type="text" value="${esc(v.name ?? '')}" placeholder="e.g. Large pepperoni"></label>
  <label class="f"><span>Diameter</span><input data-f="d" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.d ?? '')}"></label>
  <label class="f"><span>How many</span><input data-f="q" type="number" inputmode="numeric" min="1" step="1" value="${esc(v.q ?? 1)}"></label>
  <label class="f"><span>Total price</span><input data-f="p" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.p ?? '')}"></label>
  <button type="button" class="rm" aria-label="Remove this option">×</button>`,
  [
    { name: 'One 18″ large', d: 18, q: 1, p: 21 },
    { name: 'Two 12″ mediums', d: 12, q: 2, p: 24 },
  ], calc);
onAny('input[name="unit"]', calc);

function calc() {
  const unit = $('input[name="unit"]:checked').value;
  const au = unit === 'in' ? 'sq in' : 'cm²';
  const per = 100;
  const items = $$('.row', list).map((r, i) => {
    const d = val(field(r, 'd'));
    const q = Math.max(1, val(field(r, 'q')) || 1);
    const p = val(field(r, 'p'));
    const area = Math.PI * (d / 2) ** 2 * q;
    return { name: field(r, 'name').value.trim() || `Option ${i + 1}`, area, p, ppa: p > 0 ? p / area * per : NaN };
  }).filter(x => ok(x.area) && x.area > 0);

  const out = $('#out');
  if (!items.length) { out.innerHTML = '<p class="empty">Enter a diameter for at least one pizza.</p>'; return; }

  const priced = items.filter(x => ok(x.ppa));
  const best = priced.length ? priced.reduce((a, b) => (a.ppa <= b.ppa ? a : b)) : null;
  const sorted = [...items].sort((a, b) => b.area - a.area);
  let html = '';
  if (best) {
    html += `<p class="kicker">Best value</p><p class="big"><mark>${esc(best.name)}</mark></p>
      <p class="sub"><span class="num">${fmt(best.ppa)}</span> per ${per} ${au} of pizza</p>`;
  } else {
    html += `<p class="kicker">Most pizza</p><p class="big"><mark>${esc(sorted[0].name)}</mark></p>
      <p class="sub">Add prices to compare value.</p>`;
  }
  html += `<div class="scroll"><table class="tbl"><thead><tr><th>Option</th><th class="n">Pizza</th><th class="n">Per ${per} ${au}</th><th class="n">vs best</th></tr></thead><tbody>`;
  items.forEach(x => {
    const diff = best && ok(x.ppa) ? (x.ppa / best.ppa - 1) * 100 : NaN;
    const vs = x === best ? 'Best' : ok(diff) ? `+${fmt(diff, 0)}%` : '–';
    html += `<tr${x === best ? ' class="win"' : ''}><td>${esc(x.name)}</td><td class="n">${fmtMax(x.area, 0)} ${au}</td><td class="n">${ok(x.ppa) ? fmt(x.ppa) : '–'}</td><td class="n">${vs}</td></tr>`;
  });
  html += '</tbody></table></div>';
  if (sorted.length >= 2 && sorted[1].area > 0) {
    const more = (sorted[0].area / sorted[1].area - 1) * 100;
    if (more >= 0.5) html += `<p class="note">${esc(sorted[0].name)} gives you <strong>${fmtMax(more, 1)}% more pizza</strong> than ${esc(sorted[1].name)}.</p>`;
  }
  out.innerHTML = html;
}
calc();
