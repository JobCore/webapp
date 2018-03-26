import Flux from '../flux';

class BadgesStore extends Flux.Store {
  constructor() {
    super();
    this.state = {
      badges: [],
    };
  }

  addBadge() {
    this.emit('change');
  }

  _setBadges({ data }) {
    this.setStoreState({
      badges: [...data],
    }).emit('change');
  }

  getAll() {
    return this.state.badges;
  }

  getById(id) {
    return this.state.badges.find(item => item.id.toString() === id.toString());
  }
}
export default new BadgesStore();
