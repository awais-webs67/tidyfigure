module.exports = {
  order: 4,
  category: 'random',
  icon: 'ferris-wheel',
  popular: true,
  name: 'Spin the Wheel',
  keywords: 'wheel spinner random name picker decision wheel wheel of names yes no wheel',
  short: 'A fair, random wheel spinner for names, prizes, choices and yes/no decisions.',
  title: 'Spin the Wheel: Random Name Picker & Decision Wheel',
  description: 'Spin a random wheel to pick names, winners, prizes or what to eat. Add your own entries, remove winners, shuffle, or use the yes/no wheel. Free and fair.',
  related: ['random-number-generator', 'flip-a-coin', 'roll-a-dice'],
  answer: `Type your entries, one per line, and spin. The winner is chosen by a <strong>secure random number</strong> before the wheel starts turning, so every entry has <strong>exactly the same chance</strong>, no matter where it sits on the wheel. Tick "remove the winner" to draw several winners in a row, like a raffle.`,
  article: `
<h2>How the wheel picks a winner</h2>
<p>Real prize wheels can be unfair: a heavier side, a sticky pointer or a weak spin all change the odds. This wheel uses your browser's cryptographically secure random generator to choose the winner first, then animates the spin so it lands inside that entry's slice. With 8 entries, each has a 1 in 8 (12.5%) chance, every time.</p>
<div class="formula">Chance of each entry = 1 ÷ number of entries
Entering a name twice doubles its chance</div>

<h2>Ideas for using the wheel</h2>
<ul>
<li><strong>Classrooms:</strong> pick who answers next, choose groups or decide the order of presentations. Tick "remove the winner" so nobody is picked twice.</li>
<li><strong>Giveaways and raffles:</strong> paste the list of entrants, spin on a live stream or screen share, and the result is visibly random.</li>
<li><strong>Decisions:</strong> what to eat, which film to watch, where to go this weekend.</li>
<li><strong>Games and parties:</strong> truth or dare prompts, forfeits, who goes first.</li>
<li><strong>Teams at work:</strong> pick who runs the stand-up or reviews the next task.</li>
<li><strong>Yes or no:</strong> when you really can't decide, let the wheel do it.</li>
</ul>

<h2>Tips</h2>
<ul>
<li><strong>Weighting:</strong> want one option to be twice as likely? Enter it twice. "Shuffle" spreads duplicates around the wheel.</li>
<li><strong>Long lists:</strong> the wheel handles a hundred entries or more; text gets smaller as slices get thinner, and very long names are shortened on the wheel (the full name shows as the result).</li>
<li><strong>Removing winners:</strong> with the option ticked, the winner disappears from the list a moment after the result appears, ready for the next spin.</li>
<li><strong>Click the wheel itself</strong> to spin, which is handy on a projector or touch screen.</li>
</ul>

<h2>Is a wheel spinner really random?</h2>
<p>Yes. The animation's speed and the number of turns vary each time, but they don't decide the outcome: the secure random number does. That makes the wheel as fair as drawing names from a hat, and fairer than a physical spinner.</p>`,
  faqs: [
    ['Is the wheel spinner fair?', 'Yes. The winner is picked with a cryptographically secure random number before the animation starts, so every entry has exactly the same chance.'],
    ['How do I make one option more likely?', 'Add it more than once. An entry listed twice has twice the chance of being picked.'],
    ['Can I pick multiple winners without repeats?', 'Yes. Tick “Remove the winner after each spin”, then spin again for each winner.'],
    ['How many entries can I add?', 'As many as you like. The text shrinks as slices get smaller, and over 100 entries still works.'],
    ['Can I use the wheel for a giveaway?', 'Yes. Paste the entrants’ names, spin on screen so everyone can see, and take a screenshot of the result.'],
  ],
};
