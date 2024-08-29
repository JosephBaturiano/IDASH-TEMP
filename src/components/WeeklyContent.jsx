import React from 'react';

function TimesheetItem({ date, descriptions, showDate, isLastInGroup }) {
  const dateObj = new Date(date);

  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const weekday = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
  });

  // Join descriptions into a single paragraph with commas
  const descriptionParagraph = descriptions.join(', ');

  return (
    <tr className={`border border-black ${isLastInGroup ? 'border-b-0' : ''}`}>
      <td className="border border-black w-32 text-center text-sm">
        {showDate ? (
          <>
            {formattedDate}
            <br />
            <span className="text-gray-600 ">({weekday})</span>
          </>
        ) : (
          <span className="text-red-500">Date not shown</span>
        )}
      </td>
      <td className="border border-black text-sm p-2">
        {descriptionParagraph}
      </td>
    </tr>
  );
}

export default TimesheetItem;
