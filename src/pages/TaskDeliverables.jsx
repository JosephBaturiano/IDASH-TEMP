import React, { useState } from 'react';
import Home from './Home'; // Import the Home component

const TaskDeliverables = () => {
  const [activeTab, setActiveTab] = useState('Task');

  // Sample task data
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
        return (
          <table className="table-auto w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left bg-blue-200">
                <th className="p-2">#</th>
                <th className="p-2">Task Description</th>
                <th className="p-2">Date Created</th>
                <th className="p-2">Allocated Time</th>
                <th className="p-2">Assigned To</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index} className="bg-white shadow rounded">
                  <th className="p-2">{task.id}</th>
                  <td className="p-2">{task.description}</td>
                  <td className="p-2">{task.dateCreated}</td>
                  <td className="p-2">{task.allocatedTime}</td>
                  <td className="p-2">{task.assignedTo}</td>
                  <td className="p-2">{task.status}</td>
                  <td className="p-2 text-center">
                    <button className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-lg">+</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'Issues':
        return (
          <table className="table-auto w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left bg-blue-200">
                <th className="p-2">#</th>
                <th className="p-2">Issue Description</th>
                <th className="p-2">Date Created</th>
                <th className="p-2">Assigned To</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, index) => (
                <tr key={index} className="bg-white shadow rounded">
                  <th className="p-2">{issue.id}</th>
                  <td className="p-2">{issue.description}</td>
                  <td className="p-2">{issue.dateCreated}</td>
                  <td className="p-2">{issue.assignedTo}</td>
                  <td className="p-2">{issue.status}</td>
                  <td className="p-2 text-center">
                    <button className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-lg">+</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'Archive':
        return (
          <table className="table-auto w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left bg-blue-200">
                <th className="p-2">#</th>
                <th className="p-2">Archived Task</th>
                <th className="p-2">Date Created</th>
                <th className="p-2">Assigned To</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {archives.map((archive, index) => (
                <tr key={index} className="bg-white shadow rounded">
                  <th className="p-2">{archive.id}</th>
                  <td className="p-2">{archive.description}</td>
                  <td className="p-2">{archive.dateCreated}</td>
                  <td className="p-2">{archive.assignedTo}</td>
                  <td className="p-2">{archive.status}</td>
                  <td className="p-2 text-center">
                    <button className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-lg">+</span>
                    </button>
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
      <div className="p-6 bg-blue-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Task Deliverables</h1>
        {/* Tabs */}
        <div className="tabs mb-4">
          <a
            className={`tab tab-bordered rounded-full px-6 py-2 ${activeTab === 'Task' ? 'tab-active bg-white shadow' : ''}`}
            onClick={() => setActiveTab('Task')}
          >
            Task
          </a>
          <a
            className={`tab tab-bordered rounded-full px-6 py-2 ${activeTab === 'Issues' ? 'tab-active bg-white shadow' : ''}`}
            onClick={() => setActiveTab('Issues')}
          >
            Issues
          </a>
          <a
            className={`tab tab-bordered rounded-full px-6 py-2 ${activeTab === 'Archive' ? 'tab-active bg-white shadow' : ''}`}
            onClick={() => setActiveTab('Archive')}
          >
            Archive
          </a>
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </Home>
  );
};

export default TaskDeliverables;
