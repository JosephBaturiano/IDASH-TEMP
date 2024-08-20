import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IssuesCard = ({ initialIssues }) => {
  const [issues, setIssues] = useState(initialIssues || []);
  const [error, setError] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL + 'issues'; // Ensure endpoint is correct
  const authUsername = import.meta.env.VITE_AUTH_USERNAME;
  const authPassword = import.meta.env.VITE_AUTH_PASSWORD;
  const authHeader = `Basic ${btoa(`${authUsername}:${authPassword}`)}`;

  useEffect(() => {
    // Fetch initial issues if not passed as props
    if (!initialIssues) {
      axios.get(apiBaseUrl, {
        headers: {
          Authorization: authHeader,
        },
      })
      .then(response => {
        setIssues(response.data);
      })
      .catch(error => {
        setError(`Error fetching issues: ${error.message}`);
      });
    }
  }, [apiBaseUrl, authHeader, initialIssues]);

  const handleStatusChange = (e, index) => {
    const updatedIssues = [...issues];
    updatedIssues[index].acf.status = e.target.value;
    setIssues(updatedIssues);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const year = dateString.substring(0, 4);
    const month = dateString.substring(5, 7); // Adjusted to get the correct month
    const day = dateString.substring(8, 10); // Adjusted to get the correct day
    return `${month}/${day}/${year}`;
  };

  const addIssue = async (data) => {
    try {
      const response = await axios.post(apiBaseUrl, data, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      });
      setIssues([...issues, response.data]);
    } catch (err) {
      setError(`Failed to add issue: ${err.message}`);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">Error: {error}</p>}
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Date</th>
            <th className="border px-4 py-2 text-left">Task #</th>
            <th className="border px-4 py-2 text-left">Description</th>
            <th className="border px-4 py-2 text-left">Who</th>
            <th className="border px-4 py-2 text-left">#</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue, index) => (
            <tr key={issue.id}>
              <td className="border px-4 py-2">{formatDate(issue.acf.date)}</td>
              <td className="border px-4 py-2">{issue.acf.task_number}</td>
              <td className="border px-4 py-2">{issue.acf.description}</td>
              <td className="border px-4 py-2">{issue.acf.who}</td>
              <td className="border px-4 py-2">{issue.acf.issue_number}</td>
              <td className="border px-4 py-2">
                <select
                  value={issue.acf.status}
                  onChange={(e) => handleStatusChange(e, index)}
                  className="bg-white border border-gray-300 rounded-full px-2 py-1"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </td>
              <td className="border px-4 py-2">
                <button className="bg-[#134B70] text-white rounded-full p-2 hover:bg-[#0a2c46] transition-colors">+</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssuesCard;
