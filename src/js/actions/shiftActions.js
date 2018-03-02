import AppDispatcher from "../../dispatcher.js";

export function updateShift(id, param, value) {
  return AppDispatcher.dispatch({
    type: 'UPDATE_SHIFT',
    id,
    param,
    value
  })
}

export function acceptCandidate(shiftId, employeeId) {
  return AppDispatcher.dispatch({
    type: 'ACCEPT_CANDIDATE',
    shiftId,
    employeeId
  })
}

export function rejectCandidate(shiftId, employeeId) {
  return AppDispatcher.dispatch({
    type: 'REJECT_CANDIDATE',
    shiftId,
    employeeId
  })
}

