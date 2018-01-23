import React, { Component } from "react";

import { List } from "../../utils/List.jsx";
import shiftsStore from "../../../store/ShiftsStore.js";

export class ListEmployee extends Component {

  state = {
    data: shiftsStore.getAll("employee"),
  }

  componentWillMount() {
    shiftsStore.on("change", () => {
      this.setState({
        data: shiftsStore.getAll("employee"),
      });
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <List
          makeURL={(data) => "/talent/" + data.id}
          items={this.state.data}
          type={"table"}
          hiddenColumns={["id", "profilepicurl", "about", "roles", "favoritedlists",]}
          columns={["Name", "Lastname", "Birthday", "Favorite?", "Response Time", "Hourly Rate", "Current Jobs", "Rating",]} />
      </div>
    );
  }
}