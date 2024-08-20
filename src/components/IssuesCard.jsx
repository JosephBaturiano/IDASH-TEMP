import React, { useState } from 'react';
import axios from 'axios';
import FormData from 'form-data';

const IssuesCard = ({ initialIssues }) => {
  const [issues, setIssues] = useState(initialIssues);
  const [error, setError] = useState(null);

  const handleStatusChange = (e, index) => {
    const updatedIssues = [...issues];
    updatedIssues[index].status = e.target.value;
    setIssues(updatedIssues);
  };

  const addIssue = async () => {
    const data = new FormData();
    data.append('acf[date]', '8/19/2024'); // Adjust date as needed
    data.append('acf[task_number]', '1');
    data.append('acf[description]', 'text');
    data.append('acf[who]', 'text');
    data.append('acf[issue_number]', '1');
    data.append('title', 'content');
    data.append('status', 'publish');

    try {
      const response = await axios.post('http://mrs-woo1.local/wp-json/wp/v2/issues', data, {
        headers: {
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Replace with actual token
          ...data.getHeaders(),
        },
      });
      setIssues([...issues, response.data]);
    } catch (err) {
      setError(`Failed to add issue: ${err.message}`);
    }
  };

  return (
    <div>
      {/* The Add Issue button has been removed */}
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
              <td className="border px-4 py-2">{issue.acf.date}</td>
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
