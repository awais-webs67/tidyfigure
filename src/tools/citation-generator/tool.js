$('#acc').value = new Date().toISOString().slice(0, 10);
onAny('input[name="style"], input[name="type"], #authors, #title, #site, #journal, #publisher, #edition, #date, #vol, #issue, #pages, #url, #acc', render);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MLA_MON = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];

// "Jane A. Doe" or "Doe, Jane A." -> { first: 'Jane A.', last: 'Doe' }; one word = organisation or single name
const parseName = s => {
  s = s.trim();
  if (s.includes(',')) { const [l, ...f] = s.split(','); return { last: l.trim(), first: f.join(' ').trim() }; }
  const parts = s.split(/\s+/);
  return parts.length === 1 ? { last: s, first: '' } : { last: parts.pop(), first: parts.join(' ') };
};
const initials = (first, spaced) => first.split(/[\s.]+/).filter(Boolean).map(p => p.split('-').map(x => x[0].toUpperCase() + '.').join('-')).join(spaced ? ' ' : '');
const joinList = (arr, and, serial = true) => arr.length < 2 ? arr.join('') : arr.length === 2 ? `${arr[0]}${serial && and === '&' ? ',' : ''} ${and} ${arr[1]}` : `${arr.slice(0, -1).join(', ')}${serial ? ',' : ''} ${and} ${arr[arr.length - 1]}`;
const dot = s => (s && !/[.?!]$/.test(s) ? s + '.' : s);
const html = s => s; // parts are escaped as they are built

function authorsFor(style, names) {
  if (!names.length) return '';
  const inv = n => n.first ? `${n.last}, ${n.first}` : n.last, nat = n => n.first ? `${n.first} ${n.last}` : n.last;
  if (style === 'apa') {
    const f = n => n.first ? `${n.last}, ${initials(n.first, true)}` : n.last;
    if (names.length > 20) return `${names.slice(0, 19).map(f).join(', ')}, . . . ${f(names[names.length - 1])}`;
    return names.length === 1 ? f(names[0]) : `${names.slice(0, -1).map(f).join(', ')}, & ${f(names[names.length - 1])}`;
  }
  if (style === 'harvard') {
    const f = n => n.first ? `${n.last}, ${initials(n.first, false)}` : n.last;
    if (names.length >= 4) return `${f(names[0])} et al.`;
    return names.length === 1 ? f(names[0]) : `${names.slice(0, -1).map(f).join(', ')} and ${f(names[names.length - 1])}`;
  }
  if (style === 'mla') {
    if (names.length >= 3) return `${inv(names[0])}, et al.`;
    return names.length === 2 ? `${inv(names[0])}, and ${nat(names[1])}` : inv(names[0]);
  }
  // Chicago 18: up to six names listed; seven or more: first three, et al.
  const list = names.length >= 7 ? names.slice(0, 3) : names;
  const s = list.length === 1 ? inv(list[0]) : list.length === 2 ? `${inv(list[0])}, and ${nat(list[1])}` : `${inv(list[0])}, ${list.slice(1, -1).map(nat).join(', ')}, and ${nat(list[list.length - 1])}`;
  return names.length >= 7 ? `${s}, et al.` : s;
}

function render() {
  const style = $('input[name="style"]:checked').value, type = $('input[name="type"]:checked').value;
  $$('[data-for]').forEach(el => { el.hidden = el.dataset.for !== type; });
  $('#l-title').textContent = { web: 'Page title', book: 'Book title', journal: 'Article title' }[type];
  $('#l-url').textContent = type === 'web' ? 'URL' : 'DOI or URL (optional)';
  const g = id => esc($('#' + id).value.trim());
  const names = $('#authors').value.split('\n').map(s => s.trim()).filter(Boolean).map(parseName).map(n => ({ first: esc(n.first), last: esc(n.last) }));
  const dm = $('#date').value.trim().match(/^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/);
  const Y = dm ? dm[1] : '', M = dm && dm[2] ? +dm[2] - 1 : null, D = dm && dm[3] ? +dm[3] : null;
  const accD = $('#acc').value ? new Date($('#acc').value + 'T00:00') : null;
  let link = $('#url').value.trim();
  if (/^10\.\d{4,}\//.test(link)) link = 'https://doi.org/' + link;
  link = esc(link.replace(/^doi:\s*/i, 'https://doi.org/'));
  const title = g('title'), site = g('site'), journal = g('journal'), pub = g('publisher'), ed = g('edition').replace(/(st|nd|rd|th|\s*ed\.?)$/i, '');
  const vol = g('vol'), iss = g('issue'), pages = g('pages').replace(/-/g, '–');
  const ord = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th');
  const edS = /^\d+$/.test(ed) ? ord(+ed) : ed;
  const A = authorsFor(style, names);
  let ref = '', intext = '';
  const firstLast = names[0] ? names[0].last : '';
  const etal = names.length >= 3 ? `${firstLast} et al.` : names.length === 2 ? `${firstLast} ${style === 'apa' ? '&amp;' : 'and'} ${names[1].last}` : firstLast;

  if (style === 'apa') {
    const date = Y ? (type === 'web' && M !== null ? `${Y}, ${MONTHS[M]}${D ? ' ' + D : ''}` : Y) : 'n.d.';
    const who = A || '';
    const t = type === 'journal' ? dot(title) : `<i>${title}</i>${type === 'book' && ed ? ` (${edS} ed.)` : ''}.`;
    if (type === 'web') ref = who ? `${dot(who)} (${date}). ${t} ${site && site !== who ? site + '. ' : ''}${link}` : `${t} (${date}). ${site ? site + '. ' : ''}${link}`;
    if (type === 'book') ref = `${who ? dot(who) + ' ' : ''}(${date}). ${t} ${pub ? pub + '.' : ''}${link ? ' ' + link : ''}`;
    if (type === 'journal') ref = `${who ? dot(who) + ' ' : ''}(${date}). ${t} <i>${journal}</i>${vol ? `, <i>${vol}</i>` : ''}${iss ? `(${iss})` : ''}${pages ? `, ${pages}` : ''}.${link ? ' ' + link : ''}`;
    intext = `(${names.length ? etal : `<i>${title.split(' ').slice(0, 4).join(' ')}</i>`}, ${date.split(',')[0]})`;
  }
  if (style === 'mla') {
    const date = Y ? `${D ? D + ' ' : ''}${M !== null ? MLA_MON[M] + ' ' : ''}${Y}` : '';
    const acc = accD ? `Accessed ${accD.getDate()} ${MLA_MON[accD.getMonth()]} ${accD.getFullYear()}.` : '';
    const url = link.replace(/^https?:\/\//, '');
    if (type === 'web') ref = `${A ? dot(A) + ' ' : ''}“${dot(title)}” <i>${site}</i>${date ? `, ${date}` : ''}${url ? `, ${url}` : ''}.${!date && acc ? ' ' + acc : ''}`;
    if (type === 'book') ref = `${A ? dot(A) + ' ' : ''}<i>${dot(title).replace(/\.$/, '')}</i>.${ed ? ` ${edS} ed.,` : ''} ${pub}${pub ? ', ' : ''}${Y}.`;
    if (type === 'journal') ref = `${A ? dot(A) + ' ' : ''}“${dot(title)}” <i>${journal}</i>${vol ? `, vol. ${vol}` : ''}${iss ? `, no. ${iss}` : ''}${Y ? `, ${Y}` : ''}${pages ? `, ${/–/.test(pages) ? 'pp.' : 'p.'} ${pages}` : ''}${link ? `, ${link.replace(/^https?:\/\//, /doi\.org/.test(link) ? 'https://' : '')}` : ''}.`;
    intext = `(${names.length ? (names.length >= 3 ? `${firstLast} et al.` : names.length === 2 ? `${firstLast} and ${names[1].last}` : firstLast) : `“${title.split(' ').slice(0, 3).join(' ')}”`}${type !== 'web' ? ' 12' : ''})`;
  }
  if (style === 'harvard') {
    const acc = accD ? `(Accessed: ${accD.getDate()} ${MONTHS[accD.getMonth()]} ${accD.getFullYear()})` : '';
    const yr = Y || 'no date';
    if (type === 'web') ref = `${A || site} (${yr}) <i>${title}</i>. Available at: ${link} ${acc}.`;
    if (type === 'book') ref = `${A || pub} (${yr}) <i>${title}</i>.${ed ? ` ${edS} edn.` : ''} ${pub}.${link ? ` Available at: ${link}.` : ''}`;
    if (type === 'journal') ref = `${A} (${yr}) ‘${title}’, <i>${journal}</i>${vol ? `, ${vol}` : ''}${iss ? `(${iss})` : ''}${pages ? `, pp. ${pages}` : ''}.${link ? ` Available at: ${link}.` : ''}`;
    intext = `(${names.length ? (names.length >= 4 ? `${firstLast} et al.` : names.length === 3 ? `${firstLast}, ${names[1].last} and ${names[2].last}` : etal) : site || title}, ${yr})`;
  }
  if (style === 'chicago') {
    const date = Y ? `${M !== null ? MONTHS[M] + ' ' : ''}${D ? D + ', ' : ''}${Y}` : '';
    const acc = accD ? `Accessed ${MONTHS[accD.getMonth()]} ${accD.getDate()}, ${accD.getFullYear()}.` : '';
    if (type === 'web') ref = `${A ? dot(A) + ' ' : ''}“${dot(title)}” ${site ? site + (date ? ', ' : '. ') : ''}${date ? dot(date) : acc} ${link}.`;
    if (type === 'book') ref = `${A ? dot(A) + ' ' : ''}<i>${title}</i>.${ed ? ` ${edS} ed.` : ''} ${pub}${pub && Y ? ', ' : ''}${Y}.${link ? ' ' + link + '.' : ''}`;
    if (type === 'journal') ref = `${A ? dot(A) + ' ' : ''}“${dot(title)}” <i>${journal}</i>${vol ? ` ${vol}` : ''}${iss ? `, no. ${iss}` : ''}${Y ? ` (${Y})` : ''}${pages ? `: ${pages}` : ''}.${link ? ' ' + link + '.' : ''}`;
    intext = `(${names.length ? etal : `“${title.split(' ').slice(0, 3).join(' ')}”`} ${Y || 'n.d.'})`;
  }
  ref = ref.replace(/\s+/g, ' ').replace(/\.\./g, '.').replace(/ \./g, '.').trim();
  const names2 = { apa: 'APA 7th edition', mla: 'MLA 9th edition', harvard: 'Harvard (Cite Them Right)', chicago: 'Chicago 18th (author-date in-text)' };
  $('#out').innerHTML = `<p class="kicker">${names2[style]} reference</p>
    <div class="copybox" id="ref" style="font-family:var(--f-body);font-size:16px;padding-left:2.2em;text-indent:-1.6em">${html(ref)}</div>
    <div class="btns"><button type="button" class="btn" id="copy-ref">Copy reference</button></div>
    <p class="kicker">In-text citation</p><div class="copybox" id="intext" style="font-family:var(--f-body);font-size:16px">${intext}</div>
    <div class="btns"><button type="button" class="btn ghost" data-copy="intext">Copy</button></div>
    <p class="note">${style === 'mla' && type !== 'web' ? 'Replace 12 with the page number you’re quoting. ' : ''}Check capitalisation: ${style === 'apa' ? 'APA uses sentence case for article, page and book titles (only the first word and proper nouns capitalised)' : 'MLA, Harvard and Chicago usually use title case for titles'}. Type titles the way your style needs.</p>`;
  $('#copy-ref').onclick = async e => {
    const b = e.currentTarget;
    try { await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([ref], { type: 'text/html' }), 'text/plain': new Blob([$('#ref').innerText], { type: 'text/plain' }) })]); }
    catch (err) { copyText($('#ref').innerText); }
    b.textContent = 'Copied'; setTimeout(() => { b.textContent = 'Copy reference'; }, 1500);
  };
}
render();
