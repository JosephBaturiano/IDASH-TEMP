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

  return (
    <tr
      key={item.id}
      className={`${bgColor} ${borderColor} ${hoverColor} border-t transition-colors duration-300 cursor-pointer`}
      onClick={handleToggleComment} // Make the entire row clickable
    >
      {/* Task Number with Comment Indicator */}
      <td className={`px-2 py-2 ${textColor} font-medium text-center relative group`}>
        <span>{item.taskNumber}</span>

        {/* Conditionally show the paper fold indicator only if a comment exists */}
        {item.comment && item.comment !== 'No Comment' && (
          <div className="comment-indicator absolute top-0 left-0 w-3 h-3 bg-blue-500"></div>
        )}

        {/* Display the comment if it's visible */}
        {isCommentVisible && item.comment && item.comment !== 'No Comment' && (
          <div className="absolute text-left top-full mt-1 left-0 w-64 bg-blue-500 text-white text-sm rounded py-2 px-3 z-50 overflow-auto whitespace-normal break-words">
            {item.comment}
          </div>
        )}
      </td>

      <td className={`px-2 py-2 ${textColor} text-center break-words max-w-[150px]`}>{item.description}</td>
      <td className={`px-2 py-2 ${textColor} text-center`}>{item.timeStarted}</td>
      <td className={`px-2 py-2 ${textColor} text-center`}>{item.timeEnded}</td>
      <td className={`px-2 py-2 ${textColor} text-center`}>{item.withWhom}</td>
      <td className={`px-2 py-2 ${textColor} text-center break-words max-w-[150px]`}>{item.deliverables}</td>

      <td className={`px-2 py-2 text-center`}>
        <div className="flex items-center justify-center h-full space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent comment toggle when clicking on the edit button
              onEdit(item);
            }}
            className="bg-blue-100 p-1 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300"
          >
            <EditIcon className="text-blue-600" />
          </button>
          <input
            type="checkbox"
            checked={item.includeInReport || false} // Ensure a boolean value is always passed
            onChange={(e) => {
              e.stopPropagation(); // Prevent comment toggle when clicking on checkbox
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
