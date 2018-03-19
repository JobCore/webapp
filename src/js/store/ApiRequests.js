const rootAPIendpoint = "http://127.0.0.1:8000/api";

const HEADERS = {
  "Content-Type": "application/json",
}

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
   * @returns
   */
export const GET = async (model, id="") => {
    let response = await fetch(`${rootAPIendpoint}/${model}/${id}`, {
      method: "GET",
      headers: new Headers({
        ...HEADERS
    })})
    .catch(err => new Error('Could not fetch from API due to a ' + err));
    let data = await response.json();
    return data;
}


