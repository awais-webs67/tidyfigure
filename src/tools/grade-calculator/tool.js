const list = $('#items');
makeList(list, $('#add-item'), v => `
  <label class="f f-name"><span>Assessment</span><input data-f="name" type="text" value="${esc(v.name ?? '')}" placeholder="e.g. Midterm"></label>
  <label class="f"><span>Weight %</span><input data-f="w" type="number" inputmode="decimal" min="0" max="100" step="any" value="${esc(v.w ?? '')}"></label>
  <label class="f"><span>Score %</span><input data-f="s" type="number" inputmode="decimal" min="0" max="150" step="any" value="${esc(v.s ?? '')}" placeholder="Not yet"></label>
  <button type="button" class="rm" aria-label="Remove">×</button>`,
  [{ name: 'Homework', w: 20, s: 90 }, { name: 'Midterm exam', w: 30, s: 78 }, { name: 'Project', w: 20, s: 85 }, { name: 'Final exam', w: 30, s: '' }], calc);
onAny('#target', calc);
const LETTERS = [['A', 90], ['B', 80], ['C', 70], ['D', 60]];
function calc() {
  const rows = $$('.row', list).map(r => ({ name: field(r, 'name').value.trim() || 'Assessment', w: val(field(r, 'w')) || 0, s: val(field(r, 's')) })).filter(r => r.w > 0);
  const done = rows.filter(r => ok(r.s)), left = rows.filter(r => !ok(r.s));
  const wDone = done.reduce((s, r) => s + r.w, 0), wLeft = left.reduce((s, r) => s + r.w, 0), wAll = wDone + wLeft;
  const earned = done.reduce((s, r) => s + r.w * r.s / 100, 0), target = val($('#target')), out = $('#out');
  if (!rows.length) { out.innerHTML = '<p class="empty">Add your assessments and their weights.</p>'; return; }
  const current = wDone ? earned / wDone * 100 : NaN;
  const need = t => (t * wAll / 100 - earned) / wLeft * 100;
  const verdict = n => (n <= 0 ? '<span class="verdict ok">Already secured</span>' : n <= 100 ? '' : '<span class="verdict no">Not possible</span>');
  out.innerHTML = wLeft && ok(target) ? `<p class="kicker">You need to average</p><p class="huge" style="text-align:left"><mark>${need(target) <= 0 ? '0%' : fmtMax(need(target), 1) + '%'}</mark></p>
    <p class="sub">on ${left.map(r => esc(r.name)).join(', ')} (${fmtMax(wLeft, 2)}% of the grade) to finish with ${fmtMax(target, 2)}%.</p>${verdict(need(target))}`
    : `<p class="kicker">Final grade</p><p class="huge" style="text-align:left"><mark>${fmtMax(current, 2)}%</mark></p>`;
  out.innerHTML += `<div class="statgrid"><div class="stat"><b>${ok(current) ? fmtMax(current, 2) + '%' : '–'}</b><span>Current grade (${fmtMax(wDone, 2)}% done)</span></div>
      <div class="stat"><b>${fmtMax(earned, 2)} / ${fmtMax(wAll, 2)}</b><span>Points earned so far</span></div></div>
    ${wLeft ? `<div class="scroll"><table class="tbl"><thead><tr><th>To finish with</th><th class="n">You need</th></tr></thead><tbody>
      ${LETTERS.map(([l, t]) => { const n = need(t); return `<tr><td>${l} (${t}%)</td><td class="n">${n <= 0 ? 'secured' : n > 100 ? `${fmtMax(n, 1)}% (not possible)` : fmtMax(n, 1) + '%'}</td></tr>`; }).join('')}
    </tbody></table></div>` : ''}
    ${Math.abs(wAll - 100) > 0.01 ? `<p class="note">Your weights add up to ${fmtMax(wAll, 2)}%, not 100%. Results are scaled to the weights you entered.</p>` : ''}`;
}
calc();
