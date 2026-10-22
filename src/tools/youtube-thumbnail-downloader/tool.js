const SIZES = [['maxresdefault', 'Full HD', '1280 × 720'], ['sddefault', 'Standard', '640 × 480'], ['hqdefault', 'High', '480 × 360'], ['mqdefault', 'Medium', '320 × 180'], ['default', 'Small', '120 × 90']];
// Works with watch?v=, youtu.be/, /shorts/, /live/, /embed/ links and bare 11-character IDs.
const videoId = s => { const m = s.trim().match(/(?:v=|youtu\.be\/|\/shorts\/|\/live\/|\/embed\/|^)([\w-]{11})(?:[?&#/]|$)/); return m ? m[1] : null; };
function show() {
  const id = videoId($('#url').value), out = $('#out');
  if (!id) { out.innerHTML = '<p class="empty">That doesn’t look like a YouTube video link.</p>'; return; }
  out.innerHTML = SIZES.map(([k, l, d]) => `<li><div class="card" style="flex-direction:column;cursor:default">
    <img src="https://i.ytimg.com/vi/${id}/${k}.jpg" alt="${l} thumbnail" loading="lazy" style="width:100%;border-radius:4px;aspect-ratio:16/9;object-fit:cover;background:var(--surface-2)" onerror="this.closest('li').hidden=true">
    <div><strong>${l}</strong><span>${d}</span></div>
    <button type="button" class="btn" data-k="${k}">Download</button></div></li>`).join('');
  out.dataset.id = id;
}
$('#form').addEventListener('submit', e => { e.preventDefault(); show(); });
$('#out').addEventListener('click', async e => {
  const b = e.target.closest('button[data-k]');
  if (!b) return;
  const id = $('#out').dataset.id, k = b.dataset.k;
  try {
    const blob = await (await fetch(`https://i.ytimg.com/vi/${id}/${k}.jpg`)).blob();
    download(blob, `youtube-${id}-${k}.jpg`);
  } catch (err) { window.open(`https://i.ytimg.com/vi/${id}/${k}.jpg`, '_blank', 'noopener'); }
});
show();
