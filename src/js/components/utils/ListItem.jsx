import React from "react";
import { Link } from "react-router-dom";

export class ListItem extends React.Component {

  /**
    *
    *   this.props = {
    *       type: 'card' or 'table'
    *       makeURL: a function with the logic to generate the row link
    *   }
    */

  constructor() {

    super();

    //set a default state object for the component
    this.state = {
      renderFunction: "table",
    };

  }

  render() {

    //if props.type has not been defined y pass the state.renderFunction value
    switch (this.props.type || this.state.renderFunction) {
    case "table": return this.renderLikeTable(); break;
      //by default the component is going to render like a bootstrap card
    default: return this.renderLikeCard(); break;
    }

  }

  /**
     * check what are the properties that came with the data object and create
     * a column for each of them (but id)
     */
  getDataTableColumns() {
    var columns = Object.getOwnPropertyNames(this.props.data);
    return columns;
  }

  /**
     * This function transform the array of columns returned by
     */
  renderTablesColumns(dataDcolumns) {
    return dataDcolumns.filter((col) => {
      return (typeof (this.props.hiddenColumns) != "undefined" && this.props.hiddenColumns.indexOf(col.toLowerCase()) == -1);
    }).map((value) => {
      return <td key={value} scope="col">{this.props.data[value].toString()}</td>;
    });

  }

  /**
     * This function will output the HTML needed to render the item like
     * a table row
     */
  renderLikeTable() {
    var link = "";
    if (typeof this.props.makeURL == "function") link = <td><Link to={this.props.makeURL(this.props.data)} className="btn btn-default">view</Link></td>;
    else if (typeof this.props.onClick == "function") link = <td><a href="#" onClick={() => this.props.onClick(this.props.data)} className="btn btn-default">view</a></td>;

    return (
      <tr className="list-item like-table">
        {this.renderTablesColumns(this.getDataTableColumns())}
        {link}
      </tr>
    );
  }

  /**
     * This function will output the HTML needed to render the item like
     * a bootstrap card
     */
  renderLikeCard() {
    return (
      <div className="list-item like-card">
        <p className="heading">{this.props.heading}</p>
        <p className="sub-heading">{this.props.subheading}</p>
      </div>
    );
  }
}