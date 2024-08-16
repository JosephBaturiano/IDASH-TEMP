import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import TimeSheetCard from '../components/TimeSheetCard';

// Dummy data for timesheets
const timesheets = [
    {
        id: 1,
        taskNumber: '1',
        description: 'Complete project documentation for all',
        timeStarted: '09:00',
        timeEnded: '11:00',
        withWhom: 'John Doe',
        deliverables: 'Document draft',
        date: '2024-08-15',
    },
    {
        id: 2,
        taskNumber: '2',
        description: 'Review code',
        timeStarted: '11:30',
        timeEnded: '13:00',
        withWhom: 'Jane Smith',
        deliverables: 'Code review notes',
        date: '2024-08-15',
    },
    {
        id: 3,
        taskNumber: '3',
        description: 'Team meeting',
        timeStarted: '14:00',
        timeEnded: '15:00',
        withWhom: 'Project Team',
        deliverables: 'Meeting minutes',
        date: '2024-08-16',
    },
    {
      id: 4,
      taskNumber: '7',
      description: 'Team meeting',
      timeStarted: '14:00',
      timeEnded: '15:00',
      withWhom: 'Project Team',
      deliverables: 'Meeting minutes',
      date: '2024-08-14',
  },
];

const TimesheetHeader = () => (
    <div className="grid grid-cols-7 pb-4 pt-4 border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold text-center">
        <div className="flex items-center justify-center text-gray-900">Task #</div>
        <div className="flex items-center justify-center text-gray-900">Task Description</div>
        <div className="flex items-center justify-center text-gray-900">Time Started</div>
        <div className="flex items-center justify-center text-gray-900">Time Ended</div>
        <div className="flex items-center justify-center text-gray-900">With Whom</div>
        <div className="flex items-center justify-center text-gray-900">Deliverables</div>
        <div className="flex items-center justify-center text-gray-900">Action</div>
    </div>
);

const TimeSheet = () => {
    const [selectedDate, setSelectedDate] = useState('');

    const filteredTimesheets = selectedDate
        ? timesheets.filter((item) => item.date === selectedDate)
        : timesheets;

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4">
            <div className="flex justify-between items-center pt-4">
                <div className="flex items-center space-x-4">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="btn btn-primary btn-sm flex items-center space-x-2">
                    <AddIcon className="w-4 h-4" />
                    <span>Add Timesheet</span>
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-x-auto">
                <TimesheetHeader />
                <div className="flex flex-col">
                    {filteredTimesheets.length > 0 ? (
                        filteredTimesheets.map((item) => <TimeSheetCard key={item.id} item={item} />)
                    ) : (
                        <div className="text-center text-gray-500 py-4">No timesheets found for the selected date.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimeSheet;
