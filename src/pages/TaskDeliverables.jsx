import React, { useState } from 'react';
import Home from './Home'; // Import the Home component
import TaskCard from '../components/TaskCard'; // Import the TaskCard component

const TaskDeliverables = () => {
  const [activeTab, setActiveTab] = useState('Task');

  // Sample data
  const tasks = [
    {
      id: 1,
      description: 'Create Expo App',
      dateCreated: '01/08/24',
      allocatedTime: '2:00:00',
      assignedTo: 'All',
      status: 'Done',
    },
    {
      id: 2,
      description: 'Discuss and finalize the features of Intern Dashboard',
      dateCreated: '01/08/24',
      allocatedTime: '2:00:00',
      assignedTo: 'All',
      status: 'Done',
    },
    {
      id: 3,
      description: 'Mock up the UI for Intern Dashboard',
      dateCreated: '01/08/24',
      allocatedTime: '2:00:00',
      assignedTo: 'UI/UX',
      status: 'Pending',
    },
    // Add more tasks as needed
  ];

  const issues = [
    {
      id: 1,
      description: 'Bug in the Expo App',
      dateCreated: '02/08/24',
      assignedTo: 'React Team',
      status: 'Open',
    },
    // Add more issues as needed
  ];

  const archives = [
    {
      id: 1,
      description: 'Old UI Mockups',
      dateCreated: '30/07/24',
      assignedTo: 'UI/UX',
      status: 'Archived',
    },
    // Add more archives as needed
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Task':
        return <TaskCard tasks={tasks} />;
      case 'Issues':
        return (
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">#</th>
                <th className="border px-4 py-2 text-left">Issue Description</th>
                <th className="border px-4 py-2 text-left">Date Created</th>
                <th className="border px-4 py-2 text-left">Assigned To</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{issue.id}</td>
                  <td className="border px-4 py-2">{issue.description}</td>
                  <td className="border px-4 py-2">{issue.dateCreated}</td>
                  <td className="border px-4 py-2">{issue.assignedTo}</td>
                  <td className="border px-4 py-2">{issue.status}</td>
                  <td className="border px-4 py-2">
                    <button className="bg-[#134B70] text-white rounded-full p-2 hover:bg-[#0a2c46] transition-colors">+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'Archive':
        return (
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">#</th>
                <th className="border px-4 py-2 text-left">Archived Task</th>
                <th className="border px-4 py-2 text-left">Date Created</th>
                <th className="border px-4 py-2 text-left">Assigned To</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {archives.map((archive, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{archive.id}</td>
                  <td className="border px-4 py-2">{archive.description}</td>
                  <td className="border px-4 py-2">{archive.dateCreated}</td>
                  <td className="border px-4 py-2">{archive.assignedTo}</td>
                  <td className="border px-4 py-2">{archive.status}</td>
                  <td className="border px-4 py-2">
                    <button className="bg-[#134B70] text-white rounded-full p-2 hover:bg-[#0a2c46] transition-colors">+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
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

