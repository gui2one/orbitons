export default class Dropdown {
  selected_index = 0;
  root: HTMLElement;
  list;
  button;
  items;
  constructor(element) {
    this.root = element;
    this.list = element.querySelector(".item-list");
    this.button = element.querySelector(".button");

    this.items = [];
  }

  init(items = null) {
    this.list = this.root.querySelector(".item-list");
    this.button.addEventListener("click", (event) => {
      event.preventDefault();
      this.list.classList.toggle("hidden");
    });

    if (items) this.addItems(items);

    this.drawArrow();
  }

  drawArrow() {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("arrow");
    svg.id = "svg-arrow";
    svg.setAttribute("viewBox", "0 0 50 50");

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "currentColor");
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "0");
    path.setAttribute("d", "M0 0 L25 25 L50 0 L0 0");
    svg.appendChild(path);

    this.root.appendChild(svg);
  }

  addItems(items) {
    let counter = 0;
    for (let item of items) {
      this.items.push(item);
      let div = document.createElement("div");
      div.classList.add("dropdown-item");
      div.dataset.id = counter.toString();
      div.innerHTML = item;
      this.list.appendChild(div);

      counter++;
    }

    items = this.root.querySelectorAll(".dropdown-item");

    counter = 0;
    for (let item of items) {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        this.selected_index = counter;

        this.list.classList.toggle("hidden");
        this.button.innerHTML = event.target.innerHTML;
      });

      counter++;
    }

    this.button.innerHTML = this.items[0];
  }
}
