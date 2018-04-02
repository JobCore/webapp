import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import uuidv4 from 'uuid';

import MenuStore from '../../store/MenuStore.js';

export class Navbar extends Component {
  constructor() {
    super();

    this.state = {
      data: MenuStore.getAll(),
    };
  }

  renderMenuItems(menuData) {
    const items = menuData.map(item => this.renderNavItem(item));

    return items;
  }

  renderNavItem(navItemData) {
    if (navItemData.links != null) return this.renderSidebarLink(navItemData);
    return this.renderSidebarLink(navItemData);
  }

  renderLikeADropDown(navItemData) {
    const links = navItemData.links.map(link => (
      <a key={uuidv4()} className="dropdown-item" href={link.url}>
        {link.label}
      </a>
    ));
    return (
      <li key={uuidv4()} className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {navItemData.label}
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          {links}
        </div>
      </li>
    );
  }

  renderSidebarLink(navItemData) {
    if (Array.isArray(navItemData.links)) {
      const links = navItemData.links.map(link => (
        <li key={uuidv4()}>
          <NavLink to={link.url}>{link.label}</NavLink>
        </li>
      ));
      return (
        <li key={uuidv4()} className="nav-item" data-toggle="tooltip" data-placement="right" title={navItemData.label}>
          <a
            className="nav-link nav-link-collapse collapsed"
            data-toggle="collapse"
            href={`#sidebarAnchor${navItemData.id}`}
            data-parent="#exampleAccordion"
          >
            <i className={`fa fa-fw fa-${navItemData.icon}`} />
            <span className="nav-link-text">{navItemData.label}</span>
          </a>
          <ul className="sidenav-second-level collapse" id={`sidebarAnchor${navItemData.id}`}>
            {links}
          </ul>
        </li>
      );
    }

    return (
      <li key={uuidv4()} className="nav-item" data-toggle="tooltip" data-placement="right" title={navItemData.label}>
        <NavLink className="nav-link" to={navItemData.url}>
          <i className={`fa fa-fw fa-${navItemData.icon}`} />
          <span className="nav-link-text">{navItemData.label}</span>
        </NavLink>
      </li>
    );
  }

  renderLikeALink(navItemData) {
    return (
      <li key={uuidv4()} className="nav-item">
        <a className="nav-link" href="#">
          {navItemData.label}
        </a>
      </li>
    );
  }

  render() {
    if (!this.props.authenticated)
      return (
        <nav className="navbar navbar-expand-lg  navbar-dark sticky-footer bg-dark">
          <NavLink to="/" className="navbar-brand">
            JobCore
          </NavLink>
          <div className="navbar-nav ml-auto">
            <NavLink className="nav-item nav-link" to="/login">
              Login
            </NavLink>
            <NavLink className="nav-item nav-link" to="/register">
              Register
            </NavLink>
          </div>
        </nav>
      );

    return (
      <nav className="navbar navbar-expand-lg  navbar-dark sticky-footer bg-dark" id="mainNav">
        <NavLink to="/" className="navbar-brand">
          JobCore
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav navbar-sidenav" id="exampleAccordion">
            {this.renderMenuItems(this.state.data)}
          </ul>
          <ul className="navbar-nav sidenav-toggler">
            <li className="nav-item">
              <a className="navBuilding-link text-center" id="sidenavToggler">
                <i className="fa fa-fw fa-angle-left" />
              </a>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto d-md-none d-lg-flex">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle mr-lg-2"
                id="messagesDropdown"
                href="#"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fa fa-fw fa-envelope" />
                <span className="d-lg-none">
                  Messages
                  <span className="badge badge-pill badge-primary">12 New</span>
                </span>
                <span className="indicator text-primary d-none d-lg-block">
                  <i className="fa fa-fw fa-circle" />
                </span>
              </a>
              <div className="dropdown-menu" aria-labelledby="messagesDropdown">
                <h6 className="dropdown-header">New Messages:</h6>
                <div className="dropdown-divider" />
                <a className="dropdown-item" href="#">
                  <strong>David Miller</strong>
                  <span className="small float-right text-muted">11:21 AM</span>
                  <div className="dropdown-message small">
                    Hey there! This new version of SB Admin is pretty awesome! These messages clip off when they reach
                    the end of the box so they don't overflow over to the sides!
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item" href="#">
                  <strong>Jane Smith</strong>
                  <span className="small float-right text-muted">11:21 AM</span>
                  <div className="dropdown-message small">
                    I was wondering if you could meet for an appointment at 3:00 instead of 4:00. Thanks!
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item" href="#">
                  <strong>John Doe</strong>
                  <span className="small float-right text-muted">11:21 AM</span>
                  <div className="dropdown-message small">
                    I've sent the final files over to you for review. When you're able to sign off of them let me know
                    and we can discuss distribution.
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item small" href="#">
                  View all messages
                </a>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle mr-lg-2"
                id="alertsDropdown"
                href="#"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fa fa-fw fa-bell" />
                <span className="d-lg-none">
                  Alerts
                  <span className="badge badge-pill badge-warning">6 New</span>
                </span>
                <span className="indicator text-warning d-none d-lg-block">
                  <i className="fa fa-fw fa-circle" />
                </span>
              </a>
              <div className="dropdown-menu" aria-labelledby="alertsDropdown">
                <h6 className="dropdown-header">New Alerts:</h6>
                <div className="dropdown-divider" />
                <a className="dropdown-item" href="#">
                  <span className="text-success">
                    <strong>
                      <i className="fa fa-long-arrow-up fa-fw" />Status Update
                    </strong>
                  </span>
                  <span className="small float-right text-muted">11:21 AM</span>
                  <div className="dropdown-message small">
                    This is an automated server response message. All systems are online.
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item" href="#">
                  <span className="text-danger">
                    <strong>
                      <i className="fa fa-long-arrow-down fa-fw" />Status Update
                    </strong>
                  </span>
                  <span className="small float-right text-muted">11:21 AM</span>
                  <div className="dropdown-message small">
                    This is an automated server response message. All systems are online.
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item" href="#">
                  <span className="text-success">
                    <strong>
                      <i className="fa fa-long-arrow-up fa-fw" />Status Update
                    </strong>
                  </span>
                  <span className="small float-right text-muted">11:21 AM</span>
                  <div className="dropdown-message small">
                    This is an automated server response message. All systems are online.
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item small" href="#">
                  View all alerts
                </a>
              </div>
            </li>
            <li className="nav-item">
              <form className="form-inline my-2 my-lg-0 mr-lg-2">
                <div className="input-group">
                  <input className="form-control" type="text" placeholder="Search for..." />
                  <span className="input-group-btn">
                    <button className="btn btn-primary" type="button">
                      <i className="fa fa-search" />
                    </button>
                  </span>
                </div>
              </form>
            </li>
            <li className="nav-item">
              <a onClick={this.props.onLogout} className="nav-link" data-toggle="modal" data-target="#exampleModal">
                <i className="fa fa-fw fa-sign-out" />Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool,
  onLogout: PropTypes.func,
};
