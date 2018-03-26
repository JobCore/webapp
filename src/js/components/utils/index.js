import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Route, Redirect } from 'react-router-dom';

// const _BNavLink = function(args){
export const BNavLink = function(args) {
  const { to } = args;
  const rest = Object.assign({}, args);
  delete rest.children;
  delete rest.to;
  return (
    <NavLink to={to} className="nav-link" {...rest}>
      {args.children}
    </NavLink>
  );
};
// export const BNavLink = withRouter(_BNavLink)

export const PrivateRoute = function(args) {
  const Component = args.component;
  const rest = Object.assign({}, args);
  delete rest.component;
  return (
    <Route
      {...rest}
      render={props =>
        args.loggedIn === true ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  location: PropTypes.object,
};
