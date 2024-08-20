import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import TimeSheetCard from '../components/TimeSheetCard';
import AddTimesheetModal from '../components/AddTimesheetModal';
import EditTimesheetModal from '../components/EditTimesheetModal';
import Home from './Home';
import TimeRendered from '../components/TimeRendered'; // Import the new component


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + 'timesheet';
const AUTH_USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const AUTH_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;
const AUTH_HEADER = 'Basic ' + btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`);


const formatTime = (time) => {
  if (!time) return 'Invalid time'; // Handle empty or null time values

  const [hours, minutes] = time.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    console.error(`Invalid time format: ${time}`);
    return 'Invalid time'; // Handle invalid time format
  }

  // Create a new Date object to set the time
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  // Format the time to g:i a (12-hour clock without leading zeroes and with lowercase am/pm)
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  
  // Get formatted time and convert to lowercase
  const formattedTime = formatter.format(date).toLowerCase();

  return formattedTime;
};


// Fetch the posts from WordPress and update the state
const fetchTimesheets = async (authorId, setTimesheets) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?author=${authorId}`, {
      headers: {
        'Authorization': AUTH_HEADER,
      },
    });

    // Log the response data for debugging
    console.log('API Response:', response.data);

    // Ensure that response.data is an array
    if (Array.isArray(response.data)) {
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
    } else {
      console.error('API Response is not an array:', response.data);
    }
  } catch (error) {
    console.error('Error fetching timesheets:', error);
  }
};

const TimesheetHeader = () => (
  <thead className="bg-gray-50">
    <tr className="text-gray-700 font-semibold text-center">
      <th className="px-2 py-2 text-gray-900">Task #</th>
      <th className="px-2 py-2 text-gray-900">Task Description</th>
      <th className="px-2 py-2 text-gray-900">Time Started</th>
      <th className="px-2 py-2 text-gray-900">Time Ended</th>
      <th className="px-2 py-2 text-gray-900">With Whom</th>
      <th className="px-2 py-2 text-gray-900">Deliverables</th>
      <th className="px-2 py-2 text-gray-900">Action</th>
    </tr>
  </thead>
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
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch the current user ID from WordPress
    axios.get(`${import.meta.env.VITE_API_BASE_URL}users/me`, {
      headers: {
        'Authorization': AUTH_HEADER,
      },
    })
    .then(response => {
      setUserId(response.data.id);
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
    });
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTimesheets(userId, setTimesheets);
    }
  }, [userId]);

  useEffect(() => {
    if (isModalOpen) {
      // Reset input fields when the modal opens
      setNewTaskNumber('');
      setNewDescription('');
      setNewTimeStarted('');
      setNewTimeEnded('');
      setNewWithWhom('');
      setNewDeliverables('');
    }
  }, [isModalOpen]);

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

      axios.post(API_BASE_URL, postData, {
        headers: {
          'Authorization': AUTH_HEADER,
          'Content-Type': 'application/json', // Set Content-Type to application/json
        },
      })
        .then((response) => {
          console.log('Timesheet added:', response.data);

          // Add to local state with formatted time
          const newTimesheet = {
            id: response.data.id, // Use the ID returned from the API response
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
      const updatedPostData = {
        title: newTaskNumber,
        content: newDescription,
        status: 'publish',
        acf: {
          date_created: currentEditingItem.date,
          task_number: newTaskNumber,
          task_description: newDescription,
          time_started: newTimeStarted,
          time_ended: newTimeEnded,
          with_whom: newWithWhom,
          deliverables: newDeliverables,
        }
      };

      axios.post(`${API_BASE_URL}/${currentEditingItem.id}`, updatedPostData, {
        headers: {
          'Authorization': AUTH_HEADER,
          'Content-Type': 'application/json', // Set Content-Type to application/json
        },
      })
        .then((response) => {
          console.log('Timesheet updated:', response.data);

          // Update local state
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

          // Close modal
          setIsEditModalOpen(false);
        })
        .catch((error) => {
          console.error('Error updating timesheet:', error);
          alert('There was an error updating the timesheet.');
        });
    } else {
      alert('Please fill all fields.');
    }
  };

  return (
    <Home>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          {/* Date filter */}
          <label htmlFor="date" className="block text-gray-700 font-medium mr-2">Filter by Date:</label>
          <div className="flex-grow">
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Add Timesheet Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300"
          >
            <AddIcon />
            Add Timesheet
          </button>
        </div>

        {/* Timesheet Table */}
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-gray-50 border border-gray-200">
            <TimesheetHeader />
            <tbody>
              {filteredTimesheets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                    No timesheets available for this date.
                  </td>
                </tr>
              ) : (
                filteredTimesheets.map((item) => (
                  <TimeSheetCard key={item.id} item={item} onEdit={handleEditTimesheet} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Time Rendered Component */}
        <TimeRendered timesheets={timesheets} />

        {/* Add Timesheet Modal */}
        {isModalOpen && (
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
        )}

        {/* Edit Timesheet Modal */}
        {isEditModalOpen && (
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
        )}
      </div>
    </Home>
  );
};

export default TimeSheet;
