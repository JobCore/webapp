import loginActions from '../actions/loginActions';
import LoginStore from './LoginStore';

const rootAPIendpoint = 'http://127.0.0.1:8000/api';

const HEADERS = {
  'Content-Type': 'application/json',
};

const getToken = () => {
  if (localStorage.getItem('token')) {
    return localStorage.getItem('token');
  } else if (LoginStore) {
    return LoginStore.getToken();
  }
  return null;
};

/* AVAILABLE MODELS
  - badges
  - employees
  - employers
  - favlists
  - positions
  - profiles
  - shifts
  - venues
  - oauth/token (generate token)
  - tokenuser (get user data from local saved token)
*/

/**
 * Fetch JSON from API through GET method
 * @param {string} model Model data to be fetched. **Must be plural**
 * @returns {data}
 */
export const GET = async (model, id = '', extraHeaders = {}) => {
  const response = await fetch(`${rootAPIendpoint}/${model}/${id}`, {
    method: 'GET',
    headers: new Headers({
      ...HEADERS,
      ...extraHeaders,
      Authorization: `Bearer ${getToken()}`,
    }),
  }).catch(err => {
    throw new Error(`Could not GET models from API due to -> ${err}`);
  });
  const data = await response.json();
  if (data.detail) {
    loginActions.logoutUser();
    return 0;
  }
  return data;
};

export const POST = async (model, postData, extraHeaders = {}) => {
  const response = await fetch(`${rootAPIendpoint}/${model}/`, {
    method: 'POST',
    headers: new Headers({
      ...HEADERS,
      ...extraHeaders,
      Authorization: `Bearer ${getToken()}`,
    }),
    body: postData,
  }).catch(err => {
    throw new Error(`Could not POST model to API due to -> ${err}`);
  });
  const data = await response.json();
  if (data.detail) {
    loginActions.logoutUser();
    return 0;
  }
  return data;
};

export const PUT = async (model, id, putData, extraHeaders = {}) => {
  const response = await fetch(`${rootAPIendpoint}/${model}/${id}`, {
    method: 'PUT',
    headers: new Headers({
      ...HEADERS,
      ...extraHeaders,
      Authorization: `Bearer ${getToken()}`,
    }),
    body: putData,
  }).catch(err => {
    throw new Error(`Could not UPDATE model on API due to -> ${err}`);
  });
  const data = await response.json();
  if (data.detail) {
    loginActions.logoutUser();
    return 0;
  }
  return data;
};

export const PATCH = async (model, id, putData, extraHeaders = {}) => {
  const response = await fetch(`${rootAPIendpoint}/${model}/${id}`, {
    method: 'PATCH',
    headers: new Headers({
      ...HEADERS,
      ...extraHeaders,
      Authorization: `Bearer ${getToken()}`,
    }),
    body: putData,
  }).catch(err => {
    throw new Error(`Could not UPDATE model on API due to -> ${err}`);
  });
  const data = await response.json();
  if (data.detail) {
    loginActions.logoutUser();
    return 0;
  }
  return data;
};

export const DELETE = async (model, id = '', extraHeaders = {}) => {
  await fetch(`${rootAPIendpoint}/${model}/${id}`, {
    method: 'DELETE',
    headers: new Headers({
      ...HEADERS,
      extraHeaders,
    }),
  }).catch(err => {
    throw new Error(`Could not GET models from API due to -> ${err}`);
  });
};
