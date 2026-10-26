const MIN = 1, MAX = 22000, NOTES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
let ac = null, osc = null, gain = null, pan = null, sweepT = 0;
const toSlider = f => Math.round(Math.log(f / MIN) / Math.log(MAX / MIN) * 1000), fromSlider = v => MIN * (MAX / MIN) ** (v / 1000);
const hz = () => Math.min(MAX, Math.max(MIN, val($('#hz')) || 440));
function note(f) { const n = Math.round(12 * Math.log2(f / 440)), cents = Math.round(1200 * Math.log2(f / (440 * 2 ** (n / 12)))); const i = ((n % 12) + 12 + 9) % 12, oct = 4 + Math.floor((n + 9) / 12); return `${NOTES[i]}${oct}${cents ? ` ${cents > 0 ? '+' : ''}${cents} cents` : ''}`; }
function set(f, glide) {
  f = Math.min(MAX, Math.max(MIN, f));
  $('#hz').value = f >= 100 ? Math.round(f * 10) / 10 : Math.round(f * 100) / 100;
  $('#slide').value = toSlider(f); $('#note').textContent = note(f);
  if (osc) osc.frequency.setTargetAtTime(f, ac.currentTime, glide ? 0.05 : 0.01);
  show();
}
function show() {
  $('#out').innerHTML = osc ? `<p class="kicker">Playing</p><p class="huge" style="text-align:left"><mark>${$('#hz').value}</mark></p><p class="sub">hertz · ${$('#wave').selectedOptions[0].text.toLowerCase()} wave · ${note(hz())}</p><p class="sub">Wavelength in air: ${fmtMax(343 / hz(), 3)} m</p>` : '<p class="kicker">Now</p><p class="empty">Press Play to start the tone.</p>';
}
function levels() {
  $('#vv').textContent = `${$('#vol').value}%`; const p = +$('#pan').value; $('#bv').textContent = p === 0 ? 'centre' : `${Math.abs(p)}% ${p < 0 ? 'left' : 'right'}`;
  if (gain) gain.gain.setTargetAtTime((+$('#vol').value / 100) ** 2 * 0.6, ac.currentTime, 0.02);
  if (pan) pan.pan.setTargetAtTime(p / 100, ac.currentTime, 0.02);
  if (osc) osc.type = $('#wave').value;
}
function start() {
  ac = new (window.AudioContext || window.webkitAudioContext)();
  osc = ac.createOscillator(); gain = ac.createGain(); pan = ac.createStereoPanner ? ac.createStereoPanner() : null;
  gain.gain.value = 0; osc.type = $('#wave').value; osc.frequency.value = hz();
  osc.connect(gain); (pan ? gain.connect(pan) : gain).connect(ac.destination); osc.start();
  levels(); $('#play span').textContent = 'Stop'; show();
}
function stop() { clearInterval(sweepT); sweepT = 0; $('#sweep').textContent = 'Sweep 20 Hz → 20 kHz'; if (!ac) return; gain.gain.setTargetAtTime(0, ac.currentTime, 0.02); const a = ac; setTimeout(() => a.close(), 150); ac = osc = gain = pan = null; $('#play span').textContent = 'Play'; show(); }
$('#play').addEventListener('click', () => (osc ? stop() : start()));
$('#hz').addEventListener('input', () => set(hz()));
$('#slide').addEventListener('input', () => set(fromSlider(+$('#slide').value), true));
$('#up').addEventListener('click', () => set(hz() * 2 ** (1 / 12)));
$('#down').addEventListener('click', () => set(hz() / 2 ** (1 / 12)));
$('#pre').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (b) set(+b.dataset.f); });
onAny('#wave, #vol, #pan', levels);
$('#sweep').addEventListener('click', () => {
  if (sweepT) { stop(); return; }
  if (!osc) start();
  const t0 = performance.now(), secs = 20;
  set(20); $('#sweep').textContent = 'Stop sweep';
  sweepT = setInterval(() => { const k = (performance.now() - t0) / 1000 / secs; if (k >= 1) { stop(); return; } set(20 * 1000 ** k); }, 50);
});
window.addEventListener('pagehide', stop);
set(440);
