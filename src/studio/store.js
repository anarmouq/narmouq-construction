import { useSyncExternalStore } from "react";
import { catalogItem, ROOM_TYPES } from "./catalog.js";
const WALL_T = 0.12;
const WALL_H = 2.8;
const ROOM_SNAP = 0.5;
const ITEM_SNAP = 0.05;
const snap = (v, s) => Math.round(v / s) * s;
const r2 = (v) => Math.round(v * 1e3) / 1e3;
const roomBounds = (r) => ({
  minX: r.x - r.w / 2,
  maxX: r.x + r.w / 2,
  minZ: r.z - r.d / 2,
  maxZ: r.z + r.d / 2
});
function itemFootprint(it) {
  const c = catalogItem(it.kind);
  const q = Math.abs(Math.round(it.rot / (Math.PI / 2))) % 2 === 1;
  return { w: q ? c.d : c.w, d: q ? c.w : c.d };
}
function designBounds(rooms) {
  if (!rooms.length) return { minX: -4, maxX: 4, minZ: -4, maxZ: 4 };
  const b = { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity };
  for (const r of rooms) {
    const rb = roomBounds(r);
    b.minX = Math.min(b.minX, rb.minX);
    b.maxX = Math.max(b.maxX, rb.maxX);
    b.minZ = Math.min(b.minZ, rb.minZ);
    b.maxZ = Math.max(b.maxZ, rb.maxZ);
  }
  return b;
}
const roomContains = (r, x, z) => {
  const b = roomBounds(r);
  return x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ;
};
function roomsOverlap(a, b) {
  const A = roomBounds(a);
  const B = roomBounds(b);
  return A.minX < B.maxX - 0.01 && A.maxX > B.minX + 0.01 && A.minZ < B.maxZ - 0.01 && A.maxZ > B.minZ + 0.01;
}
let uid = 0;
const id = (p) => `${p}${Date.now().toString(36)}${(uid++).toString(36)}`;
function room(kind, minX, minZ, w, d, name) {
  const t = ROOM_TYPES[kind];
  return { id: id("r"), kind, name: name ?? t.label, x: minX + w / 2, z: minZ + d / 2, w, d, floor: t.floor, wall: t.wall };
}
function item(kind, x, z, rot = 0, a, b) {
  const c = catalogItem(kind);
  return { id: id("i"), kind, x, z, rot, a: a ?? c.a.default, b: b ?? c.b?.default };
}
const H = Math.PI / 2;
function presetDesign() {
  const rooms = [
    room("living", 0, 4, 6.5, 5),
    room("kitchen", 6.5, 4, 4.5, 5, "Kitchen & dining"),
    room("bedroom", 0, 0, 4.5, 4),
    room("bathroom", 4.5, 0, 3, 4),
    room("study", 7.5, 0, 3.5, 4)
  ];
  const items = [
    // living
    item("rug", 3.1, 6.5, H),
    item("tvUnit", 0.12 + 0.225 + 0.02, 6.5, H),
    item("sofa", 4.35, 6.5, -H),
    item("coffeeTable", 2.75, 6.5, H),
    item("armchair", 2.9, 8.2, Math.PI, "rust"),
    item("floorLamp", 5.6, 8.4),
    item("plant", 0.6, 8.4),
    item("bookshelf", 5.3, 4.12 + 0.19 + 0.02, 0),
    // kitchen & dining
    item("kitchenRun", 11 - 0.12 - 0.325 - 0.02, 6.2, -H),
    item("island", 8.3, 6.2, H),
    item("plant", 10.4, 8.4, 0, "travertine"),
    // bedroom
    item("bed", 2.6, 0.12 + 1.1 + 0.02, 0),
    item("nightstand", 1.3, 0.12 + 0.21 + 0.02),
    item("nightstand", 3.9, 0.12 + 0.21 + 0.02),
    item("wardrobe", 0.12 + 0.31 + 0.02, 2.75, H),
    // bath
    item("bathtub", 6, 0.62, 0),
    item("vanity", 7.5 - 0.12 - 0.25 - 0.02, 2.4, -H),
    item("toilet", 4.5 + 0.12 + 0.31 + 0.02, 1.5, H),
    // study
    item("desk", 9.25, 0.12 + 0.55 + 0.02, 0),
    item("bookshelf", 11 - 0.12 - 0.19 - 0.02, 2.4, -H, "walnut"),
    item("armchair", 8.4, 3, 0.6, "cognac", "walnut")
  ];
  const ox = 5.5;
  const oz = 4.5;
  rooms.forEach((r) => {
    r.x -= ox;
    r.z -= oz;
  });
  items.forEach((i) => {
    i.x = r2(i.x - ox);
    i.z = r2(i.z - oz);
  });
  return { rooms, items };
}
const STORAGE_KEY = "narmouq-studio-v1";
let state = {
  ...presetDesign(),
  selected: null,
  view: "3d",
  walls: "cutaway",
  past: [],
  future: [],
  frameNonce: 0
};
const listeners = /* @__PURE__ */ new Set();
const emit = () => listeners.forEach((l) => l());
function set(patch) {
  const p = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...p };
  emit();
  scheduleSave();
}
let saveTimer;
function scheduleSave() {
  if (typeof window === "undefined") return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ rooms: state.rooms, items: state.items }));
    } catch {
    }
  }, 400);
}
const snapshot = () => ({ rooms: state.rooms, items: state.items });
function checkpoint() {
  state = { ...state, past: [...state.past.slice(-59), snapshot()], future: [] };
}
function commit(fn) {
  checkpoint();
  set(fn);
}
function isDesign(v) {
  if (!v || typeof v !== "object") return false;
  const d = v;
  return Array.isArray(d.rooms) && Array.isArray(d.items) && d.rooms.every((r) => typeof r.x === "number" && typeof r.w === "number" && r.kind in ROOM_TYPES) && d.items.every((i) => typeof i.x === "number" && typeof i.kind === "string");
}
function placeInRoom(r, kind, items) {
  const c = catalogItem(kind);
  const b = roomBounds(r);
  const inset = WALL_T + 0.02;
  const fits = (x, z, w, d) => !items.some((o) => {
    if (catalogItem(o.kind).kind === "rug" || kind === "rug") return false;
    const f = itemFootprint(o);
    return Math.abs(o.x - x) < (f.w + w) / 2 - 0.02 && Math.abs(o.z - z) < (f.d + d) / 2 - 0.02;
  });
  if (c.wall) {
    const walls = [
      { rot: 0, along: "x", fixed: b.minZ + inset + c.d / 2 },
      { rot: Math.PI / 2, along: "z", fixed: b.minX + inset + c.d / 2 },
      { rot: -Math.PI / 2, along: "z", fixed: b.maxX - inset - c.d / 2 },
      { rot: Math.PI, along: "x", fixed: b.maxZ - inset - c.d / 2 }
    ];
    for (const wl of walls) {
      const len = wl.along === "x" ? r.w : r.d;
      const centre = wl.along === "x" ? r.x : r.z;
      const fw = wl.along === "x" ? c.w : c.d;
      const fd = wl.along === "x" ? c.d : c.w;
      for (let k = 0; k <= len; k += 0.25) {
        for (const sgn of [1, -1]) {
          const t = centre + sgn * k;
          const half = (wl.along === "x" ? c.w : c.w) / 2;
          if (Math.abs(t - centre) + half > len / 2 - inset) continue;
          const x = wl.along === "x" ? t : wl.fixed;
          const z = wl.along === "x" ? wl.fixed : t;
          if (fits(x, z, fw, fd)) return { x: r2(x), z: r2(z), rot: wl.rot };
        }
      }
    }
  }
  for (let ring = 0; ring < 12; ring++) {
    for (let a = 0; a < Math.max(1, ring * 6); a++) {
      const ang = a / Math.max(1, ring * 6) * Math.PI * 2;
      const x = r.x + Math.cos(ang) * ring * 0.3;
      const z = r.z + Math.sin(ang) * ring * 0.3;
      if (Math.abs(x - r.x) + c.w / 2 > r.w / 2 - inset || Math.abs(z - r.z) + c.d / 2 > r.d / 2 - inset) continue;
      if (fits(x, z, c.w, c.d)) return { x: r2(snap(x, ITEM_SNAP)), z: r2(snap(z, ITEM_SNAP)), rot: 0 };
    }
  }
  return { x: r.x, z: r.z, rot: 0 };
}
const studio = {
  get: () => state,
  subscribe(l) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  /** restore a saved design (client only, after hydration) */
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (isDesign(d)) {
        state = { ...state, rooms: d.rooms, items: d.items, frameNonce: state.frameNonce + 1 };
        emit();
      }
    } catch {
    }
  },
  select: (selected) => set({ selected }),
  setView: (view) => set((s) => ({ view, frameNonce: s.frameNonce + 1 })),
  setWalls: (walls) => set({ walls }),
  frame: () => set((s) => ({ frameNonce: s.frameNonce + 1 })),
  checkpoint,
  undo() {
    const prev = state.past[state.past.length - 1];
    if (!prev) return;
    set((s) => ({ ...prev, past: s.past.slice(0, -1), future: [snapshot(), ...s.future], selected: null }));
  },
  redo() {
    const next = state.future[0];
    if (!next) return;
    set((s) => ({ ...next, past: [...s.past, snapshot()], future: s.future.slice(1), selected: null }));
  },
  reset() {
    commit(() => ({ ...presetDesign(), selected: null }));
    set((s) => ({ frameNonce: s.frameNonce + 1 }));
  },
  clear() {
    commit(() => ({ rooms: [], items: [], selected: null }));
  },
  /* ---- rooms ---- */
  addRoom(kind) {
    const t = ROOM_TYPES[kind];
    const rooms = state.rooms;
    let minX = -t.w / 2;
    let minZ = -t.d / 2;
    if (rooms.length) {
      const b = designBounds(rooms);
      if (b.maxX - b.minX <= b.maxZ - b.minZ + 2) {
        minX = b.maxX;
        minZ = b.minZ;
      } else {
        minX = b.minX;
        minZ = b.maxZ;
      }
    }
    const r = { id: id("r"), kind, name: t.label, x: minX + t.w / 2, z: minZ + t.d / 2, w: t.w, d: t.d, floor: t.floor, wall: t.wall };
    commit((s) => ({ rooms: [...s.rooms, r], selected: { type: "room", id: r.id }, frameNonce: s.frameNonce + 1 }));
  },
  updateRoom(rid, patch, history = true) {
    const fn = (s) => ({ rooms: s.rooms.map((r) => r.id === rid ? { ...r, ...patch } : r) });
    if (history) commit(fn);
    else set(fn);
  },
  /** resize keeping the min corner fixed so neighbours don't drift */
  resizeRoom(rid, w, d) {
    commit((s) => ({
      rooms: s.rooms.map((r) => {
        if (r.id !== rid) return r;
        const b = roomBounds(r);
        return { ...r, w, d, x: b.minX + w / 2, z: b.minZ + d / 2 };
      })
    }));
  },
  /** live move during a drag (no history entry — caller checkpoints on drag start) */
  moveRoom(rid, x, z) {
    const r = state.rooms.find((o) => o.id === rid);
    if (!r || r.x === x && r.z === z) return;
    const dx = x - r.x;
    const dz = z - r.z;
    set((s) => ({
      rooms: s.rooms.map((o) => o.id === rid ? { ...o, x, z } : o),
      // furniture inside travels with its room
      items: s.items.map((i) => roomContains(r, i.x, i.z) ? { ...i, x: r2(i.x + dx), z: r2(i.z + dz) } : i)
    }));
  },
  removeRoom(rid) {
    const r = state.rooms.find((o) => o.id === rid);
    if (!r) return;
    commit((s) => ({
      rooms: s.rooms.filter((o) => o.id !== rid),
      items: s.items.filter((i) => !roomContains(r, i.x, i.z) || s.rooms.some((o) => o.id !== rid && roomContains(o, i.x, i.z))),
      selected: null
    }));
  },
  /* ---- furniture ---- */
  addItem(kind) {
    const s = state;
    let target;
    if (s.selected?.type === "room") target = s.rooms.find((r) => r.id === s.selected.id);
    if (s.selected?.type === "item") {
      const it2 = s.items.find((i) => i.id === s.selected.id);
      if (it2) target = s.rooms.find((r) => roomContains(r, it2.x, it2.z));
    }
    target ??= s.rooms[0];
    const c = catalogItem(kind);
    const spot = target ? placeInRoom(target, kind, s.items) : { x: 0, z: 0, rot: 0 };
    const it = { id: id("i"), kind, ...spot, a: c.a.default, b: c.b?.default };
    commit((st) => ({ items: [...st.items, it], selected: { type: "item", id: it.id } }));
  },
  updateItem(iid, patch) {
    commit((s) => ({ items: s.items.map((i) => i.id === iid ? { ...i, ...patch } : i) }));
  },
  moveItem(iid, x, z) {
    set((s) => ({ items: s.items.map((i) => i.id === iid ? { ...i, x, z } : i) }));
  },
  rotateItem(iid, delta) {
    commit((s) => ({
      items: s.items.map((i) => i.id === iid ? { ...i, rot: r2((i.rot + delta) % (Math.PI * 2)) } : i)
    }));
  },
  nudge(dx, dz) {
    const sel = state.selected;
    if (!sel) return;
    if (sel.type === "item") {
      commit((s) => ({ items: s.items.map((i) => i.id === sel.id ? { ...i, x: r2(i.x + dx), z: r2(i.z + dz) } : i) }));
    } else {
      const r = state.rooms.find((o) => o.id === sel.id);
      if (!r) return;
      checkpoint();
      studio.moveRoom(sel.id, r2(r.x + Math.sign(dx) * ROOM_SNAP), r2(r.z + Math.sign(dz) * ROOM_SNAP));
    }
  },
  duplicateItem(iid) {
    const src = state.items.find((i) => i.id === iid);
    if (!src) return;
    const f = itemFootprint(src);
    const copy = { ...src, id: id("i"), x: r2(src.x + Math.min(f.w, 1) * 0.6), z: r2(src.z + Math.min(f.d, 1) * 0.6) };
    commit((s) => ({ items: [...s.items, copy], selected: { type: "item", id: copy.id } }));
  },
  removeItem(iid) {
    commit((s) => ({ items: s.items.filter((i) => i.id !== iid), selected: null }));
  },
  removeSelected() {
    const sel = state.selected;
    if (!sel) return;
    if (sel.type === "item") studio.removeItem(sel.id);
    else studio.removeRoom(sel.id);
  }
};
function useStudio(selector) {
  return useSyncExternalStore(
    studio.subscribe,
    () => selector(state),
    () => selector(state)
  );
}
const DOOR_W = 0.95;
const DOOR_H = 2.15;
function roomWalls(r, rooms) {
  const b = roomBounds(r);
  const edges = [
    { side: "n", axis: "x", at: b.minZ, from: b.minX, to: b.maxX, nx: 0, nz: -1 },
    { side: "s", axis: "x", at: b.maxZ, from: b.minX, to: b.maxX, nx: 0, nz: 1 },
    { side: "w", axis: "z", at: b.minX, from: b.minZ, to: b.maxZ, nx: -1, nz: 0 },
    { side: "e", axis: "z", at: b.maxX, from: b.minZ, to: b.maxZ, nx: 1, nz: 0 }
  ];
  return edges.map((e) => {
    const shared = [];
    for (const o of rooms) {
      if (o.id === r.id) continue;
      const ob = roomBounds(o);
      const otherAt = e.side === "n" ? ob.maxZ : e.side === "s" ? ob.minZ : e.side === "w" ? ob.maxX : ob.minX;
      if (Math.abs(otherAt - e.at) > 0.01) continue;
      const lo = Math.max(e.from, e.axis === "x" ? ob.minX : ob.minZ);
      const hi = Math.min(e.to, e.axis === "x" ? ob.maxX : ob.maxZ);
      if (hi - lo > 0.01) shared.push([lo, hi]);
    }
    const openings = [];
    for (const [lo, hi] of shared) {
      if (hi - lo >= 1.2) {
        const c = (lo + hi) / 2;
        openings.push({ from: c - DOOR_W / 2, to: c + DOOR_W / 2, bottom: 0, top: DOOR_H, glass: false });
      }
    }
    shared.sort((p, q) => p[0] - q[0]);
    let cursor = e.from;
    let best = null;
    for (const [lo, hi] of [...shared, [e.to, e.to]]) {
      if (lo - cursor > (best ? best[1] - best[0] : 0)) best = [cursor, lo];
      cursor = Math.max(cursor, hi);
    }
    if (best && best[1] - best[0] >= 2.2) {
      const len = best[1] - best[0];
      const ww = Math.min(len - 1, len > 4.5 ? len * 0.55 : 1.6);
      const c = (best[0] + best[1]) / 2;
      openings.push({ from: c - ww / 2, to: c + ww / 2, bottom: 0.55, top: 2.35, glass: true });
    }
    return { key: `${r.id}-${e.side}`, axis: e.axis, at: e.at, from: e.from, to: e.to, nx: e.nx, nz: e.nz, openings };
  });
}
export {
  ITEM_SNAP,
  ROOM_SNAP,
  WALL_H,
  WALL_T,
  designBounds,
  itemFootprint,
  presetDesign,
  roomBounds,
  roomContains,
  roomWalls,
  roomsOverlap,
  snap,
  studio,
  useStudio
};
