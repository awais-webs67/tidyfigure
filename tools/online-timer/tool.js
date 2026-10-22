let total = 300000, left = 300000, endAt = 0, tick = null, audio = null;
const pageTitle = document.title;

const fmtT = ms => {
  const s = Math.ceil(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return (h ? `${h}:${String(m).padStart(2, '0')}` : String(m).padStart(2, '0')) + ':' + String(sec).padStart(2, '0');
};
const running = () => tick !== null;

function setFromInputs() {
  if (running()) return;
  const ms = ((val($('#h')) || 0) * 3600 + (val($('#m')) || 0) * 60 + (val($('#s')) || 0)) * 1000;
  total = left = Math.max(0, ms);
  show();
  $('#status').textContent = 'Ready';
}

function show() {
  $('#display').textContent = fmtT(left);
  $('#bar').style.width = `${total ? (left / total) * 100 : 0}%`;
  document.title = running() ? `${fmtT(left)} · Timer` : pageTitle;
}

// Time is measured against the clock, not by counting ticks, so it stays exact even in a background tab.
function start() {
  if (running()) { // pause
    clearInterval(tick); tick = null;
    left = Math.max(0, endAt - Date.now());
    $('#start span').textContent = 'Resume';
    $('#status').textContent = 'Paused';
    show();
    return;
  }
  if (left <= 0) setFromInputs();
  if (left <= 0) { $('#status').textContent = 'Set a time first.'; return; }
  if ($('#sound').checked && !audio) { try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audio = null; } }
  endAt = Date.now() + left;
  $('#start span').textContent = 'Pause';
  $('#status').textContent = 'Running';
  tick = setInterval(() => {
    left = Math.max(0, endAt - Date.now());
    show();
    if (left === 0) done();
  }, 200);
  show();
}

function beep() {
  if (!audio || !$('#sound').checked) return;
  const t = audio.currentTime;
  for (let i = 0; i < 6; i++) {
    const o = audio.createOscillator(), g = audio.createGain();
    o.frequency.value = i % 2 ? 660 : 880;
    g.gain.setValueAtTime(0.0001, t + i * 0.45);
    g.gain.exponentialRampToValueAtTime(0.35, t + i * 0.45 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.45 + 0.35);
    o.connect(g).connect(audio.destination);
    o.start(t + i * 0.45); o.stop(t + i * 0.45 + 0.4);
  }
}

function done() {
  clearInterval(tick); tick = null;
  $('#start span').textContent = 'Start';
  $('#status').innerHTML = '<mark>Time’s up!</mark>';
  document.title = '⏰ Time’s up!';
  beep();
}

function reset() {
  clearInterval(tick); tick = null;
  $('#start span').textContent = 'Start';
  left = total;
  $('#status').textContent = 'Ready';
  show();
}

$('#start').addEventListener('click', start);
$('#reset').addEventListener('click', reset);
onAny('#h, #m, #s', setFromInputs);
$('#presets').addEventListener('click', e => {
  const b = e.target.closest('.chip');
  if (!b) return;
  reset();
  const s = +b.dataset.s;
  $('#h').value = Math.floor(s / 3600); $('#m').value = Math.floor((s % 3600) / 60); $('#s').value = s % 60;
  setFromInputs();
  start();
});
document.addEventListener('keydown', e => { if (e.code === 'Space' && !/INPUT|SELECT|TEXTAREA|BUTTON/.test(e.target.tagName)) { e.preventDefault(); start(); } });
show();
