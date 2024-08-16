import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import TimeSheetCard from '../components/TimeSheetCard';
import AddTimesheetModal from '../components/AddTimesheetModal';
import EditTimesheetModal from '../components/EditTimesheetModal';

// Dummy data for timesheets
const initialTimesheets = [
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
  const [timesheets, setTimesheets] = useState(initialTimesheets);
  const [newTaskNumber, setNewTaskNumber] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTimeStarted, setNewTimeStarted] = useState('');
  const [newTimeEnded, setNewTimeEnded] = useState('');
  const [newWithWhom, setNewWithWhom] = useState('');
  const [newDeliverables, setNewDeliverables] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingItem, setCurrentEditingItem] = useState(null);

  const filteredTimesheets = selectedDate
    ? timesheets.filter((item) => item.date === selectedDate)
    : timesheets;

  const handleAddTimesheet = () => {
    if (newTaskNumber && newDescription && newTimeStarted && newTimeEnded && newWithWhom && newDeliverables) {
      const newTimesheet = {
        id: timesheets.length + 1, // Adjust as needed, ideally use UUID
        taskNumber: newTaskNumber,
        description: newDescription,
        timeStarted: newTimeStarted,
        timeEnded: newTimeEnded,
        withWhom: newWithWhom,
        deliverables: newDeliverables,
        date: selectedDate || new Date().toISOString().split('T')[0], // Default to today if no date selected
      };

      // Add to local state
      setTimesheets([...timesheets, newTimesheet]);

      // Clear input fields
      setNewTaskNumber('');
      setNewDescription('');
      setNewTimeStarted('');
      setNewTimeEnded('');
      setNewWithWhom('');
      setNewDeliverables('');

      // Close modal
      setIsModalOpen(false);
    } else {
      alert('Please fill all fields.');
    }
  };

  const handleEditTimesheet = (item) => {
    setCurrentEditingItem(item);
    setNewTaskNumber(item.taskNumber);
    setNewDescription(item.description);
    setNewTimeStarted(item.timeStarted);
    setNewTimeEnded(item.timeEnded);
    setNewWithWhom(item.withWhom);
    setNewDeliverables(item.deliverables);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (newTaskNumber && newDescription && newTimeStarted && newTimeEnded && newWithWhom && newDeliverables) {
      const updatedTimesheets = timesheets.map((item) =>
        item.id === currentEditingItem.id
          ? {
            ...item,
            taskNumber: newTaskNumber,
            description: newDescription,
            timeStarted: newTimeStarted,
            timeEnded: newTimeEnded,
            withWhom: newWithWhom,
            deliverables: newDeliverables,
          }
          : item
      );

      setTimesheets(updatedTimesheets);

      // Clear input fields and close modal
      setNewTaskNumber('');
      setNewDescription('');
      setNewTimeStarted('');
      setNewTimeEnded('');
      setNewWithWhom('');
      setNewDeliverables('');
      setIsEditModalOpen(false);
      setCurrentEditingItem(null);
    } else {
      alert('Please fill all fields.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center pt-4">
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-lg p-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          className="btn bg-green-600 text-white btn-md flex items-center space-x-2"
          onClick={() => setIsModalOpen(true)}
        >
          <AddIcon className="w-4 h-4" />
          <span>Add Timesheet</span>
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-x-auto">
        <TimesheetHeader />
        <div className="flex flex-col">
          {filteredTimesheets.length > 0 ? (
            filteredTimesheets.map((item) => (
              <TimeSheetCard key={item.id} item={item} onEdit={handleEditTimesheet} />
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No timesheets found for the selected date.</div>
          )}
        </div>
      </div>

      {/* Modal for adding a new timesheet */}
      <AddTimesheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTimesheet}
        newTaskNumber={newTaskNumber}
        setNewTaskNumber={setNewTaskNumber}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        newTimeStarted={newTimeStarted}
        setNewTimeStarted={setNewTimeStarted}
        newTimeEnded={newTimeEnded}
        setNewTimeEnded={setNewTimeEnded}
        newWithWhom={newWithWhom}
        setNewWithWhom={setNewWithWhom}
        newDeliverables={newDeliverables}
        setNewDeliverables={setNewDeliverables}
      />

      {/* Modal for editing a timesheet */}
      <EditTimesheetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSaveEdit}
        taskNumber={newTaskNumber}
        setTaskNumber={setNewTaskNumber}
        description={newDescription}
        setDescription={setNewDescription}
        timeStarted={newTimeStarted}
        setTimeStarted={setNewTimeStarted}
        timeEnded={newTimeEnded}
        setTimeEnded={setNewTimeEnded}
        withWhom={newWithWhom}
        setWithWhom={setNewWithWhom}
        deliverables={newDeliverables}
        setDeliverables={setNewDeliverables}
      />
    </div>
  );
};

export default TimeSheet;
