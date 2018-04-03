import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Flux from '../flux';
import { PrivateRoute } from '../components/utils/index';

import { Navbar } from '../components/utils/Navbar';

import LoginStore from '../store/LoginStore';
import LoginActions from '../actions/loginActions';
import EmployeeActions from '../actions/employeeActions';
import EmployerActions from '../actions/employerActions';
import ShiftActions from '../actions/shiftActions';
import FavoriteListActions from '../actions/favoriteListActions';
import BadgesActions from '../actions/badgesActions';
import VenueActions from '../actions/venueActions';
import PositionsActions from '../actions/positionsActions';

import { Home } from '../views/Home';
import { Login } from '../views/Login';
import { Private } from '../views/Private';
import { ListShifts } from '../views/shifts/ListShifts';
import { EmployeeDetails } from '../views/employees/EmployeeDetails';
import { ListEmployee } from '../views/employees/ListEmployee';
import { FavoriteEmployeesList } from '../views/employees/FavoriteEmployeesList';
import CreateShift from '../views/shifts/CreateShift';
import ShiftDetails from '../views/shifts/ShiftDetails';
import EmployerProfile from './employer/EmployerProfile';
import Register from './Register';
import ResetPassword from './ResetPassword';
import MenuStore from '../store/MenuStore';
import EmployeeProfile from './employees/EmployeeProfile';

export class Layout extends Flux.View {
  constructor() {
    super();
    this.state = {
      isAuthenticated: LoginStore.isAuthenticated(),
      user: LoginStore.getUser(),
    };
    this.bindStore(LoginStore, this.setUser.bind(this));
  }

  updateResources = () => {
    if (this.state.user && this.state.user.token && !this.state.user.token.expired) {
      EmployerActions.get();
      EmployeeActions.getAll();
      ShiftActions.getAll();
      FavoriteListActions.getAll();
      BadgesActions.getAll();
      VenueActions.getAll();
      PositionsActions.getAll();
      MenuStore.generateMenu();
    }
  };

  checkIfTokenRemembered = () => {
    if (!this.state.user && localStorage.getItem('token')) {
      LoginActions.getUserFromLocalToken(localStorage.getItem('token'), createBrowserHistory());
    }
  };

  setUser = () => {
    this.setState({
      user: LoginStore.getUser(),
      isAuthenticated: LoginStore.isAuthenticated(),
    });
  };

  render() {
    this.updateResources();
    this.checkIfTokenRemembered();
    return (
      <BrowserRouter>
        <div>
          <Navbar
            authenticated={this.state.isAuthenticated}
            onLogout={() => LoginActions.logoutUser(createBrowserHistory())}
          />
          <div className="content-wrapper">
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/reset" component={ResetPassword} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/private" loggedIn={this.state.isAuthenticated} component={Private} />
              <PrivateRoute exact path="/employee" loggedIn={this.state.isAuthenticated} component={EmployeeProfile} />
              <PrivateRoute exact path="/employer" loggedIn={this.state.isAuthenticated} component={EmployerProfile} />
              <PrivateRoute exact path="/shift/create" loggedIn={this.state.isAuthenticated} component={CreateShift} />
              <PrivateRoute exact path="/shift/list" loggedIn={this.state.isAuthenticated} component={ListShifts} />
              <PrivateRoute
                exact
                path="/shift/:id/:isEditing?"
                loggedIn={this.state.isAuthenticated}
                component={ShiftDetails}
              />
              <PrivateRoute
                exact
                path="/talent/favorites"
                loggedIn={this.state.isAuthenticated}
                component={FavoriteEmployeesList}
              />
              <PrivateRoute exact path="/talent/list" loggedIn={this.state.isAuthenticated} component={ListEmployee} />
              <PrivateRoute
                exact
                path="/talent/:id/offer"
                loggedIn={this.state.isAuthenticated}
                component={ListShifts}
              />
              <PrivateRoute
                exact
                path="/talent/:id"
                loggedIn={this.state.isAuthenticated}
                component={EmployeeDetails}
              />
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
