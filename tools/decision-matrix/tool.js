const state = {
  opts: ['Flat on Elm St', 'Flat by the park', 'House share'],
  crit: [
    { name: 'Monthly cost', w: 5, s: [6, 4, 9] },
    { name: 'Commute', w: 4, s: [8, 5, 6] },
    { name: 'Space', w: 3, s: [5, 8, 4] },
    { name: 'Natural light', w: 2, s: [4, 9, 6] },
    { name: 'Neighbourhood', w: 3, s: [6, 9, 5] },
  ],
};
const table = $('#matrix');
const wOpts = w => [1, 2, 3, 4, 5].map(n => `<option value="${n}"${n === w ? ' selected' : ''}>${n}</option>`).join('');

function render() {
  let h = `<thead><tr><th>Factor</th><th>Weight</th>${state.opts.map((o, j) => `<th><input type="text" data-o="${j}" value="${esc(o)}" aria-label="Option ${j + 1} name"></th>`).join('')}<th></th></tr></thead><tbody>`;
  state.crit.forEach((c, i) => {
    h += `<tr><td><input type="text" data-c="${i}" value="${esc(c.name)}" aria-label="Factor ${i + 1} name"></td>
      <td><select data-w="${i}" aria-label="Weight of ${esc(c.name)}">${wOpts(c.w)}</select></td>
      ${state.opts.map((o, j) => `<td><input type="number" inputmode="numeric" min="1" max="10" step="1" data-s="${i},${j}" value="${c.s[j] ?? ''}" aria-label="${esc(o)}: ${esc(c.name)}"></td>`).join('')}
      <td><button type="button" class="rm" data-rmc="${i}" aria-label="Remove ${esc(c.name)}">×</button></td></tr>`;
  });
  h += `</tbody><tfoot><tr><td>Weighted score</td><td></td>${state.opts.map((o, j) => `<td class="n" data-total="${j}"></td>`).join('')}<td></td></tr>
    <tr><td></td><td></td>${state.opts.map((o, j) => `<td><button type="button" class="rm" data-rmo="${j}" aria-label="Remove ${esc(o)}">×</button></td>`).join('')}<td></td></tr></tfoot>`;
  table.innerHTML = h;
  calc();
}

table.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.o !== undefined) state.opts[+t.dataset.o] = t.value;
  else if (t.dataset.c !== undefined) state.crit[+t.dataset.c].name = t.value;
  else if (t.dataset.w !== undefined) state.crit[+t.dataset.w].w = +t.value;
  else if (t.dataset.s !== undefined) { const [i, j] = t.dataset.s.split(',').map(Number); state.crit[i].s[j] = val(t); }
  calc();
});
table.addEventListener('change', e => { if (e.target.dataset.w !== undefined) { state.crit[+e.target.dataset.w].w = +e.target.value; calc(); } });
table.addEventListener('click', e => {
  const b = e.target.closest('.rm');
  if (!b) return;
  if (b.dataset.rmc !== undefined && state.crit.length > 1) state.crit.splice(+b.dataset.rmc, 1);
  if (b.dataset.rmo !== undefined && state.opts.length > 2) { const j = +b.dataset.rmo; state.opts.splice(j, 1); state.crit.forEach(c => c.s.splice(j, 1)); }
  render();
});
$('#add-opt').addEventListener('click', () => { state.opts.push(`Option ${state.opts.length + 1}`); state.crit.forEach(c => c.s.push(5)); render(); });
$('#add-crit').addEventListener('click', () => { state.crit.push({ name: `Factor ${state.crit.length + 1}`, w: 3, s: state.opts.map(() => 5) }); render(); });

const score = (crit, j) => crit.reduce((sum, c) => sum + c.w * (ok(c.s[j]) ? Math.min(10, Math.max(0, c.s[j])) : 0), 0);
const winnerOf = crit => state.opts.map((o, j) => score(crit, j)).reduce((bi, v, j, arr) => (v > arr[bi] ? j : bi), 0);

function calc() {
  const max = state.crit.reduce((s, c) => s + c.w * 10, 0);
  const totals = state.opts.map((o, j) => score(state.crit, j));
  const order = totals.map((t, j) => j).sort((a, b) => totals[b] - totals[a]);
  const win = order[0], second = order[1];
  $$('[data-total]', table).forEach(td => {
    const j = +td.dataset.total;
    td.innerHTML = j === win ? `<mark>${fmtMax(totals[j], 1)}</mark>` : fmtMax(totals[j], 1);
  });
  const name = j => esc(state.opts[j] || `Option ${j + 1}`);
  const gap = totals[win] - totals[second];
  let html = `<p class="kicker">Best match for what matters to you</p><p class="big"><mark>${name(win)}</mark></p>
    <p class="sub">${fmtMax(totals[win], 1)} of ${max} points (${fmt(totals[win] / max * 100, 0)}%). ${gap === 0 ? `Tied with ${name(second)}.` : `Ahead of ${name(second)} by ${fmtMax(gap, 1)} point${gap === 1 ? '' : 's'} (${fmt(gap / max * 100, 1)}% of the maximum).`}</p>`;

  // Sensitivity: would the winner change if one factor's weight were set to 1 or 5?
  const flips = [];
  state.crit.forEach((c, i) => {
    [1, 5].forEach(w => {
      if (w === c.w) return;
      const alt = state.crit.map((x, k) => (k === i ? { ...x, w } : x));
      const nw = winnerOf(alt);
      if (nw !== win) flips.push(`if <strong>${esc(c.name)}</strong> ${w > c.w ? 'mattered more' : 'mattered less'} (weight ${w}), ${name(nw)} would win`);
    });
  });
  html += flips.length
    ? `<p class="note">Close call: ${flips.slice(0, 3).join('; ')}. Think hard about those weights.</p>`
    : '<p class="note">A clear result: changing any single weight to 1 or 5 doesn\'t change the winner.</p>';
  $('#out').innerHTML = html;
}
render();
