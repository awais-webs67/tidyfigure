'use strict';
// Wedding invitation card, drawn on a canvas (1080 × 1620, or 1080 × 1920 for a phone story).
// Used by the Wedding Card Maker tool (live preview, thumbnails, download) and by the online invitation page,
// so both always look the same. Seven designs, each with its own layout and ornaments; English or Urdu.
// Text never runs outside the card: a line first gets a little smaller, then wraps, then ends with "…".
window.WeddingCard = (() => {
  // names: how the couple's names are written. caps = capitals in a serif; script = handwriting.
  const TPL = {
    royal: { name: 'Royal', bg: ['#7A1A2B', '#3A0712'], ink: '#F7E7C1', acc: '#D9B25F', alt: '#F0D18A', dark: true, names: 'script' },
    emerald: { name: 'Emerald', bg: ['#12684F', '#052A20'], ink: '#F3EBD3', acc: '#D4AF37', alt: '#EBD07A', dark: true, names: 'script' },
    blush: { name: 'Blush', bg: ['#FFF8F6', '#F4D7DE'], ink: '#5A2A3A', acc: '#B76E79', alt: '#E5A3B3', dark: false, names: 'script' },
    ivory: { name: 'Classic', bg: ['#FFFEFB', '#F3EDE2'], ink: '#2B2622', acc: '#A8843F', alt: '#C9A96A', dark: false, names: 'caps' },
    navy: { name: 'Art deco', bg: ['#1B3366', '#070F24'], ink: '#F2E8CF', acc: '#D4B062', alt: '#E9CF8A', dark: true, names: 'deco' },
    mehndi: { name: 'Mehndi', bg: ['#3F7A2A', '#173214'], ink: '#FFF6D6', acc: '#F2C94C', alt: '#F79A3E', dark: true, names: 'script' },
    sage: { name: 'Sage', bg: ['#FBFAF4', '#E9EEE3'], ink: '#2F3B2E', acc: '#6E8B65', alt: '#A9BFA0', dark: false, names: 'script' },
  };
  const L = {
    en: { together: 'Together with their families', request: 'request the pleasure of your company at the wedding of', son: 'son of', daughter: 'daughter of', invite: 'Wedding invitation', tap: 'Tap to open',
      save: 'Save the card', share: 'Share', countdown: 'Counting down to', thanks: 'Thank you for celebrating with us', events: 'Celebrations', directions: 'Directions', calendar: 'Add to calendar',
      rsvp: 'Will you join us?', by: 'please reply by', yourName: 'Your name', coming: 'Coming?', yes: 'Joyfully accept', maybe: 'Maybe', no: 'Regretfully decline', guests: 'Number of guests',
      phone: 'Phone (optional)', message: 'A message for the couple (optional)', send: 'Send reply', thanksRsvp: 'Thank you for your reply!', change: 'Change my reply', contact: 'For any questions',
      units: ['Days', 'Hours', 'Min', 'Sec'], rsvpLine: 'RSVP', bismillah: 'بسم اللہ الرحمن الرحیم', at: 'at' },
    ur: { together: 'اپنے اہلِ خانہ کے ہمراہ', request: 'آپ کو شادی کی پُرمسرت تقریب میں شرکت کی دعوت دیتے ہیں', son: 'ولد', daughter: 'بنت', invite: 'دعوتِ شادی', tap: 'کھولنے کے لیے چھوئیں',
      save: 'کارڈ محفوظ کریں', share: 'شیئر کریں', countdown: 'باقی وقت', thanks: 'ہماری خوشیوں میں شریک ہونے کا شکریہ', events: 'تقریبات', directions: 'راستہ', calendar: 'کیلنڈر میں شامل کریں',
      rsvp: 'کیا آپ تشریف لائیں گے؟', by: 'جواب کی آخری تاریخ', yourName: 'آپ کا نام', coming: 'آمد', yes: 'ضرور آئیں گے', maybe: 'شاید', no: 'معذرت', guests: 'مہمانوں کی تعداد',
      phone: 'فون (اختیاری)', message: 'دلہا دلہن کے لیے پیغام (اختیاری)', send: 'جواب بھیجیں', thanksRsvp: 'جواب کا شکریہ!', change: 'جواب تبدیل کریں', contact: 'رابطہ',
      units: ['دن', 'گھنٹے', 'منٹ', 'سیکنڈ'], rsvpLine: 'رابطہ', bismillah: 'بسم اللہ الرحمن الرحیم', at: 'بمقام' },
  };
  const labels = lang => L[lang === 'ur' ? 'ur' : 'en'];

  // ---------- fonts (Google Fonts, only on wedding pages) ----------
  let fontsP = null;
  function loadFonts() {
    if (fontsP) return fontsP;
    // The stylesheet must be in before document.fonts.load can find the fonts it describes.
    const sheet = new Promise(res => {
      let l = document.querySelector('link[data-wd-fonts]');
      if (l && l.sheet) { res(); return; }
      if (!l) {
        l = document.createElement('link');
        l.rel = 'stylesheet'; l.dataset.wdFonts = '1';
        l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Great+Vibes&family=Playfair+Display:ital,wght@1,500&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap';
        document.head.appendChild(l);
      }
      l.addEventListener('load', res); l.addEventListener('error', res);
    });
    const want = ['118px "Great Vibes"', '600 30px "Cinzel"', '500 30px "Cinzel"', '500 30px "Cormorant Garamond"', 'italic 500 30px "Cormorant Garamond"', '600 30px "Cormorant Garamond"', 'italic 500 30px "Playfair Display"', '400 30px "Noto Nastaliq Urdu"', '700 30px "Noto Nastaliq Urdu"'];
    fontsP = Promise.race([sheet.then(() => Promise.all(want.map(f => document.fonts.load(f, 'Aa&ابپ').catch(() => {})))), new Promise(r => setTimeout(r, 6000))]);
    return fontsP;
  }

  // ---------- dates ----------
  function fmtDate(date, lang) {
    const d = new Date(date + 'T12:00:00');
    if (isNaN(d)) return date;
    return new Intl.DateTimeFormat(lang === 'ur' ? 'ur-PK' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  }
  function fmtTime(time, lang) {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    return new Intl.DateTimeFormat(lang === 'ur' ? 'ur-PK' : 'en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(2000, 0, 1, h, m));
  }

  // ---------- text that always fits ----------
  const rtl = s => /[؀-ۿ]/.test(s);
  // A font spec with {s} for the size; sp = letter spacing in px (scaled with the size).
  function setFont(x, f, size, sp = 0) { x.font = f.replace('{s}', Math.round(size)); if ('letterSpacing' in x) x.letterSpacing = `${(sp * size / 30).toFixed(1)}px`; }
  // Tries the size; then down to minRatio of it (80%); then wraps (at most maxLines lines, the last ending in "…" if needed).
  function fitLines(x, text, f, size, maxW, maxLines = 1, sp = 0, minRatio = 0.8) {
    text = String(text || '').trim();
    if (!text) return { lines: [], size };
    for (let s = size; s >= size * minRatio; s -= Math.max(1, size * 0.04)) { setFont(x, f, s, sp); if (x.measureText(text).width <= maxW) return { lines: [text], size: s }; }
    let s = size * minRatio;
    setFont(x, f, s, sp);
    // a single word wider than the line gets smaller until it fits
    const longest = text.split(/\s+/).reduce((a, w) => Math.max(a, x.measureText(w).width), 0);
    if (longest > maxW) { s = Math.max(10, s * maxW / longest); setFont(x, f, s, sp); }
    const words = text.split(/\s+/), lines = [];
    let line = '';
    for (const w of words) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
    if (line) lines.push(line);
    if (lines.length > maxLines) {
      const keep = lines.slice(0, maxLines);
      let last = keep[maxLines - 1] + ' ' + lines.slice(maxLines).join(' ');
      while (last.length > 1 && x.measureText(last + '…').width > maxW) last = last.slice(0, -1);
      keep[maxLines - 1] = last.trim() + '…';
      return { lines: keep, size: s };
    }
    return { lines, size: s };
  }
  // Draws pre-fitted lines centred on cx (or left / right aligned), each in its own direction. Returns the height used.
  function drawLines(x, fl, f, cx, y, lh, sp = 0, align = 'center') {
    setFont(x, f, fl.size, sp);
    x.textAlign = align;
    fl.lines.forEach((ln, k) => { x.direction = rtl(ln) ? 'rtl' : 'ltr'; x.fillText(ln, cx, y + k * lh); });
    x.textAlign = 'center';
    return fl.lines.length * lh;
  }

  // ---------- ornaments ----------
  function petal(x, cx, cy, len, wid, ang) {
    x.save(); x.translate(cx, cy); x.rotate(ang);
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(wid, -len / 2, 0, -len); x.quadraticCurveTo(-wid, -len / 2, 0, 0); x.fill();
    x.restore();
  }
  function mandala(x, cx, cy, r, t, alpha = 1) {
    x.save(); x.globalAlpha = alpha;
    x.fillStyle = t.acc; x.strokeStyle = t.acc;
    for (let i = 0; i < 24; i++) petal(x, cx, cy, r, r * 0.16, i * Math.PI / 12);
    x.fillStyle = t.dark ? t.bg[1] : t.bg[0];
    x.beginPath(); x.arc(cx, cy, r * 0.56, 0, 7); x.fill();
    x.fillStyle = t.alt;
    for (let i = 0; i < 12; i++) petal(x, cx, cy, r * 0.54, r * 0.12, i * Math.PI / 6 + Math.PI / 12);
    x.fillStyle = t.dark ? t.bg[1] : t.bg[0];
    x.beginPath(); x.arc(cx, cy, r * 0.22, 0, 7); x.fill();
    x.fillStyle = t.acc; x.beginPath(); x.arc(cx, cy, r * 0.1, 0, 7); x.fill();
    x.lineWidth = Math.max(1.5, r * 0.012);
    [1.08, 1.2].forEach(k => { x.beginPath(); x.arc(cx, cy, r * k, 0, 7); x.stroke(); });
    for (let i = 0; i < 48; i++) { const a = i * Math.PI / 24; x.beginPath(); x.arc(cx + Math.cos(a) * r * 1.32, cy + Math.sin(a) * r * 1.32, r * 0.025, 0, 7); x.fill(); }
    x.restore();
  }
  function flourish(x, cx, y, w, t) {
    x.save(); x.strokeStyle = t.acc; x.fillStyle = t.acc; x.lineWidth = 2.2; x.lineCap = 'round';
    for (const s of [-1, 1]) {
      x.beginPath(); x.moveTo(cx + s * 22, y); x.bezierCurveTo(cx + s * w * 0.25, y - 16, cx + s * w * 0.38, y + 16, cx + s * w * 0.5, y); x.stroke();
      x.beginPath(); x.moveTo(cx + s * w * 0.32, y + 2); x.quadraticCurveTo(cx + s * w * 0.36, y - 22, cx + s * w * 0.27, y - 18); x.stroke();
      x.beginPath(); x.arc(cx + s * w * 0.5, y, 3.5, 0, 7); x.fill();
    }
    x.beginPath(); x.moveTo(cx, y - 11); x.lineTo(cx + 11, y); x.lineTo(cx, y + 11); x.lineTo(cx - 11, y); x.closePath(); x.fill();
    x.restore();
  }
  function rule(x, cx, y, w, t) { // short line with a diamond: the minimal designs' divider
    x.save(); x.strokeStyle = t.acc; x.fillStyle = t.acc; x.lineWidth = 1.5;
    x.beginPath(); x.moveTo(cx - w / 2, y); x.lineTo(cx - 14, y); x.moveTo(cx + 14, y); x.lineTo(cx + w / 2, y); x.stroke();
    x.beginPath(); x.moveTo(cx, y - 7); x.lineTo(cx + 7, y); x.lineTo(cx, y + 7); x.lineTo(cx - 7, y); x.closePath(); x.fill();
    x.restore();
  }
  function flower(x, cx, cy, r, center, col, n = 5) {
    x.save(); x.fillStyle = col;
    for (let i = 0; i < n; i++) petal(x, cx, cy, r, r * 0.55, i * Math.PI * 2 / n);
    x.fillStyle = center; x.beginPath(); x.arc(cx, cy, r * 0.22, 0, 7); x.fill();
    x.restore();
  }
  function rose(x, cx, cy, r, col, dark) { // soft layered bloom (watercolour look)
    x.save();
    for (let k = 0; k < 4; k++) {
      x.globalAlpha = 0.35 + k * 0.15; x.fillStyle = k % 2 ? col : dark;
      for (let i = 0; i < 6; i++) petal(x, cx, cy, r * (1 - k * 0.22), r * (0.6 - k * 0.1), i * Math.PI / 3 + k * 0.5);
    }
    x.restore();
  }
  function leaf(x, cx, cy, len, ang, col) { x.save(); x.fillStyle = col; petal(x, cx, cy, len, len * 0.32, ang); x.restore(); }
  function bgFill(x, W, H, t) {
    const g = x.createRadialGradient(W / 2, H * 0.2, 60, W / 2, H * 0.5, H * 0.85);
    g.addColorStop(0, t.bg[0]); g.addColorStop(1, t.bg[1]);
    x.fillStyle = g; x.fillRect(0, 0, W, H);
  }
  function frame(x, W, H, t, a, b) { x.save(); x.strokeStyle = t.acc; x.lineWidth = 4; x.strokeRect(a, a, W - a * 2, H - a * 2); if (b) { x.lineWidth = 1.5; x.strokeRect(b, b, W - b * 2, H - b * 2); } x.restore(); }

  // Each design draws its background and ornaments, and says where the text goes.
  // Returns { top, bottom, maxW, cx, ev ('stack' or 'table') }.
  const DESIGNS = {
    // Mughal jharokha: an arch with an onion dome, two pillars with little domes, a lattice and lanterns.
    royal(x, W, H, t) {
      bgFill(x, W, H, t);
      x.save(); x.strokeStyle = t.acc; x.globalAlpha = 0.08; x.lineWidth = 1.5;
      for (let yy = 20; yy < H; yy += 54) for (let xx = (yy / 54) % 2 ? 20 : 47; xx < W; xx += 54) { x.beginPath(); x.arc(xx, yy, 13, 0, 7); x.stroke(); x.beginPath(); x.moveTo(xx - 13, yy); x.lineTo(xx + 13, yy); x.moveTo(xx, yy - 13); x.lineTo(xx, yy + 13); x.stroke(); }
      x.restore();
      frame(x, W, H, t, 30, 44);
      const l = 120, r = W - 120, sh = 520, bot = H - 70, top = 190;
      const archPath = (k) => { x.beginPath(); x.moveTo(l + k, bot); x.lineTo(l + k, sh); x.bezierCurveTo(l + k, sh - 150, W / 2 - 210, sh - 190, W / 2 - 70, top + 70 + k); x.quadraticCurveTo(W / 2 - 14, top + 26 + k, W / 2, top + k); x.quadraticCurveTo(W / 2 + 14, top + 26 + k, W / 2 + 70, top + 70 + k); x.bezierCurveTo(W / 2 + 210, sh - 190, r - k, sh - 150, r - k, sh); x.lineTo(r - k, bot); };
      x.save(); archPath(0); x.closePath(); x.fillStyle = 'rgba(255,240,210,.05)'; x.fill(); x.restore();
      x.save(); x.strokeStyle = t.acc; x.lineWidth = 4; archPath(0); x.stroke(); x.lineWidth = 1.4; archPath(16); x.stroke(); x.restore();
      // onion dome and finial above the arch
      x.save(); x.fillStyle = t.acc; x.beginPath(); const dy = top - 6;
      x.moveTo(W / 2 - 46, dy); x.bezierCurveTo(W / 2 - 66, dy - 40, W / 2 - 18, dy - 64, W / 2, dy - 92); x.bezierCurveTo(W / 2 + 18, dy - 64, W / 2 + 66, dy - 40, W / 2 + 46, dy); x.closePath(); x.globalAlpha = 0.9; x.fill();
      x.globalAlpha = 1; x.fillRect(W / 2 - 2, dy - 122, 4, 32); x.beginPath(); x.arc(W / 2, dy - 124, 6, 0, 7); x.fill(); x.restore();
      // pillars with small domes (chhatris)
      for (const px of [l - 44, r + 4]) {
        x.save(); x.strokeStyle = t.acc; x.fillStyle = t.acc; x.lineWidth = 2;
        x.strokeRect(px, sh - 40, 40, bot - sh + 40);
        for (let yy = sh; yy < bot - 20; yy += 70) { x.beginPath(); x.moveTo(px + 8, yy); x.lineTo(px + 32, yy); x.stroke(); }
        x.beginPath(); x.moveTo(px - 4, sh - 40); x.bezierCurveTo(px - 4, sh - 80, px + 20, sh - 92, px + 20, sh - 104); x.bezierCurveTo(px + 20, sh - 92, px + 44, sh - 80, px + 44, sh - 40); x.closePath(); x.fill();
        x.restore();
      }
      // hanging lanterns
      for (const lx of [W / 2 - 300, W / 2 + 300]) {
        const ly = 360;
        x.save(); x.strokeStyle = t.acc; x.fillStyle = t.acc; x.lineWidth = 1.5;
        x.beginPath(); x.moveTo(lx, 60); x.lineTo(lx, ly - 24); x.stroke();
        x.beginPath(); x.moveTo(lx - 14, ly - 24); x.lineTo(lx + 14, ly - 24); x.lineTo(lx + 20, ly + 6); x.lineTo(lx, ly + 34); x.lineTo(lx - 20, ly + 6); x.closePath(); x.globalAlpha = 0.85; x.fill();
        x.globalAlpha = 1; x.fillStyle = t.alt; x.beginPath(); x.arc(lx, ly + 4, 6, 0, 7); x.fill();
        x.restore();
      }
      return { top: 385, bottom: H - 120, maxW: r - l - 90, cx: W / 2, ev: 'stack' };
    },
    // A large mandala glowing behind the names, small ones at the corners.
    emerald(x, W, H, t) {
      bgFill(x, W, H, t);
      mandala(x, W / 2, H * 0.36, 300, t, 0.13);
      frame(x, W, H, t, 34, 50);
      x.save(); x.fillStyle = t.acc;
      for (const [cx, cy] of [[50, 50], [W - 50, 50], [50, H - 50], [W - 50, H - 50]]) { x.fillRect(cx - 22, cy - 22, 44, 44); }
      x.restore();
      for (const [cx, cy] of [[50, 50], [W - 50, 50], [50, H - 50], [W - 50, H - 50]]) mandala(x, cx, cy, 16, { ...t, bg: [t.acc, t.acc], alt: t.bg[1] });
      mandala(x, W / 2, 150, 40, t);
      return { top: 260, bottom: H - 110, maxW: W - 250, cx: W / 2, ev: 'stack' };
    },
    // A round wreath of leaves and roses holding the couple's initials; bouquets in the lower corners.
    blush(x, W, H, t, d) {
      bgFill(x, W, H, t);
      x.save(); x.strokeStyle = t.acc; x.globalAlpha = 0.6; x.lineWidth = 1.5; x.strokeRect(46, 46, W - 92, H - 92); x.restore();
      const cx = W / 2, cy = 300, r = 165, green = '#8BA888', dk = '#6E8E6B';
      x.save(); x.strokeStyle = dk; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke(); x.restore();
      for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2, px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r; leaf(x, px, py, 34, a + (i % 2 ? 0.9 : 2.2), i % 3 ? green : dk); }
      [[-0.75, 46], [-0.95, 30], [-0.55, 28], [2.4, 42], [2.2, 26], [2.62, 24], [0.8, 22]].forEach(([a, s]) => rose(x, cx + Math.cos(a) * r, cy + Math.sin(a) * r, s, t.alt, t.acc));
      // monogram
      const ini = [d.groom, d.bride].map(n => (n || '').trim().slice(0, 1).toUpperCase()).join(' ');
      x.save(); x.fillStyle = t.acc; x.textAlign = 'center'; x.font = rtl(ini) ? '700 70px "Noto Nastaliq Urdu", serif' : '110px "Great Vibes", cursive'; x.fillText(ini.replace(' ', ' & '), cx, cy + 34); x.restore();
      for (const [bx, by, fx] of [[110, H - 130, 1], [W - 110, H - 130, -1]]) {
        x.save(); x.translate(bx, by); x.scale(fx, 1);
        [[0, 0, 0.3], [60, -40, -0.6], [-20, -70, -1.4], [90, 10, 0.9]].forEach(([lx, ly, a]) => leaf(x, lx, ly, 70, a, green));
        rose(x, 0, 0, 44, t.alt, t.acc); rose(x, 66, -18, 28, t.alt, t.acc);
        x.restore();
      }
      return { top: 540, bottom: H - 210, maxW: W - 260, cx: W / 2, ev: 'stack', noMono: true };
    },
    // Modern and minimal: fine lines, big serif capitals, events in a neat table.
    ivory(x, W, H, t) {
      x.fillStyle = t.bg[0]; x.fillRect(0, 0, W, H);
      x.save(); x.strokeStyle = t.ink; x.lineWidth = 1.2; x.strokeRect(56, 56, W - 112, H - 112); x.strokeStyle = t.acc; x.lineWidth = 3; x.strokeRect(70, 70, W - 140, H - 140); x.restore();
      x.save(); x.fillStyle = t.acc; for (const [cx, cy] of [[70, 70], [W - 70, 70], [70, H - 70], [W - 70, H - 70]]) { x.beginPath(); x.moveTo(cx, cy - 10); x.lineTo(cx + 10, cy); x.lineTo(cx, cy + 10); x.lineTo(cx - 10, cy); x.fill(); } x.restore();
      return { top: 230, bottom: H - 150, maxW: W - 300, cx: W / 2, ev: 'table', divider: 'rule' };
    },
    // Art deco: gold sunburst fans top and bottom, stepped corners, capital letters.
    navy(x, W, H, t) {
      bgFill(x, W, H, t);
      const fan = (cx, cy, r, up) => {
        x.save(); x.translate(cx, cy); if (!up) x.scale(1, -1);
        x.strokeStyle = t.acc; x.fillStyle = t.acc;
        for (let k = 0; k < 4; k++) { x.lineWidth = k ? 1.5 : 3; x.beginPath(); x.arc(0, 0, r - k * 26, Math.PI, 0); x.stroke(); }
        for (let i = 0; i <= 16; i++) { const a = Math.PI + i * Math.PI / 16; x.lineWidth = 1.2; x.beginPath(); x.moveTo(Math.cos(a) * 30, Math.sin(a) * 30); x.lineTo(Math.cos(a) * (r - 80), Math.sin(a) * (r - 80)); x.stroke(); }
        x.beginPath(); x.arc(0, 0, 26, Math.PI, 0); x.fill();
        x.restore();
      };
      fan(W / 2, 250, 210, true); fan(W / 2, H - 120, 150, false);
      x.save(); x.strokeStyle = t.acc;
      const steps = (a, lw) => { x.lineWidth = lw; x.beginPath(); x.moveTo(a + 60, a); x.lineTo(W - a - 60, a); x.lineTo(W - a - 60, a + 20); x.lineTo(W - a - 40, a + 20); x.lineTo(W - a - 40, a + 40); x.lineTo(W - a - 20, a + 40); x.lineTo(W - a - 20, a + 60); x.lineTo(W - a, a + 60); x.lineTo(W - a, H - a - 60); x.lineTo(W - a - 20, H - a - 60); x.lineTo(W - a - 20, H - a - 40); x.lineTo(W - a - 40, H - a - 40); x.lineTo(W - a - 40, H - a - 20); x.lineTo(W - a - 60, H - a - 20); x.lineTo(W - a - 60, H - a); x.lineTo(a + 60, H - a); x.lineTo(a + 60, H - a - 20); x.lineTo(a + 40, H - a - 20); x.lineTo(a + 40, H - a - 40); x.lineTo(a + 20, H - a - 40); x.lineTo(a + 20, H - a - 60); x.lineTo(a, H - a - 60); x.lineTo(a, a + 60); x.lineTo(a + 20, a + 60); x.lineTo(a + 20, a + 40); x.lineTo(a + 40, a + 40); x.lineTo(a + 40, a + 20); x.lineTo(a + 60, a + 20); x.closePath(); x.stroke(); };
      steps(30, 3); steps(46, 1.2);
      for (const sx of [96, W - 96]) for (let k = 0; k < 3; k++) { x.lineWidth = 1; x.beginPath(); x.moveTo(sx + (k - 1) * 8, 420); x.lineTo(sx + (k - 1) * 8, H - 420); x.stroke(); }
      x.restore();
      return { top: 300, bottom: H - 290, maxW: W - 290, cx: W / 2, ev: 'stack', divider: 'rule' };
    },
    // Mehndi: a toran of marigolds and mango leaves across the top, paisleys at the bottom.
    mehndi(x, W, H, t) {
      bgFill(x, W, H, t);
      frame(x, W, H, t, 30, 44);
      x.save(); x.strokeStyle = t.acc; x.lineWidth = 3; x.beginPath(); x.moveTo(44, 70); for (let k = 0; k <= 12; k++) x.quadraticCurveTo(44 + (k - 0.5) * (W - 88) / 12, 92, 44 + k * (W - 88) / 12, 70); x.stroke(); x.restore();
      for (let k = 0; k < 12; k++) { const lx = 44 + (k + 0.5) * (W - 88) / 12; leaf(x, lx, 84, 60, Math.PI, k % 2 ? '#7FB24A' : '#5C9A3A'); }
      const blooms = (cx, y0, n) => { for (let k = 0; k < n; k++) { const cy = y0 + k * 26; x.save(); x.fillStyle = k % 2 ? t.alt : t.acc; x.beginPath(); x.arc(cx, cy, 12, 0, 7); x.fill(); for (let p = 0; p < 12; p++) { const a = p * Math.PI / 6; x.beginPath(); x.arc(cx + Math.cos(a) * 10, cy + Math.sin(a) * 10, 5.5, 0, 7); x.fill(); } x.restore(); } };
      for (let k = 0; k <= 12; k++) { const cx = 44 + k * (W - 88) / 12; x.save(); x.strokeStyle = t.acc; x.globalAlpha = 0.7; x.lineWidth = 1.2; x.beginPath(); x.moveTo(cx, 72); x.lineTo(cx, 72 + (k % 3 + 3) * 26); x.stroke(); x.restore(); blooms(cx, 96, k % 3 + 3); }
      const paisley = (cx, cy, s, flip) => {
        x.save(); x.translate(cx, cy); x.scale(flip * s, s); x.rotate(-0.35);
        const drop = k => { x.beginPath(); x.moveTo(0, 70 * k); x.bezierCurveTo(-62 * k, 58 * k, -66 * k, -18 * k, -14 * k, -46 * k); x.bezierCurveTo(26 * k, -66 * k, 70 * k, -34 * k, 44 * k, -6 * k); x.bezierCurveTo(30 * k, 8 * k, 14 * k, 2 * k, 18 * k, -16 * k); };
        x.strokeStyle = t.acc; x.lineWidth = 4; drop(1); x.stroke();
        x.lineWidth = 2; x.strokeStyle = t.alt; drop(0.68); x.stroke();
        flower(x, -16, 14, 16, t.alt, t.acc, 6);
        x.fillStyle = t.acc; for (let k = 0; k < 9; k++) { const a = 1.6 + k * 0.42; x.beginPath(); x.arc(-8 + Math.cos(a) * 78, 12 + Math.sin(a) * 66, 4, 0, 7); x.fill(); }
        x.restore();
      };
      paisley(130, H - 140, 1.1, 1); paisley(W - 130, H - 140, 1.1, -1);
      return { top: 330, bottom: H - 210, maxW: W - 260, cx: W / 2, ev: 'stack' };
    },
    // Sage: eucalyptus branches across the corners on a soft cream card.
    sage(x, W, H, t) {
      bgFill(x, W, H, t);
      x.save(); x.strokeStyle = t.acc; x.lineWidth = 1.5; x.strokeRect(54, 54, W - 108, H - 108); x.restore();
      const branch = (sx, sy, ex, ey, n, size) => {
        x.save(); x.strokeStyle = '#7C9474'; x.lineWidth = 3; x.beginPath(); x.moveTo(sx, sy);
        const mx = (sx + ex) / 2 + (ey - sy) * 0.25, my = (sy + ey) / 2 - (ex - sx) * 0.25;
        x.quadraticCurveTo(mx, my, ex, ey); x.stroke();
        for (let k = 1; k <= n; k++) {
          const u = k / (n + 1), px = (1 - u) * (1 - u) * sx + 2 * (1 - u) * u * mx + u * u * ex, py = (1 - u) * (1 - u) * sy + 2 * (1 - u) * u * my + u * u * ey;
          for (const side of [-1, 1]) { x.fillStyle = k % 2 ? '#9DB394' : '#7F9C77'; x.globalAlpha = 0.9; x.beginPath(); x.ellipse(px + side * size * 0.7, py + side * size * 0.15, size * 0.62, size * 0.5, 0.4 * side, 0, 7); x.fill(); }
        }
        x.restore();
      };
      branch(30, 260, 330, 20, 9, 30); branch(20, 420, 190, 70, 6, 24);
      branch(W - 30, H - 260, W - 330, H - 20, 9, 30); branch(W - 20, H - 420, W - 190, H - 70, 6, 24);
      return { top: 250, bottom: H - 170, maxW: W - 300, cx: W / 2, ev: 'stack', divider: 'rule' };
    },
  };

  // ---------- the card ----------
  async function draw(cv, d, opt = {}) {
    await loadFonts();
    const W = cv.width = 1080, H = cv.height = opt.story ? 1920 : 1620;
    const x = cv.getContext('2d'), t = TPL[d.tpl] || TPL.royal, L0 = labels(d.lang), ur = d.lang === 'ur';
    x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    const box = (DESIGNS[d.tpl] || DESIGNS.royal)(x, W, H, t, d);
    const cx = box.cx, maxW = box.maxW;
    // Fonts (Urdu always in Nastaliq)
    const NAST = w => `${w} {s}px "Noto Nastaliq Urdu", serif`;
    const F = {
      head: ur ? NAST(700) : '600 {s}px "Cinzel", Georgia, serif',
      body: ur ? NAST(400) : 'italic 500 {s}px "Cormorant Garamond", Georgia, serif',
      bodyUp: ur ? NAST(400) : '500 {s}px "Cormorant Garamond", Georgia, serif',
      bold: ur ? NAST(700) : '600 {s}px "Cormorant Garamond", Georgia, serif',
      name: n => rtl(n) ? NAST(700) : t.names === 'caps' ? '600 {s}px "Cormorant Garamond", Georgia, serif' : t.names === 'deco' ? '500 {s}px "Cinzel", Georgia, serif' : '{s}px "Great Vibes", cursive',
      amp: ur ? NAST(700) : t.names === 'script' ? '{s}px "Great Vibes", cursive' : 'italic 500 {s}px "Playfair Display", Georgia, serif',
    };
    const caps = s => (ur || rtl(s) ? s : s.toUpperCase());
    const nameSize = n => (rtl(n) ? 92 : t.names === 'script' ? 150 : t.names === 'caps' ? 92 : 88);
    const nameSp = t.names === 'script' ? 0 : 7;
    const ev = d.events.slice(0, 6);

    // Lays everything out top to bottom; with paint = false it only measures.
    function layout(paint, fs, gap) {
      const S = v => v * fs;
      let y = box.top;
      if (d.bismillah) {
        const fl = fitLines(x, L0.bismillah, NAST(700), S(42), maxW);
        if (paint) { x.fillStyle = t.acc; drawLines(x, fl, NAST(700), cx, y, 0); }
        y += S(74);
      } else if (!box.noMono) {
        if (paint) { if (box.divider === 'rule') rule(x, cx, y - 14, 120, t); else mandala(x, cx, y - 20, 26, t); }
        y += S(50);
      }
      const host = caps(d.hosts || L0.together), hl = fitLines(x, host, F.head, S(ur ? 30 : 26), maxW, 2, ur ? 0 : 5);
      if (paint) { x.fillStyle = t.ink; drawLines(x, hl, F.head, cx, y, S(ur ? 62 : 38), ur ? 0 : 5); }
      y += hl.lines.length * S(ur ? 62 : 38) + S(10);
      const rq = fitLines(x, L0.request, F.body, S(ur ? 28 : 34), maxW, 2);
      if (paint) { x.fillStyle = t.ink; drawLines(x, rq, F.body, cx, y, S(ur ? 62 : 44)); }
      y += rq.lines.length * S(ur ? 62 : 44) + gap * 0.8;
      // names
      const person = (who, parent, label) => {
        const shown = t.names === 'script' ? who : caps(who);
        const fl = fitLines(x, shown, F.name(who), S(nameSize(who)), maxW, 2, nameSp, 0.62);
        const lh = fl.size * (rtl(who) ? 1.7 : t.names === 'script' ? 0.95 : 1.08);
        y += lh * (rtl(who) ? 0.75 : 0.82);
        if (paint) { x.fillStyle = t.names === 'caps' ? t.ink : t.acc; drawLines(x, fl, F.name(who), cx, y, lh, nameSp); }
        y += (fl.lines.length - 1) * lh + S(rtl(who) ? 34 : 20);
        if (parent) {
          const pl = fitLines(x, `${label} ${parent}`, F.body, S(ur ? 26 : 31), maxW, 2);
          y += S(ur ? 44 : 30);
          if (paint) { x.fillStyle = t.ink; drawLines(x, pl, F.body, cx, y, S(ur ? 54 : 38)); }
          y += (pl.lines.length - 1) * S(ur ? 54 : 38) + S(10);
        }
      };
      person(d.groom, d.gp, L0.son);
      y += S(ur ? 66 : t.names === 'script' ? 78 : 66);
      if (paint) { x.fillStyle = t.names === 'caps' ? t.acc : t.alt; setFont(x, F.amp, S(ur ? 60 : t.names === 'script' ? 100 : 64)); x.direction = ur ? 'rtl' : 'ltr'; x.fillText(ur ? 'و' : '&', cx, y); }
      y += S(10);
      person(d.bride, d.bp, L0.daughter);
      if (d.msg) {
        const ml = fitLines(x, d.msg.replace(/\s*\n\s*/g, ' '), F.body, S(ur ? 26 : 31), maxW, 3);
        y += S(28) + gap * 0.3;
        y += S(ur ? 54 : 40);
        if (paint) { x.fillStyle = t.ink; drawLines(x, ml, F.body, cx, y, S(ur ? 56 : 40)); }
        y += (ml.lines.length - 1) * S(ur ? 56 : 40);
      }
      y += S(46) + gap;
      if (paint) { if (box.divider === 'rule') rule(x, cx, y, 300, t); else flourish(x, cx, y, 440, t); }
      y += S(ur ? 76 : 70) + gap * 0.5;
      // events
      if (box.ev === 'table' && !ur) {
        const left = cx - maxW / 2, right = cx + maxW / 2, colL = maxW * 0.36;
        ev.forEach((e, k) => {
          const nm = fitLines(x, caps(e.name), F.head, S(30), colL - 20, 2, 4);
          const dt = fitLines(x, fmtDate(e.date, d.lang), F.bold, S(31), maxW - colL, 1);
          const tv = fitLines(x, [fmtTime(e.time, d.lang), e.venue].filter(Boolean).join(' · '), F.bodyUp, S(28), maxW - colL, 2);
          const ad = e.address ? fitLines(x, e.address, F.body, S(25), maxW - colL, 1) : { lines: [] };
          const rowH = Math.max(nm.lines.length * S(38), S(40) + tv.lines.length * S(34) + ad.lines.length * S(30)) + S(20);
          if (paint) {
            x.fillStyle = t.acc; drawLines(x, nm, F.head, left, y + S(6), S(38), 4, 'left');
            x.fillStyle = t.ink; drawLines(x, dt, F.bold, right, y + S(6), 0, 0, 'right');
            drawLines(x, tv, F.bodyUp, right, y + S(44), S(34), 0, 'right');
            if (ad.lines.length) { x.globalAlpha = 0.75; drawLines(x, ad, F.body, right, y + S(44) + tv.lines.length * S(34), 0, 0, 'right'); x.globalAlpha = 1; }
            if (k < ev.length - 1) { x.save(); x.strokeStyle = t.acc; x.globalAlpha = 0.4; x.lineWidth = 1; x.beginPath(); x.moveTo(left, y + rowH - S(14)); x.lineTo(right, y + rowH - S(14)); x.stroke(); x.restore(); }
          }
          y += rowH + gap * 0.6;
        });
      } else {
        const cols = ev.length > 2 ? 2 : 1, colW = cols === 2 ? maxW / 2 - 24 : maxW, rows = Math.ceil(ev.length / cols);
        let rowTop = y;
        for (let r = 0; r < rows; r++) {
          let rowH = 0;
          for (let c = 0; c < cols; c++) {
            const k = r * cols + (ur ? cols - 1 - c : c), e = ev[k];
            if (!e) continue;
            const alone = cols === 2 && r === rows - 1 && ev.length % 2;
            const ex = cols === 1 || alone ? cx : cx + (c ? 1 : -1) * (maxW / 4 + 12);
            let yy = rowTop;
            const nm = fitLines(x, caps(e.name), F.head, S(ur ? 34 : 38), colW, 2, ur ? 0 : 4);
            if (paint) { x.fillStyle = t.acc; drawLines(x, nm, F.head, ex, yy, S(ur ? 62 : 46), ur ? 0 : 4); }
            yy += nm.lines.length * S(ur ? 62 : 46);
            const dt = fitLines(x, fmtDate(e.date, d.lang), F.bold, S(ur ? 26 : 32), colW, 2);
            if (paint) { x.fillStyle = t.ink; drawLines(x, dt, F.bold, ex, yy, S(ur ? 54 : 38)); }
            yy += dt.lines.length * S(ur ? 54 : 38);
            const tvp = [fmtTime(e.time, d.lang), e.venue].filter(Boolean), tvs = tvp.join(tvp.some(rtl) ? ' ، ' : ' · ');
            if (tvs) { const tv = fitLines(x, tvs, F.bodyUp, S(ur ? 24 : 29), colW, 2); if (paint) drawLines(x, tv, F.bodyUp, ex, yy, S(ur ? 52 : 35)); yy += tv.lines.length * S(ur ? 52 : 35); }
            if (e.address) { const ad = fitLines(x, e.address, F.body, S(ur ? 21 : 25), colW, 2); if (paint) { x.globalAlpha = 0.8; drawLines(x, ad, F.body, ex, yy, S(ur ? 46 : 31)); x.globalAlpha = 1; } yy += ad.lines.length * S(ur ? 46 : 31); }
            rowH = Math.max(rowH, yy - rowTop);
          }
          if (paint && cols === 2 && !(r === rows - 1 && ev.length % 2)) { x.save(); x.strokeStyle = t.acc; x.globalAlpha = 0.4; x.lineWidth = 1.2; x.beginPath(); x.moveTo(cx, rowTop - S(30)); x.lineTo(cx, rowTop + rowH - S(30)); x.stroke(); x.restore(); }
          rowTop += rowH + S(24) + gap;
        }
        y = rowTop - gap;
      }
      return y;
    }
    // Measure, shrink everything if it doesn't fit, then share the spare height out between the sections.
    const contacts = (d.contacts || []).filter(c => c.name || c.phone);
    const bottom = box.bottom - (contacts.length ? 70 : 0);
    let fs = 1, used = layout(false, fs, 0);
    for (let n = 0; n < 6 && used > bottom; n++) { fs *= Math.max(0.7, (bottom - box.top) / (used - box.top)); used = layout(false, fs, 0); }
    const slots = 3.4 + Math.ceil(ev.length / (ev.length > 2 && !(box.ev === 'table' && !ur) ? 2 : 1));
    const gap = Math.max(0, Math.min(120, (bottom - used) / slots));
    layout(true, fs, gap);
    // footer
    if (contacts.length) {
      const txt = L0.rsvpLine + ': ' + contacts.map(c => [c.name, c.phone].filter(Boolean).join(' ')).join(ur ? ' ، ' : ' · ');
      const fl = fitLines(x, txt, F.bodyUp, ur ? 24 : 27, maxW, 2);
      x.fillStyle = t.ink; drawLines(x, fl, F.bodyUp, cx, box.bottom - (fl.lines.length > 1 ? 40 : 10), ur ? 50 : 34);
    }
    if ('letterSpacing' in x) x.letterSpacing = '0px';
    return cv;
  }

  return { draw, loadFonts, labels, fmtDate, fmtTime, TPL };
})();
