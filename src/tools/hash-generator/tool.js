const ALGOS = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
let fileBuf = null, fileName = '';
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
onAny('input[name="src"]', () => { const f = $('input[name="src"]:checked').value === 'file'; $('#drop').hidden = !f; $('#text-wrap').hidden = f; run(); });
onAny('#text, #expect, #upper', run);
fileDrop($('#drop'), $('#file'), async files => { fileName = files[0].name; $('#out').innerHTML = `<p class="kicker">Hashes</p><p class="sub">Reading ${esc(fileName)}…</p>`; fileBuf = await files[0].arrayBuffer(); run(); });

let job = 0;
async function run() {
  const id = ++job, isFile = $('input[name="src"]:checked').value === 'file', out = $('#out');
  const data = isFile ? fileBuf : new TextEncoder().encode($('#text').value);
  if (!data) { out.innerHTML = '<p class="kicker">Hashes</p><p class="empty">Choose a file to work out its checksums.</p>'; return; }
  const res = {};
  for (const a of ALGOS.slice(1)) res[a] = hex(await crypto.subtle.digest(a, data));
  if (!window.CryptoJS) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js');
  res.MD5 = CryptoJS.MD5(CryptoJS.lib.WordArray.create(data instanceof ArrayBuffer ? new Uint8Array(data) : data)).toString();
  if (id !== job) return;
  const up = $('#upper').checked, exp = $('#expect').value.trim().toLowerCase().replace(/\s+/g, '');
  const match = exp ? ALGOS.find(a => res[a] === exp) : null;
  out.innerHTML = `<p class="kicker">Hashes of ${isFile ? esc(fileName) + ` (${bytes(data.byteLength)})` : `${data.byteLength} bytes of text (UTF-8)`}</p>
    ${exp ? (match ? `<span class="verdict ok">Match: ${match}</span><p class="sub">The file is identical to the one the checksum was made from.</p>` : `<span class="verdict no">No match</span><p class="sub">None of the hashes equal the expected value. The file may be corrupted or different, or the checksum uses another algorithm.</p>`) : ''}
    ${ALGOS.map((a, i) => `<div class="stat" style="gap:6px"><span>${a} · ${res[a].length * 4} bits</span><div class="copybox" id="h${i}" style="padding:8px 10px${match === a ? ';border-color:var(--good)' : ''}">${up ? res[a].toUpperCase() : res[a]}</div><button type="button" class="btn ghost" data-copy="h${i}" style="align-self:flex-start;min-height:36px;padding:6px 14px">Copy</button></div>`).join('')}`;
}
run();
