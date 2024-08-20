import React from 'react';

const ProfileAbout = ({ about }) => {
  return (
    <div className="bg-[#dbedff] rounded-lg shadow-md w-[600px] h-[210px] p-5 mb-5 overflow-hidden">
      <h2 className="text-2xl font-medium mb-2">About Me</h2>
      <div className="px-1 h-[160px] overflow-y-auto">
        <p className="text-sm text-gray-700 text-justify">{about}</p>
      </div>
    </div>
  );
};

export default ProfileAbout;
