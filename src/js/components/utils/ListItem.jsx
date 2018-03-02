import React, { Component } from "react";
import { Link } from "react-router-dom";
import swal from 'sweetalert2';
import * as ShiftActions from '../../actions/shiftActions';

export class ListItem extends Component {

  /**
    *
    *   this.props = {
    *       type: 'card' or 'table'
    *       makeURL: a function with the logic to generate the row link
    *   }
    */

  state = {
    renderFunction: "table",
  };

  render() {

    //if props.type has not been defined y pass the state.renderFunction value
    switch (this.props.type || this.state.renderFunction) {
      case "table": return this.renderLikeTable();
      //by default the component is going to render like a bootstrap card
      case "card": return this.renderLikeCard();
      default: return this.props.data;
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
      return (typeof (this.props.hiddenColumns) !== "undefined" && this.props.hiddenColumns.indexOf(col.toLowerCase()) === -1);
    }).map((value) => {
      return <td key={value}>{this.props.data[value].toString()}</td>;
    });

  }

  /**
     * This function will output the HTML needed to render the item like
     * a table row
     */
  renderLikeTable() {
    var link = "";
    if (typeof this.props.makeURL === "function") {
      link = (
        <td>
          <Link to={this.props.makeURL(this.props.data)} className="btn btn-default">view</Link>
        </td>);
    } else if (typeof this.props.onClick === "function") {
      link = (
        <td>
          <a href="#" onClick={() => this.props.onClick(this.props.data)} className="btn btn-default">view</a>
        </td>
      );
    }

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
        <div className="content">
          <h5 className="heading">{this.props.heading}</h5>
          <div className="sub-heading">
            {this.props.subheading}
          </div>
        </div>
        {
          this.props.AcceptRejectButtons ?
            <div className="side">
              <button className="btn btn-success accept-btn"
                onClick={() => swal({
                  position: 'top',
                  html: '<p class="alert-message">Approving this candidate will make him fill your shift position</p>',
                  type: 'info',
                  showCloseButton: true,
                  showCancelButton: true,
                  confirmButtonText: 'Approve',
                  confirmButtonColor: '#28a745',
                  cancelButtonText: 'Cancel',
                  cancelButtonColor: '#3085d6',
                }).then(result => {
                  if (result.value) {
                    ShiftActions.acceptCandidate(this.props.data.id);
                    swal({
                      position: 'top',
                      type: "success",
                      html: '<p class="alert-message">Candidate accepted</p>'
                    })
                  }
                })}></button>
              <button className="btn btn-danger cancel-btn"
                onClick={() => swal({
                  position: 'top',
                  html: '<p class="alert-message">This candidate will be notified of his rejection and will now be available for other positions</p>',
                  type: 'info',
                  showCloseButton: true,
                  showCancelButton: true,
                  confirmButtonText: 'Reject candidate',
                  confirmButtonColor: '#d33',
                  cancelButtonText: 'Cancel',
                  cancelButtonColor: '#3085d6',
                }).then(result => {
                  if (result.value) {
                    // EmployerActions.addNewList(result.value);
                    swal({
                      position: 'top',
                      type: "success",
                      html: '<p class="alert-message">Candidate rejected</p>'
                    })
                  }
                })}></button>
            </div>
            :
            <div className="side">
              <Link to={this.props.makeURL(this.props.data)} className="search"></Link>
              {
                this.props.removeCard &&
                <button className="delete" onClick={this.props.removeCard}></button>
              }
            </div>
        }
      </div>
    );
  }
}