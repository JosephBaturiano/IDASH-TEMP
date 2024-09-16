import React, { useState, useEffect } from 'react';
import Home from './Home';
import TaskCard from '../components/TaskCard';
import IssuesCard from '../components/IssuesCard';
import ArchiveCard from '../components/ArchiveCard';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const TaskDeliverables = () => {
  const [activeTab, setActiveTab] = useState('Task');
  const [assignedToMe, setAssignedToMe] = useState(false); // State for "Assigned to me" checkbox
  const { theme } = useTheme();
  const [currentUserId, setCurrentUserId] = useState(null); // Store the current user's ID

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const authUsername = import.meta.env.VITE_AUTH_USERNAME;
  const authPassword = import.meta.env.VITE_AUTH_PASSWORD;

  // Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}users/me`, {
          auth: {
            username: authUsername,
            password: authPassword,
          },
        });
        setCurrentUserId(response.data.id); // Set the current user's ID
      } catch (error) {
        console.error('Error fetching current user data:', error);
      }
    };

    fetchCurrentUser();
  }, [apiBaseUrl, authUsername, authPassword]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Task':
        return <TaskCard assignedToMe={assignedToMe} currentUserId={currentUserId} />;
      case 'Issues':
        return <IssuesCard />;
      case 'Archive':
        return <ArchiveCard />;
      default:
        return null;
    }
  };

  return (
    <Home currentUserId={currentUserId}>
      <div className="p-6">
        <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Task Deliverables
        </h1>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            {['Task', 'Issues', 'Archive'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeTab === tab
                    ? 'bg-white shadow-md text-black dark:bg-gray-800 dark:text-white'
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveTab(tab)}
                aria-selected={activeTab === tab}
                role="tab"
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Render the "Assigned to me" checkbox only when the active tab is "Task" */}
          {activeTab === 'Task' && (
            <div className="flex items-center space-x-2">
              <label
                htmlFor="assignedToMe"
                className={`cursor-pointer font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Assigned to me
              </label>
              <input
                type="checkbox"
                id="assignedToMe"
                checked={assignedToMe}
                onChange={(e) => setAssignedToMe(e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:ring-offset-gray-800 dark:checked:bg-blue-500 dark:checked:border-transparent"
              />
            </div>
          )}
        </div>
        <div role="tabpanel">
          {renderTabContent()}
        </div>
      </div>
    </Home>
  );
};

export default TaskDeliverables;
