
import React, { useEffect, useState } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Menu, MenuItem, IconButton, ListItemIcon } from '@mui/material';
import { Logout, Person, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import axios from 'axios';
import Initials from '../components/Initials'; // Adjust the import path accordingly

const TopBar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [username, setUsername] = useState('');
    const [ojtTime, setOjtTime] = useState('00:00:00'); // Placeholder for OJT time



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

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
                <NotificationsIcon className="w-8 h-8 text-gray-900 cursor-pointer transition-transform duration-300 hover:scale-110" />
                <div className="flex items-center space-x-4">

                    <Initials initials={username} className="text-xl font-semibold" />

                    <IconButton onClick={handleClick} className="p-0">
                        <AccountCircleIcon className="w-12 h-12 text-gray-900 cursor-pointer transition-transform duration-300 hover:scale-110" />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        PaperProps={{
                            style: {
                                width: '200px', // Adjust the width of the dropdown
                                padding: '10px', // Adjust the padding inside the dropdown
                            },
                        }}
                    >
                        <MenuItem onClick={handleClose} component={Link} to="/profile">
                            <ListItemIcon>
                                <Person fontSize="small" />
                            </ListItemIcon>
                            Profile       
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Settings
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
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
