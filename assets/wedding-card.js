'use strict';
// Wedding invitation card, drawn on a canvas (1080 × 1620, or 1080 × 1920 for a phone story).
// Used by the Wedding Card Maker tool (live preview and download) and by the online invitation page,
// so both always look the same. Six designs, English or Urdu.
window.WeddingCard = (() => {
  const TPL = {
    royal: { bg: ['#7A1A2B', '#3A0712'], ink: '#F7E7C1', acc: '#D9B25F', alt: '#F0D18A', dark: true, motif: 'arch' },
    emerald: { bg: ['#12684F', '#052A20'], ink: '#F3EBD3', acc: '#D4AF37', alt: '#EBD07A', dark: true, motif: 'arch' },
    navy: { bg: ['#203B70', '#081129'], ink: '#F2E8CF', acc: '#C9A54C', alt: '#E6C979', dark: true, motif: 'deco' },
    mehndi: { bg: ['#3F7A2A', '#173214'], ink: '#FFF6D6', acc: '#F2C94C', alt: '#F79A3E', dark: true, motif: 'marigold' },
    blush: { bg: ['#FFF8F6', '#F2CFD8'], ink: '#5A2A3A', acc: '#B76E79', alt: '#D9A3AE', dark: false, motif: 'floral' },
    ivory: { bg: ['#FFFDF8', '#ECDFC4'], ink: '#3B2F2A', acc: '#9A7537', alt: '#C7A867', dark: false, motif: 'floral' },
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
        l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Great+Vibes&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap';
        document.head.appendChild(l);
      }
      l.addEventListener('load', res); l.addEventListener('error', res);
    });
    const want = ['118px "Great Vibes"', '600 30px "Cinzel"', '500 30px "Cormorant Garamond"', 'italic 500 30px "Cormorant Garamond"', '600 30px "Cormorant Garamond"', '400 30px "Noto Nastaliq Urdu"', '700 30px "Noto Nastaliq Urdu"'];
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

  // ---------- drawing helpers ----------
  function fit(x, text, font, size, maxW, min = 16) {
    let s = size;
    x.font = font.replace('{s}', s);
    while (x.measureText(text).width > maxW && s > min) { s -= 2; x.font = font.replace('{s}', s); }
    return s;
  }
  function wrap(x, text, maxW) {
    const out = [];
    for (const para of String(text).split('\n')) {
      let line = '';
      for (const w of para.split(/\s+/)) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; }
      if (line) out.push(line);
    }
    return out;
  }
  // Letter-spaced capitals (Cinzel headings).
  function spaced(x, text, cx, y, gap) {
    if ('letterSpacing' in x) { x.letterSpacing = gap + 'px'; x.fillText(text, cx + gap / 2, y); x.letterSpacing = '0px'; return; }
    x.fillText(text, cx, y);
  }

  function petal(x, cx, cy, len, wid, ang) {
    x.save(); x.translate(cx, cy); x.rotate(ang);
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(wid, -len / 2, 0, -len); x.quadraticCurveTo(-wid, -len / 2, 0, 0); x.fill();
    x.restore();
  }
  // A round medallion of petals and rings.
  function mandala(x, cx, cy, r, t) {
    x.save();
    x.fillStyle = t.acc; x.strokeStyle = t.acc;
    x.globalAlpha = .95;
    for (let i = 0; i < 16; i++) petal(x, cx, cy, r, r * .22, i * Math.PI / 8);
    x.fillStyle = t.dark ? t.bg[1] : t.bg[0];
    x.beginPath(); x.arc(cx, cy, r * .52, 0, 7); x.fill();
    x.fillStyle = t.alt;
    for (let i = 0; i < 8; i++) petal(x, cx, cy, r * .5, r * .14, i * Math.PI / 4 + Math.PI / 8);
    x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, r * 1.08, 0, 7); x.stroke();
    x.fillStyle = t.acc; x.beginPath(); x.arc(cx, cy, r * .12, 0, 7); x.fill();
    for (let i = 0; i < 32; i++) { const a = i * Math.PI / 16; x.beginPath(); x.arc(cx + Math.cos(a) * r * 1.22, cy + Math.sin(a) * r * 1.22, r * .035, 0, 7); x.fill(); }
    x.restore();
  }
  // A quarter medallion tucked into a corner.
  function corner(x, cx, cy, r, rot, t) {
    x.save(); x.translate(cx, cy); x.rotate(rot);
    x.fillStyle = t.acc;
    for (let i = 0; i <= 6; i++) petal(x, 0, 0, r, r * .2, Math.PI / 2 + i * Math.PI / 12);
    x.fillStyle = t.alt;
    for (let i = 0; i <= 3; i++) petal(x, 0, 0, r * .55, r * .14, Math.PI / 2 + Math.PI / 24 + i * Math.PI / 6.5);
    x.restore();
  }
  // Horizontal flourish with curls and a diamond in the middle.
  function flourish(x, cx, y, w, t) {
    x.save(); x.strokeStyle = t.acc; x.fillStyle = t.acc; x.lineWidth = 2.2; x.lineCap = 'round';
    for (const s of [-1, 1]) {
      x.beginPath(); x.moveTo(cx + s * 22, y); x.bezierCurveTo(cx + s * w * .25, y - 16, cx + s * w * .38, y + 16, cx + s * w * .5, y); x.stroke();
      x.beginPath(); x.moveTo(cx + s * w * .32, y + 2); x.quadraticCurveTo(cx + s * w * .36, y - 22, cx + s * w * .27, y - 18); x.stroke();
      x.beginPath(); x.arc(cx + s * w * .5, y, 3.5, 0, 7); x.fill();
    }
    x.beginPath(); x.moveTo(cx, y - 11); x.lineTo(cx + 11, y); x.lineTo(cx, y + 11); x.lineTo(cx - 11, y); x.closePath(); x.fill();
    x.restore();
  }
  function flower(x, cx, cy, r, t, col) {
    x.save(); x.fillStyle = col;
    for (let i = 0; i < 5; i++) petal(x, cx, cy, r, r * .55, i * Math.PI * 2 / 5);
    x.fillStyle = t.acc; x.beginPath(); x.arc(cx, cy, r * .22, 0, 7); x.fill();
    x.restore();
  }
  function leaf(x, cx, cy, len, ang, col) { x.save(); x.fillStyle = col; petal(x, cx, cy, len, len * .3, ang); x.restore(); }
  // Flowers and leaves gathered in a corner (light designs).
  function bouquet(x, cx, cy, s, flip, t) {
    x.save(); x.translate(cx, cy); x.scale(flip[0], flip[1]);
    const green = t.dark ? 'rgba(255,255,255,.25)' : 'rgba(110,140,100,.55)';
    [[30, 120, -0.2], [120, 30, 1.8], [80, 150, 0.4], [150, 70, 1.3], [55, 60, 0.8]].forEach(([lx, ly, a]) => leaf(x, lx * s, ly * s, 70 * s, a, green));
    flower(x, 70 * s, 70 * s, 52 * s, t, t.alt);
    flower(x, 150 * s, 40 * s, 32 * s, t, t.acc);
    flower(x, 40 * s, 150 * s, 32 * s, t, t.acc);
    flower(x, 130 * s, 125 * s, 20 * s, t, t.alt);
    x.restore();
  }
  function marigolds(x, W, y, t) {
    x.save();
    for (let i = 0; i < 9; i++) {
      const cx = 140 + i * (W - 280) / 8, len = 60 + (i % 2) * 40;
      x.strokeStyle = t.acc; x.globalAlpha = .7; x.lineWidth = 1.5; x.beginPath(); x.moveTo(cx, y); x.lineTo(cx, y + len); x.stroke(); x.globalAlpha = 1;
      for (let k = 0; k < 3; k++) { const fy = y + 14 + k * (len / 3); x.fillStyle = k % 2 ? t.alt : t.acc; x.beginPath(); x.arc(cx, fy, 11, 0, 7); x.fill(); for (let p = 0; p < 10; p++) { const a = p * Math.PI / 5; x.beginPath(); x.arc(cx + Math.cos(a) * 9, fy + Math.sin(a) * 9, 5, 0, 7); x.fill(); } }
    }
    x.restore();
  }
  // Mughal arch (cusped top) inside the frame.
  function arch(x, W, H, t, inset) {
    const l = 96 + inset, r = W - 96 - inset, top = 170 + inset, bot = H - 80 - inset, shoulder = 470 + inset;
    x.beginPath();
    x.moveTo(l, bot); x.lineTo(l, shoulder);
    x.bezierCurveTo(l, shoulder - 150, W / 2 - 200, shoulder - 170, W / 2 - 60, top + 60);
    x.quadraticCurveTo(W / 2 - 10, top + 20, W / 2, top);
    x.quadraticCurveTo(W / 2 + 10, top + 20, W / 2 + 60, top + 60);
    x.bezierCurveTo(W / 2 + 200, shoulder - 170, r, shoulder - 150, r, shoulder);
    x.lineTo(r, bot);
  }

  // ---------- the card ----------
  async function draw(cv, d, opt = {}) {
    await loadFonts();
    const W = cv.width = 1080, H = cv.height = opt.story ? 1920 : 1620;
    const x = cv.getContext('2d'), t = TPL[d.tpl] || TPL.royal, L0 = labels(d.lang), ur = d.lang === 'ur';
    const serif = ur ? '{w} {s}px "Noto Nastaliq Urdu", serif' : '{w} {s}px "Cormorant Garamond", Georgia, serif';
    const head = ur ? '700 {s}px "Noto Nastaliq Urdu", serif' : '600 {s}px "Cinzel", Georgia, serif';
    const script = ur ? '700 {s}px "Noto Nastaliq Urdu", serif' : '{s}px "Great Vibes", cursive';
    const F = (f, w = '500') => f.replace('{w}', w);
    x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.direction = ur ? 'rtl' : 'ltr';

    // background, faint pattern, frame
    const g = x.createRadialGradient(W / 2, H * .18, 60, W / 2, H * .5, H * .85);
    g.addColorStop(0, t.bg[0]); g.addColorStop(1, t.bg[1]);
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.save(); x.fillStyle = t.acc; x.globalAlpha = t.dark ? .07 : .09;
    for (let yy = 30; yy < H; yy += 60) for (let xx = (yy / 60) % 2 ? 30 : 60; xx < W; xx += 60) { x.beginPath(); x.moveTo(xx, yy - 6); x.lineTo(xx + 6, yy); x.lineTo(xx, yy + 6); x.lineTo(xx - 6, yy); x.fill(); }
    x.restore();
    x.strokeStyle = t.acc; x.lineWidth = 4; x.strokeRect(36, 36, W - 72, H - 72);
    x.lineWidth = 1.5; x.strokeRect(52, 52, W - 104, H - 104);
    if (t.motif === 'arch' || t.motif === 'deco') {
      x.save(); arch(x, W, H, t, 0); x.closePath(); x.fillStyle = t.dark ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.35)'; x.fill();
      x.strokeStyle = t.acc; x.lineWidth = 3; arch(x, W, H, t, 0); x.stroke(); x.lineWidth = 1.2; arch(x, W, H, t, 16); x.stroke(); x.restore();
    }
    if (t.motif === 'floral') { bouquet(x, 40, 40, 1.15, [1, 1], t); bouquet(x, W - 40, 40, 1.15, [-1, 1], t); bouquet(x, 40, H - 40, 1.15, [1, -1], t); bouquet(x, W - 40, H - 40, 1.15, [-1, -1], t); }
    else { const r = 64; corner(x, 52, 52, r, 0, t); corner(x, W - 52, 52, r, Math.PI / 2, t); corner(x, W - 52, H - 52, r, Math.PI, t); corner(x, 52, H - 52, r, -Math.PI / 2, t); }
    if (t.motif === 'marigold') marigolds(x, W, 58, t);

    // Text is laid out twice: once to measure, then for real with the spare height shared out between sections,
    // so the card is filled evenly whether it has one event or six. fs shrinks everything if it doesn't fit.
    const top = (t.motif === 'arch' || t.motif === 'deco') ? 300 : t.motif === 'marigold' ? 270 : 235;
    const bottom = H - (d.contacts && d.contacts.length ? 175 : 130);
    const maxW = 780, rtl = s => /[؀-ۿ]/.test(s);
    const nameFont = s => rtl(s) ? '700 {s}px "Noto Nastaliq Urdu", serif' : '{s}px "Great Vibes", cursive';
    const ev = d.events.slice(0, 6), cols = ev.length > 2 ? 2 : 1, rows = Math.ceil(ev.length / cols), colW = cols === 2 ? 390 : maxW;
    // Each piece of text runs in its own direction (Urdu right to left, English left to right), so punctuation lands right.
    const say = (txt, cx, yy) => { x.direction = rtl(txt) ? 'rtl' : 'ltr'; x.fillText(txt, cx, yy); };
    const sep = (...parts) => parts.some(rtl) ? ' ، ' : ' · ';
    function layout(paint, fs, gap) {
      let y = top;
      const S = v => Math.round(v * fs);
      x.fillStyle = t.acc;
      if (d.bismillah) {
        if (paint) { x.font = `700 ${S(42)}px "Noto Nastaliq Urdu", serif`; x.direction = 'rtl'; x.fillText(L0.bismillah, W / 2, y); x.direction = ur ? 'rtl' : 'ltr'; }
        y += S(72);
      } else { if (paint) mandala(x, W / 2, y - 26, 36, t); y += S(52); }
      const hostLine = d.hosts || L0.together, hl = ur || rtl(hostLine) ? hostLine : hostLine.toUpperCase();
      if (paint) { x.fillStyle = t.ink; fit(x, hl, head, S(ur ? 32 : 28), maxW); spaced(x, hl, W / 2, y, ur ? 0 : 6); }
      y += S(ur ? 74 : 54);
      x.font = F(serif, ur ? '400' : 'italic 500').replace('{s}', S(ur ? 30 : 35));
      for (const line of wrap(x, L0.request, maxW)) { if (paint) { x.fillStyle = t.ink; say(line, W / 2, y); } y += S(ur ? 66 : 46); }
      y += gap;
      // names
      const nm = (who, parent, label) => {
        const big = S(rtl(who) ? 96 : 150);
        y += S(rtl(who) ? 70 : 96);
        if (paint) { x.fillStyle = t.acc; fit(x, who, nameFont(who), big, maxW + 40); say(who, W / 2, y); }
        y += S(rtl(who) ? 44 : 40);
        if (parent) { y += S(ur ? 40 : 18); if (paint) { x.fillStyle = t.ink; x.font = F(serif, ur ? '400' : 'italic 500').replace('{s}', S(ur ? 28 : 33)); fit(x, `${label} ${parent}`, F(serif, ur ? '400' : 'italic 500'), S(ur ? 28 : 33), maxW); say(`${label} ${parent}`, W / 2, y); } y += S(ur ? 30 : 20); }
      };
      nm(d.groom, d.gp, L0.son);
      y += S(ur ? 66 : 74);
      if (paint) { x.fillStyle = t.alt; x.font = ur ? `700 ${S(64)}px "Noto Nastaliq Urdu", serif` : `${S(100)}px "Great Vibes", cursive`; x.fillText(ur ? 'و' : '&', W / 2, y); }
      y += S(10);
      nm(d.bride, d.bp, L0.daughter);
      if (d.msg) {
        y += S(30) + gap * .3;
        x.font = F(serif, ur ? '400' : 'italic 500').replace('{s}', S(ur ? 28 : 33));
        for (const line of wrap(x, d.msg, maxW).slice(0, 3)) { y += S(ur ? 60 : 44); if (paint) { x.fillStyle = t.ink; say(line, W / 2, y); } }
      }
      y += S(46) + gap;
      if (paint) flourish(x, W / 2, y, 440, t);
      y += S(ur ? 78 : 76) + gap * .6;
      // events: one column for 1–2, two columns for more
      const evTop = y;
      let rowH = 0;
      ev.forEach((e, i) => {
        const c = cols === 2 ? (ur ? 1 - i % 2 : i % 2) : 0, r = Math.floor(i / cols);
        const alone = cols === 2 && i === ev.length - 1 && ev.length % 2; // an odd last event sits in the middle
        const cx = cols === 2 && !alone ? (c ? W / 2 + 205 : W / 2 - 205) : W / 2;
        let yy = evTop + r * (rowH || 0);
        const start = yy;
        const en = ur || rtl(e.name) ? e.name : e.name.toUpperCase();
        if (paint) { x.fillStyle = t.acc; fit(x, en, head, S(ur ? 36 : 40), colW); x.direction = rtl(en) ? 'rtl' : 'ltr'; spaced(x, en, cx, yy, rtl(en) ? 0 : 5); }
        yy += S(ur ? 66 : 50);
        const dateTxt = fmtDate(e.date, d.lang);
        if (paint) { x.fillStyle = t.ink; fit(x, dateTxt, F(serif, '600'), S(ur ? 28 : 34), colW); say(dateTxt, cx, yy); }
        yy += S(ur ? 58 : 42);
        const tvp = [fmtTime(e.time, d.lang), e.venue].filter(Boolean), tv = tvp.join(sep(...tvp));
        if (tv) { if (paint) { fit(x, tv, F(serif, '500'), S(ur ? 25 : 31), colW); say(tv, cx, yy); } yy += S(ur ? 54 : 38); }
        if (e.address) { if (paint) { x.globalAlpha = .8; fit(x, e.address, F(serif, ur ? '400' : 'italic 500'), S(ur ? 22 : 27), colW); say(e.address, cx, yy); x.globalAlpha = 1; } yy += S(ur ? 48 : 34); }
        rowH = Math.max(rowH, yy - start + S(26) + gap);
      });
      // each row starts below the tallest block of the rows before it
      y = evTop + rows * rowH - gap;
      if (paint && cols === 2 && rows) { x.save(); x.strokeStyle = t.acc; x.globalAlpha = .45; x.lineWidth = 1.2; x.beginPath(); x.moveTo(W / 2, evTop - S(34)); x.lineTo(W / 2, evTop + Math.floor(ev.length / 2) * rowH - gap - S(40)); x.stroke(); x.restore(); }
      return y;
    }
    // Measure, then share the spare height out (3 gaps between sections plus one per event row).
    let fs = 1, used = layout(false, fs, 0);
    if (used > bottom) { fs = Math.max(.72, (bottom - top) / (used - top)); used = layout(false, fs, 0); }
    const slots = 3.9 + rows;
    const gap = Math.max(0, Math.min(150, (bottom - used) / slots));
    layout(true, fs, gap);
    // footer
    if (d.contacts && d.contacts.length) {
      const txt = L0.rsvpLine + ': ' + d.contacts.map(c => [c.name, c.phone].filter(Boolean).join(' ')).join(ur ? ' ، ' : ' · ');
      x.fillStyle = t.ink; fit(x, txt, F(serif, '500'), ur ? 24 : 27, maxW); x.direction = ur ? 'rtl' : 'ltr'; x.fillText(txt, W / 2, H - 120);
    }
    flourish(x, W / 2, H - 82, 220, t);
    return cv;
  }

  return { draw, loadFonts, labels, fmtDate, fmtTime, TPL };
})();
