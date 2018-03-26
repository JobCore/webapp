import React from 'react';
import PropTypes from 'prop-types';

const Globe = ({ children, onClose, classes }) => (
  <div className={`globe ${classes || ''}`}>
    <div className="close-btn" onClick={onClose}>
      X
    </div>
    <div className="content">{children}</div>
    <div className="triangle" />
  </div>
);

Globe.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
  classes: PropTypes.string,
};

export default Globe;
