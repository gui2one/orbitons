"use_strinct";
// console.log("hello from typescript !!!!");
import "regenerator-runtime/runtime";
import * as THREE from "three";
import Planet from "./modules/Planet";

import UniverseParams from "./modules/UniverseParams";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import DebugWindow from "./modules/DebugWindow";

import SatellitesData from "./modules/SatellitesData";
import SatellitesPoints from "./modules/SatellitesPoints";
import SceneBackground from "./modules/SceneBackground";
import { time } from "console";
import SatellitePath from "./modules/SatellitePath";

// Can also be 'vsop87/dist/vsop87a'.
const vsop87c = require("vsop87/dist/vsop87c");

// Get an object with the (x,y,z) coordinates of each planet.

// const coords = vsop87c(2451545);
// console.log(coords);

// let UTC = Date.UTC(1970, 0, 1, 0, 0, 0, 0);
// console.log(UTC / 1000 / 60);

// starlink data  : https://celestrak.com/NORAD/elements/starlink.txt

let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let camera: THREE.PerspectiveCamera;
let orbitControls: OrbitControls;

let dir_light: THREE.DirectionalLight;
let dir_light_helper: THREE.DirectionalLightHelper;
let ambient: THREE.AmbientLight;

let universe: UniverseParams;
let planet: Planet;

let clock: THREE.Clock;
let simulation_time: number = 0;
let time_offset_mult: number = 0;
let bg: SceneBackground;

let selected_sat_object: THREE.Mesh;
let selected_sat_index: number;
let sat_path: SatellitePath;

//init THREEJS scene and renderer
scene = new THREE.Scene();
renderer = new THREE.WebGLRenderer({
  antialias: true,
});
clock = new THREE.Clock(true);
bg = new SceneBackground(scene, renderer);

let canvas = renderer.domElement;

document.body.appendChild(canvas);

camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100.0);

camera.position.setZ(3);

orbitControls = new OrbitControls(camera, renderer.domElement);
// orbitControls.enabled = false;

/*
 * init custom stuff
 */

planet = new Planet("Earth");
scene.add(planet);
planet.body.makeEarth();

universe = new UniverseParams();
//set reference scale to "earth_radius = 1 unit in 3d space"
universe.scale = 1.0 / planet.body.radius;

planet.scale.set(universe.scale, universe.scale, universe.scale);

selected_sat_object = new THREE.Mesh();
selected_sat_object.geometry = new THREE.SphereGeometry(0.01);
selected_sat_object.material = new THREE.MeshBasicMaterial({ color: "red" });
scene.add(selected_sat_object);

selected_sat_index = 0;

let debugWindow = new DebugWindow();

dir_light = new THREE.DirectionalLight("white", 1.0);
dir_light.position.set(-100, 0, 6);
dir_light.target = planet;

dir_light_helper = new THREE.DirectionalLightHelper(dir_light, 2, new THREE.Color(255, 255, 0));

dir_light_helper.update();
scene.add(dir_light);

ambient = new THREE.AmbientLight("violet", 0.05);
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

let sat_points = new SatellitesPoints(scene, universe, planet, () => {
  //setTimeout is a dirty hack beacause UI does NOT init correctly most of the time, an async issue I think ....
  setTimeout(() => {
    initUI();
  }, 100);

  sat_path = new SatellitePath(universe, planet);
  sat_path.init(sat_points, 0);
  scene.add(sat_path);
});

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

const initUI = () => {
  let UI = <HTMLDivElement>document.getElementById("UI");
  let time_UI = <HTMLDivElement>document.getElementById("time_UI");
  let select = <HTMLSelectElement>document.getElementById("satellite_chooser");
  let UI_toggle_btn = <HTMLDivElement>document.getElementById("toggle_button");
  let time_UI_toggle_btn = <HTMLDivElement>document.getElementById("time_UI_toggle_button");
  let time_reset_btn = <HTMLDivElement>document.getElementById("time_reset_btn");
  let counter = 0;
  // console.log(sat_points.data.satDatas);

  for (let data of sat_points.data.satDatas) {
    let option = document.createElement("option");
    option.value = counter.toString();
    option.innerHTML = data.name;

    select.appendChild(option);
    counter++;
  }

  UI_toggle_btn.addEventListener("click", () => {
    UI.classList.toggle("hidden");
  });

  select.addEventListener("change", (e) => {
    selected_sat_index = select.selectedIndex;
    console.log("seleted sat is :", sat_points.data.satDatas[selected_sat_index].name);
  });

  let show_all_chkbox = <HTMLInputElement>document.getElementById("show_all");

  if (show_all_chkbox) {
    show_all_chkbox.checked = true;

    show_all_chkbox.addEventListener("change", () => {
      sat_points.visible = show_all_chkbox.checked;
    });
  }

  // time UI

  let time_offset_mult_field = <HTMLInputElement>document.getElementById("time_offset_mult");
  time_offset_mult_field.setAttribute("value", time_offset_mult.toString());

  time_offset_mult_field.addEventListener("input", (e) => {
    // console.log();
    clock = new THREE.Clock(true);
    time_offset_mult = parseFloat((<HTMLInputElement>e.target).value);
  });

  time_UI_toggle_btn.addEventListener("click", () => {
    time_UI.classList.toggle("hidden");
  });

  time_reset_btn.addEventListener("click", () => {
    clock = new THREE.Clock(true);
    time_offset_mult = 0;
    time_offset_mult_field.value = "0";
  });
};

const updateUI = () => {
  let real_time_span = document.getElementById("real_time");
  let simu_time_span = document.getElementById("simu_time");
  real_time_span.innerHTML = clock.elapsedTime.toFixed(2).toString();
  simu_time_span.innerHTML = simulation_time.toFixed(2).toString();
};

const update = () => {
  // console.log(dateAdd(new Date(), "minute", -10));
  // sat_path.geometry.verticesNeedUpdate = true;
  if (sat_points.bShaderLoaded) {
    updateUI();

    let time_offset = clock.elapsedTime * time_offset_mult;
    let simulation_date = dateAdd(new Date(), "second", time_offset);
    simulation_time = time_offset;
    sat_points.update(simulation_date);

    //draw selected Satellite
    if (selected_sat_index != -1) {
      let pos2 = sat_points.geometry.vertices[selected_sat_index];
      if (pos2) {
        selected_sat_object.position.set(pos2.x, pos2.y, pos2.z);
      }
    }
  }
};

let refresh_counter = 0;

function animate() {
  let delta_t = clock.getDelta();

  if (refresh_counter > 0.025) {
    refresh_counter = 0;
    update();
  }

  refresh_counter += delta_t;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
