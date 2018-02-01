import React, { Component } from "react";
import PropTypes from "prop-types";

import Select from "react-select";
import "react-select/dist/react-select.css";

class Form extends Component {
  render() {

    let inputStyles = "inputs ";
    this.props.orderedAs === "column" ? inputStyles += "inputs-as-column" : inputStyles += "inputs-as-row";

    let options = [];
    if (this.props.shifts) {
      for (let i = 0; i < this.props.shifts.length; i++) {
        const currentShift = this.props.shifts[i];
        let shift = {
          value: currentShift.id,
          label: `${currentShift.date} |
          ${currentShift.start} - ${currentShift.end}
          ${currentShift.position}`,
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