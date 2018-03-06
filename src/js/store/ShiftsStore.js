import EventEmmiter from "events";
import AppDispatcher from '../../dispatcher';
import uuid from 'uuid/v4';

import Seeder from "./Seeder.js";

class ShiftStore extends EventEmmiter {

  constructor() {

    super();

    this.model = {};
    this.model.shift = Seeder.make(20, "shift");
    this.model.menu = Seeder.make(1, "menu");
  }

  addShift() {
    this.model.shifts.push(Seeder.make(1, "shift"));
    this.emit("change");
  }

  createShift(shiftData) {
    this.model.shift.push({...shiftData});
    this.model.shift[this.model.shift.length - 1].id = uuid();
    this.model.shift[this.model.shift.length - 1].confirmedEmployees = 0;
    this.model.shift[this.model.shift.length - 1].candidates = [];
    this.model.shift[this.model.shift.length - 1].acceptedCandidates = [];
    console.log('created', this.model.shift);
    this.emit("change");
  }

  getAll(type) {
    if (typeof this.model[type] === "undefined") throw new Error("Invalid model type: " + type);
    return this.model[type];
  }

  getActiveShifts() {
    const shiftsArr = this.model.shift;
    let activeShifts = shiftsArr.filter(shift => shift.status === "Receiving candidates");
    return activeShifts;
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

  acceptCandidate(shiftId, employeeId) {
    const shiftIndex = this.model.shift.findIndex(s => s.id === shiftId);
    this.model.shift[shiftIndex].acceptedCandidates.push(employeeId);
    this.emit("change");
  }

  rejectCandidate(shiftId, employeeId) {
    const shiftIndex = this.model.shift.findIndex(s => s.id === shiftId);
    const employeeIndex = this.model.shift[shiftIndex].candidates.findIndex(e => e.id === employeeId);
    this.model.shift[shiftIndex].candidates.splice(employeeIndex, 1);
    this.emit("change");
  }

  updateShift(id, param, value) {
    let index = this.model.shift.findIndex(s => s.id === id);
    switch (param) {
      case "favoritesOnly":
      case "minAllowedRating":
      case "allowedFromList":
        this.model.shift[index].restrictions[param] = value;
      break;
      case "badges":
        value = value.length > 0 ? value.map(val => val.value) : [];
        this.model.shift[index].restrictions[param] = value;
        break;
      default:
        this.model.shift[index][param] = value;
        break;
    }
    this.emit("change");
  }

  getAllAvailablePositions() {
    const shifts = [...this.model.shift];
    let positions = [];
    shifts.forEach(shift => positions.push(shift.position));
    return [...new Set(positions)];
  }

  handleActions(action) {
    switch (action.type) {
      case 'CREATE_SHIFT':
        this.createShift(action.shiftData)
        break;
      case 'UPDATE_SHIFT':
        this.updateShift(action.id, action.param, action.value);
        break;
      case 'ACCEPT_CANDIDATE':
        this.acceptCandidate(action.shiftId, action.employeeId);
        break;
      case 'REJECT_CANDIDATE':
        this.rejectCandidate(action.shiftId, action.employeeId);
        break;
      default:
        break;
    }
  }
}

const shiftStore = new ShiftStore();
AppDispatcher.register(action => shiftStore.handleActions(action));

export default shiftStore;