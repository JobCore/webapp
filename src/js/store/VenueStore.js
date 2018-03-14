import Flux from '../flux.js';
import Seeder from "./Seeder.js";

class VenueStore extends Flux.Store {
  constructor() {
    super();
    this.state.venue = Seeder.make(20, "venue");
  }

  getAll() {
    return this.state.venue;
  }

}
export default new VenueStore();