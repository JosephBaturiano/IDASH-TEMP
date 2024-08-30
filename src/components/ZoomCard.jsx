import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const ZoomCard = () => {
  const { theme } = useTheme(); // Use theme from context

  // Define dynamic colors based on the current theme
  const backgroundColor = theme === 'light' ? 'bg-[#DBEDFF]' : 'bg-gray-800';
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-white';
  const buttonJoinColor = theme === 'light' ? 'bg-blue-500' : 'bg-blue-700';
  const buttonWatchColor = theme === 'light' ? 'bg-red-400' : 'bg-red-600';

  return (
    <div className='pb-6'>
      <h3 className={`text-[20px] font-bold pb-4 ${textColor}`}>Zoom Meeting</h3>
      <div className={`rounded-lg p-4 shadow-md pb-4 ${backgroundColor}`}>
        <p className={`text-[18px] ${textColor}`}>Meeting code: 836 5495 1763</p>
        <p className={`text-[18px] ${textColor}`}>Password: VTTP</p>
        <div className="flex space-x-2 mt-4">
          <a
            href="https://us02web.zoom.us/j/83654951763?pwd=ZHdPRG00bnJac0tHUGNMOFVCOEt5dz09#success"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-white text-[16px] px-3 py-1 rounded ${buttonJoinColor}`}
          >
            Join meeting
          </a>
          <a
            href="https://drive.google.com/drive/folders/1wKjQNXLYTmaqTpsEOyZgol4JpFmnvjfW"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-white text-[16px] px-3 py-1 rounded ${buttonWatchColor}`}
          >
            Watch Recording
          </a>
        </div>
      </div>
    </div>
  );
};

export default ZoomCard;
