onAny('#re, #flags, #text, #rep', run);
$('#lib').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) { $('#re').value = b.dataset.r; $('#flags').value = b.dataset.f; run(); } });
function run() {
  const src = $('#re').value, text = $('#text').value, out = $('#out');
  let flags = [...new Set($('#flags').value.replace(/[^dgimsuyv]/g, ''))].join('');
  if (!src) { out.innerHTML = '<p class="empty">Type a regular expression.</p>'; return; }
  let re;
  try { re = new RegExp(src, flags.includes('g') ? flags : flags + 'g'); }
  catch (e) { out.innerHTML = `<p class="kicker">Matches</p><span class="verdict no">Invalid pattern</span><p class="sub mono">${esc(e.message)}</p>`; return; }
  const matches = [];
  let m, guard = 0;
  while ((m = re.exec(text)) && guard++ < 5000) {
    matches.push(m);
    if (m[0] === '') re.lastIndex++;
    if (!flags.includes('g')) break;
  }
  let hl = '', last = 0;
  for (const x of matches) { hl += esc(text.slice(last, x.index)) + `<mark>${esc(x[0]) || '<small>∅</small>'}</mark>`; last = x.index + x[0].length; }
  hl += esc(text.slice(last));
  const rep = $('#rep').value;
  let replaced = null;
  if (rep) { try { replaced = text.replace(new RegExp(src, flags), rep); } catch (e) { replaced = null; } }
  const groups = matches.length ? matches[0].length - 1 : 0;
  out.innerHTML = `<p class="kicker">${matches.length} match${matches.length === 1 ? '' : 'es'}${flags.includes('g') ? '' : ' (first only: add the g flag for all)'}</p>
    <div class="copybox hl">${hl}</div>
    ${matches.length ? `<div class="scroll"><table class="tbl"><thead><tr><th class="n">#</th><th>Match</th><th class="n">At</th>${Array.from({ length: Math.min(groups, 6) }, (x, i) => `<th>Group ${i + 1}</th>`).join('')}</tr></thead><tbody>
      ${matches.slice(0, 200).map((x, i) => `<tr><td class="n">${i + 1}</td><td class="mono">${esc(x[0])}</td><td class="n">${x.index}</td>${Array.from({ length: Math.min(groups, 6) }, (y, g) => `<td class="mono">${x[g + 1] === undefined ? '<small>–</small>' : esc(x[g + 1])}</td>`).join('')}</tr>`).join('')}
    </tbody></table></div>` : ''}
    ${replaced !== null ? `<p class="kicker">After replace</p><div class="copybox" id="rep-out">${esc(replaced)}</div><div class="btns"><button type="button" class="btn ghost" data-copy="rep-out">Copy</button></div>` : ''}`;
}
run();
