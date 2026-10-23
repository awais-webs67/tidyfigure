'use strict';
// PDF content engine: reads the drawing commands inside each page (text, images, shapes), so the editor can
// change text in its original font and truly delete things, then writes the commands back. Needs pdf-lib.
const PdfEngine = (() => {
  const L = typeof PDFLib !== 'undefined' ? PDFLib : require('pdf-lib');
  const { PDFName, PDFDict, PDFArray, PDFNumber, PDFRef, PDFRawStream, PDFHexString, PDFString, StandardFonts, decodePDFRawStream, StandardFontEmbedder } = L;

  // ---------- Small helpers ----------
  const latin1 = s => { const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 255; return b; };
  const concat = parts => { const n = parts.reduce((s, p) => s + p.length, 0), o = new Uint8Array(n); let k = 0; for (const p of parts) { o.set(p, k); k += p.length; } return o; };
  const num = v => { const r = Math.round(v * 10000) / 10000; return Object.is(r, -0) ? '0' : String(r); };
  const hex = bytes => '<' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('') + '>';
  const mul = (A, B) => [A[0] * B[0] + A[1] * B[2], A[0] * B[1] + A[1] * B[3], A[2] * B[0] + A[3] * B[2], A[2] * B[1] + A[3] * B[3], A[4] * B[0] + A[5] * B[2] + B[4], A[4] * B[1] + A[5] * B[3] + B[5]];
  const apply = (M, x, y) => [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]];
  const ID = [1, 0, 0, 1, 0, 0];
  const nm = o => (o instanceof PDFName ? o.decodeText() : null);
  const n = o => (o instanceof PDFNumber ? o.asNumber() : typeof o === 'number' ? o : 0);
  const look = (d, k) => (d instanceof PDFDict ? d.lookup(PDFName.of(k)) : undefined);
  const arr = o => (o instanceof PDFArray ? o.asArray().map(x => (x instanceof PDFRef ? null : x)) : []);
  function streamBytes(s) {
    if (!s) return new Uint8Array(0);
    if (s instanceof PDFRawStream) return decodePDFRawStream(s).decode();
    if (s.getUnencodedContents) return s.getUnencodedContents();
    if (s.getContents) return s.getContents();
    return new Uint8Array(0);
  }

  // ---------- Content stream tokenizer ----------
  const WS = new Set([0, 9, 10, 12, 13, 32]), DELIM = new Set([40, 41, 60, 62, 91, 93, 123, 125, 47, 37]);
  const isReg = c => !WS.has(c) && !DELIM.has(c);
  const MARK = { mark: 1 }, DMARK = { dmark: 1 };
  function lex(src) {
    const ops = [];
    let i = 0, stack = [], argStart = -1;
    const len = src.length;
    const push = (v, at) => { if (argStart < 0) argStart = at; stack.push(v); };
    while (i < len) {
      const c = src[i];
      if (WS.has(c)) { i++; continue; }
      if (c === 37) { while (i < len && src[i] !== 10 && src[i] !== 13) i++; continue; }
      const at = i;
      if (c === 40) { // (literal string)
        let depth = 1, out = []; i++;
        while (i < len && depth) {
          let ch = src[i++];
          if (ch === 92) {
            const e = src[i++];
            const map = { 110: 10, 114: 13, 116: 9, 98: 8, 102: 12, 40: 40, 41: 41, 92: 92 };
            if (e in map) out.push(map[e]);
            else if (e >= 48 && e <= 55) { let v = e - 48; for (let k = 0; k < 2 && src[i] >= 48 && src[i] <= 55; k++) v = v * 8 + src[i++] - 48; out.push(v & 255); }
            else if (e === 13) { if (src[i] === 10) i++; }
            else if (e !== 10) out.push(e);
            continue;
          }
          if (ch === 40) depth++;
          else if (ch === 41 && --depth === 0) break;
          out.push(ch);
        }
        push({ str: new Uint8Array(out) }, at); continue;
      }
      if (c === 60) {
        if (src[i + 1] === 60) { push(DMARK, at); i += 2; continue; }
        i++; let h = '';
        while (i < len && src[i] !== 62) { const ch = src[i++]; if (!WS.has(ch)) h += String.fromCharCode(ch); }
        i++;
        if (h.length % 2) h += '0';
        const b = new Uint8Array(h.length / 2); for (let k = 0; k < b.length; k++) b[k] = parseInt(h.substr(k * 2, 2), 16) || 0;
        push({ str: b, hex: true }, at); continue;
      }
      if (c === 62) { // >> end of dictionary
        i += 2; const k = stack.lastIndexOf(DMARK), items = stack.splice(k), d = {};
        for (let j = 1; j + 1 < items.length; j += 2) d[items[j].name] = items[j + 1];
        stack.push({ dict: d }); continue;
      }
      if (c === 91) { push(MARK, at); i++; continue; }
      if (c === 93) { i++; const k = stack.lastIndexOf(MARK); const items = stack.splice(k).slice(1); stack.push(items); continue; }
      if (c === 123 || c === 125) { i++; continue; }
      if (c === 47) {
        i++; let s = '';
        while (i < len && isReg(src[i])) {
          if (src[i] === 35 && i + 2 < len) { s += String.fromCharCode(parseInt(String.fromCharCode(src[i + 1], src[i + 2]), 16)); i += 3; } else s += String.fromCharCode(src[i++]);
        }
        push({ name: s }, at); continue;
      }
      let s = '';
      while (i < len && isReg(src[i])) s += String.fromCharCode(src[i++]);
      if (!s) { i++; continue; }
      if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(s)) { push(parseFloat(s), at); continue; }
      if (s === 'true' || s === 'false' || s === 'null') { push(s === 'true', at); continue; }
      if (s === 'BI') {
        // Inline image: key/value pairs up to ID, then raw data up to EI.
        const start = argStart >= 0 ? argStart : at;
        let j = i;
        while (j < len - 1 && !(src[j] === 73 && src[j + 1] === 68 && WS.has(src[j - 1]) && (WS.has(src[j + 2]) || j + 2 >= len))) j++;
        let k = j + 3;
        while (k < len - 1 && !(src[k] === 69 && src[k + 1] === 73 && WS.has(src[k - 1]) && (k + 2 >= len || WS.has(src[k + 2]) || DELIM.has(src[k + 2])))) k++;
        i = Math.min(len, k + 2);
        ops.push({ op: 'BI', args: [], s: start, e: i });
        stack = []; argStart = -1; continue;
      }
      ops.push({ op: s, args: stack.filter(v => v !== MARK && v !== DMARK), s: argStart >= 0 ? argStart : at, e: i });
      stack = []; argStart = -1;
    }
    return ops;
  }

  // ---------- Fonts ----------
  const AGL = (() => {
    const m = { space: ' ', exclam: '!', quotedbl: '"', numbersign: '#', dollar: '$', percent: '%', ampersand: '&', quotesingle: "'", quoteright: '’', quoteleft: '‘', parenleft: '(', parenright: ')', asterisk: '*', plus: '+', comma: ',', hyphen: '-', minus: '−', period: '.', slash: '/', colon: ':', semicolon: ';', less: '<', equal: '=', greater: '>', question: '?', at: '@', bracketleft: '[', backslash: '\\', bracketright: ']', asciicircum: '^', underscore: '_', grave: '`', braceleft: '{', bar: '|', braceright: '}', asciitilde: '~',
      zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9',
      quotedblleft: '“', quotedblright: '”', quotesinglbase: '‚', quotedblbase: '„', endash: '–', emdash: '—', bullet: '•', ellipsis: '…', fi: 'ﬁ', fl: 'ﬂ', ff: 'ﬀ', ffi: 'ﬃ', ffl: 'ﬄ', dagger: '†', daggerdbl: '‡', section: '§', paragraph: '¶', copyright: '©', registered: '®', trademark: '™', degree: '°', plusminus: '±', multiply: '×', divide: '÷', periodcentered: '·', guillemotleft: '«', guillemotright: '»', guilsinglleft: '‹', guilsinglright: '›', Euro: '€', sterling: '£', yen: '¥', cent: '¢', florin: 'ƒ', dotlessi: 'ı', germandbls: 'ß', ae: 'æ', AE: 'Æ', oslash: 'ø', Oslash: 'Ø', eth: 'ð', Eth: 'Ð', thorn: 'þ', Thorn: 'Þ', oe: 'œ', OE: 'Œ', lslash: 'ł', Lslash: 'Ł', mu: 'µ', ordfeminine: 'ª', ordmasculine: 'º', exclamdown: '¡', questiondown: '¿', brokenbar: '¦', currency: '¤', logicalnot: '¬', macron: '¯', onehalf: '½', onequarter: '¼', threequarters: '¾', onesuperior: '¹', twosuperior: '²', threesuperior: '³', nbspace: ' ', nonbreakingspace: ' ', sfthyphen: '­', perthousand: '‰', circumflex: 'ˆ', tilde: '˜', dieresis: '¨', acute: '´', cedilla: '¸', ring: '˚' };
    for (let c = 65; c <= 90; c++) { m[String.fromCharCode(c)] = String.fromCharCode(c); m[String.fromCharCode(c + 32)] = String.fromCharCode(c + 32); }
    const acc = { acute: '́', grave: '̀', circumflex: '̂', dieresis: '̈', tilde: '̃', ring: '̊', cedilla: '̧', caron: '̌' };
    for (const base of 'aeiouyncszAEIOUYNCSZ') for (const [a, comb] of Object.entries(acc)) { const ch = (base + comb).normalize('NFC'); if (ch.length === 1) m[base + a] = ch; }
    return m;
  })();
  const AGL_REV = Object.fromEntries(Object.entries(AGL).map(([k, v]) => [v, k]));
  const glyphUni = g => AGL[g] ?? (/^uni([0-9A-F]{4})/i.test(g) ? String.fromCharCode(parseInt(g.slice(3, 7), 16)) : /^u([0-9A-F]{4,6})$/i.test(g) ? String.fromCodePoint(parseInt(g.slice(1), 16)) : null);
  const decoders = {};
  const decodeByte = (enc, c) => {
    if (enc === 'MacRomanEncoding') { try { decoders.mac ??= new TextDecoder('macintosh'); return decoders.mac.decode(new Uint8Array([c])); } catch (e) { /* no decoder */ } }
    if (enc === 'StandardEncoding') { if (c === 0x27) return '’'; if (c === 0x60) return '‘'; if (c < 128) return String.fromCharCode(c); }
    decoders.win ??= new TextDecoder('windows-1252');
    return decoders.win.decode(new Uint8Array([c]));
  };
  function parseCMap(bytes, map) {
    const s = String.fromCharCode.apply(null, bytes.length > 65536 ? Array.from(bytes) : bytes);
    const u16 = h => { let out = ''; for (let i = 0; i + 4 <= h.length; i += 4) out += String.fromCharCode(parseInt(h.substr(i, 4), 16)); if (h.length === 2) out = String.fromCharCode(parseInt(h, 16)); return out; };
    for (const blk of s.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) for (const m of blk[1].matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]*)>/g)) map.set(parseInt(m[1], 16), u16(m[2]));
    for (const blk of s.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
      for (const m of blk[1].matchAll(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*(<([0-9a-fA-F]*)>|\[([^\]]*)\])/g)) {
        const lo = parseInt(m[1], 16), hi = parseInt(m[2], 16);
        if (hi - lo > 65535) continue;
        if (m[4] !== undefined) {
          const base = m[4], last = parseInt(base.slice(-4) || base, 16), prefix = u16(base.slice(0, -4));
          for (let c = lo; c <= hi; c++) map.set(c, base.length <= 4 ? String.fromCharCode(parseInt(base, 16) + c - lo) : prefix + String.fromCharCode(last + c - lo));
        } else {
          const list = [...m[5].matchAll(/<([0-9a-fA-F]*)>/g)].map(x => u16(x[1]));
          for (let c = lo; c <= hi && c - lo < list.length; c++) map.set(c, list[c - lo]);
        }
      }
    }
    return map;
  }
  const STD = { Helvetica: 'Helvetica', Arial: 'Helvetica', ArialMT: 'Helvetica', 'Times-Roman': 'TimesRoman', Times: 'TimesRoman', TimesNewRoman: 'TimesRoman', TimesNewRomanPSMT: 'TimesRoman', Courier: 'Courier', CourierNew: 'Courier', CourierNewPSMT: 'Courier' };
  function stdKey(family, bold, italic) {
    const b = { sans: 'Helvetica', serif: 'TimesRoman', mono: 'Courier' }[family] || 'Helvetica';
    const suffix = bold && italic ? (b === 'TimesRoman' ? 'BoldItalic' : 'BoldOblique') : bold ? 'Bold' : italic ? (b === 'TimesRoman' ? 'Italic' : 'Oblique') : '';
    return b + suffix;
  }
  function fontInfo(fd) {
    const sub = nm(look(fd, 'Subtype')) || 'Type1';
    const base = nm(look(fd, 'BaseFont')) || '';
    const clean = base.replace(/^[A-Z]{6}\+/, '');
    const type0 = sub === 'Type0';
    const desc = type0 ? (look(fd, 'DescendantFonts') instanceof PDFArray ? look(fd, 'DescendantFonts').lookup(0) : null) : fd;
    const fdesc = look(desc, 'FontDescriptor');
    const flags = n(look(fdesc, 'Flags'));
    let ascent = n(look(fdesc, 'Ascent')) / 1000, descent = n(look(fdesc, 'Descent')) / 1000;
    if (!(ascent > 0.4 && ascent < 1.3)) ascent = 0.78;
    if (!(descent < 0 && descent > -0.6)) descent = -0.22;
    const fm = sub === 'Type3' ? arr(look(fd, 'FontMatrix')).map(n) : null;
    const scale = fm ? fm[0] * 1000 || 1 : 1;
    const info = { sub, base: clean, subset: /^[A-Z]{6}\+/.test(base), type0, codeLen: type0 ? 2 : 1, ascent, descent };
    info.bold = /bold|black|heavy|semibold|demi|medi(um)?\b|-sb|-bd\b|bd$/i.test(clean) || !!(flags & 262144);
    info.italic = /italic|oblique|-it\b|it$|-bdit/i.test(clean) || !!(flags & 64);
    info.family = /mono|courier|consol|menlo|typewriter|sftt|cmtt|fixed/i.test(clean) || flags & 1 ? 'mono' : /times|serif|roman|georgia|garamond|cambria|book|minion|palatino|nimbusrom|baskerville|caslon|didot|bodoni|cmr|sfrm|merriweather|tinos/i.test(clean) && !/sans/i.test(clean) || (flags & 2 && !/sans|arial|helvet|calibri|verdana|tahoma|segoe|inter|roboto|open/i.test(clean)) ? 'serif' : 'sans';
    // Widths in 1/1000 em.
    const W = new Map();
    let dflt = 0;
    if (type0) {
      dflt = look(desc, 'DW') ? n(look(desc, 'DW')) : 1000;
      const w = arr(look(desc, 'W'));
      for (let i = 0; i < w.length;) {
        const a = n(w[i]);
        if (w[i + 1] instanceof PDFArray) { arr(w[i + 1]).forEach((v, k) => W.set(a + k, n(v))); i += 2; }
        else { const b = n(w[i + 1]), v = n(w[i + 2]); for (let c = a; c <= b && c - a < 65536; c++) W.set(c, v); i += 3; }
      }
    } else {
      const first = n(look(fd, 'FirstChar'));
      arr(look(fd, 'Widths')).forEach((v, k) => W.set(first + k, n(v) * scale));
      dflt = n(look(fdesc, 'MissingWidth')) * scale;
    }
    // Code -> text.
    const toU = new Map();
    const tu = look(fd, 'ToUnicode');
    if (tu && !(tu instanceof PDFName)) { try { parseCMap(streamBytes(tu), toU); } catch (e) { /* bad CMap */ } }
    const enc = look(fd, 'Encoding');
    let encName = enc instanceof PDFName ? nm(enc) : nm(look(enc, 'BaseEncoding'));
    const diffs = new Map();
    if (enc instanceof PDFDict) {
      let code = 0;
      for (const v of arr(look(enc, 'Differences'))) { if (v instanceof PDFNumber) code = v.asNumber(); else if (v instanceof PDFName) diffs.set(code++, nm(v)); }
    }
    const symbolic = !!(flags & 4) && !encName;
    if (!encName && !type0) encName = symbolic || sub === 'Type3' ? null : 'WinAnsiEncoding';
    info.uni = code => {
      if (toU.has(code)) return toU.get(code);
      if (type0) return '';
      if (diffs.has(code)) return glyphUni(diffs.get(code)) ?? '';
      if (encName) return decodeByte(encName, code);
      return code >= 32 && code < 127 ? String.fromCharCode(code) : '';
    };
    // Standard 14 fonts often come without widths: measure them with pdf-lib's built-in metrics.
    let std = null;
    if (!W.size && !type0 && sub === 'Type1') {
      const k = STD[clean.replace(/[-,](Bold|Italic|Oblique|BoldItalic|BoldOblique)$/i, '')] ? stdKey(info.family, info.bold, info.italic) : null;
      try { if (k && StandardFontEmbedder) std = StandardFontEmbedder.for(StandardFonts[k]); } catch (e) { std = null; }
    }
    info.width = code => {
      if (W.has(code)) return W.get(code);
      if (std) { try { return std.widthOfTextAtSize(info.uni(code) || ' ', 1000); } catch (e) { return 500; } }
      return dflt || (type0 ? 1000 : 500);
    };
    // Text -> code, only for letters the embedded font really contains.
    const charset = (look(fdesc, 'CharSet') instanceof PDFString || look(fdesc, 'CharSet') instanceof PDFHexString) ? new Set(look(fdesc, 'CharSet').decodeText().split('/').filter(Boolean)) : null;
    const rev = new Map();
    if (toU.size) { for (const [c, s] of toU) if (s && !rev.has(s) && (W.has(c) || !W.size || type0)) rev.set(s, c); }
    else if (!type0) {
      for (let c = 32; c < 256; c++) {
        const u = info.uni(c);
        if (!u || rev.has(u)) continue;
        const gname = diffs.get(c) || AGL_REV[u];
        if (info.subset && charset && !charset.has(gname)) continue;
        if (info.subset && !charset) continue; // filled from letters seen in the document instead
        rev.set(u, c);
      }
    }
    info.seen = code => { if (!toU.size && !type0 && info.subset && !charset) { const u = info.uni(code); if (u && !rev.has(u)) rev.set(u, code); } };
    info.codeFor = ch => (rev.has(ch) ? rev.get(ch) : null);
    info.bytes = code => (info.codeLen === 2 ? [code >> 8 & 255, code & 255] : [code & 255]);
    info.hasSpace = rev.has(' ');
    return info;
  }

  const MARKER = '% tf-edit\n';

  // ---------- Engine ----------
  async function load(pdf) {
    const ctx = pdf.context, pages = pdf.getPages();
    const fontCache = new Map(); // font dict -> info
    const conts = new Map();     // key -> container
    let version = 0;
    const fontOf = fd => { if (!fontCache.has(fd)) fontCache.set(fd, fontInfo(fd)); return fontCache.get(fd); };

    function pageContainer(i) {
      const key = 'p' + i;
      if (!conts.has(key)) {
        const node = pages[i].node;
        const c = node.Contents();
        let parts = [];
        if (c instanceof PDFArray) for (let k = 0; k < c.size(); k++) parts.push(streamBytes(c.lookup(k)), latin1('\n'));
        else if (c) parts.push(streamBytes(c));
        conts.set(key, { key, kind: 'page', i, src: concat(parts), res: node.Resources() });
      }
      return conts.get(key);
    }
    function formContainer(ref, stream, parentRes) {
      const key = 'r' + ref.toString();
      if (!conts.has(key)) conts.set(key, { key, kind: 'form', ref, src: streamBytes(stream), res: look(stream.dict, 'Resources') || parentRes, dict: stream.dict });
      return conts.get(key);
    }
    const opsOf = c => { if (c.opsSrc !== c.src) { c.ops = lex(c.src); c.opsSrc = c.src; } return c.ops; };

    // Walks a container's commands, collecting glyphs, shapes and images in page coordinates.
    function walk(c, base, model, depth) {
      const ops = opsOf(c);
      model.keys.add(c.key);
      const res = c.res;
      const fonts = look(res, 'Font'), xobjs = look(res, 'XObject'), cspaces = look(res, 'ColorSpace');
      let gs = { ctm: ID, fill: '0 g', rgb: [0, 0, 0], cs: null, csN: 1, font: null, fname: null, size: 0, Tc: 0, Tw: 0, Th: 1, TL: 0, Ts: 0, Tr: 0, lw: 1 };
      const stack = [];
      let Tm = ID, Tlm = ID, path = [], pathStart = -1, clip = false;
      const abs = () => mul(gs.ctm, base);
      const csComps = name => {
        if (name === 'DeviceRGB' || name === 'CalRGB') return 3;
        if (name === 'DeviceCMYK') return 4;
        if (name === 'DeviceGray' || name === 'CalGray') return 1;
        const cs = look(cspaces, name);
        if (cs instanceof PDFArray) {
          const kind = nm(cs.lookup(0));
          if (kind === 'ICCBased') return n(look(cs.lookup(1).dict, 'N')) || 3;
          return csComps(kind);
        }
        return cs instanceof PDFName ? csComps(nm(cs)) : 0;
      };
      const toRgb = v => (v.length === 1 ? [v[0], v[0], v[0]] : v.length === 3 ? v : v.length === 4 ? [(1 - v[0]) * (1 - v[3]), (1 - v[1]) * (1 - v[3]), (1 - v[2]) * (1 - v[3])] : [0, 0, 0]);
      const raw = op => String.fromCharCode.apply(null, c.src.subarray(op.s, op.e));
      for (let k = 0; k < ops.length; k++) {
        const { op, args } = ops[k];
        switch (op) {
          case 'q': stack.push({ ...gs }); break;
          case 'Q': if (stack.length) gs = stack.pop(); break;
          case 'cm': if (args.length === 6) gs.ctm = mul(args, gs.ctm); break;
          case 'w': gs.lw = +args[0] || 0; break;
          case 'g': case 'rg': case 'k': gs.fill = raw(ops[k]); gs.cs = null; gs.rgb = toRgb(args.map(Number)); break;
          case 'cs': gs.cs = raw(ops[k]); gs.csN = csComps(args[0] && args[0].name); gs.rgb = [0, 0, 0]; gs.fill = gs.cs; break;
          case 'sc': case 'scn': gs.fill = (gs.cs ? gs.cs + ' ' : '') + raw(ops[k]); { const v = args.filter(a => typeof a === 'number'); if (v.length && gs.csN && v.length === gs.csN) gs.rgb = toRgb(v); } break;
          case 'BT': Tm = Tlm = ID; break;
          case 'Tf': gs.fname = args[0] && args[0].name; gs.size = +args[1] || 0; { const fd = look(fonts, gs.fname); gs.font = fd instanceof PDFDict ? fontOf(fd) : null; } break;
          case 'Tc': gs.Tc = +args[0] || 0; break;
          case 'Tw': gs.Tw = +args[0] || 0; break;
          case 'Tz': gs.Th = (+args[0] || 0) / 100; break;
          case 'TL': gs.TL = +args[0] || 0; break;
          case 'Ts': gs.Ts = +args[0] || 0; break;
          case 'Tr': gs.Tr = +args[0] || 0; break;
          case 'Td': Tlm = mul([1, 0, 0, 1, +args[0] || 0, +args[1] || 0], Tlm); Tm = Tlm; break;
          case 'TD': gs.TL = -(+args[1] || 0); Tlm = mul([1, 0, 0, 1, +args[0] || 0, +args[1] || 0], Tlm); Tm = Tlm; break;
          case 'Tm': if (args.length === 6) Tlm = Tm = args.map(Number); break;
          case 'T*': Tlm = mul([1, 0, 0, 1, 0, -gs.TL], Tlm); Tm = Tlm; break;
          case "'": case '"': case 'Tj': case 'TJ': {
            if (op === '"') { gs.Tw = +args[0] || 0; gs.Tc = +args[1] || 0; }
            if (op === "'" || op === '"') { Tlm = mul([1, 0, 0, 1, 0, -gs.TL], Tlm); Tm = Tlm; }
            const parts = op === 'TJ' ? (Array.isArray(args[0]) ? args[0] : []) : [args[args.length - 1]];
            const f = gs.font;
            if (!f) break;
            const style = { key: c.key, fname: gs.fname, font: f, size: gs.size, Tc: gs.Tc, Tw: gs.Tw, Th: gs.Th, Ts: gs.Ts, Tr: gs.Tr, ctm: gs.ctm, fill: gs.fill, rgb: gs.rgb };
            const A = abs();
            let gi = 0;
            for (const p of parts) {
              if (typeof p === 'number') { Tm = mul([1, 0, 0, 1, -p / 1000 * gs.size * gs.Th, 0], Tm); continue; }
              if (!p || !p.str) continue;
              const b = p.str;
              for (let j = 0; j + f.codeLen <= b.length; j += f.codeLen) {
                const code = f.codeLen === 2 ? b[j] << 8 | b[j + 1] : b[j];
                f.seen(code);
                const w0 = f.width(code) / 1000;
                const Trm = mul(mul([gs.size * gs.Th, 0, 0, gs.size, 0, gs.Ts], Tm), A);
                const isSp = f.codeLen === 1 && code === 32;
                const adv = (w0 * gs.size + gs.Tc + (isSp ? gs.Tw : 0)) * gs.Th;
                const uni = f.uni(code);
                const ex = Math.max(w0, 0.01);
                const poly = [apply(Trm, 0, f.descent), apply(Trm, ex, f.descent), apply(Trm, ex, f.ascent), apply(Trm, 0, f.ascent)];
                model.glyphs.push({ key: c.key, op: k, gi: gi++, code, w0, uni, space: !uni.trim(), Tm, Trm, poly, style, adv, size: Math.hypot(Trm[2], Trm[3]) });
                Tm = mul([1, 0, 0, 1, adv, 0], Tm);
              }
            }
            break;
          }
          case 'm': case 'l': case 're': case 'c': case 'v': case 'y': case 'h': {
            if (pathStart < 0) pathStart = k;
            const A = abs();
            if (op === 're') { const [x, y, w, h] = args.map(Number); path.push(apply(A, x, y), apply(A, x + w, y), apply(A, x + w, y + h), apply(A, x, y + h)); }
            else for (let j = 0; j + 1 < args.length; j += 2) path.push(apply(A, +args[j], +args[j + 1]));
            break;
          }
          case 'W': case 'W*': clip = true; break;
          case 'S': case 's': case 'f': case 'F': case 'f*': case 'B': case 'B*': case 'b': case 'b*': case 'n': {
            if (op !== 'n' && path.length) {
              const A = abs(), pad = /[SsBb]/.test(op) ? gs.lw * Math.hypot(A[0], A[1]) / 2 : 0;
              const xs = path.map(p => p[0]), ys = path.map(p => p[1]);
              model.objects.push({ type: 'path', key: c.key, op: k, start: pathStart, bbox: [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) + pad, Math.max(...ys) + pad], clip });
            }
            path = []; pathStart = -1; clip = false;
            break;
          }
          case 'Do': {
            const name = args[0] && args[0].name, xo = xobjs instanceof PDFDict ? xobjs.get(PDFName.of(name)) : null;
            const st = xo instanceof PDFRef ? ctx.lookup(xo) : xo;
            if (!st || !st.dict) break;
            const sub = nm(look(st.dict, 'Subtype')), A = abs();
            if (sub === 'Image') {
              const pts = [apply(A, 0, 0), apply(A, 1, 0), apply(A, 1, 1), apply(A, 0, 1)];
              model.objects.push({ type: 'image', key: c.key, op: k, bbox: box(pts), name, ref: xo instanceof PDFRef ? xo : null });
            } else if (sub === 'Form' && depth < 6 && xo instanceof PDFRef) {
              const M = look(st.dict, 'Matrix') ? arr(look(st.dict, 'Matrix')).map(n) : ID;
              const bb = arr(look(st.dict, 'BBox')).map(n);
              const fb = mul(M, A);
              const fc = formContainer(xo, st, res);
              if (bb.length === 4) model.objects.push({ type: 'form', key: c.key, op: k, bbox: box([apply(fb, bb[0], bb[1]), apply(fb, bb[2], bb[1]), apply(fb, bb[2], bb[3]), apply(fb, bb[0], bb[3])]), name });
              walk(fc, fb, model, depth + 1);
            }
            break;
          }
          case 'BI': {
            const A = abs();
            model.objects.push({ type: 'image', key: c.key, op: k, bbox: box([apply(A, 0, 0), apply(A, 1, 0), apply(A, 1, 1), apply(A, 0, 1)]), inline: true });
            break;
          }
        }
      }
    }
    const box = pts => { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };

    // Groups glyphs into lines of text along their own direction.
    function lines(glyphs) {
      const out = [];
      for (const g of glyphs) {
        const d = [g.Trm[0], g.Trm[1]], dl = Math.hypot(d[0], d[1]) || 1, dir = [d[0] / dl, d[1] / dl];
        const o = [g.Trm[4], g.Trm[5]];
        let best = null;
        for (let k = out.length - 1; k >= Math.max(0, out.length - 40); k--) {
          const L = out[k];
          if (Math.abs(L.dir[0] * dir[0] + L.dir[1] * dir[1]) < 0.995 || Math.abs(L.size - g.size) > g.size * 0.35) continue;
          const v = [o[0] - L.o[0], o[1] - L.o[1]];
          const perp = Math.abs(v[0] * -L.dir[1] + v[1] * L.dir[0]), along = v[0] * L.dir[0] + v[1] * L.dir[1];
          if (perp > g.size * 0.3) continue;
          if (along < L.min - g.size * 0.5 || along > L.max + g.size * 1.6) continue;
          best = L; g.along = along; break;
        }
        if (!best) { best = { key: g.key, dir, o, size: g.size, min: 0, max: 0, glyphs: [] }; g.along = 0; out.push(best); }
        best.glyphs.push(g);
        best.min = Math.min(best.min, g.along);
        best.max = Math.max(best.max, g.along + g.adv * Math.hypot(g.Trm[0], g.Trm[1]) / (g.style.size * g.style.Th || 1));
      }
      return out.filter(L => L.glyphs.some(g => !g.space)).map(L => {
        L.glyphs.sort((a, b) => a.along - b.along);
        // chars: each character of the line's text with the glyph (and so the style) it came from.
        let chars = [], end = null;
        for (const g of L.glyphs) {
          const w = g.adv * Math.hypot(g.Trm[0], g.Trm[1]) / (g.style.size * g.style.Th || 1);
          if (end !== null && g.along - end > L.size * 0.18 && chars.length && chars[chars.length - 1].ch !== ' ' && !g.space) chars.push({ ch: ' ', g: null });
          for (const ch of g.uni || (g.space ? ' ' : '')) chars.push({ ch: ch.trim() ? ch : ' ', g });
          end = g.along + w;
        }
        while (chars.length && chars[0].ch === ' ') chars.shift();
        while (chars.length && chars[chars.length - 1].ch === ' ') chars.pop();
        const first = L.glyphs[0], main = L.glyphs.find(g => !g.space) || first;
        const pts = L.glyphs.flatMap(g => g.poly);
        return { text: chars.map(c => c.ch).join(''), chars, glyphs: L.glyphs, first, style: main.style, size: L.size, dir: L.dir, bbox: box(pts), poly: linePoly(L), key: L.key };
      });
    }
    function linePoly(L) {
      const g0 = L.glyphs[0], f = g0.style.font, perp = [-L.dir[1], L.dir[0]];
      const a = L.size * f.ascent, d = L.size * f.descent;
      const s = [L.o[0] + L.dir[0] * L.min, L.o[1] + L.dir[1] * L.min], e = [L.o[0] + L.dir[0] * L.max, L.o[1] + L.dir[1] * L.max];
      return [[s[0] + perp[0] * d, s[1] + perp[1] * d], [e[0] + perp[0] * d, e[1] + perp[1] * d], [e[0] + perp[0] * a, e[1] + perp[1] * a], [s[0] + perp[0] * a, s[1] + perp[1] * a]];
    }

    const models = new Map();
    function model(i) {
      if (models.has(i)) return models.get(i);
      const m = { glyphs: [], objects: [], keys: new Set() };
      try { walk(pageContainer(i), ID, m, 0); m.lines = lines(m.glyphs); } catch (e) { m.error = e; m.lines = []; }
      models.set(i, m);
      return m;
    }

    // ---------- Writing ----------
    const dirty = new Set();
    function setSrc(c, bytes) { c.src = bytes; dirty.add(c.key); version++; }
    function splice(c, repl) { // repl: Map opIndex -> string
      const ops = opsOf(c), parts = [];
      let at = 0;
      for (const k of [...repl.keys()].sort((a, b) => a - b)) {
        const o = ops[k];
        parts.push(c.src.subarray(at, o.s), latin1(repl.get(k)));
        at = o.e;
      }
      parts.push(c.src.subarray(at));
      setSrc(c, concat(parts));
    }
    function flush() {
      for (const key of dirty) {
        const c = conts.get(key);
        if (c.kind === 'page') {
          const node = pages[c.i].node, old = node.get(PDFName.of('Contents'));
          const ref = ctx.register(ctx.flateStream(c.src));
          node.set(PDFName.of('Contents'), ref);
          // Remove the old streams so deleted text isn't left inside the file.
          const olds = old instanceof PDFRef ? [old] : old instanceof PDFArray ? old.asArray().filter(r => r instanceof PDFRef) : [];
          const used = new Set();
          pages.forEach((p, k) => { if (k === c.i) return; const x = p.node.get(PDFName.of('Contents')); (x instanceof PDFArray ? x.asArray() : [x]).forEach(r => r instanceof PDFRef && used.add(r.toString())); });
          olds.forEach(r => { if (!used.has(r.toString()) && ctx.lookup(r) instanceof PDFArray === false) ctx.delete(r); });
          if (old instanceof PDFRef && ctx.lookup(old) instanceof PDFArray) ctx.delete(old);
        } else {
          const entries = {};
          for (const [k, v] of c.dict.entries()) { const kk = k.decodeText(); if (!['Length', 'Filter', 'DecodeParms'].includes(kk)) entries[kk] = v; }
          const st = ctx.flateStream(c.src, entries);
          ctx.assign(c.ref, st);
          c.dict = st.dict;
        }
      }
      dirty.clear();
      models.clear();
    }
    const changedPages = keys => { const out = new Set(); for (let i = 0; i < pages.length; i++) { const m = models.get(i); if (!m || [...keys].some(k => m.keys.has(k)) || keys.has('p' + i)) out.add(i); } return out; };

    // Removes glyphs (each replaced by an equal gap, so the rest of the line stays put) and whole objects
    // (images, forms, shapes) in one rewrite of each stream.
    function remove(glyphs = [], objects = []) {
      const byC = new Map();
      const of = key => { if (!byC.has(key)) byC.set(key, { text: new Map(), repl: new Map() }); return byC.get(key); };
      for (const g of glyphs) { const t = of(g.key).text; if (!t.has(g.op)) t.set(g.op, { set: new Set(), style: g.style }); t.get(g.op).set.add(g.gi); }
      for (const o of objects) of(o.key).repl.set(o.op, o.type === 'path' ? 'n' : '');
      const hit = changedPages(new Set(byC.keys()));
      for (const [key, { text, repl }] of byC) {
        const c = conts.get(key), ops = opsOf(c);
        for (const [k, { set, style: st }] of text) {
          const o = ops[k], f = st.font, size = st.size || 1;
          const parts = o.op === 'TJ' ? (Array.isArray(o.args[0]) ? o.args[0] : []) : [o.args[o.args.length - 1]];
          const outp = [];
          let gi = 0, cur = [];
          const flushStr = () => { if (cur.length) { outp.push(new Uint8Array(cur)); cur = []; } };
          const pushNum = v => { flushStr(); if (typeof outp[outp.length - 1] === 'number') outp[outp.length - 1] += v; else outp.push(v); };
          for (const p of parts) {
            if (typeof p === 'number') { pushNum(p); continue; }
            if (!p || !p.str) continue;
            for (let j = 0; j + f.codeLen <= p.str.length; j += f.codeLen) {
              const bytes = Array.from(p.str.subarray(j, j + f.codeLen));
              if (set.has(gi++)) {
                const code = f.codeLen === 2 ? bytes[0] << 8 | bytes[1] : bytes[0], isSp = f.codeLen === 1 && code === 32;
                pushNum(-(f.width(code) / 1000 * size + st.Tc + (isSp ? st.Tw : 0)) * 1000 / size);
              } else cur.push(...bytes);
            }
          }
          flushStr();
          const body = '[' + outp.map(p => (typeof p === 'number' ? num(p) : hex(p))).join(' ') + '] TJ';
          const pre = o.op === "'" ? 'T* ' : o.op === '"' ? `${num(o.args[0])} Tw ${num(o.args[1])} Tc T* ` : '';
          repl.set(k, pre + body);
        }
        splice(c, repl);
      }
      flush();
      return hit;
    }

    // Writes new text where a line was, in the same font when it has the letters, else a similar standard font.
    const stdFonts = {};
    async function std(name) { stdFonts[name] ??= await pdf.embedFont(StandardFonts[name]); return stdFonts[name]; }
    function resName(c, sub, prefix, ref) {
      const res = c.res instanceof PDFDict ? c.res : null;
      if (!res) return null;
      let d = res.get(PDFName.of(sub));
      if (d instanceof PDFRef) d = ctx.lookup(d);
      if (!(d instanceof PDFDict)) { d = ctx.obj({}); res.set(PDFName.of(sub), d); }
      for (const [k, v] of d.entries()) if (v === ref || (v instanceof PDFRef && v.toString() === ref.toString())) return k.decodeText();
      let i = 1;
      while (d.has(PDFName.of(prefix + i))) i++;
      d.set(PDFName.of(prefix + i), ref);
      return prefix + i;
    }
    // Each new character keeps the style (font, size, colour) of the character it replaces or follows,
    // so a bold name in a regular sentence stays bold.
    function styleChars(line, text) {
      const old = line.chars, nw = [...text], olds = old.map(c => c.ch);
      let p = 0;
      while (p < nw.length && p < olds.length && nw[p] === olds[p]) p++;
      let q = 0;
      while (q < nw.length - p && q < olds.length - p && nw[nw.length - 1 - q] === olds[olds.length - 1 - q]) q++;
      const near = i => { for (let d = 0; d < old.length; d++) { if (old[i - d] && old[i - d].g) return old[i - d].g.style; if (old[i + d] && old[i + d].g) return old[i + d].g.style; } return line.style; };
      return nw.map((ch, i) => {
        if (i < p) return { ch, st: near(i) };
        if (i >= nw.length - q) return { ch, st: near(olds.length - (nw.length - i)) };
        return { ch, st: p < olds.length - q ? near(p) : near(Math.max(0, p - 1)) };
      });
    }
    async function addText(line, text, opts = {}) {
      const c = conts.get(line.style.key);
      const force = opts.family !== undefined || opts.bold !== undefined || opts.italic !== undefined;
      const runs = [], missing = new Set(), used = new Set();
      for (const { ch, st } of styleChars(line, text)) {
        const f = st.font, size = opts.size ? opts.size * st.size / line.style.size : st.size;
        let code = force ? null : f.codeFor(ch), font = null, bytes = null;
        if (code !== null) { font = '/' + st.fname; bytes = f.bytes(code); used.add(f.base); }
        else if (ch === ' ' && !force) { runs.push({ st, size, gap: -(f.width(32) > 0 && f.codeLen === 1 ? f.width(32) : 250) }); continue; }
        else {
          if (!force) missing.add(ch);
          const k = stdKey(opts.family ?? f.family, opts.bold ?? f.bold, opts.italic ?? f.italic);
          const fb = await std(k);
          font = '/' + resName(c, 'Font', 'TFfb', fb.ref);
          let h;
          try { h = fb.encodeText(ch).toString(); } catch (e) { h = fb.encodeText('?').toString(); }
          bytes = h.slice(1, -1).match(/../g).map(x => parseInt(x, 16));
          used.add(k);
        }
        const last = runs[runs.length - 1];
        if (last && last.font === font && last.st === st && last.size === size) last.bytes.push(...bytes);
        else runs.push({ st, size, font, bytes: [...bytes] });
      }
      const st0 = line.style, Tm = line.first.Tm;
      const color = opts.color ? `${num(opts.color[0])} ${num(opts.color[1])} ${num(opts.color[2])} rg` : null;
      let body = '', cur = {};
      const set = (k, v, op) => { if (cur[k] !== v) { body += `${v} ${op} `; cur[k] = v; } };
      for (const r of runs) {
        set('fill', color || r.st.fill, '');
        set('Tc', num(r.st.Tc), 'Tc'); set('Tw', num(r.st.Tw), 'Tw'); set('Ts', num(r.st.Ts), 'Ts'); set('Tz', num(r.st.Th * 100), 'Tz');
        if (r.gap !== undefined) { body += `[${num(r.gap)}] TJ `; continue; }
        set('font', `${r.font} ${num(r.size)}`, 'Tf');
        body += hex(r.bytes) + ' Tj ';
      }
      const tr = st0.Tr === 3 || st0.Tr === 7 ? 0 : st0.Tr;
      const block = `\nq ${st0.ctm.map(num).join(' ')} cm BT ${tr} Tr ${Tm.map(num).join(' ')} Tm ${body}ET Q\n${MARKER}`;
      const hit = changedPages(new Set([c.key]));
      // The original commands are wrapped once in q…Q so they can't leave state behind; later edits just append.
      const tail = String.fromCharCode.apply(null, c.src.subarray(Math.max(0, c.src.length - MARKER.length)));
      setSrc(c, tail === MARKER ? concat([c.src, latin1(block)]) : concat([latin1('q\n'), c.src, latin1('\nQ'), latin1(block)]));
      flush();
      return { pages: hit, missing: [...missing], fonts: [...used] };
    }

    function snapshot() { const s = new Map(); for (const [k, c] of conts) s.set(k, c.src); return s; }
    function restore(s) {
      const keys = new Set();
      for (const [k, c] of conts) { const v = s.get(k); if (v && v !== c.src) { c.src = v; dirty.add(k); keys.add(k); } }
      if (!keys.size) return new Set();
      version++;
      const pagesHit = changedPages(keys);
      flush();
      return pagesHit;
    }
    // A one-page PDF of the current page, for the on-screen view.
    async function pagePdf(i) {
      const t = await L.PDFDocument.create();
      const [p] = await t.copyPages(pdf, [i]);
      t.addPage(p);
      return t.save({ useObjectStreams: false });
    }
    // Drops images that no page uses any more, so deleted pictures leave the file too.
    function cleanup() {
      const used = new Set(), resDicts = new Set();
      for (let i = 0; i < pages.length; i++) {
        const m = model(i);
        m.objects.forEach(o => { if (o.type === 'image' && o.ref) used.add(o.ref.toString()); });
      }
      for (const c of conts.values()) if (c.res instanceof PDFDict) resDicts.add(c.res);
      if (!version) return;
      for (const res of resDicts) {
        let d = res.get(PDFName.of('XObject'));
        if (d instanceof PDFRef) d = ctx.lookup(d);
        if (!(d instanceof PDFDict)) continue;
        for (const [k, v] of d.entries()) {
          if (!(v instanceof PDFRef)) continue;
          const st = ctx.lookup(v);
          if (!st || !st.dict || nm(look(st.dict, 'Subtype')) !== 'Image' || used.has(v.toString())) continue;
          d.delete(k); ctx.delete(v);
        }
      }
    }
    return {
      pdf, pages: pages.length, model, remove, removeGlyphs: g => remove(g, []), removeObjects: o => remove([], o), addText, snapshot, restore, pagePdf, cleanup,
      get version() { return version; },
    };
  }

  return { load, lex, fontInfo };
})();
if (typeof module !== 'undefined') module.exports = PdfEngine;
