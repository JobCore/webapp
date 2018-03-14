import Flux from "../flux";
import Seeder from "./Seeder.js";

class EmployeeStore extends Flux.Store {

  constructor() {
    super();
    this.state = {
      employee: Seeder.make(20, "employee")
    }
  }

  addEmployee() {
    this.state.employee.push(Seeder.make(1, "employee"));
    this.emit("change");
  }

  getAll() { return this.state.employee; }

  getById(id) {
    return this.state.employee.find((item) => {
      return (item.id.toString() === id.toString());
    });
  }

  _acceptedInShift(data) {
    // let index = this.state.employee.findIndex(e => e.id === data.employeeId);
    // this.state.employee[index].acceptedInShifts.push(data.shiftId);
    this.emit('change');
  }

}
export default new EmployeeStore();