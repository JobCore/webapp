import React from 'react';
import uuid from 'uuid/v4';
import ReactStars from 'react-stars';

import Flux from '../../flux';
import EmployerStore from '../../store/EmployerStore';
import ProfilePic from '../../components/utils/ProfilePic';
import { PUT } from '../../store/ApiRequests';
import InlineEditor from '../../components/InlineEditor';
import EmployerActions from '../../actions/employerActions';
import ProfileActions from '../../actions/profileActions';

class EmployerProfile extends Flux.View {
  constructor(props) {
    super(props);
    this.state = {
      employer: EmployerStore.getEmployer(),
    };

    this.bindStore(EmployerStore, this.setEmployer);
  }

  setEmployer = () => {
    this.setState({
      employer: EmployerStore.getEmployer(),
    });
  };

  toggleInlineEditor = () => {
    this.setState(prevState => ({
      ...prevState,
      isInlineEditorOpen: !prevState.isInlineEditorOpen,
    }));
  };

  render() {
    const EMPLOYER = this.state.employer;
    let responseTime = EMPLOYER.response_time || 0;
    responseTime = responseTime > 59 ? `${Math.ceil(responseTime / 60)} hour(s)` : `${responseTime} minute(s)`;

    return (
      <div className="employer-profile">
        <div className="first-column">
          <div className="profile-pic">
            <ProfilePic rounded imageUrl={EMPLOYER.profile.picture} alt={`${EMPLOYER.title}'s profile`} />
            <div className="employer-info">
              <InlineEditor
                id={EMPLOYER.id}
                currentValue={EMPLOYER.title}
                onEdit={EmployerActions.updateEmployer}
                param="title"
              >
                <h2>{EMPLOYER.title}</h2>
              </InlineEditor>

              <InlineEditor
                id={EMPLOYER.id}
                currentValue={EMPLOYER.website}
                onEdit={EmployerActions.updateEmployer}
                param="website"
              >
                <p>{EMPLOYER.website}</p>
              </InlineEditor>

              <InlineEditor
                id={EMPLOYER.profile.id}
                currentValue={EMPLOYER.profile.location}
                onEdit={ProfileActions.updateProfile}
                param="location"
              >
                <p>{EMPLOYER.profile.location}</p>
              </InlineEditor>

              <InlineEditor
                id={EMPLOYER.profile.id}
                currentValue={EMPLOYER.profile.bio}
                onEdit={ProfileActions.updateProfile}
                param="bio"
              >
                <p>{EMPLOYER.profile.bio}</p>
              </InlineEditor>
            </div>
          </div>

          <ReactStars edit={false} size={40} value={parseFloat(EMPLOYER.rating)} />

          <div className="user-data">
            <h2>Update user data</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                const data = {
                  username: this['user-input'].value || null,
                  password: this['password-input'].value || null,
                  email: this['email-input'].value || null,
                };
                PUT('users', EMPLOYER.profile.user.id, data);
              }}
            >
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  className="form-control"
                  name="email"
                  type="email"
                  defaultValue={EMPLOYER.profile.user.email}
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
                  defaultValue={EMPLOYER.profile.user.username}
                  ref={el => {
                    this['user-input'] = el;
                  }}
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  className="form-control"
                  name="password"
                  type="password"
                  ref={el => {
                    this['password-input'] = el;
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
        </div>

        <div className="second-column">
          <div className="response-time">
            <i className="fa fa-hourglass-end" aria-hidden="true" />
            <span>Answers in: {responseTime}</span>
          </div>
          <div className="badges">
            <h2>Badges earned</h2>
            <div className="tags-list">
              {EMPLOYER.badges.map(badge => (
                <span key={uuid()} className="tag badge badge-pill">
                  {badge.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EmployerProfile;
