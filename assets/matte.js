'use strict';
// Background worker that cleans up a cut-out's edges (used by AI.removeBackground in ai.js).
// 1. Edge-aware mask: the AI's mask is small (320 or 1024 px), so stretched over a big photo its edge is a soft
//    band that still holds old background. A guided filter (He, Sun & Tang, 2010) re-fits the mask to the
//    real edges of the photo.
// 2. Colour clean-up: see-through edge pixels (hair, fur) still carry the old background's colour, which shows
//    as a coloured border on a new background. Blur-fusion foreground estimation (Forte & Pitié, 2021)
//    works out each edge pixel's own colour without the old background.
// Message in: { id, mask: {w, h, data 0–255} } plus either bitmap (an ImageBitmap of the photo) or
// small (the photo at up to WORK px, {w, h, data RGBA}) and full (the photo at full size, or null).
// Message out: { id, bitmap } or { id, w, h, data RGBA }: the cut-out at full size; { id, error } on failure.

// Box blur of one channel, radius r (window 2r + 1), normalised at the borders. Two passes of running sums.
function blur(src, w, h, r, out, tmp) {
  r = Math.max(1, Math.round(r));
  for (let y = 0; y < h; y++) {
    const o = y * w;
    let s = 0, n = 0;
    for (let x = 0; x < Math.min(r, w); x++) { s += src[o + x]; n++; }
    for (let x = 0; x < w; x++) {
      const a = x + r, b = x - r - 1;
      if (a < w) { s += src[o + a]; n++; }
      if (b >= 0) { s -= src[o + b]; n--; }
      tmp[o + x] = s / n;
    }
  }
  for (let x = 0; x < w; x++) {
    let s = 0, n = 0;
    for (let y = 0; y < Math.min(r, h); y++) { s += tmp[y * w + x]; n++; }
    for (let y = 0; y < h; y++) {
      const a = y + r, b = y - r - 1;
      if (a < h) { s += tmp[a * w + x]; n++; }
      if (b >= 0) { s -= tmp[b * w + x]; n--; }
      out[y * w + x] = s / n;
    }
  }
  return out;
}

// Mask stretched to w × h (bilinear), 0–1.
function upscale(m, mw, mh, w, h) {
  const out = new Float32Array(w * h), sx = mw / w, sy = mh / h;
  for (let y = 0; y < h; y++) {
    const fy = Math.min(mh - 1, Math.max(0, (y + 0.5) * sy - 0.5)), y0 = Math.floor(fy), y1 = Math.min(mh - 1, y0 + 1), ty = fy - y0;
    for (let x = 0; x < w; x++) {
      const fx = Math.min(mw - 1, Math.max(0, (x + 0.5) * sx - 0.5)), x0 = Math.floor(fx), x1 = Math.min(mw - 1, x0 + 1), tx = fx - x0;
      const a = m[y0 * mw + x0] * (1 - tx) + m[y0 * mw + x1] * tx, b = m[y1 * mw + x0] * (1 - tx) + m[y1 * mw + x1] * tx;
      out[y * w + x] = (a * (1 - ty) + b * ty) / 255;
    }
  }
  return out;
}

// Guided filter with a colour guide (RGB, 0–1): the output follows the photo's edges.
function guided(R, G, B, p, w, h, r, eps) {
  const n = w * h, t = new Float32Array(n), F = () => new Float32Array(n);
  const mR = blur(R, w, h, r, F(), t), mG = blur(G, w, h, r, F(), t), mB = blur(B, w, h, r, F(), t), mp = blur(p, w, h, r, F(), t);
  const prod = (a, b) => { const o = F(); for (let i = 0; i < n; i++) o[i] = a[i] * b[i]; return o; };
  const cov = (a, b, ma, mb) => { const o = blur(prod(a, b), w, h, r, F(), t); for (let i = 0; i < n; i++) o[i] -= ma[i] * mb[i]; return o; };
  const vRR = cov(R, R, mR, mR), vRG = cov(R, G, mR, mG), vRB = cov(R, B, mR, mB), vGG = cov(G, G, mG, mG), vGB = cov(G, B, mG, mB), vBB = cov(B, B, mB, mB);
  const cR = cov(R, p, mR, mp), cG = cov(G, p, mG, mp), cB = cov(B, p, mB, mp);
  // a = (Σ + εI)⁻¹ · cov(I, p) per pixel; b = mean(p) − a · mean(I). The results reuse the covariance arrays.
  const aR = vRR, aG = vGG, aB = vBB, bb = mp;
  for (let i = 0; i < n; i++) {
    const rr = vRR[i] + eps, rg = vRG[i], rb = vRB[i], gg = vGG[i] + eps, gb = vGB[i], b2 = vBB[i] + eps;
    const i00 = gg * b2 - gb * gb, i01 = rb * gb - rg * b2, i02 = rg * gb - rb * gg, i11 = rr * b2 - rb * rb, i12 = rb * rg - rr * gb, i22 = rr * gg - rg * rg;
    const det = rr * i00 + rg * i01 + rb * i02;
    const x = (i00 * cR[i] + i01 * cG[i] + i02 * cB[i]) / det, y = (i01 * cR[i] + i11 * cG[i] + i12 * cB[i]) / det, z = (i02 * cR[i] + i12 * cG[i] + i22 * cB[i]) / det;
    aR[i] = x; aG[i] = y; aB[i] = z; bb[i] = mp[i] - x * mR[i] - y * mG[i] - z * mB[i];
  }
  const maR = blur(aR, w, h, r, vRG, t), maG = blur(aG, w, h, r, vRB, t), maB = blur(aB, w, h, r, vGB, t), mbb = blur(bb, w, h, r, cR, t);
  const q = F();
  for (let i = 0; i < n; i++) q[i] = Math.min(1, Math.max(0, maR[i] * R[i] + maG[i] * G[i] + maB[i] * B[i] + mbb[i]));
  return q;
}

// One blur-fusion step: smoothed foreground and background colours around each pixel (3 channels each).
function fusion(I, F, Bk, a, w, h, r) {
  const n = w * h, t = new Float32Array(n), x = new Float32Array(n);
  const ba = blur(a, w, h, r, new Float32Array(n), t), bF = [], bB = [];
  for (let c = 0; c < 3; c++) {
    for (let i = 0; i < n; i++) x[i] = F[c][i] * a[i];
    const f = blur(x, w, h, r, new Float32Array(n), t);
    for (let i = 0; i < n; i++) f[i] /= ba[i] + 1e-5;
    for (let i = 0; i < n; i++) x[i] = Bk[c][i] * (1 - a[i]);
    const b = blur(x, w, h, r, new Float32Array(n), t);
    for (let i = 0; i < n; i++) b[i] /= 1 - ba[i] + 1e-5;
    bF.push(f); bB.push(b);
  }
  return { bF, bB };
}
const est = (I, a, bF, bB, i, c) => { const v = bF[c][i] + a * (I - a * bF[c][i] - (1 - a) * bB[c][i]); return v < 0 ? 0 : v > 1 ? 1 : v; };

const WORK = 1280; // longest side the edges are worked out at
self.onmessage = e => {
  let { id, small, mask, full, bitmap } = e.data;
  try {
    if (bitmap) {
      // The photo arrives as a bitmap: read its pixels here, at full size and at the working size.
      const read = (W, H) => { const c = new OffscreenCanvas(W, H), x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(bitmap, 0, 0, W, H); return { w: W, h: H, data: x.getImageData(0, 0, W, H).data }; };
      const k = Math.min(1, WORK / Math.max(bitmap.width, bitmap.height));
      small = read(Math.round(bitmap.width * k), Math.round(bitmap.height * k));
      full = k < 1 ? read(bitmap.width, bitmap.height) : null;
      bitmap.close();
    }
    const { w, h } = small, n = w * h, d = small.data;
    const R = new Float32Array(n), G = new Float32Array(n), B = new Float32Array(n);
    for (let i = 0; i < n; i++) { R[i] = d[i * 4] / 255; G[i] = d[i * 4 + 1] / 255; B[i] = d[i * 4 + 2] / 255; }
    const p = upscale(mask.data, mask.w, mask.h, w, h), k = Math.max(w, h) / 1024;
    // Refit the mask to the photo's edges, then keep the AI's own answer away from the edges (inside and outside),
    // so the filter can't fade out the middle of a subject that has colours like the background.
    const q = guided(R, G, B, p, w, h, Math.max(2, Math.round(6 * k)), 1e-4);
    const a = new Float32Array(n);
    for (let i = 0; i < n; i++) { const m = p[i], v = m > 0.98 ? Math.max(q[i], m) : m < 0.02 ? Math.min(q[i], m) : q[i]; a[i] = v < 0.04 ? 0 : v; } // faint specks go
    // Colour clean-up: a wide pass for the overall background colour, then a fine one (radii as in the paper at 1024 px).
    const I = [R, G, B];
    const one = fusion(I, I, I, a, w, h, 45 * k);
    const F1 = [0, 1, 2].map(c => { const o = new Float32Array(n); for (let i = 0; i < n; i++) o[i] = est(I[c][i], a[i], one.bF, one.bB, i, c); return o; });
    const two = fusion(I, F1, one.bB, a, w, h, Math.max(2, 3 * k));
    let W = w, H = h, out;
    if (full && (full.w !== w || full.h !== h)) {
      // Full size: the mask and the smooth colour fields are stretched up; each pixel keeps its own detail.
      W = full.w; H = full.h; out = full.data;
      const sx = w / W, sy = h / H, s = (arr, i0, i1, i2, i3, tx, ty) => (arr[i0] * (1 - tx) + arr[i1] * tx) * (1 - ty) + (arr[i2] * (1 - tx) + arr[i3] * tx) * ty;
      for (let y = 0; y < H; y++) {
        const fy = Math.min(h - 1, Math.max(0, (y + 0.5) * sy - 0.5)), y0 = Math.floor(fy), y1 = Math.min(h - 1, y0 + 1), ty = fy - y0;
        for (let x = 0; x < W; x++) {
          const fx = Math.min(w - 1, Math.max(0, (x + 0.5) * sx - 0.5)), x0 = Math.floor(fx), x1 = Math.min(w - 1, x0 + 1), tx = fx - x0;
          const i0 = y0 * w + x0, i1 = y0 * w + x1, i2 = y1 * w + x0, i3 = y1 * w + x1, j = (y * W + x) * 4;
          const al = s(a, i0, i1, i2, i3, tx, ty);
          out[j + 3] = al * 255 + 0.5;
          if (al > 0.004 && al < 0.996) for (let c = 0; c < 3; c++) {
            const f = s(two.bF[c], i0, i1, i2, i3, tx, ty), b = s(two.bB[c], i0, i1, i2, i3, tx, ty), I0 = out[j + c] / 255;
            const v = f + al * (I0 - al * f - (1 - al) * b);
            out[j + c] = (v < 0 ? 0 : v > 1 ? 1 : v) * 255 + 0.5;
          }
        }
      }
    } else {
      out = new Uint8ClampedArray(n * 4);
      for (let i = 0; i < n; i++) {
        out[i * 4 + 3] = a[i] * 255 + 0.5;
        for (let c = 0; c < 3; c++) out[i * 4 + c] = (a[i] > 0.004 && a[i] < 0.996 ? est(I[c][i], a[i], two.bF, two.bB, i, c) : I[c][i]) * 255 + 0.5;
      }
    }
    if (typeof OffscreenCanvas !== 'undefined') {
      // Hand back a ready-to-draw bitmap, so the page doesn't have to copy pixels.
      const c = new OffscreenCanvas(W, H);
      c.getContext('2d').putImageData(new ImageData(out, W, H), 0, 0);
      const bmp = c.transferToImageBitmap();
      self.postMessage({ id, bitmap: bmp }, [bmp]);
    } else self.postMessage({ id, w: W, h: H, data: out }, [out.buffer]);
  } catch (err) { self.postMessage({ id, error: String(err && err.message || err) }); }
};
