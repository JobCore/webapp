import Flux from "../flux"

class EmployeeActions extends Flux.Action{
  acceptedInShift(shiftId, employeeId) {
    this.dispatch("EmployeeStore.acceptedInShift",{ employeeId, shiftId });
  }
}
export default new EmployeeActions();