import React from 'react';
import EditIcon from '@mui/icons-material/Edit';

const TimeSheetCard = ({ item, onEdit}) => (
    <div key={item.id} className="bg-white shadow-none border-t border-gray-200 hover:bg-gray-50 transition-colors duration-300 p-4 rounded-lg">
        <div className="grid grid-cols-7 gap-4 items-center w-full">
            <div className="flex items-center justify-center text-gray-900 font-medium">{item.taskNumber}</div>
            <div className="flex items-center justify-center text-gray-700">{item.description}</div>
            <div className="flex items-center justify-center text-gray-500">{item.timeStarted}</div>
            <div className="flex items-center justify-center text-gray-500">{item.timeEnded}</div>
            <div className="flex items-center justify-center text-gray-700">{item.withWhom}</div>
            <div className="flex items-center justify-center text-gray-700">{item.deliverables}</div>
            <div className="flex justify-center space-x-2">
                <button onClick={() => onEdit(item)} className="bg-blue-100 p-1 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">
                    <EditIcon className="text-blue-600" />
                </button>
            </div>
        </div>
    </div>
);

export default TimeSheetCard;
