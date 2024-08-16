import React from 'react';

const AddTimesheetModal = ({
  isOpen,
  onClose,
  onSubmit,
  newTaskNumber,
  setNewTaskNumber,
  newDescription,
  setNewDescription,
  newTimeStarted,
  setNewTimeStarted,
  newTimeEnded,
  setNewTimeEnded,
  newWithWhom,
  setNewWithWhom,
  newDeliverables,
  setNewDeliverables
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Timesheet</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="task-number" className="block text-sm font-medium text-gray-700 mb-1">Task Number</label>
            <input
              id="task-number"
              type="text"
              placeholder="Task Number"
              value={newTaskNumber}
              onChange={(e) => setNewTaskNumber(e.target.value)}
              className="border rounded-lg p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              id="description"
              type="text"
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
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
                value={newTimeStarted}
                onChange={(e) => setNewTimeStarted(e.target.value)}
                className="border rounded-lg p-2 w-full"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                id="end-time"
                type="time"
                value={newTimeEnded}
                onChange={(e) => setNewTimeEnded(e.target.value)}
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
              value={newWithWhom}
              onChange={(e) => setNewWithWhom(e.target.value)}
              className="border rounded-lg p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="deliverables" className="block text-sm font-medium text-gray-700 mb-1">Deliverables</label>
            <input
              id="deliverables"
              type="text"
              placeholder="Deliverables"
              value={newDeliverables}
              onChange={(e) => setNewDeliverables(e.target.value)}
              className="border rounded-lg p-2 w-full"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onSubmit}
            className="bg-green-600 text-white py-2 px-4 rounded-lg"
          >
            Add Timesheet
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

export default AddTimesheetModal;
