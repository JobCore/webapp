import AppDispatcher from "../../dispatcher.js";

export function updateConfig(value, configOption, listName) {
  return AppDispatcher.dispatch({
    type: 'UPDATE_CONFIG',
    value,
    configOption,
    listName
  })
}

export function clearConfigFor(listName) {
  return AppDispatcher.dispatch({
    type: 'CLEAR_CONFIG',
    listName
  })
}