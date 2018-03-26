import Flux from '../flux.js';

class PositionsStore extends Flux.Store {
  constructor() {
    super();
    this.state = {
      positions: [],
    };
  }

  _setPositions({ data }) {
    this.setStoreState({
      positions: [...data],
    }).emit('change');
  }

  getAll() {
    return this.state.positions;
  }

  getById(id) {
    return this.state.positions.find(item => item.id.toString() === id.toString());
  }
}
export default new PositionsStore();
