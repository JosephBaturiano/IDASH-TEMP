import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const TimeSheetCard = ({ item, onEdit, onToggleInclude }) => {
  const { theme } = useTheme(); // Get the current theme
  const [isCommentVisible, setIsCommentVisible] = useState(false); // State to track visibility of the comment

  // Define colors based on the current theme
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white'; // Background color
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200'; // Border color
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-900'; // Text color
  const hoverColor = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'; // Hover background color

  const handleToggleComment = () => {
    setIsCommentVisible(!isCommentVisible); // Toggle the comment's visibility on click
  };

  // Function to calculate duration in hours and minutes
  const calculateDuration = (startTime, endTime) => {
    
    // Helper function to convert "HH:MM AM/PM" to minutes since midnight
    const convertToMinutes = (time) => {
      const [timePart, modifier] = time.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
  
      if (modifier === 'PM' && hours !== 12) {
        hours += 12;
      }
      if (modifier === 'AM' && hours === 12) {
        hours = 0;
      }
  
      return hours * 60 + minutes;
    };
  
    const startTotalMinutes = convertToMinutes(startTime);
    const endTotalMinutes = convertToMinutes(endTime);
  
    // Calculate duration in minutes
    const durationMinutes = endTotalMinutes - startTotalMinutes;
  
    // Handle negative duration (end time before start time)
    if (durationMinutes < 0) {
      console.warn('End time is before start time', { startTime, endTime });
      return 'Invalid duration';
    }
  
    // Convert duration to hours and minutes
    const hours = Math.floor(durationMinutes / 60);
    const minutes = (durationMinutes % 60).toString().padStart(2, '0'); // Ensure 2 digits for minutes
  
    return `${hours}:${minutes}`;
  };
  

  return (
    <tr
      key={item.id}
      className={`${bgColor} ${borderColor} ${hoverColor} border-t transition-colors duration-300 cursor-pointer`}
      onClick={handleToggleComment}
    >
      <td className={`px-2 py-2 ${textColor} font-medium text-center relative group max-w-[120px]`}>
        <span>{item.taskNumber}</span>
        {item.comment && item.comment !== 'No Comment' && (
          <div className="comment-indicator absolute top-0 left-0 w-3 h-3 bg-blue-500"></div>
        )}
        {isCommentVisible && item.comment && item.comment !== 'No Comment' && (
          <div className="absolute text-left top-full mt-1 left-0 w-64 bg-blue-500 text-white text-sm rounded py-2 px-3 z-50 overflow-auto whitespace-normal break-words">
            {item.comment}
          </div>
        )}
      </td>
      <td className={`px-2 py-2 ${textColor} text-left break-words max-w-[180px]`}>{item.description}</td>
      <td className={`px-2 py-2 ${textColor} text-center max-w-[100px]`}>{item.timeStarted}</td>
      <td className={`px-2 py-2 ${textColor} text-center max-w-[100px]`}>{item.timeEnded}</td>
      <td className={`px-2 py-2 ${textColor} text-center max-w-[100px]]`}>{calculateDuration(item.timeStarted, item.timeEnded)}</td>
      <td className={`px-2 py-2 ${textColor} text-center max-w-[120px]`}>{item.withWhom}</td>
      <td className={`px-2 py-2 ${textColor} text-left break-words max-w-[180px]`}>
        {item.deliverables.split(/(https?:\/\/\S+)/).map((part, index) =>
          part.match(/https?:\/\/\S+/) ? (
            <a 
              key={index} 
              href={part} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              {part}
            </a>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </td>
      <td className="px-2 py-2 text-center max-w-[180px]">
        <div className="flex items-center justify-center h-full space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="bg-blue-100 p-1 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300"
          >
            <EditIcon className="text-blue-600" />
          </button>
          <input
            type="checkbox"
            checked={item.includeInReport || false}
            onChange={(e) => {
              e.stopPropagation();
              onToggleInclude(item.id);
            }}
            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
          />
        </div>
      </td>
    </tr>
  );
};

export default TimeSheetCard;
