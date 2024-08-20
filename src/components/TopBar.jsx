import React, { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Menu, MenuItem, IconButton, ListItemIcon, Divider } from '@mui/material';
import { Logout, Person, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FullName from '../components/FullName';
import TimeRendered from './TimeRendered';
import { useTimesheets } from '../context/TimesheetContext';

const TopBar = () => {
    const { timesheets } = useTimesheets();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationEl, setNotificationEl] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const [username, setUsername] = useState('');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}users/me`, {
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_AUTH_USERNAME}:${import.meta.env.VITE_AUTH_PASSWORD}`),
                    },
                });
                const userName = response.data.name;
                const avatarUrl = response.data.avatar_urls['96'];
                setUsername(userName);
                setProfilePicUrl(avatarUrl);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchRules = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}rule`, {
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_AUTH_USERNAME}:${import.meta.env.VITE_AUTH_PASSWORD}`),
                    },
                });

                const newRules = response.data.map(rule => ({
                    id: `rule-${rule.id}`,
                    description: `New rule: ${rule.title.rendered}`,
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString(),
                }));

                setNotifications(prevNotifications => {
                    const newNotifications = [...prevNotifications];
                    newRules.forEach(rule => {
                        if (!newNotifications.some(notif => notif.id === rule.id)) {
                            newNotifications.push(rule);
                        }
                    });
                    return newNotifications;
                });
            } catch (error) {
                console.error('Error fetching rules:', error);
            }
        };

        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}announcement`, {
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${import.meta.env.VITE_AUTH_USERNAME}:${import.meta.env.VITE_AUTH_PASSWORD}`),
                    },
                });

                const newAnnouncements = response.data.map(announcement => ({
                    id: `announcement-${announcement.id}`,
                    description: `New announcement: ${announcement.title.rendered}`,
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString(),
                }));

                setNotifications(prevNotifications => {
                    const newNotifications = [...prevNotifications];
                    newAnnouncements.forEach(announcement => {
                        if (!newNotifications.some(notif => notif.id === announcement.id)) {
                            newNotifications.push(announcement);
                        }
                    });
                    return newNotifications;
                });
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };

        fetchUserData();
        fetchRules();
        fetchAnnouncements();
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
                                width: '300px',
                                maxHeight: '400px',
                                overflow: 'auto',
                                padding: '10px',
                            },
                        }}
                    >
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <MenuItem
                                    key={notification.id}
                                    onClick={() => {
                                        handleNotificationClose();
                                        window.location.href = '/announcement';
                                    }}
                                >

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
                    <FullName name={username} />
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
                                width: '200px',
                                padding: '10px',
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
