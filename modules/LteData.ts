import * as THREE from "three";
import { getSatelliteInfo } from "tle.js";
export default class LteData extends THREE.Points {
  strings: string[];
  infos: Object[];
  constructor(data: string[] = new Array<string>()) {
    super();

    this.strings = data;
    this.infos = new Array<Object>();
    console.log("LteData Contructor");
  }

  getInfos(id: number): Object | null {
    let ret = {};
    if (this.strings.length > id) {
      ret = getSatelliteInfo(this.strings[id], Date.now());
      return ret;
    }

    return null;
  }
}
