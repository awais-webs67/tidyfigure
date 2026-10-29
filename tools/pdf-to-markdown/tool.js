// PDF to Markdown: text and font sizes from pdf.js are grouped into lines and paragraphs; sizes above the
// body text become headings, bullets become lists, bold fonts become **bold** and link areas become links.
const out = $('#out');
let doc = null, name = 'document', pages = null;
fileDrop($('#drop'), $('#file'), fs => { const f = fs.find(isPdf); if (f) open(f); });
$('#sample').addEventListener('click', async () => open(await sampleDoc()));
onAny('#breaks, #keephf', () => { if (pages) render(); });

async function open(f) {
  try { doc = await openPdf(new Uint8Array(await f.arrayBuffer())); } catch (e) { $('#loaded').textContent = 'That file can’t be opened. It may be damaged or password-protected.'; return; }
  name = baseName(f.name);
  $('#loaded').textContent = `${f.name} · ${doc.numPages} page${doc.numPages > 1 ? 's' : ''}`;
  out.innerHTML = '<p class="kicker">Markdown</p><div class="bar"><i style="width:2%"></i></div><p class="sub" data-pct>Reading…</p>';
  pages = [];
  for (let n = 1; n <= doc.numPages; n++) {
    pages.push(await readPage(n));
    setProgress(out, n / doc.numPages, `Reading page ${n} of ${doc.numPages}…`);
  }
  render();
}
// Lines of one page: text, size, boldness, position, with link addresses on the words they cover.
async function readPage(n) {
  const page = await doc.getPage(n), vp = page.getViewport({ scale: 1 });
  await page.getOperatorList(); // loads the fonts, so their names (Bold…) can be read
  const [tc, annots] = [await page.getTextContent(), await page.getAnnotations()];
  const links = annots.filter(a => a.subtype === 'Link' && a.url).map(a => ({ url: a.url, r: a.rect }));
  const items = [];
  for (const it of tc.items) {
    if (!it.str) continue;
    const [a, b, c, d, x, y] = it.transform, size = Math.hypot(c, d) || Math.hypot(a, b);
    let bold = false;
    try { const f = page.commonObjs.get(it.fontName); bold = /bold|black|heavy|semibold|demi/i.test(f.name || '') || f.bold === true; } catch (e) { /* font not loaded */ }
    const cx = x + it.width / 2, cy = y + size / 3, link = links.find(l => cx >= l.r[0] && cx <= l.r[2] && cy >= l.r[1] && cy <= l.r[3]);
    items.push({ s: it.str, x, y, w: it.width, size: Math.round(size * 10) / 10, bold, url: link && link.url });
  }
  items.sort((p, q) => q.y - p.y || p.x - q.x);
  const lines = [];
  for (const it of items) {
    const l = lines.find(L => Math.abs(L.y - it.y) < Math.max(L.size, it.size) * 0.45);
    if (l) { l.parts.push(it); l.size = Math.max(l.size, it.size); } else lines.push({ y: it.y, size: it.size, parts: [it] });
  }
  return { h: vp.height, lines: lines.sort((p, q) => q.y - p.y).map(l => {
    l.parts.sort((p, q) => p.x - q.x);
    let md = '', plain = '', end = null, boldAll = l.parts.every(p => p.bold || !p.s.trim());
    // Neighbouring pieces with the same style are joined, then bold and links are written around them.
    const runs = [];
    for (const p of l.parts) {
      const gap = end !== null && p.x - end > p.size * 0.2 && !/\s$/.test(plain) && !/^\s/.test(p.s) ? ' ' : '';
      plain += gap + p.s; end = p.x + p.w;
      const last = runs[runs.length - 1];
      if (last && last.bold === p.bold && last.url === p.url) last.s += gap + p.s; else { if (gap && last) last.s += gap; runs.push({ s: p.s, bold: p.bold, url: p.url }); }
    }
    for (const r of runs) {
      let t = r.s.replace(/([*_`\[\]])/g, '\\$1');
      const lead = t.match(/^\s*/)[0], trail = t.match(/\s*$/)[0];
      t = t.trim();
      if (!t) { md += r.s; continue; }
      if (r.bold && !boldAll) t = `**${t}**`;
      if (r.url) t = `[${t}](${r.url})`;
      md += lead + t + trail;
    }
    return { y: l.y, x: l.parts[0].x, size: l.size, bold: boldAll, md: md.replace(/\s+/g, ' ').trim(), plain: plain.replace(/\s+/g, ' ').trim() };
  }).filter(l => l.plain) };
}
function render() {
  const keepHF = $('#keephf').checked;
  // Headers and footers: lines near the top or bottom that repeat (ignoring numbers) on most pages.
  const key = l => l.plain.replace(/\d+/g, '#').toLowerCase();
  const edge = (p, l) => l.y > p.h * 0.9 || l.y < p.h * 0.1;
  const seen = {};
  pages.forEach(p => new Set(p.lines.filter(l => edge(p, l)).map(key)).forEach(k => { seen[k] = (seen[k] || 0) + 1; }));
  const repeated = k => pages.length >= 2 && seen[k] >= Math.max(2, pages.length * 0.6);
  const isPageNo = l => /^(page\s*)?\d+(\s*(of|\/)\s*\d+)?$/i.test(l.plain);
  // Body text size: the size used by most letters.
  const count = {};
  pages.forEach(p => p.lines.forEach(l => { count[l.size] = (count[l.size] || 0) + l.plain.length; }));
  const body = +Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || 11;
  const headSizes = [...new Set(pages.flatMap(p => p.lines.filter(l => l.size >= body * 1.15).map(l => l.size)))].sort((a, b) => b - a);
  const level = s => Math.min(6, headSizes.indexOf(s) + 1);
  const md = [];
  let para = null, prev = null;
  const endPara = () => { if (para) md.push(para.list ? '\u0001' + para.text : para.text); para = null; };
  pages.forEach((p, pi) => {
    if (pi && $('#breaks').checked) { endPara(); md.push('---'); }
    for (const l of p.lines) {
      if (!keepHF && edge(p, l) && (repeated(key(l)) || isPageNo(l))) continue;
      const bullet = l.plain.match(/^([•●▪◦‣∙·\-–*])\s*/), num = l.plain.match(/^(\(?\d{1,3}[.)])\s+/);
      if (l.size >= body * 1.15 && l.plain.length < 160) {
        endPara();
        const h = '#'.repeat(level(l.size)) + ' ' + l.md.replace(/\*\*/g, '');
        if (md.length && md[md.length - 1].startsWith('#') && prev && prev.size === l.size && p.lines.includes(prev)) md[md.length - 1] += ' ' + l.md.replace(/\*\*/g, ''); // a heading on two lines
        else md.push(h);
      } else if (bullet || num) {
        endPara();
        const text = l.md.replace(/^\\?([•●▪◦‣∙·\-–*])\s*/, '').replace(/^(\(?\d{1,3}[.)])\s+/, '');
        para = { text: (bullet ? '- ' : num[1].replace(/[()]/g, '').replace(')', '.') + ' ') + text, list: true, x: l.x };
      } else if (l.bold && l.plain.length < 90 && (!prev || !para)) {
        endPara(); md.push(`**${l.md}**`);
      } else {
        const gap = prev && p.lines.includes(prev) ? prev.y - l.y : Infinity;
        const joins = para && gap < l.size * 1.9 && Math.abs(prev.size - l.size) < 1 && (!para.list || l.x > para.x + 2);
        if (joins) para.text = /[a-z]-$/.test(para.text) && /^[a-z]/.test(l.md) ? para.text.slice(0, -1) + l.md : para.text + ' ' + l.md;
        else { endPara(); para = { text: l.md }; }
      }
      prev = l;
    }
    endPara(); prev = null;
  });
  // List items sit on lines next to each other; everything else is separated by a blank line.
  const text = md.map((x, i) => (i ? (x[0] === '\u0001' && md[i - 1][0] === '\u0001' ? '\n' : '\n\n') : '') + x.replace(/^\u0001/, '')).join('').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  const words = text.split(/\s+/).filter(Boolean).length;
  out.innerHTML = `<p class="kicker">Markdown</p><p class="sub">${words.toLocaleString()} words · ${md.filter(x => x.startsWith('#')).length} headings · ${bytes(new Blob([text]).size)}</p>
    ${words < 3 ? '<span class="verdict no">No text found</span><p class="sub">This PDF looks like a scan. Use Image to Text to read it first.</p>' : ''}
    <div class="btns"><button type="button" class="btn big-btn" id="dl">Download .md</button><button type="button" class="btn ghost" id="copy">Copy</button></div>
    <pre class="copybox" id="md"></pre>`;
  $('#md').textContent = text;
  $('#dl').onclick = () => download(new Blob([text], { type: 'text/markdown' }), `${name}.md`);
  $('#copy').onclick = e => copyText(text, e.target);
}
// A short report with headings, lists, bold words and a link, to try the tool.
async function sampleDoc() {
  if (!window.PDFLib) await loadScript(PDFLIB_URL);
  const { PDFDocument, StandardFonts, rgb, PDFName, PDFString } = PDFLib;
  const pdf = await PDFDocument.create(), f = await pdf.embedFont(StandardFonts.Helvetica), b = await pdf.embedFont(StandardFonts.HelveticaBold);
  for (let n = 1; n <= 2; n++) {
    const p = pdf.addPage([595.28, 841.89]);
    let y = 780;
    const put = (t, font, size, x = 60, gap = 1.6) => { p.drawText(t, { x, y, size, font, color: rgb(0.1, 0.12, 0.15) }); y -= size * gap; };
    p.drawText('Team handbook', { x: 60, y: 815, size: 9, font: f, color: rgb(0.5, 0.5, 0.5) });
    p.drawText(`Page ${n} of 2`, { x: 480, y: 30, size: 9, font: f, color: rgb(0.5, 0.5, 0.5) });
    if (n === 1) {
      put('Welcome to the team', b, 24, 60, 1.8);
      put('Your first week', b, 16, 60, 1.8);
      put('This handbook explains how we work, who to ask for help and what to expect in your first', f, 11);
      put('few weeks. Read it before your first day and keep it for later.', f, 11, 60, 2.2);
      put('What to bring', b, 16, 60, 1.8);
      ['• Photo ID for your building pass', '• Your bank details for payroll', '• A water bottle (we have free coffee)'].forEach(t => put(t, f, 11, 70));
      y -= 10;
      p.drawText('Questions? Read the full guide at ', { x: 60, y, size: 11, font: f });
      const w = f.widthOfTextAtSize('Questions? Read the full guide at ', 11);
      p.drawText('example.com/guide', { x: 60 + w, y, size: 11, font: f, color: rgb(0.1, 0.3, 0.8) });
      const link = pdf.context.obj({ Type: 'Annot', Subtype: 'Link', Rect: [60 + w, y - 2, 60 + w + f.widthOfTextAtSize('example.com/guide', 11), y + 10], Border: [0, 0, 0], A: { Type: 'Action', S: 'URI', URI: PDFString.of('https://example.com/guide') } });
      p.node.set(PDFName.of('Annots'), pdf.context.obj([pdf.context.register(link)]));
    } else {
      put('How we work', b, 16, 60, 1.8);
      put('We plan work in two-week cycles. Each cycle starts with a short planning meeting', f, 11);
      put('and ends with a demo. Important: always write down decisions in the team notes.', f, 11, 60, 2.2);
      ['1. Pick a task from the board', '2. Ask for a review when it is done', '3. Move it to Done after the review'].forEach(t => put(t, f, 11, 70));
    }
  }
  return new File([await pdf.save()], 'team-handbook.pdf', { type: 'application/pdf' });
}
