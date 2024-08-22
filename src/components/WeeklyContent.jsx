import React from 'react';

function TimesheetItem({ descriptions, date }) {
  // Create a Date object from the date string
  const dateObj = new Date(date);

  // Format the date to "Month Day, Year"
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
    <tr className="border border-black">
      <td className="border border-black px-4 py-2 w-32 text-center">
        {formattedDate}
        <br />
        <span className="text-gray-600">({weekday})</span>
      </td>
      <td className="border border-black px-4 py-2">
        <ul className="list-disc pl-6">
          {descriptions.map((desc, index) => (
            <li key={index}>{desc}</li>
          ))}
        </ul>
      </td>
    </tr>
  );
}

export default TimesheetItem;