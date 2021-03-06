import Flux from '../flux';
import ShiftsStore from '../store/ShiftsStore';
import { GET, POST, PUT } from '../store/ApiRequests';

class ShiftActions extends Flux.Action {
  getAll() {
    GET('shifts').then(shifts =>
      this.dispatch('ShiftStore.setShifts', {
        data: shifts,
      })
    );
  }

  updateShift(id, param, value) {
    const shiftData = JSON.stringify({
      [param]: Array.isArray(value) ? value.map(item => item.value) : value,
    });
    PUT('shifts', id, shiftData).then(() =>
      this.dispatch('ShiftStore.updateShift', {
        id,
        param,
        value: Array.isArray(value)
          ? value.map(item => ({
              id: item.value,
              title: item.label,
            }))
          : value,
      })
    );
  }

  acceptCandidate(shiftId, employeeId) {
    const shift = ShiftsStore.getById(shiftId);
    let employees = [...shift.employees];
    employees = employees.map(employee => employee.id);

    if (shift.status !== 'FILLED' || shift.employees < shift.maximum_allowed_employees) {
      employees.push(employeeId);
      const shiftData = JSON.stringify({
        employees,
      });

      PUT('shifts', shiftId, shiftData).then(() => this.getAll());
    } else {
      throw new Error('This shift is already filled.');
    }
  }

  rejectCandidate(shiftId, employeeId) {
    const shift = ShiftsStore.getById(shiftId);
    let candidates = [...shift.candidates];
    let employees = [...shift.employees];

    // Create arrays with only the employee's ids
    candidates = candidates.map(candidate => candidate.id);
    employees = employees.map(employee => employee.id);
    // Get index for the employee in each array
    const CANDIDATE_INDEX = candidates.indexOf(employeeId);
    const EMPLOYEE_INDEX = employees.indexOf(employeeId);

    // Delete from candidates and employee arrays if present in any
    if (CANDIDATE_INDEX !== -1) {
      candidates.splice(CANDIDATE_INDEX, 1);
    }
    if (EMPLOYEE_INDEX !== -1) {
      employees.splice(EMPLOYEE_INDEX, 1);
    }

    const shiftData = JSON.stringify({
      employees,
      candidates,
    });

    PUT('shifts', shiftId, shiftData).then(() => this.getAll());
  }

  createShift(shiftData) {
    shiftData = JSON.stringify(shiftData);
    POST('shifts', shiftData)
      .then(() => this.getAll())
      .catch(err => {
        throw new Error(`Shift could not be created due to -> ${err}`);
      });
  }
}
export default new ShiftActions();
