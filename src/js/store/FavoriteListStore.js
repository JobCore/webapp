import Flux from "../flux";
import EmployerStore from "./EmployerStore";

class FavoriteListStore extends Flux.Store {

  constructor() {
    super();
    this.state = {
      lists: []
    }
  }

  _addList({data}) {
    let updatedList = [...this.state.lists];
    updatedList.push(data);
    this.setStoreState({lists: updatedList}).emit("change");
  }

  _updateEmployees(params) {
    const INDEX = this.state.lists.findIndex(s => s.id === params.id);
    let updatedList = [...this.state.lists];
    updatedList[INDEX].employees = params.employees
    this.setStoreState({lists: updatedList}).emit("change");
  }

  _setLists({data}) {
    let ownedLists = data.filter(list => list.owner.id === EmployerStore.getEmployer().id)
    this.setStoreState({ lists: [...ownedLists] }).emit("change");
  }

  _renameList(params) {
    let updatedList = [...this.state.lists];
    const INDEX = updatedList.findIndex(s => s.id === params.id);
    updatedList[INDEX][params.param] = params.value;
    this.setStoreState({lists: updatedList}).emit("change");
  }

  _removeList(params) {
    let updatedList = [...this.state.lists];
    const INDEX = updatedList.findIndex(s => s.id === params.id);
    updatedList.splice(INDEX, 1);
    this.setStoreState({lists: updatedList}).emit("change");
  }

  getAll() {
    return this.state.lists;
   }

  getById(id) {
    return this.state.lists.find((item) => {
      return (item.id.toString() === id.toString());
    });
  }

  /**
 * Check if Employee is in any of the favorites lis
 * @param {float} id Id of the employee
 * @returns {bool}
 * @memberof EmployerStore
 */
  isEmployeeInFavoriteList = (id) => {
    let isFavorite = false;
    this.state.lists.map(
      list => {
        let employeesIdArr = [];
        list.employees.forEach(employee => employeesIdArr.push(employee.id));
        return isFavorite = employeesIdArr.includes(id) ? true : isFavorite;
      }
    );
    return isFavorite;
  }

  getEmployees = () => {
    let employeeList = [];
    let idArr = [];
    this.state.lists.map(list => list.employees.map(employee => idArr.push(employee.id)));
    this.state.lists.forEach(list => employeeList = [ ...employeeList,...list.employees]);
    idArr = [...new Set(idArr)];
    employeeList = employeeList.filter(employee => {
      let result = idArr.includes(employee.id);
      idArr.shift();
      return result;
    }) ;
    return employeeList;
  }

  employeeCountFor = (id) => {
    const LIST = this.state.lists.filter(list => list.id === id);
    return LIST[0].employees.length;
  }

  getListWhereEmployeeIsFavorite = (id) => {
    let favoritedInLists = []
    this.state.lists.map(list =>
        list.employees.map(employee => id === employee.id ? favoritedInLists.push(list) : null)
    );
    return favoritedInLists;
  }
}
export default new FavoriteListStore();