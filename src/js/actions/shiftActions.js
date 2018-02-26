import AppDispatcher from "../../dispatcher.js";

export function updateShift(id, param, value) {
  return AppDispatcher.dispatch({
    type: 'UPDATE_SHIFT',
    id,
    param,
    value
  })
}