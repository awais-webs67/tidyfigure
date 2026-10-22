const KEY = 'tf-flashcards', out = $('#out');
let queue = [], cards = [], known = 0, flipped = false, rounds = 0;
// A deck in the link (#deck=...) wins; otherwise the last deck on this device. Storage may be blocked, so reads are guarded.
try {
  const h = location.hash.match(/deck=([^&]+)/);
  if (h) $('#src').value = decodeURIComponent(escape(atob(decodeURIComponent(h[1]))));
  else { const s = localStorage.getItem(KEY); if (s) $('#src').value = s; }
} catch (e) { /* ignore bad links or blocked storage */ }

const parse = () => $('#src').value.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
  const m = l.match(/^(.*?)(?:\t| [-–—] | ?[:=] | ?; )(.*)$/); // split at the first separator only
  return m && m[1].trim() && m[2].trim() ? { q: m[1].trim(), a: m[2].trim() } : null;
}).filter(Boolean);
function updateCount() {
  const n = parse().length, total = $('#src').value.split('\n').filter(l => l.trim()).length;
  $('#count').textContent = `${n} card${n === 1 ? '' : 's'}${total > n ? ` · ${total - n} line${total - n === 1 ? '' : 's'} without a separator skipped` : ''}`;
  try { localStorage.setItem(KEY, $('#src').value); } catch (e) { /* storage blocked */ }
}
$('#src').addEventListener('input', updateCount);

function start() {
  cards = parse();
  if (!cards.length) { out.innerHTML = '<p class="empty">Add at least one card, like “Paris - capital of France”.</p>'; return; }
  queue = cards.map((c, i) => i);
  if ($('#shuf').checked) for (let i = queue.length - 1; i > 0; i--) { const j = randInt(0, i); [queue[i], queue[j]] = [queue[j], queue[i]]; }
  known = 0; rounds = 0; show();
}
function show() {
  flipped = false;
  if (!queue.length) {
    out.innerHTML = `<p class="kicker">Deck complete</p><p class="huge" style="text-align:left"><mark>${cards.length}/${cards.length}</mark></p><p class="sub">You went through ${rounds} card${rounds === 1 ? '' : 's'} to learn ${cards.length}. ${rounds === cards.length ? 'Perfect: every card right first time!' : 'Study again tomorrow to make it stick.'}</p><div class="btns"><button type="button" class="btn" id="again-all">Study again</button></div>`;
    $('#again-all').onclick = start; return;
  }
  const c = cards[queue[0]], rev = $('#rev').checked;
  out.innerHTML = `<p class="kicker">Card ${known + 1} of ${cards.length} · ${queue.length} left in this round</p>
    <div class="bar"><i style="width:${known / cards.length * 100}%"></i></div>
    <div class="flash" id="card" tabindex="0" role="button" aria-label="Flip card">${esc(rev ? c.a : c.q)}</div>
    <div class="btns" style="justify-content:center"><button type="button" class="btn ghost" id="flip">Show answer</button></div>
    <div class="btns" id="grade" hidden style="justify-content:center"><button type="button" class="btn ghost" id="bad">Again</button><button type="button" class="btn" id="good">Got it</button></div>
    <p class="note" style="text-align:center">Tap the card or press Space to flip. Then 1 = again, 2 = got it.</p>`;
  $('#card').onclick = flip; $('#flip').onclick = flip; $('#good').onclick = () => grade(true); $('#bad').onclick = () => grade(false);
}
function flip() {
  if (!queue.length) return;
  const c = cards[queue[0]], rev = $('#rev').checked;
  flipped = !flipped;
  $('#card').textContent = flipped ? (rev ? c.q : c.a) : (rev ? c.a : c.q);
  $('#card').classList.toggle('back', flipped);
  $('#grade').hidden = !flipped; $('#flip').hidden = flipped;
}
function grade(good) {
  rounds++;
  const i = queue.shift();
  if (good) known++;
  else queue.splice(Math.min(queue.length, 3), 0, i); // see a missed card again a few cards later
  show();
}
document.addEventListener('keydown', e => {
  if (!queue.length || !$('#card') || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
  else if (flipped && e.key === '1') grade(false);
  else if (flipped && e.key === '2') grade(true);
});
$('#start').onclick = start;
$('#share').onclick = e => {
  const enc = encodeURIComponent(btoa(unescape(encodeURIComponent($('#src').value))));
  copyText(location.href.split('#')[0] + '#deck=' + enc, e.currentTarget);
};
$('#print').onclick = () => {
  const w = open('', '_blank');
  if (!w) return;
  const cs = parse();
  w.document.write(`<!doctype html><title>Flashcards</title><style>body{font:16px Arial,sans-serif;margin:16px}.g{display:grid;grid-template-columns:1fr 1fr;border:1px dashed #999}.g div{border:1px dashed #999;min-height:110px;display:flex;align-items:center;justify-content:center;text-align:center;padding:12px}.g div:nth-child(even){background:#f6f6f6}</style><p>Cut along the dashed lines and fold in the middle: questions on the left, answers on the right.</p><div class="g">${cs.map(c => `<div><b>${esc(c.q)}</b></div><div>${esc(c.a)}</div>`).join('')}</div><script>print()<\/script>`);
  w.document.close();
};
updateCount();
out.innerHTML = `<p class="kicker">Flashcards</p><p class="empty">Type or paste your cards, then press Study. Cards you miss come back until you know them all.</p>`;
