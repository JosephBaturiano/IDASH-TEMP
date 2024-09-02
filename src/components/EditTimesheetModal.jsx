import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const EditTimesheetModal = ({
    isOpen,
    onClose,
    onSubmit,
    onDelete,
    taskNumber,
    setTaskNumber,
    description,
    setDescription,
    timeStarted,
    setTimeStarted,
    timeEnded,
    setTimeEnded,
    withWhom,
    setWithWhom,
    deliverables,
    setDeliverables
}) => {
    const { theme } = useTheme(); // Get the current theme

    if (!isOpen) return null;

    // Define dark mode and light mode styles
    const modalBgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
    const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-900';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const inputBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'; // Different background for inputs
    const inputTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-900'; // Text color for inputs
    const buttonBgSave = theme === 'dark' ? 'bg-green-500' : 'bg-green-600';
    const buttonBgCancel = theme === 'dark' ? 'bg-red-600' : 'bg-red-500';
    const buttonBgDelete = theme === 'dark' ? 'bg-red-800' : 'bg-red-700';

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50`}>
            <div className={`p-6 rounded-lg shadow-lg w-full max-w-md ${modalBgColor}`}>
                <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Edit Timesheet</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="task-number" className={`block text-sm font-medium mb-1 ${textColor}`}>Task Number</label>
                        <input
                            id="task-number"
                            type="text"
                            placeholder="Task Number"
                            value={taskNumber}
                            onChange={(e) => setTaskNumber(e.target.value)}
                            className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className={`block text-sm font-medium mb-1 ${textColor}`}>Description</label>
                        <input
                            id="description"
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
                        />
                    </div>

                    {/* Time Inputs with Labels in a Single Line */}
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="start-time" className={`block text-sm font-medium mb-1 ${textColor}`}>Start Time</label>
                            <input
                                id="start-time"
                                type="time"
                                value={timeStarted}
                                onChange={(e) => setTimeStarted(e.target.value)}
                                className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="end-time" className={`block text-sm font-medium mb-1 ${textColor}`}>End Time</label>
                            <input
                                id="end-time"
                                type="time"
                                value={timeEnded}
                                onChange={(e) => setTimeEnded(e.target.value)}
                                className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="with-whom" className={`block text-sm font-medium mb-1 ${textColor}`}>With Whom</label>
                        <input
                            id="with-whom"
                            type="text"
                            placeholder="With Whom"
                            value={withWhom}
                            onChange={(e) => setWithWhom(e.target.value)}
                            className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
                        />
                    </div>
                    <div>
                        <label htmlFor="deliverables" className={`block text-sm font-medium mb-1 ${textColor}`}>Deliverables</label>
                        <input
                            id="deliverables"
                            type="text"
                            placeholder="Deliverables"
                            value={deliverables}
                            onChange={(e) => setDeliverables(e.target.value)}
                            className={`border rounded-lg p-2 w-full ${borderColor} ${inputBgColor} ${inputTextColor}`}
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                    <button
                        onClick={onSubmit}
                        className={`py-2 px-4 rounded-lg text-white ${buttonBgSave}`}
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={onClose}
                        className={`py-2 px-4 rounded-lg text-white ${buttonBgCancel}`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this entry?")) {
                                onDelete();
                            }
                        }}
                        className={`py-2 px-4 rounded-lg text-white ${buttonBgDelete}`}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTimesheetModal;
