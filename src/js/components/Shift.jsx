import React from 'react';

const Shift = ({ item }) => {
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
          {
            item.restrictions.favoritesOnly ?
              <span className="favorite">Favorites employees only</span>
              :
              <span className="anyone">Anyone can apply</span>
          }
          <span className={statusClass}>
            {item.status}
          </span>
        </div>
      </div>
      <button className="btn btn-warning show-employees-btn">
        {/* Users Icon in Styles*/}
      </button>
      <button className="btn btn-warning edit-btn">
        {/* Edit Icon in Styles*/}
      </button>
    </div>
  )
}

export default Shift;