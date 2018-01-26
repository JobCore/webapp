import React, { Component } from "react";

import { List } from "../../utils/List.jsx";
import shiftsStore from "../../../store/ShiftsStore.js";
import Form from "../../utils/Form";
import { Selector } from "../../utils/Selector";
import Select from "react-select";
import "react-select/dist/react-select.css";
import EmployerStore from "../../../store/EmployerStore";

export class ListEmployee extends Component {
  state = {
    data: shiftsStore.getAll("employee"),
    filteredData: [],
    filterConfig: {
      rating: null,
      responseTime: null,
      badges: null,
    },
    availableBadges: EmployerStore.getEmployer().availableBadges,
    shouldListUpdate: true,
  }

  // componentWillMount() {
  //   shiftsStore.on("change", () => {
  //     this.setState({
  //       data: shiftsStore.getAll("employee"),
  //     });
  //   });
  // }

  componentDidMount() {
    this.updateListOnFilter();
  }

  componentDidUpdate() {
    this.updateListOnFilter();
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
    data.forEach(item => object.push(
      { label: item, value: item, }
    ));
    return object;
  }

  updateFilterConfig = (value, configOption) => {
    let updatedFilterConfig = { ...this.state.filterConfig, };
    if (configOption === "badges") {
      updatedFilterConfig[configOption] = [];
      value.forEach(option => updatedFilterConfig[configOption].push(option.value));
      updatedFilterConfig[configOption] =
        updatedFilterConfig[configOption].length === 0 ? null : updatedFilterConfig[configOption];
    } else {
      updatedFilterConfig[configOption] = value;
    }

    this.setState({
      filterConfig: updatedFilterConfig,
      shouldListUpdate: true,
    });
  }

  filterList = (listItems, filterOption) => {
    let filterOptionValue = this.state.filterConfig[filterOption];
    let filteredList;

    if (filterOption === "responseTime") {
      filteredList = listItems.filter(
        item => item[filterOption] <= filterOptionValue
      );
    } else if (filterOption === "badges" && filterOptionValue.length > 0) {
      filterOptionValue.forEach((optionValue, index) => {
        filteredList = listItems.filter(
          item => item["badges"].includes(optionValue)
        );
      });
    } else if (filterOption === "badges" && filterOptionValue.length === 0) {
      filteredList = this.state.data;
    } else {
      filteredList = listItems.filter(
        item => item[filterOption] === filterOptionValue
      );
    }
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
      rating: null,
      responseTime: null,
      badges: null,
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
          <Form title="Filter by Profile" orderedAs="column">
            <div className="form-group">
              <label htmlFor="rating">Minimum rating</label>
              <input className="form-control" type="number"
                id="rating" name="rating" min="0" max="5" step="0.5" placeholder="0"
                onChange={event => this.updateFilterConfig(parseFloat(event.target.value), "rating")} />
            </div>
            <div className="form-group">
              <label htmlFor="response-time">Response time</label>
              <Selector
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
                onChange={value => this.updateFilterConfig(value, "responseTime")} />
            </div>
            <div className="form-group switch-group">
              <label htmlFor="badges">Badges</label>
              <Select
                defaultValue={[]}
                clearable={false}
                multi={true}
                options={
                  this.createOptionsObject("availableBadges")
                }
                value={this.state.filterConfig.badges}
                onChange={option => this.updateFilterConfig(option, "badges")}
              />
            </div>
          </Form>
        </div>
        <div className="top-btn">
          <button className="btn btn-primary" onClick={this.clearFilters}>
            Clear filters
          </button>
        </div>
        {this.state.filteredData.length > 0 ? (
          <List
            makeURL={(data) => "/talent/" + data.id}
            items={this.state.filteredData}
            type={"table"}
            hiddenColumns={["id", "profilepicurl", "about", "roles", "favoritedlists", "badges",]}
            columns={["Name", "Lastname", "Birthday", "Favorite?", "Response Time", "Hourly Rate", "Current Jobs", "Rating",]} />
        ) : (
          <h3 className="no-match">No employees matching this criteria</h3>
        )}
      </div>
    );
  }
}