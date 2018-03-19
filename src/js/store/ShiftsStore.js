import Flux from '../flux.js';
import uuid from 'uuid/v4';

import Seeder from "./Seeder.js";

class ShiftStore extends Flux.Store {

  constructor() {
    super();
    this.state = {
      shift: [],
      next_page: null,
      previous_page: null,
      menu: Seeder.make(1, "menu"),
    };
  }

  _setShifts({data}) {
    this.setStoreState({
      shift: [...data.results],
      next_page: data.next,
      previous_page: data.previous
    }).emit("change");
  }

  addShift() {
    this.state.shifts.push(Seeder.make(1, "shift"));
    this.emit("change");
  }

  _createShift(params) {
    this.state.shift.push({...params.shiftData});
    this.state.shift[this.state.shift.length - 1].id = uuid();
    this.state.shift[this.state.shift.length - 1].confirmedEmployees = 0;
    this.state.shift[this.state.shift.length - 1].candidates = [];
    this.state.shift[this.state.shift.length - 1].acceptedCandidates = [];
    console.log('created', this.state.shift);
    this.emit("change");
  }

  getAll(type) {
    if (typeof this.state[type] === "undefined") throw new Error("Invalid model type: " + type);
    return this.state[type];
  }

  getActiveShifts() {
    const shiftsArr = this.state.shift;
    let activeShifts = shiftsArr.filter(shift => shift.status === "Receiving candidates");
    return activeShifts;
  }

  getShiftsSortedByDate(shifts) {
    const shiftsArr = shifts || this.state.shift;
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
    if (typeof this.state[type] === "undefined") throw new Error("Invalid model type: " + type);
    return this.state[type].find((item) => {
      return (item.id.toString() === id.toString());
    });
  }

  _acceptCandidate(params) {
    const shiftIndex = this.state.shift.findIndex(s => s.id === params.shiftId);
    this.state.shift[shiftIndex].acceptedCandidates.push(params.employeeId);
    this.emit("change");
  }

  _rejectCandidate(params) {
    const shiftIndex = this.state.shift.findIndex(s => s.id === params.shiftId);
    const employeeIndex = this.state.shift[shiftIndex].candidates.findIndex(e => e.id === params.employeeId);
    this.state.shift[shiftIndex].candidates.splice(employeeIndex, 1);
    this.emit("change");
  }

  _updateShift(params) {
    let index = this.state.shift.findIndex(s => s.id === params.id);
    switch (params.param) {
      case "favoritesOnly":
      case "minAllowedRating":
      case "allowedFromList":
        this.state.shift[index].restrictions[params.param] = params.value;
      break;
      case "badges":
        params.value = params.value.length > 0 ? params.value.map(val => val.value) : [];
        this.state.shift[index].restrictions[params.param] = params.value;
        break;
      default:
        this.state.shift[index][params.param] = params.value;
        break;
    }
    this.emit("change");
  }

  getAllAvailablePositions() {
    const shifts = [...this.state.shift];
    let positions = [];
    shifts.forEach(shift => positions.push(shift.position));
    return [...new Set(positions)];
  }
}
export default new ShiftStore();