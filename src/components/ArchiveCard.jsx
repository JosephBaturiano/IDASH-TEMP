import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UnarchiveIcon from '@mui/icons-material/Unarchive'; // Import UnarchiveIcon from MUI or your icon library

const ArchiveCard = () => {
  const [archives, setArchives] = useState([]);
  const [error, setError] = useState(null);

  const apiBaseUrl = `${import.meta.env.VITE_API_BASE_URL}archive`;
  const authUsername = import.meta.env.VITE_AUTH_USERNAME;
  const authPassword = import.meta.env.VITE_AUTH_PASSWORD;

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await axios.get(apiBaseUrl, {
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

  const handleUnarchive = async (index) => {
    const isConfirmed = window.confirm('Are you sure you want to unarchive this item?');

    if (isConfirmed) {
      const updatedArchives = [...archives];
      const archiveId = updatedArchives[index].id;
      updatedArchives[index].acf.status = 'Active';

      try {
        await axios.post(
          `${apiBaseUrl}/${archiveId}`,
          {
            acf: {
              status: 'Active',
            },
          },
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
        setArchives(updatedArchives);
      } catch (err) {
        setError(`Failed to unarchive: ${err.message}`);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const year = dateString.substring(0, 4);
    const month = dateString.substring(5, 7);
    const day = dateString.substring(8, 10);
    return `${month}/${day}/${year}`;
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-center">#</th>
            <th className="border px-4 py-2 text-center">Task Description</th>
            <th className="border px-4 py-2 text-center">Date Created</th>
            <th className="border px-4 py-2 text-center">Allocated Time</th>
            <th className="border px-4 py-2 text-center">Assigned To</th>
            <th className="border px-4 py-2 text-center">Status</th>
            <th className="border px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {archives.map((archive, index) => (
            <tr key={archive.id}>
              <td className="border px-4 py-2 text-center">{archive.acf.task_number || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{archive.acf.task_description}</td>
              <td className="border px-4 py-2 text-center">{formatDate(archive.date)}</td>
              <td className="border px-4 py-2 text-center">{archive.acf.allocated_time}</td>
              <td className="border px-4 py-2 text-center">{archive.acf.assigned_to}</td>
              <td className="border px-4 py-2 text-center">{archive.acf.status}</td>
              <td className="border px-4 py-2 text-center">
                <UnarchiveIcon
                  onClick={() => handleUnarchive(index)}
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

export default ArchiveCard;
