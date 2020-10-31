import * as THREE from "three";
import Planet from "./Planet";
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

  init(sat_points: SatellitesPoints, sat_id: number = 0, samples: number = 100, duration: number = 50) {
    this.geometry = new THREE.Geometry();
    let date = new Date();

    for (let i = 0; i < samples; i++) {
      date.setTime(new Date().getTime() + 60 * 1000 * i);
      let data: any = sat_points.data.getSatelliteData(date, sat_id);
      let pos = sat_points.calcPosFromLatLonRad(
        (this.planet.body.radius + data.elevation * 1000) * this.universe.scale,
        data.latitude,
        data.longitude
      );
      this.geometry.vertices.push(pos);
      // console.log(pos);
    }
  }
}
