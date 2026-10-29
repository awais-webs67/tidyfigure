'use strict';
// Reads a PDF page the way people see it, for the converters (PDF to Word, Excel, PowerPoint):
// text lines with their fonts and positions (in reading order, left column before right column) and the
// pictures on the page. Needs pdf.js. Coordinates are in points from the page's top-left corner.
const PdfRead = (() => {
  const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
  const BOLD = /bold|black|heavy|semibold|demibold|demi\b|extrabold|ultrabold/i, ITALIC = /italic|oblique|ital\b/i;
  // "ABCDEF+Calibri-BoldItalic" -> "Calibri"
  function family(raw) {
    let f = String(raw || '').replace(/^[A-Z]{6}\+/, '').replace(/[-,](bold|italic|oblique|regular|roman|medium|light|semibold|black|heavy|book|demi|mt|ps)+.*$/i, '').replace(/(MT|PS|PSMT)$/, '').replace(/([a-z])([A-Z])/g, '$1 $2').trim();
    if (/^times/i.test(f)) f = 'Times New Roman';
    else if (/^(helvetica|arial)/i.test(f)) f = 'Arial';
    else if (/^courier/i.test(f)) f = 'Courier New';
    else if (/^symbol|dingbat/i.test(f) || !f || /^g_?d\d|^f\d+$|^t\d+$/i.test(f)) f = '';
    return f;
  }
  async function readPage(doc, n, { images = true } = {}) {
    const pg = await doc.getPage(n), vp = pg.getViewport({ scale: 1 });
    const ops = await pg.getOperatorList(); // also loads the fonts, so their names can be read
    const tc = await pg.getTextContent();
    const fonts = {};
    const font = id => {
      if (fonts[id]) return fonts[id];
      let f = {};
      try { f = pg.commonObjs.get(id) || {}; } catch (e) { /* not loaded */ }
      const raw = f.name || f.loadedName || '';
      return (fonts[id] = { family: family(raw) || (tc.styles[id] && /serif/i.test(tc.styles[id].fontFamily) && !/sans/i.test(tc.styles[id].fontFamily) ? 'Times New Roman' : ''), bold: BOLD.test(raw) || f.bold === true || (f.black === true), italic: ITALIC.test(raw) || f.italic === true });
    };
    // Text pieces, upright only.
    const items = [];
    for (const it of tc.items) {
      if (!it.str) continue;
      it.str = it.str.replace(/[\uF0B7\uF0A7\uF0D8\uF076\uF0FC\uF0A8\uF06C\uF06E\uF0E0\uF0F0]/g, '•'); // Symbol and Wingdings bullets
      const m = pdfjsLib.Util.transform(vp.transform, it.transform);
      if (Math.abs(m[1]) > 0.01 * Math.abs(m[0]) || Math.abs(m[2]) > 0.01 * Math.abs(m[3])) continue;
      const size = Math.abs(m[3]) || Math.abs(m[0]);
      if (size < 1) continue;
      const f = font(it.fontName);
      items.push({ s: it.str, x: m[4], base: m[5], w: it.width * vp.scale, size: Math.round(size * 2) / 2, ...f });
    }
    // Two columns: a clear vertical gap near the middle that no text crosses, with text on both sides.
    const W = vp.width, cover = new Uint8Array(Math.ceil(W));
    items.forEach(t => { if (t.s.trim()) for (let x = Math.max(0, Math.floor(t.x)); x < Math.min(W, t.x + t.w); x++) cover[x] = 1; });
    let split = null;
    for (let x = Math.floor(W * 0.35), run = 0; x < W * 0.65; x++) {
      run = cover[x] ? 0 : run + 1;
      if (run >= W * 0.015) { split = x - run / 2; }
      if (split && cover[x]) break;
    }
    if (split) {
      const L = items.filter(t => t.x + t.w <= split).length, R = items.filter(t => t.x >= split).length;
      if (L < items.length * 0.25 || R < items.length * 0.25) split = null;
    }
    const column = t => (split && t.x >= split ? 1 : 0);
    // Lines: pieces on the same baseline in the same column, joined left to right into runs of one style.
    items.sort((a, b) => column(a) - column(b) || a.base - b.base || a.x - b.x);
    const lines = [];
    for (const it of items) {
      const l = lines.find(L => L.col === column(it) && Math.abs(L.base - it.base) < Math.max(L.size, it.size) * 0.4 && it.x >= L.x0 - 1);
      if (l) { l.parts.push(it); l.size = Math.max(l.size, it.size); } else lines.push({ col: column(it), base: it.base, size: it.size, x0: it.x, parts: [it] });
    }
    for (const l of lines) {
      l.parts.sort((a, b) => a.x - b.x);
      const runs = [];
      let end = null;
      for (const p of l.parts) {
        const gap = end !== null && p.x - end > p.size * 0.18 && !/^\s/.test(p.s) ? ' ' : '';
        end = p.x + p.w;
        const last = runs[runs.length - 1];
        if (last && last.bold === p.bold && last.italic === p.italic && last.size === p.size && last.family === p.family) last.text += gap + p.s;
        else { if (gap && last) last.text += gap; runs.push({ text: p.s, bold: p.bold, italic: p.italic, size: p.size, family: p.family }); }
      }
      l.runs = runs.filter(r => r.text);
      // Cells: pieces separated by a wide gap, for tables.
      l.cells = [];
      let ce = null;
      for (const p of l.parts) {
        if (!p.s.trim()) continue;
        if (ce && p.x - ce.x1 <= Math.max(p.size * 1.1, 7)) { ce.text += (p.x - ce.x1 > p.size * 0.18 ? ' ' : '') + p.s; ce.x1 = p.x + p.w; ce.bold = ce.bold && p.bold; }
        else l.cells.push(ce = { x0: p.x, x1: p.x + p.w, text: p.s, bold: p.bold, size: p.size });
      }
      l.cells.forEach(c => { c.text = c.text.replace(/\s+/g, ' ').trim(); });
      l.text = runs.map(r => r.text).join('').replace(/\s+/g, ' ').trim();
      l.x0 = l.parts[0].x; l.x1 = Math.max(...l.parts.map(p => p.x + p.w));
      l.bold = l.parts.every(p => p.bold || !p.s.trim()); l.italic = l.parts.every(p => p.italic || !p.s.trim());
      delete l.parts;
    }
    const textLines = lines.filter(l => l.text);
    textLines.sort((a, b) => a.col - b.col || a.base - b.base);
    // Pictures, and small dots or squares that are bullets: follow the drawing state through the page's
    // commands to find where each image and shape is drawn.
    const pics = [], marks = [];
    {
      const O = pdfjsLib.OPS, stack = [];
      let ctm = [1, 0, 0, 1, 0, 0];
      for (let i = 0; i < ops.fnArray.length; i++) {
        const fn = ops.fnArray[i], a = ops.argsArray[i];
        if (fn === O.save) stack.push(ctm.slice());
        else if (fn === O.restore) ctm = stack.pop() || [1, 0, 0, 1, 0, 0];
        else if (fn === O.transform) ctm = mul(ctm, a);
        else if (fn === O.paintFormXObjectBegin && a && a[0]) { stack.push(ctm.slice()); ctm = mul(ctm, a[0]); }
        else if (fn === O.paintFormXObjectEnd) ctm = stack.pop() || ctm;
        else if (fn === O.constructPath && a) {
          // The shape's size from its points (pdf.js's own bounds skip curves, so a round dot looks empty).
          let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, j = 0;
          const pt = (u, v) => { x0 = Math.min(x0, u); x1 = Math.max(x1, u); y0 = Math.min(y0, v); y1 = Math.max(y1, v); };
          for (const op of a[0]) {
            const q = a[1];
            if (op === O.rectangle) { pt(q[j], q[j + 1]); pt(q[j] + q[j + 2], q[j + 1] + q[j + 3]); j += 4; }
            else if (op === O.moveTo || op === O.lineTo) { pt(q[j], q[j + 1]); j += 2; }
            else if (op === O.curveTo) { for (let t = 0; t < 6; t += 2) pt(q[j + t], q[j + t + 1]); j += 6; }
            else if (op === O.curveTo2 || op === O.curveTo3) { pt(q[j], q[j + 1]); pt(q[j + 2], q[j + 3]); j += 4; }
          }
          if (!isFinite(x0)) continue;
          const c = [[x0, y0], [x1, y1]].map(([u, v]) => vp.convertToViewportPoint(ctm[0] * u + ctm[2] * v + ctm[4], ctm[1] * u + ctm[3] * v + ctm[5]));
          const w = Math.abs(c[0][0] - c[1][0]), h = Math.abs(c[0][1] - c[1][1]);
          if (w >= 1.2 && w <= 9 && h >= 1.2 && h <= 9 && w / h > 0.6 && w / h < 1.7) marks.push({ cx: (c[0][0] + c[1][0]) / 2, cy: (c[0][1] + c[1][1]) / 2 });
        }
        else if (images && (fn === O.paintImageXObject || fn === O.paintInlineImageXObject)) {
          const corners = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([u, v]) => vp.convertToViewportPoint(ctm[0] * u + ctm[2] * v + ctm[4], ctm[1] * u + ctm[3] * v + ctm[5]));
          const xs = corners.map(c => c[0]), ys = corners.map(c => c[1]);
          const box = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
          if (box.w < 6 || box.h < 6) continue;
          const img = fn === O.paintInlineImageXObject ? a[0] : await new Promise(res => { try { pg.objs.get(a[0], res); } catch (e) { res(null); } setTimeout(() => res(null), 5000); });
          const canvas = img && toCanvas(img);
          if (canvas) pics.push({ ...box, canvas, base: box.y + box.h });
        }
      }
    }
    // A line with a small dot or square just to its left is a bullet point.
    for (const l of textLines) l.bullet = marks.some(m => m.cx < l.x0 && l.x0 - m.cx < Math.max(28, l.size * 2.5) && Math.abs(m.cy - (l.base - l.size * 0.33)) < l.size * 0.45);
    return { w: vp.width, h: vp.height, split, lines: textLines, pics, page: pg };
  }
  // pdf.js image data -> canvas.
  function toCanvas(img) {
    const w = img.width, h = img.height;
    if (!w || !h || w * h > 40e6) return null;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d');
    if (img.bitmap) { x.drawImage(img.bitmap, 0, 0); return c; }
    if (!img.data) return null;
    const d = x.createImageData(w, h), src = img.data, o = d.data;
    if (img.kind === 3) o.set(src.subarray(0, o.length));
    else if (img.kind === 2) for (let i = 0, j = 0; j < o.length; i += 3, j += 4) { o[j] = src[i]; o[j + 1] = src[i + 1]; o[j + 2] = src[i + 2]; o[j + 3] = 255; }
    else if (img.kind === 1) { const row = (w + 7) >> 3; for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) { const bit = (src[y * row + (xx >> 3)] >> (7 - (xx & 7))) & 1, j = (y * w + xx) * 4, v = bit ? 255 : 0; o[j] = o[j + 1] = o[j + 2] = v; o[j + 3] = 255; } }
    else return null;
    x.putImageData(d, 0, 0);
    return c;
  }
  // Body text size: the size most letters use.
  function bodySize(pages) {
    const count = {};
    pages.forEach(p => p.lines.forEach(l => l.runs.forEach(r => { count[r.size] = (count[r.size] || 0) + r.text.length; })));
    return +Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || 11;
  }
  // Groups a page's lines into blocks: tables (two or more lines in a row whose cells line up in columns)
  // and single lines. Each table: { rows: [[{text, bold}]], cols: [x0…], lines }.
  function blocks(lines) {
    const out = [];
    const marker = /^([•●▪◦‣∙·–\-*]|\(?\d{1,3}[.)]|[a-z][.)])$/i;
    const row = l => l.cells.length >= 2 && !l.bullet && !marker.test(l.cells[0].text);
    const aligned = (a, b) => a.cells.filter(c => b.cells.some(d => Math.abs(c.x0 - d.x0) < 8 || Math.abs(c.x1 - d.x1) < 8)).length;
    for (let i = 0; i < lines.length;) {
      const l = lines[i];
      let j = i;
      if (row(l)) {
        while (j + 1 < lines.length && lines[j + 1].col === l.col && row(lines[j + 1]) && lines[j + 1].base - lines[j].base < Math.max(lines[j].size, lines[j + 1].size) * 3 && aligned(lines[j], lines[j + 1]) >= 2) j++;
      }
      if (j > i) {
        const rowsL = lines.slice(i, j + 1), all = rowsL.flatMap(r => r.cells);
        // Columns: where text sits across all the rows (works for left, right and centred columns).
        // Very wide cells (a title across the table) don't decide the columns.
        const left = Math.min(...all.map(c => c.x0)), right = Math.max(...all.map(c => c.x1));
        const spans = all.filter(c => rowsL.length <= 2 || c.x1 - c.x0 < (right - left) * 0.45).map(c => [c.x0, c.x1]).sort((a, b) => a[0] - b[0]);
        const bands = [];
        for (const [a, b] of spans) { const last = bands[bands.length - 1]; if (last && a <= last[1] + 3) last[1] = Math.max(last[1], b); else bands.push([a, b]); }
        const cols = bands.map(b => b[0]);
        if (cols.length >= 2) {
          const rows = rowsL.map(r => { const cells = cols.map(() => ({ text: '', bold: false })); r.cells.forEach(c => { const mid = (c.x0 + c.x1) / 2; let k = bands.findIndex(b => mid >= b[0] - 3 && mid <= b[1] + 3); if (k < 0) { k = cols.length - 1; while (k > 0 && c.x0 < cols[k] - 10) k--; } cells[k].text = cells[k].text ? cells[k].text + ' ' + c.text : c.text; cells[k].bold = c.bold; }); return cells; });
          out.push({ table: true, rows, cols, bands, lines: rowsL, base: rowsL[0].base, col: l.col, x0: Math.min(...rowsL.map(r => r.x0)), x1: Math.max(...rowsL.map(r => r.x1)) });
          i = j + 1; continue;
        }
      }
      out.push({ line: l }); i++;
    }
    return out;
  }
  return { readPage, bodySize, family, toCanvas, blocks };
})();
