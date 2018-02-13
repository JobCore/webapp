import React, { Component } from 'react';
import swal from 'sweetalert2';
import Select from "react-select";

import { List } from '../../utils/List';
import EmployerStore from '../../../store/EmployerStore';
import FilterConfigStore from '../../../store/FilterConfigStore';
import Modal from '../../utils/Modal';
import Form from '../../utils/Form';

class FavoriteEmployeesList extends Component {
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
    editingLists: []
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
    this.setState({
      modalOpened: !this.state.modalOpened
    });
  }

  getFiterableOptions = () => {
    let options = [...Object.keys({ ...this.state.filterConfig, }),];
    let filteredOptions = options.filter(option => {
      return this.state.filterConfig[option] !== null;
    });
    return filteredOptions;
  }

  sortByRating = (order) => {
    const list = [...this.state.employee];
    document.querySelector('.sort-input').checked = false;
    let sortedList = list.sort((a, b) => order === "asc" ? a.rating - b.rating : b.rating - a.rating);
    this.setState({ employee: sortedList, shouldListUpdate: true });
  }

  removeEmployee = (id) => {
    let list = this.state.filterConfig.favoritesList || null;
    EmployerStore.removeEmployeeFromFavList(id, list);
    this.setState({ shouldListUpdate: true });
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
      if (newListName.length > 0) EmployerStore.renameFavoritesLists(prevListName, newListName);
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
                EmployerStore.removeFavoritesLists(list);
                this.setState({ shouldListUpdate: true });
              }
            })}></button>
          </div>
        </li>;

      return lists.push(htmlList)
    })
    return lists;
  }

  clearFilters = () => {
    FilterConfigStore.clearConfigFor("favoritesList");
    this.setState({
      employee: EmployerStore.getFavorites(
        FilterConfigStore.getConfigFor("favoritesList").favoritesList || ""),
      shouldListUpdate: true,
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
                  FilterConfigStore.updateConfig(option.value, "favoritesList", "favoritesList")
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

        {this.state.employee.length > 0 ? (
          <List
            classes="favorites-list"
            type={"card"}
            makeURL={(data) => "/talent/" + data.id}
            removeItem={this.removeEmployee}
            items={this.state.employee}
            sort={this.sortByRating}
            showInSubheading={['rating', 'currentJobs', 'favorite', 'responseTime', 'badges']} />
        ) : (
            <h3 className="no-match">No employees matching this criteria</h3>
          )}

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
              EmployerStore.addNewList(result.value);
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
      </div>
    )
  }
}

export default FavoriteEmployeesList;