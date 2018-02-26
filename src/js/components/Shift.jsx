import React from 'react';
import Editor from './Editor';
import * as ShiftActions from '../actions/shiftActions';

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

  const updateShift = (id, param, value) => {
    ShiftActions.updateShift(id, param, value);
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
          <span className="editor-area">
            <Editor
              id={item.id}
              message="Change restriction for this Shift"
              onEdit={updateShift}
              param="favoritesOnly"
              currentValue={item.restrictions.favoritesOnly}
              options={[
                { label: "Favorites employees only", value: true },
                { label: "Anyone can apply", value: false }
              ]}>
              <span className={item.restrictions.favoritesOnly ? "favorite" : "anyone"}>
              </span>
            </Editor>
          </span>
          <span className="editor-area">
            <Editor
              id={item.id}
              message="Change status for this Shift"
              onEdit={updateShift}
              param="status"
              currentValue={item.status}
              options={[
                { label: "Receiving candidates", value: "Receiving candidates" },
                { label: "Filled", value: "Filled" },
                { label: "Cancelled", value: "Cancelled" },
                { label: "Paused", value: "Paused" },
                { label: "Draft", value: "Draft" }
              ]}>
              <span className={statusClass}></span>
            </Editor>
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