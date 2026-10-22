const KEY = 'tf-invoice-business';
const today = new Date(), iso = d => d.toISOString().slice(0, 10);
$('#date').value = iso(today);
$('#due').value = iso(new Date(today.getTime() + 14 * 86400000));
let logo = null;

const list = $('#items');
makeList(list, $('#add-item'), v => `
  <label class="f f-name"><span>Description</span><input data-f="desc" type="text" value="${esc(v.desc ?? '')}" placeholder="Item or service"></label>
  <label class="f"><span>Qty</span><input data-f="qty" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.qty ?? 1)}"></label>
  <label class="f"><span>Unit price</span><input data-f="price" type="number" inputmode="decimal" min="0" step="any" value="${esc(v.price ?? '')}"></label>
  <label class="f"><span>Tax %</span><input data-f="tax" type="number" inputmode="decimal" min="0" max="100" step="any" value="${esc(v.tax ?? 0)}"></label>
  <button type="button" class="rm" aria-label="Remove item">×</button>`,
  [{ desc: 'Website design', qty: 1, price: 1800, tax: 20 }, { desc: 'Copywriting (hours)', qty: 6, price: 65, tax: 20 }, { desc: 'Stock photo licences', qty: 4, price: 25, tax: 20 }], render);

// Business details are a per-device convenience; storage may be unavailable, so every access is guarded.
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (saved) ['from-name', 'from', 'notes', 'cur', 'accent'].forEach(k => { if (saved[k] !== undefined) $('#' + k).value = saved[k]; });
} catch (e) { /* storage blocked */ }
function remember() {
  try {
    if ($('#remember').checked) localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(['from-name', 'from', 'notes', 'cur', 'accent'].map(k => [k, $('#' + k).value]))));
    else localStorage.removeItem(KEY);
  } catch (e) { /* storage blocked */ }
}

const money = n => `${$('#cur').value}${fmt(n)}`;
const nice = s => { const [y, m, d] = s.split('-').map(Number); return y ? new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : ''; };

function render() {
  const items = $$('.row', list).map(r => ({ desc: field(r, 'desc').value, qty: val(field(r, 'qty')) || 0, price: val(field(r, 'price')) || 0, tax: val(field(r, 'tax')) || 0 }));
  const sub = items.reduce((s, i) => s + i.qty * i.price, 0);
  const disc = Math.min(100, Math.max(0, val($('#disc')) || 0)) / 100;
  const taxes = {};
  items.forEach(i => { if (i.tax) taxes[i.tax] = (taxes[i.tax] || 0) + i.qty * i.price * (1 - disc) * i.tax / 100; });
  const taxTotal = Object.values(taxes).reduce((a, b) => a + b, 0), ship = val($('#ship')) || 0;
  const total = sub * (1 - disc) + taxTotal + ship;
  const p = $('#paper');
  p.style.setProperty('--inv-accent', $('#accent').value);
  p.innerHTML = `<div class="inv-top"><div>${logo ? `<img src="${logo}" alt="">` : `<h2>${esc($('#from-name').value)}</h2>`}</div>
      <div class="inv-meta"><h2 style="color:${$('#accent').value}">Invoice</h2><div>No. <b>${esc($('#num').value)}</b></div><div>Date: <b>${nice($('#date').value)}</b></div><div>Due: <b>${nice($('#due').value)}</b></div></div></div>
    <div class="inv-parties"><div><small>From</small><b>${esc($('#from-name').value)}</b><br>${esc($('#from').value)}</div><div><small>Bill to</small>${esc($('#to').value)}</div></div>
    <table class="inv-tbl"><thead><tr><th>Description</th><th class="r">Qty</th><th class="r">Price</th><th class="r">Tax</th><th class="r">Amount</th></tr></thead>
      <tbody>${items.map(i => `<tr><td>${esc(i.desc)}</td><td class="r">${fmtMax(i.qty, 2)}</td><td class="r">${money(i.price)}</td><td class="r">${i.tax ? fmtMax(i.tax, 2) + '%' : '–'}</td><td class="r">${money(i.qty * i.price)}</td></tr>`).join('')}</tbody></table>
    <div class="inv-tot"><div><span>Subtotal</span><span>${money(sub)}</span></div>
      ${disc ? `<div><span>Discount ${fmtMax(disc * 100, 2)}%</span><span>−${money(sub * disc)}</span></div>` : ''}
      ${Object.entries(taxes).map(([r, t]) => `<div><span>Tax ${fmtMax(+r, 2)}%</span><span>${money(t)}</span></div>`).join('')}
      ${ship ? `<div><span>Shipping / other</span><span>${money(ship)}</span></div>` : ''}
      <div class="grand"><span>Total due</span><span>${money(total)}</span></div></div>
    ${$('#notes').value.trim() ? `<div class="inv-notes">${esc($('#notes').value)}</div>` : ''}`;
  remember();
}

async function snapshot() {
  if (!window.html2canvas) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
  const p = $('#paper'), w = p.style.width;
  p.style.width = '794px'; // render at A4 proportions regardless of screen size
  const c = await html2canvas(p, { scale: 2, backgroundColor: '#ffffff', logging: false });
  p.style.width = w;
  return c;
}
$('#pdf').addEventListener('click', async () => {
  $('#pdf').disabled = true;
  try {
    if (!window.PDFLib) await loadScript(PDFLIB_URL);
    const c = await snapshot();
    const pdf = await PDFLib.PDFDocument.create();
    pdf.setTitle(`Invoice ${$('#num').value}`); pdf.setAuthor($('#from-name').value);
    const img = await pdf.embedJpg(new Uint8Array(await (await canvasBlob(c, 'image/jpeg', 0.92)).arrayBuffer()));
    const W = 595.28, H = 841.89, h = W * c.height / c.width;
    // Long invoices continue onto extra pages.
    for (let top = 0, i = 0; top < h - 1; top += H, i++) pdf.addPage([W, H]).drawImage(img, { x: 0, y: H - h + top, width: W, height: h });
    download(new Blob([await pdf.save()], { type: 'application/pdf' }), `${$('#num').value.replace(/[^\w-]+/g, '-') || 'invoice'}.pdf`);
  } finally { $('#pdf').disabled = false; }
});
$('#png').addEventListener('click', async () => download(await canvasBlob(await snapshot(), 'image/png'), `${$('#num').value.replace(/[^\w-]+/g, '-') || 'invoice'}.png`));
$('#next').addEventListener('click', () => { $('#num').value = $('#num').value.replace(/(\d+)(?!.*\d)/, d => String(+d + 1).padStart(d.length, '0')); render(); });
$('#logo').addEventListener('change', () => { const f = $('#logo').files[0]; if (!f) { logo = null; render(); return; } const r = new FileReader(); r.onload = () => { logo = r.result; render(); }; r.readAsDataURL(f); });
onAny('#from-name, #from, #to, #num, #date, #due, #cur, #accent, #disc, #ship, #notes, #remember', render);
render();
