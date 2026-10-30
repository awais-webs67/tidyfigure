// Runs on every page: hamburger menu, light/dark switch, quick search (Ctrl+K or /), share buttons and the install-app offer.
(function () {
  'use strict';
  var root = document.documentElement, base = window.TF_BASE || '';

  // ----- Menu -----
  var toggle = document.querySelector('.nav-toggle');
  function setNav(open) { root.classList.toggle('nav-open', open); if (toggle) toggle.setAttribute('aria-expanded', open); }
  if (toggle) toggle.addEventListener('click', function () { setNav(!root.classList.contains('nav-open')); });
  var shade = document.querySelector('.nav-shade');
  if (shade) shade.addEventListener('click', function () { setNav(false); });
  document.querySelectorAll('.main-nav a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });

  // ----- Theme: light until the visitor picks dark (remembered on this device) -----
  var themeBtn = document.querySelector('.theme-toggle');
  function currentTheme() { return root.dataset.theme === 'dark' ? 'dark' : 'light'; }
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('tf-theme', next); } catch (e) { /* storage blocked */ }
  });

  // ----- Quick search -----
  var dlg = document.getElementById('qs'), input, list, tools = null, active = 0, results = [];
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function score(t, words) {
    var name = t.n.toLowerCase(), hay = (t.n + ' ' + t.s + ' ' + t.k + ' ' + t.c).toLowerCase(), s = 0;
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (hay.indexOf(w) < 0) return -1;
      s += name.indexOf(w) === 0 ? 30 : name.indexOf(w) > 0 ? 15 : 3;
    }
    return s + (t.p ? 2 : 0);
  }
  function render() {
    var q = input.value.trim().toLowerCase(), words = q.split(/\s+/).filter(Boolean);
    if (!tools) { list.innerHTML = '<li class="qs-empty">Loading…</li>'; return; }
    results = words.length
      ? tools.map(function (t) { return [score(t, words), t]; }).filter(function (x) { return x[0] >= 0; }).sort(function (a, b) { return b[0] - a[0]; }).slice(0, 12).map(function (x) { return x[1]; })
      : tools.filter(function (t) { return t.p; }).slice(0, 10);
    active = 0;
    list.innerHTML = results.length ? results.map(function (t, i) {
      return '<li><a href="' + esc(base + '/' + t.u) + '" class="' + (i === 0 ? 'on' : '') + '" data-cat="' + esc(t.c) + '"><span class="tile">' + t.i + '</span><span><b>' + esc(t.n) + '</b><small>' + esc(t.s) + '</small></span></a></li>';
    }).join('') : '<li class="qs-empty">No tool found. Try another word.</li>';
    if (!words.length && results.length) list.insertAdjacentHTML('afterbegin', '<li class="qs-head">Popular tools</li>');
  }
  function move(d) {
    var links = list.querySelectorAll('a');
    if (!links.length) return;
    links[active].classList.remove('on');
    active = (active + d + links.length) % links.length;
    links[active].classList.add('on');
    links[active].scrollIntoView({ block: 'nearest' });
  }
  function openSearch() {
    if (!dlg) return;
    setNav(false);
    dlg.hidden = false; root.classList.add('qs-open');
    input = dlg.querySelector('input'); list = dlg.querySelector('ul');
    input.value = ''; input.focus(); render();
    if (!tools) fetch(base + '/tools.json').then(function (r) { return r.json(); }).then(function (d) { tools = d; render(); }).catch(function () { list.innerHTML = '<li class="qs-empty">Couldn’t load the tool list.</li>'; });
  }
  function closeSearch() { if (dlg) { dlg.hidden = true; root.classList.remove('qs-open'); } }
  document.querySelectorAll('[data-open-search]').forEach(function (b) { b.addEventListener('click', openSearch); });
  if (dlg) {
    dlg.addEventListener('click', function (e) { if (e.target === dlg) closeSearch(); });
    dlg.querySelector('input').addEventListener('input', render);
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') { var a = list.querySelectorAll('a')[active]; if (a) location.href = a.href; }
    });
  }
  document.addEventListener('keydown', function (e) {
    var typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName) || (document.activeElement || {}).isContentEditable;
    if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) { e.preventDefault(); openSearch(); }
    else if (e.key === 'Escape') { closeSearch(); setNav(false); }
  });

  // ----- Share buttons on tool pages -----
  document.querySelectorAll('.share').forEach(function (box) {
    var url = location.href.split('#')[0], title = document.title;
    if (navigator.share) {
      var native = box.querySelector('[data-share="native"]');
      if (native) { native.hidden = false; native.addEventListener('click', function () { navigator.share({ title: title, url: url }).catch(function () {}); }); }
    }
    box.querySelectorAll('a[data-share]').forEach(function (a) {
      var u = encodeURIComponent(url), t = encodeURIComponent(title);
      a.href = { whatsapp: 'https://wa.me/?text=' + t + '%20' + u, x: 'https://x.com/intent/post?text=' + t + '&url=' + u, facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + u, linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + u }[a.dataset.share];
    });
    var copy = box.querySelector('[data-share="copy"]');
    if (copy) copy.addEventListener('click', function () {
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { copy.classList.add('done'); setTimeout(function () { copy.classList.remove('done'); }, 1500); });
    });
  });

  // ----- Install as an app -----
  // The service worker lets phones install the site and shows a friendly page when offline.
  if ('serviceWorker' in navigator && window.isSecureContext) window.addEventListener('load', function () { navigator.serviceWorker.register(base + '/sw.js', { scope: base + '/' }).catch(function () {}); });
  var standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var phone = matchMedia('(max-width: 860px)').matches || matchMedia('(pointer: coarse)').matches;
  var KEY = 'tf-install-hide', prompted = null, bar = null;
  function hiddenUntil() { try { return +localStorage.getItem(KEY) || 0; } catch (e) { return 0; } }
  function hideFor(days) { try { localStorage.setItem(KEY, String(Date.now() + days * 864e5)); } catch (e) { /* storage blocked */ } }
  function closeBar(days) { if (bar) { bar.remove(); bar = null; } if (days) hideFor(days); }
  var appIcon = '<img src="' + base + '/icon-192.png" alt="" width="44" height="44">';
  function iosHelp() {
    closeBar(0);
    bar = document.createElement('div');
    bar.className = 'install-bar install-ios'; bar.setAttribute('role', 'dialog'); bar.setAttribute('aria-label', 'Install app');
    bar.innerHTML = '<button type="button" class="install-x" aria-label="Close">×</button><div class="install-row">' + appIcon + '<div><b>Add to your Home Screen</b><span>Open every tool in one tap, like an app.</span></div></div>'
      + '<ol><li>Tap <b>Share</b> <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg> in the browser bar</li><li>Choose <b>Add to Home Screen</b></li><li>Tap <b>Add</b></li></ol>';
    bar.querySelector('.install-x').onclick = function () { closeBar(30); };
    document.body.appendChild(bar);
  }
  function install() {
    if (prompted) {
      var p = prompted; prompted = null;
      p.prompt();
      p.userChoice.then(function (c) { closeBar(c.outcome === 'accepted' ? 365 : 30); showButtons(); }).catch(function () {});
    } else if (ios) iosHelp();
  }
  function showButtons() { document.querySelectorAll('[data-install]').forEach(function (b) { b.hidden = !(prompted || ios); }); }
  function offer() {
    // Not on share pages (a friend's quiz, an invitation): visitors came for that, not for the site.
    if (bar || hiddenUntil() > Date.now() || !phone || document.querySelector('.sh-page')) return;
    if (document.querySelector('.pip:not([hidden])') || root.classList.contains('qs-open') || root.classList.contains('nav-open')) { setTimeout(offer, 8000); return; }
    if (ios) { iosHelp(); return; }
    bar = document.createElement('div');
    bar.className = 'install-bar'; bar.setAttribute('role', 'dialog'); bar.setAttribute('aria-label', 'Install app');
    bar.innerHTML = '<div class="install-row">' + appIcon + '<div><b>Install the app</b><span>Free · opens in one tap · no app store</span></div>'
      + '<button type="button" class="btn install-go">Install</button><button type="button" class="install-x" aria-label="Not now">×</button></div>';
    bar.querySelector('.install-go').onclick = install;
    bar.querySelector('.install-x').onclick = function () { closeBar(14); };
    document.body.appendChild(bar);
  }
  if (window.TF_INSTALL && !standalone) {
    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); prompted = e; showButtons(); setTimeout(offer, 4000); });
    window.addEventListener('appinstalled', function () { prompted = null; closeBar(365); showButtons(); });
    document.querySelectorAll('[data-install]').forEach(function (b) { b.addEventListener('click', function () { setNav(false); install(); }); });
    // Safari on iPhone has no install prompt: explain the Share → Add to Home Screen steps instead.
    if (ios && /safari/i.test(navigator.userAgent) && !/crios|fxios|edgios/i.test(navigator.userAgent)) { showButtons(); setTimeout(offer, 6000); }
    else ios = false;
  }
})();
