import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArchiveIcon from '@mui/icons-material/Archive';

const TaskCard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const authUsername = import.meta.env.VITE_AUTH_USERNAME;
  const authPassword = import.meta.env.VITE_AUTH_PASSWORD;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}task`, {
          auth: {
            username: authUsername,
            password: authPassword,
          },
        });
        setTasks(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [apiBaseUrl, authUsername, authPassword]);

  const handleStatusChange = async (e, taskId) => {
    const newStatus = e.target.value;
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, acf: { ...task.acf, status: newStatus } }
        : task
    );
    setTasks(updatedTasks);
    try {
      await axios.post(`${apiBaseUrl}task/${taskId}`, {
        acf: { status: newStatus },
      }, {
        auth: {
          username: authUsername,
          password: authPassword,
        },
      });
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    }
  };

  const handleArchive = async (taskNumber) => {
    const isConfirmed = window.confirm('Are you sure you want to archive this task?');
  
    if (isConfirmed) {
      try {
        // Prepare the data to be sent to the API
        const updatedData = {
          acf: {
            task_number: taskNumber,
            status: 'Archived', // Set status to archived
          },
        };
  
        // Post the task to the 'archive' endpoint
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}archive`, // Archive endpoint
          updatedData,
          {
            auth: {
              username: import.meta.env.VITE_AUTH_USERNAME,
              password: import.meta.env.VITE_AUTH_PASSWORD,
            },
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
  
        console.log('Task archived successfully:', response.data);
  
      } catch (err) {
        console.error('Error Archiving Task:', err);
        setError(`Failed to archive task: ${err.message}`);
      }
    }
  };
  

  const formatDate = (dateString) => {
    if (dateString.length !== 8) return 'Invalid date';
    return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
  };

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center">Task Number</th>
            <th className="px-4 py-2 text-center">Description</th>
            <th className="px-4 py-2 text-center">Date Created</th>
            <th className="px-4 py-2 text-center">Allocated Time</th>
            <th className="px-4 py-2 text-center">Assigned To</th>
            <th className="px-4 py-2 text-center">Status</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="border px-4 py-2 text-center">{task.acf ? task.acf.task_number : 'No number'}</td>
              <td className="border px-4 py-2 text-center">{task.acf ? task.acf.task_description : 'No description'}</td>
              <td className="border px-4 py-2 text-center">{task.acf ? formatDate(task.acf.date_created) : 'No date'}</td>
              <td className="border px-4 py-2 text-center">{task.acf ? task.acf.allocated_time : 'No time'}</td>
              <td className="border px-4 py-2 text-center">{task.acf ? task.acf.assigned_to : 'No assignee'}</td>
              <td className="border px-4 py-2 text-center">
                <select
                  value={task.acf ? task.acf.status : 'Not Started'}
                  onChange={(e) => handleStatusChange(e, task.id)}
                  className="w-full border border-gray-300 rounded p-2"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Pending">Pending</option>
                  <option value="Done">Done</option>
                </select>
              </td>
              <td className="border px-4 py-2 text-center">
                <ArchiveIcon
                  onClick={() => handleArchive(task.id)}
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

export default TaskCard;
