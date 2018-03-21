import Flux from "../flux";
import FavoriteListStore from '../store/FavoriteListStore';
import VenuesStore from '../store/VenueStore';
import PositionsStore from '../store/PositionsStore';

class FilterConfigStore extends Flux.Store {

  constructor() {
    super();
    this.shiftListConfig = {
      position: null,
      location: null,
      date: null,
      untilDate: null,
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

  _updateConfig(params) {
    switch (params.configOption) {
      case "favoritesList":
        params.value = FavoriteListStore.getById(params.value);
        break;
      case "shiftLocation":
        params.value = VenuesStore.getById(params.value);
        break;
      case "shiftPosition":
        params.value = PositionsStore.getById(params.value);
        break;
      default:
        break;
    }

    let updatedConfig = { ...this[params.listName + "Config"], };
    updatedConfig[params.configOption] = params.value;
    this[params.listName + "Config"] = updatedConfig;
    this.emit("change");
  }

  _clearConfigFor(params) {
    let updatedConfig = { ...this[params.listName + "Config"], };
    let options = Object.keys(updatedConfig);
    options.forEach(option => updatedConfig[option] = null);
    this[params.listName + "Config"] = updatedConfig;
    this.emit("change");
  }

}
export default new FilterConfigStore();