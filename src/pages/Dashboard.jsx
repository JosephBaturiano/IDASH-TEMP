import React from 'react';
import Home from './Home'; 
import ZoomCard from '../components/ZoomCard';
import ProjectCard from '../components/ProjectCard';
import Calendar from '../components/Calendar';
import NotificationCard from '../components/NotificationCard';


const Dashboard = () => {
  const notifications = [
    { message: 'RSY added a new task deliverable.', date: '12 August 2024 - 9:30 AM', action: 'Check' },
    { message: 'APM delegated a task to you.', date: '12 August 2024 - 9:45 AM', action: 'Check' },
  ];

  return (
    <Home>
      <div className="flex flex-grow mt-4 gap-10">
        {/* Left Column (Zoom and Project Cards) */}
        <div className="w-2/3 space-y-4">
          <ZoomCard />
          <div className="text-[20px] font-bold">
            <h1>Ongoing Projects</h1>
          </div>
          <ProjectCard/>
        </div>

        {/* Right Column (Calendar and Notification Cards) */}
        <div className="w-1/3 space-y-4">
          <Calendar currentMonth={new Date()} />
          <NotificationCard notifications={notifications} />
        </div>
      </div>
    </Home>
  );
};
export default Dashboard;
