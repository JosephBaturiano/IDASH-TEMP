import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const TimeSheetCard = ({ item, onEdit, onToggleInclude }) => {
    const { theme } = useTheme(); // Get the current theme

    // Define colors based on the current theme
    const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white'; // Background color
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200'; // Border color
    const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-900'; // Text color
    const hoverColor = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'; // Hover background color

    return (
        <tr key={item.id} className={`${bgColor} ${borderColor} ${hoverColor} border-t transition-colors duration-300`}>
            <td className={`px-2 py-2 ${textColor} font-medium text-center`}>{item.taskNumber}</td>
            <td className={`px-2 py-2 ${textColor} text-center`}>{item.description}</td>
            <td className={`px-2 py-2 ${textColor} text-center`}>{item.timeStarted}</td>
            <td className={`px-2 py-2 ${textColor} text-center`}>{item.timeEnded}</td>
            <td className={`px-2 py-2 ${textColor} text-center`}>{item.withWhom}</td>
            <td className={`px-2 py-2 ${textColor} text-center break-words`}>{item.deliverables}</td>
            <td className={`px-2 py-2 text-center`}>
                <div className="flex items-center justify-center h-full space-x-2">
                    <button 
                        onClick={() => onEdit(item)} 
                        className="bg-blue-100 p-1 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300"
                    >
                        <EditIcon className="text-blue-600" />
                    </button>
                    <input
                        type="checkbox"
                        checked={item.includeInReport || false}  // Ensure a boolean value is always passed
                        onChange={() => onToggleInclude(item.id)}
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    />
                </div>
            </td>
        </tr>
    );
};

export default TimeSheetCard;
