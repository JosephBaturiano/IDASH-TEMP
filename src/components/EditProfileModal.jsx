import React, { useState } from 'react';
import Modal from 'react-modal';
import { TextField, Button } from '@mui/material';

const EditProfileModal = ({ onClose, profileData, onSave }) => {
  const [formData, setFormData] = useState({
    name: profileData.name || '',
    university: profileData.university || '',
    address: profileData.address || '',
    email: profileData.email || '',
    telephone: profileData.telephone || '',
    user: profileData.user || '',
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFormData({ ...formData, user: URL.createObjectURL(file) });
  };

  const handleSubmit = () => {
    const updatedData = { ...formData };

    if (selectedFile) {
      // Handle file upload here if needed before saving
      // You may need to add logic to upload the file to the server and get the URL
    }

    onSave(updatedData);
    onClose();
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
