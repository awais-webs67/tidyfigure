const KEY = 'tf-notepad', ed = $('#ed');
let S = { notes: [], cur: 0, fs: 16, ff: '' }, saveT = 0;
try { S = Object.assign(S, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* storage blocked */ }
if (!S.notes.length) S.notes = [{ id: Date.now(), text: '', t: Date.now() }];
S.cur = Math.min(S.cur, S.notes.length - 1);
const note = () => S.notes[S.cur];
const title = n => (n.text.trim().split('\n')[0] || 'Untitled note').slice(0, 40);
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); $('#saved').textContent = `Saved ${new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`; }
  catch (e) { $('#saved').textContent = 'Can’t save in this browser (private mode or storage full). Download your note.'; }
}
function list() {
  $('#list').innerHTML = S.notes.map((n, i) => `<button type="button" data-i="${i}" class="${i === S.cur ? 'on' : ''}">${esc(title(n))}<small>${new Date(n.t).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} · ${n.text.trim() ? n.text.trim().split(/\s+/).length : 0} words</small></button>`).join('');
}
function stats() {
  const t = ed.value, w = t.trim() ? t.trim().split(/\s+/).length : 0;
  $('#stat').textContent = `${w.toLocaleString()} words · ${t.length.toLocaleString()} characters · ${t ? t.split('\n').length : 0} lines`;
}
function load() { ed.value = note().text; stats(); list(); }
function look() { ed.style.setProperty('--fs', `${S.fs}px`); ed.classList.toggle('mono', S.ff === 'mono'); $('#fs').value = S.fs; $('#ff').value = S.ff; }
ed.addEventListener('input', () => { note().text = ed.value; note().t = Date.now(); stats(); $('#saved').textContent = 'Saving…'; clearTimeout(saveT); saveT = setTimeout(() => { persist(); list(); }, 400); });
ed.addEventListener('keydown', e => {
  if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey) { e.preventDefault(); const s = ed.selectionStart; ed.setRangeText('\t', s, ed.selectionEnd, 'end'); ed.dispatchEvent(new Event('input')); }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); persist(); dl(); }
});
$('#list').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) { S.cur = +b.dataset.i; persist(); load(); ed.focus(); } });
$('#new').addEventListener('click', () => { S.notes.unshift({ id: Date.now(), text: '', t: Date.now() }); S.cur = 0; persist(); load(); ed.focus(); });
$('#del').addEventListener('click', () => {
  if (note().text.trim() && !confirm(`Delete “${title(note())}”? This can’t be undone.`)) return;
  S.notes.splice(S.cur, 1); if (!S.notes.length) S.notes = [{ id: Date.now(), text: '', t: Date.now() }];
  S.cur = Math.min(S.cur, S.notes.length - 1); persist(); load(); toast('Note deleted');
});
const dl = () => download(new Blob([ed.value], { type: 'text/plain;charset=utf-8' }), `${title(note()).replace(/[\\/:*?"<>|]+/g, '').trim() || 'note'}.txt`);
$('#dl').addEventListener('click', dl);
$('#copy').addEventListener('click', e => copyText(ed.value, e.currentTarget));
$('#open').addEventListener('click', () => $('#file').click());
$('#file').addEventListener('change', async e => { const f = e.target.files[0]; if (!f) return; const text = await f.text(); S.notes.unshift({ id: Date.now(), text, t: Date.now() }); S.cur = 0; persist(); load(); e.target.value = ''; });
onAny('#fs, #ff', () => { S.fs = +$('#fs').value; S.ff = $('#ff').value; look(); persist(); });
look(); load();
