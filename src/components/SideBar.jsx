
import { Announcement, Dashboard, Folder, PeopleAlt, Task } from '@mui/icons-material';
import React from 'react';
import iDashLogo from '../assets/IDashLogo.png'; 


const SideBar = () => {
  return (
    <div className="flex flex-col h-full bg-[#DBEDFF] p-4">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img src={iDashLogo} alt="Logo" className="w-40 h-50 " />
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col text-[20px] font-semibold space-y-7">
        <NavItem icon={<Dashboard/>} label="Dashboard" />
        <NavItem icon={<Announcement/>} label="Announcement" />
        <NavItem icon={<Task/>} label="Task Deliverables" />
        <NavItem icon={<Folder/>} label="Files" />
        <NavItem icon={<PeopleAlt/>} label="Team Task" />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label }) => (
  <div className="flex items-center p-2 rounded hover:bg-[#D9D0D0] cursor-pointer">
    <span className="text-xl mr-2">{icon}</span>
    <span>{label}</span>
  </div>
);

export default SideBar;