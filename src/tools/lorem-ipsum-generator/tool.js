const WORDS = ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum ' +
  'curabitur pretium tincidunt lacus nulla gravida orci a odio nullam varius turpis et commodo pharetra eros bibendum elit nec luctus magna felis sollicitudin mauris integer in mauris eu nibh euismod gravida duis ac tellus et risus vulputate vehicula donec lobortis risus a elit etiam tempor ut ullamcorper ligula eu tempor congue eros est euismod turpis id tincidunt sapien risus a quam maecenas fermentum consequat mi donec fermentum pellentesque malesuada nulla a mi duis sapien sem aliquet nec commodo eget consequat quis neque aliquam faucibus elit ut dictum aliquet felis nisl adipiscing sapien sed malesuada diam lacus eget erat cras mollis scelerisque nunc nullam arcu aliquam consequat').split(' ');
const CLASSIC = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
const pick = () => WORDS[Math.floor(Math.random() * WORDS.length)];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

function sentence() {
  const n = 8 + Math.floor(Math.random() * 10);
  const w = Array.from({ length: n }, pick);
  if (n > 10 && Math.random() < 0.6) w[4 + Math.floor(Math.random() * 4)] += ','; // a comma now and then reads naturally
  return cap(w.join(' ')) + '.';
}
const paragraph = () => Array.from({ length: 4 + Math.floor(Math.random() * 4) }, sentence).join(' ');

onAny('#n, #unit, #classic, #html', render);
$('#again').addEventListener('click', render);

function render() {
  const n = Math.min(500, Math.max(1, Math.round(val($('#n')) || 1)));
  const unit = $('#unit').value, classic = $('#classic').checked, html = $('#html').checked;
  let parts;
  if (unit === 'w') {
    const w = Array.from({ length: n }, pick);
    if (classic) CLASSIC.replace(/[,.]/g, '').toLowerCase().split(' ').slice(0, n).forEach((x, i) => { w[i] = x; });
    parts = [cap(w.join(' ')) + '.'];
  } else {
    const make = unit === 'p' ? paragraph : sentence;
    parts = Array.from({ length: n }, make);
    if (classic) parts[0] = unit === 'p' ? CLASSIC + ' ' + parts[0].split('. ').slice(1).join('. ') : CLASSIC;
    if (unit === 'l') parts = parts.map(s => s.split(' ').slice(0, 4 + Math.floor(Math.random() * 4)).join(' ').replace(/[,.]$/, ''));
  }
  let text;
  if (unit === 'l') text = html ? `<ul>\n${parts.map(p => `  <li>${p}</li>`).join('\n')}\n</ul>` : parts.map(p => `• ${p}`).join('\n');
  else if (unit === 's') text = html ? `<p>${parts.join(' ')}</p>` : parts.join(' ');
  else text = html ? parts.map(p => `<p>${p}</p>`).join('\n\n') : parts.join('\n\n');
  $('#result').textContent = text;
  const words = text.replace(/<[^>]+>/g, '').split(/\s+/).filter(w => /\w/.test(w)).length;
  $('#count').textContent = `${words} words · ${text.length.toLocaleString()} characters`;
}
render();
