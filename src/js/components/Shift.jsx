import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Shift = ({ item, ...props }) => {
  let shiftCardClass = 'shift-card';
  let employeeSummaryClass = 'employee-summary';
  let statusClass = 'status';

  switch (item.status) {
    case 'OPEN':
      employeeSummaryClass += ' receiving';
      shiftCardClass += ' receiving';
      statusClass += ' receiving';
      break;
    case 'FILLED':
      employeeSummaryClass += ' filled';
      shiftCardClass += ' filled';
      statusClass += ' filled';
      break;
    case 'PAUSED':
      employeeSummaryClass += ' paused';
      shiftCardClass += ' paused';
      statusClass += ' paused';
      break;
    case 'CANCELLED':
      employeeSummaryClass += ' cancelled';
      shiftCardClass += ' cancelled';
      statusClass += ' cancelled';
      break;
    case 'DRAFT':
      employeeSummaryClass += ' draft';
      shiftCardClass += ' draft';
      statusClass += ' draft';
      break;
    default:
      employeeSummaryClass += ' draft';
      shiftCardClass += ' draft';
      statusClass += ' draft';
      break;
  }

  return (
    <div className={shiftCardClass}>
      <div className={employeeSummaryClass}>
        {item.employees ? item.employees.length : 0}/{item.maximum_allowed_employees}
      </div>
      <div className="shift-card__content">
        <div className="shift-card__content__upper-side">
          {item.position.title} @ {item.venue.title}, {item.start_time.match(/[0-9]{2}:[0-9]{2}/)} -{' '}
          {item.finish_time.match(/[0-9]{2}:[0-9]{2}/)} ({parseFloat(item.finish_time) - parseFloat(item.start_time)}hrs)
        </div>
        <div className="shift-card__content__bottom-side">
          <span className={item.application_restriction === 'FAVORITES' ? 'favorite' : 'anyone'} />

          <span className={statusClass} />
        </div>
      </div>
      {item.status !== 'DRAFT' &&
        props.match.path !== '/talent/:id/offer' && (
          <Link className="btn btn-warning show-employees-btn" to={`/shift/${item.id}`}>
            {/* Users Icon in Styles */}
          </Link>
        )}
      {props.match.path === '/talent/:id/offer' ? (
        <button className="btn btn-warning offer-btn">Offer this shift</button>
      ) : item.status !== 'DRAFT' ? (
        <Link className="btn btn-warning edit-btn" to={`/shift/${item.id}/edit`}>
          {/* Edit Icon in Styles */}
        </Link>
      ) : (
        <Link className="btn btn-warning edit-btn" to={`/shift/${item.id}`}>
          {/* Edit Icon in Styles */}
        </Link>
      )}
    </div>
  );
};

Shift.propTypes = {
  match: PropTypes.object,
  item: PropTypes.object,
};

export default Shift;
