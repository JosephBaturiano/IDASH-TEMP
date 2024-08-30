import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme from your context

const FullName = ({ name }) => {
  const { theme } = useTheme(); // Get the current theme from the context

  // Define text color based on the current theme
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';

  return (
    <div className={`font-semibold ${textColor}`}>
      {name || 'N/A'} {/* Display 'N/A' if no name is provided */}
    </div>
  );
};

export default FullName;
