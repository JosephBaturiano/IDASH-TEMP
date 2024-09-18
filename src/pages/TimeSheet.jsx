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
import { useTheme } from '../context/ThemeContext';
import WeekSelectionModal from '../components/WeekSelectionModal';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + 'timesheet';
const AUTH_USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const AUTH_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;
const AUTH_HEADER = 'Basic ' + btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`);

const TimesheetHeader = ({ onSelectAll, isAllSelected }) => {
  const { theme } = useTheme(); // Get the current theme

  return (
    <thead className={`border-b ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
      <tr className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        <th className={`px-2 py-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>Task #</th>
        <th className={`px-2 py-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>Task Description</th>
        <th className={`px-2 py-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>Time Started</th>
        <th className={`px-2 py-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>Time Ended</th>
        <th className={`px-2 py-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>Duration</th>
        <th className={`px-2 py-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>With Whom</th>
        <th className={`px-2 py-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>Deliverables</th>
        <th className={`px-2 py-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'} flex items-center justify-center`}>
          Action
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onSelectAll}
            className={`ml-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}
          />
        </th>
      </tr>
    </thead>
  );
};

const TimeSheet = () => {
  const [isWeekSelected, setIsWeekSelected] = useState(false);  // To toggle between buttons
  const [isProceedToPDF, setIsProceedToPDF] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(null);
  const {
    timesheets,
    setTimesheets,
    user,
    interns,
    selectedIntern,
    setSelectedIntern
  } = useTimesheets();
  const [newTaskNumber, setNewTaskNumber] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTimeStarted, setNewTimeStarted] = useState('');
  const [newTimeEnded, setNewTimeEnded] = useState('');
  const [newWithWhom, setNewWithWhom] = useState('');
  const [newDeliverables, setNewDeliverables] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingItem, setCurrentEditingItem] = useState(null);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isGroupLeader, setIsGroupLeader] = useState(false);
  const [newSelectedDate, setNewSelectedDate] = useState('');
  const [newComment, setNewComment] = useState(''); // Added this state for comment
  const [newComment1, setNewComment1] = useState(''); // Comment 1
  const [newComment2, setNewComment2] = useState(''); // Comment 2
  const [isWeekSelectionModalOpen, setIsWeekSelectionModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(''); // State for selected team
  const [isSaving, setIsSaving] = useState(false); // Add a loading state
  const { theme } = useTheme();

  useEffect(() => {
    if (isModalOpen) {
      setNewTaskNumber('');
      setNewDescription('');
      setNewTimeStarted('');
      setNewTimeEnded('');
      setNewWithWhom('');
      setNewDeliverables('');
      setNewSelectedDate('');
      setNewComment(''); // Reset comment  
      setNewComment1(''); // Reset Comment 1
      setNewComment2(''); // Reset Comment 2
    }
  }, [isModalOpen]);

  useEffect(() => {
    const fetchGroupLeaderStatus = async () => {
      const status = await checkIfGroupLeader();
      setIsGroupLeader(status);
    };

    fetchGroupLeaderStatus();
  }, []);

  const normalizeDate = (dateString) => {
    // Check if the input is null or empty
    if (dateString === null || dateString === '') {
        return dateString;
    }

    // Check if the date is in the format 'dd/mm/yyyy'
    if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // Convert to 'yyyy-mm-dd'
    }

    // If already in 'yyyy-mm-dd' format, return as is
    return dateString;
};

  const filteredTimesheets = selectedDate
    ? timesheets.filter((item) => {
      // Ensure item.date and selectedDate are valid before normalizing
      if (!item.date || !selectedDate) {
        return false; // Skip if either date is invalid
      }

      // Normalize both selectedDate and item.date to YYYY-MM-DD format
      const itemDate = normalizeDate(item.date);
      const formattedSelectedDate = normalizeDate(selectedDate);

      return itemDate === formattedSelectedDate;
    })
    : timesheets;

  const handleAddTimesheet = () => {
    if (isSaving) {
      return; // If already saving, do nothing
    }

    if (!newTimeStarted) {
      alert("Time Started is required. Please fill in the Time Started field.");
      return; // Stop the function if Time Started is missing
    }
    if (!newTimeEnded) {
      alert("Time Ended is required. Please fill in the Time Ended field.");
      return; // Stop the function if Time Ended is missing
    }
    if (!newSelectedDate) {
      alert("Date Created is required. Please select a Date.");
      return; // Stop the function if Date Created is missing
    }

    // Start the saving process, disable the button
    setIsSaving(true);

    const postData = {
      title: newDescription || 'No Description',
      content: `Task Number: ${newTaskNumber || 'No Task Number'}`,
      status: 'publish',
      acf: {
        date_created: newSelectedDate,
        task_number: newTaskNumber || 'N/A',
        task_description: newDescription || 'N/A',
        time_started: newTimeStarted || 'N/A',
        time_ended: newTimeEnded || 'N/A',
        with_whom: newWithWhom || 'N/A',
        deliverables: newDeliverables || 'N/A',
        comment: newComment || 'No Comment',  // Include the comment field here
        comment_one: newComment1 || 'No Comment 1', // Comment 1 field
        comment_two: newComment2 || 'No Comment 2', // Comment 2 field
      }
    };

    axios.post(API_BASE_URL, postData, {
      headers: {
        'Authorization': AUTH_HEADER,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        const newTimesheet = {
          id: response.data.id,
          taskNumber: newTaskNumber || 'N/A',
          description: newDescription || 'N/A',
          timeStarted: newTimeStarted ? formatTime(newTimeStarted) : 'N/A',
          timeEnded: newTimeEnded ? formatTime(newTimeEnded) : 'N/A',
          withWhom: newWithWhom || 'N/A',
          deliverables: newDeliverables || 'N/A',
          date: newSelectedDate || new Date().toISOString().split('T')[0],
          comment: newComment || 'No Comment',  // Store the comment
          commentOne: newComment1 || 'No Comment 1', // Comment 1
          commentTwo: newComment2 || 'No Comment 2', // Comment 2
        };

        setTimesheets([...timesheets, newTimesheet]);
        setIsModalOpen(false);

        // Success message
        window.alert('Timesheet successfully added!');
      })
      .catch((error) => {
        console.error('Error adding timesheet:', error);
        alert('There was an error adding the timesheet.');
      })
      .finally(() => {
        setIsSaving(false); // Ensure the button is enabled again
      });
  };

  const handleEditTimesheet = (item) => {
    setCurrentEditingItem(item);
    setNewTaskNumber(item.taskNumber);
    setNewDescription(item.description);
    setNewTimeStarted(item.timeStarted);
    setNewTimeEnded(item.timeEnded);
    setNewWithWhom(item.withWhom);
    setNewDeliverables(item.deliverables);
    setNewSelectedDate(item.date)
    setNewComment(item.comment);
    setNewComment1(item.commentOne); // Ensure comment_one is set correctly
    setNewComment2(item.commentTwo); // Ensure comment_two is set correctly
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!newTimeStarted) {
      alert("Time Started is required. Please fill in the Time Started field.");
      return; // Stop the function if Time Started is missing
    }
    if (!newTimeEnded) {
      alert("Time Ended is required. Please fill in the Time Ended field.");
      return; // Stop the function if Time Ended is missing
    }
    if (!newSelectedDate) {
      alert("Date Created is required. Please select a Date.");
      return; // Stop the function if Date Created is missing
    }
    if (newTaskNumber && newDescription && newTimeStarted && newTimeEnded && newWithWhom && newDeliverables && newSelectedDate) {
      const updatedPostData = {
        title: newTaskNumber,
        content: newDescription,
        status: 'publish',
        acf: {
          date_created: newSelectedDate,
          task_number: newTaskNumber,
          task_description: newDescription,
          time_started: newTimeStarted,
          time_ended: newTimeEnded,
          with_whom: newWithWhom,
          deliverables: newDeliverables,
          comment: newComment, // Include comment in the update data
          comment_one: newComment1, // Comment 1 field
          comment_two: newComment2, // Comment 2 field
        }
      };
  
      // Optimistically update the local state before making the API call
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
              date: newSelectedDate,
              comment: newComment, // Update the comment in the timesheet
              commentOne: newComment1, // Update Comment 1
              commentTwo: newComment2, // Update Comment 2
            }
          : item
      );
  
      setTimesheets(updatedTimesheets); // Update state immediately
  
      // Send the API request to save changes
      axios.post(`${API_BASE_URL}/${currentEditingItem.id}`, updatedPostData, {
        headers: {
          'Authorization': AUTH_HEADER,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          console.log('Timesheet updated:', response.data);
          setIsEditModalOpen(false); // Close modal on success
        })
        .catch((error) => {
          console.error('Error updating timesheet:', error);
          alert('There was an error updating the timesheet.');
  
          // Revert the state back if the API call fails
          const revertedTimesheets = timesheets.map((item) =>
            item.id === currentEditingItem.id
              ? { ...item, ...currentEditingItem } // Revert to the original item
              : item
          );
          setTimesheets(revertedTimesheets);
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

  const getWeekRange = (weekNumber) => {
    const startDate = new Date('2024-07-22');
    startDate.setDate(startDate.getDate() + 7 * weekNumber); // Move to the start of the desired week
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 5);

    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    return { start, end };
  };

  const navigate = useNavigate();

  const handleWeekSelect = (weekNumber) => {
    setSelectedWeek(weekNumber);
    setIsProceedToPDF(true);  // Change button text after week selection
    setIsWeekSelected(true);  // Indicate week has been selected
    setIsWeekSelectionModalOpen(false);  // Close modal

    // Implement your week filtering logic here (you already have this part)
    const { start, end } = getWeekRange(weekNumber);
    setTimesheets(prevTimesheets =>
      prevTimesheets.map(item => ({
        ...item,
        includeInReport: item.date >= start && item.date <= end,
      }))
    );
  };



  const handleSelectAll = () => {
    setIsAllSelected(!isAllSelected);
    setTimesheets(prevTimesheets =>
      prevTimesheets.map(item => ({
        ...item,
        includeInReport: !isAllSelected,
      }))
    );
  };

  const handleToggleInclude = (id) => {
    setTimesheets(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, includeInReport: !item.includeInReport }
          : item
      )
    );
  };

  const checkIfGroupLeader = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}users/me`, {
        headers: {
          'Authorization': AUTH_HEADER,
        },
      });

      // Extract the group_leader field from ACF
      return response.data.acf.group_leader || false;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return false; // Default to false if there's an error
    }
  };

  const groupAndSortTimesheetsByDate = (timesheets) => {
    const grouped = timesheets.reduce((grouped, item) => {
      const itemDate = normalizeDate(item.date);
  
      if (!grouped[itemDate]) {
        grouped[itemDate] = [];
      }
  
      grouped[itemDate].push(item);
  
      return grouped;
    }, {});
  
    // Sort timesheets by `timeStarted` in hh:mm AM/PM format
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        const timeA = convertTo24HourFormat(a.timeStarted);
        const timeB = convertTo24HourFormat(b.timeStarted);
  
        return timeA - timeB;
      });
    });
  
    return grouped;
  };
  
  // Helper function to convert `hh:mm AM/PM` to 24-hour time in minutes from midnight
  const convertTo24HourFormat = (time) => {
    const [timePart, modifier] = time.split(' '); // Split into time and AM/PM part
    let [hours, minutes] = timePart.split(':').map(Number);
  
    if (modifier === 'PM' && hours !== 12) {
      hours += 12; // Convert PM hours (except 12 PM)
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0; // Convert 12 AM to midnight
    }
  
    return hours * 60 + minutes; // Convert to total minutes from midnight
  };
  
  const groupedTimesheets = groupAndSortTimesheetsByDate(filteredTimesheets);

  return (
    <Home>
      <div className={`container mx-auto px-6 py-6 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
        <div className="flex justify-between items-center mx-5 mb-5">
          <label
            htmlFor="date"
            className={`block font-medium mr-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Filter by Date:
          </label>
          <div className="flex-grow">
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`border rounded-lg px-3 py-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className={`mr-2 border rounded-lg px-4 py-2 h-[40px] flex items-center ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              disabled={!isGroupLeader} // Disable the dropdown if user?.groupLeader is false
            >
              <option value="">All</option>
              {[
                { id: 'RJ', name: 'RJ' },
                { id: 'RN', name: 'RN' },
                { id: 'TF', name: 'TF' }
              ].map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>

            <div>
              <select
                value={selectedIntern || user?.id}
                onChange={(e) => setSelectedIntern(e.target.value)}
                className={`mr-2 border rounded-lg px-4 py-2 h-[40px] flex items-center ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value={user?.id}>Select Intern</option>
                {interns
                  .filter((intern) => {
                    if (!selectedTeam) return true; // Show all if no team is selected
                    return intern.internTeam.includes(selectedTeam); // Check if selectedTeam exists in internTeam array
                  })
                  .map((intern) => (
                    <option key={intern.id} value={intern.id}>
                      {intern.name}
                    </option>
                  ))}
              </select>
            </div>

            <button
              onClick={() => {
                if (isProceedToPDF) {
                  navigate('/weekly'); // Redirect to the weekly page
                } else {
                  setIsWeekSelectionModalOpen(true);
                }
              }}
              className={`${isProceedToPDF ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors duration-300`}
            >
              {isProceedToPDF ? 'Proceed to PDF' : 'Generate PDF'}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300"
            >
              <AddIcon />
              Add Timesheet
            </button>
          </div>
        </div>

        <div className="mt-8 mb-8 overflow-auto h-[calc(76vh-100px)]">
          <table className="min-w-full bg-gray-50 border border-gray-200">
            <TimesheetHeader
              onSelectAll={handleSelectAll}
              isAllSelected={isAllSelected}
              onWeekSelect={handleWeekSelect}
              selectedWeek={selectedWeek}
            />

            <tbody>
              {Object.keys(groupedTimesheets).length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-2 text-center text-gray-500">
                    No timesheets available for this date.
                  </td>
                </tr>
              ) : (
                Object.keys(groupedTimesheets).map((date) => (
                  <React.Fragment key={date}>
                    {groupedTimesheets[date].map((item) => (
                      <TimeSheetCard key={item.id} item={item} onEdit={handleEditTimesheet} />
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isWeekSelectionModalOpen && (
          <WeekSelectionModal
            isOpen={isWeekSelectionModalOpen}
            onClose={() => setIsWeekSelectionModalOpen(false)}
            onSelect={handleWeekSelect}
          />
        )}

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
            selectedDate={newSelectedDate}
            setSelectedDate={setNewSelectedDate}
            newDeliverables={newDeliverables}
            setNewDeliverables={setNewDeliverables}
            newComment={newComment} // Passed newComment
            setNewComment={setNewComment} // Passed setNewComment
            newComment1={newComment1} // Pass the new Comment 1 state
            setNewComment1={setNewComment1} // Pass the setter for Comment 1
            newComment2={newComment2} // Pass the new Comment 2 state
            setNewComment2={setNewComment2} // Pass the setter for Comment 2
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
            selectedDate={newSelectedDate}
            setSelectedDate={setNewSelectedDate}
            setDeliverables={setNewDeliverables}
            comments={newComment} // Pass the comment state
            setComments={setNewComment} // Pass the comment setter
            comment1={newComment1} // Pass Comment 1 state
            setComment1={setNewComment1} // Pass the setter for Comment 1
            comment2={newComment2} // Pass Comment 2 state
            setComment2={setNewComment2} // Pass the setter for Comment 2
            onDelete={() => handleDeleteTimesheet(currentEditingItem.id)}
          />
        )}
      </div>
    </Home>
  );

};

export default TimeSheet;
