const list = $('#dishes');
makeList(list, $('#add-dish'), v => `
  <label class="f f-name"><span>Dish</span><input data-f="name" type="text" value="${esc(v.name ?? '')}" placeholder="e.g. Roast chicken"></label>
  <label class="f"><span>Prep</span><input data-f="prep" type="number" inputmode="numeric" min="0" step="1" value="${esc(v.prep ?? 0)}"></label>
  <label class="f"><span>Cook</span><input data-f="cook" type="number" inputmode="numeric" min="0" step="1" value="${esc(v.cook ?? '')}"></label>
  <label class="f"><span>Rest</span><input data-f="rest" type="number" inputmode="numeric" min="0" step="1" value="${esc(v.rest ?? 0)}"></label>
  <button type="button" class="rm" aria-label="Remove this dish">×</button>`,
  [
    { name: 'Roast chicken', prep: 20, cook: 80, rest: 15 },
    { name: 'Roast potatoes', prep: 15, cook: 50, rest: 0 },
    { name: 'Green beans', prep: 10, cook: 8, rest: 0 },
    { name: 'Gravy', prep: 5, cook: 10, rest: 0 },
  ], calc);
onAny('#serve', calc);

const clock = d => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
const dur = m => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60 ? (m % 60) + ' min' : ''}` : `${m} min`).trim();

function calc() {
  const out = $('#out');
  const [hh, mm] = ($('#serve').value || '19:00').split(':').map(Number);
  const serve = new Date(2000, 0, 2, hh, mm); // a fixed day, so times before midnight still work
  const at = minsBefore => new Date(serve.getTime() - minsBefore * 60000);

  const events = [];
  $$('.row', list).forEach((r, i) => {
    const name = field(r, 'name').value.trim() || `Dish ${i + 1}`;
    const prep = Math.max(0, Math.round(val(field(r, 'prep')) || 0));
    const cook = Math.max(0, Math.round(val(field(r, 'cook')) || 0));
    const rest = Math.max(0, Math.round(val(field(r, 'rest')) || 0));
    if (!cook && !prep) return;
    if (prep) events.push({ t: rest + cook + prep, what: `Start prepping ${name}`, hint: `${prep} min of prep` });
    if (cook) events.push({ t: rest + cook, what: `Start cooking ${name}`, hint: `cooks for ${dur(cook)}` });
    if (rest) events.push({ t: rest, what: `Take ${name} off the heat to rest`, hint: `rests ${rest} min` });
  });
  if (!events.length) { out.innerHTML = '<p class="empty">Add at least one dish with a cooking time.</p>'; return; }

  events.sort((a, b) => b.t - a.t);
  const first = events[0];
  // Several prep steps at the same time? Point it out so the cook can start some earlier.
  const busy = {};
  events.forEach(e => { if (e.what.startsWith('Start prepping')) busy[e.t] = (busy[e.t] || 0) + 1; });

  let html = `<p class="kicker">Start cooking at</p><p class="big"><mark>${clock(at(first.t))}</mark></p>
    <p class="sub">${dur(first.t)} before you serve at ${clock(serve)}</p><ol class="steps">`;
  events.forEach(e => {
    html += `<li><time>${clock(at(e.t))}</time><span class="what">${esc(e.what)}<small>${esc(e.hint)}</small></span></li>`;
  });
  html += `<li><time>${clock(serve)}</time><span class="what"><strong>Serve</strong></span></li></ol>`;
  if (Object.values(busy).some(n => n > 1)) html += '<p class="note">Two prep jobs start at the same time. If you\'re cooking alone, do one of them a little earlier.</p>';
  html += `<div id="plan-text" aria-hidden="true" class="sr-only" style="white-space:pre">${events.map(e => `${clock(at(e.t))}  ${esc(e.what)}`).join('\n')}\n${clock(serve)}  Serve</div>
    <div class="copyrow"><button type="button" class="btn ghost" data-copy="plan-text">Copy</button></div>`;
  out.innerHTML = html;
}
calc();
