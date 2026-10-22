'use strict';
// Shared code for hosted QR codes (dynamic link, file and verification tools, and the manage page).
// Needs qrcode-generator (window.qrcode) and app.js helpers ($, esc, download, copyText).
const HostedQR = (() => {
  const api = (window.TF_BASE || '') + '/api/qr.php';

  function matrix(text) {
    const qr = qrcode(0, 'M');
    qr.addData(text, 'Byte');
    qr.make();
    const n = qr.getModuleCount();
    return { n, dark: (r, c) => qr.isDark(r, c) };
  }
  function canvas(text, { size = 720, fg = '#191F24', bg = '#FFFFFF' } = {}) {
    const m = matrix(text), quiet = 4, cell = Math.floor(size / (m.n + quiet * 2)), dim = cell * (m.n + quiet * 2);
    const c = document.createElement('canvas');
    c.width = c.height = dim;
    const x = c.getContext('2d');
    x.fillStyle = bg; x.fillRect(0, 0, dim, dim);
    x.fillStyle = fg;
    for (let r = 0; r < m.n; r++) for (let k = 0; k < m.n; k++) if (m.dark(r, k)) x.fillRect((k + quiet) * cell, (r + quiet) * cell, cell, cell);
    return c;
  }
  function svg(text, { fg = '#191F24', bg = '#FFFFFF' } = {}) {
    const m = matrix(text), q = 4, d = m.n + q * 2;
    let p = '';
    for (let r = 0; r < m.n; r++) for (let k = 0; k < m.n; k++) if (m.dark(r, k)) p += `M${k + q} ${r + q}h1v1h-1z`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${d} ${d}" shape-rendering="crispEdges"><rect width="${d}" height="${d}" fill="${bg}"/><path d="${p}" fill="${fg}"/></svg>`;
  }
  function wireDownloads(root, url, name, colors) {
    root.querySelectorAll('[data-dl]').forEach(b => {
      b.onclick = () => {
        if (b.dataset.dl === 'svg') download(new Blob([svg(url, colors())], { type: 'image/svg+xml' }), `${name}.svg`);
        else canvas(url, { size: 1200, ...colors() }).toBlob(bl => download(bl, `${name}.png`), 'image/png');
      };
    });
  }

  async function post(fields, file) {
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => fd.append(k, typeof v === 'object' ? JSON.stringify(v) : v));
    if (file) fd.append('file', file);
    let r;
    try { r = await fetch(api, { method: 'POST', body: fd, credentials: 'same-origin' }); } catch (e) { throw new Error('Couldn’t reach the server. Check your connection and try again.'); }
    const data = await r.json().catch(() => ({ error: r.status === 413 ? 'That file is too big for this server.' : 'The server sent an unexpected reply.' }));
    if (!r.ok || data.error) throw new Error(data.error || 'Something went wrong.');
    return data;
  }

  // Result panel after creating a code: QR preview, links and downloads.
  function showResult(out, pub, label) {
    const colors = () => ({ fg: (out.querySelector('#hq-fg') || {}).value || '#191F24', bg: '#FFFFFF' });
    const exp = new Date(pub.expires * 1000).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
    out.innerHTML = `<p class="kicker">Your ${esc(label)} QR code</p>
      <div class="qr-box" id="hq-box"></div>
      <div class="fields" style="grid-template-columns:auto 1fr;align-items:end"><label class="f"><span>Colour</span><input type="color" id="hq-fg" value="#191f24"></label>
      <div class="btns"><button type="button" class="btn" data-dl="png">${'Download PNG'}</button><button type="button" class="btn ghost" data-dl="svg">SVG</button></div></div>
      <p class="kicker">QR code link</p><div class="copybox" id="hq-url">${esc(pub.url)}</div>
      <div class="btns"><button type="button" class="btn ghost" data-copy="hq-url">Copy</button><a class="btn ghost" href="${esc(pub.url)}" target="_blank" rel="noopener">Open</a></div>
      <div class="hq-manage"><p class="kicker">Private manage link: save it now</p><div class="copybox" id="hq-manage">${esc(pub.manage)}</div>
      <p class="note">Use it to see scan counts, ${pub.type === 'link' ? 'change where the code points, ' : pub.type === 'verify' ? 'mark the document revoked, ' : ''}or delete the code. It’s shown only once, and anyone who has it can edit the code.</p>
      <div class="btns"><button type="button" class="btn ghost" data-copy="hq-manage">Copy manage link</button><button type="button" class="btn ghost" id="hq-mail">Email it to me</button></div></div>
      <p class="note">This code is hosted until <strong>${esc(exp)}</strong>, then deleted automatically.</p>`;
    const box = out.querySelector('#hq-box');
    const draw = () => { box.innerHTML = ''; const c = canvas(pub.url, colors()); c.setAttribute('aria-label', 'QR code for ' + pub.url); box.appendChild(c); };
    draw();
    out.querySelector('#hq-fg').addEventListener('input', draw);
    wireDownloads(out, pub.url, `qr-${pub.code}`, colors);
    out.querySelector('#hq-mail').onclick = () => { location.href = `mailto:?subject=${encodeURIComponent('My QR code manage link')}&body=${encodeURIComponent(`QR code: ${pub.url}\nManage (keep private): ${pub.manage}\nExpires: ${exp}`)}`; };
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function manage(pub) {
    const root = document.getElementById('manage'), key = root.dataset.key, code = root.dataset.code;
    const box = document.getElementById('qrbox');
    box.appendChild(canvas(pub.url));
    wireDownloads(root, pub.url, `qr-${code}`, () => ({}));
    const msg = document.getElementById('msg');
    document.getElementById('edit').addEventListener('submit', async e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      msg.textContent = 'Saving…';
      try { await post({ action: 'update', code, k: key, ...f }); msg.textContent = 'Saved. The change is live for anyone who scans the code.'; }
      catch (err) { msg.textContent = err.message; }
    });
    document.getElementById('del').addEventListener('click', async () => {
      if (!confirm('Delete this QR code now? Anyone who scans it will see a “not found” page. This can’t be undone.')) return;
      try { await post({ action: 'delete', code, k: key }); root.innerHTML = '<h1>Deleted</h1><p>The QR code and any file were deleted.</p>'; }
      catch (err) { msg.textContent = err.message; }
    });
  }

  return { canvas, svg, post, showResult, manage };
})();
