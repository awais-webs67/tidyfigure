const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const F = n => [`F${n}`, `F${n}`];
// [code, label, width in key units]; '' = blank space
const MAIN = [
  [['Escape', 'Esc'], ['', '', 1], F(1), F(2), F(3), F(4), ['', '', 0.5], F(5), F(6), F(7), F(8), ['', '', 0.5], F(9), F(10), F(11), F(12)],
  [['Backquote', '`'], ['Digit1', '1'], ['Digit2', '2'], ['Digit3', '3'], ['Digit4', '4'], ['Digit5', '5'], ['Digit6', '6'], ['Digit7', '7'], ['Digit8', '8'], ['Digit9', '9'], ['Digit0', '0'], ['Minus', '-'], ['Equal', '='], ['Backspace', 'Backspace', 2]],
  [['Tab', 'Tab', 1.5], ...'QWERTYUIOP'.split('').map(c => [`Key${c}`, c]), ['BracketLeft', '['], ['BracketRight', ']'], ['Backslash', '\\', 1.5]],
  [['CapsLock', 'Caps', 1.75], ...'ASDFGHJKL'.split('').map(c => [`Key${c}`, c]), ['Semicolon', ';'], ['Quote', "'"], ['Enter', 'Enter', 2.25]],
  [['ShiftLeft', 'Shift', 2.25], ...'ZXCVBNM'.split('').map(c => [`Key${c}`, c]), ['Comma', ','], ['Period', '.'], ['Slash', '/'], ['ShiftRight', 'Shift', 2.75]],
  [['ControlLeft', 'Ctrl', 1.25], ['MetaLeft', mac ? '⌘' : 'Win', 1.25], ['AltLeft', mac ? 'Opt' : 'Alt', 1.25], ['Space', 'Space', 6.25], ['AltRight', mac ? 'Opt' : 'Alt', 1.25], ['MetaRight', mac ? '⌘' : 'Win', 1.25], ['ContextMenu', 'Menu', 1.25], ['ControlRight', 'Ctrl', 1.25]],
];
const NAV = [
  [['PrintScreen', 'PrtSc'], ['ScrollLock', 'ScrLk'], ['Pause', 'Pause']],
  [['Insert', 'Ins'], ['Home', 'Home'], ['PageUp', 'PgUp']],
  [['Delete', 'Del'], ['End', 'End'], ['PageDown', 'PgDn']],
  [['', ''], ['', ''], ['', '']],
  [['', ''], ['ArrowUp', '↑'], ['', '']],
  [['ArrowLeft', '←'], ['ArrowDown', '↓'], ['ArrowRight', '→']],
];
const PAD = [['NumLock', 'Num'], ['NumpadDivide', '/'], ['NumpadMultiply', '*'], ['NumpadSubtract', '-'], ['Numpad7', '7'], ['Numpad8', '8'], ['Numpad9', '9'], ['NumpadAdd', '+', 'tall'], ['Numpad4', '4'], ['Numpad5', '5'], ['Numpad6', '6'], ['Numpad1', '1'], ['Numpad2', '2'], ['Numpad3', '3'], ['NumpadEnter', 'Enter', 'tall'], ['Numpad0', '0', 'wide'], ['NumpadDecimal', '.']];
const key = ([code, label, w]) => `<span class="kb-k${code ? '' : ' sp'}"${code ? ` data-code="${code}"` : ''} style="--w:${w || 1}">${esc(label)}</span>`;
const rows = (list, gapAfterFirst) => list.map((r, i) => `<div class="kb-row${gapAfterFirst && i === 0 ? ' gap' : ''}">${r.map(key).join('')}</div>`).join('');
$('#kb').innerHTML = `<div class="kb-block">${rows(MAIN, true)}</div><div class="kb-block">${rows(NAV, true)}</div><div class="kb-pad" id="pad">${PAD.map(([c, l, cls]) => `<span class="kb-k ${cls || ''}" data-code="${c}">${l}</span>`).join('')}</div>`;
const total = $$('#kb [data-code]').length;
$('#numpad').addEventListener('change', e => { $('#pad').hidden = !e.target.checked; });

const hit = new Set(), held = new Set(), log = [];
let max = 0;
const el = code => $(`#kb [data-code="${code}"]`);
function count() { $('#n-ok').textContent = `${hit.size} / ${total}`; $('#n-held').textContent = held.size; $('#n-max').textContent = max; }
function show(e) {
  log.unshift(e.code || e.key);
  log.length = Math.min(log.length, 14);
  $('#out').innerHTML = `<p class="kicker">Last key</p><p class="big">${esc(e.key === ' ' ? 'Space' : e.key)}</p>
    <div class="scroll"><table class="tbl"><tbody>
      <tr><td><code>event.key</code></td><td class="n">${esc(JSON.stringify(e.key))}</td></tr>
      <tr><td><code>event.code</code></td><td class="n">${esc(e.code || '–')}</td></tr>
      <tr><td><code>keyCode</code></td><td class="n">${e.keyCode}</td></tr>
      <tr><td>Location</td><td class="n">${['standard', 'left', 'right', 'number pad'][e.location] || e.location}</td></tr>
    </tbody></table></div>
    <p class="group-title">Recent keys</p><p class="sub" style="font-family:var(--f-num);font-size:13.5px">${log.map(esc).join(' · ')}</p>
    ${hit.size === total ? '<span class="verdict ok">Every key works</span>' : ''}`;
}
const typing = e => e.target.closest?.('input:not([type=checkbox]), textarea, select, [contenteditable], .qs');
document.addEventListener('keydown', e => {
  if (typing(e)) return;
  const allow = e.ctrlKey || e.metaKey || e.key === 'F11' || e.key === 'F12';
  if (!allow) e.preventDefault();
  if (e.repeat) return;
  const k = el(e.code);
  held.add(e.code); max = Math.max(max, held.size);
  if (k) { k.classList.add('down', 'hit'); hit.add(e.code); }
  count(); show(e);
});
document.addEventListener('keyup', e => {
  if (typing(e)) return;
  held.delete(e.code);
  const k = el(e.code);
  if (k) { k.classList.remove('down'); if (!hit.has(e.code)) { k.classList.add('hit'); hit.add(e.code); show(e); } }
  count();
});
window.addEventListener('blur', () => { held.clear(); $$('#kb .down').forEach(k => k.classList.remove('down')); count(); });
$('#reset').addEventListener('click', e => { hit.clear(); held.clear(); max = 0; log.length = 0; $$('#kb .kb-k').forEach(k => k.classList.remove('hit', 'down')); count(); $('#out').innerHTML = '<p class="kicker">Last key</p><p class="empty">Press any key.</p>'; e.currentTarget.blur(); });
count();
