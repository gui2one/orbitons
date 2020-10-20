export default class DebugWindow {
  container: HTMLDivElement;
  constructor() {
    this.container = document.createElement("div");
    this.container.id = "debug_window";
    document.body.appendChild(this.container);
  }

  update(data: object) {
    let str = ``;
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        // console.log(key, element);
        str += `
        <p>${key} : <span>${parseFloat(data[key]).toFixed(2)}</span></p>
        `;
      }
    }

    this.container.innerHTML = str;
  }
}
