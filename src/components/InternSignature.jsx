import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const InternSignature = ({ signatureUrl, onEditClick }) => {
  const { theme } = useTheme(); // Get the current theme

  // Determine styles based on the theme
  const containerClass = `rounded-lg shadow-md w-[600px] p-5 ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-[#dbedff] text-gray-700'}`;

  return (
    <div className={containerClass}>
      <h2 className="text-2xl font-medium mb-5">Intern Signature</h2>
      {signatureUrl ? (
        <div className="flex items-center mt-2">
          <img src={signatureUrl} alt="Intern Signature" className="w-[150px] h-auto rounded" />
          <button 
            onClick={onEditClick} 
            className="ml-4 text-blue-500 hover:underline transition-colors duration-300"
          >
            Edit Signature
          </button>
        </div>
      ) : (
        <p>No signature available</p>
      )}
    </div>
  );
};

export default InternSignature;
