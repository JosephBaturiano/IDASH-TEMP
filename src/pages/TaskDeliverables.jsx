import React, { useState, useEffect } from 'react';
import Home from './Home'; // Import the Home component
import TaskCard from '../components/TaskCard'; // Import the TaskCard component
import IssuesCard from '../components/IssuesCard'; // Import the IssuesCard component
import ArchiveCard from '../components/ArchiveCard'; // Import the ArchiveCard component
import axios from 'axios';

const TaskDeliverables = () => {
  const [activeTab, setActiveTab] = useState('Task');
  const [tasks, setTasks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const authUsername = import.meta.env.VITE_AUTH_USERNAME;
  const authPassword = import.meta.env.VITE_AUTH_PASSWORD;
  const authHeader = `Basic ${btoa(`${authUsername}:${authPassword}`)}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksResponse, issuesResponse, archivesResponse] = await Promise.all([
          axios.get(`${apiBaseUrl}task`, { headers: { Authorization: authHeader } }),
          axios.get(`${apiBaseUrl}issue`, { headers: { Authorization: authHeader } }),
          axios.get(`${apiBaseUrl}archive`, { headers: { Authorization: authHeader } })
        ]);
        setTasks(tasksResponse.data);
        setIssues(issuesResponse.data);
        setArchives(archivesResponse.data);
      } catch (err) {
        setError('Error fetching data.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiBaseUrl, authHeader]);

  const renderTabContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    switch (activeTab) {
      case 'Task':
        return <TaskCard tasks={tasks} />;
      case 'Issues':
        return <IssuesCard issues={issues} />;
      case 'Archive':
        return <ArchiveCard archives={archives} />;
      default:
        return null;
    }
  };

  return (
    <Home>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Task Deliverables</h1>
        {/* Tabs */}
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-full transition-colors ${activeTab === 'Task' ? 'bg-white shadow-md' : 'bg-gray-300 hover:bg-gray-400'}`}
            onClick={() => setActiveTab('Task')}
          >
            Task
          </button>
          <button
            className={`px-4 py-2 rounded-full transition-colors ${activeTab === 'Issues' ? 'bg-white shadow-md' : 'bg-gray-300 hover:bg-gray-400'}`}
            onClick={() => setActiveTab('Issues')}
          >
            Issues
          </button>
          <button
            className={`px-4 py-2 rounded-full transition-colors ${activeTab === 'Archive' ? 'bg-white shadow-md' : 'bg-gray-300 hover:bg-gray-400'}`}
            onClick={() => setActiveTab('Archive')}
          >
            Archive
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">{renderTabContent()}</div>
      </div>
    </Home>
  );
};

export default TaskDeliverables;
