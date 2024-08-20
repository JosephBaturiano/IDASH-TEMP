import React, { useState } from 'react';
import Modal from 'react-modal';
import { TextField, Button } from '@mui/material';

const EditProfileModal = ({ open, onClose, profileData, onSave }) => {
  const [formData, setFormData] = useState({
    university: profileData.university || '',
    address: profileData.address || '',
    email: profileData.email || '',
    telephone: profileData.telephone || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      contentLabel="Edit Profile"
      ariaHideApp={false}
    >
      <h2>Edit Profile</h2>
      <form>
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
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save Changes
        </Button>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
