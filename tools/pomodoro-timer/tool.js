const KEY = 'tf-pomodoro', S = { work: 25, short: 5, long: 15, every: 4, auto: false, sound: true }, D = { day: '', count: 0, mins: 0, tasks: [] };
try { const s = JSON.parse(localStorage.getItem(KEY)) || {}; Object.assign(S, s.S); Object.assign(D, s.D); } catch (e) { /* storage blocked */ }
const today = new Date().toDateString();
if (D.day !== today) { D.day = today; D.count = 0; D.mins = 0; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ S, D })); } catch (e) { /* storage blocked */ } };
let mode = 'work', done = 0, left = S.work * 60, endAt = 0, timer = 0;
const len = m => S[m] * 60;
for (const k of ['work', 'short', 'long', 'every']) { $('#s-' + k).value = S[k]; }
$('#s-auto').checked = S.auto; $('#s-sound').checked = S.sound;
onAny('#s-work, #s-short, #s-long, #s-every, #s-auto, #s-sound', () => {
  for (const k of ['work', 'short', 'long', 'every']) S[k] = Math.max(1, Math.round(val($('#s-' + k)) || S[k]));
  S.auto = $('#s-auto').checked; S.sound = $('#s-sound').checked; save();
  if (!timer) { left = len(mode); draw(); }
});
const mmss = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function draw() {
  const total = len(mode);
  $('#clock').textContent = mmss(Math.ceil(left));
  $('#mode').textContent = mode === 'work' ? 'Focus' : mode === 'short' ? 'Short break' : 'Long break';
  $('#dial').classList.toggle('brk', mode !== 'work');
  $('#prog').style.width = `${(1 - left / total) * 100}%`;
  $('#cycle').textContent = `Session ${(done % S.every) + 1} of ${S.every}`;
  $('#go span').textContent = timer ? 'Pause' : left < total ? 'Resume' : 'Start';
  $('#today').textContent = D.count; $('#mins').textContent = Math.round(D.mins);
  document.title = timer ? `${mmss(Math.ceil(left))} · ${mode === 'work' ? 'Focus' : 'Break'}` : 'Pomodoro Timer';
}
function start() { if (timer) return; endAt = Date.now() + left * 1000; timer = setInterval(step, 250); draw(); }
function pause() { clearInterval(timer); timer = 0; draw(); }
function step() { left = Math.max(0, (endAt - Date.now()) / 1000); if (left <= 0) finish(); else draw(); }
function finish(skipped) {
  clearInterval(timer); timer = 0;
  if (mode === 'work' && !skipped) { done++; D.count++; D.mins += S.work; save(); }
  else if (mode === 'work') done++;
  const was = mode;
  mode = was === 'work' ? (done % S.every === 0 ? 'long' : 'short') : 'work';
  left = len(mode);
  if (!skipped) { chime(); alertUser(was === 'work' ? 'Focus session done. Time for a break!' : 'Break over. Back to focus!'); }
  draw();
  if (S.auto && !skipped) start();
}
function chime() {
  if (!S.sound) return;
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.35, 0.7].forEach((t, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = [880, 1046.5, 1318.5][i]; g.gain.setValueAtTime(0.0001, ac.currentTime + t); g.gain.exponentialRampToValueAtTime(0.3, ac.currentTime + t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + t + 0.6); o.connect(g).connect(ac.destination); o.start(ac.currentTime + t); o.stop(ac.currentTime + t + 0.65); });
    setTimeout(() => ac.close(), 1600);
  } catch (e) { /* no audio */ }
}
function alertUser(msg) {
  toast(msg);
  if (window.Notification && Notification.permission === 'granted' && document.hidden) { try { new Notification('Pomodoro Timer', { body: msg }); } catch (e) { /* not allowed here */ } }
}
$('#go').addEventListener('click', () => (timer ? pause() : start()));
$('#skip').addEventListener('click', () => finish(true));
$('#reset').addEventListener('click', () => { pause(); mode = 'work'; done = 0; left = len('work'); draw(); });
$('#notify').addEventListener('click', async () => { if (!window.Notification) return toast('This browser doesn’t support notifications.', 'err'); const p = await Notification.requestPermission(); toast(p === 'granted' ? 'Notifications are on' : 'Notifications are blocked', p === 'granted' ? 'ok' : 'err'); });
document.addEventListener('keydown', e => { if (e.key === ' ' && !e.target.closest('input, textarea, button, select, summary')) { e.preventDefault(); timer ? pause() : start(); } });
// Tasks
function tasks() {
  $('#tasks').innerHTML = D.tasks.map((t, i) => `<li class="${t.d ? 'done' : ''}"><input type="checkbox" data-i="${i}" ${t.d ? 'checked' : ''} aria-label="Done"><span>${esc(t.t)}</span><button type="button" data-x="${i}" aria-label="Delete task">×</button></li>`).join('') || '<li class="sub" style="border:0;background:none;padding:0">No tasks yet.</li>';
}
$('#tform').addEventListener('submit', e => { e.preventDefault(); const t = $('#tnew').value.trim(); if (!t) return; D.tasks.push({ t, d: false }); $('#tnew').value = ''; save(); tasks(); });
$('#tasks').addEventListener('click', e => {
  const c = e.target.closest('[data-i]'), x = e.target.closest('[data-x]');
  if (c) { D.tasks[c.dataset.i].d = c.checked; save(); tasks(); }
  if (x) { D.tasks.splice(+x.dataset.x, 1); save(); tasks(); }
});
draw(); tasks();
