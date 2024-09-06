import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const InternSignature = ({ signatureUrl, onEditClick }) => {
  const { theme } = useTheme(); // Get the current theme

  // Determine styles based on the theme
  const containerClass = `relative rounded-lg shadow-md w-[600px] p-5 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-[#dbedff] text-black'}`;
  const iconColorClass = `${theme === 'dark' ? 'text-white' : 'text-black'} hover:text-blue-400 transition-colors duration-300`;

  return (
    <div className={containerClass}>
      <h2 className="text-2xl font-medium mb-5">Intern Signature</h2>
      {signatureUrl ? (
        <div className="flex items-center mt-2">
          <img src={signatureUrl} alt="Intern Signature" className="w-[150px] h-auto rounded" />
        </div>
      ) : (
        <p>No signature available</p>
      )}
      {/* Edit Icon in the upper right corner with updated color */}
      <button 
        onClick={onEditClick} 
        className={`absolute top-2 right-2 ${iconColorClass}`}
      >
        <EditIcon />
      </button>
    </div>
  );
};

export default InternSignature;
