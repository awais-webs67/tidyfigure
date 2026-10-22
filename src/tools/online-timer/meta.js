module.exports = {
  order: 1,
  category: 'time',
  icon: 'timer',
  popular: true,
  name: 'Online Timer',
  keywords: 'countdown timer 5 minute timer 10 minute timer alarm pomodoro',
  short: 'A countdown timer with an alarm: 1, 5, 10, 25 minutes or any time you set.',
  title: 'Online Timer: Countdown Timer With Alarm, Free',
  description: 'Free online countdown timer with alarm. Set any time or use quick presets: 1, 5, 10, 15, 25 (Pomodoro) or 30 minutes. Keeps exact time in background tabs.',
  related: ['stopwatch', 'days-between-dates', 'age-calculator'],
  answer: `Set hours, minutes and seconds, or tap a preset like <strong>5 min</strong> or <strong>25 min (Pomodoro)</strong>, and press Start. The timer counts down in big digits, shows the time left in your browser tab, and plays an alarm when it reaches zero. It keeps exact time even if you switch to another tab.`,
  article: `
<h2>How to use the timer</h2>
<ol>
<li>Type the hours, minutes and seconds, or tap a preset (presets start immediately).</li>
<li>Press <strong>Start</strong> or the space bar. Press again to pause, and again to resume.</li>
<li>When time is up, an alarm plays and the tab title changes to "⏰ Time's up!", so you'll notice even if the timer is in another tab.</li>
<li><strong>Reset</strong> returns to the time you set.</li>
</ol>

<h2>Accurate even in the background</h2>
<p>Browsers slow down pages in background tabs to save battery, which makes simple timers drift. This timer records the exact moment it should end and checks the clock against it, so it finishes on time whether you're looking at it or not. Keep the tab open (it doesn't need to be visible), and turn your volume up if you want to hear the alarm.</p>

<h2>Popular timer lengths</h2>
<div class="scroll"><table class="tbl">
<thead><tr><th>Timer</th><th>Good for</th></tr></thead>
<tbody>
<tr><td>1 minute</td><td>Plank, quick breathing exercise, speech practice</td></tr>
<tr><td>3 minutes</td><td>Tea, soft-boiled egg (about 6 for medium), brushing teeth twice</td></tr>
<tr><td>5 minutes</td><td>Short break, quick tidy-up, classroom activity</td></tr>
<tr><td>10 minutes</td><td>Meditation, reading, power nap warm-up</td></tr>
<tr><td>15 minutes</td><td>Long break, quick workout, exam section</td></tr>
<tr><td>25 minutes</td><td>One Pomodoro focus session</td></tr>
<tr><td>30–60 minutes</td><td>Study block, baking, laundry cycle</td></tr>
</tbody></table></div>

<h2>The Pomodoro technique</h2>
<p>The Pomodoro technique, created by Francesco Cirillo in the late 1980s, breaks work into focused intervals. Work for 25 minutes on one task with no distractions, then take a 5-minute break. After four rounds, take a longer break of 15–30 minutes. The timer creates a sense of urgency and makes big tasks feel manageable. Use the 25-minute preset, then the 5-minute one for your break.</p>

<h2>Timers in the classroom</h2>
<p>A big, visible countdown helps students manage time during activities, tests and transitions. Put the page on the projector, press F11 (or use your browser's full-screen mode) for an uncluttered view, and the progress bar shows at a glance how much time remains.</p>`,
  faqs: [
    ['How do I set a 10-minute timer?', 'Tap the “10 min” preset. It sets the time and starts counting down straight away.'],
    ['Will the timer keep running if I switch tabs?', 'Yes. It measures time against the clock, so it stays accurate in a background tab. Keep the tab open.'],
    ['Why didn’t I hear the alarm?', 'Check that your device volume is up and “Play an alarm” is ticked. Browsers only allow sound after you’ve clicked on the page, which pressing Start does.'],
    ['Can I pause the timer?', 'Yes. Press Pause (or the space bar) and press Resume to carry on from where it stopped.'],
    ['What is a Pomodoro timer?', 'A 25-minute focus timer followed by a 5-minute break, repeated four times before a longer break. Use the 25 min preset.'],
  ],
};
