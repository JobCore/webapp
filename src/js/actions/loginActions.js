import Flux from "../flux"

class LoginActions extends Flux.Action{
  loginUser(history){
    // Send the action to all stores through the Dispatcher
    this.dispatch("LoginStore.setUserLogin");
    history.push('/private');
  }
  
  logoutUser(history){
    // Send the action to all stores through the Dispatcher
    this.dispatch("LoginStore.loggoutUser");
    history.push('/login');
  }
}
export default new LoginActions();