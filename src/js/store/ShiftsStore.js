import EventEmmiter from "events";

import Seeder from "./Seeder.js";

class ShiftStore extends EventEmmiter {

  constructor() {

    super();

    this.model = {};
    this.model.shift = Seeder.make(20, "shift");
    this.model.venue = Seeder.make(20, "venue");
    this.model.menu = Seeder.make(1, "menu");
  }

  addShift() {
    this.model.shifts.push(Seeder.make(1, "shift"));
    this.emit("change");
  }

  getAll(type) {

    if (typeof this.model[type] === "undefined") throw new Error("Invalid model type: " + type);
    return this.model[type];
  }

  getById(type, id) {

    if (typeof this.model[type] === "undefined") throw new Error("Invalid model type: " + type);
    return this.model[type].find((item) => {
      return (item.id.toString() === id.toString());
    });
  }
}
export default new ShiftStore();