module.exports = {
  order: 4,
  category: 'media',
  icon: 'film',
  popular: true,
  files: true,
  scripts: ['media.js'],
  appCategory: 'MultimediaApplication',
  name: 'Video to GIF Maker',
  keywords: 'mp4 to gif convert video to gif animated gif maker clip to gif boomerang caption',
  short: 'Turn a few seconds of video into a looping GIF, with a caption or boomerang.',
  title: 'Video to GIF Converter: Make GIFs from MP4 & MOV, Free',
  description: 'Turn any MP4, MOV or WebM clip into an animated GIF in your browser. Set the start, length, size and speed, add a caption or boomerang. No watermark.',
  related: ['video-cutter', 'meme-generator', 'video-compressor'],
  answer: `To make a GIF from a video, choose the video below, pause it where the GIF should start, set the length (2–5 seconds works best) and press <strong>Make GIF</strong>. You can change the width, frame rate and speed, add a caption, or make it a boomerang. Everything happens on your device, without a watermark.`,
  article: `
<h2>How to turn a video into a GIF</h2>
<ol>
<li>Drop a video into the box or tap to choose one. Phone videos (MP4, iPhone MOV) and WebM files work.</li>
<li>Play the video and pause it where you want the GIF to begin. The start time fills in for you, or you can type it.</li>
<li>Choose how many seconds to use. Short is better: GIFs are big files, and 2–5 seconds makes the best loops.</li>
<li>Pick a width, frames per second and speed. Add a caption if you like, or tick <strong>Boomerang</strong> for a back-and-forth loop.</li>
<li>Press <strong>Make GIF</strong>, check the preview, and download it.</li>
</ol>

<h2>Why GIFs are bigger than videos</h2>
<p>The GIF format is from 1987. Each frame is stored as its own picture with at most <strong>256 colours</strong>, and there's no modern video compression. A 3-second GIF can be larger than a 30-second MP4. That's why the size settings matter so much:</p>
<div class="formula">Frames = seconds × frames per second
Size grows with: width × height × frames

3 s × 12 fps = 36 frames
Halving the width (480 → 240) makes each frame about 4× smaller</div>
<div class="scroll"><table class="tbl">
<thead><tr><th>Use</th><th>Width</th><th>FPS</th><th>Length</th></tr></thead>
<tbody>
<tr><td>Chat reaction (WhatsApp, Slack, Discord)</td><td>320 px</td><td>10–12</td><td>2–3 s</td></tr>
<tr><td>Email or website</td><td>480 px</td><td>12</td><td>3–5 s</td></tr>
<tr><td>Tutorial or product demo</td><td>640 px</td><td>12–15</td><td>5–10 s</td></tr>
</tbody></table></div>
<p>Calm scenes with flat colours (screen recordings, cartoons) make much smaller GIFs than busy camera footage, because each frame compresses better.</p>

<h2>Frame rate and speed</h2>
<p>Films run at 24 frames per second and phone videos at 30, but a GIF looks smooth at 12–15 fps and uses half the frames. Choose 20 fps only for fast action. The <strong>speed</strong> option changes how long each frame is shown without changing how many frames there are, so 2× makes a quicker loop of the same size and 0.5× gives slow motion.</p>

<h2>Boomerang loops</h2>
<p>A boomerang plays the clip forwards and then backwards, so the loop never jumps. It works best with simple movements: a wave, a toast, a jump or a splash. It nearly doubles the number of frames, so keep these clips short.</p>

<h2>Captions</h2>
<p>The caption is drawn in bold white letters with a black outline (the classic meme style), so it's readable on light and dark footage. Keep it short, around 25 characters, so it fits on narrow GIFs. For still images with top and bottom text, use the <a href="/meme-generator">meme generator</a>.</p>

<h2>When to use a video instead</h2>
<p>Most social networks turn uploaded GIFs into short videos anyway. If a GIF is over about 8 MB, consider sharing a short clip made with the <a href="/video-cutter">video cutter</a> instead: it will look better and load faster.</p>`,
  faqs: [
    ['How do I convert an MP4 to a GIF?', 'Choose the MP4 above, set the start time and length, and press Make GIF. Then download the animated GIF.'],
    ['How long can my GIF be?', 'Up to 30 seconds, but 2–5 seconds is best. Long GIFs become very large files.'],
    ['How do I make my GIF smaller?', 'Lower the width, choose fewer frames per second, or shorten the length. Each change reduces the number of pixels the GIF has to store.'],
    ['Does the GIF have a watermark?', 'No. There is no watermark and no sign-up.'],
    ['Can I add text to a GIF?', 'Yes. Type a caption and it appears at the bottom of every frame in bold white letters with a black outline.'],
  ],
};
