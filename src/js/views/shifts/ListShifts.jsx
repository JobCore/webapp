import React, { Component } from "react";
import Select from "react-select";

import Moment from "moment";
import Modal from "../../components/utils/Modal.jsx";
import Form from "../../components/utils/Form";
import { List } from "../../components/utils/List.jsx";
import ShiftsStore from "../../store/ShiftsStore.js";
import FilterConfigStore from "../../store/FilterConfigStore";
import * as FilterActions from '../../actions/filterActions';
import ShiftGroup from "../../components/ShiftGroup";

export class ListShifts extends Component {

  state = {
    shift: ShiftsStore.getAll("shift"),
    filteredData: [],
    modalOpened: false,
    currentShift: { id: null, },
    filterConfig: {
      ...FilterConfigStore.getConfigFor("shiftList"),
    },
    shouldListUpdate: true,
  };

  componentDidUpdate() {
    this.updateListOnFilter();
  }

  componentWillMount() {
    FilterConfigStore.on("change", this.setConfig);
    ShiftsStore.on("change", this.setShifts);
    this.updateListOnFilter();
  }

  componentWillUnmount() {
    FilterConfigStore.removeListener("change", this.setConfig);
    ShiftsStore.removeListener("change", this.setShifts);
  }

  setShifts = () => {
    this.setState({
      data: ShiftsStore.getShiftsGroupedByDate(),
    })
  }

  setConfig = () => {
    this.setState({
      filterConfig: {
        ...FilterConfigStore.getConfigFor("shiftList"),
      },
    });
  }


  toggleModal = (item) => {
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
    let data = ShiftsStore.getAll('shift');
    let object = [];

    let uniqueCategoryItem = [];

    data.map(item => {
      if (!uniqueCategoryItem.includes(item[category])) {
        object.push({ label: item[category], value: item[category], });
        uniqueCategoryItem.push(item[category]);
      }
      return 0;
    });
    return object;
  }

  updateFilterConfig = (value, configOption) => {
    FilterActions.updateConfig(value, configOption, "shiftList");
    this.setState({
      shouldListUpdate: true,
    });
  }

  filterList = (listItems, filterOption) => {
    let currentOption = this.state.filterConfig[filterOption];
    let filteredList;
    if (filterOption === "date") {
      filteredList = listItems.filter(
        item => {
          const dateArr = currentOption.split('-');
          const shiftYear = new Date(item[filterOption]).getFullYear();
          const shiftMonth = ('0' + (new Date(item[filterOption]).getMonth() + 1)).slice(-2);
          const shiftDay = ('0' + new Date(item[filterOption]).getDate()).slice(-2);;
          const shiftDate = `${shiftYear}-${shiftMonth}-${shiftDay}`
          const dateOption = `${dateArr[0]}-${dateArr[1]}-${dateArr[2]}`
          return shiftDate === dateOption;
        }
      );
    } else {
      filteredList = listItems.filter(
        item => item[filterOption] === currentOption
      );

    }
    return filteredList;
  }

  updateListOnFilter = () => {
    if (this.state.shouldListUpdate) {
      let updatedListItems = [...this.state.shift,];
      let filterableOptions = this.getFiterableOptions();
      if (filterableOptions.length > 0) {
        filterableOptions.forEach(option => {
          updatedListItems = this.filterList(updatedListItems, option);
          updatedListItems = ShiftsStore.getShiftsGroupedByDate(updatedListItems);
        });
      } else {
        updatedListItems = ShiftsStore.getShiftsGroupedByDate(this.state.shift);
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
    FilterActions.clearConfigFor("shiftList");
    this.setState({ shouldListUpdate: true, });
    document.getElementById("form-component").reset();
  }

  render() {
    // console.log(this.state.filterConfig);
    return (
      <div className="container-fluid" style={{ position: "relative", }}>
        <div className="form-area">
          <Form title="Filter Shifts" orderedAs="row">
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <Select
                placeholder="Select a position"
                options={this.createOptionsObject("position")}
                value={this.state.filterConfig.position || ""}
                onChange={option => this.updateFilterConfig(option ? option.value : null, "position")} />
            </div>
            <div className="form-group">
              <label htmlFor="Location">Location</label>
              <Select
                placeholder="Select a location"
                options={this.createOptionsObject("location")}
                value={this.state.filterConfig.location || ""}
                onChange={option => this.updateFilterConfig(option ? option.value : null, "location")} />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input className="form-control" type="date"
                value={this.state.filterConfig.date || ""}
                name="date" id="date"
                onChange={event => this.updateFilterConfig(event.target.value, "date")} />
            </div>
            <div className="form-group switch-group">
              <label htmlFor="status">Status</label>
              <Select
                placeholder="Select a status"
                options={this.createOptionsObject("status")}
                value={this.state.filterConfig.status || ""}
                onChange={option => this.updateFilterConfig(option ? option.value : null, "status")} />
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
          <button className="btn btn-success">
            <i className="fa fa-plus" aria-hidden="true"></i>
            <span>Create a new shift</span>
          </button>
        </div>
        {Object.keys(this.state.filteredData).length > 0 ? (
          <List
            items={this.state.filteredData}
            type="componentList"
            heading="Company Shifts"
            component={ShiftGroup} />
        ) : (
            <h3 className="no-match">No shifts matching this criteria</h3>
          )}
        <Modal
          header="Shift"
          show={(this.state.modalOpened && this.state.currentShift.id != null)}
          onClose={this.toggleModal}>
          <p>Venue: {this.state.currentShift.location}</p>
          <p>Position: {this.state.currentShift.position}</p>
          <p>Date: {Moment(this.state.currentShift.date).format("MMM Do YYYY")}</p>
          <p>From {this.state.currentShift.start} to {this.state.currentShift.end}</p>
        </Modal>
      </div>
    );
  }
}