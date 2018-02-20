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

  handleActions(action) {
    switch (action.type) {
      case 'ADD_EMPLOYEE':
        this.addEmployee();
        break;
      default:
        break;
    }
  }
}

const employeeStore = new EmployeeStore();
AppDispatcher.register(action => employeeStore.handleActions(action));

export default employeeStore;