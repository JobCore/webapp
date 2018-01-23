import React from "react";

import shiftsStore from "../../../store/ShiftsStore.js";

export class SingleShift extends React.Component {

  /**
  *
  *   this.props = {
  *   }
  */
  constructor() {
    super();
    this.state = {
      data: {
        location: "404",
      },
    };
  }

  componentWillMount() {

    var shift = shiftsStore.getById("shift", this.props.match.params.id);
    if (typeof shift === "undefined" || shift == null) shift = { location: "404", };
    this.setState({ data: shift, });
  }

  render() {
    return (
      <div className="container">
        <h1>Shift: {this.state.data.location}</h1>
      </div>
    );
  }
}