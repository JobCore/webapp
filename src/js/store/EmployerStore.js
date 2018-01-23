import EventEmmiter from "events";

import Seeder from "./Seeder.js";

class EmployerStore extends EventEmmiter {

  constructor() {
    super();
    this.model = {};
    this.model.employer = Seeder.make(1, "employer");
  }

  addEmployer() {
    this.model.employer.push(Seeder.make(1, "employer"));
    this.emit("change");
  }

  getEmployer() {
    return this.model.employer;
  }
}
export default new EmployerStore();