onAny('input[name="mode"], #kw, #cap, #style, #sep', run);
const clean = s => s.normalize('NFKD').replace(/[̀-ͯ]/g, '');
function tag(phrase, style) {
  const words = clean(phrase).split(/[^\p{L}\p{N}_]+/u).filter(Boolean);
  if (!words.length) return '';
  return '#' + (style === 'camel' ? words.map(w => w[0].toUpperCase() + w.slice(1)).join('') : words.join('').toLowerCase());
}
function run() {
  const make = $('input[name="mode"]:checked').value === 'make', out = $('#out');
  $('#l-make').hidden = !make; $('#opts').hidden = !make; $('#l-count').hidden = make;
  if (make) {
    const seen = new Set(), tags = [];
    for (const p of $('#kw').value.split(/[\n,]+/)) { const t = tag(p.replace(/^#/, ''), $('#style').value); if (t && t.length > 1 && !seen.has(t.toLowerCase())) { seen.add(t.toLowerCase()); tags.push(t); } }
    if (!tags.length) { out.innerHTML = '<p class="empty">Type a few keywords about your post.</p>'; return; }
    const text = tags.join($('#sep').value);
    out.innerHTML = `<p class="kicker">${tags.length} hashtag${tags.length === 1 ? '' : 's'}</p><div class="copybox" id="tags" style="font-family:var(--f-body);font-size:17px">${esc(text)}</div>
      <div class="btns"><button type="button" class="btn" data-copy="tags">Copy hashtags</button></div>
      <p class="note">${text.length} characters. ${tags.length > 5 ? 'Most platforms now suggest 3–5 well-chosen hashtags rather than many; pick the most relevant.' : 'A handful of specific, relevant hashtags works best.'}</p>`;
  } else {
    const cap = $('#cap').value, found = cap.match(/#[\p{L}\p{N}_]+/gu) || [];
    const counts = {};
    found.forEach(t => { const k = t.toLowerCase(); counts[k] = (counts[k] || 0) + 1; });
    const dups = Object.entries(counts).filter(([, n]) => n > 1).map(([k]) => k);
    const broken = cap.match(/#[\p{L}\p{N}_]*[^\s\p{L}\p{N}_#][\p{L}\p{N}]+/gu) || [];
    const unique = Object.keys(counts).length, words = (cap.replace(/#\S+/gu, '').match(/[\p{L}\p{N}]+/gu) || []).length;
    out.innerHTML = `<p class="kicker">Hashtags in your caption</p><p class="huge" style="text-align:left"><mark>${found.length}</mark></p>
      <p class="sub">${unique} unique · ${[...cap].length} characters · ${words} words (not counting hashtags)</p>
      ${found.length ? `<div class="chips">${Object.keys(counts).map(k => `<span class="chip">${esc(found.find(t => t.toLowerCase() === k))}${counts[k] > 1 ? ` ×${counts[k]}` : ''}</span>`).join('')}</div>` : ''}
      ${dups.length ? `<p class="note"><strong>Repeated:</strong> ${dups.map(esc).join(', ')}. Repeating a hashtag doesn’t help; remove the extra copies.</p>` : ''}
      ${broken.length ? `<p class="note"><strong>Check these:</strong> ${broken.map(esc).join(', ')}. A hashtag stops at the first space or punctuation mark, so only part of it will link.</p>` : ''}
      ${found.some(t => /^#\d+$/.test(t)) ? '<p class="note">Hashtags made only of numbers (like #2026) don’t link on most platforms.</p>' : ''}
      <div class="btns"><button type="button" class="btn ghost" id="fix">Copy caption without duplicates</button></div>`;
    $('#fix').onclick = e => { const seen = new Set(); copyText(cap.replace(/#[\p{L}\p{N}_]+/gu, t => { const k = t.toLowerCase(); if (seen.has(k)) return ''; seen.add(k); return t; }).replace(/[ \t]{2,}/g, ' ').trim(), e.currentTarget); };
  }
}
run();
