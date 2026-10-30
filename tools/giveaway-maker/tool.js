// Giveaway maker: the form here becomes a public page at /s/<code> (app/share.php) with a countdown and entry form.
const FIELDS = [['phone', 'Phone / WhatsApp', true], ['email', 'Email', false], ['instagram', 'Instagram username', false], ['tiktok', 'TikTok username', false], ['youtube', 'YouTube channel name', false], ['facebook', 'Facebook name', false], ['city', 'City', false]];
const f = $('#gv'), out = $('#out'), root = $('#gv-root');
let editing = null, image = null, removeImage = false, customs = 0;
// The preview (#pv) is redrawn as the form changes; the button stays put (redrawing it mid-click would swallow the click).
$('#go').onclick = () => create();
const qRow = (label = '', req = false) => { customs++; return `<div class="row" data-k="q${customs}" style="grid-template-columns:1fr auto auto"><input type="text" class="lbl" maxlength="80" placeholder="Your question, e.g. Why do you love our shop?" value="${esc(label)}"><label class="check" style="font-size:13.5px"><input type="checkbox" class="req"${req ? ' checked' : ''}> Required</label><button type="button" class="sh-x" data-rm aria-label="Remove">${Share.ICON.trash}</button></div>`; };
const sRow = (t = '', url = '') => `<div class="row" style="grid-template-columns:1fr 1fr auto"><input type="text" class="st" maxlength="140" placeholder="e.g. Follow us on Instagram" value="${esc(t)}"><input type="text" class="su" inputmode="url" autocapitalize="off" placeholder="Link (optional)" value="${esc(url)}"><button type="button" class="sh-x" data-rm aria-label="Remove">${Share.ICON.trash}</button></div>`;
$('#addq').onclick = () => { if ($$('#fields [data-k^="q"]').length < 3) { $('#fields').insertAdjacentHTML('beforeend', qRow()); preview(); } else toast('Up to 3 questions of your own.'); };
$('#adds').onclick = () => { if ($$('#steps .row').length < 8) { $('#steps').insertAdjacentHTML('beforeend', sRow()); preview(); } };
document.addEventListener('click', e => { const b = e.target.closest('[data-rm]'); if (b && b.closest('#gv')) { b.closest('.row').remove(); preview(); } });

// End time: default one week from now
const setEnd = days => { const d = new Date(Date.now() + days * 864e5); f.d.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; preview(); };
setEnd(7);
$('#quick').addEventListener('click', e => { const b = e.target.closest('[data-days]'); if (b) setEnd(+b.dataset.days); });

// Picture: made smaller here (max 1400 px JPEG) so it uploads fast
$('#img').addEventListener('change', async () => {
  const file = $('#img').files[0];
  if (!file) return;
  try {
    const im = await loadImage(file), k = Math.min(1, 1400 / Math.max(im.width, im.height)), c = document.createElement('canvas');
    c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
    c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
    image = await new Promise(r => c.toBlob(r, 'image/jpeg', .86));
    removeImage = false;
    $('#imgprev').innerHTML = `<div class="btns" style="align-items:center"><img src="${URL.createObjectURL(image)}" alt="" style="height:70px;border-radius:10px"><button type="button" class="btn ghost" id="imgx">Remove</button></div>`;
    $('#imgx').onclick = () => { image = null; removeImage = true; $('#img').value = ''; $('#imgprev').innerHTML = ''; preview(); };
    preview();
  } catch (e) { toast('That picture couldn’t be opened.', 'err'); }
});

function data() {
  const fields = $$('#fields .row').filter(r => !r.querySelector('.use') || r.querySelector('.use').checked).map(r => {
    const k = r.dataset.k, lbl = r.querySelector('.lbl');
    return { k: k.startsWith('q') ? 'q' + (1 + $$('#fields [data-k^="q"]').indexOf(r)) : k, label: lbl ? lbl.value.trim() : FIELDS.find(x => x[0] === k)[1], req: r.querySelector('.req').checked };
  }).filter(x => x.label);
  const ends = Math.floor(new Date(`${f.d.value}T${f.t.value || '20:00'}`).getTime() / 1000);
  return { title: f.title.value.trim(), prize: f.prize.value.trim(), host: f.host.value.trim(), desc: f.desc.value.trim(), ends, winners: +f.winners.value || 1, fields,
    steps: $$('#steps .row').map(r => ({ t: r.querySelector('.st').value.trim(), url: r.querySelector('.su').value.trim() })).filter(s => s.t),
    mode: f.mode.value, theme: f.theme.value, count: f.count.checked };
}

function preview() {
  if (out.querySelector('.sh-done')) return;
  const d = data(), th = 'sh-t-' + d.theme;
  root.className = 'tool-grid ' + th;
  const left = d.ends * 1000 - Date.now(), days = Math.max(0, Math.floor(left / 864e5)), hrs = Math.max(0, Math.floor(left % 864e5 / 36e5));
  const img = image ? URL.createObjectURL(image) : (editing && editing.image && !removeImage ? editing.image : '');
  $('#pv').innerHTML = `<div class="sh-card sh-hero ${th}" style="padding:20px">${img ? `<img class="gv-img" src="${esc(img)}" alt="" style="width:calc(100% + 40px);margin:-20px -20px 4px">` : `<div class="gv-gift">${Share.ICON.gift}</div>`}
      <p class="sh-kicker">${d.host ? 'Giveaway by ' + esc(d.host) : 'Giveaway'}</p><h2 style="font-size:24px">${esc(d.title || 'Your giveaway title')}</h2>${d.prize ? `<p class="gv-prize" style="font-size:15px">${esc(d.prize)}</p>` : ''}
      <div class="gv-clock" style="max-width:320px"><div><b>${days}</b><span>Days</span></div><div><b>${String(hrs).padStart(2, '0')}</b><span>Hours</span></div><div><b>00</b><span>Min</span></div><div><b>00</b><span>Sec</span></div></div>
      <p class="sub" style="font-size:14px">Entry form: name${d.fields.map(x => ', ' + esc(x.label.toLowerCase())).join('')}</p></div>`;
  const go = $('#go');
  go.className = 'sh-btn wide ' + th;
  if (!go.disabled) go.textContent = editing ? 'Save changes' : 'Create giveaway';
  $('#pvnote').textContent = d.mode === 'auto' ? `${d.winners} winner${d.winners > 1 ? 's' : ''} will be drawn automatically when the countdown ends.` : 'You’ll draw the winners yourself from your private page.';
}
f.addEventListener('input', preview);
f.addEventListener('change', preview);

async function create() {
  const d = data(), btn = $('#go');
  if (!d.title) { toast('Write a title for your giveaway.', 'err'); f.title.focus(); return; }
  if (!(d.ends * 1000 > Date.now() + 60000) && !(editing && d.ends === editing.d.ends)) { toast('Choose an end time in the future.', 'err'); return; }
  btn.disabled = true; btn.textContent = editing ? 'Saving…' : 'Creating…';
  try {
    if (editing) {
      await Share.post({ action: 'update', code: editing.code, k: editing.key, data: d, remove_image: removeImage ? 1 : '' }, image);
      location.href = Share.manageUrl(editing.code, editing.key);
      return;
    }
    const res = await Share.post({ action: 'create', type: 'giveaway', data: d }, image);
    Share.donePanel(out, res, { type: 'giveaway', heading: 'Your giveaway is live! 🎉', text: `🎁 Giveaway: ${d.title}. Enter here before time runs out 👇`, can: 'see every entry, draw winners, edit and delete' });
    Share.mineBox($('#mine'), 'giveaway', 'giveaway');
  } catch (e) { toast(e.message, 'err'); btn.disabled = false; btn.textContent = editing ? 'Save changes' : 'Create giveaway'; }
}

(async () => {
  Share.mineBox($('#mine'), 'giveaway', 'giveaway');
  const ed = await Share.editLoad();
  if (ed && ed.type === 'giveaway') {
    editing = ed;
    const d = ed.d, end = new Date(d.ends * 1000);
    ['title', 'prize', 'host', 'desc'].forEach(k => { f[k].value = d[k] || ''; });
    f.d.value = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
    f.t.value = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
    f.winners.value = d.winners; f.count.checked = !!d.count;
    $(`input[name="mode"][value="${d.mode}"]`).checked = true;
    const t = $(`input[name="theme"][value="${d.theme}"]`); if (t) t.checked = true;
    $$('#fields .row').forEach(r => { const x = d.fields.find(y => y.k === r.dataset.k); r.querySelector('.use').checked = !!x; r.querySelector('.req').checked = !!(x && x.req); });
    d.fields.filter(x => x.k.startsWith('q')).forEach(x => $('#fields').insertAdjacentHTML('beforeend', qRow(x.label, x.req)));
    $('#steps').innerHTML = d.steps.map(s => sRow(s.t, s.url)).join('');
  }
  preview();
})();
