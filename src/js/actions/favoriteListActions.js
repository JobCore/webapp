import Flux from "../flux"
import {GET} from '../store/ApiRequests';

class FavoriteListActions extends Flux.Action{
  getAll() {
    GET("favlists").then(
        lists => this.dispatch("FavoriteListStore.setLists", {
        data: lists
      })
    )
  }
}
export default new FavoriteListActions();