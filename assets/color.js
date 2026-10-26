'use strict';
// Colour helpers shared by the colour tools: conversions, contrast and colour names.
const Color = (() => {
  const clamp = (v, a = 0, b = 255) => Math.min(b, Math.max(a, v));
  const hexToRgb = hex => {
    let h = String(hex).trim().replace(/^#/, '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const rgbToHex = ([r, g, b]) => '#' + [r, g, b].map(v => Math.round(clamp(v)).toString(16).padStart(2, '0')).join('').toUpperCase();
  function rgbToHsl([r, g, b]) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
    if (mx === mn) return [0, 0, l * 100];
    const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h * 60, s * 100, l * 100];
  }
  function hslToRgb([h, s, l]) {
    h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0) * 255, f(8) * 255, f(4) * 255].map(Math.round);
  }
  // WCAG relative luminance and contrast ratio (1 to 21).
  const lum = rgb => { const [r, g, b] = rgb.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  // CIE Lab, for colour differences that match what eyes see.
  function rgbToLab(rgb) {
    const [r, g, b] = rgb.map(v => { v /= 255; return v > 0.04045 ? ((v + 0.055) / 1.055) ** 2.4 : v / 12.92; });
    const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047, y = r * 0.2126 + g * 0.7152 + b * 0.0722, z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    const f = t => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
  }
  const diff = (a, b) => { const p = rgbToLab(a), q = rgbToLab(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };
  // Everyday colour names (CSS named colours plus common fashion and paint names).
  const NAMES = 'Black:000000,White:FFFFFF,Off-white:F8F6F0,Ivory:FFFFF0,Cream:FFFDD0,Beige:F5F5DC,Light grey:D3D3D3,Silver:C0C0C0,Grey:808080,Dark grey:505050,Charcoal:36454F,Slate grey:708090,Red:FF0000,Crimson:DC143C,Dark red:8B0000,Maroon:800000,Burgundy:800020,Wine:722F37,Brick red:B22222,Tomato:FF6347,Coral:FF7F50,Salmon:FA8072,Light pink:FFB6C1,Pink:FFC0CB,Hot pink:FF69B4,Deep pink:FF1493,Magenta:FF00FF,Fuchsia:C2185B,Rose:E8A0B4,Blush:F4C2C2,Peach:FFDAB9,Orange:FFA500,Dark orange:FF8C00,Rust:B7410E,Burnt orange:CC5500,Amber:FFBF00,Gold:FFD700,Mustard:E1AD01,Yellow:FFFF00,Lemon:FFF44F,Pale yellow:FFFFAA,Khaki:C3B091,Olive:808000,Olive green:6B8E23,Lime:32CD32,Light green:90EE90,Green:008000,Bright green:00C000,Forest green:228B22,Dark green:006400,Bottle green:006A4E,Emerald:50C878,Sea green:2E8B57,Mint:98FF98,Sage:9CAF88,Teal:008080,Turquoise:40E0D0,Aqua:00FFFF,Light blue:ADD8E6,Sky blue:87CEEB,Powder blue:B0E0E6,Baby blue:89CFF0,Blue:0000FF,Royal blue:4169E1,Cobalt:0047AB,Steel blue:4682B4,Denim:1560BD,Navy:000080,Dark navy:0B1A3C,Midnight blue:191970,Indigo:4B0082,Purple:800080,Violet:8F00FF,Lavender:E6E6FA,Lilac:C8A2C8,Plum:8E4585,Mauve:E0B0FF,Brown:8B4513,Chocolate:7B3F00,Dark brown:5C4033,Coffee:6F4E37,Tan:D2B48C,Camel:C19A6B,Sand:C2B280,Taupe:483C32,Copper:B87333,Bronze:CD7F32'.split(',').map(s => { const [n, h] = s.split(':'); return [n, hexToRgb(h)]; });
  function name(rgb) {
    let best = NAMES[0], d = Infinity;
    for (const c of NAMES) { const e = diff(rgb, c[1]); if (e < d) { d = e; best = c; } }
    return { name: best[0], exact: d < 4, rgb: best[1] };
  }
  const fmtHsl = rgb => { const [h, s, l] = rgbToHsl(rgb); return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`; };
  return { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, contrast, lum, diff, name, fmtHsl, NAMES };
})();
