import Flux from "../flux"
import {GET} from '../store/ApiRequests';

class PositionsActions extends Flux.Action{
  getAll() {
    GET("positions").then(
        positions => this.dispatch("PositionsStore.setPositions", {
        data: positions
      })
    )
  }
}
export default new PositionsActions();