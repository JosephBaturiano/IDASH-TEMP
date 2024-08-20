import React, { useState } from 'react';

const ArchiveCard = ({ initialArchives }) => {
  const [archives, setArchives] = useState(initialArchives);

  const handleStatusChange = (e, index) => {
    const updatedArchives = [...archives];
    updatedArchives[index].status = e.target.value;
    setArchives(updatedArchives); // Update the archives state to trigger a re-render
  };

  return (
    <table className="w-full border-collapse border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2 text-left">#</th>
          <th className="border px-4 py-2 text-left">Task Description</th>
          <th className="border px-4 py-2 text-left">Date Created</th>
          <th className="border px-4 py-2 text-left">Allocated Time</th>
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
            <td className="border px-4 py-2">{archive.allocatedTime}</td>
            <td className="border px-4 py-2">{archive.assignedTo}</td>
            <td className="border px-4 py-2">
              <select
                value={archive.status}
                onChange={(e) => handleStatusChange(e, index)}
                className="bg-white border border-gray-300 rounded-full px-2 py-1"
              >
                <option value="Archived">Archived</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Not Needed">Not Needed</option>
              </select>
            </td>
            <td className="border px-4 py-2">
              <button className="bg-[#134B70] text-white rounded-full p-2 hover:bg-[#0a2c46] transition-colors">+</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ArchiveCard;
