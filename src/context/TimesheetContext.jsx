// TimesheetContext.js to display Time Rendered to TopBar
import React, { createContext, useState, useContext } from 'react';

const TimesheetContext = createContext();

export function TimesheetProvider({ children }) {
  const [timesheets, setTimesheets] = useState([]);

  return (
    <TimesheetContext.Provider value={{ timesheets, setTimesheets }}>
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
