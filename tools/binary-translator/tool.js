const enc = new TextEncoder(), dec = new TextDecoder('utf-8', { fatal: false });
function run() {
  const s = $('#in').value, sep = $('#sep').value, out = $('#out');
  if (!s.trim()) { out.innerHTML = '<p class="kicker">Result</p><p class="empty">Type some text or paste binary.</p>'; return; }
  const bin = s.replace(/\s+/g, '');
  let bytes, isBin = /^[01]+$/.test(bin) && bin.length >= 8;
  if (isBin) {
    if (bin.length % 8) { out.innerHTML = `<p class="kicker">Text</p><span class="verdict no">Incomplete binary</span><p class="sub">Binary text needs groups of 8 digits. You have ${bin.length} digits, ${bin.length % 8} too many or ${8 - bin.length % 8} too few.</p>`; return; }
    bytes = Uint8Array.from(bin.match(/.{8}/g).map(b => parseInt(b, 2)));
  } else bytes = enc.encode(s);
  const arr = [...bytes], b2 = arr.map(b => b.toString(2).padStart(8, '0')).join(sep), hex = arr.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' '), decs = arr.join(' '), oct = arr.map(b => b.toString(8).padStart(3, '0')).join(' ');
  const main = isBin ? dec.decode(bytes) : b2;
  out.innerHTML = `<p class="kicker">${isBin ? 'Text' : 'Binary'}</p><div class="copybox" id="main">${esc(main)}</div>
    <div class="btns"><button type="button" class="btn" id="copy">Copy</button></div>
    <p class="sub">${arr.length} byte${arr.length === 1 ? '' : 's'} · ${arr.length * 8} bits${isBin ? '' : ` · ${[...s].length} characters`}</p>
    <details><summary>Hex, decimal and octal</summary><div class="scroll"><table class="tbl"><tbody>
      ${isBin ? `<tr><td>Binary</td><td><code>${esc(b2)}</code></td></tr>` : ''}
      <tr><td>Hex</td><td><code>${hex}</code></td></tr><tr><td>Decimal</td><td><code>${decs}</code></td></tr><tr><td>Octal</td><td><code>${oct}</code></td></tr>
    </tbody></table></div></details>`;
  $('#copy').onclick = e => copyText(main, e.currentTarget);
}
onAny('#in, #sep', run);
$('#in').value = 'Hello'; run();
