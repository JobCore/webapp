import React, { Component } from "react";
import PropTypes from "prop-types";

class Form extends Component {
  render() {

    let inputStyles = "inputs ";
    this.props.orderedAs === "column" ? inputStyles += "inputs-as-column" : inputStyles += "inputs-as-row";

    return (
      <form className="form-component" id="form-component">
        <h5 className="title">{this.props.title}</h5>
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