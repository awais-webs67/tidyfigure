onAny('input', calc);
function calc() {
  const age = val($('#age')), ret = val($('#ret')), have = val($('#have')) || 0, pm = val($('#pm')) || 0;
  const r = (val($('#r')) || 0) / 100, inf = (val($('#inf')) || 0) / 100, want = val($('#want')) || 0, other = val($('#other')) || 0;
  const out = $('#out');
  if (!(ret > age)) { out.innerHTML = '<p class="empty">Your retirement age must be after your current age.</p>'; return; }
  const years = ret - age;
  const real = (1 + r) / (1 + inf) - 1, i = Math.pow(1 + real, 1 / 12) - 1; // work in today's money
  let pot = have;
  for (let m = 0; m < years * 12; m++) pot = pot * (1 + i) + pm;
  const need = Math.max(0, want - other);
  const target = need / 0.04; // 4% rule: withdraw 4% a year, adjusted for inflation
  const income = pot * 0.04;
  const nominal = pot * Math.pow(1 + inf, years);
  // Extra monthly saving needed to close any gap.
  const grow = Math.pow(1 + i, years * 12);
  const extra = pot < target ? (target - pot) * i / (grow - 1) : 0;
  const pct = target ? Math.min(100, pot / target * 100) : 100;
  out.innerHTML = `<p class="kicker">Projected savings at ${ret} (today’s money)</p><p class="huge" style="text-align:left"><mark>${fmt(pot, 0)}</mark></p>
    <p class="sub">about ${fmt(nominal, 0)} in future money after ${years} years of ${fmt(inf * 100, 1)}% inflation</p>
    <span class="verdict ${pot >= target ? 'ok' : pct > 70 ? 'tight' : 'no'}">${pot >= target ? 'On track' : `${fmt(pct, 0)}% of target`}</span>
    <div style="height:10px;border-radius:5px;background:var(--line)"><div style="height:10px;border-radius:5px;width:${pct}%;background:${pot >= target ? 'var(--good)' : 'var(--accent)'}"></div></div>
    <div class="statgrid">
      <div class="stat"><b>${fmt(target, 0)}</b><span>Target pot (4% rule)</span></div>
      <div class="stat"><b>${fmt(income + other, 0)}</b><span>Yearly income you’d have</span></div>
      <div class="stat"><b>${extra ? fmt(extra, 0) : '0'}</b><span>Extra to save monthly</span></div>
    </div>
    <p class="note">Figures are in today’s money, so they’re comparable with prices now. The 4% rule is a common rule of thumb for a retirement lasting about 30 years; it isn’t a guarantee.</p>`;
}
calc();
