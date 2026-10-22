// Common pans: [label, shape, d1, d2] in inches and centimetres.
const PRESETS = {
  in: [['8″ round', 'round', 8], ['9″ round', 'round', 9], ['8″ square', 'square', 8], ['9″ square', 'square', 9], ['9×13″', 'rect', 9, 13], ['9×5″ loaf', 'rect', 5, 9], ['10×15″ sheet', 'rect', 10, 15]],
  cm: [['20 cm round', 'round', 20], ['23 cm round', 'round', 23], ['20 cm square', 'square', 20], ['23 cm square', 'square', 23], ['23×33 cm', 'rect', 23, 33], ['23×13 cm loaf', 'rect', 13, 23], ['25×38 cm tray', 'rect', 25, 38]],
};
const unit = () => $('input[name="unit"]:checked').value;

function drawChips() {
  $$('.chips').forEach(box => {
    const pan = box.dataset.for;
    box.innerHTML = PRESETS[unit()].map((p, i) => `<button type="button" class="chip" data-pan="${pan}" data-i="${i}">${p[0]}</button>`).join('');
  });
}
document.addEventListener('click', e => {
  const chip = e.target.closest('.chip[data-pan]');
  if (!chip) return;
  const [, shape, d1, d2] = PRESETS[unit()][chip.dataset.i];
  const p = chip.dataset.pan;
  $(`#${p}-shape`).value = shape;
  $(`#${p}-d1`).value = d1;
  if (d2) $(`#${p}-d2`).value = d2;
  calc();
});

function pan(p) {
  const shape = $(`#${p}-shape`).value;
  $(`#${p}-d2-wrap`).hidden = shape !== 'rect';
  $(`#${p}-d1-label`).textContent = shape === 'round' ? 'Diameter' : shape === 'square' ? 'Side' : 'Width';
  const d1 = val($(`#${p}-d1`)), d2 = val($(`#${p}-d2`));
  const area = shape === 'round' ? Math.PI * (d1 / 2) ** 2 : shape === 'square' ? d1 * d1 : d1 * d2;
  return { shape, area };
}

// Turn 1.84 into "1¾" style kitchen fractions, to the nearest quarter.
function kitchen(x) {
  const q = Math.round(x * 4) / 4;
  const whole = Math.floor(q), frac = q - whole;
  const f = { 0.25: '¼', 0.5: '½', 0.75: '¾' }[frac] || '';
  return (whole ? String(whole) : '') + f || '0';
}

onAny('#a-shape, #a-d1, #a-d2, #b-shape, #b-d1, #b-d2', calc);
onAny('input[name="unit"]', () => { drawChips(); calc(); });

function calc() {
  const a = pan('a'), b = pan('b');
  const au = unit() === 'in' ? 'sq in' : 'cm²';
  const out = $('#out');
  if (!(a.area > 0 && b.area > 0)) { out.innerHTML = '<p class="empty">Enter the size of both pans.</p>'; return; }
  const factor = b.area / a.area;
  const depth = a.area / b.area; // batter depth if you don't change the recipe
  let html = `<p class="kicker">Multiply every ingredient by</p><p class="big"><mark>× ${fmt(factor, 2)}</mark></p>
    <p class="sub">About ${kitchen(factor)} times the recipe. Your pan holds ${fmtMax(b.area, 0)} ${au}, the recipe's pan ${fmtMax(a.area, 0)} ${au}.</p>`;
  if (Math.abs(factor - 1) < 0.05) {
    html += '<p class="note">The pans are almost the same size. Use the recipe as it is.</p>';
  } else {
    html += `<p class="note">If you keep the recipe as it is, the batter will be <strong>${fmt(Math.abs(depth - 1) * 100, 0)}% ${depth > 1 ? 'deeper' : 'shallower'}</strong>. ${depth > 1
      ? 'Deeper batter needs a longer bake, often at a slightly lower temperature (about 25 °F / 15 °C less) so the edges don\'t burn.'
      : 'Shallower batter bakes faster. Start checking about a third of the way earlier than the recipe says.'}</p>
      <p class="note">Scaled the recipe instead? Keep the same temperature and start checking 5–10 minutes before the recipe time.</p>`;
  }
  out.innerHTML = html;
}
drawChips();
calc();
