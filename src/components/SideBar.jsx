import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Announcement, Dashboard, Folder, GridOn, PeopleAlt, Task } from '@mui/icons-material';
import iDashLogo from '../assets/IDashLogo.png';
import axios from 'axios';


const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const authUsername = import.meta.env.VITE_AUTH_USERNAME;
const authPassword = import.meta.env.VITE_AUTH_PASSWORD;
const authHeader = 'Basic ' + btoa(`${authUsername}:${authPassword}`);

const SideBar = () => {
  const { theme } = useTheme(); // Use theme from context
  const [latestVersion, setLatestVersion] = useState(''); // State to store the latest version

  const sidebarBgColor = theme === 'light' ? '#DBEDFF' : '#1F2937'; // Light or dark background
  const navItemBgColor = theme === 'light' ? '#D9D0D0' : '#2D3748'; // Light or dark background for active item
  const navItemTextColor = theme === 'light' ? '#000000' : '#FFFFFF'; // Light or dark text color

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}update`, {
          headers: {
            Authorization: authHeader,
          },
        });

        const updates = response.data;
        if (updates.length > 0) {
          const latest = updates.reduce((max, update) =>
            update.acf.version > max.acf.version ? update : max
          );
          setLatestVersion(latest.acf.version);
        }
      } catch (error) {
        console.error('Error fetching updates:', error);
        setLatestVersion('Error');
      }
    };

    fetchUpdates();
  }, []);

  return (
    <div className={`flex flex-col h-full p-4`} style={{ backgroundColor: sidebarBgColor }}>
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <NavLink to="/">
          <img src={iDashLogo} alt="Logo" className="w-40 h-50 cursor-pointer" />
        </NavLink>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col text-[17px] font-semibold space-y-7 flex-grow">
        <NavItem icon={<Dashboard />} label="Dashboard" path="/" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} />
        <NavItem icon={<Announcement />} label="Announcement" path="/announcement" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} />
        <NavItem icon={<GridOn />} label="Timesheet" path="/timesheet" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} />
        <NavItem icon={<Task />} label="Task Deliverables" path="/taskdeliverables" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} />
        <NavItem icon={<Folder />} label="Files" path="/files" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} />
        <NavItem icon={<PeopleAlt />} label="Team Task" path="/teamtask" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} />
      </nav>

      {/* Settings Link */}
      <div className="flex justify-center mt-auto text-center">
        <NavLink
          to="/settings?selectedSection=updates"
          className={`text-md text-gray-600 font-medium ${navItemTextColor} hover:text-blue-500`}
        >
          {`version ${latestVersion}`}
        </NavLink>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, path, navItemBgColor, navItemTextColor }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `flex items-center p-2 rounded cursor-pointer ${isActive ? `bg-${navItemBgColor}` : ''}`
    }
    style={{ color: navItemTextColor }}
  >
    <span className="text-xl mr-2">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default SideBar;
