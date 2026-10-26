const SW = { White: '#FFFFFF', Cream: '#F3EEDF', Beige: '#D9C9A8', Khaki: '#B9A57A', Tan: '#A97C50', Camel: '#C19A6B', Brown: '#6B4226', 'Dark brown': '#3D2817', 'Light grey': '#C9CCCF', Grey: '#8A8F94', Charcoal: '#3A3F44', Black: '#141414', Navy: '#1C2A4A', 'Light blue': '#A9C8E8', Blue: '#2F5DA8', Denim: '#4A6A8C', Teal: '#1F6F75', Olive: '#5E6B3A', 'Bottle green': '#1F4D36', Emerald: '#1E7A55', Mint: '#B6E2C8', Burgundy: '#6E1E2E', Red: '#C42B2B', Pink: '#F1B5C4', 'Hot pink': '#D9467A', Lavender: '#C9B8E2', Purple: '#5B2E7A', Mustard: '#D2A021', Yellow: '#F2D54C', Orange: '#E07A2E', Rust: '#A44A25', Coral: '#F08A6E' };
const PARTS = [['jacket', 'Jacket / blazer', 'Navy'], ['top', 'Shirt or top', 'White'], ['acc', 'Tie / scarf', 'Burgundy'], ['bottom', 'Trousers / skirt', 'Grey'], ['shoes', 'Shoes and belt', 'Brown']];
const COMBOS = [
  ['Business classic', { jacket: 'Navy', top: 'White', acc: 'Burgundy', bottom: 'Grey', shoes: 'Brown' }, 1, 'tie'],
  ['Boardroom', { jacket: 'Charcoal', top: 'Light blue', acc: 'Navy', bottom: 'Charcoal', shoes: 'Black' }, 1, 'tie'],
  ['Black tie', { jacket: 'Black', top: 'White', acc: 'Black', bottom: 'Black', shoes: 'Black' }, 1, 'tie'],
  ['Summer suit', { jacket: 'Beige', top: 'Light blue', acc: 'Navy', bottom: 'Beige', shoes: 'Tan' }, 1, 'tie'],
  ['Smart casual', { jacket: 'Navy', top: 'White', bottom: 'Khaki', shoes: 'Brown' }, 1, 'none'],
  ['Navy and khaki', { top: 'Navy', bottom: 'Khaki', shoes: 'Brown' }, 0, 'none'],
  ['Light blue and navy', { top: 'Light blue', bottom: 'Navy', shoes: 'Tan' }, 0, 'none'],
  ['Olive and beige', { top: 'Olive', bottom: 'Beige', shoes: 'White' }, 0, 'none'],
  ['Monochrome', { top: 'Black', bottom: 'Black', shoes: 'White' }, 0, 'none'],
  ['White and denim', { top: 'White', bottom: 'Denim', shoes: 'White' }, 0, 'none'],
  ['Pink and grey', { top: 'Pink', bottom: 'Grey', shoes: 'Black' }, 0, 'none'],
  ['Burgundy and grey', { top: 'Burgundy', bottom: 'Light grey', shoes: 'Black' }, 0, 'none'],
  ['Mustard and navy', { top: 'Mustard', bottom: 'Navy', shoes: 'Brown' }, 0, 'none'],
  ['Emerald and black', { top: 'Emerald', bottom: 'Black', acc: 'Cream', shoes: 'Black' }, 0, 'scarf'],
  ['Cream and camel', { top: 'Cream', bottom: 'Camel', shoes: 'Brown' }, 0, 'none'],
  ['Lavender and white', { top: 'Lavender', bottom: 'White', acc: 'Purple', shoes: 'Tan' }, 0, 'scarf'],
];
const S = Object.fromEntries(PARTS.map(([k, , d]) => [k, SW[d]]));
const rgb = h => Color.hexToRgb(h), hsl = h => Color.rgbToHsl(rgb(h));
const nm = h => { const e = Object.entries(SW).find(([, v]) => v.toLowerCase() === h.toLowerCase()); return e ? e[0] : Color.name(rgb(h)).name; };
$('#parts').innerHTML = PARTS.map(([k, label]) => `<div class="om-part" data-part="${k}"><b><span>${label}</span><span class="sub" data-name></span></b><div class="om-sw">${Object.entries(SW).map(([n, h]) => `<button type="button" data-c="${h}" style="background:${h}" title="${n}" aria-label="${n}"></button>`).join('')}<input type="color" aria-label="Custom colour"></div></div>`).join('');
$('#combos').innerHTML = COMBOS.map(([n, o]) => `<button type="button" data-n="${esc(n)}"><span>${['jacket', 'top', 'bottom', 'shoes'].filter(k => o[k]).map(k => `<i style="background:${SW[o[k]]}"></i>`).join('')}</span>${esc(n)}</button>`).join('');
function kind(h) {
  const [hu, s, l] = hsl(h);
  if (s < 12 || l > 93 || l < 13) return 'neutral';
  if (hu >= 205 && hu <= 250 && l < 32) return 'neutral'; // navy
  if (hu >= 195 && hu <= 225 && s < 45 && l < 55) return 'neutral'; // denim, slate
  if (hu >= 18 && hu <= 50 && s < 60 && l > 18 && l < 88) return 'neutral'; // beige, khaki, tan, camel, brown
  if (hu >= 60 && hu <= 95 && s < 40 && l < 45) return 'neutral'; // olive drab
  return (s > 55 && l > 35 && l < 70) ? 'bright' : 'colour';
}
const hueGap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
const isNavy = h => { const [hu, s, l] = hsl(h); return hu >= 205 && hu <= 250 && l < 30 && s > 20; }, isBlack = h => hsl(h)[2] < 13;
function rate() {
  const jk = $('#jk').value === '1', acc = $('#acc').value;
  const pieces = [['top', S.top], ['bottom', S.bottom], ['shoes', S.shoes]];
  if (jk) pieces.unshift(['jacket', S.jacket]);
  if (acc !== 'none') pieces.push(['acc', S.acc]);
  const cols = pieces.map(p => p[1]), kinds = cols.map(kind), colourful = cols.filter((c, i) => kinds[i] !== 'neutral' && pieces[i][0] !== 'shoes');
  let score = 8.5; const good = [], tips = [];
  if (!colourful.length) good.push('An all-neutral outfit: timeless and easy to wear.');
  if (colourful.length === 1) { score += 0.8; good.push(`${nm(colourful[0])} stands out nicely against the neutrals.`); }
  if (colourful.length >= 2) {
    const hs = colourful.map(c => hsl(c)[0]); let worst = 0;
    for (let i = 0; i < hs.length; i++) for (let j = i + 1; j < hs.length; j++) { const g = hueGap(hs[i], hs[j]); const harmonious = g < 35 || g > 155 || (g > 105 && g < 135); if (!harmonious) worst++; }
    if (worst) { score -= 1.6 * worst; tips.push('Your colours aren’t related on the colour wheel, so they compete. Swap one for a neutral (navy, grey, beige, white).'); }
    else good.push('Your colours are related on the colour wheel, so they work together.');
  }
  if (cols.filter(c => kind(c) === 'bright').length >= 2) { score -= 1.5; tips.push('Two or more bright colours make the outfit loud. Keep one bright piece and tone down the rest.'); }
  const t = jk ? S.jacket : S.top, b = S.bottom, d = Color.diff(rgb(t), rgb(b)), dl = Math.abs(hsl(S.top)[2] - hsl(b)[2]);
  if (d > 2 && d < 12) { score -= 1.8; tips.push(`${nm(t)} and ${nm(b)} are close but not the same, which can look like a mismatch. Match them exactly (a suit) or choose clearly different shades.`); }
  if ((isNavy(t) && isBlack(b)) || (isBlack(t) && isNavy(b))) { score -= 1.2; tips.push('Navy and black are hard to pair because they look almost alike. Add white or grey between them.'); }
  if (dl > 25) good.push('Good light-dark contrast between your top and bottom.');
  else if (dl < 10 && d >= 12 && !(jk && Color.diff(rgb(S.jacket), rgb(b)) < 3)) tips.push('Top and bottom are similarly light or dark. More contrast is usually more flattering.');
  if (acc === 'tie') { if (hsl(S.acc)[2] > hsl(S.top)[2] + 5) { score -= 0.8; tips.push('A tie usually looks best darker than the shirt.'); } else good.push('The tie is darker than the shirt, as it should be.'); }
  if (jk && isBlack(S.jacket) && kind(S.shoes) === 'neutral' && hsl(S.shoes)[0] > 15 && hsl(S.shoes)[0] < 45 && !isBlack(S.shoes)) { score -= 0.8; tips.push('Brown shoes with a black suit break a classic rule; black shoes are safer.'); }
  const hs2 = cols.map(c => hsl(c)), red = hs2.some(([h, s, l]) => (h < 12 || h > 348) && s > 50 && l > 30), green = hs2.some(([h, s, l]) => h > 95 && h < 150 && s > 40 && l > 25);
  if (red && green) { score -= 1; tips.push('Bright red with green looks festive (Christmas). Use a darker burgundy or bottle green if that’s not the plan.'); }
  score = Math.max(1, Math.min(10, score));
  const v = score >= 8 ? ['ok', 'Great match'] : score >= 6 ? ['tight', 'Works, could be better'] : ['no', 'Colours clash'];
  // Colours that go with the top
  const top = jk ? S.jacket : S.top, th = hsl(top)[0];
  const sugg = Object.entries(SW).filter(([, h]) => { const k = kind(h); if (Color.diff(rgb(h), rgb(top)) < 12) return false; if (k === 'neutral') return !(isNavy(top) && isBlack(h)) && !(isBlack(top) && isNavy(h)); if (kind(top) === 'neutral') return k !== 'bright' || hsl(h)[2] < 60; const g = hueGap(th, hsl(h)[0]); return (g < 30 || g > 160) && k !== 'bright'; }).slice(0, 14);
  $('#out').innerHTML = `<p class="kicker">Outfit score</p><div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap"><p class="huge" style="text-align:left;font-size:56px"><mark>${score.toFixed(1)}</mark></p><span class="verdict ${v[0]}">${v[1]}</span></div>
    ${good.length ? `<ul style="margin:0;padding-left:1.2em">${good.map(g => `<li>${esc(g)}</li>`).join('')}</ul>` : ''}
    ${tips.length ? `<p class="group-title">Tips</p><ul style="margin:0;padding-left:1.2em;color:var(--muted)">${tips.map(g => `<li>${esc(g)}</li>`).join('')}</ul>` : ''}
    <p class="group-title">Goes well with your ${jk ? 'jacket' : 'top'} (${esc(nm(top))})</p><div class="om-sw">${sugg.map(([n, h]) => `<button type="button" data-sug="${h}" style="background:${h}" title="${n}: use for trousers" aria-label="Use ${n} for trousers"></button>`).join('')}</div><p class="note">Tap a colour to try it for the trousers.</p>`;
}
function paint() {
  const fill = (id, c) => { const el = $('#' + id); if (el) el.setAttribute('fill', c); };
  const jk = $('#jk').value === '1', acc = $('#acc').value, skin = $('#skin').value;
  ['skin1', 'skin2', 'skin3', 'skin4'].forEach(id => fill(id, skin));
  fill('pTop', S.top); fill('pCollar', S.top); fill('pBottom', S.bottom); fill('pShoe1', S.shoes); fill('pShoe2', S.shoes); fill('pBelt', S.shoes);
  fill('pJk1', S.jacket); fill('pJk2', S.jacket); fill('pTie', S.acc); fill('pScarf', S.acc);
  $('#pTop').setAttribute('stroke', 'rgba(0,0,0,.12)'); $('#pBottom').setAttribute('stroke', 'rgba(0,0,0,.12)');
  $('#gJacket').toggleAttribute('hidden', !jk); $('#gTie').toggleAttribute('hidden', acc !== 'tie'); $('#gScarf').toggleAttribute('hidden', acc !== 'scarf');
  $$('[data-part]').forEach(p => { const k = p.dataset.part, show = (k !== 'jacket' || jk) && (k !== 'acc' || acc !== 'none'); p.hidden = !show; p.querySelector('[data-name]').textContent = nm(S[k]); p.querySelectorAll('[data-c]').forEach(b => b.classList.toggle('on', b.dataset.c.toLowerCase() === S[k].toLowerCase())); p.querySelector('input[type=color]').value = S[k]; });
  rate();
}
$('#parts').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) { S[b.closest('[data-part]').dataset.part] = b.dataset.c; paint(); } });
$('#parts').addEventListener('input', e => { if (e.target.type === 'color') { S[e.target.closest('[data-part]').dataset.part] = e.target.value.toUpperCase(); paint(); } });
$('#out').addEventListener('click', e => { const b = e.target.closest('[data-sug]'); if (b) { S.bottom = b.dataset.sug; paint(); } });
$('#combos').addEventListener('click', e => { const b = e.target.closest('[data-n]'); if (!b) return; const [, o, jk, acc] = COMBOS.find(c => c[0] === b.dataset.n); Object.entries(o).forEach(([k, n]) => { S[k] = SW[n]; }); $('#jk').value = String(jk); $('#acc').value = acc; paint(); toast(`Outfit: ${b.dataset.n}`); });
onAny('#jk, #acc, #skin', paint);
paint();
