import React, { useState } from 'react';
import Home from '../pages/Home';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const Settings = () => {
  const { theme, toggleTheme } = useTheme(); // Use theme and toggleTheme from context
  const [notifications, setNotifications] = useState(true);

  const handleNotificationToggle = () => {
    setNotifications(prev => !prev);
    // Apply notification preference logic
  };

  // Define text and background color based on the current theme
  const backgroundColor = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-white';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-700';
  const buttonColor = theme === 'light' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';

  return (
    <Home>
      <div className={`max-w-2xl mx-auto p-6 ${backgroundColor} shadow-lg rounded-lg`}>
        <h1 className={`text-2xl font-semibold ${textColor} mb-6`}>Settings</h1>
        <div className={`mb-6 p-4 border ${borderColor} rounded-lg ${backgroundColor}`}>
          <label htmlFor="theme" className={`block ${textColor} text-lg font-medium mb-2`}>Theme:</label>
          <div className="flex items-center">
            <span className={`text-lg font-medium mr-4 ${textColor}`}>Select Theme:</span>
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-lg ${buttonColor} border border-gray-300`}
            >
              {theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
            </button>
          </div>
        </div>
        <div className={`mb-6 p-4 border ${borderColor} rounded-lg ${backgroundColor} flex items-center`}>
          <label htmlFor="notifications" className={`text-lg font-medium mr-4 ${textColor}`}>Enable Notifications:</label>
          <input
            type="checkbox"
            id="notifications"
            checked={notifications}
            onChange={handleNotificationToggle}
            className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
          />
        </div>
        {/* Add more settings as needed */}
      </div>
    </Home>
  );
};

export default Settings;
