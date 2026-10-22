const out = $('#out');
let file = null;
const today = new Date().toISOString().slice(0, 10);
const PRESETS = {
  cert: { doc: 'Certificate of Completion', to: 'Ayesha Khan', by: 'Bright Future Academy', ref: 'BFA-2026-0142', until: '', fields: [['Course', 'Advanced Microsoft Excel'], ['Grade', 'Distinction'], ['Duration', '40 hours']] },
  id: { doc: 'Staff Identity Card', to: 'Daniel Okafor', by: 'Northwind Logistics Ltd', ref: 'EMP-0387', until: new Date(Date.now() + 365 * 864e5).toISOString().slice(0, 10), fields: [['Job title', 'Warehouse Supervisor'], ['Department', 'Operations']] },
  product: { doc: 'Certificate of Authenticity', to: '', by: 'Aurora Handmade Leather', ref: 'AHL-WAL-55120', until: '', fields: [['Product', 'Classic bifold wallet, tan'], ['Batch', 'Spring 2026'], ['Made in', 'Lahore, Pakistan']] },
  letter: { doc: 'Experience Letter', to: 'Maria Lopez', by: 'Skyline Software Solutions', ref: 'HR/EXP/2026/77', until: '', fields: [['Position', 'Senior Frontend Developer'], ['Employment', 'March 2021 – September 2026']] },
};
const list = $('#fields');
const rowHtml = v => `<label class="f f-name"><span>Label</span><input data-f="l" type="text" maxlength="60" value="${esc(v.l ?? '')}" placeholder="e.g. Course"></label>
  <label class="f f-name"><span>Value</span><input data-f="v" type="text" maxlength="300" value="${esc(v.v ?? '')}" placeholder="e.g. First Aid"></label>
  <button type="button" class="rm" aria-label="Remove">×</button>`;
makeList(list, $('#add-field'), rowHtml, [], render);

function preset(k) {
  const p = PRESETS[k];
  ['doc', 'to', 'by', 'ref', 'until'].forEach(id => { $('#' + id).value = p[id]; });
  $('#issued').value = today;
  list.innerHTML = '';
  p.fields.forEach(([l, v]) => { const r = document.createElement('div'); r.className = 'row'; r.innerHTML = rowHtml({ l, v }); list.appendChild(r); });
  $$('#presets .chip').forEach(c => c.classList.toggle('on', c.dataset.p === k));
  render();
}
$('#presets').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) preset(b.dataset.p); });
onAny('#doc, #to, #by, #issued, #until, #ref, #note', render);
fileDrop($('#drop'), $('#file'), files => { file = files[0] || null; $('#drop-label').textContent = file ? `${file.name} · ${bytes(file.size)}` : 'PDF or image'; render(); });

function data() {
  return { doc: $('#doc').value.trim(), to: $('#to').value.trim(), by: $('#by').value.trim(), issued: $('#issued').value, until: $('#until').value, ref: $('#ref').value.trim(), note: $('#note').value.trim(), status: 'valid',
    fields: $$('.row', list).map(r => [field(r, 'l').value.trim(), field(r, 'v').value.trim()]).filter(([l, v]) => l && v) };
}
// Same layout as the page people see when they scan (app/qr.php → tf_qr_verify_card).
function card(d) {
  const expired = d.until && new Date(d.until + 'T23:59:59') < new Date();
  const date = s => s ? new Date(s + 'T12:00').toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const rows = [['Issued to', d.to], ['Issued by', d.by], ['Issue date', date(d.issued)], ['Valid until', date(d.until)], ['Reference', d.ref], ...d.fields].filter(([, v]) => v);
  return `<div class="vcard"><div class="vcard-head ${expired ? 'tight' : 'ok'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg><div><b>${expired ? 'Expired' : 'Valid'}</b><small>Record found</small></div></div>
    <p class="vtitle">${esc(d.doc || 'Verification record')}</p>
    <table class="vtable"><tbody>${rows.map(([l, v]) => `<tr><th>${esc(l)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>${d.note ? `<p class="vnote">${esc(d.note)}</p>` : ''}</div>`;
}
function render() {
  if (out.dataset.done) return;
  out.innerHTML = `<p class="kicker">Live preview: what people see when they scan</p>${card(data())}${file ? `<p class="note">${esc(file.name)} will be attached with a preview and download button.</p>` : ''}`;
}

$('#form').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = $('#go');
  btn.disabled = true; btn.lastChild.textContent = 'Creating…';
  try {
    const pub = await HostedQR.post({ action: 'create', type: 'verify', title: $('#doc').value, data: data() }, file);
    out.dataset.done = '1';
    HostedQR.showResult(out, pub, 'verification');
    out.insertAdjacentHTML('beforeend', `<details><summary>Show the record preview</summary>${card(data())}</details>`);
  } catch (err) {
    out.insertAdjacentHTML('afterbegin', `<span class="verdict no">${esc(err.message)}</span>`);
  }
  btn.disabled = false; btn.lastChild.textContent = 'Create verification QR code';
});
preset('cert');
