import React, { useState } from 'react';
import Button from '@mui/material/Button'; // Import MUI Button

const EditAboutModal = ({ about, onClose, onSave }) => {
  const [aboutText, setAboutText] = useState(about);

  const handleSave = () => {
    onSave(aboutText);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h2 className="text-xl font-bold mb-4">Edit About Me</h2>
        <textarea
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
          className="w-full h-40 p-2 border border-gray-300 rounded"
        />
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: '#16A34A',
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
              backgroundColor: '#EF4444',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '0.5rem',
              '&:hover': {
                backgroundColor: '#DC2626',
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

export default EditAboutModal;
