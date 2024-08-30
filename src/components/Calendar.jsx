import React from 'react';
import { format, getDaysInMonth, getDay, startOfMonth } from 'date-fns';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const Calendar = ({ currentMonth }) => {
  const { theme } = useTheme(); // Get the current theme
  const daysInMonth = getDaysInMonth(currentMonth);
  const startDay = getDay(startOfMonth(currentMonth));
  const currentDate = new Date();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Define colors based on the current theme
  const calendarBgColor = theme === 'dark' ? '#1a202c' : '#ffffff'; // Dark gray for dark mode, white for light mode
  const dayBgColor = theme === 'dark' ? '#2d3748' : '#f7fafc'; // Slightly darker gray for dark mode, light gray for light mode
  const todayBgColor = theme === 'dark' ? '#fbd38d' : '#f6e05e'; // Light yellow for dark mode, darker yellow for light mode
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800'; // Light text for dark mode, dark text for light mode

  return (
    <div className={`rounded-lg p-4 shadow-md ${textColor}`} style={{ backgroundColor: calendarBgColor }}>
      <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>{format(currentMonth, 'MMMM yyyy')}</h3>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className={`text-center font-semibold ${textColor}`}>
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
                ? `bg-${todayBgColor} text-cyan-500` // Ensure text color is visible over the background
                : dayBgColor
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
