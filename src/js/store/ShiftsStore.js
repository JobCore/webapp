import Flux from '../flux.js';

class ShiftStore extends Flux.Store {
  constructor() {
    super();
    this.state = {
      shift: [],
      next_page: null,
      previous_page: null,
    };
  }

  _convertTimestamp = timestamp => {
    // Convert Timestramp into date object
    let date = new Date(timestamp);
    date = new Date(date.setDate(date.getDate() + 1));
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = (month < 10 ? '0' : '') + month;
    day = (day < 10 ? '0' : '') + day;
    const str = `${date.getFullYear()}-${month}-${day}`;
    return str;
  };

  _setShifts({ data }) {
    this.setStoreState({
      shift: [...data.results],
      next_page: data.next,
      previous_page: data.previous,
    }).emit('change');
  }

  // _createShift({shiftData}) {
  //   this.ShiftActions.getAll();
  // }

  getAll() {
    return this.state.shift;
  }

  getActiveShifts() {
    const shiftsArr = this.state.shift;
    const activeShifts = shiftsArr.filter(shift => shift.status === 'OPEN');
    return activeShifts;
  }

  getShiftsGroupedByDate(shifts) {
    const SHIFTS = shifts || this.state.shift;
    const datesArr = SHIFTS.map(shift => shift.date);
    const uniqueDates = [...new Set(datesArr)];
    const datesObj = {};
    uniqueDates.forEach(date => {
      datesObj[date] = [];
    });

    SHIFTS.forEach(shift => {
      datesObj[shift.date].push(shift);
    });
    return datesObj;
  }

  getById(id) {
    return this.state.shift.find(item => item.id.toString() === id.toString());
  }

  getByDate(date) {
    return this.state.shift.filter(item => this._convertTimestamp(item.date) === date);
  }

  _acceptCandidate(params) {
    const shiftIndex = this.state.shift.findIndex(s => s.id === params.shiftId);
    this.state.shift[shiftIndex].acceptedCandidates.push(params.employeeId);
    this.emit('change');
  }

  _rejectCandidate(params) {
    const shiftIndex = this.state.shift.findIndex(s => s.id === params.shiftId);
    const employeeIndex = this.state.shift[shiftIndex].candidates.findIndex(e => e.id === params.employeeId);
    this.state.shift[shiftIndex].candidates.splice(employeeIndex, 1);
    this.emit('change');
  }

  _updateShift(params) {
    const index = this.state.shift.findIndex(s => s.id === params.id);
    this.state.shift[index][params.param] = params.value;
    this.emit('change');
  }
}
export default new ShiftStore();
