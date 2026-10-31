'use strict';
// Wedding invitation card, drawn on a canvas (1080 × 1620, or 1080 × 1920 for a phone story).
// Used by the Wedding Card Maker tool (live preview, thumbnails, download) and by the online invitation page,
// so both always look the same. Sixteen designs in eight groups, each with its own layout and ornaments; English or Urdu.
// Text never runs outside the card: a line first gets a little smaller, then wraps, then ends with "…".
window.WeddingCard = (() => {
  // names: how the couple's names are written. script = handwriting, caps = serif capitals, deco = Cinzel capitals,
  // serif = large italic serif. head: 'sans' writes the small headings in Montserrat. cat: the groups it shows in.
  // New designs (2026 look): type-led, lots of space, paper textures. type = the fonts and sizes they use.
  const TY = {
    serif: { name: 'instrument', nameSize: 150, nameLh: 0.98, amp: 'instrumentI', ampSize: 96, ampGap: 76, inlineSize: 112, nameGap: 12 },
    bodoni: { name: 'bodoni', nameSize: 148, nameLh: 1.0, amp: 'bodoniI', ampSize: 92, ampGap: 76, inlineSize: 104, nameGap: 18 },
    ballet: { name: 'ballet', nameSize: 128, nameLh: 1.3, amp: 'instrumentI', ampSize: 80, ampGap: 78, inlineSize: 108, nameGap: 34 },
    fraunces: { name: 'fraunces', nameSize: 128, nameLh: 1.02, amp: 'fraunces', ampSize: 84, ampGap: 74, inlineSize: 100, nameGap: 10 },
  };
  // names: how older designs write the couple's names. script = handwriting, caps = serif capitals, deco = Cinzel capitals,
  // serif = large italic serif. head: 'sans' writes the small headings in Montserrat. cat: the groups it shows in.
  const TPL = {
    archway: { name: 'Arch & seal', cat: 'modern floral', bg: ['#B65D3E', '#9C4A2F'], ink: '#3A2A22', acc: '#A0502F', alt: '#A0502F', nameCol: '#7E3B22', type: TY.ballet },
    atelier: { name: 'Editorial', cat: 'modern', bg: ['#F2EDE4', '#F2EDE4'], ink: '#1A1917', acc: '#1A1917', alt: '#1A1917', nameCol: '#1A1917', type: TY.serif },
    palace: { name: 'Mughal pastel', cat: 'islamic floral', bg: ['#FBE6DA', '#E6DAF0'], ink: '#4B2E3E', acc: '#A2714F', alt: '#A2714F', nameCol: '#7A3E5E', type: TY.ballet },
    nikahline: { name: 'Nikah jaali', cat: 'islamic', bg: ['#FBF8F1', '#FBF8F1'], ink: '#2C3A36', acc: '#AE8A48', alt: '#AE8A48', nameCol: '#1F4D45', type: TY.serif },
    bordeaux: { name: 'Bordeaux', cat: 'luxury modern', bg: ['#6A1F29', '#4A121A'], ink: '#F6EDE3', acc: '#F6EDE3', alt: '#E8C9A8', nameCol: '#F6EDE3', type: TY.serif },
    stone: { name: 'Quiet luxury', cat: 'luxury modern', bg: ['#D6CEC1', '#CFC6B8'], ink: '#3B3631', acc: '#76845F', alt: '#76845F', nameCol: '#3B3631', type: { ...TY.bodoni, nameSize: 84, nameLh: 1.2, caps: true, nameSp: 9, inlineSize: 70, ampSize: 70, ampGap: 62 } },
    goldline: { name: 'Gold line', cat: 'floral luxury', bg: ['#FBF7F0', '#FBF7F0'], ink: '#3F3A34', acc: '#A88444', alt: '#A88444', foil: true, type: TY.ballet },
    wildflower: { name: 'Wildflower', cat: 'floral', bg: ['#FDFBF6', '#FDFBF6'], ink: '#2F3A2C', acc: '#5E7550', alt: '#C2683F', nameCol: '#2F4A2A', type: { ...TY.serif, name: 'instrumentI' } },
    noirink: { name: 'Black tie', cat: 'luxury modern', bg: ['#141414', '#0C0C0C'], ink: '#F1EEE8', acc: '#F1EEE8', alt: '#BDB6AA', nameCol: '#F1EEE8', type: TY.bodoni },
    mehndipop: { name: 'Mehndi night', cat: 'mehndi', bg: ['#D81E6A', '#9A1048'], ink: '#FFF4E6', acc: '#FFD54F', alt: '#FFD54F', nameCol: '#FFF4E6', type: { ...TY.fraunces, inlineSize: 84 } },
    retro: { name: 'Groovy', cat: 'mehndi modern', bg: ['#F6E9D6', '#F6E9D6'], ink: '#4A2C1D', acc: '#C8643B', alt: '#C8643B', nameCol: '#B5502B', type: TY.fraunces },
    magazine: { name: 'Magazine', cat: 'photo modern', bg: ['#2B2F38', '#14161B'], ink: '#FFFFFF', acc: '#FFFFFF', alt: '#F1E2C8', nameCol: '#FFFFFF', dark: true, type: TY.bodoni },
    photo: { name: 'Photo arch', cat: 'photo floral', bg: ['#F6F0E8', '#E9DED0'], ink: '#3B302A', acc: '#9C774C', alt: '#C9A98A', names: 'script' },
    cover: { name: 'Photo cover', cat: 'photo luxury', bg: ['#3A1F2B', '#140B10'], ink: '#F4EADF', acc: '#E0BF7A', alt: '#F2D9A6', dark: true, names: 'script' },
    // Traditional designs
    royal: { name: 'Royal', cat: 'classic islamic', bg: ['#7A1A2B', '#3A0712'], ink: '#F7E7C1', acc: '#D9B25F', alt: '#F0D18A', dark: true, names: 'script' },
    nikah: { name: 'Nikah arch', cat: 'classic islamic', bg: ['#0F4A4F', '#062A2E'], ink: '#203538', acc: '#AE8838', alt: '#AE8838', names: 'script', nameCol: '#0F5E63' },
    emerald: { name: 'Emerald', cat: 'classic', bg: ['#12684F', '#052A20'], ink: '#F3EBD3', acc: '#D4AF37', alt: '#EBD07A', dark: true, names: 'script' },
    mehndi: { name: 'Mehndi', cat: 'classic mehndi', bg: ['#3F7A2A', '#173214'], ink: '#FFF6D6', acc: '#F2C94C', alt: '#F79A3E', dark: true, names: 'script' },
    truckart: { name: 'Truck art', cat: 'classic mehndi', bg: ['#D81B60', '#7A0C3B'], ink: '#3D0F2C', acc: '#C2185B', alt: '#00897B', names: 'script' },
    blush: { name: 'Blush', cat: 'classic', bg: ['#FFF8F6', '#F4D7DE'], ink: '#5A2A3A', acc: '#B76E79', alt: '#E5A3B3', dark: false, names: 'script' },
    garden: { name: 'Garden', cat: 'classic', bg: ['#FFFDFA', '#FBF3EE'], ink: '#4A3A44', acc: '#A9566F', alt: '#C9906E', names: 'script' },
    sage: { name: 'Sage', cat: 'classic', bg: ['#FBFAF4', '#E9EEE3'], ink: '#2F3B2E', acc: '#6E8B65', alt: '#A9BFA0', dark: false, names: 'script' },
    editorial: { name: 'Side date', cat: 'classic', bg: ['#F5F1EA', '#EFE9DF'], ink: '#1C1B1A', acc: '#9C4A2F', alt: '#9C4A2F', names: 'serif', head: 'sans' },
    ivory: { name: 'Classic', cat: 'classic', bg: ['#FFFEFB', '#F3EDE2'], ink: '#2B2622', acc: '#A8843F', alt: '#C9A96A', dark: false, names: 'caps' },
    monogram: { name: 'Monogram', cat: 'classic', bg: ['#1A3F37', '#0D241F'], ink: '#26302D', acc: '#A8863F', alt: '#E6D19F', names: 'deco' },
    noir: { name: 'Noir gold', cat: 'classic', bg: ['#171717', '#050505'], ink: '#ECE4D2', acc: '#D4AF37', alt: '#F1DA9A', dark: true, names: 'deco' },
    navy: { name: 'Art deco', cat: 'classic', bg: ['#1B3366', '#070F24'], ink: '#F2E8CF', acc: '#D4B062', alt: '#E9CF8A', dark: true, names: 'deco' },
    savedate: { name: 'Save the date', cat: 'classic', bg: ['#F3EDE5', '#E6DBCD'], ink: '#2E2A26', acc: '#8E5F43', alt: '#C8A27C', names: 'script', head: 'sans' },
  };
  const CATS = [['new', 'New 2026'], ['islamic', 'Nikah'], ['mehndi', 'Mehndi'], ['floral', 'Floral'], ['modern', 'Modern'], ['luxury', 'Luxury'], ['photo', 'With photo'], ['classic', 'Traditional'], ['all', 'All']];
  const L = {
    en: { together: 'Together with their families', request: 'request the pleasure of your company at the wedding of', son: 'son of', daughter: 'daughter of', invite: 'Wedding invitation', tap: 'Tap to open',
      save: 'Save the card', share: 'Share', countdown: 'Counting down to', thanks: 'Thank you for celebrating with us', events: 'Celebrations', directions: 'Directions', calendar: 'Add to calendar',
      rsvp: 'Will you join us?', by: 'please reply by', yourName: 'Your name', coming: 'Coming?', yes: 'Joyfully accept', maybe: 'Maybe', no: 'Regretfully decline', guests: 'Number of guests',
      phone: 'Phone (optional)', message: 'A message for the couple (optional)', send: 'Send reply', thanksRsvp: 'Thank you for your reply!', change: 'Change my reply', contact: 'For any questions',
      units: ['Days', 'Hours', 'Min', 'Sec'], rsvpLine: 'RSVP', bismillah: 'بسم اللہ الرحمن الرحیم', at: 'at',
      std: 'Save the date', married: 'are getting married', invite2: 'invite you to celebrate their wedding', weddingOf: 'The wedding of' },
    ur: { together: 'اپنے اہلِ خانہ کے ہمراہ', request: 'آپ کو شادی کی پُرمسرت تقریب میں شرکت کی دعوت دیتے ہیں', son: 'ولد', daughter: 'بنت', invite: 'دعوتِ شادی', tap: 'کھولنے کے لیے چھوئیں',
      save: 'کارڈ محفوظ کریں', share: 'شیئر کریں', countdown: 'باقی وقت', thanks: 'ہماری خوشیوں میں شریک ہونے کا شکریہ', events: 'تقریبات', directions: 'راستہ', calendar: 'کیلنڈر میں شامل کریں',
      rsvp: 'کیا آپ تشریف لائیں گے؟', by: 'جواب کی آخری تاریخ', yourName: 'آپ کا نام', coming: 'آمد', yes: 'ضرور آئیں گے', maybe: 'شاید', no: 'معذرت', guests: 'مہمانوں کی تعداد',
      phone: 'فون (اختیاری)', message: 'دلہا دلہن کے لیے پیغام (اختیاری)', send: 'جواب بھیجیں', thanksRsvp: 'جواب کا شکریہ!', change: 'جواب تبدیل کریں', contact: 'رابطہ',
      units: ['دن', 'گھنٹے', 'منٹ', 'سیکنڈ'], rsvpLine: 'رابطہ', bismillah: 'بسم اللہ الرحمن الرحیم', at: 'بمقام',
      std: 'تاریخ یاد رکھیں', married: 'کی شادی خانہ آبادی', invite2: 'آپ کو اپنی شادی کی تقریب میں مدعو کرتے ہیں', weddingOf: 'شادی خانہ آبادی' },
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
        l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Great+Vibes&family=Montserrat:wght@500;600&family=Playfair+Display:ital,wght@1,500&family=Instrument+Serif:ital@0;1&family=Bodoni+Moda:ital,wght@0,400;1,400&family=Ballet&family=Fraunces:ital,wght@1,600&family=Jost:wght@400;500&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap';
        document.head.appendChild(l);
      }
      l.addEventListener('load', res); l.addEventListener('error', res);
    });
    const want = ['118px "Great Vibes"', '600 30px "Cinzel"', '500 30px "Cinzel"', '500 30px "Cormorant Garamond"', 'italic 500 30px "Cormorant Garamond"', '600 30px "Cormorant Garamond"',
      'italic 500 30px "Playfair Display"', '600 30px "Montserrat"', '400 30px "Instrument Serif"', 'italic 400 30px "Instrument Serif"',
      '400 30px "Bodoni Moda"', 'italic 400 30px "Bodoni Moda"', '400 30px "Ballet"', 'italic 600 30px "Fraunces"', '400 30px "Jost"', '500 30px "Jost"', '400 30px "Noto Nastaliq Urdu"', '700 30px "Noto Nastaliq Urdu"'];
    fontsP = Promise.race([sheet.then(() => Promise.all(want.map(f => document.fonts.load(f, 'Aa&1ابپ').catch(() => {})))), new Promise(r => setTimeout(r, 6000))]);
    return fontsP;
  }
  // Pictures (the couple's photo), loaded once per address.
  const imgs = {};
  function loadImg(src) {
    return imgs[src] || (imgs[src] = new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; }));
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
  function dateParts(date, lang) {
    const d = new Date(date + 'T12:00:00');
    if (isNaN(d)) return null;
    const p = o => new Intl.DateTimeFormat(lang === 'ur' ? 'ur-PK' : 'en-GB', o).format(d);
    return { wd: p({ weekday: 'long' }), mon: p({ month: 'long' }), day: String(d.getDate()), yr: String(d.getFullYear()), mm: String(d.getMonth() + 1).padStart(2, '0'), dd: String(d.getDate()).padStart(2, '0') };
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
  // Draws pre-fitted lines at ax (centred, or left / right aligned), each in its own direction. Returns the height used.
  function drawLines(x, fl, f, ax, y, lh, sp = 0, align = 'center') {
    setFont(x, f, fl.size, sp);
    x.textAlign = align;
    fl.lines.forEach((ln, k) => { x.direction = rtl(ln) ? 'rtl' : 'ltr'; x.fillText(ln, ax, y + k * lh); });
    x.textAlign = 'center';
    return fl.lines.length * lh;
  }

  // ---------- ornaments ----------
  const rng = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
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
  function flourish(x, cx, y, w, col) {
    x.save(); x.strokeStyle = col; x.fillStyle = col; x.lineWidth = 2.2; x.lineCap = 'round';
    for (const s of [-1, 1]) {
      x.beginPath(); x.moveTo(cx + s * 22, y); x.bezierCurveTo(cx + s * w * 0.25, y - 16, cx + s * w * 0.38, y + 16, cx + s * w * 0.5, y); x.stroke();
      x.beginPath(); x.moveTo(cx + s * w * 0.32, y + 2); x.quadraticCurveTo(cx + s * w * 0.36, y - 22, cx + s * w * 0.27, y - 18); x.stroke();
      x.beginPath(); x.arc(cx + s * w * 0.5, y, 3.5, 0, 7); x.fill();
    }
    x.beginPath(); x.moveTo(cx, y - 11); x.lineTo(cx + 11, y); x.lineTo(cx, y + 11); x.lineTo(cx - 11, y); x.closePath(); x.fill();
    x.restore();
  }
  function rule(x, cx, y, w, col) { // short line with a diamond: the minimal designs' divider
    x.save(); x.strokeStyle = col; x.fillStyle = col; x.lineWidth = 1.5;
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
  // A shaded leaf with a light vein; it points along the direction dir (radians, canvas angles).
  function leafG(x, cx, cy, len, dir, c1, c2) {
    x.save(); x.translate(cx, cy); x.rotate(dir + Math.PI / 2);
    const g = x.createLinearGradient(0, 0, 0, -len); g.addColorStop(0, c1); g.addColorStop(1, c2);
    x.fillStyle = g; x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(len * 0.36, -len * 0.5, 0, -len); x.quadraticCurveTo(-len * 0.36, -len * 0.5, 0, 0); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(0, -3); x.lineTo(0, -len * 0.9); x.stroke();
    x.restore();
  }
  // A full, ruffled peony: rings of round petals, darker in the middle.
  function peony(x, cx, cy, r, c1, c2, rot = 0) {
    x.save(); x.translate(cx, cy); x.rotate(rot);
    const g = x.createRadialGradient(0, 0, r * 0.05, 0, 0, r); g.addColorStop(0, c2); g.addColorStop(1, c1);
    x.fillStyle = g;
    for (let k = 0; k < 4; k++) {
      const rr = r * (1 - k * 0.21), n = 7 - k; x.globalAlpha = 0.5 + k * 0.13;
      for (let i = 0; i < n; i++) {
        x.save(); x.rotate(i * 2 * Math.PI / n + k * 0.45);
        x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(rr * 0.75, -rr * 0.15, rr * 0.7, -rr * 1.0, 0, -rr); x.bezierCurveTo(-rr * 0.7, -rr * 1.0, -rr * 0.75, -rr * 0.15, 0, 0); x.fill();
        x.restore();
      }
    }
    x.globalAlpha = 0.9; x.fillStyle = '#E9B85F';
    for (let i = 0; i < 9; i++) { const a = i * 0.7; x.beginPath(); x.arc(Math.cos(a) * r * 0.1, Math.sin(a) * r * 0.1, r * 0.035, 0, 7); x.fill(); }
    x.restore();
  }
  // Soft watercolour wash: a few overlapping blurry blobs.
  function wash(x, cx, cy, rad, col, R) {
    for (let i = 0; i < 6; i++) {
      const px = cx + (R() - 0.5) * rad, py = cy + (R() - 0.5) * rad, r = rad * (0.35 + R() * 0.45);
      const g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, col + '55'); g.addColorStop(0.6, col + '26'); g.addColorStop(1, col + '00');
      x.fillStyle = g; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill();
    }
  }
  function star8(x, cx, cy, r, ri = 0.765) { // eight-pointed star (two overlapping squares)
    x.beginPath();
    for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 - Math.PI / 2, rr = i % 2 ? r * ri : r; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
    x.closePath();
  }
  function roundRect(x, l, t, w, h, r) { x.beginPath(); x.moveTo(l + r, t); x.arcTo(l + w, t, l + w, t + h, r); x.arcTo(l + w, t + h, l, t + h, r); x.arcTo(l, t + h, l, t, r); x.arcTo(l, t, l + w, t, r); x.closePath(); }
  // Draws a picture to fill the box (cropped, never stretched); fy = which part of a tall picture to keep.
  function coverImg(x, img, X, Y, w, h, fy = 0.3) {
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    const r = Math.max(w / iw, h / ih), sw = w / r, sh = h / r;
    x.drawImage(img, (iw - sw) / 2, (ih - sh) * fy, sw, sh, X, Y, w, h);
  }
  const initials = d => [d.groom, d.bride].map(n => (n || '').trim().slice(0, 1).toUpperCase());
  function bgFill(x, W, H, t) {
    const g = x.createRadialGradient(W / 2, H * 0.2, 60, W / 2, H * 0.5, H * 0.85);
    g.addColorStop(0, t.bg[0]); g.addColorStop(1, t.bg[1]);
    x.fillStyle = g; x.fillRect(0, 0, W, H);
  }
  function frame(x, W, H, t, a, b) { x.save(); x.strokeStyle = t.acc; x.lineWidth = 4; x.strokeRect(a, a, W - a * 2, H - a * 2); if (b) { x.lineWidth = 1.5; x.strokeRect(b, b, W - b * 2, H - b * 2); } x.restore(); }
  // Gold foil: a shimmering gradient used instead of a flat gold.
  function foil(x, W, H, onLight) { // onLight: a deeper gold that still reads on cream paper
    const g = x.createLinearGradient(0, 0, W, H * 0.55);
    (onLight ? [['0', '#7E5E26'], ['.16', '#C29B4E'], ['.33', '#8E6A2B'], ['.5', '#CDA75A'], ['.68', '#8A6427'], ['.84', '#B88F45'], ['1', '#765722']]
      : [['0', '#9E7A35'], ['.16', '#F3DE9C'], ['.33', '#B48A3C'], ['.5', '#FFF0C0'], ['.68', '#A9802F'], ['.84', '#EED488'], ['1', '#8E6A2B']]).forEach(([o, c]) => g.addColorStop(+o, c));
    return g;
  }

  // ---------- paper, seals and other details for the new designs ----------
  let noiseC = null;
  function noise(x, W, H, a) { // fine paper grain
    if (!noiseC) {
      noiseC = document.createElement('canvas'); noiseC.width = noiseC.height = 256;
      const g = noiseC.getContext('2d'), im = g.createImageData(256, 256), R = rng(11);
      for (let i = 0; i < im.data.length; i += 4) { const v = R() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
      g.putImageData(im, 0, 0);
    }
    x.save(); x.globalAlpha = a; x.globalCompositeOperation = 'overlay'; x.fillStyle = x.createPattern(noiseC, 'repeat'); x.fillRect(0, 0, W, H); x.restore();
  }
  function shade(hex, k) { // lighter (k > 0) or darker (k < 0) version of a colour
    const n = parseInt(hex.slice(1), 16), f = v => Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k));
    return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
  }
  // A paper card with soft, torn (deckled) edges.
  function deckle(x, l, t, r, b, amp, seed) {
    const R = rng(seed), pts = [];
    for (let xx = l; xx < r; xx += 7) pts.push([xx, t + (R() - 0.5) * amp]);
    for (let yy = t; yy < b; yy += 7) pts.push([r + (R() - 0.5) * amp, yy]);
    for (let xx = r; xx > l; xx -= 7) pts.push([xx, b + (R() - 0.5) * amp]);
    for (let yy = b; yy > t; yy -= 7) pts.push([l + (R() - 0.5) * amp, yy]);
    x.beginPath(); pts.forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py))); x.closePath();
  }
  // A wax seal pressed with the couple's initials.
  function seal(x, cx, cy, r, col, txt) {
    const R = rng(23);
    x.save(); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 16; x.shadowOffsetY = 6;
    x.beginPath();
    for (let i = 0; i <= 48; i++) { const a = i / 48 * Math.PI * 2, rr = r * (1 + (R() - 0.5) * 0.07 + 0.045 * Math.sin(a * 6 + 1)); x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
    x.closePath();
    const g = x.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r * 1.1);
    g.addColorStop(0, shade(col, 0.28)); g.addColorStop(0.55, col); g.addColorStop(1, shade(col, -0.35));
    x.fillStyle = g; x.fill(); x.restore();
    x.save();
    const g2 = x.createRadialGradient(cx + r * 0.2, cy + r * 0.25, r * 0.1, cx, cy, r * 0.7);
    g2.addColorStop(0, shade(col, 0.08)); g2.addColorStop(1, shade(col, -0.22));
    x.fillStyle = g2; x.beginPath(); x.arc(cx, cy, r * 0.7, 0, 7); x.fill();
    x.lineWidth = 2; x.strokeStyle = 'rgba(0,0,0,.28)'; x.beginPath(); x.arc(cx, cy + 1, r * 0.7, 0, 7); x.stroke();
    x.strokeStyle = 'rgba(255,255,255,.22)'; x.beginPath(); x.arc(cx, cy - 1, r * 0.7, 0, 7); x.stroke();
    x.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; x.beginPath(); x.arc(cx + Math.cos(a) * r * 0.58, cy + Math.sin(a) * r * 0.58, r * 0.025, 0, 7); x.fill(); }
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.direction = rtl(txt) ? 'rtl' : 'ltr';
    x.font = rtl(txt) ? `700 ${Math.round(r * 0.42)}px "Noto Nastaliq Urdu", serif` : `italic 400 ${Math.round(r * 0.62)}px "Instrument Serif", Georgia, serif`;
    x.fillStyle = 'rgba(255,255,255,.25)'; x.fillText(txt, cx - 1, cy - 1 + (rtl(txt) ? r * 0.1 : 0));
    x.fillStyle = shade(col, -0.45); x.fillText(txt, cx + 1, cy + 1 + (rtl(txt) ? r * 0.1 : 0));
    x.restore(); x.textBaseline = 'alphabetic';
  }
  // Writes text along the top of a circle, letter by letter (made smaller until it fits the angle).
  function arcText(x, str, f, size, sp, cx, cy, rad, maxAng, col) {
    let s = size, w = 0;
    for (; s > 14; s -= 1) { setFont(x, f, s, sp); w = x.measureText(str).width; if (w / rad <= maxAng) break; }
    x.save(); x.fillStyle = col; x.textAlign = 'center'; x.direction = 'ltr';
    let a = -Math.PI / 2 - w / rad / 2;
    for (const ch of str) {
      const cw = x.measureText(ch).width, m = a + cw / rad / 2;
      x.save(); x.translate(cx + Math.cos(m) * rad, cy + Math.sin(m) * rad); x.rotate(m + Math.PI / 2); x.fillText(ch, 0, 0); x.restore();
      a += cw / rad;
    }
    x.restore();
  }
  function sparkle(x, cx, cy, r, col) { // four-point star
    x.save(); x.fillStyle = col; x.beginPath(); x.moveTo(cx, cy - r); x.quadraticCurveTo(cx, cy, cx + r, cy); x.quadraticCurveTo(cx, cy, cx, cy + r); x.quadraticCurveTo(cx, cy, cx - r, cy); x.quadraticCurveTo(cx, cy, cx, cy - r); x.fill(); x.restore();
  }
  // Line-art peony (outlines only), for foil designs.
  function linePeony(x, cx, cy, r, rot) {
    x.save(); x.translate(cx, cy); x.rotate(rot); x.lineCap = 'round'; x.lineJoin = 'round';
    const pol = (rr, a) => [Math.cos(a) * rr, Math.sin(a) * rr];
    [[1, 7, 0], [0.74, 6, 0.35], [0.5, 5, 0.1]].forEach(([k, n, off]) => {
      for (let i = 0; i < n; i++) {
        const a0 = off + i * Math.PI * 2 / n, a1 = a0 + Math.PI * 2 / n * 1.08, rr = r * k;
        const p0 = pol(rr * 0.45, a0), c1 = pol(rr * 1.12, a0 - 0.06), c2 = pol(rr * 1.12, a1 + 0.06), p1 = pol(rr * 0.45, a1);
        x.lineWidth = k === 1 ? 2.4 : 2; x.beginPath(); x.moveTo(...p0); x.bezierCurveTo(...c1, ...c2, ...p1); x.stroke();
        const mid = pol(rr * 0.98, (a0 + a1) / 2), mid2 = pol(rr * 0.82, (a0 + a1) / 2 + 0.12);
        x.lineWidth = 1.2; x.beginPath(); x.moveTo(...mid); x.quadraticCurveTo(...pol(rr * 0.9, (a0 + a1) / 2 - 0.1), ...mid2); x.stroke();
      }
    });
    x.lineWidth = 1.6; for (let i = 0; i < 6; i++) { const a = i * 1.05; x.beginPath(); x.arc(Math.cos(a) * r * 0.1, Math.sin(a) * r * 0.1, r * 0.07, a, a + 3.6); x.stroke(); }
    x.restore();
  }
  function lineLeaf(x, cx, cy, len, dir) {
    x.save(); x.translate(cx, cy); x.rotate(dir + Math.PI / 2); x.lineWidth = 2; x.lineCap = 'round';
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(len * 0.38, -len * 0.5, 0, -len); x.quadraticCurveTo(-len * 0.38, -len * 0.5, 0, 0); x.stroke();
    x.lineWidth = 1.2; x.beginPath(); x.moveTo(0, -4); x.lineTo(0, -len * 0.85); x.stroke();
    for (let k = 1; k < 5; k++) { const yy = -len * k / 5.5; x.beginPath(); x.moveTo(0, yy); x.lineTo(len * 0.15, yy - len * 0.1); x.moveTo(0, yy); x.lineTo(-len * 0.15, yy - len * 0.1); x.stroke(); }
    x.restore();
  }
  // A bouquet of line-art peonies and leaves spreading from a corner towards angle a0.
  function lineBouquet(x, cx, cy, a0, sc) {
    const P = (d, a) => [cx + Math.cos(a0 + a) * d * sc, cy + Math.sin(a0 + a) * d * sc];
    x.save(); x.lineWidth = 1.8;
    [[300, -0.5], [330, 0.15], [280, 0.7], [220, -0.15], [240, 0.45]].forEach(([d, a]) => { const [px, py] = P(d * 0.55, a); lineLeaf(x, px, py, d * 0.5 * sc, a0 + a); });
    for (const [d, a] of [[260, -0.35], [250, 0.55]]) { const [ex, ey] = P(d, a); x.beginPath(); x.moveTo(cx, cy); x.quadraticCurveTo(...P(d * 0.5, a + 0.2), ex, ey); x.stroke(); }
    linePeony(x, ...P(150, 0.12), 105 * sc, 0.3);
    linePeony(x, ...P(285, -0.32), 62 * sc, 1.2);
    linePeony(x, ...P(270, 0.6), 55 * sc, 2.1);
    x.restore();
  }
  // A meadow of painted wildflowers along the bottom of the card.
  function meadow(x, W, H, top, R) {
    const greens = ['#6F8B5E', '#86A070', '#5B7650', '#9DB284'];
    const kinds = ['daisy', 'poppy', 'lavender', 'breath', 'cornflower', 'daisy', 'bud'];
    for (let layer = 0; layer < 2; layer++) for (let i = 0; i < 46; i++) {
      const sx = R() * (W + 80) - 40, h = (H - top) * (0.35 + R() * 0.65) * (layer ? 0.75 : 1), ex = sx + (R() - 0.5) * 90, ey = H + 10 - h;
      x.save(); x.globalAlpha = layer ? 0.95 : 0.55;
      x.strokeStyle = greens[i % 4]; x.lineWidth = 1.6 + R() * 1.4; x.beginPath(); x.moveTo(sx, H + 10); x.quadraticCurveTo(sx + (R() - 0.5) * 60, H - h / 2, ex, ey); x.stroke();
      if (R() > 0.4) leafG(x, (sx + ex) / 2, H - h * 0.4, 30 + R() * 30, -Math.PI / 2 + (R() - 0.5) * 1.6, greens[(i + 1) % 4], '#C8D8B4');
      const k = kinds[Math.floor(R() * kinds.length)];
      if (k === 'daisy') { x.fillStyle = '#FFFFFF'; for (let p = 0; p < 12; p++) petal(x, ex, ey, 22, 6, p * Math.PI / 6); x.strokeStyle = 'rgba(0,0,0,.08)'; x.fillStyle = '#E8B33A'; x.beginPath(); x.arc(ex, ey, 6, 0, 7); x.fill(); }
      else if (k === 'poppy') { x.fillStyle = R() > 0.5 ? '#E06A4E' : '#EE9A7A'; for (let p = 0; p < 5; p++) { const a = p * 1.26; x.beginPath(); x.arc(ex + Math.cos(a) * 11, ey + Math.sin(a) * 11, 13, 0, 7); x.fill(); } x.fillStyle = '#3B2A2A'; x.beginPath(); x.arc(ex, ey, 5, 0, 7); x.fill(); }
      else if (k === 'lavender') { x.fillStyle = '#9C88C9'; for (let p = 0; p < 9; p++) { x.beginPath(); x.ellipse(ex + (p % 2 ? 4 : -4), ey + p * 7, 4, 6, 0, 0, 7); x.fill(); } }
      else if (k === 'breath') { x.fillStyle = '#FFFFFF'; x.strokeStyle = '#B9C7A8'; x.lineWidth = 0.8; for (let p = 0; p < 9; p++) { const a = R() * 7, dd = R() * 22; x.beginPath(); x.arc(ex + Math.cos(a) * dd, ey + Math.sin(a) * dd, 3.2, 0, 7); x.fill(); x.stroke(); } }
      else if (k === 'cornflower') { x.fillStyle = '#5E7FC4'; for (let p = 0; p < 10; p++) petal(x, ex, ey, 15, 5, p * Math.PI / 5); x.fillStyle = '#34497A'; x.beginPath(); x.arc(ex, ey, 4, 0, 7); x.fill(); }
      else { x.fillStyle = '#F2B8B0'; x.beginPath(); x.ellipse(ex, ey, 7, 11, 0, 0, 7); x.fill(); }
      x.restore();
    }
  }
  // A Mughal palace (dome, minarets, arches), drawn from the ground line gy upwards.
  function palaceArt(x, cx, gy, s, wall, line, shadowCol) {
    x.save(); x.translate(cx, gy); x.scale(s, s); x.lineWidth = 2 / s * 1.2; x.strokeStyle = line; x.fillStyle = wall;
    const shape = fn => { x.beginPath(); fn(); x.fill(); x.stroke(); };
    const onion = (dx, by, w, h) => shape(() => { x.moveTo(dx - w, by); x.bezierCurveTo(dx - w * 1.35, by - h * 0.55, dx - w * 0.25, by - h * 0.7, dx, by - h); x.bezierCurveTo(dx + w * 0.25, by - h * 0.7, dx + w * 1.35, by - h * 0.55, dx + w, by); x.closePath(); });
    const finial = (dx, by, h) => { x.beginPath(); x.moveTo(dx, by); x.lineTo(dx, by - h); x.stroke(); x.beginPath(); x.arc(dx, by - h * 0.55, 4, 0, 7); x.fill(); x.stroke(); };
    const arch = (dx, by, w, h, col) => { x.save(); x.fillStyle = col; x.beginPath(); x.moveTo(dx - w / 2, by); x.lineTo(dx - w / 2, by - h * 0.62); x.quadraticCurveTo(dx - w / 2, by - h * 0.95, dx, by - h); x.quadraticCurveTo(dx + w / 2, by - h * 0.95, dx + w / 2, by - h * 0.62); x.lineTo(dx + w / 2, by); x.closePath(); x.fill(); x.stroke(); x.restore(); };
    for (const k of [-1, 1]) { // minarets
      const mx = k * 380;
      shape(() => x.rect(mx - 17, -360, 34, 360));
      shape(() => x.rect(mx - 26, -250, 52, 12)); shape(() => x.rect(mx - 26, -360, 52, 12));
      onion(mx, -372, 22, 60); finial(mx, -430, 30);
    }
    shape(() => x.rect(-300, -230, 600, 230)); // main hall
    shape(() => x.rect(-120, -270, 240, 40)); // drum
    onion(0, -270, 125, 200); finial(0, -468, 52);
    for (const k of [-1, 1]) { shape(() => x.rect(k * 220 - 42, -280, 84, 50)); onion(k * 220, -280, 46, 74); finial(k * 220, -352, 26); }
    arch(0, 0, 150, 200, shadowCol);
    for (const k of [-1, 1]) { arch(k * 165, -30, 66, 120, shadowCol); arch(k * 250, -30, 50, 100, shadowCol); arch(k * 165, -160, 50, 50, shadowCol); arch(k * 250, -150, 40, 46, shadowCol); }
    shape(() => x.rect(-330, -6, 660, 12));
    x.restore();
  }
  function marigold(x, cx, cy, r, c1, c2) {
    x.save(); x.fillStyle = c1; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
    x.fillStyle = c2; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; x.beginPath(); x.arc(cx + Math.cos(a) * r * 0.62, cy + Math.sin(a) * r * 0.62, r * 0.36, 0, 7); x.fill(); }
    x.fillStyle = c1; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + 0.3; x.beginPath(); x.arc(cx + Math.cos(a) * r * 0.28, cy + Math.sin(a) * r * 0.28, r * 0.28, 0, 7); x.fill(); }
    x.fillStyle = 'rgba(0,0,0,.12)'; x.beginPath(); x.arc(cx + r * 0.25, cy + r * 0.3, r * 0.75, 0, 7); x.fill();
    x.restore();
  }

  // Each design draws its background and ornaments, and says where the text goes and how it is laid out:
  // { top, bottom, maxW, cx, align, ev ('grid' | 'table' | 'list'), divider, mono, names ('stack' | 'inline'), seq, colours… }
  // or { parts: [ …the same, once for each area of the card… ] }.
  const DESIGNS = {
    // Arch & seal: a cream arch-shaped card lying on terracotta, closed with a wax seal.
    archway(x, W, H, t, d) {
      x.fillStyle = t.bg[0]; x.fillRect(0, 0, W, H);
      const v = x.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, H * 0.8); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.25)'); x.fillStyle = v; x.fillRect(0, 0, W, H);
      noise(x, W, H, 0.1);
      const l = 104, r = W - 104, top = 96, bot = H - 104, rad = (r - l) / 2;
      const arch = k => { x.beginPath(); x.moveTo(l + k, bot - k); x.lineTo(l + k, top + rad); x.arc(W / 2, top + rad, rad - k, Math.PI, 0); x.lineTo(r - k, bot - k); x.closePath(); };
      x.save(); x.shadowColor = 'rgba(40,10,0,.45)'; x.shadowBlur = 40; x.shadowOffsetY = 18; arch(0); x.fillStyle = '#FAF5EE'; x.fill(); x.restore();
      x.save(); arch(0); x.clip(); noise(x, W, H, 0.06); x.restore();
      x.save(); x.strokeStyle = t.acc; x.globalAlpha = 0.45; x.lineWidth = 1.4; arch(24); x.stroke(); x.restore();
      const [a, b] = initials(d);
      seal(x, W / 2, bot, 74, '#8F2F25', rtl(a + b) ? `${a}${b}` : `${a}${b}`);
      return { top: 360, bottom: H - 250, maxW: W - 340, mono: 'thin', divider: 'dots' };
    },

    // Editorial: the date set huge across the top like a magazine masthead, everything else left-aligned.
    atelier(x, W, H, t, d) {
      const ur = d.lang === 'ur', m = 92;
      x.fillStyle = t.bg[0]; x.fillRect(0, 0, W, H); noise(x, W, H, 0.07);
      const p = d.events[0] && dateParts(d.events[0].date, d.lang);
      x.save(); x.fillStyle = t.ink;
      if (p) {
        const big = `${p.dd}.${p.mm}.${p.yr.slice(2)}`, f = '400 {s}px "Bodoni Moda", Didot, Georgia, serif';
        let s = 330; setFont(x, f, s); s = Math.min(s, s * (W - 2 * m) / x.measureText(big).width); setFont(x, f, s);
        x.textAlign = 'center'; x.direction = 'ltr'; x.fillText(big, W / 2, 110 + s * 0.72);
        const yy = 140 + s * 0.72;
        x.fillRect(m, yy, W - 2 * m, 2);
        const tm = fmtTime(d.events[0].time, d.lang), F = ur ? '700 {s}px "Noto Nastaliq Urdu", serif' : '500 {s}px "Jost", Arial, sans-serif';
        setFont(x, F, ur ? 24 : 22, ur ? 0 : 8);
        x.textAlign = 'left'; x.direction = rtl(p.wd) ? 'rtl' : 'ltr'; x.fillText(ur ? p.wd : p.wd.toUpperCase(), m, yy + (ur ? 60 : 44));
        x.textAlign = 'right'; x.direction = 'ltr'; x.fillText(ur ? tm : tm.toUpperCase(), W - m, yy + (ur ? 60 : 44));
        if ('letterSpacing' in x) x.letterSpacing = '0px';
      }
      x.fillRect(m, H - 118, W - 2 * m, 1.2);
      x.restore();
      return { top: 600, bottom: H - 150, maxW: W - 2 * m, cx: ur ? W - m : m, align: ur ? 'right' : 'left', seq: ['bism', 'hosts', 'names', 'msg', 'divider', 'events'], ev: 'cols', divider: 'line', mono: 'none' };
    },

    // Mughal pastel: a dreamy sunset sky over a palace and its reflecting pool, painted in soft pastels with gold lines.
    palace(x, W, H, t) {
      const sky = x.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#FDF1E8'); sky.addColorStop(0.45, '#FBE1D6'); sky.addColorStop(0.75, '#F3D3DA'); sky.addColorStop(1, '#E3D6EE');
      x.fillStyle = sky; x.fillRect(0, 0, W, H);
      const gy = H - 210, R = rng(31);
      const sun = x.createRadialGradient(W / 2, gy - 300, 20, W / 2, gy - 300, 420); sun.addColorStop(0, 'rgba(255,214,170,.9)'); sun.addColorStop(1, 'rgba(255,214,170,0)'); x.fillStyle = sun; x.fillRect(0, 0, W, H);
      wash(x, 180, 260, 300, '#FFFFFF', R); wash(x, W - 200, 180, 320, '#FFFFFF', R); wash(x, W - 140, gy - 380, 260, '#F7C6CF', R); wash(x, 140, gy - 300, 260, '#E7CDEB', R);
      x.save(); x.strokeStyle = 'rgba(122,62,94,.55)'; x.lineWidth = 2; x.lineCap = 'round';
      for (const [bx, by, s] of [[230, 520, 1], [280, 490, 0.8], [W - 260, 430, 1], [W - 210, 470, 0.7]]) { x.beginPath(); x.moveTo(bx - 14 * s, by - 6 * s); x.quadraticCurveTo(bx - 6 * s, by - 10 * s, bx, by); x.quadraticCurveTo(bx + 6 * s, by - 10 * s, bx + 14 * s, by - 6 * s); x.stroke(); }
      x.restore();
      const s = 0.74;
      x.save(); x.globalAlpha = 0.95; palaceArt(x, W / 2, gy, s, '#FFF7F2', '#B88A5E', '#F2CFC6'); x.restore();
      const pool = x.createLinearGradient(0, gy, 0, H); pool.addColorStop(0, '#EBC9CF'); pool.addColorStop(1, '#D9C6E6');
      x.fillStyle = pool; x.fillRect(0, gy + 6, W, H - gy);
      x.save(); x.beginPath(); x.rect(0, gy + 6, W, H - gy); x.clip(); x.globalAlpha = 0.28; x.translate(0, 2 * gy + 12); x.scale(1, -1); palaceArt(x, W / 2, gy, s, '#FFF7F2', '#B88A5E', '#F2CFC6'); x.restore();
      x.save(); x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 2; for (let k = 0; k < 8; k++) { const yy = gy + 40 + k * 26, w = 120 + R() * 220, xx = R() * (W - w); x.beginPath(); x.moveTo(xx, yy); x.lineTo(xx + w, yy); x.stroke(); } x.restore();
      x.save(); x.strokeStyle = t.acc; x.lineWidth = 1.4; x.globalAlpha = 0.7; x.strokeRect(40, 40, W - 80, H - 80); x.restore();
      return { top: 190, bottom: gy - 470 * s - 40, maxW: W - 240, names: 'inline', seq: ['bism', 'hosts', 'request', 'names', 'pline', 'msg', 'divider', 'events'], mono: 'thin', divider: 'thin' };
    },

    // Nikah jaali: a fine gold arch, its crown filled with a fading lattice of eight-point stars.
    nikahline(x, W, H, t) {
      x.fillStyle = t.bg[0]; x.fillRect(0, 0, W, H); noise(x, W, H, 0.05);
      const l = 120, r = W - 120, top = 104, bot = H - 104, rad = (r - l) / 2;
      const arch = k => { x.beginPath(); x.moveTo(l + k, bot - k); x.lineTo(l + k, top + rad); x.arc(W / 2, top + rad, rad - k, Math.PI, 0); x.lineTo(r - k, bot - k); x.closePath(); };
      x.save(); arch(0); x.clip();
      x.strokeStyle = t.acc; x.lineWidth = 1.3; x.globalAlpha = 0.7;
      const sz = 78;
      for (let yy = top; yy < top + rad + 40; yy += sz) for (let xx = W / 2 - sz * 6; xx <= W / 2 + sz * 6; xx += sz) {
        star8(x, xx, yy, sz * 0.42); x.stroke();
        x.save(); x.translate(xx + sz / 2, yy + sz / 2); x.rotate(Math.PI / 4); x.strokeRect(-sz * 0.12, -sz * 0.12, sz * 0.24, sz * 0.24); x.restore();
      }
      x.globalAlpha = 1;
      const fade = x.createLinearGradient(0, top + 60, 0, top + 330); fade.addColorStop(0, 'rgba(251,248,241,0)'); fade.addColorStop(1, 'rgba(251,248,241,1)');
      x.fillStyle = fade; x.fillRect(0, top, W, H);
      x.restore();
      x.save(); x.strokeStyle = t.acc; x.lineWidth = 2.2; arch(0); x.stroke(); x.lineWidth = 1; arch(14); x.stroke(); x.restore();
      x.save(); x.fillStyle = t.acc; star8(x, W / 2, top - 30, 13); x.fill(); x.restore();
      return { top: 450, bottom: H - 170, maxW: W - 400, mono: 'star', divider: 'thin' };
    },

    // Bordeaux: deep wine card in white ink, the families' line curving over the top.
    bordeaux(x, W, H, t, d) {
      const ur = d.lang === 'ur';
      const g = x.createRadialGradient(W / 2, H * 0.35, 80, W / 2, H * 0.5, H * 0.8); g.addColorStop(0, t.bg[0]); g.addColorStop(1, t.bg[1]);
      x.fillStyle = g; x.fillRect(0, 0, W, H); noise(x, W, H, 0.09);
      x.save(); x.strokeStyle = t.ink; x.globalAlpha = 0.4; x.lineWidth = 1; x.strokeRect(44, 44, W - 88, H - 88); x.restore();
      const host = d.hosts || L[ur ? 'ur' : 'en'].together;
      if (ur || rtl(host)) { x.save(); x.fillStyle = t.ink; x.textAlign = 'center'; x.direction = 'rtl'; const fl = fitLines(x, host, '700 {s}px "Noto Nastaliq Urdu", serif', 40, W - 300, 1); setFont(x, '700 {s}px "Noto Nastaliq Urdu", serif', fl.size); x.fillText(fl.lines[0] || '', W / 2, 300); x.restore(); }
      else arcText(x, host.toUpperCase(), '500 {s}px "Jost", Arial, sans-serif', 40, 9, W / 2, 610, 380, 2.05, t.ink);
      if ('letterSpacing' in x) x.letterSpacing = '0px';
      sparkle(x, W / 2, 330, 16, t.alt); sparkle(x, 170, 170, 9, t.alt); sparkle(x, W - 170, 170, 9, t.alt);
      if (d.bismillah) { x.save(); x.fillStyle = t.alt; x.textAlign = 'center'; x.direction = 'rtl'; x.font = '700 32px "Noto Nastaliq Urdu", serif'; x.fillText(L.ur.bismillah, W / 2, 130); x.restore(); }
      return { top: ur ? 420 : 500, bottom: H - 130, maxW: W - 260, seq: ['request', 'names', 'msg', 'divider', 'events'], ev: 'cols', divider: 'thin', mono: 'none' };
    },

    // Quiet luxury: a soft stone card with torn edges on linen, a small monogram and spaced capitals.
    stone(x, W, H, t, d) {
      x.fillStyle = t.bg[0]; x.fillRect(0, 0, W, H); noise(x, W, H, 0.12);
      x.save(); x.shadowColor = 'rgba(60,50,40,.35)'; x.shadowBlur = 30; x.shadowOffsetY = 12; deckle(x, 70, 70, W - 70, H - 70, 5, 3); x.fillStyle = '#F6F2EA'; x.fill(); x.restore();
      x.save(); deckle(x, 70, 70, W - 70, H - 70, 5, 3); x.clip(); noise(x, W, H, 0.07); x.restore();
      const [a, b] = initials(d), u = rtl(a + b);
      x.save(); x.strokeStyle = t.acc; x.lineWidth = 1.2; x.beginPath(); x.arc(W / 2, 230, 66, 0, 7); x.stroke(); x.beginPath(); x.arc(W / 2, 230, 74, 0, 7); x.globalAlpha = 0.4; x.stroke(); x.globalAlpha = 1;
      x.fillStyle = t.ink; x.textAlign = 'center'; x.direction = u ? 'rtl' : 'ltr';
      x.font = u ? '700 40px "Noto Nastaliq Urdu", serif' : 'italic 400 54px "Instrument Serif", Georgia, serif'; x.fillText(u ? `${a} و ${b}` : `${a}&${b}`, W / 2, 230 + (u ? 14 : 17)); x.restore();
      return { top: 400, bottom: H - 150, maxW: W - 340, mono: 'none', divider: 'thin' };
    },

    // Gold line: gold-foil line drawings of peonies growing in from two corners; handwritten names in foil.
    goldline(x, W, H, t) {
      x.fillStyle = t.bg[0]; x.fillRect(0, 0, W, H); noise(x, W, H, 0.05);
      const g = foil(x, W, H, true);
      x.save(); x.strokeStyle = g; lineBouquet(x, W + 10, -10, Math.PI * 0.75, 1.05); lineBouquet(x, -10, H + 10, -Math.PI * 0.25, 0.9); x.restore();
      x.save(); x.strokeStyle = g; x.lineWidth = 1.2; x.strokeRect(48, 48, W - 96, H - 96); x.restore();
      return { top: 390, bottom: H - 230, maxW: W - 340, acc: g, alt: g, nameCol: g, ampCol: g, mono: 'thin', divider: 'dots' };
    },

    // Wildflower: a white card with a painted meadow of daisies, poppies and lavender along the bottom.
    wildflower(x, W, H, t) {
      x.fillStyle = t.bg[0]; x.fillRect(0, 0, W, H); noise(x, W, H, 0.05);
      const R = rng(77), top = H - 440;
      wash(x, 160, H - 120, 320, '#F2B8A8', R); wash(x, W - 180, H - 100, 340, '#C9D9B8', R); wash(x, W / 2, H - 60, 300, '#E9DDF5', R);
      meadow(x, W, H, top, R);
      return { top: 210, bottom: top - 10, maxW: W - 260, mono: 'thin', divider: 'thin' };
    },

    // Black tie: matte black with crisp white type, fashion-magazine contrast.
    noirink(x, W, H, t, d) {
      x.fillStyle = t.bg[0]; x.fillRect(0, 0, W, H); noise(x, W, H, 0.08);
      x.save(); x.strokeStyle = t.ink; x.globalAlpha = 0.3; x.lineWidth = 1; x.strokeRect(40, 40, W - 80, H - 80); x.restore();
      const p = d.events[0] && dateParts(d.events[0].date, 'en');
      if (p) {
        x.save(); x.fillStyle = t.ink; x.strokeStyle = t.ink; setFont(x, '500 {s}px "Jost", Arial, sans-serif', 24, 12); x.textAlign = 'center'; x.direction = 'ltr';
        const s = `${p.dd} · ${p.mm} · ${p.yr}`, w = x.measureText(s).width; x.fillText(s, W / 2, 170);
        x.lineWidth = 1; x.globalAlpha = 0.6; x.beginPath(); x.moveTo(W / 2 - w / 2 - 30, 162); x.lineTo(110, 162); x.moveTo(W / 2 + w / 2 + 30, 162); x.lineTo(W - 110, 162); x.stroke();
        x.restore(); if ('letterSpacing' in x) x.letterSpacing = '0px';
      }
      return { top: 290, bottom: H - 130, maxW: W - 260, ev: 'cols', mono: 'none', divider: 'thin' };
    },

    // Mehndi night: hot pink with strings of marigolds hanging from the top and little diyas glowing at the bottom.
    mehndipop(x, W, H, t) {
      const g = x.createRadialGradient(W / 2, H * 0.45, 100, W / 2, H * 0.5, H * 0.8); g.addColorStop(0, t.bg[0]); g.addColorStop(1, t.bg[1]);
      x.fillStyle = g; x.fillRect(0, 0, W, H); noise(x, W, H, 0.08);
      const R = rng(5);
      for (let i = 0; i < 90; i++) { x.save(); x.globalAlpha = 0.25 + R() * 0.35; x.fillStyle = R() > 0.5 ? '#FFD54F' : '#FFFFFF'; x.beginPath(); x.arc(R() * W, 380 + R() * (H - 560), 1.5 + R() * 2.5, 0, 7); x.fill(); x.restore(); }
      const n = 13;
      for (let k = 0; k < n; k++) {
        const gx = 40 + k * (W - 80) / (n - 1), len = 3 + Math.round(Math.abs(k - (n - 1) / 2) * 0.95);
        x.save(); x.strokeStyle = '#7A0B3A'; x.lineWidth = 2; x.beginPath(); x.moveTo(gx, 0); x.lineTo(gx, 20 + len * 32); x.stroke(); x.restore();
        leaf(x, gx - 8, 18, 34, -2.5, '#2E7D32'); leaf(x, gx + 8, 18, 34, 2.5, '#43A047');
        for (let j = 0; j < len; j++) marigold(x, gx, 34 + j * 32, 17, j % 3 === 1 ? '#FFB300' : '#F57C00', j % 3 === 1 ? '#FFD54F' : '#FFA726');
        const ty = 34 + len * 32;
        x.save(); x.fillStyle = '#FFD54F'; x.beginPath(); x.moveTo(gx - 9, ty - 4); x.quadraticCurveTo(gx, ty - 22, gx + 9, ty - 4); x.lineTo(gx + 11, ty + 6); x.lineTo(gx - 11, ty + 6); x.closePath(); x.fill(); x.beginPath(); x.arc(gx, ty + 9, 3.5, 0, 7); x.fill(); x.restore();
      }
      for (let k = 0; k < 7; k++) {
        const dx = 120 + k * (W - 240) / 6, dy = H - 92;
        const glow = x.createRadialGradient(dx, dy - 34, 2, dx, dy - 34, 70); glow.addColorStop(0, 'rgba(255,214,120,.7)'); glow.addColorStop(1, 'rgba(255,214,120,0)'); x.fillStyle = glow; x.fillRect(dx - 70, dy - 104, 140, 140);
        x.save(); x.fillStyle = '#FFB300'; x.beginPath(); x.moveTo(dx, dy - 62); x.quadraticCurveTo(dx + 12, dy - 34, dx, dy - 22); x.quadraticCurveTo(dx - 12, dy - 34, dx, dy - 62); x.fill();
        x.fillStyle = '#FFF3C4'; x.beginPath(); x.moveTo(dx, dy - 48); x.quadraticCurveTo(dx + 5, dy - 33, dx, dy - 26); x.quadraticCurveTo(dx - 5, dy - 33, dx, dy - 48); x.fill();
        x.fillStyle = '#B5502B'; x.beginPath(); x.moveTo(dx - 34, dy - 20); x.quadraticCurveTo(dx, dy + 22, dx + 34, dy - 20); x.closePath(); x.fill();
        x.fillStyle = '#E07B39'; x.fillRect(dx - 34, dy - 22, 68, 5); x.restore();
      }
      return { top: 400, bottom: H - 190, maxW: W - 260, seq: ['bism', 'hosts', 'hero', 'names', 'pline', 'msg', 'divider', 'events'], names: 'inline', mono: 'none', divider: 'dots' };
    },

    // Groovy: 70s rainbows and daisies on a scalloped cream card.
    retro(x, W, H, t) {
      x.fillStyle = '#C8643B'; x.fillRect(0, 0, W, H);
      const a = 54, step = 36, rr = 15;
      const card = () => {
        x.beginPath(); x.rect(a, a, W - 2 * a, H - 2 * a);
        for (let xx = a; xx <= W - a + 1; xx += step) { x.moveTo(xx + rr, a); x.arc(xx, a, rr, 0, 7); x.moveTo(xx + rr, H - a); x.arc(xx, H - a, rr, 0, 7); }
        for (let yy = a; yy <= H - a + 1; yy += step) { x.moveTo(a + rr, yy); x.arc(a, yy, rr, 0, 7); x.moveTo(W - a + rr, yy); x.arc(W - a, yy, rr, 0, 7); }
      };
      card(); x.fillStyle = t.bg[0]; x.fill('nonzero'); noise(x, W, H, 0.08);
      x.save(); x.beginPath(); x.rect(a, a, W - 2 * a, H - 2 * a); x.clip();
      const bands = ['#C8643B', '#E3A83B', '#E8A1A8', '#8FA37E'];
      for (const [cx, cy, a0] of [[a, H - a, -Math.PI / 2], [W - a, a, Math.PI / 2]]) bands.forEach((c, k) => { x.strokeStyle = c; x.lineWidth = 40; x.beginPath(); x.arc(cx, cy, 300 - k * 40, a0, a0 + Math.PI / 2); x.stroke(); });
      x.restore();
      const daisy = (cx, cy, r) => { x.save(); x.fillStyle = '#FFFFFF'; for (let p = 0; p < 10; p++) petal(x, cx, cy, r, r * 0.42, p * Math.PI / 5); x.fillStyle = '#E3A83B'; x.beginPath(); x.arc(cx, cy, r * 0.3, 0, 7); x.fill(); x.restore(); };
      daisy(W - 150, H - 170, 34); daisy(W - 230, H - 110, 22); daisy(150, 170, 30); daisy(240, 120, 18);
      return { top: 380, bottom: H - 330, maxW: W - 320, mono: 'flower', divider: 'dots' };
    },

    // Magazine: the photo fills the card; the names sit over it in large white type, like a fashion cover.
    magazine(x, W, H, t, d, img) {
      x.fillStyle = t.bg[1]; x.fillRect(0, 0, W, H);
      if (img) coverImg(x, img, 0, 0, W, H, 0.25);
      else {
        const pg = x.createLinearGradient(0, 0, W, H); pg.addColorStop(0, '#C9A28A'); pg.addColorStop(0.5, '#6E6A7A'); pg.addColorStop(1, '#232733'); x.fillStyle = pg; x.fillRect(0, 0, W, H);
        const [a, b] = initials(d), u = rtl(a + b);
        x.save(); x.fillStyle = 'rgba(255,255,255,.1)'; x.textAlign = 'center'; x.direction = u ? 'rtl' : 'ltr'; x.font = u ? '700 260px "Noto Nastaliq Urdu", serif' : '400 520px "Bodoni Moda", Didot, serif'; x.fillText(u ? `${a}${b}` : `${a}${b}`, W / 2, H * 0.48); x.restore();
        noise(x, W, H, 0.1);
      }
      const top = x.createLinearGradient(0, 0, 0, 260); top.addColorStop(0, 'rgba(0,0,0,.5)'); top.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = top; x.fillRect(0, 0, W, 260);
      const bot = x.createLinearGradient(0, H * 0.36, 0, H); bot.addColorStop(0, 'rgba(10,10,14,0)'); bot.addColorStop(0.35, 'rgba(10,10,14,.6)'); bot.addColorStop(1, 'rgba(10,10,14,.92)'); x.fillStyle = bot; x.fillRect(0, H * 0.36, W, H * 0.64);
      const p = d.events[0] && dateParts(d.events[0].date, 'en');
      x.save(); x.fillStyle = '#fff'; setFont(x, '500 {s}px "Jost", Arial, sans-serif', 22, 9); x.direction = 'ltr';
      x.textAlign = 'left'; x.fillText(d.lang === 'ur' ? '' : 'THE WEDDING', 70, 96);
      if (p) { x.textAlign = 'right'; x.fillText(`${p.dd} · ${p.mm} · ${p.yr}`, W - 70, 96); }
      x.fillRect(70, 116, W - 140, 1.2); x.restore(); if ('letterSpacing' in x) x.letterSpacing = '0px';
      if (d.bismillah) { x.save(); x.fillStyle = '#fff'; x.textAlign = 'center'; x.direction = 'rtl'; x.font = '700 30px "Noto Nastaliq Urdu", serif'; x.fillText(L.ur.bismillah, W / 2, 190); x.restore(); }
      const ur = d.lang === 'ur';
      return { top: Math.round(H * 0.5), bottom: H - 90, maxW: W - 160, cx: ur ? W - 80 : 80, align: ur ? 'right' : 'left', seq: ['names', 'pline', 'msg', 'divider', 'events'], noParents: true, ev: 'cols', mono: 'none', divider: 'none' };
    },

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
      x.save(); x.fillStyle = t.acc; x.beginPath(); const dy = top - 6;
      x.moveTo(W / 2 - 46, dy); x.bezierCurveTo(W / 2 - 66, dy - 40, W / 2 - 18, dy - 64, W / 2, dy - 92); x.bezierCurveTo(W / 2 + 18, dy - 64, W / 2 + 66, dy - 40, W / 2 + 46, dy); x.closePath(); x.globalAlpha = 0.9; x.fill();
      x.globalAlpha = 1; x.fillRect(W / 2 - 2, dy - 122, 4, 32); x.beginPath(); x.arc(W / 2, dy - 124, 6, 0, 7); x.fill(); x.restore();
      for (const px of [l - 44, r + 4]) {
        x.save(); x.strokeStyle = t.acc; x.fillStyle = t.acc; x.lineWidth = 2;
        x.strokeRect(px, sh - 40, 40, bot - sh + 40);
        for (let yy = sh; yy < bot - 20; yy += 70) { x.beginPath(); x.moveTo(px + 8, yy); x.lineTo(px + 32, yy); x.stroke(); }
        x.beginPath(); x.moveTo(px - 4, sh - 40); x.bezierCurveTo(px - 4, sh - 80, px + 20, sh - 92, px + 20, sh - 104); x.bezierCurveTo(px + 20, sh - 92, px + 44, sh - 80, px + 44, sh - 40); x.closePath(); x.fill();
        x.restore();
      }
      for (const lx of [W / 2 - 300, W / 2 + 300]) {
        const ly = 360;
        x.save(); x.strokeStyle = t.acc; x.fillStyle = t.acc; x.lineWidth = 1.5;
        x.beginPath(); x.moveTo(lx, 60); x.lineTo(lx, ly - 24); x.stroke();
        x.beginPath(); x.moveTo(lx - 14, ly - 24); x.lineTo(lx + 14, ly - 24); x.lineTo(lx + 20, ly + 6); x.lineTo(lx, ly + 34); x.lineTo(lx - 20, ly + 6); x.closePath(); x.globalAlpha = 0.85; x.fill();
        x.globalAlpha = 1; x.fillStyle = t.alt; x.beginPath(); x.arc(lx, ly + 4, 6, 0, 7); x.fill();
        x.restore();
      }
      return { top: 385, bottom: H - 120, maxW: r - l - 90 };
    },

    // Nikah: a cream mihrab (pointed prayer-niche arch) on deep teal with a gold eight-point star pattern.
    nikah(x, W, H, t) {
      bgFill(x, W, H, t);
      x.save(); x.strokeStyle = t.acc; x.lineWidth = 1.3; x.globalAlpha = 0.22;
      const s = 120;
      for (let yy = 0; yy <= H + s; yy += s) for (let xx = 0; xx <= W + s; xx += s) {
        star8(x, xx, yy, s * 0.36); x.stroke();
        x.beginPath(); x.arc(xx, yy, s * 0.16, 0, 7); x.stroke();
        x.save(); x.translate(xx + s / 2, yy + s / 2); x.rotate(Math.PI / 4); x.strokeRect(-s * 0.13, -s * 0.13, s * 0.26, s * 0.26); x.restore();
        x.beginPath(); x.moveTo(xx + s * 0.36, yy); x.lineTo(xx + s * 0.64, yy); x.moveTo(xx, yy + s * 0.36); x.lineTo(xx, yy + s * 0.64); x.stroke();
      }
      x.restore();
      const l = 116, r = W - 116, bot = H - 72, sh = 500, ap = 120;
      const niche = k => { x.beginPath(); x.moveTo(l + k, bot - k); x.lineTo(l + k, sh); x.bezierCurveTo(l + k, sh - 150, W / 2 - 120, ap + 160 + k * 0.6, W / 2, ap + k); x.bezierCurveTo(W / 2 + 120, ap + 160 + k * 0.6, r - k, sh - 150, r - k, sh); x.lineTo(r - k, bot - k); x.closePath(); };
      x.save(); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 40; niche(0); x.fillStyle = '#FBF6EA'; x.fill(); x.restore();
      x.save(); x.strokeStyle = t.acc; x.lineWidth = 5; niche(0); x.stroke(); x.lineWidth = 1.5; niche(16); x.stroke(); x.restore();
      // a band of small stars along the bottom of the niche
      x.save(); x.fillStyle = t.acc; x.globalAlpha = 0.85;
      for (let k = 0, n = 9; k < n; k++) { star8(x, l + 70 + k * (r - l - 140) / (n - 1), bot - 46, 11); x.fill(); }
      x.restore();
      // crescent and star above the point of the arch
      x.save(); x.fillStyle = t.acc; x.beginPath(); x.arc(W / 2, 64, 26, 0, 7); x.fill();
      x.fillStyle = t.bg[0]; x.beginPath(); x.arc(W / 2 + 11, 57, 22, 0, 7); x.fill();
      x.fillStyle = t.acc; star8(x, W / 2 + 12, 60, 8, 0.45); x.fill(); x.restore();
      return { top: 352, bottom: H - 150, maxW: r - l - 150, mono: 'star' };
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
      return { top: 260, bottom: H - 110, maxW: W - 250 };
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
      return { top: 330, bottom: H - 210, maxW: W - 260 };
    },

    // Dholki: Pakistani truck art. Zig-zag borders in bright colours, big folk flowers and mirror dots around a cream panel.
    truckart(x, W, H, t) {
      bgFill(x, W, H, t);
      const zig = (x0, y0, x1, y1, h, ca, cb) => {
        const len = Math.hypot(x1 - x0, y1 - y0), n = Math.round(len / 44), st = len / n;
        x.save(); x.translate(x0, y0); x.rotate(Math.atan2(y1 - y0, x1 - x0));
        x.fillStyle = cb; x.fillRect(0, 0, len, h);
        x.fillStyle = ca;
        for (let i = 0; i < n; i++) { x.beginPath(); x.moveTo(i * st, 0); x.lineTo((i + 1) * st, 0); x.lineTo((i + 0.5) * st, h); x.closePath(); x.fill(); }
        x.restore();
      };
      const a = 22, h = 40;
      zig(a, a, W - a, a, h, '#FFD54F', '#00897B'); zig(W - a, a, W - a, H - a, h, '#FFD54F', '#00897B');
      zig(W - a, H - a, a, H - a, h, '#FFD54F', '#00897B'); zig(a, H - a, a, a, h, '#FFD54F', '#00897B');
      x.save(); x.strokeStyle = '#FFFFFF'; x.lineWidth = 4; x.strokeRect(a + h + 8, a + h + 8, W - 2 * (a + h + 8), H - 2 * (a + h + 8)); x.restore();
      const p = 104;
      x.save(); x.shadowColor = 'rgba(0,0,0,.3)'; x.shadowBlur = 24; roundRect(x, p, p, W - 2 * p, H - 2 * p, 36); x.fillStyle = '#FFF7E3'; x.fill(); x.restore();
      x.save(); x.strokeStyle = '#00897B'; x.lineWidth = 7; roundRect(x, p, p, W - 2 * p, H - 2 * p, 36); x.stroke();
      x.strokeStyle = '#F9A825'; x.lineWidth = 3; x.setLineDash([16, 9]); roundRect(x, p + 16, p + 16, W - 2 * p - 32, H - 2 * p - 32, 26); x.stroke(); x.restore();
      // mirror-work dots along the top and bottom of the panel
      const dots = ['#C2185B', '#00897B', '#F9A825', '#E64A19'];
      x.save();
      for (const yy of [p + 40, H - p - 40]) for (let k = 0, xx = p + 150; xx <= W - p - 150; xx += 36, k++) { x.fillStyle = dots[k % 4]; x.beginPath(); x.arc(xx, yy, 6, 0, 7); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.arc(xx - 1.5, yy - 1.5, 2, 0, 7); x.fill(); }
      x.restore();
      const folk = (cx, cy, r, c) => {
        x.save(); x.fillStyle = c[0]; for (let i = 0; i < 8; i++) petal(x, cx, cy, r, r * 0.52, i * Math.PI / 4);
        x.fillStyle = c[1]; for (let i = 0; i < 8; i++) petal(x, cx, cy, r * 0.7, r * 0.36, i * Math.PI / 4 + Math.PI / 8);
        x.fillStyle = c[2]; x.beginPath(); x.arc(cx, cy, r * 0.3, 0, 7); x.fill();
        x.fillStyle = c[3]; x.beginPath(); x.arc(cx, cy, r * 0.14, 0, 7); x.fill();
        x.fillStyle = '#fff'; for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4; x.beginPath(); x.arc(cx + Math.cos(an - Math.PI / 2) * r * 0.66, cy + Math.sin(an - Math.PI / 2) * r * 0.66, r * 0.05, 0, 7); x.fill(); }
        x.restore();
      };
      const leaves = (cx, cy, r) => { for (let i = 0; i < 8; i++) leaf(x, cx, cy, r * 1.35, i * Math.PI / 4 + Math.PI / 8, i % 2 ? '#2E7D32' : '#43A047'); };
      [[p, p], [W - p, p], [p, H - p], [W - p, H - p]].forEach(([cx, cy], i) => { leaves(cx, cy, 62); folk(cx, cy, 62, i % 2 ? ['#E64A19', '#FFD54F', '#C2185B', '#FFF'] : ['#C2185B', '#FFD54F', '#00897B', '#FFF']); });
      leaves(W / 2, p, 54); folk(W / 2, p, 58, ['#F9A825', '#C2185B', '#00897B', '#FFF']);
      folk(W / 2, H - p, 46, ['#00897B', '#FFD54F', '#C2185B', '#FFF']);
      for (const yy of [H * 0.38, H * 0.62]) for (const xx of [p, W - p]) folk(xx, yy, 26, ['#F9A825', '#C2185B', '#00897B', '#FFF']);
      return { top: 300, bottom: H - 210, maxW: W - 360, mono: 'flower', divider: 'flourish' };
    },

    // A round wreath of leaves and roses holding the couple's initials; bouquets in the lower corners.
    blush(x, W, H, t, d) {
      bgFill(x, W, H, t);
      x.save(); x.strokeStyle = t.acc; x.globalAlpha = 0.6; x.lineWidth = 1.5; x.strokeRect(46, 46, W - 92, H - 92); x.restore();
      const cx = W / 2, cy = 300, r = 165, green = '#8BA888', dk = '#6E8E6B';
      x.save(); x.strokeStyle = dk; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke(); x.restore();
      for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2, px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r; leaf(x, px, py, 34, a + (i % 2 ? 0.9 : 2.2), i % 3 ? green : dk); }
      [[-0.75, 46], [-0.95, 30], [-0.55, 28], [2.4, 42], [2.2, 26], [2.62, 24], [0.8, 22]].forEach(([a, s]) => rose(x, cx + Math.cos(a) * r, cy + Math.sin(a) * r, s, t.alt, t.acc));
      const ini = initials(d).join(' ');
      x.save(); x.fillStyle = t.acc; x.textAlign = 'center'; x.font = rtl(ini) ? '700 70px "Noto Nastaliq Urdu", serif' : '110px "Great Vibes", cursive'; x.fillText(ini.replace(' ', ' & '), cx, cy + 34); x.restore();
      for (const [bx, by, fx] of [[110, H - 130, 1], [W - 110, H - 130, -1]]) {
        x.save(); x.translate(bx, by); x.scale(fx, 1);
        [[0, 0, 0.3], [60, -40, -0.6], [-20, -70, -1.4], [90, 10, 0.9]].forEach(([lx, ly, a]) => leaf(x, lx, ly, 70, a, green));
        rose(x, 0, 0, 44, t.alt, t.acc); rose(x, 66, -18, 28, t.alt, t.acc);
        x.restore();
      }
      return { top: 540, bottom: H - 210, maxW: W - 260, mono: 'none' };
    },

    // Garden: watercolour washes with peonies and leaves spilling in from two corners.
    garden(x, W, H, t) {
      x.fillStyle = t.bg[0]; x.fillRect(0, 0, W, H);
      const R = rng(42);
      x.save(); x.fillStyle = '#8A6A55'; for (let i = 0; i < 2600; i++) { x.globalAlpha = 0.02 + R() * 0.03; x.fillRect(R() * W, R() * H, 1.5, 1.5); } x.restore();
      wash(x, 150, 150, 380, '#F2A7B8', R); wash(x, 260, 90, 300, '#F6C3A8', R); wash(x, 90, 300, 260, '#C9B6E4', R);
      wash(x, W - 150, H - 150, 380, '#F2A7B8', R); wash(x, W - 280, H - 90, 300, '#F6C3A8', R); wash(x, W - 90, H - 300, 260, '#B9CDB0', R);
      x.save(); x.strokeStyle = t.acc; x.globalAlpha = 0.45; x.lineWidth = 1.4; x.strokeRect(52, 52, W - 104, H - 104); x.restore();
      const cluster = (cx, cy, a0, sz) => {
        for (let i = 0; i < 16; i++) { const a = a0 - 0.25 + R() * (Math.PI / 2 + 0.5); leafG(x, cx + Math.cos(a) * sz * 0.25, cy + Math.sin(a) * sz * 0.25, sz * (0.45 + R() * 0.4), a, i % 2 ? '#6F8F6A' : '#86A57C', '#CFE0C4'); }
        for (let i = 0; i < 7; i++) { const a = a0 + R() * Math.PI / 2, dd = sz * (0.7 + R() * 0.35); x.save(); x.fillStyle = '#D98FA3'; x.globalAlpha = 0.85; x.beginPath(); x.arc(cx + Math.cos(a) * dd, cy + Math.sin(a) * dd, 7 + R() * 6, 0, 7); x.fill(); x.restore(); }
        peony(x, cx + Math.cos(a0 + Math.PI / 4) * sz * 0.32, cy + Math.sin(a0 + Math.PI / 4) * sz * 0.32, sz * 0.32, '#F4B6C2', '#C8577A', 0.3);
        peony(x, cx + Math.cos(a0 + 0.2) * sz * 0.66, cy + Math.sin(a0 + 0.2) * sz * 0.66, sz * 0.2, '#FAD3C0', '#D9846A', 1.1);
        peony(x, cx + Math.cos(a0 + Math.PI / 2 - 0.2) * sz * 0.66, cy + Math.sin(a0 + Math.PI / 2 - 0.2) * sz * 0.66, sz * 0.19, '#E7DDF6', '#9C82C4', 2);
      };
      cluster(36, 36, 0, 350); cluster(W - 36, H - 36, Math.PI, 350);
      return { top: 360, bottom: H - 270, maxW: W - 330 };
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
      return { top: 250, bottom: H - 170, maxW: W - 300, divider: 'rule' };
    },

    // Modern: an editorial page. Everything left-aligned (right-aligned in Urdu), the date running up the side, a huge faint ampersand.
    editorial(x, W, H, t, d) {
      const ur = d.lang === 'ur', m = 130;
      x.fillStyle = t.bg[0]; x.fillRect(0, 0, W, H);
      x.save(); x.fillStyle = t.acc; x.globalAlpha = 0.07; x.font = 'italic 500 900px "Playfair Display", Georgia, serif'; x.textAlign = ur ? 'left' : 'right'; x.fillText('&', ur ? 40 : W - 40, H - 170); x.restore();
      x.save(); x.strokeStyle = t.ink; x.lineWidth = 1.2;
      x.beginPath(); x.moveTo(m, 118); x.lineTo(W - m, 118); x.moveTo(m, H - 110); x.lineTo(W - m, H - 110); x.stroke(); x.restore();
      const p = d.events[0] && dateParts(d.events[0].date, 'en');
      if (p) {
        x.save(); x.translate(ur ? 96 : W - 96, H / 2); x.rotate(Math.PI / 2 * (ur ? -1 : 1));
        setFont(x, '500 {s}px "Cinzel", Georgia, serif', 36, 14); x.fillStyle = t.acc; x.textAlign = 'center'; x.textBaseline = 'middle';
        const s = `${p.dd} · ${p.mm} · ${p.yr}`, w = x.measureText(s).width;
        x.fillText(s, 0, 0);
        x.strokeStyle = t.acc; x.lineWidth = 1.2; x.beginPath(); x.moveTo(-w / 2 - 30, 0); x.lineTo(-w / 2 - 230, 0); x.moveTo(w / 2 + 30, 0); x.lineTo(w / 2 + 230, 0); x.stroke();
        x.restore(); if ('letterSpacing' in x) x.letterSpacing = '0px';
      }
      return { top: 230, bottom: H - 170, maxW: W - m - 220, cx: ur ? W - m : m, align: ur ? 'right' : 'left', ev: 'list', divider: 'line', mono: 'line' };
    },

    // Classic: fine lines, big serif capitals, events in a neat table.
    ivory(x, W, H, t) {
      x.fillStyle = t.bg[0]; x.fillRect(0, 0, W, H);
      x.save(); x.strokeStyle = t.ink; x.lineWidth = 1.2; x.strokeRect(56, 56, W - 112, H - 112); x.strokeStyle = t.acc; x.lineWidth = 3; x.strokeRect(70, 70, W - 140, H - 140); x.restore();
      x.save(); x.fillStyle = t.acc; for (const [cx, cy] of [[70, 70], [W - 70, 70], [70, H - 70], [W - 70, H - 70]]) { x.beginPath(); x.moveTo(cx, cy - 10); x.lineTo(cx + 10, cy); x.lineTo(cx, cy + 10); x.lineTo(cx - 10, cy); x.fill(); } x.restore();
      return { top: 230, bottom: H - 150, maxW: W - 300, ev: 'table', divider: 'rule' };
    },

    // Monogram: two tones. A deep green top with a laurel crest and the names; the details below on ivory.
    monogram(x, W, H, t, d) {
      const P = Math.round(H * 0.44), cy = Math.round(P * 0.45), cr = 112;
      x.fillStyle = '#FBF8F1'; x.fillRect(0, 0, W, H);
      const edge = k => { x.beginPath(); x.moveTo(0, 0); x.lineTo(W, 0); x.lineTo(W, P - 46 + k); x.quadraticCurveTo(W / 2, P + 46 + k, 0, P - 46 + k); x.closePath(); };
      const g = x.createLinearGradient(0, 0, 0, P); g.addColorStop(0, t.bg[0]); g.addColorStop(1, t.bg[1]);
      edge(0); x.fillStyle = g; x.fill();
      x.save(); edge(0); x.clip(); x.strokeStyle = t.alt; x.globalAlpha = 0.07; x.lineWidth = 1;
      for (let k = -H; k < W + H; k += 38) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k + P, P); x.moveTo(k + P, 0); x.lineTo(k, P); x.stroke(); }
      x.restore();
      x.save(); x.strokeStyle = t.acc; x.lineWidth = 2; x.beginPath(); x.moveTo(0, P - 34); x.quadraticCurveTo(W / 2, P + 58, W, P - 34); x.stroke(); x.restore();
      x.save(); x.strokeStyle = t.acc; x.globalAlpha = 0.7; x.lineWidth = 1.2; x.strokeRect(40, 40, W - 80, H - 80); x.restore();
      // crest: double ring, laurel branches and the initials
      x.save(); x.strokeStyle = t.alt; x.lineWidth = 2.5; x.beginPath(); x.arc(W / 2, cy, cr, 0, 7); x.stroke(); x.lineWidth = 1; x.beginPath(); x.arc(W / 2, cy, cr - 12, 0, 7); x.stroke(); x.restore();
      for (const side of [-1, 1]) {
        x.save(); x.strokeStyle = t.alt; x.lineWidth = 2; x.beginPath();
        x.arc(W / 2, cy, cr + 30, Math.PI / 2 + side * 0.3, Math.PI / 2 + side * 2.6, side < 0); x.stroke(); x.restore();
        for (let i = 0; i < 10; i++) {
          const a = Math.PI / 2 + side * (0.42 + i * 0.22), px = W / 2 + Math.cos(a) * (cr + 30), py = cy + Math.sin(a) * (cr + 30);
          const dir = Math.atan2(Math.cos(a) * side, -Math.sin(a) * side);
          leaf(x, px, py, 30, dir + Math.PI / 2 + 0.55, t.alt); leaf(x, px, py, 26, dir + Math.PI / 2 - 0.55, t.alt);
        }
      }
      const [a, b] = initials(d), ur = rtl(a + b);
      x.save(); x.fillStyle = t.alt; x.textAlign = 'center';
      x.font = ur ? '700 64px "Noto Nastaliq Urdu", serif' : '600 78px "Cinzel", Georgia, serif';
      x.fillText(ur ? b : a, W / 2 - 42, cy + (ur ? 22 : 28)); x.fillText(ur ? a : b, W / 2 + 42, cy + (ur ? 22 : 28));
      x.strokeStyle = t.alt; x.lineWidth = 1.5; x.beginPath(); x.moveTo(W / 2, cy - 52); x.lineTo(W / 2, cy + 46); x.stroke();
      x.restore();
      if (d.bismillah) { x.save(); x.fillStyle = t.alt; x.textAlign = 'center'; x.direction = 'rtl'; x.font = '700 34px "Noto Nastaliq Urdu", serif'; x.fillText(L.ur.bismillah, W / 2, cy - cr - 58); x.restore(); }
      const light = { ink: '#F3EBDD', acc: t.alt, alt: t.alt, nameCol: t.alt };
      return { parts: [
        { ...light, top: cy + cr + 92, bottom: P - 70, maxW: W - 260, seq: ['label', 'names'], names: 'inline' },
        { top: P + 120, bottom: H - 110, maxW: W - 240, seq: ['hosts', 'request', 'parents', 'msg', 'divider', 'events'], ev: 'table', divider: 'rule' },
      ] };
    },

    // Noir gold: black marble with gold-foil lettering and art deco corners.
    noir(x, W, H, t) {
      const bg = x.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#1C1C1D'); bg.addColorStop(0.5, '#0B0B0C'); bg.addColorStop(1, '#161617');
      x.fillStyle = bg; x.fillRect(0, 0, W, H);
      const R = rng(9);
      x.save(); x.lineCap = 'round';
      for (let i = 0; i < 16; i++) {
        const gold = i % 5 === 0;
        x.strokeStyle = gold ? 'rgba(212,175,55,.22)' : `rgba(255,255,255,${(0.03 + R() * 0.05).toFixed(3)})`; x.lineWidth = gold ? 1.2 : 0.6 + R() * 2.4;
        let px = R() * W * 1.2 - W * 0.1, py = R() * H * 0.2 - 100;
        x.beginPath(); x.moveTo(px, py);
        for (let k = 0; k < 6; k++) { const nx = px + (R() - 0.3) * 260, ny = py + 160 + R() * 220; x.bezierCurveTo(px + (R() - 0.5) * 200, py + 60, nx + (R() - 0.5) * 200, ny - 60, nx, ny); px = nx; py = ny; }
        x.stroke();
      }
      x.restore();
      const g = foil(x, W, H);
      x.save(); x.strokeStyle = g; x.fillStyle = g;
      x.lineWidth = 2; x.strokeRect(54, 54, W - 108, H - 108); x.lineWidth = 1; x.strokeRect(68, 68, W - 136, H - 136);
      for (const [cx, cy, sx, sy] of [[54, 54, 1, 1], [W - 54, 54, -1, 1], [54, H - 54, 1, -1], [W - 54, H - 54, -1, -1]]) {
        x.lineWidth = 3; x.beginPath(); x.moveTo(cx + sx * 34, cy + sy * 120); x.lineTo(cx + sx * 34, cy + sy * 34); x.lineTo(cx + sx * 120, cy + sy * 34); x.stroke();
        x.lineWidth = 1.2; x.beginPath(); x.moveTo(cx + sx * 48, cy + sy * 90); x.lineTo(cx + sx * 48, cy + sy * 48); x.lineTo(cx + sx * 90, cy + sy * 48); x.stroke();
        x.beginPath(); x.moveTo(cx + sx * 64, cy + sy * 56); x.lineTo(cx + sx * 72, cy + sy * 64); x.lineTo(cx + sx * 64, cy + sy * 72); x.lineTo(cx + sx * 56, cy + sy * 64); x.closePath(); x.fill();
      }
      const burst = (cy, up) => {
        x.save(); x.translate(W / 2, cy); if (!up) x.scale(1, -1);
        x.lineWidth = 1.4; for (let i = 0; i <= 14; i++) { const an = Math.PI + i * Math.PI / 14, r1 = 30, r2 = i % 2 ? 66 : 92; x.beginPath(); x.moveTo(Math.cos(an) * r1, Math.sin(an) * r1); x.lineTo(Math.cos(an) * r2, Math.sin(an) * r2); x.stroke(); }
        x.lineWidth = 2; x.beginPath(); x.arc(0, 0, 22, Math.PI, 0); x.stroke();
        x.beginPath(); x.moveTo(-250, 0); x.lineTo(-40, 0); x.moveTo(40, 0); x.lineTo(250, 0); x.stroke();
        x.beginPath(); x.moveTo(0, -8); x.lineTo(8, 0); x.lineTo(0, 8); x.lineTo(-8, 0); x.closePath(); x.fill();
        x.restore();
      };
      burst(220, true); burst(H - 150, false);
      x.restore();
      return { top: 320, bottom: H - 230, maxW: W - 300, acc: g, alt: g, nameCol: g, ampCol: g, divider: 'rule', mono: 'none' };
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
      return { top: 300, bottom: H - 290, maxW: W - 290, divider: 'rule' };
    },

    // Save the date: the date is the hero, set large inside a soft arch, with dried pampas grass at its feet.
    savedate(x, W, H, t) {
      const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, t.bg[0]); g.addColorStop(1, t.bg[1]);
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      const l = 110, r = W - 110, top = 110, bot = H - 110, rad = (r - l) / 2;
      const arch = k => { x.beginPath(); x.moveTo(l - k, bot + k); x.lineTo(l - k, top + rad); x.arc(W / 2, top + rad, rad + k, Math.PI, 0); x.lineTo(r + k, bot + k); x.closePath(); };
      arch(0); x.fillStyle = '#FBF8F3'; x.fill();
      x.save(); x.strokeStyle = t.acc; x.lineWidth = 1.4; arch(18); x.stroke(); x.restore();
      const R = rng(5);
      const pampas = (bx, by, dir) => {
        x.save(); x.translate(bx, by); x.scale(dir, 1);
        for (let i = 0; i < 9; i++) {
          const an = -Math.PI / 2 + 0.15 + i * 0.12 + (R() - 0.5) * 0.08, len = 260 + R() * 160;
          const ex = Math.cos(an) * len * 0.75, ey = Math.sin(an) * len;
          x.strokeStyle = '#B8957A'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(ex * 0.3 + 30, ey * 0.6, ex, ey); x.stroke();
          for (let k = 0; k < 22; k++) {
            const u = 0.55 + k / 22 * 0.45, px = ex * u + (u > 0.6 ? 30 * (1 - u) : 0), py = ey * u;
            x.fillStyle = k % 2 ? '#D9C2A8' : '#C8A988'; x.globalAlpha = 0.75; x.beginPath(); x.ellipse(px + (R() - 0.5) * 16, py, 9, 4, an + 0.6 + (R() - 0.5) * 0.6, 0, 7); x.fill();
          }
          x.globalAlpha = 1;
        }
        for (let i = 0; i < 4; i++) leaf(x, 20, 0, 70 + R() * 40, -0.75 + i * 0.32, i % 2 ? '#B9A27F' : '#A58C6A');
        x.restore();
      };
      pampas(l + 10, bot + 12, 1); pampas(r - 10, bot + 12, -1);
      return { top: 320, bottom: H - 330, maxW: W - 360, seq: ['bism', 'std', 'names', 'married', 'pline', 'bigdate', 'venue', 'msg', 'rest'], names: 'inline', mono: 'none' };
    },

    // Photo arch: the couple's photo in a tall arch with a gold outline and botanical line drawings.
    photo(x, W, H, t, d, img) {
      const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, t.bg[0]); g.addColorStop(1, t.bg[1]);
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      const aw = 470, l = W / 2 - aw / 2, top = 92, ah = Math.round(H * 0.35), bot = top + ah, rr = aw / 2;
      const arch = k => { x.beginPath(); x.moveTo(l - k, bot + k); x.lineTo(l - k, top + rr); x.arc(W / 2, top + rr, rr + k, Math.PI, 0); x.lineTo(l + aw + k, bot + k); x.closePath(); };
      x.save(); x.shadowColor = 'rgba(60,40,20,.25)'; x.shadowBlur = 30; x.shadowOffsetY = 10; arch(0); x.fillStyle = '#fff'; x.fill(); x.restore();
      x.save(); arch(0); x.clip();
      if (img) coverImg(x, img, l, top, aw, ah, 0.3);
      else {
        const pg = x.createLinearGradient(0, top, 0, bot); pg.addColorStop(0, '#E8D3BF'); pg.addColorStop(1, '#C9A98A'); x.fillStyle = pg; x.fillRect(l, top, aw, ah);
        mandala(x, W / 2, top + ah * 0.55, 190, { ...t, acc: '#FFFFFF', alt: '#FFFFFF', bg: ['#D9BFA6', '#D9BFA6'] }, 0.25);
        const [a, b] = initials(d), u = rtl(a + b);
        x.fillStyle = '#FFFFFF'; x.textAlign = 'center'; x.direction = u ? 'rtl' : 'ltr'; x.font = u ? '700 120px "Noto Nastaliq Urdu", serif' : '200px "Great Vibes", cursive'; x.fillText(u ? `${a} و ${b}` : `${a}&${b}`, W / 2, top + ah * 0.62);
      }
      x.restore();
      x.save(); x.strokeStyle = t.acc; x.lineWidth = 1.5; arch(16); x.stroke(); x.restore();
      const sprig = (bx, by, dir) => {
        x.save(); x.translate(bx, by); x.scale(dir, 1); x.strokeStyle = t.acc; x.lineWidth = 1.6; x.lineCap = 'round';
        x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(-30, -120, -10, -260, -60, -380); x.stroke();
        for (let k = 1; k < 9; k++) {
          const u = k / 9, px = -30 * 3 * u * (1 - u) * (1 - u) - 10 * 3 * u * u * (1 - u) - 60 * u * u * u, py = -120 * 3 * u * (1 - u) * (1 - u) - 260 * 3 * u * u * (1 - u) - 380 * u * u * u;
          for (const s of [-1, 1]) { x.save(); x.translate(px, py); x.rotate(s * 0.9 - 0.15); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(12, -22, 0, -46 + k * 2); x.quadraticCurveTo(-12, -22, 0, 0); x.stroke(); x.restore(); }
        }
        x.restore();
      };
      sprig(l - 40, bot + 10, -1); sprig(l + aw + 40, bot + 10, 1);
      return { top: bot + 100, bottom: H - 110, maxW: W - 240, seq: ['bism', 'names', 'invite2', 'pline', 'msg', 'divider', 'events'], names: 'inline', mono: 'none', divider: 'rule' };
    },

    // Photo cover: the photo fills the top of the card like a magazine cover and fades into a dark, gold-lettered page.
    cover(x, W, H, t, d, img) {
      x.fillStyle = t.bg[1]; x.fillRect(0, 0, W, H);
      const ph = Math.round(H * 0.55);
      if (img) coverImg(x, img, 0, 0, W, ph, 0.25);
      else {
        const pg = x.createLinearGradient(0, 0, W, ph); pg.addColorStop(0, '#8A4560'); pg.addColorStop(1, t.bg[0]); x.fillStyle = pg; x.fillRect(0, 0, W, ph);
        mandala(x, W / 2, ph * 0.42, 280, { ...t, bg: ['#7A3E56', '#6B3549'] }, 0.18);
        const [a, b] = initials(d), u = rtl(a + b);
        x.fillStyle = 'rgba(255,240,225,.9)'; x.textAlign = 'center'; x.direction = u ? 'rtl' : 'ltr'; x.font = u ? '700 130px "Noto Nastaliq Urdu", serif' : '230px "Great Vibes", cursive'; x.fillText(u ? `${a} و ${b}` : `${a}&${b}`, W / 2, ph * 0.5);
      }
      const sh = x.createLinearGradient(0, 0, 0, 220); sh.addColorStop(0, 'rgba(0,0,0,.45)'); sh.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = sh; x.fillRect(0, 0, W, 220);
      const f = x.createLinearGradient(0, ph * 0.42, 0, ph + 2); f.addColorStop(0, 'rgba(20,11,16,0)'); f.addColorStop(0.7, 'rgba(20,11,16,.85)'); f.addColorStop(1, t.bg[1]); x.fillStyle = f; x.fillRect(0, ph * 0.42, W, ph * 0.58 + 2);
      if (d.bismillah) { x.save(); x.fillStyle = t.alt; x.textAlign = 'center'; x.direction = 'rtl'; x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 12; x.font = '700 38px "Noto Nastaliq Urdu", serif'; x.fillText(L.ur.bismillah, W / 2, 112); x.restore(); }
      x.save(); x.strokeStyle = t.acc; x.lineWidth = 1.5; x.strokeRect(36, 36, W - 72, H - 72); x.restore();
      return { top: ph - 120, bottom: H - 110, maxW: W - 220, seq: ['names', 'invite2', 'pline', 'msg', 'divider', 'events'], names: 'inline', mono: 'none' };
    },
  };

  // ---------- writing the text ----------
  const SEQ = ['bism', 'hosts', 'request', 'names', 'msg', 'divider', 'events'];
  const FK = {
    instrument: '400 {s}px "Instrument Serif", Georgia, serif', instrumentI: 'italic 400 {s}px "Instrument Serif", Georgia, serif',
    bodoni: '400 {s}px "Bodoni Moda", Didot, Georgia, serif', bodoniI: 'italic 400 {s}px "Bodoni Moda", Didot, Georgia, serif',
    ballet: '400 {s}px "Ballet", cursive', fraunces: 'italic 600 {s}px "Fraunces", Georgia, serif',
    jost: '500 {s}px "Jost", Arial, sans-serif', jostL: '400 {s}px "Jost", Arial, sans-serif',
  };
  function fontsFor(t, ur) {
    const NAST = w => `${w} {s}px "Noto Nastaliq Urdu", serif`, sans = t.head === 'sans', ty = t.type;
    if (ty) {
      return {
        NAST, hk: ur ? 1 : 0.78, hsp: ur ? 0 : 8,
        head: ur ? NAST(700) : FK.jost, body: ur ? NAST(400) : FK.instrumentI, bodyUp: ur ? NAST(400) : FK.instrument, bold: ur ? NAST(700) : FK.instrument,
        name: n => rtl(n) ? NAST(700) : FK[ty.name], amp: ur ? NAST(700) : FK[ty.amp], hero: FK[ty.name],
        nameSize: n => (rtl(n) ? 92 : ty.nameSize), nameLh: n => (rtl(n) ? 1.7 : ty.nameLh), keep: !ty.caps, nameSp: ty.nameSp || 0, nameGap: ur ? 0 : ty.nameGap || 0,
        ampSize: ur ? 60 : ty.ampSize, ampGap: ur ? 66 : ty.ampGap, inlineSize: n => (rtl(n) ? 84 : ty.inlineSize),
      };
    }
    const keep = t.names === 'script' || t.names === 'serif';
    return {
      NAST, hk: ur ? 1 : sans ? 0.8 : 1, hsp: ur ? 0 : sans ? 7 : 5,
      head: ur ? NAST(700) : sans ? '600 {s}px "Montserrat", Arial, sans-serif' : '600 {s}px "Cinzel", Georgia, serif',
      body: ur ? NAST(400) : 'italic 500 {s}px "Cormorant Garamond", Georgia, serif',
      bodyUp: ur ? NAST(400) : '500 {s}px "Cormorant Garamond", Georgia, serif',
      bold: ur ? NAST(700) : '600 {s}px "Cormorant Garamond", Georgia, serif',
      name: n => rtl(n) ? NAST(700) : { caps: '600 {s}px "Cormorant Garamond", Georgia, serif', deco: '500 {s}px "Cinzel", Georgia, serif', serif: 'italic 500 {s}px "Playfair Display", Georgia, serif' }[t.names] || '{s}px "Great Vibes", cursive',
      amp: ur ? NAST(700) : t.names === 'script' ? '{s}px "Great Vibes", cursive' : 'italic 500 {s}px "Playfair Display", Georgia, serif',
      nameSize: n => (rtl(n) ? 92 : { script: 150, caps: 92, deco: 88, serif: 124 }[t.names]),
      nameLh: n => (rtl(n) ? 1.7 : { script: 0.95, serif: 1.05 }[t.names] || 1.08), keep, nameSp: keep ? 0 : 7,
      ampSize: ur ? 60 : t.names === 'script' ? 100 : 64, ampGap: ur ? 66 : t.names === 'script' ? 78 : 66,
      inlineSize: n => (rtl(n) ? 84 : { script: 128, serif: 104 }[t.names] || 76),
    };
  }

  // Returns fn(paint, fs, gap) that lays one area of the card out from o.top down and returns where it ended.
  // With paint = false it only measures; fn.units says how many gaps of spare height it can take.
  function stack(x, d, o, F, t, L0) {
    const ur = d.lang === 'ur', A = o.align, ax = o.ax, maxW = o.maxW, hk = F.hk, hsp = F.hsp;
    const caps = s => (ur || rtl(s) ? s : s.toUpperCase());
    const keepCase = F.keep, nameSize = F.nameSize, nameLh = F.nameLh, nameSp = F.nameSp;
    const ev = d.events.slice(0, 6);
    const fn = (paint, fs, gap) => {
      const S = v => v * fs;
      let y = o.top, units = 0;
      const G = w => { y += gap * w; units += w; };
      // fits and writes a block whose first baseline is y; y moves on by its lines
      const put = (str, f, size, lh, col, sp = 0, lines = 2, w = maxW, x0 = ax, al = A) => {
        const fl = fitLines(x, str, f, size, w, lines, sp);
        if (paint && fl.lines.length) { x.fillStyle = col; drawLines(x, fl, f, x0, y, lh, sp, al); }
        y += fl.lines.length * lh;
        return fl;
      };
      const ornament = (kind, yy) => {
        if (kind === 'rule') rule(x, ax, yy, 120, o.acc);
        else if (kind === 'star') { x.save(); x.fillStyle = o.acc; star8(x, ax, yy, 20); x.fill(); x.fillStyle = '#FBF6EA'; x.beginPath(); x.arc(ax, yy, 6, 0, 7); x.fill(); x.restore(); }
        else if (kind === 'flower') flower(x, ax, yy, 24, t.alt, o.acc, 8);
        else if (kind === 'thin') { x.save(); x.strokeStyle = o.acc; x.lineWidth = 1.2; x.beginPath(); x.moveTo(ax - 50, yy); x.lineTo(ax + 50, yy); x.stroke(); x.restore(); }
        else if (kind === 'line') { x.save(); x.strokeStyle = o.acc; x.lineWidth = 3; x.beginPath(); x.moveTo(ax, yy); x.lineTo(ax + (A === 'right' ? -90 : 90), yy); x.stroke(); x.restore(); }
        else mandala(x, ax, yy, 26, t);
      };
      const person = (who, parent, label) => {
        const fl = fitLines(x, keepCase ? who : caps(who), F.name(who), S(nameSize(who)), maxW, 2, nameSp, 0.62);
        const lh = fl.size * nameLh(who);
        y += lh * (rtl(who) ? 0.75 : 0.82);
        if (paint) { x.fillStyle = o.nameCol; drawLines(x, fl, F.name(who), ax, y, lh, nameSp, A); }
        y += (fl.lines.length - 1) * lh + S(rtl(who) ? 34 : 20 + (F.nameGap || 0));
        if (parent) {
          const pl = fitLines(x, `${label} ${parent}`, F.body, S(ur ? 26 : 31), maxW, 2);
          y += S(ur ? 44 : 30);
          if (paint) { x.fillStyle = o.ink; drawLines(x, pl, F.body, ax, y, S(ur ? 54 : 38), 0, A); }
          y += (pl.lines.length - 1) * S(ur ? 54 : 38) + S(10);
        }
      };
      const evList = (list, k0) => list.forEach(e => {
        const sc = k0 ? 0.86 : 1;
        put(caps(e.name), F.head, S((ur ? 32 : 30 * hk) * sc), S((ur ? 60 : 42) * sc), o.acc, hsp);
        put(fmtDate(e.date, d.lang), F.bold, S((ur ? 27 : 32) * sc), S((ur ? 56 : 40) * sc), o.ink);
        const tvp = [fmtTime(e.time, d.lang), e.venue].filter(Boolean), tvs = tvp.join(tvp.some(rtl) ? ' ، ' : ' · ');
        if (tvs) put(tvs, F.bodyUp, S((ur ? 24 : 29) * sc), S((ur ? 52 : 36) * sc), o.ink);
        if (e.address) { if (paint) x.globalAlpha = 0.8; put(e.address, F.body, S((ur ? 21 : 25) * sc), S((ur ? 46 : 32) * sc), o.ink); x.globalAlpha = 1; }
        y += S(22); G(1);
      });
      const sec = {
        bism() {
          if (d.bismillah) {
            const fl = fitLines(x, L0.bismillah, F.NAST(700), S(42), maxW);
            if (paint) { x.fillStyle = o.acc; drawLines(x, fl, F.NAST(700), ax, y, 0, 0, A); }
            y += S(74);
          } else if (o.mono !== 'none') { if (paint) ornament(o.mono, y - (['rule', 'line', 'thin'].includes(o.mono) ? 14 : 20)); y += S(50); }
        },
        label() { put(caps(L0.weddingOf), F.head, S((ur ? 30 : 24) * hk), S(ur ? 60 : 40), o.ink, ur ? 0 : 9, 1); y += S(6); },
        hosts() {
          const fl = put(caps(d.hosts || L0.together), F.head, S((ur ? 30 : 26) * hk), S(ur ? 62 : 38), o.ink, hsp);
          if (fl.lines.length) y += S(10);
        },
        request() { put(L0.request, F.body, S(ur ? 28 : 34), S(ur ? 62 : 44), o.ink); G(0.8); },
        invite2() { y += S(ur ? 50 : 46); put(L0.invite2, F.body, S(ur ? 28 : 34), S(ur ? 62 : 44), o.ink); y -= S(ur ? 40 : 26); },
        hero() { // the first event's name, very large (Mehndi night)
          const e0 = d.events[0];
          if (!e0) return;
          const hf = rtl(e0.name) ? F.NAST(700) : F.hero, hs = S(rtl(e0.name) ? 96 : 190);
          y += hs * (rtl(e0.name) ? 0.9 : 0.78);
          const fl = fitLines(x, e0.name, hf, hs, maxW, 1, 0, 0.5);
          if (paint) { x.fillStyle = o.alt; drawLines(x, fl, hf, ax, y, 0, 0, A); }
          y += S(rtl(e0.name) ? 40 : 30);
        },
        married() { y += S(ur ? 50 : 48); put(L0.married, F.body, S(ur ? 30 : 38), S(ur ? 62 : 46), o.ink); y -= S(ur ? 40 : 28); },
        std() { if (ur && d.bismillah) y += S(26); put(caps(L0.std), F.head, S(ur ? 52 : 58 * hk), S(ur ? 96 : 80), o.acc, ur ? 0 : 12, 1); y += S(10); G(0.5); },
        names() {
          if (o.names !== 'inline') {
            person(d.groom, o.noParents ? '' : d.gp, L0.son);
            y += S(F.ampGap);
            if (paint) { x.fillStyle = o.ampCol; setFont(x, F.amp, S(F.ampSize)); x.direction = ur ? 'rtl' : 'ltr'; x.textAlign = A; x.fillText(ur ? 'و' : '&', ax, y); x.textAlign = 'center'; }
            y += S(10);
            person(d.bride, o.noParents ? '' : d.bp, L0.daughter);
            return;
          }
          const both = rtl(d.groom + d.bride) || ur ? `${d.groom} و ${d.bride}` : `${d.groom} & ${d.bride}`, f = F.name(both);
          const size = F.inlineSize(both);
          const fl = fitLines(x, keepCase ? both : caps(both), f, S(size), maxW, 3, nameSp, 0.6), lh = fl.size * nameLh(both);
          y += lh * (rtl(both) ? 0.72 : 0.8);
          if (paint) { x.fillStyle = o.nameCol; drawLines(x, fl, f, ax, y, lh, nameSp, A); }
          y += (fl.lines.length - 1) * lh + S(rtl(both) ? 30 : 18 + (F.nameGap || 0));
        },
        pline() {
          const ps = [d.gp && `${L0.son} ${d.gp}`, d.bp && `${L0.daughter} ${d.bp}`].filter(Boolean);
          if (!ps.length) return;
          y += S(ur ? 40 : 30);
          put(ps.join(ur ? ' ، ' : '  ·  '), F.body, S(ur ? 25 : 29), S(ur ? 52 : 38), o.ink);
          y -= S(ur ? 30 : 20);
        },
        parents() { // the couple side by side, each with their parents (two-tone designs)
          const col = (maxW - S(40)) / 2, sides = [[d.groom, d.gp, L0.son], [d.bride, d.bp, L0.daughter]];
          if (ur) sides.reverse();
          const y0 = y; let end = y;
          sides.forEach(([n, p, lab], i) => {
            y = y0;
            const cxx = ax + (i ? 1 : -1) * (col / 2 + S(20));
            put(caps(n), F.bold, S(ur ? 32 : 40), S(ur ? 62 : 46), o.ink, ur ? 0 : 3, 2, col, cxx, 'center');
            if (p) put(`${lab} ${p}`, F.body, S(ur ? 24 : 28), S(ur ? 50 : 36), o.ink, 0, 2, col, cxx, 'center');
            end = Math.max(end, y);
          });
          if (paint) { x.save(); x.strokeStyle = o.acc; x.globalAlpha = 0.5; x.lineWidth = 1.2; x.beginPath(); x.moveTo(ax, y0 - S(36)); x.lineTo(ax, end - S(20)); x.stroke(); x.restore(); }
          y = end;
        },
        msg() {
          if (!d.msg) return;
          const ml = fitLines(x, d.msg.replace(/\s*\n\s*/g, ' '), F.body, S(ur ? 26 : 31), maxW, 3);
          y += S(28); G(0.3);
          y += S(ur ? 54 : 40);
          if (paint) { x.fillStyle = o.ink; drawLines(x, ml, F.body, ax, y, S(ur ? 56 : 40), 0, A); }
          y += (ml.lines.length - 1) * S(ur ? 56 : 40);
        },
        divider() {
          y += S(46); G(1);
          if (paint) {
            if (o.divider === 'rule') rule(x, ax, y, 300, o.acc);
            else if (o.divider === 'line') { x.save(); x.strokeStyle = o.acc; x.lineWidth = 1.5; x.beginPath(); x.moveTo(ax, y); x.lineTo(ax + (A === 'right' ? -200 : 200), y); x.stroke(); x.restore(); }
            else if (o.divider === 'thin') { x.save(); x.strokeStyle = o.acc; x.globalAlpha = 0.6; x.lineWidth = 1.2; x.beginPath(); x.moveTo(ax - 70, y); x.lineTo(ax + 70, y); x.stroke(); x.restore(); }
            else if (o.divider === 'dots') { x.save(); x.fillStyle = o.acc; [-26, 0, 26].forEach(k => { x.beginPath(); x.arc(ax + k, y, k ? 3.5 : 5, 0, 7); x.fill(); }); x.restore(); }
            else if (o.divider !== 'none') flourish(x, ax, y, 440, o.acc);
          }
          y += S(ur ? 76 : 70); G(0.5);
        },
        bigdate() {
          const e0 = d.events[0], p = e0 && dateParts(e0.date, d.lang);
          if (!p) return;
          y += S(ur ? 96 : 84); G(0.5);
          put(caps(p.mon), F.head, S(ur ? 38 : 36 * hk), S(ur ? 70 : 52), o.acc, ur ? 0 : 14, 1);
          const DF = '500 {s}px "Cinzel", Georgia, serif', ds = S(210);
          setFont(x, DF, ds); const dw = x.measureText(p.day).width;
          const yb = y + S(176), sw = Math.max(S(90), (maxW - dw) / 2 - S(40)), off = dw / 2 + S(40) + sw / 2, tm = fmtTime(e0.time, d.lang);
          const side = (str, sx) => {
            const fl = fitLines(x, caps(str), F.head, S(ur ? 28 : 26 * hk), sw, 2, ur ? 0 : 6), lh = S(ur ? 52 : 34), h = fl.lines.length * lh;
            const b0 = yb - S(78) - h / 2 + lh * 0.72;
            if (paint) {
              x.fillStyle = o.ink; drawLines(x, fl, F.head, sx, b0, lh, ur ? 0 : 6);
              x.save(); x.strokeStyle = o.acc; x.lineWidth = 1.5; x.beginPath();
              for (const ly of [b0 - lh * 0.72 - S(16), b0 + (fl.lines.length - 1) * lh + S(20)]) { x.moveTo(sx - sw / 2, ly); x.lineTo(sx + sw / 2, ly); }
              x.stroke(); x.restore();
            }
          };
          if (paint) { x.fillStyle = o.acc; setFont(x, DF, ds); x.direction = 'ltr'; x.fillText(p.day, ax, yb); }
          const L1 = p.wd, R1 = tm || p.yr;
          side(ur ? R1 : L1, ax - off); side(ur ? L1 : R1, ax + off);
          y = yb + S(70);
          if (tm) put(p.yr, F.head, S(ur ? 36 : 36 * hk), S(ur ? 66 : 52), o.acc, ur ? 0 : 14, 1);
          G(0.6);
        },
        venue() {
          const e0 = d.events[0];
          if (!e0 || !(e0.venue || e0.address)) return;
          y += S(14);
          if (e0.venue) put(e0.venue, F.bold, S(ur ? 30 : 36), S(ur ? 60 : 44), o.ink);
          if (e0.address) { if (paint) x.globalAlpha = 0.8; put(e0.address, F.body, S(ur ? 24 : 29), S(ur ? 50 : 36), o.ink); x.globalAlpha = 1; }
        },
        rest() {
          const more = d.events.slice(1, 6);
          if (!more.length) return;
          y += S(30); G(0.8);
          if (paint) rule(x, ax, y, 260, o.acc);
          y += S(66);
          evList(more, 1);
        },
        events() {
          if (o.ev === 'list') { evList(ev, 0); y -= gap; units -= 1; return; }
          if (o.ev === 'cols') { // up to three events side by side
            const n = Math.min(3, ev.length), gutter = S(44), colW = (maxW - (n - 1) * gutter) / n, rows = Math.ceil(ev.length / n);
            for (let r = 0; r < rows; r++) {
              const y0 = y, inRow = Math.min(n, ev.length - r * n);
              let end = y;
              for (let c = 0; c < inRow; c++) {
                const e = ev[r * n + c];
                let cx0, al = A;
                if (A === 'left') cx0 = ax + c * (colW + gutter);
                else if (A === 'right') cx0 = ax - c * (colW + gutter);
                else { const rowW = inRow * colW + (inRow - 1) * gutter; cx0 = ax - rowW / 2 + colW / 2 + (ur ? inRow - 1 - c : c) * (colW + gutter); }
                y = y0;
                put(caps(e.name), F.head, S((ur ? 30 : 30 * hk)), S(ur ? 58 : 40), o.acc, hsp, 2, colW, cx0, al);
                y += S(4);
                put(fmtDate(e.date, d.lang), F.bold, S(ur ? 25 : 30), S(ur ? 52 : 36), o.ink, 0, 2, colW, cx0, al);
                const tvp = [fmtTime(e.time, d.lang), e.venue].filter(Boolean);
                tvp.forEach(v => put(v, F.bodyUp, S(ur ? 23 : 27), S(ur ? 50 : 33), o.ink, 0, 2, colW, cx0, al));
                if (e.address) { if (paint) x.globalAlpha = 0.75; put(e.address, F.body, S(ur ? 21 : 24), S(ur ? 46 : 30), o.ink, 0, 2, colW, cx0, al); x.globalAlpha = 1; }
                end = Math.max(end, y);
                if (paint && A === 'center' && c > 0) { x.save(); x.strokeStyle = o.acc; x.globalAlpha = 0.35; x.lineWidth = 1; const lx = cx0 - (ur ? -1 : 1) * (colW / 2 + gutter / 2); x.beginPath(); x.moveTo(lx, y0 - S(30)); x.lineTo(lx, end - S(26)); x.stroke(); x.restore(); }
              }
              y = end;
              if (r < rows - 1) { y += S(30); G(1); }
            }
            return;
          }
          if (o.ev === 'table') {
            const left = ax - maxW / 2, right = ax + maxW / 2, colL = maxW * 0.36;
            ev.forEach((e, k) => {
              const nm = fitLines(x, caps(e.name), F.head, S(30), colL - 20, 2, 4);
              const dt = fitLines(x, fmtDate(e.date, d.lang), F.bold, S(31), maxW - colL, 1);
              const tv = fitLines(x, [fmtTime(e.time, d.lang), e.venue].filter(Boolean).join(' · '), F.bodyUp, S(28), maxW - colL, 2);
              const ad = e.address ? fitLines(x, e.address, F.body, S(25), maxW - colL, 1) : { lines: [] };
              const rowH = Math.max(nm.lines.length * S(38), S(40) + tv.lines.length * S(34) + ad.lines.length * S(30)) + S(20);
              if (paint) {
                x.fillStyle = o.acc; drawLines(x, nm, F.head, left, y + S(6), S(38), 4, 'left');
                x.fillStyle = o.ink; drawLines(x, dt, F.bold, right, y + S(6), 0, 0, 'right');
                drawLines(x, tv, F.bodyUp, right, y + S(44), S(34), 0, 'right');
                if (ad.lines.length) { x.globalAlpha = 0.75; drawLines(x, ad, F.body, right, y + S(44) + tv.lines.length * S(34), 0, 0, 'right'); x.globalAlpha = 1; }
                if (k < ev.length - 1) { x.save(); x.strokeStyle = o.acc; x.globalAlpha = 0.4; x.lineWidth = 1; x.beginPath(); x.moveTo(left, y + rowH - S(14)); x.lineTo(right, y + rowH - S(14)); x.stroke(); x.restore(); }
              }
              y += rowH; G(0.6);
            });
            return;
          }
          const cols = ev.length > 2 ? 2 : 1, colW = cols === 2 ? maxW / 2 - 24 : maxW, rows = Math.ceil(ev.length / cols);
          let rowTop = y;
          for (let r = 0; r < rows; r++) {
            let rowH = 0;
            for (let c = 0; c < cols; c++) {
              const k = r * cols + (ur ? cols - 1 - c : c), e = ev[k];
              if (!e) continue;
              const alone = cols === 2 && r === rows - 1 && ev.length % 2;
              const ex = cols === 1 || alone ? ax : ax + (c ? 1 : -1) * (maxW / 4 + 12);
              let yy = rowTop;
              const nm = fitLines(x, caps(e.name), F.head, S((ur ? 34 : 38) * hk), colW, 2, hsp);
              if (paint) { x.fillStyle = o.acc; drawLines(x, nm, F.head, ex, yy, S(ur ? 62 : 46), hsp); }
              yy += nm.lines.length * S(ur ? 62 : 46);
              const dt = fitLines(x, fmtDate(e.date, d.lang), F.bold, S(ur ? 26 : 32), colW, 2);
              if (paint) { x.fillStyle = o.ink; drawLines(x, dt, F.bold, ex, yy, S(ur ? 54 : 38)); }
              yy += dt.lines.length * S(ur ? 54 : 38);
              const tvp = [fmtTime(e.time, d.lang), e.venue].filter(Boolean), tvs = tvp.join(tvp.some(rtl) ? ' ، ' : ' · ');
              if (tvs) { const tv = fitLines(x, tvs, F.bodyUp, S(ur ? 24 : 29), colW, 2); if (paint) drawLines(x, tv, F.bodyUp, ex, yy, S(ur ? 52 : 35)); yy += tv.lines.length * S(ur ? 52 : 35); }
              if (e.address) { const ad = fitLines(x, e.address, F.body, S(ur ? 21 : 25), colW, 2); if (paint) { x.globalAlpha = 0.8; drawLines(x, ad, F.body, ex, yy, S(ur ? 46 : 31)); x.globalAlpha = 1; } yy += ad.lines.length * S(ur ? 46 : 31); }
              rowH = Math.max(rowH, yy - rowTop);
            }
            if (paint && cols === 2 && !(r === rows - 1 && ev.length % 2)) { x.save(); x.strokeStyle = o.acc; x.globalAlpha = 0.4; x.lineWidth = 1.2; x.beginPath(); x.moveTo(ax, rowTop - S(30)); x.lineTo(ax, rowTop + rowH - S(30)); x.stroke(); x.restore(); }
            rowTop += rowH + S(24);
            if (r < rows - 1) { rowTop += gap; units += 1; }
          }
          y = rowTop;
        },
      };
      o.seq.forEach(k => sec[k]());
      fn.units = units;
      return y;
    };
    return fn;
  }

  // ---------- the card ----------
  async function draw(cv, d, opt = {}) {
    await loadFonts();
    let img = opt.photo || null;
    if (typeof img === 'string') img = await loadImg(img);
    const W = cv.width = 1080, H = cv.height = opt.story ? 1920 : 1620;
    const key = TPL[d.tpl] ? d.tpl : 'royal', x = cv.getContext('2d'), t = TPL[key], L0 = labels(d.lang), ur = d.lang === 'ur';
    x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.direction = 'ltr'; if ('letterSpacing' in x) x.letterSpacing = '0px';
    const box = DESIGNS[key](x, W, H, t, d, img);
    x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.direction = 'ltr';
    const F = fontsFor(t, ur);
    const contacts = (d.contacts || []).filter(c => c.name || c.phone);
    const parts = (box.parts || [box]).map(p => {
      const o = { align: 'center', ax: p.cx ?? W / 2, ink: t.ink, acc: t.acc, alt: t.alt, nameCol: t.nameCol || (t.names === 'caps' ? t.ink : t.acc), ampCol: t.names === 'caps' ? t.acc : t.alt,
        seq: SEQ, names: 'stack', ev: 'grid', divider: 'flourish', mono: p.divider === 'rule' ? 'rule' : 'mandala', ...p };
      if (o.align !== 'center' && o.ev !== 'cols') o.ev = 'list';
      if (ur && o.ev === 'table') o.ev = 'grid';
      return o;
    });
    parts.forEach((o, i) => {
      const bottom = o.bottom - (i === parts.length - 1 && contacts.length ? 70 : 0);
      const fn = stack(x, d, o, F, t, L0);
      // Measure, shrink everything if it doesn't fit, then share the spare height out between the sections.
      let fs = 1, used = fn(false, fs, 0);
      for (let n = 0; n < 6 && used > bottom; n++) { fs *= Math.max(0.7, (bottom - o.top) / (used - o.top)); used = fn(false, fs, 0); }
      const gap = fn.units ? Math.max(0, Math.min(120, (bottom - used) / fn.units)) : 0;
      fn(true, fs, gap);
    });
    if (contacts.length) {
      const o = parts[parts.length - 1];
      const txt = L0.rsvpLine + ': ' + contacts.map(c => [c.name, c.phone].filter(Boolean).join(' ')).join(ur ? ' ، ' : ' · ');
      const fl = fitLines(x, txt, F.bodyUp, ur ? 24 : 27, o.maxW, 2);
      x.fillStyle = o.ink; drawLines(x, fl, F.bodyUp, o.ax, o.bottom - (fl.lines.length > 1 ? 40 : 10), ur ? 50 : 34, 0, o.align);
    }
    if ('letterSpacing' in x) x.letterSpacing = '0px';
    return cv;
  }

  return { draw, loadFonts, loadImg, labels, fmtDate, fmtTime, TPL, CATS };
})();
