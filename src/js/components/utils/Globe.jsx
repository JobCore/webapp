import React from 'react';

const Globe = ({ children, onClose }) => (
  <div className="globe">
    <div className="close-btn" onClick={onClose}>X</div>
    <div className="content">
      {children}
    </div>
    <div className="triangle"></div>
  </div>

)

export default Globe;