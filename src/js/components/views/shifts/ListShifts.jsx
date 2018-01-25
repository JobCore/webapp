import React from "react";

import Moment from "moment";

import { List } from "../../utils/List.jsx";
import Modal from "../../utils/Modal.jsx";
import shiftsStore from "../../../store/ShiftsStore.js";
import Form from "../../utils/Form";
import { Selector } from "../../utils/Selector";

export class ListShifts extends React.Component {

  state = {
    data: shiftsStore.getAll("shift"),
    filteredData: [],
    modalOpened: false,
    currentShift: { id: null, },
    filterConfig: {
      position: null,
      location: null,
      date: null,
      status: null,
    },
    shouldListUpdate: true,
  };

  componentDidMount() {
    this.updateListOnFilter();
  }

  componentDidUpdate() {
    this.updateListOnFilter();
  }

  toggleModal(item) {
    console.log("Render the modal!!!", item);
    this.setState({
      modalOpened: !this.state.modalOpened,
      currentShift: item,
    });
  }

  shouldListFilter = () => {
    let filterConfig = { ...this.state.filterConfig, };
    let options = Object.keys(filterConfig);
    for (let i = 0; i < options.length; i++) {
      if (filterConfig[options[i]] !== null) { return true; }
    };
    return false;
  }

  createOptionsObject = (category) => {
    let data = this.state.data;
    let object = [];
    data.map(item => object.push(
      { name: item[category], value: item[category], }
    ));
    return object;
  }

  updateFilterConfig = (value, configOption) => {
    let updatedFilterConfig = { ...this.state.filterConfig, };
    updatedFilterConfig[configOption] = value;

    this.setState({
      filterConfig: updatedFilterConfig,
      shouldListUpdate: true,
    });
  }

  filterList = (listItems, filterOption) => {
    let currentOption = this.state.filterConfig[filterOption];
    let filteredList = listItems.filter(
      item => item[filterOption] === currentOption
    );
    return filteredList;
  }

  updateListOnFilter = () => {
    if (this.state.shouldListUpdate) {
      let updatedListItems = [...this.state.data,];
      let filterableOptions = this.getFiterableOptions();
      if (filterableOptions.length > 0) {
        filterableOptions.forEach(option => {
          updatedListItems = this.filterList(updatedListItems, option);
        });
      } else {
        updatedListItems = this.state.data;
      }
      this.setState({
        filteredData: updatedListItems,
        shouldListUpdate: false,
      });
    }
  }

  getFiterableOptions = () => {
    let options = [...Object.keys({ ...this.state.filterConfig, }),];
    let filteredOptions = options.filter(option => {
      return this.state.filterConfig[option] !== null;
    });
    return filteredOptions;
  }

  clearFilters = () => {
    let filters = {
      position: null,
      location: null,
      date: null,
      status: null,
    };
    this.setState({
      filterConfig: filters,
      shouldListUpdate: true,
    });
    document.getElementById("form-component").reset();
  }

  render() {
    return (
      <div className="container-fluid" style={{ position: "relative", }}>
        <div className="form">
          <Form title="Filter Form">
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <Selector
                hide={false}
                stuff={this.createOptionsObject("position")}
                onChange={value => this.updateFilterConfig(value, "position")} />
            </div>
            <div className="form-group">
              <label htmlFor="Location">Location</label>
              <Selector
                hide={false}
                stuff={this.createOptionsObject("location")}
                onChange={value => this.updateFilterConfig(value, "location")} />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input className="form-control" type="date"
                name="date" id="date"
                onChange={event => this.updateFilterConfig(event.target.value, "date")} />
            </div>
            <div className="form-group switch-group">
              <label htmlFor="status">Status</label>
              <input type="checkbox" className="switch"
                onChange={event => this.updateFilterConfig(event.target.checked, "status")} />
            </div>
          </Form>
        </div>
        <div className="top-btn">
          <button className="btn btn-primary" onClick={this.clearFilters}>
            Clear filters
          </button>
          <button className="btn btn-success">
            <i className="fa fa-plus" aria-hidden="true"></i>
            <span>Create a new shift</span>
          </button>
        </div>
        {this.state.filteredData.length > 0 ? (
          <List
            items={this.state.filteredData}
            type={"table"}
            onItemClick={this.toggleModal.bind(this)}
            hiddenColumns={["id", "favoritesonly",]} />
        ) : (
          <h3 className="no-match">No shifts matching this criteria</h3>
        )}
        <Modal
          show={(this.state.modalOpened && this.state.currentShift.id != null)}
          onClose={this.toggleModal.bind(this)}>
          <p>Venue: {this.state.currentShift.location}</p>
          <p>Position: {this.state.currentShift.position}</p>
          <p>Date: {Moment(this.state.currentShift.date).format("MMM Do YYYY")}</p>
          <p>From {this.state.currentShift.start} to {this.state.currentShift.end}</p>
        </Modal>
      </div>
    );
  }
}