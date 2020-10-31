import * as THREE from "three";
import Planet from "./Planet";
import SatellitesData from "./SatellitesData";
import SatellitesPoints from "./SatellitesPoints";
import UniverseParams from "./UniverseParams";
export default class SatellitePath extends THREE.Line {
  geometry: THREE.Geometry;
  planet: Planet;
  universe: UniverseParams;
  constructor(universe: UniverseParams, planet: Planet) {
    super();
    this.planet = planet;
    this.universe = universe;
  }

  init(sat_points: SatellitesPoints, sat_id: number = 0, samples: number = 50, duration: number = 50) {
    this.geometry = new THREE.Geometry();

    for (let i = 0; i < samples; i++) {
      let pos = sat_points.calcPosFromLatLonRad(
        (this.planet.body.radius + sat_points.data.satDatas[sat_id].elevation * 1000) * this.universe.scale,
        sat_points.data.satDatas[sat_id].latitude,
        sat_points.data.satDatas[sat_id].longitude
      );
      this.geometry.vertices.push(pos);
    }
  }
}
