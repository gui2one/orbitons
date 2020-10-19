console.log("hello from typescript");

import * as THREE from "three";
import Planet from "./modules/Planet";

let planet = new Planet("Earth");
// planet.position.setY(-1);
let scene: THREE.Scene = new THREE.Scene();
let camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100.0
);

let dir_light = new THREE.DirectionalLight("white", 1.0);
dir_light.position.set(-10, 0, 0);
dir_light.target = planet;
// dir_light.
let dir_light_helper = new THREE.DirectionalLightHelper(
  dir_light,
  2,
  new THREE.Color(255, 255, 0)
);

dir_light_helper.update();
scene.add(dir_light);
// scene.add(dir_light.target);
// scene.add(dir_light_helper);
camera.position.setZ(5);

let clock = new THREE.Clock(true);

let renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
  antialias: true,
});
let canvas = renderer.domElement;
let container = document.getElementById("orbitons-container");

document.body.appendChild(canvas);

const on_resize = (event) => {
  //   console.log(window.innerWidth);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
window.addEventListener("resize", on_resize);

let event: Event = new Event("resize");
window.dispatchEvent(event);

scene.add(planet);

function animate() {
  planet.rotateY(0.1 * clock.getDelta());
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
