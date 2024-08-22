import React, { useState } from 'react';
import Button from '@mui/material/Button'; // Import the Button component

const EditBadgesModal = ({ badges, onClose, onSave }) => {
  const [newBadges, setNewBadges] = useState({
    badgeOne: badges.badgeOne,
    badgeTwo: badges.badgeTwo,
    badgeThree: badges.badgeThree,
  });
  const [files, setFiles] = useState({
    badgeOne: null,
    badgeTwo: null,
    badgeThree: null,
  });

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const fileUrl = URL.createObjectURL(file);
      setNewBadges((prevBadges) => ({
        ...prevBadges,
        [name]: fileUrl,
      }));
      setFiles((prevFiles) => ({
        ...prevFiles,
        [name]: file,
      }));
    }
  };

  const handleSubmit = async () => {
    const uploadPromises = Object.keys(files).map(async (key) => {
      if (files[key]) {
        const uploadedUrl = await uploadFile(files[key]);
        return { [key]: uploadedUrl };
      }
      return {};
    });

    const uploadedBadges = await Promise.all(uploadPromises);
    const updatedBadges = uploadedBadges.reduce(
      (acc, badge) => ({ ...acc, ...badge }),
      {}
    );

    onSave({
      badgeOne:
        newBadges.badgeOne || updatedBadges.badgeOne || badges.badgeOne,
      badgeTwo:
        newBadges.badgeTwo || updatedBadges.badgeTwo || badges.badgeTwo,
      badgeThree:
        newBadges.badgeThree || updatedBadges.badgeThree || badges.badgeThree,
    });
    onClose();
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization:
          'Basic ' +
          btoa(
            import.meta.env.VITE_AUTH_USERNAME +
              ':' +
              import.meta.env.VITE_AUTH_PASSWORD
          ),
      },
    });
    const result = await response.json();
    return result.source_url;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-xl font-medium mb-4">Edit Badges</h2>
        <div className="space-y-4">
          <input
            type="file"
            name="badgeOne"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          <input
            type="file"
            name="badgeTwo"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          <input
            type="file"
            name="badgeThree"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            onClick={handleSubmit}
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

export default EditBadgesModal;
