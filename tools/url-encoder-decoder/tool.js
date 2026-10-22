onAny('input[name="mode"], #in, #kind', run);
let lastMode = 'enc';
function run() {
  const mode = $('input[name="mode"]:checked').value, inp = $('#in'), out = $('#out');
  if (mode !== lastMode) {
    if (mode === 'parse' && !/^https?:/i.test(inp.value)) inp.value = 'https://shop.example.com:8080/products/search?q=red%20shoes&size=42&sort=price_asc#reviews';
    if (mode === 'dec' && !/%[0-9a-f]{2}|\+/i.test(inp.value)) inp.value = 'caf%C3%A9%20%26%20croissants%3A%202%20for%20%E2%82%AC5%20%2F%20day%3F';
    lastMode = mode;
  }
  $('#l-in').textContent = { enc: 'Text to encode', dec: 'Encoded text to decode', parse: 'URL' }[mode];
  $('#enc-opts').hidden = mode !== 'enc';
  const v = inp.value;
  if (mode === 'enc') {
    const k = $('#kind').value;
    const r = k === 'uri' ? encodeURI(v) : k === 'form' ? encodeURIComponent(v).replace(/%20/g, '+') : encodeURIComponent(v);
    out.innerHTML = `<p class="kicker">Encoded</p><div class="copybox" id="res">${esc(r)}</div><div class="btns"><button type="button" class="btn" data-copy="res">Copy</button></div>
      <p class="note">${v.length} characters in, ${r.length} out.${k === 'comp' ? ' Every character with a special meaning in URLs (& = ? / # : +) is encoded, so it’s safe inside a query value.' : k === 'uri' ? ' Characters that structure a URL (: / ? & = #) are left alone; use this only on a full URL.' : ''}</p>`;
  } else if (mode === 'dec') {
    try {
      const r = decodeURIComponent(v.replace(/\+/g, ' '));
      out.innerHTML = `<p class="kicker">Decoded</p><div class="copybox" id="res">${esc(r)}</div><div class="btns"><button type="button" class="btn" data-copy="res">Copy</button></div>
        <p class="note">Plus signs were treated as spaces, as in form data. ${/%25[0-9a-f]{2}/i.test(v) ? 'This text looks double-encoded (it contains %25): decode it again.' : ''}</p>`;
    } catch (e) {
      out.innerHTML = `<p class="kicker">Decoded</p><span class="verdict no">Can’t decode</span><p class="sub">There’s a % sign that isn’t followed by a valid code, such as %2 or %ZZ. A literal % must be written as %25.</p>`;
    }
  } else {
    let u;
    try { u = new URL(v.trim()); } catch (e) { out.innerHTML = '<p class="kicker">URL parts</p><span class="verdict no">Not a full URL</span><p class="sub">Include the scheme, like https://example.com/page.</p>'; return; }
    const rows = [['Protocol', u.protocol], ['Host', u.hostname], ['Port', u.port || `(default${u.protocol === 'https:' ? ' 443' : u.protocol === 'http:' ? ' 80' : ''})`], ['Path', decodeURIComponent(u.pathname)], ['Query string', u.search], ['Fragment', u.hash], ['Origin', u.origin]];
    if (u.username) rows.splice(1, 0, ['User', u.username]);
    const params = [...u.searchParams];
    out.innerHTML = `<p class="kicker">URL parts</p><div class="scroll"><table class="tbl"><tbody>${rows.map(([k, x]) => `<tr><td>${k}</td><td class="mono">${esc(x || '–')}</td></tr>`).join('')}</tbody></table></div>
      ${params.length ? `<p class="kicker">Query parameters (${params.length})</p><div class="scroll"><table class="tbl"><thead><tr><th>Name</th><th>Value (decoded)</th></tr></thead><tbody>${params.map(([k, x]) => `<tr><td class="mono">${esc(k)}</td><td class="mono">${esc(x)}</td></tr>`).join('')}</tbody></table></div>` : ''}
      ${/^utm_/m.test(params.map(p => p[0]).join('\n')) ? `<p class="note">Without tracking parameters: <span class="mono">${esc((() => { const c = new URL(u); [...c.searchParams.keys()].filter(k => /^(utm_|fbclid|gclid)/.test(k)).forEach(k => c.searchParams.delete(k)); return c.toString(); })())}</span></p>` : ''}`;
  }
}
run();
