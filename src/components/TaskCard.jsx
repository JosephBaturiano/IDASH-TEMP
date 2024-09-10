import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArchiveIcon from '@mui/icons-material/Archive';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '../context/ThemeContext'; // Import useTheme to get the theme

const TaskCard = ({ assignedToMe, currentUserId }) => {
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
  const authHeader = 'Basic ' + btoa(`${authUsername}:${authPassword}`);

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
    const fetchUsers = async () => {
      let allUsers = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        try {
          const response = await axios.get(`${apiBaseUrl}users?per_page=100&page=${page}`, {
            headers: { 'Authorization': authHeader }
          });

          if (Array.isArray(response.data)) {
            allUsers = [
              ...allUsers,
              ...response.data.map(user => ({
                id: user.id,
                name: user.name, // Use `name` for display in the dropdown
              })),
            ];

            totalPages = parseInt(response.headers['x-wp-totalpages'], 10) || 1;
            page++;
          } else {
            console.error('API Response is not an array:', response.data);
            break;
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          break;
        }
      }

      setUserOptions(allUsers); // Store users in state
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const checkGroupLeaderStatus = async () => {
      const isLeader = await checkIfGroupLeader();
      setIsGroupLeader(isLeader);
    };
    fetchUserDetails();
    fetchTasks();
    checkGroupLeaderStatus();
  }, [apiBaseUrl, authUsername, authPassword, assignedToMe, currentUserId]);

  const handleEditClick = (task) => {
    setEditingTask(task);
    setUpdatedTask({
      task_number: task.acf.task_number || '',
      task_description: task.acf.task_description || '',
      date_created: task.acf.date_created || '',
      assigned_to: task.acf.assigned_to || '',
      allocated_time: task.acf.allocated_time || '',
      status: task.acf.status || '',
    });
  };


  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingTask) return;

    // Check if the user is a group leader before editing
    if (!isGroupLeader) {
      alert('Only the Group Leader can edit a task.');
      return; // Prevent editing if the user is not a Group Leader
    }

    const updatedPayload = {
      acf: {
        ...updatedTask,
        // Ensure assigned_to is always an array
        assigned_to: Array.isArray(updatedTask.assigned_to)
          ? updatedTask.assigned_to
          : [parseInt(updatedTask.assigned_to, 10)],
        task_number: updatedTask.task_number || 'No task number',
        task_description: updatedTask.task_description || 'No description provided',
        date_created: updatedTask.date_created || new Date().toISOString().split('T')[0],
        allocated_time: updatedTask.allocated_time || 'No time',
        status: updatedTask.status || 'Not Started', // Set default if empty
      },
    };

    try {
      // Send PUT request to update the task on the server
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}task/${editingTask.id}`,
        updatedPayload,
        {
          auth: {
            username: import.meta.env.VITE_AUTH_USERNAME,
            password: import.meta.env.VITE_AUTH_PASSWORD,
          },
        }
      );

      // Update the local state with the new task data from the response
      const updatedTaskFromResponse = response.data;
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTask.id ? updatedTaskFromResponse : task
        )
      );

      setEditingTask(null); // Close the modal
    } catch (err) {
      console.error('Error updating task:', err.response ? err.response.data : err.message);
      setError(`Failed to update task: ${err.message}`);
    }
  };


  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Check if the user is a group leader before adding
    if (!isGroupLeader) {
      alert('Only the Group Leader can add a new task.');
      return; // Prevent adding if the user is not a Group Leader
    }

    if (!newTask.assigned_to) {
      alert('Please select a User to assign the task.');
      return; // Prevent adding if 'assigned_to' is not filled
    }

    // Ensure the status field is set properly; fallback to 'Not Started' if it's not provided
    const postData = {
      status: 'publish',
      acf: {
        ...newTask,
        assigned_to: Array.isArray(newTask.assigned_to) ? newTask.assigned_to : [parseInt(newTask.assigned_to, 10)],
        task_number: newTask.task_number || 'No task number',
        task_description: newTask.task_description || 'No description provided',
        date_created: newTask.date_created || new Date().toISOString().split('T')[0],
        allocated_time: newTask.allocated_time || 'No time',
        status: newTask.status || 'Not Started',  // Ensure 'Not Started' if status is empty
      },
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
      setTasks(prevTasks => [...prevTasks, addedTask]); // Use functional update to avoid stale state
      setShowAddModal(false);

    } catch (err) {
      console.error('Failed to add task:', err);
      setError(`Failed to add task: ${err.message}`);
    }
  };


  const handleDelete = async (id) => {
    // Show a confirmation prompt to the user
    const isConfirmed = window.confirm('Are you sure you want to delete this task? This action cannot be undone.');

    if (!isConfirmed) {
      return; // If the user clicks "Cancel", stop the delete action
    }

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

      // Update the tasks state to remove the deleted task
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);

      // Close the modal after successful deletion
      setEditingTask(null);
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
                onClick={() => handleDelete(editingTask.id)}
                className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
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
                  <option value="">Select User</option> {/* Default option */}
                  {userOptions.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} {/* Show user name */}
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
        onClick={() => {
          if (!isGroupLeader) {
            alert('Only the Group Leader can add tasks.');
          } else {
            setShowAddModal(true);
          }
        }}
        className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 ${!isGroupLeader ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        disabled={!isGroupLeader} // Disables the button for non-group leaders
      >
        <AddIcon className="mr-2" /> Add Task
      </button>

      <table className={`w-full border-collapse border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
          <tr>
            <th className="border px-4 py-2 text-center w-24">Task Number</th>
            <th className="border px-4 py-2 text-center w-64">Description</th>
            <th className="border px-4 py-2 text-center w-32">Date Created</th>
            <th className="border px-4 py-2 text-center w-32">Allocated Time</th>
            <th className="border px-4 py-2 text-center w-32">Assigned To</th>
            <th className="border px-4 py-2 text-center w-24">Status</th>
            <th className="border px-4 py-2 text-center w-24">Action</th>
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
                  onClick={() => {
                    if (!isGroupLeader) {
                      alert('Only the Group Leader can archive tasks.');
                    } else {
                      handleEditClick(task);
                    }
                  }}
                  className={`cursor-pointer text-blue-500 hover:text-blue-600 ${!isGroupLeader ? 'opacity-50 cursor-not-allowed' : ''}`}
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
