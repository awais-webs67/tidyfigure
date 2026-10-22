const n = id => val($('#' + id));
const show = (i, value, how) => { $('#r' + i).textContent = ok(value) ? fmtMax(value, 4) + (i === 2 || i === 3 ? '%' : '') : '–'; $('#w' + i).textContent = ok(value) ? how : ''; };
const f = x => fmtMax(x, 4);

function calc() {
  const a1 = n('a1'), b1 = n('b1');
  show(1, a1 / 100 * b1, `${f(a1)} ÷ 100 × ${f(b1)}`);
  const a2 = n('a2'), b2 = n('b2');
  show(2, b2 ? a2 / b2 * 100 : NaN, `${f(a2)} ÷ ${f(b2)} × 100`);
  const a3 = n('a3'), b3 = n('b3');
  const ch = a3 ? (b3 - a3) / Math.abs(a3) * 100 : NaN;
  show(3, ch, ok(ch) ? `(${f(b3)} − ${f(a3)}) ÷ ${f(Math.abs(a3))} × 100 · ${ch > 0 ? 'an increase' : ch < 0 ? 'a decrease' : 'no change'}` : '');
  if (ok(ch)) $('#r3').textContent = (ch > 0 ? '+' : '') + fmtMax(ch, 4) + '%';
  const a4 = n('a4'), b4 = n('b4'), s = +$('#op4').value;
  show(4, a4 * (1 + s * b4 / 100), `${f(a4)} × (1 ${s > 0 ? '+' : '−'} ${f(b4)} ÷ 100)`);
  const a5 = n('a5'), b5 = n('b5');
  show(5, b5 ? a5 / (b5 / 100) : NaN, `${f(a5)} ÷ (${f(b5)} ÷ 100)`);
}
onAny('input, select', calc);
calc();
