import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import ReactStars from "react-stars";
import ProfilePic from "../../utils/ProfilePic";
import Modal from "../../utils/Modal";
import employeeStore from "../../../store/EmployeeStore";

// import "../../../../css/view/employee_details.scss";

class EmployeeDetails extends Component {

  /**
   * React Stars API documentation
   * https://github.com/n49/react-stars
   **/

  state = {
    data: employeeStore.getById(this.props.match.params.id),
    modalOpened: false,
  }

  renderFavorites = () => {

    let message = this.state.data.favorite ? "This person is already one of your favorites in the following lists:" : null;

    let favoritedLists = this.state.data.favorite ? this.state.data.favoritedLists.map(position => {
      if (this.state.data.favoritedLists.indexOf(position) !== -1) {
        return <li key={position}>{position}</li>;
      } else {
        return null;
      }
    }) : null;

    let favoriteCheckboxes = this.props.favoriteLists.map(list => {
      let isChecked = this.state.data.favoritedLists.indexOf(list) !== -1;
      return (
        <div className="cntr" key={list}>
          <label htmlFor={list} className="label-cbx">
            <input id={list} type="checkbox" name={list}
              className="invisible" checked={isChecked} value={list}
              onChange={event => this.updateFavoritesHandler(event)} />
            <div className="checkbox">
              <svg width="20px" height="20px" viewBox="0 0 20 20">
                <path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z"></path>
                <polyline points="4 11 8 15 16 6"></polyline>
              </svg>
            </div>
            <span>{list}</span>
          </label>
        </div>
      );
    });

    return (
      <div className="favorite">
        <div className="btn-group dropdown">
          <button type="button" className="btn btn-warning btn-favorite btn-split-left">
            Add to Favorites
          </button>
          <button type="button" className="btn btn-warning btn-favorite dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="sr-only">Add to Favorites</span>
          </button>
          <div className="dropdown-menu">
            <div className="form-group">
              {favoriteCheckboxes}
            </div>
            <div className="form-group">
              <button className="btn btn-default btn-block"
                onClick={this.toggleModal}>
                <i className="fa fa-plus" aria-hidden="true"></i>
                <span>New List</span>
              </button>
            </div>
          </div>
        </div>


        <div className="message">
          <p>{message}</p>
          <ul className="favorite-positions-list">
            {favoritedLists}
          </ul>
        </div>
      </div>
    );
  }

  updateFavoritesHandler = (event) => {
    const updatedDataState = { ...this.state.data, };
    const updatedLists = [...updatedDataState.favoritedLists,];
    if (event.target.checked) {
      updatedLists.push(event.target.value);
    } else {
      let index = updatedLists.findIndex(listName => event.target.value === listName);
      updatedLists.splice(index, 1);
    }
    updatedDataState.favorite = updatedLists.length > 0;
    updatedDataState.favoritedLists = updatedLists;

    this.setState({ data: updatedDataState, });
  };


  renderPositionsListItems = () => {
    let positionsElement = Object.entries(this.state.data.positions).map(key => {
      return (
        <li key={key[0]}>
          <span>{key[0]}: </span><span>{key[1]} jobs</span>
        </li>
      );
    });
    return positionsElement;
  }

  renderPositionsSummary = () => {
    let positionsSummary = Object.entries(this.state.data.positions).map(key => {
      return (
        <li key={key[0]}>
          <p>
            <i className="fa fa-check" aria-hidden="true"></i>
            Worked for {key[1]} hours as a {key[0]}
          </p>
          <p className="date">14th of May 2017</p>
        </li>
      );
    });
    return positionsSummary;
  }

  renderBadges = () => {
    let badges = [];
    this.state.data.badges.forEach(badge => {
      badges.push(<span key={badge} className="tag badge badge-pill">{badge}</span>);
    });
    return badges;
  }

  renderDetails = () => {
    let responseTime = this.state.data.responseTime;
    responseTime = responseTime > 59 ? Math.ceil(responseTime / 60) + " hour(s)" : responseTime + " minute(s)";
    return (
      <div className={"row employee-details"}>
        <div className="col col-md-3 first-col">
          <ProfilePic
            rounded
            imageUrl={this.state.data.profilePicUrl}
          />
          <div className="stars">
            <ReactStars size={40} value={this.state.data.rating} edit={false} />
          </div>
          <div className="jobs-summary">
            <h3>Doing {this.state.data.currentJobs} jobs</h3>
            <ul>
              {this.renderPositionsListItems()}
            </ul>
          </div>
        </div>

        <div className="col col-md-5 second-col">
          <div className="header">
            <h3>{`${this.state.data.name} ${this.state.data.lastname}`}</h3>
            <span className="rate">{this.state.data.minHourlyRate} Minimum Rate</span>
          </div>
          <div className="about">
            <p>{this.state.data.about}</p>
          </div>
          <div className="activity">
            <h3>Recent Activity Reported</h3>
            <ul>
              {this.renderPositionsSummary()}
            </ul>
          </div>
        </div>

        <div className="col offset-md-1 col-md-3 third-col">
          <div className="header">
            <p className="response-time">
              <i className="fa fa-hourglass-end" aria-hidden="true"></i>
              Answers in: {responseTime}
            </p>
            <button type="button" className="btn btn-warning btn-offer">
              Offer a Shift
            </button>
          </div>

          {this.renderFavorites()}

          {
            this.renderBadges().length > 0 &&
            <div className="footer">
              <h3>Tags Earned</h3>
              <div className="tags-list">
                {this.renderBadges()}
              </div>
            </div>
          }
        </div>
      </div >
    );
  }

  toggleModal = () => {
    this.setState({
      modalOpened: !this.state.modalOpened,
    });
  }

  render() {
    if (this.state.data === undefined) {
      return <Redirect from={this.props.match.url} to="/talent/list" />;
    } else {
      return (
        <div>
          {this.renderDetails()}
          <Modal
            show={(this.state.modalOpened)}
            onClose={this.toggleModal}>
            <h4>Create New List</h4>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Name</label>
              <input name="favorite" className="form-control" type="text"
                id="new-favorite" placeholder="Name your new list"
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    this.props.addNewList(event);
                    this.toggleModal();
                  }
                }} />
              <small id="listHelp" className="form-text text-muted">To help you filter your favorite talents.</small>
              <small id="listHelp" className="form-text text-muted">Press Enter to create.</small>
            </div>

          </Modal>
        </div>
      );
    }
  }
}

export default EmployeeDetails;