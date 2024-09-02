import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const TimesheetContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + 'timesheet';
const AUTH_USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const AUTH_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;
const AUTH_HEADER = 'Basic ' + btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`);

const formatTime = (time) => {
  if (!time) return 'Invalid time';

  // Match input time format (HH:MM AM/PM)
  const regex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;
  const match = time.match(regex);

  if (!match) {
    console.error(`Invalid time format: ${time}`);
    return 'Invalid time';
  }

  let [_, hours, minutes, period] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  // Convert 12-hour time to 24-hour time if necessary
  if (period) {
    if (period.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
  }

  // Ensure hours and minutes are within valid ranges
  if (isNaN(hours) || hours < 0 || hours >= 24 || isNaN(minutes) || minutes < 0 || minutes >= 60) {
    console.error(`Invalid time values: ${hours}:${minutes}`);
    return 'Invalid time';
  }

  // Format time as "HH:mm AM/PM"
  const formattedTime = new Date();
  formattedTime.setHours(hours);
  formattedTime.setMinutes(minutes);
  formattedTime.setSeconds(0);

  const options = { hour: 'numeric', minute: '2-digit', hour12: true };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  return formatter.format(formattedTime);
};

export function TimesheetProvider({ children }) {
  const [timesheets, setTimesheets] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}users/me`, {
      headers: { 'Authorization': AUTH_HEADER }
    })
    .then(response => {
      const userInfo = {
        id: response.data.id,
        full_name: response.data.acf.full_name,
        OJTadviser: response.data.acf.ojt_adviser,
        subjectCode: response.data.acf.subject_code,
      };
      setUser(userInfo);
    })
    .catch(error => console.error('Error fetching user info:', error));
  }, []);

  useEffect(() => {
    if (user && user.id) {
      const fetchTimesheets = async () => {
        let allTimesheets = [];
        let page = 1;
        let totalPages = 1; // Initialize to ensure loop runs at least once

        while (page <= totalPages) {
          try {
            const response = await axios.get(`${API_BASE_URL}?author=${user.id}&per_page=100&page=${page}`, {
              headers: { 'Authorization': AUTH_HEADER }
            });

            if (Array.isArray(response.data)) {
              allTimesheets = [...allTimesheets, ...response.data];
              totalPages = parseInt(response.headers['x-wp-totalpages'], 100) || 1; // Get total pages from header
              page++;
            } else {
              console.error('API Response is not an array:', response.data);
              break;
            }
          } catch (error) {
            console.error('Error fetching timesheets:', error);
            break;
          }
        }

        const formattedPosts = allTimesheets.map(post => ({
          id: post.id,
          taskNumber: post.acf.task_number,
          description: post.acf.task_description,
          timeStarted: formatTime(post.acf.time_started),
          timeEnded: formatTime(post.acf.time_ended),
          withWhom: post.acf.with_whom,
          deliverables: post.acf.deliverables,
          date: post.date,
        }));

        console.log('Formatted timesheets:', formattedPosts);
        setTimesheets(formattedPosts);
      };

      fetchTimesheets();
    }
  }, [user]);

  return (
    <TimesheetContext.Provider value={{ timesheets, setTimesheets, user }}>
      {children}
    </TimesheetContext.Provider>
  );
}

const useTimesheets = () => {
  const context = useContext(TimesheetContext);
  if (!context) {
    throw new Error('useTimesheets must be used within a TimesheetProvider');
  }
  return context;
}

export {useTimesheets, formatTime};