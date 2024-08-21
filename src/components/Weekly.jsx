import React from 'react';
import { useTimesheets } from '../context/TimesheetContext';
import WeeklyContent from '../components/WeeklyContent';
import WeeklyHeader from '../components/WeeklyHeader';
import WeeklyFooter from '../components/WeeklyFooter';

function Weekly() {
  const { timesheets } = useTimesheets();

  return (
    <div className="mx-auto bg-white" style={{ width: '8.5in', height: '13in', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)' }}>
      <div className="flex flex-col h-full">
        <WeeklyHeader />
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          {timesheets.map((timesheet) => (
            <WeeklyContent 
              key={timesheet.id} 
              description={timesheet.description} 
              date={timesheet.date} 
            />
          ))}
        </div>
        <WeeklyFooter />
      </div>
    </div>
  );
}

export default Weekly;
