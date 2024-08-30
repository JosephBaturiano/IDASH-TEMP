import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const NotificationCard = ({ notifications }) => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // Get the current theme

  const handleButtonClick = () => {
    navigate('/taskdeliverables'); 
  };

  // Define colors based on the current theme
  const cardBgColor = theme === 'dark' ? '#1a202c' : '#ffffff'; // Dark gray for dark mode, white for light mode
  const itemBgColor = theme === 'dark' ? '#2d3748' : '#f7fafc'; // Slightly darker gray for dark mode, light gray for light mode
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800'; // Light text for dark mode, dark text for light mode
  const buttonBgColor = theme === 'dark' ? '#fbd38d' : '#f6e05e' ; // Yellow for dark mode, darker yellow for light mode
  const buttonTextColor = theme === 'dark' ? 'text-gray-800' : 'text-gray-800'; // Text color for the button

  return (
    <div className={`rounded-lg p-4 shadow-md ${textColor}`} style={{ backgroundColor: cardBgColor }}>
      <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>Notifications</h3>
      <ul className="space-y-2 text-[18px]">
        {notifications.map((notification, index) => (
          <li key={index} className={`flex justify-between p-4 items-center rounded-lg ${itemBgColor}`}>
            <div>
              <p className={`text-sm pb-2 ${textColor}`}>{notification.message}</p>
              <p className={`text-xs pb-1 ${textColor}`}>{notification.date}</p>
            </div>
            <button 
              className={`px-4 py-1 rounded ${buttonTextColor}`}
              style={{ backgroundColor: buttonBgColor }}
              onClick={handleButtonClick}
            >
              {notification.action}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationCard;
