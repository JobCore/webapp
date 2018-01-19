import React from "react";

export class EmployeeCard extends React.Component {

  constructor() {

    super();

    this.renderFunction = "table";

    this.data = {
      name: "Juan",
      lastname: "Perozo",
      twitter: "alesanchezr",
    };
  }

  render() {

    if (typeof (this.props.type) != "undefined") this.renderFunction = "table";
    switch (this.renderFunction) {
    default:
      return this.renderLikeTable(this.data);
      break;
    }

  }

  renderLikeTable(emp) {
    return (
      <tr>
        <td>{emp.name}</td>
        <td>{emp.lastname}</td>
        <td>{"@" + emp.twitter}</td>
      </tr>
    );
  }

  renderCard(emp) {
    return (
      <div>
        <h2>{emp.name} {emp.lastname}</h2>
        <p>{"@" + emp.twitter}</p>
      </div>
    );
  }
}