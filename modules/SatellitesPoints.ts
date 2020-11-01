import * as THREE from "three";
import Planet from "./Planet";
import SatellitesData from "./SatellitesData";
import UniverseParams from "./UniverseParams";

export default class SatellitesPoints extends THREE.Points {
  data: SatellitesData;
  vShader: string;
  fShader: string;
  scene: THREE.Scene;
  universeParams: UniverseParams;
  planet: Planet;
  bShaderLoaded: boolean = false;
  geometry: THREE.Geometry;
  callback: () => void;
  constructor(scene: THREE.Scene, universeParams: UniverseParams, planet: Planet, callback: () => void) {
    super();
    this.geometry = new THREE.Geometry();

    this.scene = scene;
    this.universeParams = universeParams;
    this.planet = planet;
    this.callback = callback;

    this.init();
  }

  init() {
    this.data = new SatellitesData();

    this.data.loadFromTextFile("tle_data/spacex.txt").then(() => {
      for (let data of this.data.satDatas) {
        let pos = this.calcPosFromLatLonRad(
          (this.planet.body.radius + data.elevation * 1000) * this.universeParams.scale,
          data.latitude,
          data.longitude
        );

        this.geometry.vertices.push(pos);
      }

      this.scene.add(this);
    });

    let uniforms = {
      scale: { value: 0.02 },
      color: { value: new THREE.Color(1.0, 1, 1) },
    };
    let manager: THREE.LoadingManager = new THREE.LoadingManager();

    manager.onLoad = () => {
      createShader();
    };
    const vert_loader = new THREE.FileLoader(manager);
    const frag_loader = new THREE.FileLoader(manager);

    vert_loader.load("shaders/SatellitesPoint.vert", (data) => {
      this.vShader = <string>data;
    });

    frag_loader.load("shaders/SatellitesPoint.frag", (data) => {
      this.fShader = <string>data;
    });
    const createShader = () => {
      this.material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: this.vShader,
        fragmentShader: this.fShader,
      });

      this.bShaderLoaded = true;

      this.callback();
    };
  }

  update(date: Date = new Date()) {
    if (this.bShaderLoaded) {
      this.data.getSatellitesData(date);

      let i = 0;
      for (let data of this.data.satDatas) {
        let pos = this.calcPosFromLatLonRad(
          (this.planet.body.radius + data.elevation * 1000) * this.universeParams.scale,
          data.latitude,
          data.longitude
        );

        this.geometry.vertices[i].x = pos.x;
        this.geometry.vertices[i].y = pos.y;
        this.geometry.vertices[i].z = pos.z;

        i += 1;
      }
      this.geometry.computeBoundingBox();
      this.geometry.verticesNeedUpdate = true;
    }
  }

  calcPosFromLatLonRad(radius, lat, lon) {
    const spherical = new THREE.Spherical(
      radius,
      THREE.MathUtils.degToRad(90 - lat),
      THREE.MathUtils.degToRad(lon + 90)
    );

    let vector = new THREE.Vector3();
    vector.setFromSpherical(spherical);

    return vector;
  }
}
