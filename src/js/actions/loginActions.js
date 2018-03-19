import Flux from "../flux";
import {GET} from '../store/ApiRequests';

class LoginActions extends Flux.Action{
  loginUser(history){
    // Send the action to all stores through the Dispatcher
      GET("user", 1).then(
        user => this.dispatch("LoginStore.setUserLogin", {
        data: user
      })
    ).then(() => history.push('/private'));
  }

  logoutUser(history){
    // Send the action to all stores through the Dispatcher
    this.dispatch("LoginStore.loggoutUser");
    history.push('/login');
  }
}
export default new LoginActions();