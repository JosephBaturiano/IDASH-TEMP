import React, { useState, useEffect } from 'react';
import Home from '../pages/Home';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import { useNotification } from '../context/NotificationContext'; // Import useNotification

const Settings = () => {
  const { theme, toggleTheme } = useTheme(); // Use theme and toggleTheme from context
  const { notificationsEnabled, toggleNotifications } = useNotification(); // Use notification settings from context

  // Read notification setting from localStorage
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved ? JSON.parse(saved) : notificationsEnabled;
  });

  const [language, setLanguage] = useState('en');

  // Update localStorage when notifications state changes
  useEffect(() => {
    localStorage.setItem('notificationsEnabled', JSON.stringify(notifications));
  }, [notifications]);

  const handleNotificationToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    toggleNotifications(); // Update the global notification setting
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    // Apply language change logic
  };

  const backgroundColor = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-white';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-700';
  const buttonColor = theme === 'light' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';

  return (
    <Home>
      <div className={`max-w-2xl mx-auto p-6 ${backgroundColor} shadow-lg rounded-lg`}>
        <h1 className={`text-2xl font-semibold ${textColor} mb-6`}>Settings</h1>
        
        {/* Theme Selection */}
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
        
        {/* Notifications */}
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
        
        {/* Language Selection */}
        <div className={`mb-6 p-4 border ${borderColor} rounded-lg ${backgroundColor}`}>
          <label htmlFor="language" className={`block ${textColor} text-lg font-medium mb-2`}>Language:</label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="en">English</option>
            <option value="es">Tagalog</option>
            {/* Add more languages as needed */}
          </select>
        </div>
        
        {/* Add more settings as needed */}
      </div>
    </Home>
  );
};

export default Settings;
