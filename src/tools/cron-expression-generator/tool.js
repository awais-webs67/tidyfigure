$('#b-hour').innerHTML = '<option value="*">every hour</option><option value="*/2">every 2 hours</option><option value="*/6">every 6 hours</option>' + Array.from({ length: 24 }, (x, h) => `<option value="${h}"${h === 9 ? ' selected' : ''}>${String(h).padStart(2, '0')}:00 (${h % 12 || 12} ${h < 12 ? 'am' : 'pm'})</option>`).join('');
onAny('#expr', run);
onAny('#b-min, #b-hour, #b-dow', () => { const [dom, dow] = $('#b-dow').value.split('|'); $('#expr').value = `${$('#b-min').value} ${$('#b-hour').value} ${dom} * ${dow}`; run(); });
$('#presets').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) { $('#expr').value = b.dataset.e; run(); } });

const MACROS = { '@yearly': '0 0 1 1 *', '@annually': '0 0 1 1 *', '@monthly': '0 0 1 * *', '@weekly': '0 0 * * 0', '@daily': '0 0 * * *', '@midnight': '0 0 * * *', '@hourly': '0 * * * *' };
const NAMES = { mon: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'], dow: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] };
const SPEC = [['minute', 0, 59], ['hour', 0, 23], ['day of month', 1, 31], ['month', 1, 12, 'mon'], ['day of week', 0, 7, 'dow']];
// Turn one field into a Set of allowed numbers, or throw a readable error.
function field(str, [label, lo, hi, names]) {
  const set = new Set();
  for (const part of str.toLowerCase().split(',')) {
    const m = part.match(/^(\*|[a-z0-9]+(?:-[a-z0-9]+)?)(?:\/(\d+))?$/);
    if (!m) throw new Error(`“${part}” isn’t valid in the ${label} field.`);
    const num = s => { if (names && NAMES[names].includes(s.slice(0, 3))) return NAMES[names].indexOf(s.slice(0, 3)) + (names === 'mon' ? 1 : 0); const n = +s; if (!/^\d+$/.test(s) || n < lo || n > hi) throw new Error(`${label} must be between ${lo} and ${hi}${names ? ' (or a name)' : ''}; got “${s}”.`); return n; };
    let a = lo, b = hi;
    if (m[1] !== '*') { const [x, y] = m[1].split('-'); a = num(x); b = y !== undefined ? num(y) : (m[2] ? hi : a); }
    const step = m[2] ? +m[2] : 1;
    if (!step) throw new Error(`Step in the ${label} field can’t be 0.`);
    if (a > b) throw new Error(`Range ${a}-${b} in the ${label} field goes backwards.`);
    for (let v = a; v <= b; v += step) set.add(label === 'day of week' && v === 7 ? 0 : v);
  }
  return set;
}
function parse(expr) {
  expr = MACROS[expr.trim().toLowerCase()] || expr.trim();
  const f = expr.split(/\s+/);
  if (f.length === 6) throw new Error('This has 6 fields. Standard cron uses 5; a 6th field is usually seconds (Quartz, Spring) or a year. Remove it to check here.');
  if (f.length !== 5) throw new Error(`A cron expression needs 5 fields; this has ${f.length}.`);
  if (f.some(x => /[?LW#]/i.test(x))) throw new Error('L, W, # and ? are Quartz-only extensions that standard cron (Linux, Kubernetes, GitHub Actions) doesn’t support.');
  return { sets: f.map((x, i) => field(x, SPEC[i])), domStar: f[2] === '*', dowStar: f[4] === '*', expr };
}
function next(c, from, n) {
  const res = [], d = new Date(from); d.setSeconds(0, 0); d.setMinutes(d.getMinutes() + 1);
  const [mi, ho, dom, mo, dow] = c.sets;
  const dayOk = x => (c.domStar || c.dowStar) ? dom.has(x.getDate()) && dow.has(x.getDay()) : dom.has(x.getDate()) || dow.has(x.getDay()); // cron: if both are restricted, either matches
  for (let guard = 0; res.length < n && guard < 200000; guard++) {
    if (!mo.has(d.getMonth() + 1)) { d.setMonth(d.getMonth() + 1, 1); d.setHours(0, 0); continue; }
    if (!dayOk(d)) { d.setDate(d.getDate() + 1); d.setHours(0, 0); continue; }
    if (!ho.has(d.getHours())) { d.setHours(d.getHours() + 1, 0); continue; }
    if (!mi.has(d.getMinutes())) { d.setMinutes(d.getMinutes() + 1); continue; }
    res.push(new Date(d)); d.setMinutes(d.getMinutes() + 1);
  }
  return res;
}
async function run() {
  const out = $('#out'), v = $('#expr').value;
  let c;
  try { c = parse(v); } catch (e) { out.innerHTML = `<p class="kicker">Schedule</p><span class="verdict no">Invalid</span><p class="sub">${esc(e.message)}</p>`; return; }
  if (!window.cronstrue) { try { await loadScript('https://cdnjs.cloudflare.com/ajax/libs/cronstrue/2.50.0/cronstrue.min.js'); } catch (e) { /* description is optional */ } }
  let words = '';
  try { words = window.cronstrue ? cronstrue.toString(c.expr, { use24HourTimeFormat: false, verbose: true }) : ''; } catch (e) { words = ''; }
  const runs = next(c, new Date(), 8);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  out.innerHTML = `<p class="kicker">Runs</p><p class="big" style="font-size:24px;line-height:1.3"><mark>${esc(words || c.expr)}</mark></p>
    <div class="copybox" id="cx" style="font-size:20px">${esc(c.expr)}</div><div class="btns"><button type="button" class="btn ghost" data-copy="cx">Copy</button></div>
    <p class="kicker">Next runs (${esc(tz)})</p>
    ${runs.length ? `<div class="scroll"><table class="tbl"><tbody>${runs.map(d => `<tr><td>${d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</td><td class="n">${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</td></tr>`).join('')}</tbody></table></div>` : '<p class="sub">This schedule never runs (for example, 31 February).</p>'}
    <p class="note">Times shown in your time zone. Servers usually run cron in UTC (GitHub Actions always does), so convert if needed.${!c.domStar && !c.dowStar ? ' Both day fields are set, so it runs when <em>either</em> matches, as standard cron does.' : ''}</p>`;
}
run();
