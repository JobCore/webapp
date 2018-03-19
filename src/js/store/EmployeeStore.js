import Flux from "../flux";

class EmployeeStore extends Flux.Store {

  constructor() {
    super();
    this.state = {
      employee: [],
      next_page: null,
      previous_page: null
    }
  }

  addEmployee() {
    // this.state.employee.push(Seeder.make(1, "employee"));
    this.emit("change");
  }

  _setEmployees({data}) {
    this.setStoreState({
      employee: [...data.results],
      next_page: data.next,
      previous_page: data.previous
    }).emit("change");
  }

  getAll() {
    return this.state.employee;
  }

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