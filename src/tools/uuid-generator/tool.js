const hex = b => [...b].map(x => x.toString(16).padStart(2, '0')).join('');
function v4() { const b = crypto.getRandomValues(new Uint8Array(16)); b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80; return b; }
let lastMs = 0, seq = 0;
function v7() {
  const b = crypto.getRandomValues(new Uint8Array(16));
  let ms = Date.now();
  // Keep IDs from the same millisecond in order by bumping a counter in rand_a.
  if (ms <= lastMs) { seq++; ms = lastMs; } else { seq = 0; lastMs = ms; }
  for (let i = 5; i >= 0; i--) { b[i] = ms % 256; ms = Math.floor(ms / 256); }
  b[6] = 0x70 | ((seq >> 8) & 0x0f); b[7] = seq & 0xff;
  b[8] = (b[8] & 0x3f) | 0x80;
  return b;
}
const fmtId = b => { const h = hex(b), s = `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`, f = $('#fmt').value; return f === 'upper' ? s.toUpperCase() : f === 'nodash' ? h : f === 'braces' ? `{${s}}` : s; };
function gen() {
  const n = Math.min(1000, Math.max(1, Math.round(val($('#n')) || 1))), ver = $('input[name="ver"]:checked').value;
  const ids = Array.from({ length: n }, () => fmtId(ver === '7' ? v7() : v4()));
  $('#out').innerHTML = `<p class="kicker">${n} UUID${n > 1 ? 's' : ''} (version ${ver})</p><div class="copybox" id="ids">${ids.join('\n')}</div>
    <div class="btns"><button type="button" class="btn" data-copy="ids">Copy</button><button type="button" class="btn ghost" id="dl">Download .txt</button></div>`;
  $('#dl').onclick = () => download(new Blob([ids.join('\n') + '\n'], { type: 'text/plain' }), `uuids-v${ver}.txt`);
}
$('#go').onclick = gen;
onAny('input[name="ver"], #n, #fmt', gen);
$('#check').addEventListener('input', () => {
  const s = $('#check').value.trim().replace(/[{}]/g, ''), o = $('#check-out');
  const m = s.match(/^([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})$/i);
  if (!s) { o.textContent = ''; return; }
  if (!m) { o.innerHTML = '<strong>Not a valid UUID.</strong> A UUID has 32 hexadecimal digits, usually grouped 8-4-4-4-12.'; return; }
  const ver = parseInt(m[3][0], 16), variant = parseInt(m[4][0], 16);
  let extra = '';
  if (ver === 7 || ver === 1 || ver === 6) {
    if (ver === 7) extra = ` Created ${new Date(parseInt(m[1] + m[2], 16)).toISOString().replace('T', ' ').replace('Z', ' UTC')}.`;
  }
  o.innerHTML = /^0+$/.test(m.slice(1).join('')) ? 'This is the <strong>nil UUID</strong> (all zeros).' : `Valid UUID, <strong>version ${ver}</strong>${variant >= 8 && variant <= 11 ? ' (standard RFC 9562 variant)' : ' (non-standard variant)'}.${extra}`;
});
gen();
