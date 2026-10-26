const KEY = 'tf-tz';
const ABBR = { UTC: 'UTC', GMT: 'UTC', EST: 'America/New_York', EDT: 'America/New_York', ET: 'America/New_York', CST: 'America/Chicago', CDT: 'America/Chicago', CT: 'America/Chicago', MST: 'America/Denver', MDT: 'America/Denver', PST: 'America/Los_Angeles', PDT: 'America/Los_Angeles', PT: 'America/Los_Angeles', AKST: 'America/Anchorage', HST: 'Pacific/Honolulu', BST: 'Europe/London', CET: 'Europe/Paris', CEST: 'Europe/Paris', EET: 'Europe/Athens', MSK: 'Europe/Moscow', GST: 'Asia/Dubai', PKT: 'Asia/Karachi', IST: 'Asia/Kolkata', NPT: 'Asia/Kathmandu', BDT: 'Asia/Dhaka', ICT: 'Asia/Bangkok', WIB: 'Asia/Jakarta', SGT: 'Asia/Singapore', HKT: 'Asia/Hong_Kong', JST: 'Asia/Tokyo', KST: 'Asia/Seoul', AEST: 'Australia/Sydney', AEDT: 'Australia/Sydney', AWST: 'Australia/Perth', NZST: 'Pacific/Auckland', SAST: 'Africa/Johannesburg', WAT: 'Africa/Lagos', EAT: 'Africa/Nairobi', BRT: 'America/Sao_Paulo', ART: 'America/Argentina/Buenos_Aires' };
const EXTRA = { 'Asia/Kolkata': 'India, Delhi, Mumbai', 'Asia/Karachi': 'Pakistan, Lahore, Islamabad', 'Asia/Dubai': 'UAE, Abu Dhabi', 'Asia/Riyadh': 'Saudi Arabia, Jeddah, Mecca', 'Europe/London': 'United Kingdom, UK', 'America/New_York': 'Eastern Time, Washington, Toronto, Miami', 'America/Los_Angeles': 'Pacific Time, San Francisco, Seattle, Vancouver', 'America/Chicago': 'Central Time, Dallas, Houston', 'America/Denver': 'Mountain Time, Phoenix', 'Asia/Shanghai': 'China, Beijing', 'Australia/Sydney': 'Melbourne, Canberra', 'Asia/Dhaka': 'Bangladesh', 'Asia/Manila': 'Philippines', 'Europe/Paris': 'France, Central European Time', 'Europe/Berlin': 'Germany', 'Africa/Lagos': 'Nigeria', 'Asia/Tokyo': 'Japan' };
const ALL = (Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : Object.values(ABBR)).filter(z => z.includes('/') || z === 'UTC');
if (!ALL.includes('UTC')) ALL.unshift('UTC');
const LOCAL = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
const city = z => (z === 'UTC' ? 'UTC' : z.split('/').pop().replace(/_/g, ' '));
const labelOf = z => `${city(z)} (${z})`;
$('#zones').innerHTML = [...Object.keys(ABBR).map(a => `<option value="${a}">${ABBR[a]}</option>`), ...ALL.map(z => `<option value="${esc(labelOf(z))}">${esc(EXTRA[z] || '')}</option>`)].join('');
function parseZone(s) {
  s = (s || '').trim(); if (!s) return null;
  const up = s.toUpperCase(); if (ABBR[up]) return ABBR[up];
  const m = s.match(/\(([^)]+)\)\s*$/); if (m && ALL.includes(m[1])) return m[1];
  if (ALL.includes(s)) return s;
  const low = s.toLowerCase();
  return ALL.find(z => city(z).toLowerCase() === low) || ALL.find(z => (EXTRA[z] || '').toLowerCase().split(', ').includes(low)) || ALL.find(z => z.toLowerCase().includes(low.replace(/ /g, '_'))) || null;
}
// Offset of a zone from UTC at a given instant, in minutes.
function offset(ms, zone) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }).formatToParts(new Date(ms)).map(x => [x.type, x.value]));
  return Math.round((Date.UTC(+p.year, p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - Math.floor(ms / 1000) * 1000) / 60000);
}
// The instant when the wall clock in `zone` shows y-m-d h:mi.
function instant(y, mo, d, h, mi, zone) {
  const guess = Date.UTC(y, mo, d, h, mi);
  let t = guess - offset(guess, zone) * 60000;
  t = guess - offset(t, zone) * 60000;
  return t;
}
const offStr = m => `UTC${m < 0 ? '−' : '+'}${Math.floor(Math.abs(m) / 60)}${Math.abs(m) % 60 ? ':' + String(Math.abs(m) % 60).padStart(2, '0') : ''}`;
const diffStr = m => (m === 0 ? 'same time' : `${Math.floor(Math.abs(m) / 60)} h${Math.abs(m) % 60 ? ` ${Math.abs(m) % 60} min` : ''} ${m > 0 ? 'ahead' : 'behind'}`);
const abbr = (ms, z) => { try { return new Intl.DateTimeFormat('en-US', { timeZone: z, timeZoneName: 'short' }).formatToParts(new Date(ms)).find(p => p.type === 'timeZoneName').value; } catch (e) { return ''; } };
const preset = typeof PRESET !== 'undefined' && PRESET ? PRESET : null;
let src = (preset && preset.from) || LOCAL, list = [];
try { const s = JSON.parse(localStorage.getItem(KEY)); if (!preset && s && s.list) list = s.list.filter(z => ALL.includes(z)); } catch (e) { /* storage blocked */ }
if (!list.length) list = preset ? preset.to : [...new Set([LOCAL, 'UTC', 'America/New_York', 'Europe/London', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney'])].filter(z => z !== src).slice(0, 6);
const save = () => { if (!preset) try { localStorage.setItem(KEY, JSON.stringify({ list })); } catch (e) { /* storage blocked */ } };
function setNow() {
  const n = new Date(), o = offset(n.getTime(), src), w = new Date(n.getTime() + o * 60000);
  $('#when').value = w.toISOString().slice(0, 16);
}
$('#from').value = labelOf(src);
setNow();
$('#quick').innerHTML = ['America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Karachi', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney'].map(z => `<button type="button" class="chip" data-z="${z}">+ ${city(z)}</button>`).join('');
$('#quick').addEventListener('click', e => { const b = e.target.closest('[data-z]'); if (b && !list.includes(b.dataset.z)) { list.push(b.dataset.z); save(); calc(); } });
$('#add').addEventListener('change', e => { const z = parseZone(e.target.value); if (z) { if (!list.includes(z) && z !== src) list.push(z); e.target.value = ''; save(); calc(); } });
$('#add').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.dispatchEvent(new Event('change')); });
$('#from').addEventListener('change', e => { const z = parseZone(e.target.value); if (z) { src = z; e.target.value = labelOf(z); calc(); } });
$('#when').addEventListener('input', calc);
$('#now').addEventListener('click', () => { setNow(); calc(); });
$('#swap').addEventListener('click', () => { src = LOCAL; $('#from').value = labelOf(src); setNow(); calc(); });
$('#out').addEventListener('click', e => { const b = e.target.closest('[data-rm]'); if (b) { list = list.filter(z => z !== b.dataset.rm); save(); calc(); } });
function calc() {
  const m = $('#when').value.match(/^(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
  if (!m) return;
  const t = instant(+m[1], m[2] - 1, +m[3], +m[4], +m[5], src), so = offset(t, src);
  const fmtT = z => new Intl.DateTimeFormat(undefined, { timeZone: z, hour: 'numeric', minute: '2-digit' }).format(new Date(t));
  const fmtD = z => new Intl.DateTimeFormat(undefined, { timeZone: z, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(t));
  const row = (z, isSrc) => { const o = offset(t, z); return `<div class="tz-row${isSrc ? ' src' : ''}"><span class="city">${esc(city(z))}${z === LOCAL ? ' · you' : ''}</span><b>${fmtT(z)}</b>${isSrc ? '<span></span>' : `<button type="button" class="x" data-rm="${z}" aria-label="Remove ${esc(city(z))}">×</button>`}<small>${fmtD(z)} · ${abbr(t, z)} (${offStr(o)})${isSrc ? '' : ' · ' + diffStr(o - so)}</small></div>`; };
  const others = list.filter(z => z !== src);
  $('#out').innerHTML = `<p class="kicker">${esc(city(src))} time converted</p><div class="tz-list">${row(src, true)}${others.map(z => row(z)).join('')}</div>`;
  // Meeting planner: 24 hours starting at midnight in the source zone.
  const zones = [src, ...others], day0 = instant(+m[1], m[2] - 1, +m[3], 0, 0, src), nowH = +m[4];
  const hours = Array.from({ length: 24 }, (_, i) => day0 + i * 3600000);
  const cls = (h) => (h >= 9 && h < 18 ? 'w' : (h >= 7 && h < 9) || (h >= 18 && h < 22) ? 'e' : 'n');
  const hourIn = (ms, z) => { const w = new Date(ms + offset(ms, z) * 60000); return w.getUTCHours() + w.getUTCMinutes() / 60; };
  const good = hours.map(ms => zones.every(z => cls(Math.floor(hourIn(ms, z))) === 'w'));
  $('#plan').innerHTML = `<table class="tz-plan"><tbody>${zones.map(z => `<tr><th>${esc(city(z))}</th>${hours.map((ms, i) => { const h = hourIn(ms, z), hh = Math.floor(h); return `<td class="${cls(hh)}${i === nowH ? ' now' : ''}${good[i] ? ' all' : ''}" title="${esc(city(z))} ${fmtTime(h)}">${hh % 12 || 12}${{ 15: '¼', 30: '½', 45: '¾' }[Math.round((h % 1) * 60)] || ''}</td>`; }).join('')}</tr>`).join('')}</tbody></table>`;
}
const fmtTime = h => `${Math.floor(h) % 12 || 12}:${String(Math.round((h % 1) * 60)).padStart(2, '0')} ${Math.floor(h) < 12 ? 'am' : 'pm'}`;
calc();
