import React from 'react';
import { Link } from 'react-router-dom';

const Shift = ({ item, ...props }) => {
  let shiftCardClass = "shift-card",
    employeeSummaryClass = "employee-summary",
    statusClass = "status";

  switch (item.status) {
    case "Receiving candidates":
      employeeSummaryClass += " receiving";
      shiftCardClass += " receiving";
      statusClass += " receiving";
      break;
    case "Filled":
      employeeSummaryClass += " filled";
      shiftCardClass += " filled";
      statusClass += " filled";
      break;
    case "Paused":
      employeeSummaryClass += " paused";
      shiftCardClass += " paused";
      statusClass += " paused";
      break;
    case "Cancelled":
      employeeSummaryClass += " cancelled";
      shiftCardClass += " cancelled";
      statusClass += " cancelled";
      break;
    case "Draft":
      employeeSummaryClass += " draft";
      shiftCardClass += " draft";
      statusClass += " draft";
      break;
    default:
      employeeSummaryClass += " draft";
      shiftCardClass += " draft";
      statusClass += " draft";
      break;
  }

  return (
    <div className={shiftCardClass}>
      <div className={employeeSummaryClass}>
        {item.confirmedEmployees}/{item.maxAllowedEmployees}
      </div>
      <div className="shift-card__content">
        <div className="shift-card__content__upper-side">
          {item.position} @ {item.location}, {item.start} - {item.end} ({item.duration})
        </div>
        <div className="shift-card__content__bottom-side">
          <span className={item.restrictions.favoritesOnly ? "favorite" : "anyone"}>
          </span>

          <span className={statusClass}></span>
        </div>
      </div>
      {
        item.status !== "Draft" &&
        <Link className="btn btn-warning show-employees-btn" to={`/shift/${item.id}`}>
          {/* Users Icon in Styles*/}
        </Link>
      }

      {
        item.status !== "Draft" ?
          <Link className="btn btn-warning edit-btn" to={`/shift/${item.id}/edit`}>
            {/* Edit Icon in Styles*/}
          </Link>
          :
          <Link className="btn btn-warning edit-btn" to={`/shift/${item.id}`}>
            {/* Edit Icon in Styles*/}
          </Link>
      }

    </div>
  )
}

export default Shift;