import React, { useState } from 'react';

const WeekSelectionModal = ({ isOpen, onClose, onSelect }) => {
  const [week, setWeek] = useState('');

  const handleSelect = () => {
    if (week) {
      onSelect(week);
      onClose(); // Close the modal after selection
    }
  };  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-8 max-w-md w-full rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-6 text-center">Select Week</h2>
        <select
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          className="border rounded-lg px-6 py-3 mb-6 w-full"
        >
          {[...Array(10).keys()].map((weekNumber) => (
            <option key={weekNumber} value={weekNumber}>
              Week {weekNumber}
            </option>
          ))}
        </select>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSelect}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg"
          >
            Select
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeekSelectionModal;
