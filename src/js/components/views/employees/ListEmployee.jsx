import React from 'react';

import Moment from 'moment'

import { List } from '../../utils/List.jsx';
import Modal from '../../utils/Modal.jsx';
import shiftsStore from '../../../store/ShiftsStore.js';

export class ListEmployee extends React.Component {

  /**
  *
  *   this.props = {
  *   }
  */
  constructor() {
    super();

    this.state = {
      data: shiftsStore.getAll('employee'),
    }
  }

  componentWillMount() {
    shiftsStore.on('change', () => {
      this.setState({
        data: shiftsStore.getAll('employee')
      });
    });
  }

  render() {

    return (
      <div className="container">
        <List items={this.state.data} type={'table'} hiddenColumns={['id']}
          columns={['name', 'lastname', 'responseTime']} />
      </div>
    );
  }

};