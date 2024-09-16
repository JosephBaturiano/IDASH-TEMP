import React, {useContext} from 'react';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CallIcon from '@mui/icons-material/Call';
import EditIcon from '@mui/icons-material/Edit';
import TimeRendered from './TimeRendered';
import { useTimesheets } from '../context/TimesheetContext';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import { UserContext } from '../context/UserContext'; // Import UserContext


const ProfileCard = ({ profileData = {}, handleEditClick }) => {
  const {
    user_profile = '',
    full_name = '',
    university = '',
    address = '',
    email = '',
    telephone = '',
  } = profileData;

  const { timesheets } = useTimesheets();
  const { theme } = useTheme(); // Get the current theme
  const { currentUserId } = useContext(UserContext); // Access currentUserId from UserContext

  // Determine the styles based on the theme
  const containerClass = `bg-${theme === 'dark' ? 'gray-800' : 'white'} rounded-lg shadow-md w-[400px] p-6 mb-10 h-full relative`;
  const timeColorClass = `text-${theme === 'dark' ? 'black' : 'black'}`;
  const textColorClass = `text-${theme === 'dark' ? 'white' : 'black'}`;
  const iconColorClass = `text-${theme === 'dark' ? 'gray-300' : 'black'}`;
  const bgColorClass = `bg-${theme === 'dark' ? 'gray-200' : '#c3ffc7'}`;

  return (
    <div className="flex flex-col items-center h-full">
      <div className={containerClass}>
        <div className="relative group">
          <div className={`h-[250px] w-[225px] rounded-3xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center mb-2 mx-auto`}>
            {user_profile ? (
              <img
                src={user_profile}
                alt="Profile"
                className="rounded-3xl h-full w-full object-cover"
              />
            ) : (
              <span className={`text-${theme === 'dark' ? 'gray-400' : 'gray-600'}`}>No Image</span>
            )}
            <div
              onClick={handleEditClick}
              className={`absolute top-2 right-2 p-2 cursor-pointer ${textColorClass} hover:text-blue-400 transition-colors duration-300`}
            >
              <EditIcon />
            </div>
          </div>
        </div>
        <h2 className={`text-center text-2xl font-medium mb-5 ${textColorClass}`}>{full_name}</h2>
        <div className={`flex flex-col items-center ${bgColorClass} font-bold rounded-3xl shadow-md p-2 mb-6 w-[200px] mx-auto`}>
          <span className={`text-xs font-semibold ${timeColorClass} mb-1`}>Time Rendered</span>
          <TimeRendered timesheets={timesheets} currentUserId={currentUserId} />
        </div>
        <div className="space-y-3 px-6">
          <div className="flex items-center space-x-4">
            <SchoolIcon className={iconColorClass} />
            <p className={`text-sm ${textColorClass}`}>{university}</p>
          </div>
          <div className="flex items-center space-x-4">
            <LocationOnIcon className={iconColorClass} />
            <p className={`text-sm ${textColorClass}`}>{address}</p>
          </div>
          <div className="flex items-center space-x-4">
            <AlternateEmailIcon className={iconColorClass} />
            <p className={`text-sm ${textColorClass}`}>{email}</p>
          </div>
          <div className="flex items-center space-x-4">
            <CallIcon className={iconColorClass} />
            <p className={`text-sm ${textColorClass}`}>{telephone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
