import React, { useState, useEffect } from 'react';
import Home from '../pages/Home';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Palette, Notifications, Language, Info,Update } from '@mui/icons-material';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const authUsername = import.meta.env.VITE_AUTH_USERNAME;
const authPassword = import.meta.env.VITE_AUTH_PASSWORD;
const authHeader = 'Basic ' + btoa(`${authUsername}:${authPassword}`);

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { notificationsEnabled, toggleNotifications } = useNotification();
  const [updates, setUpdates] = useState([]);

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

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`${apiBaseUrl}update`, {
          headers: {
            Authorization: authHeader,
          },
        });

        const data = response.data;

        // Map data to the format needed for rendering
        const formattedUpdates = data.map(update => ({
          version: update.acf.version,
          title: update.acf.title,
          description: update.acf.update_description,
          date: update.acf.date, // Changed to `date`
        }));

        setUpdates(formattedUpdates);
      } catch (error) {
        console.error('Error fetching updates:', error);
      }
    };

    fetchUpdates();
  }, [apiBaseUrl, authHeader]); // Added dependencies for apiBaseUrl and authHeader


  const formatDate = (dateString) => {
    if (!/^\d{8}$/.test(dateString)) {
      return 'Invalid Date Format';
    }
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6); // MM
    const day = dateString.slice(6, 8); // DD
    return `${month}/${day}/${year}`;
  };


  // Render the content of the selected section directly in the sidebar
  const renderSidebarContent = () => {
    switch (selectedSection) {
      case 'about':
        return (
          <div className={`mb-6 p-4 mt-20 mx-6 border ${borderColor} rounded-lg ${backgroundColor}`}>
            <h2 className={`text-xl font-bold mb-4 ${textColor}`}>About</h2>
            <p className={`mb-5 mx-5 ${textColor}`}>
              <b>I-DASH</b> is a dashboard designed to improve internship program management. It helps interns to log timesheets, generate weekly reports, track time rendered, and manage projects, all in one place.
            </p>
            <p className={`mb-5 mx-5 ${textColor}`}>
              For more information, visit our <a href="https://github.com/vt4b/I-DASH.git" className="text-blue-500 hover:underline">GitHub repository</a>.
            </p>
          </div>
        );        

      case 'theme':
        return (
          <div className={`mb-6 p-4 mt-20 mx-6 border ${borderColor} rounded-lg ${backgroundColor}`}>
            <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Theme</h2>
            <p className={`mb-5 mx-5 ${textColor}`}>
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
            <p className={`mb-5 mx-5 ${textColor}`}>
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
          <p className={`mb-5 mx-5 ${textColor}`}>
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
      case 'updates':
        return (
          <div className={`mb-6 p-4 mt-20 mx-6 border ${borderColor} rounded-lg ${backgroundColor} shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${textColor}`}>Update</h2>
          <div className="space-y-4">
            {updates.length > 0 ? (
              updates.map((update, index) => (
                <div
                  key={index}
                  className="border border-gray-200 p-6 rounded-lg bg-white shadow-md hover:bg-gray-50 transition ease-in-out duration-200"
                >
                  <p className="text-sm text-600 font-medium">
                    Version: <span className="font-normal">{update.version}</span>
                  </p>
                  <p className="text-lg font-semibold text-800 mt-2">
                    {update.title}
                  </p>
                  <p className="text-sm text-600 font-medium">
                    Date: <span className="font-normal">{formatDate(update.date)}</span>
                  </p>
                  <p className="text-sm text-600 font-medium">
                    Description: <span className="font-normal">{update.description}</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-lg">No updates available.</p>
            )}
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
          <h1 className="text-2xl font-bold mb-10 mt-4 mx-4 text-gray-800">Settings</h1>
          <div className="flex flex-col">
            <button
              onClick={() => setSelectedSection('about')}
              className={`flex items-center p-4 mb-4 rounded-lg ${selectedSection === 'about' ? 'bg-gray-300' : 'bg-white'}`}
            >
              <Info className="mr-2" />
              <span>About</span>
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
            <button
              onClick={() => setSelectedSection('updates')}
              className={`flex items-center p-4 mb-4 rounded-lg ${selectedSection === 'updates' ? 'bg-gray-300' : 'bg-white'}`}
            >
              <Update className="mr-2" />
              <span>Updates</span>
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
