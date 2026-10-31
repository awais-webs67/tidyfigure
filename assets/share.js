'use strict';
// Share pages: friendship quiz, giveaway and wedding invitation (see app/share.php and api/share.php).
// window.Share holds the parts the maker tools use (saving, the result panel with the link and secret code,
// the "made on this device" list). When the page sets window.SHARE, this file also draws the public page or,
// with SHARE.manage, the maker's private manage page. Needs app.js ($, esc, download, toast).
(() => {
  const base = window.TF_BASE || '';
  const api = base + '/api/share.php';
  const ICON = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.9 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z"/></svg>',
    tg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3 18.7 19.5c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5L18 6.3c.4-.4-.1-.6-.6-.2L6.4 13.1l-4.8-1.5c-1-.3-1-1 .2-1.5l18.8-7.2c.9-.3 1.6.2 1.3 1.6z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>',
    trash: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
  };

  // ---------- server ----------
  async function post(fields, file) {
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, typeof v === 'object' ? JSON.stringify(v) : v); });
    if (file) fd.append('image', file);
    let r;
    try { r = await fetch(api, { method: 'POST', body: fd, credentials: 'same-origin' }); } catch (e) { throw new Error('Couldn’t reach the server. Check your connection and try again.'); }
    const data = await r.json().catch(() => ({ error: r.status === 413 ? 'That picture is too big for this server.' : 'The server sent an unexpected reply. Please try again.' }));
    if (!r.ok || data.error) throw new Error(data.error || 'Something went wrong.');
    return data;
  }

  // ---------- what this device made (so makers find their pages again without an account) ----------
  const MINE = 'tf-mine';
  const mine = {
    all() { try { return JSON.parse(localStorage.getItem(MINE)) || []; } catch (e) { return []; } },
    add(rec) { try { const l = mine.all().filter(x => x.code !== rec.code); l.unshift(rec); localStorage.setItem(MINE, JSON.stringify(l.slice(0, 40))); } catch (e) { /* storage blocked */ } },
    remove(code) { try { localStorage.setItem(MINE, JSON.stringify(mine.all().filter(x => x.code !== code))); } catch (e) { /* storage blocked */ } },
    get(code) { return mine.all().find(x => x.code === code); },
  };
  const manageUrl = (code, key) => `${base}/s/${code}/manage?k=${encodeURIComponent(key)}`;
  const store = (k, v) => { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } };

  // ---------- small parts ----------
  function shareButtons(url, text) {
    const u = encodeURIComponent(url), t = encodeURIComponent(text);
    return `<div class="sh-share">
      <a class="wa" href="https://wa.me/?text=${t}%20${u}" target="_blank" rel="noopener">${ICON.wa}WhatsApp</a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener">${ICON.fb}Facebook</a>
      <a href="https://x.com/intent/post?text=${t}&url=${u}" target="_blank" rel="noopener">${ICON.x}X</a>
      <a href="https://t.me/share/url?url=${u}&text=${t}" target="_blank" rel="noopener">${ICON.tg}Telegram</a>
      <button type="button" data-sh-copy="${esc(url)}">${ICON.copy}Copy link</button>
      ${navigator.share ? `<button type="button" data-sh-native="${esc(url)}" data-text="${esc(text)}">${ICON.share}More</button>` : ''}</div>`;
  }
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-sh-copy]');
    if (c) { copy(c.dataset.shCopy); return; }
    const n = e.target.closest('[data-sh-native]');
    if (n) navigator.share({ url: n.dataset.shNative, text: n.dataset.text }).catch(() => {});
  });
  function copy(text) {
    const done = () => toast('Copied');
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => fallback());
    else fallback();
    function fallback() { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ } t.remove(); }
  }

  // Counts down to `endsMs` (server time); calls onEnd once at zero.
  function countdown(el, endsMs, offset, onEnd, labels = ['Days', 'Hours', 'Min', 'Sec']) {
    el.innerHTML = labels.map(l => `<div><b>0</b><span>${esc(l)}</span></div>`).join('');
    const b = [...el.querySelectorAll('b')];
    let fired = false;
    const tick = () => {
      let s = Math.max(0, Math.floor((endsMs - (Date.now() + offset)) / 1000));
      const v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
      v.forEach((n, i) => { const t = i ? String(n).padStart(2, '0') : String(n); if (b[i].textContent !== t) b[i].textContent = t; });
      if (!s && !fired) { fired = true; clearInterval(timer); if (onEnd) onEnd(); }
    };
    const timer = setInterval(tick, 1000);
    tick();
    return () => clearInterval(timer);
  }

  function confetti(colors) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = document.createElement('canvas'), x = c.getContext('2d');
    c.className = 'sh-confetti'; document.body.appendChild(c);
    const W = c.width = innerWidth * devicePixelRatio, H = c.height = innerHeight * devicePixelRatio;
    const cols = colors || ['#FF5B35', '#FFB703', '#22C55E', '#3B82F6', '#A855F7', '#EC4899'];
    const p = Array.from({ length: 160 }, () => ({ x: W / 2 + (Math.random() - .5) * W * .3, y: H * .35, vx: (Math.random() - .5) * 26 * devicePixelRatio, vy: (-Math.random() * 22 - 8) * devicePixelRatio, r: (4 + Math.random() * 6) * devicePixelRatio, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6, s: (Math.random() - .5) * .4 }));
    const t0 = performance.now();
    (function frame(t) {
      x.clearRect(0, 0, W, H);
      for (const q of p) { q.vy += .7 * devicePixelRatio; q.vx *= .99; q.x += q.vx; q.y += q.vy; q.a += q.s; x.save(); x.translate(q.x, q.y); x.rotate(q.a); x.fillStyle = q.c; x.fillRect(-q.r / 2, -q.r / 3, q.r, q.r * .66); x.restore(); }
      if (t - t0 < 3200) requestAnimationFrame(frame); else c.remove();
    })(t0);
  }

  function csv(rows) { return rows.map(r => r.map(v => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(',')).join('\n'); }
  const when = s => new Date(s * 1000).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
  const day = s => new Date(s * 1000).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });

  // ---------- maker tools: after "Create" ----------
  // res = server reply to create; o = { what: 'quiz', title, text: share message }
  function donePanel(out, res, o) {
    mine.add({ code: res.code, key: res.key, type: o.type, title: res.title, at: Date.now() });
    out.innerHTML = `<div class="sh-done">
      <p class="kicker">Ready to share</p><h3>${esc(o.heading || 'Your page is ready! 🎉')}</h3>
      <div class="sh-link"><input type="text" readonly value="${esc(res.url)}" aria-label="Link to share"><button type="button" class="btn" data-sh-copy="${esc(res.url)}">Copy</button></div>
      ${shareButtons(res.url, o.text || res.title)}
      <div class="sh-secret"><p class="kicker">Your secret code: save it now</p><div class="code">${esc(res.key)}</div>
        <p>With this code you can ${esc(o.can || 'see everything, edit it and delete it')}. There’s no account, so <b>we can’t send it to you again</b>. Take a screenshot or copy it somewhere safe.</p>
        <div class="btns" style="justify-content:center"><button type="button" class="btn ghost" data-sh-copy="${esc(res.key)}">Copy secret code</button><a class="btn" href="${esc(res.manage)}">Open my manage page</a></div></div>
      <div class="btns"><a class="btn ghost" href="${esc(res.url)}" target="_blank" rel="noopener">Open the page</a></div></div>`;
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    confetti();
  }

  // "Made on this device" list + "open with your secret code" form, shown on each maker tool.
  function mineBox(el, type, noun) {
    const list = mine.all().filter(x => x.type === type);
    el.innerHTML = `${list.length ? `<p class="kicker">Your ${esc(noun)}s on this device</p><div class="sh-mine">${list.map(x => `<a href="${esc(manageUrl(x.code, x.key))}">${esc(x.title || x.code)}<small>${new Date(x.at).toLocaleDateString()}</small></a>`).join('')}</div>` : ''}
      <details${list.length ? '' : ' open'}><summary class="kicker" style="cursor:pointer">Made one on another device? Open it with your secret code</summary>
      <form class="sh-open" style="margin-top:10px"><label class="f"><span>Link or page code</span><input type="text" name="c" placeholder="…/s/aB3dE9x" required></label>
      <label class="f"><span>Secret code</span><input type="text" name="k" placeholder="ABCD-EFGH-JKMN" autocapitalize="characters" required></label><button class="btn">Open</button></form></details>`;
    el.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      const c = (e.target.c.value.trim().match(/([A-Za-z0-9]{4,12})(?:\/manage)?\/?(?:\?.*)?$/) || [])[1];
      if (!c) { toast('Paste the link you shared, or its code.', 'err'); return; }
      location.href = manageUrl(c, e.target.k.value.trim());
    });
  }

  // Tool page opened from a manage page's "Edit" (…?edit=<code>#k=<secret>): load the saved page into the form.
  async function editLoad() {
    const code = new URLSearchParams(location.search).get('edit');
    if (!code) return null;
    const key = (location.hash.match(/k=([^&]+)/) || [])[1] || (mine.get(code) || {}).key;
    if (!key) { toast('Open “Edit” from your manage page.', 'err'); return null; }
    try { return { ...(await post({ action: 'get', code, k: decodeURIComponent(key) })), key: decodeURIComponent(key) }; } catch (e) { toast(e.message, 'err'); return null; }
  }

  // Report link on public pages.
  function wireReport(code) {
    const b = $('#sh-report');
    if (b) b.onclick = async () => { if (!confirm('Report this page as harmful, a scam or illegal?')) return; try { await post({ action: 'report', code }); } catch (e) { /* ignore */ } b.outerHTML = '<b>Thanks, we’ll review it.</b>'; };
  }

  window.Share = { post, mine, manageUrl, shareButtons, countdown, confetti, donePanel, mineBox, editLoad, csv, ICON, copy };

  // =====================================================================
  // Public and manage pages
  // =====================================================================
  const S = window.SHARE;
  if (!S) return;
  const app = $('#sh-app');
  const offset = S.now * 1000 - Date.now(); // server clock minus this device's clock
  wireReport(S.code);

  // ---------- manage header (all types) ----------
  function manageHead(noun, extra = '') {
    return `<section class="sh-card">
      <p class="sh-kicker">Your private manage page</p><h1>${esc(S.title)}</h1>
      <div class="sh-link"><input type="text" readonly value="${esc(S.url)}" aria-label="Link"><button type="button" class="btn" data-sh-copy="${esc(S.url)}">Copy</button><a class="btn ghost" href="${esc(S.url)}" target="_blank" rel="noopener">Open</a></div>
      ${shareButtons(S.url, S.title)}
      <div class="sh-stats"><div><b>${S.views}</b><span>Visits</span></div><div><b>${S.list.length}</b><span>${esc(noun)}</span></div>${extra}<div><b style="font-size:17px">${esc(day(S.expires))}</b><span>Deleted automatically on</span></div></div>
      <div class="sh-secret"><p class="kicker">Secret code</p><div class="code">${esc(S.key)}</div><p>Anyone with this code (or this page’s address) can see and change everything. Keep it private.</p></div>
      <div class="sh-row"><a class="btn ghost" href="${esc(S.edit)}#k=${encodeURIComponent(S.key)}">Edit</a><button type="button" class="btn ghost" id="m-del" style="border-color:var(--bad);color:var(--bad)">${ICON.trash} Delete everything</button></div>
    </section>`;
  }
  function wireManage() {
    mine.add({ code: S.code, key: S.key, type: S.type, title: S.title, at: (S.created || 0) * 1000 || Date.now() });
    $('#m-del').onclick = async () => {
      if (!confirm('Delete this page and all its ' + (S.type === 'wedding' ? 'replies' : 'entries') + '? This can’t be undone.')) return;
      try { await post({ action: 'delete', code: S.code, k: S.key }); mine.remove(S.code); app.innerHTML = '<section class="sh-card sh-center"><h1>Deleted</h1><p class="sub">The page and everything in it are gone.</p><p><a class="sh-btn" href="' + esc(S.tool) + '">Make a new one</a></p></section>'; } catch (e) { toast(e.message, 'err'); }
    };
    app.addEventListener('click', async e => {
      const b = e.target.closest('[data-rm]');
      if (!b || !confirm('Remove this entry?')) return;
      try { await post({ action: 'remove_entry', code: S.code, k: S.key, id: b.dataset.rm }); b.closest('tr, li').remove(); toast('Removed'); } catch (err) { toast(err.message, 'err'); }
    });
  }

  // =====================================================================
  // Quiz
  // =====================================================================
  const qtext = (q, name) => q.replace(/\{n\}/g, name);
  function rating(p, name) {
    if (p >= 100) return `Soulmate level! You know ${name} perfectly 💯`;
    if (p >= 80) return `Best friend! 🤝 You really know ${name}`;
    if (p >= 60) return `Close friend 😊`;
    if (p >= 40) return `Good friend 🙂 Room to learn more`;
    if (p >= 20) return `Did you just meet ${name}? 😅`;
    return `Total stranger 🙈`;
  }
  function board(list, meId) {
    if (!list.length) return '<p class="sub">No one has played yet. Be the first!</p>';
    return `<ol class="qz-board">${list.map((e, i) => `<li${e.id === meId ? ' class="me"' : ''}><span class="rk">${i + 1}</span><span class="nm">${esc(e.name)}</span><span class="sc">${e.score}/${S.d.qs.length}</span>${S.manage ? `<button type="button" class="sh-x" data-rm="${e.id}" aria-label="Remove">${ICON.trash}</button>` : ''}</li>`).join('')}</ol>`;
  }

  function quizPage() {
    const d = S.d, n = d.name, total = d.qs.length, done = store('tf-qz-' + S.code);
    const own = mine.get(S.code);
    const hero = `<section class="sh-card sh-hero"><div class="sh-avatar">${esc(n.slice(0, 1).toUpperCase())}</div><p class="sh-kicker">Friendship quiz</p>
      <h1>How well do you know <em>${esc(n)}</em>?</h1><p class="sh-meta"><span><b>${total}</b> questions</span><span><b>${S.entries}</b> ${S.entries === 1 ? 'friend' : 'friends'} played</span></p>`;
    const ownBox = own ? `<section class="sh-card"><p class="sh-kicker">This is your quiz</p><p>Share it with your friends and see who knows you best.</p>${shareButtons(S.url, `How well do you know me? Take my quiz 👇`)}<a class="sh-btn soft" href="${esc(manageUrl(S.code, own.key))}">See everyone’s answers</a></section>` : '';
    if (done) { result(done); return; }
    app.innerHTML = ownBox + hero + `<form class="sh-form" id="qz-start" style="max-width:420px"><input class="sh-input" name="name" maxlength="30" placeholder="Your name" autocomplete="given-name" required aria-label="Your name"><button class="sh-btn wide">Start the quiz</button></form></section>
      <section class="sh-card"><h2>Scoreboard</h2>${board(S.board)}</section>`;
    $('#qz-start').addEventListener('submit', e => { e.preventDefault(); const me = e.target.name.value.trim(); if (me) play(me); });

    function play(me) {
      const ans = [];
      let i = 0;
      const show = () => {
        const q = d.qs[i];
        app.innerHTML = `<section class="sh-card"><div class="qz-progress"><i style="width:${i / total * 100}%"></i></div><p class="qz-count">Question ${i + 1} of ${total}</p>
          <p class="qz-q">${esc(qtext(q.q, n))}</p><div class="qz-opts${q.o.some(o => o.length > 22) ? ' one' : ''}">${q.o.map((o, k) => `<button type="button" class="qz-opt" data-k="${k}">${esc(o)}</button>`).join('')}</div></section>`;
        app.querySelectorAll('.qz-opt').forEach(b => b.addEventListener('click', async () => {
          const k = +b.dataset.k;
          app.querySelectorAll('.qz-opt').forEach(x => { x.disabled = true; });
          ans[i] = k;
          let a = -1;
          try { a = (await post({ action: 'check', code: S.code, i })).a; } catch (err) { /* scored on the server at the end anyway */ }
          app.querySelectorAll('.qz-opt').forEach(x => { const xk = +x.dataset.k; if (xk === a) x.classList.add('ok'); else if (xk === k) x.classList.add('no'); else x.classList.add('dim'); });
          setTimeout(() => { i++; if (i < total) show(); else finish(); }, a === k ? 750 : 1300);
        }));
      };
      const finish = async () => {
        app.innerHTML = '<section class="sh-card sh-center"><p class="sh-kicker">Working out your score…</p></section>';
        try {
          const r = await post({ action: 'play', code: S.code, name: me, ans });
          const rec = { name: me, id: r.id, score: r.score, total: r.total, ans, answers: r.answers };
          store('tf-qz-' + S.code, rec);
          S.board = r.board;
          result(rec, true);
        } catch (err) { app.innerHTML = `<section class="sh-card sh-center"><p class="sh-err">${esc(err.message)}</p><button class="sh-btn" onclick="location.reload()">Try again</button></section>`; }
      };
      show();
    }

    function result(rec, fresh) {
      const p = Math.round(rec.score / rec.total * 100);
      app.innerHTML = `<section class="sh-card sh-hero"><p class="sh-kicker">${esc(rec.name)}, your score</p>
        <div class="qz-ring" style="--p:${p}"><div><b>${rec.score}/${rec.total}</b><small>${p}%</small></div></div>
        <p class="qz-rate">${esc(rating(p, n))}</p>
        <p class="sub">Now make your own quiz and see how well your friends know <b>you</b>.</p>
        <a class="sh-btn wide" href="${esc(S.tool)}">Make my own quiz</a></section>
        <section class="sh-card"><h2>Challenge your friends</h2><p class="sub">Send ${esc(n)}’s quiz to friends and see who scores higher.</p>${shareButtons(S.url, `How well do you know ${n}? I got ${rec.score}/${rec.total} 😎 Can you beat me?`)}</section>
        <section class="sh-card"><h2>Scoreboard</h2>${board(S.board, rec.id)}</section>
        ${rec.answers ? `<section class="sh-card"><h2>Your answers</h2><div class="qz-review">${d.qs.map((q, k) => { const right = rec.ans[k] === rec.answers[k]; return `<div><b>${right ? '✅' : '❌'}</b><span>${esc(qtext(q.q, n))}<br><small>${right ? 'You said' : 'Right answer'}: <b>${esc(q.o[rec.answers[k]] ?? '')}</b>${right ? '' : ` · you said ${esc(q.o[rec.ans[k]] ?? '–')}`}</small></span></div>`; }).join('')}</div></section>` : ''}`;
      if (fresh && p >= 60) confetti();
      scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function quizManage() {
    const d = S.d;
    app.innerHTML = manageHead('Friends played', `<div><b>${S.list.length ? Math.round(S.list.reduce((s, e) => s + e.score, 0) / S.list.length * 10) / 10 : 0}</b><span>Average score</span></div>`) +
      `<section class="sh-card"><h2>Scoreboard</h2>${board(S.board)}</section>
      <section class="sh-card"><h2>Your answers</h2><div class="qz-review">${d.qs.map(q => `<div><b>•</b><span>${esc(qtext(q.q, d.name))}<br><small>Answer: <b>${esc(q.o[q.a])}</b></small></span></div>`).join('')}</div></section>
      <section class="sh-card"><h2>Everyone’s answers</h2>${S.list.length ? `<div class="sh-scroll"><table class="sh-table"><thead><tr><th>Name</th><th>Score</th><th>When</th>${d.qs.map((q, i) => `<th title="${esc(qtext(q.q, d.name))}">Q${i + 1}</th>`).join('')}</tr></thead><tbody>${S.list.slice().reverse().map(e => `<tr><td>${esc(e.name)}</td><td>${e.score}/${d.qs.length}</td><td>${esc(when(e.at))}</td>${d.qs.map((q, i) => { const a = (e.d.ans || [])[i]; return `<td>${a === q.a ? '✅' : '❌'} ${esc(q.o[a] ?? '–')}</td>`; }).join('')}</tr>`).join('')}</tbody></table></div>` : '<p class="sub">No one has played yet. Share your link!</p>'}</section>`;
    wireManage();
  }

  // =====================================================================
  // Giveaway
  // =====================================================================
  const FIELD_TYPES = { email: 'email', phone: 'tel', instagram: 'text', tiktok: 'text', youtube: 'text', facebook: 'text', city: 'text' };
  const PLACE = { email: 'you@example.com', phone: '0300 1234567', instagram: '@username', tiktok: '@username' };
  function giveawayPage() {
    const d = S.d, ended = d.ends * 1000 <= Date.now() + offset, mineRec = store('tf-gv-' + S.code), own = mine.get(S.code);
    const img = S.image ? `<img class="gv-img" src="${esc(S.image)}" alt="">` : `<div class="gv-gift">${ICON.gift}</div>`;
    const steps = d.steps.length ? `<section class="sh-card"><h2>How to enter</h2><ol class="gv-steps">${d.steps.map((s, i) => `<li data-i="${i}"${store(`tf-gv-${S.code}-s${i}`) ? ' class="done"' : ''}><span>${esc(s.t)}</span>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener nofollow">Open</a>` : ''}</li>`).join('')}</ol></section>` : '';
    const ownBox = own ? `<section class="sh-card"><p class="sh-kicker">This is your giveaway</p>${shareButtons(S.url, `🎁 Giveaway: ${d.title}. Enter here 👇`)}<a class="sh-btn soft" href="${esc(manageUrl(S.code, own.key))}">See entries and pick winners</a></section>` : '';
    let body;
    if (ended) {
      body = `<section class="sh-card sh-hero"><p class="sh-kicker">Giveaway ended</p>${S.winners.length ? `<h2>${S.winners.length > 1 ? 'The winners are' : 'The winner is'} 🎉</h2><ul class="gv-win" style="width:100%">${S.winners.map(w => `<li><span>${esc(w.name)}${w.handle ? `<small>${esc(w.handle)}</small>` : ''}</span></li>`).join('')}</ul><p class="gv-fair">Picked at random by ${esc(S.site)} from all ${S.entries} entries. ${d.host ? esc(d.host) + ' will contact the winner.' : ''}</p>` : `<h2>${S.entries ? 'The winner will be announced soon' : 'No one entered this giveaway'}</h2><p class="sub">${S.entries ? 'Check back on this page.' : ''}</p>`}</section>`;
    } else if (mineRec) {
      body = `<section class="sh-card sh-hero"><p class="sh-kicker">You’re in! 🎉</p><h2>Good luck, ${esc(mineRec.name)}</h2><p class="sub">Winners are shown on this page when the countdown ends. Share it with friends:</p>${shareButtons(S.url, `🎁 I just entered this giveaway: ${d.title}. Enter too 👇`)}</section>`;
    } else {
      body = `<section class="sh-card"><h2>Enter the giveaway</h2><form class="sh-form" id="gv-form">
        <label>Your name<input class="sh-input" name="name" maxlength="60" autocomplete="name" required></label>
        ${d.fields.map(f => `<label>${esc(f.label)}${f.req ? '' : ' <small>(optional)</small>'}<input class="sh-input" name="${esc(f.k)}" type="${FIELD_TYPES[f.k] || 'text'}" maxlength="200" placeholder="${esc(PLACE[f.k] || '')}"${f.req ? ' required' : ''}${f.k === 'email' ? ' autocomplete="email"' : f.k === 'phone' ? ' autocomplete="tel"' : ''}></label>`).join('')}
        <p class="sh-err" id="gv-err" hidden></p><button class="sh-btn wide">${ICON.gift} Enter giveaway</button>
        <p class="note" style="text-align:center">Your details go only to ${d.host ? esc(d.host) : 'the giveaway’s host'}, to contact the winner. They’re deleted 30 days after the giveaway ends.</p></form></section>`;
    }
    app.innerHTML = ownBox + `<section class="sh-card sh-hero">${img}<p class="sh-kicker">${d.host ? 'Giveaway by ' + esc(d.host) : 'Giveaway'}</p><h1>${esc(d.title)}</h1>${d.prize ? `<p class="gv-prize">${esc(d.prize)}</p>` : ''}
      ${ended ? '' : `<p class="sh-kicker" style="margin-top:6px">Ends in</p><div class="gv-clock" id="gv-clock"></div>`}
      <p class="sh-meta"><span>Ends <b>${esc(new Date(d.ends * 1000).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }))}</b></span>${d.count ? `<span><b>${S.entries}</b> ${S.entries === 1 ? 'entry' : 'entries'}</span>` : ''}<span><b>${d.winners}</b> ${d.winners === 1 ? 'winner' : 'winners'}</span></p></section>`
      + (ended ? '' : steps) + body + (d.desc ? `<section class="sh-card"><h2>Rules and details</h2><p class="gv-desc">${esc(d.desc)}</p></section>` : '');
    if (!ended) countdown($('#gv-clock'), d.ends * 1000, offset, () => setTimeout(() => location.reload(), 2500));
    else if (S.winners.length) confetti();
    app.querySelectorAll('.gv-steps a').forEach(a => a.addEventListener('click', () => { const li = a.closest('li'); li.classList.add('done'); store(`tf-gv-${S.code}-s${li.dataset.i}`, 1); }));
    const f = $('#gv-form');
    if (f) f.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = f.querySelector('button'), err = $('#gv-err');
      const fields = Object.fromEntries(new FormData(f));
      btn.disabled = true; err.hidden = true;
      try {
        await post({ action: 'enter', code: S.code, fields });
        store('tf-gv-' + S.code, { name: fields.name, at: Date.now() });
        S.entries++;
        confetti();
        giveawayPage();
        scrollTo({ top: 0, behavior: 'smooth' });
      } catch (x) { err.textContent = x.message; err.hidden = false; btn.disabled = false; }
    });
  }

  function giveawayManage() {
    const d = S.d, keys = d.fields.map(f => f.k);
    const ended = () => d.ends * 1000 <= Date.now() + offset;
    const winSet = () => new Set(S.state.winners);
    const render = () => {
      const w = winSet();
      app.innerHTML = manageHead('Entries') + `<section class="sh-card">
        <h2>${ended() ? 'Giveaway ended' : 'Running'}</h2>
        ${ended() ? '' : `<div class="gv-clock" id="gv-clock"></div>`}
        <p class="sub">${d.mode === 'auto' ? 'Winners are picked automatically when the countdown ends.' : 'You pick the winners: press the button when you’re ready.'} You can also end it early and draw now.</p>
        ${S.state.winners.length ? `<p class="sh-kicker">Winners (draw ${S.state.draws}, from ${S.state.from} entries, ${esc(when(S.state.picked_at))})</p><ul class="gv-win">${S.list.filter(e => w.has(e.id)).map(e => `<li><span>${esc(e.name)}<small>${keys.map(k => e.d[k] ? esc(e.d[k]) : '').filter(Boolean).join(' · ')}</small></span></li>`).join('')}</ul>` : ''}
        <div class="sh-row"><button type="button" class="sh-btn" id="m-draw" ${S.list.length ? '' : 'disabled'}>${S.state.winners.length ? 'Draw again (other people)' : ended() ? 'Draw the winners now' : 'End now and draw winners'}</button></div>
        <p class="note">Draws are random and fair: every entry has the same chance. “Draw again” leaves out the earlier winners, for when a winner doesn’t reply.</p></section>
        <section class="sh-card"><div class="sh-row" style="justify-content:space-between"><h2>Entries (${S.list.length})</h2>${S.list.length ? '<button type="button" class="btn ghost" id="m-csv">Download CSV</button>' : ''}</div>
        ${S.list.length ? `<div class="sh-scroll"><table class="sh-table"><thead><tr><th>#</th><th>Name</th>${d.fields.map(f => `<th>${esc(f.label)}</th>`).join('')}<th>When</th><th></th></tr></thead><tbody>${S.list.map((e, i) => `<tr${w.has(e.id) ? ' class="win"' : ''}><td>${i + 1}</td><td>${w.has(e.id) ? '🏆 ' : ''}${esc(e.name)}</td>${keys.map(k => `<td>${esc(e.d[k] || '')}</td>`).join('')}<td>${esc(when(e.at))}</td><td><button type="button" class="sh-x" data-rm="${e.id}" aria-label="Remove">${ICON.trash}</button></td></tr>`).join('')}</tbody></table></div>` : '<p class="sub">No entries yet. Share your link!</p>'}</section>`;
      if (!ended()) countdown($('#gv-clock'), d.ends * 1000, offset, () => setTimeout(() => location.reload(), 2500));
      wireManage();
      const dl = $('#m-csv');
      if (dl) dl.onclick = () => download(new Blob(['﻿' + csv([['#', 'Name', ...d.fields.map(f => f.label), 'Entered', 'Winner'], ...S.list.map((e, i) => [i + 1, e.name, ...keys.map(k => e.d[k] || ''), new Date(e.at * 1000).toISOString(), w.has(e.id) ? 'yes' : ''])])], { type: 'text/csv' }), 'giveaway-entries.csv');
      $('#m-draw').onclick = async () => {
        const again = S.state.winners.length > 0;
        if (!confirm(again ? 'Draw new winners from the people who haven’t won yet?' : (ended() ? 'Draw the winners now?' : 'End the giveaway now and draw the winners?'))) return;
        try {
          const r = await post({ action: 'draw', code: S.code, k: S.key, redraw: again ? 1 : '' });
          S.state = r.state; if (!ended()) d.ends = Math.floor((Date.now() + offset) / 1000);
          render(); confetti();
        } catch (e) { toast(e.message, 'err'); }
      };
    };
    render();
  }

  // =====================================================================
  // Wedding
  // =====================================================================
  const pad = n => String(n).padStart(2, '0');
  function evStart(e) { return new Date(`${e.date}T${e.time || '12:00'}:00`); }
  function ics(e, d) {
    const s = evStart(e), en = new Date(s.getTime() + 3 * 3600e3), f = t => `${t.getFullYear()}${pad(t.getMonth() + 1)}${pad(t.getDate())}T${pad(t.getHours())}${pad(t.getMinutes())}00`;
    const x = s => String(s).replace(/[,;\\]/g, m => '\\' + m).replace(/\n/g, '\\n');
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//TidyFigure//Wedding//EN', 'BEGIN:VEVENT', `UID:${S.code}-${e.date}-${Math.random().toString(36).slice(2)}@tidyfigure`, `DTSTAMP:${f(new Date())}`,
      `DTSTART:${f(s)}`, `DTEND:${f(en)}`, `SUMMARY:${x(`${e.name}: ${d.groom} & ${d.bride}`)}`, `LOCATION:${x([e.venue, e.address].filter(Boolean).join(', '))}`, `DESCRIPTION:${x(S.url)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  }
  const mapUrl = e => e.map || (e.venue || e.address ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([e.venue, e.address].filter(Boolean).join(', ')) : '');

  async function weddingPage() {
    const d = S.d, W = window.WeddingCard, L = W.labels(d.lang), ur = d.lang === 'ur';
    document.body.classList.add('wd-t-' + d.tpl);
    $('#sh').classList.add('wd-t-' + d.tpl);
    if (ur) app.classList.add('wd-ur');
    W.loadFonts();
    const initials = (d.groom.slice(0, 1) + d.bride.slice(0, 1)).toUpperCase();
    const env = document.createElement('div');
    env.className = 'wd-env wd-t-' + d.tpl;
    env.setAttribute('role', 'button'); env.tabIndex = 0; env.setAttribute('aria-label', 'Open the invitation');
    env.innerHTML = `<div class="wd-env-box"><div class="wd-env-back"></div><div class="wd-env-letter">${esc(d.groom.split(' ')[0])} &amp; ${esc(d.bride.split(' ')[0])}</div><div class="wd-env-front"></div><div class="wd-env-flap"></div><div class="wd-env-seal">${esc(initials.split('').join('&'))}</div><div class="wd-env-tap">${esc(L.tap)}</div></div>`;
    if (!store('tf-wd-' + S.code) && !S.manage) {
      document.body.appendChild(env);
      const open = () => { env.classList.add('open'); store('tf-wd-' + S.code, 1); setTimeout(() => env.remove(), 1600); };
      env.addEventListener('click', open); env.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
    }
    const upcoming = d.events.map(e => [e, evStart(e)]).filter(([, t]) => t > new Date()).sort((a, b) => a[1] - b[1])[0];
    const own = mine.get(S.code);
    const done = store('tf-rsvp-' + S.code);
    const rsvpOpen = d.rsvp && (!d.rsvp_by || new Date(d.rsvp_by + 'T23:59:59') > new Date());
    app.innerHTML = (own ? `<section class="sh-card"><p class="sh-kicker">This is your invitation</p>${shareButtons(S.url, `${L.invite}: ${d.groom} & ${d.bride} 💍`)}<a class="sh-btn soft" href="${esc(manageUrl(S.code, own.key))}">${esc('See RSVPs')}</a></section>` : '') +
      `<section class="sh-card plain" style="background:none;border:0;box-shadow:none;padding:0"><canvas id="wd-cv" class="wd-cardimg" width="1080" height="1620" aria-label="Invitation card"></canvas>
        <div class="sh-row" style="justify-content:center;margin-top:10px"><button type="button" class="sh-btn" id="wd-save">${esc(L.save)}</button><button type="button" class="sh-btn soft" data-sh-native="${esc(S.url)}" data-text="${esc(d.groom + ' & ' + d.bride)}" ${navigator.share ? '' : 'hidden'}>${esc(L.share)}</button></div></section>
      <section class="sh-card"><p class="wd-sub">${esc(L.together)}</p><h1 class="wd-title">${esc(d.groom)} <span style="font-size:.6em">&amp;</span> ${esc(d.bride)}</h1>${d.msg ? `<p class="wd-sub" style="text-transform:none;letter-spacing:.02em;font-family:'Cormorant Garamond',serif;font-size:19px;white-space:pre-line">${esc(d.msg)}</p>` : ''}
        ${upcoming ? `<p class="wd-sub" style="margin-top:8px">${esc(L.countdown)} · ${esc(upcoming[0].name)}</p><div class="wd-clock" id="wd-clock"></div>` : `<p class="wd-sub">${esc(L.thanks)}</p>`}</section>
      <section class="sh-card"><h2 class="wd-sub" style="font-size:18px">${esc(L.events)}</h2><div class="wd-events">${d.events.map((e, i) => `<div class="wd-ev"><h3>${esc(e.name)}</h3><p>${esc(W.fmtDate(e.date, d.lang))}</p>${e.time ? `<p>${esc(W.fmtTime(e.time, d.lang))}</p>` : ''}${e.venue ? `<p><b>${esc(e.venue)}</b></p>` : ''}${e.address ? `<p style="font-size:16px;opacity:.85">${esc(e.address)}</p>` : ''}
        <div class="wd-btns">${mapUrl(e) ? `<a href="${esc(mapUrl(e))}" target="_blank" rel="noopener">${esc(L.directions)}</a>` : ''}<button type="button" data-ics="${i}">${esc(L.calendar)}</button></div></div>`).join('')}</div></section>
      ${rsvpOpen ? `<section class="sh-card" id="wd-rsvp">${done ? `<h2 class="wd-sub" style="font-size:18px">${esc(L.thanksRsvp)}</h2><p style="text-align:center">${esc(done.name)} · ${esc(L[done.coming])}</p><button type="button" class="sh-btn soft" id="wd-change">${esc(L.change)}</button>` : rsvpForm()}</section>` : ''}
      ${d.contacts.length ? `<section class="sh-card"><h2 class="wd-sub" style="font-size:18px">${esc(L.contact)}</h2><div class="sh-row" style="justify-content:center">${d.contacts.map(c => `<a class="sh-btn soft" href="tel:${esc(c.phone.replace(/\s/g, ''))}">${esc(c.name || c.phone)}${c.name && c.phone ? ' · ' + esc(c.phone) : ''}</a>`).join('')}</div></section>` : ''}`;
    if (upcoming) countdown($('#wd-clock'), upcoming[1].getTime(), 0, null, L.units);
    const cv = $('#wd-cv');
    W.draw(cv, d, { photo: S.image }).catch(() => {});
    $('#wd-save').onclick = async () => { await W.draw(cv, d, { photo: S.image }); cv.toBlob(b => download(b, `wedding-${d.groom}-${d.bride}.png`.replace(/\s+/g, '-').toLowerCase()), 'image/png'); };
    app.querySelectorAll('[data-ics]').forEach(b => b.onclick = () => download(new Blob([ics(d.events[+b.dataset.ics], d)], { type: 'text/calendar' }), 'wedding-event.ics'));
    const ch = $('#wd-change');
    if (ch) ch.onclick = () => { $('#wd-rsvp').innerHTML = rsvpForm(done); wireRsvp(); };
    wireRsvp();

    function rsvpForm(prev = {}) {
      return `<h2 class="wd-sub" style="font-size:18px">${esc(L.rsvp)}${d.rsvp_by ? ` · ${esc(L.by)} ${esc(W.fmtDate(d.rsvp_by, d.lang))}` : ''}</h2><form class="sh-form" id="wd-form">
        <label>${esc(L.yourName)}<input class="sh-input" name="name" maxlength="60" required value="${esc(prev.name || '')}"></label>
        <div class="wd-pills" role="radiogroup" aria-label="${esc(L.coming)}">${['yes', 'maybe', 'no'].map(v => `<label><input type="radio" name="coming" value="${v}"${(prev.coming || 'yes') === v ? ' checked' : ''}><span>${esc(L[v])}</span></label>`).join('')}</div>
        <label>${esc(L.guests)}<input class="sh-input" name="guests" type="number" min="1" max="30" value="${esc(prev.guests || 1)}"></label>
        ${d.events.length > 1 ? `<div class="wd-pills">${d.events.map(e => `<label><input type="checkbox" name="events" value="${esc(e.name)}" checked><span>${esc(e.name)}</span></label>`).join('')}</div>` : ''}
        <label>${esc(L.phone)} <input class="sh-input" name="phone" type="tel" maxlength="24" value="${esc(prev.phone || '')}"></label>
        <label>${esc(L.message)}<textarea class="sh-input" name="msg" rows="3" maxlength="400">${esc(prev.msg || '')}</textarea></label>
        <p class="sh-err" id="wd-err" hidden></p><button class="sh-btn wide">${esc(L.send)}</button></form>`;
    }
    function wireRsvp() {
      const f = $('#wd-form');
      if (!f) return;
      f.addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(f), fields = { name: fd.get('name'), coming: fd.get('coming'), guests: fd.get('guests'), phone: fd.get('phone'), msg: fd.get('msg'), events: fd.getAll('events') };
        const btn = f.querySelector('button'), err = $('#wd-err');
        btn.disabled = true; err.hidden = true;
        try {
          await post({ action: 'rsvp', code: S.code, fields });
          store('tf-rsvp-' + S.code, fields);
          $('#wd-rsvp').innerHTML = `<h2 class="wd-sub" style="font-size:18px">${esc(L.thanksRsvp)}</h2><p style="text-align:center">${esc(fields.name)} · ${esc(L[fields.coming])}</p><button type="button" class="sh-btn soft" id="wd-change">${esc(L.change)}</button>`;
          $('#wd-change').onclick = () => { $('#wd-rsvp').innerHTML = rsvpForm(fields); wireRsvp(); };
          if (fields.coming === 'yes') confetti([getComputedStyle($('#sh')).getPropertyValue('--wd-acc').trim() || '#D4AF37', '#ffffff', '#F7D9A0']);
        } catch (x) { err.textContent = x.message; err.hidden = false; btn.disabled = false; }
      });
    }
  }

  function weddingManage() {
    const d = S.d, L = window.WeddingCard.labels('en');
    $('#sh').classList.add('wd-t-' + d.tpl);
    window.WeddingCard.loadFonts();
    const yes = S.list.filter(e => e.d.coming === 'yes'), maybe = S.list.filter(e => e.d.coming === 'maybe'), no = S.list.filter(e => e.d.coming === 'no');
    const guests = yes.reduce((s, e) => s + (e.d.guests || 1), 0);
    app.innerHTML = manageHead('Replies', `<div><b>${guests}</b><span>Guests coming (${yes.length} replies)</span></div><div><b>${maybe.length} / ${no.length}</b><span>Maybe / can’t come</span></div>`) +
      `<section class="sh-card plain"><div class="sh-row" style="justify-content:space-between"><h2 style="color:var(--ink)">RSVPs</h2>${S.list.length ? '<button type="button" class="btn ghost" id="m-csv">Download CSV</button>' : ''}</div>
      ${S.list.length ? `<div class="sh-scroll"><table class="sh-table"><thead><tr><th>Name</th><th>Coming</th><th>Guests</th>${d.events.length > 1 ? '<th>Events</th>' : ''}<th>Phone</th><th>Message</th><th>When</th><th></th></tr></thead><tbody>${S.list.slice().reverse().map(e => `<tr><td>${esc(e.name)}</td><td>${esc(L[e.d.coming] || '')}</td><td>${e.d.guests || 0}</td>${d.events.length > 1 ? `<td>${esc((e.d.events || []).join(', '))}</td>` : ''}<td>${e.d.phone ? `<a href="tel:${esc(e.d.phone)}">${esc(e.d.phone)}</a>` : ''}</td><td>${esc(e.d.msg || '')}</td><td>${esc(when(e.at))}</td><td><button type="button" class="sh-x" data-rm="${e.id}" aria-label="Remove">${ICON.trash}</button></td></tr>`).join('')}</tbody></table></div>` : `<p class="sub">${d.rsvp ? 'No replies yet. Share your invitation!' : 'RSVP is switched off for this invitation. Turn it on with Edit.'}</p>`}</section>`;
    wireManage();
    const dl = $('#m-csv');
    if (dl) dl.onclick = () => download(new Blob(['﻿' + csv([['Name', 'Coming', 'Guests', 'Events', 'Phone', 'Message', 'When'], ...S.list.map(e => [e.name, e.d.coming, e.d.guests, (e.d.events || []).join('; '), e.d.phone, e.d.msg, new Date(e.at * 1000).toISOString()])])], { type: 'text/csv' }), 'wedding-rsvps.csv');
  }

  const pages = { quiz: [quizPage, quizManage], giveaway: [giveawayPage, giveawayManage], wedding: [weddingPage, weddingManage] }[S.type];
  if (pages) pages[S.manage ? 1 : 0]();
})();
