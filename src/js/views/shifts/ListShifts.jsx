import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Select from 'react-select';
import Moment from 'moment';

import Flux from '../../flux';
import Modal from '../../components/utils/Modal';
import Form from '../../components/utils/Form';
import { List } from '../../components/utils/List';
import ShiftsStore from '../../store/ShiftsStore';
import EmployeeStore from '../../store/EmployeeStore';
import PositionsStore from '../../store/PositionsStore';
import VenuesStore from '../../store/VenueStore';
import FilterConfigStore from '../../store/FilterConfigStore';
import FilterActions from '../../actions/filterActions';
import ShiftGroup from '../../components/ShiftGroup';

export class ListShifts extends Flux.View {
  constructor(props) {
    super(props);
    this.state = {
      shift: this.props.match.path === '/talent/:id/offer' ? ShiftsStore.getActiveShifts() : ShiftsStore.getAll(),
      filteredData: [],
      modalOpened: false,
      currentShift: { id: null },
      filterConfig: {
        ...FilterConfigStore.getConfigFor('shiftList'),
      },
      shouldListUpdate: true,
    };
    this.bindStore(FilterConfigStore, this.setConfig.bind(this));
    this.bindStore(ShiftsStore, this.setShifts.bind(this));
  }

  componentDidUpdate() {
    this.updateListOnFilter();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.path !== nextProps.match.path) {
      this.setState(() => ({
        shift: nextProps.match.path === '/talent/:id/offer' ? ShiftsStore.getActiveShifts() : ShiftsStore.getAll(),
        shouldListUpdate: true,
      }));
    }
  }

  componentWillMount() {
    this.updateListOnFilter();
  }

  setShifts = () => {
    this.setState(prevState => ({
      shift: ShiftsStore.getShiftsGroupedByDate(prevState.shift),
    }));
  };

  setConfig = () => {
    this.setState({
      filterConfig: {
        ...FilterConfigStore.getConfigFor('shiftList'),
      },
    });
  };

  toggleModal = item => {
    this.setState({
      modalOpened: !this.state.modalOpened,
      currentShift: item,
    });
  };

  shouldListFilter = () => {
    const filterConfig = { ...this.state.filterConfig };
    const options = Object.keys(filterConfig);
    for (let i = 0; i < options.length; i++) {
      if (filterConfig[options[i]] !== null) {
        return true;
      }
    }
    return false;
  };

  createOptionsObject = category => {
    const data = {
      positions: PositionsStore.getAll(),
      venues: VenuesStore.getAll(),
    };
    const arr = [];
    data[category].forEach(({ id, title }) => arr.push({ label: title, value: id }));

    return arr;
  };

  updateFilterConfig = (value, configOption) => {
    FilterActions.updateConfig(value, configOption, 'shiftList');
    this.setState({
      shouldListUpdate: true,
    });
  };

  // Output format XX-XX-XX
  convertTimestamp(timestamp) {
    // Convert Timestramp into date object
    let date = new Date(timestamp);
    date = new Date(date.setDate(date.getDate() + 1));
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = (month < 10 ? '0' : '') + month;
    day = (day < 10 ? '0' : '') + day;
    return `${date.getFullYear()}-${month}-${day}`;
  }

  filterList = (listItems, filterOption) => {
    const currentOption = this.state.filterConfig[filterOption];
    let filteredList = [];
    if (this.state.filterConfig.date && this.state.filterConfig.untilDate) {
      const startDateArr = this.state.filterConfig.date.split('-');
      const endDateArr = this.state.filterConfig.untilDate.split('-');
      const startDate = new Date(startDateArr[0], parseInt(startDateArr[1]) - 1, startDateArr[2], 0, 0, 0);
      const endDate = new Date(endDateArr[0], parseInt(endDateArr[1]) - 1, endDateArr[2], 23, 59, 59);
      filteredList = listItems.filter(item => {
        let shiftDate = new Date(item.date);
        shiftDate = new Date(shiftDate.setDate(shiftDate.getDate() + 1));
        return shiftDate >= startDate && shiftDate <= endDate;
      });
    } else if (filterOption === 'date') {
      filteredList = listItems.filter(item => this.convertTimestamp(item[filterOption]) === currentOption);
    } else if (filterOption === 'status') {
      filteredList = listItems.filter(item => item.status === currentOption);
    } else if (filterOption === 'location') {
      filteredList = listItems.filter(item => item.venue.id === currentOption);
    } else {
      filteredList = listItems.filter(item => item[filterOption].id === currentOption);
    }
    return filteredList;
  };

  updateListOnFilter = () => {
    if (this.state.shouldListUpdate) {
      let updatedListItems = [...this.state.shift];
      const filterableOptions = this.getFiterableOptions();
      if (filterableOptions.length > 0) {
        filterableOptions.forEach(option => {
          updatedListItems = this.filterList(updatedListItems, option);
        });
        updatedListItems = ShiftsStore.getShiftsGroupedByDate(updatedListItems);
      } else {
        updatedListItems = ShiftsStore.getShiftsGroupedByDate(this.state.shift);
      }
      this.setState({
        filteredData: updatedListItems,
        shouldListUpdate: false,
      });
    }
  };

  getFiterableOptions = () => {
    const options = [...Object.keys({ ...this.state.filterConfig })];
    const filteredOptions = options.filter(option => this.state.filterConfig[option] !== null);
    return filteredOptions;
  };

  clearFilters = () => {
    FilterActions.clearConfigFor('shiftList');
    this.setState({ shouldListUpdate: true });
    document.getElementById('form-component').reset();
  };

  render() {
    // console.log(this.state.filterConfig);
    const employee =
      this.props.match.path === '/talent/:id/offer' ? EmployeeStore.getById(this.props.match.params.id) : '';

    return (
      <div className="container-fluid" style={{ position: 'relative' }}>
        {this.props.match.path === '/talent/:id/offer' && !employee && <Redirect to="/talent/list" />}
        {this.props.match.path === '/talent/:id/offer' &&
          employee && (
            <h3>
              Select the shift you want to offer to{' '}
              <span className="employee-to-offer">
                {employee.profile.user.first_name} {employee.profile.user.last_name}
              </span>
            </h3>
          )}
        <div className="form-area">
          <Form title="Filter Shifts" orderedAs="row">
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <Select
                placeholder="Select a position"
                options={this.createOptionsObject('positions')}
                value={this.state.filterConfig.position || ''}
                onChange={option => this.updateFilterConfig(option ? option.value : null, 'position')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Location">Location</label>
              <Select
                placeholder="Select a location"
                options={this.createOptionsObject('venues')}
                value={this.state.filterConfig.location || ''}
                onChange={option => this.updateFilterConfig(option ? option.value : null, 'location')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                className="form-control"
                type="date"
                value={this.state.filterConfig.date || ''}
                name="date"
                id="date"
                onChange={event => this.updateFilterConfig(event.target.value, 'date')}
              />
            </div>
            {this.props.match.path === '/talent/:id/offer' ? (
              <div className="form-group">
                <label htmlFor="until-date">Until</label>
                <input
                  className="form-control"
                  type="date"
                  value={this.state.filterConfig.untilDate || ''}
                  name="until-date"
                  id="until-date"
                  onChange={event => this.updateFilterConfig(event.target.value, 'untilDate')}
                />
              </div>
            ) : (
              <div className="form-group switch-group">
                <label htmlFor="status">Status</label>
                <Select
                  placeholder="Select a status"
                  options={[
                    { label: 'Draft', value: 'DRAFT' },
                    { label: 'Receiving candidates', value: 'OPEN' },
                    { label: 'Filled', value: 'FILLED' },
                    { label: 'Paused', value: 'PAUSED' },
                    { label: 'Cancelled', value: 'CANCELLED' },
                  ]}
                  value={this.state.filterConfig.status || ''}
                  onChange={option => this.updateFilterConfig(option ? option.value : null, 'status')}
                />
              </div>
            )}
          </Form>
        </div>
        <div className="top-btn">
          {this.getFiterableOptions().length > 0 && (
            <button className="btn btn-primary" onClick={this.clearFilters}>
              Clear filters
            </button>
          )}
          {this.props.match.path !== '/talent/:id/offer' && (
            <Link to="/shift/create">
              <button className="btn btn-success">
                <i className="fa fa-plus" aria-hidden="true" />
                <span>Create a new shift</span>
              </button>
            </Link>
          )}
        </div>
        {Object.keys(this.state.filteredData).length > 0 ? (
          <List
            items={this.state.filteredData}
            type="componentList"
            heading="Company Shifts"
            component={ShiftGroup}
            match={this.props}
          />
        ) : (
          <h3 className="no-match">No shifts matching this criteria</h3>
        )}
        <Modal
          header="Shift"
          show={this.state.modalOpened && this.state.currentShift.id != null}
          onClose={this.toggleModal}
        >
          <p>Venue: {this.state.currentShift.location}</p>
          <p>Position: {this.state.currentShift.position}</p>
          <p>Date: {Moment(this.state.currentShift.date).format('MMM Do YYYY')}</p>
          <p>
            From {this.state.currentShift.start} to {this.state.currentShift.end}
          </p>
        </Modal>
      </div>
    );
  }
}
