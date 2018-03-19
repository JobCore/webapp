import React from 'react';
import Flux from "../../flux"
import { Redirect, Link } from "react-router-dom";
import swal from 'sweetalert2';
import uuid from 'uuid/v4';

import ReactStars from "react-stars";
import ProfilePic from "../../components/utils/ProfilePic";
import EmployeeStore from "../../store/EmployeeStore";
import EmployerStore from "../../store/EmployerStore";
import EmployerActions from '../../actions/employerActions';
import FavoriteListStore from "../../store/FavoriteListStore";

export class EmployeeDetails extends Flux.View {

  /**
   * React Stars API documentation
   * https://github.com/n49/react-stars
   **/

  constructor(props) {
    super(props);
    this.state = {
      employee: EmployeeStore.getById(props.match.params.id),
      employer: EmployerStore.getEmployer(),
    }
    this.bindStore(EmployerStore, this.setEmployer.bind(this));
  }

  setEmployer = () => {
    this.setState({
      employer: EmployerStore.getEmployer()
    });
  }

  employeeIsFavorite = () => {
    let favLists = FavoriteListStore.getAll();
    // console.log(favLists);
    let isFavorite = false;
    let favoritedInLists = [];
    favLists.forEach(list => {
      list.candidates.forEach(candidate => {
        if (parseInt(candidate.id) === this.state.employee.id) {
          isFavorite = true;
          favoritedInLists.push(list.title);
        };
      })
    });
    return { isFavorite, favoritedInLists };
  }

  renderFavorites = () => {
    const favInfo = this.employeeIsFavorite();
    const employerFavLists = FavoriteListStore.getAll();
    let message = favInfo.isFavorite ? "This person is already one of your favorites in the following lists:" : null;

    let favoritedLists = favInfo.favoritedInLists.length > 0 ? favInfo.favoritedInLists.map(
      list => <li key={uuid()}>{list}</li>) : null;

    let favoriteCheckboxes = employerFavLists.map(list => {
      let isChecked = favInfo.favoritedInLists.includes(list.title);
      return (
        <div className="cntr" key={uuid()}>
          <label htmlFor={list.id} className="label-cbx">
            <input id={list.id} type="checkbox" name={list.title}
              className="invisible" checked={isChecked} value={list.id}
              onChange={event => {
                if (event.target.checked) {
                  EmployerActions.addEmployeeToFavList(this.state.employee.id, list.id);
                } else {
                  EmployerActions.removeEmployeeFromFavList(this.state.employee.id, list.id);
                }
              }} />
            <div className="checkbox">
              <svg width="20px" height="20px" viewBox="0 0 20 20">
                <path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z"></path>
                <polyline points="4 11 8 15 16 6"></polyline>
              </svg>
            </div>
            <span>{list.title}</span>
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
                onClick={() => swal({
                  position: 'top',
                  title: 'Create a new list',
                  input: 'text',
                  type: 'info',
                  showCloseButton: true,
                  showCancelButton: true,
                  confirmButtonText: 'Confirm',
                  confirmButtonColor: '#d33',
                  cancelButtonText: 'Cancel',
                  cancelButtonColor: '#3085d6',
                }).then(result => {
                  if (result.value) {
                    EmployerActions.addNewList(result.value);
                    swal({
                      position: 'top',
                      type: "success",
                      html: 'List created'
                    })
                  }
                })}>
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
    const updatedDataState = { ...this.state.employee, };
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
    let positionsElement = this.state.employee.positions.map(
      position => <li key={uuid()}><span>{position.title}</span></li>
    );
    return positionsElement;
  }

  renderPositionsSummary = () => {
    let positionsSummary = this.state.employee.positions.map(
      position => (
        <li key={uuid()}>
          <p>
            <i className="fa fa-check" aria-hidden="true"></i>
            Worked as a {position.title}
          </p>
          <p className="date">14th of May 2017</p>
        </li>
      )
    );
    return positionsSummary;
  }

  renderBadges = () => {
    let badges = [];
    console.log(this.state.employee);
    this.state.employee.badges.forEach(badge => {
      badges.push(<span key={uuid()} className="tag badge badge-pill">{badge.title}</span>);
    });
    return badges;
  }

  renderDetails = () => {
    let responseTime = this.state.employee.response_time;
    responseTime = responseTime > 59 ? Math.ceil(responseTime / 60) + " hour(s)" : responseTime + " minute(s)";
    return (
      <div className={"row employee-details"}>
        <div className="col col-md-3 first-col">
          <ProfilePic
            rounded
            imageUrl={this.state.employee.profile.picture}
          />
          <div className="stars">
            <ReactStars
              size={40}
              value={parseFloat(this.state.employee.rating)}
              edit={false} />
          </div>
          <div className="jobs-summary">
            <h3>Doing {this.state.employee.currentJobs} jobs</h3>
            <ul>
              {this.renderPositionsListItems()}
            </ul>
          </div>
        </div>

        <div className="col col-md-5 second-col">
          <div className="header">
            <h3>{`${this.state.employee.profile.user.first_name} ${this.state.employee.profile.user.last_name}`}</h3>
            <span className="rate">$ {this.state.employee.minimum_hourly_rate}/hr Minimum Rate</span>
          </div>
          <div className="about">
            <p>{this.state.employee.profile.bio}</p>
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
            <Link to={this.props.match.url + "/offer"} >
              <button type="button" className="btn btn-warning btn-offer">
                Offer a Shift
              </button>
            </Link>
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

  render() {
    if (this.state.employee === undefined) {
      return <Redirect from={this.props.match.url} to="/talent/list" />;
    } else {
      return (
        <div>
          {this.renderDetails()}
        </div>
      );
    }
  }
}