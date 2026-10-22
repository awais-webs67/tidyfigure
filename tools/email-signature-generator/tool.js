onAny('#name, #title, #company, #phone, #email, #web, #addr, #img, #li, #x, #ig, #tpl, #accent, #font, #note', render);
const safeUrl = u => (/^https?:\/\//i.test(u.trim()) ? u.trim() : '');
let html = '';
function render() {
  const g = id => $('#' + id).value.trim();
  const c = $('#accent').value, font = $('#font').value, tpl = $('#tpl').value;
  const web = safeUrl(g('web')), img = safeUrl(g('img'));
  const link = (href, text) => `<a href="${esc(href)}" style="color:${c};text-decoration:none">${esc(text)}</a>`;
  const socials = [['li', 'LinkedIn'], ['x', 'X'], ['ig', 'Instagram']].filter(([k]) => safeUrl(g(k))).map(([k, l]) => link(safeUrl(g(k)), l)).join(' &nbsp;·&nbsp; ');
  const lines = [
    g('phone') && `<span style="color:#888">T</span>&nbsp; ${link('tel:' + g('phone').replace(/[^\d+]/g, ''), g('phone'))}`,
    g('email') && `<span style="color:#888">E</span>&nbsp; ${link('mailto:' + g('email'), g('email'))}`,
    web && `<span style="color:#888">W</span>&nbsp; ${link(web, web.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))}`,
    g('addr') && `<span style="color:#666">${esc(g('addr'))}</span>`,
  ].filter(Boolean);
  const nameBlock = `<div style="font-size:16px;font-weight:bold;color:#222">${esc(g('name'))}</div>
    <div style="font-size:13px;color:#555">${esc(g('title'))}${g('title') && g('company') ? ' · ' : ''}<span style="color:${c};font-weight:bold">${esc(g('company'))}</span></div>`;
  const contact = `<div style="font-size:12.5px;line-height:1.7;margin-top:6px">${lines.join('<br>')}</div>${socials ? `<div style="font-size:12.5px;margin-top:6px">${socials}</div>` : ''}`;
  const pic = img ? `<img src="${esc(img)}" alt="${esc(g('name'))}" width="80" style="display:block;width:80px;height:auto;border-radius:${tpl === 'stack' ? '0' : '50%'};border:0">` : '';
  const note = g('note') ? `<div style="font-size:11px;color:#888;margin-top:10px;max-width:460px">${esc(g('note'))}</div>` : '';
  if (tpl === 'classic') {
    html = `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${font};color:#333"><tr>${pic ? `<td style="padding-right:14px;vertical-align:top">${pic}</td>` : ''}<td style="border-left:3px solid ${c};padding-left:14px;vertical-align:top">${nameBlock}${contact}</td></tr></table>${note}`;
  } else if (tpl === 'stack') {
    html = `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${font};color:#333">${pic ? `<tr><td style="padding-bottom:8px">${pic}</td></tr>` : ''}<tr><td>${nameBlock}<div style="width:40px;height:3px;background:${c};margin:8px 0;font-size:0;line-height:0">&nbsp;</div>${contact}</td></tr></table>${note}`;
  } else {
    html = `<div style="font-family:${font};font-size:13px;color:#333;line-height:1.6"><strong>${esc(g('name'))}</strong>${g('title') ? ` | ${esc(g('title'))}` : ''}${g('company') ? ` | ${esc(g('company'))}` : ''}<br>${[g('phone') && link('tel:' + g('phone').replace(/[^\d+]/g, ''), g('phone')), g('email') && link('mailto:' + g('email'), g('email')), web && link(web, web.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))].filter(Boolean).join(' | ')}${socials ? `<br>${socials}` : ''}</div>${note}`;
  }
  $('#preview').innerHTML = html;
}
$('#copy').addEventListener('click', async () => {
  const b = $('#copy');
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([$('#preview').innerText], { type: 'text/plain' }) })]);
  } catch (e) {
    selectText($('#preview')); document.execCommand('copy');
  }
  const t = b.innerHTML; b.textContent = 'Copied: now paste it'; setTimeout(() => { b.innerHTML = t; }, 1800);
});
$('#code').addEventListener('click', e => copyText(html, e.currentTarget));
render();
