import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskCard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://mrs-woo1.local/wp-json/wp/v2/task');
        setTasks(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleStatusChange = async (e, taskId) => {
    const newStatus = e.target.value;
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, acf: { ...task.acf, status: newStatus } }
        : task
    );
    setTasks(updatedTasks);

    try {
      // Update the status in WordPress
      await axios.post(`http://mrs-woo1.local/wp-json/wp/v2/task/${taskId}`, {
        acf: { status: newStatus }
      });
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="font-semibold text-lg mb-2">Tasks</h2>
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
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="border px-4 py-2">{task.acf ? task.acf.task_number : 'No number'}</td>
              <td className="border px-4 py-2">{task.acf ? task.acf.task_description : 'No description'}</td>
              <td className="border px-4 py-2">{task.acf ? task.acf.date_created : 'No date'}</td>
              <td className="border px-4 py-2">{task.acf ? task.acf.allocated_time : 'No time'}</td>
              <td className="border px-4 py-2">{task.acf ? task.acf.assigned_to : 'Not assigned'}</td>
              <td className="border px-4 py-2">
                <select
                  value={task.acf ? task.acf.status : 'No status'}
                  onChange={(e) => handleStatusChange(e, task.id)}
                  className="bg-white border border-gray-300 rounded-full px-2 py-1"
                >
                  <option value="Done">Done</option>
                  <option value="Pending">Pending</option>
                  <option value="Not Started">Not Started</option>
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

export default TaskCard;
