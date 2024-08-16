import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is imported
import AddIcon from '@mui/icons-material/Add';
import TimeSheetCard from '../components/TimeSheetCard';
import AddTimesheetModal from '../components/AddTimesheetModal';
import EditTimesheetModal from '../components/EditTimesheetModal';

// Function to format time into H:mm AM/PM format
const formatTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
};

// Fetch the posts from WordPress and update the state
const fetchTimesheets = async (setTimesheets) => {
  try {
    const response = await axios.get('https://cjo-acf.local/wp-json/wp/v2/timesheet', {
      headers: {
        'Authorization': 'Basic ' + btoa('admin:XwNx 2pBm Hlgw DO9n 1oiR cuNf'),
      },
    });
    const posts = response.data;
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      taskNumber: post.acf.task_number,
      description: post.acf.task_description,
      timeStarted: formatTime(post.acf.time_started),
      timeEnded: formatTime(post.acf.time_ended),
      withWhom: post.acf.with_whom,
      deliverables: post.acf.deliverables,
      date: post.acf.date_created,
    }));
    setTimesheets(formattedPosts);
  } catch (error) {
    console.error('Error fetching timesheets:', error);
  }
};

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
  const [timesheets, setTimesheets] = useState([]);
  const [newTaskNumber, setNewTaskNumber] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTimeStarted, setNewTimeStarted] = useState('');
  const [newTimeEnded, setNewTimeEnded] = useState('');
  const [newWithWhom, setNewWithWhom] = useState('');
  const [newDeliverables, setNewDeliverables] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingItem, setCurrentEditingItem] = useState(null);

  useEffect(() => {
    fetchTimesheets(setTimesheets);
  }, []);

  const filteredTimesheets = selectedDate
    ? timesheets.filter((item) => item.date === selectedDate)
    : timesheets;

  const handleAddTimesheet = () => {
    if (newTaskNumber && newDescription && newTimeStarted && newTimeEnded && newWithWhom && newDeliverables) {
      const postData = {
        title: newTaskNumber,
        content: newDescription,
        status: 'publish',
        acf: {
          date_created: new Date().toISOString().split('T')[0], // Use the current date or selected date
          task_number: newTaskNumber,
          task_description: newDescription,
          time_started: newTimeStarted,
          time_ended: newTimeEnded,
          with_whom: newWithWhom,
          deliverables: newDeliverables,
        }
      };

      // Replace 'username' and 'password' with your actual Basic Auth credentials
      const username = 'admin';
      const password = 'XwNx 2pBm Hlgw DO9n 1oiR cuNf';
      const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

      axios.post('https://cjo-acf.local/wp-json/wp/v2/timesheet', postData, {
        headers: {
          'Authorization': basicAuth,
          'Content-Type': 'application/json', // Set Content-Type to application/json
        },
      })
        .then((response) => {
          console.log('Timesheet added:', response.data);

          // Add to local state with formatted time
          const newTimesheet = {
            id: timesheets.length + 1, // Adjust as needed, ideally use UUID
            taskNumber: newTaskNumber,
            description: newDescription,
            timeStarted: formatTime(newTimeStarted),
            timeEnded: formatTime(newTimeEnded),
            withWhom: newWithWhom,
            deliverables: newDeliverables,
            date: selectedDate || new Date().toISOString().split('T')[0], // Default to today if no date selected
          };

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
        })
        .catch((error) => {
          console.error('Error adding timesheet:', error);
          alert('There was an error adding the timesheet.');
        });
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
            timeStarted: formatTime(newTimeStarted),
            timeEnded: formatTime(newTimeEnded),
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
            style={{backgroundColor: '#e3e1e1'}}
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
