const list = $('#rooms');
makeList(list, $('#add-room'), v => `
  <label class="f f-name"><span>Who lives here</span><input data-f="name" type="text" value="${esc(v.name ?? '')}" placeholder="e.g. Sam"></label>
  <label class="f"><span>Room size</span><input data-f="size" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.size ?? '')}" placeholder="m² or sq ft"></label>
  <label class="f"><span>People</span><input data-f="people" type="number" inputmode="numeric" min="1" step="1" value="${esc(v.people ?? 1)}"></label>
  <label class="check"><input data-f="bath" type="checkbox"${v.bath ? ' checked' : ''}>Own bathroom</label>
  <button type="button" class="rm" aria-label="Remove this bedroom">×</button>`,
  [
    { name: 'Ana', size: 16, people: 1, bath: true },
    { name: 'Ben & Kai', size: 13, people: 2 },
    { name: 'Chloe', size: 9, people: 1 },
  ], calc);
onAny('#rent, #common, #bath', calc);

function calc() {
  const rent = val($('#rent'));
  const common = Math.min(100, Math.max(0, val($('#common')) || 0)) / 100;
  const bonus = Math.max(0, val($('#bath')) || 0) / 100;
  const rooms = $$('.row', list).map((r, i) => ({
    name: field(r, 'name').value.trim() || `Room ${i + 1}`,
    size: val(field(r, 'size')),
    people: Math.max(1, Math.round(val(field(r, 'people')) || 1)),
    bath: field(r, 'bath').checked,
  })).filter(r => r.size > 0);

  const out = $('#out');
  if (!(rent > 0) || !rooms.length) { out.innerHTML = '<p class="empty">Enter the rent and at least one room size.</p>'; return; }

  const persons = rooms.reduce((s, r) => s + r.people, 0);
  const weights = rooms.map(r => r.size * (r.bath ? 1 + bonus : 1));
  const totalW = weights.reduce((a, b) => a + b, 0);
  rooms.forEach((r, i) => {
    r.shared = rent * common * r.people / persons;
    r.privatePart = rent * (1 - common) * weights[i] / totalW;
    r.total = r.shared + r.privatePart;
    r.each = r.total / r.people;
  });
  const even = rent / persons;
  const top = rooms.reduce((a, b) => (a.each >= b.each ? a : b));
  const low = rooms.reduce((a, b) => (a.each <= b.each ? a : b));

  let html = `<p class="kicker">Fair split of ${fmt(rent)}</p>
    <div class="scroll"><table class="tbl"><thead><tr><th>Room</th><th class="n">Room pays</th><th class="n">Per person</th><th class="n">vs even split</th></tr></thead><tbody>`;
  rooms.forEach(r => {
    const d = r.each - even;
    html += `<tr><td>${esc(r.name)}${r.bath ? ' <small>(own bath)</small>' : ''}</td><td class="n"><mark>${fmt(r.total)}</mark></td><td class="n">${fmt(r.each)}</td><td class="n">${d >= 0 ? '+' : '−'}${fmt(Math.abs(d))}</td></tr>`;
  });
  html += `</tbody><tfoot><tr><td>Total</td><td class="n">${fmt(rooms.reduce((s, r) => s + r.total, 0))}</td><td></td><td></td></tr></tfoot></table></div>`;
  html += `<p class="note">An even split would be ${fmt(even)} per person. ${esc(top.name)} pays the most per person (${fmt(top.each)}) and ${esc(low.name)} the least (${fmt(low.each)}).</p>`;
  html += `<p class="note">${fmt(common * 100, 0)}% of the rent covers shared space and is split equally per person. The other ${fmt(100 - common * 100, 0)}% is split by room size${bonus > 0 ? `, with private bathrooms counted ${fmt(bonus * 100, 0)}% larger` : ''}.</p>`;
  out.innerHTML = html;
}
calc();
