import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { TextField, Button } from '@mui/material';

// API Base URLs and Credentials
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;

// Base64 Encode credentials
const credentials = btoa(`${USERNAME}:${PASSWORD}`);
const AUTH_HEADER = `Basic ${credentials}`;

const EditProfileModal = ({ onClose, profileData, onSave }) => {
  const [formData, setFormData] = useState({
    name: profileData.name || '',
    university: profileData.university || '',
    address: profileData.address || '',
    email: profileData.email || '',
    telephone: profileData.telephone || '',
    user_profile: profileData.user_profile || '',
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const uploadProfilePicture = async (file) => {
    const mediaData = new FormData();
    mediaData.append('file', file);

    const config = {
      method: 'post',
      url: `${BASE_URL}media`,
      headers: {
        'Authorization': AUTH_HEADER,
        'Content-Disposition': `attachment; filename=${file.name}`,
      },
      data: mediaData,
    };

    try {
      const response = await axios.request(config);
      return response.data.id; // Return the media ID
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      let mediaId;
      if (selectedFile) {
        mediaId = await uploadProfilePicture(selectedFile);
        setFormData({ ...formData, user_profile: mediaId });
      }

      const data = new FormData();
      data.append('acf[name]', formData.name);
      data.append('acf[university]', formData.university);
      data.append('acf[email]', formData.email);
      data.append('acf[address]', formData.address);
      data.append('acf[telephone]', formData.telephone);

      if (mediaId) {
        data.append('acf[user_profile]', mediaId); // Use the media ID to update the profile picture
      }

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}users/me`,
        headers: {
          'Authorization': AUTH_HEADER,
          // 'Content-Type' will be automatically set by the browser when using FormData
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log('Response:', response.data);
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const customStyles = {
    content: {
      maxWidth: '700px',
      maxHeight: '100vh',
      margin: 'auto',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      padding: '20px', // Adjust padding for spacing
    },
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Edit Profile"
      ariaHideApp={false}
      style={customStyles}
    >
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form className="space-y-4">
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="University"
            name="university"
            value={formData.university}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded-lg p-2 w-full"
            />
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                backgroundColor: '#16A34A', // Tailwind's bg-green-600
                color: 'white', // Tailwind's text-white
                padding: '8px 16px', // Tailwind's py-2 px-4
                borderRadius: '0.5rem', // Tailwind's rounded-lg
              }}
            >
              Save Changes
            </Button>
            <Button
              onClick={onClose}
              variant="contained"
              sx={{
                backgroundColor: '#EF4444', // Tailwind's bg-red-500
                color: 'white', // Tailwind's text-white
                padding: '8px 16px', // Tailwind's py-2 px-4
                borderRadius: '0.5rem', // Tailwind's rounded-lg
                '&:hover': {
                  backgroundColor: '#DC2626', // Slightly darker shade on hover
                },
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
