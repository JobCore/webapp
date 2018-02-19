import React, { Component } from "react";

export class Time extends Component {

  constructor(props) {

    super(props);

    this.state = {
      time: "Not yet defined",
    };

    this.styles = {
      background: "#BDBDBD",
      padding: "10px",
      margin: "20px",
    };
  }

  componentDidMount() {

    this.timer = setInterval(() => {
      this.setState({
        time: new Date().toLocaleString(),
      });
    }, 1000);
  }

  componentWillUnmount() {

    console.log("dimoun timer");
    clearInterval(this.timer);
  }

  render() {

    return (
      <div style={this.styles}>
        {this.state.time}
      </div>
    );
  }
}