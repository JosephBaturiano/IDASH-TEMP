import React from 'react';
import FooterImage from '../assets/FooterImage.png';

const WeeklyFooter = () => {
  return (
    <div className="w-full bg-white p-4 mt-auto">
      <div className="flex justify-between items-center">
        {/* Left Side */}
        <div className="text-sm pl-8 pb-2">
          <p>Second Floor, College of Engineering and Architecture Building,</p>
          <p>PUP A. Mabini Campus, Anonas Street, Sta. Mesa, Manila 1016</p>
          <p>
            Direct Line: 335-1752 | Trunk Line: 335-1787 or 335-1777 local 236 or 302
          </p>
          <p>
            Website: <a href="http://www.pup.edu.ph" className="text-blue-600">www.pup.edu.ph</a> | 
            Email: <a href="mailto:ce@pup.edu.ph" className="text-blue-600">ce@pup.edu.ph</a> 
            Tel no: 716-6273
          </p>
          <p className="font-bold uppercase mt-2">The Country’s 1st PolytechnicU</p>
        </div>
        
        {/* Right Side - Certifications */}
        <div className="flex items-center pr-8 pb-2">
          <img 
            src={FooterImage}
            alt="SOCOTEC ISO 9001" 
            className="h-32" 
          />
        </div>
      </div>
    </div>
  );
};

export default WeeklyFooter;
