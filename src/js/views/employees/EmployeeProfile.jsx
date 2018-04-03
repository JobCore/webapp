import React from 'react';
import uuid from 'uuid/v4';
import ReactStars from 'react-stars';
import swal from 'sweetalert2';

import Flux from '../../flux';
import EmployeeStore from '../../store/EmployeeStore';
import ProfilePic from '../../components/utils/ProfilePic';
import { PUT, PATCH } from '../../store/ApiRequests';
import InlineEditor from '../../components/InlineEditor';
import EmployeeActions from '../../actions/employeeActions';
import ProfileActions from '../../actions/profileActions';
import LoginStore from '../../store/LoginStore';

class EmployeeProfile extends Flux.View {
  constructor(props) {
    super(props);
    this.state = {
      employee: EmployeeStore.getById(LoginStore.getUser().employee),
    };

    this.bindStore(EmployeeStore, this.setEmployee);
  }

  setEmployee = () => {
    this.setState({
      employee: EmployeeStore.getById(LoginStore.getUser().employee),
    });
  };

  updateUser = data => {
    const EMPLOYEE = this.state.employee;
    const METHOD = data.new_password ? PATCH : PUT;
    data = JSON.stringify(data);
    METHOD('user', EMPLOYEE.profile.user.id, data)
      .then(data => {
        Object.keys(data).map(key => {
          if (Array.isArray(data[key])) {
            throw Error(`${key}: ${data[key][0]}`);
          }
          return 1;
        });
        return 1;
      })
      .then(() => {
        let message = `Password changed`;
        if (METHOD === PUT) {
          EmployeeActions.getAll();
          message = `Changes saved`;
        }
        swal({
          type: 'success',
          showCloseButton: true,
          html: message,
        });
      })
      .catch(err =>
        swal({
          type: 'error',
          showCloseButton: true,
          html: `${err}`,
        })
      );
  };

  render() {
    const EMPLOYEE = this.state.employee;
    let responseTime = EMPLOYEE.response_time || 0;
    responseTime = responseTime > 59 ? `${Math.ceil(responseTime / 60)} hour(s)` : `${responseTime} minute(s)`;
    return (
      <div className="employee-profile">
        <div className="first-row">
          <div className="first-column">
            <div className="profile-pic">
              <ProfilePic rounded imageUrl={EMPLOYEE.profile.picture} alt={`${EMPLOYEE.title}'s profile`} />
              <div className="employee-info">
                <h2>{`${EMPLOYEE.profile.user.first_name} ${EMPLOYEE.profile.user.last_name}`}</h2>

                <InlineEditor
                  id={EMPLOYEE.profile.id}
                  placeholder="Location"
                  maxLength="30"
                  currentValue={EMPLOYEE.profile.location}
                  onEdit={ProfileActions.updateProfile}
                  param="location"
                >
                  <p>{EMPLOYEE.profile.location || 'Click to edit location'}</p>
                </InlineEditor>

                <InlineEditor
                  type="textarea"
                  id={EMPLOYEE.profile.id}
                  maxLength="250"
                  placeholder="Write a short description about yourself"
                  currentValue={EMPLOYEE.profile.bio}
                  onEdit={ProfileActions.updateProfile}
                  param="bio"
                >
                  <p>{EMPLOYEE.profile.bio || 'Click to edit bio'}</p>
                </InlineEditor>
              </div>
            </div>

            <ReactStars edit={false} size={40} value={parseFloat(EMPLOYEE.rating)} />
          </div>

          <div className="second-column">
            <div className="response-time">
              <i className="fa fa-hourglass-end" aria-hidden="true" />
              <span>Answers in: {responseTime}</span>
            </div>
            <div className="badges">
              <h2>Badges earned</h2>
              <div className="tags-list">
                {EMPLOYEE.badges.map(badge => (
                  <span key={uuid()} className="tag badge badge-pill">
                    {badge.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="second-row">
          <div className="user-data">
            <h2>Update user profile</h2>
            <form
              className="profile-data"
              onSubmit={e => {
                e.preventDefault();
                const data = {
                  first_name: this['first-name-input'].value || null,
                  last_name: this['last-name-input'].value || null,
                  username: this['user-input'].value || null,
                  email: this['email-input'].value || null,
                };
                Object.keys(data).map(key => (data[key] == null ? delete data[key] : null));
                if (Object.keys(data).length > 0) {
                  this.updateUser(data);
                }
                return 0;
              }}
            >
              <div className="input-group">
                <label htmlFor="first-name">First name</label>
                <input
                  className="form-control"
                  name="first-name"
                  type="text"
                  maxLength="250"
                  placeholder={EMPLOYEE.profile.user.first_name}
                  ref={el => {
                    this['first-name-input'] = el;
                  }}
                />
              </div>
              <div className="input-group">
                <label htmlFor="last-name">Last name</label>
                <input
                  className="form-control"
                  name="last-name"
                  type="text"
                  placeholder={EMPLOYEE.profile.user.last_name}
                  ref={el => {
                    this['last-name-input'] = el;
                  }}
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  className="form-control"
                  name="email"
                  type="email"
                  placeholder={EMPLOYEE.profile.user.email}
                  ref={el => {
                    this['email-input'] = el;
                  }}
                />
              </div>

              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  className="form-control"
                  name="username"
                  type="text"
                  placeholder={EMPLOYEE.profile.user.username}
                  ref={el => {
                    this['user-input'] = el;
                  }}
                />
              </div>
              <div className="input-group">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>

          <div className="change-password">
            <h2>Change password</h2>
            <form
              className="password-data"
              onSubmit={e => {
                e.preventDefault();
                const data = {
                  old_password: this['old-password-input'].value,
                  new_password: this['new-password-input'].value,
                };
                this.updateUser(data);
              }}
            >
              <div className="input-group">
                <label htmlFor="old_password">Old password</label>
                <input
                  className="form-control"
                  name="old_password"
                  type="password"
                  ref={el => {
                    this['old-password-input'] = el;
                  }}
                />
              </div>
              <div className="input-group">
                <label htmlFor="new_password">New password</label>
                <input
                  className="form-control"
                  name="new_password"
                  type="password"
                  ref={el => {
                    this['new-password-input'] = el;
                  }}
                />
              </div>
              <div className="input-group">
                <button type="submit" className="btn btn-primary">
                  Change
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default EmployeeProfile;
