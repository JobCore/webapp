import Flux from '../flux';
import { GET, PUT } from '../store/ApiRequests';

class EmployeeActions extends Flux.Action {
  getAll() {
    GET('employees').then(employees =>
      this.dispatch('EmployeeStore.setEmployees', {
        data: employees,
      })
    );
  }
  acceptedInShift(shiftId, employeeId) {
    this.dispatch('EmployeeStore.acceptedInShift', { employeeId, shiftId });
  }

  updateEmployee = (id, employeeData) => {
    employeeData = JSON.stringify({
      ...employeeData,
    });
    PUT('employees', id, employeeData).then(() => this.getAll());
  };
}
export default new EmployeeActions();
