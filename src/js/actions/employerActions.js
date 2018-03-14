import Flux from "../flux"

class EmployerActions extends Flux.Action{
  addEmployer() {
    this.dispatch('EmployerStore.addEmployer');
  }
  
  addNewList(listName) {
    this.dispatch('EmployerStore.addNewList', listName);
  }
  
  removeFavoritesLists(listName) {
    this.dispatch('EmployerStore.removeFavoritesLists',{listName})
  }
  
  renameFavoritesLists(prevListName, newListName) {
    this.dispatch('EmployerStore.renameFavoritesLists',{ prevListName, newListName });
  }
  
  addEmployeeToFavList(id, list) {
    this.dispatch('EmployerStore.addEmployeeToFavList',{ id, list });
  }
  
  removeEmployeeFromFavList(id, list) {
    this.dispatch('EmployerStore.removeEmployeeFromFavList',{ id, list });
  }
}
export default new EmployerActions();
