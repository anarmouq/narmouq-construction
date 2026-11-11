import * as THREE from "three";
import { getTextures } from "./textures.js";
import { finishById, FLOORS, WALLS } from "./catalog.js";
function hash(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x, y, period, seed) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const h = (i, j) => hash((i % period + period) % period * 57 + (j % period + period) % period * 131 + seed * 17);
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  return h(xi, yi) * (1 - u) * (1 - v) + h(xi + 1, yi) * u * (1 - v) + h(xi, yi + 1) * (1 - u) * v + h(xi + 1, yi + 1) * u * v;
}
function fbm(u, v, base, oct, seed) {
  let a = 0.5;
  let f = base;
  let s = 0;
  let n = 0;
  for (let o = 0; o < oct; o++) {
    s += vnoise(u * f, v * f, f, seed + o) * a;
    n += a;
    a *= 0.5;
    f *= 2;
  }
  return s / n;
}
const cl = (v) => v < 0 ? 0 : v > 255 ? 255 : v;
function canvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}
function tex(c, tile, color = true) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1 / tile, 1 / tile);
  t.anisotropy = 8;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}
function woodPixels() {
  const src = getTextures().planks[0].map.image;
  const d = src.getContext("2d").getImageData(0, 0, src.width, src.height).data;
  return { d, w: src.width, h: src.height };
}
function paintLum(size, fn) {
  const c = canvas(size, size);
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const l = cl(fn(x, y));
      const i = (y * size + x) * 4;
      img.data[i] = l;
      img.data[i + 1] = l;
      img.data[i + 2] = l;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
function chevron() {
  const W = woodPixels();
  const S = 1024;
  const C = 256;
  const P = 64;
  const c = paintLum(S, (x, y) => {
    const ci = Math.floor(x / C);
    const lx = x - ci * C;
    const yy = y + (ci % 2 === 0 ? lx : C - lx);
    const pi = Math.floor(yy / P);
    const across = (yy - pi * P) / P;
    const key = (pi % 16 + 16) % 16 + ci % 4 * 16;
    const r = hash(key);
    const sx = Math.floor(across * (W.w - 1));
    const sy = Math.floor((lx * 0.9 + r * 700) % W.h);
    const lum = W.d[(sy * W.w + sx) * 4];
    let l = lum * (0.86 + r * 0.24);
    if (across < 0.035 || across > 0.965 || lx < 2 || lx > C - 2) l *= 0.55;
    return l;
  });
  return tex(c, 1.6);
}
function widePlank() {
  const W = woodPixels();
  const S = 1024;
  const B = 128;
  const c = paintLum(S, (x, y) => {
    const bi = Math.floor(x / B);
    const lx = x - bi * B;
    const j0 = Math.floor(hash(bi + 3) * S);
    const j1 = (j0 + 420 + Math.floor(hash(bi + 9) * 200)) % S;
    const a = Math.min(j0, j1);
    const b = Math.max(j0, j1);
    const segIdx = y >= a && y < b ? 0 : 1;
    const r = hash(bi * 7 + segIdx * 3 + 1);
    const sx = Math.floor(lx / B * (W.w - 1));
    const sy = Math.floor((y + r * 900) % W.h);
    let l = W.d[(sy * W.w + sx) * 4] * (0.88 + r * 0.22);
    if (lx < 2 || lx > B - 2 || Math.abs(y - a) < 2 || Math.abs(y - b) < 2) l *= 0.55;
    return l;
  });
  return tex(c, 2);
}
function stoneTiles(seed, contrast) {
  const S = 512;
  const T = 256;
  const c = paintLum(S, (x, y) => {
    const tx = Math.floor(x / T);
    const ty = Math.floor(y / T);
    const u = x / S;
    const v = y / S;
    const n = fbm(u, v, 6, 5, seed) - 0.5;
    const fine = vnoise(u * 160, v * 160, 160, seed + 9) - 0.5;
    let l = 205 + hash(tx * 3 + ty * 5 + seed) * 22 + n * 70 * contrast + fine * 16;
    const gx = x % T;
    const gy = y % T;
    if (gx < 2 || gy < 2) l = 150;
    return l;
  });
  return tex(c, 1.2);
}
function terrazzo() {
  const S = 512;
  const c = canvas(S, S);
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#ebe6dc";
  ctx.fillRect(0, 0, S, S);
  const cols = ["#b9a68e", "#8f8a82", "#d8c9b2", "#6f6a62", "#c58c6a", "#a7aaa1", "#f6f3ec"];
  let k = 0;
  for (let i = 0; i < 1300; i++) {
    const x = hash(++k) * S;
    const y = hash(++k) * S;
    const r = 1.2 + Math.pow(hash(++k), 3) * 9;
    ctx.fillStyle = cols[Math.floor(hash(++k) * cols.length)];
    const sides = 4 + Math.floor(hash(++k) * 3);
    const rot = hash(++k) * 6.28;
    for (const ox of [-S, 0, S]) {
      for (const oy of [-S, 0, S]) {
        ctx.beginPath();
        for (let s = 0; s < sides; s++) {
          const a = rot + s / sides * Math.PI * 2;
          const rr = r * (0.7 + hash(k + s) * 0.5);
          ctx.lineTo(x + ox + Math.cos(a) * rr, y + oy + Math.sin(a) * rr);
        }
        ctx.fill();
      }
    }
  }
  return tex(c, 0.8);
}
function veined(seed) {
  const S = 512;
  const c = paintLum(S, (x, y) => {
    const u = x / S;
    const v = y / S;
    const w = fbm(u, v, 3, 5, seed);
    const vein = Math.pow(1 - Math.abs(Math.sin((u * 2 + v * 1 + w * 3.2) * Math.PI * 2)), 14);
    const cloud = fbm(u, v, 5, 4, seed + 4);
    return 150 + cloud * 50 + vein * 120;
  });
  return tex(c, 1);
}
let lib = null;
function build() {
  const tx = getTextures();
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const concrete = tx.concretePlainMap.clone();
  concrete.repeat.set(1 / 2.4, 1 / 2.4);
  concrete.needsUpdate = true;
  const concreteBump = tx.concretePlainBump.clone();
  concreteBump.repeat.copy(concrete.repeat);
  concreteBump.needsUpdate = true;
  const boardWall = tx.concreteMap.clone();
  boardWall.repeat.set(1 / 3, 1 / 3);
  boardWall.needsUpdate = true;
  const boardBump = tx.concreteBump.clone();
  boardBump.repeat.copy(boardWall.repeat);
  boardBump.needsUpdate = true;
  const panel = tx.claddingMap.clone();
  panel.repeat.set(1 / 1.6, 1 / 2.8);
  panel.needsUpdate = true;
  const color = (id, list) => list.find((f) => f.id === id).color;
  const floors = {
    "oak-herringbone": std({ map: chevron(), color: color("oak-herringbone", FLOORS), roughness: 0.55 }),
    "oak-plank": std({ map: widePlank(), color: color("oak-plank", FLOORS), roughness: 0.6 }),
    "walnut-plank": std({ map: widePlank(), color: color("walnut-plank", FLOORS), roughness: 0.5 }),
    "smoked-oak": std({ map: chevron(), color: color("smoked-oak", FLOORS), roughness: 0.55 }),
    "polished-concrete": std({ map: concrete, bumpMap: concreteBump, bumpScale: 0.6, color: "#d1ccc4", roughness: 0.28 }),
    limestone: std({ map: stoneTiles(3, 0.5), color: "#efe6d6", roughness: 0.6 }),
    terrazzo: std({ map: terrazzo(), color: "#ffffff", roughness: 0.32 }),
    slate: std({ map: stoneTiles(11, 1.2), color: "#585a59", roughness: 0.7 })
  };
  const walls = {
    chalk: std({ color: color("chalk", WALLS), roughness: 0.92 }),
    sand: std({ color: color("sand", WALLS), roughness: 0.92 }),
    sage: std({ color: color("sage", WALLS), roughness: 0.92 }),
    clay: std({ color: color("clay", WALLS), roughness: 0.92 }),
    mist: std({ color: color("mist", WALLS), roughness: 0.92 }),
    charcoal: std({ color: color("charcoal", WALLS), roughness: 0.9 }),
    concrete: std({ map: boardWall, bumpMap: boardBump, bumpScale: 1.2, color: "#e6e2da", roughness: 0.9 }),
    "oak-panel": std({ map: panel, color: "#b88a5e", roughness: 0.65 })
  };
  const woodTex = tx.framingMapX;
  const stoneTex = veined(21);
  return {
    floors,
    walls,
    finishes: /* @__PURE__ */ new Map(),
    cap: std({ color: "#2b2a27", roughness: 0.9 }),
    slabEdge: std({ color: "#cfc8bb", roughness: 0.95 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: "#9fb4ba",
      roughness: 0.05,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      envMapIntensity: 2
    }),
    ceramic: std({ color: "#f4f2ee", roughness: 0.25 }),
    mattress: std({ color: "#f3f0ea", roughness: 1 }),
    screen: std({ color: "#121212", roughness: 0.2, metalness: 0.4 }),
    leaf: std({ color: "#5b6b3f", roughness: 0.85, flatShading: true }),
    soil: std({ color: "#3b2f25", roughness: 1 }),
    bulb: new THREE.MeshBasicMaterial({ color: "#ffe2b8", toneMapped: false }),
    mirror: std({ color: "#dfe5e6", metalness: 1, roughness: 0.06 }),
    water: new THREE.MeshPhysicalMaterial({ color: "#b7d2d3", roughness: 0.05, transmission: 0, clearcoat: 1 }),
    bookColors: ["#8a4f2a", "#5d6246", "#d9cfbd", "#2f3a4a", "#a8794c", "#3b3a37", "#b98a70"].map((c) => std({ color: c, roughness: 0.9 })),
    stoneTex,
    woodTex,
    woodBump: tx.framingBump
  };
}
function studioMaterials() {
  if (!lib) lib = build();
  return lib;
}
function finishMaterial(id) {
  const L = studioMaterials();
  const hit = L.finishes.get(id);
  if (hit) return hit;
  const f = finishById(id);
  const m = new THREE.MeshStandardMaterial({
    color: f.color,
    roughness: f.roughness ?? 0.8,
    metalness: f.metalness ?? 0
  });
  if (f.tex === "wood") {
    m.map = L.woodTex;
    m.bumpMap = L.woodBump;
    m.bumpScale = 0.6;
    m.color.offsetHSL(0, 0, 0.06);
  } else if (f.tex === "stone") {
    m.map = L.stoneTex;
    m.color.multiplyScalar(1.35);
  } else if (f.tex === "concrete") {
    m.map = getTextures().concretePlainMap;
  }
  L.finishes.set(id, m);
  return m;
}
function meteredBox(w, h, d) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.getAttribute("uv");
  const dims = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h]
  ];
  for (let f = 0; f < 6; f++) {
    for (let k = 0; k < 4; k++) {
      const i = f * 4 + k;
      uv.setXY(i, uv.getX(i) * dims[f][0], uv.getY(i) * dims[f][1]);
    }
  }
  uv.needsUpdate = true;
  return g;
}
export {
  finishMaterial,
  meteredBox,
  studioMaterials
};
