import { Environment, Grid, Html, Lightformer, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { catalogItem, finishById } from "./catalog.js";
import { finishMaterial, meteredBox, studioMaterials } from "./materials.js";
import { FurnitureModel } from "./models.jsx";
import {
  designBounds,
  ITEM_SNAP,
  itemFootprint,
  ROOM_SNAP,
  roomsOverlap,
  roomWalls,
  snap,
  studio,
  useStudio,
  WALL_H,
  WALL_T
} from "./store.js";
const OAK = "#f2a71b"; // Narmouq amber
const FLOOR_Y = 0.012;
const GROUND = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const studioCanvas = { gl: null };
const drag = {
  active: false,
  moved: false,
  type: "item",
  id: "",
  offX: 0,
  offZ: 0
};
function useControls() {
  return useThree((s) => s.controls);
}
function startDrag(e, type, id, x, z, controls) {
  const hit = e.ray.intersectPlane(GROUND, new THREE.Vector3());
  if (!hit) return;
  e.stopPropagation();
  e.target.setPointerCapture(e.pointerId);
  Object.assign(drag, { active: true, moved: false, type, id, offX: hit.x - x, offZ: hit.z - z });
  if (controls) controls.enabled = false;
  document.body.style.cursor = "grabbing";
}
function moveDrag(e) {
  if (!drag.active) return;
  const hit = e.ray.intersectPlane(GROUND, new THREE.Vector3());
  if (!hit) return;
  e.stopPropagation();
  const s = drag.type === "room" ? ROOM_SNAP : ITEM_SNAP;
  const x = Math.round(snap(hit.x - drag.offX, s) * 1e3) / 1e3;
  const z = Math.round(snap(hit.z - drag.offZ, s) * 1e3) / 1e3;
  const cur = drag.type === "room" ? studio.get().rooms.find((r) => r.id === drag.id) : studio.get().items.find((i) => i.id === drag.id);
  if (!cur || cur.x === x && cur.z === z) return;
  if (!drag.moved) studio.checkpoint();
  drag.moved = true;
  if (drag.type === "room") studio.moveRoom(drag.id, x, z);
  else studio.moveItem(drag.id, x, z);
}
function endDrag(e, controls) {
  if (!drag.active) return;
  e.target.releasePointerCapture?.(e.pointerId);
  drag.active = false;
  if (controls) controls.enabled = true;
  document.body.style.cursor = "";
}
function Outline({ w, d, y = 0.03, color = OAK, t = 0.04 }) {
  return <group position={[0, y, 0]}>
      {[
    [0, -d / 2, w + t, t],
    [0, d / 2, w + t, t],
    [-w / 2, 0, t, d],
    [w / 2, 0, t, d]
  ].map(([x, z, sx, sz], i) => <mesh key={i} position={[x, 0, z]} scale={[sx, 0.01, sz]} renderOrder={2}>
          <boxGeometry />
          <meshBasicMaterial color={color} toneMapped={false} depthTest={false} transparent />
        </mesh>)}
    </group>;
}
function wallSegments(w) {
  const inset = WALL_T / 2;
  const from = w.axis === "z" ? w.from + WALL_T : w.from;
  const to = w.axis === "z" ? w.to - WALL_T : w.to;
  const fixed = w.at - (w.axis === "x" ? w.nz : w.nx) * inset;
  const segs = [];
  const add = (a, b, y0, y1, kind = "wall") => {
    if (b - a < 0.01 || y1 - y0 < 0.01) return;
    const c = (a + b) / 2;
    const len = b - a;
    const thick = kind === "glass" ? 0.02 : kind === "frame" ? 0.07 : WALL_T;
    segs.push({
      pos: w.axis === "x" ? [c, (y0 + y1) / 2, fixed] : [fixed, (y0 + y1) / 2, c],
      size: w.axis === "x" ? [len, y1 - y0, thick] : [thick, y1 - y0, len],
      kind
    });
  };
  const F = 0.05;
  const ops = w.openings.map((o) => ({ ...o, from: Math.max(from, o.from), to: Math.min(to, o.to) })).filter((o) => o.to - o.from > 0.2).sort((a, b) => a.from - b.from);
  let cursor = from;
  for (const o of ops) {
    add(cursor, o.from, 0, WALL_H);
    add(o.from, o.to, 0, o.bottom);
    add(o.from, o.to, o.top, WALL_H);
    if (o.glass) {
      add(o.from, o.to, o.bottom, o.top, "glass");
      add(o.from, o.from + F, o.bottom, o.top, "frame");
      add(o.to - F, o.to, o.bottom, o.top, "frame");
      add(o.from, o.to, o.bottom, o.bottom + F, "frame");
      add(o.from, o.to, o.top - F, o.top, "frame");
      const panes = Math.max(1, Math.round((o.to - o.from) / 1.1));
      for (let k = 1; k < panes; k++) {
        const x = o.from + (o.to - o.from) * k / panes;
        add(x - F / 2, x + F / 2, o.bottom, o.top, "frame");
      }
    }
    cursor = o.to;
  }
  add(cursor, to, 0, WALL_H);
  return segs;
}
function Wall({ spec, room, mat }) {
  const L = studioMaterials();
  const group = useRef(null);
  const glassRefs = useRef([]);
  const h = useRef(1);
  const segs = useMemo(() => wallSegments(spec), [spec]);
  const geos = useMemo(() => segs.map((s) => meteredBox(...s.size)), [segs]);
  useEffect(() => () => geos.forEach((g) => g.dispose()), [geos]);
  const mats = useMemo(() => [mat, mat, L.cap, mat, mat, mat], [mat, L.cap]);
  useFrame(({ camera }, delta) => {
    const g = group.current;
    if (!g) return;
    const { walls, view } = studio.get();
    let target = 1;
    if (view === "3d") {
      if (walls === "low") target = 0.36;
      else if (walls === "cutaway") {
        const vx = camera.position.x - room.x;
        const vz = camera.position.z - room.z;
        const len = Math.hypot(vx, vz) || 1;
        if ((spec.nx * vx + spec.nz * vz) / len > 0.28) target = 0.12;
      }
    }
    h.current += (target - h.current) * (1 - Math.exp(-delta * 9));
    g.scale.y = h.current;
    for (const m of glassRefs.current) if (m) m.visible = h.current > 0.7;
  });
  return <group ref={group}>
      {segs.map(
    (s, i) => s.kind !== "wall" ? <mesh
      key={i}
      ref={(m) => {
        if (m) glassRefs.current[i] = m;
      }}
      position={s.pos}
      scale={s.size}
      material={s.kind === "glass" ? L.glass : L.cap}
    >
            <boxGeometry />
          </mesh> : <mesh key={i} geometry={geos[i]} position={s.pos} material={mats} castShadow receiveShadow />
  )}
    </group>;
}
const RoomMesh = memo(function RoomMesh2({
  room,
  rooms,
  selected,
  overlap,
  showLabel
}) {
  const L = studioMaterials();
  const controls = useControls();
  const floorMat = L.floors[room.floor];
  const wallMat = L.walls[room.wall];
  const slab = useMemo(() => meteredBox(room.w, 0.12, room.d), [room.w, room.d]);
  useEffect(() => () => slab.dispose(), [slab]);
  const slabMats = useMemo(() => [L.slabEdge, L.slabEdge, floorMat, L.slabEdge, L.slabEdge, L.slabEdge], [floorMat, L.slabEdge]);
  const walls = useMemo(() => roomWalls(room, rooms), [room, rooms]);
  const onDown = (e) => {
    if (e.button !== 0) return;
    if (selected) startDrag(e, "room", room.id, room.x, room.z, controls);
  };
  const onClick = (e) => {
    if (e.delta > 4) return;
    e.stopPropagation();
    studio.select({ type: "room", id: room.id });
  };
  const area = room.w * room.d;
  return <group>
      <mesh
    geometry={slab}
    material={slabMats}
    position={[room.x, FLOOR_Y - 0.06, room.z]}
    receiveShadow
    onPointerDown={onDown}
    onPointerMove={moveDrag}
    onPointerUp={(e) => endDrag(e, controls)}
    onClick={onClick}
    onPointerOver={() => selected && (document.body.style.cursor = "grab")}
    onPointerOut={() => !drag.active && (document.body.style.cursor = "")}
  />
      <group onClick={onClick}>
        {walls.map((w) => <Wall key={w.key} spec={w} room={room} mat={wallMat} />)}
      </group>
      {(selected || overlap) && <group position={[room.x, 0, room.z]}>
          <Outline w={room.w - 0.04} d={room.d - 0.04} color={overlap ? "#c0432b" : OAK} t={0.06} />
        </group>}
      {(showLabel || selected || overlap) && <Html position={[room.x, 0.05, room.z]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div
    className={`st-tag${overlap ? " is-overlap" : selected ? " is-selected" : ""}`}
  >
            <span className="st-tag__name">{room.name}</span>
            {overlap ? "Overlaps another room" : `${room.w.toFixed(1)} \xD7 ${room.d.toFixed(1)} m \xB7 ${area.toFixed(1)} m\xB2`}
          </div>
        </Html>}
    </group>;
});
const ItemMesh = memo(function ItemMesh2({ item, selected }) {
  const controls = useControls();
  const group = useRef(null);
  const born = useRef(-1);
  const c = catalogItem(item.kind);
  const a = finishMaterial(item.a);
  const b = finishMaterial(item.b ?? "steel");
  const fp = itemFootprint(item);
  const rot = useRef(item.rot);
  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    if (born.current < 0) born.current = clock.elapsedTime;
    const t = Math.min(1, (clock.elapsedTime - born.current) / 0.45);
    const e = 1 - Math.pow(1 - t, 3);
    g.position.y = FLOOR_Y + (1 - e) * 0.5;
    let diff = item.rot - rot.current;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    rot.current += diff * (1 - Math.exp(-delta * 14));
    if (Math.abs(diff) < 1e-4) rot.current = item.rot;
    g.rotation.y = rot.current;
  });
  return <group position={[item.x, FLOOR_Y, item.z]}>
      <group
    ref={group}
    onPointerDown={(e) => {
      if (e.button !== 0) return;
      studio.select({ type: "item", id: item.id });
      startDrag(e, "item", item.id, item.x, item.z, controls);
    }}
    onPointerMove={moveDrag}
    onPointerUp={(e) => endDrag(e, controls)}
    onClick={(e) => e.stopPropagation()}
    onPointerOver={(e) => {
      e.stopPropagation();
      if (!drag.active) document.body.style.cursor = "grab";
    }}
    onPointerOut={() => !drag.active && (document.body.style.cursor = "")}
  >
        <FurnitureModel kind={item.kind} a={a} b={b} />
      </group>
      {selected && <>
          <Outline w={fp.w + 0.08} d={fp.d + 0.08} y={0.02} />
          <Html position={[0, 0.02, fp.d / 2 + 0.25]} center zIndexRange={[30, 0]}>
            <div
    className="st-itembar"
    onPointerDown={(e) => e.stopPropagation()}
    onPointerUp={(e) => e.stopPropagation()}
    onClick={(e) => e.stopPropagation()}
  >
              <span className="st-itembar__label">{c.label}</span>
              <MiniBtn label="Rotate left" onClick={() => studio.rotateItem(item.id, Math.PI / 2)}>
                ⟲
              </MiniBtn>
              <MiniBtn label="Rotate right" onClick={() => studio.rotateItem(item.id, -Math.PI / 2)}>
                ⟳
              </MiniBtn>
              <MiniBtn label="Duplicate" onClick={() => studio.duplicateItem(item.id)}>
                ⧉
              </MiniBtn>
              <MiniBtn label="Delete" onClick={() => studio.removeItem(item.id)}>
                ✕
              </MiniBtn>
            </div>
          </Html>
        </>}
    </group>;
});
function MiniBtn({ label, onClick, children }) {
  return <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    className="st-itembar__btn"
  >
      {children}
    </button>;
}
function CameraDirector() {
  const controls = useControls();
  const { camera, size } = useThree();
  const nonce = useStudio((s) => s.frameNonce);
  const view = useStudio((s) => s.view);
  const goal = useRef(null);
  useEffect(() => {
    const { rooms } = studio.get();
    const b = designBounds(rooms);
    const cx = (b.minX + b.maxX) / 2;
    const cz = (b.minZ + b.maxZ) / 2;
    const w = b.maxX - b.minX;
    const d = b.maxZ - b.minZ;
    const cam = camera;
    const aspect = size.width / Math.max(1, size.height);
    const tan = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const fit = Math.max(d, w / aspect) / (2 * tan);
    const tgt = new THREE.Vector3(cx, 0, cz);
    const pos = view === "plan" ? new THREE.Vector3(cx, fit * 1.3 + 2.5, cz + 0.01) : tgt.clone().add(new THREE.Vector3(0.55, 0.95, 1).normalize().multiplyScalar(Math.max(fit * (aspect < 1 ? 1.08 : 1.25), Math.hypot(w, d) * 1.15) + 3));
    goal.current = { pos, tgt, t: 0 };
  }, [nonce, view, camera, size.width, size.height]);
  useEffect(() => {
    if (!controls) return;
    const cancel = () => goal.current = null;
    controls.addEventListener("start", cancel);
    return () => controls.removeEventListener("start", cancel);
  }, [controls]);
  useFrame((state, delta) => {
    const g = goal.current;
    if (!g || !controls) return;
    const k = 1 - Math.exp(-delta * 4.5);
    state.camera.position.lerp(g.pos, k);
    controls.target.lerp(g.tgt, k);
    controls.update();
    g.t += delta;
    if (g.t > 2.2 || state.camera.position.distanceTo(g.pos) < 0.01 && controls.target.distanceTo(g.tgt) < 0.01) goal.current = null;
  });
  return null;
}
function Lights({ mobile }) {
  const sun = useRef(null);
  const rooms = useStudio((s) => s.rooms);
  useEffect(() => {
    const s = sun.current;
    if (!s) return;
    const b = designBounds(rooms);
    const cx = (b.minX + b.maxX) / 2;
    const cz = (b.minZ + b.maxZ) / 2;
    const r = Math.max(b.maxX - b.minX, b.maxZ - b.minZ) * 0.75 + 3;
    s.position.set(cx + 9, 16, cz + 7);
    s.target.position.set(cx, 0, cz);
    s.target.updateMatrixWorld();
    const cam = s.shadow.camera;
    cam.left = -r;
    cam.right = r;
    cam.top = r;
    cam.bottom = -r;
    cam.updateProjectionMatrix();
  }, [rooms]);
  return <>
      <hemisphereLight args={["#fff6ea", "#b8ab98", 0.85]} />
      <directionalLight
    ref={sun}
    intensity={2.6}
    color="#fff0dc"
    castShadow
    shadow-mapSize={mobile ? [1024, 1024] : [2048, 2048]}
    shadow-bias={-4e-4}
    shadow-normalBias={0.025}
    shadow-camera-near={1}
    shadow-camera-far={60}
  />
      <Environment frames={1} resolution={128} environmentIntensity={0.55}>
        <Lightformer form="rect" intensity={2.4} color="#fff3e0" position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[14, 14, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffe2c0" position={[-10, 3, 6]} rotation={[0, Math.PI / 2.4, 0]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#dfe8ee" position={[10, 3, -6]} rotation={[0, -Math.PI / 1.7, 0]} scale={[10, 4, 1]} />
      </Environment>
    </>;
}
function Ground() {
  return <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]} receiveShadow onClick={(e) => e.delta < 4 && studio.select(null)}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#101215" roughness={1} />
      </mesh>
      <Grid
    position={[0, -0.065, 0]}
    args={[200, 200]}
    cellSize={0.5}
    cellThickness={0.6}
    cellColor="#16384c"
    sectionSize={2}
    sectionThickness={1}
    sectionColor="#2a6d8f"
    fadeDistance={55}
    fadeStrength={1.6}
    infiniteGrid
  />
    </>;
}
function Contents() {
  const rooms = useStudio((s) => s.rooms);
  const items = useStudio((s) => s.items);
  const selected = useStudio((s) => s.selected);
  const view = useStudio((s) => s.view);
  const overlaps = useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    for (let i = 0; i < rooms.length; i++)
      for (let j = i + 1; j < rooms.length; j++)
        if (roomsOverlap(rooms[i], rooms[j])) {
          set.add(rooms[i].id);
          set.add(rooms[j].id);
        }
    return set;
  }, [rooms]);
  const ordered = useMemo(() => [...items].sort((p, q) => Number(q.kind === "rug") - Number(p.kind === "rug")), [items]);
  return <>
      {rooms.map((r) => <RoomMesh
    key={r.id}
    room={r}
    rooms={rooms}
    selected={selected?.type === "room" && selected.id === r.id}
    overlap={overlaps.has(r.id)}
    showLabel={view === "plan"}
  />)}
      {ordered.map((i) => <ItemMesh key={i.id} item={i} selected={selected?.type === "item" && selected.id === i.id} />)}
    </>;
}
function Controls() {
  const view = useStudio((s) => s.view);
  const plan = view === "plan";
  return <OrbitControls
    makeDefault
    enableDamping
    dampingFactor={0.09}
    minDistance={3}
    maxDistance={48}
    maxPolarAngle={plan ? 1e-4 : Math.PI / 2 - 0.08}
    minPolarAngle={0}
    enableRotate={!plan}
    screenSpacePanning
    mouseButtons={{ LEFT: plan ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }}
    touches={{ ONE: plan ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
  />;
}
function StudioScene({ active, mobile, onReady }) {
  const [dpr] = useState(mobile ? [1, 1.5] : [1, 1.75]);
  return <Canvas
    shadows
    dpr={dpr}
    frameloop={active ? "always" : "never"}
    camera={{ position: [14, 13, 16], fov: 38, near: 0.1, far: 200 }}
    gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
    onCreated={({ gl }) => {
      studioCanvas.gl = gl;
      requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()));
    }}
    onPointerMissed={() => studio.select(null)}
    aria-label="3D floor plan editor"
  >
      <color attach="background" args={["#0a0b0d"]} />
      <fog attach="fog" args={["#0a0b0d", 38, 90]} />
      <Lights mobile={mobile} />
      <Ground />
      <Contents />
      <Controls />
      <CameraDirector />
    </Canvas>;
}
const finishLabel = (id) => id ? finishById(id).label : "";
export {
  StudioScene as default,
  finishLabel,
  studioCanvas
};
