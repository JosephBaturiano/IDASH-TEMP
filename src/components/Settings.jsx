import React, { useState, useEffect } from 'react';
import Home from '../pages/Home';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Palette, Notifications, Language, Info } from '@mui/icons-material';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { notificationsEnabled, toggleNotifications } = useNotification();

  // Managing state for which section to show
  const [selectedSection, setSelectedSection] = useState('theme');

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved ? JSON.parse(saved) : notificationsEnabled;
  });

  const [language, setLanguage] = useState('en');

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', JSON.stringify(notifications));
  }, [notifications]);

  const handleNotificationToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    toggleNotifications();
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const backgroundColor = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-white';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-700';
  const buttonColor = theme === 'light' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';


  // Render the content of the selected section directly in the sidebar
  const renderSidebarContent = () => {
    switch (selectedSection) {
      case 'about':
        return (
          <div className={`mb-6 p-4 mt-20 mx-6 border ${borderColor} rounded-lg ${backgroundColor}`}>
            <h2 className={`text-xl font-bold mb-4 ${textColor}`}>About App</h2>
              <p className={`mb-4 ${textColor}`}>
                This application provides a comprehensive task management system designed to streamline your workflow. It features intuitive task creation, editing, and tracking functionalities, along with customizable themes and notifications.
              </p>
              <p className={`mb-4 ${textColor}`}>
                Version: 1.0.0
              </p>
              <p className={`mb-4 ${textColor}`}>
                For more information, visit our <a href="https://example.com" className="text-blue-500 hover:underline">website</a>.
              </p>
          </div>
        );

      case 'theme':
        return (
          <div className={`mb-6 p-4 mt-20 mx-6 border ${borderColor} rounded-lg ${backgroundColor}`}>
            <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Theme</h2>
            <p className={`mb-4 ${textColor}`}>
              Adjust the appearance of the application by selecting your preferred theme. You can switch between light and dark modes.
            </p>
            <div className={`flex items-center justify-center space-x-4 ${backgroundColor} p-6`}>
              <span className={`text-lg font-medium ${textColor}`}>
                {theme === 'light' ? 'Light Theme' : 'Dark Theme'}
              </span>
              <button
                onClick={toggleTheme}
                className={`px-6 py-3 rounded-lg ${buttonColor} border border-gray-300 flex items-center space-x-2`}
              >
                {theme === 'light' ? (
                  <>
                    <Brightness7Icon className="mr-2" />
                    <span>Switch to Dark</span>
                  </>
                ) : (
                  <>
                    <Brightness4Icon className="mr-2" />
                    <span>Switch to Light</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className={`mb-6 p-4 mt-20 mx-6 border ${borderColor} rounded-lg ${backgroundColor}`}>
            <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Notifications</h2>
            <p className={`mb-4 ${textColor}`}>
              Manage your notification preferences here. You can enable or disable notifications based on your needs.
            </p>
            <div className={`flex items-center justify-center space-x-4 ${backgroundColor} p-6`}>
              <label htmlFor="notifications" className={`text-lg font-medium ${textColor} mr-4`}>
                Enable Notifications:
              </label>
              <input
                type="checkbox"
                id="notifications"
                checked={notifications}
                onChange={handleNotificationToggle}
                className="form-checkbox h-6 w-6 text-indigo-600 transition duration-150 ease-in-out"
              />
            </div>
          </div>

        );
     case 'language':
      return (
        <div className={`mb-6 p-4 mt-20 mx-6 border ${borderColor} rounded-lg ${backgroundColor}`}>
          <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Language</h2>
          <p className={`mb-4 ${textColor}`}>
            Select your preferred language from the dropdown below.
          </p>
          <div className={`flex items-center justify-center space-x-4 ${backgroundColor} p-6`}>
            <label htmlFor="language" className={`text-lg font-small ${textColor}`}>
              Language:
            </label>
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className="border border-gray-300 rounded-lg px-4 py-1 text-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              <option value="en">English</option>
              <option value="es">Tagalog</option>
              {/* Add more languages as needed */}
            </select>
          </div>
        </div>

      );

      default:
        return null;
    }
  };

  return (
    <Home>
      <div className="min-h-screen flex bg-gray-900">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-100 p-6">
          <h1 className="text-2xl font-bold mb-6 mt-6 mx-6 text-gray-800">Settings</h1>
          <div className="flex flex-col">
            <button
              onClick={() => setSelectedSection('about')}
              className={`flex items-center p-4 mb-4 rounded-lg ${selectedSection === 'about' ? 'bg-gray-300' : 'bg-white'}`}
            >
              <Info className="mr-2" />
              <span>About App</span>
            </button>
            <button
              onClick={() => setSelectedSection('theme')}
              className={`flex items-center p-4 mb-4 rounded-lg ${selectedSection === 'theme' ? 'bg-gray-300' : 'bg-white'}`}
            >
              <Palette className="mr-2" />
              <span>Theme</span>
            </button>
            <button
              onClick={() => setSelectedSection('notifications')}
              className={`flex items-center p-4 mb-4 rounded-lg ${selectedSection === 'notifications' ? 'bg-gray-300' : 'bg-white'}`}
            >
              <Notifications className="mr-2" />
              <span>Notifications</span>
            </button>
            <button
              onClick={() => setSelectedSection('language')}
              className={`flex items-center p-4 mb-4 rounded-lg ${selectedSection === 'language' ? 'bg-gray-300' : 'bg-white'}`}
            >
              <Language className="mr-2" />
              <span>Language</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-3/4 bg-white p-6">
          {renderSidebarContent()}
        </div>
      </div>
    </Home>
  );
};

export default Settings;
