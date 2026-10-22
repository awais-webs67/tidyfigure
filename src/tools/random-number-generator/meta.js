module.exports = {
  order: 3,
  category: 'random',
  icon: 'shuffle',
  name: 'Random Number Generator',
  keywords: 'rng pick a number lottery numbers random picker 1-10 1-100',
  short: 'Pick random numbers in any range, with or without repeats.',
  title: 'Random Number Generator: Pick a Number 1–100 or Any Range',
  description: 'Generate random numbers in any range: 1–10, 1–100 or your own. Pick one or thousands, with or without repeats. Lottery and PIN presets. Truly fair.',
  related: ['spin-the-wheel', 'roll-a-dice', 'flip-a-coin'],
  answer: `Set a minimum and maximum, choose how many numbers you need, and press Generate. Every whole number in the range has <strong>exactly the same chance</strong> of being picked. Tick "no repeats" to draw numbers like a raffle or lottery, where each number can only come up once.`,
  article: `
<h2>How the numbers are picked</h2>
<p>The generator uses your browser's cryptographically secure random source (<code>crypto.getRandomValues</code>), which is designed for encryption and is unpredictable in practice. Each number is drawn independently, and every whole number from the minimum to the maximum, including both ends, is equally likely.</p>
<div class="formula">Chance of any one number = 1 ÷ (maximum − minimum + 1)
Picking 1 from 1–100: 1 in 100 = 1%</div>

<h2>With or without repeats</h2>
<ul>
<li><strong>No repeats</strong> works like drawing numbered balls from a bag without putting them back. Use it for raffles, lotteries, picking several winners, or assigning people to different numbered places.</li>
<li><strong>Repeats allowed</strong> works like rolling a die several times: the same number can appear twice. Use it for simulations, games and sampling with replacement.</li>
</ul>

<h2>Everyday uses</h2>
<ul>
<li><strong>Giveaways and raffles:</strong> number your entries and draw a winner. Take a screenshot of the result for transparency.</li>
<li><strong>Classrooms:</strong> pick a student number, choose groups or set random maths problems.</li>
<li><strong>Games:</strong> replace lost dice or decide who goes first.</li>
<li><strong>Lottery numbers:</strong> the "6 of 49" preset draws six different numbers. Random picks are as likely to win as any others, but they're less likely to be shared with other players than birthdays and patterns.</li>
<li><strong>Research and testing:</strong> random sampling, test data and A/B group assignment.</li>
</ul>

<h2>Is it truly random?</h2>
<p>Computers produce "pseudo-random" numbers from an algorithm, but secure generators are seeded from unpredictable physical events inside your device and pass every statistical test for randomness. For anything short of a regulated, audited lottery, the results are as fair as rolling perfect dice.</p>

<h2>Common questions about ranges</h2>
<p>Negative numbers work: −50 to 50 is a range of 101 numbers. If you enter the maximum first by mistake, the tool swaps them for you. Decimals are rounded inwards to whole numbers, so 0.5 to 10.5 becomes 1 to 10.</p>`,
  faqs: [
    ['How do I pick a random number between 1 and 100?', 'Set the minimum to 1 and the maximum to 100, or click the 1–100 preset, then press Generate. Each number has a 1% chance.'],
    ['Is this random number generator fair?', 'Yes. It uses the browser’s cryptographically secure random generator, and every number in the range is equally likely.'],
    ['How do I generate numbers without repeats?', 'Tick “No repeats”. Each number in the range can then be picked at most once, like drawing raffle tickets.'],
    ['Can I generate random lottery numbers?', 'Yes. Click “Lottery 6 of 49”, or set your lottery’s range and how many numbers it draws, with no repeats.'],
    ['Can I use it to pick a giveaway winner?', 'Yes. Number your entries, set the range from 1 to the number of entries, and generate one number.'],
  ],
};
