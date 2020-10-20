import OrbitalBody from "./OrbitalBody";
import * as THREE from "three";

export default class Planet extends THREE.Mesh {
  body: OrbitalBody;
  object3d: THREE.Mesh;

  constructor(name: string = "default name") {
    super();
    this.body = new OrbitalBody();
    this.geometry = new THREE.SphereBufferGeometry(
      this.body.radius,
      60,
      30,
      0,
      Math.PI * 2,
      0,
      Math.PI
    );
    // this.material = new THREE.MeshLambertMaterial()
    let loader = new THREE.TextureLoader();
    const onLoad = (image) => {
      console.log(image);

      this.material = new THREE.MeshLambertMaterial({
        map: image,
      });

      console.log("textures loaded");
    };

    const onError = (err) => {
      console.error("An error happened.");
      console.log(err);
    };
    loader.load("textures/2k_earth_daymap.jpg", onLoad, undefined, onError);
  }
}
