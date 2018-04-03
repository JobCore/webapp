import React from 'react';
import swal from 'sweetalert2';

import { POST } from '../store/ApiRequests';

const ResetPassword = () => (
  <div className="container text-white">
    <div className="form-signin">
      <h2 className="form-signin-heading">Please enter your email</h2>
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
      <button
        onClick={() => {
          if (this.email.value.length > 1) {
            document.querySelector('button').innerHTML = 'Loading...';
            POST(
              'password_reset',
              JSON.stringify({
                email: this.email.value,
              })
            )
              .then(data => {
                document.querySelector('button').innerHTML = 'Submit';
                if (data.error) {
                  throw Error('Email not found');
                }
                swal({
                  type: 'success',
                  title: 'Email Sent',
                  html: 'A link has been sent to your email <br /> in order to reset your password',
                });
              })
              .catch(err =>
                swal({
                  type: 'error',
                  title: 'Error sending email',
                  html: `${err}`,
                })
              );
          }
        }}
        className="btn btn-lg btn-primary btn-block"
      >
        Submit
      </button>
    </div>
  </div>
);

export default ResetPassword;
