import { Announcement, Dashboard, Folder, GridOn, PeopleAlt, Task } from '@mui/icons-material';
import React from 'react';
import { NavLink } from 'react-router-dom';
import iDashLogo from '../assets/IDashLogo.png';


const SideBar = () => {
  return (
    <div className="flex flex-col h-full bg-[#DBEDFF] p-4">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img src={iDashLogo} alt="Logo" className="w-40 h-50" />
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col text-[17px] font-semibold space-y-7">
        <NavItem icon={<Dashboard />} label="Dashboard" path="/" />
        <NavItem icon={<Announcement />} label="Announcement" path="/announcement" />
        <NavItem icon={<GridOn/>} label="Timesheet" path="/timesheet"/>
        <NavItem icon={<Task />} label="Task Deliverables" path="/taskdeliverables" />
        <NavItem icon={<Folder />} label="Files" path="/files" />
        <NavItem icon={<PeopleAlt />} label="Team Task" path="/teamtask" />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, path }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `flex items-center p-2 rounded hover:bg-[#D9D0D0] cursor-pointer ${isActive ? 'bg-[#D9D0D0]' : ''}`
    }
  >
    <span className="text-xl mr-2">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default SideBar;
