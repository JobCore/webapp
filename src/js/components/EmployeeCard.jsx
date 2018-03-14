import React from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert2';
import ReactStars from 'react-stars';
import * as ShiftActions from '../actions/shiftActions';
import ShiftsStore from '../store/ShiftsStore';
import EmployeeActions from '../actions/employeeActions';
import EmployerStore from '../store/EmployerStore';

const EmployeeCard = ({ item, ...props }) => {
  let cardClasses = "list-item like-card";
  cardClasses += props.acceptedCandidates && props.acceptedCandidates.includes(item.id) ? " approved" : "";

  let formatedSubheading;
  item = typeof item === "string" ? ShiftsStore.getById(item) : item;

  const options = ['rating', 'currentJobs', 'favorite', 'responseTime', 'badges'];

  formatedSubheading = options.map(
    option => {
      switch (option) {
        case "favorite":
          if (!EmployerStore.isEmployeeInFavoriteList(item.id)) { return "" }
          return <span className={option} key={option}>{item[option]}</span>;
        case "rating":
          if (!item[option]) { return "" }
          return (
            <span className={option} key={option}>
              <ReactStars size={16} value={item[option]} edit={false} />
            </span>
          );
        case "badges":
          if (!item[option]) { return "" }
          let badges = item[option].map(badge => <span key={badge} className="badge">{badge}</span>)
          return (
            <span className={option} key={option}>
              {badges}
            </span>
          )
        case "responseTime":
          if (!item[option]) { return "" }
          let classes = [option];
          classes.push(item[option] > 719 ? "warning" : "fast");
          classes = classes.join(" ");
          let time = item[option] > 59 ? Math.ceil(item[option] / 60) + " hour(s)" : item[option] + " minute(s)";
          return <span className={classes} key={option}>Anwers in: {time}</span>;
        default:
          if (!item[option]) { return "" }
          return <span className={option} key={option}>{item[option]}</span>;
      }
    }
  );

  return (
    <div className={cardClasses}>
      <div className="content">
        <h5 className="heading">{`${item.name} ${item.lastname}`}</h5>
        <div className="sub-heading">
          {formatedSubheading}
        </div>
      </div>
      {
        props.acceptedCandidates && props.acceptedCandidates.includes(item.id) ?
          <div className="side">
            <p className="approved">Approved</p>
            <p className="reject"
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
                  ShiftActions.rejectCandidate(props.currentShiftId, item.id);
                  swal({
                    position: 'top',
                    type: "success",
                    html: '<p class="alert-message">Candidate rejected</p>'
                  })
                }
              })}>
              (Click to reject)
              </p>
          </div>
          :
          props.AcceptRejectButtons ?
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
                    ShiftActions.acceptCandidate(props.currentShiftId, item.id);
                    EmployeeActions.acceptedInShift(props.currentShiftId, item.id);
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
                    ShiftActions.rejectCandidate(props.currentShiftId, item.id);
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
              <Link to={"/talent/" + item.id} className="search"></Link>
              {
                props.removeCard &&
                <button className="delete" onClick={props.removeCard}></button>
              }
            </div>
      }
    </div>
  )
}

export default EmployeeCard;