import React, { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Menu, MenuItem, IconButton, ListItemIcon, Divider } from '@mui/material';
import { Logout, Person, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FullName from '../components/FullName'; // Import the FullName component
import TimeRendered from './TimeRendered';
import { useTimesheets } from '../context/TimesheetContext'; // Adjust the import path

const TopBar = () => {
    const { timesheets } = useTimesheets();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationEl, setNotificationEl] = useState(null);
    const [username, setUsername] = useState('');
    const [notifications, setNotifications] = useState([
        { id: 1, description: 'New task assigned', date: '2024-08-18', time: '09:00 AM' },
        { id: 2, description: 'Meeting at 3 PM', date: '2024-08-18', time: '12:00 PM' },
        { id: 3, description: 'Project deadline extended', date: '2024-08-17', time: '05:00 PM' },
        // Add more notifications here
    ]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}users/me`, {
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_AUTH_USERNAME}:${import.meta.env.VITE_AUTH_PASSWORD}`),
                    },
                });
                const userName = response.data.name;
                const avatarUrl = response.data.avatar_urls['96']; // Choose the desired avatar size
                setUsername(userName);
                setProfilePicUrl(avatarUrl);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClick = (event) => {
        setNotificationEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClose = () => {
        setNotificationEl(null);
    };

    return (
        <div className="bg-white text-gray-900 py-4 px-6 flex items-center justify-between shadow-md">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold">Welcome Intern!</h1>
            </div>
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4 bg-gray-200 p-2 rounded-lg shadow-md">
                    <div className="flex flex-col font-bold text-center">
                        <span className="text-xs font-bold text-gray-600 pb-1">Time Rendered</span>
                        <TimeRendered timesheets={timesheets} />
                    </div>
                </div>
                <div className="indicator">
                    <span className="indicator-item badge bg-red-500 text-white">{notifications.length}</span>
                    <IconButton onClick={handleNotificationClick} className="p-0">
                        <NotificationsIcon className="w-8 h-8 text-gray-900 cursor-pointer transition-transform duration-300 hover:scale-110" />
                    </IconButton>
                    <Menu
                        anchorEl={notificationEl}
                        open={Boolean(notificationEl)}
                        onClose={handleNotificationClose}
                        PaperProps={{
                            style: {
                                width: '300px', // Adjust the width of the dropdown
                                maxHeight: '400px', // Adjust the max height of the dropdown
                                overflow: 'auto', // Enable scrolling for overflow
                                padding: '10px', // Adjust the padding inside the dropdown
                            },
                        }}
                    >
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <MenuItem key={notification.id} onClick={handleNotificationClose}>
                                    <div className="flex flex-col">
                                        <span>{notification.description}</span>
                                        <span>{notification.date} - {notification.time}</span>
                                    </div>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem>
                                <span>No new notifications</span>
                            </MenuItem>
                        )}
                    </Menu>
                </div>
                <div className="flex items-center space-x-4">
                    <FullName name={username} /> {/* Use the FullName component to display the username */}
                    {profilePicUrl ? (
                        <img
                            src={profilePicUrl}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover cursor-pointer"
                            onClick={handleProfileClick}
                        />
                    ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-300 rounded-full cursor-pointer" onClick={handleProfileClick}>
                            <span className="text-gray-800 text-xl">U</span>
                        </div>
                    )}

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleProfileClose}
                        PaperProps={{
                            style: {
                                width: '200px', // Adjust the width of the dropdown
                                padding: '10px', // Adjust the padding inside the dropdown
                            },
                        }}
                    >
                        <MenuItem onClick={handleProfileClose} component={Link} to="/profile">
                            <ListItemIcon>
                                <Person fontSize="small" />
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleProfileClose}>
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
