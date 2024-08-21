import React from 'react';
import FooterImage from '../assets/FooterImage.png'

const WeeklyFooter = () => {
    return (
        <div className="absolute bottom-0 left-0 w-full bg-white p-4">
          <div className="flex justify-between items-center">
            {/* Left Side */}
            <div className="text-sm ml-6 mb-3">
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
            <div className="flex flex-col items-center">
              <div className="flex mb-2">
                <img 
                  src={FooterImage}
                  alt="SOCOTEC ISO 9001" 
                  className="h-40 mr-4" 
                />
              </div>
            </div>
          </div>
        </div>
      );
    };

export default WeeklyFooter;
