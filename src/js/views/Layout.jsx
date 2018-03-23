import React from "react";
import Flux from "../flux"
import { PrivateRoute } from '../components/utils/index'
import { BrowserRouter, Route, Switch } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";

import { Navbar } from "../components/utils/Navbar";

import LoginStore from "../store/LoginStore";
import LoginActions from "../actions/loginActions";

import { Home } from "../views/Home";
import { Login } from "../views/Login";
import { Private } from "../views/Private";
import { ListShifts } from "../views/shifts/ListShifts";
import { EmployeeDetails } from "../views/employees/EmployeeDetails";
import { ListEmployee } from "../views/employees/ListEmployee";
import { FavoriteEmployeesList } from "../views/employees/FavoriteEmployeesList";
import CreateShift from '../views/shifts/CreateShift';
import ShiftDetails from "../views/shifts/ShiftDetails";


export class Layout extends Flux.View {

  constructor() {
    super();

    this.state = {
      authenticated: false,
      user: null,
      // user: EmployerStore.getEmployer(),
    };
    this.bindStore(LoginStore, this.setUser.bind(this));
    // this.bindStore(LoginStore, this.handleAutentication.bind(this));
  }

  // handleAutentication() {
  //   let isLoggedIn = LoginStore.isLoggedIn();
  //   console.log("User autentication status: ", );
  //   this.setState({
  //     authenticated: isLoggedIn,
  //     user: EmployerStore.getEmployer(),
  //   });
  // }

  setUser = () => {
    this.setState({
      authenticated: true,
      user: LoginStore.getUser(),
    });
  }

  render() {
    // console.log(this.state.user);
    return (
      <BrowserRouter>
        <div>
          <Navbar authenticated={this.state.authenticated} onLogout={() => LoginActions.logoutUser(createBrowserHistory())} />
          <div className="content-wrapper">
            <Switch>
              <PrivateRoute exact path='/' component={Home} />
              <Route exact path='/login' component={Login} />
              <PrivateRoute exact path='/private' loggedIn={this.state.authenticated} component={Private} />
              <PrivateRoute exact path='/shift/create' loggedIn={this.state.authenticated} component={CreateShift} />
              <PrivateRoute exact path='/shift/list' loggedIn={this.state.authenticated} component={ListShifts} />
              <PrivateRoute exact path='/shift/:id/:isEditing?' loggedIn={this.state.authenticated} component={ShiftDetails} />
              <PrivateRoute exact path='/talent/favorites' loggedIn={this.state.authenticated} component={FavoriteEmployeesList} />
              <PrivateRoute exact path='/talent/list' loggedIn={this.state.authenticated} component={ListEmployee} />
              <PrivateRoute exact path='/talent/:id/offer' loggedIn={this.state.authenticated} component={ListShifts} />
              <PrivateRoute exact path='/talent/:id' loggedIn={this.state.authenticated} component={EmployeeDetails} />
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