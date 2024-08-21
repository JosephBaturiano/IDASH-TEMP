// TimesheetItem.jsx
import React from 'react';

function TimesheetItem({ description, date }) {
  return (
    <div className="timesheet-item">
      <p>Description: {description}</p>
      <p>Date: {date}</p>
    </div>
  );
}

export default TimesheetItem;
