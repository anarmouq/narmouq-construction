/* =========================================================
   Hero scene: a concrete-frame tower going up floor by floor.
   This scene shows a structural frame under construction,
   moving like a real site (columns rise, a pause, the slab is
   poured, the crane slews and stops), because building it is
   what Narmouq does.
   ========================================================= */
/* Started by the home page: window.narmouqHero(canvas) returns a stop function. */
window.narmouqHero = function (canvas) {
  let stopped = false;
  const ac = new AbortController();
  const on = (t, f, o) => window.addEventListener(t, f, Object.assign({}, o, { signal: ac.signal }));
  if (!canvas || !window.THREE) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmall = window.matchMedia("(max-width: 860px)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    canvas.remove();
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 42, 95);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 200);

  const CYAN = 0x5cc8ff;
  const AMBER = 0xf2a71b;
  const BONE = 0xedeae4;

  const site = new THREE.Group();
  scene.add(site);

  /* ---------- ground: site grid + footprint ---------- */
  const grid = new THREE.GridHelper(70, 70, 0x16384c, 0x0b1a24);
  grid.material.transparent = true;
  grid.material.opacity = 0.9;
  site.add(grid);

  const lineMat = (color, opacity) => new THREE.LineBasicMaterial({ color, transparent: true, opacity });

  // setting-out lines on the ground (dashed footprint, offset)
  const footprint = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(9, 0.001, 7)),
    new THREE.LineDashedMaterial({ color: CYAN, dashSize: 0.3, gapSize: 0.2, transparent: true, opacity: 0.6 })
  );
  footprint.computeLineDistances();
  footprint.position.y = 0.01;
  site.add(footprint);

  /* ---------- building ---------- */
  const FLOORS = 12;
  const FH = 1.15; // floor height
  const W = 6.4, D = 4.4;
  const colX = [-3, -1, 1, 3];
  const colZ = [-2, 0, 2];

  const floors = [];
  const colGeo = new THREE.BufferGeometry();
  {
    const pts = [];
    colX.forEach((x) => colZ.forEach((z) => { pts.push(x, 0, z, x, 1, z); }));
    colGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  }
  const slabGeo = new THREE.BoxGeometry(W + 0.6, 0.16, D + 0.6);
  const slabEdges = new THREE.EdgesGeometry(slabGeo);
  const glassGeo = new THREE.BoxGeometry(W + 0.2, FH - 0.2, D + 0.2);
  const glassEdges = new THREE.EdgesGeometry(glassGeo);
  // vertical mullions for the curtain wall
  const mullionGeo = (() => {
    const pts = [];
    const hw = (W + 0.2) / 2, hd = (D + 0.2) / 2, h = (FH - 0.2) / 2;
    for (let i = 1; i < 8; i++) {
      const x = -hw + (i * (W + 0.2)) / 8;
      pts.push(x, -h, hd, x, h, hd, x, -h, -hd, x, h, -hd);
    }
    for (let i = 1; i < 5; i++) {
      const z = -hd + (i * (D + 0.2)) / 5;
      pts.push(hw, -h, z, hw, h, z, -hw, -h, z, -hw, h, z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  })();

  for (let i = 0; i < FLOORS; i++) {
    const g = new THREE.Group();
    g.position.y = i * FH;

    const cols = new THREE.LineSegments(colGeo, lineMat(BONE, 0.85));
    cols.scale.y = 0.0001;
    g.add(cols);

    const slab = new THREE.Group();
    slab.position.y = FH;
    const slabLines = new THREE.LineSegments(slabEdges, lineMat(CYAN, 0));
    const slabFill = new THREE.Mesh(slabGeo, new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0, depthWrite: false }));
    slab.add(slabFill, slabLines);
    g.add(slab);

    const facade = new THREE.Group();
    facade.position.y = FH / 2;
    const fEdges = new THREE.LineSegments(glassEdges, lineMat(CYAN, 0));
    const fMull = new THREE.LineSegments(mullionGeo, lineMat(CYAN, 0));
    const fFill = new THREE.Mesh(glassGeo, new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
    facade.add(fFill, fEdges, fMull);
    g.add(facade);

    site.add(g);
    floors.push({ cols, slabLines, slabFill, fEdges, fMull, fFill });
  }

  /* ---------- tower crane ---------- */
  const crane = new THREE.Group();
  crane.position.set(6.2, 0, -3.2);
  site.add(crane);
  const MAST_H = FLOORS * FH + 4.2;
  const craneMat = lineMat(AMBER, 0.95);

  // lattice mast
  {
    const pts = [];
    const s = 0.35;
    const corners = [[-s, -s], [s, -s], [s, s], [-s, s]];
    corners.forEach(([x, z]) => pts.push(x, 0, z, x, MAST_H, z));
    for (let y = 0; y < MAST_H; y += 0.7) {
      for (let c = 0; c < 4; c++) {
        const [x1, z1] = corners[c];
        const [x2, z2] = corners[(c + 1) % 4];
        pts.push(x1, y, z1, x2, y + 0.7, z2); // diagonal bracing
        pts.push(x1, y, z1, x2, y, z2);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    crane.add(new THREE.LineSegments(g, craneMat));
  }

  const slew = new THREE.Group();
  slew.position.y = MAST_H;
  crane.add(slew);
  {
    const pts = [];
    const JIB = 13, CJ = 4.5;
    // jib (triangular truss)
    pts.push(-CJ, 0, 0, JIB, 0, 0, -CJ, 0.6, 0, JIB, 0.25, 0);
    for (let x = -CJ; x < JIB; x += 0.8) pts.push(x, 0, 0, x + 0.4, x < 0 ? 0.6 : 0.6 - (x / JIB) * 0.35, 0);
    // A-frame and pendants
    pts.push(0, 0, 0, 0, 2.6, 0, 0, 2.6, 0, JIB * 0.7, 0.25, 0, 0, 2.6, 0, -CJ, 0.6, 0);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    slew.add(new THREE.LineSegments(g, craneMat));

    // counterweight
    const cw = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 0.8, 0.7)), craneMat);
    cw.position.set(-CJ + 0.7, -0.2, 0);
    slew.add(cw);
    // cab
    const cab = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.7, 0.6, 0.7)), lineMat(BONE, 0.9));
    cab.position.set(0.6, -0.4, 0.55);
    slew.add(cab);
  }
  // trolley + hook (moves along jib, cable length changes)
  const trolley = new THREE.Group();
  slew.add(trolley);
  const cableGeo = new THREE.BufferGeometry();
  cableGeo.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0, -3, 0], 3));
  const cable = new THREE.LineSegments(cableGeo, lineMat(BONE, 0.7));
  trolley.add(cable);
  const load = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.4, 0.25, 0.5)), lineMat(AMBER, 1));
  trolley.add(load);
  // warning light on crane tip
  const tipLight = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff4d3a }));
  tipLight.position.set(13, 0.3, 0);
  slew.add(tipLight);

  /* ---------- dust: each mote drifts on its own phase ---------- */
  const DUST = isSmall ? 140 : 320;
  const dustGeo = new THREE.BufferGeometry();
  const dPos = new Float32Array(DUST * 3);
  const dSeed = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dSeed[i * 3] = (Math.random() - 0.5) * 30;
    dSeed[i * 3 + 1] = Math.random() * 18;
    dSeed[i * 3 + 2] = (Math.random() - 0.5) * 24;
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
  const dustMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(AMBER) }, uSize: { value: 26 * renderer.getPixelRatio() } },
    vertexShader: `
      uniform float uSize;
      varying float vAlpha;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize / -mv.z;
        vAlpha = smoothstep(60.0, 10.0, -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        float s = pow(1.0 - smoothstep(0.0, 0.5, d), 3.0);
        gl_FragColor = vec4(uColor, s * 0.55 * vAlpha);
      }`,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  site.add(dust);

  /* ---------- HUD hooks ---------- */
  const elLevel = document.getElementById("build-level");
  const elStage = document.getElementById("build-stage");
  const elBar = document.getElementById("build-bar");
  const STAGES = ["Setting out", "Columns rising", "Slab pour", "Curing", "Curtain wall", "Topped out"];

  /* ---------- timeline ---------- */
  // per floor: 0.0-0.55 columns rise, 0.55-0.7 pause, 0.7-1.0 slab pour
  const FLOOR_T = 0.95; // seconds per floor
  const START = 0.6;
  const BUILD_END = START + FLOORS * FLOOR_T;
  const FACADE_T = 0.28;
  const FACADE_FLOORS = FLOORS - 3; // top floors stay as open frame
  const ALL_END = BUILD_END + FACADE_FLOORS * FACADE_T + 0.6;

  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  // spring with slight overshoot, settles at 1
  const springOut = (t) => (t >= 1 ? 1 : 1 - Math.exp(-7 * t) * Math.cos(10 * t));

  function applyBuild(t) {
    let current = 0;
    let stage = 0;
    for (let i = 0; i < FLOORS; i++) {
      const f = floors[i];
      const local = (t - START - i * FLOOR_T) / FLOOR_T;
      const colP = clamp01(local / 0.55);
      const slabP = clamp01((local - 0.7) / 0.3);
      f.cols.scale.y = Math.max(0.0001, springOut(colP));
      f.cols.material.opacity = colP > 0 ? 0.85 : 0;
      f.slabLines.material.opacity = slabP * 0.95;
      // fresh concrete glows amber, then cures to a dim tone
      const cure = clamp01((t - (START + (i + 1) * FLOOR_T)) / 2.2);
      f.slabFill.material.opacity = slabP * (0.55 - cure * 0.43);

      const fp = i < FACADE_FLOORS ? clamp01((t - BUILD_END - i * FACADE_T) / 0.6) : 0;
      f.fEdges.material.opacity = fp * 0.55;
      f.fMull.material.opacity = fp * 0.25;
      f.fFill.material.opacity = fp * 0.06;

      if (local > 0) {
        current = i + 1;
        stage = local < 0.55 ? 1 : local < 0.7 ? 2 : local < 1 ? 2 : 3;
      }
    }
    if (t < START) stage = 0;
    if (t > BUILD_END) stage = 4;
    if (t > ALL_END) stage = 5;

    if (elLevel) elLevel.textContent = String(Math.min(current, FLOORS)).padStart(2, "0");
    if (elStage) elStage.textContent = STAGES[stage];
    if (elBar) elBar.style.width = (clamp01(t / ALL_END) * 100).toFixed(1) + "%";
  }

  /* crane: slews to a target, stops, trolley moves, hook drops, repeat */
  const craneStops = [
    { a: 0.9, r: 9.5, drop: 0.55 },
    { a: 2.4, r: 6.5, drop: 0.7 },
    { a: 1.6, r: 11.5, drop: 0.4 },
    { a: 0.3, r: 8, drop: 0.65 },
  ];
  const STOP_T = 4.2;
  function applyCrane(t, topY) {
    const k = Math.floor(t / STOP_T);
    const p = (t % STOP_T) / STOP_T;
    const from = craneStops[(k + craneStops.length - 1) % craneStops.length];
    const to = craneStops[k % craneStops.length];
    const move = easeOut(clamp01(p / 0.45)); // slew + trolley travel
    slew.rotation.y = from.a + (to.a - from.a) * move;
    const r = from.r + (to.r - from.r) * move;
    trolley.position.x = r;
    // hook lowers while stopped, then lifts again
    const dropP = p < 0.5 ? 0 : p < 0.75 ? easeOut((p - 0.5) / 0.25) : 1 - easeOut((p - 0.75) / 0.25);
    const top = MAST_H - topY;
    const len = 1.6 + dropP * Math.max(0.5, top * to.drop);
    cable.geometry.attributes.position.setY(1, -len);
    cable.geometry.attributes.position.needsUpdate = true;
    load.position.y = -len - 0.15;
    // slight pendulum sway after the slew stops
    load.rotation.z = Math.sin(t * 3) * 0.05 * (1 - move) ;
    tipLight.material.color.setHex(Math.sin(t * 4) > 0.2 ? 0xff4d3a : 0x330a06);
  }

  function applyDust(t) {
    for (let i = 0; i < DUST; i++) {
      const sx = dSeed[i * 3], sy = dSeed[i * 3 + 1], sz = dSeed[i * 3 + 2];
      dPos[i * 3] = sx + Math.sin(t * 0.15 + i) * 0.8;
      dPos[i * 3 + 1] = (sy + t * (0.08 + (i % 7) * 0.02)) % 18;
      dPos[i * 3 + 2] = sz + Math.cos(t * 0.12 + i * 1.3) * 0.8;
    }
    dustGeo.attributes.position.needsUpdate = true;
  }

  /* ---------- camera, pointer + scroll ---------- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  on("pointermove", (e) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  let scrollP = 0;
  const hero = canvas.closest(".hero");
  function onScroll() {
    const h = hero ? hero.offsetHeight : window.innerHeight;
    scrollP = clamp01(window.scrollY / h);
  }
  on("scroll", onScroll, { passive: true });
  onScroll();

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // shift the rendered view so the tower sits right of the headline
    if (camera.aspect > 1.25) camera.setViewOffset(w, h, -w * 0.2, 0, w, h);
    else camera.clearViewOffset();
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  resize();

  /* ---------- loop (paused when off-screen) ---------- */
  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }); io.observe(canvas);

  const clock = new THREE.Clock();
  const preview = location.hash === "#built";
  let simT = reduce || preview ? ALL_END + 1 : 0;

  function frame() {
    if (stopped) return;
    requestAnimationFrame(frame);
    if (!visible) { clock.getDelta(); return; }
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!reduce) simT += dt;

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    applyBuild(simT);
    const builtFloors = clamp01((simT - START) / (FLOORS * FLOOR_T)) * FLOORS;
    applyCrane(reduce ? 0 : simT, builtFloors * FH);
    if (!reduce) applyDust(simT);

    // camera orbits slowly; scroll raises it toward the top of the tower
    const orbit = (reduce ? 0.6 : 0.55 + simT * 0.018) + pointer.x * 0.18;
    const radius = isSmall ? 54 : 46;
    const camY = 6 + scrollP * 12 - pointer.y * 2;
    camera.position.set(
      site.position.x + Math.sin(orbit) * radius,
      camY,
      site.position.z + Math.cos(orbit) * radius
    );
    camera.lookAt(site.position.x, 9.5 + scrollP * 3, site.position.z);

    renderer.render(scene, camera);
  }
  frame();
  return () => { stopped = true; ac.abort(); ro.disconnect(); io.disconnect(); renderer.dispose(); };
};
