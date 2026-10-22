// Builds a cover letter from the details, with three tones and several wordings for each paragraph.
let seed = 0, edited = false;
const pick = (arr, k = 0) => arr[(seed + k) % arr.length];
const list = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
const an = s => (/^[aeiou]/i.test(s) && !/^(uni|eu|one)/i.test(s) ? 'an ' : 'a ') + s; // "an Engineer", "a Designer"
function v() { return Object.fromEntries($$('[data-k]').map(el => [el.dataset.k, el.value.trim()])); }

function letter() {
  const d = v(), tone = $('input[name="tone"]:checked').value;
  const wins = d.wins.split('\n').map(s => s.trim().replace(/^[-•*]\s*/, '').replace(/\.$/, '')).filter(Boolean);
  const skills = d.skills.split(',').map(s => s.trim()).filter(Boolean);
  const job = d.job || 'the role', co = d.company || 'your company', yrs = d.years ? `${d.years} years` : 'several years';
  const greet = d.manager ? `Dear ${d.manager},` : `Dear Hiring Manager,`;
  const src = d.source ? ` on ${d.source}` : '';
  const P = [];
  if (tone === 'short') {
    P.push(pick([`I’m applying for the ${job} position at ${co}${src ? `, advertised${src}` : ''}. As ${an(d.current || 'professional')} with ${yrs} of experience, I can bring proven results from day one.`, `Please accept my application for ${job} at ${co}. I have ${yrs} of experience${d.current ? ` as ${an(d.current)}` : ''} and a track record of measurable results.`]));
    if (wins.length) P.push(`Highlights:\n${wins.map(w => '• ' + w).join('\n')}`);
    if (skills.length) P.push(`I’m strong in ${list(skills)}${d.why ? `, and I’m drawn to ${co} because of ${d.why}` : ''}.`);
    P.push(pick([`I’d welcome a short call to discuss how I can help. Thank you for your time.`, `I’d be glad to talk about the role. Thank you for considering my application.`], 1));
  } else {
    const warm = tone === 'warm';
    P.push(warm
      ? pick([`I was excited to see the ${job} role at ${co}${src}. With ${yrs} of experience${d.current ? ` as ${an(d.current)}` : ''}, I’d love the chance to bring my energy and results to your team.`, `When I saw that ${co} is hiring ${an(job)}${src}, I knew I had to apply. I’ve spent ${yrs}${d.current ? ` as ${an(d.current)}` : ' in this field'}, and this role is exactly where I want to make my next contribution.`])
      : pick([`I am writing to apply for the ${job} position at ${co}${src ? `, which I saw advertised${src}` : ''}. With ${yrs} of experience${d.current ? ` as ${an(d.current)}` : ''}, I am confident I can make a strong contribution to your team.`, `Please accept this letter as my application for the ${job} role at ${co}${src ? `, advertised${src}` : ''}. I bring ${yrs} of experience${d.current ? ` as ${an(d.current)}` : ''} and a consistent record of delivering results.`]));
    if (wins.length) {
      const intro = warm ? pick([`Some of the work I’m proudest of:`, `A few results I’m especially proud of:`], 2) : pick([`Highlights from my recent roles include:`, `Some of my key achievements:`], 2);
      P.push(`${intro}\n${wins.map(w => '• ' + w).join('\n')}`);
    }
    if (skills.length) P.push(warm
      ? pick([`I see that you’re looking for someone with ${list(skills)}. These are the things I enjoy most and do every day, and I’m always looking for ways to do them better.`, `Your role calls for ${list(skills)}, which is exactly where I do my best work.`], 3)
      : pick([`The role calls for ${list(skills)}, all of which are central to my current work. I combine these skills with a practical, data-led approach and clear communication with colleagues at every level.`, `I offer the skills you are looking for, including ${list(skills)}, together with a structured approach to planning, measuring and improving results.`], 3));
    if (d.why) P.push(warm ? `What draws me to ${co} most is ${d.why}. I’d be proud to help you achieve it.` : `I am particularly drawn to ${co} because of ${d.why}, and I would value the opportunity to contribute to it.`);
    P.push(warm
      ? pick([`Thank you for reading my application. I’d be delighted to talk about how I could help ${co} grow, and I look forward to hearing from you.`, `I’d love to tell you more in an interview. Thank you for your time and consideration.`], 4)
      : pick([`Thank you for considering my application. I would welcome the opportunity to discuss how my experience can support ${co}, and I look forward to hearing from you.`, `I would be pleased to discuss my application in more detail at your convenience. Thank you for your time and consideration.`], 4));
  }
  const date = new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  return `${d.name}\n${d.contact}\n\n${date}\n\n${greet}\n\n${P.join('\n\n')}\n\n${d.manager ? 'Yours sincerely' : 'Yours faithfully'},\n\n${d.name}`;
}
function render() {
  const t = letter();
  $('#letter').innerHTML = t.split('\n\n').map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
  edited = false; count();
}
function count() { const n = ($('#letter').innerText.match(/\S+/g) || []).length; $('#count').textContent = `${n} words${n > 400 ? ' · aim for 250–400 words' : ''}. Read it through and make it sound like you before sending.`; }
$('#letter').addEventListener('input', () => { edited = true; count(); });
document.querySelector('.inputs').addEventListener('input', () => { if (!edited || confirm('Update the letter? Your manual edits will be replaced.')) render(); });
onAny('input[name="tone"]', render);
$('#shuffle').onclick = () => { seed++; render(); };
$('#copy').onclick = e => copyText($('#letter').innerText, e.currentTarget);
$('#txt').onclick = () => download(new Blob([$('#letter').innerText], { type: 'text/plain;charset=utf-8' }), 'cover-letter.txt');
$('#pdf').onclick = async () => {
  if (!window.PDFLib) await loadScript(PDFLIB_URL);
  const { PDFDocument, StandardFonts, rgb } = PDFLib, pdf = await PDFDocument.create(), f = await pdf.embedFont(StandardFonts.Helvetica);
  // Standard PDF fonts cover Western European letters; anything else is simplified.
  const clean = s => [...s].map(ch => { try { f.encodeText(ch); return ch; } catch (e) { const b = ch.normalize('NFKD').replace(/[̀-ͯ]/g, ''); try { f.encodeText(b); return b; } catch (e2) { return ''; } } }).join('').replace(/•/g, '-');
  const W = 595.28, H = 841.89, M = 64, size = 11, lh = 16.5;
  let page = pdf.addPage([W, H]), y = H - M;
  for (const para of $('#letter').innerText.split(/\n/)) {
    const words = clean(para).split(' ');
    let line = '';
    const flush = () => { if (y < M) { page = pdf.addPage([W, H]); y = H - M; } page.drawText(line, { x: M, y, size, font: f, color: rgb(0.12, 0.13, 0.15) }); y -= lh; line = ''; };
    if (!para.trim()) { y -= lh * 0.6; continue; }
    for (const w of words) {
      if (line && f.widthOfTextAtSize(line + ' ' + w, size) > W - 2 * M) flush();
      line = line ? line + ' ' + w : w;
    }
    flush();
  }
  download(new Blob([await pdf.save()], { type: 'application/pdf' }), 'cover-letter.pdf');
};
render();
