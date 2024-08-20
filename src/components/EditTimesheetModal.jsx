import React from 'react';

const EditTimesheetModal = ({
    isOpen,
    onClose,
    onSubmit,
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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit Timesheet</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="task-number" className="block text-sm font-medium text-gray-700 mb-1">Task Number</label>
                        <input
                            id="task-number"
                            type="text"
                            placeholder="Task Number"
                            value={taskNumber}
                            onChange={(e) => setTaskNumber(e.target.value)}
                            className="border rounded-lg p-2 w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            id="description"
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border rounded-lg p-2 w-full"
                        />
                    </div>

                    {/* Time Inputs with Labels in a Single Line */}
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                            <input
                                id="start-time"
                                type="time"
                                value={timeStarted}
                                onChange={(e) => setTimeStarted(e.target.value)}
                                className="border rounded-lg p-2 w-full"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                            <input
                                id="end-time"
                                type="time"
                                value={timeEnded}
                                onChange={(e) => setTimeEnded(e.target.value)}
                                className="border rounded-lg p-2 w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="with-whom" className="block text-sm font-medium text-gray-700 mb-1">With Whom</label>
                        <input
                            id="with-whom"
                            type="text"
                            placeholder="With Whom"
                            value={withWhom}
                            onChange={(e) => setWithWhom(e.target.value)}
                            className="border rounded-lg p-2 w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="deliverables" className="block text-sm font-medium text-gray-700 mb-1">Deliverables</label>
                        <input
                            id="deliverables"
                            type="text"
                            placeholder="Deliverables"
                            value={deliverables}
                            onChange={(e) => setDeliverables(e.target.value)}
                            className="border rounded-lg p-2 w-full"
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                    <button
                        onClick={onSubmit}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg"
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTimesheetModal;
