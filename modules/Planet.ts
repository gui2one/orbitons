import OrbitalBody from "./OrbitalBody";
import * as THREE from "three";

export default class Planet extends THREE.Mesh {
  body: OrbitalBody;

  diffuse_map: THREE.Texture;
  bump_map: THREE.Texture;
  rough_map: THREE.Texture;

  constructor(name: string = "default name") {
    super();
    this.body = new OrbitalBody();
    this.geometry = new THREE.SphereBufferGeometry(this.body.radius, 60, 30, 0, Math.PI * 2, 0, Math.PI);
    // this.material = new THREE.MeshLambertMaterial()
    let manager: THREE.LoadingManager = new THREE.LoadingManager();
    manager.onStart = (url, itemsLoaded, itemsTotal) => {
      // console.log("Started loading file: " + url + ".\nLoaded " + itemsLoaded + " of " + itemsTotal + " files.");
    };
    manager.onLoad = () => {
      console.log("Planet textures loading Completed ... Nice");
      this.material = new THREE.MeshStandardMaterial({
        map: this.diffuse_map,
        // roughness: 0.3,
        roughnessMap: this.rough_map,
        // metalness: 0.5,
        metalnessMap: this.diffuse_map,
        bumpMap: this.bump_map,
        bumpScale: 0.003,
      });
    };

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      // console.log("Loading file: " + url + ".\nLoaded " + itemsLoaded + " of " + itemsTotal + " files.");
    };

    let loader_diffuse = new THREE.TextureLoader(manager);
    const onLoadDiffuse = (image) => {
      this.diffuse_map = image;
    };

    const onErrorDiffuse = (err) => {
      console.error("An error happened.");
      console.log(err);
    };
    loader_diffuse.load("textures/earthmap1k.jpg", onLoadDiffuse, undefined, onErrorDiffuse);

    let loader_bump = new THREE.TextureLoader(manager);
    const onLoadBump = (image) => {
      this.bump_map = image;
    };

    const onErrorBump = (err) => {
      console.error("An error happened.");
      console.log(err);
    };
    loader_bump.load("textures/earthbump1k.jpg", onLoadBump, undefined, onErrorBump);

    let loader_rough = new THREE.TextureLoader(manager);
    const onLoadRough = (image) => {
      this.rough_map = image;
    };

    const onErrorRough = (err) => {
      console.error("An error happened.");
      console.log(err);
    };
    loader_rough.load("textures/earthroughness1k.jpg", onLoadRough, undefined, onErrorRough);
  }
}
