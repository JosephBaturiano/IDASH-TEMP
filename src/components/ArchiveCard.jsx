import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormData from 'form-data'; // Ensure you have this library installed

const ArchiveCard = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await axios.get('http://mrs-woo1.local/wp-json/wp/v2/archive', {
          headers: {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Replace with actual token
          }
        });
        setArchives(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArchives();
  }, []);

  const handleStatusChange = async (e, index) => {
    const newStatus = e.target.value;
    const updatedArchives = [...archives];
    updatedArchives[index].acf.status = newStatus;
    setArchives(updatedArchives);

    try {
      await axios.post(`http://mrs-woo1.local/wp-json/wp/v2/archive/${updatedArchives[index].id}`, {
        acf: { status: newStatus }
      }, {
        headers: {
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // Replace with actual token
        }
      });
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    }
  };

  const addArchive = async () => {
    const data = new FormData();
    data.append('acf[task_number]', '1'); // Ensure this is correct as per your API
    data.append('acf[task_description]', 'text');
    data.append('acf[date_created]', '08/19/2024');
    data.append('acf[allocated_time]', '8:15 PM');
    data.append('acf[assigned_to]', 'text');
    data.append('status', 'publish');
    data.append('title', 'content'); // Ensure the `title` field is correct as per your API

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://mrs-woo1.local/wp-json/wp/v2/archive',
      headers: { 
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Replace with actual token
        ...data.getHeaders()
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      setArchives([...archives, response.data]);
    } catch (err) {
      setError(`Failed to add archive: ${err.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">#</th>
            <th className="border px-4 py-2 text-left">Task Description</th>
            <th className="border px-4 py-2 text-left">Date Created</th>
            <th className="border px-4 py-2 text-left">Allocated Time</th>
            <th className="border px-4 py-2 text-left">Assigned To</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {archives.map((archive, index) => (
            <tr key={archive.id}>
              <td className="border px-4 py-2">{archive.acf.task_number || 'N/A'}</td> {/* Adjust as needed */}
              <td className="border px-4 py-2">{archive.acf.task_description}</td>
              <td className="border px-4 py-2">{archive.acf.date_created}</td>
              <td className="border px-4 py-2">{archive.acf.allocated_time}</td>
              <td className="border px-4 py-2">{archive.acf.assigned_to}</td>
              <td className="border px-4 py-2">
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
              <td className="border px-4 py-2">
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
