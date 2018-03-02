import AppDispatcher from "../../dispatcher.js";

// export function updateConfig(value, configOption, listName) {
//   return AppDispatcher.dispatch({
//     type: 'UPDATE_CONFIG',
//     value,
//     configOption,
//     listName
//   })
// }

export function acceptedInShift(shiftId, employeeId) {
  return AppDispatcher.dispatch({
    type: "ACCEPTED_IN_SHIFT",
    employeeId,
    shiftId
  })
}