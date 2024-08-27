import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

const ArchiveCard = () => {
  const [archives, setArchives] = useState([]);
  const [error, setError] = useState(null);

  const apiBaseUrl = `${import.meta.env.VITE_API_BASE_URL}`;
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

  const handleUnarchive = async (taskNumber) => {
    const isConfirmed = window.confirm('Are you sure you want to unarchive this item?');

    if (isConfirmed) {
      try {
        // Find the archive item to unarchive by taskNumber
        const archiveToUnarchive = archives.find(archive => archive.acf.task_number === taskNumber);
        if (!archiveToUnarchive) {
          throw new Error('Archive not found');
        }

        // Prepare data to be sent to the API
        const { id, acf, ...rest } = archiveToUnarchive; // Exclude unique identifier field
        const updatedData = {
          ...rest,
          acf: {
            ...acf,
            status: 'Active', // Set status back to active
          },
        };

        // Post the task to the 'task' endpoint (unarchive)
        await axios.post(
          `${apiBaseUrl}task`,
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

        // Delete the task from the 'archive' endpoint using task_number
        await axios.delete(
          `${apiBaseUrl}archive?task_number=${taskNumber}`, // Ensure you delete the correct item
          {
            auth: {
              username: authUsername,
              password: authPassword,
            },
          }
        );

        // Update state to reflect the unarchived task
        setArchives(archives.filter(archive => archive.acf.task_number !== taskNumber));
      } catch (err) {
        setError(`Failed to unarchive: ${err.message}`);
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
              <td className="border px-4 py-2 text-center">{archive.acf.task_description}</td>
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
