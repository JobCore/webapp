import React from 'react';
import { Redirect, Link } from 'react-router-dom';

import Flux from '../flux';
import LoginActions from '../actions/loginActions.js';
import LoginStore from '../store/LoginStore';

export class Login extends Flux.View {
  render() {
    if (LoginStore.getUser()) {
      return <Redirect to="private" />;
    }
    return (
      <div className="container text-white">
        <div className="form-signin">
          <h2 className="form-signin-heading">Please sign in</h2>
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
                ref={el => {
                  this.remember = el;
                }}
              />
              Remember me
            </label>
            <Link className="forgot-password" to="reset">
              Forgot password?
            </Link>
          </div>
          <button
            onClick={() =>
              LoginActions.loginUser({
                email: this.email.value,
                password: this.password.value,
                remember: this.remember.checked,
              })
            }
            className="btn btn-lg btn-primary btn-block"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }
}
