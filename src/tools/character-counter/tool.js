// Common limits. Social networks count emoji and most characters as 1 (X counts some as 2; we keep it simple).
const LIMITS = [
  ['X (Twitter) post', 280], ['SEO title tag', 60], ['Meta description', 160], ['SMS (one message)', 160],
  ['Instagram caption', 2200], ['YouTube title', 100], ['LinkedIn post', 3000], ['Facebook post', 63206],
];
const ta = $('#text');
ta.addEventListener('input', calc);
$('#clear').addEventListener('click', () => { ta.value = ''; ta.focus(); calc(); });
$('#copy').addEventListener('click', e => copyText(ta.value, e.target));

// Characters as people see them: an emoji or an accented letter counts once.
const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
const count = s => seg ? [...seg.segment(s)].length : [...s].length;

function calc() {
  const t = ta.value;
  const chars = count(t);
  const noSpace = count(t.replace(/\s/g, ''));
  const words = (t.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) || []).length;
  const lines = t ? t.split('\n').length : 0;
  const gsm = /^[\x20-\x7E\n\r£¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉÄÖÑÜ§¿äöñüà€]*$/.test(t);
  const smsPer = gsm ? (chars <= 160 ? 160 : 153) : (chars <= 70 ? 70 : 67);
  const sms = chars ? Math.ceil(chars / smsPer) : 0;

  let html = `<p class="kicker">Characters</p><p class="huge" style="text-align:left"><mark>${chars.toLocaleString()}</mark></p>
    <div class="statgrid">
      <div class="stat"><b>${noSpace.toLocaleString()}</b><span>Without spaces</span></div>
      <div class="stat"><b>${words.toLocaleString()}</b><span>Words</span></div>
      <div class="stat"><b>${lines}</b><span>Lines</span></div>
      <div class="stat"><b>${sms}</b><span>SMS message${sms === 1 ? '' : 's'}</span></div>
    </div>
    <p class="kicker" style="margin-top:6px">Limits</p><div class="scroll"><table class="tbl"><tbody>`;
  LIMITS.forEach(([name, max]) => {
    const left = max - chars;
    const pct = Math.min(100, chars / max * 100);
    const color = left < 0 ? 'var(--bad)' : pct > 90 ? 'var(--warn)' : 'var(--good)';
    html += `<tr><td>${name}<div style="height:5px;border-radius:3px;background:var(--line);margin-top:6px"><div style="height:5px;border-radius:3px;width:${pct}%;background:${color}"></div></div></td>
      <td class="n" style="color:${left < 0 ? 'var(--bad)' : 'inherit'}">${left < 0 ? `${(-left).toLocaleString()} over` : `${left.toLocaleString()} left`}</td></tr>`;
  });
  html += `</tbody></table></div>${!gsm && chars ? '<p class="note">Your text has emoji or special characters, so an SMS holds only 70 characters instead of 160.</p>' : ''}`;
  $('#out').innerHTML = html;
}
calc();
