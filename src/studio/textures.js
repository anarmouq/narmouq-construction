import * as THREE from "three";
function mulberry(seed) {
  return () => {
    seed |= 0;
    seed = seed + 1831565813 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function makeNoise(seed) {
  const rand = mulberry(seed);
  const SIZE = 256;
  const table = new Float32Array(SIZE * SIZE);
  for (let i = 0; i < table.length; i++) table[i] = rand();
  const fade = (t) => t * t * (3 - 2 * t);
  const lattice = (x, y, px, py) => {
    const ix = (x % px + px) % px;
    const iy = (y % py + py) % py;
    return table[(iy & 255) * SIZE + (ix & 255)];
  };
  const noise = (x, y, px, py) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = fade(x - x0);
    const fy = fade(y - y0);
    const a = lattice(x0, y0, px, py);
    const b = lattice(x0 + 1, y0, px, py);
    const c = lattice(x0, y0 + 1, px, py);
    const d = lattice(x0 + 1, y0 + 1, px, py);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
  const fbm = (u, v, fx, fy, oct = 4) => {
    let sum = 0;
    let amp = 0.5;
    let norm = 0;
    let px = fx;
    let py = fy;
    for (let o = 0; o < oct; o++) {
      sum += noise(u * px, v * py, px, py) * amp;
      norm += amp;
      amp *= 0.5;
      px *= 2;
      py *= 2;
    }
    return sum / norm;
  };
  return { noise, fbm, rand };
}
function paint(w, h, fn) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let y = 0; y < h; y++) {
    const v = y / h;
    for (let x = 0; x < w; x++) {
      const [r, g, b] = fn(x / w, v);
      const i = (y * w + x) * 4;
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}
function toTexture(canvas, color, repeat = 1) {
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}
const mix = (a, b, t) => a + (b - a) * t;
const cl = (v) => v < 0 ? 0 : v > 255 ? 255 : v;
function woodCanvases(seed, w = 128, h = 1024) {
  const { fbm, rand } = makeNoise(seed);
  const knots = Array.from({ length: 1 + Math.floor(rand() * 2) }, () => ({
    u: 0.2 + rand() * 0.6,
    v: rand(),
    r: 0.012 + rand() * 0.02
  }));
  const ringFreq = 5 + rand() * 4;
  const field = (u, v) => {
    let d = u * ringFreq + fbm(u, v, 2, 6) * 4.2 + fbm(u, v, 8, 40, 3) * 0.35;
    let knot = 0;
    for (const k of knots) {
      let dv = Math.abs(v - k.v);
      dv = Math.min(dv, 1 - dv) * 7;
      const du = u - k.u;
      const dist = Math.sqrt(du * du + dv * dv);
      const inf = Math.exp(-(dist * dist) / (k.r * k.r * 18));
      d += inf * 2.2;
      knot = Math.max(knot, Math.exp(-(dist * dist) / (k.r * k.r)));
    }
    const s = Math.sin(d * Math.PI * 2);
    const line = Math.pow(1 - Math.abs(s), 5);
    const pores = fbm(u, v, 64, 8, 2);
    return { line, pores, knot, broad: fbm(u, v, 1, 3, 3) };
  };
  const color = paint(w, h, (u, v) => {
    const f = field(u, v);
    const t = f.line * 0.55 + (f.pores - 0.5) * 0.35 + (f.broad - 0.5) * 0.4 + f.knot * 0.9;
    return [cl(mix(240, 150, t)), cl(mix(226, 110, t)), cl(mix(206, 76, t))];
  });
  const bump = paint(w, h, (u, v) => {
    const f = field(u, v);
    const g = cl(200 - f.line * 110 - (1 - f.pores) * 40 - f.knot * 60);
    return [g, g, g];
  });
  return { color, bump };
}
function concreteCanvases(seed, size = 512, formwork = true) {
  const { fbm, rand } = makeNoise(seed);
  const pores = Array.from({ length: 900 }, () => ({
    u: rand(),
    v: rand(),
    r: (0.4 + rand() * 1.4) / size
  }));
  const G = 32;
  const grid = Array.from({ length: G * G }, () => []);
  pores.forEach((p, i) => grid[Math.floor(p.v * G) * G + Math.floor(p.u * G)].push(i));
  const field = (u, v) => {
    const n = fbm(u, v, 4, 4, 5);
    const stain = fbm(u, v, 2, 2, 3);
    let pore = 0;
    const gx = Math.floor(u * G);
    const gy = Math.floor(v * G);
    for (const i of grid[gy * G + gx]) {
      const p = pores[i];
      const d = Math.hypot(u - p.u, v - p.v);
      if (d < p.r) pore = Math.max(pore, 1 - d / p.r);
    }
    let seam = 0;
    let tie = 0;
    if (formwork) {
      const su = Math.min(u, 1 - u, Math.abs(u - 0.5));
      const sv = Math.min(v, 1 - v);
      seam = Math.max(su < 25e-4 ? 1 : 0, sv < 25e-4 ? 1 : 0);
      for (const tu of [0.125, 0.375, 0.625, 0.875]) {
        for (const tv of [0.2, 0.8]) {
          const d = Math.hypot(u - tu, v - tv);
          if (d < 9e-3) tie = Math.max(tie, 1 - d / 9e-3);
        }
      }
    }
    return { n, stain, pore, seam, tie };
  };
  const color = paint(size, size, (u, v) => {
    const f = field(u, v);
    let g = 196 + (f.n - 0.5) * 46 + (f.stain - 0.5) * 26 - f.pore * 70 - f.seam * 22 - f.tie * 70;
    g = cl(g);
    return [g, cl(g - 3), cl(g - 8)];
  });
  const bump = paint(size, size, (u, v) => {
    const f = field(u, v);
    const g = cl(170 + (f.n - 0.5) * 50 - f.pore * 150 - f.seam * 60 - f.tie * 160);
    return [g, g, g];
  });
  return { color, bump };
}
function grassCanvas(seed) {
  const { fbm, noise } = makeNoise(seed);
  return paint(512, 512, (u, v) => {
    const broad = fbm(u, v, 3, 3, 4);
    const fine = noise(u * 256, v * 256, 256, 256);
    const blade = noise(u * 128, v * 512, 128, 512);
    const t = broad * 0.6 + fine * 0.25 + blade * 0.25;
    return [cl(mix(58, 128, t)), cl(mix(74, 138, t)), cl(mix(38, 74, t))];
  });
}
function soilCanvas(seed) {
  const { fbm, noise } = makeNoise(seed);
  return paint(512, 512, (u, v) => {
    const t = fbm(u, v, 6, 6, 5);
    const peb = noise(u * 180, v * 180, 180, 180);
    const p = peb > 0.82 ? (peb - 0.82) * 4 : 0;
    return [cl(mix(84, 132, t) + p * 70), cl(mix(64, 102, t) + p * 66), cl(mix(46, 74, t) + p * 60)];
  });
}
function gravelCanvas(seed) {
  const { noise, fbm } = makeNoise(seed);
  return paint(512, 512, (u, v) => {
    const s = noise(u * 140, v * 140, 140, 140);
    const s2 = noise(u * 300, v * 300, 300, 300);
    const t = s * 0.7 + s2 * 0.3 + (fbm(u, v, 4, 4, 2) - 0.5) * 0.3;
    const g = mix(110, 210, t);
    return [cl(g), cl(g - 4), cl(g - 10)];
  });
}
function foliageCanvas(seed) {
  const { noise, fbm } = makeNoise(seed);
  return paint(256, 256, (u, v) => {
    const a = noise(u * 64, v * 64, 64, 64);
    const b = noise(u * 128, v * 128, 128, 128);
    const t = a * 0.55 + b * 0.3 + fbm(u, v, 4, 4, 2) * 0.3;
    const leaf = t > 0.62 ? 1 : 0;
    return [cl(mix(26, 86, t) + leaf * 12), cl(mix(40, 104, t) + leaf * 14), cl(mix(20, 52, t))];
  });
}
let cache = null;
function buildTextures() {
  const planks = [11, 23, 37].map((s) => {
    const c = woodCanvases(s);
    return { map: toTexture(c.color, true), bump: toTexture(c.bump, false) };
  });
  const framing = woodCanvases(71, 128, 512);
  const framingMap = toTexture(framing.color, true);
  const framingBump = toTexture(framing.bump, false);
  const framingMapX = framingMap.clone();
  framingMapX.center.set(0.5, 0.5);
  framingMapX.rotation = Math.PI / 2;
  framingMapX.needsUpdate = true;
  const cladding = woodCanvases(91, 128, 1024);
  const conc = concreteCanvases(5);
  const concPlain = concreteCanvases(17, 512, false);
  return {
    planks,
    framingMap,
    framingMapX,
    framingBump,
    claddingMap: toTexture(cladding.color, true),
    concreteMap: toTexture(conc.color, true),
    concreteBump: toTexture(conc.bump, false),
    concretePlainMap: toTexture(concPlain.color, true),
    concretePlainBump: toTexture(concPlain.bump, false),
    grass: toTexture(grassCanvas(3), true),
    soil: toTexture(soilCanvas(8), true),
    gravel: toTexture(gravelCanvas(13), true),
    foliage: toTexture(foliageCanvas(29), true)
  };
}
function getTextures() {
  if (!cache) cache = buildTextures();
  return cache;
}
function withRepeat(t, x, y) {
  const c = t.clone();
  c.repeat.set(x, y);
  c.needsUpdate = true;
  return c;
}
export {
  getTextures,
  withRepeat
};
