onAny('#text', run);
$('#clear').onclick = () => { $('#text').value = ''; run(); $('#text').focus(); };
// Syllables by vowel groups, with common English adjustments. Good enough for readability formulas, which were built on estimates.
function syllables(w) {
  w = w.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = w.match(/[aeiouy]{1,2}/g);
  return Math.max(1, m ? m.length : 1);
}
const sentencesOf = t => t.replace(/\s+/g, ' ').match(/[^.!?]+(?:[.!?]+["')\]]*|$)/g)?.map(s => s.trim()).filter(s => /\w/.test(s)) || [];
const wordsOf = s => s.match(/[A-Za-zÀ-ÿ0-9’'-]+/g)?.filter(w => /[A-Za-zÀ-ÿ]/.test(w)) || [];
function grade(fre) { return fre >= 90 ? ['Very easy', '5th grade (age 10–11)'] : fre >= 80 ? ['Easy', '6th grade (11–12)'] : fre >= 70 ? ['Fairly easy', '7th grade (12–13)'] : fre >= 60 ? ['Plain English', '8th–9th grade (13–15)'] : fre >= 50 ? ['Fairly difficult', '10th–12th grade (15–18)'] : fre >= 30 ? ['Difficult', 'College'] : ['Very difficult', 'University graduate']; }
function run() {
  const t = $('#text').value, out = $('#out');
  const sents = sentencesOf(t), words = wordsOf(t);
  if (words.length < 3 || !sents.length) { out.innerHTML = '<p class="empty">Paste a few sentences to check how easy they are to read.</p>'; return; }
  const W = words.length, S = sents.length, syl = words.map(syllables), Y = syl.reduce((a, b) => a + b, 0);
  const complex = words.filter((w, i) => syl[i] >= 3 && !/^[A-Z]/.test(w)).length, letters = words.join('').replace(/[^A-Za-zÀ-ÿ0-9]/g, '').length, poly = syl.filter(s => s >= 3).length;
  const fre = 206.835 - 1.015 * (W / S) - 84.6 * (Y / W);
  const fk = 0.39 * (W / S) + 11.8 * (Y / W) - 15.59;
  const fog = 0.4 * (W / S + 100 * complex / W);
  const smog = 1.043 * Math.sqrt(poly * 30 / S) + 3.1291;
  const cli = 0.0588 * (letters / W * 100) - 0.296 * (S / W * 100) - 15.8;
  const ari = 4.71 * (letters / W) + 0.5 * (W / S) - 21.43;
  const [label, level] = grade(fre);
  const long = sents.filter(s => wordsOf(s).length > 25);
  const cls = fre >= 60 ? 'ok' : fre >= 40 ? 'tight' : 'no';
  out.innerHTML = `<p class="kicker">Flesch reading ease</p><p class="huge" style="text-align:left"><mark>${Math.round(Math.max(0, Math.min(100, fre)))}</mark> <small style="font-size:18px">/ 100</small></p>
    <span class="verdict ${cls}">${label}</span><p class="sub">Suits readers at ${level} level. Aim for 60 or more for the general public.</p>
    <div class="statgrid">
      <div class="stat"><b>${fmtMax(Math.max(0, fk), 1)}</b><span>Flesch-Kincaid grade</span></div>
      <div class="stat"><b>${fmtMax(fog, 1)}</b><span>Gunning fog index</span></div>
      <div class="stat"><b>${fmtMax(smog, 1)}</b><span>SMOG grade</span></div>
      <div class="stat"><b>${fmtMax(cli, 1)}</b><span>Coleman-Liau index</span></div>
      <div class="stat"><b>${fmtMax(Math.max(0, ari), 1)}</b><span>Automated readability</span></div>
      <div class="stat"><b>${fmtMax(W / S, 1)}</b><span>Words per sentence</span></div>
      <div class="stat"><b>${fmtMax(Y / W, 2)}</b><span>Syllables per word</span></div>
      <div class="stat"><b>${fmtMax(complex / W * 100, 0)}%</b><span>Long words (3+ syllables)</span></div>
    </div>
    <p class="sub">${W.toLocaleString()} words · ${S} sentence${S === 1 ? '' : 's'} · about ${Math.max(1, Math.round(W / 238))} min to read</p>
    ${long.length ? `<p class="kicker">${long.length} long sentence${long.length === 1 ? '' : 's'} (over 25 words)</p>${long.slice(0, 5).map(s => `<div class="copybox" style="font-family:var(--f-body);border-color:var(--warn)">${esc(s)} <small class="sub">(${wordsOf(s).length} words)</small></div>`).join('')}<p class="note">Try splitting these in two, and swapping long words for shorter ones.</p>` : '<p class="note">No sentences over 25 words. Nice.</p>'}`;
}
run();
