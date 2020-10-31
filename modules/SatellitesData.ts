import * as SAT from "satellite.js/dist/satellite.es";
export interface sat_data_interface {
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  satrec: SAT.SatRec;
  error: boolean;
}
export type SatData = sat_data_interface;

export default class SatellitesData {
  satDatas: SatData[] = [];
  satrecs: SAT.SatRec[] = [];
  constructor() {
    // this.data.name = "Sat 2";
    // this.data.latitude = 45.0;
    // this.data.longitude = 150.0;
    // console.log(this.data.name);
  }

  /**
   *
   * @param filepath
   */
  loadFromTextFile(filepath: string) {
    return new Promise((resolve, reject) => {
      fetch(filepath)
        .then((res) => res.text())
        .then((data) => {
          // console.log(data);
          let lines = data.split("\n");
          for (let i = 0; i < lines.length; i += 3) {
            let temp_data: SatData = {} as SatData;
            temp_data.name = lines[i];
            temp_data.satrec = SAT.twoline2satrec(lines[i + 1], lines[i + 2]);

            this.satDatas.push(temp_data);
          }

          // console.log(this.satDatas[0]);
          this.getSatellitesData(new Date());
          resolve(data);
        });
    });
  }

  /**
   * puts data in satDatas array
   * @param date
   */
  getSatellitesData(date: Date) {
    let counter: number = 0;
    for (let data of this.satDatas) {
      try {
        let positionAndVelocity = SAT.propagate(data.satrec, date);
        let positionEci = positionAndVelocity.position;

        var gmst = SAT.gstime(date);

        let positionGd = SAT.eciToGeodetic(positionEci, gmst);

        let x = (positionGd.longitude / Math.PI) * 180;
        let y = (positionGd.latitude / Math.PI) * 180;

        data.longitude = x;
        data.latitude = y;
        data.elevation = positionGd.height;
        data.error = false;
        // console.log("longitude :", positionGd.longitude);
      } catch (err) {
        data.error = true;
        // console.error("sat n° :", counter, err);
      }

      counter++;
    }
  }

  /**
   *
   * @param date
   * @param sat_id
   */
  getSatelliteData(date: Date, sat_id: number): Object {
    try {
      let positionAndVelocity = SAT.propagate(this.satDatas[sat_id].satrec, date);
      let positionEci = positionAndVelocity.position;

      var gmst = SAT.gstime(date);

      let positionGd = SAT.eciToGeodetic(positionEci, gmst);

      let x = (positionGd.longitude / Math.PI) * 180;
      let y = (positionGd.latitude / Math.PI) * 180;

      // console.log("longitude :", positionGd.longitude);

      return {
        elevation: positionGd.height,
        latitude: y,
        longitude: x,
      };
    } catch (err) {
      return null;
    }

    return null;
  }
}
