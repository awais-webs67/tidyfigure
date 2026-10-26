let hz = 0;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
function ratio(w, h) {
  const named = [[16, 9], [16, 10], [4, 3], [3, 2], [21, 9], [32, 9], [5, 4], [19.5, 9], [20, 9], [18, 9]];
  const r = Math.max(w, h) / Math.min(w, h), near = named.find(([a, b]) => Math.abs(a / b - r) < 0.02);
  const d = gcd(w, h) || 1, exact = `${w / d}:${h / d}`;
  return near ? `${near[0]}:${near[1]}${w < h ? ' (portrait)' : ''}` : exact;
}
function rows() {
  const s = screen, dpr = window.devicePixelRatio || 1, pw = Math.round(s.width * dpr), ph = Math.round(s.height * dpr);
  const o = (s.orientation && s.orientation.type) || (innerWidth > innerHeight ? 'landscape' : 'portrait');
  return [
    ['Screen (CSS pixels)', `${s.width} × ${s.height}`],
    ['Real pixels', `${pw} × ${ph}`],
    ['Device pixel ratio', fmtMax(dpr, 3)],
    ['Browser window', `${innerWidth} × ${innerHeight}`],
    ['Available screen', `${s.availWidth} × ${s.availHeight}`],
    ['Aspect ratio', ratio(s.width, s.height)],
    ['Refresh rate', hz ? `about ${hz} Hz` : 'measuring…'],
    ['Colour depth', `${s.colorDepth}-bit`],
    ['Wide colour (P3)', matchMedia('(color-gamut: p3)').matches ? 'yes' : 'no'],
    ['HDR', matchMedia('(dynamic-range: high)').matches ? 'yes' : 'no'],
    ['Orientation', o.replace('-primary', '').replace('-secondary', ' (flipped)')],
    ['Touch screen', navigator.maxTouchPoints > 0 ? `yes (${navigator.maxTouchPoints} points)` : 'no'],
  ];
}
function show() {
  const dpr = window.devicePixelRatio || 1;
  $('#res').textContent = `${screen.width} × ${screen.height}`;
  $('#real').textContent = dpr !== 1 ? `${Math.round(screen.width * dpr)} × ${Math.round(screen.height * dpr)} real pixels (pixel ratio ${fmtMax(dpr, 3)})` : 'Pixel ratio 1: these are real pixels.';
  $('#out').innerHTML = `<p class="kicker">Details</p><div class="scroll"><table class="tbl"><tbody>${rows().map(([k, v]) => `<tr><td>${k}</td><td class="n">${esc(v)}</td></tr>`).join('')}</tbody></table></div>`;
}
function measureHz() {
  let n = 0, t0 = 0;
  const f = t => { if (!t0) t0 = t; n++; if (t - t0 < 1000) requestAnimationFrame(f); else { const raw = n * 1000 / (t - t0), common = [30, 50, 60, 72, 75, 90, 100, 120, 144, 165, 170, 180, 200, 240, 360]; hz = common.reduce((a, b) => (Math.abs(b - raw) < Math.abs(a - raw) ? b : a)); show(); } };
  requestAnimationFrame(f);
}
window.addEventListener('resize', show);
$('#copy').addEventListener('click', e => copyText(rows().map(([k, v]) => `${k}: ${v}`).join('\n'), e.currentTarget));
show(); setTimeout(measureHz, 300);
