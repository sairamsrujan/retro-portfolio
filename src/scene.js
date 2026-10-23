import * as THREE from 'three';
import { assetUrl } from './paths.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SAOPass } from 'three/addons/postprocessing/SAOPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

// Scene assets: Joey de Ruiter / 0xJ0EY, Portfolio-next. See ATTRIBUTION.md.
export async function createComputerScene(desktop, profile) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0xfefefe);
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, .1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  document.querySelector('#scene').appendChild(renderer.domElement);
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene,camera));
  const sao = new SAOPass(scene,camera);
  sao.resolution.set(128,128); sao.params.saoBias=100; sao.params.saoIntensity=.0003; sao.params.saoBlur=false; composer.addPass(sao);
  const css = new CSS3DRenderer(); document.querySelector('#screen-layer').appendChild(css.domElement);
  const cssScene = new THREE.Scene();
  const loader = new GLTFLoader(), textures = new THREE.TextureLoader();
  const path = assetUrl('reference/models/');
  async function material(name) {
    const map = await textures.loadAsync(path + name + '.jpg'); map.flipY = false;
    return new THREE.MeshBasicMaterial({ map, side: THREE.DoubleSide });
  }
  const labelCanvas=document.createElement('canvas');labelCanvas.width=labelCanvas.height=1024;
  const label=labelCanvas.getContext('2d');label.fillStyle='#c6c7bc';label.fillRect(0,0,1024,1024);label.fillStyle='#181818';label.textAlign='center';label.font='bold 110px serif';label.fillText(profile.shortName.toUpperCase(),512,200,930);label.font='64px serif';label.fillText('Personal workstation',512,310);
  const labelMap=new THREE.CanvasTexture(labelCanvas);labelMap.flipY=false;
  const models = ['Desk', 'SmoothFloor', 'Plant', 'Hydra', 'Mouse', 'Keyboard', 'Monitor', 'Cables'];
  let display;
  await Promise.all(models.map(async name => {
    const model = await loader.loadAsync(path + name + (name === 'Cables' ? '.gltf' : '.glb'));
    let materials;
    if (name === 'Keyboard') materials = { Case: await material('KeyboardCase'), key: await material('KeyboardKeyCaps') };
    else if (name === 'Monitor') materials = { Monitor: await material('Monitor'), Computer: await material('Computer'), NamePlate: new THREE.MeshBasicMaterial({map:labelMap}) };
    else materials = { all: name === 'Cables' ? new THREE.MeshBasicMaterial({color:0x303030}) : await material(name) };
    model.scene.traverse(node => {
      if (!node.isMesh) return;
      if (node.name === 'Display') { display = node; node.visible = false; return; }
      node.material = materials.all || materials[node.name] || materials.key;
    });
    scene.add(model.scene);
  }));
  display.geometry.computeBoundingBox();
  const box = display.geometry.boundingBox, margin = .1;
  const width = box.max.x - box.min.x + margin;
  const height = width * 980 / 1280, depth = box.max.z - box.min.z;
  const screen = new CSS3DObject(desktop);
  screen.position.copy(display.position).add(new THREE.Vector3(box.min.x - margin/2 + width/2, box.min.y - margin/2 + height/2, box.min.z + depth/2 + .005));
  screen.scale.set(width/1280, Math.hypot(depth,height)/980, 1);
  screen.rotation.x = Math.atan(height/depth) - Math.PI/2;
  cssScene.add(screen);
  const center = box.getCenter(new THREE.Vector3()).add(display.position);
  let zoom = 0, targetZoom = 0, direct = false, last = 0, phase = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize() { camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);css.setSize(innerWidth,innerHeight); }
  resize(); window.addEventListener('resize',resize);
  function frame(t) {
    requestAnimationFrame(frame);
    const dt=Math.min((t-last)/1000,.05);last=t;
    if (direct || document.hidden) return;
    if (!reduced) phase+=dt*.16;
    zoom = reduced ? targetZoom : THREE.MathUtils.damp(zoom,targetZoom,6,dt);
    const theta = Math.sin(phase)*Math.PI/6;
    const introPosition = new THREE.Vector3().setFromSphericalCoords(10,1,theta).add(new THREE.Vector3(0,6.8,0));
    const distance = Math.tan(THREE.MathUtils.degToRad(37.5))*((box.max.x-box.min.x)/2+2.4/camera.aspect);
    const end = new THREE.Vector3().setFromSphericalCoords(distance,Math.atan2(box.max.y-box.min.y,depth),0).add(center);
    camera.position.copy(introPosition).lerp(end,zoom);
    camera.lookAt(new THREE.Vector3(0,6.8,0).lerp(center,zoom));
    camera.updateMatrixWorld();composer.render();css.render(cssScene,camera);
  }
  requestAnimationFrame(frame);
  return { enter(){targetZoom=1;},reset(){targetZoom=0;},setDirect(v){direct=v;} };
}
