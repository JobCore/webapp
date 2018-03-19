import Flux from "../flux";
import {GET} from '../store/ApiRequests';
import LoginStore from "../store/LoginStore";

class EmployerActions extends Flux.Action{
  addEmployer() {
    this.dispatch('EmployerStore.addEmployer');
  }

  get() {
    GET("employers").then(
        employers => {
          let employer = employers.filter(data => data.profile.user.id === LoginStore.getUser().id);
          this.dispatch("EmployerStore.setEmployer", {
            data: employer[0]
          })
        }
    )
  }
}
export default new EmployerActions();
