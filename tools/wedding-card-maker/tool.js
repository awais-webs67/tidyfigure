// Wedding card maker: draws the card with WeddingCard (assets/wedding-card.js) and can publish an online
// invitation at /s/<code> (app/share.php) with countdown, directions and RSVP.
const TPLS = [['royal', 'Royal'], ['emerald', 'Emerald'], ['navy', 'Midnight'], ['mehndi', 'Mehndi'], ['blush', 'Blush'], ['ivory', 'Ivory']];
const EVENTS = { en: ['Mehndi', 'Mayun', 'Dholki', 'Baraat', 'Nikah', 'Rukhsati', 'Walima', 'Reception', 'Engagement'], ur: ['مہندی', 'مایوں', 'ڈھولکی', 'بارات', 'نکاح', 'رخصتی', 'ولیمہ', 'استقبالیہ', 'منگنی'] };
const f = $('#wd'), cv = $('#cv'), W = window.WeddingCard;
let editing = null;
$('#tpls').innerHTML = TPLS.map(([k, l], i) => `<label class="wd-t-${k}"><input type="radio" name="tpl" value="${k}"${i ? '' : ' checked'}><i></i>${l}</label>`).join('');
const day = n => { const d = new Date(Date.now() + n * 864e5); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const evRow = (e = {}) => `<div class="row"><div class="fields"><label class="f"><span>Event</span><input type="text" class="en" list="evlist" maxlength="40" value="${esc(e.name || '')}" placeholder="Baraat"></label>
  <label class="f"><span>Date</span><input type="date" class="ed" value="${esc(e.date || '')}"></label><label class="f"><span>Time</span><input type="time" class="et" value="${esc(e.time || '')}"></label></div>
  <div class="fields"><label class="f"><span>Venue</span><input type="text" class="ev" maxlength="120" value="${esc(e.venue || '')}" placeholder="Royal Palm Marquee"></label><label class="f"><span>Address</span><input type="text" class="ea" maxlength="220" value="${esc(e.address || '')}" placeholder="Canal Road, Lahore"></label></div>
  <div class="fields" style="grid-template-columns:1fr auto"><label class="f"><span>Google Maps link (optional)</span><input type="text" class="em" inputmode="url" autocapitalize="off" value="${esc(e.map || '')}" placeholder="https://maps.app.goo.gl/…"></label><button type="button" class="btn ghost" data-rm style="align-self:end">Remove</button></div></div>`;
document.body.insertAdjacentHTML('beforeend', `<datalist id="evlist">${EVENTS.en.concat(EVENTS.ur).map(x => `<option value="${x}">`).join('')}</datalist>`);
$('#events').innerHTML = evRow({ name: 'Baraat', date: day(45), time: '19:00', venue: 'Royal Palm Marquee', address: 'Canal Road, Lahore' }) + evRow({ name: 'Walima', date: day(46), time: '20:00', venue: 'Pearl Continental', address: 'Mall Road, Lahore' });
$('#adde').onclick = () => { if ($$('#events .row').length < 6) { $('#events').insertAdjacentHTML('beforeend', evRow({ date: day(44) })); draw(); } };
$('#events').addEventListener('click', e => { if (e.target.closest('[data-rm]') && $$('#events .row').length > 1) { e.target.closest('.row').remove(); draw(); } });

// Switching language changes the default event names that are still unchanged.
onAny('input[name="lang"]', () => {
  const to = f.lang.value, from = to === 'ur' ? 'en' : 'ur';
  $$('#events .en').forEach(i => { const k = EVENTS[from].indexOf(i.value); if (k >= 0) i.value = EVENTS[to][k]; });
  draw();
});

function data() {
  return { tpl: f.tpl.value, lang: f.lang.value, bismillah: f.bismillah.checked, groom: f.groom.value.trim(), bride: f.bride.value.trim(), gp: f.gp.value.trim(), bp: f.bp.value.trim(),
    hosts: f.hosts.value.trim(), msg: f.msg.value.trim(), rsvp: f.rsvp.checked, rsvp_by: f.rsvp_by.value,
    events: $$('#events .row').map(r => ({ name: r.querySelector('.en').value.trim(), date: r.querySelector('.ed').value, time: r.querySelector('.et').value, venue: r.querySelector('.ev').value.trim(), address: r.querySelector('.ea').value.trim(), map: r.querySelector('.em').value.trim() })).filter(e => e.name && e.date),
    contacts: [[f.c1n.value, f.c1p.value], [f.c2n.value, f.c2p.value]].map(([n, p]) => ({ name: n.trim(), phone: p.trim() })).filter(c => c.name || c.phone) };
}
let pending = 0;
async function draw() {
  const id = ++pending, d = data();
  if (!d.groom) d.groom = 'Groom'; if (!d.bride) d.bride = 'Bride';
  const c = document.createElement('canvas');
  await W.draw(c, d, { story: f.size.value === 'story' });
  if (id !== pending) return;
  cv.width = c.width; cv.height = c.height; cv.getContext('2d').drawImage(c, 0, 0);
}
f.addEventListener('input', () => { clearTimeout(draw.t); draw.t = setTimeout(draw, 150); });
f.addEventListener('change', draw);

const fname = ext => `wedding-card-${(f.groom.value + '-' + f.bride.value).trim().replace(/[^\p{L}\p{N}]+/gu, '-').toLowerCase() || 'card'}.${ext}`;
$('#png').onclick = async () => { await draw(); cv.toBlob(b => download(b, fname('png')), 'image/png'); };
$('#pdf').onclick = async () => {
  await draw();
  if (!window.PDFLib) await loadScript(PDFLIB_URL);
  const pdf = await PDFLib.PDFDocument.create(), jpg = await pdf.embedJpg(await (await canvasBlob(cv, 'image/jpeg', .95)).arrayBuffer());
  const w = 5 * 72, h = w * cv.height / cv.width; // 5-inch wide card
  pdf.addPage([w, h]).drawImage(jpg, { x: 0, y: 0, width: w, height: h });
  download(new Blob([await pdf.save()], { type: 'application/pdf' }), fname('pdf'));
};

$('#go').onclick = async () => {
  const d = data(), btn = $('#go');
  if (!d.groom || !d.bride) { toast('Write the names of the couple.', 'err'); return; }
  if (!d.events.length) { toast('Add at least one event with a date.', 'err'); return; }
  btn.disabled = true; btn.textContent = editing ? 'Saving…' : 'Creating…';
  try {
    if (editing) {
      await Share.post({ action: 'update', code: editing.code, k: editing.key, data: d });
      location.href = Share.manageUrl(editing.code, editing.key);
      return;
    }
    const res = await Share.post({ action: 'create', type: 'wedding', data: d });
    Share.donePanel($('#done'), res, { type: 'wedding', heading: 'Your invitation is ready! 💌', text: `💍 You’re invited to the wedding of ${d.groom} & ${d.bride}. Open your invitation 👇`, can: 'see every RSVP, edit the invitation and delete it' });
    Share.mineBox($('#mine'), 'wedding', 'invitation');
    btn.hidden = true;
  } catch (e) { toast(e.message, 'err'); btn.disabled = false; btn.textContent = '💌 Create online invitation'; }
};

(async () => {
  Share.mineBox($('#mine'), 'wedding', 'invitation');
  const ed = await Share.editLoad();
  if (ed && ed.type === 'wedding') {
    editing = ed;
    const d = ed.d;
    ['groom', 'bride', 'gp', 'bp', 'hosts', 'msg', 'rsvp_by'].forEach(k => { f[k].value = d[k] || ''; });
    f.bismillah.checked = !!d.bismillah; f.rsvp.checked = !!d.rsvp;
    $(`input[name="tpl"][value="${d.tpl}"]`).checked = true; $(`input[name="lang"][value="${d.lang}"]`).checked = true;
    $('#events').innerHTML = d.events.map(evRow).join('');
    (d.contacts || []).forEach((c, i) => { if (i < 2) { f['c' + (i + 1) + 'n'].value = c.name; f['c' + (i + 1) + 'p'].value = c.phone; } });
    $('#go').textContent = 'Save changes';
  }
  draw();
})();
