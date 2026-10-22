module.exports = {
  order: 4,
  category: 'convert',
  icon: 'palette',
  name: 'Color Converter',
  keywords: 'hex to rgb rgb to hex hsl cmyk color picker contrast checker',
  short: 'HEX ↔ RGB ↔ HSL ↔ CMYK, with a colour picker, contrast check and shades.',
  title: 'Color Converter: HEX to RGB, HSL & CMYK + Color Picker',
  description: 'Convert colours between HEX, RGB, HSL, HSV and CMYK. Pick any colour, check text contrast against WCAG, and get a palette of tints and shades. Free.',
  related: ['unit-converter', 'image-converter', 'json-formatter'],
  answer: `Pick a colour or type it in any format (<strong>#0B7F5E</strong>, <strong>rgb(11, 127, 94)</strong>, <strong>hsl(163, 84%, 27%)</strong> or a name like "teal") to see it in HEX, RGB, HSL, HSV and CMYK at once. The contrast check tells you whether white or black text on that colour is readable, and the strip below gives you lighter tints and darker shades.`,
  article: `
<h2>Colour formats explained</h2>
<ul>
<li><strong>HEX</strong> (#RRGGBB) is the most common format on the web. Each pair of characters is a red, green or blue value from 00 to FF (0 to 255) in hexadecimal. #FF0000 is pure red; #3AF is short for #33AAFF.</li>
<li><strong>RGB</strong> gives the same red, green and blue values as decimal numbers, from 0 to 255. Screens make every colour by mixing these three lights.</li>
<li><strong>HSL</strong> stands for hue (0–360° around the colour wheel), saturation (0% grey to 100% vivid) and lightness (0% black, 50% pure colour, 100% white). It's the easiest format for adjusting a colour by hand: change only the lightness to get a lighter or darker version.</li>
<li><strong>HSV / HSB</strong> (hue, saturation, value or brightness) is used by colour pickers in Photoshop, Figma and other design tools.</li>
<li><strong>CMYK</strong> (cyan, magenta, yellow, black) describes ink for printing. The values here are a straightforward conversion; for professional print work, your printer's colour profile will adjust them.</li>
</ul>

<h2>Converting HEX to RGB by hand</h2>
<div class="formula">#0B7F5E → 0B | 7F | 5E
0B = 0×16 + 11 = 11
7F = 7×16 + 15 = 127
5E = 5×16 + 14 = 94
→ rgb(11, 127, 94)</div>

<h2>Contrast and accessibility</h2>
<p>The Web Content Accessibility Guidelines (WCAG) measure contrast as a ratio from 1:1 (no contrast) to 21:1 (black on white). Text needs at least <strong>4.5:1</strong> against its background to pass level AA, or 3:1 for large text (about 24 px, or 19 px bold). Level AAA needs 7:1. The contrast boxes show whether white or black text works better on your colour, which is handy for choosing button and badge text.</p>

<h2>Tints and shades</h2>
<p>A tint is a colour mixed with white; a shade is mixed with black. Design systems usually build a scale like this from each brand colour: light tints for backgrounds, the base colour for buttons, darker shades for hover states and text. Tap any square to copy its HEX value and make it the current colour.</p>

<h2>Supported input</h2>
<p>You can type any colour CSS understands: 3-, 6- or 8-digit HEX (with or without #), <code>rgb()</code>, <code>hsl()</code>, and all 148 named CSS colours such as "tomato", "rebeccapurple" and "dodgerblue".</p>`,
  faqs: [
    ['How do I convert HEX to RGB?', 'Split the HEX code into three pairs and convert each from hexadecimal to decimal. #0B7F5E becomes 11, 127, 94. Or paste it above to convert instantly.'],
    ['How do I convert RGB to HEX?', 'Convert each value from 0–255 into a two-digit hexadecimal number and join them. rgb(255, 99, 71) becomes #FF6347.'],
    ['What is a good contrast ratio for text?', 'At least 4.5:1 for normal text and 3:1 for large text to meet WCAG AA. 7:1 meets the stricter AAA level.'],
    ['What is the difference between HSL and HSV?', 'Both use hue and saturation. HSL uses lightness, where 50% is the pure colour; HSV uses value, where 100% is the brightest version of the colour.'],
    ['Can I use colour names?', 'Yes. Type any CSS colour name, such as “teal” or “tomato”, and it is converted to all formats.'],
  ],
};
