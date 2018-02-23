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

  getShiftsSortedByDate() {
    let sortedShifts = this.model.shift.sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });
    return sortedShifts;
  }

  getShiftsGroupedByDate() {
    let sortedShift = [...this.getShiftsSortedByDate()];
    const datesArr = sortedShift.map(shift => shift.date)
    let uniqueDates = [...new Set(datesArr)];
    let datesObj = {};
    uniqueDates.forEach( date => datesObj[date] = []);

    sortedShift.forEach((shift) => {
      datesObj[shift.date].push(shift);
    })
    return datesObj;
  }

  getById(type, id) {

    if (typeof this.model[type] === "undefined") throw new Error("Invalid model type: " + type);
    return this.model[type].find((item) => {
      return (item.id.toString() === id.toString());
    });
  }
}
export default new ShiftStore();