export default class OrbitalBody {
  name: string;
  density: number = 5515; //5510 kg/m3
  mass: number = 0;
  radius: number = 6371000; // 6 371km
  constructor(name: string = "default name") {
    this.name = name;

    this.computeMass();
  }

  computeMass() {
    this.mass =
      this.density *
      ((4.0 / 3.0) * Math.PI * this.radius * this.radius * this.radius);
    console.log(this.mass);
  }
}
