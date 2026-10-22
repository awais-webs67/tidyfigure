// Map A–Z, a–z and 0–9 onto Unicode alphabets. `ex` fills the gaps where Unicode reuses older symbols.
function alpha(U, L, D, ex = {}) {
  return s => [...s].map(ch => {
    if (ex[ch]) return ex[ch];
    const c = ch.charCodeAt(0);
    if (c >= 65 && c <= 90 && U) return String.fromCodePoint(U + c - 65);
    if (c >= 97 && c <= 122 && L) return String.fromCodePoint(L + c - 97);
    if (c >= 48 && c <= 57 && D) return String.fromCodePoint(D + c - 48);
    return ch;
  }).join('');
}
const table = (from, to) => { const m = {}; [...from].forEach((c, i) => { m[c] = [...to][i]; }); return s => [...s].map(c => m[c] ?? c).join(''); };
const combine = mark => s => [...s].map(c => (c === ' ' ? c : c + mark)).join('');
const lowerToUpper = f => s => f(s.toUpperCase());

const SMALLCAPS = table('abcdefghijklmnopqrstuvwxyz', 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ');
const SUPER = table('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹');
const FLIP = table('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?\'"()[]{}<>_&',
  'ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz∀ꓭƆꓷƎℲ⅁HIſꓘ⅂WNOԀΌꓤS⊥∩ΛMX⅄Z0ƖᄅƐㄣϛ9ㄥ86˙\'¡¿,„)(][}{><‾⅋');
const CIRCLED_D = { 0: '⓪' }; for (let i = 1; i <= 9; i++) CIRCLED_D[i] = String.fromCodePoint(0x2460 + i - 1);

const STYLES = [
  ['Bold', alpha(0x1D400, 0x1D41A, 0x1D7CE)],
  ['Italic', alpha(0x1D434, 0x1D44E, 0, { h: 'ℎ' })],
  ['Bold italic', alpha(0x1D468, 0x1D482)],
  ['Script', alpha(0x1D49C, 0x1D4B6, 0, { B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ', e: 'ℯ', g: 'ℊ', o: 'ℴ' })],
  ['Bold script', alpha(0x1D4D0, 0x1D4EA)],
  ['Gothic', alpha(0x1D504, 0x1D51E, 0, { C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ' })],
  ['Bold gothic', alpha(0x1D56C, 0x1D586)],
  ['Double-struck', alpha(0x1D538, 0x1D552, 0x1D7D8, { C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' })],
  ['Sans bold', alpha(0x1D5D4, 0x1D5EE, 0x1D7EC)],
  ['Sans italic', alpha(0x1D608, 0x1D622)],
  ['Sans bold italic', alpha(0x1D63C, 0x1D656)],
  ['Monospace', alpha(0x1D670, 0x1D68A, 0x1D7F6)],
  ['Circled', s => [...s].map(c => CIRCLED_D[c] ?? alpha(0x24B6, 0x24D0)(c)).join('')],
  ['Circled dark', lowerToUpper(alpha(0x1F150, 0))],
  ['Squared', lowerToUpper(alpha(0x1F130, 0))],
  ['Squared dark', lowerToUpper(alpha(0x1F170, 0))],
  ['Wide (vaporwave)', s => alpha(0xFF21, 0xFF41, 0xFF10)(s).replace(/ /g, '　')],
  ['Small caps', s => SMALLCAPS(s.toLowerCase())],
  ['Tiny', SUPER],
  ['Upside down', s => [...FLIP(s)].reverse().join('')],
  ['Strikethrough', combine('̶')],
  ['Underline', combine('̲')],
  ['Spaced out', s => [...s].join(' ')],
  ['Sparkles', s => `✨ ${s} ✨`],
  ['Hearts', s => `♡ ${s} ♡`],
  ['Stars', s => `★彡 ${s} 彡★`],
];

const input = $('#text');
input.addEventListener('input', render);
$('#styles').addEventListener('click', e => {
  const b = e.target.closest('button[data-i]');
  if (b) copyText(b.closest('li').querySelector('.fx').textContent, b);
});

function render() {
  const t = input.value || 'Type something';
  $('#styles').innerHTML = STYLES.map(([name, f], i) =>
    `<li><span class="meta"><small>${name}</small><b class="fx" style="font-size:19px;font-weight:500;white-space:normal;overflow-wrap:anywhere">${esc(f(t))}</b></span><button type="button" class="btn ghost" data-i="${i}">Copy</button></li>`).join('');
}
render();
