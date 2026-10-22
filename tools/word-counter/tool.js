const STOP = new Set('a an and are as at be but by for from has have he her his i if in into is it its me my no not of on or our she so than that the their them then there these they this to was we were what when which who will with you your do does did can could would should just also about up out more most some any all one two get got make made being been'.split(' '));
const ta = $('#text');
ta.addEventListener('input', calc);
$('#clear').addEventListener('click', () => { ta.value = ''; ta.focus(); calc(); });
$('#copy').addEventListener('click', e => copyText(ta.value, e.target));

// Words: runs of letters/numbers, allowing inner apostrophes and hyphens ("isn't", "well-known").
const WORD = /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu;
const time = mins => {
  const s = Math.max(1, Math.round(mins * 60));
  return s < 60 ? `${s} sec` : `${Math.floor(s / 60)} min${s % 60 ? ` ${s % 60} sec` : ''}`;
};

function calc() {
  const t = ta.value;
  const words = t.match(WORD) || [];
  const chars = [...t].length;
  const noSpace = [...t.replace(/\s/g, '')].length;
  const sentences = (t.match(/[^.!?…]+[.!?…]+(\s|$)|[^.!?…]+$/g) || []).filter(s => /[\p{L}\p{N}]/u.test(s)).length;
  const paras = t.split(/\n\s*\n/).filter(p => p.trim()).length;
  const avg = sentences ? words.length / sentences : 0;
  const freq = {};
  words.forEach(w => { const k = w.toLowerCase(); if (k.length > 2 && !STOP.has(k) && !/^\d+$/.test(k)) freq[k] = (freq[k] || 0) + 1; });
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8);

  let html = `<p class="kicker">Word count</p><p class="huge" style="text-align:left"><mark>${words.length.toLocaleString()}</mark></p>
    <div class="statgrid">
      <div class="stat"><b>${chars.toLocaleString()}</b><span>Characters</span></div>
      <div class="stat"><b>${noSpace.toLocaleString()}</b><span>No spaces</span></div>
      <div class="stat"><b>${sentences}</b><span>Sentences</span></div>
      <div class="stat"><b>${paras}</b><span>Paragraphs</span></div>
      <div class="stat"><b>${words.length ? time(words.length / 238) : '0 sec'}</b><span>Reading time</span></div>
      <div class="stat"><b>${words.length ? time(words.length / 140) : '0 sec'}</b><span>Speaking time</span></div>
    </div>`;
  if (sentences) html += `<p class="note">Average sentence: <strong>${fmt(avg, 1)} words</strong>${avg > 25 ? ' (long; aim for 15–20 for easy reading)' : avg >= 10 ? ' (easy to read)' : ''}.</p>`;
  if (top.length) {
    html += `<p class="kicker" style="margin-top:6px">Most used words</p><div class="scroll"><table class="tbl"><tbody>${top.map(([w, n]) => `<tr><td>${esc(w)}</td><td class="n">${n}×</td><td class="n">${fmt(n / words.length * 100, 1)}%</td></tr>`).join('')}</tbody></table></div>`;
  }
  $('#out').innerHTML = html;
}
calc();
