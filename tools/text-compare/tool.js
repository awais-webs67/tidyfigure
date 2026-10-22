onAny('#a, #b, #mode, #ws, #case', run);
$('#swap').onclick = () => { const t = $('#a').value; $('#a').value = $('#b').value; $('#b').value = t; run(); };
$('#clear').onclick = () => { $('#a').value = ''; $('#b').value = ''; run(); };

// Longest-common-subsequence diff of two token arrays. Returns [op, token] with op ' ', '-' or '+'.
function lcsDiff(a, b, eq) {
  let s = 0, ea = a.length, eb = b.length;
  while (s < ea && s < eb && eq(a[s], b[s])) s++;
  while (ea > s && eb > s && eq(a[ea - 1], b[eb - 1])) { ea--; eb--; }
  const A = a.slice(s, ea), B = b.slice(s, eb), n = A.length, m = B.length;
  const head = a.slice(0, s).map(t => [' ', t]), tail = a.slice(ea).map(t => [' ', t]);
  if ((n + 1) * (m + 1) > 16e6) return null; // too big for the table
  const T = new Uint16Array((n + 1) * (m + 1)), W = m + 1;
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) T[i * W + j] = eq(A[i], B[j]) ? T[(i + 1) * W + j + 1] + 1 : Math.max(T[(i + 1) * W + j], T[i * W + j + 1]);
  const ops = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (eq(A[i], B[j])) { ops.push([' ', B[j]]); i++; j++; }
    else if (T[(i + 1) * W + j] >= T[i * W + j + 1]) ops.push(['-', A[i++]]);
    else ops.push(['+', B[j++]]);
  }
  while (i < n) ops.push(['-', A[i++]]);
  while (j < m) ops.push(['+', B[j++]]);
  return head.concat(ops, tail);
}
const tokens = (s, mode) => mode === 'char' ? [...s] : mode === 'line' ? s.split(/(?<=\n)/) : s.match(/\s+|[\p{L}\p{N}’'_-]+|[^\s\p{L}\p{N}]/gu) || [];

function run() {
  const mode = $('#mode').value, out = $('#out');
  const norm = t => { let x = t; if ($('#ws').checked) x = x.replace(/[ \t]+/g, ' ').replace(/ ?\n ?/g, '\n').trim(); if ($('#case').checked) x = x.toLowerCase(); return x; };
  const eq = (x, y) => norm(x) === norm(y);
  const a = $('#a').value, b = $('#b').value;
  if (!a && !b) { out.innerHTML = '<p class="empty">Paste two versions of a text to see what changed.</p>'; return; }
  let ops;
  if (mode === 'line') ops = lcsDiff(tokens(a, 'line'), tokens(b, 'line'), eq);
  else {
    // Diff lines first, then re-diff each changed block by words or characters. Fast even on long documents.
    const lines = lcsDiff(tokens(a, 'line'), tokens(b, 'line'), eq);
    if (lines) {
      ops = [];
      for (let k = 0; k < lines.length;) {
        if (lines[k][0] === ' ') { ops.push(lines[k++]); continue; }
        let del = '', ins = '';
        while (k < lines.length && lines[k][0] !== ' ') { if (lines[k][0] === '-') del += lines[k][1]; else ins += lines[k][1]; k++; }
        const inner = lcsDiff(tokens(del, mode), tokens(ins, mode), eq) || [['-', del], ['+', ins]];
        ops.push(...inner);
      }
    }
  }
  if (!ops) { out.innerHTML = '<p class="kicker">Differences</p><span class="verdict no">Too large</span><p class="sub">These texts are too long and too different to compare here. Try comparing by whole lines, or a smaller section.</p>'; return; }
  const words = s => (s.match(/[\p{L}\p{N}]+/gu) || []).length;
  const count = t => (mode === 'line' ? 1 : mode === 'char' ? t.replace(/\s/g, '').length : words(t));
  // Merge runs of the same kind so a changed phrase is one highlight, not one per word.
  const runs = [];
  for (const [op, t] of ops) { const last = runs[runs.length - 1]; if (last && last[0] === op) last[1] += t; else runs.push([op, t]); }
  let added = 0, removed = 0, same = 0, html = '';
  for (const [op, t] of runs) {
    if (op === '+') { added += count(t); html += `<ins>${esc(t)}</ins>`; }
    else if (op === '-') { removed += count(t); html += `<del>${esc(t)}</del>`; }
    else { same += count(t); html += esc(t); }
  }
  const unit = mode === 'line' ? 'line' : mode === 'char' ? 'character' : 'word';
  const sim = same + Math.max(added, removed) ? same / (same + Math.max(added, removed)) * 100 : 100;
  out.innerHTML = `<p class="kicker">${runs.some(r => r[0] !== ' ') ? 'Differences' : 'No differences'}</p>
    ${runs.some(r => r[0] !== ' ') ? '' : '<span class="verdict ok">The texts are identical</span>'}
    <div class="statgrid"><div class="stat"><b style="color:var(--good)">+${added}</b><span>${unit}s added</span></div><div class="stat"><b style="color:var(--bad)">−${removed}</b><span>${unit}s removed</span></div><div class="stat"><b>${fmtMax(sim, 0)}%</b><span>Similar</span></div></div>
    <div class="diff" id="diff">${html}</div>
    <p class="note"><del>Struck-through red</del> was removed from the original; <ins>green</ins> was added.</p>`;
}
run();
