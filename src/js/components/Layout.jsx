import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";

import { Navbar } from "./utils/Navbar.jsx";
import { Home } from "./views/Home.jsx";
import { Login } from "./views/Login.jsx";
import { Example } from "./views/Example.jsx";
import { Private } from "./views/Private.jsx";
import { ListShifts } from "./views/shifts/ListShifts.jsx";
import { SingleShift } from "./views/shifts/SingleShift.jsx";
import EmployeeDetails from "./views/employees/EmployeeDetails.jsx";
import { ListEmployee } from "./views/employees/ListEmployee.jsx";

import LoginStore from "../store/LoginStore.js";
import LoginActions from "../actions/loginActions.js";
import EmployerStore from "../store/EmployerStore";
import FavoriteEmployeesList from "./views/employees/FavoriteEmployeesList";
//import {SingleEmployee} from './views/shifts/ListShifts.jsx';

export class Layout extends React.Component {

  constructor() {
    super();

    this.state = {
      authenticated: false,
      user: null,
      // user: EmployerStore.getEmployer(),
    };
  }

  componentWillMount() {
    LoginStore.on("CHANGE", this.handleAutentication.bind(this));
  }

  componentWillUnmount() {
    LoginStore.removeListener("CHANGE", this.handleAutentication);
  }

  handleAutentication() {
    console.log("User autentication status: ", LoginStore.isLoggedIn());
    this.setState({
      authenticated: LoginStore.isLoggedIn(),
      user: EmployerStore.getEmployer(),
    });
  }

  renderLogin() {
    return (<BrowserRouter>
      <Route path='/' component={Login} />
    </BrowserRouter>);
  }

  render() {
    if (!this.state.authenticated) return this.renderLogin();
    return (
      <BrowserRouter>
        <div>
          <Navbar authenticated={this.state.authenticated} onLogout={() => {
            LoginActions.logoutUser(createBrowserHistory());
          }} />
          <div className="content-wrapper">
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/examples' component={Example} />
              <Route exact path='/private' component={Private} />
              <Route exact path='/shift/list' component={ListShifts} />
              <Route exact path='/shift/:id' component={SingleShift} />
              <Route exact path='/talent/favorites' component={FavoriteEmployeesList} />
              <Route exact path='/talent/list' component={ListEmployee} />
              <Route exact path='/talent/:id' component={EmployeeDetails} />
              <Route render={() => <p className="text-center mt-5">Not found</p>} />
            </Switch>
            <footer className="sticky-footer">
              <div className="container">
                <div className="text-center">
                  <small>Copyright © Job Core Inc</small>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}