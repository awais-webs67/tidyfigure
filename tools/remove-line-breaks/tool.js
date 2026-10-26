const SAMPLE = 'The quick brown fox jumps over\nthe lazy dog. It was a sunny\nafter-\nnoon in the park.\n\nThis second paragraph was copied\nfrom a PDF,   and it has  extra\nspaces too.';
$('#in').value = SAMPLE;
function clean() {
  let t = $('#in').value.replace(/\r\n?/g, '\n');
  const mode = $('#mode').value, sepSel = $('#sep').value, sep = sepSel === 'custom' ? $('#custom').value : sepSel;
  $('#customf').hidden = sepSel !== 'custom';
  if ($('#sp').checked) t = t.split('\n').map(l => l.replace(/[ \t ]+/g, ' ').trim()).join('\n');
  if ($('#hy').checked) t = t.replace(/(\p{L})-\n(\p{Ll})/gu, '$1$2');
  const join = s => s.split('\n').map(l => l.trim()).filter(Boolean).join(sep);
  if (mode === 'empty') t = t.split('\n').filter(l => l.trim()).join('\n');
  else if (mode === 'para') t = t.split(/\n\s*\n+/).map(join).filter(Boolean).join('\n\n');
  else t = join(t);
  if ($('#sp').checked && sep === ' ') t = t.replace(/ {2,}/g, ' ');
  $('#res').value = t;
  const lines = s => (s ? s.split('\n').length : 0);
  $('#stat').textContent = `${lines($('#in').value)} lines → ${lines(t)} · ${t.trim() ? t.trim().split(/\s+/).length : 0} words`;
}
onAny('#in, #mode, #sep, #custom, #hy, #sp', clean);
$('#copy').addEventListener('click', e => copyText($('#res').value, e.currentTarget));
$('#dl').addEventListener('click', () => download(new Blob([$('#res').value], { type: 'text/plain;charset=utf-8' }), 'clean-text.txt'));
clean();
