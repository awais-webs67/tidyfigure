module.exports = {
  order: 9,
  category: 'image',
  icon: 'shield-off',
  popular: true,
  files: true,
  libs: ['https://cdn.jsdelivr.net/npm/exifr@7.1.3/dist/full.umd.js'],
  name: 'Image Metadata Remover',
  keywords: 'remove exif data photo gps location remover exif viewer strip metadata',
  short: 'See and remove hidden EXIF data from photos, including GPS location.',
  title: 'Remove EXIF Data & GPS Location From Photos, Free',
  description: 'View and remove hidden photo metadata: GPS location, camera, date and software. Lossless for JPG and PNG, batch support, nothing uploaded. Free EXIF remover.',
  related: ['pdf-metadata-remover', 'image-compressor', 'add-watermark-to-image'],
  answer: `Photos from phones and cameras carry hidden <strong>EXIF metadata</strong>: the exact <strong>GPS location</strong> where they were taken, the date and time, the camera or phone model and the editing software. Drop photos here to see what they reveal, then download clean copies. JPG and PNG files are cleaned <strong>without re-compressing</strong>, so quality is untouched.`,
  article: `
<h2>Why remove photo metadata?</h2>
<p>Most phones record the GPS coordinates of every photo by default. Share a picture taken at home, and anyone who downloads the original file can find your address to within a few metres. The same goes for photos of your children's school, your car outside your workplace, or items you're selling online. Metadata can also reveal when you were somewhere, what device you own, and the software you used to edit the image.</p>

<h2>What this tool shows and removes</h2>
<ul>
<li><strong>GPS location</strong>, with a map link so you can see exactly what the photo gives away</li>
<li><strong>Date and time</strong> the photo was taken</li>
<li><strong>Camera or phone</strong> make and model, lens and settings</li>
<li><strong>Software</strong> used to edit it</li>
<li><strong>Author and copyright</strong> fields, XMP and IPTC data added by editing apps</li>
</ul>

<h2>How the cleaning works</h2>
<p>For <strong>JPG</strong> files, the tool removes the metadata blocks (EXIF, XMP, IPTC and comments) directly from the file and leaves the compressed image data exactly as it was, so there's no loss of quality. The colour profile is kept so colours look the same. For <strong>PNG</strong>, text and EXIF chunks are removed the same way.</p>
<p>Phone photos sometimes rely on an "orientation" tag to display the right way up. Removing that tag would make them appear sideways, so those photos (and formats like WebP) are redrawn upright and saved at 95% quality instead.</p>

<h2>Don't social networks remove it anyway?</h2>
<p>Facebook, Instagram, X and WhatsApp (when sending as a photo) strip location data from the images they show. But many places don't: email attachments, cloud-storage links, messaging apps sending "as file" or "as document", forums, marketplaces and your own website. Cleaning photos before you share them is the safe habit.</p>

<h2>Stop it at the source</h2>
<p>On iPhone, go to Settings → Privacy &amp; Security → Location Services → Camera and choose "Never". On Android, open the Camera app's settings and turn off "Location tags" (the wording varies by phone). On iPhone you can also tap "Options" on the share screen and turn off "Location" for a single share.</p>

<h2>Private by design</h2>
<p>Checking for hidden data by uploading your photo to a website would defeat the purpose. This tool reads and cleans your photos entirely in your browser.</p>`,
  faqs: [
    ['How do I remove the location from a photo?', 'Drop the photo here and download the clean copy. GPS coordinates and all other EXIF data are removed.'],
    ['How can I see if my photo has GPS data?', 'Open it here. If it has a location, you’ll see a warning and a map link to the exact spot.'],
    ['Does removing EXIF reduce quality?', 'Not for JPG and PNG: the metadata is removed without re-compressing the image. Photos that need rotating are re-saved at 95% quality.'],
    ['Do WhatsApp and Instagram remove EXIF data?', 'They remove it from images shown in the app, but not when files are sent as documents, emailed or shared through cloud links.'],
    ['Are my photos uploaded?', 'No. Everything happens in your browser.'],
  ],
};
