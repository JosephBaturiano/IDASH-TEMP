import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon from MUI or your icon library

const IssuesCard = () => {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState(null);
  const [editingIssue, setEditingIssue] = useState(null);
  const [updatedIssue, setUpdatedIssue] = useState({});

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
      status: issue.acf.status || '',
    });
  };

  const handleChange = (e) => {
    setUpdatedIssue({
      ...updatedIssue,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingIssue) return;
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

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const year = dateString.substring(0, 4);
    const month = dateString.substring(5, 7);
    const day = dateString.substring(8, 10);
    const shortYear = year.substring(2, 4);
    return `${month}/${day}/${shortYear}`;
  };

  return (
    <div>
      {error && <p className="text-red-500">Error: {error}</p>}
      {editingIssue && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg w-1/3">
            <h2 className="text-xl mb-2">Edit Issue</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-2">
                <label className="block text-gray-700">Task Number</label>
                <input
                  type="text"
                  name="task_number"
                  value={updatedIssue.task_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={updatedIssue.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                  rows="4"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={updatedIssue.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Who</label>
                <input
                  type="text"
                  name="who"
                  value={updatedIssue.who}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Issue Number</label>
                <input
                  type="text"
                  name="issue_number"
                  value={updatedIssue.issue_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Status</label>
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
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
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
              <td className="border px-4 py-2 text-center">{formatDate(issue.acf.date)}</td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssuesCard;
