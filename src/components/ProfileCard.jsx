import React from 'react';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CallIcon from '@mui/icons-material/Call';
import TimeRendered from './TimeRendered';
import { useTimesheets } from '../context/TimesheetContext';


const ProfileCard = ({ profileData = {}, handleEditClick }) => {
  const {
    user_profile = '',
    full_name = '',
    university = '',
    address = '',
    email = '',
    telephone = ''
  } = profileData;
  const { timesheets } = useTimesheets();

  return (
    <div className="flex flex-col items-center h-full">
      <div className="bg-white rounded-lg shadow-md w-[400px] p-6 mb-10 h-full relative">
        <div className="relative group">
          <div className="h-[250px] w-[225px] rounded-3xl bg-gray-100 flex items-center justify-center mb-2 mx-auto">
            {user_profile ? (
              <img
                src={user_profile}
                alt="Profile"
                className="rounded-3xl h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
            <div
              onClick={handleEditClick}
              className="absolute top-2 right-2 p-2 cursor-pointer text-white group-hover:text-blue-400 transition-colors duration-300"
            >
              Edit
            </div>
          </div>

        </div>
        <h2 className="text-center text-2xl font-medium mb-5">{full_name}</h2>
  
      

        <div className="flex flex-col items-center bg-[#c3ffc7] font-bold rounded-3xl shadow-md p-2 mb-6 w-[200px] mx-auto">
          <span className="text-xs font-semibold text-gray-600 mb-1">Time Rendered</span>
          <TimeRendered timesheets={timesheets} />
        </div>
        <div className="space-y-3 px-6">
          <div className="flex items-center space-x-4">
            <SchoolIcon className="text-black" />
            <p className="text-sm">{university}</p>
          </div>
          <div className="flex items-center space-x-4">
            <LocationOnIcon className="text-black" />
            <p className="text-sm">{address}</p>
          </div>
          <div className="flex items-center space-x-4">
            <AlternateEmailIcon className="text-black" />
            <p className="text-sm">{email}</p>
          </div>
          <div className="flex items-center space-x-4">
            <CallIcon className="text-black" />
            <p className="text-sm">{telephone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
