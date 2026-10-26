const M = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..', 0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.' };
const R = Object.fromEntries(Object.entries(M).map(([k, v]) => [v, k]));
let morse = '', ac = null, playing = null;
const isMorse = s => /^[\s.\-−–·•/|_]+$/.test(s) && /[.\-·•−]/.test(s);
function translate() {
  const s = $('#in').value.trim();
  if (!s) { $('#res').textContent = ''; morse = ''; return; }
  if (isMorse(s)) {
    const norm = s.replace(/[·•]/g, '.').replace(/[−–_]/g, '-').replace(/\|/g, '/');
    const txt = norm.split(/\s*\/\s*|\s{3,}|\n+/).map(w => w.trim().split(/\s+/).map(c => R[c] ?? (c ? '�' : '')).join('')).join(' ');
    $('#dir').textContent = 'Text'; $('#res').textContent = txt; morse = norm;
  } else {
    morse = s.toUpperCase().split(/\s+/).map(w => [...w].map(c => M[c]).filter(Boolean).join(' ')).filter(Boolean).join(' / ');
    $('#dir').textContent = 'Morse code'; $('#res').textContent = morse;
  }
}
// Timeline of [on?, units] from the Morse string.
function timeline() {
  const out = [];
  morse.split(' / ').forEach((w, wi) => {
    if (wi) out.push([0, 7]);
    w.split(' ').forEach((l, li) => { if (li) out.push([0, 3]); [...l].forEach((s, si) => { if (si) out.push([0, 1]); out.push([1, s === '-' ? 3 : 1]); }); });
  });
  return out;
}
const unit = () => 1.2 / +$('#wpm').value;
function stop() { if (playing) { playing.forEach(clearTimeout); playing = null; } if (ac) { ac.close().catch(() => {}); ac = null; } $('#light').classList.remove('on'); $('#play span').textContent = 'Play'; }
function play(sound) {
  if (playing) { stop(); return; }
  if (!morse) return;
  const u = unit(), tl = timeline();
  playing = [];
  if (sound) {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = +$('#hz').value; g.gain.value = 0; o.connect(g).connect(ac.destination); o.start();
    let t = ac.currentTime + 0.05;
    for (const [on, n] of tl) { if (on) { g.gain.setTargetAtTime(0.4, t, 0.004); g.gain.setTargetAtTime(0, t + n * u, 0.004); } t += n * u; }
    $('#play span').textContent = 'Stop';
    playing.push(setTimeout(stop, (t - ac.currentTime) * 1000 + 200));
  }
  let ms = 50;
  for (const [on, n] of tl) { if (on) { playing.push(setTimeout(() => $('#light').classList.add('on'), ms)); playing.push(setTimeout(() => $('#light').classList.remove('on'), ms + n * u * 1000)); } ms += n * u * 1000; }
  if (!sound) playing.push(setTimeout(stop, ms + 100));
}
function wav() {
  if (!morse) return;
  const rate = 22050, u = unit(), hz = +$('#hz').value, tl = timeline(), total = tl.reduce((a, [, n]) => a + n, 0) * u + 0.3, N = Math.ceil(total * rate);
  const buf = new ArrayBuffer(44 + N * 2), dv = new DataView(buf), w = (o, s) => [...s].forEach((c, i) => dv.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); dv.setUint32(4, 36 + N * 2, true); w(8, 'WAVEfmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true); dv.setUint32(24, rate, true); dv.setUint32(28, rate * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true); w(36, 'data'); dv.setUint32(40, N * 2, true);
  let i = Math.round(0.1 * rate);
  for (const [on, n] of tl) { const len = Math.round(n * u * rate); if (on) for (let k = 0; k < len && i + k < N; k++) { const env = Math.min(1, k / 80, (len - k) / 80); dv.setInt16(44 + (i + k) * 2, Math.sin(2 * Math.PI * hz * k / rate) * 12000 * env, true); } i += len; }
  download(new Blob([buf], { type: 'audio/wav' }), 'morse-code.wav');
}
$('#in').addEventListener('input', () => { stop(); translate(); });
$('#ex').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) { $('#in').value = b.textContent; stop(); translate(); } });
onAny('#wpm, #hz', () => { $('#wv').textContent = $('#wpm').value; $('#hv').textContent = $('#hz').value; });
$('#play').addEventListener('click', () => play(true));
$('#flash').addEventListener('click', () => play(false));
$('#copy').addEventListener('click', e => copyText($('#res').textContent, e.currentTarget));
$('#wav').addEventListener('click', wav);
$('#in').value = 'SOS'; translate();
