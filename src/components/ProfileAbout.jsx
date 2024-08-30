import React from 'react';
import EditIcon from '@mui/icons-material/Edit';


const ProfileAbout = ({ about, ojtAdviser, subjectCode, team, onEditClick }) => {
  return (
    <div className="bg-[#dbedff] rounded-lg shadow-md w-[600px] h-[210px] p-5 mb-5 overflow-hidden relative">
      <h2 className="text-2xl font-medium mb-2">About Me</h2>
      <div className="px-1 h-[160px] overflow-y-auto">
        <p className="text-sm text-gray-700 text-justify">{about}</p>

        <div className="absolute bottom-5 left-5 text-sm text-gray flex space-x-2">
          <div><strong>Team: </strong>{team.join(', ') || 'N/A'}</div>
          <span>|</span>
          <div><strong>Adviser: </strong>{ojtAdviser || 'N/A'}</div>
          <span>|</span>
          <div><strong>Code: </strong>{subjectCode || 'N/A'}</div>
        </div>
      <div
        onClick={onEditClick}
        className="absolute top-2 right-2 p-2 cursor-pointer text-gray-600 hover:text-blue-400 transition-colors duration-300"
      >
        <EditIcon />
      </div>
    </div>
  );
};

export default ProfileAbout;
