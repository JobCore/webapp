import React, { Component } from 'react';
import uuid from 'uuid/v4';
import Select from 'react-select';
import swal from 'sweetalert2';

import ShiftStore from "../../store/ShiftsStore";
import InlineTooltipEditor from '../../components/InlineTooltipEditor';
import * as ShiftActions from "../../actions/shiftActions";
import VenueStore from '../../store/VenueStore';
import EmployerStore from '../../store/EmployerStore';

class CreateShift extends Component {
  state = {
    venues: VenueStore.getAll(),
    prevShiftStatus: null,
    isInlineEditorOpen: false,
    shiftData: {
      location: "",
      position: "",
      start: "",
      end: "",
      duration: "",
      status: "Receiving candidates",
      maxAllowedEmployees: 5,
      minHourlyRate: 10,
      restrictions: {
        favoritesOnly: false,
        minAllowedRating: 1,
        badges: [],
        allowedFromList: []
      },
    }
  }

  toggleInlineEditor = () => {
    this.setState(prevState => ({
      ...prevState,
      isInlineEditorOpen: !prevState.isInlineEditorOpen
    }))
  }

  hasNullProperties = (object, ...exceptions) => {
    const exceptionArr = [...exceptions];
    for (const key in object) {
      if (typeof object[key] === "object") this.hasNullProperties(object[key], ...exceptions);
      if (typeof object[key] !== "object" && !exceptionArr.includes(key) &&
        (
          object[key] == null || object[key].length === 0 ||
          (typeof object[key] !== "string" && isNaN(object[key]))
        )
      ) {
        return true;
      }
    }
    return false;
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

  updateShiftData = (param, value) => {
    if (param === "badges") {
      value = value.length > 0 ? value.map(val => val.value) : [];
    } else if (param === "maxAllowedEmployees" || param === "minHourlyRate" || param === "minAllowedRating") {
      value = parseInt(value);
    }
    switch (param) {
      case "favoritesOnly":
      case "minAllowedRating":
      case "badges":
        this.setState(prevState => ({
          ...prevState,
          shiftData: {
            ...prevState.shiftData,
            restrictions: {
              ...prevState.shiftData.restrictions,
              [param]: value
            }
          }
        }));
        break;
      default:
        if (param === "date") {
          const oneDayOffsetInMilliseconds = 86400000;
          value = Date.parse(value) + oneDayOffsetInMilliseconds;
        }
        this.setState(prevState => ({
          ...prevState,
          shiftData: {
            ...prevState.shiftData,
            [param]: value,
            duration: prevState.shiftData.end && prevState.shiftData.start ?
              (Math.abs(parseInt(this.state.shiftData.start) - parseInt(this.state.shiftData.end))) : null
          }
        }));
        break;
    }
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

  createShift = () => {
    ShiftActions.createShift(this.state.shiftData);
  }

  renderDetails = () => {
    let statusClass = "status";
    const { shiftData } = this.state;

    switch (shiftData.status) {
      case "Receiving candidates":
        statusClass += " receiving";
        break;
      case "Paused":
        statusClass += " paused";
        break;
      case "Draft":
        statusClass += " draft";
        break;
      default:
        statusClass += " draft";
        break;
    }

    let badges = EmployerStore.getEmployer().availableBadges.map(
      badge => (
        { label: badge, value: badge }
      ))

    return (
      <div className="row shift-details create-shift">
        <div className="col col-md-9 first-col">
          <div className="details">
            <div className="item">
              <strong>Looking for: </strong>
              <Select
                clearable={false}
                options={this.convertPositionesIntoObjectForSelect()}
                value={shiftData.position}
                onChange={option => this.updateShiftData("position", option.value)} />
            </div>
            <div className="item">
              <strong>Paying: </strong>
              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <div className="input-group-text">$</div>
                </div>
                <input
                  required
                  type="number"
                  className="form-control"
                  min="0"
                  value={shiftData.minHourlyRate}
                  onChange={e => this.updateShiftData("minHourlyRate", e.target.value)} />
                <div className="input-group-append">
                  <div className="input-group-text">/hr</div>
                </div>
              </div>
            </div>
            <div className="item">
              <strong>Maximum allowed employees: </strong>
              <input
                required
                type="number"
                className="form-control"
                min="0"
                value={shiftData.maxAllowedEmployees}
                onChange={e => this.updateShiftData("maxAllowedEmployees", e.target.value)} />
            </div>
            <div className="item dates">
              <span className="date">
                <strong>On: </strong>
                <input
                  required
                  type="date"
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                  className="form-control"
                  value={this.convertTimestamp(shiftData.date)}
                  onChange={e => this.updateShiftData("date", e.target.value)} />
              </span>
              <div className="times">
                <span className="start-time">
                  <strong>From: </strong>
                  <input
                    required
                    type="time"
                    className="form-control"
                    value={shiftData.start || ""}
                    onChange={e => this.updateShiftData("start", e.target.value)}
                  />
                </span>
                <span className="end-time">
                  <strong style={{ textAlign: 'center' }}>To: </strong>
                  <input
                    required
                    type="time"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Press Enter to save changes"
                    className="form-control"
                    value={shiftData.end || ""}
                    onChange={e => this.updateShiftData("end", e.target.value)} />
                </span>
              </div>
            </div>
            <div className="item">
              <strong>At: </strong>
              <Select
                clearable={false}
                options={this.convertVenuesIntoObjectForSelect()}
                value={shiftData.location}
                onChange={option => this.updateShiftData("location", option.value)} />
            </div>
          </div>
        </div>

        <div className="col second-col">
          <div className="header">
            <p>This shift's status will be:</p>
            <div>
              <InlineTooltipEditor
                isEditorOpen={this.state.isInlineEditorOpen}
                toggleInlineEditor={this.toggleInlineEditor}
                classes="left"
                active={this.state.isEditing}
                message="Change status for this Shift"
                onEdit={this.updateShiftData}
                param="status"
                currentValue={shiftData.status}
                options={[
                  { label: "Receiving candidates", value: "Receiving candidates" },
                  { label: "Paused", value: "Paused" },
                  { label: "Draft", value: "Draft" }
                ]}>
                <span
                  className={statusClass}></span>
              </InlineTooltipEditor>

              <div className="publish-area">
                <button className="btn btn-warning"
                  onClick={() => swal({
                    position: 'top',
                    title: "Is all your data correct?",
                    type: 'info',
                    showCloseButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Create shift',
                    confirmButtonColor: '#28a745',
                    cancelButtonText: 'Cancel',
                    cancelButtonColor: '#3085d6',
                  }).then(result => {
                    if (result.value) {
                      if (this.hasNullProperties(shiftData, "badges", "allowedFromList", "allowedFromList")) {
                        throw new Error();
                      } else {
                        this.createShift()
                        swal({
                          position: 'top',
                          type: "success",
                          html: '<p class="alert-message">Your shift has been created</p>',
                          showConfirmButton: false,
                          showCloseButton: false,
                          timer: 1500,
                          onClose: () => this.props.history.push("/shift/list")
                        })
                      }
                    }
                  }).catch(err => {
                    swal({
                      position: 'top',
                      type: "error",
                      html: '<p class="alert-message">The shift is missing some data</p>'
                    })
                  })} >
                  Create shift
                  </button>
              </div>
            </div>
          </div>

          <div className="restriction">
            <InlineTooltipEditor
              isEditorOpen={this.state.isInlineEditorOpen}
              toggleInlineEditor={this.toggleInlineEditor}
              classes="left"
              message="Change restriction for this Shift"
              onEdit={this.updateShiftData}
              param="favoritesOnly"
              currentValue={shiftData.restrictions.favoritesOnly}
              options={[
                { label: "Favorites employees only", value: true },
                { label: "Anyone can apply", value: false }
              ]}>
              <span
                className={shiftData.restrictions.favoritesOnly ? "favorite" : "anyone"}>
              </span>
            </InlineTooltipEditor>
          </div>

          {
            shiftData.restrictions.favoritesOnly ?
              <div className="allowed-lists">
                <p>This shift will only accept candidates from the following favorite lists:</p>
                <ul>
                  {
                    shiftData.restrictions.allowedFromList.map(listName => (
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
          <div className="min-candidates">
            <div>
              Minimum applicant star rating:
              <InlineTooltipEditor
                type="number"
                min="1"
                max="5"
                isEditorOpen={this.state.isInlineEditorOpen}
                toggleInlineEditor={this.toggleInlineEditor}
                classes="left"
                message="Change minimum rating for this Shift"
                onEdit={this.updateShiftData}
                param="minAllowedRating"
                currentValue={shiftData.restrictions.minAllowedRating}>
                <span className="min-rating">
                  {shiftData.restrictions.minAllowedRating}
                </span>
              </InlineTooltipEditor>
            </div>
          </div>


          <div className="badges">
            <p style={{ marginBottom: '5px' }}>Required badges:</p>

            <div className="tags-list">
              <InlineTooltipEditor
                isEditorOpen={this.state.isInlineEditorOpen}
                toggleInlineEditor={this.toggleInlineEditor}
                classes="left"
                multi={true}
                message="Change badges required to apply"
                onEdit={this.updateShiftData}
                param="badges"
                currentValue={shiftData.restrictions.badges}
                options={badges}>
                {
                  shiftData.restrictions.badges.length > 0 ?
                    shiftData.restrictions.badges.map(
                      badge => <span key={uuid()} className="tag badge badge-pill">{badge}</span>
                    )
                    :
                    <p className="tag badge badge-pill">None</p>
                }
              </InlineTooltipEditor>
            </div>

            <div>

            </div>


          </div>

        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderDetails()}
      </div>
    );
  }
}

// ShiftDetails.propTypes = {
// }

export default CreateShift;