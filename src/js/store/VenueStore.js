import Flux from '../flux.js';

class VenueStore extends Flux.Store {
  constructor() {
    super();
    this.state = {
      venues: []
    }
  }

  _setVenues({data}) {
    this.setStoreState({
      venues: [...data]
    }).emit("change");
  }

  getAll() {
    return this.state.venues;
  }

}
export default new VenueStore();