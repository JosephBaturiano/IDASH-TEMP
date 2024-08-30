import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const ProfileAbout = ({ about, ojtAdviser, subjectCode, team, onEditClick }) => {
  const { theme } = useTheme(); // Get the current theme
  
  // Determine styles based on the theme
  const containerClass = `bg-${theme === 'dark' ? 'gray-800' : '#dbedff'} rounded-lg shadow-md w-[600px] h-[210px] p-5 mb-5 overflow-hidden relative`;
  const textColorClass = `text-${theme === 'dark' ? 'gray-300' : 'gray-700'}`;
  const editIconClass = `absolute top-2 right-2 p-2 cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-400 transition-colors duration-300`;

  return (
    <div className={containerClass}>
      <h2 className={`text-2xl font-medium mb-2 ${textColorClass}`}>About Me</h2>
      <div className="px-1 h-[160px] overflow-y-auto">
        <p className={`text-sm ${textColorClass} text-justify`}>{about}</p>

        <div className={`absolute bottom-5 left-5 text-sm ${textColorClass} flex space-x-2`}>
          <div><strong>Team: </strong>{team.join(', ') || 'N/A'}</div>
          <span>|</span>
          <div><strong>Adviser: </strong>{ojtAdviser || 'N/A'}</div>
          <span>|</span>
          <div><strong>Code: </strong>{subjectCode || 'N/A'}</div>
        </div>
        <div
          onClick={onEditClick}
          className={editIconClass}
        >
          <EditIcon />
        </div>
      </div>
    </div>
  );
};

export default ProfileAbout;
