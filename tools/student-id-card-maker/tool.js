const TYPES = {
  student: {
    tag: 'STUDENT ID CARD', photo: 'Student photo',
    fields: [['org', 'School or college', 'Greenfield Public School'], ['tagline', 'Address or motto', '12 Park Road, Springfield'], ['name', 'Student name', 'Ayesha Khan'], ['role', 'Class and section', 'Class 9 · Section B'], ['id', 'ID / admission no.', 'GPS-2026-0147'], ['roll', 'Roll number', '23'], ['dob', 'Date of birth', '14 Mar 2011'], ['blood', 'Blood group', 'B+'], ['valid', 'Valid until', 'Mar 2027'], ['phone', 'Emergency phone', '+1 555 0142'], ['parent', 'Parent / guardian', 'Imran Khan']],
    rows: [['ID No', 'id'], ['Roll No', 'roll'], ['Date of birth', 'dob'], ['Blood group', 'blood'], ['Valid until', 'valid']],
    back: [['Parent / guardian', 'parent'], ['Emergency', 'phone']],
  },
  employee: {
    tag: 'EMPLOYEE ID CARD', photo: 'Employee photo',
    fields: [['org', 'Company name', 'Northwind Logistics'], ['tagline', 'Address or website', 'northwind.example · 200 Harbour St'], ['name', 'Employee name', 'Daniel Okafor'], ['role', 'Job title', 'Operations Manager'], ['id', 'Employee ID', 'NW-10482'], ['dept', 'Department', 'Operations'], ['joined', 'Date joined', '02 Jan 2024'], ['blood', 'Blood group', 'O+'], ['valid', 'Valid until', 'Dec 2027'], ['phone', 'Emergency phone', '+1 555 0188']],
    rows: [['Employee ID', 'id'], ['Department', 'dept'], ['Joined', 'joined'], ['Blood group', 'blood'], ['Valid until', 'valid']],
    back: [['Emergency', 'phone']],
  },
};
const TYPE = (typeof PRESET !== 'undefined' && PRESET && PRESET.type) || 'student', T = TYPES[TYPE], KEY = `tf-idcard-${TYPE}`;
let photo = null, logo = null, S = {};
try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { /* storage blocked */ }
$('#plabel').textContent = T.photo;
$('#fields').innerHTML = T.fields.map(([k, l, d]) => `<label class="f"><span>${l}</span><input data-k="${k}" value="${esc(S[k] ?? d)}" maxlength="80"></label>`).join('');
for (const k of ['tpl', 'ori', 'color']) if (S['_' + k]) $('#' + k).value = S['_' + k];
const v = k => ($(`[data-k="${k}"]`)?.value || '').trim();
fileDrop($('#pdrop'), $('#photo'), async fs => { photo = await loadImage(fs[0]); draw(); });
fileDrop($('#ldrop'), $('#logo'), async fs => { logo = await loadImage(fs[0]); draw(); });
const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), f = c => Math.round(Math.min(255, Math.max(0, k < 0 ? c * (1 + k) : c + (255 - c) * k))); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; };
function fit(x, text, max, size, weight = 700, family = 'Inter, Arial, sans-serif') { do { x.font = `${weight} ${size}px ${family}`; size -= 1; } while (x.measureText(text).width > max && size > 10); return x.font; }
function rrect(x, a, b, w, h, r) { x.beginPath(); x.roundRect ? x.roundRect(a, b, w, h, r) : x.rect(a, b, w, h); }
function cover(x, img, a, b, w, h) { const k = Math.max(w / img.width, h / img.height), sw = w / k, sh = h / k; x.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2.6, sw, sh, a, b, w, h); }
function photoBox(x, a, b, w, h, col, round) {
  x.save(); rrect(x, a, b, w, h, round); x.fillStyle = '#E9EEF3'; x.fill(); x.clip();
  if (photo) cover(x, photo, a, b, w, h);
  else { x.fillStyle = '#B7C3CF'; x.beginPath(); x.arc(a + w / 2, b + h * 0.4, w * 0.2, 0, 7); x.fill(); x.beginPath(); x.ellipse(a + w / 2, b + h * 0.98, w * 0.38, h * 0.32, 0, Math.PI, 0); x.fill(); }
  x.restore(); x.lineWidth = 6; x.strokeStyle = col; rrect(x, a, b, w, h, round); x.stroke();
}
function logoMark(x, a, b, s, col, onDark) {
  if (logo) { const k = Math.min(s / logo.width, s / logo.height); x.drawImage(logo, a + (s - logo.width * k) / 2, b + (s - logo.height * k) / 2, logo.width * k, logo.height * k); return; }
  const ini = v('org').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'ID';
  x.fillStyle = onDark ? '#fff' : col; x.beginPath(); x.arc(a + s / 2, b + s / 2, s / 2, 0, 7); x.fill();
  x.fillStyle = onDark ? col : '#fff'; x.font = `800 ${s * 0.42}px Inter, Arial, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ini, a + s / 2, b + s / 2 + 2); x.textAlign = 'left'; x.textBaseline = 'alphabetic';
}
function header(x, W, H, col, tpl) {
  x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
  if (tpl === 'band') { const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, col); g.addColorStop(1, shade(col, -0.35)); x.fillStyle = g; x.fillRect(0, 0, W, H * (W > H ? 0.25 : 0.22)); return true; }
  if (tpl === 'curve') { const h = H * (W > H ? 0.27 : 0.24); x.fillStyle = col; x.beginPath(); x.moveTo(0, 0); x.lineTo(W, 0); x.lineTo(W, h * 0.7); x.quadraticCurveTo(W * 0.55, h * 1.35, 0, h * 0.85); x.closePath(); x.fill(); x.fillStyle = shade(col, 0.75); x.beginPath(); x.moveTo(0, H); x.lineTo(W, H); x.lineTo(W, H - h * 0.35); x.quadraticCurveTo(W * 0.4, H - h * 0.7, 0, H - h * 0.2); x.closePath(); x.fill(); return true; }
  x.fillStyle = col; x.fillRect(0, 0, W, 14); return false;
}
function rows(x, list, a, b, w, gap, size, col) {
  list.forEach(([label, k], i) => { const val = v(k); if (!val) return; const y = b + i * gap; x.fillStyle = '#6B7680'; x.font = `600 ${size * 0.78}px Inter, Arial, sans-serif`; x.fillText(label.toUpperCase(), a, y); x.fillStyle = '#16202A'; x.font = fit(x, val, w * 0.58, size, 700); x.fillText(val, a + w * 0.4, y); });
}
function front() {
  const land = $('#ori').value === 'land', W = land ? 1011 : 638, H = land ? 638 : 1011, c = $('#front'), x = c.getContext('2d'), col = $('#color').value, tpl = $('#tpl').value;
  c.width = W; c.height = H;
  const dark = header(x, W, H, col, tpl);
  const vis = T.rows.filter(([, k]) => v(k));
  if (land) {
    logoMark(x, 36, 26, 106, col, dark); x.fillStyle = dark ? '#fff' : '#16202A';
    x.font = fit(x, v('org'), W - 210, 46, 800); x.fillText(v('org'), 162, 80);
    x.font = fit(x, v('tagline'), W - 210, 24, 500); x.fillStyle = dark ? 'rgba(255,255,255,.85)' : '#5F666B'; x.fillText(v('tagline'), 162, 116);
    photoBox(x, 44, 196, 236, 290, col, 18);
    x.fillStyle = '#16202A'; x.font = fit(x, v('name'), W - 360, 50, 800); x.fillText(v('name'), 318, 246);
    x.fillStyle = col; x.font = fit(x, v('role'), W - 360, 30, 700); x.fillText(v('role'), 318, 288);
    rows(x, vis, 318, 344, W - 350, 44, 25, col);
    x.fillStyle = col; x.fillRect(0, H - 62, W, 62); x.fillStyle = '#fff'; x.font = '800 26px Inter, Arial, sans-serif'; x.textAlign = 'center'; x.fillText(T.tag, W / 2, H - 22); x.textAlign = 'left';
  } else {
    logoMark(x, W / 2 - 52, 30, 104, col, dark); x.textAlign = 'center'; x.fillStyle = dark ? '#fff' : '#16202A';
    x.font = fit(x, v('org'), W - 70, 40, 800); x.fillText(v('org'), W / 2, 180);
    x.fillStyle = dark ? 'rgba(255,255,255,.88)' : '#5F666B'; x.font = fit(x, v('tagline'), W - 80, 22, 500); x.fillText(v('tagline'), W / 2, 210);
    x.textAlign = 'left'; photoBox(x, W / 2 - 125, 258, 250, 300, col, 24); x.textAlign = 'center';
    x.fillStyle = '#16202A'; x.font = fit(x, v('name'), W - 60, 50, 800); x.fillText(v('name'), W / 2, 628);
    x.fillStyle = col; x.font = fit(x, v('role'), W - 60, 30, 700); x.fillText(v('role'), W / 2, 668);
    x.textAlign = 'left'; rows(x, vis, 70, 726, W - 140, 40, 24, col);
    x.fillStyle = col; x.fillRect(0, H - 64, W, 64); x.fillStyle = '#fff'; x.font = '800 25px Inter, Arial, sans-serif'; x.textAlign = 'center'; x.fillText(T.tag, W / 2, H - 23); x.textAlign = 'left';
  }
}
function back() {
  const land = $('#ori').value === 'land', W = land ? 1011 : 638, H = land ? 638 : 1011, c = $('#back'), x = c.getContext('2d'), col = $('#color').value;
  c.width = W; c.height = H; x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.fillStyle = col; x.fillRect(0, 0, W, 16); x.fillRect(0, H - 16, W, 16);
  const pad = 48, textW = land && $('#qr').checked ? W - 360 : W - pad * 2;
  x.fillStyle = '#16202A'; x.font = '800 30px Inter, Arial, sans-serif'; x.fillText('Important', pad, 82);
  const lines = [`This card is the property of ${v('org') || 'the issuer'}.`, 'It must be carried at all times and shown on request.', 'If found, please return it to:', v('tagline')].filter(Boolean);
  x.font = '500 24px Inter, Arial, sans-serif'; x.fillStyle = '#3A444D';
  let y = 128;
  for (const l of lines) { const words = l.split(' '); let line = ''; for (const w of words) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > textW && line) { x.fillText(line, pad, y); y += 34; line = w; } else line = t; } x.fillText(line, pad, y); y += 40; }
  y += 6;
  T.back.forEach(([label, k]) => { const val = v(k); if (!val) return; x.fillStyle = '#6B7680'; x.font = '600 20px Inter, Arial, sans-serif'; x.fillText(label.toUpperCase(), pad, y); x.fillStyle = '#16202A'; x.font = fit(x, val, textW - 220, 26, 700); x.fillText(val, pad + 220, y); y += 42; });
  if ($('#qr').checked && window.qrcode) {
    const q = qrcode(0, 'M'); q.addData(`${v('name')} | ${v('id')} | ${v('org')}`); q.make();
    const n = q.getModuleCount(), size = land ? 250 : 300, cell = size / n, qx = land ? W - size - pad : (W - size) / 2, qy = land ? 70 : y + 10;
    x.fillStyle = '#fff'; x.fillRect(qx - 8, qy - 8, size + 16, size + 16); x.fillStyle = '#16202A';
    for (let r = 0; r < n; r++) for (let cc = 0; cc < n; cc++) if (q.isDark(r, cc)) x.fillRect(qx + cc * cell, qy + r * cell, Math.ceil(cell), Math.ceil(cell));
    x.fillStyle = '#6B7680'; x.font = '600 18px Inter, Arial, sans-serif'; x.textAlign = 'center'; x.fillText(v('id'), qx + size / 2, qy + size + 30); x.textAlign = 'left';
  }
  const sy = H - 70; x.strokeStyle = '#9AA3AB'; x.lineWidth = 2; x.beginPath(); x.moveTo(pad, sy); x.lineTo(pad + 300, sy); x.stroke();
  x.fillStyle = '#6B7680'; x.font = '600 19px Inter, Arial, sans-serif'; x.fillText('Authorised signature', pad, sy + 28);
}
function draw() {
  front(); back();
  $('#prev').classList.toggle('portrait', $('#ori').value === 'port');
  const s = { _tpl: $('#tpl').value, _ori: $('#ori').value, _color: $('#color').value }; $$('[data-k]').forEach(i => { s[i.dataset.k] = i.value; });
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage blocked */ }
}
const fname = side => `${(v('name') || 'id-card').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase()}-${side}.png`;
$('#pf').addEventListener('click', () => $('#front').toBlob(b => download(b, fname('front')), 'image/png'));
$('#pb').addEventListener('click', () => $('#back').toBlob(b => download(b, fname('back')), 'image/png'));
$('#pdf').addEventListener('click', async e => {
  const btn = e.currentTarget; btn.disabled = true;
  try {
    if (!window.PDFLib) await loadScript(PDFLIB_URL);
    const { PDFDocument, rgb } = PDFLib, pdf = await PDFDocument.create(), page = pdf.addPage([595.28, 841.89]), mm = 72 / 25.4;
    const land = $('#ori').value === 'land', w = (land ? 85.6 : 54) * mm, h = (land ? 54 : 85.6) * mm, x0 = (595.28 - w * 2 - 10 * mm) / 2, y0 = 841.89 - 40 * mm - h;
    for (const [i, id] of ['front', 'back'].entries()) {
      const img = await pdf.embedPng(await (await canvasBlob($('#' + id), 'image/png')).arrayBuffer()), px = x0 + i * (w + 10 * mm);
      page.drawImage(img, { x: px, y: y0, width: w, height: h });
      const m = 4 * mm, gr = rgb(0.5, 0.5, 0.5);
      for (const [cx, cy] of [[px, y0], [px + w, y0], [px, y0 + h], [px + w, y0 + h]]) { page.drawLine({ start: { x: cx - m - 2, y: cy }, end: { x: cx - 2, y: cy }, thickness: 0.4, color: gr }); page.drawLine({ start: { x: cx + 2, y: cy }, end: { x: cx + m + 2, y: cy }, thickness: 0.4, color: gr }); page.drawLine({ start: { x: cx, y: cy - m - 2 }, end: { x: cx, y: cy - 2 }, thickness: 0.4, color: gr }); page.drawLine({ start: { x: cx, y: cy + 2 }, end: { x: cx, y: cy + m + 2 }, thickness: 0.4, color: gr }); }
    }
    download(new Blob([await pdf.save()], { type: 'application/pdf' }), fname('print').replace('.png', '.pdf'));
  } catch (err) { toast('The PDF couldn’t be made. Download the PNGs instead.', 'err'); }
  btn.disabled = false;
});
$('#reset').addEventListener('click', () => { $$('[data-k]').forEach(i => { i.value = ''; }); photo = logo = null; draw(); });
onAny('[data-k], #tpl, #ori, #color, #qr', draw);
(document.fonts ? document.fonts.ready : Promise.resolve()).then(draw);
