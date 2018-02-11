import React, { Component } from "react";
import Select from "react-select";
import "react-select/dist/react-select.css";

import { Selector } from "../../utils/Selector";
import { List } from "../../utils/List.jsx";
import EmployerStore from "../../../store/EmployerStore";
import EmployeeStore from "../../../store/EmployeeStore";
import ShiftsStore from "../../../store/ShiftsStore.js";
import FilterConfigStore from "../../../store/FilterConfigStore";
import Form from "../../utils/Form";

export class ListEmployee extends Component {
  state = {
    employee: EmployeeStore.getAll(),
    shift: ShiftsStore.getAll("shift"),
    filteredData: [],
    filterConfig: {
      ...FilterConfigStore.getConfigFor("employeeList"),
    },
    availableBadges: EmployerStore.getEmployer().availableBadges,
    shouldListUpdate: true,
  }


  componentDidUpdate() {
    this.updateListOnFilter();
  }

  componentWillMount() {
    FilterConfigStore.on("change", this.setConfig);
    this.updateListOnFilter();
  }

  componentWillUnmount() {
    FilterConfigStore.removeListener("change", this.setConfig);
  }

  setConfig = () => {
    this.setState({
      filterConfig: {
        ...FilterConfigStore.getConfigFor("employeeList"),
      },
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
    let data = [...this.state.availableBadges,];
    let object = [];
    data.forEach(item => object.push({ label: item, value: item, }));
    return object;
  }

  createSelectorOptionsObject = (category) => {
    let data = this.state.shift;
    let object = [];
    let uniqueCategoryItem = [];
    data.map(item => {
      if (!uniqueCategoryItem.includes(item[category])) {
        object.push({ name: item[category], value: item[category], });
        uniqueCategoryItem.push(item[category]);
      }
      return 1;
    });
    return object;
  }

  updateFilterConfig = (value, configOption) => {
    if (configOption === "badges") {
      // Badges are an object, they need to be turned into an array
      let transformedValue = [];
      value.forEach(option => transformedValue.push(option.value));
      transformedValue = transformedValue.length > 0 ? null : transformedValue;
      FilterConfigStore.updateConfig(transformedValue, configOption, "employeeList");
    } else {
      FilterConfigStore.updateConfig(value, configOption, "employeeList");
    }

    this.setState({
      shouldListUpdate: true,
    });
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

  convertHoursStringIntoNumber = (string) => {
    let result = string.match(/\d+/g);
    if (result[0] === "00") result[0] = 24;
    result = parseInt(result.join(""), 10);
    return result;
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

  setFilterConfigByShift = (option) => {
    if (option != null && option.length !== 0) {
      let shift = ShiftsStore.getById("shift", option.value);
      this.updateFilterConfig(shift.id, "selectedShift");
      this.updateFilterConfig(shift.date, "shiftDate");
      this.updateFilterConfig(shift.start, "shiftFromTime");
      this.updateFilterConfig(shift.end, "shiftUntilTime");
      this.updateFilterConfig(shift.position, "shiftPosition");
    } else {
      this.updateFilterConfig(null, "selectedShift");
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
    FilterConfigStore.clearConfigFor("employeeList");
    this.setState({ shouldListUpdate: true, });
    let forms = document.getElementsByClassName("form-component");
    for (const form of forms) form.reset();
  }

  sortByRating = (order) => {
    const list = [...this.state.employee];
    document.querySelector('.sort-input').checked = false;
    let sortedList = list.sort((a, b) => order === "asc" ? a.rating - b.rating : b.rating - a.rating);
    this.setState({ employee: sortedList, shouldListUpdate: true });
  }

  render() {
    // console.log(this.state.filteredData.length, this.state.filteredData);
    // console.log("FILTER", this.state.filterConfig);
    return (
      <div className="container-fluid" style={{ position: "relative", }}>
        <div className="form-area" >
          <Form title="Filter by Profile" orderedAs="column">
            <div className="form-group">
              <label htmlFor="profileRating">Minimum rating</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </span>
                </div>
                <input className="form-control" type="number"
                  id="profileRating" name="profileRating" min="0" max="5" step="0.5" placeholder="0"
                  value={this.state.filterConfig.profileRating || ""}
                  onChange={event => this.updateFilterConfig(parseFloat(event.target.value), "profileRating")} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="profileResponseTime">Response time</label>
              <Selector
                defaultValue={this.state.filterConfig.profileResponseTime}
                hide={false}
                stuff={
                  [
                    { name: "All", value: Infinity, },
                    { name: "5min or less", value: 5, },
                    { name: "20min or less", value: 20, },
                    { name: "1hr or less", value: 60, },
                    { name: "6hr or less", value: 360, },
                    { name: "24hr or less", value: 1440, },
                    { name: "48 hr or less", value: 2880, },
                  ]
                }
                onChange={value => this.updateFilterConfig(value, "profileResponseTime")} />
            </div>
            <div className="form-group switch-group">
              <label htmlFor="profileBadges">Badges</label>
              <Select
                clearable={false}
                multi={true}
                options={this.createOptionsObject("availableBadges")}
                value={this.state.filterConfig.profileBadges || []}
                onChange={option => this.updateFilterConfig(option, "profileBadges")}
              />
            </div>
          </Form>

          <Form title="Filter by Shift" orderedAs="column"
            shifts={this.state.shift} onSelectChange={this.setFilterConfigByShift}
            selectedShift={this.state.filterConfig.selectedShift}>
            <div className="form-group">
              <label htmlFor="shiftDate">Date</label>
              <input className="form-control" type="date" name="shiftDate" id="shiftDate"
                value={this.state.filterConfig.shiftDate || ""}
                onChange={event => this.updateFilterConfig(event.target.value, "shiftDate")} />
            </div>
            <div className="form-group date-from-to">
              <label className="from-time" htmlFor="shiftFromTime">From</label>
              <input className="form-control" type="time" name="shiftFromTime" id="shiftFromTime"
                value={this.state.filterConfig.shiftFromTime || ""}
                onChange={event => this.updateFilterConfig(event.target.value, "shiftFromTime")} />
              <label className="until-time" htmlFor="shiftUntilTime">To</label>
              <input className="form-control" type="time" name="shiftUntilTime" id="shiftUntilTime"
                value={this.state.filterConfig.shiftUntilTime || ""}
                onChange={event => this.updateFilterConfig(event.target.value, "shiftUntilTime")} />
            </div>
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <Selector
                defaultValue={this.state.filterConfig.shiftPosition}
                hide={false}
                stuff={this.createSelectorOptionsObject("position")}
                onChange={value => this.updateFilterConfig(value, "shiftPosition")} />
            </div>
            <div className="form-group">
              <label htmlFor="shiftMinHourlyRate">Minimum Hourly Rate</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">$</span>
                </div>
                <input className="form-control" type="number"
                  id="shiftMinHourlyRate" name="shiftMinHourlyRate" min="0" step="1" placeholder="0"
                  value={this.state.filterConfig.shiftMinHourlyRate || ""}
                  onChange={event => this.updateFilterConfig(parseFloat(event.target.value), "shiftMinHourlyRate")} />
                <div className="input-group-append">
                  <span className="input-group-text">/hr</span>
                </div>
              </div>
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

        {this.state.filteredData.length > 0 ? (
          <List
            classes="employee-list"
            type={"card"}
            makeURL={(data) => "/talent/" + data.id}
            items={this.state.filteredData}
            sort={this.sortByRating}
            showInSubheading={['rating', 'currentJobs', 'favorite', 'responseTime', 'badges']} />
        ) : (
            <h3 className="no-match">No employees matching this criteria</h3>
          )}
      </div>
    );
  }
}