import React from 'react';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CallIcon from '@mui/icons-material/Call';
import EditIcon from '@mui/icons-material/Edit';
import TimeRendered from './TimeRendered';
import { useTimesheets } from '../context/TimesheetContext';

const ProfileCard = ({ profileData = {}, handleEditClick }) => {
  const {
    user = '',
    name = '', // Updated to directly access from profileData
    university = '',
    address = '',
    email = '',
    telephone = ''
  } = profileData;
  const { timesheets } = useTimesheets();

  return (
    <div className="flex flex-col items-center h-full">
      <div className="bg-white rounded-lg shadow-md w-[400px] p-6 mb-10 h-full relative">
        {user && (
          <div className="relative group">
            <img
              src={user}
              alt="Profile"
              className="rounded-3xl h-[250px] w-[225px] object-cover mb-2 mx-auto"
            />
            <div
              onClick={handleEditClick}
              className="absolute top-2 right-2 bg-gray-700 bg-opacity-50 p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <EditIcon className="text-white" />
            </div>
          </div>
        )}
        <h2 className="text-center text-2xl font-medium mb-4">{name}</h2> {/* Display name */}

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

