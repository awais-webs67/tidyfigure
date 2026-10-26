let cols = ['#1B3A5C', '#F4F1EA', '#E07A2E'];
const q = new URLSearchParams(location.search).get('c');
if (q) { const l = q.split(/[,-]/).map(h => Color.hexToRgb(h) && Color.rgbToHex(Color.hexToRgb(h))).filter(Boolean); if (l.length >= 2) cols = l.slice(0, 5); }
const rgb = h => Color.hexToRgb(h), hsl = h => Color.rgbToHsl(rgb(h));
function list() {
  $('#list').innerHTML = cols.map((c, i) => `<div class="row"><input type="color" value="${c}" data-i="${i}" aria-label="Colour ${i + 1}"><input type="text" value="${c}" data-t="${i}" maxlength="7" aria-label="Colour ${i + 1} hex code"><span class="sub" style="min-width:90px">${esc(Color.name(rgb(c)).name)}</span>${cols.length > 2 ? `<button type="button" class="x" data-x="${i}" aria-label="Remove colour">×</button>` : ''}</div>`).join('');
  $('#add').disabled = cols.length >= 5;
}
const hueGap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
const neutral = h => { const [, s, l] = hsl(h); return s < 14 || l < 9 || l > 94; };
function harmony() {
  const ch = cols.filter(c => !neutral(c)), hs = ch.map(c => hsl(c)[0]);
  if (ch.length === 0) return ['Neutral', 'All neutral colours: timeless and easy to combine. Add one accent colour if it feels flat.', 9];
  if (ch.length === 1) return ['Neutral plus one colour', 'A single colour against neutrals is one of the safest, most elegant combinations.', 9];
  const gaps = []; for (let i = 0; i < hs.length; i++) for (let j = i + 1; j < hs.length; j++) gaps.push(hueGap(hs[i], hs[j]));
  const max = Math.max(...gaps), all = (lo, hi) => gaps.every(g => g >= lo && g <= hi);
  if (all(0, 12)) return ['Monochromatic', 'Shades of one hue: calm and cohesive. Make sure they differ enough in lightness.', 8.5];
  if (all(0, 45)) return ['Analogous', 'Neighbouring hues: natural and harmonious. Let one colour lead.', 8.5];
  if (ch.length === 2 && max >= 160) return ['Complementary', 'Opposite hues: bold and energetic. Use one as the main colour and the other as an accent.', 8];
  if (ch.length === 3 && gaps.every(g => g >= 100 && g <= 140)) return ['Triadic', 'Three evenly spaced hues: lively. Keep one dominant and soften the others.', 7.5];
  if (ch.length === 3 && gaps.filter(g => g >= 130).length === 2 && gaps.some(g => g <= 70)) return ['Split-complementary', 'A hue with the two neighbours of its opposite: strong contrast with less tension.', 8];
  if (ch.length === 4 && gaps.filter(g => g >= 150).length >= 2) return ['Tetradic (double complementary)', 'Two pairs of opposites: rich but busy. Let one colour dominate and use the others sparingly.', 6.5];
  return ['Free combination', 'These hues don’t follow a classic harmony. They can still work if one colour dominates and the others are muted or used in small amounts.', 5.5];
}
// Colour-blindness simulation (Machado et al. 2009, severity 1), applied in linear RGB.
const SIM = { Protanopia: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998], Deuteranopia: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04294, 0.968881], Tritanopia: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.3039] };
const lin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }, gam = v => 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
function sim(h, m) { const [r, g, b] = rgb(h).map(lin); return Color.rgbToHex([m[0] * r + m[1] * g + m[2] * b, m[3] * r + m[4] * g + m[5] * b, m[6] * r + m[7] * g + m[8] * b].map(v => Math.max(0, Math.min(255, gam(Math.max(0, Math.min(1, v))))))); }
function palettes(base) {
  const [h, s, l] = hsl(base), mk = (dh, ds = 0, dl = 0) => Color.rgbToHex(Color.hslToRgb([h + dh, Math.max(5, Math.min(95, s + ds)), Math.max(8, Math.min(95, l + dl))]));
  return [
    ['Complementary', [base, mk(180), mk(0, -30, 40)]],
    ['Analogous', [mk(-30), base, mk(30)]],
    ['Triadic', [base, mk(120), mk(240)]],
    ['Split-complementary', [base, mk(150), mk(210)]],
    ['Monochromatic', [mk(0, 0, -25), base, mk(0, -10, 25), mk(0, -20, 42)]],
    ['With neutrals', [base, '#FFFFFF', '#2B2F33', '#E8E2D6']],
  ];
}
function check() {
  const n = cols.length, [hname, hdesc, base] = harmony();
  let score = base; const tips = [];
  const pairs = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push([i, j, Color.contrast(rgb(cols[i]), rgb(cols[j])), Color.diff(rgb(cols[i]), rgb(cols[j]))]);
  const bestC = Math.max(...pairs.map(p => p[2]));
  if (bestC < 4.5) { score -= 1.5; tips.push('No pair reaches 4.5:1 contrast, so text will be hard to read. Add a much lighter or darker colour.'); }
  pairs.filter(p => p[3] < 8).forEach(([i, j]) => { score -= 1; tips.push(`Colours ${i + 1} and ${j + 1} are almost the same. Use one, or make them clearly different.`); });
  const vivid = cols.filter(c => { const [, s, l] = hsl(c); return s > 70 && l > 35 && l < 65; });
  if (vivid.length >= 3) { score -= 1.5; tips.push('Three or more very bright colours compete for attention. Mute or darken some of them.'); }
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const a = hsl(cols[i]), b = hsl(cols[j]), g = hueGap(a[0], b[0]); if (a[1] > 65 && b[1] > 65 && Math.abs(a[2] - b[2]) < 15 && g > 50 && g < 150) { score -= 1; tips.push(`Colours ${i + 1} and ${j + 1} are both vivid and equally bright, so they may seem to vibrate. Darken or soften one.`); } }
  const blind = Object.entries(SIM).flatMap(([k, m]) => pairs.filter(p => p[3] >= 8 && Color.diff(rgb(sim(cols[p[0]], m)), rgb(sim(cols[p[1]], m))) < 7).map(p => `${k}: colours ${p[0] + 1} and ${p[1] + 1} look alike`));
  if (blind.length) tips.push(`Colour-blind check: ${blind.slice(0, 3).join('; ')}. Add a lightness difference or labels.`);
  score = Math.max(1, Math.min(10, score));
  const verdict = score >= 8 ? ['ok', 'These colours work well together'] : score >= 6 ? ['tight', 'Can work with care'] : ['no', 'Likely to clash'];
  // Page samples
  $('#strip').innerHTML = cols.map(c => `<div style="background:${c};color:${Color.lum(rgb(c)) > 0.4 ? '#000' : '#fff'}">${c}</div>`).join('');
  const byL = [...cols].sort((a, b) => Color.lum(rgb(b)) - Color.lum(rgb(a))), bg = byL[0], fg = byL[byL.length - 1], acc = cols.filter(c => c !== bg && c !== fg)[0] || fg;
  const sm = $('#sample'); sm.style.background = bg; sm.style.color = fg; sm.querySelector('h4').style.color = fg; const btn = sm.querySelector('span'); btn.style.background = acc; btn.style.color = Color.contrast(rgb(acc), [255, 255, 255]) > Color.contrast(rgb(acc), [0, 0, 0]) ? '#fff' : '#000';
  $('#sim').innerHTML = [['Normal', null], ...Object.entries(SIM)].map(([k, m]) => `<div><b style="width:96px">${k}</b><span>${cols.map(c => `<i style="background:${m ? sim(c, m) : c}"></i>`).join('')}</span></div>`).join('');
  const badge = r => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA large' : 'Fail');
  $('#out').innerHTML = `<p class="kicker">Verdict</p><span class="verdict ${verdict[0]}">${verdict[1]}</span>
    <div class="statgrid"><div class="stat"><b>${score.toFixed(1)}/10</b><span>harmony score</span></div><div class="stat"><b style="font-size:18px">${hname}</b><span>colour scheme</span></div></div>
    <p class="sub">${hdesc}</p>${tips.length ? `<ul style="margin:0;padding-left:1.2em;color:var(--muted)">${tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
    <p class="group-title">Text contrast (WCAG)</p>
    <div class="scroll"><table class="tbl cc-mx"><thead><tr><th>Text ↓ on →</th>${cols.map(c => `<th><i style="display:inline-block;width:18px;height:18px;border-radius:4px;background:${c};border:1px solid var(--line)"></i></th>`).join('')}</tr></thead><tbody>
      ${cols.map((a, i) => `<tr><th><i style="display:inline-block;width:18px;height:18px;border-radius:4px;background:${a};border:1px solid var(--line)"></i></th>${cols.map((b, j) => { if (i === j) return '<td>–</td>'; const r = Color.contrast(rgb(a), rgb(b)); return `<td style="background:${b};color:${a}"><b>${r.toFixed(1)}</b><small>${badge(r)}</small></td>`; }).join('')}</tr>`).join('')}
    </tbody></table></div>
    <p class="group-title">Palette ideas from colour 1 (click to use)</p>
    <div class="cc-pal">${palettes(cols[0]).map(([nm, p]) => `<button type="button" data-p="${p.join(',')}"><span>${p.map(c => `<i style="background:${c}"></i>`).join('')}</span>${nm}</button>`).join('')}</div>
    <div class="btns"><button type="button" class="btn ghost" id="share">Copy link to this palette</button><button type="button" class="btn ghost" id="css">Copy as CSS</button></div>`;
}
function update() { list(); check(); }
$('#list').addEventListener('input', e => {
  const i = e.target.dataset.i ?? e.target.dataset.t; if (i === undefined) return;
  const c = Color.hexToRgb(e.target.value); if (!c) return;
  cols[+i] = Color.rgbToHex(c);
  if (e.target.dataset.i !== undefined) { const t = $(`[data-t="${i}"]`); t.value = cols[+i]; } else { $(`[data-i="${i}"]`).value = cols[+i]; }
  e.target.closest('.row').querySelector('.sub').textContent = Color.name(c).name; check();
});
$('#list').addEventListener('click', e => { const x = e.target.closest('[data-x]'); if (x) { cols.splice(+x.dataset.x, 1); update(); } });
$('#add').addEventListener('click', () => { if (cols.length < 5) { cols.push(palettes(cols[0])[2][1][1]); update(); } });
$('#rand').addEventListener('click', () => { const p = palettes(Color.rgbToHex(Color.hslToRgb([Math.random() * 360, 45 + Math.random() * 40, 35 + Math.random() * 25]))); cols = p[Math.floor(Math.random() * p.length)][1].slice(0, 4); update(); });
$('#out').addEventListener('click', e => {
  const p = e.target.closest('[data-p]'); if (p) { cols = p.dataset.p.split(','); update(); return; }
  if (e.target.id === 'share') { const u = new URL(location.href.split('?')[0]); u.searchParams.set('c', cols.map(c => c.slice(1)).join('-')); copyText(u.toString(), e.target); }
  if (e.target.id === 'css') copyText(`:root {\n${cols.map((c, i) => `  --color-${i + 1}: ${c}; /* ${Color.name(rgb(c)).name} */`).join('\n')}\n}`, e.target);
});
update();
