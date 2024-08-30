import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const ProfileDirectory = () => {
  const { theme } = useTheme(); // Get the current theme

  // Determine styles based on the theme
  const containerClass = `bg-${theme === 'dark' ? 'gray-800' : '#dbedff'} rounded-lg shadow-md w-[600px] p-5`;
  const textColorClass = `text-${theme === 'dark' ? 'gray-300' : 'gray-700'}`;

  return (
    <div className={containerClass}>
      <h2 className={`text-2xl font-medium mb-5 ${textColorClass}`}>Directory</h2>
      <div className="flex gap-8">
        <a href="https://github.com/vt4b" target="_blank" rel="noopener noreferrer">
          <img src="src/assets/github-logo.png" alt="github" className="h-[50px] w-[50px]" />
        </a>
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
          <img src="src/assets/discord-logo.png" alt="discord" className="h-[50px] w-[50px]" />
        </a>
        <a href="https://drive.google.com/drive/folders/1wKjQNXLYTmaqTpsEOyZgol4JpFmnvjfW" target="_blank" rel="noopener noreferrer">
          <img src="src/assets/gdrive-logo.png" alt="gdrive" className="h-[50px] w-[50px]" />
        </a>
      </div>
    </div>
  );
};

export default ProfileDirectory;
