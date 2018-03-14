import Flux from "../flux"
class LoginStore extends Flux.Store {

  constructor() {
    super();
    this.state.user = null;
  }

  _setUserLogin(){
      this.setStoreState({
        user: { id: "ale_01", name: "Alejandro Sanchez"}
      }).emit();
      
      console.log("The user has logged in");
  }
  _loggoutUser(){
      this.setStoreState({ user: null }).emit();
  }

  // Just getters for the properties it got from the action.
  getUser() { return this.state.user; }
  isLoggedIn() { return !!this.state.user; }
}
export default new LoginStore();