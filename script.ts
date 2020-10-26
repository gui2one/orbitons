"use_strinct";
// console.log("hello from typescript !!!!");
import "regenerator-runtime/runtime";
import * as THREE from "three";
import Planet from "./modules/Planet";

import UniverseParams from "./modules/UniverseParams";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import DebugWindow from "./modules/DebugWindow";

import SatellitesData from "./modules/SatellitesData";

// starlink data  : https://celestrak.com/NORAD/elements/starlink.txt

let clock = new THREE.Clock(true);
let satellites_data = new SatellitesData();

satellites_data.loadFromTextFile("tle_data/spacex.txt").then((response) => {
  //
  console.log("loaded satellites data");
});
let renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
  antialias: true,
});
let debugWindow = new DebugWindow();

let canvas = renderer.domElement;
let container = document.getElementById("orbitons-container");

document.body.appendChild(canvas);
let universe = new UniverseParams();
let planet = new Planet("Earth");
let scene: THREE.Scene = new THREE.Scene();
planet.body.makeEarth();
universe.scale = 1.0 / planet.body.radius;
planet.scale.set(universe.scale, universe.scale, universe.scale);
scene.add(planet);

let camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100.0
);

camera.position.setZ(3);

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

let ambient = new THREE.AmbientLight("white", 0.2);
scene.add(ambient);

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

const tle = `STARLINK-72             
1 44263U 19029AE  20289.47516335  .12398314  12643-4  16439-3 0  9992
2 44263  52.9820 318.7786 0003330 292.8532  67.5533 16.49183723 78173`;

// console.log(getLatLngObj(tle));
let sat_infos = [];
let tle_data = "";
let tle_array: string[] = [];

function collect_tles_data(data: string): string[] {
  let array = data.split("\n");
  // console.log(array);
  let ret = [];
  for (let i = 0; i < array.length; i += 3) {
    let assemble = ``;
    assemble += array[i] + "\n";
    assemble += array[i + 1] + "\n";
    assemble += array[i + 2];
    // console.log(assemble);
    try {
      // let infos = getSatelliteInfo(assemble, Date.now(), 0.0, 0.0, 0.0);
      ret.push(assemble);
    } catch (err) {
      // console.error(err);
    }
  }

  return ret;
}

function calcPosFromLatLonRad(radius, lat, lon) {
  var spherical = new THREE.Spherical(
    radius,
    THREE.MathUtils.degToRad(90 - lat),
    THREE.MathUtils.degToRad(lon + 90)
  );

  var vector = new THREE.Vector3();
  vector.setFromSpherical(spherical);

  // console.log(vector.x, vector.y, vector.z);
  return vector;
}

/**
 * Adds time to a date. Modelled after MySQL DATE_ADD function.
 * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
 * https://stackoverflow.com/a/1214753/18511
 *
 * @param date  Date to start with
 * @param interval  One of: year, quarter, month, week, day, hour, minute, second
 * @param units  Number of units of the given interval to add.
 */
function dateAdd(date, interval, units) {
  if (!(date instanceof Date)) return undefined;
  var ret = new Date(date); //don't change original date
  var checkRollover = function () {
    if (ret.getDate() != date.getDate()) ret.setDate(0);
  };
  switch (String(interval).toLowerCase()) {
    case "year":
      ret.setFullYear(ret.getFullYear() + units);
      checkRollover();
      break;
    case "quarter":
      ret.setMonth(ret.getMonth() + 3 * units);
      checkRollover();
      break;
    case "month":
      ret.setMonth(ret.getMonth() + units);
      checkRollover();
      break;
    case "week":
      ret.setDate(ret.getDate() + 7 * units);
      break;
    case "day":
      ret.setDate(ret.getDate() + units);
      break;
    case "hour":
      ret.setTime(ret.getTime() + units * 3600000);
      break;
    case "minute":
      ret.setTime(ret.getTime() + units * 60000);
      break;
    case "second":
      ret.setTime(ret.getTime() + units * 1000);
      break;
    default:
      ret = undefined;
      break;
  }
  return ret;
}
let sat_points: THREE.Points = new THREE.Points(new THREE.Geometry());

//test gps
let test_coords = calcPosFromLatLonRad(
  (planet.body.radius + 500) * universe.scale,
  48.099403,
  -1.698596
);
let sphere = new THREE.Mesh();
sphere.geometry = new THREE.SphereGeometry(0.01, 30, 30);
// console.log(test_coords);
sphere.position.set(test_coords.x, test_coords.y, test_coords.z);

scene.add(sphere);

let refresh_counter = 0;

function animate() {
  let delta_t = clock.getDelta();

  if (refresh_counter > 1.0) {
    refresh_counter = 0;
  }

  refresh_counter += delta_t;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);

  renderer.renderLists.dispose();
}

animate();
