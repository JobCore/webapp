import React from "react";

export class Selector extends React.Component {

  render() {

    if (this.props.hide === true) return null;

    const stuffLikeHTML = this.props.stuff.map(item =>
      <option key={item.value} value={item.value}>{item.name}</option>);

    return (
      <select className="custom-select" value={this.props.defaultValue || "null"}
        onChange={evt => this.props.onChange(evt.target.value)}>
        <option key="null" disabled value="null" data-measure={this.props.measure || null}>
          -- Select an Option --
        </option>
        {stuffLikeHTML}
      </select>
    );
  }


}