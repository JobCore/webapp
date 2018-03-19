import Flux from '../flux.js';

class PositionsStore extends Flux.Store {
  constructor() {
    super();
    this.state = {
      positions: []
    }
  }

  _setPositions({data}) {
    this.setStoreState({
      positions: [...data]
    }).emit("change");
  }

  getAll() {
    return this.state.positions;
  }

}
export default new PositionsStore();