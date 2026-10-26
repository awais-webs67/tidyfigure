const KEY = 'tf-exp-letter';
let logo = null, logoUrl = '';
const today = new Date(); $('[data-k="date"]').value = today.toISOString().slice(0, 10);
try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) $$('[data-k]').forEach(i => { if (s[i.dataset.k] !== undefined && i.dataset.k !== 'date') i.value = s[i.dataset.k]; }); } catch (e) { /* storage blocked */ }
const v = k => ($(`[data-k="${k}"]`).value || '').trim();
fileDrop($('#ldrop'), $('#logo'), async fs => { logo = fs[0]; logoUrl = URL.createObjectURL(logo); render(); });
const P = { he: ['he', 'him', 'his', 'was', 'has'], she: ['she', 'her', 'her', 'was', 'has'], they: ['they', 'them', 'their', 'were', 'have'] };
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
function fd(iso) { const m = /^(\d+)-(\d+)-(\d+)$/.exec(iso || ''); if (!m) return ''; return new Date(+m[1], m[2] - 1, +m[3]).toLocaleDateString(v('ds'), { day: 'numeric', month: 'long', year: 'numeric' }); }
function period(a, b) {
  const x = /^(\d+)-(\d+)-(\d+)$/.exec(a || ''), y = /^(\d+)-(\d+)-(\d+)$/.exec(b || ''); if (!x || !y) return '';
  // The last working day counts, so measure to the day after it.
  const e = new Date(+y[1], y[2] - 1, +y[3] + 1);
  let months = (e.getFullYear() - x[1]) * 12 + (e.getMonth() + 1 - x[2]); if (e.getDate() < +x[3]) months--;
  if (months < 0) return '';
  const yr = Math.floor(months / 12), mo = months % 12;
  return [yr && `${yr} year${yr > 1 ? 's' : ''}`, mo && `${mo} month${mo > 1 ? 's' : ''}`].filter(Boolean).join(' and ') || 'less than a month';
}
function text() {
  const [he, him, his, was, has] = P[v('pro')], first = v('name').split(/\s+/)[0] || 'The employee', who = `${v('hon') ? v('hon') + ' ' : ''}${v('name') || '[Employee name]'}`;
  const type = v('type'), per = period(v('from'), v('to')), duties = v('duties').split('\n').map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean);
  const intro = `This is to certify that ${who}${v('eid') ? ` (employee ID ${v('eid')})` : ''} worked with ${v('co') || '[Company]'} as ${v('role') || '[Job title]'}${v('dept') ? ` in the ${v('dept')} department` : ''} from ${fd(v('from')) || '[start date]'} to ${fd(v('to')) || '[end date]'}${per ? `, a period of ${per}` : ''}.`;
  const conduct = { excellent: `${first} proved to be a dedicated, reliable and highly skilled professional. ${cap(his)} work was consistently of a high standard, and ${he} worked very well with colleagues and clients alike.`, good: `${first} ${was} a sincere and hardworking member of our team, and ${his} conduct throughout ${his} time with us was good.`, ok: `${cap(his)} conduct and performance during this period were satisfactory.` }[v('conduct')];
  const why = { resigned: `${cap(he)} ${has} resigned of ${his} own accord to pursue other opportunities.`, contract: `${cap(his)} employment ended on completion of ${his} contract.`, '': '' }[v('why')];
  const blocks = [{ h: type === 'relieving' ? 'RELIEVING LETTER' : type === 'short' ? 'TO WHOM IT MAY CONCERN' : 'EXPERIENCE CERTIFICATE' }];
  if (type === 'relieving') {
    blocks.push({ p: `This is to confirm that ${who}${v('eid') ? ` (employee ID ${v('eid')})` : ''}, ${v('role') || '[Job title]'}${v('dept') ? `, ${v('dept')} department` : ''}, has been relieved of ${his} duties with ${v('co') || '[Company]'} with effect from the close of business on ${fd(v('to')) || '[last working day]'}, following the acceptance of ${his} resignation.` });
    blocks.push({ p: `${cap(he)} worked with us from ${fd(v('from')) || '[start date]'} to ${fd(v('to')) || '[end date]'}${per ? ` (${per})` : ''}. ${cap(he)} ${has} completed the handover of ${his} responsibilities, and all company property has been returned.` });
    blocks.push({ p: conduct });
  } else if (type === 'short') {
    blocks.push({ p: `${intro} ${conduct}` });
  } else {
    blocks.push({ p: intro });
    if (duties.length) { blocks.push({ p: `During ${his} time with us, ${he} ${was} responsible for:` }); blocks.push({ ul: duties }); }
    if (type === 'detailed' && v('ach')) blocks.push({ p: `Among ${his} achievements: ${v('ach').replace(/\s*\n\s*/g, ' ')}` });
    blocks.push({ p: conduct });
    if (why) blocks.push({ p: why });
  }
  blocks.push({ p: `We wish ${him} every success in ${his} future career.` });
  return blocks;
}
function render() {
  const col = v('color') || '#0E5BA8';
  const head = `<div class="xl-head" contenteditable="false" style="--xl:${col}">${logoUrl ? `<img src="${logoUrl}" alt="Logo">` : ''}<div><b>${esc(v('co'))}</b><small>${esc(v('addr'))}${v('contact') ? '<br>' + esc(v('contact')) : ''}</small></div></div>`;
  const body = text().map(b => (b.h ? `<h3>${esc(b.h)}</h3>` : b.ul ? `<ul>${b.ul.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : `<p>${esc(b.p)}</p>`)).join('');
  $('#letter').innerHTML = `${head}<p style="text-align:right">${esc(fd(v('date')))}</p>${body}<p style="margin-top:28px">Sincerely,</p><p style="margin-top:44px"><b>${esc(v('sig'))}</b><br>${esc(v('sigt'))}<br>${esc(v('co'))}</p>`;
  const s = {}; $$('[data-k]').forEach(i => { s[i.dataset.k] = i.value; });
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage blocked */ }
}
onAny('[data-k]', render);
$('#redo').addEventListener('click', render);
$('#copy').addEventListener('click', e => copyText($('#letter').innerText.trim(), e.currentTarget));
$('#pdf').addEventListener('click', async e => {
  const btn = e.currentTarget; btn.disabled = true;
  try {
    if (!window.PDFLib) await loadScript(PDFLIB_URL);
    if (!window.fontkit) await loadScript(`${window.TF_BASE || ''}/assets/vendor/fontkit-1.1.1.min.js`);
    const { PDFDocument, rgb } = PDFLib, pdf = await PDFDocument.create(); pdf.registerFontkit(fontkit);
    const reg = await pdf.embedFont(await fontBytes('merriweather', 400), { subset: true }), bold = await pdf.embedFont(await fontBytes('merriweather', 700), { subset: true });
    const sans = await pdf.embedFont(await fontBytes('inter', 700), { subset: true }), sansR = await pdf.embedFont(await fontBytes('inter', 400), { subset: true });
    const W = 595.28, H = 841.89, M = 64, col = (h => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255))(v('color') || '#0E5BA8');
    let page = pdf.addPage([W, H]), y = H - M;
    // Letterhead
    let tx = M;
    if (logo) { const b = new Uint8Array(await logo.arrayBuffer()); const img = logo.type === 'image/png' ? await pdf.embedPng(b) : await pdf.embedJpg(await (await canvasBlob(await (async () => { const im = await loadImage(logo), c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0); return c; })(), 'image/jpeg', 0.92)).arrayBuffer()); const k = Math.min(70 / img.width, 54 / img.height); page.drawImage(img, { x: M, y: y - 54 + (54 - img.height * k) / 2, width: img.width * k, height: img.height * k }); tx = M + img.width * k + 14; }
    page.drawText(v('co'), { x: tx, y: y - 20, size: 17, font: sans, color: col });
    page.drawText(v('addr'), { x: tx, y: y - 36, size: 9.5, font: sansR, color: rgb(0.33, 0.33, 0.33) });
    if (v('contact')) page.drawText(v('contact'), { x: tx, y: y - 49, size: 9.5, font: sansR, color: rgb(0.33, 0.33, 0.33) });
    y -= 64; page.drawRectangle({ x: M, y, width: W - 2 * M, height: 2.2, color: col }); y -= 30;
    // Body: the letter as edited on screen, without the letterhead.
    const clone = $('#letter').cloneNode(true); clone.querySelector('.xl-head')?.remove();
    const items = [...clone.children].map(el => ({ tag: el.tagName, right: el.style.textAlign === 'right', boldFirst: !!el.querySelector('b'), text: el.tagName === 'UL' ? [...el.children].map(li => '•  ' + li.innerText.trim()) : [el.innerText.trim()] }));
    const size = 11, lh = 16.5, maxW = W - 2 * M;
    const line = (t, font, sz, opts = {}) => { if (y < M + 20) { page = pdf.addPage([W, H]); y = H - M; } const w = font.widthOfTextAtSize(t, sz); page.drawText(t, { x: opts.center ? (W - w) / 2 : opts.right ? W - M - w : M + (opts.indent || 0), y, size: sz, font, color: rgb(0.1, 0.1, 0.12) }); if (opts.underline) page.drawLine({ start: { x: (W - w) / 2, y: y - 2 }, end: { x: (W + w) / 2, y: y - 2 }, thickness: 0.8 }); y -= opts.lh || lh; };
    const wrap = (t, font, sz, indent = 0) => { const out = []; let cur = ''; for (const w of t.split(/\s+/)) { const tr = cur ? cur + ' ' + w : w; if (font.widthOfTextAtSize(tr, sz) > maxW - indent && cur) { out.push(cur); cur = w; } else cur = tr; } if (cur) out.push(cur); return out; };
    for (const it of items) {
      if (it.tag === 'H3') { line(it.text[0], bold, 13, { center: true, underline: true, lh: 26 }); continue; }
      for (const para of it.text) {
        if (!para) { y -= lh * 0.5; continue; }
        const isBullet = para.startsWith('•'), parts = para.split('\n');
        parts.forEach((part, pi) => { const f = it.boldFirst && pi === 0 ? bold : reg; wrap(part, f, size, isBullet ? 14 : 0).forEach((l, i) => line(l, f, size, { right: it.right, indent: isBullet && i ? 14 : 0 })); });
      }
      y -= it.tag === 'UL' ? 6 : 8;
    }
    const name = (v('name') || 'employee').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase();
    download(new Blob([await pdf.save()], { type: 'application/pdf' }), `${v('type') === 'relieving' ? 'relieving' : 'experience'}-letter-${name}.pdf`);
  } catch (err) { console.error(err); toast('The PDF couldn’t be made. Check your connection and try again.', 'err'); }
  btn.disabled = false;
});
render();
