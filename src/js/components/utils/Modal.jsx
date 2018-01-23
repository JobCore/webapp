import React from "react";
import PropTypes from "prop-types";

class Modal extends React.Component {

  /**
  *
  *   this.props = {
  *   }
  */

  render() {

    // Render nothing if the "show" prop is false
    if (!this.props.show) {
      return null;
    }

    // The gray background
    const backdropStyle = {
      position: "fixed",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
      padding: 50,
    };

    // The modal "window"
    const modalStyle = Object.assign(this.props.style || {}, {
      maxWidth: 500,
      minHeight: 300,
      display: "block",
      margin: "0 auto",
      padding: 30,
    });

    return (
      <div className="backdrop" style={backdropStyle}>
        <div style={modalStyle} className="modal" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                {this.props.children}
              </div>
              <div className="modal-footer">
                {this.renderSaveBtn()}
                <button type="button" className="btn btn-secondary" onClick={this.props.onClose} data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }

  renderSaveBtn() {
    if (typeof this.props.saveLabel !== "undefined") {
      return (<button type="button" className="btn btn-primary">{this.props.saveLabel}</button>);
    }
    else {
      return null;
    }
  }
}

Modal.propTypes = {
  saveLabel: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node,
  style: PropTypes.object,
};

export default Modal;