import EventEmmiter from "events";
import EmployeeStore from "./EmployeeStore";

import Seeder from "./Seeder.js";
class EmployerStore extends EventEmmiter {

  constructor() {
    super();
    this.employer = Seeder.make(1, "employer");
  }

  addEmployer() {
    this.employer.push(Seeder.make(1, "employer"));
    this.emit("change");
  }

  getEmployer() {
    return this.employer;
  }

  addNewList(event) {
    this.employer.favoriteLists[event.target.value] = [];
    this.emit("change");
  }

  addEmployeeToFavList(id, list) {
    this.employer.favoriteLists[list].push(id);
    this.emit("change");
  }

  removeEmployeeFromFavList(id, list) {
    let index = this.employer.favoriteLists[list].indexOf(id);
    this.employer.favoriteLists[list].splice(index, 1);
    this.emit("change");
  }

  isEmployeeInFavoriteList = (id) => {
    let isFavorite = false;
    const lists = Object.keys(this.employer.favoriteLists);
    lists.map(list => this.employer.favoriteLists[list].includes(id) ? isFavorite = true : null);
    return isFavorite;
  }

  getFavorites() {
    let favorites = [];
    const lists = this.employer.favoriteLists;
    for (const key in lists) {
      lists[key].forEach(employeeId => {
        let employee = EmployeeStore.getById(employeeId);
        if (!favorites.includes(employee)) { favorites.push(employee)};
      })
    }
    return  favorites;
  }
}
export default new EmployerStore();