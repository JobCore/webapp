import EventEmmiter from "events";
import AppDispatcher from '../../dispatcher';

import Seeder from "./Seeder.js";

class VenueStore extends EventEmmiter {
  constructor() {
    super();
    this.venue = Seeder.make(20, "venue");
  }

  getAll() {
    return this.venue;
  }

  handleActions(action) {
    switch (action.type) {
      default:
        break;
    }
  }
}

const venueStore = new VenueStore();
AppDispatcher.register(action => venueStore.handleActions(action));

export default venueStore;