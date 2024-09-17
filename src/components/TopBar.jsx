import React, { useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Menu, MenuItem, IconButton, ListItemIcon } from '@mui/material';
import { Logout, Person, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import FullName from '../components/FullName';
import TimeRendered from './TimeRendered';
import { useTimesheets } from '../context/TimesheetContext';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import { format } from 'date-fns';

const TopBar = () => {
  const { timesheets, selectedIntern } = useTimesheets(); // Get selectedIntern from TimesheetContext
  const {
    user = {},
    profileImageUrl = '',
    notifications = [],
    unreadCount = 0,
    markAllAsRead = () => { },
    notificationsEnabled,
  } = useNotification();
  const { theme } = useTheme(); // Use theme from context

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationEl, setNotificationEl] = useState(null);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleNotificationClick = (event) => {
    setNotificationEl(event.currentTarget);
    markAllAsRead(); // Mark all notifications as read when the menu is opened
  };

  const handleProfileClose = () => setAnchorEl(null);
  const handleNotificationClose = () => setNotificationEl(null);

  return (
    <div className={`bg-${theme === 'light' ? 'white' : 'gray-800'} text-${theme === 'light' ? 'gray-900' : 'white'} py-4 px-6 flex items-center justify-between shadow-md`}>
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">Welcome Intern!</h1>
      </div>
      <div className="flex items-center space-x-6">
        {/* Time Rendered */}
        <div className="flex items-center space-x-4 bg-gray-200 p-2 rounded-lg shadow-md">
          <div className="flex flex-col font-bold text-center">
            <span className="text-xs font-bold text-gray-600 pb-1">Time Rendered</span>
            <TimeRendered timesheets={timesheets} currentUserId={selectedIntern} />
          </div>
        </div>

        {/* Notifications */}
        {notificationsEnabled && (
          <div className="relative">
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">{unreadCount}</span>
            )}
            <IconButton onClick={handleNotificationClick} className="p-0">
              <NotificationsIcon className={`w-8 h-8 text-${theme === 'light' ? 'gray-900' : 'white'} cursor-pointer transition-transform duration-300 hover:scale-110`} />
            </IconButton>
            <Menu
              anchorEl={notificationEl}
              open={Boolean(notificationEl)}
              onClose={handleNotificationClose}
              PaperProps={{
                style: {
                  width: '300px',
                  maxHeight: '400px',
                  overflow: 'auto',
                  padding: '10px',
                  backgroundColor: theme === 'light' ? 'white' : '#333',
                  color: theme === 'light' ? 'black' : 'white',
                },
              }}
            >
              {notifications.length > 0 ? (
                [...notifications].reverse().map(notification => {
                  const date = new Date(notification.date);
                  const formattedDate = format(date, 'MM/dd/yyyy');
                  const formattedTime = format(date, 'hh:mm a');
                  return (
                    <MenuItem key={notification.id} onClick={() => {
                      handleNotificationClose();
                      window.location.href = '/announcement';
                    }}>
                      <div className="flex flex-col">
                        <span>{notification.description}</span>
                        <span>{formattedDate} - {formattedTime}</span>
                      </div>
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem>
                  <span>No new notifications</span>
                </MenuItem>
              )}
            </Menu>
          </div>
        )}

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <FullName name={user?.name} />
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
              onClick={handleProfileClick}
            />
          ) : (
            <div
              className="w-12 h-12 flex items-center justify-center bg-gray-300 rounded-full cursor-pointer"
              onClick={handleProfileClick}
            >
              <span className="text-gray-800 text-xl">{user?.name?.charAt(0) || 'U'}</span>
            </div>
          )}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileClose}
            PaperProps={{
              style: {
                width: '200px',
                padding: '10px',
                backgroundColor: theme === 'light' ? 'white' : '#333',
                color: theme === 'light' ? 'black' : 'white',
              },
            }}
          >
            <MenuItem onClick={handleProfileClose} component={Link} to="/profile">
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleProfileClose} component={Link} to="/settings">
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleProfileClose}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>

          </Menu>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
