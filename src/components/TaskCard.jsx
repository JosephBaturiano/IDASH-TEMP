import React from 'react';

const TaskCard = ({ tasks }) => {
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
        {tasks.map((task, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{task.id}</td>
            <td className="border px-4 py-2">{task.description}</td>
            <td className="border px-4 py-2">{task.dateCreated}</td>
            <td className="border px-4 py-2">{task.allocatedTime}</td>
            <td className="border px-4 py-2">{task.assignedTo}</td>
            <td className="border px-4 py-2">{task.status}</td>
            <td className="border px-4 py-2">
              <button className="bg-[#134B70] text-white rounded-full p-2 hover:bg-[#0a2c46] transition-colors">+</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskCard;
