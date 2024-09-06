import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Button } from '@mui/material';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

// API Base URLs and Credentials
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;

// Base64 Encode credentials
const credentials = btoa(`${USERNAME}:${PASSWORD}`);
const AUTH_HEADER = `Basic ${credentials}`;

const EditSignatureModal = ({ onClose, profileData, onSave }) => {
  const { theme } = useTheme(); // Get the current theme
  const [signatureFile, setSignatureFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSignatureFile(file);
  };

  const uploadSignature = async (file) => {
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
      console.error('Error uploading signature:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      let mediaId;
      if (signatureFile) {
        mediaId = await uploadSignature(signatureFile);
      }

      const data = new FormData();
      if (mediaId) {
        data.append('acf[user_signature]', mediaId); // Use the media ID to update the signature
      }

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}users/me`,
        headers: {
          'Authorization': AUTH_HEADER,
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log('Response:', response.data);
      onSave(mediaId);
      onClose();
    } catch (error) {
      console.error('Error saving signature:', error);
    }
  };

  const customStyles = {
    content: {
      maxWidth: '448px',
      maxHeight: '100vh',
      margin: 'auto',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      padding: '1px', // Adjust padding for spacing
      backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF', // bg-gray-800 or white
      color: theme === 'dark' ? '#E5E7EB' : '#1F2937', // text-gray-100 or text-gray-900
    },
    overlay: {
      backgroundColor: 'rgba(31, 41, 55, 0.5)', // bg-gray-800 with opacity or white with opacity
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Edit Signature"
      ariaHideApp={false}
      style={customStyles}
    >
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
        <h2 className="text-xl font-semibold mb-4">Edit Signature</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Signature Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={`border rounded-lg p-2 w-full ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>
          <div className="mt-4 flex justify-end space-x-4">
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
              Save Signature
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
        </form>
      </div>
    </Modal>
  );
};

export default EditSignatureModal;
