import React, { useState } from 'react';
import { Button } from '@mui/material'; // Import Button from MUI
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const EditSignatureModal = ({ signature, onClose, onSave }) => {
  const { theme } = useTheme(); // Get the current theme
  const [newSignature, setNewSignature] = useState(signature || '');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check for valid image format (optional)
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSignature(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`modal-content w-1/3 p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
        <h2 className={`text-xl font-semibold mb-4`}>Edit Signature</h2>
        {newSignature && (
          <img src={newSignature} alt="New Signature Preview" className="w-[150px] h-auto mb-4" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={`mt-4 p-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
        />
        <div className="modal-actions flex justify-end mt-4">
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              backgroundColor: theme === 'dark' ? '#EF4444' : '#EF4444',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '0.5rem',
              marginRight: '8px',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave(newSignature)}
            variant="contained"
            sx={{
              backgroundColor: theme === 'dark' ? '#16A34A' : '#16A34A',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '0.5rem',
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditSignatureModal;
