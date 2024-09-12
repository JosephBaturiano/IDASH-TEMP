// components/WeekSelectionModal.jsx

import React, { useState } from 'react';

const WeekSelectionModal = ({ isOpen, onClose, onSelect }) => {
  const [week, setWeek] = useState('');

  const handleSelect = () => {
    if (week) {
      onSelect(week);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Select Week</h2>
        <select
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          className="border rounded-lg px-4 py-2 mb-4"
        >
          {[...Array(10).keys()].map((weekNumber) => (
            <option key={weekNumber} value={weekNumber}>
              Week {weekNumber}
            </option>
          ))}
        </select>
        <div className="flex justify-end">
          <button
            onClick={handleSelect}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
          >
            Select
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeekSelectionModal;
