const V = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
const BAR = '̅', bar = s => [...s].map(c => c + BAR).join('');
function toRoman(n) {
  const parts = [];
  if (n >= 4000) { const th = Math.floor(n / 1000); parts.push([th * 1000, bar(toRoman(th).text)]); n %= 1000; }
  for (const [v, s] of V) while (n >= v) { parts.push([v, s]); n -= v; }
  return { text: parts.map(p => p[1]).join(''), parts };
}
function fromRoman(s) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) { const a = map[s[i]], b = map[s[i + 1]] || 0; total += a < b ? -a : a; }
  return total;
}
function run() {
  const raw = $('#in').value.trim(), out = $('#out');
  if (!raw) { out.innerHTML = '<p class="kicker">Result</p><p class="empty">Type a number or Roman numerals.</p>'; return; }
  if (/^\d[\d,\s]*$/.test(raw)) {
    const n = parseInt(raw.replace(/[,\s]/g, ''), 10);
    if (n < 1 || n > 3999999) { out.innerHTML = '<p class="kicker">Roman numerals</p><span class="verdict no">Out of range</span><p class="sub">Roman numerals go from 1 to 3,999 (or up to 3,999,999 with a line over the thousands). There is no zero.</p>'; return; }
    const r = toRoman(n);
    out.innerHTML = `<p class="kicker">${n.toLocaleString()} in Roman numerals</p><p class="big" style="font-size:clamp(28px,6vw,44px);letter-spacing:.04em">${r.text}</p>
      <div class="btns"><button type="button" class="btn" id="copy">Copy</button></div>
      <p class="group-title">How it’s built</p><p class="sub">${r.parts.map(([v, s]) => `${s} (${v.toLocaleString()})`).join(' + ')}</p>
      ${n >= 4000 ? '<p class="note">A line over a numeral multiplies it by 1,000. Some fonts show the line slightly off; this is normal.</p>' : ''}`;
    $('#copy').onclick = e => copyText(r.text, e.currentTarget);
    return;
  }
  const s = raw.toUpperCase().replace(/\s+/g, '');
  if (!/^[IVXLCDM]+$/.test(s)) { out.innerHTML = '<p class="kicker">Number</p><span class="verdict no">Not a Roman numeral</span><p class="sub">Use only the letters I, V, X, L, C, D and M, or type a number.</p>'; return; }
  const n = fromRoman(s), canon = n > 0 && n < 4000 ? toRoman(n).text : '';
  out.innerHTML = `<p class="kicker">${esc(s)} as a number</p><p class="huge" style="text-align:left"><mark>${n.toLocaleString()}</mark></p>
    ${canon === s ? '<span class="verdict ok">Valid Roman numeral</span>' : `<span class="verdict tight">Not the standard form</span><p class="sub">The standard way to write ${n.toLocaleString()} is <b>${canon || 'beyond 3,999'}</b>. ${/IIII|XXXX|CCCC|VV|LL|DD/.test(s) ? 'A symbol is repeated too many times.' : 'The subtraction pairs are IV, IX, XL, XC, CD and CM only.'}</p>`}
    <p class="group-title">How it’s read</p><p class="sub">${toRoman(n).parts.map(([v, r]) => `${r} = ${v.toLocaleString()}`).join(' · ')}</p>`;
}
function dateRoman() {
  const m = $('#date').value.match(/^(\d+)-(\d+)-(\d+)$/); if (!m) { $('#dateout').textContent = ''; return; }
  const y = toRoman(+m[1]).text, mo = toRoman(+m[2]).text, d = toRoman(+m[3]).text, sep = $('#sep').value;
  const order = { dmy: [d, mo, y], mdy: [mo, d, y], ymd: [y, mo, d] }[$('#order').value];
  $('#dateout').textContent = order.join(sep);
}
const t = new Date(); $('#date').value = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
$('#in').addEventListener('input', run);
onAny('#date, #order, #sep', dateRoman);
$('#dateout').addEventListener('click', e => copyText($('#dateout').textContent));
run(); dateRoman();
