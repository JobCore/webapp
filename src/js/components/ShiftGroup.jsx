import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import Shift from './Shift';

const ShiftGroup = ({ heading, items, ...props }) => {
  function getOrdinalNum(n) {
    return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
  }

  // Increase date by 1 day due to javascript offset
  heading = new Date(parseInt(heading));
  heading = heading.setDate(heading.getDate() + 1);

  return (
    <div className="shiftGroup">
      <div className="shiftGroup__header">
        {`${new Date(parseInt(heading)).toLocaleDateString('en-us', { month: 'long' })}
          ${getOrdinalNum(new Date(parseInt(heading)).getDate())}`}
      </div>
      <div className="shifts">{items.map(item => <Shift key={uuid()} item={item} {...props} />)}</div>
    </div>
  );
};

ShiftGroup.propTypes = {
  heading: PropTypes.string,
  items: PropTypes.any,
};

export default ShiftGroup;
