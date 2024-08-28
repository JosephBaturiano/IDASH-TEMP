import React from 'react';

function TimesheetItem({ description, date, showDate }) {
  const dateObj = new Date(date);

  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const weekday = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
  });

  return (
    <tr className="border border-black">
      <td className="border border-black w-32 text-center">
        {showDate ? (
          <>
            {formattedDate}
            <br />
            <span className="text-gray-600">({weekday})</span>
          </>
        ) : null}
      </td>
      <td className="border border-black ">
        {description}
      </td>
    </tr>
  );
}

export default TimesheetItem;

