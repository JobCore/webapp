import Flux from "../flux";
import EmployerStore from "./EmployerStore";

class FavoriteListStore extends Flux.Store {

  constructor() {
    super();
    this.state = {
      lists: []
    }
  }

  _addList() {
    // this.state.employee.push(Seeder.make(1, "employee"));
    this.emit("change");
  }

  _setLists({data}) {
    this.setStoreState({ lists: [...data] }).emit("change");
  }

  getAll() {
    return this.state.lists;
   }

  getById(id) {
    return this.state.badge.find((item) => {
      return (item.id.toString() === id.toString());
    });
  }

  /**
 * Check if Employee is in any of the favorites lis
 * @param {string} id Id of the employee
 * @returns {bool}
 * @memberof EmployerStore
 */
  isEmployeeInFavoriteList = (id) => {
    let isFavorite = false;
    this.state.lists.map(
      list => {
        let employeesIdArr = [];
        list.employees.forEach(employee => employeesIdArr.push(employee.id));
        return isFavorite = employeesIdArr.includes(id);
      }
    );
    return isFavorite;
  }

  getEmployees = () => {
    let employeeList = [];
    const ID = EmployerStore.getEmployer().id;
    const EMPLOYER_LISTS = this.state.lists.filter(list => list.owner.id === ID);
    EMPLOYER_LISTS.forEach(list => employeeList = [...list.employees])
    return employeeList;
  }

  employeeCountFor = (id) => {
    const LIST = this.state.lists.filter(list => list.id === id);
    return LIST[0].employees.length;
  }

  getListWhereEmployeeIsFavorite = (id) => {
    let favoritedInLists = this.state.lists.filter(list => {
      list.employees.forEach(employee => {
        if (employee.id === id) {
          return true;
        }
      })
      return false;
    });
    return favoritedInLists;
  }
}
export default new FavoriteListStore();