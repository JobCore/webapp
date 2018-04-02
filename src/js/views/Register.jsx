import React from 'react';
import { Redirect } from 'react-router-dom';

import Flux from '../flux';
import LoginStore from '../store/LoginStore';
import LoginActions from '../actions/loginActions.js';

export class Register extends Flux.View {
  render() {
    if (LoginStore.getUser()) {
      return <Redirect to="private" />;
    }
    return (
      <div className="container text-white">
        <div className="form-signin">
          <h2 className="form-signin-heading">Please register</h2>
          <label htmlFor="inputUsername" className="sr-only">
            Username
          </label>
          <input
            type="text"
            id="inputUsername"
            className="form-control"
            placeholder="Username"
            required
            ref={el => {
              this.username = el;
            }}
          />
          <label htmlFor="inputUsername" className="sr-only">
            First Name
          </label>
          <input
            type="text"
            id="inputFirstName"
            className="form-control"
            placeholder="First name"
            ref={el => {
              this.firstname = el;
            }}
          />
          <label htmlFor="inputUsername" className="sr-only">
            Last Name
          </label>
          <input
            type="text"
            id="inputLastName"
            className="form-control"
            placeholder="Last name"
            ref={el => {
              this.lastname = el;
            }}
          />
          <label htmlFor="inputEmail" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id="inputEmail"
            className="form-control"
            placeholder="Email address"
            required
            ref={el => {
              this.email = el;
            }}
          />
          <label htmlFor="inputPassword" className="sr-only">
            Password
          </label>
          <input
            type="password"
            id="inputPassword"
            className="form-control"
            placeholder="Password"
            required
            ref={el => {
              this.password = el;
            }}
          />
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                name="userType"
                id="inputType"
                ref={el => {
                  this.isEmployer = el;
                }}
              />
              Looking to hire
            </label>
          </div>
          <button
            onClick={() =>
              LoginActions.registerUser({
                username: this.username.value,
                firstname: this.firstname.value,
                lastname: this.lastname.value,
                email: this.email.value,
                password: this.password.value,
                isEmployer: this.isEmployer.checked,
              })
            }
            className="btn btn-lg btn-primary btn-block"
          >
            Register
          </button>
        </div>
      </div>
    );
  }
}
