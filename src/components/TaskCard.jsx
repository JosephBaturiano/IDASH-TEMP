import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useTheme } from '../context/ThemeContext'; // Import useTheme to get the theme

const TaskCard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGroupLeader, setIsGroupLeader] = useState(false); // State to track if the user is a Group Leader
  const { theme } = useTheme(); // Get the current theme

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const authUsername = import.meta.env.VITE_AUTH_USERNAME;
  const authPassword = import.meta.env.VITE_AUTH_PASSWORD;

  // Function to check if the user is a Group Leader
  const checkIfGroupLeader = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}users/me`, {
        auth: {
          username: authUsername,
          password: authPassword,
        },
      });

      // Extract the group_leader field from ACF
      return response.data.acf.group_leader;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return false;
    }
  };

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

    const checkGroupLeaderStatus = async () => {
      const isLeader = await checkIfGroupLeader();
      setIsGroupLeader(isLeader);
    };

    fetchTasks();
    checkGroupLeaderStatus();
  }, [apiBaseUrl, authUsername, authPassword]);

  const handleStatusChange = async (e, taskId) => {
    if (!isGroupLeader) {
      alert('Only the Group Leader can change the status.');
      return; // Prevent status change if the user is not a Group Leader
    }

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

  const handleArchive = async (taskId) => {
    if (!isGroupLeader) {
      alert('Only the Group Leader can archive a task.');
      return; // Prevent archiving if the user is not a Group Leader
    }

    const isConfirmed = window.confirm('Are you sure you want to archive this task?');
    
    if (isConfirmed) {
      try {
        const response = await axios.get(`${apiBaseUrl}task/${taskId}`, {
          auth: {
            username: authUsername,
            password: authPassword,
          },
        });

        const taskToArchive = response.data;

        if (!taskToArchive) {
          throw new Error('Task not found');
        }

        const postData = {
          acf: {
            task_number: taskToArchive.acf.task_number,
            task_description: taskToArchive.acf.task_description,
            date_created: taskToArchive.acf.date_created,
            allocated_time: taskToArchive.acf.allocated_time,
            assigned_to: taskToArchive.acf.assigned_to,
            status: taskToArchive.acf.status,
          },
          status: 'publish',
        };

        await axios.post(
          `${apiBaseUrl}archive/`,
          postData,
          {
            auth: {
              username: authUsername,
              password: authPassword,
            },
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        await axios.delete(`${apiBaseUrl}task/${taskId}`, {
          auth: {
            username: authUsername,
            password: authPassword,
          },
        });

        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

      } catch (err) {
        console.error('Error details:', err.response ? err.response.data : err.message);
        setError(`Failed to archive: ${err.message}`);
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
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      {error && <p className="text-red-500">Error: {error}</p>}
      <table className={`table-auto w-full border-collapse border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
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
                  onChange={(e) => isGroupLeader ? handleStatusChange(e, task.id) : alert('Only the Group Leader can change the status.')}
                  className={`w-full border rounded p-2 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Pending">Pending</option>
                  <option value="Done">Done</option>
                </select>
              </td>
              <td className="border px-4 py-2 text-center">
                <ArchiveIcon
                  onClick={() => handleArchive(task.id)}
                  className={`cursor-pointer text-blue-500 hover:text-blue-600 ${!isGroupLeader && 'opacity-50 cursor-not-allowed'}`}
                  onMouseEnter={() => !isGroupLeader && alert('Only the Group Leader can archive a task.')} // Show prompt on hover if not a Group Leader
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
