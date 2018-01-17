import React from 'react';

import Moment from 'moment'

import { List } from '../../utils/List.jsx';
import Modal from '../../utils/Modal.jsx';
import shiftsStore from '../../../store/ShiftsStore.js';

export class ListShifts extends React.Component {

    /**
    *
    *   this.props = {
    *   }
    */
    constructor() {
        super();

        this.state = {
            data: shiftsStore.getAll('shift'),
            modalOpened: false,
            currentShift: { id: null }
        }
    }

    componentWillMount() {
        shiftsStore.on('change', () => {
            this.setState({
                data: shiftsStore.getAll('shift')
            });
        });
    }

    toggleModal(item) {
        console.log("Render the modal!!!", item);
        this.setState({
            modalOpened: !this.state.modalOpened,
            currentShift: item
        });
    }

    render() {

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-6"></div>
                    <div className="col-6"></div>
                    <div className="col-6"></div>
                </div>

                <List items={this.state.data} type={'table'} onItemClick={this.toggleModal.bind(this)} hiddenColumn={['id']} />
                <Modal show={(this.state.modalOpened && this.state.currentShift.id != null)} onClose={this.toggleModal.bind(this)}>
                    <p>Venue: {this.state.currentShift.location}</p>
                    <p>Position: {this.state.currentShift.position}</p>
                    <p>Date: {Moment(this.state.currentShift.date).format('MMM Do YYYY')}</p>
                    <p>From {this.state.currentShift.start} to {this.state.currentShift.end}</p>
                </Modal>
            </div>
        );
    }

};