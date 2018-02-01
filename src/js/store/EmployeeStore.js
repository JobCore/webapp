import EventEmmiter from "events";

import Seeder from "./Seeder.js";

class EmployeeStore extends EventEmmiter {

  constructor() {
    super();
    this.model = {};
    this.model.employee = Seeder.make(200, "employee");
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
}
export default new EmployeeStore();