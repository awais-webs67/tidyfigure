const OCC = {
  birthday: ['Happy Birthday', ['#ff5b35', '#fff4ec', '#2b2140'], ['Wishing you a day full of laughter and a year full of happiness.', 'May all your wishes come true today and always. Have the best day!', 'Another year older, wiser and more wonderful. Enjoy every moment!']],
  anniversary: ['Happy Anniversary', ['#e2457f', '#fff0f5', '#3b1d2b'], ['Here’s to many more years of love, laughter and adventures together.', 'Wishing you both a lifetime of happiness. Happy anniversary!']],
  eid: ['Eid Mubarak', ['#1e7a4c', '#eefaf3', '#10351f'], ['May this Eid bring peace, joy and blessings to you and your family.', 'Wishing you and your loved ones a happy and blessed Eid.']],
  ramadan: ['Ramadan Mubarak', ['#0e7c86', '#eaf8f8', '#0b2e33'], ['Wishing you a peaceful and blessed Ramadan.', 'May this holy month bring you peace, patience and happiness.']],
  diwali: ['Happy Diwali', ['#d97706', '#fff7e6', '#3b2405'], ['May the festival of lights brighten your life with happiness and success.', 'Wishing you and your family a joyful and prosperous Diwali.']],
  christmas: ['Merry Christmas', ['#b3261e', '#fff1f0', '#2d0f0c'], ['Wishing you a cosy, joyful Christmas with the people you love.', 'Merry Christmas! May your holidays be merry and bright.']],
  newyear: ['Happy New Year', ['#1769ff', '#eef3ff', '#0d1b3d'], ['Here’s to a fresh start and a year full of good things.', 'Wishing you health, happiness and success in the new year.']],
  congrats: ['Congratulations', ['#8338ec', '#f5efff', '#24104a'], ['So proud of you! You worked hard for this and you deserve it.', 'Congratulations on this amazing achievement!']],
  getwell: ['Get Well Soon', ['#0a66c2', '#eef6ff', '#0b2440'], ['Sending you warm wishes for a speedy recovery.', 'Thinking of you and hoping you feel better every day.']],
  thanks: ['Thank You', ['#333f48', '#f6f7f8', '#191f24'], ['Thank you for everything. It means more than you know.', 'Just wanted to say a big thank you. You’re amazing!']],
  mother: ['Happy Mother’s Day', ['#e2457f', '#fff0f6', '#3b1d2b'], ['Thank you for your endless love and care. Happy Mother’s Day!']],
  father: ['Happy Father’s Day', ['#0e7c86', '#eaf8f8', '#0b2e33'], ['Thank you for always being there. Happy Father’s Day!']],
};
$('#occ').innerHTML = Object.entries(OCC).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('');
let msgIdx = 0;
// Base64url of UTF-8 JSON, so any language and emoji fit in the link.
const enc = o => btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const dec = s => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))));
const base = () => location.href.split(/[?#]/)[0];
function data() { return { o: $('#occ').value, t: $('#to').value.trim(), f: $('#from').value.trim(), m: $('#msg').value.trim() }; }
function update() {
  const url = `${base()}?w=${enc(data())}`;
  $('#link').textContent = url;
  $('#wa').href = `https://wa.me/?text=${encodeURIComponent(`${OCC[$('#occ').value][0]}${$('#to').value ? ', ' + $('#to').value : ''}! 🎉 I made something for you: ${url}`)}`;
}
function suggest() { const list = OCC[$('#occ').value][2]; $('#msg').value = list[msgIdx++ % list.length]; update(); }
$('#occ').addEventListener('change', () => { msgIdx = 0; suggest(); });
$('#suggest').addEventListener('click', suggest);
onAny('#to, #from, #msg', update);

// Full-screen greeting with falling confetti.
function show(d, own) {
  const [title, [accent, bg, ink]] = OCC[d.o] || OCC.birthday;
  const v = $('#view'), card = $('#card');
  v.style.background = bg; v.style.color = ink; v.hidden = false;
  card.innerHTML = `<p class="w-occ" style="color:${accent};margin:0">${esc(title)}</p>${d.t ? `<p class="w-to" style="margin:0">${esc(d.t)}</p>` : ''}
    ${d.m ? `<p class="w-msg" style="margin:0">${esc(d.m)}</p>` : ''}${d.f ? `<p class="w-from" style="color:${accent};margin:0">— ${esc(d.f)}</p>` : ''}
    <div class="btns" style="justify-content:center;margin-top:10px">${own ? '<button type="button" class="btn" id="close-view">Back to editor</button>' : `<a class="btn" href="${base()}">Create your own wish</a>`}</div>`;
  if (own) $('#close-view').onclick = () => { v.hidden = true; };
  const c = $('#fx'), x = c.getContext('2d');
  const resize = () => { c.width = innerWidth; c.height = innerHeight; };
  resize(); addEventListener('resize', resize);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cols = [accent, '#ffd166', '#06d6a0', '#4cc9f0', '#ff6b8b'];
  const bits = Array.from({ length: 160 }, () => ({ x: Math.random() * c.width, y: Math.random() * -c.height, s: 4 + Math.random() * 7, v: 1 + Math.random() * 2.5, r: Math.random() * 6, w: Math.random() * 0.1 - 0.05, c: cols[Math.floor(Math.random() * cols.length)] }));
  const t0 = performance.now();
  (function frame(now) {
    if (v.hidden) return;
    x.clearRect(0, 0, c.width, c.height);
    bits.forEach(b => { b.y += b.v; b.x += Math.sin(b.y / 40); b.r += b.w; if (b.y > c.height && now - t0 < 9000) { b.y = -10; b.x = Math.random() * c.width; }
      x.save(); x.translate(b.x, b.y); x.rotate(b.r); x.fillStyle = b.c; x.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2); x.restore(); });
    requestAnimationFrame(frame);
  })(t0);
}
$('#preview').addEventListener('click', () => show(data(), true));
const w = new URLSearchParams(location.search).get('w');
if (w) { try { const d = dec(w); if (d && OCC[d.o]) { $('#occ').value = d.o; show(d, false); } } catch (e) { /* bad link: just show the editor */ } }
suggest();
