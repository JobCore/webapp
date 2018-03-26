import Flux from '../flux';
import EmployerStore from '../store/EmployerStore';
import { GET, POST, PUT, DELETE } from '../store/ApiRequests';
import FavoriteListStore from '../store/FavoriteListStore';

class FavoriteListActions extends Flux.Action {
  /**
   * ** Returns every list from API **
   */
  getAll() {
    GET('favlists').then(lists =>
      this.dispatch('FavoriteListStore.setLists', {
        data: lists,
      })
    );
  }

  /**
   * ** Add new List for the current Employer **
   * @param {string} listName
   */
  addNewList(listName) {
    const listData = JSON.stringify({
      title: listName,
      owner: EmployerStore.getEmployer().id,
    });
    POST('favlists', listData)
      .then(shifts =>
        this.dispatch('FavoriteListStore.addList', {
          data: shifts,
        })
      )
      .catch(err => {
        throw new Error(`Shift could not be created due to -> ${err}`);
      });
  }

  renameList(id, param, value) {
    value = Array.isArray(value) ? value.map(item => item.value) : value;
    const listData = JSON.stringify({
      [param]: value,
    });

    PUT('favlists', id, listData).then(() =>
      this.dispatch('FavoriteListStore.renameList', {
        id,
        param,
        value,
      })
    );
  }

  updateEmployees(action, employeeId, listId) {
    let [employees] = FavoriteListStore.getById(listId);
    const employeeIdsArr = employees.map(employee => employee.id);

    if (action === 'add') {
      employeeIdsArr.push(employeeId);
    } else {
      const INDEX = employeeIdsArr.findIndex(employee => employee === employeeId);
      employeeIdsArr.splice(INDEX, 1);
    }
    employees = employeeIdsArr;
    const listData = JSON.stringify({ employees });

    PUT('favlists', listId, listData).then(() => this.getAll());
  }

  removeList(id) {
    DELETE('favlists', id).then(() => this.dispatch('FavoriteListStore.removeList', { id }));
  }
}
export default new FavoriteListActions();
