import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import uuid from 'uuid/v4';
import Select from 'react-select';
import swal from 'sweetalert2';
// import PropTypes from 'prop-types';

// import ProfilePic from "../../components/utils/ProfilePic";
import { List } from '../../components/utils/List';

import ShiftStore from "../../store/ShiftsStore";
import InlineTooltipEditor from '../../components/InlineTooltipEditor';
import * as ShiftActions from "../../actions/shiftActions";
import EmployeeCard from '../../components/EmployeeCard';
import VenueStore from '../../store/VenueStore';

class ShiftDetails extends Component {
  state = {
    shift: ShiftStore.getById("shift", this.props.match.params.id),
    prevShiftStatus: null,
    venues: VenueStore.getAll(),
    isInlineEditorOpen: false,
    editionMode: false,
  }

  setShift = () => {
    this.setState({
      shift: ShiftStore.getById("shift", this.props.match.params.id)
    });
  }

  componentWillMount() {
    ShiftStore.on("change", this.setShift);
  }

  componentWillUnmount() {
    ShiftStore.removeListener("change", this.setShift);
  }

  componentDidMount() {
    if (this.props.match.params.isEditing && this.state.shift ? this.toggleEdition() : null);
  }

  toggleInlineEditor = () => {
    this.setState(prevState => ({
      ...prevState,
      isInlineEditorOpen: !prevState.isInlineEditorOpen
    }))
  }

  updateShift = (id, param, value) => {
    if (param === "date") {
      const oneDayOffsetInMilliseconds = 86400000;
      value = Date.parse(value) + oneDayOffsetInMilliseconds;
    }
    ShiftActions.updateShift(id, param, value);
  }

  getOrdinalNum = (n) => {
    return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
  }

  convertPositionesIntoObjectForSelect = () => {
    const positions = ShiftStore.getAllAvailablePositions();
    let object = [];
    positions.forEach(position => object.push({ label: position, value: position }))
    return object;
  }

  convertVenuesIntoObjectForSelect = () => {
    const venues = this.state.venues;
    let object = [];
    venues.forEach(venue => object.push({ label: venue.name, value: venue.name }))
    return object;
  }

  convertTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;

    let str = date.getFullYear() + "-" + month + "-" + day;
    return str;
  }

  publishShift = (id) => {
    ShiftActions.updateShift(id, "status", "Receiving candidates");
  }

  toggleEdition = () => {
    this.setState(prevState => ({
      prevShiftStatus: this.state.shift.status,
      editionMode: !prevState.editionMode
    }))
  }

  renderDetails = () => {
    let statusClass = "status";
    const { shift } = this.state;

    switch (shift.status) {
      case "Receiving candidates":
        statusClass += " receiving";
        break;
      case "Filled":
        statusClass += " filled";
        break;
      case "Paused":
        statusClass += " paused";
        break;
      case "Cancelled":
        statusClass += " cancelled";
        break;
      case "Draft":
        statusClass += " draft";
        break;
      default:
        statusClass += " draft";
        break;
    }

    let formatedDate = `
    ${new Date(shift.date).toLocaleDateString("en-us", { month: "long" })}
    ${this.getOrdinalNum(new Date(shift.date).getDate())},
    ${new Date(shift.date).getFullYear()}`;

    return (
      <div className="row shift-details">
        {
          shift.status === "Draft" || this.state.editionMode ?
            // If Draft
            <div className="col col-md-9 first-col">
              {
                (shift.status !== "Draft" || this.state.editionMode) &&
                <span
                  className="edit-shift-details"
                  onClick={() => this.toggleEdition()}>
                  Exit editing mode
                </span>
              }
              {
                shift.status === "Draft" &&
                <h1>Draft</h1>
              }
              <div className="details">
                <div className="item">
                  <strong>Looking for: </strong>
                  <Select
                    clearable={false}
                    options={this.convertPositionesIntoObjectForSelect()}
                    value={shift.position}
                    onChange={option => this.updateShift(shift.id, "position", option.value)} />
                </div>
                <div className="item">
                  <strong>Paying: </strong>
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text">$</div>
                    </div>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      value={shift.restrictions.minHourlyRate}
                      onChange={e => this.updateShift(shift.id, "minHourlyRate", e.target.value)} />
                    <div className="input-group-append">
                      <div className="input-group-text">/hr</div>
                    </div>
                  </div>
                </div>
                <div className="item dates">
                  <span className="date">
                    <strong>On: </strong>
                    <input
                      type="date"
                      pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                      className="form-control"
                      value={this.convertTimestamp(shift.date)}
                      onChange={e => this.updateShift(shift.id, "date", e.target.value)} />
                  </span>
                  <div className="times">
                    <span className="start-time">
                      <strong>From: </strong>
                      <input
                        type="time"
                        className="form-control"
                        value={shift.start}
                        onChange={e => this.updateShift(shift.id, "start", e.target.value)}
                      />
                    </span>
                    <span className="end-time">
                      <strong style={{ textAlign: 'center' }}>To: </strong>
                      <input
                        type="time"
                        className="form-control"
                        value={shift.end}
                        onChange={e => this.updateShift(shift.id, "end", e.target.value)} />
                    </span>
                  </div>
                </div>
                <div className="item">
                  <strong>At: </strong>
                  <Select
                    clearable={false}
                    options={this.convertVenuesIntoObjectForSelect()}
                    value={shift.location}
                    onChange={option => this.updateShift(shift.id, "location", option.value)} />
                </div>
              </div>
            </div>
            :
            // If not a Draft
            <div className="col col-md-9 first-col">
              <span className="edit-shift-details" onClick={() => this.toggleEdition()}>
                Edit shift details
              </span>
              <div className="details">
                <p>
                  <strong>Looking for: </strong> {shift.position}
                </p>
                <p>
                  <strong>Paying: </strong> $ {shift.restrictions.minHourlyRate}/hr
                </p>
                <p>
                  <span className="date"><strong>On: </strong> {formatedDate}</span>
                </p>
                <p>
                  <span className="start-time"><strong>From: </strong> {shift.start}</span>
                  <span className="end-time"><strong>To: </strong> {shift.end}</span>
                </p>
                <p>
                  <strong>At: </strong> {shift.location}
                </p>
              </div>

              <div className="employees">
                <List
                  items={shift.candidates}
                  type="componentList"
                  heading="Candidates"
                  AcceptRejectButtons
                  currentShiftId={shift.id}
                  sort={this.sortBy}
                  component={EmployeeCard}
                  acceptedCandidates={shift.acceptedCandidates}
                />
              </div>
            </div>
        }

        <div className="col second-col">
          <div className="header">
            <p>This shift's status is:</p>
            {
              shift.status === "Draft" ?
                <div>
                  <span className={statusClass}></span>
                  <div className="publish-area">
                    <button className="btn btn-warning"
                      onClick={() => swal({
                        position: 'top',
                        title: "Are you sure?",
                        html: 'Once published, you will start receiving applicants and everyone on our network that matches the shift criteria will be notified.',
                        type: 'info',
                        showCloseButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Publish shift',
                        confirmButtonColor: '#28a745',
                        cancelButtonText: 'Cancel',
                        cancelButtonColor: '#3085d6',
                      }).then(result => {
                        if (result.value) {
                          this.publishShift(shift.id);
                          swal({
                            position: 'top',
                            type: "success",
                            html: '<p class="alert-message">Your shift has been published</p>'
                          })
                        }
                      })} >
                      Publish this shift
                  </button>
                  </div>
                </div>
                :
                <InlineTooltipEditor
                  isEditorOpen={this.state.isInlineEditorOpen}
                  toggleInlineEditor={this.toggleInlineEditor}
                  classes="left"
                  id={shift.id}
                  active={this.state.isEditing}
                  message="Change status for this Shift"
                  onEdit={this.updateShift}
                  param="status"
                  currentValue={shift.status}
                  options={[
                    { label: "Receiving candidates", value: "Receiving candidates" },
                    { label: "Filled", value: "Filled" },
                    { label: "Cancelled", value: "Cancelled" },
                    { label: "Paused", value: "Paused" },
                    { label: "Draft", value: "Draft" }
                  ]}>
                  <span
                    className={statusClass}></span>
                </InlineTooltipEditor>
            }
          </div>

          <div className="restriction">
            <InlineTooltipEditor
              isEditorOpen={this.state.isInlineEditorOpen}
              toggleInlineEditor={this.toggleInlineEditor}
              classes="left"
              id={shift.id}
              message="Change restriction for this Shift"
              onEdit={this.updateShift}
              param="favoritesOnly"
              currentValue={shift.restrictions.favoritesOnly}
              options={[
                { label: "Favorites employees only", value: true },
                { label: "Anyone can apply", value: false }
              ]}>
              <span
                className={shift.restrictions.favoritesOnly ? "favorite" : "anyone"}>
              </span>
            </InlineTooltipEditor>
          </div>

          {
            shift.restrictions.favoritesOnly ?
              <div className="allowed-lists">
                <p>This shift will only accept candidates from the following favorite lists:</p>
                <ul>
                  {
                    shift.restrictions.allowedFromList.map(listName => (
                      <li key={uuid()}>{listName}</li>
                    ))
                  }
                </ul>
              </div>
              :
              <div className="allowed-lists">
                <p>Candidates don't have to be in your favorites list to be able to apply.</p>
              </div>
          }
          {
            shift.status === "Draft" || this.state.editionMode ?
              <div className="min-candidates">
                <p>Minimum applicant star rating:</p>
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="fa fa-star"></i>
                    </div>
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    value={shift.restrictions.minAllowedRating}
                    min="1" max="5"
                    onChange={e => this.updateShift(shift.id, "minAllowedRating", e.target.value)} />
                </div>
              </div>
              :
              <div className="min-candidates">
                <p>Minimum applicant star rating:
                  <span className="min-rating">
                    {shift.restrictions.minAllowedRating}
                  </span>
                </p>
              </div>
          }
        </div>
      </div >
    )
  }

  render() {
    if (this.state.shift === undefined) {
      return <Redirect from={this.props.match.url} to="/shift/list" />;
    } else {
      return (
        <div>
          {this.renderDetails()}
        </div>
      );
    }
  }
}

// ShiftDetails.propTypes = {
// }

export default ShiftDetails;