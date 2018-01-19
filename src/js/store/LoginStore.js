import BaseStore from "./BaseStore.js";
import AppDispatcher from "../dispatcher.js";

class LoginStore extends BaseStore {

  constructor() {

    super();
    // First we register to the Dispatcher to listen for actions.
    this.subscribe(() => this._registerToActions.bind(this));
    this._user = null;
  }

  _registerToActions(action) {
    if (typeof (action) == "undefined") return;
    switch (action.actionType) {
    case "USER_LOGGED_IN":
      console.log("The user has logged in");
      this._user = {
        "name": "Alejandro Sanchez",
      };
      this.emitChange();
      break;
    case "USER_LOGGED_OUT":
      console.log("The user has logged out");
      this._user = null;
      this.emitChange();
      break;
    default:
      break;
    }
  }

  // Just getters for the properties it got from the action.
  get user() {
    return this._user;
  }

  isLoggedIn() {
    return !!this._user;
  }
}
export default new LoginStore();