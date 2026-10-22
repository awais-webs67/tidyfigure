const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789', symbols: '!@#$%^&*()-_=+[]{};:,.?/~',
};
const SIMILAR = /[0Ol1I|]/g;
let list = [];

onAny('#len, #upper, #lower, #digits, #symbols, #similar, #count', generate);
$('#again').addEventListener('click', generate);
$('#out').addEventListener('click', e => {
  const b = e.target.closest('button[data-i]');
  if (b) copyText(list[+b.dataset.i], b);
});

function one(len, groups) {
  // One character from every chosen group first, so each rule is always met, then shuffle.
  const all = groups.join('');
  const chars = groups.map(g => g[randInt(0, g.length - 1)]);
  while (chars.length < len) chars.push(all[randInt(0, all.length - 1)]);
  for (let i = chars.length - 1; i > 0; i--) { const j = randInt(0, i); [chars[i], chars[j]] = [chars[j], chars[i]]; }
  return chars.join('');
}

function strength(bits) {
  if (bits < 40) return ['Weak', 'no', 'Could be cracked in minutes to hours.'];
  if (bits < 60) return ['Fair', 'tight', 'Fine for low-value accounts only.'];
  if (bits < 80) return ['Strong', 'ok', 'Would take an attacker years with today’s hardware.'];
  return ['Very strong', 'ok', 'Effectively impossible to guess by brute force.'];
}

function generate() {
  const len = +$('#len').value;
  $('#lv').textContent = len;
  const avoid = $('#similar').checked;
  const groups = Object.keys(SETS).filter(k => $('#' + k).checked).map(k => (avoid ? SETS[k].replace(SIMILAR, '') : SETS[k]));
  const out = $('#out');
  if (!groups.length) { out.innerHTML = '<p class="empty">Tick at least one type of character.</p>'; return; }
  const pool = groups.join('').length;
  const bits = len * Math.log2(pool);
  const [label, cls, note] = strength(bits);
  list = Array.from({ length: +$('#count').value }, () => one(Math.max(len, groups.length), groups));
  out.innerHTML = `<p class="kicker">Your passwords</p><span class="verdict ${cls}">${label} · ${Math.round(bits)} bits</span><p class="sub">${note}</p>
    <ul class="files">${list.map((p, i) => `<li><span class="meta"><b style="font-family:var(--f-num);font-weight:500;white-space:normal;overflow-wrap:anywhere">${esc(p)}</b></span><button type="button" class="btn ghost" data-i="${i}">Copy</button></li>`).join('')}</ul>
    <p class="note">Made with your browser’s secure random generator. They’re never sent or stored anywhere.</p>`;
}
generate();
