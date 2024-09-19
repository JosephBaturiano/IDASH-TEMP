import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme from your context

// Converts time from 12-hour format to total minutes
const convertToMinutes = (time) => {
  const [timePart, modifier] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);

  if (modifier.toLowerCase() === 'pm' && hours !== 12) {
    hours += 12;
  }
  if (modifier.toLowerCase() === 'am' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

// Calculate duration between start and end times
const calculateDuration = (startTime, endTime) => {
  const startTotalMinutes = convertToMinutes(startTime);
  const endTotalMinutes = convertToMinutes(endTime);

  let durationMinutes = endTotalMinutes - startTotalMinutes;

  // Handle overnight times
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60; // Add 24 hours worth of minutes
  }

  return durationMinutes;
};

// Calculate total time for all timesheets, adding additional time for specific users
const calculateTotalTime = (timesheets, currentUserId) => {
  console.log(`Current User ID: ${currentUserId}`);

  let totalMinutes = timesheets.reduce((total, item) => {
    if (item.timeStarted && item.timeEnded) {
      const durationMinutes = calculateDuration(item.timeStarted, item.timeEnded);
      return total + durationMinutes;
    }
    return total;
  }, 0);

  console.log(`Base total time (in minutes): ${totalMinutes}`);

  // Define additional time for specific user IDs
  const additionalTimeByUserId = {
    // TF TEAM
    10: 4120,  // AAA: Additional minutes
    13: 6240,  // APS: Additional minutes
    12: 6512,  // KNM: Additional minutes

    // RJ TEAM
    8: 8615,   // CJO: Additional minutes
    15: 6840,  // EDL: Additional minutes
    3: 8171,   // JBM: Additional minutes
    14: 9307,  // MRS: Additional minutes

    // RN TEAM
    9: 9161,   // CDS: Additional minutes
    18: 5832,  // LAA: Additional minutes
    11: 7866,  // RTL: Additional minutes
    16: 10258,  // UJE: Additional minutes
    17: 10469   // JZB: Additional minutes
  };

  const additionalTime = additionalTimeByUserId[currentUserId] || 0;
  totalMinutes += additionalTime;

  console.log(`Total time after adding additional minutes: ${totalMinutes}`);
  return totalMinutes;
};

const TimeRendered = ({ timesheets, currentUserId }) => {
  const { theme } = useTheme(); // Get the current theme from the context

  const totalMinutes = calculateTotalTime(timesheets, currentUserId);

  if (isNaN(totalMinutes)) {
    console.error('Invalid total minutes calculation');
    return <div>Error calculating total time.</div>;
  }

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = Math.round(totalMinutes % 60);

  const textColor = theme === 'light' ? 'text-gray-700' : 'text-white';
  const backgroundColor = theme === 'light' ? 'bg-gray-100' : 'bg-gray-800';

  return (
    <div className={`p-2 ${backgroundColor} rounded-lg shadow-md text-center`}>
      <p className={`${textColor}`}>
        {totalHours} : {remainingMinutes.toString().padStart(2, '0')} : 00
      </p>
    </div>
  );
};

export default TimeRendered;
