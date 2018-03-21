import React, { Component } from "react";
import PropTypes from "prop-types";

import Select from "react-select";
import "react-select/dist/react-select.css";

class Form extends Component {
  _convertTimestamp = (timestamp) => {
    // Convert Timestramp into date object
    let date = new Date(timestamp);
    date = new Date(date.setDate(date.getDate() + 1));

    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;

    let str = date.getFullYear() + "-" + month + "-" + day;
    return str;
  }

  render() {

    let inputStyles = "inputs ";
    this.props.orderedAs === "column" ? inputStyles += "inputs-as-column" : inputStyles += "inputs-as-row";

    let options = [];
    if (this.props.shifts) {
      for (let i = 0; i < this.props.shifts.length; i++) {
        const currentShift = this.props.shifts[i];
        let shift = {
          value: currentShift.id,
          label: `${this._convertTimestamp(currentShift.date)} |
          ${currentShift.start_time.match(/[0-9]{2}:[0-9]{2}/)} - ${currentShift.finish_time.match(/[0-9]{2}:[0-9]{2}/)}
          ${currentShift.position.title}`,
        };
        options.push(shift);
      }
    }

    return (
      <form className="form-component" id="form-component">
        {
          this.props.shifts && this.props.shifts.length > 0 ?
            <Select
              className="header-select"
              placeholder="Filter by Shift"
              name="shifts"
              value={this.props.selectedShift}
              searchable={false}
              onChange={value => this.props.onSelectChange(value)}
              options={options}
            /> :
            <h5 className="title">{this.props.title}</h5>
        }
        <div className={inputStyles}>
          {this.props.children}
        </div>
      </form>
    );
  }
}

Form.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Form;