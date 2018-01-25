import React, { Component } from "react";
import PropTypes from "prop-types";

class Form extends Component {
  render() {
    return (
      <form className="form-component" id="form-component">
        <h5 className="title">{this.props.title}</h5>
        <div className="inputs">
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