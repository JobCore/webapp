import { createBrowserHistory } from 'history';
import swal from 'sweetalert2';

import Flux from '../flux';
import { POST } from '../store/ApiRequests';
import LoginStore from '../store/LoginStore';

const GRANT_TYPE = 'password';
const CLIENT_TYPE = 'kbg5PqDEXJikWpHJoCGb3Ji0sPZXF3JTITBiqYHs';
const CLIENT_SECRET =
  'pvnprqLKpg3YmNgsaXXb4Lu2EjIB0UAOfcOSezeu1P3K5vo3Pm4JkwpfU1ACJPEoImqSbIwAt0WfuI4xnC5rvCKKtWSxoK9nvm9Uyw9gCGDBwtXtcFDNLILjArxi9Xpp';

const generateToken = (user, email, password, remember) => {
  console.log('GENERATING TOKEN');
  const CREDENTIALS = JSON.stringify({
    grant_type: GRANT_TYPE,
    client_id: CLIENT_TYPE,
    client_secret: CLIENT_SECRET,
    email,
    password,
    username: LoginStore.getUser().username,
  });

  return POST('oauth/token', CREDENTIALS)
    .then(data => {
      if (remember) {
        localStorage.setItem('token', `${data.access_token}`);
      }
      return data.access_token;
    })
    .catch(err => console.error(err));
};

class LoginActions extends Flux.Action {
  registerUser(params) {
    if (params.email.length < 1 || params.password.length < 6 || params.username.length < 1) {
      return swal({
        title: 'Empty fields',
        type: 'error',
        html: 'One of the following fields might be empty: <br/> username, email, password',
      });
    }
    // Send the action to all stores through the Dispatcher
    const DATA = JSON.stringify({
      username: params.username,
      first_name: params.firstname || '',
      last_name: params.lastname || '',
      email: params.email,
      password: params.password,
      type: params.isEmployer ? 'employer' : 'employee',
    });
    POST('register', DATA)
      .then(() => {
        this.loginUser(params);
      })
      .catch(err => console.error(err));
  }

  loginUser(params) {
    if (params.email.length < 1 || params.password.length < 1) {
      return null;
    }
    // Send the action to all stores through the Dispatcher
    const DATA = JSON.stringify({
      email: params.email,
      password: params.password,
    });
    POST('login', DATA)
      .then(user => {
        if (user.token) {
          user = {
            ...user,
            token: JSON.parse(user.token),
          };
        } else if (user.error) {
          throw Error(user.error);
        }
        this.dispatch('LoginStore.setUserLogin', {
          data: user,
        });
        if (user.token == null || user.token.expired) {
          // If no Token is received
          // or if token is expired, generate one
          generateToken(user, params.email, params.password, params.remember).then(token => this.setToken(token));
        }
      })
      .then(() => {
        if (params.remember) {
          const { token } = LoginStore.getUser();
          localStorage.setItem('token', `${token.token}`);
        }
      })
      .catch(err =>
        swal({
          type: 'error',
          title: `${err}`,
        })
      );
  }

  logoutUser() {
    // Send the action to all stores through the Dispatcher
    this.dispatch('LoginStore.logoutUser');
    localStorage.removeItem('token');
    const history = createBrowserHistory();
    history.push('login');
  }

  setToken(token) {
    this.dispatch('LoginStore.setUserToken', {
      data: token,
    });
  }

  getUserFromLocalToken(token) {
    POST('tokenuser', JSON.stringify({ token }))
      .then(user => {
        this.dispatch('LoginStore.setUserLogin', {
          data: user,
        });
      })
      .catch(err => console.error(err));
  }
}
export default new LoginActions();
