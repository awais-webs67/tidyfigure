'use strict';
// Shared helpers for every tool page. Each tool's own script runs after this file.

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ok = n => Number.isFinite(n);
const val = el => (el ? parseFloat(String(el.value).replace(',', '.')) : NaN);
const fmt = (n, d = 2) => ok(n) ? n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }) : '–';
const fmtMax = (n, d = 2) => ok(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : '–';
const field = (row, name) => row.querySelector(`[data-f="${name}"]`);

// Repeating input rows (pizzas, people, dishes…). rowHtml(values) returns the inner HTML of one row.
function makeList(list, addBtn, rowHtml, initial, onChange) {
  const add = (v = {}) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = rowHtml(v);
    list.appendChild(row);
    return row;
  };
  initial.forEach(add);
  addBtn.addEventListener('click', () => {
    const row = add();
    const first = row.querySelector('input, select');
    if (first) first.focus();
    onChange();
  });
  list.addEventListener('click', e => {
    const b = e.target.closest('.rm');
    if (!b || list.children.length <= 1) return;
    b.closest('.row').remove();
    onChange();
  });
  list.addEventListener('input', onChange);
  list.addEventListener('change', onChange);
}

function onAny(selector, fn) {
  $$(selector).forEach(el => {
    el.addEventListener('input', fn);
    el.addEventListener('change', fn);
  });
}

function selectText(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

const bytes = n => n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`;
const rand = n => crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * n; // fair random float in [0, n)
const randInt = (min, max) => min + Math.floor(rand(max - min + 1));

// Drag-and-drop or click-to-choose files. accept is an <input accept> string.
// ---------- Toasts: short confirmations at the bottom of the screen ("Photo added", "Downloaded") ----------
const TOAST_ICONS = {
  ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  err: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/></svg>',
};
let toastBox = null;
function toast(msg, kind = 'ok') {
  if (!toastBox) {
    toastBox = document.createElement('div');
    toastBox.className = 'toasts'; toastBox.setAttribute('role', 'status'); toastBox.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastBox);
  }
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.innerHTML = `${TOAST_ICONS[kind] || TOAST_ICONS.ok}<span></span>`;
  el.lastChild.textContent = msg;
  toastBox.appendChild(el);
  while (toastBox.children.length > 3) toastBox.firstChild.remove();
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
  setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 250); }, kind === 'err' ? 5000 : 2800);
  return el;
}
const shortName = n => (n.length > 34 ? `${n.slice(0, 22)}…${n.slice(-9)}` : n);
// Does the file match the input's accept list ("image/*", ".pdf", "application/pdf")?
function accepts(input, f) {
  const acc = (input.accept || '').split(',').map(a => a.trim().toLowerCase()).filter(Boolean);
  if (!acc.length) return true;
  const n = f.name.toLowerCase(), t = (f.type || '').toLowerCase();
  return acc.some(a => (a.startsWith('.') ? n.endsWith(a) : a.endsWith('/*') ? t.startsWith(a.slice(0, -1)) : t === a));
}
function addedMessage(files) {
  if (files.length > 1) return `${files.length} files added`;
  const f = files[0], t = f.type || '', n = f.name.toLowerCase();
  const what = t.startsWith('image/') || /\.(heic|heif)$/.test(n) ? 'Photo' : t === 'application/pdf' || n.endsWith('.pdf') ? 'PDF' : t.startsWith('video/') ? 'Video' : t.startsWith('audio/') ? 'Audio' : 'File';
  return `${what} added: ${shortName(f.name)}`;
}

// ---------- "Opening your PDF…" ----------
// A visible card while a chosen file is being opened, so nobody thinks the upload failed. It goes away when the tool
// shows the file (the first change inside the tool after the PDF has been read), when the tool's own work finishes,
// or after a minute at most. Busy.step() changes the line under the title; tools can also call Busy.done().
const Busy = (() => {
  let el = null, obs = null, timer = 0, shownAt = 0;
  const api = { pending: 0 };
  function ensure() {
    if (el) return;
    el = document.createElement('div');
    el.className = 'busy'; el.hidden = true; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
    el.innerHTML = '<div class="busy-card"><span class="busy-spin" aria-hidden="true"></span><b></b><span class="busy-step"></span><small></small></div>';
    document.body.appendChild(el);
  }
  api.show = (title, sub, watch) => {
    ensure();
    el.querySelector('b').textContent = title;
    el.querySelector('small').textContent = sub || '';
    el.querySelector('.busy-step').textContent = '';
    el.hidden = false; shownAt = performance.now();
    clearTimeout(timer); timer = setTimeout(api.hide, 60000);
    if (obs) obs.disconnect();
    if (watch) {
      obs = new MutationObserver(muts => {
        if (api.pending || performance.now() - shownAt < 300 || !muts.some(m => !el.contains(m.target))) return;
        setTimeout(() => { if (!api.pending) api.done(); }, 150);
      });
      obs.observe(watch, { childList: true, subtree: true, characterData: true });
    }
  };
  api.step = text => { if (el && !el.hidden) el.querySelector('.busy-step').textContent = text; };
  api.hide = () => { if (el) el.hidden = true; clearTimeout(timer); if (obs) { obs.disconnect(); obs = null; } };
  api.done = () => { if (!el || el.hidden) return; el.classList.add('out'); setTimeout(() => { el.classList.remove('out'); api.hide(); }, 180); };
  return api;
})();

function fileDrop(zone, input, onFiles) {
  const take = files => {
    if (!files.length) return;
    if (!files.some(f => accepts(input, f))) { toast('This tool can’t open that type of file. Please choose another file.', 'err'); return; }
    toast(addedMessage(files));
    // A PDF can take a few seconds to open (the PDF tools load, then the file is read): show that it's on its way.
    const pdf = files.find(f => f && (f.type === 'application/pdf' || /\.pdf$/i.test(f.name)));
    if (pdf) Busy.show('Opening your PDF…', `${pdf.name} · ${bytes(pdf.size)}`, zone.closest('.tool') || document.body);
    const run = () => {
      let r;
      try { r = onFiles(files); } catch (e) { Busy.hide(); throw e; }
      if (pdf && r && typeof r.then === 'function') r.then(Busy.done, Busy.done);
    };
    if (libsIn) run();
    else { if (pdf) Busy.step('Getting the PDF tools ready…'); libsReady().then(run, () => Busy.hide()); }
  };
  input.dataset.drop = '1'; zone.dataset.zone = '1';
  // Screen readers: the zone is named by its own visible text, and the hidden file input gets the same name.
  if (zone.textContent.trim()) zone.removeAttribute('aria-label');
  if (!input.labels?.length && !input.hasAttribute('aria-label')) input.setAttribute('aria-label', zone.textContent.trim().replace(/\s+/g, ' ').slice(0, 100) || 'Choose a file');
  zone.addEventListener('click', e => { if (e.target !== input) input.click(); });
  zone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
  input.addEventListener('change', () => { const f = [...input.files]; input.value = ''; take(f); });
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('over'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('over'); take([...e.dataTransfer.files]); });
}

// Other file pickers (a logo, a card photo…) confirm the file too.
document.addEventListener('change', e => {
  const i = e.target;
  if (i instanceof HTMLInputElement && i.type === 'file' && !i.dataset.drop && i.files.length) toast(addedMessage([...i.files]));
}, true);

// ---------- Daily download limits (set per tool in the admin panel) ----------
// A "use" is one download; several downloads within a few seconds (a "download all") count once.
const Limit = (() => {
  const cfg = window.TF_LIMIT, key = cfg && `tf-use-${cfg.tool}`, today = () => new Date().toISOString().slice(0, 10);
  let lastUse = 0;
  const read = () => { try { const s = JSON.parse(localStorage.getItem(key)); if (s && s.d === today()) return s; } catch (e) { /* storage blocked */ } return { d: today(), n: 0, bonus: 0 }; };
  const write = s => { try { localStorage.setItem(key, JSON.stringify(s)); } catch (e) { /* storage blocked */ } };
  function allow() {
    if (!cfg) return true;
    if (Date.now() - lastUse < 4000) return true;
    const s = read();
    if (s.n >= cfg.n + s.bonus) return false;
    s.n++; write(s); lastUse = Date.now();
    return true;
  }
  function grant() { const s = read(); s.bonus += cfg.extra; write(s); }
  let box = null;
  function dialog(retry) {
    box?.remove();
    box = document.createElement('div');
    box.className = 'limit-dlg'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'limit-h');
    box.innerHTML = `<div class="limit-box"><p class="kicker">Daily limit reached</p><h2 id="limit-h">You’ve used today’s ${cfg.n} free download${cfg.n === 1 ? '' : 's'}</h2>
      <p class="sub">${cfg.reward ? `Watch a short ad to unlock ${cfg.extra} more, or come back tomorrow.` : 'Come back tomorrow for more free downloads.'} Your work on this page is still here.</p>
      <p class="sub" id="limit-msg"></p>
      <div class="btns">${cfg.reward ? '<button type="button" class="btn" id="limit-ad">Watch an ad</button>' : ''}<button type="button" class="btn ghost" id="limit-close">Close</button></div></div>`;
    document.body.appendChild(box);
    const close = () => { box.remove(); box = null; };
    box.querySelector('#limit-close').onclick = close;
    box.addEventListener('click', e => { if (e.target === box) close(); });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
    const ad = box.querySelector('#limit-ad');
    if (ad) ad.onclick = () => {
      ad.disabled = true; ad.textContent = 'Loading the ad…';
      rewarded(() => { grant(); close(); toast(`Unlocked ${cfg.extra} more downloads`); retry(); },
        msg => { ad.disabled = false; ad.textContent = 'Try again'; box.querySelector('#limit-msg').textContent = msg; });
    };
    (ad || box.querySelector('#limit-close')).focus();
  }
  // Google Ad Manager rewarded ad (the only kind of "watch an ad to unlock" that Google's policies allow).
  function rewarded(ok, fail) {
    let done = false;
    const finish = (good, msg) => { if (done) return; done = true; clearTimeout(timer); good ? ok() : fail(msg); };
    const timer = setTimeout(() => finish(false, 'No ad is available right now. Please try again later or come back tomorrow.'), 15000);
    window.googletag = window.googletag || { cmd: [] };
    if (!document.querySelector('script[src*="gpt.js"]')) { const sc = document.createElement('script'); sc.async = true; sc.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js'; sc.onerror = () => finish(false, 'The ad couldn’t load. An ad blocker may be stopping it.'); document.head.appendChild(sc); }
    googletag.cmd.push(() => {
      const slot = googletag.defineOutOfPageSlot(cfg.reward, googletag.enums.OutOfPageFormat.REWARDED);
      if (!slot) { finish(false, 'Rewarded ads aren’t available on this page or device.'); return; }
      let granted = false;
      const pa = googletag.pubads();
      slot.addService(pa);
      pa.addEventListener('rewardedSlotReady', e => { if (e.slot === slot) e.makeRewardedVisible(); });
      pa.addEventListener('rewardedSlotGranted', e => { if (e.slot === slot) granted = true; });
      pa.addEventListener('rewardedSlotClosed', e => { if (e.slot !== slot) return; googletag.destroySlots([slot]); finish(granted, 'Watch the whole ad to unlock more downloads.'); });
      pa.addEventListener('slotRenderEnded', e => { if (e.slot === slot && e.isEmpty) { googletag.destroySlots([slot]); finish(false, 'No ad is available right now. Please try again later or come back tomorrow.'); } });
      googletag.enableServices();
      googletag.display(slot);
    });
  }
  return { allow, dialog, on: !!cfg };
})();

// Several downloads in a row (a "download all") share one toast.
let lastDl = null;
function download(blob, name) {
  if (!Limit.allow()) { Limit.dialog(() => download(blob, name)); return; }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  const now = Date.now();
  if (lastDl && now - lastDl.at < 1500 && lastDl.el.isConnected) { lastDl.n++; lastDl.at = now; lastDl.el.lastChild.textContent = `Downloaded ${lastDl.n} files`; }
  else lastDl = { at: now, n: 1, el: toast(`Downloaded: ${shortName(name)}`) };
}

// When a long job finishes (its progress bar goes away), say so: "Done" or "Something went wrong".
function watchJobs(out) {
  let busy = !!out.querySelector('[data-pct]'), timer = 0;
  new MutationObserver(() => {
    if (out.querySelector('[data-pct]')) { busy = true; clearTimeout(timer); return; }
    if (!busy) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (out.querySelector('[data-pct]')) return;
      busy = false;
      if (out.querySelector('.verdict.no')) toast('That didn’t work. See the message for what to try.', 'err');
      else toast('Done! Your result is ready.');
    }, 350);
  }).observe(out, { childList: true, subtree: true });
}
document.querySelectorAll('.tool .out').forEach(watchJobs);

// Phones: mark a result panel .live once it shows a real preview, so CSS can keep it on screen (see style.css).
// Phones: a tool's result shows at the top of the tool, in the normal page flow (one scroll, nothing scrolls
// inside a box). When the visitor scrolls down to the options, a small floating copy of the result (like a
// video's mini player) keeps it in view; tapping it goes back to the full result, × folds it into a small tab.
// Panels: .tool-grid > .out (app.js adds .live when it shows a real picture, so CSS can put it first) and any
// element with data-pip. data-pip="last" mirrors the last picture in the panel (e.g. the newest page).
(function miniPreview() {
  const phone = matchMedia('(max-width: 860px)');
  const panels = () => [...document.querySelectorAll('.tool-grid > .out:not([data-nosticky]), [data-pip]')];
  const big = e => { const r = e.getBoundingClientRect(); return r.width >= 120 && r.height >= 90; };
  // The picture a panel shows: the largest canvas, image, video or drawing (or the "after" side of a comparison).
  function source(panel) {
    const all = [...panel.querySelectorAll('canvas, img, video, svg, .compare')].filter(e => !e.closest('.compare') || e.matches('.compare')).filter(e => !(e.matches('svg') && e.closest('button, .btn, a')) && big(e));
    if (!all.length) return null;
    let e = panel.dataset.pip === 'last' ? all[all.length - 1] : all.reduce((a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return rb.width * rb.height > ra.width * ra.height ? b : a; });
    if (e.matches('.compare')) e = e.querySelector('.after canvas, .after img') || e.querySelector('canvas, img') || e;
    return e;
  }
  document.querySelectorAll('.tool-grid > .out').forEach(out => {
    let t = 0;
    const check = () => { clearTimeout(t); t = setTimeout(() => out.classList.toggle('live', phone.matches && !!source(out)), 120); };
    new MutationObserver(check).observe(out, { childList: true, subtree: true, attributes: true, attributeFilter: ['width', 'height', 'src', 'hidden', 'style', 'class'] });
    phone.addEventListener?.('change', check);
    window.addEventListener('load', check);
    check();
  });
  if (!panels().length) return;

  const pip = document.createElement('div');
  pip.className = 'pip'; pip.hidden = true;
  pip.innerHTML = '<button type="button" class="pip-view checker" aria-label="Show the full result"><canvas aria-hidden="true"></canvas><div class="pip-svg" aria-hidden="true"></div></button><button type="button" class="pip-x" aria-label="Fold the preview away">×</button><button type="button" class="pip-tab" hidden>Preview</button>';
  document.body.appendChild(pip);
  const cv = pip.querySelector('canvas'), svgBox = pip.querySelector('.pip-svg'), view = pip.querySelector('.pip-view'), tab = pip.querySelector('.pip-tab');
  let panel = null, src = null, folded = false, timer = 0, lastSvg = '';

  function paint() {
    if (!src || !src.isConnected) return;
    const isSvg = src.matches('svg');
    cv.hidden = isSvg; svgBox.hidden = !isSvg;
    if (isSvg) {
      const html = src.outerHTML;
      if (html !== lastSvg) { lastSvg = html; svgBox.innerHTML = html; const s = svgBox.firstElementChild; s.removeAttribute('id'); s.querySelectorAll('[id]').forEach(n => n.removeAttribute('id')); }
      return;
    }
    const w = src.videoWidth || src.naturalWidth || src.width, h = src.videoHeight || src.naturalHeight || src.height;
    if (!w || !h) return;
    const cssW = Math.min(190, innerWidth * 0.4), k = Math.min(cssW / w, innerHeight * 0.3 / h), dpr = Math.min(2, devicePixelRatio || 1);
    const W = Math.max(1, Math.round(w * k * dpr)), H = Math.max(1, Math.round(h * k * dpr));
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; cv.style.width = `${W / dpr}px`; cv.style.height = `${H / dpr}px`; }
    const x = cv.getContext('2d');
    x.clearRect(0, 0, W, H);
    try { x.drawImage(src, 0, 0, W, H); } catch (e) { /* not ready yet */ }
  }
  function place() {
    const vv = window.visualViewport;
    pip.style.bottom = `${Math.max(10, vv ? innerHeight - vv.offsetTop - vv.height + 10 : 10)}px`;
  }
  function update() {
    let show = false;
    if (phone.matches) {
      const hh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 60;
      for (const p of panels()) {
        const s = source(p);
        if (!s) continue;
        const area = p.closest('.tool-grid, .tool, main') || p.parentElement, ra = area.getBoundingClientRect();
        if (ra.bottom < hh + 120 || ra.top > innerHeight) continue; // the visitor has scrolled away from the tool
        const r = s.getBoundingClientRect(), seen = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, hh)) / Math.min(r.height, innerHeight - hh);
        if (seen < 0.3) { show = true; if (panel !== p || src !== s) { panel = p; src = s; lastSvg = ''; } break; }
      }
    }
    if (show === !pip.hidden) { if (show) paint(); return; }
    pip.hidden = !show;
    clearInterval(timer);
    if (show) { place(); paint(); timer = setInterval(paint, 250); }
  }
  let raf = 0;
  const soon = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); };
  addEventListener('scroll', soon, { passive: true });
  addEventListener('resize', soon);
  window.visualViewport?.addEventListener('resize', () => { place(); soon(); });
  window.visualViewport?.addEventListener('scroll', place);
  phone.addEventListener?.('change', soon);
  setInterval(soon, 1000); // results that appear or change size without a scroll
  function fold(v) { folded = v; pip.classList.toggle('folded', v); tab.hidden = !v; view.hidden = v; pip.querySelector('.pip-x').hidden = v; }
  view.addEventListener('click', () => {
    const r = src.getBoundingClientRect(), hh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 60;
    scrollTo({ top: scrollY + r.top - hh - 10, behavior: 'smooth' });
  });
  pip.querySelector('.pip-x').addEventListener('click', () => fold(true));
  tab.addEventListener('click', () => fold(false));
})();

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`${file.name} isn't an image this browser can open.`));
    img.src = URL.createObjectURL(file);
  });
}
const canvasBlob = (canvas, type, quality) => new Promise(r => canvas.toBlob(r, type, quality));
const baseName = name => name.replace(/\.[^.]+$/, '');

// A generated photo-like test image, so visitors can try image tools without their own file.
async function sampleImage(type = 'image/png') {
  const c = document.createElement('canvas');
  c.width = 2400; c.height = 1600;
  const x = c.getContext('2d');
  const sky = x.createLinearGradient(0, 0, 0, 1600);
  sky.addColorStop(0, '#1d3b6e'); sky.addColorStop(.55, '#f08a4b'); sky.addColorStop(1, '#2b1a2f');
  x.fillStyle = sky; x.fillRect(0, 0, 2400, 1600);
  x.fillStyle = '#ffd38a'; x.beginPath(); x.arc(1600, 900, 170, 0, Math.PI * 2); x.fill();
  [['#3a2a4a', 1000, .0025], ['#24182f', 1150, .004], ['#140d1c', 1300, .006]].forEach(([col, base, f]) => {
    x.fillStyle = col; x.beginPath(); x.moveTo(0, 1600);
    for (let i = 0; i <= 2400; i += 8) x.lineTo(i, base - 180 * Math.sin(i * f) - 90 * Math.sin(i * f * 2.7));
    x.lineTo(2400, 1600); x.fill();
  });
  for (let i = 0; i < 60000; i++) { x.fillStyle = `rgba(255,255,255,${Math.random() * .05})`; x.fillRect(Math.random() * 2400, Math.random() * 1600, 2, 2); }
  const blob = await new Promise(r => c.toBlob(r, type, 0.97));
  return new File([blob], type === 'image/jpeg' ? 'sample-photo.jpg' : 'sample-sunset.png', { type });
}

// List of processed images with before/after sizes and download buttons.
// items: [{ name, before, after, blob, w, h, thumb, error }]
function renderImageResults(out, items, label) {
  const done = items.filter(i => i.blob);
  const before = done.reduce((s, i) => s + i.before, 0), after = done.reduce((s, i) => s + i.after, 0);
  let html = `<p class="kicker">${esc(label)}</p>`;
  if (done.length) {
    const pct = before ? (1 - after / before) * 100 : 0;
    html += `<p class="big"><mark>${bytes(after)}</mark></p><p class="sub">${done.length} image${done.length > 1 ? 's' : ''}, from ${bytes(before)} ${pct > 0.5 ? `(<span class="saving">${pct.toFixed(0)}% smaller</span>)` : pct < -0.5 ? `(${(-pct).toFixed(0)}% larger)` : ''}</p>`;
  }
  html += '<ul class="files">';
  items.forEach((it, i) => {
    const change = it.blob ? (1 - it.after / it.before) * 100 : 0;
    html += `<li>${it.thumb ? `<img src="${it.thumb}" alt="">` : ''}<span class="meta"><b>${esc(it.name)}</b><small>${it.error ? esc(it.error) : it.blob
      ? `${bytes(it.before)} → ${bytes(it.after)}${Math.abs(change) >= 0.5 ? ` · <span class="${change > 0 ? 'saving' : ''}">${change > 0 ? '−' : '+'}${Math.abs(change).toFixed(0)}%</span>` : ''}${it.w ? ` · ${it.w}×${it.h}` : ''}${it.note ? ` · ${esc(it.note)}` : ''}`
      : 'Working…'}</small></span>${it.blob ? `<button type="button" class="btn ghost" data-dl="${i}">Download</button>` : ''}</li>`;
  });
  html += '</ul>';
  if (done.length > 1) html += '<div class="copyrow"><button type="button" class="btn" data-dl="all">Download all</button></div>';
  out.innerHTML = html;
  out.onclick = e => {
    const b = e.target.closest('[data-dl]');
    if (!b) return;
    const list = b.dataset.dl === 'all' ? done : [items[+b.dataset.dl]];
    list.forEach((it, k) => setTimeout(() => download(it.blob, it.outName || it.name), k * 350));
  };
}

function copyText(text, btn) {
  const done = () => { toast('Copied to clipboard'); if (btn) { const t = btn.textContent; btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = t; }, 1400); } };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => {});
}

// <button data-copy="elementId">Copy</button>
document.addEventListener('click', e => {
  const b = e.target.closest('[data-copy]');
  if (!b) return;
  const target = document.getElementById(b.dataset.copy);
  if (!target) return;
  const done = () => { toast('Copied to clipboard'); b.textContent = 'Copied'; setTimeout(() => { b.textContent = 'Copy'; }, 1500); };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(target.innerText).then(done, () => selectText(target));
  } else {
    selectText(target);
  }
});

// Font files for PDFs: from this site first (assets/fonts), then the jsDelivr CDN.
// name: inter, merriweather, roboto-mono or caveat; weight: 400 or 700.
async function fontBytes(name, weight, style = 'normal') {
  const it = style === 'italic' ? '-italic' : '';
  const urls = [`${window.TF_BASE || ''}/assets/fonts/${name}-${weight}${it}.ttf`, `https://cdn.jsdelivr.net/fontsource/fonts/${name}@5.1.0/latin-${weight}-${style}.ttf`];
  for (const u of urls) {
    try { const r = await fetch(u); if (r.ok) return await r.arrayBuffer(); } catch (e) { /* try the next source */ }
  }
  throw new Error('The fonts couldn’t be downloaded. Check your internet connection and try again.');
}

// ---------- Camera and microphone ----------
// A plain-language message for a failed getUserMedia call. what: 'camera' or 'microphone'.
function mediaError(e, what) {
  const n = e && e.name;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return `<span class="verdict no">Not supported</span><p class="sub">This browser can’t use a ${what} on this page. Try a recent Chrome, Edge, Firefox or Safari.</p>`;
  if (n === 'NotAllowedError' || n === 'SecurityError') return `<span class="verdict no">${what === 'camera' ? 'Camera' : 'Microphone'} access is blocked</span><p class="sub">Click the camera or lock icon next to the web address, set ${what === 'camera' ? 'Camera' : 'Microphone'} to <b>Allow</b>, then try again. On a phone, also check that your browser is allowed to use the ${what} in the phone’s settings.</p>`;
  if (n === 'NotFoundError' || n === 'OverconstrainedError' || n === 'DevicesNotFoundError') return `<span class="verdict no">No ${what} found</span><p class="sub">Your device didn’t report a ${what}. Check that it’s plugged in (or switched on in Windows privacy settings or the laptop’s keyboard), then try again.</p>`;
  if (n === 'NotReadableError' || n === 'TrackStartError') return `<span class="verdict no">The ${what} is busy</span><p class="sub">Another app or browser tab is using it. Close Zoom, Teams, Skype, Discord or other tabs that use the ${what}, then try again.</p>`;
  return `<span class="verdict no">The ${what} couldn’t start</span><p class="sub">${esc((e && e.message) || String(e))}</p>`;
}
// Lists cameras ('videoinput') or microphones ('audioinput') in a <select>, keeping the current choice.
async function fillDevices(select, kind, current) {
  if (!select || !navigator.mediaDevices?.enumerateDevices) return;
  const list = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === kind);
  select.innerHTML = list.map((d, i) => `<option value="${esc(d.deviceId)}"${d.deviceId === current ? ' selected' : ''}>${esc(d.label || `${kind === 'videoinput' ? 'Camera' : 'Microphone'} ${i + 1}`)}</option>`).join('');
  select.closest('.f')?.toggleAttribute('hidden', list.length < 2);
}
const stopStream = s => { if (s) s.getTracks().forEach(t => t.stop()); };

// ---------- PDF helpers (pages that load pdf.js and/or pdf-lib) ----------
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
function pdfjs() {
  const lib = window.pdfjsLib;
  // pdf.js wraps a cross-origin worker itself, and falls back to the main thread if workers are blocked.
  if (lib && !lib.GlobalWorkerOptions.workerSrc) lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  return lib;
}
const openPdf = async bytesIn => {
  await libsReady();
  Busy.step('Reading your PDF…');
  Busy.pending++;
  try { return await pdfjs().getDocument({ data: bytesIn.slice(0) }).promise; } finally { Busy.pending--; }
};

async function renderPdfPage(doc, n, scale = 1, background = '#fff') {
  const page = await doc.getPage(n);
  const vp = page.getViewport({ scale });
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(vp.width)); c.height = Math.max(1, Math.round(vp.height));
  const x = c.getContext('2d');
  x.fillStyle = background; x.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: x, viewport: vp }).promise;
  return c;
}

// A small, realistic multi-page PDF so visitors can try PDF tools without their own file.
const PDFLIB_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
const loadScript = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });

// ---------- Big libraries load on the first touch, not with the page ----------
// The page lists them in window.TF_LIBS (pdf.js, pdf-lib…). They start downloading the moment the visitor touches,
// clicks, types or drags anything, so the page itself opens fast. Until they're in, a click on a tool button or a
// chosen file waits for them and then goes through as normal.
let libsP = null, libsIn = !(window.TF_LIBS || []).length;
const libsWaiters = [];
// Run fn once the libraries are in (at once if they already are). Doesn't start loading them.
function onLibs(fn) { if (libsIn) fn(); else libsWaiters.push(fn); }
function libsReady() {
  if (libsIn) return Promise.resolve();
  return libsP || (libsP = Promise.all(window.TF_LIBS.map(src => new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.async = false; // download together, run in order
    s.onload = res; s.onerror = () => rej(new Error('Part of this tool couldn’t load. Check your connection and reload the page.'));
    document.head.appendChild(s);
  }))).then(() => { libsIn = true; libsWaiters.splice(0).forEach(f => f()); }, e => { toast(e.message, 'err'); throw e; }));
}
if (!libsIn) {
  const kick = () => { libsReady().catch(() => {}); ['pointerdown', 'keydown', 'touchstart', 'dragenter', 'focusin'].forEach(t => removeEventListener(t, kick, true)); };
  ['pointerdown', 'keydown', 'touchstart', 'dragenter', 'focusin'].forEach(t => addEventListener(t, kick, { capture: true, passive: true }));
  const wait = el => { el.setAttribute('aria-busy', 'true'); return libsReady().finally(() => el.removeAttribute('aria-busy')); };
  // Tool buttons (Sample, Merge, Download…): hold the click, then replay it.
  document.addEventListener('click', e => {
    if (libsIn) return;
    const b = e.target.closest && e.target.closest('button');
    if (!b || !b.closest('.tool') || b.closest('[data-zone]')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    wait(b).then(() => b.click(), () => {});
  }, true);
  // Files chosen in a picker that isn't a drop zone: hold the change event, then replay it.
  document.addEventListener('change', e => {
    const i = e.target;
    if (libsIn || !(i instanceof HTMLInputElement) || i.type !== 'file' || i.dataset.drop || !i.closest('.tool')) return;
    e.stopImmediatePropagation();
    wait(i).then(() => i.dispatchEvent(new Event('change', { bubbles: true })), () => {});
  }, true);
}

async function samplePdf(pages = 4, title = 'Quarterly report', photo = false) {
  await libsReady().catch(() => {});
  if (!window.PDFLib) await loadScript(PDFLIB_URL);
  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const pdf = await PDFDocument.create();
  pdf.setTitle(title); pdf.setAuthor('Jane Example'); pdf.setCreator('Sample generator'); pdf.setSubject('Sample PDF'); pdf.setKeywords(['sample', 'demo']);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold), reg = await pdf.embedFont(StandardFonts.Helvetica);
  const lines = ['Revenue grew steadily across all regions this quarter.', 'Customer satisfaction scores reached a new high of 92%.', 'The team shipped four major features and fixed 130 bugs.', 'Operating costs fell by 6% thanks to better planning.', 'Next quarter we will focus on mobile and new markets.'];
  for (let i = 1; i <= pages; i++) {
    const p = pdf.addPage([595.28, 841.89]);
    p.drawRectangle({ x: 0, y: 781, width: 595.28, height: 61, color: rgb(1, 0.357, 0.208) });
    p.drawText(`${title}`, { x: 50, y: 803, size: 22, font: bold, color: rgb(1, 1, 1) });
    p.drawText(`Page ${i} of ${pages}`, { x: 50, y: 730, size: 28, font: bold, color: rgb(0.1, 0.12, 0.14) });
    lines.forEach((l, k) => p.drawText(l, { x: 50, y: 680 - k * 26, size: 13, font: reg, color: rgb(0.2, 0.25, 0.28) }));
    if (photo) {
      // A big lossless photo, like a scan, so compression has something to work on.
      const img = await pdf.embedPng(new Uint8Array(await (await sampleImage('image/png')).arrayBuffer()));
      p.drawImage(img, { x: 50, y: 60, width: 495, height: 330 });
    } else {
      [0.6, 0.85, 0.45, 0.95].forEach((h, k) => p.drawRectangle({ x: 70 + k * 120, y: 300, width: 70, height: 220 * h, color: rgb(0.2, 0.25, 0.28 + k * 0.1) }));
    }
  }
  const b = await pdf.save();
  return new File([b], 'sample-report.pdf', { type: 'application/pdf' });
}
const isPdf = f => f && (f.type === 'application/pdf' || /\.pdf$/i.test(f.name));

// A pdf-lib page as people see it. Some PDFs store a page sideways with a note to turn it (rotation),
// or show only part of it (crop box). Work in the page as displayed: w × h, x to the right and y up from
// its bottom-left corner. at(x, y) gives the PDF's own coordinates and angle is the rotation that keeps
// text and images upright.
function pageView(page) {
  const { x: x0, y: y0, width: W, height: H } = page.getCropBox();
  const rot = ((page.getRotation().angle % 360) + 360) % 360;
  const side = rot === 90 || rot === 270;
  const at = (x, y) => rot === 90 ? [x0 + W - y, y0 + x] : rot === 180 ? [x0 + W - x, y0 + H - y] : rot === 270 ? [x0 + y, y0 + H - x] : [x0 + x, y0 + y];
  return { w: side ? H : W, h: side ? W : H, at, angle: rot };
}

// Result panel for PDF tools: thumbnails of the new file, so people check it before downloading.
async function showPdfResult(out, pdfBytes, { title = 'Your PDF', name = 'document.pdf', headline = '', note = '', label = 'Download PDF', blob = null, max = 8 } = {}) {
  const file = blob || new Blob([pdfBytes], { type: 'application/pdf' });
  out.innerHTML = `<p class="kicker">${esc(title)}</p>${headline}<div class="pdf-thumbs" aria-label="Preview of the new PDF"><p class="sub">Making preview…</p></div>
    <p class="sub pdf-meta"></p><div class="btns"><button type="button" class="btn big-btn pdf-dl">${esc(label)}</button></div>${note ? `<p class="note">${note}</p>` : ''}`;
  out.querySelector('.pdf-dl').onclick = () => download(file, name);
  const box = out.querySelector('.pdf-thumbs');
  try {
    const doc = await openPdf(pdfBytes);
    out.querySelector('.pdf-meta').textContent = `${name} · ${doc.numPages} page${doc.numPages > 1 ? 's' : ''} · ${bytes(file.size)}`;
    box.innerHTML = '';
    for (let i = 1; i <= Math.min(doc.numPages, max); i++) {
      const c = await renderPdfPage(doc, i, 0.3);
      const f = document.createElement('figure');
      f.appendChild(c); f.insertAdjacentHTML('beforeend', `<figcaption>${i}</figcaption>`);
      box.appendChild(f);
    }
    if (doc.numPages > max) box.insertAdjacentHTML('beforeend', `<p class="sub more">+ ${doc.numPages - max} more page${doc.numPages - max > 1 ? 's' : ''}</p>`);
  } catch (e) { box.innerHTML = '<p class="sub">Preview isn’t available, but the file is ready.</p>'; }
  out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---------- Single-image tools ----------
// Calls onImage(img, file) with a loaded <img> for the first image dropped or chosen.
function pickImage(zone, input, onImage) {
  fileDrop(zone, input, async files => {
    const f = files.find(x => x.type.startsWith('image/') || /\.(heic|avif|svg)$/i.test(x.name));
    if (!f) return;
    try { onImage(await loadImage(f), f); } catch (e) { const s = zone.querySelector('span'); if (s) s.textContent = e.message; }
  });
}
const extOf = type => ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[type] || 'png');
const outType = file => (['image/png', 'image/webp'].includes(file.type) ? file.type : 'image/jpeg');

// ---------- Body measurements (health tools) ----------
// Markup: a .seg with name="units" (metric|imperial) and inputs #cm, #kg, #ft, #in, #lb inside [data-units] groups.
function bodyUnits(onChange) {
  const metric = () => $('input[name="units"]:checked').value === 'metric';
  const sync = () => { $$('[data-units]').forEach(el => { el.hidden = el.dataset.units !== (metric() ? 'metric' : 'imperial'); }); onChange(); };
  onAny('input[name="units"]', sync);
  return {
    metric,
    cm: () => (metric() ? val($('#cm')) : ((val($('#ft')) || 0) * 12 + (val($('#in')) || 0)) * 2.54),
    kg: () => (metric() ? val($('#kg')) : val($('#lb')) * 0.45359237),
    w: kg => (metric() ? `${fmt(kg, 1)} kg` : `${fmt(kg / 0.45359237, 1)} lb`),
    sync,
  };
}

// Progress bar markup and updater.
const progressHtml = label => `<p class="kicker">${esc(label)}</p><div class="bar"><i style="width:0%"></i></div><p class="sub" data-pct>0%</p>`;
function setProgress(out, p, text) {
  const i = out.querySelector('.bar i'), s = out.querySelector('[data-pct]');
  if (i) i.style.width = `${Math.round(p * 100)}%`;
  if (s) s.textContent = text || `${Math.round(p * 100)}%`;
}
