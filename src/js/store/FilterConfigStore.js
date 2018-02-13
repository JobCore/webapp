import EventEmmiter from "events";

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
      shiftUntilTime: null,
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
}
export default new FilterConfigStore();