import React from 'react';
import Shift from './Shift';
import uuid from 'uuid/v4';

const ShiftGroup = ({ heading, items, ...props }) => {
  function getOrdinalNum(n) {
    return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
  }

  return (
    <div className="shiftGroup">
      <div className="shiftGroup__header">
        {
          `${new Date(parseInt(heading))
            .toLocaleDateString("en-us", { month: "long" })}
          ${getOrdinalNum(new Date(parseInt(heading)).getDate())}`
        }
      </div>
      <div className="shifts">
        {
          items.map(item =>
            <Shift key={uuid()} item={item} {...props} />)
        }
      </div>
    </div>
  )
}

export default ShiftGroup;