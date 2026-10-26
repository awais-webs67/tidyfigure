const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALE = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion'];
// 0–999 in words; uk adds "and" after hundred.
function small(n, uk) {
  const h = Math.floor(n / 100), r = n % 100, parts = [];
  if (h) parts.push(`${ONES[h]} hundred`);
  if (r) parts.push((h && uk ? 'and ' : '') + (r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? '-' + ONES[r % 10] : '')));
  return parts.join(' ');
}
function intl(s, uk) {
  if (/^0+$/.test(s)) return 'zero';
  const groups = []; for (let i = s.length; i > 0; i -= 3) groups.unshift(+s.slice(Math.max(0, i - 3), i));
  const out = [];
  groups.forEach((g, i) => { if (!g) return; const sc = SCALE[groups.length - 1 - i]; out.push(small(g, uk) + (sc ? ' ' + sc : '')); });
  // UK: "one thousand and five" when the last group is under 100.
  const last = groups[groups.length - 1];
  if (uk && groups.length > 1 && last && last < 100) out[out.length - 1] = 'and ' + out[out.length - 1];
  return out.join(' ');
}
function indian(s, uk) {
  const n = BigInt(s);
  if (n === 0n) return 'zero';
  const cr = n / 10000000n, rest = Number(n % 10000000n), out = [];
  if (cr) out.push(indian(cr.toString(), uk) + ' crore');
  const lakh = Math.floor(rest / 100000), th = Math.floor(rest % 100000 / 1000), h = rest % 1000;
  if (lakh) out.push(small(lakh, false) + ' lakh');
  if (th) out.push(small(th, false) + ' thousand');
  if (h) out.push((uk && out.length && h < 100 ? 'and ' : '') + small(h, uk));
  return out.join(' ');
}
const ORD = { one: 'first', two: 'second', three: 'third', five: 'fifth', eight: 'eighth', nine: 'ninth', twelve: 'twelfth' };
function ordinal(w) { return w.replace(/(\w+)$/, m => ORD[m] || (m.endsWith('y') ? m.slice(0, -1) + 'ieth' : m + 'th')); }
const suffix = n => { const t = n % 100n; return t >= 11n && t <= 13n ? 'th' : ['th', 'st', 'nd', 'rd'][Number(n % 10n)] || 'th'; };
function caseIt(s) {
  const c = $('#case').value;
  if (c === 'upper') return s.toUpperCase();
  if (c === 'lower') return s.toLowerCase();
  if (c === 'title') return s.replace(/(^|[\s-])([a-z])/g, (m, a, b) => a + b.toUpperCase()).replace(/\b(And|Only)\b/g, x => (x === 'And' ? 'and' : 'Only')).replace(/^and/, 'And');
  return s.charAt(0).toUpperCase() + s.slice(1);
}
const group = (s, sys) => sys === 'in' ? s.replace(/(\d)(?=(\d\d)+\d$)/g, '$1,') : s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
function run() {
  const out = $('#out'), raw = $('#n').value.trim().replace(/[,\s_']/g, '');
  const m = raw.match(/^([-+]?)(\d*)(?:\.(\d*))?$/);
  if (!raw || !m || (!m[2] && !m[3])) { out.innerHTML = '<p class="kicker">In words</p><p class="empty">Type a number, such as 1234.56.</p>'; return; }
  const neg = m[1] === '-', int = (m[2] || '0').replace(/^0+(?=\d)/, ''), frac = m[3] || '';
  if (int.length > 36) { out.innerHTML = '<p class="kicker">In words</p><span class="verdict no">Too big</span><p class="sub">Numbers up to 36 digits are supported.</p>'; return; }
  const mode = $('input[name="mode"]:checked').value, uk = $('#style').value === 'uk', sys = $('#sys').value, words = s => (sys === 'in' ? indian(s, uk) : intl(s, uk));
  const [u1, uN, s1, sN] = $('#cur').value.split(',');
  let text, extra = '';
  if (mode === 'cheque') {
    const cents = Math.round(+('0.' + (frac || '0')) * 100), carry = cents === 100, whole = carry ? (BigInt(int) + 1n).toString() : int, c = carry ? 0 : cents;
    const unitW = whole === '1' ? u1 : uN;
    text = `${neg ? 'minus ' : ''}${words(whole)} ${unitW}${c ? ` and ${words(String(c))} ${c === 1 ? s1 : sN}` : ''}${$('#only').checked ? ' only' : ''}`;
    extra = `<p class="group-title">Cheque style</p><div class="copybox">${esc(caseIt(`${words(whole)} ${unitW} and ${String(c).padStart(2, '0')}/100${$('#only').checked ? ' only' : ''}`))}</div>`;
  } else if (mode === 'ordinal') {
    text = (neg ? 'minus ' : '') + ordinal(words(int));
    extra = `<p class="sub">Short form: <b>${group(int, sys)}${suffix(BigInt(int))}</b>${frac ? ' (decimals ignored)' : ''}</p>`;
  } else {
    text = (neg ? 'minus ' : '') + words(int) + (frac ? ' point ' + [...frac].map(d => ONES[+d]).join(' ') : '');
    if (!neg && !frac && int.length === 4 && +int >= 1100 && +int < 2000 + 100 && int[2] !== '0' && sys === 'intl') extra = `<p class="sub">As a year: <b>${caseIt(small(+int.slice(0, 2), false) + ' ' + small(+int.slice(2), false))}</b></p>`;
  }
  const final = caseIt(text);
  out.innerHTML = `<p class="kicker">${esc(group(int, sys))}${frac && mode !== 'ordinal' ? '.' + esc(frac) : ''} in words</p><div class="copybox" style="font-family:var(--f-body);font-size:18px;line-height:1.55">${esc(final)}</div>
    <div class="btns"><button type="button" class="btn" id="copy">Copy</button></div>${extra}`;
  $('#copy').onclick = e => copyText(final, e.currentTarget);
}
onAny('#n, input[name="mode"], #style, #sys, #cur, #case, #only', run);
run();
