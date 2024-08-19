
import React from 'react';

const Initials = ({ initials, className }) => {
  return (
    <div className={`flex items-center justify-center w-full h-full  text-gray-900 font-bold ${className}`}>
      {initials}
    </div>
  );
};

export default Initials;
