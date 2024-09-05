import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useTheme } from '../context/ThemeContext'; // Import useTheme to get the theme

const TaskCard = () => {
  const [tasks, setTasks] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGroupLeader, setIsGroupLeader] = useState(false); // State to track if the user is a Group Leader
  const [currentPage, setCurrentPage] = useState(1); // Add state for pagination
  const [totalPages, setTotalPages] = useState(1); // Add state for total pages
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

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}users`, {
        auth: {
          username: authUsername,
          password: authPassword,
        },
      });
      const users = response.data;
      const userIdToName = {};
      users.forEach((user) => {
        userIdToName[user.id] = user.name; // Map user IDs to names
      });
      setUserNames(userIdToName);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchTasks = async (page = 1) => {
    try {
      const response = await axios.get(`${apiBaseUrl}task`, {
        auth: {
          username: authUsername,
          password: authPassword,
        },
        params: {
          page,
          per_page: 50, // Adjust based on API capabilities
        },
      });

      // Sort tasks by task number in ascending order
      const sortedTasks = response.data.sort((a, b) => {
        const taskNumberA = a.acf ? parseFloat(a.acf.task_number) : 0;
        const taskNumberB = b.acf ? parseFloat(b.acf.task_number) : 0;
        return taskNumberA - taskNumberB;
      });

      setTasks(prevTasks => page === 1 ? sortedTasks : [...prevTasks, ...sortedTasks]);
      setCurrentPage(page);
      setTotalPages(parseInt(response.headers['x-wp-totalpages'], 10)); // Update total pages from response headers
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkGroupLeaderStatus = async () => {
      const isLeader = await checkIfGroupLeader();
      setIsGroupLeader(isLeader);
    };
    fetchUserDetails();
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
            assigned_to: Array.isArray(taskToArchive.acf.assigned_to) ? taskToArchive.acf.assigned_to : [], // Ensure it's an array
            status: taskToArchive.acf.status,
          },
          status: 'publish',
        };
  
        // Log postData for debugging
        console.log('Archive postData:', postData);
  
        await axios.post(`${apiBaseUrl}archive/`, postData, {
          auth: {
            username: authUsername,
            password: authPassword,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        await axios.delete(`${apiBaseUrl}task/${taskId}`, {
          auth: {
            username: authUsername,
            password: authPassword,
          },
        });
  
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  
      } catch (err) {
        // Log detailed error message
        console.error('Error details:', err.response ? err.response.data : err.message);
        setError(`Failed to archive: ${err.message}`);
      }
    }
  };
  

  const formatDate = (dateString) => {
    if (dateString.length !== 8) return 'Invalid date';
    return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
  };

  const loadMoreTasks = () => {
    if (currentPage < totalPages) {
      fetchTasks(currentPage + 1);
    }
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      {error && <p className="text-red-500">Error: {error}</p>}
      <table className={`table-auto w-full border-collapse ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
          <tr>
            <th className="px-6 py-3 text-center w-1/24">Task Number</th>
            <th className="px-6 py-3 text-center w-1/4">Description</th>
            <th className="px-6 py-3 text-center w-1/6">Date Created</th>
            <th className="px-6 py-3 text-center w-1/6">Allocated Time</th>
            <th className="px-6 py-3 text-center w-1/6">Assigned To</th>
            <th className="px-6 py-3 text-center w-1/6">Status</th>
            <th className="px-6 py-3 text-center w-1/12">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="border px-6 py-4 text-center">{task.acf ? task.acf.task_number : 'No number'}</td>
              <td className="border px-6 py-4 text-center">{task.acf ? task.acf.task_description : 'No description'}</td>
              <td className="border px-6 py-4 text-center">{task.acf ? formatDate(task.acf.date_created) : 'No date'}</td>
              <td className="border px-6 py-4 text-center">{task.acf ? task.acf.allocated_time : 'No time'}</td>
              <td className="border px-6 py-4 text-center">
                {task.acf && Array.isArray(task.acf.assigned_to) && task.acf.assigned_to.length > 0
                  ? task.acf.assigned_to.map((userId, index) => (
                      <span key={userId}>
                        {userNames[userId] || 'Unknown User'}
                        {index < task.acf.assigned_to.length - 1 && ', '}
                      </span>
                    ))
                  : 'No assignee'}
              </td>
              <td className="border px-6 py-4 text-center">
                <select
                  value={task.acf ? task.acf.status : 'Not Started'}
                  onChange={(e) => handleStatusChange(e, task.id)}
                  className={`w-full border rounded p-2 ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Pending">Pending</option>
                  <option value="Done">Done</option>
                </select>
              </td>
              <td className="border px-6 py-4 text-center">
                <ArchiveIcon
                  onClick={() => {
                    if (!isGroupLeader) {
                      alert('Only the Group Leader can archive tasks.');
                    } else {
                      handleArchive(task.id);
                    }
                  }}
                  className={`cursor-pointer text-blue-500 hover:text-blue-600 ${!isGroupLeader && 'opacity-50 cursor-not-allowed'}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {currentPage < totalPages && (
        <button
          onClick={loadMoreTasks}
          className={`mt-4 px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-900'} hover:bg-gray-500`}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default TaskCard;
