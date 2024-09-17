import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon from MUI or your icon library
import AddIcon from '@mui/icons-material/Add'; // Import AddIcon from MUI or your icon library
import DeleteIcon from '@mui/icons-material/Delete'; 
import { useTheme } from '../context/ThemeContext'; // Import useTheme to get the theme

const IssuesCard = () => {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState(null);
  const [editingIssue, setEditingIssue] = useState(null);
  const [updatedIssue, setUpdatedIssue] = useState({});
  const [newIssue, setNewIssue] = useState({
    task_number: '',
    description: '',
    date: '',
    who: '',
    issue_number: '',
    status: ''
  });
  const [showAddIssue, setShowAddIssue] = useState(false);
  const { theme } = useTheme(); // Get the current theme

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const authUsername = import.meta.env.VITE_AUTH_USERNAME;
  const authPassword = import.meta.env.VITE_AUTH_PASSWORD;
  const authHeader = 'Basic ' + btoa(`${authUsername}:${authPassword}`);


  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}issues`, {
          auth: {
            username: import.meta.env.VITE_AUTH_USERNAME,
            password: import.meta.env.VITE_AUTH_PASSWORD,
          },
        });
        setIssues(response.data);
      } catch (err) {
        setError(`Failed to fetch issues: ${err.message}`);
      }
    };

    fetchIssues();
  }, []);

  const handleEditClick = (issue) => {
    setEditingIssue(issue);
    setUpdatedIssue({
      task_number: issue.acf.task_number || '',
      description: issue.acf.description || '',
      date: issue.acf.date || '',
      who: issue.acf.who || '',
      issue_number: issue.acf.issue_number || '',
      status: issue.acf.status || 'open',
    });
  };

  const handleChange = (e) => {
    setUpdatedIssue({
      ...updatedIssue,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddChange = (e) => {
    setNewIssue({
      ...newIssue,
      [e.target.name]: e.target.value,
    });
  };
  

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!updatedIssue.task_number || !updatedIssue.description || !updatedIssue.date || !updatedIssue.who || !updatedIssue.issue_number || !updatedIssue) {
      window.alert('All fields must be filled out.');
    return;
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}issues/${editingIssue.id}`,
        { acf: updatedIssue },
        {
          auth: {
            username: import.meta.env.VITE_AUTH_USERNAME,
            password: import.meta.env.VITE_AUTH_PASSWORD,
          },
        }
      );
      const updatedIssues = issues.map((issue) =>
        issue.id === editingIssue.id ? { ...issue, acf: updatedIssue } : issue
      );
      setIssues(updatedIssues);
      setEditingIssue(null);
    } catch (err) {
      setError(`Failed to update issue: ${err.message}`);
    }
  };

  const handleNewIssueChange = (e) => {
    setNewIssue({
      ...newIssue,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    // Validate that all fields are filled
    if (!newIssue.task_number || !newIssue.description || !newIssue.date || !newIssue.who || !newIssue.issue_number || !newIssue) {
      window.alert('All fields must be filled out.');
    return;
    }


    const postData = {
      title: newIssue.description,
      status: 'publish',
      acf: {
        ...newIssue,
        date: newIssue.date || new Date().toISOString().split('T')[0],
        description: newIssue.description || 'No description provided',
        task_number: newIssue.task_number || 'No task number',
        who: newIssue.who || 'N/A',
        issue_number: newIssue.issue_number || 'N/A',
        status: newIssue.status || 'Open',  // Ensure 'Not Started' if status is empty
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}issues`,
        postData,
        {
          auth: {
            username: import.meta.env.VITE_AUTH_USERNAME,
            password: import.meta.env.VITE_AUTH_PASSWORD,
          },
        }
      );
      
      // Check the response structure
      console.log('Add Issue Response:', response.data);
  
      setIssues([...issues, response.data]);
      setNewIssue({
        date: '',
        task_number: '',
        description: '',
        who: '',
        issue_number: '',
        status: ''
      });
      setShowAddIssue(false);
    } catch (err) {
      console.error('Failed to add issue:', err); // Log the error for debugging
      setError(`Failed to add issue: ${err.message}`);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}issues/${id}`,
        {
          auth: {
            username: import.meta.env.VITE_AUTH_USERNAME,
            password: import.meta.env.VITE_AUTH_PASSWORD,
          },
        }
      );
      // Remove the issue from the state
      const updatedIssues = issues.filter((issue) => issue.id !== id);
      setIssues(updatedIssues);
    } catch (err) {
      console.error('Failed to delete issue:', err); // Log the error for debugging
      setError(`Failed to delete issue: ${err.message}`);
    }
  };
  
  
  
  


  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      {error && <p className="text-red-500">Error: {error}</p>}
      {editingIssue && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className={`p-4 rounded shadow-lg w-1/3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <h2 className="text-xl mb-2">Edit Issue</h2>
            <form onSubmit={handleEditSubmit}>
              {/* Existing edit form fields */}
              <div className="mb-2">
                <label className="block">Task Number</label>
                <input
                  type="text"
                  name="task_number"
                  value={updatedIssue.task_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block">Description</label>
                <textarea
                  name="description"
                  value={updatedIssue.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                  rows="4"
                />
              </div>
              <div className="mb-2">
                <label className="block">Date</label>
                <input
                  type="date"
                  name="date"
                  value={updatedIssue.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block">Who</label>
                <input
                  type="text"
                  name="who"
                  value={updatedIssue.who}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block">Issue Number</label>
                <input
                  type="text"
                  name="issue_number"
                  value={updatedIssue.issue_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block">Status</label>
                <select
                  name="status"
                  value={updatedIssue.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                > 
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingIssue(null)}
                className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {showAddIssue && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className={`p-4 rounded shadow-lg w-1/3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <h2 className="text-xl mb-2">Add New Issue</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="mb-2">
                <label className="block">Task Number</label>
                <input
                  type="text"
                  name="task_number"
                  value={newIssue.task_number}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block">Description</label>
                <textarea
                  name="description"
                  value={newIssue.description}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded p-2"
                  rows="4"
                />
              </div>
              <div className="mb-2">
                <label className="block">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newIssue.date}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block">Who</label>
                <input
                  type="text"
                  name="who"
                  value={newIssue.who}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block">Issue Number</label>
                <input
                  type="text"
                  name="issue_number"
                  value={newIssue.issue_number}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block">Status</label>
                <select
                  name="status"
                  value={newIssue.status}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded p-2"
                >

                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddIssue(false)}
                className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowAddIssue(true)}
        className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        <AddIcon className="mr-2" /> Add Issue
      </button>
 

      <table className={`w-full border-collapse border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
          <tr>
            <th className="border px-4 py-2 text-center">Date</th>
            <th className="border px-4 py-2 text-center">Task Number</th>
            <th className="border px-4 py-2 text-center">Description</th>
            <th className="border px-4 py-2 text-center">Who</th>
            <th className="border px-4 py-2 text-center">Issue Number</th>
            <th className="border px-4 py-2 text-center">Status</th>
            <th className="border px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td className="border px-4 py-2 text-center">{issue.acf.date}</td>
              <td className="border px-4 py-2 text-center">{issue.acf.task_number}</td>
              <td className="border px-4 py-2 text-center">{issue.acf.description}</td>
              <td className="border px-4 py-2 text-center">{issue.acf.who}</td>
              <td className="border px-4 py-2 text-center">{issue.acf.issue_number}</td>
              <td className="border px-4 py-2 text-center">{issue.acf.status}</td>
              <td className="border px-4 py-2 text-center">
                <EditIcon
                  onClick={() => handleEditClick(issue)}
                  className="cursor-pointer text-blue-500 hover:text-blue-600"
                />
                <DeleteIcon
                  onClick={() => handleDelete(issue.id)}
                  className="cursor-pointer text-blue-500  hover:text-blue-600"
                />    
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssuesCard;
