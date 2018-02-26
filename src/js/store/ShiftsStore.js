import EventEmmiter from "events";
import AppDispatcher from '../../dispatcher';

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

  getShiftsSortedByDate(shifts) {
    const shiftsArr = shifts || this.model.shift;
    let sortedShifts = shiftsArr.sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });
    return sortedShifts;
  }

  getShiftsGroupedByDate(shifts) {
    let sortedShift = [...this.getShiftsSortedByDate(shifts || null)];
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

  updateShift(id, param, value) {
    let index = this.model.shift.findIndex(s => s.id === id);
    switch (param) {
      case "favoritesOnly":
      case "minAllowedRating":
        this.model.shift[index].restrictions[param] = value;
        break;
      default:
        this.model.shift[index][param] = value;
        break;
    }
    this.emit("change");
  }

  handleActions(action) {
    switch (action.type) {
      case 'UPDATE_SHIFT':
        this.updateShift(action.id, action.param, action.value);
        break;
      default:
        break;
    }
  }
}

const shiftStore = new ShiftStore();
AppDispatcher.register(action => shiftStore.handleActions(action));

export default shiftStore;