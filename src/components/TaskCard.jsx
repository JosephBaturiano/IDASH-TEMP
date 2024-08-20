import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskCard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}task`, {
          auth: {
            username: import.meta.env.VITE_AUTH_USERNAME,
            password: import.meta.env.VITE_AUTH_PASSWORD
          }
        });
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
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}task/${taskId}`, {
        acf: { status: newStatus }
      }, {
        auth: {
          username: import.meta.env.VITE_AUTH_USERNAME,
          password: import.meta.env.VITE_AUTH_PASSWORD
        }
      });
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const shortYear = year.substring(2, 4); // Get the last 2 digits of the year
    return `${month}/${day}/${shortYear}`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Task Number</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Date Created</th>
            <th className="px-4 py-2">Allocated Time</th>
            <th className="px-4 py-2">Assigned To</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="border px-4 py-2">{task.acf ? task.acf.task_number : 'No number'}</td>
              <td className="border px-4 py-2">{task.acf ? task.acf.task_description : 'No description'}</td>
              <td className="border px-4 py-2">{task.acf ? formatDate(task.acf.date_created) : 'No date'}</td>
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
