import React from 'react';
import swal from 'sweetalert2';
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from 'react-select';
import Flux from '../../flux';

import { List } from '../../components/utils/List';
import Modal from '../../components/utils/Modal';
import Form from '../../components/utils/Form';
import EmployerStore from '../../store/EmployerStore';
import FavoriteListStore from '../../store/FavoriteListStore';
import FavoriteListActions from '../../actions/favoriteListActions';
import FilterConfigStore from '../../store/FilterConfigStore';
import FilterActions from '../../actions/filterActions';
import EmployeeCard from '../../components/EmployeeCard';

export class FavoriteEmployeesList extends Flux.View {
  constructor() {
    super();
    this.state = {
      filterConfig: {
        ...FilterConfigStore.getConfigFor('favoritesList'),
      },
      employer: EmployerStore.getEmployer(),
      employee: FavoriteListStore.getEmployees(),
      favoritesLists: FavoriteListStore.getAll(),
      shouldListUpdate: true,
      modalOpened: false,
      editing: null,
      editingLists: [],
      showAlert: false,
      selectedEmployee: null,
      selectedList: [],
    };

    this.bindStore(FavoriteListStore, this.getFavorites.bind(this));
    this.bindStore(FilterConfigStore, this.setConfig.bind(this));
  }

  createOptionsObject = () => {
    const data = [...this.state.favoritesLists];
    const object = [];
    data.forEach(({ title, id }) => object.push({ label: title, value: id }));
    return object;
  };

  getFavorites = () => {
    this.setState({
      employee: this.state.filterConfig.favoritesList
        ? this.state.filterConfig.favoritesList.employees
        : FavoriteListStore.getEmployees(),
      favoritesLists: FavoriteListStore.getAll(),
    });
  };

  setConfig = () => {
    this.setState({
      filterConfig: {
        ...FilterConfigStore.getConfigFor('favoritesList'),
      },
    });
  };

  toggleModal = () => {
    this.setState(prevState => ({
      modalOpened: !prevState.modalOpened,
    }));
  };

  toggleAlert = (id = null) => {
    this.setState(prevState => ({
      selectedEmployee: id,
      showAlert: !prevState.showAlert,
    }));
  };

  getFiterableOptions = () => {
    const options = [...Object.keys({ ...this.state.filterConfig })];
    const filteredOptions = options.filter(option => this.state.filterConfig[option] !== null);
    return filteredOptions;
  };

  sortBy = order => {
    const list = [...this.state.employee];
    let sortedList;
    document.querySelector('.sort-input').checked = false;
    switch (order) {
      case 'name':
        sortedList = list.sort((a, b) => {
          const name1 = `${a.profile.user.first_name} ${a.profile.user.last_name}`;
          const name2 = `${b.profile.user.first_name} ${b.profile.user.last_name}`;
          if (name1.toLowerCase() < name2.toLowerCase()) return -1;
          if (name1.toLowerCase() > name2.toLowerCase()) return 1;
          return 0;
        });
        break;
      case 'responsetime':
        sortedList = list.sort((a, b) => a.response_time - b.response_time);
        break;
      default:
        sortedList = list.sort((a, b) => a[order] - b[order]);
        break;
    }
    this.setState({ employee: sortedList, shouldListUpdate: true });
  };

  removeEmployee = () => {
    this.state.selectedList.map(listId =>
      FavoriteListActions.updateEmployees('remove', this.state.selectedEmployee, listId)
    );
    this.setState({
      selectedEmployee: null,
      showAlert: false,
      shouldListUpdate: true,
    });
  };

  editList = listName => {
    if (this.state.editingLists.length < 1) {
      const updatedEditingLists = [...this.state.editingLists];
      updatedEditingLists.push(listName);
      this.setState({
        editingLists: updatedEditingLists,
        editing: updatedEditingLists.length > 0,
      });
    }
  };

  finishEditingList = (type, listId) => {
    const updatedEditingLists = [...this.state.editingLists];
    const index = updatedEditingLists.indexOf(listId);
    updatedEditingLists.splice(index, 1);

    if (type === 'save') {
      const newListName = document.querySelector('#list').value;
      if (newListName.length > 0) FavoriteListActions.renameList(listId, 'title', newListName);
    }
    this.setState({
      editingLists: updatedEditingLists,
      editing: updatedEditingLists.length > 0,
      shouldListUpdate: true,
    });
  };

  renderFavLists = () => {
    const htmlElementsList = [];
    this.state.favoritesLists.map(({ id, title }) => {
      const message =
        FavoriteListStore.employeeCountFor(id) > 0
          ? `It contains ${FavoriteListStore.employeeCountFor(id)} candidate(s) already favorited, <br/>
        you won't be able to recover it after deletion.`
          : `The list is empty. <br/> You can delete it safely.`;

      const htmlLi =
        this.state.editing && this.state.editingLists.includes(id) ? (
          <li key={id}>
            <input type="text" name="list" id="list" defaultValue={title} required />
            <div className="side-edit">
              <button className="save" onClick={() => this.finishEditingList('save', id)} />
              <button className="cancel" onClick={() => this.finishEditingList('cancel', id)} />
            </div>
          </li>
        ) : (
          <li key={id}>
            <p>{title}</p>
            <div className="side">
              <button className="edit" onClick={() => this.editList(id)} />
              <button
                className="delete"
                onClick={() =>
                  swal({
                    position: 'top',
                    title: 'Are you sure you want <br/> to delete this list?',
                    type: 'info',
                    html: message,
                    showCloseButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                    confirmButtonColor: '#d33',
                    cancelButtonText: 'Cancel',
                    cancelButtonColor: '#3085d6',
                  }).then(result => {
                    if (result.value) {
                      FavoriteListActions.removeList(id);
                      this.setState({ shouldListUpdate: true });
                    }
                  })
                }
              />
            </div>
          </li>
        );

      return htmlElementsList.push(htmlLi);
    });
    return htmlElementsList;
  };

  selectList = (isChecked, id) =>
    this.setState(prevState => {
      if (!isChecked) {
        return { selectedList: prevState.selectedList.filter(item => item !== id) };
      }
      return {
        selectedList: prevState.selectedList.concat(id),
      };
    });

  renderListCheckboxes = id => {
    const favoritedLists = FavoriteListStore.getListWhereEmployeeIsFavorite(id);
    const favoriteCheckboxes = favoritedLists.map(list => (
      <div className="cntr" key={list.id} style={{ marginBottom: '8px' }}>
        <label htmlFor={list.title} className="label-cbx">
          <input
            id={list.title}
            type="checkbox"
            name={list}
            className="invisible"
            value={list.id}
            checked={this.state.selectedList.includes(list.id)}
            onChange={event => this.selectList(event.target.checked, list.id)}
          />
          <div className="checkbox">
            <svg width="20px" height="20px" viewBox="0 0 20 20">
              <path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z" />
              <polyline points="4 11 8 15 16 6" />
            </svg>
          </div>
          <span>{list.title}</span>
        </label>
      </div>
    ));
    return favoriteCheckboxes;
  };

  clearFilters = () => {
    FilterActions.clearConfigFor('favoritesList');
    this.setState({
      employee: FavoriteListStore.getEmployees(),
    });
    const forms = document.getElementsByClassName('form-component');
    for (const form of forms) form.reset();
  };

  render() {
    return (
      <div className="container-fluid favorites-area" style={{ position: 'relative' }}>
        <div className="form-area">
          <Form title="Filter by List" orderedAs="column">
            <div className="form-group">
              <label htmlFor="profileRating">Favorites Lists</label>
              <Select
                clearable={false}
                options={this.createOptionsObject('favoritesList')}
                value={
                  {
                    value: this.state.filterConfig.favoritesList ? this.state.filterConfig.favoritesList.id : null,
                    label: this.state.filterConfig.favoritesList ? this.state.filterConfig.favoritesList.title : null,
                  } || []
                }
                onChange={option => {
                  FilterActions.updateConfig(option.value, 'favoritesList', 'favoritesList');
                  const index = this.state.favoritesLists.findIndex(list => list.id === option.value);
                  this.setState({
                    employee: this.state.favoritesLists[index].employees,
                    shouldListUpdate: true,
                  });
                }}
              />
            </div>
          </Form>
        </div>

        <div className="top-btn">
          {this.getFiterableOptions().length > 0 && (
            <button className="btn btn-primary" onClick={this.clearFilters}>
              Clear filters
            </button>
          )}
          <button className="btn btn-warning" onClick={this.toggleModal}>
            Manage Favorites List
          </button>
        </div>

        {this.state.employee.length > 0 ? (
          <List
            items={this.state.employee}
            type="componentList"
            heading="Favorite employees"
            sortOptions={['name', 'rating', 'response-time']}
            sort={this.sortBy}
            removeItem={this.toggleAlert}
            component={EmployeeCard}
          />
        ) : (
          <h3 className="no-match">No employees matching this criteria</h3>
        )}

        <Modal size="fullscreen" header="Manage your lists" show={this.state.modalOpened} onClose={this.toggleModal}>
          <ul className="lists">{this.renderFavLists()}</ul>
          <button
            className="btn btn-primary btn-block"
            onClick={() =>
              swal({
                position: 'top',
                title: 'Create a new list',
                input: 'text',
                type: 'info',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                confirmButtonColor: '#d33',
                cancelButtonText: 'Cancel',
                cancelButtonColor: '#3085d6',
              }).then(result => {
                if (result.value) {
                  FavoriteListActions.addNewList(result.value);
                  swal({
                    position: 'top',
                    type: 'success',
                    html: 'List created',
                  });
                }
              })
            }
          >
            + New List
          </button>
        </Modal>

        <SweetAlert
          type="info"
          show={this.state.showAlert}
          showCancel
          onCancel={this.toggleAlert}
          cancelBtnText="Cancel"
          cancelBtnBsStyle="danger"
          onConfirm={this.removeEmployee}
          confirmBtnBsStyle="primary"
          confirmBtnText="Confirm"
          title="From where would you like to remove the employee?"
        >
          <div id="checkboxes">
            {this.renderListCheckboxes(this.state.selectedEmployee)}
            <button
              style={{ marginTop: '5px' }}
              onClick={() => document.querySelectorAll('#checkboxes input').forEach(el => el.click())}
              className="btn btn-primary btn-block"
            >
              Select All
            </button>
          </div>
        </SweetAlert>
      </div>
    );
  }
}
