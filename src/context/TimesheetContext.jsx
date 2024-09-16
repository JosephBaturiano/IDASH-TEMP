import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const TimesheetContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + 'timesheet';
const AUTH_USERNAME = import.meta.env.VITE_AUTH_USERNAME;
const AUTH_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;
const AUTH_HEADER = 'Basic ' + btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`);

const formatTime = (time) => {
  if (!time) return 'Invalid time';

  const regex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;
  const match = time.match(regex);

  if (!match) {
    console.error(`Invalid time format: ${time}`);
    return 'Invalid time';
  }

  let [_, hours, minutes, period] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (period) {
    if (period.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
  }

  if (isNaN(hours) || hours < 0 || hours >= 24 || isNaN(minutes) || minutes < 0 || minutes >= 60) {
    console.error(`Invalid time values: ${hours}:${minutes}`);
    return 'Invalid time';
  }

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
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}users/me`, {
          headers: { 'Authorization': AUTH_HEADER }
        });

        const userInfo = {
          id: response.data.id,
          full_name: response.data.acf.full_name,
          OJTadviser: response.data.acf.ojt_adviser,
          subjectCode: response.data.acf.subject_code,
          internSignature: response.data.acf.intern_signature,
        };

        if (userInfo.internSignature) {
          const signatureResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}media/${userInfo.internSignature}`, {
            headers: { 'Authorization': AUTH_HEADER }
          });
          userInfo.internSignature = signatureResponse.data.source_url;
        }

        setUser(userInfo);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUser();
  }, []);

  // Fetch interns
  useEffect(() => {
    const fetchInterns = async () => {
      if (!user) return;

      let allInterns = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}users?per_page=100&page=${page}`, {
            headers: { 'Authorization': AUTH_HEADER }
          });

          if (Array.isArray(response.data)) {
            allInterns = [
              ...allInterns,
              ...response.data.map(intern => ({
                id: intern.id,
                name: intern.name,
                internTeam: intern.acf.team || [], // Ensure it's an array even if empty
              })),
            ];

            totalPages = parseInt(response.headers['x-wp-totalpages'], 10) || 1;
            page++;
          } else {
            console.error('API Response is not an array:', response.data);
            break;
          }
        } catch (error) {
          console.error('Error fetching interns:', error);
          break;
        }
      }

      setInterns(allInterns);

      const currentUserId = user.id;
      if (allInterns.some(intern => intern.id === currentUserId)) {
        setSelectedIntern(currentUserId);
      } else if (allInterns.length > 0) {
        setSelectedIntern(allInterns[0].id);
      } else {
        setSelectedIntern(currentUserId);
      }
    };

    fetchInterns();
  }, [user]);

  // Fetch timesheets for the selected intern or user
  useEffect(() => {
    const fetchTimesheets = async (authorId) => {
      let allTimesheets = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        try {
          const response = await axios.get(`${API_BASE_URL}?author=${authorId}&per_page=100&page=${page}`, {
            headers: { 'Authorization': AUTH_HEADER }
          });

          if (Array.isArray(response.data)) {
            allTimesheets = [...allTimesheets, ...response.data];
            totalPages = parseInt(response.headers['x-wp-totalpages'], 10) || 1;
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

      // Include the comment in the formatted posts
      const formattedPosts = allTimesheets.map(post => ({
        id: post.id,
        taskNumber: post.acf.task_number,
        description: post.acf.task_description,
        timeStarted: formatTime(post.acf.time_started),
        timeEnded: formatTime(post.acf.time_ended),
        withWhom: post.acf.with_whom,
        deliverables: post.acf.deliverables,
        date: post.acf.date_created,
        comment: post.acf.comment || 'No Comment', // Include comment field
      }));

      setTimesheets(formattedPosts.reverse());
    };

    if (selectedIntern) {
      fetchTimesheets(selectedIntern);
    } else if (user) {
      fetchTimesheets(user.id);
    }
  }, [selectedIntern, user]);

  return (
    <TimesheetContext.Provider value={{ timesheets, setTimesheets, user, interns, selectedIntern, setSelectedIntern, selectedDate, setSelectedDate }}>
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

export { useTimesheets, formatTime };
