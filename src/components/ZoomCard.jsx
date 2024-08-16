
import React from 'react';


const ZoomCard = () => {
  return (
    <div className='pb-6'>
      <h3 className="text-[32px] font-bold pt-4 pb-4">Zoom Meeting</h3>
      <div className="bg-[#DBEDFF] rounded-lg p-4 shadow-md pb-4">
        <p className='text-[23px]'>Meeting code: 836 5495 1763</p>
        <p className='text-[23px]'>Password: VTTP</p>
        <div className="flex space-x-2 mt-4">
          <button className="bg-blue-500 text-white text-[20px] px-3 py-1 rounded">Join meeting</button>
          <button className="bg-red-400 text-white text-[20px] px-3 py-1 rounded">Watch Recordings</button>
        </div>
      </div>
    </div>
  );
};

export default ZoomCard;