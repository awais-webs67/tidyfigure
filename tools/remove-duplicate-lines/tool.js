onAny('#text, #ci, #trim, #empty, #sort', calc);

function calc() {
  const ci = $('#ci').checked, trim = $('#trim').checked, dropEmpty = $('#empty').checked;
  const lines = $('#text').value.split(/\r?\n/);
  const seen = new Map(); // key → count
  const kept = [];
  let empties = 0;
  for (const raw of lines) {
    const line = trim ? raw.trim() : raw;
    if (!line.trim()) { if (dropEmpty) { empties++; continue; } }
    const key = ci ? line.toLowerCase() : line;
    if (seen.has(key)) { seen.set(key, seen.get(key) + 1); continue; }
    seen.set(key, 1);
    kept.push(line);
  }
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  const sort = $('#sort').value;
  if (sort === 'az') kept.sort(collator.compare);
  if (sort === 'za') kept.sort((a, b) => collator.compare(b, a));
  if (sort === 'num') kept.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0) || collator.compare(a, b));
  if (sort === 'len') kept.sort((a, b) => a.length - b.length || collator.compare(a, b));
  const removed = [...seen.values()].reduce((s, n) => s + n - 1, 0);
  const dupes = [...seen.entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]).slice(0, 5);

  $('#out').innerHTML = `<p class="kicker">Unique lines</p><p class="big"><mark>${kept.length.toLocaleString()}</mark></p>
    <p class="sub">${removed.toLocaleString()} duplicate${removed === 1 ? '' : 's'} removed${empties ? ` and ${empties} empty line${empties === 1 ? '' : 's'}` : ''}, from ${lines.length.toLocaleString()} lines.</p>
    <div class="copybox" id="result">${esc(kept.join('\n'))}</div>
    <div class="copyrow"><button type="button" class="btn" data-copy="result">Copy</button></div>
    ${dupes.length ? `<p class="note">Most repeated: ${dupes.map(([k, n]) => `<strong>${esc(k.length > 40 ? k.slice(0, 40) + '…' : k)}</strong> (${n}×)`).join(', ')}</p>` : ''}`;
}
calc();
