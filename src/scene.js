import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

// All scene assets are built here from geometry. No borrowed models or textures.
export function createComputerScene(desktop) {
  const container = document.querySelector('#scene');
  const cssContainer = document.querySelector('#screen-layer');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#d9dbd8');
  scene.fog = new THREE.Fog('#d9dbd8', 22, 48);
  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, .1, 70);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  container.appendChild(renderer.domElement);
  const cssRenderer = new CSS3DRenderer();
  cssContainer.appendChild(cssRenderer.domElement);
  const cssScene = new THREE.Scene();
  const screen = new CSS3DObject(desktop);
  screen.position.set(0, 3.18, .535);
  screen.scale.setScalar(.00325);
  cssScene.add(screen);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8d9188, 2.5));
  const sun = new THREE.DirectionalLight(0xfffbea, 4.5);
  sun.position.set(-5, 12, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: .1, far: 40 });
  sun.shadow.normalBias = .035;
  sun.shadow.bias = -.0001;
  sun.shadow.radius = 4;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xffffff, 1.2);
  fill.position.set(6, 5, -4); scene.add(fill);

  const ivory = new THREE.MeshStandardMaterial({ color: '#c7c4a6', roughness: .8 });
  const lightIvory = new THREE.MeshStandardMaterial({ color: '#dedbc2', roughness: .75 });
  const dark = new THREE.MeshStandardMaterial({ color: '#292e2b', roughness: .85 });
  const keyMaterial = new THREE.MeshStandardMaterial({ color: '#c1c2b3', roughness: .8 });
  const grayKey = new THREE.MeshStandardMaterial({ color: '#8c958e', roughness: .8 });
  const tableMat = new THREE.MeshStandardMaterial({ color: '#c3c7c4', roughness: .92 });

  function box(w, h, d, x, y, z, material, parent = scene) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true;
    parent.add(mesh); return mesh;
  }
  function roundedBox(w, h, d, x, y, z, mat, bevel = .08, parent = scene) {
    const shape = new THREE.Shape();
    const a = -w / 2 + bevel, b = -h / 2 + bevel;
    shape.moveTo(a, b); shape.lineTo(a + w - bevel * 2, b);
    shape.lineTo(a + w - bevel * 2, b + h - bevel * 2);
    shape.lineTo(a, b + h - bevel * 2); shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: d - bevel * 2, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: bevel, bevelThickness: bevel });
    geo.translate(0, 0, -d / 2 + bevel);
    const mesh = new THREE.Mesh(geo, mat); mesh.position.set(x, y, z);
    mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  function cable(points, radius = .025) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, radius, 6, false), dark);
    mesh.castShadow = true; scene.add(mesh);
  }

  box(12.5, .26, 8, 0, .64, .9, tableMat);
  box(.25, 2, .25, -5.5, -.47, 3.6, tableMat);
  box(.25, 2, .25, 5.5, -.47, 3.6, tableMat);
  const floor = box(200, .15, 200, 0, -1.5, 0, new THREE.MeshStandardMaterial({ color: '#e1e2df', roughness: 1 }));
  floor.castShadow = false;
  roundedBox(3.85, .69, 2.55, 0, 1.13, -.15, ivory);
  box(3.74, .025, 2.42, 0, 1.28, -.13, lightIvory);
  for (let i = 0; i < 4; i++) box(1.23, .026, .018, -.98, 1.08 - i * .07, 1.136, dark);
  box(.77, .18, .025, 1.03, 1.15, 1.14, grayKey);
  box(.61, .032, .015, 1.03, 1.17, 1.16, dark);
  box(.14, .10, .025, 1.54, 1.14, 1.14, lightIvory);
  box(.035, .035, .02, .49, 1.14, 1.15, new THREE.MeshStandardMaterial({ color: '#8bae62', emissive: '#76b443', emissiveIntensity: 1 }));
  roundedBox(1.25, .23, 1.08, 0, 1.59, -.3, ivory, .05);
  roundedBox(4.08, 3.25, 1.55, 0, 3.18, -.35, ivory, .11);
  // Layered beveled bezel and recessed screen.
  box(3.75, 2.87, .03, 0, 3.18, .445, lightIvory);
  box(3.52, 2.66, .025, 0, 3.18, .48, dark);
  box(3.35, 2.51, .025, 0, 3.18, .505, new THREE.MeshBasicMaterial({ color: '#55a7aa' }));
  box(.26, .045, .028, -1.48, 1.77, .46, grayKey);
  box(.035, .035, .03, 1.53, 1.77, .46, new THREE.MeshStandardMaterial({ color: '#5a9b4f', emissive: '#568b46' }));

  const keyboard = new THREE.Group(); keyboard.position.set(-.23, .9, 2.66); keyboard.rotation.y = -.08; scene.add(keyboard);
  roundedBox(3.63, .19, 1.28, 0, 0, 0, ivory, .06, keyboard);
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 14; col++) {
      if (row === 4 && col > 2 && col < 9) continue;
      const key = box(.178, .083, .166, -1.59 + col * .226, .13, -.44 + row * .211, (col === 0 || col > 11 || row === 0) ? grayKey : keyMaterial, keyboard);
      if (row < 4 && col > 0 && col < 12) box(.052, .002, .008, key.position.x -.025, .174, key.position.z -.025, dark, keyboard);
    }
  }
  box(1.28, .08, .16, -.33, .13, .402, keyMaterial, keyboard);
  roundedBox(.5, .21, .77, 2.63, .92, 2.68, lightIvory, .07);
  box(.012, .016, .32, 2.63, 1.035, 2.48, grayKey);
  cable([[2.63, .96, 2.33], [2.82, .85, 1.84], [2.57, .82, .98], [2.07, .83, -.51], [1.8, 1.04, -.8]]);
  cable([[-1.35, .85, 2.11], [-2.1, .85, 1.85], [-2.2, .85, 1], [-1.7, 1, .6]]);

  function plant(x, z, size, variant = 0) {
    const group = new THREE.Group(); group.position.set(x, .77, z); group.scale.setScalar(size); scene.add(group);
    const potMat = new THREE.MeshStandardMaterial({ color: variant ? '#7e8877' : '#a0a18c', roughness: 1, flatShading: true });
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(.32, .25, .47, 7), potMat); pot.position.y = .235; pot.castShadow = true; group.add(pot);
    const soil = new THREE.Mesh(new THREE.CircleGeometry(.29, 7), new THREE.MeshStandardMaterial({ color: '#434a32' })); soil.rotation.x = -Math.PI / 2; soil.position.y = .474; group.add(soil);
    for (let i = 0; i < 9; i++) {
      const angle = i * 2.4, height = .62 + (i % 3) * .19;
      const material = new THREE.MeshStandardMaterial({ color: ['#627849', '#3d612f', '#7a8b48'][i % 3], flatShading: true, roughness: .9, side: THREE.DoubleSide });
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(.018, .025, height, 4), material);
      stem.position.set(Math.cos(angle) * .09, .45 + height / 2, Math.sin(angle) * .09); stem.rotation.z = Math.sin(angle) * .23; group.add(stem);
      for (let j = 0; j < 2; j++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(.11, .48, 3), material);
        leaf.position.set(Math.cos(angle + j) * .19, .66 + j * .3, Math.sin(angle + j) * .19);
        leaf.rotation.set(Math.sin(angle) * .8, angle, Math.cos(angle) * .8); leaf.castShadow = true; group.add(leaf);
      }
    }
  }
  plant(-4.1, .1, 1.05); plant(4.1, .6, .9, 1);

  let zoom = 0, targetZoom = 0, running = true, direct = false, raf, dirty = true;
  const look = new THREE.Vector3();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize() {
    dirty = true;
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight); cssRenderer.setSize(innerWidth, innerHeight);
  }
  window.addEventListener('resize', resize); resize();
  let previous = 0;
  function animate(t) {
    if (!running) return;
    raf = requestAnimationFrame(animate);
    if (document.hidden || direct) return;
    const dt = Math.min((t - previous) / 1000, .05); previous = t;
    if (!dirty && Math.abs(zoom - targetZoom) < .0001) return;
    zoom = reduced ? targetZoom : THREE.MathUtils.damp(zoom, targetZoom, 4.5, dt);
    if (Math.abs(zoom - targetZoom) < .0001) zoom = targetZoom;
    const portrait = camera.aspect < 1;
    const distance = portrait ? 19 : 13.4;
    const endDistance = portrait ? 8.4 : 5.3;
    camera.position.set(THREE.MathUtils.lerp(2.1, 0, zoom), THREE.MathUtils.lerp(7.6, 3.18, zoom), THREE.MathUtils.lerp(distance, endDistance, zoom));
    look.set(0, THREE.MathUtils.lerp(2.0, 3.18, zoom), THREE.MathUtils.lerp(.4, .535, zoom));
    camera.lookAt(look); camera.updateMatrixWorld();
    renderer.render(scene, camera); cssRenderer.render(cssScene, camera);
    dirty = false;
  }
  raf = requestAnimationFrame(animate);
  document.addEventListener('visibilitychange', () => { previous = performance.now(); });
  return {
    enter() { targetZoom = 1; },
    reset() { targetZoom = 0; },
    setDirect(value) { direct = value; if (!value) { previous = performance.now(); dirty = true; } },
    destroy() { running = false; cancelAnimationFrame(raf); renderer.dispose(); window.removeEventListener('resize', resize); },
  };
}
