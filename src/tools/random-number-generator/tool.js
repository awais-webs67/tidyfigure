$('#go').addEventListener('click', generate);
$('#presets').addEventListener('click', e => {
  const b = e.target.closest('.chip');
  if (!b) return;
  const [a, z, n] = b.dataset.p.split(',');
  $('#min').value = a; $('#max').value = z; $('#n').value = n;
  $('#unique').checked = b.textContent.startsWith('Lottery');
  generate();
});

function generate() {
  let min = Math.ceil(val($('#min'))), max = Math.floor(val($('#max')));
  const n = Math.min(10000, Math.max(1, Math.round(val($('#n')) || 1)));
  const out = $('#out');
  if (!ok(min) || !ok(max)) { out.innerHTML = '<p class="empty">Enter a minimum and a maximum.</p>'; return; }
  if (min > max) [min, max] = [max, min];
  const range = max - min + 1;
  const unique = $('#unique').checked;
  if (unique && n > range) { out.innerHTML = `<p class="empty">There are only ${range.toLocaleString()} different numbers between ${min} and ${max}. Ask for fewer, or allow repeats.</p>`; return; }
  let nums;
  if (unique) {
    const seen = new Set();
    while (seen.size < n) seen.add(randInt(min, max));
    nums = [...seen];
  } else nums = Array.from({ length: n }, () => randInt(min, max));
  if ($('#sorted').checked) nums.sort((a, b) => a - b);

  out.innerHTML = n === 1
    ? `<p class="kicker">Your number</p><p class="huge"><mark>${nums[0].toLocaleString()}</mark></p><p class="sub" style="text-align:center">between ${min.toLocaleString()} and ${max.toLocaleString()}</p>`
    : `<p class="kicker">${n} numbers between ${min.toLocaleString()} and ${max.toLocaleString()}</p>
       <div class="copybox" id="result" style="font-size:17px">${nums.join(', ')}</div>
       <div class="copyrow"><button type="button" class="btn" data-copy="result">Copy</button></div>`;
}
generate();
