const DIMS = [['width', '#iw'], ['depth', '#id'], ['height', '#ih']];

// Can a p×q rectangle pass through an a×b opening? Straight on, or only when tilted
// diagonally in the frame (Carver's condition for a rectangle inside a rectangle).
function fitsOpening(p, q, a, b) {
  if (p < q) [p, q] = [q, p];
  if (a < b) [a, b] = [b, a];
  if (p <= a && q <= b) return { how: 'straight', clear: Math.min(a - p, b - q) };
  if (p > a && q <= b) {
    const s = p * p + q * q - a * a;
    if (s >= 0 && b >= (2 * p * q * a + (p * p - q * q) * Math.sqrt(s)) / (p * p + q * q)) return { how: 'tilted', clear: 0 };
  }
  return null;
}

// Longest flat object of width w that can be carried horizontally around a
// 90° corner between hallways of widths A and B: min over θ of A/cosθ + B/sinθ − w/(sinθ·cosθ).
function maxCornerLength(A, B, w) {
  if (w >= Math.min(A, B)) return 0;
  let best = Infinity;
  for (let i = 1; i < 4000; i++) {
    const t = (i / 4000) * Math.PI / 2;
    const L = A / Math.cos(t) + B / Math.sin(t) - w / (Math.sin(t) * Math.cos(t));
    if (L < best) best = L;
  }
  return Math.max(0, best);
}

const POSE = {
  width: 'stood on its end (width pointing up)',
  depth: 'on its back (front facing up)',
  height: 'upright, the normal way',
};
const LEAD = { width: 'width', depth: 'depth', height: 'height' };

onAny('#iw, #id, #ih, #dw, #dh, #ha, #hb, #ch, #has-corner, input[name="unit"]', calc);

function calc() {
  const u = $('input[name="unit"]:checked').value;
  const tight = u === 'in' ? 0.5 : 1.3; // less than this much room counts as "tight"
  const item = Object.fromEntries(DIMS.map(([k, s]) => [k, val($(s))]));
  const dw = val($('#dw')), dh = val($('#dh'));
  const showCorner = $('#has-corner').checked;
  $('#corner-fields').hidden = !showCorner;
  const out = $('#out');
  if (![item.width, item.depth, item.height, dw, dh].every(n => n > 0)) {
    out.innerHTML = '<p class="empty">Enter all three furniture measurements and the door size.</p>';
    return;
  }
  const n = x => `${fmtMax(x, 1)} ${u}`;

  // Doorway: try passing through with each dimension as the "length" that goes through.
  const doorTries = DIMS.map(([lead]) => {
    const [p, q] = DIMS.filter(([k]) => k !== lead).map(([k]) => item[k]);
    return { lead, p, q, res: fitsOpening(p, q, dw, dh) };
  }).filter(t => t.res);
  doorTries.sort((a, b) => (a.res.how === b.res.how ? b.res.clear - a.res.clear : a.res.how === 'straight' ? -1 : 1));
  const door = doorTries[0];

  let html = '<p class="kicker">Doorway</p>';
  if (!door) {
    const smallest = Math.min(...DIMS.map(([k]) => item[k]));
    html += `<span class="verdict no">Won't fit</span><p class="big">It won't go through the door</p>
      <p class="sub">Even its smallest side (${n(smallest)}) plus the next one don't clear a ${n(dw)} × ${n(dh)} opening. Try removing the legs, taking the door off its hinges (usually gains about 1 ${u === 'in' ? 'inch' : 'cm'} or more), or checking if the piece comes apart.</p>`;
  } else {
    const isTight = door.res.how === 'tilted' || door.res.clear < tight;
    html += `<span class="verdict ${isTight ? 'tight' : 'ok'}">${isTight ? 'Fits, but tight' : 'Fits'}</span>
      <p class="big"><mark>Lead with the ${LEAD[door.lead]}</mark></p>
      <p class="sub">Carry it so the ${n(Math.max(door.p, door.q))} × ${n(Math.min(door.p, door.q))} side faces the doorway and the ${n(item[door.lead])} ${door.lead} goes through first.
      ${door.res.how === 'tilted' ? 'It only clears when tilted diagonally in the door frame.' : `You'll have about ${n(door.res.clear)} to spare.`}</p>`;
  }

  if (showCorner) {
    const A = val($('#ha')), B = val($('#hb')), ceil = val($('#ch'));
    html += '<p class="kicker" style="margin-top:8px">Hallway corner</p>';
    if (!(A > 0 && B > 0 && ceil > 0)) {
      html += '<p class="empty">Enter both hallway widths and the ceiling height.</p>';
    } else {
      // Try every pose: one dimension vertical (must clear the ceiling), the other two flat.
      const tries = [];
      DIMS.forEach(([up]) => {
        if (item[up] > ceil) return;
        const [k1, k2] = DIMS.filter(([k]) => k !== up).map(([k]) => k);
        [[k1, k2], [k2, k1]].forEach(([len, wid]) => {
          const max = maxCornerLength(A, B, item[wid]);
          tries.push({ up, len, wid, max, spare: max - item[len] });
        });
      });
      const goodOnes = tries.filter(t => t.spare >= 0).sort((a, b) => b.spare - a.spare);
      if (goodOnes.length) {
        const t = goodOnes.find(x => x.up === 'height') || goodOnes[0];
        const isTight = t.spare < tight;
        html += `<span class="verdict ${isTight ? 'tight' : 'ok'}">${isTight ? 'Fits, but tight' : 'Fits'}</span>
          <p class="sub">Carry it <strong>${POSE[t.up]}</strong>, ${t.len} first. In that position anything up to ${n(t.max)} long makes the turn, and it's ${n(item[t.len])}.</p>`;
      } else {
        const longest = tries.length ? tries.reduce((a, b) => (a.spare >= b.spare ? a : b)) : null;
        html += `<span class="verdict no">Won't turn the corner</span>
          <p class="sub">${longest ? `The best position (${POSE[longest.up]}) still needs ${n(-longest.spare)} more room.` : 'Every position is taller than the ceiling.'}
          Tilting it up into the space near the ceiling can sometimes help a little more than this flat check allows.</p>`;
      }
    }
  }
  html += `<p class="note">Measure the furniture at its widest points, including arms and feet, and the door opening with the door fully open. Soft sofas can squeeze about 1 ${u === 'in' ? 'inch' : '2 cm'}; solid wood can't.</p>`;
  out.innerHTML = html;
}
calc();
