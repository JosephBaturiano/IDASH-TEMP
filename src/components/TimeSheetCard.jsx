import React from 'react';
import EditIcon from '@mui/icons-material/Edit';

const TimeSheetCard = ({ item, onEdit }) => (
    <tr key={item.id} className="bg-white border-t border-gray-200 hover:bg-gray-50 transition-colors duration-300">
        <td className="px-2 py-1 text-gray-900 font-medium text-center">{item.taskNumber}</td>
        <td className="px-2 py-1 text-gray-700 text-center">{item.description}</td>
        <td className="px-2 py-1 text-gray-500 text-center">{item.timeStarted}</td>
        <td className="px-2 py-1 text-gray-500 text-center">{item.timeEnded}</td>
        <td className="px-2 py-1 text-gray-700 text-center">{item.withWhom}</td>
        <td className="px-2 py-1 text-gray-700 text-center">{item.deliverables}</td>
        <td className="px-2 py-1 text-center">
            <button onClick={() => onEdit(item)} className="bg-blue-100 p-1 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300">
                <EditIcon className="text-blue-600" />
            </button>
        </td>
    </tr>
);

export default TimeSheetCard;
