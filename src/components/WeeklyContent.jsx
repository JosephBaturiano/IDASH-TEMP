import React from 'react';

function TimesheetItem({ date, descriptions, showDate, isLastInGroup }) {
  const dateObj = new Date(date);
  
  // Debugging: Check if date is being parsed correctly
  console.log('Date prop:', date);
  console.log('Formatted date:', dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }));

  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const weekday = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
  });

  return (
    <tr className={`border border-black ${isLastInGroup ? 'border-b-0' : ''}`}>
      <td className="border border-black w-32 text-center text-base">
        {showDate ? (
          <>
            {formattedDate}
            <br />
            <span className="text-gray-600">({weekday})</span>
          </>
        ) : (
          // Debugging: Check if the date is not shown
          <span className="text-red-500">Date not shown</span>
        )}
      </td>
      <td className="border border-black">
        <ul className="list-disc pl-5 text-base">
          {descriptions.map((desc, index) => (
            <li key={index} className="pb-0.5">{desc}</li>
          ))}
        </ul>
      </td>
    </tr>
  );
}

export default TimesheetItem;
