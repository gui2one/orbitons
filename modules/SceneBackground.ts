import * as THREE from "three";

export default class SceneBackground {
  texture_path: string;
  constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load("textures/milkyway_small.jpg", () => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(renderer, texture);
      scene.background = rt;
    });
  }
}
