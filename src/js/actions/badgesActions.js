import Flux from '../flux';
import { GET } from '../store/ApiRequests';

class BadgesActions extends Flux.Action {
  getAll() {
    GET('badges').then(badges =>
      this.dispatch('BadgesStore.setBadges', {
        data: badges,
      })
    );
  }
}
export default new BadgesActions();
