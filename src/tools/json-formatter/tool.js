let minify = false;
$('#fmt-btn').addEventListener('click', () => { minify = false; run(); });
$('#min-btn').addEventListener('click', () => { minify = true; run(); });
onAny('#src, #indent, #sortkeys', run);

const sortKeys = v => Array.isArray(v) ? v.map(sortKeys)
  : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, sortKeys(v[k])])) : v;

// Turn "at position 42" into a line and column the user can find.
function where(text, msg) {
  const m = msg.match(/position (\d+)/) || msg.match(/column (\d+)/);
  let pos = m ? +m[1] : -1;
  const lc = msg.match(/line (\d+) column (\d+)/);
  if (lc) return { line: +lc[1], col: +lc[2] };
  if (pos < 0) return null;
  const before = text.slice(0, pos).split('\n');
  return { line: before.length, col: before[before.length - 1].length + 1, pos };
}

// Colour keys, strings, numbers and literals for easier reading.
const highlight = s => esc(s).replace(/(&quot;(?:[^&]|&(?!quot;))*?&quot;)(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
  (m, str, colon, lit, num) => str ? `<span style="color:${colon ? 'var(--c-convert)' : 'var(--c-calc)'}">${str}</span>${colon || ''}` : lit ? `<span style="color:var(--c-pdf)">${lit}</span>` : `<span style="color:var(--c-random)">${num}</span>`);

function run() {
  const text = $('#src').value;
  const out = $('#out');
  if (!text.trim()) { out.innerHTML = '<p class="empty">Paste some JSON to format and check it.</p>'; return; }
  let data;
  try { data = JSON.parse(text); } catch (e) {
    const w = where(text, e.message);
    let hint = '';
    if (/'/.test(text) && !/"/.test(text)) hint = 'JSON needs double quotes ("), not single quotes.';
    else if (/,\s*[}\]]/.test(text)) hint = 'Look for a comma before a closing } or ]. JSON doesn’t allow trailing commas.';
    else if (/[{,]\s*[A-Za-z_]\w*\s*:/.test(text)) hint = 'Keys must be in double quotes, like "name": rather than name:.';
    const lineText = w ? text.split('\n')[w.line - 1] : '';
    out.innerHTML = `<span class="verdict no">Invalid JSON</span><p class="sub">${esc(e.message)}</p>
      ${w ? `<p class="note">Line ${w.line}, column ${w.col}:</p><div class="copybox">${esc(lineText.slice(Math.max(0, w.col - 40), w.col + 40))}</div>` : ''}
      ${hint ? `<p class="note"><strong>Tip:</strong> ${hint}</p>` : ''}`;
    return;
  }
  if ($('#sortkeys').checked) data = sortKeys(data);
  const ind = $('#indent').value === 'tab' ? '\t' : +$('#indent').value;
  const result = minify ? JSON.stringify(data) : JSON.stringify(data, null, ind);
  const count = v => (v && typeof v === 'object' ? Object.values(v).reduce((s, x) => s + count(x), 1) : 1);
  out.innerHTML = `<span class="verdict ok">Valid JSON</span><p class="sub">${minify ? 'Minified' : 'Formatted'} · ${result.length.toLocaleString()} characters · ${count(data).toLocaleString()} values</p>
    <div class="copybox" id="result" style="white-space:pre;overflow-x:auto;overflow-wrap:normal">${highlight(result)}</div>
    <div class="copyrow"><button type="button" class="btn ghost" id="dl">Download .json</button><button type="button" class="btn" data-copy="result">Copy</button></div>`;
  $('#dl').onclick = () => download(new Blob([result], { type: 'application/json' }), 'formatted.json');
}
run();
