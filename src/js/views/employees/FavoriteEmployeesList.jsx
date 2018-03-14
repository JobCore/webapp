import React from 'react';
import Flux from "../../flux"
import swal from 'sweetalert2';
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from "react-select";

import { List } from '../../components/utils/List';
import Modal from '../../components/utils/Modal';
import Form from '../../components/utils/Form';
import EmployerStore from '../../store/EmployerStore';
import FilterConfigStore from '../../store/FilterConfigStore';
import FilterActions from '../../actions/filterActions';
import EmployerActions from '../../actions/employerActions';
import EmployeeCard from '../../components/EmployeeCard';

export class FavoriteEmployeesList extends Flux.View {
  state = {
    employee: EmployerStore.getFavorites(
      FilterConfigStore.getConfigFor("favoritesList").favoritesList || ""),
    filterConfig: {
      ...FilterConfigStore.getConfigFor("favoritesList"),
    },
    favoritesLists: EmployerStore.getFavoritesLists(),
    shouldListUpdate: true,
    modalOpened: false,
    editing: null,
    editingLists: [],
    showAlert: false,
    selectedEmployee: null,
    selectedList: []
  }

  componentWillMount() {
    FilterConfigStore.on("change", this.setConfig);
    EmployerStore.on("change", this.getFavorites);
  }

  componentWillUnmount() {
    FilterConfigStore.removeListener("change", this.setConfig);
    EmployerStore.removeListener("change", this.getFavorites);
  }

  createOptionsObject = (category) => {
    let data = { ...this.state.favoritesLists, };
    data = Object.keys(data);
    let object = [];
    data.forEach(item => object.push({ label: item, value: item, }));
    return object;
  }

  getFavorites = () => {
    this.setState({
      employee: EmployerStore.getFavorites(
        FilterConfigStore.getConfigFor("favoritesList").favoritesList || ""),
      favoritesLists: EmployerStore.getFavoritesLists(),
    });
  }

  setConfig = () => {
    this.setState({
      filterConfig: {
        ...FilterConfigStore.getConfigFor("favoritesList"),
      },
    });
  }

  toggleModal = () => {
    this.setState((prevState, props) => ({
      modalOpened: !prevState.modalOpened
    }));
  }

  toggleAlert = (id = null) => {
    this.setState((prevState, props) => ({
      selectedEmployee: id,
      showAlert: !prevState.showAlert
    }));
  }

  getFiterableOptions = () => {
    let options = [...Object.keys({ ...this.state.filterConfig, }),];
    let filteredOptions = options.filter(option => {
      return this.state.filterConfig[option] !== null;
    });
    return filteredOptions;
  }

  sortBy = (order) => {
    const list = [...this.state.employee];
    let sortedList;
    document.querySelector('.sort-input').checked = false;
    switch (order) {
      case 'name':
        sortedList = list.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          return 0;
        });
        break;
      default:
        sortedList = list.sort((a, b) => a[order] - b[order]);
        break;
    }
    this.setState({ employee: sortedList, shouldListUpdate: true });
  }

  removeEmployee = () => {
    this.state.selectedList.map(list =>
      EmployerActions.removeEmployeeFromFavList(this.state.selectedEmployee, list)
    );
    this.setState({
      selectedEmployee: null,
      showAlert: false,
      shouldListUpdate: true
    });
  }

  editList = (listName) => {
    if (this.state.editingLists.length < 1) {
      let updatedEditingLists = [...this.state.editingLists];
      updatedEditingLists.push(listName);
      this.setState({
        editingLists: updatedEditingLists,
        editing: updatedEditingLists.length > 0
      })
    }
  }

  finishEditingList = (type, prevListName) => {
    let updatedEditingLists = [...this.state.editingLists];
    const index = updatedEditingLists.indexOf(prevListName);
    updatedEditingLists.splice(index, 1);

    if (type === "save") {
      const newListName = document.querySelector('#list').value;
      if (newListName.length > 0) EmployerActions.renameFavoritesLists(prevListName, newListName);
    }
    this.setState({
      editingLists: updatedEditingLists,
      editing: updatedEditingLists.length > 0,
      shouldListUpdate: true,
    })
  }

  renderFavLists = () => {
    let lists = [];
    Object.keys(EmployerStore.getFavoritesLists()).map(list => {
      let message = EmployerStore.getFavoritesListsEmployeeIds(list).length > 0 ?
        `It contains ${EmployerStore.getFavoritesListsEmployeeIds(list).length} candidate(s) already favorited, <br/>
        you won't be able to recover it after deletion.`
        :
        `The list is empty. <br/> You can delete it safely.`;

      let htmlList = this.state.editing && this.state.editingLists.includes(list) ?
        <li key={list}>
          <input type="text" name="list" id="list" placeholder={list} required />
          <div className="side-edit">
            <button className="save" onClick={() => this.finishEditingList("save", list)}></button>
            <button className="cancel" onClick={() => this.finishEditingList("cancel", list)}></button>
          </div>
        </li>
        :
        <li key={list}>
          <p>{list}</p>
          <div className="side">
            <button className="edit" onClick={() => this.editList(list)}></button>
            <button className="delete" onClick={() => swal({
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
                EmployerActions.removeFavoritesLists(list);
                this.setState({ shouldListUpdate: true });
              }
            })}></button>
          </div>
        </li>;

      return lists.push(htmlList)
    })
    return lists;
  }

  selectList = (isChecked, list) => (
    this.setState((prevState, props) => {
      if (!isChecked) {
        return { selectedList: prevState.selectedList.filter(item => item !== list) }
      }
      return {
        selectedList: prevState.selectedList.concat(list)
      }
    })
  )

  renderListCheckboxes = id => {
    let favoritedLists = EmployerStore.getListWhereEmployeeIsFavorite(id);

    let favoriteCheckboxes = favoritedLists.map(list => {
      return (
        <div className="cntr" key={list} style={{ marginBottom: '8px' }}>
          <label htmlFor={list} className="label-cbx">
            <input id={list} type="checkbox" name={list}
              className="invisible" value={list} checked={this.state.selectedList.includes(list)}
              onChange={event => this.selectList(event.target.checked, list)} />
            <div className="checkbox">
              <svg width="20px" height="20px" viewBox="0 0 20 20">
                <path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z"></path>
                <polyline points="4 11 8 15 16 6"></polyline>
              </svg>
            </div>
            <span>{list}</span>
          </label>
        </div>
      );
    });
    return favoriteCheckboxes;
  }

  clearFilters = () => {
    FilterActions.clearConfigFor("favoritesList");
    this.setState({
      employee: EmployerStore.getFavorites(
        FilterConfigStore.getConfigFor("favoritesList").favoritesList || "")
    });
    let forms = document.getElementsByClassName("form-component");
    for (const form of forms) form.reset();
  }

  render() {
    return (
      <div className="container-fluid favorites-area" style={{ position: "relative", }}>
        <div className="form-area" >
          <Form title="Filter by List" orderedAs="column">
            <div className="form-group">
              <label htmlFor="profileRating">Favorites Lists</label>
              <Select
                clearable={false}
                options={this.createOptionsObject("favoritesList")}
                value={
                  {
                    value: this.state.filterConfig.favoritesList,
                    label: this.state.filterConfig.favoritesList
                  } || []}
                onChange={option => {
                  FilterActions.updateConfig(option.value, "favoritesList", "favoritesList")
                  this.setState({
                    employee: EmployerStore.getFavorites(
                      FilterConfigStore.getConfigFor("favoritesList").favoritesList || ""),
                    shouldListUpdate: true,
                  })
                }} />
            </div>
          </Form>
        </div>

        <div className="top-btn">
          {
            this.getFiterableOptions().length > 0 &&
            <button className="btn btn-primary" onClick={this.clearFilters}>
              Clear filters
            </button>
          }
          <button className="btn btn-warning" onClick={this.toggleModal}>
            Manage Favorites List
          </button>
        </div>

        {this.state.employee.length > 0 ?
          // <List
          //   classes="favorites-list"
          //   type={"card"}
          //   makeURL={(data) => "/talent/" + data.id}
          //   removeItem={this.toggleAlert}
          //   items={this.state.employee}
          //   sort={this.sortBy}
          //   showInSubheading={['rating', 'currentJobs', 'favorite', 'responseTime', 'badges']} />
          <List
            items={this.state.employee}
            type="componentList"
            heading="Favorite employees"
            sortOptions={["name", "rating", "response-Time"]}
            sort={this.sortBy}
            removeItem={this.toggleAlert}
            component={EmployeeCard} />
          : (<h3 className="no-match">No employees matching this criteria</h3>)
        }

        <Modal
          size="fullscreen"
          header="Manage your lists"
          show={this.state.modalOpened}
          onClose={this.toggleModal}>
          <ul className="lists">
            {this.renderFavLists()}
          </ul>
          <button className="btn btn-primary btn-block" onClick={() => swal({
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
              EmployerActions.addNewList(result.value);
              swal({
                position: 'top',
                type: "success",
                html: 'List created'
              })
            }
          })}>
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
              className="btn btn-primary btn-block">
              Select All
            </button>
          </div>
        </SweetAlert>
      </div >
    )
  }
}