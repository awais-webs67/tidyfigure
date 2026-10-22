onAny('#in, #sep, #max, #lower, #stop, #nums', run);
const STOP = new Set('a an and are as at be but by for from how in into is it of on or so than that the this to was what when where which who why will with without your you'.split(' '));
const MAP = { ß: 'ss', æ: 'ae', Æ: 'AE', ø: 'o', Ø: 'O', œ: 'oe', Œ: 'OE', ł: 'l', Ł: 'L', đ: 'd', Đ: 'D', þ: 'th', ð: 'd', ı: 'i', '&': ' and ', '@': ' at ', '%': ' percent ', '+': ' plus ' };
function slugify(s) {
  const sep = $('#sep').value, max = Math.round(val($('#max')) || 0);
  let t = s.replace(/[ßæÆøØœŒłŁđĐþðı&@%+]/g, c => MAP[c]).normalize('NFKD').replace(/[̀-ͯ]/g, '');
  t = t.replace(/['’]/g, '');
  if ($('#lower').checked) t = t.toLowerCase();
  let words = t.split(/[^A-Za-z0-9Ѐ-ӿ؀-ۿऀ-ॿ一-鿿]+/).filter(Boolean);
  if ($('#nums').checked) words = words.filter(w => !/^\d+$/.test(w));
  if ($('#stop').checked && words.length > 2) { const kept = words.filter(w => !STOP.has(w.toLowerCase())); if (kept.length) words = kept; }
  let slug = words.join(sep);
  if (max > 0 && slug.length > max) { slug = slug.slice(0, max + 1); slug = slug.includes(sep) ? slug.slice(0, slug.lastIndexOf(sep)) : slug.slice(0, max); }
  return slug;
}
function run() {
  const lines = $('#in').value.split('\n').map(l => l.trim()).filter(Boolean), out = $('#out');
  if (!lines.length) { out.innerHTML = '<p class="empty">Type a title to turn it into a URL slug.</p>'; return; }
  const slugs = lines.map(slugify);
  out.innerHTML = `<p class="kicker">${slugs.length > 1 ? `${slugs.length} slugs` : 'URL slug'}</p>
    <div class="copybox" id="slugs" style="font-size:16px">${slugs.map(esc).join('\n')}</div>
    <div class="btns"><button type="button" class="btn" data-copy="slugs">Copy</button></div>
    <p class="note">Preview: <span class="mono">example.com/blog/<strong>${esc(slugs[0])}</strong></span> (${slugs[0].length} characters)</p>`;
}
run();
