// src/components/TimeRendered.js

import React from 'react';

// Function to convert 12-hour time format to 24-hour format
const convertTo24HourFormat = (time) => {
  const [timePart, modifier] = time.split(' ');
  const [hours, minutes] = timePart.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) {
    console.error(`Invalid time format: ${time}`);
    return null; // Return null if invalid time
  }

  let newHours = hours;
  if (modifier === 'pm' && hours !== 12) {
    newHours += 12;
  }
  if (modifier === 'am' && hours === 12) {
    newHours = 0;
  }

  return { hours: newHours, minutes };
};

// Function to calculate total time from timesheets
const calculateTotalTime = (timesheets) => {
  return timesheets.reduce((total, item) => {
    if (item.timeStarted && item.timeEnded) {
      // Convert times to 24-hour format
      const startTime24 = convertTo24HourFormat(item.timeStarted);
      const endTime24 = convertTo24HourFormat(item.timeEnded);

      if (!startTime24 || !endTime24) {
        console.error(`Invalid time conversion: ${item.timeStarted} - ${item.timeEnded}`);
        return total; // Skip invalid time entries
      }

      // Create Date objects for start and end times
      const startTime = new Date();
      startTime.setHours(startTime24.hours, startTime24.minutes, 0, 0);

      const endTime = new Date();
      endTime.setHours(endTime24.hours, endTime24.minutes, 0, 0);

      // Handle case where end time is before start time
      if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1); // Add one day to end time
      }

      // Calculate the difference in milliseconds
      const diff = endTime - startTime;

      if (diff < 0) {
        console.error(`End time is before start time: ${item.timeStarted} - ${item.timeEnded}`);
        return total; // Skip negative time differences
      }

      // Convert milliseconds to minutes and add to total
      const minutes = diff / (1000 * 60);
      return total + minutes;
    }
    return total;
  }, 0);
};

// TimeRendered component
const TimeRendered = ({ timesheets }) => {
  const totalMinutes = calculateTotalTime(timesheets);

  // Check if totalMinutes is a valid number
  if (isNaN(totalMinutes)) {
    console.error('Invalid total minutes calculation');
    return <div>Error calculating total time.</div>;
  }

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = Math.round(totalMinutes % 60);

  return (
    <div className="p-2 bg-gray-100 rounded-lg shadow-md text-center">
      <p className="text-gray-700">
        {totalHours} : {remainingMinutes} : 00
      </p>
    </div>
  );
};

export default TimeRendered;
