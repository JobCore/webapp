// LoginAction.js

import AppDispatcher from "../dispatcher.js";

export default {
  loginUser: (history) => {
    // Send the action to all stores through the Dispatcher
    history.push("/private");
    AppDispatcher.dispatch({
      actionType: "USER_LOGGED_IN",
    });
  },
  logoutUser: (history) => {
    // Send the action to all stores through the Dispatcher
    history.push("/home");
    AppDispatcher.dispatch({
      actionType: "USER_LOGGED_OUT",
    });
  },
};