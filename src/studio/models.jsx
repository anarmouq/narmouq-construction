import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { studioMaterials } from "./materials.js";
const BOX = new THREE.BoxGeometry(1, 1, 1);
const CYL = new THREE.CylinderGeometry(0.5, 0.5, 1, 28);
const SPHERE = new THREE.IcosahedronGeometry(0.5, 1);
function B({ p, s, m, r }) {
  return <mesh geometry={BOX} material={m} position={p} scale={s} rotation={r} castShadow receiveShadow />;
}
function C({ p, r, h, m, rt }) {
  return <mesh geometry={CYL} material={m} position={p} scale={[r * 2, h, r * 2]} rotation={rt} castShadow receiveShadow />;
}
function R({ p, s, m, radius = 0.05, r }) {
  return <RoundedBox args={s} radius={Math.min(radius, Math.min(...s) / 2 - 1e-3)} smoothness={3} position={p} rotation={r} material={m} castShadow receiveShadow />;
}
const legs = (w, d, h, m, r = 0.022, inset = 0.06) => [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1]
].map(([sx, sz], i) => <C key={i} p={[sx * (w / 2 - inset), h / 2, sz * (d / 2 - inset)]} r={r} h={h} m={m} />);
function Sofa({ a, b }) {
  return <group>
      {legs(2.3, 0.9, 0.12, b, 0.025, 0.1)}
      <R p={[0, 0.25, 0]} s={[2.36, 0.26, 0.96]} m={a} radius={0.06} />
      <R p={[0, 0.6, -0.37]} s={[2.36, 0.48, 0.22]} m={a} radius={0.08} />
      <R p={[-1.08, 0.46, 0.02]} s={[0.2, 0.32, 0.92]} m={a} radius={0.08} />
      <R p={[1.08, 0.46, 0.02]} s={[0.2, 0.32, 0.92]} m={a} radius={0.08} />
      {[-0.66, 0, 0.66].map((x) => <R key={x} p={[x, 0.44, 0.08]} s={[0.64, 0.14, 0.7]} m={a} radius={0.06} />)}
      {[-0.66, 0, 0.66].map((x) => <R key={x} p={[x, 0.66, -0.2]} s={[0.6, 0.4, 0.16]} m={a} radius={0.07} r={[-0.18, 0, 0]} />)}
    </group>;
}
function Armchair({ a, b }) {
  return <group>
      {legs(0.78, 0.78, 0.16, b, 0.02, 0.05)}
      <B p={[0, 0.18, 0]} s={[0.8, 0.04, 0.8]} m={b} />
      <R p={[0, 0.3, 0.04]} s={[0.62, 0.18, 0.66]} m={a} radius={0.06} />
      <R p={[0, 0.58, -0.3]} s={[0.66, 0.5, 0.16]} m={a} radius={0.07} r={[-0.16, 0, 0]} />
      <B p={[-0.37, 0.42, 0]} s={[0.05, 0.04, 0.78]} m={b} />
      <B p={[0.37, 0.42, 0]} s={[0.05, 0.04, 0.78]} m={b} />
      <B p={[-0.37, 0.3, 0.33]} s={[0.04, 0.24, 0.04]} m={b} />
      <B p={[0.37, 0.3, 0.33]} s={[0.04, 0.24, 0.04]} m={b} />
    </group>;
}
function CoffeeTable({ a, b }) {
  return <group>
      <R p={[0, 0.37, 0]} s={[1.2, 0.06, 0.7]} m={a} radius={0.025} />
      <B p={[-0.38, 0.17, 0]} s={[0.06, 0.34, 0.5]} m={b} />
      <B p={[0.38, 0.17, 0]} s={[0.06, 0.34, 0.5]} m={b} />
      <B p={[0, 0.1, 0]} s={[0.82, 0.02, 0.46]} m={b} />
    </group>;
}
function TvUnit({ a, b }) {
  const L = studioMaterials();
  return <group>
      <B p={[0, 0.04, 0]} s={[1.9, 0.08, 0.38]} m={b} />
      <B p={[0, 0.3, 0]} s={[2, 0.44, 0.45]} m={a} />
      {[-0.5, 0, 0.5].map((x) => <B key={x} p={[x, 0.3, 0.226]} s={[6e-3, 0.4, 4e-3]} m={L.cap} />)}
      <B p={[0, 1.1, -0.17]} s={[1.45, 0.82, 0.04]} m={L.screen} />
      <B p={[0.3, 0.56, 0.02]} s={[0.24, 0.08, 0.18]} m={L.ceramic} />
    </group>;
}
function Rug({ a }) {
  return <group>
      <R p={[0, 8e-3, 0]} s={[2.6, 0.016, 1.8]} m={a} radius={6e-3} />
    </group>;
}
function FloorLamp({ a, b }) {
  const L = studioMaterials();
  return <group>
      <C p={[0, 0.015, 0]} r={0.16} h={0.03} m={b} />
      <C p={[0, 0.78, 0]} r={0.012} h={1.5} m={b} />
      <mesh position={[0, 1.5, 0]} castShadow material={a}>
        <cylinderGeometry args={[0.13, 0.2, 0.3, 32, 1, true]} />
      </mesh>
      <mesh position={[0, 1.45, 0]} geometry={SPHERE} scale={0.08} material={L.bulb} />
    </group>;
}
const BOOK_SEED = [0.3, 0.8, 0.15, 0.6, 0.95, 0.4, 0.7, 0.05, 0.5, 0.85, 0.2, 0.65];
function Bookshelf({ a }) {
  const L = studioMaterials();
  const H = 2;
  const W = 1.2;
  const D = 0.36;
  const shelves = [0.06, 0.48, 0.9, 1.32, 1.74, 1.97];
  return <group>
      <B p={[-W / 2 + 0.015, H / 2, 0]} s={[0.03, H, D]} m={a} />
      <B p={[W / 2 - 0.015, H / 2, 0]} s={[0.03, H, D]} m={a} />
      <B p={[0, H / 2, -D / 2 + 0.01]} s={[W, H, 0.02]} m={a} />
      {shelves.map((y) => <B key={y} p={[0, y, 0]} s={[W - 0.06, 0.03, D]} m={a} />)}
      {shelves.slice(0, 4).map((y, si) => {
    let x = -W / 2 + 0.06;
    const books = [];
    for (let k = 0; k < 9; k++) {
      const r = BOOK_SEED[(k + si * 5) % BOOK_SEED.length];
      const bw = 0.03 + r * 0.03;
      const bh = 0.24 + r * 0.1;
      if (k === 5 + si % 3) {
        x += 0.18;
        continue;
      }
      if (x + bw > W / 2 - 0.05) break;
      books.push(
        <B key={k} p={[x + bw / 2, y + 0.015 + bh / 2, 0.02]} s={[bw, bh, 0.22]} m={L.bookColors[(k + si * 3) % L.bookColors.length]} />
      );
      x += bw + 4e-3;
    }
    return <group key={y}>{books}</group>;
  })}
    </group>;
}
function Plant({ a }) {
  const L = studioMaterials();
  return <group>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow material={a}>
        <cylinderGeometry args={[0.24, 0.18, 0.5, 28]} />
      </mesh>
      <C p={[0, 0.49, 0]} r={0.21} h={0.02} m={L.soil} />
      <C p={[0, 0.8, 0]} r={0.02} h={0.6} m={L.soil} />
      {[
    [0, 1.18, 0, 0.55],
    [0.16, 1.02, 0.06, 0.36],
    [-0.14, 1.06, -0.08, 0.4],
    [0.04, 1.4, -0.05, 0.36],
    [-0.08, 0.92, 0.13, 0.3]
  ].map(([x, y, z, s], i) => <mesh key={i} geometry={SPHERE} material={L.leaf} position={[x, y, z]} scale={s} castShadow />)}
    </group>;
}
function DiningSet({ a, b }) {
  const chair = (x, z, rot, k) => <group key={k} position={[x, 0, z]} rotation={[0, rot, 0]}>
      {legs(0.42, 0.42, 0.44, a, 0.016, 0.04)}
      <R p={[0, 0.47, 0]} s={[0.46, 0.06, 0.46]} m={b} radius={0.025} />
      <B p={[0, 0.72, -0.21]} s={[0.44, 0.36, 0.035]} m={a} r={[-0.08, 0, 0]} />
    </group>;
  return <group>
      <R p={[0, 0.735, 0]} s={[2, 0.05, 0.95]} m={a} radius={0.02} />
      <B p={[-0.78, 0.36, 0]} s={[0.07, 0.72, 0.7]} m={a} />
      <B p={[0.78, 0.36, 0]} s={[0.07, 0.72, 0.7]} m={a} />
      <B p={[0, 0.62, 0]} s={[1.5, 0.05, 0.06]} m={a} />
      {[-0.6, 0, 0.6].map((x, i) => chair(x, -0.66, 0, i))}
      {[-0.6, 0, 0.6].map((x, i) => chair(x, 0.66, Math.PI, i + 3))}
    </group>;
}
function KitchenRun({ a, b }) {
  const L = studioMaterials();
  const W = 3.2;
  return <group>
      <B p={[0, 0.05, 0.02]} s={[W, 0.1, 0.52]} m={L.cap} />
      <B p={[0, 0.5, -0.02]} s={[W, 0.8, 0.6]} m={a} />
      {[-1.2, -0.6, 0, 0.6, 1.2].map((x) => <B key={x} p={[x + 0.3, 0.5, 0.281]} s={[6e-3, 0.78, 4e-3]} m={L.cap} />)}
      <B p={[0, 0.92, 0]} s={[W, 0.04, 0.65]} m={b} />
      {
    /* sink + tap */
  }
      <B p={[-0.7, 0.935, 0.03]} s={[0.55, 0.012, 0.4]} m={L.screen} />
      <C p={[-0.7, 1.07, -0.24]} r={0.012} h={0.26} m={L.screen} />
      <B p={[-0.7, 1.19, -0.17]} s={[0.025, 0.025, 0.16]} m={L.screen} />
      {
    /* induction hob */
  }
      <B p={[0.75, 0.942, 0.02]} s={[0.6, 6e-3, 0.5]} m={L.screen} />
      {
    /* splashback + wall cabinets */
  }
      <B p={[0, 1.25, -0.315]} s={[W, 0.62, 0.02]} m={b} />
      <B p={[0, 1.93, -0.15]} s={[W, 0.74, 0.35]} m={a} />
      {[-1.2, -0.4, 0.4, 1.2].map((x) => <B key={x} p={[x, 1.93, 0.026]} s={[6e-3, 0.72, 4e-3]} m={L.cap} />)}
      <B p={[0, 1.555, -0.15]} s={[W - 0.04, 0.012, 0.32]} m={L.bulb} />
    </group>;
}
function Island({ a, b }) {
  const L = studioMaterials();
  const stool = (x) => <group key={x} position={[x, 0, 0.5]}>
      <C p={[0, 0.33, 0]} r={0.012} h={0.66} m={L.screen} />
      <C p={[0, 0.01, 0]} r={0.17} h={0.02} m={L.screen} />
      <C p={[0, 0.68, 0]} r={0.18} h={0.05} m={a} />
      <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} material={L.screen}>
        <torusGeometry args={[0.14, 8e-3, 8, 32]} />
      </mesh>
    </group>;
  return <group>
      <B p={[0, 0.05, -0.32]} s={[2, 0.1, 0.8]} m={L.cap} />
      <B p={[0, 0.5, -0.32]} s={[2.1, 0.8, 0.88]} m={a} />
      <B p={[0, 0.92, -0.25]} s={[2.24, 0.04, 1.06]} m={b} />
      {[-0.65, 0, 0.65].map(stool)}
      <B p={[-0.5, 0.96, -0.4]} s={[0.4, 0.04, 0.3]} m={L.ceramic} />
    </group>;
}
function Bed({ a, b }) {
  const L = studioMaterials();
  return <group>
      <B p={[0, 0.17, 0.02]} s={[1.9, 0.22, 2.12]} m={b} />
      {legs(1.8, 2, 0.08, b, 0.03)}
      <B p={[0, 0.62, -1.05]} s={[1.9, 1, 0.08]} m={b} />
      <R p={[0, 0.39, 0.03]} s={[1.78, 0.22, 2]} m={L.mattress} radius={0.05} />
      <R p={[0, 0.52, 0.32]} s={[1.84, 0.08, 1.42]} m={a} radius={0.04} />
      <R p={[0, 0.48, 0.98]} s={[1.86, 0.1, 0.3]} m={a} radius={0.04} />
      <R p={[-0.44, 0.56, -0.74]} s={[0.72, 0.16, 0.4]} m={L.mattress} radius={0.07} r={[-0.25, 0, 0]} />
      <R p={[0.44, 0.56, -0.74]} s={[0.72, 0.16, 0.4]} m={L.mattress} radius={0.07} r={[-0.25, 0, 0]} />
    </group>;
}
function Nightstand({ a }) {
  const L = studioMaterials();
  return <group>
      {legs(0.44, 0.36, 0.14, a, 0.015, 0.04)}
      <B p={[0, 0.34, 0]} s={[0.5, 0.4, 0.42]} m={a} />
      <B p={[0, 0.34, 0.211]} s={[0.42, 4e-3, 4e-3]} m={L.cap} />
      <C p={[0.08, 0.64, -0.04]} r={0.06} h={0.2} m={L.ceramic} />
      <mesh position={[0.08, 0.82, -0.04]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.16, 24, 1, true]} />
        <meshStandardMaterial color="#efe7d8" roughness={1} side={THREE.DoubleSide} />
      </mesh>
    </group>;
}
function Wardrobe({ a }) {
  const L = studioMaterials();
  return <group>
      <B p={[0, 0.04, 0.01]} s={[1.96, 0.08, 0.56]} m={L.cap} />
      <B p={[0, 1.2, 0]} s={[2, 2.24, 0.62]} m={a} />
      {[-0.5, 0, 0.5].map((x) => <B key={x} p={[x, 1.2, 0.311]} s={[6e-3, 2.2, 4e-3]} m={L.cap} />)}
      {[-0.54, -0.04, 0.46].map((x) => <B key={x} p={[x + 0.04, 1.15, 0.33]} s={[0.014, 0.4, 0.02]} m={finishBrass()} />)}
    </group>;
}
let brass = null;
const finishBrass = () => brass ??= new THREE.MeshStandardMaterial({ color: "#b48a4a", metalness: 0.9, roughness: 0.35 });
function Bathtub({ a }) {
  const L = studioMaterials();
  return <group>
      <R p={[0, 0.28, 0]} s={[1.7, 0.56, 0.8]} m={a} radius={0.2} />
      <R p={[0, 0.5, 0]} s={[1.5, 0.08, 0.6]} m={L.water} radius={0.03} />
      <C p={[0.74, 0.5, -0.5]} r={0.016} h={1} m={finishBrass()} />
      <B p={[0.74, 0.98, -0.42]} s={[0.025, 0.025, 0.18]} m={finishBrass()} />
    </group>;
}
function Vanity({ a, b }) {
  const L = studioMaterials();
  return <group>
      <B p={[0, 0.6, 0]} s={[1.2, 0.42, 0.48]} m={a} />
      <B p={[0, 0.6, 0.241]} s={[6e-3, 0.38, 4e-3]} m={L.cap} />
      <B p={[0, 0.83, 0]} s={[1.22, 0.04, 0.5]} m={b} />
      <R p={[0, 0.9, 0.03]} s={[0.5, 0.1, 0.36]} m={L.ceramic} radius={0.045} />
      <C p={[0, 1, -0.19]} r={0.012} h={0.2} m={finishBrass()} />
      <B p={[0, 1.08, -0.13]} s={[0.022, 0.022, 0.12]} m={finishBrass()} />
      <B p={[0, 1.62, -0.235]} s={[0.9, 0.8, 0.02]} m={L.mirror} />
    </group>;
}
function Toilet({ a }) {
  return <group>
      <B p={[0, 0.6, -0.27]} s={[0.4, 1, 0.08]} m={a} />
      <R p={[0, 0.42, -0.02]} s={[0.36, 0.3, 0.54]} m={a} radius={0.12} />
      <R p={[0, 0.58, -0.02]} s={[0.37, 0.025, 0.52]} m={a} radius={0.01} />
      <B p={[0, 0.85, -0.225]} s={[0.18, 0.12, 0.01]} m={finishBrass()} />
    </group>;
}
function Shower({ a, b }) {
  const L = studioMaterials();
  return <group>
      <B p={[0, 0.02, 0]} s={[1.2, 0.04, 0.9]} m={a} />
      <B p={[0.3, 1.02, 0.44]} s={[0.6, 2, 0.012]} m={L.glass} />
      <B p={[0.3, 2.02, 0.44]} s={[0.6, 0.02, 0.02]} m={b} />
      <C p={[-0.2, 1.4, -0.42]} r={0.012} h={1.2} m={b} />
      <B p={[-0.2, 2, -0.3]} s={[0.02, 0.02, 0.24]} m={b} />
      <C p={[-0.2, 1.985, -0.2]} r={0.11} h={0.012} m={b} />
      <B p={[0, 0.045, 0.1]} s={[0.6, 4e-3, 0.04]} m={L.cap} />
    </group>;
}
function Desk({ a, b }) {
  const L = studioMaterials();
  return <group>
      <group position={[0, 0, -0.2]}>
        <R p={[0, 0.735, 0]} s={[1.4, 0.035, 0.7]} m={a} radius={0.012} />
        <B p={[-0.66, 0.36, 0]} s={[0.04, 0.72, 0.62]} m={a} />
        <B p={[0.66, 0.36, 0]} s={[0.04, 0.72, 0.62]} m={a} />
        <B p={[0, 1, -0.2]} s={[0.62, 0.38, 0.02]} m={L.screen} />
        <C p={[0, 0.82, -0.22]} r={0.012} h={0.16} m={L.screen} />
        <B p={[0, 0.758, 0.08]} s={[0.42, 0.012, 0.14]} m={L.ceramic} />
      </group>
      <group position={[0, 0, 0.3]} rotation={[0, Math.PI + 0.2, 0]}>
        {[0, 1, 2, 3, 4].map((k) => <B key={k} p={[Math.sin(k / 5 * Math.PI * 2) * 0.13, 0.04, Math.cos(k / 5 * Math.PI * 2) * 0.13]} s={[0.04, 0.03, 0.27]} m={L.screen} r={[0, k / 5 * Math.PI * 2, 0]} />)}
        <C p={[0, 0.24, 0]} r={0.022} h={0.36} m={L.screen} />
        <R p={[0, 0.46, 0]} s={[0.48, 0.08, 0.46]} m={b} radius={0.035} />
        <R p={[0, 0.78, 0.2]} s={[0.46, 0.5, 0.07]} m={b} radius={0.035} r={[0.12, 0, 0]} />
      </group>
    </group>;
}
function FurnitureModel({ kind, a, b }) {
  switch (kind) {
    case "sofa":
      return <Sofa a={a} b={b} />;
    case "armchair":
      return <Armchair a={a} b={b} />;
    case "coffeeTable":
      return <CoffeeTable a={a} b={b} />;
    case "tvUnit":
      return <TvUnit a={a} b={b} />;
    case "rug":
      return <Rug a={a} />;
    case "floorLamp":
      return <FloorLamp a={a} b={b} />;
    case "bookshelf":
      return <Bookshelf a={a} />;
    case "plant":
      return <Plant a={a} />;
    case "diningSet":
      return <DiningSet a={a} b={b} />;
    case "kitchenRun":
      return <KitchenRun a={a} b={b} />;
    case "island":
      return <Island a={a} b={b} />;
    case "bed":
      return <Bed a={a} b={b} />;
    case "nightstand":
      return <Nightstand a={a} />;
    case "wardrobe":
      return <Wardrobe a={a} />;
    case "bathtub":
      return <Bathtub a={a} />;
    case "vanity":
      return <Vanity a={a} b={b} />;
    case "toilet":
      return <Toilet a={a} />;
    case "shower":
      return <Shower a={a} b={b} />;
    case "desk":
      return <Desk a={a} b={b} />;
  }
}
export {
  FurnitureModel
};
