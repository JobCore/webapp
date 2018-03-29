import Flux from '../flux';

class LoginStore extends Flux.Store {
  constructor() {
    super();
    this.state = {
      user: null,
    };
  }

  _setUserLogin({ data }) {
    this.setStoreState({
      user: data,
    }).emit();
    console.log('The user has logged in');
  }

  _setUserToken({ data }) {
    this.setStoreState({
      user: {
        ...this.state.user,
        token: {
          token: data,
          expired: false,
        },
      },
    }).emit();
  }

  _logoutUser() {
    this.setStoreState({ user: null }).emit();
    console.log('The user has logged out');
  }

  isAuthenticated() {
    return this.state.user != null;
  }

  // Just getters for the properties it got from the action.
  getUser() {
    return this.state.user;
  }

  getToken() {
    if (this.state.user && this.state.user.token) {
      return this.state.user.token.token;
    }
    return null;
  }
}
export default new LoginStore();
