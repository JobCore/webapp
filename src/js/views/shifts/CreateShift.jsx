import React from 'react';
import uuid from 'uuid/v4';
import Select from 'react-select';
import swal from 'sweetalert2';
import Flux from '../../flux';

import InlineTooltipEditor from '../../components/InlineTooltipEditor';
import ShiftActions from '../../actions/shiftActions';
import PositionsStore from '../../store/PositionsStore';
import VenueStore from '../../store/VenueStore';
import BadgesStore from '../../store/BadgesStore';

class CreateShift extends Flux.View {
  constructor(props) {
    super(props);
    this._convertTimestamp = timestamp => {
      const date = new Date(timestamp);
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = (month < 10 ? '0' : '') + month;
      day = (day < 10 ? '0' : '') + day;
      const str = `${date.getFullYear()}-${month}-${day}`;
      return str;
    };
    this.state = {
      venues: VenueStore.getAll(),
      prevShiftStatus: null,
      isInlineEditorOpen: false,
      shiftData: {
        venue: '',
        position: '',
        start_time: '',
        finish_time: '',
        status: 'OPEN',
        maximum_allowed_employees: 5,
        minimum_hourly_rate: 10,
        application_restriction: 'ANYONE',
        minimum_allowed_rating: 1,
        required_badges: [],
        allowed_from_list: [],
        date: this._convertTimestamp(Date.now()),
      },
    };
  }

  toggleInlineEditor = () => {
    this.setState(prevState => ({
      ...prevState,
      isInlineEditorOpen: !prevState.isInlineEditorOpen,
    }));
  };

  hasNullProperties = (object, ...exceptions) => {
    const exceptionArr = [...exceptions];
    for (const key in object) {
      if (typeof object[key] === 'object') this.hasNullProperties(object[key], ...exceptions);
      if (
        typeof object[key] !== 'object' &&
        !exceptionArr.includes(key) &&
        (object[key] == null || object[key].length === 0 || (typeof object[key] !== 'string' && isNaN(object[key])))
      ) {
        return true;
      }
    }
    return false;
  };

  updateShiftData = (param, value) => {
    if (param === 'required_badges') {
      value = value.length > 0 ? value.map(val => val.value) : [];
    } else if (param === 'maximum_allowed_employees' || param === 'minimum_hourly_rate') {
      value = parseInt(value);
    } else if (param === 'minimum_allowed_rating') {
      value = parseFloat(value);
    }

    this.setState(prevState => ({
      ...prevState,
      shiftData: {
        ...prevState.shiftData,
        [param]: value,
      },
    }));
  };

  convertPositionesIntoObjectForSelect = () => {
    const positions = PositionsStore.getAll();
    const object = [];
    positions.forEach(({ id, title }) => object.push({ label: title, value: id }));
    return object;
  };

  convertVenuesIntoObjectForSelect = () => {
    const { venues } = this.state;
    const object = [];
    venues.forEach(({ id, title }) => object.push({ label: title, value: id }));
    return object;
  };

  createShift = () => {
    ShiftActions.createShift(this.state.shiftData);
  };

  renderDetails = () => {
    let statusClass = 'status';
    const { shiftData } = this.state;

    switch (shiftData.status) {
      case 'OPEN':
        statusClass += ' receiving';
        break;
      case 'PAUSED':
        statusClass += ' paused';
        break;
      case 'DRAFT':
        statusClass += ' draft';
        break;
      default:
        statusClass += ' draft';
        break;
    }

    const badges = BadgesStore.getAll().map(({ id, title }) => ({ label: title, value: id }));
    const requiredBadges = [];
    shiftData.required_badges.map(id => requiredBadges.push(BadgesStore.getById(id)));

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
                onChange={option => this.updateShiftData('position', option.value)}
              />
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
                  value={shiftData.minimum_hourly_rate}
                  onChange={e => this.updateShiftData('minimum_hourly_rate', e.target.value)}
                />
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
                value={shiftData.maximum_allowed_employees}
                onChange={e => this.updateShiftData('maximum_allowed_employees', e.target.value)}
              />
            </div>
            <div className="item dates">
              <span className="date">
                <strong>On: </strong>
                <input
                  required
                  type="date"
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                  className="form-control"
                  value={shiftData.date}
                  onChange={e => this.updateShiftData('date', e.target.value)}
                />
              </span>
              <div className="times">
                <span className="start-time">
                  <strong>From: </strong>
                  <input
                    required
                    type="time"
                    className="form-control"
                    value={shiftData.start_time || ''}
                    onChange={e => this.updateShiftData('start_time', e.target.value)}
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
                    value={shiftData.finish_time || ''}
                    onChange={e => this.updateShiftData('finish_time', e.target.value)}
                  />
                </span>
              </div>
            </div>
            <div className="item">
              <strong>At: </strong>
              <Select
                clearable={false}
                options={this.convertVenuesIntoObjectForSelect()}
                value={shiftData.venue}
                onChange={option => this.updateShiftData('venue', option.value)}
              />
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
                  { label: 'Receiving candidates', value: 'OPEN' },
                  { label: 'Paused', value: 'PAUSED' },
                  { label: 'Draft', value: 'DRAFT' },
                ]}
              >
                <span className={statusClass} />
              </InlineTooltipEditor>

              <div className="publish-area">
                <button
                  className="btn btn-warning"
                  onClick={() =>
                    swal({
                      position: 'top',
                      title: 'Is all your data correct?',
                      type: 'info',
                      showCloseButton: true,
                      showCancelButton: true,
                      confirmButtonText: 'Create shift',
                      confirmButtonColor: '#28a745',
                      cancelButtonText: 'Cancel',
                      cancelButtonColor: '#3085d6',
                    })
                      .then(result => {
                        if (result.value) {
                          if (this.hasNullProperties(shiftData, 'required_badges', 'allowed_from_list')) {
                            throw new Error();
                          } else {
                            this.createShift();
                            swal({
                              position: 'top',
                              type: 'success',
                              html: '<p class="alert-message">Your shift has been created</p>',
                              showConfirmButton: false,
                              showCloseButton: false,
                              timer: 1500,
                              onClose: () => this.props.history.push('/shift/list'),
                            });
                          }
                        }
                      })
                      .catch(err => {
                        swal({
                          position: 'top',
                          type: 'error',
                          html: `<p class="alert-message">The shift is missing some data</p> <p>${err}</p>`,
                        });
                      })
                  }
                >
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
              param="application_restriction"
              currentValue={shiftData.application_restriction}
              options={[
                { label: 'Favorites employees only', value: 'FAVORITES' },
                { label: 'Anyone can apply', value: 'ANYONE' },
              ]}
            >
              <span className={shiftData.application_restriction === 'FAVORITES' ? 'favorite' : 'anyone'} />
            </InlineTooltipEditor>
          </div>

          {shiftData.application_restriction === 'FAVORITES' ? (
            <div className="allowed-lists">
              <p>This shift will only accept candidates from the following favorite lists:</p>
              <ul>{shiftData.allowed_from_list.map(list => <li key={uuid()}>{list.title}</li>)}</ul>
            </div>
          ) : (
            <div className="allowed-lists">
              <p>Candidates don't have to be in your favorites list to be able to apply.</p>
            </div>
          )}
          <div className="min-candidates">
            <div>
              Minimum applicant star rating:
              <InlineTooltipEditor
                type="number"
                min="1"
                max="5"
                step="0.5"
                isEditorOpen={this.state.isInlineEditorOpen}
                toggleInlineEditor={this.toggleInlineEditor}
                classes="left"
                message="Change minimum rating for this Shift"
                onEdit={this.updateShiftData}
                param="minimum_allowed_rating"
                currentValue={parseFloat(shiftData.minimum_allowed_rating)}
              >
                <span className="min-rating">{shiftData.minimum_allowed_rating}</span>
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
                multi
                message="Change badges required to apply"
                onEdit={this.updateShiftData}
                param="required_badges"
                currentValue={shiftData.required_badges}
                options={badges}
              >
                {shiftData.required_badges.length > 0 ? (
                  requiredBadges.map(badge => (
                    <span key={uuid()} className="tag badge badge-pill">
                      {badge.title}
                    </span>
                  ))
                ) : (
                  <p className="tag badge badge-pill">None</p>
                )}
              </InlineTooltipEditor>
            </div>

            <div />
          </div>
        </div>
      </div>
    );
  };

  render() {
    return <div>{this.renderDetails()}</div>;
  }
}

// ShiftDetails.propTypes = {
// }

export default CreateShift;
