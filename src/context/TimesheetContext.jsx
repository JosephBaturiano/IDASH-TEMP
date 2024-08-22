import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const TimesheetContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + 'timesheet';
const AUTH_USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const AUTH_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;
const AUTH_HEADER = 'Basic ' + btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`);

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
      // Fetch timesheets based on user ID
      axios.get(`${API_BASE_URL}?author=${user.id}`, {
        headers: { 'Authorization': AUTH_HEADER }
      })
      .then(response => {
        if (Array.isArray(response.data)) {
          const formattedPosts = response.data.map(post => ({
            id: post.id,
            taskNumber: post.acf.task_number,
            description: post.acf.task_description,
            timeStarted: post.acf.time_started,
            timeEnded: post.acf.time_ended,
            withWhom: post.acf.with_whom,
            deliverables: post.acf.deliverables,
            date: post.acf.date_created,
          }));
          setTimesheets(formattedPosts);
        } else {
          console.error('API Response is not an array:', response.data);
        }
      })
      .catch(error => console.error('Error fetching timesheets:', error));
    }
  }, [user]);

  return (
    <TimesheetContext.Provider value={{ timesheets, setTimesheets, user }}>
      {children}
    </TimesheetContext.Provider>
  );
}

export function useTimesheets() {
  const context = useContext(TimesheetContext);
  if (context === undefined) {
    throw new Error('useTimesheets must be used within a TimesheetProvider');
  }
  return context;
}
