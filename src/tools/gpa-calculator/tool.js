const POINTS = { 'A+': 4.0, A: 4.0, 'A-': 3.7, 'B+': 3.3, B: 3.0, 'B-': 2.7, 'C+': 2.3, C: 2.0, 'C-': 1.7, 'D+': 1.3, D: 1.0, 'D-': 0.7, F: 0 };
const list = $('#courses');
makeList(list, $('#add-course'), v => `
  <label class="f f-name"><span>Course</span><input data-f="name" type="text" value="${esc(v.name ?? '')}" placeholder="e.g. Biology"></label>
  <label class="f"><span>Credits</span><input data-f="cr" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.cr ?? 3)}"></label>
  <label class="f"><span>Grade</span><select data-f="g">${Object.keys(POINTS).map(k => `<option${k === (v.g || 'A') ? ' selected' : ''}>${k}</option>`).join('')}</select></label>
  <button type="button" class="rm" aria-label="Remove course">×</button>`,
  [{ name: 'Calculus', cr: 4, g: 'A-' }, { name: 'English Literature', cr: 3, g: 'B+' }, { name: 'Chemistry', cr: 4, g: 'B' }, { name: 'World History', cr: 3, g: 'A' }], calc);
onAny('#scale, #prev, #prevc', calc);
const pts = g => (g === 'A+' && $('#scale').value === '4.3' ? 4.3 : POINTS[g]);
function calc() {
  const rows = $$('.row', list).map(r => ({ name: field(r, 'name').value.trim(), cr: val(field(r, 'cr')) || 0, g: field(r, 'g').value })).filter(r => r.cr > 0);
  const out = $('#out');
  if (!rows.length) { out.innerHTML = '<p class="empty">Add at least one course with credits.</p>'; return; }
  const credits = rows.reduce((s, r) => s + r.cr, 0), qp = rows.reduce((s, r) => s + r.cr * pts(r.g), 0), gpa = qp / credits;
  const prev = val($('#prev')), prevc = val($('#prevc'));
  const hasPrev = prev >= 0 && prevc > 0, cum = hasPrev ? (prev * prevc + qp) / (prevc + credits) : null;
  const letter = g => Object.entries(POINTS).find(([k, p]) => k !== 'A+' && g >= p - 0.15)?.[0] || 'F';
  out.innerHTML = `<p class="kicker">Term GPA</p><p class="huge" style="text-align:left"><mark>${gpa.toFixed(2)}</mark></p>
    <p class="sub">${fmtMax(qp, 2)} grade points ÷ ${fmtMax(credits, 2)} credits · roughly a ${letter(gpa)} average</p>
    ${hasPrev ? `<div class="statgrid"><div class="stat"><b>${cum.toFixed(2)}</b><span>New cumulative GPA</span></div><div class="stat"><b>${fmtMax(prevc + credits, 2)}</b><span>Total credits</span></div></div>
      <p class="note">${cum > prev + 0.005 ? `Your cumulative GPA goes up by ${(cum - prev).toFixed(2)}.` : cum < prev - 0.005 ? `Your cumulative GPA goes down by ${(prev - cum).toFixed(2)}.` : 'Your cumulative GPA stays about the same.'}</p>` : ''}
    <div class="scroll"><table class="tbl"><thead><tr><th>Course</th><th class="n">Credits</th><th class="n">Grade</th><th class="n">Points</th></tr></thead><tbody>
      ${rows.map(r => `<tr><td>${esc(r.name || '–')}</td><td class="n">${fmtMax(r.cr, 2)}</td><td class="n">${r.g} (${pts(r.g).toFixed(1)})</td><td class="n">${fmtMax(r.cr * pts(r.g), 2)}</td></tr>`).join('')}
    </tbody></table></div>`;
}
calc();
