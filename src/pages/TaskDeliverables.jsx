import React, { useState } from 'react';
import Home from './Home'; // Import the Home component
import TaskCard from '../components/TaskCard'; // Import the TaskCard component
import IssuesCard from '../components/IssuesCard'; // Import the IssuesCard component
import ArchiveCard from '../components/ArchiveCard'; // Import the ArchiveCard component
import { useTheme } from '../context/ThemeContext'; // Import useTheme to get the theme

const TaskDeliverables = () => {
  const [activeTab, setActiveTab] = useState('Task');
  const { theme } = useTheme(); // Get the current theme

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Task':
        return <TaskCard />;
      case 'Issues':
        return <IssuesCard />;
      case 'Archive':
        return <ArchiveCard />;
      default:
        return null;
    }
  };

  return (
    <Home>
      <div className="p-6">
        <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Task Deliverables
        </h1>
        {/* Tabs */}
        <div className="flex space-x-4 mb-4">
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
        {/* Tab Content */}
        <div role="tabpanel">
          {renderTabContent()}
        </div>
      </div>
    </Home>
  );
};

export default TaskDeliverables;
