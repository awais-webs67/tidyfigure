const probe = document.createElement('canvas').getContext('2d');

// Let the browser parse any CSS colour (hex, rgb(), hsl(), names) and hand back RGB.
function parse(str) {
  str = str.trim();
  if (/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(str)) str = '#' + str;
  probe.fillStyle = '#010203';
  probe.fillStyle = str;
  const v = probe.fillStyle;
  if (v === '#010203' && !/^#?010203$/i.test(str)) return null;
  if (v.startsWith('#')) return [1, 3, 5].map(i => parseInt(v.slice(i, i + 2), 16));
  const m = v.match(/[\d.]+/g);
  return m ? m.slice(0, 3).map(Number) : null;
}
const hex = ([r, g, b]) => '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('').toUpperCase();
function hsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  let h = 0, s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}
function hsv([r, g, b]) {
  const max = Math.max(r, g, b) / 255, min = Math.min(r, g, b) / 255;
  return [hsl([r, g, b])[0], Math.round(max ? (max - min) / max * 100 : 0), Math.round(max * 100)];
}
function cmyk([r, g, b]) {
  const k = 1 - Math.max(r, g, b) / 255;
  if (k === 1) return [0, 0, 0, 100];
  return [r, g, b].map(c => Math.round((1 - c / 255 - k) / (1 - k) * 100)).concat(Math.round(k * 100));
}
const lum = rgb => rgb.map(c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }).reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const mix = (a, b, t) => a.map((c, i) => c + (b[i] - c) * t);

$('#pick').addEventListener('input', () => { $('#txt').value = $('#pick').value.toUpperCase(); render(); });
$('#txt').addEventListener('input', render);
$('#out').addEventListener('click', e => { const b = e.target.closest('button[data-v]'); if (b) copyText(b.dataset.v, b); });
$('#scale').addEventListener('click', e => { const b = e.target.closest('button[data-v]'); if (b) { copyText(b.dataset.v); $('#txt').value = b.dataset.v; render(); } });

function render() {
  const rgb = parse($('#txt').value);
  if (!rgb) { $('#out').innerHTML = '<p class="empty">That isn’t a colour I recognise. Try #1E90FF, rgb(30, 144, 255), hsl(210, 100%, 56%) or “dodgerblue”.</p>'; return; }
  const H = hex(rgb), [h, s, l] = hsl(rgb), [, sv, v] = hsv(rgb), [c, m, y, k] = cmyk(rgb);
  $('#pick').value = H.toLowerCase();
  $('#swatch').style.background = H;
  const rows = [['HEX', H], ['RGB', `rgb(${rgb.map(Math.round).join(', ')})`], ['HSL', `hsl(${h}, ${s}%, ${l}%)`], ['HSV / HSB', `${h}°, ${sv}%, ${v}%`], ['CMYK', `${c}%, ${m}%, ${y}%, ${k}%`]];
  const cw = contrast(rgb, [255, 255, 255]), cb = contrast(rgb, [0, 0, 0]);
  const grade = r => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA large text' : 'Fail');
  $('#out').innerHTML = `<p class="kicker">Colour values</p>
    <ul class="files">${rows.map(([name, value]) => `<li><span class="meta"><small>${name}</small><b style="font-family:var(--f-num);font-weight:500">${value}</b></span><button type="button" class="btn ghost" data-v="${value}">Copy</button></li>`).join('')}</ul>
    <p class="kicker" style="margin-top:6px">Text contrast (WCAG)</p>
    <div class="statgrid">
      <div class="stat" style="background:${H};color:#fff;border-color:${H}"><b>${cw.toFixed(2)}:1</b><span style="color:#fff">White text · ${grade(cw)}</span></div>
      <div class="stat" style="background:${H};color:#000;border-color:${H}"><b>${cb.toFixed(2)}:1</b><span style="color:#000">Black text · ${grade(cb)}</span></div>
    </div>`;
  const steps = [0.9, 0.75, 0.6, 0.45, 0.3, 0.15].map(t => mix(rgb, [255, 255, 255], t)).concat([rgb], [0.15, 0.3, 0.45, 0.6].map(t => mix(rgb, [0, 0, 0], t)));
  $('#scale').innerHTML = steps.map(col => { const x = hex(col); return `<button type="button" data-v="${x}" title="${x}" aria-label="${x}" style="aspect-ratio:1;border-radius:8px;border:${x === H ? '3px solid var(--ink)' : '1px solid var(--line)'};background:${x};cursor:pointer;padding:0"></button>`; }).join('');
}
render();
