import React, { Component } from 'react';
import swal from 'sweetalert2';

import { List } from '../../utils/List';
import EmployerStore from '../../../store/EmployerStore';
import FilterConfigStore from '../../../store/FilterConfigStore';
import Modal from '../../utils/Modal';

class FavoriteEmployeesList extends Component {
  state = {
    employee: EmployerStore.getFavorites(),
    filteredData: [],
    filterConfig: {
      ...FilterConfigStore.getConfigFor("employeeList"),
    },
    availableBadges: EmployerStore.getEmployer().availableBadges,
    shouldListUpdate: true,
    modalOpened: false,
    editing: null,
    editingLists: []
  }

  componentDidUpdate() {
    this.updateListOnFilter();
  }

  componentWillMount() {
    FilterConfigStore.on("change", this.setConfig);
    EmployerStore.on("change", this.getFavorites);
    this.updateListOnFilter();
  }

  componentWillUnmount() {
    FilterConfigStore.removeListener("change", this.setConfig);
    EmployerStore.removeListener("change", this.getFavorites);
  }

  getFavorites = () => {
    this.setState({
      employee: EmployerStore.getFavorites()
    });
  }

  setConfig = () => {
    this.setState({
      filterConfig: {
        ...FilterConfigStore.getConfigFor("employeeList"),
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

  filterList = (listItems, filterOption) => {
    let filterOptionValue = this.state.filterConfig[filterOption];
    let filteredList;
    /* Remove prepended 'shift' or 'profile' of FilterConfigStore
       so that it matches Employee or Shift model atribute name */
    filterOption = filterOption.match(/[^(shift|profile)]\w+/g)[0];
    filterOption = filterOption.charAt(0).toLowerCase() + filterOption.slice(1);

    if (filterOption === "responseTime") {
      filteredList = listItems.filter(item => item["responseTime"] <= filterOptionValue);
    } else if (filterOption === "badges" && filterOptionValue.length > 0) {
      filterOptionValue.forEach(valuesObj => {
        filteredList = listItems.filter(item => item[filterOption].includes(valuesObj.value));
      });
    } else if (filterOption === "badges" && filterOptionValue.length === 0) {
      filteredList = this.state.employee;
    } else if (filterOption === "position") {
      filteredList = listItems.filter(item => Object.keys(item["positions"]).includes(filterOptionValue));
    } else if (filterOption === "minHourlyRate") {
      filteredList = listItems.filter(item => parseFloat(item[filterOption].match(/\d+/g)) <= filterOptionValue);
    } else if (filterOption === "rating") {
      filteredList = listItems.filter(
        item => item[filterOption] >= filterOptionValue
      );
    } else if (filterOption === "fromTime" || filterOption === "untilTime" || filterOption === "date") {
      if (this.state.filterConfig.shiftFromTime != null && this.state.filterConfig.shiftFromTime.length !== 0 &&
        this.state.filterConfig.shiftUntilTime != null && this.state.filterConfig.shiftUntilTime.length !== 0 &&
        this.state.filterConfig.shiftDate != null && this.state.filterConfig.shiftDate.length !== 0) {
        let filterFromTime = this.convertHoursStringIntoNumber(this.state.filterConfig.shiftFromTime);
        let filterUntilTime = this.convertHoursStringIntoNumber(this.state.filterConfig.shiftUntilTime);
        let filterDate = this.state.filterConfig.shiftDate;

        filteredList = listItems.filter(item => {
          for (let i = 0; i < item.unavailableTimes.length; i++) {

            const times = item.unavailableTimes[i];
            const date = item.unavailableTimes[i].date;
            let fromTime = this.convertHoursStringIntoNumber(times.fromTime);
            let untilTime = this.convertHoursStringIntoNumber(times.untilTime);

            if ((((filterFromTime >= fromTime && filterFromTime <= untilTime) ||
              (filterUntilTime >= fromTime && filterUntilTime <= untilTime)) ||
              (filterUntilTime >= untilTime && filterFromTime <= fromTime)) &&
              date === filterDate) {
              return false;
            }
          }
          return true;
        });
      } else {
        filteredList = this.state.filteredData.length > 0 ?
          this.state.filteredData : this.state.employee;
      }
    } else {
      filteredList = listItems.filter(
        item => item[filterOption] === filterOptionValue
      );
    }
    return filteredList;
  }

  updateListOnFilter = () => {
    if (this.state.shouldListUpdate) {
      let updatedListItems = [...this.state.employee,];
      let filterableOptions = this.getFiterableOptions();
      if (filterableOptions.length > 0) {
        filterableOptions.forEach(option => {
          updatedListItems = this.filterList(updatedListItems, option);
        });
      } else {
        updatedListItems = this.state.employee;
      }
      this.setState({
        filteredData: updatedListItems,
        shouldListUpdate: false,
      });
    }
  }

  sortByRating = (order) => {
    const list = [...this.state.employee];
    document.querySelector('.sort-input').checked = false;
    let sortedList = list.sort((a, b) => order === "asc" ? a.rating - b.rating : b.rating - a.rating);
    this.setState({ employee: sortedList, shouldListUpdate: true });
  }

  removeEmployee = (id) => {
    let list = null;
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

  render() {
    return (
      <div className="container-fluid favorites-area" style={{ position: "relative", }}>
        <h1>Favorites</h1>

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

        {this.state.filteredData.length > 0 ? (
          <List
            classes="favorites-list"
            type={"card"}
            makeURL={(data) => "/talent/" + data.id}
            removeItem={this.removeEmployee}
            items={this.state.filteredData}
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