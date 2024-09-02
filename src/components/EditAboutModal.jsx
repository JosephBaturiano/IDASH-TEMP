import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const EditAboutModal = ({ aboutData = {}, onClose, onSave }) => {
  const { theme } = useTheme(); // Get the current theme
  const [formData, setFormData] = useState({
    team: aboutData.team || [],
    ojtAdviser: aboutData.ojtAdviser || '',
    subjectCode: aboutData.subjectCode || '',
    aboutText: aboutData.aboutText || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'aboutText' && value.length > 400) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleTeamChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      team: checked
        ? [...prev.team, name]
        : prev.team.filter((team) => team !== name),
    }));
  };

  const handleSave = () => {
    onSave({
      team: formData.team,
      ojtAdviser: formData.ojtAdviser,
      subjectCode: formData.subjectCode,
      aboutText: formData.aboutText,
    });
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${theme === 'dark' ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-800 bg-opacity-50'}`}>
      <div className={`rounded-lg shadow-lg p-6 w-[448px] border ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}>
        <h2 className="text-xl font-bold mb-4">Edit Profile Information</h2>

        <div className={`border p-3 rounded mb-4 ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}>
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{
                fontSize: '0.9rem',
                marginBottom: '0.2rem',
                color: theme === 'dark' ? '#E5E7EB' : '#1F2937', // Adjust color based on theme
              }}
            >
              Team
            </FormLabel>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.team.includes('RJ')}
                    onChange={handleTeamChange}
                    name="RJ"
                    size="small"
                  />
                }
                label={<span style={{ fontSize: '0.8rem' }}>RJ</span>}
                sx={{ marginRight: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.team.includes('RN')}
                    onChange={handleTeamChange}
                    name="RN"
                    size="small"
                  />
                }
                label={<span style={{ fontSize: '0.8rem' }}>RN</span>}
                sx={{ marginRight: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.team.includes('TF')}
                    onChange={handleTeamChange}
                    name="TF"
                    size="small"
                  />
                }
                label={<span style={{ fontSize: '0.8rem' }}>TF</span>}
                sx={{ marginRight: 1 }}
              />
            </FormGroup>
          </FormControl>
        </div>

        <FormControl fullWidth margin="normal">
          <FormLabel
            htmlFor="ojtAdviser"
            sx={{
              fontSize: '0.9rem',
              marginBottom: '0.2rem',
              color: theme === 'dark' ? '#E5E7EB' : '#1F2937',
            }}
          >
            OJT Adviser
          </FormLabel>
          <input
            type="text"
            id="ojtAdviser"
            name="ojtAdviser"
            value={formData.ojtAdviser}
            onChange={handleInputChange}
            placeholder="OJT Adviser"
            className={`w-full p-2 border rounded ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <FormLabel
            htmlFor="subjectCode"
            sx={{
              fontSize: '0.9rem',
              marginBottom: '0.2rem',
              color: theme === 'dark' ? '#E5E7EB' : '#1F2937',
            }}
          >
            Subject Code
          </FormLabel>
          <input
            type="text"
            id="subjectCode"
            name="subjectCode"
            value={formData.subjectCode}
            onChange={handleInputChange}
            placeholder="Subject Code"
            className={`w-full p-2 border rounded ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <FormLabel
            htmlFor="aboutText"
            sx={{
              fontSize: '0.9rem',
              marginBottom: '0.2rem',
              color: theme === 'dark' ? '#E5E7EB' : '#1F2937',
            }}
          >
            About Me
          </FormLabel>
          <textarea
            id="aboutText"
            name="aboutText"
            value={formData.aboutText}
            onChange={handleInputChange}
            placeholder="About Me"
            className={`w-full h-40 p-2 border rounded ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'}`}
            maxLength="400"
          />
        </FormControl>

        <div className="flex justify-end mt-4 space-x-2">
          <Button
            onClick={handleSave}
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

export default EditAboutModal;
