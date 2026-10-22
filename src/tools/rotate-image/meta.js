module.exports = {
  order: 5,
  category: 'image',
  icon: 'rotate-cw-square',
  files: true,
  name: 'Rotate & Flip Image',
  keywords: 'rotate photo flip image mirror picture straighten horizon',
  short: 'Rotate photos 90°, flip or mirror them, and straighten tilted horizons.',
  title: 'Rotate Image Online: Rotate, Flip & Straighten Photos',
  description: 'Rotate images 90° left or right, flip or mirror them, and straighten a tilted horizon with automatic cropping. Free, private, works on phone and desktop.',
  related: ['crop-image', 'image-resizer', 'photo-editor'],
  answer: `Use <strong>⟲ / ⟳</strong> to turn a photo by 90°, <strong>flip</strong> to mirror it, and the <strong>straighten</strong> slider to fix a tilted horizon by up to 45°. When straightening, the corners are cropped automatically so there are no empty triangles. Download the result at full resolution.`,
  article: `
<h2>Rotate, flip or straighten?</h2>
<ul>
<li><strong>Rotate 90°:</strong> fixes photos that show up sideways, which happens when a phone saves orientation in a way some apps ignore.</li>
<li><strong>Flip horizontal (mirror):</strong> undoes the mirror effect of front-facing selfie cameras, so text reads the right way round. It's also used for design layouts.</li>
<li><strong>Flip vertical:</strong> turns a picture upside down along its horizontal axis; useful for reflections and creative effects.</li>
<li><strong>Straighten:</strong> corrects small tilts, like a sloping horizon or a building that leans because the camera wasn't level.</li>
</ul>

<h2>How straightening works</h2>
<p>Rotating a rectangle by a small angle makes its corners stick out, leaving empty triangles. With "crop away the corners" ticked, the tool keeps the largest rectangle that fits inside the rotated photo, with the same proportions as the original. Untick it to keep the whole image on a larger canvas (white for JPG, transparent for PNG and WebP).</p>
<p>Tip: find a line that should be level, such as the horizon, a table edge or a window sill, and move the slider until it's parallel to the edge of the frame. Most tilts are under 5°.</p>

<h2>Why photos appear sideways</h2>
<p>Phones don't actually rotate the pixels when you turn the camera; they store an "orientation" flag in the photo's EXIF metadata. Most apps respect it, but some websites, older software and printers ignore it, so the photo appears sideways. Rotating here applies the rotation to the pixels themselves, so the photo looks right everywhere.</p>

<h2>Quality</h2>
<p>90° rotations and flips move pixels without changing them. Straightening at other angles needs resampling, which softens the image very slightly; the tool uses high-quality smoothing to keep this to a minimum. The image is saved in its original format (JPG at 92% quality).</p>

<h2>Private by design</h2>
<p>Everything happens in your browser, so your photos are never uploaded.</p>`,
  faqs: [
    ['How do I rotate a picture 90 degrees?', 'Open the image and press Left 90° or Right 90°, then download.'],
    ['How do I mirror a selfie?', 'Press Flip horizontal. Text in the photo will read the right way round.'],
    ['How do I straighten a crooked photo?', 'Move the Straighten slider until the horizon is level. The corners are cropped automatically.'],
    ['Will rotating reduce quality?', '90° turns and flips don’t lose quality. Small-angle straightening softens the image very slightly.'],
    ['Is my photo uploaded?', 'No. Rotation happens in your browser.'],
  ],
};
