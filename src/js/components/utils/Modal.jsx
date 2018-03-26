import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ show, size, onClose, children, header }) => {
  /**
   *
   *   this.props = {
   *   }
   */

  // Render nothing if the "show" prop is false
  let classes = 'backdrop';
  classes += !show ? ' closed' : '';
  classes += size === 'fullscreen' ? ' fullscreen' : '';

  return (
    <div className={classes}>
      <div className="modal">
        <button className="close-modal" onClick={onClose}>
          X
        </button>
        <div className="modal-header">
          <h3>{header}</h3>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  show: PropTypes.bool,
  size: PropTypes.string,
  onClose: PropTypes.func,
  header: PropTypes.string,
  children: PropTypes.array,
};

export default Modal;
