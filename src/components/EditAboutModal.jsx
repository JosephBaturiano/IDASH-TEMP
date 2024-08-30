import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';

const EditAboutModal = ({ aboutData = {}, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    team: aboutData.team || [],
    ojtAdviser: aboutData.ojtAdviser || '',
    subjectCode: aboutData.subjectCode || '',
    aboutText: aboutData.aboutText || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h2 className="text-xl font-bold mb-4">Edit Profile Information</h2>

        <div className="border p-3 rounded mb-4">
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>
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

        <input
          type="text"
          name="ojtAdviser"
          value={formData.ojtAdviser}
          onChange={handleInputChange}
          placeholder="OJT Adviser"
          className="w-full mb-2 p-2 border border-gray-300 rounded"
        />

        <input
          type="text"
          name="subjectCode"
          value={formData.subjectCode}
          onChange={handleInputChange}
          placeholder="Subject Code"
          className="w-full mb-2 p-2 border border-gray-300 rounded"
        />

        <textarea
          name="aboutText"
          value={formData.aboutText}
          onChange={handleInputChange}
          placeholder="About Me"
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
