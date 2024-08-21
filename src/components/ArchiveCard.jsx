import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ArchiveCard = () => {
  const [archives, setArchives] = useState([]);
  const [error, setError] = useState(null);

  const apiBaseUrl = `${import.meta.env.VITE_API_BASE_URL}archive`;
  const authUsername = import.meta.env.VITE_AUTH_USERNAME;
  const authPassword = import.meta.env.VITE_AUTH_PASSWORD;
  const authHeader = `Basic ${btoa(`${authUsername}:${authPassword}`)}`;

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

  const handleStatusChange = async (e, index) => {
    const updatedStatus = e.target.value;
    const updatedArchives = [...archives];
    updatedArchives[index].acf.status = updatedStatus;

    try {
      const response = await axios.post(`${apiBaseUrl}/${updatedArchives[index].id}`, 
      {
        acf: {
          status: updatedStatus,
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
      });
      setArchives(updatedArchives);
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
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
              <td className="border px-4 py-2 text-center">
                <select
                  value={archive.acf.status}
                  onChange={(e) => handleStatusChange(e, index)}
                  className="bg-white border border-gray-300 rounded-full px-2 py-1"
                >
                  <option value="Archived">Archived</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Not Needed">Not Needed</option>
                </select>
              </td>
              <td className="border px-4 py-2 text-center">
                <button className="bg-[#134B70] text-white rounded-full p-2 hover:bg-[#0a2c46] transition-colors">+</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArchiveCard;
