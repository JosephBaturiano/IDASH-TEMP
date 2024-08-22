import React from 'react';

const ProfileBadges = ({ badgeOne, badgeTwo, badgeThree, onEditClick, onDeleteBadge }) => {
  const placeholderBadge = 'https://via.placeholder.com/90'; // Placeholder image

  return (
    <div className="bg-[#dbedff] rounded-lg shadow-md w-[600px] h-[170px] p-5 relative">
      <h2 className="text-2xl font-medium mb-2">Badges</h2>
      <div className="flex gap-4 px-1 pt-1">
        {badgeOne && (
          <div className="relative group">
            <img src={badgeOne} alt="Badge 1" className="h-[90px] w-[90px]" />
            <button
              onClick={() => onDeleteBadge('badgeOne')}
              className="absolute inset-0 m-auto h-[30px] w-[30px] bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              x
            </button>
          </div>
        )}
        {badgeTwo && (
          <div className="relative group">
            <img src={badgeTwo} alt="Badge 2" className="h-[90px] w-[90px]" />
            <button
              onClick={() => onDeleteBadge('badgeTwo')}
              className="absolute inset-0 m-auto h-[30px] w-[30px] bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              x
            </button>
          </div>
        )}
        {badgeThree && (
          <div className="relative group">
            <img src={badgeThree} alt="Badge 3" className="h-[90px] w-[90px]" />
            <button
              onClick={() => onDeleteBadge('badgeThree')}
              className="absolute inset-0 m-auto h-[30px] w-[30px] bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              x
            </button>
          </div>
        )}
      </div>
      <div
        onClick={onEditClick}
        className="absolute top-2 right-2 p-2 cursor-pointer text-[#dbedff] hover:text-white transition-colors duration-300"
      >
        Edit
      </div>
    </div>
  );
};

export default ProfileBadges;
