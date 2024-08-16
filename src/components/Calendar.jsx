// CalendarCard.jsx
import React from 'react';
import { format, getDaysInMonth, getDay, startOfMonth } from 'date-fns';

const Calendar = ({ currentMonth }) => {
  const daysInMonth = getDaysInMonth(currentMonth);
  const startDay = getDay(startOfMonth(currentMonth));
  const currentDate = new Date();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-4">{format(currentMonth, 'MMMM yyyy')}</h3>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={i} className="text-center"></div>
        ))}
        {days.map((day) => (
          <div
            key={day}
            className={`text-center p-2 rounded-full ${
              day === currentDate.getDate() &&
              format(currentMonth, 'MMMM yyyy') === format(currentDate, 'MMMM yyyy')
                ? 'bg-yellow-300'
                : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;