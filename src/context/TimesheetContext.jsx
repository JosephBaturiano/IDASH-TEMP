import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const TimesheetContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + 'timesheet';
const AUTH_USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const AUTH_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;
const AUTH_HEADER = 'Basic ' + btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`);

const formatTime = (time) => {
  if (!time) return 'Invalid time';

  const [hours, minutes] = time.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) {
    console.error(`Invalid time format: ${time}`);
    return 'Invalid time';
  }

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  return formatter.format(date).toLowerCase();
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
        name: response.data.acf.name,
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
          date: post.acf.date_created,
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