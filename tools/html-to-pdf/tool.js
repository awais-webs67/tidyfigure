// HTML to PDF: the HTML is cleaned (no scripts, frames or event handlers), laid out inside a shadow root
// (so its styles stay inside) at the page width, and dom-pdf.js draws it as PDF pages with real text.
const out = $('#out');
let name = 'page';
const PAPER = { a4: [794, 1123], letter: [816, 1056] };
fileDrop($('#drop'), $('#file'), async fs => { const f = fs[0]; if (!f) return; $('#code').value = await f.text(); name = baseName(f.name); $('#loaded').textContent = `${f.name} · ${bytes(f.size)}`; $('#go').click(); });
$('#sample').addEventListener('click', () => {
  name = 'invoice';
  $('#code').value = `<style>
  body { font-family: Arial, sans-serif; color: #222; }
  h1 { color: #FF5B35; margin: 0 0 4px; }
  .muted { color: #777; }
  table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  th { background: #263238; color: #fff; text-align: left; padding: 8px; }
  td { border-bottom: 1px solid #ddd; padding: 8px; }
  td.n, th.n { text-align: right; }
  .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 16px; }
  .note { background: #FFF4E5; border-left: 4px solid #FF9800; padding: 10px 14px; margin-top: 24px; }
</style>
<h1>Invoice #2026-041</h1>
<p class="muted">Example Studio · 14 Sample Street, London · hello@example.com</p>
<p><strong>Bill to:</strong> Jane Example<br>Issued 29 October 2026 · Due 28 November 2026</p>
<table>
  <tr><th>Description</th><th class="n">Hours</th><th class="n">Rate</th><th class="n">Amount</th></tr>
  <tr><td>Website design</td><td class="n">24</td><td class="n">£55</td><td class="n">£1,320.00</td></tr>
  <tr><td>Logo and brand colours</td><td class="n">8</td><td class="n">£55</td><td class="n">£440.00</td></tr>
  <tr><td>Hosting set-up</td><td class="n">2</td><td class="n">£45</td><td class="n">£90.00</td></tr>
</table>
<p class="total">Total due: £1,850.00</p>
<div class="note">Please pay by bank transfer to account 12345678, sort code 20-45-67, using the invoice number as the reference.</div>`;
  $('#go').click();
});
// Removes anything that could run or load content: scripts, frames, objects, event handlers, javascript: links.
function clean(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, iframe, frame, frameset, object, embed, applet, link[rel="import"], meta[http-equiv], base').forEach(e => e.remove());
  doc.querySelectorAll('*').forEach(e => { for (const a of [...e.attributes]) { if (/^on/i.test(a.name) || (/^(href|src|xlink:href|action|formaction)$/i.test(a.name) && /^\s*(javascript|vbscript):/i.test(a.value))) e.removeAttribute(a.name); } });
  const styles = [...doc.querySelectorAll('style')].map(s => s.textContent).join('\n');
  doc.querySelectorAll('style, link').forEach(e => e.remove());
  return { styles, body: doc.body ? doc.body.innerHTML : '', bodyStyle: doc.body ? doc.body.getAttribute('style') || '' : '' };
}
$('#go').addEventListener('click', async () => {
  const code = $('#code').value.trim();
  if (!code) { $('#code').focus(); return; }
  const btn = $('#go'); btn.disabled = true;
  const stage = $('#stage');
  out.innerHTML = '<p class="kicker">PDF</p><div class="bar"><i style="width:3%"></i></div><p class="sub" data-pct>Laying out the page…</p>';
  try {
    stage.innerHTML = '';
    let [pw, ph] = PAPER[$('#paper').value];
    if ($('#orient').value === 'landscape') [pw, ph] = [ph, pw];
    const M = +$('#margin').value, host = document.createElement('div'); stage.appendChild(host);
    const root = host.attachShadow({ mode: 'open' }), c = clean(code);
    // The styles' "body" and "html" rules apply to the page box instead.
    const css = c.styles.replace(/(^|[\s,}])(html|body)(?=[\s,{.:#[])/gi, '$1.tf-page');
    root.innerHTML = `<style>.tf-page{box-sizing:border-box;width:${pw}px;min-height:${ph}px;padding:${M}px;background:#fff;color:#000;font:16px/1.4 Arial,sans-serif;overflow:hidden}.tf-page img{max-width:100%}${css}</style><div class="tf-page" style="${esc(c.bodyStyle)}">${c.body}</div>`;
    const page = root.querySelector('.tf-page');
    await Promise.all([...page.querySelectorAll('img')].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; setTimeout(r, 8000); })));
    await DomPdf.prepare(page);
    setProgress(out, 0.4, 'Drawing the pages…');
    const pdfBytes = await DomPdf.render([{ el: page, w: pw, h: ph, pad: [M, M, M, M] }], { title: name, onProgress: n => setProgress(out, Math.min(0.95, 0.4 + n * 0.05), `Drawing page ${n}…`) });
    stage.innerHTML = '';
    await showPdfResult(out, pdfBytes, { title: 'PDF', name: `${name}.pdf`, label: 'Download PDF', headline: '<span class="verdict ok">Converted</span>' });
  } catch (e) {
    stage.innerHTML = '';
    out.innerHTML = `<p class="kicker">PDF</p><span class="verdict no">Couldn’t convert this HTML</span><p class="sub">${esc(e.message || String(e))}</p>`;
  }
  btn.disabled = false;
});
