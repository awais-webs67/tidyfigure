const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
// "2 3/4", "-5/8", "7", "0.25" → [numerator, denominator] (not simplified), or null.
function parse(s) {
  s = String(s).trim().replace(/[−–]/g, '-').replace(/\s+/g, ' ');
  let m;
  if ((m = s.match(/^(-?)(\d+) (\d+)\/(\d+)$/))) { const d = +m[4]; if (!d) return null; const n = +m[2] * d + +m[3]; return [m[1] ? -n : n, d]; }
  if ((m = s.match(/^(-?\d+)\/(-?\d+)$/))) { const d = +m[2]; if (!d) return null; return d < 0 ? [-m[1], -d] : [+m[1], d]; }
  if ((m = s.match(/^(-?)(\d*)\.(\d+)$/))) { const d = 10 ** m[3].length, n = +(m[2] || 0) * d + +m[3]; return [m[1] ? -n : n, d]; }
  if (/^-?\d+$/.test(s)) return [+s, 1];
  return null;
}
const simp = ([n, d]) => { const g = gcd(n, d); return [n / g, d / g]; };
const frac = ([n, d]) => (d === 1 ? `<span class="whole">${n}</span>` : `<span class="fc-frac"><span>${n}</span><span>${d}</span></span>`);
const txt = ([n, d]) => (d === 1 ? `${n}` : `${n}/${d}`);
function mixed([n, d]) { if (d === 1 || Math.abs(n) < d) return null; const w = Math.trunc(n / d), r = Math.abs(n % d); return r ? [w, r, d] : null; }
const dec = ([n, d]) => { const v = n / d; return Number.isInteger(v) ? String(v) : (Math.round(v * 1e6) / 1e6).toString() + (String(n / d).length > 12 ? '…' : ''); };
function calc() {
  const A = parse($('#a').value), B = parse($('#b').value), op = $('#op').value, out = $('#out');
  if (!A || !B) { out.innerHTML = `<p class="kicker">Answer</p><span class="verdict no">Check the ${!A ? 'first' : 'second'} fraction</span><p class="sub">Use forms like 3/4, 2 1/3, 7 or 0.25. The bottom number can’t be 0.</p>`; return; }
  if (op === '÷' && B[0] === 0) { out.innerHTML = '<p class="kicker">Answer</p><span class="verdict no">Can’t divide by zero</span>'; return; }
  const steps = [`Write as fractions: ${txt(A)} ${op} ${txt(B)}`];
  let R;
  if (op === '+' || op === '−') {
    const L = lcm(A[1], B[1]), a = A[0] * (L / A[1]), b = B[0] * (L / B[1]);
    if (A[1] !== B[1]) steps.push(`Common denominator ${L}: ${a}/${L} ${op} ${b}/${L}`);
    R = [op === '+' ? a + b : a - b, L];
    steps.push(`${op === '+' ? 'Add' : 'Subtract'} the tops: ${R[0]}/${L}`);
  } else if (op === '×') { R = [A[0] * B[0], A[1] * B[1]]; steps.push(`Multiply tops and bottoms: (${A[0]}×${B[0]})/(${A[1]}×${B[1]}) = ${txt(R)}`); }
  else { const flip = B[0] < 0 ? [-B[1], -B[0]] : [B[1], B[0]]; steps.push(`Flip the second and multiply: ${txt(A)} × ${txt(flip)}`); R = [A[0] * flip[0], A[1] * flip[1]]; steps.push(`= ${txt(R)}`); }
  const S = simp(R), g = gcd(R[0], R[1]);
  if (g > 1) steps.push(`Simplify (divide by ${g}): ${txt(S)}`);
  const mx = mixed(S);
  out.innerHTML = `<p class="kicker">Answer</p><div class="fc-big">${frac(S)}${mx ? `<span class="sub">=</span><span class="whole">${mx[0]}</span>${frac([mx[1], mx[2]])}` : ''}<span class="sub">= ${dec(S)}</span></div>
    <div class="btns"><button type="button" class="btn ghost" id="copy">Copy ${txt(S)}</button></div>
    <p class="group-title">Steps</p><ol class="fc-steps">${steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>`;
  $('#copy').onclick = e => copyText(txt(S), e.currentTarget);
}
function conv() {
  const s = $('#c').value.trim().replace(/[−–]/g, '-'), o = $('#cout');
  let m = s.match(/^(-?)(\d*)\.(\d*)\((\d+)\)$/) || s.match(/^(-?)(\d*)\.(\d*?)(\d)\4{4,}$/);
  if (m) { // repeating decimal, e.g. 0.(3) or 0.33333
    const sign = m[1] ? -1 : 1, nr = m[3], rep = m[4], whole = +(m[2] || 0), a = +(nr + rep || 0), b = +(nr || 0), d = (10 ** (nr.length + rep.length)) - (10 ** nr.length);
    const F = simp([sign * (whole * d + a - b), d]); o.textContent = `${s} = ${txt(F)}${mixed(F) ? ` = ${mixed(F)[0]} ${mixed(F)[1]}/${mixed(F)[2]}` : ''} (repeating)`; return;
  }
  const F0 = parse(s); if (!F0) { o.textContent = 'Type a fraction (18/24) or a decimal (0.375).'; return; }
  const F = simp(F0), mx = mixed(F);
  o.textContent = `${s} = ${txt(F)}${mx ? ` = ${mx[0]} ${mx[1]}/${mx[2]}` : ''} = ${dec(F)}${F[1] !== F0[1] && F0[1] !== 1 ? `  (simplified from ${txt(F0)})` : ''}`;
}
onAny('#a, #b, #op', calc);
$('#c').addEventListener('input', conv);
calc(); conv();
