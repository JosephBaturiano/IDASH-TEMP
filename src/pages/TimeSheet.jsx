import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import TimeSheetCard from '../components/TimeSheetCard';
import AddTimesheetModal from '../components/AddTimesheetModal';
import EditTimesheetModal from '../components/EditTimesheetModal';
import Home from './Home';
import { useTimesheets, formatTime } from '../context/TimesheetContext'; // Adjust the import path
import { PictureAsPdf } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import WeeklyContent from '../components/WeeklyContent'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + 'timesheet';
const AUTH_USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const AUTH_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;
const AUTH_HEADER = 'Basic ' + btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`);


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
  const { timesheets, setTimesheets } = useTimesheets();
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
    if (isModalOpen) {
      setNewTaskNumber('');
      setNewDescription('');
      setNewTimeStarted('');
      setNewTimeEnded('');
      setNewWithWhom('');
      setNewDeliverables('');
    }
  }, [isModalOpen]);

  const normalizeDate = (dateString) => {
    // Normalize date to midnight in local time zone
    const date = new Date(dateString);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split('T')[0];
  };

  const filteredTimesheets = selectedDate
    ? timesheets.filter((item) => {
        // Normalize both selectedDate and item.date to YYYY-MM-DD format
        const itemDate = normalizeDate(item.date);
        const formattedSelectedDate = normalizeDate(selectedDate);
        return itemDate === formattedSelectedDate;
      })
    : timesheets;

  const handleAddTimesheet = () => {
    if (newTaskNumber && newDescription && newTimeStarted && newTimeEnded && newWithWhom && newDeliverables) {
      const postData = {
        title: newDescription,
        content: `Task Number: ${newTaskNumber}`,
        status: 'publish',
        acf: {
          date_created: new Date().toISOString().split('T')[0],
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
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          console.log('Timesheet added:', response.data);

          const newTimesheet = {
            id: response.data.id,
            taskNumber: newTaskNumber,
            description: newDescription,
            timeStarted: formatTime(newTimeStarted),
            timeEnded: formatTime(newTimeEnded),
            withWhom: newWithWhom,
            deliverables: newDeliverables,
            date: selectedDate || new Date().toISOString().split('T')[0],
          };

          setTimesheets([...timesheets, newTimesheet]);
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
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          console.log('Timesheet updated:', response.data);

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

  const handleDeleteTimesheet = (itemId) => {
    axios.delete(`${API_BASE_URL}/${itemId}`, {
      headers: {
        'Authorization': AUTH_HEADER,
      },
    })
      .then(() => {
        console.log('Timesheet deleted:', itemId);
        setTimesheets(timesheets.filter(item => item.id !== itemId));
        setIsEditModalOpen(false);
      })
      .catch((error) => {
        console.error('Error deleting timesheet:', error);
        alert('There was an error deleting the timesheet.');
      });
  };

  return (
    <Home>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
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

          <div className="m-4">
            <Link
              to="/weekly"
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-300"
            >
              <PictureAsPdf />
              Generate PDF
            </Link>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300"
          >
            <AddIcon />
            Add Timesheet
          </button>
        </div>

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
            onDelete={() => handleDeleteTimesheet(currentEditingItem.id)}
          />
        )}
      </div>
    </Home>
  );
};

export default TimeSheet;
