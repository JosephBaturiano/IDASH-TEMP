import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

const ArchiveCard = () => {
  const [archives, setArchives] = useState([]);
  const [error, setError] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const authUsername = import.meta.env.VITE_AUTH_USERNAME;
  const authPassword = import.meta.env.VITE_AUTH_PASSWORD;

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}archive`, {
          auth: {
            username: authUsername,
            password: authPassword,
          },
        });
        setArchives(response.data);
      } catch (err) {
        setError(`Failed to fetch archives: ${err.message}`);
      }
    };
    fetchArchives();
  }, [apiBaseUrl, authUsername, authPassword]);

const handleUnarchive = async (taskId) => {
  const isConfirmed = window.confirm('Are you sure you want to unarchive this item?');

  if (isConfirmed) {
    try {
      // Step 1: Fetch the task details from the archive
      const response = await axios.get(`${apiBaseUrl}archive/${taskId}`, {
        auth: {
          username: authUsername,
          password: authPassword,
        },
      });
      const archivedTask = response.data;

      // Prepare the data to be posted back to the active tasks
      const updatedData = {
        ...archivedTask,
        acf: {
          ...archivedTask.acf,
          status: 'Active', // Set status back to active
        },
      };

      // Step 2: Restore the task by posting to the 'task' endpoint
      await axios.post(
        `${apiBaseUrl}task/${taskId}`, // Use task ID to update
        updatedData,
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

      // Step 3: Remove the task from the archive
      await axios.delete(
        `${apiBaseUrl}archive/${taskId}`,
        {
          auth: {
            username: authUsername,
            password: authPassword,
          },
        }
      );

      // Update state to remove the unarchived task from archives
      setArchives(prevArchives => prevArchives.filter(archive => archive.id !== taskId));
      
      // Optionally, fetch updated tasks if needed
      fetchTasks();
      
    } catch (err) {
      setError(`Failed to unarchive: ${err.response ? err.response.data.message : err.message}`);
    }
  }
};

  const formatDate = (dateString) => {
    if (dateString.length !== 8) return 'Invalid date';
    return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
  };

  return (
    <div>
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-center">Task Number</th>
            <th className="border px-4 py-2 text-center">Task Description</th>
            <th className="border px-4 py-2 text-center">Date Created</th>
            <th className="border px-4 py-2 text-center">Allocated Time</th>
            <th className="border px-4 py-2 text-center">Assigned To</th>
            <th className="border px-4 py-2 text-center">Status</th>
            <th className="border px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {archives.map((archive) => (
            <tr key={archive.acf.task_number}>
              <td className="border px-4 py-2 text-center">{archive.acf.task_number || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{archive.acf.task_description || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{formatDate(archive.acf.date_created)}</td>
              <td className="border px-4 py-2 text-center">{archive.acf.allocated_time || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{archive.acf.assigned_to || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{archive.acf.status || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">
                <UnarchiveIcon
                  onClick={() => handleUnarchive(archive.acf.task_number)}
                  className="cursor-pointer text-blue-500 hover:text-blue-600"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ArchiveCard;
