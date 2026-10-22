// UTF-8 safe: text → bytes → Base64, so emoji and accents round-trip correctly.
const toB64 = bytesArr => { let s = ''; for (let i = 0; i < bytesArr.length; i += 0x8000) s += String.fromCharCode.apply(null, bytesArr.subarray(i, i + 0x8000)); return btoa(s); };
const fromB64 = b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(0));
const urlSafe = s => s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unUrlSafe = s => { s = s.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, ''); return s + '='.repeat((4 - (s.length % 4)) % 4); };

onAny('#src, #urlsafe, input[name="dir"]', run);
fileDrop($('#drop'), $('#file'), async files => {
  const f = files[0];
  if (!f) return;
  const b64 = toB64(new Uint8Array(await f.arrayBuffer()));
  const uri = `data:${f.type || 'application/octet-stream'};base64,${b64}`;
  $('#out').innerHTML = `<p class="kicker">${esc(f.name)} as a data URI</p><p class="sub">${bytes(f.size)} → ${bytes(uri.length)} (Base64 is about 33% larger)</p>
    ${f.type.startsWith('image/') ? `<img src="${uri}" alt="" style="max-height:120px;align-self:flex-start;border-radius:8px">` : ''}
    <div class="copybox" id="result">${esc(uri.length > 200000 ? uri.slice(0, 200000) + '…' : uri)}</div>
    <div class="copyrow"><button type="button" class="btn" id="copy-uri">Copy data URI</button></div>`;
  $('#copy-uri').onclick = e => copyText(uri, e.target);
});

function run() {
  const enc = $('input[name="dir"]:checked').value === 'enc';
  $('#in-label').textContent = enc ? 'Text to encode' : 'Base64 to decode';
  const src = $('#src').value;
  const out = $('#out');
  if (!src) { out.innerHTML = '<p class="empty">Type or paste something.</p>'; return; }
  let result;
  try {
    if (enc) {
      result = toB64(new TextEncoder().encode(src));
      if ($('#urlsafe').checked) result = urlSafe(result);
    } else {
      const raw = src.trim().replace(/^data:[^,]*;base64,/, '');
      const b = fromB64(unUrlSafe(raw));
      result = new TextDecoder('utf-8', { fatal: true }).decode(b);
    }
  } catch (e) {
    out.innerHTML = `<span class="verdict no">Can’t decode</span><p class="sub">${e.name === 'TypeError' ? 'This decodes to binary data (like an image or file), not text.' : 'That isn’t valid Base64. Base64 uses only A–Z, a–z, 0–9, + and / (or - and _), with optional = at the end.'}</p>`;
    return;
  }
  out.innerHTML = `<p class="kicker">${enc ? 'Base64' : 'Decoded text'}</p>
    <div class="copybox" id="result">${esc(result)}</div>
    <p class="note">${src.length.toLocaleString()} → ${result.length.toLocaleString()} characters</p>
    <div class="copyrow"><button type="button" class="btn ghost" id="swap">Use as input</button><button type="button" class="btn" data-copy="result">Copy</button></div>`;
  $('#swap').onclick = () => { $('#src').value = result; (enc ? $('#dir-dec') : $('#dir-enc')).checked = true; run(); };
}
run();
