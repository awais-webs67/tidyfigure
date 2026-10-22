const UNI = { '¼': 1 / 4, '½': 1 / 2, '¾': 3 / 4, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': 1 / 8, '⅜': 3 / 8, '⅝': 5 / 8, '⅞': 7 / 8 };
const Q = '(?:\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+(?:[.,]\\d+)?(?:\\s*[¼½¾⅓⅔⅛⅜⅝⅞])?|[¼½¾⅓⅔⅛⅜⅝⅞])';
const LINE = new RegExp(`^(\\s*[-*•]?\\s*)(${Q})(?:\\s*(?:-|–|to)\\s*(${Q}))?(.*)$`);
// Spoon and cup sizes in teaspoons, so they can be swapped for easier ones.
const SPOON = { tsp: 1, tbsp: 3, cup: 48 };
const UNIT_RE = [
  [/^\s*(cups?|c\.)(?=\s|$)/i, 'cup'],
  [/^\s*(tablespoons?|tbsps?|tbs)\b/i, 'tbsp'], [/^\s*(T)\b/, 'tbsp'],
  [/^\s*(teaspoons?|tsps?)\b/i, 'tsp'], [/^\s*(t)\b/, 'tsp'],
  [/^\s*(kilograms?|kgs?)\b/i, 'kg'], [/^\s*(grams?|g)\b/i, 'g'],
  [/^\s*(millilit(?:er|re)s?|ml)\b/i, 'ml'], [/^\s*(lit(?:er|re)s?|l)\b/i, 'l'],
  [/^\s*(ounces?|oz)\b/i, 'oz'], [/^\s*(pounds?|lbs?)\b/i, 'lb'],
];
const FRACS = [[0, ''], [1 / 8, '⅛'], [1 / 4, '¼'], [1 / 3, '⅓'], [3 / 8, '⅜'], [1 / 2, '½'], [5 / 8, '⅝'], [2 / 3, '⅔'], [3 / 4, '¾'], [7 / 8, '⅞'], [1, '']];

function parseQty(s) {
  s = s.trim();
  let total = 0;
  const last = s.slice(-1);
  if (UNI[last] !== undefined) { total += UNI[last]; s = s.slice(0, -1).trim(); }
  if (!s) return total;
  s.split(/\s+/).forEach(part => {
    if (part.includes('/')) { const [a, b] = part.split('/').map(Number); total += b ? a / b : 0; } else total += parseFloat(part.replace(',', '.')) || 0;
  });
  return total;
}

// Kitchen-friendly number: nearest ⅛ or ⅓ for spoons and cups, sensible rounding for grams and millilitres.
function pretty(x, unit) {
  if (unit === 'g' || unit === 'ml') {
    if (x < 10) return fmtMax(Math.round(x * 2) / 2, 1);
    if (x < 100) return fmtMax(Math.round(x), 0);
    return fmtMax(Math.round(x / 5) * 5, 0);
  }
  if (unit === 'kg' || unit === 'l') return fmtMax(x, 2);
  const whole = Math.floor(x);
  const [f, glyph] = FRACS.reduce((a, b) => (Math.abs(b[0] - (x - whole)) < Math.abs(a[0] - (x - whole)) ? b : a));
  const w = whole + (f === 1 ? 1 : 0);
  if (!w && !glyph) return fmtMax(x, 2);
  return (w ? String(w) : '') + glyph;
}

function easier(amount, unit) {
  if (!(unit in SPOON)) return [amount, unit];
  const tsp = amount * SPOON[unit];
  if (unit === 'cup' && tsp >= 12) return [amount, unit]; // ¼ cup or more stays in cups
  if (tsp < 3) return [tsp, 'tsp'];
  if (tsp < 12) return [tsp / 3, 'tbsp'];
  // Only move up to cups when it lands close to a cup measure (4½ tbsp is easier than "about ¼ cup").
  const cups = tsp / 48, whole = Math.floor(cups);
  const nearest = FRACS.reduce((a, b) => (Math.abs(b[0] - (cups - whole)) < Math.abs(a[0] - (cups - whole)) ? b : a))[0];
  return Math.abs(whole + nearest - cups) / cups < 0.03 ? [cups, 'cup'] : [tsp / 3, 'tbsp'];
}
const unitWord = (u, n) => (u === 'cup' ? (n > 1 ? 'cups' : 'cup') : u === 'l' ? 'L' : u);

onAny('#from, #to, #recipe, #smart', calc);

function calc() {
  const from = val($('#from')), to = val($('#to'));
  const out = $('#out');
  if (!(from > 0 && to > 0)) { out.innerHTML = '<p class="empty">Enter how many the recipe serves and how many you want to serve.</p>'; return; }
  const k = to / from;
  const smart = $('#smart').checked;
  let changed = 0;

  const lines = $('#recipe').value.split('\n').map(line => {
    const m = line.match(LINE);
    if (!m || !line.trim()) return esc(line);
    const [, lead, q1, q2, restRaw] = m;
    let rest = restRaw;
    let unit = null;
    for (const [re, u] of UNIT_RE) {
      const um = rest.match(re);
      if (um) { unit = u; rest = rest.slice(um[0].length); break; }
    }
    let a = parseQty(q1) * k;
    let b = q2 ? parseQty(q2) * k : null;
    let u = unit;
    if (smart && unit) {
      const [na, nu] = easier(a, unit);
      if (b !== null) b = b * (na / a);
      a = na; u = nu;
    }
    changed++;
    const qty = pretty(a, u) + (b !== null ? '–' + pretty(b, u) : '');
    const unitTxt = u ? ' ' + unitWord(u, b ?? a) : '';
    let tip = '';
    if (!unit && /\beggs?\b/i.test(rest) && Math.abs(a - Math.round(a)) > 0.12) {
      const whole = Math.ceil(a);
      tip = ` <small>(beat ${whole} egg${whole > 1 ? 's' : ''} and use ${pretty(a / whole, null)} of the mix)</small>`;
    }
    return `${esc(lead)}<mark>${esc(qty)}${esc(unitTxt)}</mark>${esc(unit ? rest : rest)}${tip}`;
  });

  out.innerHTML = `<p class="kicker">Scaled recipe</p><p class="big"><mark>× ${fmtMax(k, 2)}</mark></p>
    <p class="sub">From ${fmtMax(from, 2)} to ${fmtMax(to, 2)} servings. ${changed} ingredient${changed === 1 ? '' : 's'} adjusted.</p>
    <div class="copybox" id="scaled">${lines.join('\n')}</div>
    <div class="copyrow"><button type="button" class="btn ghost" data-copy="scaled">Copy</button></div>`;
}
calc();
