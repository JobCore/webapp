import Flux from '../flux';
import { GET } from '../store/ApiRequests';

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
}
export default new EmployeeActions();
