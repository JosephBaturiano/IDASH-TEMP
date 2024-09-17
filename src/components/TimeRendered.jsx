import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme from your context

const convertTo24HourFormat = (time) => {
  const [timePart, modifier] = time.split(' ');
  const [hours, minutes] = timePart.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) {
    console.error(`Invalid time format: ${time}`);
    return null;
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

const calculateTotalTime = (timesheets, currentUserId) => {
  console.log(`Current User ID: ${currentUserId}`); // Log the currentUserId to check if it's correct
  
  let totalMinutes = timesheets.reduce((total, item) => {
    if (item.timeStarted && item.timeEnded) {
      const startTime24 = convertTo24HourFormat(item.timeStarted);
      const endTime24 = convertTo24HourFormat(item.timeEnded);

      if (!startTime24 || !endTime24) {
        console.error(`Invalid time conversion: ${item.timeStarted} - ${item.timeEnded}`);
        return total; 
      }

      const startTime = new Date();
      startTime.setHours(startTime24.hours, startTime24.minutes, 0, 0);

      const endTime = new Date();
      endTime.setHours(endTime24.hours, endTime24.minutes, 0, 0);

      if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1); 
      }

      const diff = endTime - startTime;
      const minutes = diff / (1000 * 60);
      return total + minutes;
    }
    return total;
  }, 0);

  console.log(`Base total time (in minutes): ${totalMinutes}`);

  // Define additional time for specific user IDs
  const additionalTimeByUserId = {
    // TF TEAM
    10: 4429,  // AAA: Additional minutes
    13: 6240,  // APS: Additional minutes
    12: 6889,  // KNM: Additional minutes

    // RJ TEAM
    8: 6455,   // CJO: Additional minutes
    15: 2520,  // EDL: Additional minutes
    3: 3149,   // JBM: Additional minutes
    14: 3839,  // MRS: Additional minutes

    //RN TEAM
    9: 1670,   // CDS: Additional minutes
    18: 8053,  // LAA: Additional minutes
    11: 7226,  // RTL: Additional minutes
    16: 7164,  // UJE: Additional minutes
    17: 7254   // JZB: Additional minutes
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
        {totalHours} : {remainingMinutes} : 00
      </p>
    </div>
  );
};

export default TimeRendered;
