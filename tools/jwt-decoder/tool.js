onAny('#tok, #secret', run);
const b64d = s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); s += '='.repeat((4 - s.length % 4) % 4); const bin = atob(s); return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0))); };
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const pretty = o => esc(JSON.stringify(o, null, 2));
const when = s => new Date(s * 1000).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'long' });
const ago = s => { const d = Math.round(s - Date.now() / 1000), a = Math.abs(d); const t = a < 120 ? `${a} s` : a < 7200 ? `${Math.round(a / 60)} min` : a < 172800 ? `${Math.round(a / 3600)} h` : `${Math.round(a / 86400)} days`; return d >= 0 ? `in ${t}` : `${t} ago`; };
let job = 0;
async function run() {
  const id = ++job, tok = $('#tok').value.trim().replace(/^Bearer\s+/i, ''), out = $('#out');
  const parts = tok.split('.');
  if (parts.length !== 3) { out.innerHTML = `<p class="kicker">Decoded</p><span class="verdict no">Not a JWT</span><p class="sub">A JWT has three parts separated by dots: header.payload.signature.${parts.length === 5 ? ' This one has five parts, so it’s probably an encrypted JWE, which can’t be read without the key.' : ''}</p>`; return; }
  let h, p;
  try { h = JSON.parse(b64d(parts[0])); p = JSON.parse(b64d(parts[1])); }
  catch (e) { out.innerHTML = '<p class="kicker">Decoded</p><span class="verdict no">Can’t decode</span><p class="sub">The header or payload isn’t valid Base64URL-encoded JSON.</p>'; return; }
  const now = Date.now() / 1000, claims = [];
  if (ok(p.exp)) claims.push(['exp (expires)', `${when(p.exp)} · ${ago(p.exp)}`]);
  if (ok(p.iat)) claims.push(['iat (issued)', `${when(p.iat)} · ${ago(p.iat)}`]);
  if (ok(p.nbf)) claims.push(['nbf (not before)', `${when(p.nbf)} · ${ago(p.nbf)}`]);
  ['iss', 'sub', 'aud', 'jti'].forEach(k => { if (p[k] !== undefined) claims.push([k, Array.isArray(p[k]) ? p[k].join(', ') : String(p[k])]); });
  const status = ok(p.exp) && p.exp < now ? '<span class="verdict no">Expired</span>' : ok(p.nbf) && p.nbf > now ? '<span class="verdict tight">Not valid yet</span>' : ok(p.exp) ? '<span class="verdict ok">Not expired</span>' : '<span class="verdict tight">No expiry set</span>';
  let sig = '<p class="note">Signature not checked. Enter the secret above to verify an HMAC (HS256/384/512) token. RSA and ECDSA tokens (RS256, ES256) need the issuer’s public key.</p>';
  const secret = $('#secret').value;
  if (secret && /^HS(256|384|512)$/.test(h.alg)) {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-' + h.alg.slice(2) }, false, ['sign']);
    const good = b64u(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(parts[0] + '.' + parts[1]))) === parts[2];
    sig = good ? '<span class="verdict ok">Signature verified</span><p class="sub">The token was signed with this secret and hasn’t been changed.</p>' : '<span class="verdict no">Invalid signature</span><p class="sub">Wrong secret, or the token was modified after signing.</p>';
  } else if (h.alg === 'none') sig = '<span class="verdict no">Unsigned token (alg: none)</span><p class="sub">Anyone can create or change this token. Servers should reject it.</p>';
  if (id !== job) return;
  out.innerHTML = `<p class="kicker">Status</p>${status}
    ${claims.length ? `<div class="scroll"><table class="tbl"><tbody>${claims.map(([k, v]) => `<tr><td class="mono">${k}</td><td>${esc(v)}</td></tr>`).join('')}</tbody></table></div>` : ''}
    <p class="kicker">Header · ${esc(h.alg || '?')}</p><div class="copybox" id="hd">${pretty(h)}</div>
    <p class="kicker">Payload</p><div class="copybox" id="pl">${pretty(p)}</div><div class="btns"><button type="button" class="btn ghost" data-copy="pl">Copy payload</button></div>
    <p class="kicker">Signature</p>${sig}`;
}
// Sign the sample so it verifies with the documented secret, with times around now.
(async () => {
  const enc = o => b64u(new TextEncoder().encode(JSON.stringify(o)));
  const now = Math.floor(Date.now() / 1000), head = enc({ alg: 'HS256', typ: 'JWT' }), body = enc({ sub: '1234567890', name: 'Jane Doe', role: 'editor', iat: now - 600, exp: now + 3000 });
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode('my-secret-key'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  $('#tok').value = `${head}.${body}.${b64u(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(head + '.' + body)))}`;
  $('#secret').placeholder = 'Try: my-secret-key';
  run();
})();
