import React from 'react';

function TimesheetItem({ description, date }) {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get the weekday
  const weekday = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
  });

  return (
    <div>
          
      <td>
        {formattedDate}
        <br />
        <span className="text-gray-600">({weekday})</span>
      </td>
      <td>
        <ul>
          {description.map((desc, index) => (
            <li key={index}>{desc}</li>
          ))}
        </ul>
      </td>
   
    </div>
  );
}

export default TimesheetItem;

