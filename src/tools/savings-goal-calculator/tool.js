onAny('#goal, #have, #r, #months, #pay, input[name="mode"]', calc);
const addMonths = n => { const d = new Date(); d.setMonth(d.getMonth() + n); return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }); };
function calc() {
  const goal = val($('#goal')) || 0, have = val($('#have')) || 0, i = (val($('#r')) || 0) / 100 / 12;
  const byTime = $('input[name="mode"]:checked').value === 'time';
  $('#months-wrap').hidden = !byTime; $('#pay-wrap').hidden = byTime;
  const out = $('#out');
  if (!(goal > 0)) { out.innerHTML = '<p class="empty">Enter your savings goal.</p>'; return; }
  if (have >= goal) { out.innerHTML = '<p class="kicker">Goal</p><p class="big"><mark>Already reached 🎉</mark></p>'; return; }
  if (byTime) {
    const n = Math.round(val($('#months')) || 0);
    if (!(n > 0)) { out.innerHTML = '<p class="empty">Enter how many months you have.</p>'; return; }
    const grow = Math.pow(1 + i, n);
    const pay = i ? (goal - have * grow) * i / (grow - 1) : (goal - have) / n;
    const interest = goal - have - pay * n;
    out.innerHTML = `<p class="kicker">Save each month</p><p class="huge" style="text-align:left"><mark>${fmt(Math.max(0, pay))}</mark></p>
      <p class="sub">for ${n} months to reach ${fmt(goal, 0)} by ${addMonths(n)}</p>
      <div class="statgrid"><div class="stat"><b>${fmt(pay * n, 0)}</b><span>You’ll pay in</span></div><div class="stat"><b>${fmt(Math.max(0, interest), 0)}</b><span>Interest earned</span></div><div class="stat"><b>${fmt(pay / 4.345)}</b><span>Per week</span></div></div>`;
  } else {
    const pay = val($('#pay')) || 0;
    let bal = have, n = 0;
    while (bal < goal && n < 1200) { bal = bal * (1 + i) + pay; n++; }
    if (n >= 1200) { out.innerHTML = '<p class="empty">At that rate you won’t reach the goal within 100 years. Try saving more each month.</p>'; return; }
    out.innerHTML = `<p class="kicker">You’ll reach your goal in</p><p class="huge" style="text-align:left"><mark>${Math.floor(n / 12) ? `${Math.floor(n / 12)}y ` : ''}${n % 12}m</mark></p>
      <p class="sub">around ${addMonths(n)} · ${n} monthly payments of ${fmt(pay)}</p>
      <div class="statgrid"><div class="stat"><b>${fmt(pay * n, 0)}</b><span>You’ll pay in</span></div><div class="stat"><b>${fmt(Math.max(0, bal - have - pay * n), 0)}</b><span>Interest earned</span></div></div>`;
  }
}
calc();
