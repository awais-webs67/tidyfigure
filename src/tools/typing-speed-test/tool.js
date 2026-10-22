const TEXTS = {
  text: [
    'The best way to get faster at typing is to slow down first. Accuracy builds the habits your fingers need, and speed follows once each key is in the right place. Keep your eyes on the screen, not the keyboard, and let your fingers return to the home row after every word.',
    'A good morning routine does not need to be complicated. Drink a glass of water, open the curtains, and take a few minutes to plan the most important task of the day. Small habits like these add up, and after a few weeks they start to feel automatic.',
    'Rivers shape the land around them over thousands of years. Fast water carries stones and sand downstream, cutting deep valleys in the hills. Where the river slows down near the sea, it drops what it carries and builds wide, flat plains that are rich enough for farming.',
    'Learning a new language is easier when you use it every day. Label things around your home, listen to music in that language, and try to think simple sentences in your head. Mistakes are part of the process, so speak as often as you can and laugh when you get it wrong.',
    'Good design often goes unnoticed because it simply works. A door handle that tells you whether to push or pull, a form that explains what went wrong, or a map that matches the street in front of you all save time and frustration without asking for any attention.',
  ],
  easy: ['the', 'and', 'you', 'that', 'was', 'for', 'are', 'with', 'his', 'they', 'one', 'have', 'this', 'from', 'word', 'but', 'what', 'some', 'can', 'out', 'other', 'were', 'all', 'there', 'when', 'use', 'your', 'how', 'said', 'each', 'she', 'which', 'their', 'time', 'will', 'way', 'about', 'many', 'then', 'them', 'write', 'would', 'like', 'these', 'her', 'long', 'make', 'thing', 'see', 'him', 'two', 'has', 'look', 'more', 'day', 'could', 'come', 'did', 'number', 'sound', 'most', 'people', 'over', 'know', 'water', 'than', 'call', 'first', 'who', 'may', 'down', 'side', 'been', 'now', 'find', 'any', 'new', 'work', 'part', 'take', 'get', 'place', 'made', 'live', 'where', 'after', 'back', 'little', 'only', 'round', 'man', 'year', 'came', 'show', 'every', 'good', 'give', 'our', 'under', 'name', 'very', 'through', 'just', 'form', 'great', 'think', 'help', 'line', 'right', 'too', 'mean', 'old', 'same', 'tell', 'boy', 'follow', 'want', 'air', 'well', 'also', 'play', 'small', 'end', 'put', 'home', 'read', 'hand', 'port', 'large', 'spell', 'add', 'even', 'land', 'here', 'must', 'big', 'high', 'such', 'why', 'ask', 'men', 'change', 'went', 'light', 'kind', 'off', 'need', 'house', 'picture', 'try', 'again', 'animal', 'point', 'mother', 'world', 'near', 'build', 'self', 'earth', 'father'],
  hard: [
    'On 14 March 2026, the team shipped version 3.2.1; it fixed 47 bugs, cut load times by 38% and added "dark mode" (finally!). Questions? Email support@example.com or call +1 (555) 012-3456 before 5:30 p.m.',
    'Order #A-7741: 3 × notebooks @ $4.99, 2 × pens @ $1.25 & 1 × backpack @ $39.50. Subtotal: $57.97; tax (8.25%) = $4.78. Total due: $62.75 — thanks for shopping with us!',
  ],
};
const textEl = $('#text'), inp = $('#in'), out = $('#out');
let target = '', t0 = 0, timer = 0, errors = 0, typed = 0, done = false;

function newText() {
  const k = $('#kind').value;
  if (k === 'easy') target = Array.from({ length: 120 }, () => TEXTS.easy[randInt(0, TEXTS.easy.length - 1)]).join(' ');
  else { const pool = TEXTS[k], start = randInt(0, pool.length - 1); target = Array.from({ length: 6 }, (x, i) => pool[(start + i) % pool.length]).join(' '); }
  reset();
}
function reset() {
  clearInterval(timer); t0 = 0; errors = 0; typed = 0; done = false;
  inp.value = ''; inp.disabled = false;
  paint(); idle();
}
function idle() { out.innerHTML = `<p class="kicker">Time</p><p class="huge" style="text-align:left"><mark>${+$('#dur').value >= 60 ? (+$('#dur').value / 60) + ' min' : $('#dur').value + ' s'}</mark></p><p class="sub">Click the box and start typing. The clock starts on your first key.</p>`; }
function paint() {
  const v = inp.value;
  // Show only the area around the cursor so long texts stay readable on phones.
  const from = Math.max(0, v.lastIndexOf(' ', Math.max(0, v.length - 60)) + 1), to = Math.min(target.length, from + 260);
  let h = '';
  for (let i = from; i < to; i++) {
    const c = esc(target[i]);
    h += i < v.length ? `<span class="${v[i] === target[i] ? 'ok' : 'bad'}">${c}</span>` : i === v.length ? `<span class="cur">${c}</span>` : c;
  }
  textEl.innerHTML = h;
}
function stats() {
  const v = inp.value, mins = Math.max(1 / 60, (performance.now() - t0) / 60000);
  let correct = 0;
  for (let i = 0; i < v.length; i++) if (v[i] === target[i]) correct++;
  return { wpm: correct / 5 / mins, raw: v.length / 5 / mins, acc: typed ? (typed - errors) / typed * 100 : 100, correct, wrong: v.length - correct, mins };
}
function tick() {
  const left = +$('#dur').value - (performance.now() - t0) / 1000;
  if (left <= 0 || inp.value.length >= target.length) return finish();
  const s = stats();
  out.innerHTML = `<p class="kicker">Time left</p><p class="huge" style="text-align:left"><mark>${Math.ceil(left)} s</mark></p>
    <div class="statgrid"><div class="stat"><b>${Math.round(s.wpm)}</b><span>WPM</span></div><div class="stat"><b>${s.acc.toFixed(0)}%</b><span>Accuracy</span></div></div>`;
}
function finish() {
  if (done) return;
  done = true; clearInterval(timer); inp.disabled = true;
  const s = stats(), wpm = Math.round(s.wpm);
  const level = wpm < 25 ? 'Beginner: keep practising the home row' : wpm < 40 ? 'Average: about the typical adult speed' : wpm < 60 ? 'Good: faster than most people' : wpm < 80 ? 'Fast: professional-level typing' : 'Very fast: top typist territory';
  out.innerHTML = `<p class="kicker">Your typing speed</p><p class="huge" style="text-align:left"><mark>${wpm} WPM</mark></p><p class="sub">${level}</p>
    <div class="statgrid"><div class="stat"><b>${s.acc.toFixed(1)}%</b><span>Accuracy</span></div><div class="stat"><b>${Math.round(s.raw)}</b><span>Raw WPM (with errors)</span></div>
    <div class="stat"><b>${s.correct}</b><span>Correct characters</span></div><div class="stat"><b>${errors}</b><span>Mistakes made</span></div></div>
    <div class="btns"><button type="button" class="btn" id="again">Try again</button></div>`;
  $('#again').onclick = newText;
}
inp.addEventListener('input', e => {
  if (done) return;
  if (!t0) { t0 = performance.now(); timer = setInterval(tick, 250); }
  if (e.inputType && e.inputType.startsWith('insert')) {
    const i = inp.value.length - 1;
    typed++;
    if (inp.value[i] !== target[i]) errors++;
  }
  if (inp.value.length > target.length) inp.value = inp.value.slice(0, target.length);
  paint();
  if (inp.value.length >= target.length) finish();
});
inp.addEventListener('paste', e => e.preventDefault());
$('#reset').onclick = newText;
onAny('#dur, #kind', newText);
newText();
