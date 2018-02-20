import EventEmmiter from "events";

import AppDispatcher from '../../dispatcher';

class FilterConfigStore extends EventEmmiter {

  constructor() {
    super();
    this.shiftListConfig = {
      position: null,
      location: null,
      date: null,
      status: null,
    };
    this.employeesListConfig = {
      // By Profile
      profileRating: null,
      profileResponseTime: null,
      profileBadges: null,
      // By Shift
      shiftDate: null,
      shiftFromTime: null,
      shiftPosition: null,
      shiftMinHourlyRate: null,
      selectedShift: null,
    };
    this.favoritesListConfig = {
      favoritesList: null,
    }
  };

  getConfigFor(listName) {
    return this[listName + "Config"];
  }

  updateConfig(value, configOption, listName) {
    let updatedConfig = { ...this[listName + "Config"], };
    updatedConfig[configOption] = value;
    this[listName + "Config"] = updatedConfig;
    this.emit("change");
  }

  clearConfigFor(listName) {
    let updatedConfig = { ...this[listName + "Config"], };
    let options = Object.keys(updatedConfig);
    options.forEach(option => updatedConfig[option] = null);
    this[listName + "Config"] = updatedConfig;
    this.emit("change");
  }

  handleActions(action) {
    switch (action.type) {
      case 'UPDATE_CONFIG':
        this.updateConfig(action.value, action.configOption, action.listName);
        break;
      case 'CLEAR_CONFIG':
        this.clearConfigFor(action.listName);
        break;
      default:
        break;
    }
  }
}
const filterConfigStore = new FilterConfigStore();
AppDispatcher.register(action => filterConfigStore.handleActions(action));

export default filterConfigStore;