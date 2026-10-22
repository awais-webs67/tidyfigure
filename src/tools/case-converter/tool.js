// Short words that stay lower case in titles (unless first or last), per common style guides.
const SMALL = new Set('a an and as at but by en for if in nor of on or per the to v vs via with'.split(' '));
let mode = 'title';

const words = s => s.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const cap = w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

const CASES = {
  sentence: s => s.toLowerCase().replace(/(^\s*|[.!?]\s+|\n\s*)(\p{L})/gu, (m, a, b) => a + b.toUpperCase()).replace(/\bi\b/g, 'I'),
  lower: s => s.toLowerCase(),
  upper: s => s.toUpperCase(),
  title: s => s.split('\n').map(line => {
    const parts = line.toLowerCase().split(/(\s+)/);
    const idx = parts.map((p, i) => (/\S/.test(p) ? i : -1)).filter(i => i >= 0);
    return parts.map((p, i) => {
      if (!/\S/.test(p)) return p;
      const first = i === idx[0], last = i === idx[idx.length - 1];
      const core = p.replace(/^[^\p{L}\p{N}]+/u, '');
      const after = i > 0 && /[:—–-]$/.test(parts[i - 2] || '');
      if (!first && !last && !after && SMALL.has(core.replace(/[^\p{L}]/gu, ''))) return p;
      return p.replace(/\p{L}/u, ch => ch.toUpperCase());
    }).join('');
  }).join('\n'),
  capital: s => s.toLowerCase().replace(/(^|[\s\-(“"'])(\p{L})/gu, (m, a, b) => a + b.toUpperCase()),
  camel: s => s.split('\n').map(l => words(l).map((w, i) => (i ? cap(w) : w.toLowerCase())).join('')).join('\n'),
  pascal: s => s.split('\n').map(l => words(l).map(cap).join('')).join('\n'),
  snake: s => s.split('\n').map(l => words(l).map(w => w.toLowerCase()).join('_')).join('\n'),
  kebab: s => s.split('\n').map(l => words(l).map(w => w.toLowerCase()).join('-')).join('\n'),
  constant: s => s.split('\n').map(l => words(l).map(w => w.toUpperCase()).join('_')).join('\n'),
  alternating: s => { let k = 0; return [...s].map(ch => (/\p{L}/u.test(ch) ? (k++ % 2 ? ch.toUpperCase() : ch.toLowerCase()) : ch)).join(''); },
  inverse: s => [...s].map(ch => (ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase())).join(''),
};

$('#cases').addEventListener('click', e => {
  const b = e.target.closest('.chip');
  if (!b) return;
  mode = b.dataset.c;
  $$('#cases .chip').forEach(c => c.classList.toggle('on', c === b));
  $('#label').textContent = b.textContent;
  calc();
});
$('#text').addEventListener('input', calc);
$('#use').addEventListener('click', () => { $('#text').value = $('#result').textContent; calc(); });

function calc() { $('#result').textContent = CASES[mode]($('#text').value); }
calc();
