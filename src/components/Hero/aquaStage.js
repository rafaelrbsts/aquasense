/**
 * Maquete 3D do herói: um poço artesiano e um criadouro ligados por tubulação,
 * com o gateway LoRaWAN entre os dois. Portada do canvas de design (aqua-stage),
 * onde vivia como custom element; aqui é uma função imperativa que o componente
 * React monta e descarta.
 *
 * A geometria é escrita em metros aproximados e recentrada no fim de
 * `buildScene`, de modo que o enquadramento da câmera não dependa dela.
 */
import * as THREE from 'three';

/** Órbita mínima — evita a dependência de importmap do OrbitControls. */
class Orbit {
  constructor(camera, dom) {
    this.camera = camera;
    this.dom = dom;
    this.target = new THREE.Vector3();
    this.autoRotate = false;
    this.autoRotateSpeed = 0.5;
    this.minDistance = 2.4;
    this.maxDistance = 22;
    this.maxPolarAngle = Math.PI / 2 - 0.04;
    this.minPolarAngle = 0.15;
    this._sph = new THREE.Spherical();
    this._listeners = {};
    this._drag = null;
    dom.style.touchAction = 'none';

    this._onDown = (e) => {
      this._drag = { x: e.clientX, y: e.clientY };
      dom.setPointerCapture(e.pointerId);
      this._emit('start');
    };
    this._onMove = (e) => {
      if (!this._drag) return;
      const dx = e.clientX - this._drag.x;
      const dy = e.clientY - this._drag.y;
      this._drag = { x: e.clientX, y: e.clientY };
      this._sph.setFromVector3(this.camera.position.clone().sub(this.target));
      this._sph.theta -= dx * 0.005;
      this._sph.phi = Math.min(
        this.maxPolarAngle,
        Math.max(this.minPolarAngle, this._sph.phi - dy * 0.005),
      );
      this.camera.position.copy(this.target).add(new THREE.Vector3().setFromSpherical(this._sph));
    };
    this._onUp = (e) => {
      if (!this._drag) return;
      this._drag = null;
      try {
        dom.releasePointerCapture(e.pointerId);
      } catch {
        // O navegador já pode ter liberado a captura junto com o ponteiro.
      }
    };
    this._onWheel = (e) => {
      e.preventDefault();
      this._sph.setFromVector3(this.camera.position.clone().sub(this.target));
      this._sph.radius = Math.min(
        this.maxDistance,
        Math.max(this.minDistance, this._sph.radius * (1 + Math.sign(e.deltaY) * 0.08)),
      );
      this.camera.position.copy(this.target).add(new THREE.Vector3().setFromSpherical(this._sph));
      this._emit('start');
    };

    dom.addEventListener('pointerdown', this._onDown);
    dom.addEventListener('pointermove', this._onMove);
    dom.addEventListener('pointerup', this._onUp);
    dom.addEventListener('pointercancel', this._onUp);
    dom.addEventListener('wheel', this._onWheel, { passive: false });
  }

  addEventListener(name, fn) {
    (this._listeners[name] = this._listeners[name] || []).push(fn);
  }

  _emit(name) {
    (this._listeners[name] || []).forEach((fn) => fn());
  }

  update() {
    if (this.autoRotate) {
      this._sph.setFromVector3(this.camera.position.clone().sub(this.target));
      this._sph.theta += this.autoRotateSpeed * 0.0022;
      this.camera.position.copy(this.target).add(new THREE.Vector3().setFromSpherical(this._sph));
    }
    this.camera.lookAt(this.target);
  }

  dispose() {
    const dom = this.dom;
    dom.removeEventListener('pointerdown', this._onDown);
    dom.removeEventListener('pointermove', this._onMove);
    dom.removeEventListener('pointerup', this._onUp);
    dom.removeEventListener('pointercancel', this._onUp);
    dom.removeEventListener('wheel', this._onWheel);
  }
}

const ACCENT = 0x0084d6; // --color-aqua

function buildScene() {
  const M = {
    earth: new THREE.MeshStandardMaterial({ name: 'terra', color: 0xc4ccd2, roughness: 1 }),
    stone: new THREE.MeshStandardMaterial({ name: 'pedra', color: 0xdde3e8, roughness: 0.95 }),
    stoneDark: new THREE.MeshStandardMaterial({ name: 'pedra_esc', color: 0xa8b3bc, roughness: 0.95 }),
    concrete: new THREE.MeshStandardMaterial({ name: 'concreto', color: 0xeef1f4, roughness: 0.9 }),
    wood: new THREE.MeshStandardMaterial({ name: 'madeira', color: 0x6b7883, roughness: 0.85 }),
    tile: new THREE.MeshStandardMaterial({ name: 'telha', color: 0x40505c, roughness: 0.8 }),
    metal: new THREE.MeshStandardMaterial({
      name: 'metal',
      color: 0xa8b3bc,
      roughness: 0.4,
      metalness: 0.3,
    }),
    water: new THREE.MeshStandardMaterial({
      name: 'agua',
      color: 0x63a9d6,
      roughness: 0.06,
      metalness: 0.2,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    }),
    fish: new THREE.MeshStandardMaterial({ name: 'peixe', color: 0x33424d, roughness: 0.6 }),
    accent: new THREE.MeshStandardMaterial({ name: 'sensor', color: ACCENT, roughness: 0.45 }),
    accentGlow: new THREE.MeshBasicMaterial({ name: 'sensor_luz', color: ACCENT }),
  };
  // Paredes de revolução são superfícies abertas: sem DoubleSide o interior some.
  [M.stone, M.concrete, M.stoneDark].forEach((m) => (m.side = THREE.DoubleSide));

  const root = new THREE.Group();
  root.name = 'aquasense_poco_criadouro';
  const mesh = (geo, mat, name) => {
    const m = new THREE.Mesh(geo, mat);
    m.name = name;
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };
  const lathe = (pts, seg = 56) =>
    new THREE.LatheGeometry(
      pts.map((p) => new THREE.Vector2(p[0], p[1])),
      seg,
    );

  const GY = 0.18;
  const plot = mesh(new THREE.BoxGeometry(6.4, GY, 4.4), M.earth, 'terreno');
  plot.position.y = GY / 2;
  root.add(plot);

  /* ------------------------------------------------------------------ poço */
  const well = new THREE.Group();
  well.name = 'poco';
  well.position.set(-1.85, GY, 0);
  const WH = 0.9;
  const RO = 0.72;
  const RI = 0.56;
  well.add(
    mesh(
      lathe([
        [RI, 0],
        [RO, 0],
        [RO, WH - 0.06],
        [RO + 0.03, WH - 0.03],
        [RO + 0.03, WH],
        [RI, WH],
        [RI, 0],
      ]),
      M.stone,
      'poco_parede',
    ),
  );

  const stoneGeo = new THREE.BoxGeometry(0.17, 0.14, 0.06);
  for (let row = 0; row < 5; row++) {
    const n = 20;
    const y = 0.09 + row * 0.16;
    if (y > WH - 0.12) break;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + (row % 2 ? Math.PI / n : 0);
      const s = mesh(stoneGeo, row % 2 ? M.stone : M.stoneDark, 'poco_pedra');
      s.position.set(Math.cos(a) * (RO + 0.01), y, Math.sin(a) * (RO + 0.01));
      s.rotation.y = -a;
      s.scale.set(0.8 + ((i * 7) % 5) / 12, 0.85 + ((i * 3) % 4) / 14, 1);
      well.add(s);
    }
  }
  const wellWater = mesh(new THREE.CircleGeometry(RI - 0.01, 48), M.water, 'poco_agua');
  wellWater.rotation.x = -Math.PI / 2;
  wellWater.position.y = 0.42;
  well.add(wellWater);
  const shaft = mesh(
    new THREE.CylinderGeometry(RI - 0.01, RI - 0.01, 0.44, 48, 1, true),
    M.stoneDark,
    'poco_interior',
  );
  shaft.position.y = 0.2;
  well.add(shaft);

  for (const z of [-0.62, 0.62]) {
    const post = mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.95, 16), M.wood, 'poco_pilar');
    post.position.set(0, WH - 0.1 + 0.95 / 2, z);
    well.add(post);
  }
  const ridge = mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.5, 12), M.wood, 'poco_cumeeira');
  ridge.rotation.x = Math.PI / 2;
  ridge.position.y = WH + 0.98;
  well.add(ridge);
  for (const s of [-1, 1]) {
    const roof = mesh(new THREE.BoxGeometry(1.05, 0.05, 1.75), M.tile, 'poco_telhado');
    roof.rotation.z = -s * 0.62;
    roof.position.set(s * 0.427, WH + 0.98 - 0.305, 0);
    well.add(roof);
  }
  const axle = mesh(new THREE.CylinderGeometry(0.028, 0.028, 1.3, 12), M.metal, 'poco_eixo');
  axle.rotation.x = Math.PI / 2;
  axle.position.y = WH + 0.6;
  well.add(axle);
  const drum = mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.5, 32), M.wood, 'poco_cilindro');
  drum.rotation.x = Math.PI / 2;
  drum.position.y = WH + 0.6;
  well.add(drum);
  const crankArm = mesh(new THREE.BoxGeometry(0.05, 0.26, 0.04), M.metal, 'poco_manivela');
  crankArm.position.set(0, WH + 0.72, 0.7);
  well.add(crankArm);
  const grip = mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.18, 12), M.wood, 'poco_punho');
  grip.rotation.x = Math.PI / 2;
  grip.position.set(0, WH + 0.84, 0.78);
  well.add(grip);
  const rope = mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.6, 8), M.wood, 'poco_corda');
  rope.position.set(0.11, WH + 0.3, 0);
  well.add(rope);
  const bucket = mesh(
    lathe(
      [
        [0, 0],
        [0.14, 0],
        [0.16, 0.24],
        [0.145, 0.245],
        [0.125, 0.02],
        [0, 0.02],
      ],
      32,
    ),
    M.metal,
    'balde',
  );
  bucket.position.set(0.11, WH + 0.02, 0);
  well.add(bucket);
  const handle = mesh(new THREE.TorusGeometry(0.15, 0.012, 8, 24, Math.PI), M.metal, 'balde_alca');
  handle.rotation.y = Math.PI / 2;
  handle.position.set(0.11, WH + 0.26, 0);
  well.add(handle);

  // Sonda do poço: cabo descendo pela parede e corpo do sensor submerso
  const cable = mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.62, 6), M.accent, 'sonda_cabo');
  cable.position.set(-0.34, WH - 0.31, 0.2);
  well.add(cable);
  const probe = mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.3, 16),
    M.accent,
    'sonda_ph_turbidez',
  );
  probe.position.set(-0.34, 0.44, 0.2);
  well.add(probe);
  root.add(well);

  /* ------------------------------------------------------------- criadouro */
  const pond = new THREE.Group();
  pond.name = 'criadouro';
  pond.position.set(1.35, GY, 0);
  const TR = 1.42;
  const TW = 0.16;
  const TH = 0.62;
  pond.add(
    mesh(
      lathe([
        [TR - TW, 0],
        [TR, 0],
        [TR, TH],
        [TR - TW, TH],
        [TR - TW, 0],
      ]),
      M.concrete,
      'tanque_parede',
    ),
  );
  const floorDisc = mesh(new THREE.CircleGeometry(TR - TW + 0.005, 56), M.concrete, 'tanque_fundo');
  floorDisc.rotation.x = -Math.PI / 2;
  floorDisc.position.y = 0.02;
  pond.add(floorDisc);
  const capRing = mesh(
    new THREE.TorusGeometry(TR - TW / 2, TW / 2, 10, 64),
    M.concrete,
    'tanque_borda',
  );
  capRing.rotation.x = Math.PI / 2;
  capRing.position.y = TH;
  pond.add(capRing);
  const pondWater = mesh(new THREE.CircleGeometry(TR - TW - 0.005, 56), M.water, 'tanque_agua');
  pondWater.rotation.x = -Math.PI / 2;
  pondWater.position.y = TH - 0.12;
  pond.add(pondWater);
  const standpipe = mesh(new THREE.CylinderGeometry(0.075, 0.09, TH - 0.06, 24), M.metal, 'monge');
  standpipe.position.y = (TH - 0.06) / 2 + 0.02;
  pond.add(standpipe);
  const outlet = mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.9, 20), M.metal, 'saida_agua');
  outlet.rotation.z = Math.PI / 2;
  outlet.position.set(TR - 0.35, 0.1, 0);
  pond.add(outlet);

  const bodyGeo = new THREE.SphereGeometry(0.1, 20, 14);
  const tailGeo = new THREE.ConeGeometry(0.055, 0.11, 12);
  const finGeo = new THREE.ConeGeometry(0.035, 0.09, 8);
  const fishAt = (r, a, y, sc, rot) => {
    const g = new THREE.Group();
    g.name = 'peixe';
    const b = mesh(bodyGeo, M.fish, 'peixe_corpo');
    b.scale.set(1.5, 0.85, 0.5);
    g.add(b);
    const t = mesh(tailGeo, M.fish, 'peixe_cauda');
    t.rotation.z = Math.PI / 2;
    t.scale.set(1, 1, 0.35);
    t.position.x = -0.19;
    g.add(t);
    const f = mesh(finGeo, M.fish, 'peixe_nadadeira');
    f.rotation.x = -Math.PI / 2;
    f.position.set(0.02, 0.06, 0);
    g.add(f);
    g.scale.setScalar(sc);
    g.rotation.y = rot;
    g.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    return g;
  };
  // [raio, ângulo inicial, profundidade, escala, rotação]
  const fish = [
    [0.55, 0.4, 0.32, 1.25, 1.2],
    [0.9, 2.1, 0.24, 1.05, 2.6],
    [0.45, 3.6, 0.4, 1.1, 4.0],
    [1.0, 4.6, 0.3, 1.3, 5.2],
    [0.72, 5.6, 0.2, 1.0, 0.4],
  ].map((f) => {
    const g = fishAt(...f);
    pond.add(g);
    return { g, r: f[0], a: f[1], y: f[2], sp: 0.18 + (f[3] - 1) * 0.5 };
  });

  // Sonda do tanque: haste na borda, braço em balanço e corpo na água
  const mast = mesh(new THREE.BoxGeometry(0.05, 0.5, 0.05), M.accent, 'sonda_haste');
  mast.position.set(-TR + TW / 2, TH + 0.25, 0);
  pond.add(mast);
  const arm = mesh(new THREE.BoxGeometry(0.42, 0.05, 0.05), M.accent, 'sonda_braco');
  arm.position.set(-TR + TW / 2 + 0.21, TH + 0.48, 0);
  pond.add(arm);
  const probe2 = mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.34, 16), M.accent, 'sonda_turbidez');
  probe2.position.set(-TR + TW / 2 + 0.4, TH - 0.2, 0);
  pond.add(probe2);
  root.add(pond);

  /* ------------------------------------------------------------- tubulação */
  const pipe = new THREE.Group();
  pipe.name = 'tubulacao';
  const riser = mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.0, 16), M.metal, 'tubo_subida');
  riser.position.set(-1.85 + RO + 0.12, GY + 0.62, 0.28);
  pipe.add(riser);
  const run = mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.55, 16), M.metal, 'tubo_horizontal');
  run.rotation.z = Math.PI / 2;
  run.position.set(-0.35, GY + 1.06, 0.28);
  pipe.add(run);
  const drop = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.75, 16), M.metal, 'tubo_descida');
  drop.position.set(0.92, GY + 0.85, 0.28);
  pipe.add(drop);
  const spout = mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.3, 16), M.metal, 'bica');
  spout.rotation.z = -0.7;
  spout.position.set(1.03, GY + 0.55, 0.28);
  pipe.add(spout);
  root.add(pipe);

  /* --------------------------- gateway: poste, caixa de controle e antena */
  const gw = new THREE.Group();
  gw.name = 'gateway';
  gw.position.set(-0.25, GY, -1.55);
  const pole = mesh(new THREE.CylinderGeometry(0.045, 0.05, 1.7, 14), M.wood, 'poste');
  pole.position.y = 0.85;
  gw.add(pole);
  const boxMesh = mesh(new THREE.BoxGeometry(0.34, 0.42, 0.16), M.accent, 'caixa_controle');
  boxMesh.position.set(0, 1.2, 0.11);
  gw.add(boxMesh);
  const solar = mesh(new THREE.BoxGeometry(0.5, 0.03, 0.3), M.stoneDark, 'painel_solar');
  solar.rotation.x = -0.35;
  solar.position.set(0, 1.72, 0.06);
  gw.add(solar);
  const antenna = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.45, 8), M.metal, 'antena');
  antenna.position.set(0.14, 1.85, 0);
  gw.add(antenna);
  const beacon = mesh(new THREE.SphereGeometry(0.035, 16, 12), M.accentGlow, 'sinal');
  beacon.position.set(0.14, 2.1, 0);
  gw.add(beacon);
  root.add(gw);

  const bench = mesh(new THREE.BoxGeometry(0.9, 0.34, 0.42), M.concrete, 'mureta');
  bench.position.set(0.55, GY + 0.17, -1.5);
  root.add(bench);

  // Recentra a maquete na origem para que o enquadramento não dependa dela
  const box3 = new THREE.Box3().setFromObject(root);
  const c = box3.getCenter(new THREE.Vector3());
  root.position.set(-c.x, -box3.min.y, -c.z);
  root.updateWorldMatrix(true, true);

  return {
    root,
    fish,
    beacon,
    plot,
    materials: Object.values(M),
    view: { look: new THREE.Vector3(0, 0.7, 0), pos: new THREE.Vector3(6.8, 4.7, 8.2) },
  };
}

/**
 * Monta a cena dentro de `host` e devolve `{ dispose }`.
 *
 * @param {HTMLElement} host contêiner posicionado; o canvas o preenche
 * @param {{ autorotate?: boolean, floating?: boolean }} options
 *   `floating` esconde o terreno e faz a maquete flutuar — é o modo do herói,
 *   onde a cena sangra para fora da seção e um chão sólido apareceria cortado.
 */
export function createAquaStage(host, { autorotate = true, floating = true } = {}) {
  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  Object.assign(renderer.domElement.style, { display: 'block', width: '100%', height: '100%' });
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd6dee4, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(4, 6.5, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const shadowCam = key.shadow.camera;
  shadowCam.left = -6;
  shadowCam.right = 6;
  shadowCam.top = 6;
  shadowCam.bottom = -6;
  shadowCam.near = 0.5;
  shadowCam.far = 25;
  scene.add(key);
  scene.add(new THREE.DirectionalLight(0xffffff, 0.35).translateX(-5).translateY(3).translateZ(-4));

  const built = buildScene();
  const pivot = new THREE.Group();
  pivot.add(built.root);
  scene.add(pivot);

  let ground = null;
  if (floating) {
    built.plot.visible = false;
    built.root.position.y -= 0.12;
  } else {
    ground = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.ShadowMaterial({ opacity: 0.18 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
  }

  const controls = new Orbit(camera, renderer.domElement);
  controls.autoRotateSpeed = 0.5;
  camera.position.copy(built.view.pos);
  controls.target.copy(built.view.look);

  // Assim que a pessoa arrasta ou dá zoom a câmera deixa de ser conduzida: nem
  // o giro automático nem o retorno ao enquadramento inicial voltam a agir.
  let userHold = false;
  controls.addEventListener('start', () => {
    userHold = true;
  });

  const resize = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  // Fora da viewport não há o que ver: o laço continua, mas sem desenhar.
  let visible = true;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(host);

  const clock = new THREE.Clock();
  let raf = 0;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime();
    if (!reduced) {
      built.fish.forEach((f) => {
        const a = f.a + t * f.sp;
        f.g.position.set(Math.cos(a) * f.r, f.y + Math.sin(t * 1.4 + f.a) * 0.02, Math.sin(a) * f.r);
        f.g.rotation.y = -a + Math.PI / 2;
      });
      built.beacon.scale.setScalar(1 + Math.sin(t * 3) * 0.35);
      if (floating) {
        pivot.position.y = 0.12 + Math.sin(t * 0.7) * 0.07;
        pivot.rotation.z = Math.sin(t * 0.45) * 0.012;
      }
    }
    controls.autoRotate = autorotate && !reduced && !userHold;
    if (!userHold) {
      camera.position.lerp(built.view.pos, 0.045);
      controls.target.lerp(built.view.look, 0.06);
    }
    controls.update();
    renderer.render(scene, camera);
  };
  tick();

  return {
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
      });
      built.materials.forEach((m) => m.dispose());
      if (ground) ground.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
