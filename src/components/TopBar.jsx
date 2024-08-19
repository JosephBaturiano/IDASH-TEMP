import React, { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Menu, MenuItem, IconButton, ListItemIcon } from '@mui/material';
import { Logout, Person, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const TopBar = ({ userName, userImage }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const initials = "APC"; // Replace with dynamic initials if necessary
    const profileUrl = "#"; // Replace with profile URL

    // Placeholder for OJT time
    const ojtTime = "00:00:00"; // Replace this with dynamic content as needed

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="bg-white text-gray-900 py-4 px-6 flex items-center justify-between shadow-md">
            {/* Move Welcome Intern to the left */}
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
                    <span className="text-xl font-semibold">{initials}</span>
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
