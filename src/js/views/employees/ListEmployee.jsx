import React from 'react';
import Flux from "../../flux"
import { Link } from 'react-router-dom';
import Select from "react-select";
import "react-select/dist/react-select.css";

import { List } from "../../components/utils/List";
import Form from "../../components/utils/Form";
import EmployeeStore from "../../store/EmployeeStore";
import FavoriteListStore from "../../store/FavoriteListStore";
import ShiftsStore from "../../store/ShiftsStore";
import BadgesStore from "../../store/BadgesStore";
import PositionsStore from "../../store/PositionsStore";
import FilterConfigStore from "../../store/FilterConfigStore";
import FilterActions from '../../actions/filterActions';
import EmployeeCard from "../../components/EmployeeCard";

export class ListEmployee extends Flux.View {

  constructor() {
    super();
    this.state = {
      employee: EmployeeStore.getAll(),
      shift: ShiftsStore.getAll(),
      filteredData: [],
      filterConfig: {
        ...FilterConfigStore.getConfigFor("employeeList"),
      },
      shouldListUpdate: true,
      favoriteLists: FavoriteListStore.getAll(),
    }
    this.bindStore(FavoriteListStore, this.setFavLists.bind(this));
    this.bindStore(EmployeeStore, this.setEmployees.bind(this));
    this.bindStore(FilterConfigStore, this.setConfig.bind(this));
  }

  componentDidUpdate() {
    this.updateListOnFilter();
  }

  componentWillMount() {
    this.updateListOnFilter();
  }

  setEmployees = () => {
    this.setState({
      employee: EmployeeStore.getAll(),
      shouldListUpdate: true,
    });
  }

  setFavLists = () => {
    this.setState({
      favoriteLists: FavoriteListStore.getAll(),
      shouldListUpdate: true,
    });
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
    const categories = {
      badges: BadgesStore.getAll(),
      positions: PositionsStore.getAll(),
    }
    let arr = [];
    categories[category].forEach(
      ({ id, title }) => arr.push({ label: title, value: id, }));
    return arr;
  }

  updateFilterConfig = (value, configOption) => {
    if (configOption === "badges") {
      // Badges are an object, they need to be turned into an array
      let transformedValue = [];
      value.forEach(option => transformedValue.push(option.value));
      transformedValue = transformedValue.length > 0 ? null : transformedValue;
      FilterActions.updateConfig(transformedValue, configOption, "employeeList");
    } else {
      FilterActions.updateConfig(value, configOption, "employeeList");
    }

    this.setState({
      shouldListUpdate: true,
    });
  }

  filterList = (listItems, filterOption) => {
    let filterOptionValue = this.state.filterConfig[filterOption].value ?
      this.state.filterConfig[filterOption].value : this.state.filterConfig[filterOption];
    let filteredList;
    /* Remove prepended 'shift' or 'profile' of FilterConfigStore
       so that it matches Employee or Shift model atribute name */
    filterOption = filterOption.match(/[^(shift|profile)]\w+/g)[0];
    filterOption = filterOption.charAt(0).toLowerCase() + filterOption.slice(1);

    if (filterOption === "responseTime") {
      filteredList = listItems.filter(item => item.response_time <= filterOptionValue);
    } else if (filterOption === "badges" && filterOptionValue.length > 0) {
      // Convert into an array if badges ids
      filterOptionValue = filterOptionValue.map(optionValue => optionValue.value);

      filteredList = listItems.filter(item => {
        const badges = item.badges.map(badge => badge.id);
        let hasAllBadges = true;
        filterOptionValue.forEach(value => {
          if (!badges.includes(value)) {
            hasAllBadges = false;
          }
        });
        return hasAllBadges;
      });
    } else if (filterOption === "badges" && filterOptionValue.length === 0) {
      filteredList = this.state.employee;
    } else if (filterOption === "position") {
      filteredList = listItems.filter(item => {
        const positionIds = [];
        item.positions.map(position => positionIds.push(position.id));
        return positionIds.includes(filterOptionValue.id)
      });
    } else if (filterOption === "minHourlyRate") {
      filteredList = listItems.filter(item => parseFloat(item.minimum_hourly_rate) <= filterOptionValue);
    } else if (filterOption === "rating") {
      filteredList = listItems.filter(
        item => item[filterOption] >= filterOptionValue
      );
    } else if (filterOption === "fromTime" || filterOption === "date") {
      if (this.state.filterConfig.shiftFromTime != null && this.state.filterConfig.shiftFromTime.length !== 0 &&
        this.state.filterConfig.shiftDate != null && this.state.filterConfig.shiftDate.length !== 0) {
        let filterFromTime = this.convertHoursStringIntoNumber(this.state.filterConfig.shiftFromTime);
        let filterDate = this.state.filterConfig.shiftDate;
        let shifts = ShiftsStore.getByDate(filterDate);
        if (shifts.length > 0) {
          filteredList = listItems.filter(item => {
            let isAvailable = true;
            // Check every shift on the chosen date
            shifts.forEach(shift => {
              let shiftStartTime = this.convertHoursStringIntoNumber(shift.start_time) / 100
              let shiftFinishTime = this.convertHoursStringIntoNumber(shift.finish_time) / 100
              let shiftDuration = shiftFinishTime - shiftStartTime;
              // Get ids of all employees from the current shift
              let employeeIds = shift.employees.map(employee => employee.id);
              /* Check if current employee is in the current shift
                And if the chosen time is between the Shift's schedule
                OR if the chosen time plus the shift's duration is between the Shift's schedule */
              if (employeeIds.includes(item.id) && (
                (filterFromTime >= shiftStartTime && filterFromTime <= shiftFinishTime) ||
                (filterFromTime + shiftDuration >= shiftStartTime && filterFromTime + shiftDuration <= shiftFinishTime)
              )) {
                isAvailable = false;
              }
            })
            return isAvailable;
          })
        } else {
          filteredList = this.state.filteredData.length > 0 ?
            this.state.filteredData : this.state.employee;
        }

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
      let shift = ShiftsStore.getById(option.value);
      this.updateFilterConfig(shift.id, "selectedShift");
      this.updateFilterConfig(shift.date, "shiftDate");
      this.updateFilterConfig(shift.start, "shiftFromTime");
      this.updateFilterConfig(shift.position, "shiftPosition");
    } else {
      this.updateFilterConfig(null, "selectedShift");
    }
  }

  getFiterableOptions = () => {
    let options = [...Object.keys({ ...this.state.filterConfig, }),];
    let filteredOptions = options.filter(option => {
      return this.state.filterConfig[option] !== null && option !== 'selectedShift';
    });
    return filteredOptions;
  }

  clearFilters = () => {
    FilterActions.clearConfigFor("employeeList");
    this.setState({ shouldListUpdate: true, });
    let forms = document.getElementsByClassName("form-component");
    for (const form of forms) form.reset();
  }

  sortBy = (order) => {
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
      case 'responseTime':
        sortedList = list.sort((a, b) => a.response_time - b.response_time);
        break;
      default:
        sortedList = list.sort((a, b) => a[order] - b[order]);
        break;
    }
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
              <Select
                value={this.state.filterConfig.profileResponseTime}
                options={
                  [
                    { label: "All", value: Infinity, },
                    { label: "5min or less", value: 5, },
                    { label: "20min or less", value: 20, },
                    { label: "1hr or less", value: 60, },
                    { label: "6hr or less", value: 360, },
                    { label: "24hr or less", value: 1440, },
                    { label: "48 hr or less", value: 2880, },
                  ]
                }
                onChange={value => this.updateFilterConfig(value, "profileResponseTime")} />
            </div>
            <div className="form-group switch-group">
              <label htmlFor="profileBadges">Badges</label>
              <Select
                clearable={false}
                multi={true}
                options={this.createOptionsObject("badges")}
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
            </div>
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <Select
                placeholder="Select a position"
                options={this.createOptionsObject("positions")}
                value={
                  this.state.filterConfig.shiftPosition ?
                    {
                      label: this.state.filterConfig.shiftPosition.title,
                      value: this.state.filterConfig.shiftPosition.id
                    } : ""
                }
                onChange={option => this.updateFilterConfig(option ? option.value : null, "shiftPosition")} />
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
          <Link to="/shift/create">
            <button className="btn btn-success">
              <i className="fa fa-plus" aria-hidden="true"></i>
              <span>Create a new shift</span>
            </button>
          </Link>
        </div>

        {this.state.filteredData.length > 0 ? (
          <List
            items={this.state.filteredData}
            type="componentList"
            heading="Employees"
            sort={this.sortBy}
            sortOptions={["name", "rating", "response-Time"]}
            component={EmployeeCard} />
        ) : (
            <h3 className="no-match">No employees matching this criteria</h3>
          )}
      </div>
    );
  }
}