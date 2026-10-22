const fmtT = d => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
onAny('#time, #fall, input[name="mode"]', calc);
$('#now').addEventListener('click', () => { const n = new Date(); $('#m-bed').checked = true; $('#time').value = `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`; calc(); });
function calc() {
  const wake = $('input[name="mode"]:checked').value === 'wake';
  $('#t-label').textContent = wake ? 'Wake-up time' : 'Bedtime';
  const [h, m] = ($('#time').value || '07:00').split(':').map(Number);
  const base = new Date(2000, 0, 2, h, m), fall = Math.max(0, val($('#fall')) || 0);
  const cycles = [6, 5, 4, 3];
  const times = cycles.map(c => new Date(base.getTime() + (wake ? -1 : 1) * (c * 90 + fall) * 60000));
  const out = $('#out');
  out.innerHTML = `<p class="kicker">${wake ? 'Go to bed at one of these times' : 'Set your alarm for one of these times'}</p>
    <div class="scroll"><table class="tbl"><tbody>${cycles.map((c, i) => `<tr${c >= 5 ? ' class="win"' : ''}><td><strong style="font:600 22px var(--f-num)">${fmtT(times[i])}</strong></td><td>${c} cycles · ${c * 1.5} hours of sleep${c === 6 ? ' (ideal)' : c === 5 ? ' (good)' : c === 3 ? ' (emergency only)' : ''}</td></tr>`).join('')}</tbody></table></div>
    <p class="note">Each sleep cycle lasts about 90 minutes. Waking at the end of a cycle, rather than in deep sleep, usually leaves you feeling less groggy. Includes ${fall} minutes to fall asleep.</p>
    <p class="note">Adults need 7–9 hours a night (teenagers 8–10). If you regularly struggle to sleep or feel tired after a full night, talk to a doctor.</p>`;
}
calc();
