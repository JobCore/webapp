import Flux from '../flux';
import { GET } from '../store/ApiRequests';

class VenueActions extends Flux.Action {
  getAll() {
    GET('venues').then(venues =>
      this.dispatch('VenueStore.setVenues', {
        data: venues,
      })
    );
  }
}
export default new VenueActions();
