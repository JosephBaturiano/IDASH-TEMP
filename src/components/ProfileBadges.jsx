import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const ProfileBadges = ({ badgeOne, badgeTwo, badgeThree, onEditClick, onDeleteBadge }) => {
  const { theme } = useTheme(); // Get the current theme
  const placeholderBadge = 'https://via.placeholder.com/90'; // Placeholder image

  // Determine styles based on the theme
  const containerClass = `bg-${theme === 'dark' ? 'gray-800' : '#dbedff'} rounded-lg shadow-md w-[600px] h-[170px] p-5 relative`;
  const textColorClass = `text-${theme === 'dark' ? 'white' : 'black'}`;
  const buttonClass = `absolute inset-0 m-auto h-[30px] w-[30px] bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`;

  return (
    <div className={containerClass}>
      <h2 className={`text-2xl font-medium mb-2 ${textColorClass}`}>Badges</h2>
      <div className="flex gap-4 px-1 pt-1">
        {badgeOne ? (
          <div className="relative group">
            <img src={badgeOne} alt="Badge 1" className="h-[90px] w-[90px]" />
            <button
              onClick={() => onDeleteBadge('badgeOne')}
              className={buttonClass}
            >
              x
            </button>
          </div>
        ) : (
          <div className="relative group">
            <img src={placeholderBadge} alt="Placeholder Badge" className="h-[90px] w-[90px]" />
            <button
              onClick={() => onDeleteBadge('badgeOne')}
              className={buttonClass}
            >
              x
            </button>
          </div>
        )}
        {badgeTwo ? (
          <div className="relative group">
            <img src={badgeTwo} alt="Badge 2" className="h-[90px] w-[90px]" />
            <button
              onClick={() => onDeleteBadge('badgeTwo')}
              className={buttonClass}
            >
              x
            </button>
          </div>
        ) : (
          <div className="relative group">
            <img src={placeholderBadge} alt="Placeholder Badge" className="h-[90px] w-[90px]" />
            <button
              onClick={() => onDeleteBadge('badgeTwo')}
              className={buttonClass}
            >
              x
            </button>
          </div>
        )}
        {badgeThree ? (
          <div className="relative group">
            <img src={badgeThree} alt="Badge 3" className="h-[90px] w-[90px]" />
            <button
              onClick={() => onDeleteBadge('badgeThree')}
              className={buttonClass}
            >
              x
            </button>
          </div>
        ) : (
          <div className="relative group">
            <img src={placeholderBadge} alt="Placeholder Badge" className="h-[90px] w-[90px]" />
            <button
              onClick={() => onDeleteBadge('badgeThree')}
              className={buttonClass}
            >
              x
            </button>
          </div>
        )}
      </div>
      <div
        onClick={onEditClick}
        className={`absolute top-2 right-2 p-2 cursor-pointer ${textColorClass} hover:text-blue-400 transition-colors duration-300`}
      >
        <EditIcon />
      </div>
    </div>
  );
};

export default ProfileBadges;
