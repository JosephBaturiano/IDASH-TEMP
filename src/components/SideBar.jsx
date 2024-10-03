import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Announcement, Dashboard, Folder, GridOn, PeopleAlt, Task, Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import iDashLogo from '../assets/IDashLogo.png';
import iDashLogoMobile from '../assets/iDashLogoMobile.png';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const authUsername = import.meta.env.VITE_AUTH_USERNAME;
const authPassword = import.meta.env.VITE_AUTH_PASSWORD;
const authHeader = 'Basic ' + btoa(`${authUsername}:${authPassword}`);

const SideBar = () => {
  const { theme } = useTheme(); // Use theme from context
  const [latestVersion, setLatestVersion] = useState(''); // State to store the latest version
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control sidebar visibility

  const sidebarBgColor = theme === 'light' ? '#DBEDFF' : '#1F2937'; // Light or dark background
  const navItemBgColor = theme === 'light' ? '#D9D0D0' : '#2D3748'; // Light or dark background for active item
  const navItemTextColor = theme === 'light' ? '#000000' : '#FFFFFF'; // Light or dark text color
  const iconColor = theme === 'light' ? '#000000' : '#FFFFFF'; // Icon color for light or dark mode

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // Toggle sidebar visibility

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
    <div>
      {/* Hamburger Icon */}
      <div className="sm:hidden flex justify-end p-4">
        <button onClick={toggleMenu}>
          {isMenuOpen ? (
            <CloseIcon className="text-3xl" style={{ color: iconColor }} />
          ) : (
            <MenuIcon className="text-3xl" style={{ color: iconColor }} />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full p-4 z-40 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out sm:translate-x-0 md:w-20 lg:w-64`}
        style={{ backgroundColor: sidebarBgColor }}
      >
        {/* Close Icon (only for small screens) */}
        {isMenuOpen && (
          <div className="absolute top-4 right-4 sm:hidden">
            <button onClick={toggleMenu}>
              <CloseIcon className="text-3xl" style={{ color: iconColor }} />
            </button>
          </div>
        )}

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <NavLink to="/" onClick={toggleMenu}>
            <img
              src={iDashLogo}
              alt="Logo"
              className="hidden sm:block w-40 h-50 cursor-pointer"
            />
            <img
              src={iDashLogoMobile}
              alt="Mobile Logo"
              className="block sm:hidden w-20 h-25 cursor-pointer"
            />
          </NavLink>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col text-[17px] font-semibold space-y-7 flex-grow">
          <NavItem icon={<Dashboard />} label="Dashboard" path="/" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} isMenuOpen={isMenuOpen} />
          <NavItem icon={<Announcement />} label="Announcement" path="/announcement" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} isMenuOpen={isMenuOpen} />
          <NavItem icon={<GridOn />} label="Timesheet" path="/timesheet" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} isMenuOpen={isMenuOpen} />
          <NavItem icon={<Task />} label="Task Deliverables" path="/taskdeliverables" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} isMenuOpen={isMenuOpen} />
          <NavItem icon={<Folder />} label="Files" path="/files" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} isMenuOpen={isMenuOpen} />
          <NavItem icon={<PeopleAlt />} label="Team Task" path="/teamtask" navItemBgColor={navItemBgColor} navItemTextColor={navItemTextColor} isMenuOpen={isMenuOpen} />
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
    </div>
  );
};

const NavItem = ({ icon, label, path, navItemBgColor, navItemTextColor, isMenuOpen }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `flex items-center p-2 rounded hover:bg-[#D9D0D0] cursor-pointer ${isActive ? `bg-[${navItemBgColor}]` : ''}`
    }
    style={{ color: navItemTextColor }}
  >
    <span className="text-xl mr-2">{icon}</span>
    <span className={`${isMenuOpen ? 'inline' : 'hidden'} sm:inline md:inline text-[10px] md:text-[10px] lg:text-base xl:text-lg 2xl:text-xl`}>{label}</span>
  </NavLink>
);

export default SideBar;