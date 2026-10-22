// Turn each line into an entry: the person is the part before ":" (or the first @handle / word).
function parse() {
  const kw = $('#kw').value.trim().toLowerCase(), tags = +$('#tags').value;
  const lines = $('#entries').value.split('\n').map(s => s.trim()).filter(Boolean);
  let entries = lines.map(l => {
    const m = l.match(/^([^:]{1,60}):\s*(.*)$/);
    const who = (m ? m[1] : (l.match(/^@?[\w.]+/) || [l])[0]).trim();
    const text = m ? m[2] : l.slice(who.length);
    return { who, key: who.toLowerCase().replace(/^@/, ''), text, mentions: (text.match(/@[\w.]+/g) || []).length };
  });
  const total = entries.length;
  const failed = { tags: 0, kw: 0, dup: 0 };
  entries = entries.filter(e => (e.mentions >= tags || (failed.tags++, false)) && (!kw || e.text.toLowerCase().includes(kw) || e.who.toLowerCase().includes(kw) || (failed.kw++, false)));
  if ($('#dedupe').checked) { const seen = new Set(); entries = entries.filter(e => (seen.has(e.key) ? (failed.dup++, false) : seen.add(e.key))); }
  return { entries, total, failed };
}
function summary() {
  const { entries, total, failed } = parse();
  $('#out').innerHTML = `<p class="kicker">Eligible entries</p><p class="big"><mark>${entries.length}</mark> of ${total}</p>
    <p class="note">${[failed.tags && `${failed.tags} didn’t tag enough friends`, failed.kw && `${failed.kw} missing the keyword`, failed.dup && `${failed.dup} duplicate${failed.dup > 1 ? 's' : ''} removed`].filter(Boolean).join(' · ') || 'All entries qualify.'}</p>`;
}
onAny('#entries, #tags, #kw, #dedupe', summary);
$('#draw').addEventListener('click', () => {
  const { entries } = parse(), n = Math.max(1, Math.round(val($('#n')) || 1)), alt = Math.max(0, Math.round(val($('#alt')) || 0));
  if (!entries.length) { $('#out').innerHTML = '<p class="empty">No eligible entries.</p>'; return; }
  // Fisher–Yates shuffle with the secure random generator, then take from the top.
  const pool = [...entries];
  for (let i = pool.length - 1; i > 0; i--) { const j = randInt(0, i); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const winners = pool.slice(0, n), backups = pool.slice(n, n + alt);
  const out = $('#out'), names = pool.map(e => e.who);
  let k = 0;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  out.innerHTML = '<p class="kicker">Drawing…</p><p class="huge" id="roll" style="font-size:clamp(28px,6vw,52px)"></p>';
  const spin = setInterval(() => { $('#roll').textContent = names[k++ % names.length]; }, 70);
  setTimeout(() => {
    clearInterval(spin);
    const when = new Date();
    const text = `Giveaway draw · ${when.toLocaleString()}\n${entries.length} eligible entries\nWinner${winners.length > 1 ? 's' : ''}: ${winners.map(w => w.who).join(', ')}${backups.length ? `\nBack-up: ${backups.map(w => w.who).join(', ')}` : ''}`;
    out.innerHTML = `<p class="kicker">Winner${winners.length > 1 ? 's' : ''} 🎉</p>${winners.map(w => `<p class="big"><mark>${esc(w.who)}</mark></p><p class="note">“${esc(w.text.trim().slice(0, 120))}”</p>`).join('')}
      ${backups.length ? `<p class="kicker" style="margin-top:8px">Back-up winners</p><p>${backups.map(b => esc(b.who)).join(', ')}</p>` : ''}
      <div class="copybox" id="proof">${esc(text)}</div>
      <div class="copyrow"><button type="button" class="btn ghost" data-copy="proof">Copy result</button><button type="button" class="btn" id="again">Draw again</button></div>`;
    $('#again').onclick = () => $('#draw').click();
  }, reduce ? 50 : 2200);
});
summary();
