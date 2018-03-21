import Flux from "../flux";

class EmployerStore extends Flux.Store {
  /**
   * Creates an instance of EmployerStore.
   * @memberof EmployerStore
   */
  constructor() {
    super();
    this.state = {
      employer: null
    }
  }

  _setEmployer({data}) {
    this.setStoreState({
      employer: data
    }).emit("change");
  }

  /**
   *  Creates a new Employer
   * @memberof EmployerStore
   */
  _addEmployer = () => {
    this.emit("change");
  }

  /**
   * Returns the info of the current Employer
   * @returns {Object}
   * @memberof EmployerStore
   */
  getEmployer = () => {
    return this.state.employer;
  }

  /**
   * Creates a new List for the Employer
   * @param {string} listName Name of the list to be added
   * @memberof EmployerStore
   */
  _addNewList = (params) => {
    this.state.employer.favoriteLists[params.listName] = [];
    this.emit("change");
  }

  /**
   * Delete list from Employer's Favorites Lists
   * @param {string} listName List to be deleted
   * @memberof EmployerStore
   */
  _removeFavoritesLists = (params) => {
    const lists = this.state.employer.favoriteLists;
    delete lists[params.listName];
    this.emit("change");
  }

  /**
   * Add a new employee to a list
   * @param {number} id Id of employer to be added
   * @param {string} list List where it should be added
   * @memberof EmployerStore
   */
  _addEmployeeToFavList = (params) => {
    this.state.employer.favoriteLists[params.list].push(params.id);
    this.emit("change");
  }

  /**
   * Removes a certain employee from a list
   * If no List is provided, the employee is removed from every list
   * @param {number} id Id of employer to be removed
   * @param [{string}] list List where it should be removed
   * @memberof EmployerStore
   */
  _removeEmployeeFromFavList = (params) => {
    if (!params.list) {
      for (const key in this.state.employer.favoriteLists) {
        let index = this.state.employer.favoriteLists[key].indexOf(params.id);
        if (index !== -1) this.state.employer.favoriteLists[key].splice(index, 1);
      }
      this.emit("change");
    } else {
      let index = this.state.employer.favoriteLists[params.list].indexOf(params.id);
      this.state.employer.favoriteLists[params.list].splice(index, 1);
      this.emit("change");
    }
  }

  /**
   * Renames a list from employer's favorites lists
   * @param {string} prevListName List to be replaced
   * @param {string} newListName New list name
   * @memberof EmployerStore
   */
  _renameFavoritesLists = (params) => {
    this.state.employer.favoriteLists[params.newListName] = this.state.employer.favoriteLists[params.prevListName];
    delete this.state.employer.favoriteLists[params.prevListName];
    this.emit("change");
  }

}
export default new EmployerStore();