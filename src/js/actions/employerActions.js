import AppDispatcher from "../../dispatcher.js";

export function addEmployer() {
  return AppDispatcher.dispatch({
    type: 'ADD_EMPLOYER'
  })
}

export function addNewList(listName) {
  return AppDispatcher.dispatch({
    type: 'ADD_NEW_FAVORITE_LIST',
    listName
  })
}

export function removeFavoritesLists(listName) {
  return AppDispatcher.dispatch({
    type: 'REMOVE_FAVORITE_LIST',
    listName
  })
}

export function renameFavoritesLists(prevListName, newListName) {
  return AppDispatcher.dispatch({
    type: 'RENAME_FAVORITE_LIST',
    prevListName,
    newListName
  })
}

export function addEmployeeToFavList(id, list) {
  return AppDispatcher.dispatch({
    type: 'ADD_EMPLOYEE_TO_FAVORITE_LIST',
    id,
    list
  })
}

export function removeEmployeeFromFavList(id, list) {
  return AppDispatcher.dispatch({
    type: 'REMOVE_EMPLOYEE_FROM_FAVORITE_LIST',
    id,
    list
  })
}