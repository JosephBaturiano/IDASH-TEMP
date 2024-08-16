
import React from 'react';


const ZoomCard = () => {
    return (
        <div className='pb-6'>
            <h3 className="text-[20px] font-bold pb-4">Zoom Meeting</h3>
            <div className="bg-[#DBEDFF] rounded-lg p-4 shadow-md pb-4">
                <p className='text-[18px]'>Meeting code: 836 5495 1763</p>
                <p className='text-[18px]'>Password: VTTP</p>
                <div className="flex space-x-2 mt-4">
                    <a
                        href="https://us02web.zoom.us/j/83654951763?pwd=ZHdPRG00bnJac0tHUGNMOFVCOEt5dz09#success"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white text-[16px] px-3 py-1 rounded"
                    >
                        Join meeting
                    </a>
                    <a
                        href="https://drive.google.com/drive/folders/1wKjQNXLYTmaqTpsEOyZgol4JpFmnvjfW"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-400 text-white text-[16px] px-3 py-1 rounded"
                    >
                        Watch Recording
                    </a>
                </div>

            </div>
        </div>
    );
};

export default ZoomCard;