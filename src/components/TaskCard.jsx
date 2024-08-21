import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';

const TaskCard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [updatedTask, setUpdatedTask] = useState({
    task_number: '',
    task_description: '',
    date_created: '',
    allocated_time: '',
    assigned_to: '',
    status: ''
  });

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

  const handleEditClick = (task) => {
    setEditingTask(task);
    setUpdatedTask({
      task_number: task.acf.task_number || '',
      task_description: task.acf.task_description || '',
      date_created: task.acf.date_created || '',
      allocated_time: task.acf.allocated_time || '',
      assigned_to: task.acf.assigned_to || '',
      status: task.acf.status || ''
    });
  };

  const handleChange = (e) => {
    setUpdatedTask({
      ...updatedTask,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}task/${editingTask.id}`, {
        acf: updatedTask
      }, {
        auth: {
          username: import.meta.env.VITE_AUTH_USERNAME,
          password: import.meta.env.VITE_AUTH_PASSWORD
        }
      });
      const updatedTasks = tasks.map(task =>
        task.id === editingTask.id
          ? { ...task, acf: updatedTask }
          : task
      );
      setTasks(updatedTasks);
      setEditingTask(null);
    } catch (err) {
      setError(`Failed to update task: ${err.message}`);
    }
  };
const handleArchive = async (taskId) => {
  if (window.confirm('Are you sure you want to archive this task?')) {
    try {
      // Fetch task details to ensure we send correct data (if required by the API)
      const taskToArchive = tasks.find(task => task.id === taskId);

      // Make sure taskToArchive is not undefined
      if (!taskToArchive) {
        throw new Error('Task not found');
      }

      // Send request to archive the task
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}archive-task/${taskId}`, {
        acf: taskToArchive.acf // Adjust if additional data is needed
      }, {
        auth: {
          username: import.meta.env.VITE_AUTH_USERNAME,
          password: import.meta.env.VITE_AUTH_PASSWORD
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Remove task from the current list if archiving succeeded
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Failed to archive task:', err.response ? err.response.data : err.message);
      setError(`Failed to archive task: ${err.response ? err.response.data.message : err.message}`);
    }
  }
};


  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const year = dateString.substring(0, 4);
    const month = dateString.substring(5, 7);
    const day = dateString.substring(8, 10);
    const shortYear = year.substring(2, 4);
    return `${month}/${day}/${shortYear}`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {editingTask && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg w-1/3">
            <h2 className="text-xl mb-2">Edit Task</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-2">
                <label className="block text-gray-700">Task Number</label>
                <input
                  type="text"
                  name="task_number"
                  value={updatedTask.task_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="task_description"
                  value={updatedTask.task_description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                  rows="4"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Date Created</label>
                <input
                  type="date"
                  name="date_created"
                  value={updatedTask.date_created}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Allocated Time</label>
                <input
                  type="text"
                  name="allocated_time"
                  value={updatedTask.allocated_time}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Assigned To</label>
                <input
                  type="text"
                  name="assigned_to"
                  value={updatedTask.assigned_to}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Status</label>
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

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center">Task Number</th>
            <th className="px-4 py-2 text-center">Description</th>
            <th className="px-4 py-2 text-center">Date Created</th>
            <th className="px-4 py-2 text-center">Allocated Time</th>
            <th className="px-4 py-2 text-center">Assigned To</th>
            <th className="px-4 py-2 text-center">Status</th>
            <th className="px-4 py-2 text-center">Actions</th>
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
                {task.acf ? task.acf.status : 'No status'}
              </td>
              <td className="border px-4 py-2 text-center">
                <EditIcon
                  onClick={() => handleEditClick(task)}
                  className="cursor-pointer text-blue-500 hover:text-blue-600"
                />
                <ArchiveIcon
                  onClick={() => handleArchive(task.id)}
                  className="ml-2 cursor-pointer text-blue-500 hover:text-blue-600"
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

