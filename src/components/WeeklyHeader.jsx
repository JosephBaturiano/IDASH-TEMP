import React from 'react';
import PUPLogo from '../assets/PUPLogo.png'

const WeeklyHeader = () => {
    return (
        <div className="absolute top-0 left-0 w-full bg-white p-4 flex items-center">
            <div className='w-28 h-28 flex-shrink-0 ml-10'>
                <img
                    src={PUPLogo}
                    alt="PUP Logo"
                    className="w-full h-full object-contain"
                />
            </div>
            <div className="text-left flex-1 ml-6">
                <h3 className="text-lg font-semibold">Republic of the Philippines</h3>
                <h3 className="text-lg font-bold">POLYTECHNIC UNIVERSITY OF THE PHILIPPINES</h3>
                <p className="text-base">Office of the Vice President for Academic Affairs</p>
                <p className="text-base font-semibold">COMPUTER ENGINEERING DEPARTMENT</p>
                <p className="text-base font-semibold">OFFICE OF THE CHAIRPERSON</p>
    
            </div>
        </div>
    );
};

export default WeeklyHeader;

