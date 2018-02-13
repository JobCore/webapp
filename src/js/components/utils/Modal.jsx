import React, { Component } from "react";

class Modall extends Component {

  /**
  *
  *   this.props = {
  *   }
  */

  render() {
    // Render nothing if the "show" prop is false
    let classes = "backdrop";
    classes += !this.props.show ? " closed" : "";
    classes += this.props.size === "fullscreen" ? " fullscreen" : "";

    return (
      <div className={classes}>
        <div className="modal">
          <button className="close-modal" onClick={this.props.onClose}>
            X
          </button>
          <div className="modal-header">
            <h3>
              {this.props.header}
            </h3>
          </div>
          <div className="modal-content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Modall;