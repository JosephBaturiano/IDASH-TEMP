import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArchiveIcon from '@mui/icons-material/Archive';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '../context/ThemeContext'; // Import useTheme to get the theme

const TaskCard = ({assignedToMe, currentUserId} ) => {
  const [tasks, setTasks] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [userOptions, setUserOptions] = useState([]); // State to store user options
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGroupLeader, setIsGroupLeader] = useState(false); // State to track if the user is a Group Leader
  const [currentPage, setCurrentPage] = useState(1); // Add state for pagination
  const [totalPages, setTotalPages] = useState(1); // Add state for total pages
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({}); // State for new task
  const [updatedTask, setUpdatedTask] = useState({});
  const [showAddModal, setShowAddModal] = useState(false); // State to control add modal visibility
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
      const response = await axios.get(`${apiBaseUrl}users?per_page=100&page=1`, {
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
  
      // Define the custom user ID arrays for special filtering
      const rj_id = [8, 15, 3, 14]; // Users who can see tasks with assigned_to id=19
      const tf_id = [10, 13, 12];   // Users who can see tasks with assigned_to id=20
      const rn_id = [9, 17, 18, 11, 16]; // Users who can see tasks with assigned_to id=21
  
      let filteredTasks = sortedTasks;
      if (assignedToMe && currentUserId) {
        filteredTasks = sortedTasks.filter((task) => {
          const assignedTo = task.acf?.assigned_to || [];
          // Filter tasks where currentUserId is in the assigned_to array
          // OR task is assigned to id=19 and currentUserId is in rj_id
          // OR task is assigned to id=20 and currentUserId is in tf_id
          // OR task is assigned to id=21 and currentUserId is in rn_id
          // OR task is assigned to id=22 (visible to all users)
          return (
            assignedTo.includes(currentUserId) ||
            (assignedTo.includes(19) && rj_id.includes(currentUserId)) ||
            (assignedTo.includes(20) && tf_id.includes(currentUserId)) ||
            (assignedTo.includes(21) && rn_id.includes(currentUserId)) ||
            assignedTo.includes(22) // Visible to all users
          );
        });
      }
  
      setTasks(filteredTasks);
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
  }, [apiBaseUrl, authUsername, authPassword, assignedToMe, currentUserId ]);

  const handleEditClick = (task) => {
    setEditingTask(task);
    setUpdatedTask({
      task_number: task.acf.task_number || '',
      task_description: task.acf.task_description || '',
      date_created: task.acf.date_created || '',
      assignedTo: task.acf.assignedTo || '',
      status: task.acf.status || '',
    });
  };


  const handleChange = (e) => {
    setUpdatedTask(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };
  

  

  const handleAddChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}task/${editingTask.id}`,
        { acf: updatedTask },
        {
          auth: {
            username: import.meta.env.VITE_AUTH_USERNAME,
            password: import.meta.env.VITE_AUTH_PASSWORD,
          },
        }
      );
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id ? { ...task, acf: updatedTask } : task
      );
      
      setTasks(updatedTasks);
      setEditingTask(null);
    } catch (err) {
      setError(`Failed to update task: ${err.message}`);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Structure of newTask should be verified
    const postData = {
      status: 'publish',
      acf: newTask,
    };

    try {
      console.log('Submitting new task:', newTask); // Debugging

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}task`,
        postData,
        {
          auth: {
            username: import.meta.env.VITE_AUTH_USERNAME,
            password: import.meta.env.VITE_AUTH_PASSWORD,
          },
        }
      );

      console.log('Add task response:', response.data); // Debugging

      // Ensure response.data matches the format expected in setTasks
      const addedTask = response.data;
      setTasks(prevTask => [...prevTask, addedTask]); // Use functional update to avoid stale state
      setShowAddModal(false);

    } catch (err) {
      console.error('Failed to add task:', err);
      setError(`Failed to add task: ${err.message}`);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}task/${id}`,
        {
          auth: {
            username: import.meta.env.VITE_AUTH_USERNAME,
            password: import.meta.env.VITE_AUTH_PASSWORD,
          },
        }
      );
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    } catch (err) {
      setError(`Failed to delete task: ${err.message}`);
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
  

  const loadMoreTasks = () => {
    if (currentPage < totalPages) {
      fetchTasks(currentPage + 1);
    }
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      {error && <p className="text-red-500">Error: {error}</p>}
      {editingTask && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className={`p-4 rounded shadow-lg w-1/3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <h2 className="text-xl mb-2">Edit Task</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-2">
                <label className="block">Task Number</label>
                <input
                  type="text"
                  name="task_number"
                  value={updatedTask.task_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block">Task Description</label>
                <textarea
                  name="task_description"
                  value={updatedTask.task_description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                  rows="4"
                />
              </div>
              <div className="mb-2">
                <label className="block">Date Created</label>
                <input
                  type="date"
                  name="date_created"
                  value={updatedTask.date_created || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>

              <div className="mb-2">
                <label className="block">Allocated Time</label>
                <textarea
                  name="allocated_time"
                  value={updatedTask.allocated_time || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                  rows="1"
                />
              </div>
              <div className="mb-2">
                <label className="block">Assigned To</label>
                <select
                  name="assigned_to"
                  value={updatedTask.assigned_to}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                >
                  {userOptions.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block">Status</label>
                <select
                  name="status"
                  value={updatedTask.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Pending">Pending</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className={`p-4 rounded shadow-lg w-1/3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <h2 className="text-xl mb-2">Add Task</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="mb-2">
                <label className="block">Task Number</label>
                <input
                  type="text"
                  name="task_number"
                  value={newTask.task_number || ''}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block">Description</label>
                <textarea
                  name="task_description"
                  value={newTask.task_description || ''}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded p-2"
                  rows="4"
                />
              </div>
              <div className="mb-2">
                <label className="block">Date</label>
                  <input
                  type="date"
                  name="date_created"
                  value={newTask.date_created || ''}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block">Allocated Time</label>
                <textarea
                  name="allocated_time"
                  value={newTask.allocated_time || ''}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded p-2"
                  rows="1"
                />
              </div>

              <div className="mb-2">
                <label className="block">Assigned To</label>
                <select
                  name="assigned_to"
                  value={newTask.assigned_to || ''}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded p-2"
                >
                  {userOptions.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block">Status</label>
                <select
                  name="status"
                  value={newTask.status || ''}
                  onChange={handleAddChange}
                  className="w-full border border-gray-300 rounded p-2"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Pending">Pending</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowAddModal(true)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
      >
        <AddIcon className="mr-2" /> Add Task
      </button>
      <table className={`w-full border-collapse border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
          <tr>
            <th className="border px-4 py-2 text-center">Task Number</th>
            <th className="border px-4 py-2 text-center">Description</th>
            <th className="border px-4 py-2 text-center">Date Created</th>
            <th className="border px-4 py-2 text-center">Allocated Time</th>
            <th className="border px-4 py-2 text-center">Assigned To</th>
            <th className="border px-4 py-2 text-center">Status</th>
            <th className="border px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="border px-4 py-2 text-center">{task.acf?.task_number || 'No number'}</td>
              <td className="border px-4 py-2 text-center">{task.acf?.task_description || 'No description'}</td>
              <td className="border px-4 py-2 text-center">{task.acf ? task.acf.date_created : 'No date'}</td>
              <td className="border px-4 py-2 text-center">{task.acf?.allocated_time || 'No time'}</td>
              <td className="border px-4 py-2 text-center">
                {task.acf && Array.isArray(task.acf.assigned_to) && task.acf.assigned_to.length > 0
                  ? task.acf.assigned_to.map((userId, index) => (
                      <span key={index}>{userNames[userId]}</span>
                    ))
                  : 'No assignee'}
              </td>
              <td className="border px-4 py-2 text-center">{task.acf?.status || 'No status'}</td>
              <td className="border px-4 py-2 text-center">
                <ArchiveIcon
                  onClick={() => {
                    if (!isGroupLeader) {
                      alert('Only the Group Leader can archive tasks.');
                    } else {
                      handleArchive(task.id);
                    }
                  }}
                  className={`cursor-pointer text-blue-500 hover:text-blue-600 ${!isGroupLeader ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <EditIcon
                  onClick={() => handleEditClick(task)}
                  className="cursor-pointer text-blue-500 hover:text-blue-600"
                />
                <DeleteIcon
                  onClick={() => handleDelete(task.id)}
                  className="ml-2 cursor-pointer text-red-500 hover:text-red-600"
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
}
export default TaskCard;
  