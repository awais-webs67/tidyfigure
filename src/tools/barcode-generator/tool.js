const HINTS = {
  CODE128: 'Letters, numbers and symbols. The most flexible choice for labels, inventory and shipping.',
  EAN13: 'Enter 12 digits; the 13th (check digit) is added for you. Real retail products need a number registered with GS1.',
  EAN8: 'Enter 7 digits; the check digit is added for you.',
  UPC: 'Enter 11 digits; the check digit is added for you. Retail products need a GS1-registered number.',
  CODE39: 'Capital letters, numbers, spaces and - . $ / + %.',
  ITF14: 'Enter 13 digits; the check digit is added for you. Used on outer cartons.',
  codabar: 'Numbers and - $ : / . +, starting and ending with A, B, C or D (e.g. A12345B).',
  MSI: 'Numbers only. Used for shelf labels and warehouses.',
  pharmacode: 'A number from 3 to 131070. Used on pharmaceutical packaging.',
};
const SAMPLES = { CODE128: 'TF-2026-0042', EAN13: '501234567890', EAN8: '9638507', UPC: '03600029145', CODE39: 'PART-0042', ITF14: '1501234567890', codabar: 'A40156B', MSI: '1234567', pharmacode: '1234' };
let ok2 = false;

function render() {
  const fmt = $('#fmt').value;
  $('#hint').textContent = HINTS[fmt];
  const opts = { format: fmt, width: +$('#w').value, height: +$('#h').value, displayValue: $('#text').checked, lineColor: $('#fg').value, background: $('#bg').value, margin: 14, font: 'JetBrains Mono, monospace', valid: v => { ok2 = v; } };
  try { JsBarcode('#svg', $('#val').value, opts); } catch (e) { ok2 = false; }
  $('#err').textContent = ok2 ? '' : `“${$('#val').value}” isn’t a valid ${$('#fmt').selectedOptions[0].textContent.split(' (')[0]} value. ${HINTS[fmt]}`;
  $('#svg').style.visibility = ok2 ? 'visible' : 'hidden';
  $('#png').disabled = $('#dsvg').disabled = !ok2;
}
$('#fmt').addEventListener('change', () => { $('#val').value = SAMPLES[$('#fmt').value]; render(); });
onAny('#val, #w, #h, #fg, #bg, #text', render);
$('#png').addEventListener('click', async () => {
  const c = document.createElement('canvas');
  JsBarcode(c, $('#val').value, { format: $('#fmt').value, width: +$('#w').value * 2, height: +$('#h').value * 2, fontSize: 40, displayValue: $('#text').checked, lineColor: $('#fg').value, background: $('#bg').value, margin: 28 });
  download(await canvasBlob(c, 'image/png'), `barcode-${$('#val').value.replace(/[^\w-]/g, '')}.png`);
});
$('#dsvg').addEventListener('click', () => download(new Blob([new XMLSerializer().serializeToString($('#svg'))], { type: 'image/svg+xml' }), `barcode-${$('#val').value.replace(/[^\w-]/g, '')}.svg`));
render();
