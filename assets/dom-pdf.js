'use strict';
// Turns laid-out HTML into a real PDF with selectable text (used by Word to PDF, Excel to PDF and HTML to PDF).
// The browser lays the content out; this reads where every word, picture, background and border ended up
// and draws the same thing with pdf-lib. Fonts are swapped for free fonts with the same letter widths as the
// common Office fonts (Carlito for Calibri, Arimo for Arial…), so the browser's layout and the PDF match.
// Long pages are cut into PDF pages between lines, never through a line or a picture. Needs pdf-lib + fontkit.
const DomPdf = (() => {
  const FAMS = [
    ['carlito', /calibri|carlito|aptos|segoe|candara|corbel/i],
    ['caladea', /cambria|caladea/i],
    ['cousine', /courier|cousine|consolas|monospace|mono\b|lucida console/i],
    ['tinos', /times|tinos|georgia|garamond|book antiqua|palatino|baskerville|century schoolbook|^serif$/i],
    ['arimo', /./],
  ];
  const famOf = cssFamily => {
    const first = String(cssFamily || '').split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    for (const name of first) {
      if (/^dp-/i.test(name)) return name.slice(3).replace(/-(400|700).*$/, '');
      if (/^sans-serif$/i.test(name)) return 'arimo';
      for (const [f, re] of FAMS.slice(0, 4)) if (re.test(name)) return f;
      if (!/^(inherit|initial|system-ui|-apple-system)$/i.test(name)) return 'arimo';
    }
    return 'arimo';
  };
  const bytesCache = {};
  const fontUrl = (f, w, it) => `https://cdn.jsdelivr.net/fontsource/fonts/${f}@5.1.0/latin-${w}-${it ? 'italic' : 'normal'}.ttf`;
  function fontData(f, w, it) {
    const k = `${f}-${w}-${it ? 'i' : 'n'}`;
    bytesCache[k] ??= (f === 'noto' ? fontBytes('noto-sans', 400) : fetch(fontUrl(f, w, it)).then(r => { if (!r.ok) throw new Error('A font couldn’t be downloaded. Check your connection.'); return r.arrayBuffer(); }))
      .catch(e => { delete bytesCache[k]; throw e; });
    return bytesCache[k];
  }
  const loaded = new Set();
  async function loadFace(f, w, it) {
    const k = `${f}-${w}-${it}`;
    if (loaded.has(k)) return;
    const face = new FontFace(`DP-${f}`, (await fontData(f, w, it)).slice(0), { weight: String(w), style: it ? 'italic' : 'normal' });
    await face.load(); document.fonts.add(face); loaded.add(k);
  }

  // ---------- Preparing the content ----------
  function unescapeCss(s) { return s.replace(/\\([0-9a-fA-F]{1,6})\s?/g, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/\\(.)/g, '$1'); }
  function counterText(n, style) {
    const alpha = (v, up) => { let s = ''; while (v > 0) { v--; s = String.fromCharCode(97 + (v % 26)) + s; v = Math.floor(v / 26); } return up ? s.toUpperCase() : s; };
    const roman = v => { const t = [[1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'], [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'], [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']]; let s = ''; for (const [a, r] of t) while (v >= a) { s += r; v -= a; } return s; };
    switch (style) {
      case 'lower-alpha': case 'lower-latin': return alpha(n, false);
      case 'upper-alpha': case 'upper-latin': return alpha(n, true);
      case 'lower-roman': return roman(n);
      case 'upper-roman': return roman(n).toUpperCase();
      case 'decimal-leading-zero': return String(n).padStart(2, '0');
      case 'disc': return '•'; case 'circle': return '◦'; case 'square': return '▪'; case 'none': return '';
      default: return String(n);
    }
  }
  const pairs = (s, def) => {
    if (!s || s === 'none') return [];
    const t = s.trim().split(/\s+/), o = [];
    for (let i = 0; i < t.length; i++) { const name = t[i]; let v = def; if (i + 1 < t.length && /^-?\d+$/.test(t[i + 1])) v = +t[++i]; o.push([name, v]); }
    return o;
  };
  // ::before / ::after text (list numbers and bullets) becomes real text, with CSS counters worked out by hand.
  function pseudoToText(root) {
    if (!document.getElementById('dp-style')) {
      const st = document.createElement('style'); st.id = 'dp-style';
      st.textContent = '.dp-nobefore::before{content:none!important}.dp-noafter::after{content:none!important}';
      document.head.appendChild(st);
    }
    const counters = {}, apply = cs => {
      pairs(cs.counterReset, 0).forEach(([n, v]) => { counters[n] = v; });
      pairs(cs.counterSet, 0).forEach(([n, v]) => { counters[n] = v; });
      pairs(cs.counterIncrement, 1).forEach(([n, v]) => { counters[n] = (counters[n] ?? 0) + v; });
    };
    const els = [root, ...root.querySelectorAll('*')];
    for (const el of els) {
      if (el.dataset && el.dataset.dpPseudo) continue;
      apply(getComputedStyle(el));
      for (const which of ['::before', '::after']) {
        const ps = getComputedStyle(el, which), c = ps.content;
        if (!c || c === 'none' || c === 'normal' || ps.display === 'none') continue;
        apply(ps);
        let text = '', m;
        const re = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|counters?\(([^)]*)\)/g;
        while ((m = re.exec(c))) {
          if (m[1] !== undefined || m[2] !== undefined) text += unescapeCss(m[1] ?? m[2]);
          else { const a = m[3].split(',').map(s => s.trim().replace(/^["']|["']$/g, '')); text += counterText(counters[a[0]] ?? 0, m[0].startsWith('counters') ? (a[2] || 'decimal') : (a[1] || 'decimal')); }
        }
        if (!text) continue;
        text = text.replace(/[]/g, '•');
        const sp = document.createElement('span');
        sp.textContent = text; sp.dataset.dpPseudo = '1';
        const keep = ['display', 'width', 'minWidth', 'marginLeft', 'marginRight', 'paddingLeft', 'paddingRight', 'fontSize', 'fontWeight', 'fontStyle', 'color', 'verticalAlign', 'letterSpacing', 'textDecorationLine', 'backgroundColor', 'position', 'left', 'top', 'textIndent', 'float'];
        keep.forEach(k => { sp.style[k] = ps[k]; });
        if (!/symbol|wingding/i.test(ps.fontFamily)) sp.style.fontFamily = ps.fontFamily;
        sp.style.whiteSpace = 'pre';
        if (which === '::before') el.prepend(sp); else el.append(sp);
        el.classList.add(which === '::before' ? 'dp-nobefore' : 'dp-noafter');
      }
    }
  }
  // Swap every font for its same-width free font and load those fonts.
  async function useFonts(root) {
    const need = new Set(), els = [root, ...root.querySelectorAll('*')];
    for (const el of els) {
      const cs = getComputedStyle(el), f = famOf(cs.fontFamily), w = +cs.fontWeight >= 600 ? 700 : 400, it = cs.fontStyle === 'italic' || cs.fontStyle.startsWith('oblique');
      el.style.fontFamily = `'DP-${f}', 'DP-noto'`;
      el.style.fontSynthesis = 'none';
      el.style.hyphens = 'manual';
      need.add(`${f}|${w}|${it ? 1 : 0}`);
    }
    await Promise.all([...need].map(k => { const [f, w, it] = k.split('|'); return loadFace(f, +w, it === '1'); }).concat(loadFace('noto', 400, false)));
    await document.fonts.ready;
  }

  // ---------- Reading the layout ----------
  const parseColor = s => { const m = String(s).match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return { r: p[0] / 255, g: p[1] / 255, b: p[2] / 255, a: p.length > 3 ? p[3] : 1 }; };
  // Everything drawn inside el, relative to `origin` (a DOMRect), in CSS pixels.
  function collect(el, origin, zone) {
    const items = [], ox = origin.left, oy = origin.top;
    const decoCache = new Map();
    const deco = e => {
      if (decoCache.has(e)) return decoCache.get(e);
      let u = null, s = null;
      for (let p = e; p && p !== el.parentElement; p = p.parentElement) {
        const cs = getComputedStyle(p), d = cs.textDecorationLine || '';
        if (!u && d.includes('underline')) u = parseColor(cs.textDecorationColor) || parseColor(cs.color);
        if (!s && d.includes('line-through')) s = parseColor(cs.textDecorationColor) || parseColor(cs.color);
        if (/^(block|table-cell|list-item|flex)$/.test(cs.display)) break;
      }
      const r = { u, s }; decoCache.set(e, r); return r;
    };
    const boxes = [el, ...el.querySelectorAll('*')];
    for (const e of boxes) {
      const cs = getComputedStyle(e);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const box = { x: r.left - ox, y: r.top - oy, w: r.width, h: r.height, zone };
      const bg = parseColor(cs.backgroundColor);
      if (bg && bg.a > 0.01 && e !== el) items.push({ kind: 'fill', ...box, color: bg });
      for (const [side, x0, y0, x1, y1] of [['Top', 0, 0, 1, 0], ['Right', 1, 0, 1, 1], ['Bottom', 0, 1, 1, 1], ['Left', 0, 0, 0, 1]]) {
        const w = parseFloat(cs[`border${side}Width`]), st = cs[`border${side}Style`], c = parseColor(cs[`border${side}Color`]);
        if (w > 0 && st !== 'none' && st !== 'hidden' && c && c.a > 0.01) {
          const inset = side === 'Top' || side === 'Left' ? w / 2 : -w / 2;
          const horiz = side === 'Top' || side === 'Bottom';
          items.push({ kind: 'line', zone, x1: box.x + x0 * box.w + (horiz ? 0 : inset), y1: box.y + y0 * box.h + (horiz ? inset : 0), x2: box.x + x1 * box.w + (horiz ? 0 : inset), y2: box.y + y1 * box.h + (horiz ? inset : 0), width: w, color: c, dash: st === 'dashed' ? [w * 3, w * 2] : st === 'dotted' ? [w, w * 1.5] : null, y: box.y + y0 * box.h, h: (y1 - y0) * box.h });
        }
      }
      if (e.tagName === 'IMG' && e.complete && e.naturalWidth) items.push({ kind: 'img', ...box, img: e });
      if (e.tagName === 'svg' || e.tagName === 'CANVAS') items.push({ kind: 'raster', ...box, node: e });
    }
    // Text, word by word, at the place the browser put it.
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      const s = t.data;
      if (!s.trim()) continue;
      const pe = t.parentElement, cs = getComputedStyle(pe);
      if (cs.visibility === 'hidden' || pe.closest('svg')) continue;
      const color = parseColor(cs.color) || { r: 0, g: 0, b: 0, a: 1 };
      const size = parseFloat(cs.fontSize), weight = +cs.fontWeight >= 600 ? 700 : 400, italic = cs.fontStyle !== 'normal', fam = famOf(cs.fontFamily), d = deco(pe);
      const re = /\S+/g;
      let m;
      while ((m = re.exec(s))) {
        range.setStart(t, m.index); range.setEnd(t, m.index + m[0].length);
        const rects = [...range.getClientRects()].filter(r => r.width > 0);
        const push = (text, r) => items.push({ kind: 'text', zone, text, x: r.left - ox, y: r.top - oy, w: r.width, h: r.height, size, weight, italic, fam, color, u: d.u, s: d.s });
        if (rects.length === 1) push(m[0], rects[0]);
        else for (let i = 0; i < m[0].length; i++) { range.setStart(t, m.index + i); range.setEnd(t, m.index + i + 1); const r = range.getClientRects()[0]; if (r && r.width) push(m[0][i], r); }
      }
      // Underline and strike-through also run under the spaces between words.
      if (d.u || d.s) {
        range.selectNodeContents(t);
        for (const r of range.getClientRects()) if (r.width) items.push({ kind: 'deco', zone, x: r.left - ox, y: r.top - oy, w: r.width, h: r.height, size, u: d.u, s: d.s });
      }
    }
    return items;
  }

  // Words on the same line in the same style, with ordinary spaces between them, become one run of text,
  // so copied text reads normally. Justified lines (wide spaces) keep their words apart.
  function joinWords(items) {
    const out = [], ctx = document.createElement('canvas').getContext('2d');
    let run = null;
    for (const it of items) {
      if (it.kind !== 'text') { out.push(it); continue; }
      if (run && run.zone === it.zone && Math.abs(run.y - it.y) < 0.6 && Math.abs(run.h - it.h) < 0.6 && run.size === it.size && run.weight === it.weight && run.italic === it.italic && run.fam === it.fam && run.u === it.u && run.s === it.s &&
        run.color.r === it.color.r && run.color.g === it.color.g && run.color.b === it.color.b && run.color.a === it.color.a) {
        ctx.font = `${it.italic ? 'italic ' : ''}${it.weight} ${it.size}px 'DP-${it.fam}'`;
        const gap = it.x - (run.x + run.w), space = ctx.measureText(' ').width;
        if (gap > space * 0.6 && gap < space * 1.5) { run.text += ' ' + it.text; run.w = it.x + it.w - run.x; continue; }
      }
      run = { ...it }; out.push(run);
    }
    return out;
  }

  // ---------- Pages ----------
  // Where to cut a long page: never through a line of text or a picture.
  function cuts(items, top, bottom, height) {
    const solid = items.filter(i => i.kind === 'text' || i.kind === 'img' || i.kind === 'raster').map(i => [i.y, i.y + i.h]).filter(([a, b]) => b - a < height * 0.9);
    const out = [];
    let start = top;
    while (bottom - start > 1) {
      let cut = start + height;
      if (cut >= bottom) { out.push([start, bottom]); break; }
      for (let pass = 0; pass < 50; pass++) {
        const hit = solid.filter(([a, b]) => a < cut - 0.5 && b > cut + 0.5);
        if (!hit.length) break;
        const c2 = Math.min(...hit.map(h => h[0]));
        if (c2 <= start + 1) break; // taller than a page: cut through it
        cut = c2;
      }
      out.push([start, cut]); start = cut;
    }
    return out;
  }

  // ---------- Drawing ----------
  async function render(pages, { onProgress, title } = {}) {
    const { PDFDocument, rgb, LineCapStyle } = PDFLib;
    const pdf = await PDFDocument.create();
    pdf.registerFontkit(fontkit);
    if (title) pdf.setTitle(title);
    pdf.setProducer('TidyFigure'); pdf.setCreator('TidyFigure');
    const fonts = {}, fk = {};
    const font = async (f, w, it) => {
      const k = `${f}-${w}-${it ? 'i' : 'n'}`;
      if (!fonts[k]) { fonts[k] = await pdf.embedFont(await fontData(f, w, it), { subset: true }); fk[k] = fonts[k].embedder.font; }
      return k;
    };
    const imgCache = new Map();
    const embedImg = async node => {
      if (imgCache.has(node)) return imgCache.get(node);
      // JPEG and PNG pictures go in as they are (same quality, smaller file); anything else is redrawn as PNG.
      if (node.tagName === 'IMG' && node.currentSrc) {
        try {
          const b = new Uint8Array(await (await fetch(node.currentSrc)).arrayBuffer());
          const emb = b[0] === 0xFF && b[1] === 0xD8 ? await pdf.embedJpg(b) : b[0] === 0x89 && b[1] === 0x50 ? await pdf.embedPng(b) : null;
          if (emb) { imgCache.set(node, emb); return emb; }
        } catch (e) { /* redraw it below */ }
      }
      const c = document.createElement('canvas'), w = node.naturalWidth || node.width?.baseVal?.value || node.clientWidth, h = node.naturalHeight || node.height?.baseVal?.value || node.clientHeight;
      const k = Math.min(1, 2400 / Math.max(w, h));
      c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
      let src = node;
      if (node.tagName === 'svg') { const u = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(node)], { type: 'image/svg+xml' })); src = await new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = u; }); }
      if (!src) return null;
      try { c.getContext('2d').drawImage(src, 0, 0, c.width, c.height); } catch (e) { return null; }
      let emb;
      try { emb = await pdf.embedPng(new Uint8Array(await (await canvasBlob(c, 'image/png')).arrayBuffer())); } catch (e) { emb = null; }
      imgCache.set(node, emb);
      return emb;
    };
    let done = 0;
    for (const pg of pages) {
      const { el, w, h, pad, header, footer } = pg, origin = el.getBoundingClientRect();
      const kpt = pg.ptPerPx || 0.75, all = joinWords(collect(el, origin, 'body'));
      const inZone = (z, it) => z && it.y >= z.top - origin.top - 0.5 && it.y + (it.h || 0) <= z.bottom - origin.top + 0.5;
      const hz = header && header.getBoundingClientRect(), fz = footer && footer.getBoundingClientRect();
      all.forEach(it => { if (inZone(hz, it)) it.zone = 'head'; else if (inZone(fz, it)) it.zone = 'foot'; });
      const body = all.filter(i => i.zone === 'body');
      const fullH = origin.height, contentTop = pad[0], contentBottom = Math.max(fullH - pad[2] - (fz ? fz.height : 0), contentTop + 1);
      const slices = fullH <= h + 2 ? [[0, fullH]] : cuts(body, contentTop, Math.max(contentBottom, ...body.map(i => i.y + (i.h || 0))), h - pad[0] - pad[2]);
      for (let si = 0; si < slices.length; si++) {
        // Page 1 keeps everything above its first cut (titles can start in the top margin); later pages
        // start at their cut, moved down to the top margin.
        const single = slices.length === 1, a = si === 0 ? -1e9 : slices[si][0], b = slices[si][1], off = si === 0 ? 0 : slices[si][0] - pad[0];
        const page = pdf.addPage([w * kpt, h * kpt]), H = h * kpt;
        // Map a y on the long page to this PDF page; headers repeat at the top, footers at the bottom.
        const map = it => (single ? it.y : it.zone === 'head' ? it.y : it.zone === 'foot' ? h - (fullH - it.y) : it.y - off);
        const show = it => single || it.zone !== 'body' || (it.y + (it.h || 0) > a + 0.5 && it.y < b - 0.5 && (it.kind === 'fill' || it.kind === 'line' || (it.y >= a - 0.5)));
        const clipY = (y, hh, it) => { if (single || it.zone !== 'body') return [y, hh]; const top = Math.max(it.y, a), bot = Math.min(it.y + hh, b); return [top - off, bot - top]; };
        for (const it of all.filter(show)) {
          if (it.kind === 'fill') {
            const [y, hh] = clipY(map(it), it.h, it);
            if (hh <= 0) continue;
            page.drawRectangle({ x: it.x * kpt, y: H - (y + hh) * kpt, width: it.w * kpt, height: hh * kpt, color: rgb(it.color.r, it.color.g, it.color.b), opacity: it.color.a });
          }
        }
        for (const it of all.filter(show)) {
          if (it.kind === 'line') {
            let y1 = it.y1, y2 = it.y2;
            if (!single && it.zone === 'body') { y1 = Math.min(Math.max(y1, a), b) - off; y2 = Math.min(Math.max(y2, a), b) - off; }
            else if (it.zone === 'foot') { y1 = h - (fullH - y1); y2 = h - (fullH - y2); }
            if (Math.abs(y2 - y1) < 0.01 && Math.abs(it.x2 - it.x1) < 0.01) continue;
            page.drawLine({ start: { x: it.x1 * kpt, y: H - y1 * kpt }, end: { x: it.x2 * kpt, y: H - y2 * kpt }, thickness: it.width * kpt, color: rgb(it.color.r, it.color.g, it.color.b), opacity: it.color.a, dashArray: it.dash ? it.dash.map(v => v * kpt) : undefined, lineCap: LineCapStyle.Butt });
          } else if (it.kind === 'img' || it.kind === 'raster') {
            const im = await embedImg(it.img || it.node);
            if (im) page.drawImage(im, { x: it.x * kpt, y: H - (map(it) + it.h) * kpt, width: it.w * kpt, height: it.h * kpt });
          }
        }
        for (const it of all.filter(show)) {
          if (it.kind === 'text') {
            const it2 = it.italic && it.fam !== 'noto', key = await font(it.fam, it.weight, it2);
            let k = key, ff = fk[key];
            if ([...it.text].some(ch => !ff.hasGlyphForCodePoint(ch.codePointAt(0)))) { k = await font('noto', 400, false); ff = fk[k]; }
            const asc = ff.ascent, desc = ff.descent, base = map(it) + it.h * asc / (asc - desc);
            const size = it.size * kpt, f = fonts[k];
            // Squeeze or stretch slightly so the word fills exactly the width the browser gave it.
            let text = it.text;
            text = [...text].filter(ch => ff.hasGlyphForCodePoint(ch.codePointAt(0)) || /\s/.test(ch)).join('');
            if (!text) continue;
            const natural = f.widthOfTextAtSize(text, size), want = it.w * kpt;
            const opts = { x: it.x * kpt, y: H - base * kpt, size, font: f, color: rgb(it.color.r, it.color.g, it.color.b), opacity: it.color.a };
            if (natural > 0 && Math.abs(natural - want) / natural > 0.02 && text.length > 1) {
              page.pushOperators(PDFLib.pushGraphicsState(), PDFLib.concatTransformationMatrix(want / natural, 0, 0, 1, opts.x * (1 - want / natural), 0));
              page.drawText(text, opts);
              page.pushOperators(PDFLib.popGraphicsState());
            } else page.drawText(text, opts);
          } else if (it.kind === 'deco') {
            const y = map(it), line = (c, at) => page.drawLine({ start: { x: it.x * kpt, y: H - (y + it.h * at) * kpt }, end: { x: (it.x + it.w) * kpt, y: H - (y + it.h * at) * kpt }, thickness: Math.max(0.5, it.size * 0.06 * kpt), color: rgb(c.r, c.g, c.b) });
            if (it.u) line(it.u, 0.9);
            if (it.s) line(it.s, 0.55);
          }
        }
        done++;
        if (onProgress) onProgress(done);
      }
    }
    return pdf.save();
  }
  async function prepare(root) { pseudoToText(root); await useFonts(root); }
  return { prepare, render, famOf };
})();
