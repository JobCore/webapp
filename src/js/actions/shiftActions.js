import Flux from "../flux"
import { GET } from "../store/ApiRequests";

class ShiftActions extends Flux.Action{

  getAll() {
    GET("shifts").then(
        shifts => this.dispatch("ShiftStore.setShifts", {
        data: shifts
      })
    )
  }

  updateShift(id, param, value) {
    this.dispatch('ShiftStore.updateShift',{ id, param, value });
  }

  acceptCandidate(shiftId, employeeId) {
    this.dispatch('ShiftStore.acceptCandidate',{ shiftId, employeeId });
  }

  rejectCandidate(shiftId, employeeId) {
    this.dispatch('ShiftStore.rejectCandidate', { shiftId, employeeId });
  }

  createShift(shiftData) {
    this.dispatch('ShiftStore.createShift',{ shiftData });
  }

}
export default new ShiftActions();
