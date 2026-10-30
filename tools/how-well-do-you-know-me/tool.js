// Friendship quiz maker. The maker answers questions about themselves; friends who open the link are scored
// against those answers (on the server, see app/share.php). {n} in a question is replaced by the maker's name.
const BANK = [
  ['What’s your favourite colour?', 'What is {n}’s favourite colour?', ['❤️ Red', '💙 Blue', '💚 Green', '🖤 Black', '🩷 Pink', '🤍 White']],
  ['Do you love pets?', 'Does {n} love pets?', ['🐶 Yes, dogs!', '🐱 Yes, cats!', '🐦 Birds', '🙅 Not a pet person']],
  ['What’s your favourite food?', 'What is {n}’s favourite food?', ['🍗 Biryani', '🍕 Pizza', '🍔 Burger', '🍜 Chinese', '🥘 Karahi', '🍝 Pasta']],
  ['Chai or coffee?', 'Chai or coffee: what does {n} pick?', ['🫖 Chai', '☕ Coffee', '🥤 Neither, cold drinks', '🧃 Juice']],
  ['Your favourite season?', 'What is {n}’s favourite season?', ['☀️ Summer', '❄️ Winter', '🌸 Spring', '🍂 Autumn', '🌧️ Monsoon']],
  ['Morning person or night owl?', 'Is {n} a morning person or a night owl?', ['🌅 Morning person', '🦉 Night owl', '😴 I just love sleeping']],
  ['Where would you go on holiday?', 'Where would {n} go on holiday?', ['🏔️ Mountains', '🏖️ Beach', '🏙️ Big city', '🏡 Stay at home']],
  ['Your dream car?', 'What is {n}’s dream car?', ['🚙 Land Cruiser', '🏎️ Ferrari', '⚡ Tesla', '🚗 Honda Civic', '🏍️ A superbike']],
  ['Your favourite sport?', 'What is {n}’s favourite sport?', ['🏏 Cricket', '⚽ Football', '🏸 Badminton', '🎮 Video games', '🙅 No sport']],
  ['Which app do you use most?', 'Which app does {n} use most?', ['📸 Instagram', '🎵 TikTok', '▶️ YouTube', '💬 WhatsApp', '📘 Facebook', '👻 Snapchat']],
  ['What scares you most?', 'What scares {n} the most?', ['🕷️ Spiders', '🐍 Snakes', '👻 Ghosts', '🌑 The dark', '📝 Exams', '🏔️ Heights']],
  ['Your favourite kind of movie?', 'What kind of movie does {n} love?', ['😂 Comedy', '💥 Action', '😱 Horror', '💕 Romance', '🔍 Thriller', '🦸 Superhero']],
  ['Sweet or spicy?', 'Sweet or spicy: what does {n} like?', ['🍰 Sweet', '🌶️ Spicy', '🤤 Both!']],
  ['How do you spend a free day?', 'How does {n} spend a free day?', ['😴 Sleeping', '🎮 Gaming', '🛍️ Shopping', '👯 Out with friends', '📺 Watching shows', '📚 Reading']],
  ['Your favourite dessert?', 'What is {n}’s favourite dessert?', ['🍦 Ice cream', '🍫 Chocolate', '🍮 Kheer', '🍩 Doughnuts', '🎂 Cake', '🍯 Gulab jamun']],
  ['What would you do with a lot of money?', 'What would {n} do with a lot of money?', ['🏠 Buy a big house', '✈️ Travel the world', '🚗 Buy cars', '💸 Give it to family', '📈 Invest it']],
  ['Your dream job?', 'What is {n}’s dream job?', ['🩺 Doctor', '💻 Software engineer', '🎬 YouTuber', '💼 Business owner', '✈️ Pilot', '🎨 Artist']],
  ['Which superpower would you choose?', 'Which superpower would {n} choose?', ['🫥 Invisibility', '🕊️ Flying', '⏳ Time travel', '🧠 Reading minds', '⚡ Super speed']],
  ['Your favourite fast food?', 'Where does {n} love to eat fast food?', ['🍗 KFC', '🍔 McDonald’s', '🍕 Domino’s', '🌯 A local dhaba', '🍔 Burger King']],
  ['Which pet would you choose?', 'Which pet would {n} choose?', ['🐶 Dog', '🐱 Cat', '🐰 Rabbit', '🦜 Parrot', '🐠 Fish']],
  ['How much do you sleep?', 'How many hours does {n} sleep?', ['😵 Less than 5', '🙂 6 to 7', '😌 8 or more', '🐻 Sometimes 12!']],
  ['Your favourite school subject?', 'What was {n}’s favourite subject at school?', ['➕ Maths', '🔬 Science', '📖 English', '🎨 Art', '🏃 Sports', '🙅 None!']],
  ['Who is your favourite person?', 'Who is {n}’s favourite person?', ['👩 Mum', '👨 Dad', '👫 A sibling', '🤝 My best friend', '😎 Myself']],
  ['Which phone do you use?', 'Which phone does {n} use?', ['🍎 iPhone', '🤖 Samsung', '📱 Xiaomi / Redmi', '📱 Oppo / Vivo', '📱 Another one']],
  ['What do you do when you’re angry?', 'What does {n} do when angry?', ['🤐 Go silent', '😤 Shout', '🎧 Listen to music', '🍫 Eat', '😴 Sleep it off']],
  ['Rain or sunshine?', 'Rain or sunshine: what does {n} prefer?', ['🌧️ Rain', '☀️ Sunshine', '⛈️ Thunderstorms', '🌈 Rainbows']],
  ['Your favourite drink?', 'What is {n}’s favourite drink?', ['🥤 Coke / Pepsi', '🧋 Milkshake', '🫖 Chai', '🧃 Fresh juice', '💧 Just water']],
  ['Famous or rich?', 'Would {n} rather be famous or rich?', ['🌟 Famous', '💰 Rich', '😌 Neither, just happy']],
  ['Your biggest habit?', 'What is {n}’s biggest habit?', ['📱 Always on my phone', '⏰ Always late', '🍪 Snacking', '😂 Laughing too much', '🧹 Being super tidy']],
  ['Your favourite time of day?', 'What is {n}’s favourite time of day?', ['🌅 Early morning', '🌞 Afternoon', '🌇 Evening', '🌙 Late night']],
  ['Your style?', 'What is {n}’s style?', ['👕 Casual', '👔 Formal', '🧢 Street style', '🥻 Traditional', '🏋️ Sporty']],
  ['What would you never eat?', 'What would {n} never eat?', ['🦐 Seafood', '🥦 Vegetables', '🍄 Mushrooms', '🌶️ Very spicy food', '🍆 Baingan']],
  ['Your favourite celebration?', 'What is {n}’s favourite celebration?', ['🌙 Eid', '🎄 Christmas', '🪔 Diwali', '🎆 New Year', '🎂 My birthday']],
  ['Introvert or extrovert?', 'Is {n} an introvert or an extrovert?', ['🙊 Introvert', '🎉 Extrovert', '🤷 A bit of both']],
  ['Your favourite emoji?', 'What is {n}’s favourite emoji?', ['😂', '❤️', '😭', '🔥', '🙏', '😎']],
  ['Where would you love to go?', 'Where would {n} love to go?', ['🗼 Paris', '🕋 Makkah', '🗽 New York', '🏯 Japan', '🏝️ Maldives', '🏔️ Switzerland']],
  ['How fast do you reply to messages?', 'How fast does {n} reply to messages?', ['⚡ Instantly', '🐢 Hours later', '👀 Seen, no reply', '📞 I just call']],
];
const MAX = 20, MIN = 5;
let qs = [], order = BANK.map((_, i) => i).sort(() => Math.random() - .5), pos = 0, editing = null;
const root = $('#qb-root'), out = $('#out');
const theme = () => $('input[name="theme"]:checked').value;
onAny('input[name="theme"]', () => { root.className = 'tool-grid sh-t-' + theme(); });
const name = () => $('#nm').value.trim() || 'your friend';
const them = q => q.replace(/\{n\}/g, name());

function nextBank() {
  const used = new Set(qs.map(q => q.bank));
  for (let k = 0; k < order.length; k++) { const i = order[(pos + k) % order.length]; if (!used.has(i)) { pos = (pos + k + 1) % order.length; return i; } }
  return -1;
}
let cur = nextBank();
function drawQuestion() {
  const c = $('#qcard');
  if (qs.length >= MAX) { c.innerHTML = `<p class="kicker">That’s ${MAX} questions</p><p>Perfect. Now create your quiz on the right.</p>`; return; }
  if (cur < 0) { c.innerHTML = '<p class="kicker">You’ve seen every question</p><p>Write your own questions below.</p>'; return; }
  const [you, , opts] = BANK[cur];
  c.innerHTML = `<p class="qz-count">Question ${qs.length + 1} · tap your answer</p><p class="qz-q">${esc(you)}</p>
    <div class="qz-opts${opts.some(o => o.length > 20) ? ' one' : ''}">${opts.map((o, k) => `<button type="button" class="qz-opt" data-k="${k}">${esc(o)}</button>`).join('')}</div>
    <div class="btns"><button type="button" class="btn ghost" id="skip">Skip, show another</button></div>`;
  c.querySelectorAll('.qz-opt').forEach(b => b.onclick = () => {
    b.classList.add('mine');
    qs.push({ q: BANK[cur][1], o: opts.slice(), a: +b.dataset.k, bank: cur });
    cur = nextBank();
    setTimeout(() => { drawQuestion(); drawList(); }, 180);
  });
  $('#skip').onclick = () => { cur = nextBank(); drawQuestion(); };
}
function drawList() {
  $('#qcount').textContent = qs.length;
  $('#qhint').textContent = qs.length < MIN ? ` (at least ${MIN})` : qs.length < 10 ? ' (10 is perfect)' : '';
  $('#qlist').innerHTML = qs.map((q, i) => `<li><span>${esc(them(q.q))}<br><b>${esc(q.o[q.a])}</b></span><button type="button" class="sh-x" data-del="${i}" aria-label="Remove question">${Share.ICON.trash}</button></li>`).join('');
  drawOut();
}
$('#qlist').addEventListener('click', e => { const b = e.target.closest('[data-del]'); if (!b) return; qs.splice(+b.dataset.del, 1); if (cur < 0) cur = nextBank(); drawQuestion(); drawList(); });
$('#nm').addEventListener('input', () => drawList());

// Own questions
const optRow = (v = '', on = false) => `<div class="row" style="grid-template-columns:auto 1fr"><input type="radio" name="ocorrect"${on ? ' checked' : ''} aria-label="Right answer"><input type="text" maxlength="70" value="${esc(v)}" placeholder="Answer"></div>`;
$('#own').onclick = () => { const f = $('#ownform'); f.hidden = false; $('#oopts').innerHTML = optRow('', true) + optRow() + optRow(); $('#oq').placeholder = `e.g. What is ${name()}’s dream car?`; $('#oq').focus(); };
$('#oadd').onclick = () => { if ($$('#oopts .row').length < 6) $('#oopts').insertAdjacentHTML('beforeend', optRow()); };
$('#ocancel').onclick = () => { $('#ownform').hidden = true; };
$('#ownform').addEventListener('submit', e => {
  e.preventDefault();
  const rows = $$('#oopts .row'), opts = [], q = $('#oq').value.trim();
  let a = -1;
  rows.forEach(r => { const v = r.querySelector('input[type=text]').value.trim(); if (!v) return; if (r.querySelector('input[type=radio]').checked) a = opts.length; opts.push(v); });
  if (!q) { toast('Write the question.', 'err'); return; }
  if (opts.length < 2) { toast('Write at least two answers.', 'err'); return; }
  if (a < 0) { toast('Tick the right answer.', 'err'); return; }
  const n = $('#nm').value.trim();
  qs.push({ q: n ? q.split(n).join('{n}') : q, o: opts, a, bank: -1 });
  $('#ownform').hidden = true; $('#oq').value = '';
  drawQuestion(); drawList();
});

// Right panel: what friends will see + create
function drawOut() {
  if (out.querySelector('.sh-done')) return;
  const ready = qs.length >= MIN && $('#nm').value.trim();
  out.innerHTML = `<p class="kicker">What your friends will see</p>
    <div class="sh-card sh-hero ${'sh-t-' + theme()}" style="padding:20px"><div class="sh-avatar">${esc(name().slice(0, 1).toUpperCase())}</div><p class="sh-kicker">Friendship quiz</p><h2 style="font-size:24px">How well do you know <em style="font-style:normal;color:var(--sh-a)">${esc(name())}</em>?</h2><p class="sub">${qs.length} questions</p></div>
    <button type="button" class="sh-btn wide ${'sh-t-' + theme()}" id="go" ${ready ? '' : 'disabled'}>${editing ? 'Save changes' : 'Create my quiz'}</button>
    <p class="note">${!$('#nm').value.trim() ? 'Write your name first. ' : ''}${qs.length < MIN ? `Answer ${MIN - qs.length} more question${MIN - qs.length === 1 ? '' : 's'}.` : 'Your friends get a score and see who knows you best.'}</p>`;
  $('#go').onclick = create;
}
async function create() {
  const btn = $('#go');
  btn.disabled = true; btn.textContent = editing ? 'Saving…' : 'Creating…';
  const data = { name: $('#nm').value.trim(), theme: theme(), qs: qs.map(({ q, o, a }) => ({ q, o, a })) };
  try {
    if (editing) {
      await Share.post({ action: 'update', code: editing.code, k: editing.key, data });
      toast('Saved. The link stays the same.');
      location.href = Share.manageUrl(editing.code, editing.key);
      return;
    }
    const res = await Share.post({ action: 'create', type: 'quiz', data });
    Share.donePanel(out, res, { type: 'quiz', heading: 'Your quiz is ready! 🎉', text: `How well do you know me? Take my quiz and see 👇`, can: 'see everyone’s answers, edit the quiz and delete it' });
    Share.mineBox($('#mine'), 'quiz', 'quiz');
  } catch (e) { toast(e.message, 'err'); btn.disabled = false; btn.textContent = 'Create my quiz'; }
}

(async () => {
  Share.mineBox($('#mine'), 'quiz', 'quiz');
  const ed = await Share.editLoad();
  if (ed && ed.type === 'quiz') {
    editing = ed;
    $('#nm').value = ed.d.name;
    const t = $(`input[name="theme"][value="${ed.d.theme}"]`); if (t) { t.checked = true; root.className = 'tool-grid sh-t-' + ed.d.theme; }
    qs = ed.d.qs.map(q => ({ ...q, bank: BANK.findIndex(b => b[1] === q.q) }));
    cur = nextBank();
  }
  drawQuestion(); drawList();
})();
