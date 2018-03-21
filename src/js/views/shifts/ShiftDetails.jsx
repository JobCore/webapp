import React from 'react';
import Flux from "../../flux"
import { Redirect } from "react-router-dom";
import uuid from 'uuid/v4';
import Select from 'react-select';
import swal from 'sweetalert2';

import { List } from '../../components/utils/List';

import ShiftStore from "../../store/ShiftsStore";
import InlineTooltipEditor from '../../components/InlineTooltipEditor';
import ShiftActions from "../../actions/shiftActions";
import EmployeeCard from '../../components/EmployeeCard';
import VenueStore from '../../store/VenueStore';
import BadgesStore from '../../store/BadgesStore';
import PositionsStore from '../../store/PositionsStore';

class ShiftDetails extends Flux.View {

  constructor(props) {
    super(props);
    this.state = {
      shift: ShiftStore.getById(props.match.params.id),
      prevShiftStatus: null,
      venues: VenueStore.getAll(),
      isInlineEditorOpen: false,
      editionMode: false,
    }
    this.bindStore(ShiftStore, this.setShift.bind(this));
  }

  setShift = () => {
    this.setState({
      shift: ShiftStore.getById(this.props.match.params.id)
    });
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

  updateShift = (id, param, value) => {
    if (param === "date") {
      const oneDayOffsetInMilliseconds = 86400000;
      value = Date.parse(value) + oneDayOffsetInMilliseconds;
    } else if (param === "maxAllowedEmployees" || param === "minHourlyRate" || param === "minAllowedRating") {
      value = parseInt(value);
    }
    if (this.state.shift.status !== "DRAFT") {
      switch (param) {
        case "application_restriction":
        case "minimum_allowed_rating":
        case "required_badges":
          ShiftActions.updateShift(id, param, value);
          break;
        default:
          swal({
            position: 'top',
            title: 'Updating shift details',
            html: 'All applicants need to be notified of this change. <br/> Proceed anyway?',
            type: 'info',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            confirmButtonColor: '#3085d6',
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#d33',
          }).then(result => {
            if (result.value) {
              if (value == null || value.length === 0 || (typeof value !== "string" && isNaN(value))) throw new Error();
              ShiftActions.updateShift(id, param, value);
              swal({
                position: 'top',
                type: "success",
                html: 'Change saved'
              })
            }
          })
            .catch(err => swal({
              position: 'top',
              type: "error",
              html: 'There is something wrong with the value provided.'
            }))
          break;
      }
    } else {
      if (param === "date") {
        const oneDayOffsetInMilliseconds = 86400000;
        value = Date.parse(value) + oneDayOffsetInMilliseconds;
      }
      ShiftActions.updateShift(id, param, value);
    }
  }

  getOrdinalNum = (n) => {
    return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
  }

  convertIntoObjectForSelect = (categoryOrItems) => {
    let arr;
    switch (categoryOrItems) {
      case "positions":
        arr = PositionsStore.getAll()
        break;
      case "venues":
        arr = VenueStore.getAll()
        break;
      default:
        // Category being an array of items to convert
        arr = categoryOrItems
        break;
    }
    let object = [];
    arr.forEach(({ id, title }) => object.push({ label: title, value: id }))
    return object;
  }

  convertTimestamp = (timestamp) => {
    // Convert Timestramp into date object
    let date = new Date(timestamp);
    date = new Date(date.setDate(date.getDate() + 1));

    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;

    let str = date.getFullYear() + "-" + month + "-" + day;
    return str;
  }

  publishShift = (id) => {
    ShiftActions.updateShift(id, "status", "OPEN");
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
      case "OPEN":
        statusClass += " receiving";
        break;
      case "FILLED":
        statusClass += " filled";
        break;
      case "PAUSED":
        statusClass += " paused";
        break;
      case "CANCELLED":
        statusClass += " cancelled";
        break;
      case "DRAFT":
        statusClass += " draft";
        break;
      default:
        statusClass += " draft";
        break;
    }

    let DATE = new Date(shift.date)
    DATE = new Date(DATE.setDate(DATE.getDate() + 1));

    let formatedDate = `
    ${DATE.toLocaleDateString("en-us", { month: "long" })}
    ${this.getOrdinalNum(DATE.getDate())},
    ${DATE.getFullYear()}`;

    let badges = BadgesStore.getAll().map(
      ({ id, title }) => (
        { label: title, value: id }
      )
    )

    return (
      <div className="row shift-details">
        {
          shift.status === "DRAFT" || this.state.editionMode ?
            // If Draft
            <div className="col col-md-9 first-col">
              {
                (shift.status !== "DRAFT" || this.state.editionMode) &&
                <span
                  className="edit-shift-details"
                  onClick={() => this.toggleEdition()}>
                  Exit editing mode
                </span>
              }
              {
                shift.status === "DRAFT" &&
                <h1>Draft</h1>
              }
              <div className="details">
                <div className="item">
                  <strong>Looking for: </strong>
                  <Select
                    clearable={false}
                    options={this.convertIntoObjectForSelect("positions")}
                    value={shift.position.id}
                    onChange={option => this.updateShift(shift.id, "position", option.value)} />
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
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Press Enter to save changes"
                      min="0"
                      defaultValue={shift.minimum_hourly_rate}
                      onKeyDown={e => {
                        if (e.keyCode === 13) this.updateShift(shift.id, "minHourlyRate", e.target.value)
                      }} />
                    <div className="input-group-append">
                      <div className="input-group-text">/hr</div>
                    </div>
                  </div>
                </div>
                <div className="item dates">
                  <span className="date">
                    <strong>On: </strong>
                    <input
                      required
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
                        required
                        type="time"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Press Enter to save changes"
                        className="form-control"
                        defaultValue={shift.start_time.match(/[0-9]{2}:[0-9]{2}/)}
                        onKeyDown={e => {
                          if (e.keyCode === 13) this.updateShift(shift.id, "start_time", e.target.value)
                        }}
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
                        defaultValue={shift.finish_time.match(/[0-9]{2}:[0-9]{2}/)}
                        onKeyDown={e => {
                          if (e.keyCode === 13) this.updateShift(shift.id, "finish_time", e.target.value)
                        }} />
                    </span>
                  </div>
                </div>
                <div className="item">
                  <strong>At: </strong>
                  <Select
                    clearable={false}
                    options={this.convertIntoObjectForSelect("venues")}
                    value={shift.venue.id}
                    onChange={option => this.updateShift(shift.id, "venue", option.value)} />
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
                  <strong>Looking for: </strong> {shift.position.title}
                </p>
                <p>
                  <strong>Paying: </strong> $ {shift.minimum_hourly_rate}/hr
                </p>
                <p>
                  <span className="date"><strong>On: </strong> {formatedDate}</span>
                </p>
                <p>
                  <span className="start-time">
                    <strong>From: </strong> {shift.start_time.match(/[0-9]{2}:[0-9]{2}/)}
                  </span>
                  <span className="end-time">
                    <strong>To: </strong> {shift.finish_time.match(/[0-9]{2}:[0-9]{2}/)}
                  </span>
                </p>
                <p>
                  <strong>At: </strong> {shift.venue.title}
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
                  sortOptions={["name", "rating", "response-Time"]}
                  component={EmployeeCard}
                  acceptedCandidates={shift.employees}
                />
              </div>
            </div>
        }

        <div className="col second-col">
          <div className="header">
            <p>This shift's status is:</p>
            {
              shift.status === "DRAFT" ?
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
                          if (this.hasNullProperties(shift, "id", "employees", "candidates", "required_badges", "allowed_from_list")) {
                            throw new Error();
                          } else {
                            this.publishShift(shift.id)
                            swal({
                              position: 'top',
                              type: "success",
                              html: '<p class="alert-message">Your shift has been published</p>'
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
                    { label: "Receiving candidates", value: "OPEN" },
                    { label: "Filled", value: "FILLED" },
                    { label: "Cancelled", value: "CANCELLED" },
                    { label: "Paused", value: "PAUSED" },
                    { label: "Draft", value: "DRAFT" }
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
              param="application_restriction"
              currentValue={shift.application_restriction}
              options={[
                { label: "Favorites employees only", value: "FAVORITES" },
                { label: "Anyone can apply", value: "ANYONE" }
              ]}>
              <span
                className={shift.application_restriction === "FAVORITES" ? "favorite" : "anyone"}>
              </span>
            </InlineTooltipEditor>
          </div>

          {
            shift.application_restriction === "FAVORITES" ?
              <div className="allowed-lists">
                <p>This shift will only accept candidates from the following favorite lists:</p>
                <ul>
                  {
                    shift.allowed_from_list.map(list => (
                      <li key={uuid()}>{list.title}</li>
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
                id={shift.id}
                message="Change minimum rating for this Shift"
                onEdit={this.updateShift}
                param="minimum_allowed_rating"
                currentValue={shift.minimum_allowed_rating}>
                <span className="min-rating">
                  {shift.minimum_allowed_rating}
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
                id={shift.id}
                message="Change badges required to apply"
                onEdit={this.updateShift}
                param="required_badges"
                currentValue={this.convertIntoObjectForSelect(shift.required_badges)}
                options={badges}>
                {
                  shift.required_badges.length > 0 ?
                    shift.required_badges.map(
                      ({ title }) => <span key={uuid()} className="tag badge badge-pill">{title}</span>
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

export default ShiftDetails;