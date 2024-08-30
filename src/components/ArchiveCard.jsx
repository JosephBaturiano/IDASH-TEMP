import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext'; // Import useTheme to get the theme

const ArchiveCard = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme(); // Get the current theme

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
        console.log('Fetched Archives:', response.data); // Log response data
        setArchives(response.data);
      } catch (err) {
        setError(`Failed to fetch archives: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchArchives();
  }, [apiBaseUrl, authUsername, authPassword]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust format as needed
  };

  if (loading) {
    return <p className={`p-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Loading archives...</p>;
  }

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      {error && <p className="text-red-500">{error}</p>}
      <table className={`w-full border-collapse ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}>
          <tr>
            <th className="border px-4 py-2 text-center">Task Number</th>
            <th className="border px-4 py-2 text-center">Task Description</th>
            <th className="border px-4 py-2 text-center">Date Created</th>
            <th className="border px-4 py-2 text-center">Allocated Time</th>
            <th className="border px-4 py-2 text-center">Assigned To</th>
            <th className="border px-4 py-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {archives.map((archive) => (
            <tr key={archive.acf.task_number} className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
              <td className="border px-4 py-2 text-center">{archive.acf.task_number || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{archive.acf.task_description || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{formatDate(archive.acf.date_created)}</td>
              <td className="border px-4 py-2 text-center">{archive.acf.allocated_time || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{archive.acf.assigned_to || 'N/A'}</td>
              <td className="border px-4 py-2 text-center">{archive.acf.status || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArchiveCard;
