import React, { useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Menu, MenuItem, IconButton, ListItemIcon, Typography, Divider } from '@mui/material';
import { Logout, Person, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Initials from '../components/Initials'; // Adjust the import path accordingly

const TopBar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationEl, setNotificationEl] = useState(null);
    const [username, setUsername] = useState('');
    const [ojtTime, setOjtTime] = useState('00:00:00'); // Placeholder for OJT time
    const [notifications, setNotifications] = useState([
        { id: 1, description: 'New task assigned', date: '2024-08-18', time: '09:00 AM' },
        { id: 2, description: 'Meeting at 3 PM', date: '2024-08-18', time: '12:00 PM' },
        { id: 3, description: 'Project deadline extended', date: '2024-08-17', time: '05:00 PM' },
        // Add more notifications here
    ]);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('https://jbm-acf.local/wp-json/wp/v2/users/me', {
                    headers: {
                        'Authorization': 'Basic ' + btoa('cjo:K4zX bNiA xj1f 6ktu bEng YZq3'),
                    },
                });
                const userName = response.data.name;
                setUsername(userName);
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
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-600">Time Rendered</span>
                        <span className="text-lg font-medium">{ojtTime}</span>
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
                        <Typography variant="h6" className="px-2">Notifications</Typography>
                        <Divider />
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <MenuItem key={notification.id} onClick={handleNotificationClose}>
                                    <div className="flex flex-col">
                                        <Typography variant="body2">{notification.description}</Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {notification.date} - {notification.time}
                                        </Typography>
                                    </div>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem>
                                <Typography variant="body2">No new notifications</Typography>
                            </MenuItem>
                        )}
                    </Menu>
                </div>
                <div className="flex items-center space-x-4">
                    <Initials initials={username} className="text-xl font-semibold" />
                    <IconButton onClick={handleProfileClick} className="p-0">
                        <AccountCircleIcon className="w-12 h-12 text-gray-900 cursor-pointer transition-transform duration-300 hover:scale-110" />
                    </IconButton>
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
