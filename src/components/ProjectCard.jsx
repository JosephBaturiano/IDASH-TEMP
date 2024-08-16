import React from 'react';


const ProjectCard = ({ TeamLogo, title, date, assignedTo, progress }) => {
  return (

      <div className="flex items-center bg-[#DBEDFF] rounded-lg p-4 shadow-md">
        {/* Icon */}
        <div className="w-40 h-40 flex items-center justify-center rounded-full mr-4">
          <img src={TeamLogo} alt="Project Icon" className="w-30 h-30" />
        </div>

        {/* Project Details */}
        <div className="flex-grow">
          <h3 className="text-[18px] font-semibold">{title}</h3>
          <p className=" text-[18px] text-gray-800">{date}</p>
          <p className=" text-[16px] text-gray-800">Assigned: {assignedTo}</p>
          <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
  );
};

export default ProjectCard;