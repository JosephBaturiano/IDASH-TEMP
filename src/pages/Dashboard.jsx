import React from 'react';
import ZoomCard from '../components/ZoomCard';
import SideBar from '../components/SideBar';
import ProjectCard from '../components/ProjectCard';
import Calendar from '../components/Calendar'; // Updated to match the JSX reference
import NotificationCard from '../components/NotificationCard';
import TopBar from '../components/TopBar';
import ReactLogo from '../assets/ReactLogo.png';
import TensorFlow from '../assets/TensorFlow.png';
import Profile from '../assets/Profile.jpg';

const Dashboard = () => {
  const notifications = [
    { message: 'RSY added a new task deliverable.', date: '12 August 2024 - 9:30 AM', action: 'Check' },
    { message: 'APM delegated a task to you.', date: '12 August 2024 - 9:45 AM', action: 'Check' },
    // Add more notifications as needed
  ];

  return (
    <div className="flex flex-col h-screen w-[100%]">
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-[20%]">
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="flex flex-col w-3/4 p-4 bg-[#F0F8FF]">
          {/* Top Bar */}
          <TopBar userName="JBM" userImage={Profile} />

          <div className="flex flex-grow mt-4 gap-10">
            {/* Left Column (Zoom and Project Cards) */}
            <div className="w-2/3 space-y-4">
              <ZoomCard />
              <div className="text-[32px] font-bold">
                <h1>Ongoing Projects</h1>
              </div>
              <ProjectCard
                TeamLogo={ReactLogo}
                title="Intern Dashboard"
                date="August 13, 2024"
                assignedTo="Team React, React Native, UI/UX"
                progress={10}
              />
              <ProjectCard
                TeamLogo={TensorFlow}
                title="Refactor ChatGPT"
                date="August 13, 2024"
                assignedTo="Team TensorFlow"
                progress={10}
              />
            </div>

            {/* Right Column (Calendar and Notification Cards) */}
            <div className="w-1/3 space-y-4">
              <Calendar currentMonth={new Date()} />
              <NotificationCard notifications={notifications} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
