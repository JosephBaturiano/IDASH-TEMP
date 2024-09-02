import React, { useState } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const EditBadgesModal = ({ badges, onClose, onSave }) => {
  const { theme } = useTheme(); // Get the current theme
  const [files, setFiles] = useState({
    badgeOne: null,
    badgeTwo: null,
    badgeThree: null,
  });

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList.length > 0) {
      setFiles(prevFiles => ({ ...prevFiles, [name]: fileList[0] }));
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}media`,
        formData,
        {
          headers: {
            'Authorization': 'Basic ' + btoa(import.meta.env.VITE_AUTH_USERNAME + ':' + import.meta.env.VITE_AUTH_PASSWORD),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Upload response:', response.data); // Log the full response
      return response.data.id;
    } catch (error) {
      console.error('Error uploading image:', error.response ? error.response.data : error.message); // Log detailed error
      return '';
    }
  };

  const handleSubmit = async () => {
    try {
      // Initialize badge media IDs
      let badgeOneId = badges.badgeOne;
      let badgeTwoId = badges.badgeTwo;
      let badgeThreeId = badges.badgeThree;

      if (files.badgeOne) badgeOneId = await uploadImage(files.badgeOne);
      if (files.badgeTwo) badgeTwoId = await uploadImage(files.badgeTwo);
      if (files.badgeThree) badgeThreeId = await uploadImage(files.badgeThree);

      // Prepare FormData with ACF badge fields only if they have new IDs
      const data = new FormData();
      if (files.badgeOne) data.append('acf[badge-one]', badgeOneId);
      if (files.badgeTwo) data.append('acf[badge-two]', badgeTwoId);
      if (files.badgeThree) data.append('acf[badge-three]', badgeThreeId);

      // Update the badges in WordPress
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_API_BASE_URL}users/me`,
        headers: {
          'Authorization': 'Basic ' + btoa(import.meta.env.VITE_AUTH_USERNAME + ':' + import.meta.env.VITE_AUTH_PASSWORD),
          // 'Content-Type' will be automatically set by the browser when using FormData
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log('Response:', response.data);

      onSave({
        badgeOne: badgeOneId,
        badgeTwo: badgeTwoId,
        badgeThree: badgeThreeId,
      });
      onClose();
    } catch (error) {
      console.error('Error saving badges:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-800 bg-opacity-50'}`}>
      <div className={`p-6 rounded-lg w-[400px] border border-white ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
        <h2 className="text-xl font-medium mb-4">Edit Badges</h2>
        <div className="space-y-4">
          <input
            type="file"
            name="badgeOne"
            accept="image/*"
            onChange={handleFileChange}
            className={`w-full ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg p-2`}
          />
          <input
            type="file"
            name="badgeTwo"
            accept="image/*"
            onChange={handleFileChange}
            className={`w-full ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg p-2`}
          />
          <input
            type="file"
            name="badgeThree"
            accept="image/*"
            onChange={handleFileChange}
            className={`w-full ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg p-2`}
          />
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: theme === 'dark' ? '#16A34A' : '#16A34A',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '0.5rem',
            }}
          >
            Save Changes
          </Button>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              backgroundColor: theme === 'dark' ? '#EF4444' : '#EF4444',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '0.5rem',
              '&:hover': {
                backgroundColor: theme === 'dark' ? '#DC2626' : '#DC2626',
              },
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditBadgesModal;
