const FLOORS = [
  { id: "oak-herringbone", label: "Oak chevron", color: "#c39466" },
  { id: "oak-plank", label: "Wide oak plank", color: "#c79a6c" },
  { id: "walnut-plank", label: "Walnut plank", color: "#7a5236" },
  { id: "smoked-oak", label: "Smoked oak", color: "#5b4433" },
  { id: "polished-concrete", label: "Polished concrete", color: "#bdb8b0" },
  { id: "limestone", label: "Limestone tile", color: "#ddd3c2" },
  { id: "terrazzo", label: "Terrazzo", color: "#e2ddd3" },
  { id: "slate", label: "Slate tile", color: "#4c4e4d" }
];
const WALLS = [
  { id: "chalk", label: "Chalk white", color: "#efe9df" },
  { id: "sand", label: "Warm sand", color: "#dccab0" },
  { id: "sage", label: "Sage", color: "#aab096" },
  { id: "clay", label: "Clay", color: "#b98a70" },
  { id: "mist", label: "Mist blue", color: "#bcc6c8" },
  { id: "charcoal", label: "Charcoal", color: "#3b3a37" },
  { id: "concrete", label: "Board-formed concrete", color: "#b9b5ad" },
  { id: "oak-panel", label: "Oak panelling", color: "#a7794f" }
];
const FABRICS = [
  { id: "linen", label: "Natural linen", color: "#e3dccd", roughness: 1 },
  { id: "boucle", label: "Oat boucl\xE9", color: "#d4c6ad", roughness: 1 },
  { id: "olive", label: "Olive velvet", color: "#6b6f4c", roughness: 0.85 },
  { id: "rust", label: "Terracotta", color: "#a85f3f", roughness: 0.95 },
  { id: "charcoal-wool", label: "Charcoal wool", color: "#45443f", roughness: 1 },
  { id: "cognac", label: "Cognac leather", color: "#8a4f2a", roughness: 0.5 },
  { id: "navy", label: "Ink navy", color: "#2f3a4a", roughness: 0.9 }
];
const SURFACES = [
  { id: "oak", label: "Natural oak", color: "#c9a074", tex: "wood", roughness: 0.6 },
  { id: "walnut", label: "Walnut", color: "#6e4a31", tex: "wood", roughness: 0.55 },
  { id: "ebonised", label: "Ebonised ash", color: "#2c2826", tex: "wood", roughness: 0.6 },
  { id: "lacquer", label: "White lacquer", color: "#efece6", roughness: 0.3 },
  { id: "travertine", label: "Travertine", color: "#d8c8ad", tex: "stone", roughness: 0.55 },
  { id: "marble", label: "Nero marble", color: "#2d2d2c", tex: "stone", roughness: 0.25 },
  { id: "concrete", label: "Micro-cement", color: "#b5b1aa", tex: "concrete", roughness: 0.8 },
  { id: "steel", label: "Blackened steel", color: "#2a2a29", metalness: 0.7, roughness: 0.4 },
  { id: "brass", label: "Brushed brass", color: "#b48a4a", metalness: 0.9, roughness: 0.35 }
];
const finishById = (id) => FABRICS.find((f) => f.id === id) ?? SURFACES.find((f) => f.id === id) ?? SURFACES[0];
const ROOM_TYPES = {
  living: { label: "Living room", floor: "oak-herringbone", wall: "chalk", w: 6, d: 5 },
  kitchen: { label: "Kitchen", floor: "polished-concrete", wall: "sand", w: 4.5, d: 4 },
  dining: { label: "Dining room", floor: "oak-plank", wall: "chalk", w: 4, d: 4 },
  bedroom: { label: "Bedroom", floor: "oak-plank", wall: "sage", w: 4.5, d: 4.5 },
  bathroom: { label: "Bathroom", floor: "limestone", wall: "mist", w: 3, d: 3 },
  study: { label: "Study", floor: "walnut-plank", wall: "clay", w: 3.5, d: 3 },
  hall: { label: "Hallway", floor: "terrazzo", wall: "chalk", w: 2, d: 4 }
};
const CATALOG = [
  { kind: "sofa", label: "Sofa", category: "Living", w: 2.4, d: 1, a: { group: "fabric", label: "Upholstery", default: "boucle" }, b: { group: "surface", label: "Legs", default: "walnut" } },
  { kind: "armchair", label: "Lounge chair", category: "Living", w: 0.85, d: 0.85, a: { group: "fabric", label: "Upholstery", default: "olive" }, b: { group: "surface", label: "Frame", default: "oak" } },
  { kind: "coffeeTable", label: "Coffee table", category: "Living", w: 1.2, d: 0.7, a: { group: "surface", label: "Top", default: "travertine" }, b: { group: "surface", label: "Base", default: "steel" } },
  { kind: "tvUnit", label: "Media unit", category: "Living", w: 2, d: 0.45, wall: true, a: { group: "surface", label: "Body", default: "walnut" }, b: { group: "surface", label: "Plinth", default: "steel" } },
  { kind: "rug", label: "Rug", category: "Living", w: 2.6, d: 1.8, a: { group: "fabric", label: "Weave", default: "linen" } },
  { kind: "floorLamp", label: "Floor lamp", category: "Living", w: 0.45, d: 0.45, a: { group: "fabric", label: "Shade", default: "linen" }, b: { group: "surface", label: "Stem", default: "brass" } },
  { kind: "bookshelf", label: "Bookshelf", category: "Living", w: 1.2, d: 0.38, wall: true, a: { group: "surface", label: "Carcass", default: "oak" } },
  { kind: "diningSet", label: "Dining table + 6", category: "Kitchen & Dining", w: 2.2, d: 1.9, a: { group: "surface", label: "Table top", default: "oak" }, b: { group: "fabric", label: "Seats", default: "linen" } },
  { kind: "kitchenRun", label: "Kitchen run", category: "Kitchen & Dining", w: 3.2, d: 0.65, wall: true, a: { group: "surface", label: "Cabinetry", default: "lacquer" }, b: { group: "surface", label: "Worktop", default: "marble" } },
  { kind: "island", label: "Island + stools", category: "Kitchen & Dining", w: 2.2, d: 1.6, a: { group: "surface", label: "Cabinetry", default: "walnut" }, b: { group: "surface", label: "Worktop", default: "travertine" } },
  { kind: "bed", label: "Double bed", category: "Bedroom", w: 1.9, d: 2.2, wall: true, a: { group: "fabric", label: "Bedding", default: "linen" }, b: { group: "surface", label: "Frame", default: "oak" } },
  { kind: "nightstand", label: "Bedside table", category: "Bedroom", w: 0.5, d: 0.42, wall: true, a: { group: "surface", label: "Body", default: "walnut" } },
  { kind: "wardrobe", label: "Wardrobe", category: "Bedroom", w: 2, d: 0.62, wall: true, a: { group: "surface", label: "Doors", default: "oak" } },
  { kind: "bathtub", label: "Freestanding bath", category: "Bath", w: 1.7, d: 0.8, a: { group: "surface", label: "Shell", default: "lacquer" } },
  { kind: "vanity", label: "Vanity", category: "Bath", w: 1.2, d: 0.5, wall: true, a: { group: "surface", label: "Cabinet", default: "oak" }, b: { group: "surface", label: "Top", default: "travertine" } },
  { kind: "toilet", label: "WC", category: "Bath", w: 0.4, d: 0.62, wall: true, a: { group: "surface", label: "Ceramic", default: "lacquer" } },
  { kind: "shower", label: "Walk-in shower", category: "Bath", w: 1.2, d: 0.9, wall: true, a: { group: "surface", label: "Tray", default: "concrete" }, b: { group: "surface", label: "Fittings", default: "brass" } },
  { kind: "desk", label: "Desk + chair", category: "Work & Decor", w: 1.4, d: 1.1, a: { group: "surface", label: "Desk", default: "oak" }, b: { group: "fabric", label: "Chair", default: "charcoal-wool" } },
  { kind: "plant", label: "Planter", category: "Work & Decor", w: 0.55, d: 0.55, a: { group: "surface", label: "Pot", default: "concrete" } }
];
const catalogItem = (kind) => CATALOG.find((c) => c.kind === kind);
export {
  CATALOG,
  FABRICS,
  FLOORS,
  ROOM_TYPES,
  SURFACES,
  WALLS,
  catalogItem,
  finishById
};
