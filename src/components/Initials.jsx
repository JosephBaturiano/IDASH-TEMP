import React from 'react';

const FullName = ({ name }) => {
  return (
      <div className="text-gray-900 font-semibold">
          {name || 'N/A'} {/* Display 'N/A' if no name is provided */}
      </div>
  );
};

export default FullName;
