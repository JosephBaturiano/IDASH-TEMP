import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import { Announcement, Dashboard, Folder, GridOn, PeopleAlt, Task } from '@mui/icons-material';
import iDashLogo from '../assets/IDashLogo.png';

const SideBar = () => {
  const { theme } = useTheme(); // Use theme from context

  const sidebarBgColor = theme === 'light' ? '#DBEDFF' : '#1F2937'; // Light or dark background
  const navItemBgColor = theme === 'light' ? '#D9D0D0' : '#2D3748'; // Light or dark background for active item
  const navItemTextColor = theme === 'light' ? '#000000' : '#FFFFFF'; // Light or dark text color

  return (
    <div className={`flex flex-col h-full p-4`} style={{ backgroundColor: sidebarBgColor }}>
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img src={iDashLogo} alt="Logo" className="w-40 h-50" />
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col text-[17px] font-semibold space-y-7">
        <NavItem icon={<Dashboard />} label="Dashboard" path="/" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} />
        <NavItem icon={<Announcement />} label="Announcement" path="/announcement" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} />
        <NavItem icon={<GridOn />} label="Timesheet" path="/timesheet" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} />
        <NavItem icon={<Task />} label="Task Deliverables" path="/taskdeliverables" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} />
        <NavItem icon={<Folder />} label="Files" path="/files" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} />
        <NavItem icon={<PeopleAlt />} label="Team Task" path="/teamtask" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, path, navItemBgColor, navItemTextColor }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `flex items-center p-2 rounded hover:bg-[#D9D0D0] cursor-pointer ${isActive ? `bg-${navItemBgColor}` : ''}`
    }
    style={{ color: navItemTextColor }}
  >
    <span className="text-xl mr-2">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default SideBar;
