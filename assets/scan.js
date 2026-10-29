'use strict';
// Camera and image scanning for QR codes and barcodes, using ZXing (loaded by the page).
// const sc = Scanner({ video, formats: 'qr' | 'all', onResult(text, format) });

function Scanner({ video, formats = 'all', onResult, onError }) {
  // ZXing loads on the visitor's first touch (libsReady in app.js), so the reader is made on first use.
  let Z, reader, name;
  const ready = async () => { if (reader) return; await libsReady(); make(); };
  function make() {
  Z = window.ZXing;
  const hints = new Map();
  const qrOnly = [Z.BarcodeFormat.QR_CODE];
  const all = [Z.BarcodeFormat.QR_CODE, Z.BarcodeFormat.EAN_13, Z.BarcodeFormat.EAN_8, Z.BarcodeFormat.UPC_A, Z.BarcodeFormat.UPC_E,
    Z.BarcodeFormat.CODE_128, Z.BarcodeFormat.CODE_39, Z.BarcodeFormat.CODE_93, Z.BarcodeFormat.ITF, Z.BarcodeFormat.CODABAR,
    Z.BarcodeFormat.DATA_MATRIX, Z.BarcodeFormat.PDF_417, Z.BarcodeFormat.AZTEC];
  hints.set(Z.DecodeHintType.POSSIBLE_FORMATS, formats === 'qr' ? qrOnly : all);
  hints.set(Z.DecodeHintType.TRY_HARDER, true);
  reader = new Z.BrowserMultiFormatReader(hints, 300);
  name = f => (Z.BarcodeFormat[f] || String(f)).replace(/_/g, '-');
  }
  let last = '', running = false;

  return {
    get running() { return running; },
    async start() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('This browser can’t use the camera. Upload a photo of the code instead.');
      running = true;
      await ready();
      await reader.decodeFromConstraints({ video: { facingMode: 'environment' } }, video, (res) => {
        if (res && res.getText() !== last) { last = res.getText(); if (navigator.vibrate) navigator.vibrate(60); onResult(res.getText(), name(res.getBarcodeFormat())); }
      });
    },
    stop() { if (reader) reader.reset(); running = false; last = ''; },
    async file(f) {
      await ready();
      const url = URL.createObjectURL(f);
      try { const res = await reader.decodeFromImageUrl(url); onResult(res.getText(), name(res.getBarcodeFormat())); }
      catch (e) { (onError || (() => {}))('No code found in that image. Try a sharper, closer photo with the whole code in frame.'); }
      finally { URL.revokeObjectURL(url); }
    },
  };
}

// Explain what a scanned value is and offer the right actions.
function describeScan(text, format) {
  const safe = esc(text);
  let kind = 'Text', extra = '';
  if (/^https?:\/\//i.test(text)) {
    kind = 'Website link';
    let host = '';
    try { host = new URL(text).hostname; } catch (e) { host = ''; }
    extra = `<p class="note">Check the address before opening: <strong>${esc(host)}</strong>. Scam QR codes often imitate real sites.</p><a class="btn" href="${safe}" target="_blank" rel="noopener noreferrer nofollow">Open link</a>`;
  } else if (/^WIFI:/i.test(text)) {
    kind = 'Wi-Fi network';
    const get = k => ((text.match(new RegExp(`[;:]${k}:((?:\\\\.|[^;])*)`)) || [])[1] || '').replace(/\\(.)/g, '$1');
    extra = `<table class="tbl"><tbody><tr><td>Network</td><td>${esc(get('S'))}</td></tr><tr><td>Password</td><td><span class="num">${esc(get('P')) || '(none)'}</span></td></tr><tr><td>Security</td><td>${esc(get('T') || 'None')}</td></tr></tbody></table>`;
  } else if (/^BEGIN:VCARD/i.test(text)) {
    kind = 'Contact card';
    const get = k => esc(((text.match(new RegExp(`^${k}[^:]*:(.*)$`, 'mi')) || [])[1] || '').trim());
    extra = `<table class="tbl"><tbody>${[['Name', get('FN')], ['Phone', get('TEL')], ['Email', get('EMAIL')], ['Company', get('ORG')]].filter(r => r[1]).map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</tbody></table>`;
  } else if (/^mailto:/i.test(text)) kind = 'Email address';
  else if (/^(tel:|SMSTO:)/i.test(text)) kind = /^tel:/i.test(text) ? 'Phone number' : 'Text message';
  else if (/^\d{8,14}$/.test(text) && format !== 'QR-CODE') {
    kind = 'Product barcode';
    extra = `<a class="btn ghost" href="https://www.google.com/search?q=${encodeURIComponent(text)}" target="_blank" rel="noopener noreferrer">Search this number</a>`;
  }
  return `<p class="kicker">${esc(format)} · ${kind}</p><div class="copybox" id="scan-text" style="font-family:var(--f-body);font-size:16px">${safe}</div>
    <div class="copyrow"><button type="button" class="btn ghost" data-copy="scan-text">Copy</button></div>${extra}`;
}
