import React from 'react';

const IssuesCard = ({ issues }) => {
  return (
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
          <tr key={index}>
            <td className="border px-4 py-2">{issue.dateCreated}</td>
            <td className="border px-4 py-2">{issue.id}</td>
            <td className="border px-4 py-2">{issue.description}</td>
            <td className="border px-4 py-2">{issue.assignedTo}</td>
            <td className="border px-4 py-2">{issue.id}</td>
            <td className="border px-4 py-2">{issue.status}</td>
            <td className="border px-4 py-2">
              <button className="bg-[#134B70] text-white rounded-full p-2 hover:bg-[#0a2c46] transition-colors">+</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default IssuesCard;
