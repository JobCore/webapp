import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";

import { Navbar } from "./utils/Navbar";

import LoginStore from "../store/LoginStore";
import LoginActions from "../actions/loginActions";
import EmployerStore from "../store/EmployerStore";

import { Home } from "../views/Home";
import { Login } from "../views/Login";
import { Example } from "../views/Example";
import { Private } from "../views/Private";
import { ListShifts } from "../views/shifts/ListShifts";
import { SingleShift } from "../views/shifts/SingleShift";
import { EmployeeDetails } from "../views/employees/EmployeeDetails";
import { ListEmployee } from "../views/employees/ListEmployee";
import { FavoriteEmployeesList } from "../views/employees/FavoriteEmployeesList";


export class Layout extends Component {

  constructor() {
    super();

    this.state = {
      authenticated: true,
      // user: null,
      user: EmployerStore.getEmployer(),
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