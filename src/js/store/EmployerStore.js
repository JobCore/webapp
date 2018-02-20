import EventEmmiter from "events";
import AppDispatcher from '../../dispatcher';
import EmployeeStore from "./EmployeeStore";

import Seeder from "./Seeder.js";
class EmployerStore extends EventEmmiter {
  /**
   * Creates an instance of EmployerStore.
   * @memberof EmployerStore
   */
  constructor() {
    super();
    this.employer = Seeder.make(1, "employer");
  }

  /**
   *  Creats a new Employer
   * @memberof EmployerStore
   */
  addEmployer = () => {
    this.employer.push(Seeder.make(1, "employer"));
    this.emit("change");
  }

  /**
   * Returns the info of the current Employer
   * @returns {Object}
   * @memberof EmployerStore
   */
  getEmployer = () => {
    return this.employer;
  }

  /**
   * Creates a new List for the Employer
   * @param {string} listName Name of the list to be added
   * @memberof EmployerStore
   */
  addNewList = (listName) => {
    this.employer.favoriteLists[listName] = [];
    this.emit("change");
  }

  /**
   * Delete list from Employer's Favorites Lists
   * @param {string} listName List to be deleted
   * @memberof EmployerStore
   */
  removeFavoritesLists = (listName) => {
    const lists = this.employer.favoriteLists;
    delete lists[listName];
    this.emit("change");
  }

  /**
   * Add a new employee to a list
   * @param {number} id Id of employer to be added
   * @param {string} list List where it should be added
   * @memberof EmployerStore
   */
  addEmployeeToFavList = (id, list) => {
    this.employer.favoriteLists[list].push(id);
    this.emit("change");
  }

  /**
   * Removes a certain employee from a list
   * If no List is provided, the employee is removed from every list
   * @param {number} id Id of employer to be removed
   * @param [{string}] list List where it should be removed
   * @memberof EmployerStore
   */
  removeEmployeeFromFavList = (id, list) => {
    if (!list) {
      for (const key in this.employer.favoriteLists) {
        let index = this.employer.favoriteLists[key].indexOf(id);
        if (index !== -1) this.employer.favoriteLists[key].splice(index, 1);
      }
      this.emit("change");
    } else {
      let index = this.employer.favoriteLists[list].indexOf(id);
      this.employer.favoriteLists[list].splice(index, 1);
      this.emit("change");
    }
  }

  /**
   * Check if Employee is in any of the favorites lis
   * @param {string} id Id of the employee
   * @returns {bool}
   * @memberof EmployerStore
   */
  isEmployeeInFavoriteList = (id) => {
    let isFavorite = false;
    const lists = Object.keys(this.employer.favoriteLists);
    lists.map(list => this.employer.favoriteLists[list].includes(id) ? isFavorite = true : null);
    return isFavorite;
  }

  /**
   * Returns an array with all the employees marked as favorite on any list
   * @returns {array}
   * @memberof EmployerStore
   */
  getFavorites = (listName) => {
    let favorites = [];
    if (listName && listName != null) {
      const idArr = this.getFavoritesListsEmployeeIds(listName);
      idArr.forEach(id => favorites.push(EmployeeStore.getById(id)));
    } else {
      const lists = this.employer.favoriteLists;
      for (const key in lists) {
        lists[key].forEach(employeeId => {
          let employee = EmployeeStore.getById(employeeId);
          if (!favorites.includes(employee)) { favorites.push(employee)};
        })
      }
    }
    return favorites;
  }

  /**
   * Returns and object with the Employer's favorites lists
   * @returns {Object}
   * @memberof EmployerStore
   */
  getFavoritesLists = () => {
    return this.employer.favoriteLists;
  }

  getListWhereEmployeeIsFavorite = (id) => {
    let favLists = this.employer.favoriteLists;
    let favoritedInLists = [];
    Object.keys(favLists).map(key => {
      if (favLists[key].includes(id)) {
        favoritedInLists.push(key);
      };
      return 1;
    });
    return favoritedInLists;
  }

  /**
   * Get Employee Ids from a certain list
   * @param {string} listName List to get employees from
   * @returns {array} Array of employee Ids
   * @memberof EmployerStore
   */
  getFavoritesListsEmployeeIds = (listName) => {
    return this.employer.favoriteLists[listName];
  }

  /**
   * Renames a list from employer's favorites lists
   * @param {string} prevListName List to be replaced
   * @param {string} newListName New list name
   * @memberof EmployerStore
   */
  renameFavoritesLists = (prevListName, newListName) => {
    this.employer.favoriteLists[newListName] = this.employer.favoriteLists[prevListName];
    delete this.employer.favoriteLists[prevListName];
    this.emit("change");
  }

  handleActions(action) {
    switch (action.type) {
      case 'ADD_EMPLOYER':
        this.addEmployer();
        break;
      case 'ADD_NEW_FAVORITE_LIST':
        this.addNewList(action.listName);
        break;
      case 'REMOVE_FAVORITE_LIST':
        this.removeFavoritesLists(action.listName);
        break;
      case 'RENAME_FAVORITE_LIST':
        this.renameFavoritesLists(action.prevListName, action.newListName);
        break;
      case 'ADD_EMPLOYEE_TO_FAVORITE_LIST':
        this.addEmployeeToFavList(action.id, action.list);
        break;
      case 'REMOVE_EMPLOYEE_FROM_FAVORITE_LIST':
        this.removeEmployeeFromFavList(action.id, action.list);
        break;
      default:
        break;
    }
  }
}

const employerStore = new EmployerStore();
AppDispatcher.register(action => employerStore.handleActions(action));

export default employerStore;