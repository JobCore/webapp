const rootAPIendpoint = 'http://127.0.0.1:8000/api';

const HEADERS = {
  'Content-Type': 'application/json',
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
*/

/**
 * Fetch JSON from API through GET method
 * @param {string} model Model data to be fetched. **Must be plural**
 * @returns {data}
 */
export const GET = async (model, id = '') => {
  const response = await fetch(`${rootAPIendpoint}/${model}/${id}`, {
    method: 'GET',
    headers: new Headers({
      ...HEADERS,
    }),
  }).catch(err => {
    throw new Error(`Could not GET models from API due to -> ${err}`);
  });
  const data = await response.json();
  return data;
};

export const POST = async (model, postData) => {
  const response = await fetch(`${rootAPIendpoint}/${model}/`, {
    method: 'POST',
    headers: new Headers({
      ...HEADERS,
    }),
    body: postData,
  }).catch(err => {
    throw new Error(`Could not POST model to API due to -> ${err}`);
  });
  console.log(postData);
  const data = await response.json();
  return data;
};

export const PUT = async (model, id, putData) => {
  const response = await fetch(`${rootAPIendpoint}/${model}/${id}`, {
    method: 'PUT',
    headers: new Headers({
      ...HEADERS,
    }),
    body: putData,
  }).catch(err => {
    throw new Error(`Could not UPDATE model on API due to -> ${err}`);
  });
  const data = await response.json();
  return data;
};

export const PATCH = async (model, id, putData) => {
  const response = await fetch(`${rootAPIendpoint}/${model}/${id}`, {
    method: 'PATCH',
    headers: new Headers({
      ...HEADERS,
    }),
    body: putData,
  }).catch(err => {
    throw new Error(`Could not UPDATE model on API due to -> ${err}`);
  });
  const data = await response.json();
  return data;
};

export const DELETE = async (model, id = '') => {
  await fetch(`${rootAPIendpoint}/${model}/${id}`, {
    method: 'DELETE',
    headers: new Headers({
      ...HEADERS,
    }),
  }).catch(err => {
    throw new Error(`Could not GET models from API due to -> ${err}`);
  });
};
