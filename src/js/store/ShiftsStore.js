import Flux from '../flux.js';
import ShiftActions from '../actions/shiftActions';

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

  _createShift(shiftData) {
    ShiftActions.getAll()
  }

  getAll(type) {
    if (typeof this.state[type] === "undefined") throw new Error("Invalid model type: " + type);
    return this.state[type];
  }

  getActiveShifts() {
    const shiftsArr = this.state.shift;
    let activeShifts = shiftsArr.filter(shift => shift.status === "OPEN");
    return activeShifts;
  }

  getShiftsGroupedByDate(shifts) {
    const SHIFTS = shifts || this.state.shift;
    const datesArr = SHIFTS.map(shift => shift.date)
    let uniqueDates = [...new Set(datesArr)];
    let datesObj = {};
    uniqueDates.forEach( date => datesObj[date] = []);

    SHIFTS.forEach((shift) => {
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
    this.state.shift[index][params.param] = params.value;
    this.emit("change");
  }
}
export default new ShiftStore();