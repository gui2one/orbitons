console.log("hello from typescript");
import "regenerator-runtime/runtime";
import * as THREE from "three";
import Planet from "./modules/Planet";

import UniverseParams from "./modules/UniverseParams";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import DebugWindow from "./modules/DebugWindow";

import { getLatLngObj, getSatelliteInfo } from "tle.js";
// starlink data  : https://celestrak.com/NORAD/elements/starlink.txt

let clock = new THREE.Clock(true);
const tle = `STARLINK-24             
1 44238U 19029D   20292.72463098  .00002009  00000-0  12687-3 0  9994
2 44238  52.9986   9.2250 0001335 106.3079 253.8059 15.13696832 77705`;

console.log(getLatLngObj(tle));

let form = new FormData();

form.append("'identity", "guillaume.rouault.fx@gmail.com");
form.append("'password", "BqGV6BiQ!9dn5Dt");

fetch("https://www.space-track.org/ajaxauth/login", {
  method: "POST",
  body: form,
  mode: "no-cors",
})
  .then((response) => response.json())
  .then((json) => console.log(json));
console.log(getSatelliteInfo(tle, Date.now()));
let renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
  antialias: true,
});
let debugWindow = new DebugWindow();

let canvas = renderer.domElement;
let container = document.getElementById("orbitons-container");

document.body.appendChild(canvas);
let universe = new UniverseParams();
let planet = new Planet("Earth");
planet.body.makeEarth();
universe.scale = 1.0 / planet.body.radius;
planet.scale.set(universe.scale, universe.scale, universe.scale);

let scene: THREE.Scene = new THREE.Scene();
let camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100.0
);

camera.position.setZ(15);

let orbitControls = new OrbitControls(camera, renderer.domElement);

let dir_light = new THREE.DirectionalLight("white", 1.0);
dir_light.position.set(-100, 0, 6);
dir_light.target = planet;

let dir_light_helper = new THREE.DirectionalLightHelper(
  dir_light,
  2,
  new THREE.Color(255, 255, 0)
);

dir_light_helper.update();
scene.add(dir_light);

const on_resize = (event) => {
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
  debugWindow.update({
    "Camera altitude ":
      (camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) * 1.0) /
      universe.scale,
    "earth radius": planet.body.radius,
    "earth radius 2": planet.body.radius,
  });
  planet.rotateY(0.3 * clock.getDelta());
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
