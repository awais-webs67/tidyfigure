let timer = null, current = null;
const out = $('#out');
const compact = n => n >= 1e9 ? fmtMax(n / 1e9, 2) + 'B' : n >= 1e6 ? fmtMax(n / 1e6, 2) + 'M' : n >= 1e3 ? fmtMax(n / 1e3, 1) + 'K' : String(n);

// Count up smoothly from the old number to the new one.
function animate(el, from, to) {
  const t0 = performance.now(), d = 900;
  const step = now => { const k = Math.min(1, (now - t0) / d); el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))).toLocaleString(); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

async function load(q, quiet) {
  try {
    const r = await fetch((window.TF_BASE || '') + '/api/youtube.php?channel=' + encodeURIComponent(q), { cache: 'no-store' });
    const d = await r.json();
    if (!r.ok || d.error) throw new Error(d.error || 'Lookup failed.');
    const first = !current || current.id !== d.id;
    if (first) {
      out.innerHTML = `${d.thumb ? `<img src="${esc(d.thumb)}" alt="" width="88" height="88" style="border-radius:50%">` : ''}
        <p class="big">${esc(d.title)}</p><p class="sub">${esc(d.handle || '')}</p>
        <p class="kicker" style="margin-top:8px">Subscribers</p><p class="huge" id="subs">${d.hidden ? 'Hidden' : '0'}</p>
        <div class="statgrid" style="width:100%;max-width:520px"><div class="stat"><b>${compact(d.views)}</b><span>Total views</span></div><div class="stat"><b>${d.videos.toLocaleString()}</b><span>Videos</span></div><div class="stat"><b id="upd">now</b><span>Last updated</span></div></div>
        <p class="note">Updates every 60 seconds. YouTube’s public API rounds subscriber counts (for example 1,230,000), so every honest “live” counter shows the same rounded figure.</p>
        <a class="btn ghost" href="https://www.youtube.com/channel/${esc(d.id)}" target="_blank" rel="noopener">Open channel on YouTube</a>`;
    }
    if (!d.hidden) animate($('#subs'), first ? 0 : current.subs, d.subs);
    $('#upd').textContent = new Date(d.time * 1000).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit' });
    current = d;
    try { history.replaceState(null, '', '?c=' + encodeURIComponent(q)); } catch (e) { /* not allowed in some previews */ }
  } catch (e) {
    if (quiet) return;
    const offline = location.protocol === 'file:' || e instanceof TypeError || e instanceof SyntaxError;
    out.innerHTML = `<p class="empty">${offline ? 'The live counter needs the site’s server (the PHP version with a YouTube API key set in the admin panel).' : esc(e.message)}</p>`;
  }
}
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  clearInterval(timer); current = null;
  const q = $('#ch').value.trim();
  if (!q) return;
  out.innerHTML = '<p class="empty">Loading…</p>';
  load(q);
  timer = setInterval(() => load(q, true), 60000);
});
const start = new URLSearchParams(location.search).get('c');
if (start) { $('#ch').value = start; $('#form').requestSubmit(); }
