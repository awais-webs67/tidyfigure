const B = window.dcodeIO && window.dcodeIO.bcrypt;
$('#cost').innerHTML = Array.from({ length: 12 }, (_, i) => i + 4).map(c => `<option value="${c}"${c === 10 ? ' selected' : ''}>${c}${c === 10 ? ' (default)' : c === 12 ? ' (stronger)' : c >= 14 ? ' (slow)' : ''}</option>`).join('');
const bytes = s => new TextEncoder().encode(s).length;
$('#show').addEventListener('click', e => { const p = $('#pw'); p.type = p.type === 'password' ? 'text' : 'password'; e.currentTarget.textContent = p.type === 'password' ? 'Show' : 'Hide'; });
$('#pw').addEventListener('input', () => { const n = bytes($('#pw').value); $('#warn').hidden = n <= 72; $('#warn').textContent = `This password is ${n} bytes long. Bcrypt only uses the first 72 bytes, so characters after that are ignored.`; });
let busy = false;
$('#gen').addEventListener('click', () => {
  if (!B) { $('#out').innerHTML = '<span class="verdict no">The bcrypt library didn’t load</span><p class="sub">Reload the page and try again.</p>'; return; }
  const pw = $('#pw').value, cost = +$('#cost').value, ver = $('#ver').value;
  if (!pw) { $('#pw').focus(); toast('Type a password first', 'err'); return; }
  if (busy) return; busy = true;
  $('#out').innerHTML = progressHtml(`Hashing with cost ${cost}`);
  const t0 = performance.now();
  B.genSalt(cost, (e, salt) => {
    if (e) { busy = false; $('#out').innerHTML = `<span class="verdict no">Couldn’t create a salt</span><p class="sub">${esc(e.message)}</p>`; return; }
    B.hash(pw, salt, (err, h) => {
      busy = false;
      if (err) { $('#out').innerHTML = `<span class="verdict no">Hashing failed</span><p class="sub">${esc(err.message)}</p>`; return; }
      const hash = h.replace(/^\$2[aby]\$/, `$${ver}$`), ms = performance.now() - t0;
      $('#out').innerHTML = `<p class="kicker">Bcrypt hash</p><div class="copybox" style="font-size:15px">${esc(hash)}</div>
        <div class="btns"><button type="button" class="btn" id="copy">Copy hash</button><button type="button" class="btn ghost" id="again">Generate another</button></div>
        <div class="scroll"><table class="tbl"><tbody>
          <tr><td>Version</td><td class="n">$${ver}$</td></tr>
          <tr><td>Cost</td><td class="n">${cost} (2<sup>${cost}</sup> = ${(2 ** cost).toLocaleString()} rounds)</td></tr>
          <tr><td>Salt</td><td class="n">${esc(hash.slice(7, 29))}</td></tr>
          <tr><td>Hash</td><td class="n">${esc(hash.slice(29))}</td></tr>
          <tr><td>Time in your browser</td><td class="n">${ms < 1000 ? Math.round(ms) + ' ms' : (ms / 1000).toFixed(1) + ' s'}</td></tr>
        </tbody></table></div>
        <p class="note">Each click gives a different hash because the salt is random. All of them match the same password.</p>`;
      $('#copy').onclick = ev => copyText(hash, ev.currentTarget);
      $('#again').onclick = () => $('#gen').click();
      $('#vhash').value = hash; $('#vpw').value = pw; verify();
    }, p => setProgress($('#out'), p, `Hashing… ${Math.round(p * 100)}%`));
  });
});
let vt = 0;
function verify() {
  const pw = $('#vpw').value, h = $('#vhash').value.trim(), o = $('#vres');
  if (!pw || !h) { o.innerHTML = ''; return; }
  if (!/^\$2[abxy]?\$\d{2}\$[./A-Za-z0-9]{53}$/.test(h)) { o.innerHTML = '<span class="verdict no">Not a bcrypt hash</span><p class="sub">A bcrypt hash looks like $2y$10$ followed by 53 characters.</p>'; return; }
  o.innerHTML = '<p class="sub">Checking…</p>';
  B.compare(pw, h.replace(/^\$2[xy]\$/, '$2a$'), (e, ok) => { o.innerHTML = e ? `<span class="verdict no">${esc(e.message)}</span>` : ok ? '<span class="verdict ok">Match: the password is correct</span>' : '<span class="verdict no">No match</span><p class="sub">This password doesn’t produce this hash. Check for extra spaces or a different password.</p>'; });
}
$('#vpw').addEventListener('input', () => { clearTimeout(vt); vt = setTimeout(verify, 300); });
$('#vhash').addEventListener('input', () => { clearTimeout(vt); vt = setTimeout(verify, 300); });
