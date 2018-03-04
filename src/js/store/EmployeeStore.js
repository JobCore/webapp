import EventEmmiter from "events";
import AppDispatcher from '../../dispatcher';

import Seeder from "./Seeder.js";

class EmployeeStore extends EventEmmiter {

  constructor() {
    super();
    this.model = {};
    this.model.employee = Seeder.make(20, "employee");
  }

  addEmployee() {
    this.model.employee.push(Seeder.make(1, "employee"));
    this.emit("change");
  }

  getAll() {
    return this.model.employee;
  }

  getById(id) {
    return this.model.employee.find((item) => {
      return (item.id.toString() === id.toString());
    });
  }

  acceptedInShift(shiftId, employeeId) {
    // let index = this.model.employee.findIndex(e => e.id === employeeId);
    // this.model.employee[index].acceptedInShifts.push(shiftId);
    this.emit('change');
  }

  handleActions(action) {
    switch (action.type) {
      case 'ADD_EMPLOYEE':
        this.addEmployee();
        break;
      case 'ACCEPTED_IN_SHIFT':
        this.acceptedInShift(action.shiftId, action.employeeId);
        break;
      default:
        break;
    }
  }
}

const employeeStore = new EmployeeStore();
AppDispatcher.register(action => employeeStore.handleActions(action));

export default employeeStore;